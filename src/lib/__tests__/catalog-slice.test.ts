import { describe, expect, it } from "vitest";
import { buildGoldenCases } from "../../../packages/compatibility-engine/test/fixtures/golden-cases";
import { catalogBucketCounts, catalogBucketOf, type EquipmentBucket, type SpeciesBucket } from "@/data/catalog-buckets";
import { buildCatalogBucket, buildEquipmentModelBucket, buildSpeciesNameBucket, catalogBucketNumbers } from "@/data/catalog-bucket-builders";
import { equipmentCatalog, equipmentModelIndex, profileForEquipment } from "@/data/catalog-equipment";
import { speciesCatalog, speciesForLivestock, speciesNameIndex } from "@/data/catalog-species";
import { speciesBehavior } from "@/data/species-behavior";
import { aquariums as mockAquariums, equipment as mockEquipment, livestock as mockLivestock, waterReadings as mockWaterReadings } from "@/data/mock-data";
import { loadCatalogSlice, type FetchCatalogJson } from "@/lib/catalog-slice";
import { dashboardStatus } from "@/lib/dashboard-status";
import { analyzeAquarium, fullCatalogLookup } from "@/lib/health-analysis";
import { createHealthAnalyzer } from "@/lib/health-analysis-core";
import type { Equipment, Livestock } from "@/types/aquarium";
import * as equipmentModelsRoute from "@/app/catalog-data/equipment-models/[bucket]/route";
import * as equipmentRoute from "@/app/catalog-data/equipment/[bucket]/route";
import * as speciesNamesRoute from "@/app/catalog-data/species-names/[bucket]/route";
import * as speciesRoute from "@/app/catalog-data/species/[bucket]/route";

// Yalnızca gereken katalog parçalarıyla yapılan analizin, tam katalogla yapılan analizle aynı olduğunu sınar
// (docs/DECISIONS/0016-gereken-katalog-kayitlarinin-yuklenmesi.md). Parçalar, ağdan gelmiş gibi JSON'a çevrilip geri okunur.
const fromBuilders: FetchCatalogJson = async (path) => {
  return JSON.parse(JSON.stringify(buildCatalogBucket(path)));
};

describe("katalog parçaları", () => {
  it("her canlı ve ekipman kaydı tam olarak bir parçada, katalog sırasıyla", () => {
    const speciesIds = catalogBucketNumbers("species").flatMap((bucket) => (buildCatalogBucket(`/catalog-data/species/${bucket}`) as SpeciesBucket).map(([id]) => id));
    const equipmentIds = catalogBucketNumbers("equipment").flatMap((bucket) => (buildCatalogBucket(`/catalog-data/equipment/${bucket}`) as EquipmentBucket).map(([id]) => id));
    expect([...speciesIds].sort()).toEqual(speciesCatalog.map((profile) => profile.id).sort());
    expect([...equipmentIds].sort()).toEqual(equipmentCatalog.map((profile) => profile.id).sort());
    for (const bucket of catalogBucketNumbers("species")) {
      const ids = (buildCatalogBucket(`/catalog-data/species/${bucket}`) as SpeciesBucket).map(([id]) => id);
      expect(ids).toEqual(speciesCatalog.filter((profile) => catalogBucketOf(profile.id, "species") === bucket).map((profile) => profile.id));
    }
  });

  it("ad ve model dizinleri katalog modüllerindeki dizinlerin tamamını taşır", () => {
    const { scientific, names } = speciesNameIndex();
    const nameBuckets = catalogBucketNumbers("speciesNames").map(buildSpeciesNameBucket);
    expect(nameBuckets.flatMap((bucket) => bucket.scientific).length).toBe(scientific.size);
    expect(nameBuckets.flatMap((bucket) => bucket.names).length).toBe(names.size);
    for (const bucket of nameBuckets) for (const [key, id, position] of bucket.scientific) expect([id, position]).toEqual([speciesCatalog[scientific.get(key)!].id, scientific.get(key)]);
    expect(catalogBucketNumbers("equipmentModels").flatMap(buildEquipmentModelBucket).length).toBe(equipmentModelIndex().size);
  });

  it("derleme anında üretilen yanıtlar parça içeriğini döndürür", async () => {
    const routes = [[speciesRoute, "species"], [equipmentRoute, "equipment"], [speciesNamesRoute, "species-names"], [equipmentModelsRoute, "equipment-models"]] as const;
    for (const [route, segment] of routes) {
      expect(route.dynamic).toBe("force-static");
      expect(route.dynamicParams).toBe(false);
      const params = route.generateStaticParams();
      expect(params.length).toBeGreaterThan(0);
      for (const { bucket } of params.slice(0, 3)) {
        const response = await route.GET(new Request("http://localhost/"), { params: Promise.resolve({ bucket }) });
        expect(await response.json()).toEqual(JSON.parse(JSON.stringify(buildCatalogBucket(`/catalog-data/${segment}/${bucket}`))));
      }
    }
    expect(speciesRoute.generateStaticParams().length).toBe(catalogBucketCounts.species);
  });
});

describe("gereken kayıtlarla analiz", () => {
  it("altın fikstürdeki bütün vakalarda tam katalogla aynı analizi ve ana sayfa durumunu verir", async () => {
    const cases = buildGoldenCases();
    expect(cases.length).toBeGreaterThan(1000);
    for (const goldenCase of cases) {
      const [aquarium, animals, equipment, water] = goldenCase.args;
      const slice = await loadCatalogSlice(animals, equipment, fromBuilders);
      expect(createHealthAnalyzer(slice)(aquarium, animals, equipment, water), goldenCase.name).toEqual(analyzeAquarium(aquarium, animals, equipment, water));
      expect(dashboardStatus(slice, aquarium, animals, equipment, water), goldenCase.name).toEqual(dashboardStatus(fullCatalogLookup, aquarium, animals, equipment, water));
    }
  }, 120_000);

  it("örnek akvaryumda yalnızca gereken parçaları ister", async () => {
    const aquarium = mockAquariums[0];
    const animals = mockLivestock.filter((item) => item.aquariumId === aquarium.id), equipment = mockEquipment.filter((item) => item.aquariumId === aquarium.id);
    const fetched: string[] = [];
    const fetcher: FetchCatalogJson = async (path) => { fetched.push(path); return JSON.parse(JSON.stringify(buildCatalogBucket(path))); };
    const slice = await loadCatalogSlice(animals, equipment, fetcher);
    const latest = mockWaterReadings.filter((item) => item.aquariumId === aquarium.id).sort((a, b) => +new Date(b.measuredAt) - +new Date(a.measuredAt))[0];
    expect(createHealthAnalyzer(slice)(aquarium, animals, equipment, latest)).toEqual(analyzeAquarium(aquarium, animals, equipment, latest));
    expect(fetched.filter((path) => path.includes("/species/")).length).toBeLessThanOrEqual(new Set(animals.map((item) => item.catalogId)).size);
    expect(fetched.some((path) => path.includes("/species-names/"))).toBe(animals.some((item) => !item.catalogId));
    expect(fetched.length).toBe(new Set(fetched).size);
    expect(fetched.length).toBeLessThan(10);
  });

  it("katalog kimliği olmayan canlıları tam katalogla aynı eşler", async () => {
    const names = [...new Set(speciesCatalog.flatMap((profile) => [profile.commonName, profile.scientificName, ...(profile.aliases ?? [])]))];
    const variants = (value: string) => [value, value.toUpperCase(), `  ${value}  `, value.replace(/i/g, "ı")];
    const animals: Livestock[] = names.flatMap((name, index) => (index % 9 === 0 ? variants(name) : [name]).flatMap((value) => [
      { id: "l", aquariumId: "a", commonName: value, category: "fish", quantity: 1, addedAt: "2026-01-01" },
      { id: "l", aquariumId: "a", commonName: "", scientificName: value, category: "fish", quantity: 1, addedAt: "2026-01-01" },
    ]));
    animals.push({ id: "l", aquariumId: "a", commonName: "Neon tetra", catalogId: "yok-boyle", category: "fish", quantity: 1, addedAt: "2026-01-01" });
    animals.push({ id: "l", aquariumId: "a", commonName: "Bilinmeyen balık", category: "fish", quantity: 1, addedAt: "2026-01-01" });
    const slice = await loadCatalogSlice(animals, [], fromBuilders);
    for (const item of animals) {
      const expected = speciesForLivestock(item);
      expect(slice.speciesForLivestock(item)?.id, `${item.commonName} / ${item.scientificName}`).toBe(expected?.id);
      if (expected) expect(slice.behaviorFor(expected.id)).toEqual(Object.hasOwn(speciesBehavior, expected.id) ? speciesBehavior[expected.id] : undefined);
    }
  }, 60_000);

  it("katalog kimliği olmayan ekipmanı tam katalogla aynı eşler", async () => {
    const device = (brand?: string, model?: string, catalogId?: string): Equipment => ({ id: "e", aquariumId: "a", category: "filter", brand, model, installedAt: "2026-01-01", catalogId });
    const equipment = [
      ...equipmentCatalog.flatMap((profile, index) => index % 3 === 0 ? [device(profile.brand, profile.model), device(profile.brand.toUpperCase(), ` ${profile.model} `), device(profile.brand, `${profile.model}x`)] : [device(profile.brand, profile.model)]),
      device("ISTA", "2L Set"), device(undefined, "BioMaster 350"), device("Oase"), device("Oase", "BioMaster 350", "yok-boyle"),
    ];
    const slice = await loadCatalogSlice([], equipment, fromBuilders);
    for (const item of equipment) expect(slice.profileForEquipment(item)?.id, `${item.brand} / ${item.model}`).toBe(profileForEquipment(item)?.id);
  }, 60_000);

  it("yüklenmemiş bir kayda bakılırsa sessizce 'bulunamadı' demez", async () => {
    const slice = await loadCatalogSlice([], [], fromBuilders);
    const absent = speciesCatalog.find((profile) => profile.id)!;
    expect(() => slice.speciesForLivestock({ id: "l", aquariumId: "a", commonName: absent.commonName, catalogId: absent.id, category: "fish", quantity: 1, addedAt: "2026-01-01" })).toThrow(/yüklenmeden/);
  });

  it("başarısız indirme önbellekte kalmaz, yeniden denenebilir", async () => {
    let fail = true;
    const flaky: FetchCatalogJson = async (path) => {
      if (fail) throw new Error("bağlantı yok");
      return JSON.parse(JSON.stringify(buildCatalogBucket(path)));
    };
    const animals: Livestock[] = [{ id: "l", aquariumId: "a", commonName: "Neon tetra", catalogId: "neon-tetra", category: "fish", quantity: 1, addedAt: "2026-01-01" }];
    await expect(loadCatalogSlice(animals, [], flaky)).rejects.toThrow("bağlantı yok");
    fail = false;
    const slice = await loadCatalogSlice(animals, [], flaky);
    expect(slice.speciesForLivestock(animals[0])?.id).toBe("neon-tetra");
  });
});
