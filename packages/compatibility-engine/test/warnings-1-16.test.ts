import { describe, expect, it } from "vitest";
import type { Aquarium, AquariumType, Equipment, Livestock, WaterParameters } from "@aquamind/domain";
import { ENGINE_VERSION, MARINE_TARGETS, RULESET_VERSION, createAnalyzer, type EquipmentProfileInput, type KnowledgeResolver, type SpeciesProfileInput } from "../src";

// Motor 1.16.0, kural seti 1.13.0 (docs/DECISIONS/0041-karides-tuzluluk-ve-baliksiz-dongu.md; ürün sahibinin onayı 2026-11-12):
// 1) "karides yer" kaydı kaynak boy sınırı vermiyorsa bütün karideslerde uyarır; `smallShrimpOnly` taşıyan kayıt yalnız 4 cm ve altı karideste;
// 2) yalnız balıklı deniz akvaryumunda özgül ağırlık hedefi 1,017–1,025;
// 3) canlı kaydı olmayan akvaryumda amonyak ya da nitrit sıfırın üstündeyse tek sarı "Canlı eklemek için erken" uyarısı, kesin tehlike yok, en fazla 74.
// Stub kayıtlarla, sınırlarından. Bu testler 1.15.0 davranışında başarısız olur.

const base = { minGroup: 1, ph: [6, 7.5] as [number, number], flow: "medium" as const, wasteFactor: 0.5, temperature: [22, 27] as [number, number] };
type StubSpecies = SpeciesProfileInput & { category: Livestock["category"] };
const species: Record<string, StubSpecies> = {
  calm: { id: "calm", commonName: "Sakin tür", category: "fish", adultSizeCm: 3, minVolumeL: 20, ...base },
  anyShrimpEater: { id: "anyShrimpEater", commonName: "Her karidesi yiyen", category: "fish", adultSizeCm: 12, minVolumeL: 50, ...base, behavior: { eatsShrimp: { source: "Practical Fishkeeping" } } },
  smallShrimpEater: { id: "smallShrimpEater", commonName: "Küçük karides yiyen", category: "fish", adultSizeCm: 5, minVolumeL: 20, ...base, behavior: { eatsShrimp: { source: "Fishkeeper", condition: "Küçük süs karidesleri.", smallShrimpOnly: true } } },
  disputedEater: { id: "disputedEater", commonName: "Tartışmalı yiyen", category: "fish", adultSizeCm: 6, minVolumeL: 20, ...base, behavior: { eatsShrimp: { source: "Practical Fishkeeping", conflict: true } } },
  dwarfShrimp: { id: "dwarfShrimp", commonName: "Cüce karides", category: "shrimp", adultSizeCm: 4, minVolumeL: 20, ...base },
  bigShrimp: { id: "bigShrimp", commonName: "Büyük karides", category: "shrimp", adultSizeCm: 4.1, minVolumeL: 20, ...base },
  marineFish: { id: "marineFish", commonName: "Deniz balığı", category: "fish", waterTypes: ["saltwater"], adultSizeCm: 5, minVolumeL: 50, minGroup: 1, temperature: [24, 27], flow: "medium", wasteFactor: 0.5 },
  marineShrimp: { id: "marineShrimp", commonName: "Deniz karidesi", category: "shrimp", waterTypes: ["saltwater"], adultSizeCm: 5, minVolumeL: 50, minGroup: 1, temperature: [24, 27], flow: "medium", wasteFactor: 0.5 },
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

const tank = (overrides: Partial<Aquarium> = {}): Aquarium => ({ id: "a", name: "Stub", type: "freshwater", lengthCm: 100, widthCm: 40, heightCm: 50, netVolumeLiters: 100, setupDate: "2026-01-01", ...overrides });
let counter = 0;
const animal = (catalogId: string, quantity = 1): Livestock => ({ id: `l-${catalogId}-${counter++}`, aquariumId: "a", catalogId, commonName: species[catalogId]?.commonName ?? catalogId, category: species[catalogId]?.category ?? "fish", quantity, addedAt: "2026-01-01" });
const device = (catalogId: string): Equipment => ({ id: `e-${catalogId}`, aquariumId: "a", catalogId, category: devices[catalogId].category, installedAt: "2026-01-01" });
const reading = (values: Partial<WaterParameters> = {}): WaterParameters => ({ id: "w", aquariumId: "a", measuredAt: "2026-11-12", temperature: 25, ph: 7, ammonia: 0, nitrite: 0, nitrate: 10, ...values });
const equipped = () => [device("filter"), device("heater")];
const codes = (result: ReturnType<typeof analyze>) => result.warnings.map((item) => item.code);
const warningOf = (result: ReturnType<typeof analyze>, code: string) => result.warnings.find((item) => item.code === code);
const average = (result: ReturnType<typeof analyze>) => Math.round(result.metrics.reduce((sum, item) => sum + item.score, 0) / result.metrics.length);

describe("sürüm (karar 0041)", () => {
  it("motor 1.16.0, kural seti 1.13.0", () => {
    expect([ENGINE_VERSION, RULESET_VERSION]).toEqual(["1.16.0", "1.13.0"]);
  });
});

describe("karides yeme uyarısı kaynağın kapsamına göre (karar 0041)", () => {
  it("kaynak boy sınırı vermiyorsa 4 cm'den büyük karideste de uyarır; genel puan en fazla 74", () => {
    const result = analyze(tank(), [animal("anyShrimpEater"), animal("bigShrimp", 5)], equipped(), reading());
    expect(warningOf(result, "shrimpEaten")).toMatchObject({
      level: "warning",
      title: "Karidesler yenebilir",
      message: "Kaynaklara göre Her karidesi yiyen karides yer; Büyük karides ve özellikle yavruları risk altındadır. Kaynak: Practical Fishkeeping.",
      params: { eaters: ["Her karidesi yiyen"], shrimp: ["Büyük karides"], sources: ["Practical Fishkeeping"] },
    });
    expect(result.metrics.find((item) => item.key === "compatibility")).toMatchObject({ score: 70, detailCode: "shrimpEaten" });
    expect(average(result)).toBeGreaterThan(74);
    expect(result).toMatchObject({ score: 74, status: "warning" });
  });

  it("smallShrimpOnly kaydı 4 cm'den büyük karideste uyarmaz, 4 cm'de (sınır dahil) uyarır", () => {
    const big = analyze(tank(), [animal("smallShrimpEater"), animal("bigShrimp", 5)], equipped(), reading());
    expect(codes(big)).not.toContain("shrimpEaten");
    expect(big.metrics.find((item) => item.key === "compatibility")).toMatchObject({ score: 100, detailCode: "compatible" });
    expect(big.status).toBe("good");
    const dwarf = analyze(tank(), [animal("smallShrimpEater"), animal("dwarfShrimp", 5)], equipped(), reading());
    expect(warningOf(dwarf, "shrimpEaten")?.params).toEqual({ eaters: ["Küçük karides yiyen"], shrimp: ["Cüce karides"], sources: ["Fishkeeper"] });
    expect(dwarf).toMatchObject({ score: 74, status: "warning" });
  });

  it("uyarı yalnız risk altındaki karidesleri sayar: küçük karides yiyen yalnızsa büyük karides listede yok", () => {
    const onlySmall = analyze(tank(), [animal("smallShrimpEater"), animal("dwarfShrimp", 5), animal("bigShrimp", 5)], equipped(), reading());
    expect(warningOf(onlySmall, "shrimpEaten")?.params.shrimp).toEqual(["Cüce karides"]);
    const both = analyze(tank(), [animal("smallShrimpEater"), animal("anyShrimpEater"), animal("dwarfShrimp", 5), animal("bigShrimp", 5)], equipped(), reading());
    expect(warningOf(both, "shrimpEaten")?.params).toEqual({
      eaters: ["Küçük karides yiyen", "Her karidesi yiyen"], shrimp: ["Cüce karides", "Büyük karides"], sources: ["Fishkeeper", "Practical Fishkeeping"],
    });
    expect(warningOf(both, "shrimpEaten")?.message).toBe(
      "Kaynaklara göre Küçük karides yiyen ve Her karidesi yiyen karides yer; Cüce karides ve Büyük karides ve özellikle yavruları risk altındadır. Kaynak: Fishkeeper, Practical Fishkeeping.",
    );
  });

  it("deniz akvaryumunda da: boy sınırı vermeyen kayıt 5 cm'lik deniz karidesinde uyarır", () => {
    const marineEater: StubSpecies = { ...species.marineFish, id: "marineEater", commonName: "Deniz karidesi yiyen", behavior: { eatsShrimp: { source: "Fishkeeper" } } };
    const marineSmallEater: StubSpecies = { ...species.marineFish, id: "marineSmallEater", commonName: "Küçük deniz karidesi yiyen", behavior: { eatsShrimp: { source: "Practical Fishkeeping", smallShrimpOnly: true } } };
    const marine = createAnalyzer({ ...resolver, speciesForLivestock: (item) => ({ marineEater, marineSmallEater } as Record<string, StubSpecies>)[item.catalogId!] ?? species[item.catalogId!] });
    const marineAnimal = (id: string, category: Livestock["category"]): Livestock => ({ id: `l-${id}`, aquariumId: "a", catalogId: id, commonName: id, category, quantity: 1, addedAt: "2026-01-01" });
    const sea = { type: "saltwater" as AquariumType };
    const water = reading({ ph: 8.1, specificGravity: 1.025, kh: 9, nitrate: 8 });
    expect(codes(marine(tank(sea), [marineAnimal("marineEater", "fish"), marineAnimal("marineShrimp", "shrimp")], equipped(), water))).toContain("shrimpEaten");
    expect(codes(marine(tank(sea), [marineAnimal("marineSmallEater", "fish"), marineAnimal("marineShrimp", "shrimp")], equipped(), water))).not.toContain("shrimpEaten");
  });

  it("değişmeyenler: çelişkili kayıt uyarmaz; 'karides uyumu doğrulanmadı' yalnız 4 cm ve altı karideste", () => {
    expect(codes(analyze(tank(), [animal("disputedEater"), animal("bigShrimp", 5)], equipped(), reading()))).not.toContain("shrimpEaten");
    expect(codes(analyze(tank(), [animal("calm"), animal("bigShrimp", 5)], equipped(), reading()))).not.toContain("shrimpUnverified");
    expect(codes(analyze(tank(), [animal("calm"), animal("dwarfShrimp", 5)], equipped(), reading()))).toContain("shrimpUnverified");
    expect(codes(analyze(tank(), [animal("disputedEater"), animal("dwarfShrimp", 5)], equipped(), reading()))).toEqual(expect.arrayContaining(["shrimpUnverified"]));
  });
});

describe("yalnız balıklı deniz akvaryumunda özgül ağırlık hedefi 1,017–1,025 (karar 0041)", () => {
  const sea = (specificGravity: number, animals = [animal("marineFish")]) => analyze(tank({ type: "saltwater" }), animals, equipped(), reading({ ph: 8.1, specificGravity, kh: 9, nitrate: 8 }));

  it("hedef sabitleri: yalnız balıkta üst sınır 1,025; omurgasızlı hedef ve güvenli aralık değişmedi", () => {
    expect(MARINE_TARGETS.fishOnly.specificGravity).toEqual([1.017, 1.025]);
    expect(MARINE_TARGETS.invertebrates.specificGravity).toEqual([1.024, 1.026]);
  });

  it("1,025 yalnız balıklı akvaryumda temiz ve 'uygun'; 1,0251–1,026 sarı ve 'dikkat'; 1,026'nın üstü kesin tehlike", () => {
    for (const value of [1.017, 1.02, 1.024, 1.025]) {
      const result = sea(value);
      expect(codes(result), String(value)).not.toContain("marineSpecificGravity");
      expect(result.status, String(value)).toBe("good");
    }
    for (const value of [1.0251, 1.026]) {
      const result = sea(value);
      expect(warningOf(result, "marineSpecificGravity")?.params, String(value)).toEqual({ value, min: 1.017, max: 1.025, profile: "fishOnly", direction: "high" });
      expect(result).toMatchObject({ score: 74, status: "warning" });
    }
    expect(warningOf(sea(1.026), "marineSpecificGravity")?.message).toBe("OATA'nın yalnız balıklı akvaryum hedefi 1,017–1,025; son ölçüm 1,026.");
    expect(sea(1.0261)).toMatchObject({ status: "danger" });
    expect(sea(1.0169)).toMatchObject({ status: "danger" });
  });

  it("omurgasızlı akvaryumda bugünkü hedef: 1,023 sarı, 1,025 temiz", () => {
    expect(codes(sea(1.023, [animal("marineFish"), animal("marineShrimp")]))).toContain("marineSpecificGravity");
    expect(codes(sea(1.025, [animal("marineFish"), animal("marineShrimp")]))).not.toContain("marineSpecificGravity");
  });
});

describe("canlısız akvaryumda amonyak ve nitrit (karar 0041)", () => {
  const empty = (water: Partial<WaterParameters>, type: AquariumType = "freshwater") => analyze(tank({ type }), [], equipped(), reading({ ...(type === "freshwater" ? {} : { ph: 8.1, specificGravity: type === "saltwater" ? 1.022 : 1.01 }), ...water }));
  const MESSAGE_TAIL = "Canlı eklemeden önce amonyak ve nitrit sıfıra inmeli.";

  it("amonyak ve nitrit sıfırsa uyarı ve tavan yok", () => {
    const result = empty({});
    expect(codes(result)).not.toContain("cycleIncomplete");
    expect(result.score).toBe(average(result));
    expect(result.status).toBe("good");
  });

  it("düşük amonyak: yalnız 'Canlı eklemek için erken', genel puan 74 'dikkat'", () => {
    const result = empty({ ammonia: 0.1 });
    expect(result.warnings).toEqual([{ level: "warning", title: "Canlı eklemek için erken", message: `Son ölçümde amonyak 0,1 ppm. ${MESSAGE_TAIL}`, code: "cycleIncomplete", params: { ammonia: 0.1 } }]);
    expect(average(result)).toBeGreaterThan(74);
    expect(result).toMatchObject({ score: 74, status: "warning" });
  });

  it("sınırı aşan nitrit kesin tehlike değil: 49 değil 74, kırmızı nitrit uyarısı yok", () => {
    const result = empty({ nitrite: 0.5 });
    expect(codes(result)).toEqual(["cycleIncomplete"]);
    expect(warningOf(result, "cycleIncomplete")).toMatchObject({ message: `Son ölçümde nitrit 0,5 ppm. ${MESSAGE_TAIL}`, params: { nitrite: 0.5 } });
    expect(result).toMatchObject({ score: 74, status: "warning" });
  });

  it("zehirli amonyak ve yüksek nitrit birlikte (D39 benzeri): tek uyarı, iki değer, 74", () => {
    const result = empty({ ammonia: 2, nitrite: 0.5, ph: 8.5, temperature: 28 });
    expect(result.warnings).toEqual([{ level: "warning", title: "Canlı eklemek için erken", message: `Son ölçümde amonyak 2 ppm ve nitrit 0,5 ppm. ${MESSAGE_TAIL}`, code: "cycleIncomplete", params: { ammonia: 2, nitrite: 0.5 } }]);
    expect(result).toMatchObject({ score: 74, status: "warning" });
  });

  it("pH ve sıcaklık yokken (en kötü durum) ve acı ile tuzlu suda da aynı", () => {
    const worst = analyze(tank(), [], equipped(), { id: "w", aquariumId: "a", measuredAt: "2026-11-12", ammonia: 2, nitrite: 0.5 });
    expect(codes(worst)).toEqual(["cycleIncomplete"]);
    expect(worst).toMatchObject({ score: 74, status: "warning" });
    for (const type of ["brackish", "saltwater"] as const) {
      const result = empty({ ammonia: 0.25 }, type);
      expect(codes(result), type).toEqual(["cycleIncomplete"]);
      expect(result, type).toMatchObject({ score: 74, status: "warning" });
    }
  });

  it("canlısız akvaryumdaki başka kesin tehlike sürer (deniz suyunda güvenli aralık dışı tuzluluk)", () => {
    const result = empty({ ammonia: 0.25, specificGravity: 1.03 }, "saltwater");
    expect(codes(result)).toEqual(expect.arrayContaining(["cycleIncomplete", "marineSpecificGravityDanger"]));
    expect(result.status).toBe("danger");
  });

  it("canlı varken bugünkü davranış: zehirli amonyak ve yüksek nitrit kesin tehlike (49), düşük amonyak 74; yeni uyarı çıkmaz", () => {
    const toxic = analyze(tank(), [animal("calm")], equipped(), reading({ ammonia: 2, ph: 8.5, temperature: 28 }));
    expect(codes(toxic)).toContain("ammoniaToxic");
    expect(toxic.score).toBeLessThanOrEqual(49);
    const nitrite = analyze(tank(), [animal("calm")], equipped(), reading({ nitrite: 0.5 }));
    expect(codes(nitrite)).toContain("nitriteHigh");
    expect(nitrite.status).toBe("danger");
    const low = analyze(tank(), [animal("calm")], equipped(), reading({ ammonia: 0.1 }));
    expect(codes(low)).toContain("ammoniaDetected");
    expect(low).toMatchObject({ score: 74, status: "warning" });
    for (const result of [toxic, nitrite, low]) expect(codes(result)).not.toContain("cycleIncomplete");
  });

  it("katalogda olmayan canlı kaydı da canlı sayılır: bugünkü kırmızı davranış", () => {
    const result = analyze(tank(), [animal("notInCatalog")], equipped(), reading({ nitrite: 0.5 }));
    expect(codes(result)).toEqual(expect.arrayContaining(["unmatchedAnimals", "nitriteHigh"]));
    expect(codes(result)).not.toContain("cycleIncomplete");
    expect(result.status).toBe("danger");
  });
});
