import type { Aquarium, MaintenanceTask, WaterParameters } from "@/types/aquarium";

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
