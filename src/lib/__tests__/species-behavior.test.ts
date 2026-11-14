import { describe, expect, it } from "vitest";
import { speciesById } from "@/data/catalog";
import { speciesBehavior } from "@/data/species-behavior";
import { analyzeAquarium, withBehavior } from "@/lib/health-analysis";
import type { Aquarium, Livestock } from "@/types/aquarium";

// Kaynaklı davranış verisinin bütünlüğü ve motora bağlanması (docs/DECISIONS/0010-davranis-uyarilari.md).

const flags = ["finNipper", "finNipTarget", "eatsShrimp", "shrimpSafe", "eatsSnails", "eatsSmallFish", "notPiscivorous", "conspecificAggression", "peaceful"];
const hosts: Record<string, string> = {
  "seriouslyfish.com": "Seriously Fish",
  "fishkeeper.co.uk": "Fishkeeper",
  "practicalfishkeeping.co.uk": "Practical Fishkeeping",
  "ornamentalfish.org": "OATA",
  // Veri sprinti E2 (2026-11-14): docs/DATA_SOURCES.md'de kabul edilen öbür kaynaklar.
  "fishi-pedia.com": "Fishipedia",
  "fishipedia.fr": "Fishipedia",
  "fishipedia.it": "Fishipedia",
  "fishipedia.es": "Fishipedia",
  "wirbellose.de": "wirbellose.de",
  "scotcat.com": "ScotCat",
};
const entries = Object.entries(speciesBehavior).flatMap(([id, records]) => records.map((record) => ({ id, record })));

describe("davranış verisi", () => {
  it("her tür katalogda var ve her kayıt kaynaklı", () => {
    expect(entries.length).toBeGreaterThan(0);
    for (const { id, record } of entries) {
      expect(speciesById(id), id).toBeDefined();
      expect(flags, `${id}: ${record.flag}`).toContain(record.flag);
      expect(["explicit", "conflict"]).toContain(record.confidence);
      const url = new URL(record.sourceUrl);
      expect(url.protocol, `${id}: ${record.sourceUrl}`).toBe("https:");
      expect(hosts[url.hostname.replace(/^www\./, "")], `${id}: ${record.sourceUrl}`).toBe(record.source);
      for (const extra of record.additionalSourceUrls ?? []) expect(new URL(extra).protocol).toBe("https:");
      expect(record.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(record.evidence.trim().length).toBeGreaterThan(0);
    }
  });

  it("aynı tür saldırganlığında tür değeri var, diğerlerinde yok", () => {
    for (const { id, record } of entries) {
      if (record.flag === "conspecificAggression") expect(["males", "all"], id).toContain(record.value);
      else expect(record.value, `${id}: ${record.flag}`).toBeUndefined();
    }
  });

  it("kullanıcıya gösterilebilen koşul metinlerinde kaynak kısaltması yok", () => {
    for (const { id, record } of entries) expect(record.condition ?? "", `${id}: ${record.flag}`).not.toMatch(/(^|[^A-Za-z])(PFK|FK|SF)([^A-Za-z]|$)/);
  });

  it("av boyu sınırı yalnızca balık yemez kayıtlarında ve pozitif", () => {
    for (const { id, record } of entries) {
      if (record.maxPreyCm === undefined) continue;
      expect(record.flag, id).toBe("notPiscivorous");
      expect(record.maxPreyCm, id).toBeGreaterThan(0);
    }
  });

  it("av boyu sınırı yalnızca kaynağın ölçü verdiği kayıtta var", () => {
    // Seriously Fish: threadfin acara "a couple of centimetres"; winemilleri yalnızca "a few millimetres" (sayı yok, yavru boyu).
    expect(entries.filter(({ record }) => record.maxPreyCm !== undefined).map(({ id, record }) => [id, record.maxPreyCm])).toEqual([["threadfin-acara", 2]]);
  });

  it("bir tür için aynı davranış iki kez tanımlanmaz", () => {
    for (const [id, records] of Object.entries(speciesBehavior)) expect(new Set(records.map((record) => record.flag)).size, id).toBe(records.length);
  });
});

describe("withBehavior", () => {
  it("açık kaynaklı kaydı not olarak, çelişkili kaydı işaretli not olarak verir", () => {
    const betta = withBehavior(speciesById("betta"))!;
    expect(betta.behavior?.finNipTarget).toMatchObject({ source: "OATA" });
    expect(betta.behavior?.finNipTarget?.conflict).toBeUndefined();
    expect(betta.behavior?.conspecificAggression).toMatchObject({ value: "males", source: "Fishkeeper" });
    expect(betta.behavior?.eatsShrimp?.conflict).toBe(true);
  });

  it("asıl avcı olmayan türün avcı işaretini kaldırır, kaynağın av boyu sınırıyla fırsatçı avcı yapar; çelişkide dokunmaz", () => {
    for (const id of ["winemillers-eartheater", "threadfin-acara"]) {
      expect(speciesById(id)?.predatory, id).toBe(true);
      expect(withBehavior(speciesById(id))?.predatory, id).toBe(false);
    }
    expect(withBehavior(speciesById("threadfin-acara"))?.behavior?.eatsSmallFish).toMatchObject({ source: "Seriously Fish", maxPreyCm: 2 });
    expect(withBehavior(speciesById("winemillers-eartheater"))?.behavior?.eatsSmallFish).toBeUndefined();
    expect(withBehavior(speciesById("uaru-cichlid"))?.predatory).toBe(speciesById("uaru-cichlid")?.predatory);
  });

  it("davranış kaydı olmayan türü değiştirmez", () => {
    // Panda çöpçü 2026-11-14'te `peaceful` kaydı aldı; boru salyangozu için okunan kaynaklar davranış yazmıyor, kayıt yok.
    const profile = speciesById("ramshorn-snail");
    expect(speciesBehavior["ramshorn-snail"]).toBeUndefined();
    expect(withBehavior(profile)).toBe(profile);
    expect(withBehavior(undefined)).toBeUndefined();
  });
});

describe("kaynağın av boyu sınırı (gerçek katalog)", () => {
  const tank: Aquarium = { id: "t", name: "T", type: "freshwater", lengthCm: 150, widthCm: 50, heightCm: 50, netVolumeLiters: 375, setupDate: "2026-01-01" };
  const fish = (id: string, quantity: number): Livestock => {
    const profile = speciesById(id)!;
    return { id: `${id}-${quantity}`, aquariumId: "t", catalogId: id, commonName: profile.commonName, scientificName: profile.scientificName, category: profile.category, quantity, addedAt: "2026-01-01" };
  };
  const predation = (result: ReturnType<typeof analyzeAquarium>) => result.warnings.filter((warning) => / avlanabilir$|için avlanma riski$/.test(warning.title));

  it("threadfin acara 2 cm'lik balık için uyarı verir (1.15.0'dan beri tehlike seviyesinde), neon tetra için vermez", () => {
    const small = predation(analyzeAquarium(tank, [fish("threadfin-acara", 1), fish("chili-rasbora", 10)], []));
    expect(small.map((warning) => warning.level)).toEqual(["danger"]);
    expect(small[0].message).toContain("Kaynağın notu: Yaklaşık 2 cm ve altındaki balıklar");
    expect(small[0].message).toContain("Kaynak: Seriously Fish.");
    expect(predation(analyzeAquarium(tank, [fish("threadfin-acara", 1), fish("neon-tetra", 10)], []))).toEqual([]);
  });

  it("winemilleri yalnızca birkaç milimetrelik balıkları avladığı için katalogdaki balıklara uyarı vermez", () => {
    expect(predation(analyzeAquarium(tank, [fish("winemillers-eartheater", 1), fish("chili-rasbora", 10)], []))).toEqual([]);
  });
});

// 2026-11-12, karar 0040 (docs/CATALOG_LOG.md): kaynakları yalnız çok küçük balıkları anan iki tür asıl avcı değil, fırsatçı avcıdır.
describe("ayışığı guramisi ve Afrika cüce kurbağası: fırsatçı avcı (gerçek katalog)", () => {
  const tank: Aquarium = { id: "t", name: "T", type: "freshwater", lengthCm: 120, widthCm: 45, heightCm: 50, netVolumeLiters: 250, setupDate: "2026-01-01" };
  const animal = (id: string, quantity: number): Livestock => {
    const profile = speciesById(id)!;
    return { id: `${id}-${quantity}`, aquariumId: "t", catalogId: id, commonName: profile.commonName, scientificName: profile.scientificName, category: profile.category, quantity, addedAt: "2026-01-01" };
  };
  const water = { id: "w", aquariumId: "t", measuredAt: "2026-11-12", temperature: 24, ph: 7.2, ammonia: 0, nitrite: 0, nitrate: 10 };
  const predation = (result: ReturnType<typeof analyzeAquarium>) => result.warnings.filter((warning) => / avlanabilir$|için avlanma riski$/.test(warning.title));

  it("ayışığı guramisi avcı işareti taşımaz; Fishkeeper kaydıyla fırsatçı avcıdır", () => {
    expect(speciesById("moonlight-gourami")?.predatory).toBeUndefined();
    expect(withBehavior(speciesById("moonlight-gourami"))?.behavior?.eatsSmallFish).toMatchObject({ source: "Fishkeeper", condition: "Çok küçük balıklar." });
  });

  it("ayışığı guramisi ile neon tetra: kırmızı 'avlanabilir' uyarısı, kesin tehlike değil (veri testi C38)", () => {
    const result = analyzeAquarium(tank, [animal("moonlight-gourami", 3), animal("neon-tetra", 10)], [], water);
    expect(result.warnings.find((warning) => warning.title === "Neon tetra: avlanabilir")).toMatchObject({ level: "danger", code: "smallFishPredation" });
    expect(result.warnings.some((warning) => warning.code === "predation")).toBe(false);
    expect(result.status).not.toBe("danger");
  });

  it("Afrika cüce kurbağası 2 cm'lik balık için kırmızı uyarı verir; 3 cm'lik balık, karides ve salyangoz için vermez", () => {
    expect(withBehavior(speciesById("african-dwarf-frog"))?.behavior?.eatsSmallFish).toMatchObject({ source: "Fishkeeper", condition: "Çok küçük balıklar ve yavrular." });
    const chili = analyzeAquarium(tank, [animal("african-dwarf-frog", 3), animal("chili-rasbora", 10)], [], water);
    expect(predation(chili).map((warning) => [warning.level, warning.title])).toEqual([["danger", `${speciesById("chili-rasbora")!.commonName}: avlanabilir`]]);
    expect(predation(chili)[0].message).toContain("Kaynak: Fishkeeper.");
    expect(chili.status).not.toBe("danger");
    expect(predation(analyzeAquarium(tank, [animal("african-dwarf-frog", 3), animal("neon-tetra", 10)], [], water))).toEqual([]);
    expect(predation(analyzeAquarium(tank, [animal("african-dwarf-frog", 3), animal("cherry-shrimp", 10), animal("ramshorn-snail", 3)], [], water))).toEqual([]);
  });
});

describe("'tek tutulmalı' ve kaynağın önerdiği çift (gerçek katalog, karar 0040)", () => {
  const tank: Aquarium = { id: "t", name: "T", type: "freshwater", lengthCm: 120, widthCm: 50, heightCm: 50, netVolumeLiters: 300, setupDate: "2026-01-01" };
  const fish = (id: string, quantity: number): Livestock => {
    const profile = speciesById(id)!;
    return { id: `${id}-${quantity}`, aquariumId: "t", catalogId: id, commonName: profile.commonName, scientificName: profile.scientificName, category: profile.category, quantity, addedAt: "2026-01-01" };
  };
  const single = (result: ReturnType<typeof analyzeAquarium>) => result.warnings.filter((warning) => warning.code === "conspecificAll");

  it("leleupi çifti uyarı almaz (veri testi C04), üç birey alır", () => {
    expect(speciesById("leleupi-cichlid")?.minGroup).toBe(2);
    expect(single(analyzeAquarium(tank, [fish("leleupi-cichlid", 2)], []))).toEqual([]);
    expect(single(analyzeAquarium(tank, [fish("leleupi-cichlid", 3)], [])).map((warning) => warning.title)).toEqual([`${speciesById("leleupi-cichlid")!.commonName}: tek tutulmalı`]);
  });
});

describe("salyangoz uyarısı (gerçek katalog, kural seti 1.7.0)", () => {
  const tank: Aquarium = { id: "t", name: "T", type: "freshwater", lengthCm: 200, widthCm: 60, heightCm: 60, netVolumeLiters: 700, setupDate: "2026-01-01" };
  const animal = (id: string, quantity: number): Livestock => {
    const profile = speciesById(id)!;
    return { id: `${id}-${quantity}`, aquariumId: "t", catalogId: id, commonName: profile.commonName, scientificName: profile.scientificName, category: profile.category, quantity, addedAt: "2026-01-01" };
  };
  const snailWarning = (result: ReturnType<typeof analyzeAquarium>) => result.warnings.find((warning) => warning.title === "Salyangozlar yenebilir");

  it("palyaço çöpçü ile nerit salyangozu: kaynağın notuyla sarı uyarı", () => {
    const warning = snailWarning(analyzeAquarium(tank, [animal("clown-loach", 5), animal("nerite-snail", 3)], []));
    expect(warning?.level).toBe("warning");
    expect(warning?.message).toContain(`${speciesById("clown-loach")!.commonName}: Salyangoz yer ama istilayı tek başına çözmez.`);
    expect(warning?.message).toContain("Kaynak: Seriously Fish.");
  });

  it("salyangoz yediği bilinmeyen balıkla uyarı yok", () => {
    expect(snailWarning(analyzeAquarium(tank, [animal("neon-tetra", 10), animal("nerite-snail", 3)], []))).toBeUndefined();
  });
});

describe("karides uyarısının kapsamı (gerçek katalog, karar 0041)", () => {
  // Kaynağı riski küçük karidesle ya da yavruyla sınırlayan "karides yer" kayıtları (2026-11-12'de kaynak sayfaları yeniden okundu).
  // 2026-11-14 (E2): katil salyangoz ve Tayland mikro yengeci; kaynak riski küçük ya da yavru karidesle sınırlıyor.
  const SMALL_ONLY = ["assassin-snail", "banggai-cardinalfish", "clown-killifish", "croaking-gourami", "guppy", "kuhli-loach", "ocellaris-clownfish", "pea-puffer", "red-lip-goby-exallisquamulus", "sparkling-gourami", "thai-micro-crab", "white-cloud"];
  const tank = (type: Aquarium["type"]): Aquarium => ({ id: "t", name: "T", type, lengthCm: 120, widthCm: 50, heightCm: 50, netVolumeLiters: 300, setupDate: "2026-01-01" });
  const animal = (id: string, quantity: number): Livestock => {
    const profile = speciesById(id)!;
    return { id: `${id}-${quantity}`, aquariumId: "t", catalogId: id, commonName: profile.commonName, scientificName: profile.scientificName, category: profile.category, quantity, addedAt: "2026-01-01" };
  };
  const fresh = { id: "w", aquariumId: "t", measuredAt: "2026-11-12", temperature: 22, ph: 7, ammonia: 0, nitrite: 0, nitrate: 10 };
  const sea = { id: "w", aquariumId: "t", measuredAt: "2026-11-12", temperature: 25, ph: 8.1, specificGravity: 1.025, kh: 9, ammonia: 0, nitrite: 0, nitrate: 8 };
  const shrimpWarning = (result: ReturnType<typeof analyzeAquarium>) => result.warnings.find((warning) => warning.code === "shrimpEaten");

  it("smallShrimpOnly yalnız bu 12 açık kaynaklı 'karides yer' kaydında", () => {
    const marked = entries.filter(({ record }) => record.smallShrimpOnly !== undefined);
    for (const { id, record } of marked) {
      expect(record.flag, id).toBe("eatsShrimp");
      expect(record.confidence, id).toBe("explicit");
      expect(record.smallShrimpOnly, id).toBe(true);
    }
    expect(marked.map(({ id }) => id).sort()).toEqual(SMALL_ONLY);
    expect(withBehavior(speciesById("guppy"))?.behavior?.eatsShrimp).toMatchObject({ source: "Practical Fishkeeping", smallShrimpOnly: true });
    expect(withBehavior(speciesById("goldfish"))?.behavior?.eatsShrimp).not.toHaveProperty("smallShrimpOnly");
  });

  it("Japon balığı ve melek Amano karidesinde de uyarır (veri testi D29); lepistes yalnız cüce karideste", () => {
    expect(speciesById("amano-shrimp")!.adultSizeCm).toBeGreaterThan(4);
    const goldfish = shrimpWarning(analyzeAquarium(tank("freshwater"), [animal("goldfish", 2), animal("amano-shrimp", 6)], [], fresh));
    expect(goldfish?.params).toMatchObject({ eaters: [speciesById("goldfish")!.commonName], shrimp: [speciesById("amano-shrimp")!.commonName], sources: ["Practical Fishkeeping"] });
    const angel = { ...fresh, temperature: 25 };
    expect(shrimpWarning(analyzeAquarium(tank("freshwater"), [animal("angelfish", 2), animal("amano-shrimp", 6)], [], angel))).toBeDefined();
    expect(shrimpWarning(analyzeAquarium(tank("freshwater"), [animal("guppy", 6), animal("amano-shrimp", 6)], [], angel))).toBeUndefined();
    expect(shrimpWarning(analyzeAquarium(tank("freshwater"), [animal("guppy", 6), animal("cherry-shrimp", 10)], [], angel))).toBeDefined();
  });

  it("denizde: ocellaris temizlikçi karidesle uyarı almaz, sarı lapin alır", () => {
    expect(shrimpWarning(analyzeAquarium(tank("saltwater"), [animal("ocellaris-clownfish", 2), animal("cleaner-shrimp", 1)], [], sea))).toBeUndefined();
    expect(shrimpWarning(analyzeAquarium(tank("saltwater"), [animal("yellow-wrasse", 1), animal("cleaner-shrimp", 1)], [], sea))).toBeDefined();
  });
});

// Veri sprinti E2 (2026-11-14, docs/CATALOG_LOG.md): iki bağımsız okuma, kaynak sayfası yeniden açılarak doğrulanan risk kayıtları ve `peaceful`.
describe("E2 davranış kayıtları (gerçek katalog)", () => {
  const tank: Aquarium = { id: "t", name: "T", type: "freshwater", lengthCm: 100, widthCm: 40, heightCm: 50, netVolumeLiters: 200, setupDate: "2026-01-01" };
  const animal = (id: string, quantity: number): Livestock => {
    const profile = speciesById(id)!;
    return { id: `${id}-${quantity}`, aquariumId: "t", catalogId: id, commonName: profile.commonName, scientificName: profile.scientificName, category: profile.category, quantity, addedAt: "2026-01-01" };
  };
  const water = { id: "w", aquariumId: "t", measuredAt: "2026-11-14", temperature: 24, ph: 7.4, ammonia: 0, nitrite: 0, nitrate: 10 };
  const codes = (result: ReturnType<typeof analyzeAquarium>) => result.warnings.map((warning) => warning.code);

  it("peaceful kaydının koşul metni yok ve aynı türde risk kaydıyla birlikte bulunmaz", () => {
    const risk = new Set(["finNipper", "eatsShrimp", "eatsSnails", "eatsSmallFish", "conspecificAggression"]);
    for (const [id, records] of Object.entries(speciesBehavior)) {
      const peaceful = records.find((record) => record.flag === "peaceful");
      if (!peaceful) continue;
      expect(peaceful.condition, id).toBeUndefined();
      expect(records.filter((record) => risk.has(record.flag)).map((record) => record.flag), id).toEqual([]);
      expect(speciesById(id)?.predatory, id).not.toBe(true);
    }
  });

  it("katil salyangoz: boru salyangozu ve neritle 'salyangozlar yenebilir', yalnız küçük karideste karides uyarısı (senaryo F08)", () => {
    const snails = analyzeAquarium(tank, [animal("assassin-snail", 3), animal("ramshorn-snail", 5), animal("nerite-snail", 2)], [], water);
    expect(codes(snails)).toContain("snailEaten");
    expect(withBehavior(speciesById("assassin-snail"))?.behavior?.eatsShrimp).toMatchObject({ source: "Fishkeeper", smallShrimpOnly: true });
    expect(codes(analyzeAquarium(tank, [animal("assassin-snail", 3), animal("cherry-shrimp", 10)], [], water))).toContain("shrimpEaten");
  });

  it("mavi kerevit neonla kırmızı 'avlanabilir' (senaryo F05); kesin tehlike değil", () => {
    const result = analyzeAquarium(tank, [animal("electric-blue-crayfish", 1), animal("neon-tetra", 10)], [], water);
    expect(result.warnings.find((warning) => warning.code === "smallFishPredation")).toMatchObject({ level: "danger" });
    expect(withBehavior(speciesById("electric-blue-crayfish"))?.behavior?.eatsSmallFish).toMatchObject({ source: "Fishipedia" });
  });

  it("sarı prenses grubu: 'erkekler kavga eder' (senaryo F01); cüce puffer erkekleri ölümüne dövüşebilir", () => {
    expect(codes(analyzeAquarium(tank, [animal("yellow-lab", 6)], [], { ...water, ph: 7.8 }))).toContain("conspecificMales");
    expect(withBehavior(speciesById("pea-puffer"))?.behavior?.conspecificAggression).toMatchObject({ value: "males", source: "Seriously Fish" });
  });

  it("barışçıl kayıt uyarı üretmez; amano karides davranışı biliniyor sayılır (senaryo F28)", () => {
    expect(withBehavior(speciesById("amano-shrimp"))?.behavior?.peaceful).toMatchObject({ source: "wirbellose.de" });
    const result = analyzeAquarium(tank, [animal("cardinal-tetra", 12), animal("amano-shrimp", 5)], [], water);
    expect((result.unevaluated ?? []).filter((item) => item.code === "behaviorUnknown").map((item) => item.params?.name)).not.toContain(speciesById("amano-shrimp")!.commonName);
  });

  it("Meksika cüce kereviti: kaynaklar çelişiyor, uyarı üretmez", () => {
    expect(speciesBehavior["mexican-dwarf-crayfish"]?.find((record) => record.flag === "conspecificAggression")).toMatchObject({ confidence: "conflict" });
    expect(codes(analyzeAquarium(tank, [animal("mexican-dwarf-crayfish", 4)], [], water))).not.toContain("conspecificAll");
  });
});
