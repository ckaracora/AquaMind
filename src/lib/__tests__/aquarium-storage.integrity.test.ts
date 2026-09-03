// Issue #8 — veri bütünlüğü davranışları:
// bozuk veri + karantina, tercihler, kaydetme askısı, aktif günlük koruması,
// günlüklü silme, kesinti/kota senaryoları, toparlama, yetim kayıt ve dışa aktarma.

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { DEFAULT_PREFERENCES, STORAGE_KEYS, type DeletedAquariumEntry, type Preferences } from "@aquamind/domain";
import {
  beginStorageSuspension,
  buildLocalExport,
  checkMutationGate,
  clearStorageIssues,
  countOrphans,
  deleteAquariumWithJournal,
  endStorageSuspension,
  findOrphans,
  getStorageIssues,
  hasPendingJournal,
  isStorageSuspended,
  loadAquariums,
  loadDeletedAquariums,
  loadLivestock,
  loadPreferences,
  loadWaterReadings,
  persistCollection,
  recoverPendingJournal,
  saveAquariums,
  saveLivestock,
  savePreferences,
  type AquariumDataSnapshot,
} from "@/lib/aquarium-storage";
import type { Aquarium, Equipment, Livestock, MaintenanceTask, Plant, WaterParameters } from "@/types/aquarium";
import { FakeLocalStorage, installFakeLocalStorage, removeFakeLocalStorage } from "./fake-local-storage";

let storage: FakeLocalStorage;

beforeEach(() => {
  storage = installFakeLocalStorage();
  clearStorageIssues();
});

afterEach(() => {
  // Askı sayacının testler arasında sızmasını engelle.
  while (isStorageSuspended()) endStorageSuspension();
  removeFakeLocalStorage();
  clearStorageIssues();
});

// --- Fikstürler ------------------------------------------------------------

const aquariumA: Aquarium = {
  id: "aq-a",
  name: "Amazon",
  type: "freshwater",
  lengthCm: 100,
  widthCm: 45,
  heightCm: 50,
  netVolumeLiters: 180,
  setupDate: "2026-03-12",
};

const aquariumB: Aquarium = { ...aquariumA, id: "aq-b", name: "Nano" };

const readingA: WaterParameters = { id: "w-a", aquariumId: "aq-a", measuredAt: "2026-08-17T09:30:00.000Z", ph: 6.8 };
const readingB: WaterParameters = { id: "w-b", aquariumId: "aq-b", measuredAt: "2026-08-17T09:30:00.000Z", ph: 7.1 };
const taskA: MaintenanceTask = { id: "m-a", aquariumId: "aq-a", type: "water_change", title: "Su değişimi", dueAt: "2026-08-19T18:00:00.000Z" };
const livestockA: Livestock = { id: "l-a", aquariumId: "aq-a", commonName: "Neon tetra", category: "fish", quantity: 8, addedAt: "2026-03-28" };
const plantA: Plant = { id: "p-a", aquariumId: "aq-a", name: "Anubias", quantity: 2, addedAt: "2026-03-12" };
const equipmentA: Equipment = { id: "e-a", aquariumId: "aq-a", category: "filter", installedAt: "2026-03-12" };

function seedFullStore(): AquariumDataSnapshot {
  const snapshot: AquariumDataSnapshot = {
    aquariums: [aquariumA, aquariumB],
    waterReadings: [readingA, readingB],
    maintenanceTasks: [taskA],
    livestock: [livestockA],
    plants: [plantA],
    equipment: [equipmentA],
  };
  storage.seedJson(STORAGE_KEYS.aquariums, snapshot.aquariums);
  storage.seedJson(STORAGE_KEYS.waterReadings, snapshot.waterReadings);
  storage.seedJson(STORAGE_KEYS.maintenance, snapshot.maintenanceTasks);
  storage.seedJson(STORAGE_KEYS.livestock, snapshot.livestock);
  storage.seedJson(STORAGE_KEYS.plants, snapshot.plants);
  storage.seedJson(STORAGE_KEYS.equipment, snapshot.equipment);
  return snapshot;
}

const quarantineKeysFor = (key: string): string[] => storage.keys().filter((k) => k.startsWith(`${key}:corrupt:`));

// --- A. Bozuk veri ve karantina --------------------------------------------

describe("bozuk veri karantinaya alınır, demo veriyle üzerine yazılmaz", () => {
  it("ayrıştırılamayan JSON: boş döner, ham değer karantinada, fallback YAZILMAZ", () => {
    storage.seedRaw(STORAGE_KEYS.aquariums, "{bozuk json");

    const result = loadAquariums([aquariumA]);

    expect(result).toEqual([]);
    const quarantined = quarantineKeysFor(STORAGE_KEYS.aquariums);
    expect(quarantined).toHaveLength(1);
    expect(storage.raw(quarantined[0])).toBe("{bozuk json");
    // Birincil anahtar demo veriyle değil, boş dizi ile onarıldı.
    expect(storage.json(STORAGE_KEYS.aquariums)).toEqual([]);
    expect(getStorageIssues().some((issue) => issue.kind === "invalid-json")).toBe(true);
  });

  it("kök dizi değilse aynı şekilde davranır", () => {
    storage.seedJson(STORAGE_KEYS.livestock, { hepsi: "yanlış" });

    expect(loadLivestock([livestockA])).toEqual([]);
    expect(quarantineKeysFor(STORAGE_KEYS.livestock)).toHaveLength(1);
    expect(getStorageIssues().some((issue) => issue.kind === "not-an-array")).toBe(true);
  });

  it("kısmen bozuk koleksiyonda geçerli kayıtlar korunur, ham değer karantinada kalır", () => {
    const raw = [livestockA, { id: "bozuk", quantity: "sekiz" }];
    storage.seedJson(STORAGE_KEYS.livestock, raw);

    const result = loadLivestock([]);

    expect(result).toEqual([livestockA]);
    const quarantined = quarantineKeysFor(STORAGE_KEYS.livestock);
    expect(quarantined).toHaveLength(1);
    expect(JSON.parse(storage.raw(quarantined[0]) as string)).toEqual(raw);
    expect(storage.json(STORAGE_KEYS.livestock)).toEqual([livestockA]);
    expect(getStorageIssues().find((issue) => issue.kind === "invalid-rows")?.droppedRows).toBe(1);
  });

  it("aynı bozuk değer için her açılışta yeni karantina anahtarı üretmez", () => {
    storage.seedRaw(STORAGE_KEYS.aquariums, "{bozuk json");

    loadAquariums([]);
    loadAquariums([]);
    loadAquariums([]);

    expect(quarantineKeysFor(STORAGE_KEYS.aquariums)).toHaveLength(1);
  });

  it("karantina yazılamazsa birincil anahtara dokunulmaz", () => {
    storage.seedRaw(STORAGE_KEYS.aquariums, "{bozuk json");
    storage.failOnSet = (key) => (key.includes(":corrupt:") ? new Error("QuotaExceededError") : undefined);

    expect(loadAquariums([])).toEqual([]);
    expect(storage.raw(STORAGE_KEYS.aquariums)).toBe("{bozuk json");
    expect(getStorageIssues().some((issue) => issue.kind === "quarantine-failed")).toBe(true);
  });
});

// --- B. Tercihler ----------------------------------------------------------

describe("tercihler", () => {
  it("geçerli tercihleri okur", () => {
    const prefs: Preferences = { ...DEFAULT_PREFERENCES, volume: "gallons" };
    storage.seedJson(STORAGE_KEYS.preferences, prefs);

    expect(loadPreferences()).toEqual(prefs);
  });

  it("bozuk tercihte varsayılanları BELLEKTE kullanır ve anahtara varsayılan YAZMAZ", () => {
    storage.seedRaw(STORAGE_KEYS.preferences, '{"volume":');

    expect(loadPreferences()).toEqual(DEFAULT_PREFERENCES);
    expect(quarantineKeysFor(STORAGE_KEYS.preferences)).toHaveLength(1);
    // Anahtar kaldırıldı; varsayılanlarla üzerine yazılmadı.
    expect(storage.raw(STORAGE_KEYS.preferences)).toBeNull();
    expect(storage.setItemCalls.some((call) => call.key === STORAGE_KEYS.preferences)).toBe(false);
  });

  it("şemaya uymayan tercih nesnesini de karantinaya alır", () => {
    storage.seedJson(STORAGE_KEYS.preferences, { temperature: "kelvin" });

    expect(loadPreferences()).toEqual(DEFAULT_PREFERENCES);
    expect(getStorageIssues().some((issue) => issue.kind === "invalid-object")).toBe(true);
  });

  it("kullanıcı açıkça kaydettiğinde yazar", () => {
    expect(savePreferences(DEFAULT_PREFERENCES)).toBe(true);
    expect(storage.json(STORAGE_KEYS.preferences)).toEqual(DEFAULT_PREFERENCES);
  });
});

// --- C. Kaydetme askısı ----------------------------------------------------

describe("kaydetme askısı", () => {
  it("askı açıkken hiçbir kaydetme yazamaz", () => {
    beginStorageSuspension();

    expect(saveAquariums([aquariumA])).toBe(false);
    expect(saveLivestock([livestockA])).toBe(false);
    expect(savePreferences(DEFAULT_PREFERENCES)).toBe(false);
    expect(storage.setItemCalls).toHaveLength(0);
    expect(storage.keys()).toHaveLength(0);
  });

  it("askı kalkınca normal kaydetme yeniden çalışır", () => {
    beginStorageSuspension();
    saveAquariums([aquariumA]);
    endStorageSuspension();

    expect(isStorageSuspended()).toBe(false);
    expect(saveAquariums([aquariumA])).toBe(true);
    expect(storage.json(STORAGE_KEYS.aquariums)).toEqual([aquariumA]);
  });

  it("iç içe askı sayacı doğru çalışır", () => {
    beginStorageSuspension();
    beginStorageSuspension();
    endStorageSuspension();
    expect(isStorageSuspended()).toBe(true);
    endStorageSuspension();
    expect(isStorageSuspended()).toBe(false);
  });
});

// --- D. Aktif günlük koruması ----------------------------------------------

describe("aktif günlük varken normal kaydetme fiziksel olarak yazamaz", () => {
  it("başka bir sekmenin bıraktığı günlük normal kaydetmeleri engeller", () => {
    const snapshot = seedFullStore();
    storage.seedRaw(STORAGE_KEYS.journal, JSON.stringify({ op: "delete-aquarium" }));
    storage.resetCalls();

    expect(hasPendingJournal()).toBe(true);
    expect(saveAquariums([aquariumA])).toBe(false);
    expect(saveLivestock([])).toBe(false);
    expect(savePreferences(DEFAULT_PREFERENCES)).toBe(false);
    expect(storage.setItemCalls).toHaveLength(0);
    // Aktif veri olduğu gibi duruyor.
    expect(storage.json(STORAGE_KEYS.aquariums)).toEqual(snapshot.aquariums);
    expect(storage.json(STORAGE_KEYS.livestock)).toEqual(snapshot.livestock);
  });

  it("günlük kalkınca kaydetme yeniden çalışır", () => {
    storage.seedRaw(STORAGE_KEYS.journal, "{}");
    expect(saveAquariums([aquariumA])).toBe(false);

    storage.removeItem(STORAGE_KEYS.journal);
    expect(saveAquariums([aquariumA])).toBe(true);
  });
});

// --- E. Günlüklü silme -----------------------------------------------------

describe("günlüklü akvaryum silme", () => {
  it("günlük → paket → koleksiyonlar sırasıyla yazar ve yetim kayıt bırakmaz", () => {
    const snapshot = seedFullStore();
    storage.resetCalls();

    const result = deleteAquariumWithJournal("aq-a", snapshot);

    expect(result.status).toBe("completed");
    if (result.status !== "completed") return;

    // Sıra: ilk yazma günlük, paket koleksiyonlardan önce.
    const written = storage.writtenKeys();
    expect(written[0]).toBe(STORAGE_KEYS.journal);
    const trashIndex = written.indexOf(STORAGE_KEYS.deletedAquariums);
    const firstCollection = Math.min(
      ...[STORAGE_KEYS.aquariums, STORAGE_KEYS.waterReadings, STORAGE_KEYS.livestock].map((key) => written.indexOf(key)),
    );
    expect(trashIndex).toBeGreaterThan(-1);
    expect(trashIndex).toBeLessThan(firstCollection);

    // Günlük temizlendi, aktif veride yetim kalmadı.
    expect(storage.raw(STORAGE_KEYS.journal)).toBeNull();
    expect(storage.json(STORAGE_KEYS.aquariums)).toEqual([aquariumB]);
    expect(storage.json(STORAGE_KEYS.waterReadings)).toEqual([readingB]);
    expect(storage.json(STORAGE_KEYS.maintenance)).toEqual([]);
    expect(storage.json(STORAGE_KEYS.livestock)).toEqual([]);
    expect(storage.json(STORAGE_KEYS.plants)).toEqual([]);
    expect(storage.json(STORAGE_KEYS.equipment)).toEqual([]);

    // Paket 30 günlük saklama süresiyle yazıldı.
    const entries = storage.json<DeletedAquariumEntry[]>(STORAGE_KEYS.deletedAquariums) ?? [];
    expect(entries).toHaveLength(1);
    expect(entries[0].aquarium).toEqual(aquariumA);
    expect(entries[0].children.livestock).toEqual([livestockA]);
    const days = (new Date(entries[0].purgeAfter).getTime() - new Date(entries[0].deletedAt).getTime()) / 86_400_000;
    expect(days).toBeCloseTo(30, 5);

    // Dönen anlık görüntü de temiz.
    expect(result.snapshot.aquariums).toEqual([aquariumB]);
    expect(countOrphans(findOrphans(result.snapshot))).toBe(0);
  });

  it("olmayan akvaryum için hiçbir şey yazmaz", () => {
    seedFullStore();
    storage.resetCalls();

    expect(deleteAquariumWithJournal("yok", { aquariums: [], waterReadings: [], maintenanceTasks: [], livestock: [], plants: [], equipment: [] }).status).toBe("not-found");
    expect(storage.setItemCalls).toHaveLength(0);
  });

  it("aktif günlük varken yeni silmeyi reddeder", () => {
    const snapshot = seedFullStore();
    storage.seedRaw(STORAGE_KEYS.journal, "{}");
    storage.resetCalls();

    const result = deleteAquariumWithJournal("aq-a", snapshot);

    expect(result).toEqual({ status: "refused", reason: "journal-pending" });
    expect(storage.setItemCalls).toHaveLength(0);
  });

  it("günlük yazılamazsa silme reddedilir ve HİÇBİR ŞEY değişmez", () => {
    const snapshot = seedFullStore();
    storage.failOnSet = (key) => (key === STORAGE_KEYS.journal ? new Error("QuotaExceededError") : undefined);

    const result = deleteAquariumWithJournal("aq-a", snapshot);

    expect(result).toEqual({ status: "refused", reason: "journal-write-failed" });
    expect(storage.raw(STORAGE_KEYS.journal)).toBeNull();
    expect(storage.json(STORAGE_KEYS.aquariums)).toEqual(snapshot.aquariums);
    expect(storage.json(STORAGE_KEYS.livestock)).toEqual(snapshot.livestock);
    expect(storage.raw(STORAGE_KEYS.deletedAquariums)).toBeNull();
  });
});

// --- F. Kesinti ve toparlama -----------------------------------------------

describe("kesinti ve açılışta toparlama", () => {
  it("koleksiyon adımında kesilirse veri kaybolmaz ve sonraki açılışta tamamlanır", () => {
    const snapshot = seedFullStore();
    // Canlılar adımında kesinti (tarayıcı kapanması / kota).
    storage.failOnSet = (key) => (key === STORAGE_KEYS.livestock ? new Error("QuotaExceededError") : undefined);

    const result = deleteAquariumWithJournal("aq-a", snapshot);
    expect(result.status).toBe("incomplete");

    // Günlük duruyor ve tam yükü taşıyor; paket yazılmış.
    expect(hasPendingJournal()).toBe(true);
    const entries = storage.json<DeletedAquariumEntry[]>(STORAGE_KEYS.deletedAquariums) ?? [];
    expect(entries[0].children.livestock).toEqual([livestockA]);
    // Canlılar hâlâ eski hâlinde: sessiz kayıp yok.
    expect(storage.json(STORAGE_KEYS.livestock)).toEqual([livestockA]);

    // Sonraki açılış: kesinti ortadan kalkar ve toparlama tamamlar.
    storage.failOnSet = undefined;
    const recovery = recoverPendingJournal();

    expect(recovery).toEqual({ status: "recovered", aquariumId: "aq-a" });
    expect(hasPendingJournal()).toBe(false);
    expect(storage.json(STORAGE_KEYS.aquariums)).toEqual([aquariumB]);
    expect(storage.json(STORAGE_KEYS.livestock)).toEqual([]);
    expect(storage.json(STORAGE_KEYS.plants)).toEqual([]);
    expect(storage.json(STORAGE_KEYS.equipment)).toEqual([]);
    expect(loadDeletedAquariums()).toHaveLength(1);
  });

  it("paket adımında kesilirse aktif koleksiyonlara dokunulmaz", () => {
    const snapshot = seedFullStore();
    storage.failOnSet = (key) => (key === STORAGE_KEYS.deletedAquariums ? new Error("QuotaExceededError") : undefined);

    expect(deleteAquariumWithJournal("aq-a", snapshot).status).toBe("incomplete");

    expect(storage.json(STORAGE_KEYS.aquariums)).toEqual(snapshot.aquariums);
    expect(storage.json(STORAGE_KEYS.livestock)).toEqual(snapshot.livestock);
    expect(hasPendingJournal()).toBe(true);

    storage.failOnSet = undefined;
    expect(recoverPendingJournal().status).toBe("recovered");
    expect(storage.json(STORAGE_KEYS.aquariums)).toEqual([aquariumB]);
    expect(loadDeletedAquariums()).toHaveLength(1);
  });

  it("toparlama yinelenebilir; ikinci ve üçüncü çalıştırma yan etkisizdir", () => {
    const snapshot = seedFullStore();
    storage.failOnSet = (key) => (key === STORAGE_KEYS.plants ? new Error("QuotaExceededError") : undefined);
    deleteAquariumWithJournal("aq-a", snapshot);
    storage.failOnSet = undefined;

    expect(recoverPendingJournal().status).toBe("recovered");
    const afterFirst = {
      aquariums: storage.json(STORAGE_KEYS.aquariums),
      trash: storage.json(STORAGE_KEYS.deletedAquariums),
    };

    expect(recoverPendingJournal()).toEqual({ status: "none" });
    expect(recoverPendingJournal()).toEqual({ status: "none" });
    expect(storage.json(STORAGE_KEYS.aquariums)).toEqual(afterFirst.aquariums);
    // Paket ikinci kez eklenmedi.
    expect(storage.json(STORAGE_KEYS.deletedAquariums)).toEqual(afterFirst.trash);
  });

  it("aynı akvaryum ikinci kez silinmeye çalışılırsa yan etki olmaz", () => {
    const snapshot = seedFullStore();
    const first = deleteAquariumWithJournal("aq-a", snapshot);
    expect(first.status).toBe("completed");
    if (first.status !== "completed") return;

    const second = deleteAquariumWithJournal("aq-a", first.snapshot);

    expect(second.status).toBe("not-found");
    expect(storage.json(STORAGE_KEYS.aquariums)).toEqual([aquariumB]);
    expect(loadDeletedAquariums()).toHaveLength(1);
  });
});

// --- G. Bozuk günlük -------------------------------------------------------

describe("bozuk günlük", () => {
  it("aktif veriyi değiştirmez, ham değeri karantinada korur ve otomatik toparlama yapmaz", () => {
    const snapshot = seedFullStore();
    storage.seedRaw(STORAGE_KEYS.journal, "{yarım günlük");

    const result = recoverPendingJournal();

    expect(result.status).toBe("quarantined");
    expect(storage.json(STORAGE_KEYS.aquariums)).toEqual(snapshot.aquariums);
    expect(storage.json(STORAGE_KEYS.livestock)).toEqual(snapshot.livestock);
    const quarantined = quarantineKeysFor(STORAGE_KEYS.journal);
    expect(quarantined).toHaveLength(1);
    expect(storage.raw(quarantined[0])).toBe("{yarım günlük");
    // Birincil günlük temizlendi: her açılışta yeniden karantinaya alınmaz.
    expect(storage.raw(STORAGE_KEYS.journal)).toBeNull();
    expect(recoverPendingJournal()).toEqual({ status: "none" });
    expect(getStorageIssues().some((issue) => issue.kind === "journal-quarantined")).toBe(true);
  });

  it("şemaya uymayan günlük de karantinaya alınır", () => {
    seedFullStore();
    storage.seedJson(STORAGE_KEYS.journal, { op: "başka-işlem" });

    expect(recoverPendingJournal().status).toBe("quarantined");
    expect(quarantineKeysFor(STORAGE_KEYS.journal)).toHaveLength(1);
  });

  it("karantina yazılamazsa ham günlük olduğu gibi bırakılır", () => {
    const snapshot = seedFullStore();
    storage.seedRaw(STORAGE_KEYS.journal, "{yarım günlük");
    storage.failOnSet = () => new Error("QuotaExceededError");

    expect(recoverPendingJournal()).toEqual({ status: "quarantined" });
    expect(storage.raw(STORAGE_KEYS.journal)).toBe("{yarım günlük");
    expect(storage.json(STORAGE_KEYS.aquariums)).toEqual(snapshot.aquariums);
  });

  it("günlük yokken toparlama hiçbir şey yapmaz", () => {
    seedFullStore();
    storage.resetCalls();

    expect(recoverPendingJournal()).toEqual({ status: "none" });
    expect(storage.setItemCalls).toHaveLength(0);
  });
});

// --- H. Silinen paketlerin saklanma süresi ---------------------------------

describe("silinen akvaryum paketleri 30 gün saklanır", () => {
  it("süresi dolanları temizler, dolmayanları korur", () => {
    const now = new Date("2026-09-03T00:00:00.000Z");
    const expired: DeletedAquariumEntry = {
      aquarium: aquariumA,
      children: { waterReadings: [], maintenanceTasks: [], livestock: [], plants: [], equipment: [] },
      deletedAt: "2026-07-01T00:00:00.000Z",
      purgeAfter: "2026-07-31T00:00:00.000Z",
    };
    const active: DeletedAquariumEntry = { ...expired, aquarium: aquariumB, purgeAfter: "2026-09-30T00:00:00.000Z" };
    storage.seedJson(STORAGE_KEYS.deletedAquariums, [expired, active]);

    const kept = loadDeletedAquariums(now);

    expect(kept).toHaveLength(1);
    expect(kept[0].aquarium.id).toBe("aq-b");
    expect(storage.json(STORAGE_KEYS.deletedAquariums)).toHaveLength(1);
  });
});

// --- I. Yetim kayıtlar ve dışa aktarma -------------------------------------

describe("yetim kayıtlar ve dışa aktarma", () => {
  const orphanReading: WaterParameters = { id: "w-orphan", aquariumId: "silinmis", measuredAt: "2026-08-01T00:00:00.000Z" };

  const snapshotWithOrphan: AquariumDataSnapshot = {
    aquariums: [aquariumA],
    waterReadings: [readingA, orphanReading],
    maintenanceTasks: [taskA],
    livestock: [livestockA],
    plants: [plantA],
    equipment: [equipmentA],
  };

  it("yetim kayıtları tespit eder ve saymaz gibi davranmaz", () => {
    const orphans = findOrphans(snapshotWithOrphan);

    expect(orphans.waterReadings).toEqual([orphanReading]);
    expect(countOrphans(orphans)).toBe(1);
  });

  it("dışa aktarmada ana koleksiyonlar yetim kayıt içermez; yetimler ayrı bölümde durur", () => {
    const data = buildLocalExport(snapshotWithOrphan, DEFAULT_PREFERENCES, new Date("2026-09-03T00:00:00.000Z"));

    expect(data[STORAGE_KEYS.waterReadings]).toEqual([readingA]);
    expect(data.orphans?.waterReadings).toEqual([orphanReading]);
    expect(data[STORAGE_KEYS.preferences]).toEqual(DEFAULT_PREFERENCES);
    expect(data.version).toBe(1);
  });

  it("karantina ve silinen paketler dışa aktarmada ayrı bölümlerde yer alır", () => {
    storage.seedRaw(`${STORAGE_KEYS.livestock}:corrupt:2026-09-01T00:00:00.000Z`, "{bozuk");
    storage.seedJson(STORAGE_KEYS.deletedAquariums, [
      {
        aquarium: aquariumB,
        children: { waterReadings: [], maintenanceTasks: [], livestock: [], plants: [], equipment: [] },
        deletedAt: "2026-09-01T00:00:00.000Z",
        purgeAfter: "2026-10-01T00:00:00.000Z",
      },
    ]);

    const data = buildLocalExport(snapshotWithOrphan, DEFAULT_PREFERENCES, new Date("2026-09-03T00:00:00.000Z"));

    expect(data.quarantine).toEqual([{ key: `${STORAGE_KEYS.livestock}:corrupt:2026-09-01T00:00:00.000Z`, raw: "{bozuk" }]);
    expect(data[STORAGE_KEYS.deletedAquariums]).toHaveLength(1);
  });

  it("temiz bir depoda ek bölümler oluşturmaz", () => {
    const clean: AquariumDataSnapshot = {
      aquariums: [aquariumA],
      waterReadings: [readingA],
      maintenanceTasks: [],
      livestock: [],
      plants: [],
      equipment: [],
    };

    const data = buildLocalExport(clean, DEFAULT_PREFERENCES);

    expect(data.orphans).toBeUndefined();
    expect(data.quarantine).toBeUndefined();
    expect(data[STORAGE_KEYS.deletedAquariums]).toBeUndefined();
  });
});

// --- J2. Karantina başarısızsa işlem durur (Codex bulgusu 2) ---------------

describe("karantina yazılamazsa bozuk veri asla ezilmez", () => {
  it("bozuk aktif koleksiyon + karantina kota hatası: silme yarım kalır, ham değer aynen durur", () => {
    const snapshot = seedFullStore();
    storage.seedRaw(STORAGE_KEYS.livestock, "{bozuk canlı listesi");
    // Karantina yazmaları başarısız; günlük ve diğer yazmalar normal.
    storage.failOnSet = (key) => (key.includes(":corrupt:") ? new Error("QuotaExceededError") : undefined);

    const result = deleteAquariumWithJournal("aq-a", snapshot);

    expect(result.status).toBe("incomplete");
    // Bozuk ham değer olduğu gibi duruyor: [] veya başka değerle ezilmedi.
    expect(storage.raw(STORAGE_KEYS.livestock)).toBe("{bozuk canlı listesi");
    expect(getStorageIssues().some((issue) => issue.kind === "quarantine-failed")).toBe(true);
    // Günlük duruyor; işlem sonraki açılışta yeniden denenebilir.
    expect(hasPendingJournal()).toBe(true);
  });

  it("bozuk deleted-aquariums arşivi + karantina kota hatası: arşiv aynen durur", () => {
    const snapshot = seedFullStore();
    storage.seedRaw(STORAGE_KEYS.deletedAquariums, "{bozuk arşiv");
    storage.failOnSet = (key) => (key.includes(":corrupt:") ? new Error("QuotaExceededError") : undefined);

    const result = deleteAquariumWithJournal("aq-a", snapshot);

    expect(result.status).toBe("incomplete");
    expect(storage.raw(STORAGE_KEYS.deletedAquariums)).toBe("{bozuk arşiv");
    // Arşiv adımı geçilemediği için koleksiyonlara da dokunulmadı.
    expect(storage.json(STORAGE_KEYS.aquariums)).toEqual(snapshot.aquariums);
    expect(storage.json(STORAGE_KEYS.livestock)).toEqual(snapshot.livestock);
  });

  it("arşivdeki şemaya uymayan satırlar karantina alınamadan silinmez", () => {
    seedFullStore();
    const validEntry: DeletedAquariumEntry = {
      aquarium: aquariumB,
      children: { waterReadings: [], maintenanceTasks: [], livestock: [], plants: [], equipment: [] },
      deletedAt: "2026-09-01T00:00:00.000Z",
      purgeAfter: "2026-10-01T00:00:00.000Z",
    };
    const rawArchive = [validEntry, { bozuk: "satır" }];
    storage.seedJson(STORAGE_KEYS.deletedAquariums, rawArchive);
    storage.failOnSet = (key) => (key.includes(":corrupt:") ? new Error("QuotaExceededError") : undefined);

    expect(loadDeletedAquariums(new Date("2026-09-03T00:00:00.000Z"))).toEqual([]);
    // Arşiv yeniden yazılmadı; şemaya uymayan satır da kaybolmadı.
    expect(storage.json(STORAGE_KEYS.deletedAquariums)).toEqual(rawArchive);
  });

  it("karantina başarılıysa silme ve toparlama veri kaybı olmadan tamamlanır", () => {
    const snapshot = seedFullStore();
    storage.seedRaw(STORAGE_KEYS.livestock, "{bozuk canlı listesi");

    const result = deleteAquariumWithJournal("aq-a", snapshot);

    expect(result.status).toBe("completed");
    // Bozuk ham değer karantinada korunuyor.
    const quarantined = quarantineKeysFor(STORAGE_KEYS.livestock);
    expect(quarantined).toHaveLength(1);
    expect(storage.raw(quarantined[0])).toBe("{bozuk canlı listesi");
    // Diğer koleksiyonlar beklenen şekilde temizlendi, günlük kapandı.
    expect(storage.json(STORAGE_KEYS.aquariums)).toEqual([aquariumB]);
    expect(storage.json(STORAGE_KEYS.waterReadings)).toEqual([readingB]);
    expect(hasPendingJournal()).toBe(false);
    expect(loadDeletedAquariums()).toHaveLength(1);
  });

  it("karantina kota hatasından sonra hata kalkarsa toparlama tamamlanır", () => {
    const snapshot = seedFullStore();
    storage.seedRaw(STORAGE_KEYS.livestock, "{bozuk canlı listesi");
    storage.failOnSet = (key) => (key.includes(":corrupt:") ? new Error("QuotaExceededError") : undefined);
    expect(deleteAquariumWithJournal("aq-a", snapshot).status).toBe("incomplete");

    storage.failOnSet = undefined;
    const recovery = recoverPendingJournal();

    expect(recovery).toEqual({ status: "recovered", aquariumId: "aq-a" });
    expect(storage.raw(quarantineKeysFor(STORAGE_KEYS.livestock)[0])).toBe("{bozuk canlı listesi");
    expect(storage.json(STORAGE_KEYS.livestock)).toEqual([]);
    expect(hasPendingJournal()).toBe(false);
  });
});

// --- J3. Tercih kaydetme başarısızlığı (Codex bulgusu 3) -------------------

describe("tercih kaydetme başarısızlığı ayarlar sayfasına bildirilir", () => {
  it("aktif günlük varken savePreferences false döner ve hiçbir şey yazmaz", () => {
    storage.seedJson(STORAGE_KEYS.preferences, DEFAULT_PREFERENCES);
    storage.seedRaw(STORAGE_KEYS.journal, "{}");
    storage.resetCalls();

    // Ayarlar sayfası bu `false` değerinde "Kaydedildi" göstermez.
    expect(savePreferences({ ...DEFAULT_PREFERENCES, volume: "gallons" })).toBe(false);
    expect(storage.setItemCalls).toHaveLength(0);
    expect(storage.json(STORAGE_KEYS.preferences)).toEqual(DEFAULT_PREFERENCES);
  });

  it("kota hatasında savePreferences false döner", () => {
    storage.failOnSet = () => new Error("QuotaExceededError");

    expect(savePreferences(DEFAULT_PREFERENCES)).toBe(false);
    expect(storage.raw(STORAGE_KEYS.preferences)).toBeNull();
  });

  it("normal koşulda true döner", () => {
    expect(savePreferences(DEFAULT_PREFERENCES)).toBe(true);
  });
});

// --- J4. Kaydetme koordinasyonu (Codex 2. tur, P1) ------------------------

describe("kaydetme koordinasyonu: başarısız yazma yok sayılmaz", () => {
  it("aktif günlük varken akvaryum/canlı ekleme kapıdan geçemez", () => {
    seedFullStore();
    storage.seedRaw(STORAGE_KEYS.journal, JSON.stringify({ op: "delete-aquarium" }));
    storage.resetCalls();

    // Sağlayıcı önce bu kapıyı sorar; izin yoksa state'e HİÇ dokunmaz.
    expect(checkMutationGate()).toEqual({ allowed: false, reason: "journal-pending" });
    // Yine de bir yazma denenirse fiziksel olarak engellenir.
    expect(persistCollection("aquariums", [aquariumA])).toEqual({ collection: "aquariums", status: "blocked-journal" });
    expect(persistCollection("livestock", [livestockA])).toEqual({ collection: "livestock", status: "blocked-journal" });
    expect(storage.setItemCalls).toHaveLength(0);
  });

  it("kota hatasında akvaryum/canlı ekleme 'failed' döner; başarı gibi görünmez", () => {
    seedFullStore();
    storage.failOnSet = () => new Error("QuotaExceededError");

    expect(persistCollection("aquariums", [aquariumA, aquariumB])).toEqual({ collection: "aquariums", status: "failed" });
    expect(persistCollection("livestock", [livestockA])).toEqual({ collection: "livestock", status: "failed" });
    // Eski değer bozulmadan duruyor; kullanıcıya uyarı gösterilecek.
    expect(storage.json(STORAGE_KEYS.livestock)).toEqual([livestockA]);
  });

  it("başarılı yazmada 'saved' döner ve veri depoya yazılır", () => {
    expect(persistCollection("aquariums", [aquariumA])).toEqual({ collection: "aquariums", status: "saved" });
    expect(storage.json(STORAGE_KEYS.aquariums)).toEqual([aquariumA]);
    expect(checkMutationGate()).toEqual({ allowed: true });
  });

  it("askı açıkken 'blocked-suspended' döner", () => {
    beginStorageSuspension();
    expect(persistCollection("plants", [plantA])).toEqual({ collection: "plants", status: "blocked-suspended" });
    endStorageSuspension();
    expect(persistCollection("plants", [plantA])).toEqual({ collection: "plants", status: "saved" });
  });

  it("tarayıcı deposu yoksa 'unavailable' döner", () => {
    removeFakeLocalStorage();
    expect(persistCollection("equipment", [equipmentA])).toEqual({ collection: "equipment", status: "unavailable" });
    storage = installFakeLocalStorage();
  });

  it("saveX kısayolları koordinasyon sonucunu yansıtır", () => {
    storage.seedRaw(STORAGE_KEYS.journal, "{}");
    expect(saveAquariums([aquariumA])).toBe(false);
    expect(saveLivestock([livestockA])).toBe(false);

    storage.removeItem(STORAGE_KEYS.journal);
    expect(saveAquariums([aquariumA])).toBe(true);
    expect(saveLivestock([livestockA])).toBe(true);
  });
});

// --- J4b. Açılışta yarım günlük uyarısı (Codex 3. tur, P2) ----------------
//
// Sağlayıcı hidrasyonda `recoverPendingJournal()` çağırıp hemen ardından
// `hasPendingJournal()` sonucunu `writeBlocked` olarak kullanır. Uyarının
// yalnızca gerçekten çözülememiş günlük varken çıkması bu koşula bağlıdır.

describe("açılışta yarım kalan günlük uyarısı", () => {
  it("günlük yokken uyarı koşulu oluşmaz", () => {
    seedFullStore();

    expect(recoverPendingJournal()).toEqual({ status: "none" });
    expect(hasPendingJournal()).toBe(false);
  });

  it("başarılı toparlamadan sonra uyarı koşulu oluşmaz", () => {
    const snapshot = seedFullStore();
    storage.failOnSet = (key) => (key === STORAGE_KEYS.plants ? new Error("QuotaExceededError") : undefined);
    expect(deleteAquariumWithJournal("aq-a", snapshot).status).toBe("incomplete");
    storage.failOnSet = undefined;

    expect(recoverPendingJournal().status).toBe("recovered");
    expect(hasPendingJournal()).toBe(false);
  });

  it("toparlama başarısız kalırsa uyarı koşulu hemen oluşur", () => {
    const snapshot = seedFullStore();
    storage.failOnSet = (key) => (key === STORAGE_KEYS.plants ? new Error("QuotaExceededError") : undefined);
    expect(deleteAquariumWithJournal("aq-a", snapshot).status).toBe("incomplete");

    // Sonraki açılış: kota hatası sürüyor, toparlama tamamlanamıyor.
    const recovery = recoverPendingJournal();

    expect(recovery.status).toBe("incomplete");
    expect(hasPendingJournal()).toBe(true);
  });

  it("bozuk günlük karantinaya alınabildiyse uyarı koşulu kalkar", () => {
    seedFullStore();
    storage.seedRaw(STORAGE_KEYS.journal, "{yarım günlük");

    expect(recoverPendingJournal().status).toBe("quarantined");
    expect(hasPendingJournal()).toBe(false);
  });

  it("bozuk günlük karantinaya alınamadıysa uyarı koşulu sürer", () => {
    seedFullStore();
    storage.seedRaw(STORAGE_KEYS.journal, "{yarım günlük");
    storage.failOnSet = () => new Error("QuotaExceededError");

    expect(recoverPendingJournal()).toEqual({ status: "quarantined" });
    expect(hasPendingJournal()).toBe(true);
  });
});

// --- J5. Arşiv onarımı (Codex 2. tur, P2) ---------------------------------

describe("bozuk deleted-aquariums arşivi karantina sonrası onarılır", () => {
  const validEntry: DeletedAquariumEntry = {
    aquarium: aquariumB,
    children: { waterReadings: [], maintenanceTasks: [], livestock: [], plants: [], equipment: [] },
    deletedAt: "2026-09-01T00:00:00.000Z",
    purgeAfter: "2026-10-01T00:00:00.000Z",
  };

  it("şemaya uymayan satırlar karantinaya alındıktan sonra arşiv geçerli satırlarla onarılır", () => {
    storage.seedJson(STORAGE_KEYS.deletedAquariums, [validEntry, { bozuk: "satır" }]);

    const kept = loadDeletedAquariums(new Date("2026-09-03T00:00:00.000Z"));

    expect(kept).toEqual([validEntry]);
    expect(storage.json(STORAGE_KEYS.deletedAquariums)).toEqual([validEntry]);
    expect(quarantineKeysFor(STORAGE_KEYS.deletedAquariums)).toHaveLength(1);
  });

  it("aynı bozuk arşiv ikinci yüklemede yeni karantina kopyası üretmez", () => {
    storage.seedJson(STORAGE_KEYS.deletedAquariums, [validEntry, { bozuk: "satır" }]);

    loadDeletedAquariums(new Date("2026-09-03T00:00:00.000Z"));
    loadDeletedAquariums(new Date("2026-09-03T00:00:00.000Z"));
    loadDeletedAquariums(new Date("2026-09-03T00:00:00.000Z"));

    expect(quarantineKeysFor(STORAGE_KEYS.deletedAquariums)).toHaveLength(1);
  });

  it("ayrıştırılamayan arşiv karantina sonrası boşaltılır ve döngü oluşmaz", () => {
    storage.seedRaw(STORAGE_KEYS.deletedAquariums, "{bozuk arşiv");

    expect(loadDeletedAquariums()).toEqual([]);
    expect(storage.json(STORAGE_KEYS.deletedAquariums)).toEqual([]);

    loadDeletedAquariums();
    expect(quarantineKeysFor(STORAGE_KEYS.deletedAquariums)).toHaveLength(1);
  });

  it("karantina yazılamazsa arşiv aynen korunur (önceki davranış sürüyor)", () => {
    const rawArchive = [validEntry, { bozuk: "satır" }];
    storage.seedJson(STORAGE_KEYS.deletedAquariums, rawArchive);
    storage.failOnSet = (key) => (key.includes(":corrupt:") ? new Error("QuotaExceededError") : undefined);

    expect(loadDeletedAquariums(new Date("2026-09-03T00:00:00.000Z"))).toEqual([]);
    expect(storage.json(STORAGE_KEYS.deletedAquariums)).toEqual(rawArchive);
  });
});

// --- J. Yükleme sonrası veri okunabilirliği --------------------------------

describe("silme sonrası yükleme", () => {
  it("silinen akvaryumun kayıtları aktif veriden okunmaz", () => {
    const snapshot = seedFullStore();
    deleteAquariumWithJournal("aq-a", snapshot);

    expect(loadAquariums([])).toEqual([aquariumB]);
    expect(loadWaterReadings([])).toEqual([readingB]);
    expect(loadLivestock([])).toEqual([]);
  });
});
