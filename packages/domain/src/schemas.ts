import { z } from "zod";
import type {
  Aquarium,
  AquariumType,
  Equipment,
  Livestock,
  MaintenanceTask,
  MaintenanceType,
  Plant,
  WaterParameters,
} from "./aquarium";

// Bu şemalar `aquarium.ts` içindeki tipleri çalışma zamanında doğrular.
// Tek gerçek tanım tiplerdir; şemalar onları yansıtır ve dosyanın sonundaki
// tip denetimleri iki tarafın birbirinden sapmasını derleme anında engeller.
// Phase 0B'de şemalar yalnızca test ve gelecekteki içe/dışa aktarma sınırı
// içindir; `localStorage` davranışına bağlı değildir.

export const aquariumTypeSchema = z.enum(["freshwater", "saltwater", "brackish"]);

export const maintenanceTypeSchema = z.enum([
  "water_change",
  "glass_cleaning",
  "filter_cleaning",
  "filter_media_change",
  "trimming",
  "fertilizing",
  "co2_refill",
  "medication",
  "note",
]);

export const livestockCategorySchema = z.enum(["fish", "shrimp", "snail", "other"]);

export const equipmentCategorySchema = z.enum([
  "filter",
  "lighting",
  "heater",
  "co2",
  "uv",
  "air_pump",
  "dosing_pump",
  "other",
]);

export const waterParametersSchema = z.object({
  id: z.string(),
  aquariumId: z.string(),
  measuredAt: z.string(),
  temperature: z.number().optional(),
  ph: z.number().optional(),
  gh: z.number().optional(),
  kh: z.number().optional(),
  tds: z.number().optional(),
  ammonia: z.number().optional(),
  nitrite: z.number().optional(),
  nitrate: z.number().optional(),
  phosphate: z.number().optional(),
  iron: z.number().optional(),
});

export const maintenanceTaskSchema = z.object({
  id: z.string(),
  aquariumId: z.string(),
  type: maintenanceTypeSchema,
  title: z.string(),
  dueAt: z.string(),
  completedAt: z.string().optional(),
  recurrenceDays: z.number().optional(),
  amountLiters: z.number().optional(),
  amountPercent: z.number().optional(),
  notes: z.string().optional(),
});

export const aquariumSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: aquariumTypeSchema,
  lengthCm: z.number(),
  widthCm: z.number(),
  heightCm: z.number(),
  netVolumeLiters: z.number(),
  setupDate: z.string(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

export const livestockSchema = z.object({
  id: z.string(),
  aquariumId: z.string(),
  commonName: z.string(),
  scientificName: z.string().optional(),
  category: livestockCategorySchema,
  quantity: z.number(),
  gender: z.enum(["male", "female", "mixed", "unknown"]).optional(),
  addedAt: z.string(),
  notes: z.string().optional(),
  imageUrl: z.string().optional(),
  catalogId: z.string().optional(),
});

export const plantSchema = z.object({
  id: z.string(),
  aquariumId: z.string(),
  name: z.string(),
  scientificName: z.string().optional(),
  quantity: z.number(),
  position: z.string().optional(),
  addedAt: z.string(),
  notes: z.string().optional(),
  imageUrl: z.string().optional(),
});

export const equipmentSchema = z.object({
  id: z.string(),
  aquariumId: z.string(),
  category: equipmentCategorySchema,
  brand: z.string().optional(),
  model: z.string().optional(),
  installedAt: z.string(),
  specifications: z.string().optional(),
  notes: z.string().optional(),
  catalogId: z.string().optional(),
});

// Tip ve şema eşdeğerlik denetimleri: her şemanın çıktısı ilgili tipe, tip de
// şemanın çıktısına atanabilir olmalıdır. Biri değişip diğeri değişmezse `tsc`
// burada hata verir.
type MutuallyAssignable<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;
type Assert<T extends true> = T;

export type SchemaParityChecks = [
  Assert<MutuallyAssignable<z.infer<typeof aquariumTypeSchema>, AquariumType>>,
  Assert<MutuallyAssignable<z.infer<typeof maintenanceTypeSchema>, MaintenanceType>>,
  Assert<MutuallyAssignable<z.infer<typeof waterParametersSchema>, WaterParameters>>,
  Assert<MutuallyAssignable<z.infer<typeof maintenanceTaskSchema>, MaintenanceTask>>,
  Assert<MutuallyAssignable<z.infer<typeof aquariumSchema>, Aquarium>>,
  Assert<MutuallyAssignable<z.infer<typeof livestockSchema>, Livestock>>,
  Assert<MutuallyAssignable<z.infer<typeof plantSchema>, Plant>>,
  Assert<MutuallyAssignable<z.infer<typeof equipmentSchema>, Equipment>>,
];
