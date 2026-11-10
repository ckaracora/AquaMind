import { assertWarningFormatting } from "./warning-format-checks";
import { describe, expect, it } from "vitest";
import type { Aquarium, Equipment, Livestock, WaterParameters } from "@aquamind/domain";
import { createAnalyzer, type EquipmentProfileInput, type KnowledgeResolver, type SpeciesProfileInput } from "../src";

// Motor 1.14.0, kural seti 1.11.0 (docs/DECISIONS/0037-genel-durum-ve-uyari-duzeltmeleri.md): tehlikedeki ölçütün genel puana tavanı,
// cezasız topluluk notu, sarı alan ve grup uyarısında ölçüt tabanı, ölçülen sıcaklık ve pH uyarısı, soğuk su ve tek nokta uyarıları, filtre
// ve ısıtıcı yokluğu. Genişlik kuralı space.test.ts'de sınanır. Stub kayıtlarla, sınırlarından.

const base = { minGroup: 1, ph: [6, 7.5] as [number, number], flow: "medium" as const, wasteFactor: 0.5 };
const species: Record<string, SpeciesProfileInput & { category: Livestock["category"] }> = {
  calm: { id: "calm", commonName: "Sakin tür", category: "fish", adultSizeCm: 3, minVolumeL: 20, minTankLengthCm: 40, temperature: [22, 27], ...base },
  coldRange: { id: "coldRange", commonName: "Serin su türü", category: "fish", adultSizeCm: 3, minVolumeL: 20, temperature: [10, 18], ...base, ph: [7.8, 8.5] },
  warmEdge: { id: "warmEdge", commonName: "Ilık uçlu tür", category: "fish", adultSizeCm: 3, minVolumeL: 20, temperature: [27, 30], ...base, ph: [7.5, 8] },
  tropical: { id: "tropical", commonName: "Tropikal tür", category: "fish", group: "tetra", adultSizeCm: 3, minVolumeL: 20, temperature: [24, 28], ...base },
  edge23: { id: "edge23", commonName: "Eşik türü", category: "fish", adultSizeCm: 3, minVolumeL: 20, temperature: [23, 27], ...base },
  below23: { id: "below23", commonName: "Eşik altı tür", category: "fish", adultSizeCm: 3, minVolumeL: 20, temperature: [22.9, 27], ...base },
  warmShrimp: { id: "warmShrimp", commonName: "Ilık su karidesi", category: "shrimp", adultSizeCm: 3, minVolumeL: 20, temperature: [24, 28], ...base },
  hot: { id: "hot", commonName: "Sıcak su türü", category: "fish", adultSizeCm: 3, minVolumeL: 20, temperature: [25, 30], ...base },
  veryHot: { id: "veryHot", commonName: "Çok sıcak su türü", category: "fish", adultSizeCm: 3, minVolumeL: 20, temperature: [26, 30], ...base },
  point: { id: "point", commonName: "Tek sıcaklıklı tür", category: "fish", adultSizeCm: 3, minVolumeL: 20, temperature: [25, 25], ...base },
  goldfish: { id: "goldfish", commonName: "Soğuk su balığı", category: "fish", group: "coldwater", adultSizeCm: 10, minVolumeL: 50, temperature: [4, 25], ...base, ph: [6, 8] },
  // Yalnız kuralın "soğuk su türü değil" koşulunu sınamak için: katalogda en düşük sıcaklığı 23 °C ve üstü olan soğuk su türü yok.
  oddCold: { id: "oddCold", commonName: "Ilık soğuk su türü", category: "fish", group: "coldwater", adultSizeCm: 3, minVolumeL: 20, temperature: [23, 25], ...base },
  cautious: { id: "cautious", commonName: "Bölgeci tür", category: "fish", adultSizeCm: 5, minVolumeL: 40, minTankLengthCm: 60, temperature: [22, 27], ...base, communityCaution: "Bölgecidir; yavaş balıkları taciz edebilir." },
  shoal: { id: "shoal", commonName: "Sürü türü", category: "fish", adultSizeCm: 3, minVolumeL: 20, temperature: [22, 27], ...base, minGroup: 6 },
  big: { id: "big", commonName: "Büyük tür", category: "fish", adultSizeCm: 20, minVolumeL: 200, minTankLengthCm: 100, temperature: [22, 27], ...base },
  marine: { id: "marine", commonName: "Deniz türü", category: "fish", waterTypes: ["saltwater"], adultSizeCm: 5, minVolumeL: 50, minGroup: 1, temperature: [24, 27], flow: "medium", wasteFactor: 0.5 },
};
const devices: Record<string, EquipmentProfileInput> = {
  filter: { id: "filter", category: "filter", brand: "Stub", model: "F200", ratedFlowLph: 400, recommendedMaxL: 200 },
  heater: { id: "heater", category: "heater", brand: "Stub", model: "H100", powerW: 100, recommendedMinL: 50, recommendedMaxL: 250 },
  bigHeater: { id: "bigHeater", category: "heater", brand: "Stub", model: "H300", powerW: 300, recommendedMinL: 200, recommendedMaxL: 400 },
  skimmer: { id: "skimmer", category: "filter", brand: "Stub", model: "Skimmer", auxiliaryFiltration: true },
  media: { id: "media", category: "filter", brand: "Stub", model: "Malzeme", passiveComponent: true },
  substrate: { id: "substrate", category: "heater", brand: "Stub", model: "Taban 10", powerW: 10, recommendedMinL: 40, recommendedMaxL: 120, passiveComponent: true },
  heaterFilter: { id: "heaterFilter", category: "filter", brand: "Stub", model: "Isıtıcılı", ratedFlowLph: 400, recommendedMaxL: 200, integratedHeaterW: 100 },
  unverifiedFilter: { id: "unverifiedFilter", category: "filter", brand: "Stub", model: "Doğrulanmamış", ratedFlowLph: 400 },
  unverifiedHeater: { id: "unverifiedHeater", category: "heater", brand: "Stub", model: "Doğrulanmamış", powerW: 100 },
};
const resolver: KnowledgeResolver = {
  speciesForLivestock: (item) => (item.catalogId ? species[item.catalogId] : undefined),
  profileForEquipment: (item) => (item.catalogId ? devices[item.catalogId] : undefined),
  isVerifiedSpeciesProfile: (profile) => profile !== undefined,
  isVerifiedEquipmentProfile: (profile) => profile !== undefined && !profile.id.startsWith("unverified"),
};
const analyze = createAnalyzer(resolver);

const tank = (overrides: Partial<Aquarium> = {}): Aquarium => ({ id: "a", name: "Stub", type: "freshwater", lengthCm: 100, widthCm: 40, heightCm: 50, netVolumeLiters: 100, setupDate: "2026-01-01", ...overrides });
let counter = 0;
const animal = (catalogId: string, quantity = 1): Livestock => ({ id: `l-${catalogId}-${counter++}`, aquariumId: "a", catalogId, commonName: species[catalogId]?.commonName ?? "Tanınmayan", category: species[catalogId]?.category ?? "fish", quantity, addedAt: "2026-01-01" });
const device = (catalogId: string, category: Equipment["category"] = devices[catalogId]?.category ?? "filter"): Equipment => ({ id: `e-${catalogId}`, aquariumId: "a", catalogId, category, installedAt: "2026-01-01" });
const reading = (values: Partial<WaterParameters>): WaterParameters => ({ id: "w", aquariumId: "a", measuredAt: "2026-11-10", ...values });
const equipped = () => [device("filter"), device("heater")];
const metric = (result: ReturnType<typeof analyze>, key: string) => result.metrics.find((item) => item.key === key)!;
const warning = (result: ReturnType<typeof analyze>, code: string) => result.warnings.find((item) => item.code === code);
const codes = (result: ReturnType<typeof analyze>) => result.warnings.map((item) => item.code);

describe("genel durum: tehlikedeki ölçüt en fazla 'dikkat' yapar (karar 0037, 1)", () => {
  it("tehlike uyarısı olmasa da tehlikedeki bir ölçüt genel puanı 74'e çeker", () => {
    // Filtre kayıtlı değil (ölçüt 35); uyarılar yalnız sarı. Ortalama 89 olurdu.
    const result = analyze(tank(), [animal("calm")], [], reading({ temperature: 25, ph: 7 }));
    expect(result.metrics.map((item) => [item.key, item.score])).toEqual([["load", 100], ["space", 100], ["social", 100], ["compatibility", 100], ["filter", 35], ["heater", 75], ["water", 100], ["confidence", 100]]);
    expect(result.warnings.every((item) => item.level === "warning")).toBe(true);
    expect(result).toMatchObject({ score: 74, status: "warning" });
    // Aynı akvaryum filtre ve ısıtıcıyla: tehlikede ölçüt yok, puan ortalamadır.
    expect(analyze(tank(), [animal("calm")], equipped(), reading({ temperature: 25, ph: 7 }))).toMatchObject({ score: 99, status: "good" });
  });

  it("su değeri ölçütü tehlikedeyse de 74", () => {
    const result = analyze(tank(), [animal("calm")], equipped(), reading({ temperature: 30, ph: 8 }));
    expect(metric(result, "water")).toMatchObject({ score: 0, status: "danger" });
    expect(result).toMatchObject({ score: 74, status: "warning" });
  });

  it("veri güveni tavan koymaz", () => {
    const result = analyze(tank(), [animal("calm"), ...["u1", "u2", "u3", "u4"].map((id) => animal(id))], equipped(), reading({ temperature: 25, ph: 7 }));
    expect(metric(result, "confidence")).toMatchObject({ score: 43, status: "danger" });
    expect(result).toMatchObject({ score: 92, status: "good" });
  });

  it("canlısı olmayan akvaryumda filtre ve ısıtıcı ölçütü tavan koymaz; canlı eklenince koyar", () => {
    const empty = analyze(tank(), [], [], reading({ temperature: 25 }));
    expect([metric(empty, "filter").score, metric(empty, "heater").score]).toEqual([35, 75]);
    expect(empty).toMatchObject({ score: 78, status: "good" });
    const strongHeater = analyze(tank(), [], [device("bigHeater")], reading({ temperature: 25 }));
    expect(metric(strongHeater, "heater")).toMatchObject({ score: 45, status: "danger" });
    expect(strongHeater.warnings.map((item) => [item.level, item.code])).toEqual([["warning", "heaterTooLarge"]]);
    expect(strongHeater).toMatchObject({ score: 81, status: "good" });
    expect(analyze(tank(), [animal("calm")], [device("bigHeater")], reading({ temperature: 25, ph: 7 }))).toMatchObject({ score: 74, status: "warning" });
  });

  it("kesin tehlikenin 49 sınırı önce gelir", () => {
    const result = analyze(tank(), [animal("calm"), animal("coldRange")], equipped());
    expect(codes(result)).toContain("temperatureConflict");
    expect(result.score).toBeLessThanOrEqual(49);
    expect(result.status).toBe("danger");
  });
});

describe("topluluk notu puanı düşürmez (karar 0037, 2)", () => {
  it("not sarı uyarı olarak kalır; tür uyumu cezası ve açıklaması yok", () => {
    const result = analyze(tank(), [animal("cautious"), animal("calm")], equipped(), reading({ temperature: 25, ph: 7 }));
    expect(warning(result, "communityCaution")).toMatchObject({ level: "warning", title: "Bölgeci tür: tank arkadaşı seçimine dikkat", message: "Bölgecidir; yavaş balıkları taciz edebilir." });
    expect(metric(result, "compatibility")).toMatchObject({ score: 100, status: "good", detailCode: "compatible", detail: "Ortak yaşam aralıkları mevcut" });
    expect(result).toMatchObject({ score: 99, status: "good" });
  });
});

describe("sarı alan ve grup uyarısı ölçütü tehlikeye düşürmez (karar 0037, 3)", () => {
  it("alan: tek türde sarı uyarı 60; oran 60'ın üstündeyse oran", () => {
    const roomy = tank({ netVolumeLiters: 150 });
    expect(metric(analyze(roomy, [animal("big")], []), "space")).toMatchObject({ score: 60, status: "warning", detailCode: "spaceLimited" });
    expect(metric(analyze(roomy, [animal("big"), animal("calm")], []), "space").score).toBe(60);
    expect(metric(analyze(roomy, [animal("big"), animal("calm"), animal("tropical")], []), "space").score).toBe(73);
    // Kırmızı alan uyarısında en fazla 35 (değişmedi).
    expect(metric(analyze(tank({ netVolumeLiters: 150, lengthCm: 59 }), [animal("big")], []), "space")).toMatchObject({ score: 20, status: "danger" });
  });

  it("sosyal: tek türde düşük grup 60; oran 60'ın üstündeyse oran", () => {
    const single = analyze(tank(), [animal("shoal", 3)], []);
    expect(warning(single, "groupLow")?.level).toBe("warning");
    expect(metric(single, "social")).toMatchObject({ score: 60, status: "warning", detailCode: "groupLow" });
    expect(metric(analyze(tank(), [animal("shoal", 3), animal("calm")], []), "social").score).toBe(68);
    expect(metric(analyze(tank(), [animal("shoal", 6)], []), "social")).toMatchObject({ score: 100, detailCode: "groupOk" });
  });
});

describe("ölçülen sıcaklık ve pH türün aralığı dışında (karar 0037, 4)", () => {
  it("aralığın üstünde: parametre başına tek sarı uyarı, ortak aralıkla", () => {
    const result = analyze(tank(), [animal("calm")], equipped(), reading({ temperature: 28, ph: 8 }));
    expect(warning(result, "speciesTemperatureOutOfRange")).toEqual({
      level: "warning", title: "Sıcaklık canlı aralığı dışında", code: "speciesTemperatureOutOfRange",
      message: "Son ölçüm 28 °C; bu değer Sakin tür için kaynaktaki aralığın üstünde. Seçilen canlıların ortak aralığı 22–27 °C; sıcaklığı yavaşça bu aralığa getirin.",
      params: { value: 28, above: ["Sakin tür"], below: [], hasRange: true, min: 22, max: 27 },
    });
    expect(warning(result, "speciesPhOutOfRange")).toEqual({
      level: "warning", title: "pH canlı aralığı dışında", code: "speciesPhOutOfRange",
      message: "Son ölçüm pH 8; bu değer Sakin tür için kaynaktaki aralığın üstünde. Seçilen canlıların ortak pH aralığı 6–7,5; pH'ı yavaşça bu aralığa getirin.",
      params: { value: 8, above: ["Sakin tür"], below: [], hasRange: true, min: 6, max: 7.5 },
    });
  });

  it("aralığın altında; birden çok türde yalnız dışında kalanlar sayılır", () => {
    const result = analyze(tank(), [animal("calm"), animal("tropical")], equipped(), reading({ temperature: 23, ph: 5.5 }));
    expect(warning(result, "speciesTemperatureOutOfRange")).toMatchObject({
      message: "Son ölçüm 23 °C; bu değer Tropikal tür için kaynaktaki aralığın altında. Seçilen canlıların ortak aralığı 24–27 °C; sıcaklığı yavaşça bu aralığa getirin.",
      params: { value: 23, above: [], below: ["Tropikal tür"], hasRange: true, min: 24, max: 27 },
    });
    expect(warning(result, "speciesPhOutOfRange")?.params).toEqual({ value: 5.5, above: [], below: ["Sakin tür", "Tropikal tür"], hasRange: true, min: 6, max: 7.5 });
    expect(warning(result, "speciesPhOutOfRange")?.message).toMatch(/^Son ölçüm pH 5,5; bu değer Sakin tür ve Tropikal tür için kaynaktaki aralığın altında\./);
  });

  it("ortak aralık yoksa da çıkar; iki yön birlikte yazılır, ortak aralık yazılmaz", () => {
    const result = analyze(tank(), [animal("calm"), animal("coldRange")], equipped(), reading({ temperature: 20, ph: 7.6 }));
    expect(codes(result)).toEqual(expect.arrayContaining(["temperatureConflict", "phConflict"]));
    expect(warning(result, "speciesTemperatureOutOfRange")).toMatchObject({
      level: "warning",
      message: "Son ölçüm 20 °C; bu değer Serin su türü için kaynaktaki aralığın üstünde, Sakin tür için altında.",
      params: { value: 20, above: ["Serin su türü"], below: ["Sakin tür"], hasRange: false, min: 0, max: 0 },
    });
    expect(warning(result, "speciesPhOutOfRange")?.message).toBe("Son ölçüm pH 7,6; bu değer Sakin tür için kaynaktaki aralığın üstünde, Serin su türü için altında.");
    // Uyarılar kesin tehlike listesine girmez; sıra: ölçüm uyarıları sıcaklık çatışmasından önce.
    expect(codes(result).indexOf("speciesTemperatureOutOfRange")).toBeLessThan(codes(result).indexOf("temperatureConflict"));
  });

  it("ortak aralık tek noktaysa o değeri söyler", () => {
    const result = analyze(tank(), [animal("calm"), animal("warmEdge")], equipped(), reading({ temperature: 28, ph: 7.8 }));
    expect(warning(result, "speciesTemperatureOutOfRange")?.message).toBe("Son ölçüm 28 °C; bu değer Sakin tür için kaynaktaki aralığın üstünde. Seçilen canlıların ortak sıcaklığı yalnız 27 °C; sıcaklığı yavaşça bu değere getirin.");
    expect(warning(result, "speciesPhOutOfRange")?.message).toBe("Son ölçüm pH 7,8; bu değer Sakin tür için kaynaktaki aralığın üstünde. Seçilen canlıların ortak pH değeri yalnız 7,5; pH'ı yavaşça bu değere getirin.");
  });

  it("sınırlar içeride; geçersiz ya da eksik ölçümde, pH aralığı olmayan canlıda ve tanınmayan canlıda uyarı yok", () => {
    const measured = (values: Partial<WaterParameters>, animals = [animal("calm")]) => codes(analyze(tank(), animals, equipped(), reading(values))).filter((code) => code === "speciesTemperatureOutOfRange" || code === "speciesPhOutOfRange");
    expect(measured({ temperature: 27, ph: 7.5 })).toEqual([]);
    expect(measured({ temperature: 22, ph: 6 })).toEqual([]);
    expect(measured({ temperature: Number.NaN, ph: Number.POSITIVE_INFINITY })).toEqual([]);
    expect(measured({ nitrate: 10 })).toEqual([]);
    expect(codes(analyze(tank(), [animal("calm")], equipped()))).not.toContain("speciesTemperatureOutOfRange");
    expect(measured({ temperature: 30, ph: 9 }, [animal("unknown")])).toEqual([]);
    const marine = analyze(tank({ type: "saltwater" }), [animal("marine")], equipped(), reading({ temperature: 25, ph: 6, specificGravity: 1.022 }));
    expect(codes(marine)).toContain("marinePh");
    expect(codes(marine)).not.toContain("speciesPhOutOfRange");
  });

  it("su değeri ölçütü bugünkü gibi denetim oranıyla hesaplanır", () => {
    expect(metric(analyze(tank(), [animal("calm")], equipped(), reading({ temperature: 28, ph: 7 })), "water")).toMatchObject({ score: 50, status: "warning" });
  });
});

describe("soğuk su türü, tropikal balık ve tek noktada kesişen aralıklar (karar 0037, 5)", () => {
  it("soğuk su türü tropikal balıkla birlikteyse sarı uyarı; tür uyumu cezası yok", () => {
    const result = analyze(tank(), [animal("goldfish"), animal("tropical")], equipped());
    expect(warning(result, "coldwaterWithTropical")).toEqual({
      level: "warning", title: "Soğuk su türü ile tropikal balık bir arada", code: "coldwaterWithTropical",
      message: "Soğuk su balığı soğuk su türü, Tropikal tür tropikal balık. Seçilen canlıların ortak sıcaklık aralığı yalnız 24–25 °C. Soğuk su türlerini tropikal balıklardan ayrı bir akvaryumda tutmayı düşünün.",
      params: { coldwater: ["Soğuk su balığı"], tropical: ["Tropikal tür"], min: 24, max: 25 },
    });
    expect(metric(result, "compatibility")).toMatchObject({ score: 100, detailCode: "compatible" });
    expect(codes(result)).not.toContain("temperatureRangeNarrow");
  });

  it("ikisi birlikte tutarsa yalnız soğuk su uyarısı çıkar ve tek noktayı söyler", () => {
    const result = analyze(tank(), [animal("goldfish"), animal("hot")], equipped());
    expect(warning(result, "coldwaterWithTropical")?.message).toBe("Soğuk su balığı soğuk su türü, Sıcak su türü tropikal balık. Seçilen canlıların ortak sıcaklığı yalnız 25 °C. Soğuk su türlerini tropikal balıklardan ayrı bir akvaryumda tutmayı düşünün.");
    expect(codes(result)).not.toContain("temperatureRangeNarrow");
  });

  it("ortak aralık yoksa yalnız kırmızı sıcaklık çatışması çıkar", () => {
    const result = analyze(tank(), [animal("goldfish"), animal("veryHot")], equipped());
    expect(codes(result)).toContain("temperatureConflict");
    expect(codes(result).filter((code) => code === "coldwaterWithTropical" || code === "temperatureRangeNarrow")).toEqual([]);
  });

  it("tropikal balık: soğuk su türü değil ve en düşük sıcaklığı 23 °C ya da üstü; balık olmayan canlı bu uyarıya girmez", () => {
    expect(codes(analyze(tank(), [animal("goldfish"), animal("edge23")], equipped()))).toContain("coldwaterWithTropical");
    expect(codes(analyze(tank(), [animal("goldfish"), animal("below23")], equipped()))).not.toContain("coldwaterWithTropical");
    expect(codes(analyze(tank(), [animal("goldfish"), animal("calm")], equipped()))).not.toContain("coldwaterWithTropical");
    expect(codes(analyze(tank(), [animal("goldfish"), animal("oddCold")], equipped()))).not.toContain("coldwaterWithTropical");
    expect(codes(analyze(tank(), [animal("goldfish"), animal("warmShrimp")], equipped()))).not.toContain("coldwaterWithTropical");
  });

  it("türlerin ortak sıcaklığı tek bir değerse sarı uyarı; tek tür ya da aynı türün iki kaydı uyarı almaz", () => {
    const result = analyze(tank(), [animal("calm"), animal("warmEdge")], equipped());
    expect(warning(result, "temperatureRangeNarrow")).toEqual({
      level: "warning", title: "Türlerin sıcaklık ihtiyaçları tek bir değerde uyuşuyor", code: "temperatureRangeNarrow",
      message: "Seçilen canlıların kaynaktaki sıcaklık aralıklarının ortak noktası yalnız 27 °C. Sıcaklık bu değerden biraz bile saparsa en az bir canlı kendi aralığının dışında kalır; sıcaklığı sık ölçün ya da tür seçimini gözden geçirin.",
      params: { value: 27 },
    });
    expect(metric(result, "compatibility").score).toBe(100);
    expect(codes(analyze(tank(), [animal("point")], equipped()))).not.toContain("temperatureRangeNarrow");
    expect(codes(analyze(tank(), [animal("point"), animal("point")], equipped()))).not.toContain("temperatureRangeNarrow");
    expect(codes(analyze(tank(), [animal("point"), animal("hot")], equipped()))).toContain("temperatureRangeNarrow");
  });
});

describe("filtre ve ısıtıcı kayıtlı değil (karar 0037, 6)", () => {
  const filterMessage = "Akvaryumda kayıtlı bir filtre yok; canlı bulunan her akvaryumda filtre gerekir. Filtreniz varsa ekipman sayfasından ekleyin; yoksa akvaryuma uygun bir filtre kurun.";

  it("canlı varken filtre kaydı yoksa sarı uyarı; ölçüt 35 ve açıklaması 'Filtre kayıtlı değil'", () => {
    const result = analyze(tank(), [animal("calm")], [device("heater")]);
    expect(warning(result, "filterMissing")).toEqual({ level: "warning", title: "Filtre kayıtlı değil", message: filterMessage, code: "filterMissing", params: {} });
    expect(metric(result, "filter")).toMatchObject({ score: 35, status: "danger", detailCode: "filterNotRecorded", detail: "Filtre kayıtlı değil" });
    expect(result.score).toBeLessThanOrEqual(74);
  });

  it("canlısı olmayan akvaryumda filtre uyarısı çıkmaz", () => {
    const result = analyze(tank(), [], []);
    expect(codes(result)).toEqual([]);
    expect(metric(result, "filter").detailCode).toBe("filterNotRecorded");
  });

  it("katalog dışı, doğrulanmamış ya da yalnız yardımcı filtre kayıtlıysa filtre uyarısı çıkmaz; yalnız pasif parça kayıtlıysa çıkar", () => {
    const unmatched = analyze(tank(), [animal("calm")], [device("unknownFilter", "filter")]);
    expect(codes(unmatched)).toContain("unmatchedEquipment");
    expect(codes(unmatched)).not.toContain("filterMissing");
    expect(metric(unmatched, "filter").detailCode).toBe("noFilter");
    const unverified = analyze(tank(), [animal("calm")], [device("unverifiedFilter")]);
    expect(codes(unverified)).toContain("unverifiedEquipment");
    expect(codes(unverified)).not.toContain("filterMissing");
    const skimmer = analyze(tank(), [animal("calm")], [device("skimmer")]);
    expect(codes(skimmer)).toContain("primaryFilterRequired");
    expect(codes(skimmer)).not.toContain("filterMissing");
    const media = analyze(tank(), [animal("calm")], [device("media")]);
    expect(codes(media)).toContain("filterMissing");
    expect(metric(media, "filter").detailCode).toBe("noFilter");
  });

  it("tropikal canlı varken ısıtıcı kaydı yoksa sarı uyarı; adlar ve 23 °C eşiği", () => {
    const result = analyze(tank(), [animal("tropical"), animal("calm"), animal("warmShrimp")], [device("filter")]);
    expect(warning(result, "heaterMissing")).toEqual({
      level: "warning", title: "Isıtıcı kayıtlı değil", code: "heaterMissing",
      message: "Akvaryumda suyu ısıtan kayıtlı bir ısıtıcı yok. Kaynaklara göre Tropikal tür ve Ilık su karidesi için su en az 23 °C olmalı. Isıtıcınız varsa ekipman sayfasından ekleyin; yoksa akvaryuma uygun bir ısıtıcı kurun.",
      params: { tropical: ["Tropikal tür", "Ilık su karidesi"], min: 23, passive: false },
    });
    expect(metric(result, "heater")).toMatchObject({ score: 35, status: "danger", detailCode: "heaterNotRecorded", detail: "Isıtıcı kayıtlı değil" });
    expect(codes(result).slice(0, 1)).toEqual(["heaterMissing"]);
  });

  it("ısıtıcı kartı uyarıyla aynı tanımı kullanır: 23 °C sınır dahil, soğuk su türü sayılmaz", () => {
    const heaterOf = (id: string) => analyze(tank(), [animal(id)], [device("filter")]);
    for (const id of ["edge23", "warmShrimp"]) {
      expect(codes(heaterOf(id)), id).toContain("heaterMissing");
      expect(metric(heaterOf(id), "heater").score, id).toBe(35);
    }
    for (const id of ["below23", "oddCold", "calm"]) {
      expect(codes(heaterOf(id)), id).not.toContain("heaterMissing");
      expect(metric(heaterOf(id), "heater").score, id).toBe(75);
    }
  });

  it("yalnız taban ısıtma kablosu kayıtlıysa uyarı bunu söyler", () => {
    const result = analyze(tank(), [animal("tropical")], [device("filter"), device("substrate")]);
    expect(warning(result, "heaterMissing")?.message).toBe(
      "Akvaryumda suyu ısıtan kayıtlı bir ısıtıcı yok. Taban ısıtma kablosu suyu ısıtmak için değildir. Kaynaklara göre Tropikal tür için su en az 23 °C olmalı. Isıtıcınız varsa ekipman sayfasından ekleyin; yoksa akvaryuma uygun bir ısıtıcı kurun.",
    );
    expect(warning(result, "heaterMissing")?.params.passive).toBe(true);
    expect(metric(result, "heater").detailCode).toBe("noHeater");
  });

  it("ısıtıcı, ısıtıcılı filtre, katalog dışı ya da doğrulanmamış ısıtıcı kayıtlıysa uyarı çıkmaz", () => {
    const missing = (equipment: Equipment[]) => codes(analyze(tank(), [animal("tropical")], equipment)).includes("heaterMissing");
    expect(missing([device("filter"), device("heater")])).toBe(false);
    expect(missing([device("heaterFilter")])).toBe(false);
    expect(missing([device("filter"), device("unknownHeater", "heater")])).toBe(false);
    const unverified = analyze(tank(), [animal("tropical")], [device("filter"), device("unverifiedHeater")]);
    expect(codes(unverified)).toEqual(expect.arrayContaining(["unverifiedEquipment"]));
    expect(codes(unverified)).not.toContain("heaterMissing");
    expect(metric(unverified, "heater")).toMatchObject({ score: 35, detailCode: "noHeater" });
  });
});

it("ölçüm ve sınır yuvarlaması üç dilde farkı gizlemez", assertWarningFormatting);
