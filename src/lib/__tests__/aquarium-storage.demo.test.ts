// Issue #8 — Codex bulgusu 1: demo (tohum) verinin takibi.
//
// Kural: bir koleksiyon depoda yoksa tohum veri YALNIZCA ekranda gösterilir.
// Bu kayıtlar ne kalıcı depoya ne de JSON yedeğinin ana koleksiyonlarına girer.
// Kullanıcının açık bir değişikliği yalnızca o değişikliği (ve gerekiyorsa ait
// olduğu akvaryumu) gerçek veriye dönüştürür; dokunulmamış demo kayıtlar taşınmaz.

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { DEFAULT_PREFERENCES, STORAGE_KEYS } from "@aquamind/domain";
import {
  buildLocalExport,
  clearStorageIssues,
  endStorageSuspension,
  hydrateFromStorage,
  isStorageSuspended,
  persistedOnly,
  saveAquariums,
  type AquariumDataSnapshot,
  type DemoFlags,
} from "@/lib/aquarium-storage";
import {
  aquariums as seedAquariums,
  equipment as seedEquipment,
  livestock as seedLivestock,
  maintenanceTasks as seedMaintenanceTasks,
  plants as seedPlants,
  waterReadings as seedWaterReadings,
} from "@/data/mock-data";
import type { Aquarium } from "@/types/aquarium";
import { FakeLocalStorage, installFakeLocalStorage, removeFakeLocalStorage } from "./fake-local-storage";

let storage: FakeLocalStorage;

beforeEach(() => {
  storage = installFakeLocalStorage();
  clearStorageIssues();
});

afterEach(() => {
  while (isStorageSuspended()) endStorageSuspension();
  removeFakeLocalStorage();
  clearStorageIssues();
});

const seed: AquariumDataSnapshot = {
  aquariums: seedAquariums,
  waterReadings: seedWaterReadings,
  maintenanceTasks: seedMaintenanceTasks,
  livestock: seedLivestock,
  plants: seedPlants,
  equipment: seedEquipment,
};

const realAquarium: Aquarium = {
  id: "gercek-1",
  name: "Benim akvaryumum",
  type: "freshwater",
  lengthCm: 60,
  widthCm: 35,
  heightCm: 40,
  netVolumeLiters: 70,
  setupDate: "2026-09-03",
};

/** Yedeğin tamamında demo kimliklerinin geçip geçmediğini arar. */
function backupContainsDemoIds(data: unknown): boolean {
  const serialized = JSON.stringify(data);
  return ["aqua-1", "w1", "w2", "w3", "m1", "m2", "m3", "l1", "l2", "l3", "p1", "p2", "p3", "e1", "e2", "e3"].some((id) =>
    serialized.includes(`"${id}"`),
  );
}

describe("demo veri takibi", () => {
  it("taze boş depoda tüm koleksiyonlar demo olarak işaretlenir", () => {
    const { snapshot, demo } = hydrateFromStorage(seed);

    expect(demo).toEqual({
      aquariums: true,
      waterReadings: true,
      maintenanceTasks: true,
      livestock: true,
      plants: true,
      equipment: true,
    });
    expect(snapshot.aquariums).toEqual(seedAquariums);
    // Hidrasyon hiçbir şey yazmaz.
    expect(storage.setItemCalls).toHaveLength(0);
  });

  it("depoda olan koleksiyon demo sayılmaz, olmayan demo kalır", () => {
    storage.seedJson(STORAGE_KEYS.aquariums, [realAquarium]);

    const { snapshot, demo } = hydrateFromStorage(seed);

    expect(demo.aquariums).toBe(false);
    expect(snapshot.aquariums).toEqual([realAquarium]);
    expect(demo.livestock).toBe(true);
    expect(snapshot.livestock).toEqual(seedLivestock);
  });

  it("anahtar bozuk olsa bile koleksiyon gerçek veri sayılır; demo geri gelmez", () => {
    storage.seedRaw(STORAGE_KEYS.aquariums, "{bozuk");

    const { snapshot, demo } = hydrateFromStorage(seed);

    expect(demo.aquariums).toBe(false);
    expect(snapshot.aquariums).toEqual([]);
  });

  it("persistedOnly demo koleksiyonları boşaltır", () => {
    const demo: DemoFlags = { ...({} as DemoFlags), aquariums: false, waterReadings: true, maintenanceTasks: true, livestock: true, plants: true, equipment: true };
    const displayed: AquariumDataSnapshot = { ...seed, aquariums: [realAquarium] };

    const persisted = persistedOnly(displayed, demo);

    expect(persisted.aquariums).toEqual([realAquarium]);
    expect(persisted.waterReadings).toEqual([]);
    expect(persisted.livestock).toEqual([]);
  });
});

describe("demo veri yedeğe girmez", () => {
  it("taze boş depoda dışa aktarma demo kimliklerini içermez", () => {
    const { snapshot, demo } = hydrateFromStorage(seed);

    const data = buildLocalExport(persistedOnly(snapshot, demo), DEFAULT_PREFERENCES);

    expect(data[STORAGE_KEYS.aquariums]).toEqual([]);
    expect(data[STORAGE_KEYS.waterReadings]).toEqual([]);
    expect(data[STORAGE_KEYS.livestock]).toEqual([]);
    expect(backupContainsDemoIds(data)).toBe(false);
  });

  it("taze depoda gerçek kayıt eklenince yalnızca o kayıt kalıcılaşır ve yedeğe girer", () => {
    const { demo } = hydrateFromStorage(seed);
    expect(demo.aquariums).toBe(true);

    // Sağlayıcıdaki kural: demo koleksiyonda ekleme, demo satırların yerine geçer.
    const afterAdd: AquariumDataSnapshot = { ...seed, aquariums: [realAquarium] };
    const flags: DemoFlags = { ...demo, aquariums: false };
    const persisted = persistedOnly(afterAdd, flags);

    saveAquariums(persisted.aquariums);
    const data = buildLocalExport(persisted, DEFAULT_PREFERENCES);

    // Depoda yalnızca gerçek kayıt var; demo akvaryum taşınmadı.
    expect(storage.json(STORAGE_KEYS.aquariums)).toEqual([realAquarium]);
    expect(storage.keys()).toEqual([STORAGE_KEYS.aquariums]);
    // Yedekte yalnızca gerçek kayıt var; ilgisiz demo koleksiyonlar boş.
    expect(data[STORAGE_KEYS.aquariums]).toEqual([realAquarium]);
    expect(data[STORAGE_KEYS.livestock]).toEqual([]);
    expect(backupContainsDemoIds(data)).toBe(false);
  });

  it("demo bir kayıt düzenlendiğinde yalnızca o kayıt gerçek veriye dönüşür", () => {
    const { snapshot, demo } = hydrateFromStorage(seed);
    const edited: Aquarium = { ...snapshot.aquariums[0], name: "Yeniden adlandırıldı" };

    // Sağlayıcıdaki kural: demo koleksiyonda güncelleme yalnızca düzenlenen kaydı bırakır.
    const afterEdit: AquariumDataSnapshot = { ...snapshot, aquariums: [edited] };
    const flags: DemoFlags = { ...demo, aquariums: false };
    const persisted = persistedOnly(afterEdit, flags);

    expect(persisted.aquariums).toEqual([edited]);
    // Diğer demo koleksiyonlar taşınmadı.
    expect(persisted.waterReadings).toEqual([]);
    expect(persisted.livestock).toEqual([]);

    const data = buildLocalExport(persisted, DEFAULT_PREFERENCES);
    expect(data[STORAGE_KEYS.aquariums]).toEqual([edited]);
    expect(data[STORAGE_KEYS.waterReadings]).toEqual([]);
  });
});
