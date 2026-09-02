// Alan tipleri `packages/domain` içine taşındı (bkz. docs/ARCHITECTURE.md).
// Bu dosya mevcut `@/types/aquarium` içe aktarma yolunu koruyan tip köprüsüdür.
export type {
  Aquarium,
  AquariumType,
  Equipment,
  Livestock,
  MaintenanceTask,
  MaintenanceType,
  Plant,
  WaterParameters,
} from "@aquamind/domain";
