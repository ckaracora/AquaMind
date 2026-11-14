import { describe, expect, it } from "vitest";
import type { Aquarium, Equipment, Livestock, WaterParameters } from "@aquamind/domain";
import {
  ENGINE_VERSION, LIVESTOCK_RISK_WARNING_CODES, RULESET_VERSION, createAnalyzer,
  type EquipmentProfileInput, type HealthAnalysis, type KnowledgeResolver, type SpeciesProfileInput,
} from "../src";

// Motor 1.19.0, kural seti 1.16.0 (docs/DECISIONS/0044-palyaco-cift-ve-celiski-metinleri.md; ürün sahibinin kararı 2026-11-14):
// A) kaynağın aynı gruba koyduğu farklı türler (palyaçolar) bir aradaysa kesin tehlike; aynı türün kendi bireyleri değil.
// E) kaynağın "tek ya da uyumlu çift" dediği "tek tutulmalı" türde tam iki birey sarı; üç ve üstü kırmızı; işaretsiz türde iki birey kırmızı.
// C) çelişkili kaynak "bulunamadı" diye anlatılmaz (karides uyumu, davranışı bilinmeyen tür); puan ve seviye değişmez.
// D) iki kırmızı alan uyarısının başlığı ayrı; fırsatçı avcının küçük balık uyarısı riski anlatır. Hüküm sınırları değişmez. Stub kayıtlarla.

type StubSpecies = SpeciesProfileInput & { category: Livestock["category"] };
const marine = { minGroup: 1, waterTypes: ["saltwater" as const], temperature: [24, 27] as [number, number], flow: "medium" as const, wasteFactor: 1 };
const fresh = { minGroup: 1, temperature: [22, 27] as [number, number], ph: [6, 7.5] as [number, number], flow: "medium" as const, wasteFactor: 0.5 };
const clownGroup = { incompatibleGroup: { source: "Fishkeeper", group: "clownfish" } };
const species: Record<string, StubSpecies> = {
  percula: { id: "percula", commonName: "Percula", category: "fish", adultSizeCm: 11, minVolumeL: 100, ...marine, minGroup: 2, behavior: clownGroup },
  maroon: { id: "maroon", commonName: "Maroon", category: "fish", adultSizeCm: 17, minVolumeL: 200, ...marine, behavior: clownGroup },
  ocellaris: { id: "ocellaris", commonName: "Ocellaris", category: "fish", adultSizeCm: 11, minVolumeL: 100, ...marine, minGroup: 2, behavior: clownGroup },
  tang: { id: "tang", commonName: "Cerrah", category: "fish", adultSizeCm: 15, minVolumeL: 200, ...marine, behavior: { peaceful: { source: "OATA" } } },
  disputedClown: { id: "disputedClown", commonName: "Tartışmalı palyaço", category: "fish", adultSizeCm: 11, minVolumeL: 100, ...marine, behavior: { incompatibleGroup: { source: "Fishkeeper", group: "clownfish", conflict: true } } },
  pairCichlid: { id: "pairCichlid", commonName: "Çift ciklet", category: "fish", adultSizeCm: 15, minVolumeL: 100, ...fresh, behavior: { conspecificAggression: { source: "Fishkeeper", value: "all", condition: "Tek ya da uyumlu bir çift.", pairAccepted: true } } },
  loner: { id: "loner", commonName: "Yalnız ciklet", category: "fish", adultSizeCm: 15, minVolumeL: 100, ...fresh, behavior: { conspecificAggression: { source: "Seriously Fish", value: "all" } } },
  betta: { id: "betta", commonName: "Beta", category: "fish", adultSizeCm: 6, minVolumeL: 20, ...fresh, behavior: { eatsShrimp: { source: "Practical Fishkeeping", condition: "Küçük/yavru karidesleri yer; yetişkinlere tavrı bireyden bireye değişir.", conflict: true } } },
  silentFish: { id: "silentFish", commonName: "Bilgisiz balık", category: "fish", adultSizeCm: 4, minVolumeL: 20, ...fresh },
  shrimp: { id: "shrimp", commonName: "Cüce karides", category: "shrimp", adultSizeCm: 3, minVolumeL: 10, ...fresh, behavior: { peaceful: { source: "OATA" } } },
  disputed: { id: "disputed", commonName: "Tartışmalı tür", category: "fish", adultSizeCm: 4, minVolumeL: 20, ...fresh, behavior: { finNipper: { source: "Seriously Fish", conflict: true } } },
  calm: { id: "calm", commonName: "Sakin tür", category: "fish", adultSizeCm: 4, minVolumeL: 20, ...fresh, behavior: { peaceful: { source: "OATA" } } },
  hunter: { id: "hunter", commonName: "Fırsatçı", category: "fish", adultSizeCm: 15, minVolumeL: 100, ...fresh, behavior: { eatsSmallFish: { source: "Seriously Fish" } } },
  big: { id: "big", commonName: "Büyük isteyen", category: "fish", adultSizeCm: 20, minVolumeL: 200, minTankLengthCm: 100, ...fresh, behavior: { peaceful: { source: "OATA" } } },
};
const devices: Record<string, EquipmentProfileInput> = {
  filter: { id: "filter", category: "filter", brand: "Stub", model: "F600", ratedFlowLph: 2400, recommendedMaxL: 600 },
  heater: { id: "heater", category: "heater", brand: "Stub", model: "H300", powerW: 300, recommendedMinL: 150, recommendedMaxL: 600 },
};
const resolver: KnowledgeResolver = {
  speciesForLivestock: (item) => (item.catalogId ? species[item.catalogId] : undefined),
  profileForEquipment: (item) => (item.catalogId ? devices[item.catalogId] : undefined),
  isVerifiedSpeciesProfile: (profile) => profile !== undefined,
  isVerifiedEquipmentProfile: (profile) => profile !== undefined,
};
const analyze = createAnalyzer(resolver);
const tank = (type: Aquarium["type"] = "freshwater", netVolumeLiters = 400, lengthCm = 150, heightCm = 60): Aquarium => ({ id: "a", name: "Stub", type, lengthCm, widthCm: 60, heightCm, netVolumeLiters, setupDate: "2026-01-01" });
let counter = 0;
const animal = (catalogId: string, quantity = 1): Livestock => ({ id: `l-${catalogId}-${counter++}`, aquariumId: "a", catalogId, commonName: species[catalogId].commonName, category: species[catalogId].category, quantity, addedAt: "2026-01-01" });
const device = (catalogId: string): Equipment => ({ id: `e-${catalogId}`, aquariumId: "a", catalogId, category: devices[catalogId].category, installedAt: "2026-01-01" });
const equipped = () => [device("filter"), device("heater")];
const freshReading = (): WaterParameters => ({ id: "w", aquariumId: "a", measuredAt: "2026-11-14", temperature: 25, ph: 7, ammonia: 0, nitrite: 0, nitrate: 10 });
const marineReading = (): WaterParameters => ({ id: "w", aquariumId: "a", measuredAt: "2026-11-14", temperature: 25, ph: 8.2, specificGravity: 1.024, ammonia: 0, nitrite: 0, nitrate: 10 });
const codes = (result: HealthAnalysis) => result.warnings.map((warning) => warning.code);
const warningOf = (result: HealthAnalysis, code: string) => result.warnings.find((warning) => warning.code === code);

describe("sürüm (karar 0044)", () => {
  it("motor 1.19.0, kural seti 1.16.0", () => {
    expect([ENGINE_VERSION, RULESET_VERSION]).toEqual(["1.19.0", "1.16.0"]);
  });

  it("yeni kodlar canlı riski sınıfında (en çok 'dikkat' tavanı ya da kesin tehlike)", () => {
    expect(LIVESTOCK_RISK_WARNING_CODES.has("conspecificPair")).toBe(true);
    expect(LIVESTOCK_RISK_WARNING_CODES.has("incompatibleGroup")).toBe(true);
  });
});

describe("A. farklı palyaço türleri", () => {
  it("Percula + Maroon: kırmızı, hüküm 'uygun değil' (≤49), tür uyumu cezası 60", () => {
    const result = analyze(tank("saltwater"), [animal("percula", 2), animal("maroon", 1)], equipped(), marineReading());
    const warning = warningOf(result, "incompatibleGroup");
    expect(warning).toMatchObject({
      level: "danger",
      title: "Farklı palyaço balığı türleri bir arada",
      message: "Kaynaklara göre Percula ve Maroon birbiriyle kavga eder; farklı palyaço balığı türleri aynı akvaryumda tutulmamalıdır. Kaynak: Fishkeeper.",
      params: { group: "clownfish", fish: ["Percula", "Maroon"], sources: ["Fishkeeper"] },
    });
    expect(result.status).toBe("danger");
    expect(result.score).toBeLessThanOrEqual(49);
    expect(result.metrics.find((metric) => metric.key === "compatibility")).toMatchObject({ score: 40, status: "danger", detailCode: "incompatibleGroup" });
  });

  it("Ocellaris + Ocellaris (iki ayrı kayıt, aynı tür): değişmez, grup uyarısı yok", () => {
    const result = analyze(tank("saltwater"), [animal("ocellaris", 1), animal("ocellaris", 1)], equipped(), marineReading());
    expect(codes(result)).not.toContain("incompatibleGroup");
    expect(result.status).toBe("good");
  });

  it("palyaço + başka grup dışı tür grup uyarısı almaz; çelişkili grup kaydı sayılmaz", () => {
    expect(codes(analyze(tank("saltwater"), [animal("ocellaris", 2), animal("tang", 1)], equipped(), marineReading()))).not.toContain("incompatibleGroup");
    expect(codes(analyze(tank("saltwater"), [animal("ocellaris", 2), animal("disputedClown", 1)], equipped(), marineReading()))).not.toContain("incompatibleGroup");
  });

  it("üç farklı palyaço türü tek uyarıda adlarıyla", () => {
    const result = analyze(tank("saltwater", 600), [animal("percula", 2), animal("maroon", 1), animal("ocellaris", 2)], equipped(), marineReading());
    expect(result.warnings.filter((warning) => warning.code === "incompatibleGroup").map((warning) => warning.params.fish)).toEqual([["Percula", "Maroon", "Ocellaris"]]);
  });
});

describe("E. kaynağın kabul ettiği çift", () => {
  it("iki birey: sarı 'yalnız uyumlu bir çift', en çok 'dikkat'; kırmızı 'tek tutulmalı' yok", () => {
    const result = analyze(tank(), [animal("pairCichlid", 2)], equipped(), freshReading());
    expect(warningOf(result, "conspecificPair")).toMatchObject({
      level: "warning",
      title: "Çift ciklet: yalnız uyumlu bir çift birlikte yaşar",
      message: "Kaynağa göre bu tür kendi türüne saldırgandır; tek ya da uyumlu bir çift olarak tutulabilir. Kayıtlı 2 birey ancak uyumlu, eşleşmiş bir çiftse birlikte yaşayabilir; rastgele bir araya getirilen iki birey kavga edebilir. Kaynağın notu: Tek ya da uyumlu bir çift. Kaynak: Fishkeeper.",
    });
    expect(codes(result)).not.toContain("conspecificAll");
    expect(result.status).toBe("warning");
    expect(result.score).toBeLessThanOrEqual(74);
    expect(result.score).toBeGreaterThan(49);
  });

  it("iki ayrı kayıtta birer birey de aynı popülasyon sayılır (çift)", () => {
    expect(codes(analyze(tank(), [animal("pairCichlid", 1), animal("pairCichlid", 1)], equipped(), freshReading()))).toContain("conspecificPair");
  });

  it("üç birey: kırmızı 'tek tutulmalı', hüküm 'uygun değil'", () => {
    const result = analyze(tank(), [animal("pairCichlid", 3)], equipped(), freshReading());
    expect(warningOf(result, "conspecificAll")?.level).toBe("danger");
    expect(codes(result)).not.toContain("conspecificPair");
    expect(result.status).toBe("danger");
  });

  it("çift kabulü olmayan 'tek tutulmalı' türde iki birey: kırmızı, 'uygun değil'", () => {
    const result = analyze(tank(), [animal("loner", 2)], equipped(), freshReading());
    expect(warningOf(result, "conspecificAll")?.level).toBe("danger");
    expect(result.status).toBe("danger");
  });

  it("tek birey uyarı almaz", () => {
    const result = analyze(tank(), [animal("pairCichlid", 1)], equipped(), freshReading());
    expect(codes(result)).not.toContain("conspecificPair");
    expect(result.status).toBe("good");
  });
});

describe("C. çelişkili kaynak", () => {
  it("karides kaydı çelişkili balık: 'kaynaklar çelişiyor' metni, aynı kod; puan ve seviye kayıtsız balıkla aynı", () => {
    const disputed = analyze(tank(), [animal("betta", 1), animal("shrimp", 10)], equipped(), freshReading());
    const warning = warningOf(disputed, "shrimpUnverified");
    expect(warning).toMatchObject({
      level: "warning",
      title: "Beta: karides uyumunda kaynaklar çelişiyor",
      params: { fish: ["Beta"], shrimp: ["Cüce karides"], conflict: true, source: "Practical Fishkeeping" },
    });
    expect(warning?.message).toBe(
      "Kaynaklar Beta ile karideslerin uyumu konusunda çelişiyor; güvenli birlikte yaşam doğrulanamadı. OATA, karideslerin ağzına sığabilecekleri balıklarla tutulmamasını önerir; Cüce karides yavruları ve yeni kabuk değiştirmiş karidesler özellikle risk altındadır. Kaynağın notu: Küçük/yavru karidesleri yer; yetişkinlere tavrı bireyden bireye değişir. Kaynak: Practical Fishkeeping.",
    );
    expect(warning?.message).not.toContain("bulunamadı");
    const silent = analyze(tank(), [animal("silentFish", 1), animal("shrimp", 10)], equipped(), freshReading());
    expect(warningOf(silent, "shrimpUnverified")?.message).toContain("kaynaklarda bulunamadı");
    expect(warningOf(silent, "shrimpUnverified")?.params.conflict).toBeUndefined();
    expect([disputed.score, disputed.status]).toEqual([silent.score, silent.status]);
    expect(disputed.metrics.find((metric) => metric.key === "compatibility")).toEqual(silent.metrics.find((metric) => metric.key === "compatibility"));
  });

  it("kayıtsız ve çelişkili balık birlikte: iki ayrı uyarı, ceza bir kez", () => {
    const both = analyze(tank(), [animal("betta", 1), animal("silentFish", 6), animal("shrimp", 10)], equipped(), freshReading());
    expect(both.warnings.filter((warning) => warning.code === "shrimpUnverified").map((warning) => [warning.title, warning.params.fish])).toEqual([
      ["Karides uyumu doğrulanmadı", ["Bilgisiz balık"]],
      ["Beta: karides uyumunda kaynaklar çelişiyor", ["Beta"]],
    ]);
  });

  it("davranışı yalnız çelişkili kayıtla bilinen tür: değerlendirilemeyenlerde 'kaynaklar çelişiyor' değişkeni", () => {
    const result = analyze(tank(), [animal("calm", 6), animal("disputed", 6), animal("silentFish", 6)], equipped(), freshReading());
    expect(result.unevaluated).toEqual([
      { code: "behaviorUnknown", params: { name: "Tartışmalı tür", conflict: true } },
      { code: "behaviorUnknown", params: { name: "Bilgisiz balık" } },
    ]);
  });
});

describe("D. kırmızı uyarı metinleri (hüküm değişmez)", () => {
  it("iki kırmızı alan uyarısının başlığı ayrı; hükümleri bugünkü gibi", () => {
    // Hacim gerekenin yarısından az: "akvaryum çok küçük", kesin tehlike.
    const tooSmall = analyze(tank("freshwater", 90, 150), [animal("big", 1)], equipped(), freshReading());
    expect(warningOf(tooSmall, "spaceTooSmall")).toMatchObject({ level: "danger", title: "Büyük isteyen: akvaryum çok küçük" });
    expect(tooSmall.status).toBe("danger");
    // Hacim yarının üstünde, uzunluk 3 × boyun altında: "uzunluğu ya da derinliği yetersiz", en çok "dikkat".
    const severe = analyze(tank("freshwater", 150, 59), [animal("big", 1)], equipped(), freshReading());
    expect(warningOf(severe, "spaceSevere")).toMatchObject({ level: "danger", title: "Büyük isteyen: akvaryumun uzunluğu ya da derinliği yetersiz" });
    expect(severe.status).toBe("warning");
  });

  it("fırsatçı avcının küçük balık uyarısı riski anlatır; kesin 'tutmayın' dili yok, hüküm 'dikkat'", () => {
    const result = analyze(tank(), [animal("hunter", 1), animal("calm", 6)], equipped(), freshReading());
    const warning = warningOf(result, "smallFishPredation");
    expect(warning?.level).toBe("danger");
    expect(warning?.message).toContain("Birlikte tutulurlarsa Sakin tür yenebilir; bu eşleşmeden kaçınmak daha güvenlidir.");
    expect(warning?.message).not.toContain("tutmayın");
    expect(result.status).toBe("warning");
  });
});
