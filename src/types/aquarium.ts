export type AquariumType = "freshwater" | "saltwater" | "brackish";

export interface WaterParameters {
  id: string;
  aquariumId: string;
  measuredAt: string;
  temperature?: number;
  ph?: number;
  gh?: number;
  kh?: number;
  tds?: number;
  ammonia?: number;
  nitrite?: number;
  nitrate?: number;
  phosphate?: number;
  iron?: number;
}

export type MaintenanceType =
  | "water_change" | "glass_cleaning" | "filter_cleaning"
  | "filter_media_change" | "trimming" | "fertilizing"
  | "co2_refill" | "medication" | "note";

export interface MaintenanceTask {
  id: string;
  aquariumId: string;
  type: MaintenanceType;
  title: string;
  dueAt: string;
  completedAt?: string;
  recurrenceDays?: number;
  amountLiters?: number;
  amountPercent?: number;
  notes?: string;
}

export interface Aquarium {
  id: string;
  name: string;
  type: AquariumType;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  netVolumeLiters: number;
  setupDate: string;
  description?: string;
  imageUrl?: string;
}

export interface Livestock {
  id: string;
  aquariumId: string;
  commonName: string;
  scientificName?: string;
  category: "fish" | "shrimp" | "snail" | "other";
  quantity: number;
  gender?: "male" | "female" | "mixed" | "unknown";
  addedAt: string;
  notes?: string;
  imageUrl?: string;
}

export interface Plant {
  id: string;
  aquariumId: string;
  name: string;
  scientificName?: string;
  quantity: number;
  position?: string;
  addedAt: string;
  notes?: string;
  imageUrl?: string;
}

export interface Equipment {
  id: string;
  aquariumId: string;
  category: "filter" | "lighting" | "heater" | "co2" | "uv" | "air_pump" | "dosing_pump" | "other";
  brand?: string;
  model?: string;
  installedAt: string;
  specifications?: string;
  notes?: string;
}
