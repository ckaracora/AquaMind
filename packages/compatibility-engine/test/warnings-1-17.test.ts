import { describe, expect, it } from "vitest";
import type { Aquarium, Livestock, WaterParameters } from "@aquamind/domain";
import {
  ENGINE_VERSION, MARINE_SPECIFIC_GRAVITY_DANGER_LIMITS, MARINE_SPECIFIC_GRAVITY_SAFE, MARINE_TARGETS, RULESET_VERSION, assessMarineWater, createAnalyzer,
  type EquipmentProfileInput, type KnowledgeResolver, type SpeciesProfileInput,
} from "../src";

// Motor 1.17.0, kural seti 1.14.0 (docs/DECISIONS/0042-ozgul-agirlik-sinir-bandi.md; ürün sahibinin onayı 2026-11-12, "sınırda dikkat bandı"):
// deniz akvaryumunda güvenli aralığın (1,017–1,026) bir okuma basamağı (0,001) dışına kadar olan özgül ağırlık kesin tehlike değil, sarı
// "hedefin dışında" uyarısıdır. Yalnız balıklı akvaryumda iki uçta (1,016 ve 1,027 dahil), omurgasızlı akvaryumda yalnız üst uçta (1,027 dahil).
// Ötesi kesin tehlike kalır. Stub kayıtlarla, sınırlarından ve eşitliklerinden. Bu testler 1.16.0 davranışında başarısız olur.

type StubSpecies = SpeciesProfileInput & { category: Livestock["category"] };
const marineBase = { waterTypes: ["saltwater"] as SpeciesProfileInput["waterTypes"], minGroup: 1, temperature: [24, 27] as [number, number], flow: "medium" as const, wasteFactor: 0.5 };
const species: Record<string, StubSpecies> = {
  marineFish: { id: "marineFish", commonName: "Deniz balığı", category: "fish", adultSizeCm: 5, minVolumeL: 50, ...marineBase },
  marineShrimp: { id: "marineShrimp", commonName: "Deniz karidesi", category: "shrimp", adultSizeCm: 5, minVolumeL: 50, ...marineBase },
  // Tuzlu suya da girebilen acı su türü: kendi (kaynaklı) özgül ağırlık aralığı vardır; tür denetimi bu karardan etkilenmez.
  brackishFish: {
    id: "brackishFish", commonName: "Acı su balığı", category: "fish", adultSizeCm: 8, minVolumeL: 60, minGroup: 1, waterTypes: ["brackish", "saltwater"],
    temperature: [24, 27], ph: [7.5, 8.5], specificGravity: [1.005, 1.026], flow: "medium", wasteFactor: 0.5,
  },
};
const devices: Record<string, EquipmentProfileInput> = {
  filter: { id: "filter", category: "filter", brand: "Stub", model: "F200", ratedFlowLph: 400, recommendedMaxL: 200 },
  heater: { id: "heater", category: "heater", brand: "Stub", model: "H100", powerW: 100, recommendedMinL: 50, recommendedMaxL: 250 },
};
const resolver: KnowledgeResolver = {
  speciesForLivestock: (item) => (item.catalogId ? species[item.catalogId] : undefined),
  profileForEquipment: (item) => (item.catalogId ? devices[item.catalogId] : undefined),
  isVerifiedSpeciesProfile: (profile) => profile !== undefined,
  isVerifiedEquipmentProfile: (profile) => profile !== undefined,
};
const analyze = createAnalyzer(resolver);

const tank = (overrides: Partial<Aquarium> = {}): Aquarium => ({ id: "a", name: "Stub", type: "saltwater", lengthCm: 100, widthCm: 40, heightCm: 50, netVolumeLiters: 100, setupDate: "2026-01-01", ...overrides });
let counter = 0;
const animal = (catalogId: string, quantity = 1): Livestock => ({ id: `l-${catalogId}-${counter++}`, aquariumId: "a", catalogId, commonName: species[catalogId].commonName, category: species[catalogId].category, quantity, addedAt: "2026-01-01" });
const equipped = () => ["filter", "heater"].map((catalogId) => ({ id: `e-${catalogId}`, aquariumId: "a", catalogId, category: devices[catalogId].category, installedAt: "2026-01-01" }));
const reading = (specificGravity: number, values: Partial<WaterParameters> = {}): WaterParameters => ({
  id: "w", aquariumId: "a", measuredAt: "2026-11-12", temperature: 25, ph: 8.1, kh: 9, ammonia: 0, nitrite: 0, nitrate: 8, specificGravity, ...values,
});
const fishOnly = () => [animal("marineFish", 2)];
const withInvertebrate = () => [animal("marineFish", 2), animal("marineShrimp")];
const sea = (specificGravity: number, animals: Livestock[] = fishOnly()) => analyze(tank(), animals, equipped(), reading(specificGravity));
const codes = (result: ReturnType<typeof analyze>) => result.warnings.map((item) => item.code);
const warningOf = (result: ReturnType<typeof analyze>, code: string) => result.warnings.find((item) => item.code === code);
const average = (result: ReturnType<typeof analyze>) => Math.round(result.metrics.reduce((sum, item) => sum + item.score, 0) / result.metrics.length);
const sgRow = (specificGravity: number, animals: Pick<Livestock, "category">[]) =>
  assessMarineWater("saltwater", animals, reading(specificGravity))!.rows.find((row) => row.parameter === "specificGravity")!.status;

const DANGER_MESSAGE = (value: string) => `Son ölçüm ${value}. OATA'nın hiçbir ev akvaryumu hedefi bu değeri kapsamıyor (1,017–1,026). Tuzluluğu yavaşça hedefe getirin.`;

/** Sarı bant: kesin tehlike yok, tek sarı özgül ağırlık uyarısı, canlı varken genel puan en fazla 74. */
function expectBand(result: ReturnType<typeof analyze>, label: string) {
  expect(codes(result), label).toContain("marineSpecificGravity");
  expect(codes(result), label).not.toContain("marineSpecificGravityDanger");
  expect(warningOf(result, "marineSpecificGravity")?.level, label).toBe("warning");
  expect(average(result), label).toBeGreaterThan(74);
  expect(result, label).toMatchObject({ score: 74, status: "warning" });
}
/** Kesin tehlike: kırmızı uyarı, genel puan en fazla 49. */
function expectDanger(result: ReturnType<typeof analyze>, label: string) {
  expect(codes(result), label).toContain("marineSpecificGravityDanger");
  expect(codes(result), label).not.toContain("marineSpecificGravity");
  expect(result.score, label).toBeLessThanOrEqual(49);
  expect(result.status, label).toBe("danger");
}

describe("sürüm (karar 0042)", () => {
  // Güncel sürüm warnings-1-18.test.ts'te sınanır (karar 0043); burada 1.17.0'ın geride kalmadığı denetlenir.
  it("motor en az 1.17.0, kural seti en az 1.14.0", () => {
    const parts = (version: string) => version.split(".").map(Number);
    const atLeast = (version: string, minimum: string) => parts(version).reduce((result, value, index) => result ?? (value === parts(minimum)[index] ? undefined : value > parts(minimum)[index]), undefined as boolean | undefined) ?? true;
    expect(atLeast(ENGINE_VERSION, "1.17.0")).toBe(true);
    expect(atLeast(RULESET_VERSION, "1.14.0")).toBe(true);
  });
});

describe("özgül ağırlığın kesin tehlike sınırları (karar 0042)", () => {
  it("sabitler: yalnız balıkta 1,016–1,027, omurgasızlıda 1,017–1,027; hedefler ve güvenli aralık değişmedi", () => {
    expect(MARINE_SPECIFIC_GRAVITY_DANGER_LIMITS).toEqual({ fishOnly: [1.016, 1.027], invertebrates: [1.017, 1.027] });
    expect(MARINE_SPECIFIC_GRAVITY_SAFE).toEqual([1.017, 1.026]);
    expect(MARINE_TARGETS.fishOnly.specificGravity).toEqual([1.017, 1.025]);
    expect(MARINE_TARGETS.invertebrates.specificGravity).toEqual([1.024, 1.026]);
  });

  it("bant bir okuma basamağı: yalnız balıkta güvenli aralığın iki ucunun 0,001 dışı; omurgasızlıda yalnız üst ucun", () => {
    const [low, high] = MARINE_SPECIFIC_GRAVITY_SAFE;
    expect(MARINE_SPECIFIC_GRAVITY_DANGER_LIMITS.fishOnly[0]).toBeCloseTo(low - 0.001, 6);
    expect(MARINE_SPECIFIC_GRAVITY_DANGER_LIMITS.fishOnly[1]).toBeCloseTo(high + 0.001, 6);
    expect(MARINE_SPECIFIC_GRAVITY_DANGER_LIMITS.invertebrates[0]).toBe(low);
    expect(MARINE_SPECIFIC_GRAVITY_DANGER_LIMITS.invertebrates[1]).toBeCloseTo(high + 0.001, 6);
  });

  it("satır durumu sınırlarda (sınır dahil sarı): yalnız balık ve omurgasızlı ayrı", () => {
    const fish = [{ category: "fish" as const }];
    const reef = [{ category: "fish" as const }, { category: "shrimp" as const }];
    expect([1.0159, 1.016, 1.0169, 1.017, 1.025, 1.0251, 1.026, 1.027, 1.0271].map((value) => sgRow(value, fish)))
      .toEqual(["danger", "warning", "warning", "ok", "ok", "warning", "warning", "warning", "danger"]);
    expect([1.016, 1.0169, 1.017, 1.0239, 1.024, 1.026, 1.0261, 1.027, 1.0271].map((value) => sgRow(value, reef)))
      .toEqual(["danger", "danger", "warning", "warning", "ok", "ok", "warning", "warning", "danger"]);
  });
});

describe("kayan nokta payı (karar 0042, denetim bulgusu)", () => {
  const fish = [{ category: "fish" as const }];
  const reef = [{ category: "fish" as const }, { category: "shrimp" as const }];

  it("hesapla gelen sınır değeri sınırın kendisi sayılır: dört sınırda kayan nokta artığı basamak değiştirmez", () => {
    // Artık gerçekten var: toplama ve çıkarma sınırın hemen altına ya da üstüne düşer.
    expect(1.015 + 0.001).toBeLessThan(1.016);
    expect(1.028 - 0.001).toBeGreaterThan(1.027);
    expect(1.023 + 0.001).toBeLessThan(1.024);
    expect(1.026 - 0.001).toBeGreaterThan(1.025);
    // Yalnız balık: kesin tehlikenin alt sınırı (1,016) ve üst sınırı (1,027) sarı; hedefin üst ucu (1,025) hedefte.
    expect([1.015 + 0.001, 1.028 - 0.001, 1.026 - 0.001].map((value) => sgRow(value, fish))).toEqual(["warning", "warning", "ok"]);
    // Omurgasızlı: hedefin alt ucu (1,024) ve üst ucu (1,026) hedefte; kesin tehlikenin alt (1,017) ve üst (1,027) sınırı sarı.
    expect([1.023 + 0.001, 1.026 + 1e-12, 1.017 - 1e-12, 1.028 - 0.001].map((value) => sgRow(value, reef))).toEqual(["ok", "ok", "warning", "warning"]);
    // Genel sonuç da sınırdakiyle aynı.
    expectBand(sea(1.015 + 0.001), "1.015 + 0.001");
    expectBand(sea(1.028 - 0.001, withInvertebrate()), "1.028 - 0.001");
    expect(codes(sea(1.026 - 0.001))).not.toContain("marineSpecificGravity");
    expect(codes(sea(1.023 + 0.001, withInvertebrate()))).not.toContain("marineSpecificGravity");
  });

  it("pay yalnız artığı yutar: elle girilen dört, beş ve altı ondalıklı ölçüm kurala göre değerlendirilir", () => {
    expect([1.0159, 1.01599, 1.015999, 1.0271, 1.02701, 1.027001].map((value) => sgRow(value, fish))).toEqual(Array(6).fill("danger"));
    expect([1.02501, 1.025001, 1.01699, 1.016999].map((value) => sgRow(value, fish))).toEqual(Array(4).fill("warning"));
    expect([1.01699, 1.016999, 1.02701, 1.027001].map((value) => sgRow(value, reef))).toEqual(Array(4).fill("danger"));
    expect([1.02399, 1.023999, 1.02601, 1.026001].map((value) => sgRow(value, reef))).toEqual(Array(4).fill("warning"));
  });
});

describe("yalnız balıklı deniz akvaryumu: 1,016 ve 1,027 'dikkat' (karar 0042)", () => {
  it("1,016 (alt sınır, eşit): sarı uyarı, tam metin ve değişkenler, genel 74 'dikkat' (veri testi E20)", () => {
    const result = sea(1.016);
    expectBand(result, "1.016");
    expect(warningOf(result, "marineSpecificGravity")).toMatchObject({
      title: "Özgül ağırlık hedefin dışında",
      message: "OATA'nın yalnız balıklı akvaryum hedefi 1,017–1,025; son ölçüm 1,016.",
      params: { value: 1.016, min: 1.017, max: 1.025, profile: "fishOnly", direction: "low" },
    });
  });

  it("1,027 (üst sınır, eşit): sarı uyarı, tam metin ve değişkenler, genel 74 'dikkat' (veri testi E21)", () => {
    const result = sea(1.027);
    expectBand(result, "1.027");
    expect(warningOf(result, "marineSpecificGravity")).toMatchObject({
      message: "OATA'nın yalnız balıklı akvaryum hedefi 1,017–1,025; son ölçüm 1,027.",
      params: { value: 1.027, min: 1.017, max: 1.025, profile: "fishOnly", direction: "high" },
    });
  });

  it("bandın içi de sarı: 1,0161, 1,0165, 1,0169, 1,0261, 1,0265", () => {
    for (const value of [1.0161, 1.0165, 1.0169, 1.0261, 1.0265]) expectBand(sea(value), String(value));
  });

  it("bandın hemen dışı kesin tehlike: 1,0159 ve 1,0271; daha uzak değerler de (1,015, 1,010, 1,028, 1,030)", () => {
    for (const value of [1.0159, 1.0271, 1.015, 1.01, 1.028, 1.03]) expectDanger(sea(value), String(value));
    expect(warningOf(sea(1.015), "marineSpecificGravityDanger")).toMatchObject({
      level: "danger", title: "Özgül ağırlık güvenli aralığın dışında", message: DANGER_MESSAGE("1,015"),
      params: { value: 1.015, min: 1.017, max: 1.025, profile: "fishOnly", direction: "low" },
    });
    expect(warningOf(sea(1.028), "marineSpecificGravityDanger")?.message).toBe(DANGER_MESSAGE("1,028"));
  });

  it("su değeri ölçütü bant içinde, hedef dışındaki öbür sarıyla aynı (bir denetim başarısız)", () => {
    const water = (value: number) => sea(value).metrics.find((item) => item.key === "water");
    expect(water(1.016)).toEqual(water(1.026));
    expect(water(1.027)).toEqual(water(1.026));
    expect(water(1.016)!.score).toBeLessThan(water(1.02)!.score);
  });
});

describe("omurgasızlı deniz akvaryumu: üst uçta 1,027 'dikkat', alt uç değişmedi (karar 0042)", () => {
  it("1,027 (eşit): sarı uyarı, tam metin ve değişkenler, genel 74 'dikkat' (veri testi E23)", () => {
    const result = sea(1.027, withInvertebrate());
    expectBand(result, "1.027");
    expect(warningOf(result, "marineSpecificGravity")).toMatchObject({
      message: "OATA'nın omurgasızlı akvaryum hedefi 1,024–1,026; son ölçüm 1,027.",
      params: { value: 1.027, min: 1.024, max: 1.026, profile: "invertebrates", direction: "high" },
    });
    expectBand(sea(1.0261, withInvertebrate()), "1.0261");
  });

  it("1,0271 ve üstü kesin tehlike", () => {
    for (const value of [1.0271, 1.028]) expectDanger(sea(value, withInvertebrate()), String(value));
  });

  it("alt uç: 1,017 (eşit) sarı kalır; 1,0169 ve 1,016 kesin tehlike kalır (yalnız balıktan farklı)", () => {
    expectBand(sea(1.017, withInvertebrate()), "1.017");
    for (const value of [1.0169, 1.016]) expectDanger(sea(value, withInvertebrate()), String(value));
    expectBand(sea(1.016), "yalnız balık 1.016");
  });
});

describe("değişmeyenler (karar 0042)", () => {
  it("canlısız deniz akvaryumu: bant sarı ve tavansız (karar 0040); bandın dışı kesin tehlike sürer (karar 0041)", () => {
    for (const value of [1.016, 1.027]) {
      const result = analyze(tank(), [], equipped(), reading(value));
      expect(codes(result), String(value)).toEqual(["marineSpecificGravity"]);
      expect(result.score, String(value)).toBe(average(result));
    }
    for (const value of [1.0159, 1.0271]) {
      const result = analyze(tank(), [], equipped(), reading(value));
      expect(codes(result), String(value)).toEqual(["marineSpecificGravityDanger"]);
      expect(result.status, String(value)).toBe("danger");
    }
  });

  it("tuzlu suya da girebilen acı su türünün kendi aralığı sürer: 1,027 türün aralığı (en çok 1,026) dışında kesin tehlike", () => {
    const result = sea(1.027, [animal("brackishFish")]);
    expect(codes(result)).toEqual(expect.arrayContaining(["marineSpecificGravity", "salinityOutOfRange"]));
    expect(codes(result)).not.toContain("marineSpecificGravityDanger");
    expect(result.status).toBe("danger");
    const inside = sea(1.016, [animal("brackishFish")]);
    expect(codes(inside)).not.toContain("salinityOutOfRange");
    expectBand(inside, "acı su türü 1.016");
  });

  it("tatlı ve acı su akvaryumunda deniz hedefi yok", () => {
    for (const type of ["freshwater", "brackish"] as const) {
      const result = analyze(tank({ type }), [], equipped(), reading(1.016, { ph: 7.5 }));
      expect(result.marineWater, type).toBeUndefined();
      expect(codes(result).filter((code) => code.startsWith("marineSpecificGravity")), type).toEqual([]);
    }
  });
});
