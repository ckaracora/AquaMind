import type { Aquarium } from "@/types/aquarium";

const STORAGE_KEY = "aquamind:aquariums:v1";

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

export function calculateGrossVolume(lengthCm: number, widthCm: number, heightCm: number) {
  return Math.round((lengthCm * widthCm * heightCm) / 1000);
}
