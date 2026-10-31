import type { Locale } from "@aquamind/localization";
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

// Demo kayıtların başka dildeki metinleri (karar 0021, 5. paket). Demo kayıtlar yalnız ekranda gösterilir, depoya yazılmaz; dil değişince
// hâlâ demo olan koleksiyonların satırları kimliğe göre bu metinlerle değiştirilir (aquarium-provider). Demo akvaryuma kayıt eklenip
// akvaryum gerçek veriye dönüşürse o anki dildeki adıyla kalır. Canlı adları katalog çevirisinden, bitki yerleşimleri dil dosyasından
// gösterildiği için burada yoktur.
type DemoCollection = "aquariums" | "maintenanceTasks" | "plants" | "equipment";
const demoSeeds: Record<DemoCollection, ReadonlyArray<{ id: string }>> = { aquariums, maintenanceTasks, plants, equipment };
const demoTexts: Record<Exclude<Locale, "tr">, Record<DemoCollection, Record<string, Record<string, string>>>> = {
  en: {
    aquariums: { "aqua-1": { name: "Amazon River", description: "Densely planted South American biotope" } },
    maintenanceTasks: { m1: { title: "30% water change" }, m2: { title: "Clean the filter's prefilter sponge" }, m3: { title: "Trim the background plants" } },
    plants: { p1: { name: "Amazon sword" } },
    equipment: { e1: { specifications: "1100 L/h" } },
  },
};

/** Demo satırlarını seçili dilin metinleriyle verir; demo olmayan satır olduğu gibi kalır. Değişiklik yoksa aynı dizi döner. */
export function localizeDemoRows<T extends { id: string }>(collection: DemoCollection, rows: T[], locale: Locale): T[] {
  let changed = false;
  const next = rows.map((row) => {
    const seed = demoSeeds[collection].find((item) => item.id === row.id) as T | undefined;
    if (!seed) return row;
    const localized = { ...seed, ...(locale === "tr" ? {} : demoTexts[locale][collection][row.id]) } as T;
    const keys = new Set([...Object.keys(localized), ...Object.keys(row)]);
    if ([...keys].every((key) => (localized as Record<string, unknown>)[key] === (row as Record<string, unknown>)[key])) return row;
    changed = true;
    return localized;
  });
  return changed ? next : rows;
}
