// Yedekten geri yükleme, yedek hatırlatması ve güvenlik başlıkları (docs/DECISIONS/0027-yedekten-geri-yukleme.md).

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { BACKUP_REMINDER_DAYS, DEFAULT_PREFERENCES, STORAGE_KEYS, type DeletedAquariumEntry, type Preferences } from "@aquamind/domain";
import { privacyMessagesFor } from "@aquamind/localization/privacy";
import {
  buildLocalExport,
  clearStorageIssues,
  daysSinceBackup,
  endStorageSuspension,
  getStorageIssues,
  hasPendingJournal,
  hasUserData,
  isStorageSuspended,
  loadBackupStatus,
  persistCollection,
  recordBackupExport,
  recoverPendingJournal,
  restoreFromBackup,
  shouldRemindBackup,
  snoozeBackupReminder,
  type AquariumDataSnapshot,
} from "@/lib/aquarium-storage";
import { MAX_BACKUP_BYTES, parseBackup } from "@/lib/backup-restore";
import { contentSecurityPolicy, securityHeaders } from "@/lib/security-headers";
import type { Aquarium, Livestock, WaterParameters } from "@/types/aquarium";
import { FakeLocalStorage, installFakeLocalStorage, removeFakeLocalStorage } from "./fake-local-storage";

let storage: FakeLocalStorage;

beforeEach(() => {
  storage = installFakeLocalStorage();
  clearStorageIssues();
});

afterEach(() => {
  while (isStorageSuspended()) endStorageSuspension();
  removeFakeLocalStorage();
  clearStorageIssues();
});

// --- Fikstürler ------------------------------------------------------------

// Bilinmeyen ek alan (`note`) geri yüklemede kaybolmamalı.
const aquarium = { id: "aq-a", name: "Amazon", type: "freshwater", lengthCm: 100, widthCm: 45, heightCm: 50, netVolumeLiters: 180, setupDate: "2026-03-12", note: "ek alan" } as Aquarium;
const reading: WaterParameters = { id: "w-a", aquariumId: "aq-a", measuredAt: "2026-08-17T09:30:00.000Z", ph: 6.8 };
const fish: Livestock = { id: "l-a", aquariumId: "aq-a", commonName: "Neon tetra", category: "fish", quantity: 8, addedAt: "2026-03-28" };
const orphanFish: Livestock = { ...fish, id: "l-orphan", aquariumId: "aq-yok" };
const preferences: Preferences = { ...DEFAULT_PREFERENCES, temperature: "fahrenheit" };

const otherAquarium: Aquarium = { id: "aq-z", name: "Başka", type: "freshwater", lengthCm: 60, widthCm: 30, heightCm: 35, netVolumeLiters: 54, setupDate: "2026-01-01" };

const trashEntry = (id: string, deletedAt: string): DeletedAquariumEntry => ({
  aquarium: { ...otherAquarium, id },
  children: { waterReadings: [], maintenanceTasks: [], livestock: [], plants: [], equipment: [] },
  deletedAt,
  purgeAfter: "2099-01-01T00:00:00.000Z",
});

const backupSnapshot: AquariumDataSnapshot = {
  aquariums: [aquarium],
  waterReadings: [reading],
  maintenanceTasks: [],
  livestock: [fish, orphanFish],
  plants: [],
  equipment: [],
};

/** Ayarlar sayfasının ürettiği yedek dosyasının metni. */
function backupText(extra: { trash?: DeletedAquariumEntry[]; quarantine?: { key: string; raw: string }[] } = {}): string {
  if (extra.trash) storage.seedJson(STORAGE_KEYS.deletedAquariums, extra.trash);
  for (const entry of extra.quarantine ?? []) storage.seedRaw(entry.key, entry.raw);
  const text = JSON.stringify(buildLocalExport(backupSnapshot, preferences, new Date("2026-10-20T10:00:00.000Z")));
  storage.clear();
  return text;
}

function seedDevice(): void {
  storage.seedJson(STORAGE_KEYS.aquariums, [otherAquarium]);
  storage.seedJson(STORAGE_KEYS.waterReadings, []);
  storage.seedJson(STORAGE_KEYS.livestock, [{ ...fish, id: "l-z", aquariumId: "aq-z" }]);
  storage.seedJson(STORAGE_KEYS.preferences, DEFAULT_PREFERENCES);
}

function parsedPayload(text: string) {
  const result = parseBackup(text);
  if (!result.ok) throw new Error(`yedek okunamadı: ${result.reason}`);
  return result;
}

// --- Dosyayı okuma ---------------------------------------------------------

describe("yedek dosyası okunur ve doğrulanır, depoya yazılmaz", () => {
  it("JSON olmayan, AquaMind yedeği olmayan, daha yeni ve bozuk kayıtlı dosyayı ayrı nedenlerle reddeder", () => {
    expect(parseBackup("{bozuk")).toEqual({ ok: false, reason: "not-json" });
    expect(parseBackup(JSON.stringify([1, 2]))).toEqual({ ok: false, reason: "not-backup" });
    expect(parseBackup(JSON.stringify({ hello: "world" }))).toEqual({ ok: false, reason: "not-backup" });
    expect(parseBackup(JSON.stringify({ exportedAt: "2026-10-20T10:00:00.000Z", version: 2 }))).toEqual({ ok: false, reason: "newer-version" });
    const broken = JSON.parse(backupText());
    broken[STORAGE_KEYS.livestock] = [{ id: "bozuk", quantity: "sekiz" }];
    expect(parseBackup(JSON.stringify(broken))).toEqual({ ok: false, reason: "invalid" });
    expect(parseBackup(" ".repeat(MAX_BACKUP_BYTES + 1))).toEqual({ ok: false, reason: "too-large" });
    expect(storage.keys()).toEqual([]);
  });

  it("yetim kayıtları koleksiyonuna geri koyar ve özeti sayar", () => {
    const { summary, payload } = parsedPayload(backupText());
    expect(summary.exportedAt).toBe("2026-10-20T10:00:00.000Z");
    expect(summary.counts).toEqual({ aquariums: 1, waterReadings: 1, maintenanceTasks: 0, livestock: 2, plants: 0, equipment: 0 });
    expect(payload.collections.livestock).toEqual([fish, orphanFish]);
    expect(payload.preferences).toEqual(preferences);
  });
});

// --- Geri yükleme ----------------------------------------------------------

describe("geri yükleme cihazdaki veriyi yedektekiyle değiştirir", () => {
  it("dışa aktarılan her kaydı, ek alanlarıyla birlikte geri getirir; günlük kalmaz", () => {
    const { payload } = parsedPayload(backupText());
    seedDevice();

    expect(restoreFromBackup(payload)).toEqual({ status: "completed" });

    expect(storage.json(STORAGE_KEYS.aquariums)).toEqual([aquarium]);
    expect(storage.json<Aquarium[]>(STORAGE_KEYS.aquariums)?.[0]).toHaveProperty("note", "ek alan");
    expect(storage.json(STORAGE_KEYS.waterReadings)).toEqual([reading]);
    expect(storage.json(STORAGE_KEYS.livestock)).toEqual([fish, orphanFish]);
    expect(storage.json(STORAGE_KEYS.maintenance)).toEqual([]);
    expect(storage.json(STORAGE_KEYS.preferences)).toEqual(preferences);
    expect(hasPendingJournal()).toBe(false);
  });

  it("yedekte tercih yoksa tercih anahtarını kaldırır (varsayılanlar kullanılır)", () => {
    const backup = JSON.parse(backupText());
    delete backup[STORAGE_KEYS.preferences];
    seedDevice();

    expect(restoreFromBackup(parsedPayload(JSON.stringify(backup)).payload).status).toBe("completed");
    expect(storage.raw(STORAGE_KEYS.preferences)).toBeNull();
  });

  it("silinen akvaryum arşivini değiştirmez, birleştirir; cihazdaki karantina kayıtlarını korur", () => {
    const shared = trashEntry("aq-shared", "2026-10-01T00:00:00.000Z");
    const fromBackup = trashEntry("aq-backup", "2026-10-02T00:00:00.000Z");
    const onDevice = trashEntry("aq-device", "2026-10-03T00:00:00.000Z");
    const backupQuarantine = { key: `${STORAGE_KEYS.plants}:corrupt:2026-10-05T00:00:00.000Z`, raw: "{yedekteki" };
    const deviceQuarantine = { key: `${STORAGE_KEYS.aquariums}:corrupt:2026-10-06T00:00:00.000Z`, raw: "{cihazdaki" };
    const { payload } = parsedPayload(backupText({ trash: [shared, fromBackup], quarantine: [backupQuarantine] }));
    seedDevice();
    storage.seedJson(STORAGE_KEYS.deletedAquariums, [onDevice, shared]);
    storage.seedRaw(deviceQuarantine.key, deviceQuarantine.raw);

    expect(restoreFromBackup(payload).status).toBe("completed");

    expect(storage.json(STORAGE_KEYS.deletedAquariums)).toEqual([onDevice, shared, fromBackup]);
    expect(storage.raw(deviceQuarantine.key)).toBe("{cihazdaki");
    expect(storage.raw(backupQuarantine.key)).toBe("{yedekteki");
  });

  it("yedekteki karantina kaydı cihazdaki aynı anahtarın üstüne yazılmaz; AquaMind dışı anahtar yazılmaz", () => {
    const key = `${STORAGE_KEYS.plants}:corrupt:2026-10-05T00:00:00.000Z`;
    const backup = JSON.parse(backupText());
    backup.quarantine = [{ key, raw: "{yedekteki" }, { key: "baska-site:veri", raw: "x" }, { key: STORAGE_KEYS.journal, raw: "x" }];
    const { payload } = parsedPayload(JSON.stringify(backup));
    seedDevice();
    storage.seedRaw(key, "{cihazdaki");

    expect(restoreFromBackup(payload).status).toBe("completed");
    expect(storage.raw(key)).toBe("{cihazdaki");
    expect(storage.raw("baska-site:veri")).toBeNull();
    expect(hasPendingJournal()).toBe(false);
  });

  it("günlük yazılamazsa (yer yok) hiçbir şey değişmez", () => {
    const { payload } = parsedPayload(backupText());
    seedDevice();
    const before = storage.keys().map((key) => [key, storage.raw(key)]);
    storage.failOnSet = (key) => (key === STORAGE_KEYS.journal ? new Error("QuotaExceededError") : undefined);

    expect(restoreFromBackup(payload)).toEqual({ status: "refused", reason: "journal-write-failed" });
    expect(storage.keys().map((key) => [key, storage.raw(key)])).toEqual(before);
  });

  it("tamamlanmamış başka bir işlem varken başlamaz", () => {
    const { payload } = parsedPayload(backupText());
    seedDevice();
    storage.seedRaw(STORAGE_KEYS.journal, "{}");

    expect(restoreFromBackup(payload)).toEqual({ status: "refused", reason: "journal-pending" });
    expect(storage.json(STORAGE_KEYS.aquariums)).toEqual([otherAquarium]);
  });

  it("yarıda kalırsa günlük durur, normal kaydetmeler yazamaz; sonraki açılışta tamamlanır", () => {
    const { payload } = parsedPayload(backupText());
    seedDevice();
    storage.failOnSet = (key) => (key === STORAGE_KEYS.livestock ? new Error("QuotaExceededError") : undefined);

    expect(restoreFromBackup(payload)).toEqual({ status: "incomplete" });
    expect(hasPendingJournal()).toBe(true);
    expect(getStorageIssues().some((issue) => issue.kind === "restore-incomplete")).toBe(true);
    expect(persistCollection("aquariums", [otherAquarium]).status).toBe("blocked-journal");

    storage.failOnSet = undefined;
    expect(recoverPendingJournal()).toEqual({ status: "restore-recovered" });
    expect(hasPendingJournal()).toBe(false);
    expect(storage.json(STORAGE_KEYS.aquariums)).toEqual([aquarium]);
    expect(storage.json(STORAGE_KEYS.livestock)).toEqual([fish, orphanFish]);
  });

  it("açılışta günlükteki izin verilmeyen anahtarlara dokunmaz", () => {
    storage.seedRaw("baska-site:veri", "korunmalı");
    storage.seedJson(STORAGE_KEYS.journal, {
      op: "restore-backup",
      startedAt: "2026-10-29T00:00:00.000Z",
      writes: [{ key: "baska-site:veri", value: null }, { key: STORAGE_KEYS.aquariums, value: JSON.stringify([aquarium]) }],
    });

    expect(recoverPendingJournal()).toEqual({ status: "restore-recovered" });
    expect(storage.raw("baska-site:veri")).toBe("korunmalı");
    expect(storage.json(STORAGE_KEYS.aquariums)).toEqual([aquarium]);
  });
});

// --- Yer yetmezliği ve yazıya dökülemeyen içerik (Codex 1. tur) ----------

describe("geri yükleme yer yetmezse başlamadan reddedilir, yarıda takılı kalmaz", () => {
  /** Büyük bir koleksiyonu olan yedek: ekipman satırları depoda yer kaplasın diye uzun not taşır. */
  function bigBackup(rows: number): string {
    const equipment = Array.from({ length: rows }, (_, index) => ({ id: `e-${index}`, aquariumId: "aq-a", category: "filter", installedAt: "2026-03-12", note: "x".repeat(200) }));
    const backup = JSON.parse(backupText());
    backup[STORAGE_KEYS.equipment] = equipment;
    return JSON.stringify(backup);
  }

  it("günlük sığıyor ama en büyük değeri bir kez daha yazacak yer yoksa: reddedilir, hiçbir şey değişmez", () => {
    const { payload } = parsedPayload(bigBackup(200));
    // Günlüğün gerçek boyunu öğrenmek için önce bol yerle bir kez çalıştır.
    seedDevice();
    restoreFromBackup(payload);
    const journalLength = storage.setItemCalls.find((call) => call.key === STORAGE_KEYS.journal)?.value.length ?? 0;
    const largest = JSON.stringify(payload.collections.equipment).length;
    storage.clear();
    seedDevice();
    const before = storage.keys().map((key) => [key, storage.raw(key)]);
    // Günlük sığar; en büyük değeri bir kez daha yazacak yer yoktur.
    storage.quota = storage.usage() + STORAGE_KEYS.journal.length + journalLength + Math.floor(largest / 2);

    expect(restoreFromBackup(payload)).toEqual({ status: "refused", reason: "not-enough-space" });
    expect(storage.keys().map((key) => [key, storage.raw(key)])).toEqual(before);
    expect(hasPendingJournal()).toBe(false);
  });

  it("uygulama sırasında depo, sınama anındaki doluluğu hiç aşmaz (iki büyük koleksiyon, cihazda büyük eski veri)", () => {
    const longRows = (prefix: string, count: number) => Array.from({ length: count }, (_, index) => ({ id: `${prefix}-${index}`, aquariumId: "aq-a", category: "filter", installedAt: "2026-03-12", note: "y".repeat(200) }));
    const backup = JSON.parse(backupText());
    backup[STORAGE_KEYS.equipment] = longRows("e", 150);
    backup[STORAGE_KEYS.waterReadings] = Array.from({ length: 150 }, (_, index) => ({ id: `w-${index}`, aquariumId: "aq-a", measuredAt: "2026-08-17T09:30:00.000Z", ph: 6.8, note: "z".repeat(200) }));
    const { payload } = parsedPayload(JSON.stringify(backup));
    seedDevice();
    storage.seedJson(STORAGE_KEYS.equipment, longRows("eski", 150));
    storage.quota = 10_000_000;

    expect(restoreFromBackup(payload)).toEqual({ status: "completed" });
    const probeIndex = storage.usageLog.findIndex((entry) => entry.key === "aquamind:restore-probe:v1");
    expect(probeIndex).toBe(0);
    const probeUsage = storage.usageLog[probeIndex].usage;
    const later = storage.usageLog.slice(probeIndex + 1).map((entry) => entry.usage);
    expect(later.length).toBeGreaterThan(5);
    expect(Math.max(...later)).toBeLessThanOrEqual(probeUsage);
    const finalUsage = storage.usage();

    // Kota tam sınama anındaki doluluğa ayarlanınca da tamamlanır.
    storage.clear();
    storage.usageLog.length = 0;
    seedDevice();
    storage.seedJson(STORAGE_KEYS.equipment, longRows("eski", 150));
    storage.quota = probeUsage;
    expect(restoreFromBackup(payload)).toEqual({ status: "completed" });
    expect(storage.usage()).toBe(finalUsage);
    expect(storage.json(STORAGE_KEYS.equipment)).toHaveLength(150);
  });

  it("karakter ve bayt ölçüsünde en büyük değerler farklıysa ikisi ayrı sınanır; toplamı gerektiren gereksiz ret olmaz", () => {
    const backup = JSON.parse(backupText());
    backup[STORAGE_KEYS.equipment] = [{ id: "e-a", aquariumId: "aq-a", category: "filter", installedAt: "2026-03-12", note: "a".repeat(3000) }];
    backup[STORAGE_KEYS.livestock] = [{ ...fish, note: "水".repeat(2000) }];
    const { payload } = parsedPayload(JSON.stringify(backup));
    seedDevice();
    storage.quota = 10_000_000;
    expect(restoreFromBackup(payload)).toEqual({ status: "completed" });
    const probes = storage.usageLog.filter((entry) => entry.key === "aquamind:restore-probe:v1");
    expect(probes).toHaveLength(2);
    const needed = Math.max(...storage.usageLog.map((entry) => entry.usage));

    storage.clear();
    storage.usageLog.length = 0;
    seedDevice();
    storage.quota = needed;
    expect(restoreFromBackup(payload)).toEqual({ status: "completed" });
    expect(storage.json<{ note: string }[]>(STORAGE_KEYS.livestock)?.[0].note).toHaveLength(2000);
  });

  it("sınama yazıldıktan sonra kesilirse günlük yoktur; açılış geçici anahtarı siler, başka hiçbir şey değişmez", () => {
    seedDevice();
    const before = storage.keys().map((key) => [key, storage.raw(key)]);
    storage.seedRaw("aquamind:restore-probe:v1", "x".repeat(5000));

    expect(recoverPendingJournal()).toEqual({ status: "none" });
    expect(storage.raw("aquamind:restore-probe:v1")).toBeNull();
    expect(storage.keys().map((key) => [key, storage.raw(key)])).toEqual(before);
  });

  it("silinen akvaryum arşivi bozuksa geri yükleme hiçbir şey yazmadan reddedilir (karantina da açılmaz)", () => {
    const { payload } = parsedPayload(backupText());
    seedDevice();
    storage.seedRaw(STORAGE_KEYS.deletedAquariums, "{bozuk");
    const before = storage.keys().map((key) => [key, storage.raw(key)]);

    expect(restoreFromBackup(payload)).toEqual({ status: "refused", reason: "trash-unreadable" });
    expect(storage.keys().map((key) => [key, storage.raw(key)])).toEqual(before);
  });

  it("yazma sırasında kesilirse günlükte yalnız kalan yazmalar durur ve açılışta tamamlanır", () => {
    const { payload } = parsedPayload(backupText());
    seedDevice();
    let emptied = false;
    storage.failOnSet = (key) => {
      // Boşaltma adımı `[]` yazar; asıl yazma sırasında canlılar koleksiyonu bir kez başarısız olsun.
      if (key === STORAGE_KEYS.livestock && emptied) return new Error("kesinti");
      if (key === STORAGE_KEYS.livestock) emptied = true;
      return undefined;
    };

    expect(restoreFromBackup(payload)).toEqual({ status: "incomplete" });
    const journal = storage.json<{ writes: { key: string }[] }>(STORAGE_KEYS.journal);
    expect(journal?.writes[0].key).toBe(STORAGE_KEYS.livestock);
    expect(journal?.writes.map((write) => write.key)).not.toContain(STORAGE_KEYS.aquariums);
    expect(storage.json(STORAGE_KEYS.aquariums)).toEqual([aquarium]);

    storage.failOnSet = undefined;
    expect(recoverPendingJournal()).toEqual({ status: "restore-recovered" });
    expect(storage.json(STORAGE_KEYS.livestock)).toEqual([fish, orphanFish]);
    expect(storage.json(STORAGE_KEYS.waterReadings)).toEqual([reading]);
  });

  it("şemadan geçen ama yazıya dökülemeyen (aşırı iç içe) yedek reddedilir; doğrudan çağrıda da depo değişmez", () => {
    let nested: unknown = [];
    for (let depth = 0; depth < 100_000; depth += 1) nested = [nested];
    const backup = JSON.parse(backupText());
    const text = JSON.stringify(backup).replace('"note":"ek alan"', `"note":${"[".repeat(100_000)}${"]".repeat(100_000)}`);
    expect(parseBackup(text)).toEqual({ ok: false, reason: "invalid" });

    const { payload } = parsedPayload(backupText());
    payload.collections.aquariums = [{ ...aquarium, note: nested }];
    seedDevice();
    const before = storage.keys().map((key) => [key, storage.raw(key)]);
    expect(restoreFromBackup(payload)).toEqual({ status: "refused", reason: "unserializable" });
    expect(storage.keys().map((key) => [key, storage.raw(key)])).toEqual(before);
  });

  it("karantina anahtarı yalnız bilinen bir anahtar ve gerçek bir zaman damgası taşıyorsa geri gelir", () => {
    const backup = JSON.parse(backupText());
    const valid = `${STORAGE_KEYS.plants}:corrupt:2026-10-05T00:00:00.000Z`;
    backup.quarantine = [
      { key: valid, raw: "{a" },
      { key: `${STORAGE_KEYS.plants}:corrupt:sahte`, raw: "{b" },
      { key: "aquamind:uydurma:v1:corrupt:2026-10-05T00:00:00.000Z", raw: "{c" },
    ];
    const { payload } = parsedPayload(JSON.stringify(backup));

    expect(restoreFromBackup(payload).status).toBe("completed");
    expect(storage.raw(valid)).toBe("{a");
    expect(storage.keys().filter((key) => key.includes(":corrupt:"))).toEqual([valid]);
  });
});

// --- Yedek hatırlatması ----------------------------------------------------

describe("yedek hatırlatması", () => {
  const now = new Date("2026-10-29T12:00:00.000Z");
  const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

  it("kalıcı kullanıcı verisi yoksa gösterilmez; varsa ve hiç yedek yoksa gösterilir", () => {
    expect(shouldRemindBackup(false, {}, now)).toBe(false);
    expect(shouldRemindBackup(true, {}, now)).toBe(true);
    expect(hasUserData({ aquariums: [], waterReadings: [], maintenanceTasks: [], livestock: [], plants: [], equipment: [] })).toBe(false);
    expect(hasUserData(backupSnapshot)).toBe(true);
  });

  it(`son yedekten ${BACKUP_REMINDER_DAYS} gün geçince gösterilir`, () => {
    expect(shouldRemindBackup(true, { lastExportAt: daysAgo(BACKUP_REMINDER_DAYS - 1) }, now)).toBe(false);
    expect(shouldRemindBackup(true, { lastExportAt: daysAgo(BACKUP_REMINDER_DAYS) }, now)).toBe(true);
    expect(daysSinceBackup({ lastExportAt: daysAgo(10) }, now)).toBe(10);
    expect(daysSinceBackup({}, now)).toBeUndefined();
  });

  it("\"Sonra hatırlat\" süre dolana kadar gizler; yedek alınınca erteleme kalkar", () => {
    expect(snoozeBackupReminder(now)).toBe(true);
    expect(shouldRemindBackup(true, loadBackupStatus(), now)).toBe(false);
    expect(shouldRemindBackup(true, loadBackupStatus(), new Date(now.getTime() + BACKUP_REMINDER_DAYS * 24 * 60 * 60 * 1000))).toBe(true);

    expect(recordBackupExport(now)).toBe(true);
    expect(loadBackupStatus()).toEqual({ lastExportAt: now.toISOString() });
  });

  it("okunamayan durum kaydı boş sayılır; yedek durumu yedeğe girmez", () => {
    storage.seedRaw(STORAGE_KEYS.backupStatus, "{bozuk");
    expect(loadBackupStatus()).toEqual({});
    recordBackupExport(now);
    expect(Object.keys(buildLocalExport(backupSnapshot, preferences, now))).not.toContain(STORAGE_KEYS.backupStatus);
  });
});

// --- Güvenlik başlıkları ve gizlilik metni ---------------------------------

describe("güvenlik başlıkları", () => {
  it("üretimde dış kaynağa izin vermez, çerçeveye alınmayı engeller, eval açmaz", () => {
    const policy = contentSecurityPolicy({ development: false, vercelPreview: false });
    expect(policy).toContain("default-src 'self'");
    expect(policy).toContain("frame-ancestors 'none'");
    expect(policy).toContain("object-src 'none'");
    expect(policy).not.toContain("unsafe-eval");
    expect(policy).not.toContain("vercel.live");
    const names = securityHeaders({ development: false, vercelPreview: false }).map((header) => header.key);
    expect(names).toEqual(expect.arrayContaining(["Content-Security-Policy", "X-Content-Type-Options", "X-Frame-Options", "Referrer-Policy", "Permissions-Policy"]));
  });

  it("Vercel araç çubuğu adreslerini yalnız önizlemede, eval'i yalnız geliştirmede ekler", () => {
    expect(contentSecurityPolicy({ development: false, vercelPreview: true })).toContain("https://vercel.live");
    expect(contentSecurityPolicy({ development: true, vercelPreview: false })).toContain("'unsafe-eval'");
  });
});

describe("gizlilik metni", () => {
  it("belirlenmemiş bilgi tahminle doldurulmaz, \"belirlenmedi\" diye açıkça yazılır", () => {
    const privacy = privacyMessagesFor("tr");
    for (const section of privacy.sections) {
      if (section.pending) expect(section.pending).toContain("belirlenmedi");
      expect(section.title.trim()).not.toBe("");
      expect(section.paragraphs.length).toBeGreaterThan(0);
    }
    expect(privacy.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
