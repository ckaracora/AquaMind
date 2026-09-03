// KORUYUCU (REGRESYON) TESTLERİ — Issue #8, Adım 0.
//
// Bu testler depolama katmanı DEĞİŞMEDEN önce yazıldı ve yalnızca KORUNMASI
// gereken davranışı sabitler:
//   - geçerli kullanıcı verisinin yükleme/kaydetme gidiş-dönüşü
//   - eksik anahtarda fallback
//   - sunucu tarafında (window yok) fallback
//   - anahtar adları
//   - bilinmeyen/ek alanların kaybolmaması
//   - `calculateGrossVolume`
//
// Bilinçli olarak sabitlenmeyen davranışlar (Issue #8 kapsamında değişecek):
//   - bozuk JSON'da tohum/demo veriye düşülmesi
//   - bozuk anahtarın üstüne yazılması
// Bunlar için ayrı testler, davranış değiştikten sonra eklenir.

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  calculateGrossVolume,
  loadAquariums,
  loadEquipment,
  loadLivestock,
  loadMaintenanceTasks,
  loadPlants,
  loadWaterReadings,
  saveAquariums,
  saveEquipment,
  saveLivestock,
  saveMaintenanceTasks,
  savePlants,
  saveWaterReadings,
} from "@/lib/aquarium-storage";
import type {
  Aquarium,
  Equipment,
  Livestock,
  MaintenanceTask,
  Plant,
  WaterParameters,
} from "@/types/aquarium";
import { FakeLocalStorage, installFakeLocalStorage, removeFakeLocalStorage } from "./fake-local-storage";

let storage: FakeLocalStorage;

beforeEach(() => {
  storage = installFakeLocalStorage();
});

afterEach(() => {
  removeFakeLocalStorage();
});

const aquarium: Aquarium = {
  id: "a-1",
  name: "Amazon",
  type: "freshwater",
  lengthCm: 100,
  widthCm: 45,
  heightCm: 50,
  netVolumeLiters: 180,
  setupDate: "2026-03-12",
  description: "Bitkili biyotop",
};

const waterReading: WaterParameters = {
  id: "w-1",
  aquariumId: "a-1",
  measuredAt: "2026-08-17T09:30:00+03:00",
  temperature: 25.4,
  ph: 6.8,
  gh: 7,
  kh: 4,
  tds: 182,
  nitrate: 12,
};

const maintenanceTask: MaintenanceTask = {
  id: "m-1",
  aquariumId: "a-1",
  type: "water_change",
  title: "%30 su değişimi",
  dueAt: "2026-08-19T18:00:00+03:00",
  recurrenceDays: 7,
  amountPercent: 30,
};

const livestock: Livestock = {
  id: "l-1",
  aquariumId: "a-1",
  commonName: "Neon tetra",
  scientificName: "Paracheirodon innesi",
  category: "fish",
  quantity: 16,
  gender: "mixed",
  addedAt: "2026-03-28",
  catalogId: "neon-tetra",
};

const plant: Plant = {
  id: "p-1",
  aquariumId: "a-1",
  name: "Anubias Nana",
  scientificName: "Anubias barteri var. nana",
  quantity: 4,
  position: "Orta plan",
  addedAt: "2026-03-12",
};

const equipment: Equipment = {
  id: "e-1",
  aquariumId: "a-1",
  category: "filter",
  brand: "Oase",
  model: "BioMaster 350",
  installedAt: "2026-03-12",
  specifications: "1100 L/saat",
  catalogId: "oase-biomaster-350",
};

const collections = [
  { name: "akvaryumlar", key: "aquamind:aquariums:v1", save: saveAquariums, load: loadAquariums, row: aquarium },
  { name: "su ölçümleri", key: "aquamind:water-readings:v1", save: saveWaterReadings, load: loadWaterReadings, row: waterReading },
  { name: "bakım görevleri", key: "aquamind:maintenance:v1", save: saveMaintenanceTasks, load: loadMaintenanceTasks, row: maintenanceTask },
  { name: "canlılar", key: "aquamind:livestock:v1", save: saveLivestock, load: loadLivestock, row: livestock },
  { name: "bitkiler", key: "aquamind:plants:v1", save: savePlants, load: loadPlants, row: plant },
  { name: "ekipmanlar", key: "aquamind:equipment:v1", save: saveEquipment, load: loadEquipment, row: equipment },
] as const;

describe("depolama katmanı — korunması gereken davranış", () => {
  for (const collection of collections) {
    describe(collection.name, () => {
      it("geçerli veriyi beklenen anahtara yazar ve aynen geri okur", () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (collection.save as (rows: any[]) => void)([collection.row]);

        expect(storage.keys()).toContain(collection.key);
        expect(storage.json(collection.key)).toEqual([collection.row]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((collection.load as (fallback: any[]) => unknown[])([])).toEqual([collection.row]);
      });

      it("anahtar yoksa fallback döner ve hiçbir şey yazmaz", () => {
        const fallback = [collection.row];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((collection.load as (fallback: any[]) => unknown[])(fallback)).toEqual(fallback);
        expect(storage.setItemCalls).toHaveLength(0);
      });

      it("sunucu tarafında (window yok) fallback döner", () => {
        removeFakeLocalStorage();
        const fallback = [collection.row];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((collection.load as (fallback: any[]) => unknown[])(fallback)).toEqual(fallback);
      });

      it("kayıttaki bilinmeyen ek alanları kaybetmez", () => {
        const withExtra = { ...collection.row, notlarim: "kullanıcı notu", ekAlan: 42 };
        storage.seedJson(collection.key, [withExtra]);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const loaded = (collection.load as (fallback: any[]) => unknown[])([]);
        expect(loaded).toEqual([withExtra]);
      });

      it("boş diziyi boş dizi olarak korur", () => {
        storage.seedJson(collection.key, []);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((collection.load as (fallback: any[]) => unknown[])([collection.row])).toEqual([]);
      });
    });
  }

  it("koleksiyonlar birbirinin anahtarına yazmaz", () => {
    saveAquariums([aquarium]);
    saveLivestock([livestock]);

    expect(storage.json("aquamind:aquariums:v1")).toEqual([aquarium]);
    expect(storage.json("aquamind:livestock:v1")).toEqual([livestock]);
    expect(storage.keys().sort()).toEqual(["aquamind:aquariums:v1", "aquamind:livestock:v1"]);
  });
});

describe("calculateGrossVolume", () => {
  it("santimetre ölçülerini litreye çevirir ve yuvarlar", () => {
    expect(calculateGrossVolume(100, 45, 50)).toBe(225);
    expect(calculateGrossVolume(60, 35, 40)).toBe(84);
    expect(calculateGrossVolume(30, 20, 20)).toBe(12);
  });

  it("yarım litreyi yukarı yuvarlar", () => {
    expect(calculateGrossVolume(10, 10, 5)).toBe(1);
  });
});
