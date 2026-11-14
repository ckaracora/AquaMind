import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { speciesCatalog, speciesForLivestock, type SpeciesProfile } from "@/data/catalog-species";
import { aquariums, equipment, livestock, waterReadings } from "@/data/mock-data";
import { speciesBehavior } from "@/data/species-behavior";
import { behaviorDocumented, FIT_BLOCKING_CODES, FIT_PAGE_SIZE, fitCandidate, fitLookup, speciesFittingAquarium } from "@/lib/aquarium-fit";
import { addLivestockHref, requestedSpecies } from "@/lib/aquarium-links";
import { analyzeAquarium, fullCatalogLookup } from "@/lib/health-analysis";
import { newWarningsForCandidate } from "@/lib/selection-warnings";
import type { Aquarium, Equipment, Livestock, WaterParameters } from "@/types/aquarium";

// "Bu akvaryuma ne uyar?" (veri sprinti F, 2026-11-14): yeni kural yok; her aday tür, seçme penceresindeki gibi akvaryumla bir kez analize eklenir.

const demo = aquariums[0];
const demoAnimals = livestock.filter((item) => item.aquariumId === demo.id);
const demoDevices = equipment.filter((item) => item.aquariumId === demo.id);
const demoLatest = [...waterReadings].sort((a, b) => +new Date(b.measuredAt) - +new Date(a.measuredAt))[0];

const tank = (overrides: Partial<Aquarium> = {}): Aquarium => ({ id: "fit-tank", name: "Deneme", type: "freshwater", lengthCm: 100, widthCm: 40, heightCm: 50, netVolumeLiters: 180, setupDate: "2026-01-01", ...overrides });
const heater: Equipment = { id: "fit-heater", aquariumId: "fit-tank", category: "heater", brand: "Eheim", model: "Thermocontrol 125 W", installedAt: "2026-01-01", catalogId: "eheim-thermo-125" };
const filter: Equipment = { id: "fit-filter", aquariumId: "fit-tank", category: "filter", brand: "Oase", model: "BioMaster² 350", installedAt: "2026-01-01", catalogId: "oase-biomaster2-350" };
const animal = (catalogId: string, quantity: number): Livestock => {
  const profile = speciesCatalog.find((item) => item.id === catalogId)!;
  return { id: `fit-${catalogId}`, aquariumId: "fit-tank", catalogId, commonName: profile.commonName, scientificName: profile.scientificName, category: profile.category, quantity, gender: "unknown", addedAt: "2026-01-01" };
};
const fit = (aquarium: Aquarium, animals: Livestock[], devices: Equipment[], latest?: WaterParameters) =>
  speciesFittingAquarium({ lookup: fullCatalogLookup, aquarium, animals, devices, latest, candidates: speciesCatalog });
const ids = (result: ReturnType<typeof fit>) => result.fits.map((entry) => entry.profile.id);

describe("bu akvaryuma ne uyar", () => {
  const demoResult = fit(demo, demoAnimals, demoDevices, demoLatest);

  it("örnek akvaryumda tür önerir; her öneri davranışı kaynakta yazan, doğrulanmış, bu su türüne uyan ve akvaryumda olmayan türdür", () => {
    expect(demoResult.fits.length).toBeGreaterThan(10);
    const present = new Set(demoAnimals.map((item) => speciesForLivestock(item)?.id));
    for (const { profile, quantity } of demoResult.fits) {
      expect(behaviorDocumented(speciesBehavior[profile.id]), profile.id).toBe(true);
      expect(Boolean(profile.sourceUrl && profile.verifiedAt), profile.id).toBe(true);
      expect(profile.waterTypes ?? ["freshwater"], profile.id).toContain("freshwater");
      expect(["fish", "shrimp", "snail"], profile.id).toContain(profile.category);
      expect(present.has(profile.id), profile.id).toBe(false);
      expect(quantity, profile.id).toBe(profile.minGroup);
    }
  });

  it("listedeki tür seçme penceresinde seçilince yeni uyarı göstermez (aynı analiz, aynı karşılaştırma)", () => {
    for (const { profile } of demoResult.fits) {
      const candidate = fitCandidate(demo, profile);
      expect(newWarningsForCandidate(fullCatalogLookup, demo, demoAnimals, demoDevices, demoLatest, candidate).map((warning) => warning.code), profile.id).toEqual([]);
      const before = new Set(analyzeAquarium(demo, demoAnimals, demoDevices, demoLatest).warnings.map((warning) => `${warning.code}|${JSON.stringify(warning.params)}`));
      const added = analyzeAquarium(demo, [...demoAnimals, candidate], demoDevices, demoLatest).warnings.filter((warning) => !before.has(`${warning.code}|${JSON.stringify(warning.params)}`));
      expect(added.filter((warning) => FIT_BLOCKING_CODES.has(warning.code)).map((warning) => warning.code), profile.id).toEqual([]);
    }
  });

  it("önerilen tür eklenince motor onu 'davranışı bilinmiyor' diye değerlendirilemeyenlere yazmaz", () => {
    for (const { profile } of demoResult.fits) {
      const analysis = analyzeAquarium(demo, [...demoAnimals, fitCandidate(demo, profile)], demoDevices, demoLatest);
      expect((analysis.unevaluated ?? []).filter((item) => item.code === "behaviorUnknown" && item.params.name === profile.commonName), profile.id).toEqual([]);
    }
    // Yalnız kendi türüne saldırganlık kaydı başka canlılarla uyumu söylemez.
    expect(behaviorDocumented([{ flag: "conspecificAggression", value: "all", confidence: "explicit", evidence: "", source: "ScotCat", sourceUrl: "https://www.scotcat.com/x", verifiedAt: "2026-11-14" }])).toBe(false);
    expect(behaviorDocumented([{ flag: "peaceful", confidence: "conflict", evidence: "", source: "ScotCat", sourceUrl: "https://www.scotcat.com/x", verifiedAt: "2026-11-14" }])).toBe(false);
  });

  it("davranış kaydı olmayan ya da yalnız çelişkili kaydı olan tür önerilmez", () => {
    const undocumented = speciesCatalog.filter((profile) => !behaviorDocumented(speciesBehavior[profile.id]));
    expect(undocumented.length).toBeGreaterThan(0);
    const listed = new Set(ids(fit(tank({ netVolumeLiters: 2000, lengthCm: 300, widthCm: 100, heightCm: 80 }), [], [heater, filter])));
    expect(undocumented.filter((profile) => listed.has(profile.id)).map((profile) => profile.id)).toEqual([]);
  });

  it("neon tetralı akvaryuma küçük balık avlayan tür önerilmez", () => {
    const result = fit(tank({ netVolumeLiters: 400, lengthCm: 150, widthCm: 50, heightCm: 60 }), [animal("neon-tetra", 10)], [heater, filter]);
    expect(ids(result)).not.toContain("angelfish");
    for (const { profile } of result.fits) {
      const hunter = speciesBehavior[profile.id]?.some((record) => record.flag === "eatsSmallFish" && record.confidence === "explicit" && record.maxPreyCm === undefined);
      expect(Boolean(hunter && profile.adultSizeCm * 0.4 >= 3), profile.id).toBe(false);
    }
  });

  it("hacim ve uzunluk küçükse kaynağın en az hacmini ya da uzunluğunu aşan tür önerilmez", () => {
    const small = tank({ netVolumeLiters: 30, lengthCm: 45, widthCm: 30, heightCm: 30 });
    const result = fit(small, [], [{ ...heater, catalogId: "eheim-thermo-50", model: "Thermocontrol 50 W" }]);
    for (const { profile, quantity } of result.fits) {
      expect(profile.minVolumeL + Math.max(0, quantity - 1) * (profile.additionalVolumePerAnimalL ?? 0), profile.id).toBeLessThanOrEqual(30);
      if (profile.minTankLengthCm !== undefined) expect(profile.minTankLengthCm, profile.id).toBeLessThanOrEqual(45);
    }
  });

  it("ısıtıcı kayıtlı değilse tropikal tür önerilmez ve sayısı dürüst not için verilir", () => {
    const result = fit(tank(), [], [filter]);
    expect(result.heaterOnly.fish).toBeGreaterThan(0);
    for (const { profile } of result.fits) expect(profile.group === "coldwater" || profile.temperature[0] < 23, profile.id).toBe(true);
    const heated = fit(tank(), [], [filter, heater]);
    expect(heated.heaterOnly).toEqual({ fish: 0, shrimp: 0, snail: 0 });
    expect(heated.fits.length).toBeGreaterThan(result.fits.length);
  });

  it("tuzlu su akvaryumunda yalnız tuzlu su türleri; acı su akvaryumunda yalnız acı suya uyanlar", () => {
    for (const type of ["saltwater", "brackish"] as const) {
      const result = fit(tank({ type, netVolumeLiters: 600, lengthCm: 180, widthCm: 60, heightCm: 60 }), [], [heater, filter]);
      for (const { profile } of result.fits) expect(profile.waterTypes ?? ["freshwater"], profile.id).toContain(type);
    }
  });

  it("listeden bir sayfa en çok 30 tür; sağlık sayfasının 'Ekle' bağlantısı türü taşır", () => {
    expect(FIT_PAGE_SIZE).toBe(30);
    const href = addLivestockHref("aqua 1", "neon-tetra");
    expect(href).toBe("/livestock?aquarium=aqua%201&add=1&species=neon-tetra");
    expect(requestedSpecies(href.slice(href.indexOf("?")))).toBe("neon-tetra");
    expect(requestedSpecies("?aquarium=a&add=1")).toBeUndefined();
  });

  it("pencerenin araması ekipmanı yalnız verilen parçadan, canlıyı tam tür kataloğundan alır", () => {
    const seen: string[] = [];
    const lookup = fitLookup(speciesForLivestock, speciesBehavior, { profileForEquipment: (item) => { seen.push(item.id); return fullCatalogLookup.profileForEquipment(item); } });
    const result = speciesFittingAquarium({ lookup, aquarium: demo, animals: demoAnimals, devices: demoDevices, latest: demoLatest, candidates: speciesCatalog.slice(0, 40) as SpeciesProfile[] });
    expect(seen.length).toBeGreaterThan(0);
    expect(ids(result)).toEqual(ids(fit(demo, demoAnimals, demoDevices, demoLatest)).filter((id) => speciesCatalog.slice(0, 40).some((profile) => profile.id === id)));
  });
});

describe("örnek akvaryum", () => {
  it("katalogdaki bir ısıtıcıyla ısıtıcı uyarısı çıkmaz ve ısıtıcı ölçütü uygundur", () => {
    const device = demoDevices.find((item) => item.category === "heater");
    expect(device?.catalogId).toBe("eheim-thermo-125");
    const profile = fullCatalogLookup.profileForEquipment(device!);
    expect(profile?.recommendedMinL! <= demo.netVolumeLiters && demo.netVolumeLiters <= profile?.recommendedMaxL!).toBe(true);
    const analysis = analyzeAquarium(demo, demoAnimals, demoDevices, demoLatest);
    expect(analysis.warnings.map((warning) => warning.code)).not.toContain("heaterMissing");
    expect(analysis.warnings.map((warning) => warning.code).filter((code) => code.startsWith("heater"))).toEqual([]);
  });
});

describe("sayfa hızı (karar 0016)", () => {
  it("pencere kataloğu, davranış ve bakım dosyalarını yalnız açılınca yükler; sağlık sayfası bunları değer olarak içe aktarmaz", () => {
    const dataImport = /^\s*import [^;]*from "@\/(data\/(catalog-species|species-behavior|species-care|catalog-equipment)|lib\/health-analysis)"/m;
    for (const file of ["src/components/aquarium-fit.tsx", "src/components/species-card.tsx", "src/lib/aquarium-fit.ts", "src/lib/species-card.ts", "src/app/aquariums/[id]/health/page.tsx"]) {
      const source = readFileSync(file, "utf8").split("\n").filter((line) => !/^\s*import type /.test(line)).join("\n");
      expect(dataImport.test(source), file).toBe(false);
    }
    expect(readFileSync("src/components/aquarium-fit.tsx", "utf8")).toMatch(/import\("@\/data\/catalog-species"\)/);
    expect(readFileSync("src/components/species-card.tsx", "utf8")).toMatch(/import\("@\/data\/species-care"\)/);
  });
});
