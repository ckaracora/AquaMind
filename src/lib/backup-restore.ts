import { LOCAL_EXPORT_VERSION, STORAGE_KEYS, localExportV1Schema, type DeletedAquariumEntry, type QuarantineEntry } from "@aquamind/domain";
import type { AquariumDataSnapshot, CollectionName, RestorePayload } from "@/lib/aquarium-storage";

// Yedek dosyasını okuma ve doğrulama (docs/DECISIONS/0027-yedekten-geri-yukleme.md). Saf ve React'a bağlı değildir;
// depoya yazmaz. Yazma `restoreFromBackup` (src/lib/aquarium-storage.ts) ile, kullanıcı onayından sonra yapılır.

/** Okunacak en büyük yedek dosyası. Tarayıcı deposu bundan küçüktür; daha büyük bir dosya bu uygulamanın yedeği olamaz. */
export const MAX_BACKUP_BYTES = 10 * 1024 * 1024;

export type BackupParseFailure =
  /** Dosya çok büyük. */
  | "too-large"
  /** JSON değil. */
  | "not-json"
  /** JSON ama AquaMind yedeği değil. */
  | "not-backup"
  /** Bu sürümün tanımadığı, daha yeni bir yedek biçimi. */
  | "newer-version"
  /** AquaMind yedeği ama içinde şemaya uymayan kayıt var. */
  | "invalid";

/** Onay penceresinde gösterilen özet; kayıt içeriği taşımaz. */
export interface BackupSummary {
  exportedAt: string;
  /** Koleksiyon başına kayıt sayısı (yetim kayıtlar dahil). */
  counts: Record<CollectionName, number>;
  deletedAquariums: number;
}

export type BackupParseResult =
  | { ok: true; payload: RestorePayload; summary: BackupSummary }
  | { ok: false; reason: BackupParseFailure };

const COLLECTION_EXPORT_KEYS: Record<CollectionName, string> = {
  aquariums: STORAGE_KEYS.aquariums,
  waterReadings: STORAGE_KEYS.waterReadings,
  maintenanceTasks: STORAGE_KEYS.maintenance,
  livestock: STORAGE_KEYS.livestock,
  plants: STORAGE_KEYS.plants,
  equipment: STORAGE_KEYS.equipment,
};

export const COLLECTION_NAMES = Object.keys(COLLECTION_EXPORT_KEYS) as CollectionName[];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function rowsOf(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

/**
 * Yedek dosyasının metnini okur ve geri yüklemeye hazır içeriği çıkarır.
 *
 * Dosya `LocalExportV1` şemasından bütünüyle geçmelidir; tek bir bozuk kayıt bile yedeği reddettirir (yarım geri
 * yükleme olmaz). Satırlar şemanın çıktısından değil, dosyadaki ORİJİNAL nesnelerden alınır; bilinmeyen alanlar korunur.
 * Yetim kayıtlar ait oldukları koleksiyona geri konur, böylece geri yükleme dışa aktarılan her kaydı geri getirir.
 */
export function parseBackup(text: string): BackupParseResult {
  if (text.length > MAX_BACKUP_BYTES) return { ok: false, reason: "too-large" };

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, reason: "not-json" };
  }
  if (!isRecord(raw) || typeof raw.exportedAt !== "string" || typeof raw.version !== "number") {
    return { ok: false, reason: "not-backup" };
  }
  if (raw.version > LOCAL_EXPORT_VERSION) return { ok: false, reason: "newer-version" };
  if (!localExportV1Schema.safeParse(raw).success) return { ok: false, reason: "invalid" };
  // Şemadan geçen ama yeniden yazıya dökülemeyen içerik (ör. bilinmeyen alanda aşırı iç içe dizi) geri yüklenemez.
  try {
    JSON.stringify(raw);
  } catch {
    return { ok: false, reason: "invalid" };
  }

  const orphans = isRecord(raw.orphans) ? raw.orphans : {};
  const collections = Object.fromEntries(
    COLLECTION_NAMES.map((name) => [name, [...rowsOf(raw[COLLECTION_EXPORT_KEYS[name]]), ...rowsOf(orphans[name])]]),
  ) as Record<CollectionName, unknown[]>;
  const deletedAquariums = rowsOf(raw[STORAGE_KEYS.deletedAquariums]) as DeletedAquariumEntry[];
  const quarantine = rowsOf(raw.quarantine) as QuarantineEntry[];

  return {
    ok: true,
    payload: { collections, preferences: raw[STORAGE_KEYS.preferences], deletedAquariums, quarantine },
    summary: {
      exportedAt: raw.exportedAt,
      counts: Object.fromEntries(COLLECTION_NAMES.map((name) => [name, collections[name].length])) as Record<CollectionName, number>,
      deletedAquariums: deletedAquariums.length,
    },
  };
}

/** Bu cihazdaki kalıcı verinin koleksiyon başına kayıt sayısı (onay penceresinde "yerini alacak" kısmı için). */
export function countSnapshot(snapshot: AquariumDataSnapshot): Record<CollectionName, number> {
  return Object.fromEntries(COLLECTION_NAMES.map((name) => [name, snapshot[name].length])) as Record<CollectionName, number>;
}
