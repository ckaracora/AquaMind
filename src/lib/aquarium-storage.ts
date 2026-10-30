import {
  BACKUP_REMINDER_DAYS,
  DEFAULT_PREFERENCES,
  DELETED_AQUARIUM_RETENTION_DAYS,
  EMPTY_JOURNAL_STEPS,
  QUARANTINE_SUFFIX,
  STORAGE_KEYS,
  aquariumSchema,
  backupStatusSchema,
  deleteAquariumJournalSchema,
  deletedAquariumEntrySchema,
  equipmentSchema,
  livestockSchema,
  maintenanceTaskSchema,
  plantSchema,
  preferencesSchema,
  restoreBackupJournalSchema,
  waterParametersSchema,
  type BackupStatus,
  type DeleteAquariumJournal,
  type DeletedAquariumEntry,
  type JournalSteps,
  type LocalExportV1,
  type OrphanRecords,
  type Preferences,
  type QuarantineEntry,
  type RestoreBackupJournal,
} from "@aquamind/domain";
import type { Aquarium, Equipment, Livestock, MaintenanceTask, Plant, WaterParameters } from "@/types/aquarium";

// Tarayıcı deposu katmanı (Issue #8).
//
// Üç güvence:
//   1. Bozuk veri asla demo/varsayılan ile üzerine yazılmaz; ham değer karantinaya alınır.
//   2. Normal kaydetmeler, askı açıkken VEYA aktif bir silme günlüğü varken fiziksel
//      olarak yazamaz. Günlüğün kendi kontrollü yazmaları bu korumayı bilerek atlar.
//   3. Akvaryum silme, `localStorage` transaction desteklemediği için yazma öncesi
//      günlükle (write-ahead journal) yapılır; yarıda kesilse bile sonraki açılışta
//      tamamlanır ve bağlı kayıtlar kaybolmaz.
//
// `:v1` anahtar adları ve JSON biçimi geriye uyumluluk için değişmedi.

interface StorageArea {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  key(index: number): string | null;
  readonly length: number;
}

function area(): StorageArea | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage as unknown as StorageArea;
  } catch {
    return null;
  }
}

// --- Kaydetme askısı -------------------------------------------------------

let suspensionDepth = 0;

/** Günlüklü işlem veya hidrasyon süresince normal kaydetmeleri durdurur. */
export function beginStorageSuspension(): void {
  suspensionDepth += 1;
}

export function endStorageSuspension(): void {
  suspensionDepth = Math.max(0, suspensionDepth - 1);
}

export function isStorageSuspended(): boolean {
  return suspensionDepth > 0;
}

/** Tamamlanmamış bir silme günlüğü var mı? Başka bir sekme de yazmış olabilir. */
export function hasPendingJournal(): boolean {
  const store = area();
  if (!store) return false;
  try {
    return store.getItem(STORAGE_KEYS.journal) !== null;
  } catch {
    return false;
  }
}

/** Normal (kontrollü olmayan) kaydetmelerin yazıp yazamayacağı. */
export function isPersistenceBlocked(): boolean {
  return isStorageSuspended() || hasPendingJournal();
}

// --- Sorun kaydı (kurtarma özeti için) -------------------------------------

export type StorageIssueKind =
  | "invalid-json"
  | "not-an-array"
  | "invalid-rows"
  | "invalid-object"
  | "quarantine-failed"
  | "journal-quarantined"
  | "journal-recovered"
  | "delete-refused"
  | "delete-incomplete"
  | "restore-incomplete";

export interface StorageIssue {
  key: string;
  kind: StorageIssueKind;
  /** Ham değerin taşındığı karantina anahtarı (varsa). */
  quarantineKey?: string;
  /** Şemaya uymadığı için aktif veriden çıkarılan satır sayısı. */
  droppedRows?: number;
}

let issues: StorageIssue[] = [];

function recordIssue(issue: StorageIssue): void {
  issues = [...issues, issue];
}

/** Kurtarma özeti için toplanan sorunlar. Kayıt içeriği taşımaz. */
export function getStorageIssues(): StorageIssue[] {
  return [...issues];
}

export function clearStorageIssues(): void {
  issues = [];
}

// --- Yazma yardımcıları ----------------------------------------------------

/** Kontrollü yazma: askıyı ve aktif günlüğü bilerek atlar. Kota hatasında fırlatır. */
function writeControlled(store: StorageArea, key: string, value: unknown): void {
  store.setItem(key, JSON.stringify(value));
}

/** Normal yazma: askı veya aktif günlük varsa hiçbir şey yazmaz. */
function writeGuarded(key: string, value: unknown): boolean {
  const store = area();
  if (!store) return false;
  if (isPersistenceBlocked()) return false;
  try {
    store.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/** Ham değeri `<anahtar>:corrupt:<ISO>` altına taşır. Başarısızsa `undefined`. */
function quarantine(store: StorageArea, key: string, raw: string): string | undefined {
  const quarantineKey = `${key}:${QUARANTINE_SUFFIX}:${new Date().toISOString()}`;
  try {
    store.setItem(quarantineKey, raw);
    return quarantineKey;
  } catch {
    return undefined;
  }
}

/** Ham değeri karantinaya alır ve sonucu kaydeder. Karantina anahtarını döner. */
function quarantineAndRecord(
  store: StorageArea,
  key: string,
  raw: string,
  kind: StorageIssueKind,
  droppedRows?: number,
): string | undefined {
  const quarantineKey = quarantine(store, key, raw);
  recordIssue({ key, kind, quarantineKey, droppedRows });
  if (!quarantineKey) recordIssue({ key, kind: "quarantine-failed" });
  return quarantineKey;
}

/**
 * Ham değer güvenle karantinaya alındıysa birincil anahtarı onarır; böylece her
 * açılışta aynı bozuk değer için yeni karantina anahtarı üretilmez.
 * Karantina başarısızsa birincil anahtara DOKUNULMAZ (yedeksiz veri kaybı olmaz).
 * Aktif bir silme günlüğü varsa da dokunulmaz; önce günlük çözülür.
 */
function repairPrimary(store: StorageArea, key: string, quarantineKey: string | undefined, repaired: unknown[]): void {
  if (!quarantineKey) return;
  if (hasPendingJournal()) return;
  try {
    writeControlled(store, key, repaired);
  } catch {
    // Onarım yazılamazsa ham değer karantinada durmaya devam eder.
  }
}

// --- Güvenli yükleme -------------------------------------------------------

type RowCheck = (row: unknown) => boolean;

const isAquarium: RowCheck = (row) => aquariumSchema.safeParse(row).success;
const isWaterParameters: RowCheck = (row) => waterParametersSchema.safeParse(row).success;
const isMaintenanceTask: RowCheck = (row) => maintenanceTaskSchema.safeParse(row).success;
const isLivestock: RowCheck = (row) => livestockSchema.safeParse(row).success;
const isPlant: RowCheck = (row) => plantSchema.safeParse(row).success;
const isEquipment: RowCheck = (row) => equipmentSchema.safeParse(row).success;

/**
 * Bir koleksiyonu güvenle yükler.
 * - Anahtar yoksa `fallback` döner ve hiçbir şey yazılmaz.
 * - Ayrıştırılamıyor veya kök dizi değilse ham değer karantinaya alınır ve BOŞ dizi döner
 *   (demo veriye düşülmez, anahtarın üstüne yazılmaz).
 * - Kısmen bozuksa geçerli satırlar korunur, ham değerin tamamı karantinaya kopyalanır.
 *
 * Geçerli satırlar şemadan geçen ORİJİNAL nesnelerdir; bilinmeyen ek alanlar korunur.
 */
function loadCollection<T>(key: string, check: RowCheck, fallback: T[]): T[] {
  const store = area();
  if (!store) return fallback;

  let raw: string | null;
  try {
    raw = store.getItem(key);
  } catch {
    return fallback;
  }
  if (raw === null) return fallback;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    repairPrimary(store, key, quarantineAndRecord(store, key, raw, "invalid-json"), []);
    return [];
  }

  if (!Array.isArray(parsed)) {
    repairPrimary(store, key, quarantineAndRecord(store, key, raw, "not-an-array"), []);
    return [];
  }

  const valid: T[] = [];
  let dropped = 0;
  for (const row of parsed) {
    if (check(row)) valid.push(row as T);
    else dropped += 1;
  }
  if (dropped > 0) {
    repairPrimary(store, key, quarantineAndRecord(store, key, raw, "invalid-rows", dropped), valid);
  }

  return valid;
}

export function loadAquariums(fallback: Aquarium[]): Aquarium[] {
  return loadCollection<Aquarium>(STORAGE_KEYS.aquariums, isAquarium, fallback);
}

export function loadWaterReadings(fallback: WaterParameters[]): WaterParameters[] {
  return loadCollection<WaterParameters>(STORAGE_KEYS.waterReadings, isWaterParameters, fallback);
}

export function loadMaintenanceTasks(fallback: MaintenanceTask[]): MaintenanceTask[] {
  return loadCollection<MaintenanceTask>(STORAGE_KEYS.maintenance, isMaintenanceTask, fallback);
}

export function loadLivestock(fallback: Livestock[]): Livestock[] {
  return loadCollection<Livestock>(STORAGE_KEYS.livestock, isLivestock, fallback);
}

export function loadPlants(fallback: Plant[]): Plant[] {
  return loadCollection<Plant>(STORAGE_KEYS.plants, isPlant, fallback);
}

export function loadEquipment(fallback: Equipment[]): Equipment[] {
  return loadCollection<Equipment>(STORAGE_KEYS.equipment, isEquipment, fallback);
}

// --- Hidrasyon: depodan gelen veri ile demo verinin ayrımı -----------------

export type CollectionName = keyof AquariumDataSnapshot;

/** `true` = koleksiyon depoda yok; ekranda yalnızca demo (tohum) veri gösteriliyor. */
export type DemoFlags = Record<CollectionName, boolean>;

export interface HydrationResult {
  snapshot: AquariumDataSnapshot;
  demo: DemoFlags;
}

const ALL_DEMO: DemoFlags = {
  aquariums: true,
  waterReadings: true,
  maintenanceTasks: true,
  livestock: true,
  plants: true,
  equipment: true,
};

function hasStoredKey(store: StorageArea, key: string): boolean {
  try {
    return store.getItem(key) !== null;
  } catch {
    return false;
  }
}

/**
 * Koleksiyonları yükler ve her biri için verinin depodan mı geldiğini bildirir.
 *
 * Anahtar depoda yoksa demo (tohum) veri yalnızca EKRANDA gösterilir; `demo`
 * bayrağı `true` olur ve bu kayıtlar ne kalıcı depoya ne de JSON yedeğinin ana
 * koleksiyonlarına girer. Anahtar varsa (bozuk olsa bile) koleksiyon gerçek
 * kullanıcı verisi sayılır; bozuk değer karantinaya alınmış ve boş dönmüş olabilir.
 */
export function hydrateFromStorage(seed: AquariumDataSnapshot): HydrationResult {
  const store = area();
  if (!store) return { snapshot: seed, demo: { ...ALL_DEMO } };

  const pick = <T,>(key: string, load: (fallback: T[]) => T[], seedRows: T[]): { rows: T[]; demo: boolean } =>
    hasStoredKey(store, key) ? { rows: load([]), demo: false } : { rows: seedRows, demo: true };

  const aquariums = pick(STORAGE_KEYS.aquariums, loadAquariums, seed.aquariums);
  const waterReadings = pick(STORAGE_KEYS.waterReadings, loadWaterReadings, seed.waterReadings);
  const maintenanceTasks = pick(STORAGE_KEYS.maintenance, loadMaintenanceTasks, seed.maintenanceTasks);
  const livestock = pick(STORAGE_KEYS.livestock, loadLivestock, seed.livestock);
  const plants = pick(STORAGE_KEYS.plants, loadPlants, seed.plants);
  const equipment = pick(STORAGE_KEYS.equipment, loadEquipment, seed.equipment);

  return {
    snapshot: {
      aquariums: aquariums.rows,
      waterReadings: waterReadings.rows,
      maintenanceTasks: maintenanceTasks.rows,
      livestock: livestock.rows,
      plants: plants.rows,
      equipment: equipment.rows,
    },
    demo: {
      aquariums: aquariums.demo,
      waterReadings: waterReadings.demo,
      maintenanceTasks: maintenanceTasks.demo,
      livestock: livestock.demo,
      plants: plants.demo,
      equipment: equipment.demo,
    },
  };
}

/** Demo (kalıcı olmayan) koleksiyonları boşaltır; yedek ve silme bunu kullanır. */
export function persistedOnly(snapshot: AquariumDataSnapshot, demo: DemoFlags): AquariumDataSnapshot {
  return {
    aquariums: demo.aquariums ? [] : snapshot.aquariums,
    waterReadings: demo.waterReadings ? [] : snapshot.waterReadings,
    maintenanceTasks: demo.maintenanceTasks ? [] : snapshot.maintenanceTasks,
    livestock: demo.livestock ? [] : snapshot.livestock,
    plants: demo.plants ? [] : snapshot.plants,
    equipment: demo.equipment ? [] : snapshot.equipment,
  };
}

// --- Kaydetme (askı ve aktif günlük korumalı) ------------------------------

/** Bir koleksiyonun kalıcı yazma sonucu. */
export type PersistStatus =
  /** Yazıldı. */
  | "saved"
  /** Tamamlanmamış bir silme günlüğü var; yazma engellendi. */
  | "blocked-journal"
  /** Kontrollü bir işlem sürüyor (hidrasyon veya silme); yazma engellendi. */
  | "blocked-suspended"
  /** Depoya yazılamadı (kota veya tarayıcı kısıtı). */
  | "failed"
  /** Tarayıcı deposu yok (sunucu tarafı). */
  | "unavailable";

export interface PersistResult {
  collection: CollectionName;
  status: PersistStatus;
}

const COLLECTION_KEYS: Record<CollectionName, string> = {
  aquariums: STORAGE_KEYS.aquariums,
  waterReadings: STORAGE_KEYS.waterReadings,
  maintenanceTasks: STORAGE_KEYS.maintenance,
  livestock: STORAGE_KEYS.livestock,
  plants: STORAGE_KEYS.plants,
  equipment: STORAGE_KEYS.equipment,
};

/**
 * Kaydetme koordinasyonu. Saf ve test edilebilir: React'a bağlı değildir.
 * Sonuç ASLA yok sayılmamalıdır; `saved` dışındaki her durum kullanıcı
 * değişikliğinin bu cihazda saklanmadığı anlamına gelir.
 */
export function persistCollection(collection: CollectionName, rows: unknown[]): PersistResult {
  const store = area();
  if (!store) return { collection, status: "unavailable" };
  if (hasPendingJournal()) return { collection, status: "blocked-journal" };
  if (isStorageSuspended()) return { collection, status: "blocked-suspended" };
  try {
    writeControlled(store, COLLECTION_KEYS[collection], rows);
    return { collection, status: "saved" };
  } catch {
    return { collection, status: "failed" };
  }
}

export type MutationGate = { allowed: true } | { allowed: false; reason: "journal-pending" };

/**
 * Veri değiştiren bir işleme başlamadan önce çağrılır. Tamamlanmamış bir silme
 * günlüğü varsa işlem hiç başlatılmaz; böylece kullanıcı değişikliği yalnızca
 * bellekte kalıp yenilemede sessizce kaybolmaz.
 */
export function checkMutationGate(): MutationGate {
  return hasPendingJournal() ? { allowed: false, reason: "journal-pending" } : { allowed: true };
}

export function saveAquariums(aquariums: Aquarium[]): boolean {
  return persistCollection("aquariums", aquariums).status === "saved";
}

export function saveWaterReadings(readings: WaterParameters[]): boolean {
  return persistCollection("waterReadings", readings).status === "saved";
}

export function saveMaintenanceTasks(tasks: MaintenanceTask[]): boolean {
  return persistCollection("maintenanceTasks", tasks).status === "saved";
}

export function saveLivestock(items: Livestock[]): boolean {
  return persistCollection("livestock", items).status === "saved";
}

export function savePlants(items: Plant[]): boolean {
  return persistCollection("plants", items).status === "saved";
}

export function saveEquipment(items: Equipment[]): boolean {
  return persistCollection("equipment", items).status === "saved";
}

// --- Tercihler -------------------------------------------------------------

/**
 * Tercihleri güvenle yükler. Bozuksa ham değer karantinaya alınır, BELLEKTE
 * varsayılanlar kullanılır ve anahtarın üstüne yazılmaz; yalnızca kullanıcı
 * açıkça kaydederse yazılır.
 */
export function loadPreferences(fallback: Preferences = DEFAULT_PREFERENCES): Preferences {
  const store = area();
  if (!store) return fallback;

  let raw: string | null;
  try {
    raw = store.getItem(STORAGE_KEYS.preferences);
  } catch {
    return fallback;
  }
  if (raw === null) return fallback;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    dropCorruptPreferences(store, quarantineAndRecord(store, STORAGE_KEYS.preferences, raw, "invalid-json"));
    return fallback;
  }

  if (!preferencesSchema.safeParse(parsed).success) {
    dropCorruptPreferences(store, quarantineAndRecord(store, STORAGE_KEYS.preferences, raw, "invalid-object"));
    return fallback;
  }

  return parsed as Preferences;
}

/**
 * Bozuk tercih anahtarını yalnızca ham değer karantinaya alındıysa kaldırır.
 * Varsayılanlar ANAHTARA YAZILMAZ; bellekte kullanılır ve yalnızca kullanıcı
 * açıkça kaydederse yazılır. Kaldırma, her açılışta yeni karantina anahtarı
 * üretilmesini önler.
 */
function dropCorruptPreferences(store: StorageArea, quarantineKey: string | undefined): void {
  if (!quarantineKey) return;
  if (hasPendingJournal()) return;
  try {
    store.removeItem(STORAGE_KEYS.preferences);
  } catch {
    // Kaldırılamazsa ham değer karantinada durur.
  }
}

export function savePreferences(preferences: Preferences): boolean {
  return writeGuarded(STORAGE_KEYS.preferences, preferences);
}

// --- Silinen akvaryum paketleri (30 gün) -----------------------------------

/**
 * Okuma sonucu. `ok: false`, ham değerin bozuk olduğunu VE güvenle karantinaya
 * alınamadığını bildirir; bu durumda ilgili anahtar asla yeniden yazılmaz.
 */
type ReadOutcome<T> = { ok: true; rows: T[] } | { ok: false };

/**
 * Silinen akvaryum arşivini okur. Bozuk ham değer veya şemaya uymayan satırlar
 * varsa önce ham değerin tamamı karantinaya alınır; karantina yazılamazsa
 * `ok: false` döner ve arşiv olduğu gibi bırakılır (sessiz kayıp olmaz).
 */
function readEntries(store: StorageArea): ReadOutcome<DeletedAquariumEntry> {
  let raw: string | null;
  try {
    raw = store.getItem(STORAGE_KEYS.deletedAquariums);
  } catch {
    return { ok: false };
  }
  if (raw === null) return { ok: true, rows: [] };

  /** Karantina başarılıysa arşivi onarır ve devam eder; değilse işlem durur. */
  const afterQuarantine = (kind: StorageIssueKind): ReadOutcome<DeletedAquariumEntry> => {
    if (!quarantineAndRecord(store, STORAGE_KEYS.deletedAquariums, raw as string, kind)) return { ok: false };
    try {
      writeControlled(store, STORAGE_KEYS.deletedAquariums, []);
    } catch {
      // Onarım yazılamazsa ham değer karantinada durmaya devam eder.
    }
    return { ok: true, rows: [] };
  };

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return afterQuarantine("invalid-json");
  }
  if (!Array.isArray(parsed)) {
    return afterQuarantine("not-an-array");
  }

  const valid = parsed.filter((entry) => deletedAquariumEntrySchema.safeParse(entry).success) as DeletedAquariumEntry[];
  if (valid.length !== parsed.length) {
    // Şemaya uymayan arşiv satırları sessizce kaybolmaz: ham değer karantinaya
    // alınamıyorsa arşiv yeniden yazılmaz.
    const quarantineKey = quarantineAndRecord(
      store,
      STORAGE_KEYS.deletedAquariums,
      raw,
      "invalid-rows",
      parsed.length - valid.length,
    );
    if (!quarantineKey) return { ok: false };
    // Karantina güvende: ana arşiv geçerli satırlarla onarılır, böylece aynı bozuk
    // değer her yüklemede yeni bir karantina kopyası üretmez.
    try {
      writeControlled(store, STORAGE_KEYS.deletedAquariums, valid);
    } catch {
      // Onarım yazılamazsa ham değer karantinada durmaya devam eder.
    }
  }
  return { ok: true, rows: valid };
}

/**
 * Silinen akvaryum paketleri; saklama süresi dolanlar temizlenir.
 * Arşiv bozuk ve karantinaya alınamıyorsa hiçbir şey yazılmaz.
 */
export function loadDeletedAquariums(now: Date = new Date()): DeletedAquariumEntry[] {
  const store = area();
  if (!store) return [];

  const outcome = readEntries(store);
  if (!outcome.ok) return [];

  const kept = outcome.rows.filter((entry) => new Date(entry.purgeAfter).getTime() > now.getTime());
  if (kept.length !== outcome.rows.length) writeGuarded(STORAGE_KEYS.deletedAquariums, kept);
  return kept;
}

// --- Günlüklü silme --------------------------------------------------------

export interface AquariumDataSnapshot {
  aquariums: Aquarium[];
  waterReadings: WaterParameters[];
  maintenanceTasks: MaintenanceTask[];
  livestock: Livestock[];
  plants: Plant[];
  equipment: Equipment[];
}

type CollectionStep = Exclude<keyof JournalSteps, "trash">;

interface CollectionStepSpec {
  step: CollectionStep;
  key: string;
  belongsToAquarium: (row: unknown, aquariumId: string) => boolean;
}

const COLLECTION_STEPS: CollectionStepSpec[] = [
  {
    step: "aquariums",
    key: STORAGE_KEYS.aquariums,
    belongsToAquarium: (row, id) => (row as Aquarium)?.id === id,
  },
  {
    step: "waterReadings",
    key: STORAGE_KEYS.waterReadings,
    belongsToAquarium: (row, id) => (row as WaterParameters)?.aquariumId === id,
  },
  {
    step: "maintenance",
    key: STORAGE_KEYS.maintenance,
    belongsToAquarium: (row, id) => (row as MaintenanceTask)?.aquariumId === id,
  },
  {
    step: "livestock",
    key: STORAGE_KEYS.livestock,
    belongsToAquarium: (row, id) => (row as Livestock)?.aquariumId === id,
  },
  {
    step: "plants",
    key: STORAGE_KEYS.plants,
    belongsToAquarium: (row, id) => (row as Plant)?.aquariumId === id,
  },
  {
    step: "equipment",
    key: STORAGE_KEYS.equipment,
    belongsToAquarium: (row, id) => (row as Equipment)?.aquariumId === id,
  },
];

/**
 * Günlük adımı için ham diziyi okur. Değer bozuksa yalnızca ham hâli GÜVENLE
 * karantinaya alınabildiyse adım ilerleyebilir; karantina yazılamazsa `ok: false`
 * döner ve anahtar asla `[]` veya başka bir değerle ezilmez.
 */
function readArrayForStep(store: StorageArea, key: string): ReadOutcome<unknown> {
  let raw: string | null;
  try {
    raw = store.getItem(key);
  } catch {
    return { ok: false };
  }
  if (raw === null) return { ok: true, rows: [] };

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return quarantineAndRecord(store, key, raw, "invalid-json") ? { ok: true, rows: [] } : { ok: false };
  }
  if (!Array.isArray(parsed)) {
    return quarantineAndRecord(store, key, raw, "not-an-array") ? { ok: true, rows: [] } : { ok: false };
  }
  return { ok: true, rows: parsed };
}

function sameEntry(a: DeletedAquariumEntry, b: DeletedAquariumEntry): boolean {
  return a.aquarium.id === b.aquarium.id && a.deletedAt === b.deletedAt;
}

/**
 * Günlükteki tamamlanmamış adımları uygular. Adımlar yinelenebilir: koleksiyon
 * süzme tekrar edilebilir, paket zaten varsa ikinci kez eklenmez.
 * Kota hatasında durur ve `false` döner; günlük korunur.
 */
function applyJournalSteps(store: StorageArea, journal: DeleteAquariumJournal): boolean {
  const state: DeleteAquariumJournal = { ...journal, steps: { ...journal.steps } };

  const markStep = (step: keyof JournalSteps): void => {
    state.steps[step] = true;
    try {
      writeControlled(store, STORAGE_KEYS.journal, state);
    } catch {
      // İşaretleme yazılamazsa adım sonraki açılışta yeniden uygulanır (yinelenebilir).
    }
  };

  if (!state.steps.trash) {
    const outcome = readEntries(store);
    // Arşiv bozuk ve karantinaya alınamadıysa üzerine yazma; işlem yarım kalır.
    if (!outcome.ok) return false;
    const next = outcome.rows.some((entry) => sameEntry(entry, state.entry)) ? outcome.rows : [state.entry, ...outcome.rows];
    try {
      writeControlled(store, STORAGE_KEYS.deletedAquariums, next);
    } catch {
      return false;
    }
    markStep("trash");
  }

  for (const spec of COLLECTION_STEPS) {
    if (state.steps[spec.step]) continue;
    const outcome = readArrayForStep(store, spec.key);
    // Bozuk koleksiyon karantinaya alınamadıysa anahtara dokunma; işlem yarım kalır.
    if (!outcome.ok) return false;
    const remaining = outcome.rows.filter((row) => !spec.belongsToAquarium(row, state.aquariumId));
    try {
      writeControlled(store, spec.key, remaining);
    } catch {
      return false;
    }
    markStep(spec.step);
  }

  return true;
}

export type DeleteAquariumResult =
  | { status: "unavailable" }
  | { status: "not-found" }
  | { status: "refused"; reason: "journal-pending" | "journal-write-failed" }
  | { status: "completed"; snapshot: AquariumDataSnapshot }
  | { status: "incomplete" };

/**
 * Bir akvaryumu ve ona bağlı tüm alt kayıtları siler.
 *
 * Sıra: günlük (tam yükle) → paket → altı koleksiyon → günlük silinir.
 * Günlük yazılamazsa hiçbir şey değişmez ve silme reddedilir.
 */
export function deleteAquariumWithJournal(
  aquariumId: string,
  current: AquariumDataSnapshot,
  now: Date = new Date(),
): DeleteAquariumResult {
  const store = area();
  if (!store) return { status: "unavailable" };
  if (hasPendingJournal()) return { status: "refused", reason: "journal-pending" };

  const aquarium = current.aquariums.find((item) => item.id === aquariumId);
  if (!aquarium) return { status: "not-found" };

  const purgeAfter = new Date(now.getTime() + DELETED_AQUARIUM_RETENTION_DAYS * 24 * 60 * 60 * 1000);
  const journal: DeleteAquariumJournal = {
    op: "delete-aquarium",
    aquariumId,
    startedAt: now.toISOString(),
    entry: {
      aquarium,
      children: {
        waterReadings: current.waterReadings.filter((row) => row.aquariumId === aquariumId),
        maintenanceTasks: current.maintenanceTasks.filter((row) => row.aquariumId === aquariumId),
        livestock: current.livestock.filter((row) => row.aquariumId === aquariumId),
        plants: current.plants.filter((row) => row.aquariumId === aquariumId),
        equipment: current.equipment.filter((row) => row.aquariumId === aquariumId),
      },
      deletedAt: now.toISOString(),
      purgeAfter: purgeAfter.toISOString(),
    },
    steps: { ...EMPTY_JOURNAL_STEPS },
  };

  // Yıkıcı hiçbir yazma, veri günlükte durmadan önce yapılmaz.
  try {
    writeControlled(store, STORAGE_KEYS.journal, journal);
  } catch {
    recordIssue({ key: STORAGE_KEYS.journal, kind: "delete-refused" });
    return { status: "refused", reason: "journal-write-failed" };
  }

  if (!applyJournalSteps(store, journal)) {
    recordIssue({ key: STORAGE_KEYS.journal, kind: "delete-incomplete" });
    return { status: "incomplete" };
  }

  try {
    store.removeItem(STORAGE_KEYS.journal);
  } catch {
    recordIssue({ key: STORAGE_KEYS.journal, kind: "delete-incomplete" });
    return { status: "incomplete" };
  }

  return {
    status: "completed",
    snapshot: {
      aquariums: current.aquariums.filter((row) => row.id !== aquariumId),
      waterReadings: current.waterReadings.filter((row) => row.aquariumId !== aquariumId),
      maintenanceTasks: current.maintenanceTasks.filter((row) => row.aquariumId !== aquariumId),
      livestock: current.livestock.filter((row) => row.aquariumId !== aquariumId),
      plants: current.plants.filter((row) => row.aquariumId !== aquariumId),
      equipment: current.equipment.filter((row) => row.aquariumId !== aquariumId),
    },
  };
}

export type JournalRecoveryResult =
  | { status: "none" }
  | { status: "recovered"; aquariumId: string }
  | { status: "incomplete"; aquariumId: string }
  | { status: "restore-recovered" }
  | { status: "restore-incomplete" }
  | { status: "quarantined"; quarantineKey?: string };

/**
 * Açılışta çağrılır. Tamamlanmamış silme günlüğü varsa kalan adımları uygular.
 * Günlük bozuksa aktif veriye DOKUNULMAZ; ham değer karantinaya kopyalanır ve
 * yalnızca kopya yazılabildiyse birincil anahtar temizlenir.
 */
export function recoverPendingJournal(): JournalRecoveryResult {
  const store = area();
  if (!store) return { status: "none" };
  // Geri yüklemenin yer sınaması bir kesintiyle yarıda kaldıysa geçici anahtar yer kaplamaya devam etmesin.
  try {
    store.removeItem(RESTORE_PROBE_KEY);
  } catch {
    // Kaldırılamazsa sonraki açılışta yeniden denenir.
  }

  let raw: string | null;
  try {
    raw = store.getItem(STORAGE_KEYS.journal);
  } catch {
    return { status: "none" };
  }
  if (raw === null) return { status: "none" };

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return quarantineJournal(store, raw);
  }
  if (restoreBackupJournalSchema.safeParse(parsed).success) {
    // Yarıda kalmış yedekten geri yükleme: yazmalar yinelenebilir, baştan uygulanır.
    const restore = parsed as RestoreBackupJournal;
    if (!applyRestoreWrites(store, restore) || !removeJournal(store)) {
      recordIssue({ key: STORAGE_KEYS.journal, kind: "restore-incomplete" });
      return { status: "restore-incomplete" };
    }
    recordIssue({ key: STORAGE_KEYS.journal, kind: "journal-recovered" });
    return { status: "restore-recovered" };
  }
  if (!deleteAquariumJournalSchema.safeParse(parsed).success) {
    return quarantineJournal(store, raw);
  }

  const journal = parsed as DeleteAquariumJournal;
  if (!applyJournalSteps(store, journal)) {
    recordIssue({ key: STORAGE_KEYS.journal, kind: "delete-incomplete" });
    return { status: "incomplete", aquariumId: journal.aquariumId };
  }

  try {
    store.removeItem(STORAGE_KEYS.journal);
  } catch {
    return { status: "incomplete", aquariumId: journal.aquariumId };
  }

  recordIssue({ key: STORAGE_KEYS.journal, kind: "journal-recovered" });
  return { status: "recovered", aquariumId: journal.aquariumId };
}

function quarantineJournal(store: StorageArea, raw: string): JournalRecoveryResult {
  const quarantineKey = quarantine(store, STORAGE_KEYS.journal, raw);
  recordIssue({ key: STORAGE_KEYS.journal, kind: "journal-quarantined", quarantineKey });
  if (!quarantineKey) {
    // Kopya yazılamadı: ham günlük olduğu gibi bırakılır, aktif veriye dokunulmaz.
    recordIssue({ key: STORAGE_KEYS.journal, kind: "quarantine-failed" });
    return { status: "quarantined" };
  }
  try {
    store.removeItem(STORAGE_KEYS.journal);
  } catch {
    // Birincil anahtar kalırsa bir sonraki açılışta yeniden denenir.
  }
  return { status: "quarantined", quarantineKey };
}

// --- Yedekten geri yükleme (docs/DECISIONS/0027-yedekten-geri-yukleme.md) ---

/**
 * Geri yüklenecek, doğrulanmış yedek içeriği (src/lib/backup-restore.ts üretir). Satırlar yedekteki ORİJİNAL
 * nesnelerdir; bilinmeyen ek alanlar korunur. Yetim kayıtlar ait oldukları koleksiyona geri konur.
 */
export interface RestorePayload {
  collections: Record<CollectionName, unknown[]>;
  /** Yedekte tercih yoksa `undefined`: tercih anahtarı kaldırılır, varsayılanlar kullanılır. */
  preferences?: unknown;
  deletedAquariums: DeletedAquariumEntry[];
  quarantine: QuarantineEntry[];
}

export type RestoreResult =
  | { status: "unavailable" }
  /** Hiçbir şey değişmedi. */
  | { status: "refused"; reason: "journal-pending" | "journal-write-failed" | "not-enough-space" | "trash-unreadable" | "unserializable" }
  | { status: "completed" }
  /** Günlük duruyor; uygulama sonraki açılışta geri yüklemeyi tamamlar. */
  | { status: "incomplete" };

/** Yedekten geri gelebilecek karantina anahtarı: bilinen bir anahtar + `:corrupt:` + ISO zaman (`quarantine` ile aynı biçim). */
const QUARANTINE_KEY_PATTERN = new RegExp(
  `^(${Object.values(STORAGE_KEYS).filter((key) => key !== STORAGE_KEYS.backupStatus).join("|")}):${QUARANTINE_SUFFIX}:\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d{3})?Z$`,
);

/** Yer sınaması için geçici anahtar; sınamadan hemen sonra silinir. */
const RESTORE_PROBE_KEY = "aquamind:restore-probe:v1";

/** Geri yüklemenin yazabileceği anahtarlar; günlükte başka bir anahtar olsa bile ona dokunulmaz. */
const RESTORE_KEYS = new Set<string>([
  ...Object.values(COLLECTION_KEYS),
  STORAGE_KEYS.preferences,
  STORAGE_KEYS.deletedAquariums,
]);

function isRestorableKey(key: string): boolean {
  return RESTORE_KEYS.has(key) || QUARANTINE_KEY_PATTERN.test(key);
}

/** Dizi tutan anahtarlar boşaltılırken `[]` yazılır; anahtar yok olursa açılışta örnek (demo) veri gösterilirdi. */
const ARRAY_KEYS = new Set<string>([...Object.values(COLLECTION_KEYS), STORAGE_KEYS.deletedAquariums]);

/**
 * Günlükteki yazmaları uygular. Aynı veri depoda iki kez durmasın diye (günlükte ve anahtarda) önce hedef anahtarlar
 * boşaltılır, sonra her yazmadan sonra günlük o yazma çıkarılarak küçültülür. Eski değerler kaybolmaz: yerine geçecek
 * değerler günlükte durur ve kullanıcı değiştirmeyi onaylamıştır. Yinelenebilir: yarıda kalırsa açılışta kalan
 * yazmalar aynı sırayla yeniden uygulanır. Günlükte izin verilmeyen bir anahtar varsa ona dokunulmaz.
 */
function applyRestoreWrites(store: StorageArea, journal: RestoreBackupJournal): boolean {
  const pending = journal.writes.filter((write) => isRestorableKey(write.key));
  for (const write of pending) {
    if (!hasStoredKey(store, write.key)) continue;
    try {
      if (ARRAY_KEYS.has(write.key)) store.setItem(write.key, "[]");
      else store.removeItem(write.key);
    } catch {
      return false;
    }
  }
  for (let index = 0; index < pending.length; index += 1) {
    const write = pending[index];
    try {
      if (write.value === null) store.removeItem(write.key);
      else store.setItem(write.key, write.value);
    } catch {
      return false;
    }
    try {
      writeControlled(store, STORAGE_KEYS.journal, { ...journal, writes: pending.slice(index + 1) });
    } catch {
      // Küçültme yazılamazsa günlük büyük kalır; yazmalar yinelenebilir olduğu için sonuç değişmez.
    }
  }
  return true;
}

/** En büyük değer: karakter sayısına ve UTF-8 bayt sayısına göre ayrı ayrı (tarayıcılar boyutu farklı sayabilir). */
function largestValues(journal: RestoreBackupJournal): string[] {
  const encoder = new TextEncoder();
  let byChars = "";
  let byBytes = "";
  let maxBytes = 0;
  for (const write of journal.writes) {
    if (write.value === null) continue;
    if (write.value.length > byChars.length) byChars = write.value;
    const bytes = encoder.encode(write.value).length;
    if (bytes > maxBytes) {
      maxBytes = bytes;
      byBytes = write.value;
    }
  }
  return byChars === byBytes ? [byChars] : [byChars, byBytes];
}

/**
 * Günlük yazılmadan ÖNCE: günlük ile en büyük değer birlikte sığıyor mu? Geçici anahtara günlüğün metni ile en büyük
 * değerin kendisi yazılıp hemen silinir; karakter ve bayt ölçüsüne göre seçilen değerler farklıysa her biri ayrı ayrı
 * sınanır (toplamları değil: aynı anda depoda yalnız biri fazladan durur). Uygulama
 * sırasında depo en çok "günlük + en büyük değer" kadar dolar (hedefler önce boşaltılır, günlük her yazmada küçülür);
 * bu, sınama anındaki doluluğu aşmaz. Sınama günlükten önce yapıldığı için yarıda kalırsa ortada günlük yoktur: hiçbir
 * şey değişmemiştir ve açılış geçici anahtarı siler (`recoverPendingJournal`).
 */
function hasRoomForRestore(store: StorageArea, journalText: string, journal: RestoreBackupJournal): boolean {
  for (const largest of largestValues(journal)) {
    try {
      store.setItem(RESTORE_PROBE_KEY, journalText + largest);
    } catch {
      try {
        store.removeItem(RESTORE_PROBE_KEY);
      } catch {
        // Açılış yeniden silmeyi dener.
      }
      return false;
    }
  }
  try {
    store.removeItem(RESTORE_PROBE_KEY);
    return true;
  } catch {
    // Kaldırılamadıysa yer kaplıyor demektir; geri yükleme başlamaz, açılış anahtarı yeniden silmeyi dener.
    return false;
  }
}

/**
 * Silinen akvaryum arşivini HİÇBİR ŞEY YAZMADAN okur (geri yükleme reddedilirse "hiçbir şey değiştirilmedi" doğru
 * kalsın). Arşiv bozuksa okunamadı döner; normal yükleme (`loadDeletedAquariums`) onu karantinaya alıp onarır.
 */
function readEntriesWithoutRepair(store: StorageArea): ReadOutcome<DeletedAquariumEntry> {
  try {
    const raw = store.getItem(STORAGE_KEYS.deletedAquariums);
    if (raw === null) return { ok: true, rows: [] };
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every((entry) => deletedAquariumEntrySchema.safeParse(entry).success)) return { ok: false };
    return { ok: true, rows: parsed as DeletedAquariumEntry[] };
  } catch {
    return { ok: false };
  }
}

function removeJournal(store: StorageArea): boolean {
  try {
    store.removeItem(STORAGE_KEYS.journal);
    return true;
  } catch {
    return false;
  }
}

const RESTORE_ORDER: CollectionName[] = ["aquariums", "waterReadings", "maintenanceTasks", "livestock", "plants", "equipment"];

/**
 * Bu cihazdaki altı koleksiyonun ve tercihlerin yerine yedektekileri koyar.
 *
 * Silinen akvaryum arşivi değiştirilmez, birleştirilir: cihazdaki paketler korunur, yedekteki eksik paketler eklenir.
 * Cihazdaki karantina kayıtları korunur; yedekteki karantina kayıtları yalnız cihazda yoksa eklenir.
 *
 * Sıra: yer sınaması (günlük + en büyük değer) → günlük (yazılacak her değerin tamamı) → hedef anahtarlar boşaltılır →
 * yazmalar (günlük her adımda küçülür) → günlük silinir. Yer yetmezse ya da günlük yazılamazsa hiçbir şey değişmez;
 * arşiv okuması da yazmaz. Yarıda kalırsa (çökme, geçici hata) günlük durur; normal kaydetmeler yazamaz ve uygulama
 * sonraki açılışta kalan yazmaları uygular.
 * Çağıran taraf, başarıdan sonra sayfayı yeniden yükler; bellekteki eski veri depoya geri yazılmamalıdır.
 */
export function restoreFromBackup(payload: RestorePayload, now: Date = new Date()): RestoreResult {
  const store = area();
  if (!store) return { status: "unavailable" };
  if (hasPendingJournal()) return { status: "refused", reason: "journal-pending" };

  const trash = readEntriesWithoutRepair(store);
  if (!trash.ok) return { status: "refused", reason: "trash-unreadable" };
  const mergedTrash = [...trash.rows];
  for (const entry of payload.deletedAquariums) {
    if (!mergedTrash.some((kept) => sameEntry(kept, entry))) mergedTrash.push(entry);
  }

  let journal: RestoreBackupJournal;
  let journalText: string;
  try {
    const writes: RestoreBackupJournal["writes"] = [
      ...RESTORE_ORDER.map((name) => ({ key: COLLECTION_KEYS[name], value: JSON.stringify(payload.collections[name]) })),
      { key: STORAGE_KEYS.preferences, value: payload.preferences === undefined ? null : JSON.stringify(payload.preferences) },
      { key: STORAGE_KEYS.deletedAquariums, value: JSON.stringify(mergedTrash) },
      ...payload.quarantine
        .filter((entry) => QUARANTINE_KEY_PATTERN.test(entry.key) && !hasStoredKey(store, entry.key))
        .map((entry) => ({ key: entry.key, value: entry.raw })),
    ];
    journal = { op: "restore-backup", startedAt: now.toISOString(), writes };
    journalText = JSON.stringify(journal);
  } catch {
    // Yazıya dökülemeyen içerik (ör. aşırı iç içe değer): depoya hiçbir şey yazılmadı.
    return { status: "refused", reason: "unserializable" };
  }

  // Yıkıcı hiçbir yazma, yer yettiği anlaşılmadan ve yazılacak değerlerin tamamı günlükte durmadan önce yapılmaz.
  if (!hasRoomForRestore(store, journalText, journal)) return { status: "refused", reason: "not-enough-space" };
  try {
    store.setItem(STORAGE_KEYS.journal, journalText);
  } catch {
    return { status: "refused", reason: "journal-write-failed" };
  }

  if (!applyRestoreWrites(store, journal) || !removeJournal(store)) {
    recordIssue({ key: STORAGE_KEYS.journal, kind: "restore-incomplete" });
    return { status: "incomplete" };
  }
  return { status: "completed" };
}

// --- Yedek durumu ve hatırlatma --------------------------------------------

const DAY_MS = 24 * 60 * 60 * 1000;

/** Son yedeğin zamanı ve hatırlatmanın ertelenmesi. Kayıt yoksa ya da okunamıyorsa boş durum döner (kullanıcı verisi değildir). */
export function loadBackupStatus(): BackupStatus {
  const store = area();
  if (!store) return {};
  try {
    const raw = store.getItem(STORAGE_KEYS.backupStatus);
    if (raw === null) return {};
    const parsed = backupStatusSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : {};
  } catch {
    return {};
  }
}

/** Yedek indirildiğinde çağrılır; ertelemeyi de kaldırır. */
export function recordBackupExport(now: Date = new Date()): boolean {
  const status: BackupStatus = { lastExportAt: now.toISOString() };
  return writeGuarded(STORAGE_KEYS.backupStatus, status);
}

/** "Sonra hatırlat": hatırlatma `BACKUP_REMINDER_DAYS` gün gösterilmez. */
export function snoozeBackupReminder(now: Date = new Date()): boolean {
  const status: BackupStatus = { ...loadBackupStatus(), remindAfter: new Date(now.getTime() + BACKUP_REMINDER_DAYS * DAY_MS).toISOString() };
  return writeGuarded(STORAGE_KEYS.backupStatus, status);
}

/** Son yedekten bu yana geçen tam gün; hiç yedek alınmadıysa ya da zaman okunamıyorsa `undefined`. */
export function daysSinceBackup(status: BackupStatus, now: Date = new Date()): number | undefined {
  if (!status.lastExportAt) return undefined;
  const last = new Date(status.lastExportAt).getTime();
  if (Number.isNaN(last)) return undefined;
  return Math.max(0, Math.floor((now.getTime() - last) / DAY_MS));
}

/**
 * Yedek hatırlatması gösterilsin mi? Yalnızca bu cihazda kalıcı kullanıcı verisi varken; hiç yedek alınmadıysa ya da son
 * yedekten bu yana `BACKUP_REMINDER_DAYS` gün geçtiyse. "Sonra hatırlat" denmişse o süre dolana kadar gösterilmez.
 */
export function shouldRemindBackup(hasData: boolean, status: BackupStatus, now: Date = new Date()): boolean {
  if (!hasData) return false;
  if (status.remindAfter) {
    const until = new Date(status.remindAfter).getTime();
    if (!Number.isNaN(until) && now.getTime() < until) return false;
  }
  const days = daysSinceBackup(status, now);
  return days === undefined || days >= BACKUP_REMINDER_DAYS;
}

/** Kalıcı kullanıcı verisi var mı? Demo koleksiyonlar `persistedOnly` ile zaten boşaltılmıştır. */
export function hasUserData(snapshot: AquariumDataSnapshot): boolean {
  return Object.values(snapshot).some((rows) => rows.length > 0);
}

// --- Yetim kayıtlar ve dışa aktarma ----------------------------------------

/** Var olmayan bir akvaryuma bağlı alt kayıtlar. Otomatik silinmez; raporlanır. */
export function findOrphans(snapshot: AquariumDataSnapshot): OrphanRecords {
  const ids = new Set(snapshot.aquariums.map((item) => item.id));
  return {
    waterReadings: snapshot.waterReadings.filter((row) => !ids.has(row.aquariumId)),
    maintenanceTasks: snapshot.maintenanceTasks.filter((row) => !ids.has(row.aquariumId)),
    livestock: snapshot.livestock.filter((row) => !ids.has(row.aquariumId)),
    plants: snapshot.plants.filter((row) => !ids.has(row.aquariumId)),
    equipment: snapshot.equipment.filter((row) => !ids.has(row.aquariumId)),
  };
}

export function countOrphans(orphans: OrphanRecords): number {
  return (
    orphans.waterReadings.length +
    orphans.maintenanceTasks.length +
    orphans.livestock.length +
    orphans.plants.length +
    orphans.equipment.length
  );
}

/** Depodaki karantina anahtarları ve ham içerikleri (yedeğin eksiksiz kalması için). */
export function collectQuarantineEntries(): QuarantineEntry[] {
  const store = area();
  if (!store) return [];

  const entries: QuarantineEntry[] = [];
  for (let index = 0; index < store.length; index += 1) {
    const key = store.key(index);
    if (!key || !key.includes(`:${QUARANTINE_SUFFIX}:`)) continue;
    const raw = store.getItem(key);
    if (raw !== null) entries.push({ key, raw });
  }
  return entries;
}

/**
 * Dışa aktarma nesnesini kurar. Ana koleksiyonlar yalnızca geçerli ve yetim
 * olmayan kullanıcı verisini taşır; yetimler, karantina ve silinen paketler
 * ayrı bölümlerdedir.
 */
export function buildLocalExport(
  snapshot: AquariumDataSnapshot,
  preferences: Preferences,
  now: Date = new Date(),
): LocalExportV1 {
  const ids = new Set(snapshot.aquariums.map((item) => item.id));
  const orphans = findOrphans(snapshot);
  const quarantineEntries = collectQuarantineEntries();
  const deleted = loadDeletedAquariums(now);

  const owned = <T extends { aquariumId: string }>(rows: T[]): T[] => rows.filter((row) => ids.has(row.aquariumId));

  const data: LocalExportV1 = {
    exportedAt: now.toISOString(),
    version: 1,
    [STORAGE_KEYS.aquariums]: snapshot.aquariums,
    [STORAGE_KEYS.waterReadings]: owned(snapshot.waterReadings),
    [STORAGE_KEYS.maintenance]: owned(snapshot.maintenanceTasks),
    [STORAGE_KEYS.livestock]: owned(snapshot.livestock),
    [STORAGE_KEYS.plants]: owned(snapshot.plants),
    [STORAGE_KEYS.equipment]: owned(snapshot.equipment),
    [STORAGE_KEYS.preferences]: preferences,
  };

  if (countOrphans(orphans) > 0) data.orphans = orphans;
  if (quarantineEntries.length > 0) data.quarantine = quarantineEntries;
  if (deleted.length > 0) data[STORAGE_KEYS.deletedAquariums] = deleted;

  return data;
}

// --- Hesaplama -------------------------------------------------------------

export function calculateGrossVolume(lengthCm: number, widthCm: number, heightCm: number) {
  return Math.round((lengthCm * widthCm * heightCm) / 1000);
}
