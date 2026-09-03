// @aquamind/domain — paylaşılan alan tipleri, doğrulama şemaları, tercihler,
// tarayıcı deposu sözleşmesi ve yerel dışa aktarma biçimi.
// Tipler `aquarium.ts` içinde, uygulamadaki eski `src/types/aquarium.ts` ile birebir aynıdır;
// uygulama o yolu tip köprüsü olarak kullanmaya devam eder.

export type {
  Aquarium,
  AquariumType,
  Equipment,
  Livestock,
  MaintenanceTask,
  MaintenanceType,
  Plant,
  WaterParameters,
} from "./aquarium";

export {
  aquariumSchema,
  aquariumTypeSchema,
  equipmentCategorySchema,
  equipmentSchema,
  livestockCategorySchema,
  livestockSchema,
  maintenanceTaskSchema,
  maintenanceTypeSchema,
  plantSchema,
  waterParametersSchema,
} from "./schemas";

export { DEFAULT_PREFERENCES, preferencesSchema } from "./preferences";
export type { Preferences } from "./preferences";

export {
  DELETED_AQUARIUM_RETENTION_DAYS,
  EMPTY_JOURNAL_STEPS,
  QUARANTINE_SUFFIX,
  STORAGE_KEYS,
  aquariumChildrenSchema,
  deleteAquariumJournalSchema,
  deletedAquariumEntrySchema,
  journalStepsSchema,
} from "./local-storage";
export type {
  AquariumChildren,
  DeleteAquariumJournal,
  DeletedAquariumEntry,
  JournalSteps,
  StorageKey,
} from "./local-storage";

export { LOCAL_EXPORT_VERSION, localExportV1Schema, orphanRecordsSchema, quarantineEntrySchema } from "./local-export";
export type { LocalExportV1, OrphanRecords, QuarantineEntry } from "./local-export";
