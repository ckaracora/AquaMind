import type { Aquarium, Equipment, Livestock, MaintenanceTask, Plant, WaterParameters } from "@/types/aquarium";

export const aquariums: Aquarium[] = [{
  id: "aqua-1",
  name: "Amazon Nehri",
  type: "freshwater",
  lengthCm: 100,
  widthCm: 45,
  heightCm: 50,
  netVolumeLiters: 180,
  setupDate: "2024-03-12",
  description: "Yoğun bitkili Güney Amerika biyotopu",
}];

export const waterReadings: WaterParameters[] = [
  { id: "w1", aquariumId: "aqua-1", measuredAt: "2026-08-17T09:30:00+03:00", temperature: 25.4, ph: 6.8, gh: 7, kh: 4, tds: 182, nitrate: 12 },
  { id: "w2", aquariumId: "aqua-1", measuredAt: "2026-08-10T10:00:00+03:00", temperature: 25.1, ph: 6.9, gh: 7, kh: 4, tds: 176, nitrate: 10 },
  { id: "w3", aquariumId: "aqua-1", measuredAt: "2026-08-03T09:45:00+03:00", temperature: 25.6, ph: 6.7, gh: 8, kh: 4, tds: 188, nitrate: 15 },
];

export const maintenanceTasks: MaintenanceTask[] = [
  { id: "m1", aquariumId: "aqua-1", type: "water_change", title: "%30 su değişimi", dueAt: "2026-08-19T18:00:00+03:00", recurrenceDays: 7, amountPercent: 30 },
  { id: "m2", aquariumId: "aqua-1", type: "filter_cleaning", title: "Filtre ön süngerini temizle", dueAt: "2026-08-23T12:00:00+03:00", recurrenceDays: 21 },
  { id: "m3", aquariumId: "aqua-1", type: "trimming", title: "Arka plan bitkilerini buda", dueAt: "2026-08-26T19:00:00+03:00", recurrenceDays: 14 },
];

export const livestock: Livestock[] = [
  { id: "l1", aquariumId: "aqua-1", commonName: "Neon tetra", scientificName: "Paracheirodon innesi", category: "fish", quantity: 16, gender: "mixed", addedAt: "2024-03-28", catalogId:"neon-tetra" },
  { id: "l2", aquariumId: "aqua-1", commonName: "Cüce vatoz", scientificName: "Ancistrus cirrhosus", category: "fish", quantity: 2, gender: "mixed", addedAt: "2024-04-02", catalogId:"ancistrus" },
  { id: "l3", aquariumId: "aqua-1", commonName: "Amano karides", scientificName: "Caridina multidentata", category: "shrimp", quantity: 6, gender: "unknown", addedAt: "2024-04-12", catalogId:"amano-shrimp" },
];

export const plants: Plant[] = [
  { id: "p1", aquariumId: "aqua-1", name: "Amazon kılıcı", scientificName: "Echinodorus grisebachii", quantity: 2, position: "Arka plan", addedAt: "2024-03-12" },
  { id: "p2", aquariumId: "aqua-1", name: "Anubias Nana", scientificName: "Anubias barteri var. nana", quantity: 4, position: "Orta plan", addedAt: "2024-03-12" },
  { id: "p3", aquariumId: "aqua-1", name: "Java moss", scientificName: "Taxiphyllum barbieri", quantity: 2, position: "Kök üzeri", addedAt: "2024-03-15" },
];

export const equipment: Equipment[] = [
  { id: "e1", aquariumId: "aqua-1", category: "filter", brand: "Oase", model: "BioMaster 350", installedAt: "2024-03-12", specifications: "1100 L/saat", catalogId:"oase-biomaster-350" },
  { id: "e2", aquariumId: "aqua-1", category: "lighting", brand: "Chihiros", model: "WRGB II 90", installedAt: "2024-03-12", specifications: "100 W", catalogId:"chihiros-wrgb2-90" },
  { id: "e3", aquariumId: "aqua-1", category: "co2", brand: "ISTA", model: "2L Set", installedAt: "2024-03-18" },
];
