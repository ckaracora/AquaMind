import { describe, expect, it } from "vitest";
import type { Aquarium, Equipment, Livestock, WaterParameters } from "@aquamind/domain";
import {
  ENGINE_VERSION, LIVESTOCK_RISK_WARNING_CODES, RULESET_VERSION, createAnalyzer, isSecondarySpaceValue,
  type EquipmentProfileInput, type HealthAnalysis, type KnowledgeResolver, type SpeciesProfileInput,
} from "../src";

// Motor 1.20.0, kural seti 1.17.0 (docs/DECISIONS/0045-ikinci-kademe-kaynaklar.md; ürün sahibinin kararı 2026-11-14 22:30): kabul edilen
// kaynakların yazmadığı hacim ya da tank uzunluğu ikinci kademeden (en az üç bağımsız hobi kaynağı) geliyorsa alan uyarısı tek başına
// "uygun değil" demez, en çok "dikkat" olur ve metin bunu söyler. Aynı değer kabul edilen kaynaktan gelince bugünkü sonuç aynen kalır. Stub kayıtlarla.

type StubSpecies = SpeciesProfileInput & { category: Livestock["category"] };
const fresh = { minGroup: 1, temperature: [22, 27] as [number, number], ph: [6, 7.5] as [number, number], flow: "medium" as const, wasteFactor: 0.5, behavior: { peaceful: { source: "OATA" } } };
const hobby = ["https://hobby-a.example/fish", "https://hobby-b.example/fish", "https://hobby-c.example/fish"];
const base: Record<string, StubSpecies> = {
  // Hacim 100 L; kaynak uzunluk vermiyor.
  volume: { id: "volume", commonName: "Hacimli tür", category: "fish", adultSizeCm: 6, minVolumeL: 100, ...fresh },
  // Hacim 100 L, uzunluk 100 cm, yetişkin 20 cm (İsviçre uzunluk sınırı 60 cm).
  length: { id: "length", commonName: "Uzunluklu tür", category: "fish", adultSizeCm: 20, minVolumeL: 100, minTankLengthCm: 100, ...fresh },
  // Hacim 200 L, uzunluk 100 cm, yetişkin 20 cm.
  both: { id: "both", commonName: "İki ölçülü tür", category: "fish", adultSizeCm: 20, minVolumeL: 200, minTankLengthCm: 100, ...fresh },
};
const species: Record<string, StubSpecies> = {
  ...base,
  volumeSecondary: { ...base.volume, id: "volumeSecondary", secondarySources: { minVolumeL: hobby } },
  lengthSecondary: { ...base.length, id: "lengthSecondary", secondarySources: { minTankLengthCm: hobby } },
  bothSecondary: { ...base.both, id: "bothSecondary", secondarySources: { minVolumeL: hobby, minTankLengthCm: hobby } },
  volumeOnlySecondary: { ...base.both, id: "volumeOnlySecondary", secondarySources: { minVolumeL: hobby } },
  lengthOnlySecondary: { ...base.both, id: "lengthOnlySecondary", secondarySources: { minTankLengthCm: hobby } },
  emptyList: { ...base.volume, id: "emptyList", secondarySources: { minVolumeL: [] } },
};
const devices: Record<string, EquipmentProfileInput> = {
  filter: { id: "filter", category: "filter", brand: "Stub", model: "F600", ratedFlowLph: 2400, recommendedMaxL: 600 },
  heater: { id: "heater", category: "heater", brand: "Stub", model: "H100", powerW: 100, recommendedMinL: 10, recommendedMaxL: 600 },
};
const resolver: KnowledgeResolver = {
  speciesForLivestock: (item) => (item.catalogId ? species[item.catalogId] : undefined),
  profileForEquipment: (item) => (item.catalogId ? devices[item.catalogId] : undefined),
  isVerifiedSpeciesProfile: (profile) => profile !== undefined,
  isVerifiedEquipmentProfile: (profile) => profile !== undefined,
};
const analyze = createAnalyzer(resolver);
const tank = (netVolumeLiters: number, lengthCm: number, widthCm = 50, heightCm = 50): Aquarium => ({ id: "a", name: "Stub", type: "freshwater", lengthCm, widthCm, heightCm, netVolumeLiters, setupDate: "2026-01-01" });
let counter = 0;
const animal = (catalogId: string, quantity = 1): Livestock => ({ id: `l-${catalogId}-${counter++}`, aquariumId: "a", catalogId, commonName: species[catalogId].commonName, category: species[catalogId].category, quantity, addedAt: "2026-01-01" });
const device = (catalogId: string): Equipment => ({ id: `e-${catalogId}`, aquariumId: "a", catalogId, category: devices[catalogId].category, installedAt: "2026-01-01" });
const equipped = () => [device("filter"), device("heater")];
const reading = (): WaterParameters => ({ id: "w", aquariumId: "a", measuredAt: "2026-11-14", temperature: 25, ph: 7, ammonia: 0, nitrite: 0, nitrate: 10 });
const run = (aquarium: Aquarium, id: string, quantity = 1) => analyze(aquarium, [animal(id, quantity)], equipped(), reading());
const spaceWarnings = (result: HealthAnalysis) => result.warnings.filter((warning) => warning.code.startsWith("space"));
const space = (result: HealthAnalysis) => result.metrics.find((metric) => metric.key === "space")!;
const HOBBY_NOTE = " Bu türün hacim ya da uzunluk değeri kabul ettiğimiz kaynaklarda yok; birkaç hobi kaynağının ortak değeridir. Bu yüzden bu uyarı sonucu en fazla \"Dikkat\" yapar.";

describe("sürüm (karar 0045)", () => {
  it("motor 1.20.0, kural seti 1.17.0", () => {
    expect([ENGINE_VERSION, RULESET_VERSION]).toEqual(["1.20.0", "1.17.0"]);
  });

  it("alan uyarıları canlı riski sınıfında kalır (en çok 'dikkat' tavanı)", () => {
    for (const code of ["spaceTooSmall", "spaceSevere", "spaceNarrow", "spaceLimited"]) expect(LIVESTOCK_RISK_WARNING_CODES.has(code), code).toBe(true);
  });

  it("işaret yalnız kaynak adresi olan alanda sayılır (boş liste ikinci kademe değildir)", () => {
    expect(isSecondarySpaceValue(species.volumeSecondary, "minVolumeL")).toBe(true);
    expect(isSecondarySpaceValue(species.volumeSecondary, "minTankLengthCm")).toBe(false);
    expect(isSecondarySpaceValue(species.emptyList, "minVolumeL")).toBe(false);
    expect(isSecondarySpaceValue(species.volume, "minVolumeL")).toBe(false);
  });
});

describe("hacim gerekenin yarısından küçük (spaceTooSmall)", () => {
  it("kabul edilen kaynağın hacmi: bugünkü gibi kırmızı, kesin tehlike, hüküm 'uygun değil' (≤49)", () => {
    const result = run(tank(40, 120), "volume");
    expect(spaceWarnings(result)).toMatchObject([{ level: "danger", code: "spaceTooSmall" }]);
    expect(spaceWarnings(result)[0].params.secondary).toBeUndefined();
    expect(spaceWarnings(result)[0].message).toBe("Kaynağa göre Hacimli tür için kayıtlı 1 bireyle en az 100 L gerekir; akvaryumun net hacmi 40 L, gerekenin yarısından da az. Bu tür bu akvaryumda tutulmamalı.");
    expect(result.status).toBe("danger");
    expect(result.score).toBeLessThanOrEqual(49);
    expect(space(result)).toMatchObject({ score: 20, status: "danger", detailCode: "spaceSevere" });
  });

  it("ikinci kademe hacim: sarı, kesin tehlike değil, hüküm en çok 'dikkat' (50–74), metin hobi kaynaklarını söyler", () => {
    const result = run(tank(40, 120), "volumeSecondary");
    const [warning] = spaceWarnings(result);
    expect(spaceWarnings(result)).toHaveLength(1);
    expect(warning).toMatchObject({ level: "warning", code: "spaceTooSmall", title: "Hacimli tür: akvaryum çok küçük", params: { secondary: true, volume: 100, aquariumVolume: 40 } });
    expect(warning.message).toBe(`Birkaç hobi kaynağına göre Hacimli tür için kayıtlı 1 bireyle en az 100 L gerekir; akvaryumun net hacmi 40 L, gerekenin yarısından da az. Bu tür için daha büyük bir akvaryum gerekir.${HOBBY_NOTE}`);
    expect(result.status).toBe("warning");
    expect(result.score).toBeLessThanOrEqual(74);
    expect(result.score).toBeGreaterThanOrEqual(50);
    // Yüzme alanı ölçütü kırmızıya düşmez: sarı alan sorununun tabanı 60.
    expect(space(result)).toMatchObject({ score: 60, status: "warning", detailCode: "spaceLimited" });
  });

  it("hacim ve uzunluk ikinci kademede, uzunluk da kısa: yine sarı; metin iki ölçüyü de söyler", () => {
    const result = run(tank(80, 90), "bothSecondary");
    expect(spaceWarnings(result)).toMatchObject([{ level: "warning", code: "spaceTooSmall", params: { secondary: true, lengthShort: true } }]);
    expect(result.status).toBe("warning");
  });

  it("hacim ikinci kademede, kabul edilen kaynağın uzunluğu ve İsviçre sınırı da tutmuyor: kesin tehlike değil ama uyarı kırmızı, ölçüt 35", () => {
    // 80 L < 200 L'nin yarısı (ikinci kademe); uzunluk 50 cm < 100 cm (kabul edilen kaynak) ve < 3 × 20 cm.
    const result = run(tank(80, 50), "volumeOnlySecondary");
    expect(spaceWarnings(result)).toMatchObject([{ level: "danger", code: "spaceTooSmall", params: { secondary: true } }]);
    expect(result.score).toBeGreaterThanOrEqual(50);
    expect(result.score).toBeLessThanOrEqual(74);
    expect(space(result)).toMatchObject({ score: 20, status: "danger", detailCode: "spaceSevere" });
  });

  it("yalnız uzunluk ikinci kademede, kabul edilen kaynağın hacmi yarısından küçük: bugünkü gibi kesin tehlike", () => {
    const result = run(tank(80, 90), "lengthOnlySecondary");
    expect(spaceWarnings(result)).toMatchObject([{ level: "danger", code: "spaceTooSmall" }]);
    expect(spaceWarnings(result)[0].params.secondary).toBeUndefined();
    expect(result.status).toBe("danger");
    expect(result.score).toBeLessThanOrEqual(49);
  });

  it("boş kaynak listesi işaret sayılmaz: bugünkü gibi kesin tehlike", () => {
    expect(run(tank(40, 120), "emptyList").score).toBeLessThanOrEqual(49);
  });
});

describe("İsviçre uzunluk ya da derinlik sınırı (spaceSevere)", () => {
  it("kabul edilen kaynağın uzunluğu: bugünkü gibi kırmızı uyarı, ölçüt 35, genel en çok 74", () => {
    const result = run(tank(150, 50), "length");
    expect(spaceWarnings(result)).toMatchObject([{ level: "danger", code: "spaceSevere" }]);
    expect(space(result)).toMatchObject({ score: 20, status: "danger" });
    expect(result.score).toBeLessThanOrEqual(74);
  });

  it("ikinci kademe uzunluk: sarı uyarı, ölçüt kırmızıya düşmez, metnin sonunda hobi notu", () => {
    const result = run(tank(150, 50), "lengthSecondary");
    const [warning] = spaceWarnings(result);
    expect(warning).toMatchObject({ level: "warning", code: "spaceSevere", params: { secondary: true } });
    expect(warning.message.endsWith(HOBBY_NOTE)).toBe(true);
    expect(space(result)).toMatchObject({ score: 60, status: "warning" });
    expect(result.status).toBe("warning");
    expect(result.score).toBeLessThanOrEqual(74);
  });

  it("uzunluk ikinci kademede ama kabul edilen kaynağın hacmi de yetmiyor: bugünkü gibi kırmızı uyarı, not yok", () => {
    // 120 L < 200 L (kabul edilen kaynak, yarısından büyük); uzunluk 50 cm < 100 cm (ikinci kademe) ve < 60 cm.
    const result = run(tank(120, 50), "lengthOnlySecondary");
    const [warning] = spaceWarnings(result);
    expect(warning).toMatchObject({ level: "danger", code: "spaceSevere" });
    expect(warning.params.secondary).toBeUndefined();
    expect(warning.message).not.toContain("hobi");
  });
});

describe("sarı alan uyarıları (spaceLimited, spaceNarrow)", () => {
  it("ikinci kademe hacim sınırda: aynı sarı uyarı, metne not eklenir; puan aynı", () => {
    const primary = run(tank(70, 120), "volume");
    const secondary = run(tank(70, 120), "volumeSecondary");
    expect(spaceWarnings(primary)).toMatchObject([{ level: "warning", code: "spaceLimited", message: "Kayıtlı adet için minimum 100 L referansı kullanıldı; kaynak tank uzunluğu yayımlamıyor." }]);
    expect(spaceWarnings(secondary)).toMatchObject([{ level: "warning", code: "spaceLimited", message: `Kayıtlı adet için minimum 100 L referansı kullanıldı; kaynak tank uzunluğu yayımlamıyor.${HOBBY_NOTE}`, params: { secondary: true } }]);
    expect(secondary.score).toBe(primary.score);
    expect(secondary.metrics).toEqual(primary.metrics);
  });

  it("ikinci kademe uzunluk, genişlik yetmiyor: sarı 'dar' uyarısı notla", () => {
    const result = run(tank(150, 80, 30), "lengthSecondary");
    expect(spaceWarnings(result)).toMatchObject([{ level: "warning", code: "spaceNarrow", params: { secondary: true } }]);
    expect(spaceWarnings(result)[0].message.endsWith(HOBBY_NOTE)).toBe(true);
  });

  it("kaynağın önerisini karşılayan akvaryum ikinci kademe değerle de uyarı almaz", () => {
    expect(spaceWarnings(run(tank(250, 120), "bothSecondary"))).toEqual([]);
  });
});

// Kontrol turu (2026-11-15): iki ikinci kademe ölçünün birlikte tutmadığı durum ve iki farklı türün karıştığı akvaryum.
describe("karışık durumlar (kontrol turu)", () => {
  const runMany = (aquarium: Aquarium, ids: string[]) => analyze(aquarium, ids.map((id) => animal(id)), equipped(), reading());

  it("hacim ve uzunluk ikinci kademede, hacim yarısından küçük ve İsviçre uzunluk sınırı da tutmuyor: yine sarı, ölçüt 60", () => {
    // 80 L < 200 L'nin yarısı; 50 cm < 100 cm ve < 3 × 20 cm. Eksik kalan iki ölçü de ikinci kademede.
    const result = run(tank(80, 50), "bothSecondary");
    expect(spaceWarnings(result)).toMatchObject([{ level: "warning", code: "spaceTooSmall", params: { secondary: true, lengthShort: true } }]);
    expect(space(result)).toMatchObject({ score: 60, status: "warning", detailCode: "spaceLimited" });
    expect(result.status).toBe("warning");
    expect(result.score).toBeGreaterThanOrEqual(50);
    expect(result.score).toBeLessThanOrEqual(74);
  });

  it("biri ikinci kademe, biri kabul edilen kaynak hacmiyle yarısından küçük: kabul edilenin kırmızısı kesin tehlike (≤49), öbürü sarı kalır", () => {
    const result = runMany(tank(40, 120), ["volumeSecondary", "volume"]);
    const byName = Object.fromEntries(spaceWarnings(result).map((warning) => [warning.params.name, warning]));
    expect(byName["Hacimli tür"]).toMatchObject({ level: "danger", code: "spaceTooSmall" });
    expect(byName["Hacimli tür"].params.secondary).toBeUndefined();
    expect(byName["Hacimli tür"].message).not.toContain("hobi");
    expect(spaceWarnings(result).filter((warning) => warning.params.secondary === true)).toMatchObject([{ level: "warning", code: "spaceTooSmall" }]);
    expect(result.status).toBe("danger");
    expect(result.score).toBeLessThanOrEqual(49);
    expect(space(result)).toMatchObject({ status: "danger", detailCode: "spaceSevere", detailParams: { count: 1 } });
  });

  it("iki tür de yalnız ikinci kademe değerle yarısından küçük: ikisi de sarı, hüküm en çok 'dikkat', ölçüt 60", () => {
    // volumeSecondary 100 L, bothSecondary 200 L ister; 40 L ikisinin de yarısından küçük, uzunluk 120 cm ikisine de yetiyor.
    const result = runMany(tank(40, 120), ["volumeSecondary", "bothSecondary"]);
    expect(spaceWarnings(result)).toHaveLength(2);
    expect(spaceWarnings(result).every((warning) => warning.level === "warning" && warning.code === "spaceTooSmall" && warning.params.secondary === true)).toBe(true);
    expect(result.status).toBe("warning");
    expect(result.score).toBeGreaterThanOrEqual(50);
    expect(result.score).toBeLessThanOrEqual(74);
    expect(space(result)).toMatchObject({ score: 60, status: "warning", detailCode: "spaceLimited", detailParams: { count: 2 } });
  });
});

describe("spaceTooSmall uzunluk cümlesi (kontrol turu)", () => {
  it("kabul edilen kaynağın hacmi yarısından küçük, uzunluk ikinci kademede: kesin tehlike, uzunluk cümlesi hobi kaynaklarını söyler", () => {
    const [warning] = spaceWarnings(run(tank(80, 90), "lengthOnlySecondary"));
    expect(warning).toMatchObject({ level: "danger", code: "spaceTooSmall", params: { lengthShort: true, lengthSecondary: true } });
    expect(warning.params.secondary).toBeUndefined();
    expect(warning.message).toBe("Kaynağa göre İki ölçülü tür için kayıtlı 1 bireyle en az 200 L gerekir; akvaryumun net hacmi 80 L, gerekenin yarısından da az. Birkaç hobi kaynağı en az 100 cm uzunluk da istiyor; akvaryumun uzunluğu 90 cm. Bu tür bu akvaryumda tutulmamalı.");
  });

  it("uzunluk kabul edilen kaynaktan: bugünkü 'Kaynak … uzunluk da istiyor' cümlesi, değişken yok", () => {
    const [warning] = spaceWarnings(run(tank(80, 50), "volumeOnlySecondary"));
    expect(warning.params.lengthSecondary).toBeUndefined();
    expect(warning.message).toContain(" Kaynak en az 100 cm uzunluk da istiyor; akvaryumun uzunluğu 50 cm.");
  });
});
