import { z } from "zod";
import {
  aquariumSchema,
  equipmentSchema,
  livestockSchema,
  maintenanceTaskSchema,
  plantSchema,
  waterParametersSchema,
} from "./schemas";

// Tarayıcı deposunun sözleşmesi: anahtar adları, silinen akvaryum paketi ve
// silme günlüğü (write-ahead journal). `localStorage` transaction desteklemediği
// için altı koleksiyon tek işlemde güncellenemez; günlük, yarıda kesilen bir
// silmenin sonraki açılışta güvenle tamamlanmasını sağlar.

/** Mevcut `:v1` anahtar adları. Bu adlar geriye uyumluluk için değişmez. */
export const STORAGE_KEYS = {
  aquariums: "aquamind:aquariums:v1",
  waterReadings: "aquamind:water-readings:v1",
  maintenance: "aquamind:maintenance:v1",
  livestock: "aquamind:livestock:v1",
  plants: "aquamind:plants:v1",
  equipment: "aquamind:equipment:v1",
  preferences: "aquamind:preferences:v1",
  journal: "aquamind:journal:v1",
  deletedAquariums: "aquamind:deleted-aquariums:v1",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

/** Bozuk ham değerin taşındığı anahtarın eki: `<anahtar>:corrupt:<ISO>`. */
export const QUARANTINE_SUFFIX = "corrupt";

/** Silinen akvaryum paketinin saklanma süresi (gün). */
export const DELETED_AQUARIUM_RETENTION_DAYS = 30;

/** Bir akvaryuma bağlı tüm alt kayıtlar. */
export const aquariumChildrenSchema = z.object({
  waterReadings: z.array(waterParametersSchema),
  maintenanceTasks: z.array(maintenanceTaskSchema),
  livestock: z.array(livestockSchema),
  plants: z.array(plantSchema),
  equipment: z.array(equipmentSchema),
});

export type AquariumChildren = z.infer<typeof aquariumChildrenSchema>;

/** Silinen bir akvaryumun tam paketi; kurtarma penceresi boyunca saklanır. */
export const deletedAquariumEntrySchema = z.object({
  aquarium: aquariumSchema,
  children: aquariumChildrenSchema,
  deletedAt: z.string(),
  purgeAfter: z.string(),
});

export type DeletedAquariumEntry = z.infer<typeof deletedAquariumEntrySchema>;

/** Günlükteki adım bayrakları; her biri ilgili yazma tamamlandığında işaretlenir. */
export const journalStepsSchema = z.object({
  trash: z.boolean(),
  aquariums: z.boolean(),
  waterReadings: z.boolean(),
  maintenance: z.boolean(),
  livestock: z.boolean(),
  plants: z.boolean(),
  equipment: z.boolean(),
});

export type JournalSteps = z.infer<typeof journalStepsSchema>;

/**
 * Yazma öncesi günlük. Silinecek kayıtların tamamını (`entry`) içerir; bu yüzden
 * yıkıcı hiçbir yazma, veri kalıcı bir yerde durmadan önce gerçekleşmez.
 */
export const deleteAquariumJournalSchema = z.object({
  op: z.literal("delete-aquarium"),
  aquariumId: z.string(),
  startedAt: z.string(),
  entry: deletedAquariumEntrySchema,
  steps: journalStepsSchema,
});

export type DeleteAquariumJournal = z.infer<typeof deleteAquariumJournalSchema>;

export const EMPTY_JOURNAL_STEPS: JournalSteps = {
  trash: false,
  aquariums: false,
  waterReadings: false,
  maintenance: false,
  livestock: false,
  plants: false,
  equipment: false,
};
