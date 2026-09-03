import { z } from "zod";
import {
  aquariumSchema,
  equipmentSchema,
  livestockSchema,
  maintenanceTaskSchema,
  plantSchema,
  waterParametersSchema,
} from "./schemas";
import { preferencesSchema } from "./preferences";
import { deletedAquariumEntrySchema } from "./local-storage";

// LocalExportV1: Ayarlar sayfasındaki "Verileri dışa aktar" düğmesinin ürettiği
// JSON biçimi. `aquamind:` önekli anahtar adları dışa aktarma biçiminin parçasıdır.
// Bilinmeyen anahtarlar atılmaz (gevşek nesne), böylece eski yedekler de geçerli kalır.
//
// Sürüm 1 korunur: aşağıdaki yeni bölümlerin tamamı isteğe bağlıdır, dolayısıyla
// daha önce alınmış yedekler bu şemayla doğrulanmaya devam eder.
//
// Ana koleksiyonlar yalnızca geçerli ve yetim olmayan kullanıcı verisini taşır.
// Yetim kayıtlar, karantinaya alınmış ham değerler ve silinen akvaryum paketleri
// ayrı ve etiketli bölümlerde durur; böylece yedek eksiksiz kalırken gerçek
// kullanıcı verisine karışmazlar.

export const LOCAL_EXPORT_VERSION = 1 as const;

/** Bir akvaryuma bağlı olmayan (yetim) alt kayıtlar. */
export const orphanRecordsSchema = z.object({
  waterReadings: z.array(waterParametersSchema),
  maintenanceTasks: z.array(maintenanceTaskSchema),
  livestock: z.array(livestockSchema),
  plants: z.array(plantSchema),
  equipment: z.array(equipmentSchema),
});

export type OrphanRecords = z.infer<typeof orphanRecordsSchema>;

/** Karantinaya alınmış ham değer; içerik kullanıcıya gösterilmez, yalnızca yedeğe girer. */
export const quarantineEntrySchema = z.object({
  key: z.string(),
  raw: z.string(),
});

export type QuarantineEntry = z.infer<typeof quarantineEntrySchema>;

export const localExportV1Schema = z.looseObject({
  exportedAt: z.string(),
  version: z.literal(LOCAL_EXPORT_VERSION),

  // Gerçek kullanıcı verisi
  "aquamind:aquariums:v1": z.array(aquariumSchema).optional(),
  "aquamind:water-readings:v1": z.array(waterParametersSchema).optional(),
  "aquamind:maintenance:v1": z.array(maintenanceTaskSchema).optional(),
  "aquamind:livestock:v1": z.array(livestockSchema).optional(),
  "aquamind:plants:v1": z.array(plantSchema).optional(),
  "aquamind:equipment:v1": z.array(equipmentSchema).optional(),
  "aquamind:preferences:v1": preferencesSchema.optional(),

  // Ayrı ve etiketli bölümler
  "aquamind:deleted-aquariums:v1": z.array(deletedAquariumEntrySchema).optional(),
  orphans: orphanRecordsSchema.optional(),
  quarantine: z.array(quarantineEntrySchema).optional(),
});

export type LocalExportV1 = z.infer<typeof localExportV1Schema>;
