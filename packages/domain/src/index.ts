// @aquamind/domain — paylaşılan alan tipleri, doğrulama şemaları ve yerel dışa aktarma biçimi.
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

export { LOCAL_EXPORT_VERSION, localExportV1Schema } from "./local-export";
export type { LocalExportV1 } from "./local-export";
