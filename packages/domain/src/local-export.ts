import { z } from "zod";
import {
  aquariumSchema,
  equipmentSchema,
  livestockSchema,
  maintenanceTaskSchema,
  plantSchema,
  waterParametersSchema,
} from "./schemas";

// LocalExportV1: Ayarlar sayfasındaki "Verileri dışa aktar" düğmesinin bugün
// ürettiği JSON biçimi. Sayfa, `aquamind:` önekli her localStorage anahtarını
// olduğu gibi bir özellik olarak yazar; bu yüzden anahtar adları burada dışa
// aktarma biçiminin parçası olarak geçer. Bilinmeyen `aquamind:*` anahtarları
// atılmaz (gevşek nesne), çünkü sayfa onları da yazar.
//
// Bu tanım hiçbir uygulama davranışını değiştirmez. Phase 1'deki
// "yerel verileri içe aktar" akışının doğrulama sınırıdır.

export const LOCAL_EXPORT_VERSION = 1 as const;

export const localExportV1Schema = z.looseObject({
  exportedAt: z.string(),
  version: z.literal(LOCAL_EXPORT_VERSION),
  "aquamind:aquariums:v1": z.array(aquariumSchema).optional(),
  "aquamind:water-readings:v1": z.array(waterParametersSchema).optional(),
  "aquamind:maintenance:v1": z.array(maintenanceTaskSchema).optional(),
  "aquamind:livestock:v1": z.array(livestockSchema).optional(),
  "aquamind:plants:v1": z.array(plantSchema).optional(),
  "aquamind:equipment:v1": z.array(equipmentSchema).optional(),
  "aquamind:preferences:v1": z.record(z.string(), z.unknown()).optional(),
});

export type LocalExportV1 = z.infer<typeof localExportV1Schema>;
