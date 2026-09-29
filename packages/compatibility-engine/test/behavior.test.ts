import { describe, expect, it } from "vitest";
import type { Aquarium, Livestock } from "@aquamind/domain";
import { createAnalyzer, type KnowledgeResolver, type SpeciesProfileInput } from "../src";

// Kural seti 1.4.0: davranış uyarıları (docs/DECISIONS/0010-davranis-uyarilari.md). Stub kayıtlarla sınanır.

const base = { minVolumeL: 10, minGroup: 1, temperature: [22, 28] as [number, number], ph: [6, 8] as [number, number], flow: "medium" as const, wasteFactor: 0.3 };
const species: Record<string, SpeciesProfileInput & { category: Livestock["category"] }> = {
  nipper: { id: "nipper", commonName: "Isıran", adultSizeCm: 6, category: "fish", ...base, behavior: { finNipper: { source: "Seriously Fish", condition: "8 bireyden küçük grupta belirgin" } } },
  disputedNipper: { id: "disputedNipper", commonName: "Tartışmalı ısıran", adultSizeCm: 4, category: "fish", ...base, behavior: { finNipper: { source: "Practical Fishkeeping", conflict: true } } },
  longFin: { id: "longFin", commonName: "Uzun yüzgeçli", adultSizeCm: 6, category: "fish", ...base, behavior: { finNipTarget: { source: "OATA" } } },
  hunter: { id: "hunter", commonName: "Fırsatçı", adultSizeCm: 15, category: "fish", ...base, behavior: { eatsSmallFish: { source: "Seriously Fish" } } },
  limitedHunter: { id: "limitedHunter", commonName: "Sınırlı avcı", adultSizeCm: 20, category: "fish", ...base, behavior: { eatsSmallFish: { source: "Seriously Fish", maxPreyCm: 2 } } },
  prey2: { id: "prey2", commonName: "İki santim", adultSizeCm: 2, category: "fish", ...base },
  prey25: { id: "prey25", commonName: "İki buçuk santim", adultSizeCm: 2.5, category: "fish", ...base },
  realPredator: { id: "realPredator", commonName: "Asıl avcı", adultSizeCm: 15, category: "fish", ...base, predatory: true, behavior: { eatsSmallFish: { source: "Seriously Fish" } } },
  prey6: { id: "prey6", commonName: "Altı santim", adultSizeCm: 6, category: "fish", ...base },
  prey61: { id: "prey61", commonName: "Altı virgül bir", adultSizeCm: 6.1, category: "fish", ...base },
  shrimpEater: { id: "shrimpEater", commonName: "Karides yiyen", adultSizeCm: 8, category: "fish", ...base, behavior: { eatsShrimp: { source: "Fishkeeper" } } },
  disputedEater: { id: "disputedEater", commonName: "Tartışmalı yiyen", adultSizeCm: 6, category: "fish", ...base, behavior: { eatsShrimp: { source: "Practical Fishkeeping", conflict: true } } },
  shrimpSafe: { id: "shrimpSafe", commonName: "Karidesle güvenli", adultSizeCm: 4, category: "fish", ...base, behavior: { shrimpSafe: { source: "Seriously Fish" } } },
  unknownFish: { id: "unknownFish", commonName: "Bilgisiz", adultSizeCm: 5, category: "fish", ...base },
  dwarfShrimp: { id: "dwarfShrimp", commonName: "Cüce karides", adultSizeCm: 3, category: "shrimp", ...base },
  bigShrimp: { id: "bigShrimp", commonName: "Büyük karides", adultSizeCm: 5, category: "shrimp", ...base },
  fighter: { id: "fighter", commonName: "Kavgacı", adultSizeCm: 6, category: "fish", ...base, behavior: { conspecificAggression: { source: "Fishkeeper", value: "males", condition: "Dişiler grupta tutulabilir" } } },
  loner: { id: "loner", commonName: "Yalnız", adultSizeCm: 20, category: "fish", ...base, minVolumeL: 10, behavior: { conspecificAggression: { source: "Seriously Fish", value: "all" } } },
  disputedFighter: { id: "disputedFighter", commonName: "Tartışmalı kavgacı", adultSizeCm: 5, category: "fish", ...base, behavior: { conspecificAggression: { source: "Seriously Fish", value: "males", conflict: true } } },
  cold: { id: "cold", commonName: "Soğuk su", adultSizeCm: 5, category: "fish", ...base, temperature: [10, 18] },
  // Alan, grup, filtre, ısıtıcı ve su ölçütleri zayıf: davranış cezası olmadan genel puan 53.
  strained: { id: "strained", commonName: "Zorlanan", adultSizeCm: 6, category: "fish", ...base, minVolumeL: 1000, minGroup: 20, temperature: [24, 28], behavior: { conspecificAggression: { source: "Fishkeeper", value: "males" } } },
};

const resolver: KnowledgeResolver = {
  speciesForLivestock: (item) => (item.catalogId ? species[item.catalogId] : undefined),
  profileForEquipment: () => undefined,
  isVerifiedSpeciesProfile: (profile) => profile !== undefined,
  isVerifiedEquipmentProfile: () => false,
};
const analyze = createAnalyzer(resolver);
const tank: Aquarium = { id: "a", name: "Stub", type: "freshwater", lengthCm: 150, widthCm: 50, heightCm: 50, netVolumeLiters: 400, setupDate: "2026-01-01" };
let counter = 0;
const animal = (catalogId: string, quantity = 1): Livestock => ({ id: `l-${catalogId}-${counter++}`, aquariumId: "a", catalogId, commonName: species[catalogId].commonName, category: species[catalogId].category, quantity, addedAt: "2026-01-01" });
const run = (...animals: Livestock[]) => analyze(tank, animals, []);
const titles = (result: ReturnType<typeof run>) => result.warnings.map((warning) => warning.title);
const find = (result: ReturnType<typeof run>, title: string) => result.warnings.find((warning) => warning.title === title);
const compatibility = (result: ReturnType<typeof run>) => result.metrics.find((metric) => metric.key === "compatibility")!;

describe("yüzgeç ısırma", () => {
  it("ısıran tür uzun yüzgeçli türle birlikteyse uyarı verir; kaynağın notunu ve adını söyler", () => {
    const warning = find(run(animal("nipper", 8), animal("longFin", 2)), "Uzun yüzgeçli: yüzgeç ısırma riski");
    expect(warning?.level).toBe("warning");
    expect(warning?.message).toBe("Isıran yüzgeç ısırabilir; Uzun yüzgeçli gibi uzun ya da yavaş yüzgeçli balıklarla birlikte tutulması önerilmez. Kaynağın notu: 8 bireyden küçük grupta belirgin. Kaynak: Seriously Fish.");
  });

  it("hedef yoksa ya da kaynaklar çelişiyorsa uyarı vermez", () => {
    expect(titles(run(animal("nipper", 8), animal("unknownFish", 6)))).not.toContain("Bilgisiz: yüzgeç ısırma riski");
    expect(titles(run(animal("disputedNipper", 8), animal("longFin", 2)))).not.toContain("Uzun yüzgeçli: yüzgeç ısırma riski");
  });
});

describe("fırsatçı avcı", () => {
  it("yetişkin boyu avcının %40'ı veya altındaki balık için uyarı verir", () => {
    const result = run(animal("hunter", 2), animal("prey6", 10), animal("prey61", 10));
    expect(find(result, "Altı santim: avlanabilir")?.level).toBe("warning");
    expect(titles(result)).not.toContain("Altı virgül bir: avlanabilir");
    expect(result.status).not.toBe("danger");
  });

  it("kaynak bir av boyu verdiyse %40 kuralı yerine o sınır geçerlidir", () => {
    const result = run(animal("limitedHunter", 1), animal("prey2", 10), animal("prey25", 10));
    expect(find(result, "İki santim: avlanabilir")?.level).toBe("warning");
    expect(titles(result)).not.toContain("İki buçuk santim: avlanabilir");
  });

  it("asıl avcıda yalnızca mevcut kesin tehlike uyarısı çıkar", () => {
    const result = run(animal("realPredator", 1), animal("prey6", 10));
    expect(titles(result)).toContain("Altı santim için avlanma riski");
    expect(titles(result)).not.toContain("Altı santim: avlanabilir");
    expect(result.status).toBe("danger");
  });
});

describe("cüce karides", () => {
  it("kaynağı 'yer' diyen balık için uyarı verir", () => {
    const warning = find(run(animal("shrimpEater", 1), animal("dwarfShrimp", 10)), "Karidesler yenebilir");
    expect(warning?.message).toBe("Kaynaklara göre Karides yiyen karides yer; Cüce karides ve özellikle yavruları risk altındadır. Kaynak: Fishkeeper.");
  });

  it("güvenli bilgisi olmayan ya da kaynakları çelişen balık için yavru uyarısı verir", () => {
    const warning = find(run(animal("unknownFish", 6), animal("disputedEater", 1), animal("dwarfShrimp", 10)), "Karides uyumu doğrulanmadı");
    expect(warning?.message).toContain("Bilgisiz ve Tartışmalı yiyen için \"karidesle güvenli\" bilgisi kaynaklarda bulunamadı.");
    expect(warning?.message).toContain("OATA");
  });

  it("kaynağı güvenli diyen balıkta, cüce olmayan karideste ve karides yokken uyarı vermez", () => {
    const shrimpTitles = /^Karides/;
    expect(titles(run(animal("shrimpSafe", 8), animal("dwarfShrimp", 10))).some((title) => shrimpTitles.test(title))).toBe(false);
    expect(titles(run(animal("unknownFish", 6), animal("bigShrimp", 5))).some((title) => shrimpTitles.test(title))).toBe(false);
    expect(titles(run(animal("shrimpEater", 1), animal("unknownFish", 6))).some((title) => shrimpTitles.test(title))).toBe(false);
  });
});

describe("aynı tür kavgası", () => {
  it("birden fazla birey varsa uyarı verir; ayrı kayıtların adetleri toplanır", () => {
    expect(titles(run(animal("fighter", 1)))).not.toContain("Kavgacı: erkekler kavga eder");
    const warning = find(run(animal("fighter", 1), animal("fighter", 1)), "Kavgacı: erkekler kavga eder");
    expect(warning?.message).toBe("Kaynağa göre bu türün erkekleri birbiriyle kavga eder; kayıtlı 2 bireyden birden fazlası erkekse ayırın. Kaynağın notu: Dişiler grupta tutulabilir. Kaynak: Fishkeeper.");
    expect(titles(run(animal("loner", 2)))).toContain("Yalnız: tek tutulmalı");
  });

  it("kaynaklar çelişiyorsa uyarı vermez", () => {
    expect(titles(run(animal("disputedFighter", 4))).some((title) => title.startsWith("Tartışmalı kavgacı"))).toBe(false);
  });
});

describe("tür uyumu ölçütü", () => {
  it("uyarı seviyesindeki sorunlar birikse de ölçüt en fazla 'dikkat' olur", () => {
    const result = run(animal("hunter", 2), animal("prey6", 10), animal("nipper", 8), animal("longFin", 2), animal("fighter", 3), animal("dwarfShrimp", 10));
    expect(compatibility(result)).toMatchObject({ score: 50, status: "warning" });
    expect(result.warnings.filter((warning) => warning.level === "danger")).toEqual([]);
  });

  it("davranış uyarısı, onsuz tehlikede olmayan akvaryumu tek başına tehlikeye çekmez", () => {
    const coldWater = { id: "w", aquariumId: "a", measuredAt: "2026-09-29", temperature: 10 };
    const single = analyze(tank, [animal("strained", 1)], [], coldWater);
    expect(single).toMatchObject({ score: 53, status: "warning" });
    const pair = analyze(tank, [animal("strained", 2)], [], coldWater);
    expect(titles(pair)).toContain("Zorlanan: erkekler kavga eder");
    expect(Math.round(pair.metrics.reduce((sum, item) => sum + item.score, 0) / pair.metrics.length)).toBe(49);
    expect(pair).toMatchObject({ score: 50, status: "warning" });
  });

  it("kesin tehlike varsa ölçüt yine tehlikeye düşebilir", () => {
    const result = run(animal("hunter", 2), animal("prey6", 10), animal("cold", 6));
    expect(compatibility(result).status).toBe("danger");
  });
});
