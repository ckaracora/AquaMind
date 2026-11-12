import { describe, expect, it } from "vitest";
import type { Aquarium, AquariumType, Equipment, Livestock, WaterParameters } from "@aquamind/domain";
import { LIVESTOCK_RISK_WARNING_CODES, createAnalyzer, type EquipmentProfileInput, type KnowledgeResolver, type SpeciesProfileInput } from "../src";

// Motor 1.15.0, kural seti 1.12.0 (docs/DECISIONS/0040-canli-riski-uyarilari-genel-durumda.md; ürün sahibinin onayı 2026-11-12, seçenek B):
// canlı riski uyarısı genel puanı en fazla 74 yapar; bilgi notları, koşullu notlar ve ekipman uyumu yapmaz; fırsatçı avcının uyarısı tehlike
// seviyesinde ama kesin tehlike değil; fırsatçı avcı her kategoriden olabilir, av yalnız balık; "tek tutulmalı" kaynağın önerdiği çift ya da
// grupta çıkmaz. Stub kayıtlarla, sınırlarından.

const base = { minGroup: 1, ph: [6, 7.5] as [number, number], flow: "medium" as const, wasteFactor: 0.5, temperature: [22, 27] as [number, number] };
type StubSpecies = SpeciesProfileInput & { category: Livestock["category"] };
const species: Record<string, StubSpecies> = {
  calm: { id: "calm", commonName: "Sakin tür", category: "fish", adultSizeCm: 3, minVolumeL: 20, ...base },
  other: { id: "other", commonName: "Öbür tür", category: "fish", adultSizeCm: 3, minVolumeL: 20, ...base },
  shoal: { id: "shoal", commonName: "Sürü türü", category: "fish", adultSizeCm: 3, minVolumeL: 20, ...base, minGroup: 6 },
  dense: { id: "dense", commonName: "Kirleten tür", category: "fish", adultSizeCm: 10, minVolumeL: 20, ...base, wasteFactor: 2 },
  big: { id: "big", commonName: "Büyük tür", category: "fish", adultSizeCm: 20, minVolumeL: 200, minTankLengthCm: 100, ...base },
  wide: { id: "wide", commonName: "Geniş tür", category: "fish", adultSizeCm: 25, minVolumeL: 300, minTankLengthCm: 120, ...base },
  goldfish: { id: "goldfish", commonName: "Soğuk su balığı", category: "fish", group: "coldwater", adultSizeCm: 10, minVolumeL: 50, ...base, temperature: [4, 25], ph: [6, 8] },
  tropical: { id: "tropical", commonName: "Tropikal tür", category: "fish", group: "tetra", adultSizeCm: 3, minVolumeL: 20, ...base, temperature: [24, 28] },
  point: { id: "point", commonName: "Tek sıcaklıklı tür", category: "fish", adultSizeCm: 3, minVolumeL: 20, ...base, temperature: [25, 25] },
  lowFlow: { id: "lowFlow", commonName: "Sakin su türü", category: "fish", adultSizeCm: 3, minVolumeL: 20, ...base, flow: "low" },
  highFlow: { id: "highFlow", commonName: "Akıntı türü", category: "fish", adultSizeCm: 3, minVolumeL: 20, ...base, flow: "high" },
  cautious: { id: "cautious", commonName: "Notlu tür", category: "fish", adultSizeCm: 3, minVolumeL: 20, ...base, communityCaution: "Yavaş balıkları taciz edebilir.", husbandryCaution: "Saklanma alanı ister.", tankLengthDataNote: "Kaynak uzunluk vermiyor." },
  marineFish: { id: "marineFish", commonName: "Deniz balığı", category: "fish", waterTypes: ["saltwater"], adultSizeCm: 5, minVolumeL: 50, minGroup: 1, temperature: [24, 27], flow: "medium", wasteFactor: 0.5 },
  hunter: { id: "hunter", commonName: "Fırsatçı", category: "fish", adultSizeCm: 15, minVolumeL: 50, ...base, behavior: { eatsSmallFish: { source: "Seriously Fish", condition: "Çok küçük balıklar." } } },
  realPredator: { id: "realPredator", commonName: "Avcı", category: "fish", adultSizeCm: 15, minVolumeL: 50, ...base, predatory: true },
  frog: { id: "frog", commonName: "Kurbağa", category: "other", adultSizeCm: 7, minVolumeL: 20, ...base, behavior: { eatsSmallFish: { source: "Fishkeeper", condition: "Çok küçük balıklar ve yavrular." } } },
  tiny: { id: "tiny", commonName: "Minik balık", category: "fish", adultSizeCm: 2, minVolumeL: 20, ...base },
  tinyShrimp: { id: "tinyShrimp", commonName: "Minik karides", category: "shrimp", adultSizeCm: 2, minVolumeL: 20, ...base },
  tinySnail: { id: "tinySnail", commonName: "Minik salyangoz", category: "snail", adultSizeCm: 2, minVolumeL: 20, ...base },
  shrimpEater: { id: "shrimpEater", commonName: "Karides yiyen", category: "fish", adultSizeCm: 5, minVolumeL: 20, ...base, behavior: { eatsShrimp: { source: "Fishkeeper" } } },
  dwarfShrimp: { id: "dwarfShrimp", commonName: "Cüce karides", category: "shrimp", adultSizeCm: 3, minVolumeL: 20, ...base },
  snailEater: { id: "snailEater", commonName: "Salyangoz yiyen", category: "fish", adultSizeCm: 5, minVolumeL: 20, ...base, behavior: { eatsSnails: { source: "Fishkeeper" } } },
  snail: { id: "snail", commonName: "Salyangoz", category: "snail", adultSizeCm: 3, minVolumeL: 20, ...base },
  nipper: { id: "nipper", commonName: "Isıran", category: "fish", adultSizeCm: 4, minVolumeL: 20, ...base, behavior: { finNipper: { source: "Seriously Fish" } } },
  longFin: { id: "longFin", commonName: "Uzun yüzgeçli", category: "fish", adultSizeCm: 4, minVolumeL: 20, ...base, behavior: { finNipTarget: { source: "OATA" } } },
  fighter: { id: "fighter", commonName: "Kavgacı", category: "fish", adultSizeCm: 4, minVolumeL: 20, ...base, behavior: { conspecificAggression: { source: "Fishkeeper", value: "males" } } },
  pairMales: { id: "pairMales", commonName: "Çift kavgacı", category: "fish", adultSizeCm: 4, minVolumeL: 20, ...base, minGroup: 2, behavior: { conspecificAggression: { source: "Fishkeeper", value: "males" } } },
  loner: { id: "loner", commonName: "Yalnız", category: "fish", adultSizeCm: 4, minVolumeL: 20, ...base, behavior: { conspecificAggression: { source: "Fishkeeper", value: "all" } } },
  pairLoner: { id: "pairLoner", commonName: "Çift tutulan", category: "fish", adultSizeCm: 4, minVolumeL: 20, ...base, minGroup: 2, behavior: { conspecificAggression: { source: "Seriously Fish", value: "all", condition: "Çok büyük tank hariç." } } },
  groupLoner: { id: "groupLoner", commonName: "Grup ya da tek", category: "fish", adultSizeCm: 4, minVolumeL: 20, ...base, minGroup: 6, behavior: { conspecificAggression: { source: "Seriously Fish", value: "all" } } },
};
const devices: Record<string, EquipmentProfileInput> = {
  filter: { id: "filter", category: "filter", brand: "Stub", model: "F200", ratedFlowLph: 400, recommendedMaxL: 200 },
  bigFilter: { id: "bigFilter", category: "filter", brand: "Stub", model: "F400", ratedFlowLph: 1000, recommendedMaxL: 400 },
  smallFilter: { id: "smallFilter", category: "filter", brand: "Stub", model: "F80", ratedFlowLph: 400, recommendedMaxL: 80 },
  heater: { id: "heater", category: "heater", brand: "Stub", model: "H100", powerW: 100, recommendedMinL: 50, recommendedMaxL: 250 },
};
const resolver: KnowledgeResolver = {
  speciesForLivestock: (item) => (item.catalogId ? species[item.catalogId] : undefined),
  profileForEquipment: (item) => (item.catalogId ? devices[item.catalogId] : undefined),
  isVerifiedSpeciesProfile: (profile) => profile !== undefined,
  isVerifiedEquipmentProfile: (profile) => profile !== undefined,
};
const analyze = createAnalyzer(resolver);

const tank = (overrides: Partial<Aquarium> = {}): Aquarium => ({ id: "a", name: "Stub", type: "freshwater", lengthCm: 100, widthCm: 40, heightCm: 50, netVolumeLiters: 100, setupDate: "2026-01-01", ...overrides });
let counter = 0;
const animal = (catalogId: string, quantity = 1): Livestock => ({ id: `l-${catalogId}-${counter++}`, aquariumId: "a", catalogId, commonName: species[catalogId].commonName, category: species[catalogId].category, quantity, addedAt: "2026-01-01" });
const device = (catalogId: string): Equipment => ({ id: `e-${catalogId}`, aquariumId: "a", catalogId, category: devices[catalogId].category, installedAt: "2026-01-01" });
const reading = (values: Partial<WaterParameters> = {}): WaterParameters => ({ id: "w", aquariumId: "a", measuredAt: "2026-11-12", temperature: 25, ph: 7, ammonia: 0, nitrite: 0, nitrate: 10, ...values });
const equipped = (filter = "filter") => [device(filter), device("heater")];
const codes = (result: ReturnType<typeof analyze>) => result.warnings.map((item) => item.code);
const average = (result: ReturnType<typeof analyze>) => Math.round(result.metrics.reduce((sum, item) => sum + item.score, 0) / result.metrics.length);
const riskCodes = (result: ReturnType<typeof analyze>) => [...new Set(codes(result).filter((code) => LIVESTOCK_RISK_WARNING_CODES.has(code)))];

interface Case { code: string; animals: Livestock[]; tank?: Partial<Aquarium>; filter?: string; water?: Partial<WaterParameters>; type?: AquariumType }
const riskCases: Case[] = [
  { code: "speciesTemperatureOutOfRange", animals: [animal("calm", 1)], water: { temperature: 28 } },
  { code: "speciesPhOutOfRange", animals: [animal("calm", 1)], water: { ph: 7.8 } },
  { code: "coldwaterWithTropical", animals: [animal("goldfish", 1), animal("tropical", 1)], water: { temperature: 24.5 } },
  { code: "ammoniaDetected", animals: [animal("calm", 1)], water: { ammonia: 0.1 } },
  { code: "nitriteDetected", animals: [animal("calm", 1)], water: { nitrite: 0.1 } },
  { code: "nitrateHigh", animals: [animal("calm", 1)], water: { nitrate: 60 } },
  { code: "marinePh", type: "saltwater", animals: [animal("marineFish", 1)], water: { ph: 7.9, specificGravity: 1.02 } },
  { code: "spaceLimited", animals: [animal("big", 1)], tank: { netVolumeLiters: 150 } },
  { code: "spaceNarrow", animals: [animal("wide", 1)], tank: { netVolumeLiters: 250, lengthCm: 120 }, filter: "bigFilter" },
  { code: "highLoad", animals: [animal("dense", 11)] },
  { code: "groupLow", animals: [animal("shoal", 3)] },
  { code: "shrimpEaten", animals: [animal("shrimpEater", 1), animal("dwarfShrimp", 10)] },
  { code: "snailEaten", animals: [animal("snailEater", 1), animal("snail", 3)] },
  { code: "finNip", animals: [animal("nipper", 1), animal("longFin", 1)] },
  { code: "smallFishPredation", animals: [animal("hunter", 1), animal("calm", 1)] },
];

describe("canlı riski uyarısı genel puanı en fazla 74 yapar (karar 0040)", () => {
  it.each(riskCases)("$code tek başına: ortalama 74'ün üstünde, genel puan 74 'dikkat'", ({ code, animals, tank: tankValues, filter, water, type }) => {
    const result = analyze(tank({ ...tankValues, ...(type ? { type } : {}) }), animals, equipped(filter), reading(water));
    expect(riskCodes(result)).toEqual([code]);
    // Kesin tehlike yok, tehlikedeki ölçüt yok; tavanı yalnız bu uyarı koyuyor.
    expect(result.metrics.filter((item) => item.status === "danger")).toEqual([]);
    expect(average(result)).toBeGreaterThan(74);
    expect(result).toMatchObject({ score: 74, status: "warning" });
  });

  it("sınıf 18 koddur: yenme ve yaralanma, alan, kalabalık ve grup, aralık dışı su değeri", () => {
    expect([...LIVESTOCK_RISK_WARNING_CODES].sort()).toEqual([
      "ammoniaDetected", "coldwaterWithTropical", "finNip", "groupLow", "highLoad", "marineKh", "marineNitrate", "marinePh", "marineSpecificGravity",
      "nitrateHigh", "nitriteDetected", "shrimpEaten", "smallFishPredation", "snailEaten", "spaceLimited", "spaceNarrow", "speciesPhOutOfRange",
      "speciesTemperatureOutOfRange",
    ]);
  });

  it("ölçüm, uyarıyı kaldıran değere dönünce akvaryum yeniden 'uygun' olur", () => {
    expect(analyze(tank(), [animal("calm", 1)], equipped(), reading({ temperature: 27 }))).toMatchObject({ status: "good" });
    expect(analyze(tank(), [animal("shoal", 6)], equipped(), reading())).toMatchObject({ status: "good" });
  });

  it("canlısız akvaryumda su kalitesi uyarısı tavan koymaz (ör. döngü kuran akvaryumda amonyak)", () => {
    const result = analyze(tank(), [], equipped(), reading({ ammonia: 0.1 }));
    expect(codes(result)).toContain("ammoniaDetected");
    expect(result.metrics.filter((item) => item.status === "danger")).toEqual([]);
    expect(result.score).toBe(average(result));
    expect(result.status).toBe("good");
  });

  it("kesin tehlike önce gelir: canlı riski uyarısı olsa da genel puan en fazla 49", () => {
    const result = analyze(tank(), [animal("realPredator", 1), animal("calm", 1)], equipped(), reading({ temperature: 28 }));
    expect(codes(result)).toEqual(expect.arrayContaining(["predation", "speciesTemperatureOutOfRange"]));
    expect(result.score).toBeLessThanOrEqual(49);
    expect(result.status).toBe("danger");
  });
});

describe("bilgi notları, koşullu notlar ve ekipman uyumu genel puanı değiştirmez (karar 0040)", () => {
  const infoCases: { label: string; expected: string[]; animals: Livestock[]; filter?: string }[] = [
    { label: "bakım, topluluk ve tank uzunluğu notu", expected: ["husbandryCaution", "communityCaution", "tankLengthNote"], animals: [animal("cautious", 1), animal("calm", 1)] },
    { label: "erkekler kavga eder (cinsiyete bağlı)", expected: ["conspecificMales"], animals: [animal("fighter", 2)] },
    { label: "karides uyumu doğrulanmadı", expected: ["shrimpUnverified"], animals: [animal("calm", 1), animal("dwarfShrimp", 10)] },
    { label: "sıcaklıklar tek değerde uyuşuyor", expected: ["temperatureRangeNarrow"], animals: [animal("point", 1), animal("calm", 1)] },
    { label: "akıntı ihtiyaçları farklı", expected: ["flowConflict"], animals: [animal("lowFlow", 1), animal("highFlow", 1)] },
    { label: "filtre üretici önerisinin üstünde", expected: ["filterOverManufacturer"], animals: [animal("calm", 1)], filter: "smallFilter" },
  ];
  it.each(infoCases)("$label: genel puan ortalamadır", ({ expected, animals, filter }) => {
    const result = analyze(tank(), animals, equipped(filter), reading());
    expect(codes(result)).toEqual(expect.arrayContaining(expected));
    expect(riskCodes(result)).toEqual([]);
    expect(result.warnings.every((item) => item.level === "warning")).toBe(true);
    expect(result.score).toBe(average(result));
    expect(result.status).toBe("good");
  });
});

describe("fırsatçı avcı: tehlike seviyesinde uyarı, kesin tehlike değil (karar 0040)", () => {
  it("küçük balık uyarısı kırmızıdır, metni iki türü ayırmayı söyler; genel durum 'dikkat'", () => {
    const result = analyze(tank(), [animal("hunter", 1), animal("calm", 1)], equipped(), reading());
    const warning = result.warnings.find((item) => item.code === "smallFishPredation");
    expect(warning).toMatchObject({ level: "danger", title: "Sakin tür: avlanabilir" });
    expect(warning?.message).toBe("Fırsatçı ağzına sığan küçük balıkları yiyebilir; Sakin tür yetişkin boyuyla bu risk içinde. Bu iki türü aynı akvaryumda tutmayın. Kaynağın notu: Çok küçük balıklar. Kaynak: Seriously Fish.");
    expect(result).toMatchObject({ score: 74, status: "warning" });
  });

  it("asıl avcıda kesin tehlike kuralı değişmedi", () => {
    const result = analyze(tank(), [animal("realPredator", 1), animal("calm", 1)], equipped(), reading());
    expect(codes(result)).toContain("predation");
    expect(codes(result)).not.toContain("smallFishPredation");
    expect(result.status).toBe("danger");
  });

  it("balık olmayan canlı da fırsatçı avcı olabilir; av yalnız balıktır", () => {
    const fish = analyze(tank(), [animal("frog", 2), animal("tiny", 10)], equipped(), reading());
    expect(fish.warnings.find((item) => item.code === "smallFishPredation")).toMatchObject({ level: "danger", title: "Minik balık: avlanabilir" });
    expect(fish.warnings.find((item) => item.code === "smallFishPredation")?.message).toContain("Kurbağa ağzına sığan küçük balıkları yiyebilir;");
    expect(fish).toMatchObject({ score: 74, status: "warning" });
    // Kurbağanın %40'ı 2,8 cm: 3 cm'lik balık av sayılmaz; aynı boydaki karides ve salyangoz da sayılmaz.
    expect(codes(analyze(tank(), [animal("frog", 2), animal("calm", 10)], equipped(), reading()))).not.toContain("smallFishPredation");
    const invertebrates = analyze(tank(), [animal("frog", 2), animal("tinyShrimp", 10), animal("tinySnail", 3)], equipped(), reading());
    expect(codes(invertebrates)).not.toContain("smallFishPredation");
    expect(invertebrates.status).toBe("good");
  });
});

describe("'tek tutulmalı' kaynağın önerdiği çift ya da grupta çıkmaz (karar 0040)", () => {
  const titles = (result: ReturnType<typeof analyze>) => result.warnings.map((item) => item.title);
  const run = (...animals: Livestock[]) => analyze(tank(), animals, equipped(), reading());

  it("katalog çift öneriyorsa (en az grup 2) iki bireyde uyarı yok, üçüncüde var; ayrı kayıtların adetleri toplanır", () => {
    expect(titles(run(animal("pairLoner", 2)))).not.toContain("Çift tutulan: tek tutulmalı");
    expect(titles(run(animal("pairLoner", 1), animal("pairLoner", 1)))).not.toContain("Çift tutulan: tek tutulmalı");
    expect(titles(run(animal("pairLoner", 3)))).toContain("Çift tutulan: tek tutulmalı");
    expect(titles(run(animal("pairLoner", 2), animal("pairLoner", 1)))).toContain("Çift tutulan: tek tutulmalı");
  });

  it("katalog grup öneriyorsa (en az grup 6) grup sayısına kadar uyarı yok; azı grup uyarısı alır", () => {
    expect(titles(run(animal("groupLoner", 6)))).not.toContain("Grup ya da tek: tek tutulmalı");
    expect(titles(run(animal("groupLoner", 7)))).toContain("Grup ya da tek: tek tutulmalı");
    const few = run(animal("groupLoner", 3));
    expect(titles(few)).not.toContain("Grup ya da tek: tek tutulmalı");
    expect(titles(few)).toContain("Grup ya da tek: grup sayısı düşük");
  });

  it("katalog tek birey öneriyorsa (en az grup 1) iki bireyde uyarı bugünkü gibi çıkar", () => {
    expect(titles(run(animal("loner", 2)))).toContain("Yalnız: tek tutulmalı");
    expect(titles(run(animal("loner", 1)))).not.toContain("Yalnız: tek tutulmalı");
  });

  it("'erkekler kavga eder' değişmedi: çift önerilen türde de iki bireyde çıkar", () => {
    expect(titles(run(animal("pairMales", 2)))).toContain("Çift kavgacı: erkekler kavga eder");
  });

  it("uyarı çıkmayınca tür uyumu cezası da yazılmaz", () => {
    const pair = run(animal("pairLoner", 2));
    expect(pair.metrics.find((item) => item.key === "compatibility")).toMatchObject({ score: 100, detailCode: "compatible" });
    expect(run(animal("pairLoner", 3)).metrics.find((item) => item.key === "compatibility")).toMatchObject({ score: 70, detailCode: "conspecific" });
  });
});
