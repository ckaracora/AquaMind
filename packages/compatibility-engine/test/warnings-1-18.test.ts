import { describe, expect, it } from "vitest";
import type { Aquarium, Equipment, Livestock, WaterParameters } from "@aquamind/domain";
import {
  ENGINE_VERSION, LIVESTOCK_RISK_WARNING_CODES, RULESET_VERSION, UNEVALUATED_RECORD_WARNING_CODES, createAnalyzer,
  type EquipmentProfileInput, type HealthAnalysis, type KnowledgeResolver, type SpeciesProfileInput,
} from "../src";

// Motor 1.18.0, kural seti 1.15.0 (docs/DECISIONS/0043-eksik-degerlendirme-ve-hukum-kurallari.md; ürün sahibinin onayı 2026-11-14, "tamam başla"):
// 1) "tek tutulmalı" türden birden çok birey kesin tehlike, "erkekler kavga eder" en çok "dikkat"; 2) net hacim gerekenin yarısından küçükse kesin
// tehlike; 3) tanınmayan canlı varken sonuç "eksik" ve değerlendirilemeyenler listesi; 4) davranış bilgisi olmayan tür listede, puanı değiştirmez;
// 5) "salyangoz yer" ve "karides yer" her kategoride, kendi türünü av saymaz; "other" kategorisindeki avcılar doğru uyarır. Stub kayıtlarla.

type StubSpecies = SpeciesProfileInput & { category: Livestock["category"] };
const base = { minGroup: 1, temperature: [22, 27] as [number, number], ph: [6, 7.5] as [number, number], flow: "medium" as const, wasteFactor: 0.5 };
const peacefulNote = { peaceful: { source: "OATA" } };
const species: Record<string, StubSpecies> = {
  calm: { id: "calm", commonName: "Sakin tür", category: "fish", adultSizeCm: 4, minVolumeL: 40, ...base, behavior: peacefulNote },
  calm2: { id: "calm2", commonName: "Öbür sakin tür", category: "fish", adultSizeCm: 4, minVolumeL: 40, ...base, behavior: peacefulNote },
  silent: { id: "silent", commonName: "Bilgisiz tür", category: "fish", adultSizeCm: 4, minVolumeL: 40, ...base },
  disputed: { id: "disputed", commonName: "Tartışmalı tür", category: "fish", adultSizeCm: 4, minVolumeL: 40, ...base, behavior: { finNipper: { source: "Seriously Fish", conflict: true } } },
  notHunter: { id: "notHunter", commonName: "Avcı olmayan", category: "fish", adultSizeCm: 4, minVolumeL: 40, ...base, behavior: { notPiscivorous: { source: "Seriously Fish" } } },
  noted: { id: "noted", commonName: "Notlu tür", category: "fish", adultSizeCm: 4, minVolumeL: 40, ...base, communityCaution: "Kaynağın topluluk notu." },
  loner: { id: "loner", commonName: "Yalnız tür", category: "fish", adultSizeCm: 8, minVolumeL: 60, ...base, behavior: { conspecificAggression: { source: "Seriously Fish", value: "all" } } },
  pairLoner: { id: "pairLoner", commonName: "Çift tür", category: "fish", adultSizeCm: 8, minVolumeL: 60, ...base, minGroup: 2, behavior: { conspecificAggression: { source: "Seriously Fish", value: "all" } } },
  fighter: { id: "fighter", commonName: "Kavgacı", category: "fish", adultSizeCm: 6, minVolumeL: 40, ...base, behavior: { conspecificAggression: { source: "Fishkeeper", value: "males" } } },
  big: { id: "big", commonName: "Büyük isteyen", category: "fish", adultSizeCm: 10, minVolumeL: 200, minTankLengthCm: 100, ...base, behavior: peacefulNote },
  bigCrayfish: { id: "bigCrayfish", commonName: "Büyük kerevit", category: "other", adultSizeCm: 10, minVolumeL: 200, ...base, behavior: peacefulNote },
  perAnimal: { id: "perAnimal", commonName: "Birey başı", category: "fish", adultSizeCm: 4, minVolumeL: 40, additionalVolumePerAnimalL: 20, ...base, behavior: peacefulNote },
  // Katil salyangoz benzeri: salyangoz yiyen salyangoz.
  assassin: { id: "assassin", commonName: "Avcı salyangoz", category: "snail", adultSizeCm: 2, minVolumeL: 20, ...base, behavior: { eatsSnails: { source: "Fishkeeper" } } },
  ramshorn: { id: "ramshorn", commonName: "Boru salyangozu", category: "snail", adultSizeCm: 2, minVolumeL: 10, ...base, behavior: peacefulNote },
  nerite: { id: "nerite", commonName: "Nerit", category: "snail", adultSizeCm: 2, minVolumeL: 10, ...base, behavior: peacefulNote },
  // Kerevit ve kurbağa ("other"): fırsatçı avcı, asıl avcı ve karides yiyen.
  crayfish: { id: "crayfish", commonName: "Kerevit", category: "other", adultSizeCm: 12, minVolumeL: 80, ...base, behavior: { eatsSmallFish: { source: "Fishkeeper" }, eatsShrimp: { source: "Fishkeeper" } } },
  frog: { id: "frog", commonName: "Kurbağa", category: "other", adultSizeCm: 15, minVolumeL: 80, ...base, predatory: true },
  smallFish: { id: "smallFish", commonName: "Küçük balık", category: "fish", adultSizeCm: 3, minVolumeL: 20, ...base, behavior: peacefulNote },
  shrimp: { id: "shrimp", commonName: "Cüce karides", category: "shrimp", adultSizeCm: 3, minVolumeL: 10, ...base, behavior: peacefulNote },
  unverified: { id: "unverified", commonName: "Doğrulanmamış tür", category: "fish", adultSizeCm: 4, minVolumeL: 40, ...base },
};
const devices: Record<string, EquipmentProfileInput> = {
  filter: { id: "filter", category: "filter", brand: "Stub", model: "F200", ratedFlowLph: 800, recommendedMaxL: 200 },
  heater: { id: "heater", category: "heater", brand: "Stub", model: "H100", powerW: 100, recommendedMinL: 50, recommendedMaxL: 250 },
  bareFilter: { id: "bareFilter", category: "filter", brand: "Stub", model: "Verisiz", capacityDataNote: "Üretici debi yayımlamıyor." },
  sponge: { id: "sponge", category: "filter", brand: "Stub", model: "Sünger", requiresAirPump: true, recommendedMaxL: 200 },
  airPump: { id: "airPump", category: "air_pump", brand: "Stub", model: "Hava", ratedFlowLph: 200 },
};
const resolver: KnowledgeResolver = {
  speciesForLivestock: (item) => (item.catalogId ? species[item.catalogId] : undefined),
  profileForEquipment: (item) => (item.catalogId ? devices[item.catalogId] : undefined),
  isVerifiedSpeciesProfile: (profile) => profile !== undefined && profile.id !== "unverified",
  isVerifiedEquipmentProfile: (profile) => profile !== undefined,
};
const analyze = createAnalyzer(resolver);
const tank = (netVolumeLiters = 120, lengthCm = 100): Aquarium => ({ id: "a", name: "Stub", type: "freshwater", lengthCm, widthCm: 40, heightCm: 45, netVolumeLiters, setupDate: "2026-01-01" });
let counter = 0;
const animal = (catalogId: string, quantity = 1): Livestock => ({ id: `l-${catalogId}-${counter++}`, aquariumId: "a", catalogId, commonName: species[catalogId]?.commonName ?? catalogId, category: species[catalogId]?.category ?? "fish", quantity, addedAt: "2026-01-01" });
const device = (catalogId: string, category: Equipment["category"] = devices[catalogId]?.category ?? "filter", extra: Partial<Equipment> = {}): Equipment => ({ id: `e-${catalogId}-${counter++}`, aquariumId: "a", catalogId, category, installedAt: "2026-01-01", ...extra });
const equipped = () => [device("filter"), device("heater")];
const reading = (): WaterParameters => ({ id: "w", aquariumId: "a", measuredAt: "2026-11-14", temperature: 25, ph: 7, ammonia: 0, nitrite: 0, nitrate: 10 });
const codes = (result: HealthAnalysis) => result.warnings.map((warning) => warning.code);
const warningOf = (result: HealthAnalysis, code: string) => result.warnings.find((warning) => warning.code === code);
const unevaluatedCodes = (result: HealthAnalysis) => (result.unevaluated ?? []).map((item) => item.code);

describe("sürüm (karar 0043)", () => {
  it("motor 1.18.0, kural seti 1.15.0", () => {
    expect([ENGINE_VERSION, RULESET_VERSION]).toEqual(["1.18.0", "1.15.0"]);
  });
});

describe("1. aynı tür saldırganlığı", () => {
  it("'tek tutulmalı' türden iki birey: kırmızı uyarı, hüküm 'uygun değil'", () => {
    const result = analyze(tank(), [animal("loner", 2)], equipped(), reading());
    expect(warningOf(result, "conspecificAll")).toMatchObject({ level: "danger", title: "Yalnız tür: tek tutulmalı" });
    expect(result.status).toBe("danger");
    expect(result.metrics.find((metric) => metric.key === "compatibility")).toMatchObject({ score: 40, status: "danger", detailCode: "conspecific" });
  });

  it("tek birey uyarı almaz", () => {
    const result = analyze(tank(), [animal("loner", 1)], equipped(), reading());
    expect(codes(result)).not.toContain("conspecificAll");
    expect(result.status).toBe("good");
  });

  it("karar 0040 korunur: kaynağın çift önerdiği türde tek çift uyarı almaz, fazlası 'uygun değil'", () => {
    expect(analyze(tank(), [animal("pairLoner", 2)], equipped(), reading())).toMatchObject({ status: "good" });
    const three = analyze(tank(), [animal("pairLoner", 3)], equipped(), reading());
    expect(codes(three)).toContain("conspecificAll");
    expect(three.status).toBe("danger");
  });

  it("aynı tür farklı kayıtlarda eklense de birlikte sayılır", () => {
    expect(analyze(tank(), [animal("loner", 1), animal("loner", 1)], equipped(), reading()).status).toBe("danger");
  });

  it("'erkekler kavga eder' sarı kalır ama hüküm en çok 'dikkat' (74)", () => {
    const result = analyze(tank(), [animal("fighter", 2)], equipped(), reading());
    expect(warningOf(result, "conspecificMales")).toMatchObject({ level: "warning" });
    expect(LIVESTOCK_RISK_WARNING_CODES.has("conspecificMales")).toBe(true);
    expect(result).toMatchObject({ score: 74, status: "warning" });
  });
});

describe("2. ağır alan yetersizliği: net hacim gerekenin yarısından küçük", () => {
  it("54 L'de 200 L isteyen tür: kırmızı, hüküm 'uygun değil'; metin iki hacmi ve uzunluğu birlikte söyler", () => {
    const result = analyze(tank(54, 60), [animal("big")], equipped(), reading());
    const warning = warningOf(result, "spaceTooSmall");
    expect(warning).toMatchObject({ level: "danger", title: "Büyük isteyen: akvaryum çok küçük" });
    expect(warning?.message).toBe(
      "Kaynağa göre Büyük isteyen için kayıtlı 1 bireyle en az 200 L gerekir; akvaryumun net hacmi 54 L, gerekenin yarısından da az. Kaynak en az 100 cm uzunluk da istiyor; akvaryumun uzunluğu 60 cm. Bu tür bu akvaryumda tutulmamalı.",
    );
    expect(warning?.params).toEqual({ name: "Büyük isteyen", count: 1, volume: 200, aquariumVolume: 54, lengthShort: true, length: 100, tankLength: 60 });
    expect(result.status).toBe("danger");
    expect(result.metrics.find((metric) => metric.key === "space")).toMatchObject({ score: 20, status: "danger", detailCode: "spaceSevere" });
    // Aynı tür için sarı alan uyarısı ayrıca çıkmaz.
    expect(codes(result).filter((code) => code.startsWith("space"))).toEqual(["spaceTooSmall"]);
  });

  it("uzunluk yetiyorsa uzunluk cümlesi yazılmaz", () => {
    expect(warningOf(analyze(tank(54, 120), [animal("big")], equipped(), reading()), "spaceTooSmall")?.message).not.toContain("uzunluk");
  });

  it("sınır: tam yarısı (100 L) kırmızı değil, sarı 'alan sınırda'; altı kırmızı", () => {
    const half = analyze(tank(100), [animal("big")], equipped(), reading());
    expect(codes(half)).toContain("spaceLimited");
    expect(codes(half)).not.toContain("spaceTooSmall");
    expect(half.status).toBe("warning");
    expect(analyze(tank(99.9), [animal("big")], equipped(), reading()).status).toBe("danger");
  });

  it("birey başına ek hacim gerekeni büyütür (40 + 4 × 20 = 120 L; 59 L kırmızı, 60 L sarı)", () => {
    expect(warningOf(analyze(tank(59), [animal("perAnimal", 5)], equipped(), reading()), "spaceTooSmall")?.params).toMatchObject({ count: 5, volume: 120, aquariumVolume: 59 });
    expect(codes(analyze(tank(60), [animal("perAnimal", 5)], equipped(), reading()))).toContain("spaceLimited");
  });

  it("her kategoride geçerlidir (kerevit)", () => {
    const result = analyze(tank(80), [animal("bigCrayfish")], equipped(), reading());
    expect(warningOf(result, "spaceTooSmall")?.level).toBe("danger");
    expect(result.status).toBe("danger");
  });
});

describe("3. eksik değerlendirme", () => {
  const unknown = (name: string, quantity: number): Livestock => ({ id: `x-${counter++}`, aquariumId: "a", commonName: name, category: "fish", quantity, addedAt: "2026-01-01" });

  it("tanınmayan canlı: sonuç 'eksik', listede adı ve adediyle; durum ve puan değişmez", () => {
    const withUnknown = analyze(tank(), [unknown("Balon moli", 4), animal("calm", 6)], equipped(), reading());
    const without = analyze(tank(), [animal("calm", 6)], equipped(), reading());
    expect(withUnknown.incomplete).toBe(true);
    expect(withUnknown.unevaluated).toEqual([{ code: "unknownAnimal", params: { name: "Balon moli", count: 4 } }]);
    expect(withUnknown.status).toBe("good");
    expect(without.incomplete).toBeUndefined();
    expect(without.unevaluated).toBeUndefined();
  });

  it("doğrulanmamış canlı da 'eksik' sayılır", () => {
    const result = analyze(tank(), [animal("unverified", 2), animal("calm", 6)], equipped(), reading());
    expect(result.incomplete).toBe(true);
    expect(result.unevaluated).toEqual([{ code: "unverifiedAnimal", params: { name: "Doğrulanmamış tür", count: 2 } }]);
  });

  it("hüküm 'dikkat' ya da 'uygun değil' ise o kalır; liste yine gelir", () => {
    const result = analyze(tank(), [unknown("Balon moli", 4), animal("loner", 2)], equipped(), reading());
    expect(result.status).toBe("danger");
    expect(result.incomplete).toBe(true);
    expect(unevaluatedCodes(result)).toContain("unknownAnimal");
  });

  it("tanınmayan ve kapasitesi bilinmeyen cihazlar ile su ölçümü yokluğu listede; bunlar sonucu 'eksik' yapmaz", () => {
    const result = analyze(tank(), [animal("calm", 6)], [device("unknownFilter", "filter", { brand: "Marka", model: "Model X" }), device("bareFilter"), device("heater"), device("lamp", "lighting")]);
    expect(result.unevaluated).toEqual([
      { code: "unknownEquipment", params: { name: "Marka Model X", category: "filter" } },
      { code: "equipmentNoCapacity", params: { name: "Stub Verisiz", category: "filter", note: "Üretici debi yayımlamıyor." } },
      { code: "noReading", params: {} },
    ]);
    expect(result.incomplete).toBeUndefined();
  });

  it("adı girilmemiş cihazın adı boştur; canlısı olmayan akvaryumda 'su ölçümü yok' çıkmaz", () => {
    const result = analyze(tank(), [], [device("unknownHeater", "heater")]);
    expect(result.unevaluated).toEqual([{ code: "unknownEquipment", params: { name: "", category: "heater" } }]);
  });

  it("kartın kapsadığı kayıt uyarıları motorda aynen üretilir (ekran tekrar etmez)", () => {
    const result = analyze(tank(), [unknown("Balon moli", 4), animal("calm", 6)], [device("unknownFilter", "filter"), device("bareFilter")], reading());
    expect(codes(result).filter((code) => UNEVALUATED_RECORD_WARNING_CODES.has(code)).sort()).toEqual(["missingCapacity", "unmatchedAnimals", "unmatchedEquipment"]);
  });
});

describe("4. davranış bilgisi yok", () => {
  it("bilgisi olmayan tür listede; uyarı yok, puan ve durum değişmez", () => {
    const silent = analyze(tank(), [animal("calm", 6), animal("silent", 6)], equipped(), reading());
    const known = analyze(tank(), [animal("calm", 6), animal("calm2", 6)], equipped(), reading());
    expect(silent.unevaluated).toEqual([{ code: "behaviorUnknown", params: { name: "Bilgisiz tür" } }]);
    expect(known.unevaluated).toBeUndefined();
    expect([silent.score, silent.status, codes(silent)]).toEqual([known.score, known.status, codes(known)]);
    expect(silent.incomplete).toBeUndefined();
  });

  it("barışçıl, 'balık avcısı değil' ve topluluk notu 'biliniyor' sayılır; yalnız çelişkili kayıt sayılmaz", () => {
    const result = analyze(tank(200), [animal("calm", 6), animal("notHunter", 6), animal("noted", 6), animal("disputed", 6)], equipped(), reading());
    expect(result.unevaluated).toEqual([{ code: "behaviorUnknown", params: { name: "Tartışmalı tür" } }]);
  });

  it("akvaryumda tek tür varken listeye girmez", () => {
    expect(analyze(tank(), [animal("silent", 6)], equipped(), reading()).unevaluated).toBeUndefined();
  });
});

describe("5. salyangoz ve karides yiyenler, 'other' kategorisindeki avcılar", () => {
  it("salyangoz yiyen salyangoz öbür salyangozlar için uyarır, kendi türü için uyarmaz", () => {
    const result = analyze(tank(), [animal("assassin", 3), animal("ramshorn", 5), animal("nerite", 2)], equipped(), reading());
    expect(warningOf(result, "snailEaten")?.params).toMatchObject({ eaters: ["Avcı salyangoz"], snails: ["Boru salyangozu", "Nerit"] });
  });

  it("tek başına salyangoz yiyen salyangoz uyarı üretmez", () => {
    expect(codes(analyze(tank(), [animal("assassin", 3)], equipped(), reading()))).not.toContain("snailEaten");
    expect(codes(analyze(tank(), [animal("assassin", 1), animal("assassin", 2)], equipped(), reading()))).not.toContain("snailEaten");
  });

  it("kerevit (other, eatsSmallFish) küçük balıkta kırmızı uyarır; karides yer kaydı karidesi uyarır", () => {
    const result = analyze(tank(200), [animal("crayfish"), animal("smallFish", 6), animal("shrimp", 10)], equipped(), reading());
    expect(warningOf(result, "smallFishPredation")).toMatchObject({ level: "danger", params: expect.objectContaining({ hunter: "Kerevit", prey: "Küçük balık" }) });
    expect(warningOf(result, "shrimpEaten")?.params).toMatchObject({ eaters: ["Kerevit"], shrimp: ["Cüce karides"] });
    expect(result.status).toBe("warning");
  });

  it("asıl avcı kurbağa (other, predatory) küçük canlılarda kesin tehlike", () => {
    const result = analyze(tank(200), [animal("frog"), animal("smallFish", 6)], equipped(), reading());
    expect(warningOf(result, "predation")).toMatchObject({ level: "danger", params: { predator: "Kurbağa", prey: "Küçük balık" } });
    expect(result.status).toBe("danger");
  });
});

describe("kontrol turu düzeltmeleri (karşı firma kontrolü, 2026-11-14)", () => {
  it("hava motoru olmayan sünger filtre kartta 'kapasite bilgisi eksik' diye görünmez; eksiği kırmızı 'hava motoru gerekli' uyarısı söyler", () => {
    const result = analyze(tank(), [animal("calm", 6)], [device("sponge"), device("heater")], reading());
    expect(warningOf(result, "airPumpRequired")).toMatchObject({ level: "danger" });
    expect(unevaluatedCodes(result)).not.toContain("equipmentNoCapacity");
    // Hava motoru eklenince filtre hesaba girer; kartta yine madde yok.
    expect(analyze(tank(), [animal("calm", 6)], [device("sponge"), device("airPump"), device("heater")], reading()).unevaluated).toBeUndefined();
    // Kapasite bilgisi gerçekten eksik olan filtre kartta kalır.
    expect(unevaluatedCodes(analyze(tank(), [animal("calm", 6)], [device("bareFilter"), device("heater")], reading()))).toEqual(["equipmentNoCapacity"]);
  });

  it("uzunluğu girilmemiş akvaryumda (0) 'yarısından küçük' uyarısı 'akvaryumun uzunluğu 0 cm' demez", () => {
    const result = analyze({ ...tank(54, 0), widthCm: 0, heightCm: 0 }, [animal("big")], equipped(), reading());
    expect(warningOf(result, "spaceTooSmall")?.params).toMatchObject({ lengthShort: false });
    expect(warningOf(result, "spaceTooSmall")?.message).not.toContain("0 cm");
  });

  it("cihazın markası ya da modeli yalnız boşluksa adı boş sayılır", () => {
    const result = analyze(tank(), [], [device("unknownHeater", "heater", { brand: "  ", model: " " })]);
    expect(result.unevaluated).toEqual([{ code: "unknownEquipment", params: { name: "", category: "heater" } }]);
  });

  it("yalnız aynı tür saldırganlığı kaydı olan tür, başka canlılarla uyumu bilinmediği için listeye girer; hüküm değişmez", () => {
    const result = analyze(tank(200), [animal("calm", 6), animal("fighter", 1)], equipped(), reading());
    expect(result.unevaluated).toEqual([{ code: "behaviorUnknown", params: { name: "Kavgacı" } }]);
    expect(result.status).toBe("good");
  });
});
