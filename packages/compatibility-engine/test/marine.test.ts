import { describe, expect, it } from "vitest";
import type { Aquarium, Livestock, WaterParameters } from "@aquamind/domain";
import { assessMarineWater, createAnalyzer, marineProfileFor, MARINE_SPECIFIC_GRAVITY_SAFE, MARINE_TARGETS, type KnowledgeResolver, type SpeciesProfileInput } from "../src";

// Motor 1.13.0: deniz akvaryumunun su hedefleri (docs/DECISIONS/0029-tuzlu-su-baslangic-paketi.md, 0030-deniz-suyu-hedefleri.md).
// Hedefler OATA'nın ev akvaryumu kurulum rehberinden (Eylül 2022); stub kayıtlarla sınanır.

const species: Record<string, SpeciesProfileInput> = {
  clown: { id: "clown", commonName: "Palyaço", waterTypes: ["saltwater"], adultSizeCm: 9, minVolumeL: 60, minTankLengthCm: 60, minGroup: 2, temperature: [23, 27], wasteFactor: 0.5 },
  shrimp: { id: "shrimp", commonName: "Temizlikçi karides", waterTypes: ["saltwater"], adultSizeCm: 5, minVolumeL: 40, minGroup: 1, temperature: [23, 27], wasteFactor: 0.2 },
  // Acı suda da yaşayan türün kendi (kaynaklı) tuzluluk ve pH aralığı vardır; tür denetimi sürer.
  puffer: { id: "puffer", commonName: "Acı su balığı", waterTypes: ["brackish", "saltwater"], adultSizeCm: 10, minVolumeL: 60, minTankLengthCm: 60, minGroup: 1, temperature: [24, 28], ph: [7.5, 8.5], specificGravity: [1.005, 1.015], wasteFactor: 0.5 },
};
const resolver: KnowledgeResolver = {
  speciesForLivestock: (item) => (item.catalogId ? species[item.catalogId] : undefined),
  profileForEquipment: () => undefined,
  isVerifiedSpeciesProfile: (profile) => profile !== undefined,
  isVerifiedEquipmentProfile: (profile) => profile !== undefined,
};
const analyze = createAnalyzer(resolver);
const tank = (type: Aquarium["type"] = "saltwater"): Aquarium => ({ id: "a", name: "Deniz", type, lengthCm: 100, widthCm: 40, heightCm: 50, netVolumeLiters: 160, setupDate: "2026-01-01" });
const animal = (catalogId: string, category: Livestock["category"], quantity = 1): Livestock => ({ id: `l-${catalogId}`, aquariumId: "a", catalogId, commonName: species[catalogId].commonName, category, quantity, addedAt: "2026-01-01" });
const reading = (values: Partial<WaterParameters>): WaterParameters => ({ id: "w", aquariumId: "a", measuredAt: "2026-10-01T10:00:00Z", ...values });
const rowsOf = (result: ReturnType<typeof assessMarineWater>) => Object.fromEntries(result!.rows.map((row) => [row.parameter, row.status]));
const codes = (analysis: ReturnType<typeof analyze>) => analysis.warnings.map((warning) => `${warning.code}:${warning.level}`);
const fishOnly = [animal("clown", "fish", 2)];
const withShrimp = [animal("clown", "fish", 2), animal("shrimp", "shrimp")];

describe("deniz suyu hedefleri (1.13.0)", () => {
  it("hedef: deniz akvaryumunda omurgasız (balık olmayan canlı) varsa omurgasızlı, yoksa yalnız balık; başka akvaryumda yok", () => {
    expect(marineProfileFor("saltwater", fishOnly)).toBe("fishOnly");
    expect(marineProfileFor("saltwater", [])).toBe("fishOnly");
    for (const category of ["shrimp", "snail", "other"] as const) expect(marineProfileFor("saltwater", [{ category: "fish" }, { category }])).toBe("invertebrates");
    expect(marineProfileFor("freshwater", fishOnly)).toBeUndefined();
    expect(marineProfileFor("brackish", withShrimp)).toBeUndefined();
    expect(assessMarineWater("freshwater", fishOnly, reading({ specificGravity: 1.025 }))).toBeUndefined();
  });

  it("OATA rehberinin değerleri ve güvenli aralık (iki hedefin birleşimi)", () => {
    expect(MARINE_TARGETS.fishOnly).toMatchObject({ specificGravity: [1.017, 1.023], ph: [8.0, 8.2], nitrateMax: 20, temperatureInfo: [24, 27] });
    expect(MARINE_TARGETS.invertebrates).toMatchObject({ specificGravity: [1.024, 1.026], ph: [8.0, 8.2], kh: [8, 12], nitrateInfo: [5, 10], phosphateInfo: [0.04, 0.1], temperatureInfo: [24, 26] });
    expect(MARINE_SPECIFIC_GRAVITY_SAFE).toEqual([MARINE_TARGETS.fishOnly.specificGravity[0], MARINE_TARGETS.invertebrates.specificGravity[1]]);
  });

  it("yalnız balık: sınırlar hedefin içinde; hedef dışı sarı, güvenli aralık dışı tehlike; nitrat en çok 20", () => {
    for (const specificGravity of [1.017, 1.02, 1.023]) expect(rowsOf(assessMarineWater("saltwater", fishOnly, reading({ specificGravity }))).specificGravity).toBe("ok");
    for (const specificGravity of [1.016, 1.0169, 1.0261, 1.03]) expect(rowsOf(assessMarineWater("saltwater", fishOnly, reading({ specificGravity }))).specificGravity).toBe("danger");
    for (const specificGravity of [1.024, 1.025, 1.026]) expect(rowsOf(assessMarineWater("saltwater", fishOnly, reading({ specificGravity }))).specificGravity).toBe("warning");
    const rows = (ph: number, nitrate: number) => rowsOf(assessMarineWater("saltwater", fishOnly, reading({ ph, nitrate })));
    expect([rows(8.0, 20), rows(8.2, 0)].map((row) => [row.ph, row.nitrate])).toEqual([["ok", "ok"], ["ok", "ok"]]);
    expect([rows(7.9, 20.1), rows(8.3, 100)].map((row) => [row.ph, row.nitrate])).toEqual([["warning", "warning"], ["warning", "warning"]]);
    // Yalnız balıklı hedefte KH, fosfat yok; sıcaklık yalnız bilgi.
    expect(assessMarineWater("saltwater", fishOnly, reading({ kh: 3, phosphate: 1, temperature: 30 }))!.rows.map((row) => `${row.parameter}:${row.status}`)).toEqual([
      "specificGravity:missing", "ph:missing", "nitrate:missing", "temperature:info",
    ]);
  });

  it("omurgasızlı: özgül ağırlık 1,024–1,026, KH 8–12; nitrat ve fosfat \"türe bağlı\" olduğu için yalnız bilgi", () => {
    const rows = (values: Partial<WaterParameters>) => rowsOf(assessMarineWater("saltwater", withShrimp, reading(values)));
    expect(rows({ specificGravity: 1.024, kh: 8, ph: 8.1 })).toMatchObject({ specificGravity: "ok", kh: "ok", ph: "ok" });
    expect(rows({ specificGravity: 1.026, kh: 12 })).toMatchObject({ specificGravity: "ok", kh: "ok" });
    expect(rows({ specificGravity: 1.023, kh: 7.9 })).toMatchObject({ specificGravity: "warning", kh: "warning" });
    expect(rows({ specificGravity: 1.016, kh: 12.1 })).toMatchObject({ specificGravity: "danger", kh: "warning" });
    expect(rows({ nitrate: 80, phosphate: 1 })).toMatchObject({ nitrate: "info", phosphate: "info", temperature: "info" });
    expect(assessMarineWater("saltwater", withShrimp)).toMatchObject({ profile: "invertebrates", invertebratesPresent: true });
  });

  it("geçersiz ölçüm (negatif, sayı değil) ölçülmemiş sayılır", () => {
    expect(rowsOf(assessMarineWater("saltwater", fishOnly, reading({ specificGravity: Number.NaN, ph: -1, nitrate: Number.POSITIVE_INFINITY })))).toMatchObject({ specificGravity: "missing", ph: "missing", nitrate: "missing" });
  });
});

describe("sağlık analizinde deniz suyu (1.13.0)", () => {
  it("yalnız balık, özgül ağırlık 1,025: sarı uyarı, su değeri 6 denetimin 5'i; puan tehlikeye düşmez", () => {
    const analysis = analyze(tank(), fishOnly, [], reading({ temperature: 26, ph: 8.2, specificGravity: 1.025, nitrate: 15, ammonia: 0, nitrite: 0 }));
    expect(codes(analysis)).toContain("marineSpecificGravity:warning");
    expect(analysis.warnings.find((warning) => warning.code === "marineSpecificGravity")).toMatchObject({
      title: "Özgül ağırlık hedefin dışında", message: "OATA'nın yalnız balıklı akvaryum hedefi 1,017–1,023; son ölçüm 1,025.",
      params: { value: 1.025, min: 1.017, max: 1.023, profile: "fishOnly", direction: "high" },
    });
    expect(analysis.metrics.find((metric) => metric.key === "water")!.score).toBe(83);
    expect(analysis.score).toBeGreaterThan(49);
    expect(analysis.marineWater).toMatchObject({ profile: "fishOnly", invertebratesPresent: false });
  });

  it("güvenli aralığın dışındaki özgül ağırlık kesin tehlikedir: genel puan en çok 49", () => {
    for (const specificGravity of [1.016, 1.03]) {
      const analysis = analyze(tank(), fishOnly, [], reading({ temperature: 26, ph: 8.1, specificGravity }));
      expect(codes(analysis)).toContain("marineSpecificGravityDanger:danger");
      expect(codes(analysis)).not.toContain("marineSpecificGravity:warning");
      expect(analysis.score).toBeLessThanOrEqual(49);
      expect(analysis.status).toBe("danger");
    }
  });

  it("pH, KH ve nitrat hedefin dışında sarı uyarı; 100 mg/L üstü nitratta yalnız su kalitesi kuralının tehlikesi", () => {
    const reef = analyze(tank(), withShrimp, [], reading({ temperature: 26, ph: 8.3, specificGravity: 1.025, kh: 6, nitrate: 8, ammonia: 0, nitrite: 0 }));
    expect(codes(reef).filter((code) => code.startsWith("marine"))).toEqual(["marinePh:warning", "marineKh:warning"]);
    expect(reef.warnings.find((warning) => warning.code === "marineKh")!.message).toBe("OATA'nın omurgasızlı akvaryum hedefi KH 8–12 dKH; son ölçüm 6 dKH.");
    const nitrate = (value: number) => codes(analyze(tank(), fishOnly, [], reading({ temperature: 26, ph: 8.1, specificGravity: 1.021, nitrate: value })));
    expect(nitrate(40)).toContain("marineNitrate:warning");
    expect(nitrate(20)).not.toContain("marineNitrate:warning");
    expect(nitrate(150)).toContain("nitrateTooHighSaltwater:danger");
    expect(nitrate(150)).not.toContain("marineNitrate:warning");
    // Omurgasızlı akvaryumda nitrat yalnız bilgi: 80 mg/L uyarı vermez (100'ün üstü yine tehlike).
    expect(codes(analyze(tank(), withShrimp, [], reading({ specificGravity: 1.025, nitrate: 80 })))).not.toContain("marineNitrate:warning");
  });

  it("deniz akvaryumunda özgül ağırlık ölçümü yoksa uyarı; canlının kaydında tuzluluk aralığı olmasa da", () => {
    expect(codes(analyze(tank(), fishOnly, [], reading({ temperature: 26, ph: 8.1 })))).toContain("salinityReadingNeeded:warning");
    expect(codes(analyze(tank(), [], [], reading({ temperature: 26 })))).not.toContain("salinityReadingNeeded:warning");
  });

  it("pH aralığı olmayan canlı pH kesişimine ve tür pH denetimine girmez; tür tuzluluk aralığı olan canlı kendi denetimini sürdürür", () => {
    const mixed = analyze(tank(), [animal("clown", "fish", 2), animal("puffer", "fish")], [], reading({ temperature: 26, ph: 8.1, specificGravity: 1.021 }));
    expect(codes(mixed)).not.toContain("phConflict:danger");
    // Acı su türünün kaynaklı aralığı 1,005–1,015: 1,021 o tür için dışarıda (bugünkü tehlike kuralı).
    expect(codes(mixed)).toContain("salinityOutOfRange:danger");
    expect(analyze(tank("freshwater"), [], [], reading({ ph: 7 })).marineWater).toBeUndefined();
  });
});
