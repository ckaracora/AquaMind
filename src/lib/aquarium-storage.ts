import type { Aquarium, Equipment, Livestock, MaintenanceTask, Plant, WaterParameters } from "@/types/aquarium";

const STORAGE_KEY = "aquamind:aquariums:v1";
const WATER_STORAGE_KEY = "aquamind:water-readings:v1";
const MAINTENANCE_STORAGE_KEY = "aquamind:maintenance:v1";
const LIVESTOCK_STORAGE_KEY = "aquamind:livestock:v1";
const PLANT_STORAGE_KEY = "aquamind:plants:v1";
const EQUIPMENT_STORAGE_KEY = "aquamind:equipment:v1";

export function loadAquariums(fallback: Aquarium[]): Aquarium[] {
  if (typeof window === "undefined") return fallback;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Aquarium[]) : fallback;
  } catch {
    return fallback;
  }
}

export function saveAquariums(aquariums: Aquarium[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(aquariums));
}

export function loadWaterReadings(fallback: WaterParameters[]): WaterParameters[] {
  if (typeof window === "undefined") return fallback;
  try {
    const saved = window.localStorage.getItem(WATER_STORAGE_KEY);
    return saved ? (JSON.parse(saved) as WaterParameters[]) : fallback;
  } catch { return fallback; }
}

export function saveWaterReadings(readings: WaterParameters[]) {
  window.localStorage.setItem(WATER_STORAGE_KEY, JSON.stringify(readings));
}

export function loadMaintenanceTasks(fallback: MaintenanceTask[]): MaintenanceTask[] {
  if (typeof window === "undefined") return fallback;
  try { const saved = window.localStorage.getItem(MAINTENANCE_STORAGE_KEY); return saved ? JSON.parse(saved) as MaintenanceTask[] : fallback; }
  catch { return fallback; }
}

export function saveMaintenanceTasks(tasks: MaintenanceTask[]) {
  window.localStorage.setItem(MAINTENANCE_STORAGE_KEY, JSON.stringify(tasks));
}

export function loadLivestock(fallback: Livestock[]): Livestock[] {
  if (typeof window === "undefined") return fallback;
  try { const saved = window.localStorage.getItem(LIVESTOCK_STORAGE_KEY); return saved ? JSON.parse(saved) as Livestock[] : fallback; }
  catch { return fallback; }
}

export function saveLivestock(items: Livestock[]) {
  window.localStorage.setItem(LIVESTOCK_STORAGE_KEY, JSON.stringify(items));
}

export function loadPlants(fallback: Plant[]): Plant[] {
  if (typeof window === "undefined") return fallback;
  try { const saved = window.localStorage.getItem(PLANT_STORAGE_KEY); return saved ? JSON.parse(saved) as Plant[] : fallback; }
  catch { return fallback; }
}

export function savePlants(items: Plant[]) {
  window.localStorage.setItem(PLANT_STORAGE_KEY, JSON.stringify(items));
}

export function loadEquipment(fallback: Equipment[]): Equipment[] {
  if (typeof window === "undefined") return fallback;
  try { const saved = window.localStorage.getItem(EQUIPMENT_STORAGE_KEY); return saved ? JSON.parse(saved) as Equipment[] : fallback; }
  catch { return fallback; }
}

export function saveEquipment(items: Equipment[]) {
  window.localStorage.setItem(EQUIPMENT_STORAGE_KEY, JSON.stringify(items));
}

export function calculateGrossVolume(lengthCm: number, widthCm: number, heightCm: number) {
  return Math.round((lengthCm * widthCm * heightCm) / 1000);
}
