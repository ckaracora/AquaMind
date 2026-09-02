import type { Aquarium, Equipment, Livestock, WaterParameters } from "@aquamind/domain";
import { equipmentCatalog, speciesCatalog } from "@/data/catalog";
import {
  aquariums as seedAquariums,
  equipment as seedEquipment,
  livestock as seedLivestock,
  waterReadings as seedWaterReadings,
} from "@/data/mock-data";

// Altın karşılaştırma vakaları. Deterministiktir: katalog kimliğe göre sıralanır,
// tarih ve rastgelelik kullanılmaz. Vaka kümesi değişirse fikstür de bilinçli
// olarak yeniden üretilmelidir (bkz. golden.test.ts).

export interface GoldenCase {
  name: string;
  args: [Aquarium, Livestock[], Equipment[], WaterParameters?];
}

const aquarium = (overrides: Partial<Aquarium> = {}): Aquarium => ({
  id: "g",
  name: "G",
  type: "freshwater",
  lengthCm: 60,
  widthCm: 35,
  heightCm: 40,
  netVolumeLiters: 70,
  setupDate: "2026-01-01",
  ...overrides,
});

type SpeciesEntry = (typeof speciesCatalog)[number];
type EquipmentEntry = (typeof equipmentCatalog)[number];

const animal = (profile: SpeciesEntry, quantity: number): Livestock => ({
  id: `a-${profile.id}`,
  aquariumId: "g",
  catalogId: profile.id,
  commonName: profile.commonName,
  category: profile.category,
  quantity,
  addedAt: "2026-01-01",
});

const device = (profile: EquipmentEntry): Equipment => ({
  id: `d-${profile.id}`,
  aquariumId: "g",
  catalogId: profile.id,
  category: profile.category,
  brand: profile.brand,
  model: profile.model,
  installedAt: "2026-01-01",
});

const byId = <T extends { id: string }>(items: readonly T[]) => [...items].sort((a, b) => a.id.localeCompare(b.id));

export function buildGoldenCases(): GoldenCase[] {
  const cases: GoldenCase[] = [];
  const species = byId(speciesCatalog);

  for (const profile of species) {
    cases.push({
      name: `species-fit:${profile.id}`,
      args: [aquarium({ netVolumeLiters: profile.minVolumeL, lengthCm: profile.minTankLengthCm }), [animal(profile, profile.minGroup)], []],
    });
    cases.push({
      name: `species-tight:${profile.id}`,
      args: [
        aquarium({
          netVolumeLiters: Math.max(10, Math.round(profile.minVolumeL * 0.6)),
          lengthCm: Math.max(20, Math.round(profile.minTankLengthCm * 0.7)),
        }),
        [animal(profile, Math.max(1, profile.minGroup - 1))],
        [],
        { id: "w", aquariumId: "g", measuredAt: "2026-01-02", temperature: profile.temperature[1] + 3, ph: profile.ph[0] - 0.5 },
      ],
    });
  }

  const neon = species.find((profile) => profile.id === "neon-tetra");
  if (!neon) throw new Error("Altın vakalar için 'neon-tetra' katalogda bulunmalı");

  const filters = byId(equipmentCatalog.filter((item) => item.category === "filter")).slice(0, 60);
  const heaters = byId(equipmentCatalog.filter((item) => item.category === "heater")).slice(0, 30);
  const airPumps = byId(equipmentCatalog.filter((item) => item.category === "air_pump")).slice(0, 10);
  const spongeFilter = filters.find((item) => item.requiresAirPump) ?? filters[0];

  for (const filter of filters) cases.push({ name: `filter:${filter.id}`, args: [aquarium({ netVolumeLiters: 100, lengthCm: 80 }), [animal(neon, 8)], [device(filter)]] });
  for (const heater of heaters) cases.push({ name: `heater:${heater.id}`, args: [aquarium({ netVolumeLiters: 100, lengthCm: 80 }), [animal(neon, 8)], [device(heater)]] });
  for (const pump of airPumps) cases.push({ name: `air:${pump.id}`, args: [aquarium(), [animal(neon, 8)], [device(spongeFilter), device(pump)]] });

  for (let index = 0; index < species.length - 1; index += 5) {
    const first = species[index];
    const second = species[index + 1];
    cases.push({
      name: `pair:${first.id}+${second.id}`,
      args: [aquarium({ netVolumeLiters: 300, lengthCm: 120 }), [animal(first, first.minGroup), animal(second, second.minGroup)], []],
    });
  }

  cases.push({ name: "seed:mock-data", args: [seedAquariums[0], seedLivestock, seedEquipment, seedWaterReadings[0]] });
  cases.push({ name: "empty", args: [aquarium(), [], []] });

  return cases;
}
