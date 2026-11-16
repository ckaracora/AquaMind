import { describe, expect, it } from "vitest";
import type { Aquarium, Equipment, Livestock, WaterParameters } from "@aquamind/domain";
import {
  ENGINE_VERSION, LIVESTOCK_RISK_WARNING_CODES, RULESET_VERSION, createAnalyzer,
  type EquipmentProfileInput, type HealthAnalysis, type KnowledgeResolver, type SpeciesProfileInput,
} from "../src";

// Motor 1.21.0, kural seti 1.18.0 (docs/DECISIONS/0046-cinsiyet-toplam-alan-ve-av-hukmu.md; ürün sahibinin kararı 2026-11-16). Stub kayıtlarla, her karar
// için olumlu ve olumsuz senaryo:
// 1) "erkekler kavga eder" kullanıcının girdiği cinsiyeti okur; 3) türlerin toplam alan ihtiyacı; 4) avı kaynak açıkça yazıyorsa "uygun değil", yalnız %40
// boy oranı ve ekipman kırmızıları "dikkat"; 5) kaynağın kabul ettiği büyük grup (`groupFrom`) ve keşiş yengeci grubu. 2) puanın gizlenmesi ekran işidir
// (motor puanı ve `incomplete` bayrağını aynen verir); src/lib/__tests__/trust-1-21.test.ts sınar.

type StubSpecies = SpeciesProfileInput & { category: Livestock["category"] };
const fresh = { minGroup: 1, temperature: [22, 27] as [number, number], ph: [6, 7.5] as [number, number], flow: "medium" as const, wasteFactor: 0.5 };
const marine = { minGroup: 1, waterTypes: ["saltwater" as const], temperature: [24, 27] as [number, number], flow: "medium" as const, wasteFactor: 0.5 };
const calm = { peaceful: { source: "OATA" } };
const species: Record<string, StubSpecies> = {
  fighter: { id: "fighter", commonName: "Kavgacı erkek", category: "fish", adultSizeCm: 6, minVolumeL: 20, ...fresh, behavior: { conspecificAggression: { source: "Seriously Fish", value: "males" } } },
  shoalA: { id: "shoalA", commonName: "Sürü A", category: "fish", adultSizeCm: 4, minVolumeL: 60, ...fresh, behavior: calm },
  shoalB: { id: "shoalB", commonName: "Sürü B", category: "fish", adultSizeCm: 4, minVolumeL: 80, ...fresh, behavior: calm },
  shoalC: { id: "shoalC", commonName: "Sürü C", category: "fish", adultSizeCm: 4, minVolumeL: 80, ...fresh, behavior: calm },
  shoalD: { id: "shoalD", commonName: "Sürü D", category: "fish", adultSizeCm: 4, minVolumeL: 54, ...fresh, behavior: calm },
  shrimpA: { id: "shrimpA", commonName: "Karides A", category: "shrimp", adultSizeCm: 3, minVolumeL: 60, ...fresh, behavior: calm },
  snailA: { id: "snailA", commonName: "Salyangoz A", category: "snail", adultSizeCm: 3, minVolumeL: 60, ...fresh, behavior: calm },
  ratioHunter: { id: "ratioHunter", commonName: "Boy oranlı avcı", category: "fish", adultSizeCm: 20, minVolumeL: 100, ...fresh, behavior: { eatsSmallFish: { source: "Seriously Fish" } } },
  namedHunter: { id: "namedHunter", commonName: "Adıyla sayan avcı", category: "other", adultSizeCm: 10, minVolumeL: 80, ...marine, behavior: { eatsSmallFish: { source: "Fishkeeper", preyIds: ["bigPrey"] } } },
  sizeHunter: { id: "sizeHunter", commonName: "Av boyu bilinen avcı", category: "fish", adultSizeCm: 20, minVolumeL: 100, ...fresh, behavior: { eatsSmallFish: { source: "Seriously Fish", maxPreyCm: 3 } } },
  smallPrey: { id: "smallPrey", commonName: "Küçük av", category: "fish", adultSizeCm: 3, minVolumeL: 20, ...fresh, behavior: calm },
  midPrey: { id: "midPrey", commonName: "Orta av", category: "fish", adultSizeCm: 6, minVolumeL: 20, ...fresh, behavior: calm },
  bigPrey: { id: "bigPrey", commonName: "Adı geçen balık", category: "fish", adultSizeCm: 9, minVolumeL: 60, ...marine, behavior: calm },
  otherMarine: { id: "otherMarine", commonName: "Adı geçmeyen balık", category: "fish", adultSizeCm: 4, minVolumeL: 60, ...marine, behavior: calm },
  damsel: { id: "damsel", commonName: "Damsel", category: "fish", adultSizeCm: 7, minVolumeL: 100, ...marine, behavior: { conspecificAggression: { source: "Fishkeeper", value: "all", pairAccepted: true, groupFrom: 9, condition: "Küçük gruplarda ölümler sık görülür." } } },
  groupOnly: { id: "groupOnly", commonName: "Çiftsiz grup türü", category: "fish", adultSizeCm: 7, minVolumeL: 100, ...marine, behavior: { conspecificAggression: { source: "Fishkeeper", value: "all", groupFrom: 7 } } },
  hermitBlue: { id: "hermitBlue", commonName: "Mavi yengeç", category: "other", adultSizeCm: 2, minVolumeL: 40, ...marine, behavior: { incompatibleGroup: { source: "Fishkeeper", group: "hermitCrab" } } },
  hermitRed: { id: "hermitRed", commonName: "Kırmızı yengeç", category: "other", adultSizeCm: 4, minVolumeL: 40, ...marine, behavior: { incompatibleGroup: { source: "Fishkeeper", group: "hermitCrab" } } },
};
const devices: Record<string, EquipmentProfileInput> = {
  filter: { id: "filter", category: "filter", brand: "Stub", model: "F600", ratedFlowLph: 2400, recommendedMaxL: 600 },
  heater: { id: "heater", category: "heater", brand: "Stub", model: "H300", powerW: 300, recommendedMinL: 50, recommendedMaxL: 600 },
  filter150: { id: "filter150", category: "filter", brand: "Stub", model: "F150", ratedFlowLph: 500, recommendedMaxL: 150 },
  smallFilter: { id: "smallFilter", category: "filter", brand: "Stub", model: "F60", ratedFlowLph: 300, recommendedMaxL: 60 },
};
const resolver: KnowledgeResolver = {
  speciesForLivestock: (item) => (item.catalogId ? species[item.catalogId] : undefined),
  profileForEquipment: (item) => (item.catalogId ? devices[item.catalogId] : undefined),
  isVerifiedSpeciesProfile: (profile) => profile !== undefined,
  isVerifiedEquipmentProfile: (profile) => profile !== undefined,
};
const analyze = createAnalyzer(resolver);
const tank = (netVolumeLiters = 200, type: Aquarium["type"] = "freshwater", lengthCm = 120): Aquarium => ({ id: "a", name: "Stub", type, lengthCm, widthCm: 50, heightCm: 50, netVolumeLiters, setupDate: "2026-01-01" });
let counter = 0;
const animal = (catalogId: string, quantity = 1, gender?: Livestock["gender"]): Livestock => ({ id: `l-${catalogId}-${counter++}`, aquariumId: "a", catalogId, commonName: species[catalogId].commonName, category: species[catalogId].category, quantity, addedAt: "2026-01-01", ...(gender ? { gender } : {}) });
const device = (catalogId: string): Equipment => ({ id: `e-${catalogId}`, aquariumId: "a", catalogId, category: devices[catalogId].category, installedAt: "2026-01-01" });
// Küçük akvaryumda büyük filtre "akış güçlü" ölçütüyle sonucu düşürür; küçük akvaryuma küçük filtre takılır.
const equipped = (netVolumeLiters = 200) => [device(netVolumeLiters <= 150 ? "filter150" : "filter"), device("heater")];
const fresh25 = (): WaterParameters => ({ id: "w", aquariumId: "a", measuredAt: "2026-11-16", temperature: 25, ph: 7, ammonia: 0, nitrite: 0, nitrate: 10 });
const sea = (): WaterParameters => ({ id: "w", aquariumId: "a", measuredAt: "2026-11-16", temperature: 25, ph: 8.2, specificGravity: 1.024, ammonia: 0, nitrite: 0, nitrate: 10 });
const codes = (result: HealthAnalysis) => result.warnings.map((warning) => warning.code);
const warningOf = (result: HealthAnalysis, code: string) => result.warnings.find((warning) => warning.code === code);

describe("sürüm (karar 0046)", () => {
  it("motor 1.21.0, kural seti 1.18.0", () => {
    expect([ENGINE_VERSION, RULESET_VERSION]).toEqual(["1.21.0", "1.18.0"]);
  });
  it("iki yeni sarı kod canlı riski sınıfında", () => {
    for (const code of ["conspecificSmallGroup", "spaceTotal"]) expect(LIVESTOCK_RISK_WARNING_CODES.has(code), code).toBe(true);
  });
});

describe("1: cinsiyet", () => {
  const run = (...animals: Livestock[]) => analyze(tank(100), animals, equipped(100), fresh25());
  it("iki dişi ya da karışık bir çift uyarı almaz ve sonuç 'iyi'", () => {
    for (const result of [run(animal("fighter", 2, "female")), run(animal("fighter", 2, "mixed")), run(animal("fighter", 1, "male"), animal("fighter", 3, "female"))]) {
      expect(codes(result)).not.toContain("conspecificMales");
      expect(result.status).toBe("good");
    }
  });
  it("iki erkek, cinsiyeti girilmemiş iki birey, karışık üç birey ve bir erkek ile bir bilinmeyen 'dikkat' kalır", () => {
    // Tek bireylik iki "karışık" kayıt çelişkilidir; bilinmiyor gibi sayılır (kontrol turu).
    for (const result of [run(animal("fighter", 2, "male")), run(animal("fighter", 2)), run(animal("fighter", 2, "unknown")), run(animal("fighter", 3, "mixed")), run(animal("fighter", 1, "male"), animal("fighter", 1)), run(animal("fighter", 1, "mixed"), animal("fighter", 1, "mixed"))]) {
      expect(codes(result)).toContain("conspecificMales");
      expect(result.status).toBe("warning");
      expect(result.score).toBeLessThanOrEqual(74);
    }
  });
  it("cinsiyeti bilinmiyorsa metin bugünkü gibi; iki ve üstü erkek girildiyse sayısını söyler", () => {
    expect(warningOf(run(animal("fighter", 2)), "conspecificMales")).toMatchObject({ message: "Kaynağa göre bu türün erkekleri birbiriyle kavga eder; kayıtlı 2 bireyden birden fazlası erkekse ayırın. Kaynak: Seriously Fish.", params: { name: "Kavgacı erkek", count: 2, condition: "", source: "Seriously Fish" } });
    expect(warningOf(run(animal("fighter", 2)), "conspecificMales")?.params).not.toHaveProperty("males");
    const males = warningOf(run(animal("fighter", 3, "male"), animal("fighter", 2, "female")), "conspecificMales");
    expect(males).toMatchObject({ message: "Kaynağa göre bu türün erkekleri birbiriyle kavga eder; kayıtlı 5 bireyden 3 tanesi erkek olarak girildi. Erkekleri ayırın. Kaynak: Seriously Fish.", params: { count: 5, males: 3 } });
  });
});

describe("3: toplam alan", () => {
  const four = () => [animal("shoalA", 6), animal("shoalB", 6), animal("shoalC", 4), animal("shoalD", 10)];
  it("her tür tek başına sığarken gereken hacimlerin toplamı net hacmin iki katını aşarsa sarı uyarı, en çok 'dikkat', ölçüt 60", () => {
    const result = analyze(tank(90), four(), equipped(), fresh25());
    expect(result.warnings.filter((warning) => warning.code.startsWith("space")).map((warning) => warning.code)).toEqual(["spaceTotal"]);
    expect(warningOf(result, "spaceTotal")).toMatchObject({
      level: "warning", title: "Türlerin toplam alan ihtiyacı yüksek",
      message: "Kaynaklara göre Sürü A, Sürü B, Sürü C ve Sürü D için kayıtlı adetlerle gereken en az hacimlerin toplamı 274 L; akvaryumun net hacmi 90 L, bu toplamın yarısından da az. Her tür tek başına sığsa da birlikte kalabalık olur. Tür ya da birey sayısını azaltmayı ya da daha büyük bir akvaryumu düşünün.",
      params: { species: ["Sürü A", "Sürü B", "Sürü C", "Sürü D"], total: 274, aquariumVolume: 90 },
    });
    expect(result.status).toBe("warning");
    expect(result.score).toBeLessThanOrEqual(74);
    expect(result.metrics.find((metric) => metric.key === "space")).toMatchObject({ score: 60, status: "warning", detailCode: "spaceTotal", detailParams: {} });
  });
  it("toplam iki katı aşmıyorsa (tam iki katı dahil) ya da tek tür varsa uyarı yok", () => {
    expect(codes(analyze(tank(137), four(), equipped(), fresh25()))).not.toContain("spaceTotal");
    expect(codes(analyze(tank(70), [animal("shoalA"), animal("shoalB")], equipped(), fresh25()))).not.toContain("spaceTotal");
    const alone = analyze(tank(80), [animal("shoalB", 20)], equipped(), fresh25());
    expect(codes(alone)).not.toContain("spaceTotal");
  });
  it("karides ve salyangoz toplama girmez; en az iki sayılan tür gerekir", () => {
    const result = analyze(tank(80), [animal("shoalB"), animal("shrimpA"), animal("snailA")], equipped(80), fresh25());
    expect(codes(result)).not.toContain("spaceTotal");
    expect(result.status).toBe("good");
  });
  it("bir tür tek başına sığmıyorsa onun kendi alan uyarısı çıkar, toplam uyarısı çıkmaz", () => {
    const result = analyze(tank(70), four(), equipped(), fresh25());
    expect(codes(result)).toContain("spaceLimited");
    expect(codes(result)).not.toContain("spaceTotal");
  });
});

describe("4: canlının yenmesi kırmızısı", () => {
  it("yalnız %40 boy oranına dayanan av uyarısı kırmızı kalır ama hüküm 'dikkat' (kabul edilen kaynaklarda dayanağı yok)", () => {
    const result = analyze(tank(), [animal("ratioHunter"), animal("midPrey", 6)], equipped(), fresh25());
    expect(warningOf(result, "smallFishPredation")).toMatchObject({ level: "danger", params: { hunter: "Boy oranlı avcı", prey: "Orta av" } });
    expect(warningOf(result, "smallFishPredation")?.params).not.toHaveProperty("explicit");
    expect(result.status).toBe("warning");
    expect(result.score).toBe(74);
  });
  it("kaynak avı adıyla sayıyorsa 'uygun değil'; boy oranına bakılmaz, adı geçmeyen balık av sayılmaz", () => {
    const result = analyze(tank(300, "saltwater"), [animal("namedHunter"), animal("bigPrey"), animal("otherMarine")], equipped(), sea());
    expect(result.warnings.filter((warning) => warning.code === "smallFishPredation").map((warning) => warning.params.prey)).toEqual(["Adı geçen balık"]);
    expect(warningOf(result, "smallFishPredation")).toMatchObject({ level: "danger", message: "Kaynak, Adı geçen balık türünü Adıyla sayan avcı tarafından yenebilecek balıklar arasında adıyla sayıyor. Bu iki türü aynı akvaryumda tutmayın. Kaynak: Fishkeeper.", params: { explicit: "named" } });
    expect(result.status).toBe("danger");
    expect(result.score).toBeLessThanOrEqual(49);
    const without = analyze(tank(300, "saltwater"), [animal("namedHunter"), animal("otherMarine")], equipped(), sea());
    expect(codes(without)).not.toContain("smallFishPredation");
    expect(without.status).toBe("good");
  });
  it("kaynak sayısal av boyu veriyorsa sınırın içindeki av 'uygun değil', dışındaki uyarısız", () => {
    const inside = analyze(tank(), [animal("sizeHunter"), animal("smallPrey", 6)], equipped(), fresh25());
    expect(warningOf(inside, "smallFishPredation")).toMatchObject({ params: { explicit: "size", maxPrey: 3 }, message: "Av boyu bilinen avcı küçük balıkları yiyebilir; kaynağa göre 3 cm ve altındaki balıklar risk altında, Küçük av yetişkin boyuyla bu sınırın içinde. Bu iki türü aynı akvaryumda tutmayın. Kaynak: Seriously Fish." });
    expect(inside.status).toBe("danger");
    const outside = analyze(tank(), [animal("sizeHunter"), animal("midPrey", 6)], equipped(), fresh25());
    expect(codes(outside)).not.toContain("smallFishPredation");
  });
  it("ekipman kırmızıları 'dikkat' kalır (küçük filtre)", () => {
    const result = analyze(tank(200), [animal("shoalA", 6)], [device("smallFilter"), device("heater")], fresh25());
    expect(warningOf(result, "filterTooSmallManufacturer")?.level).toBe("danger");
    expect(result.status).toBe("warning");
    expect(result.score).toBe(74);
  });
});

describe("5: kaynağın kabul ettiği büyük grup ve keşiş yengeci grubu", () => {
  const run = (...animals: Livestock[]) => analyze(tank(1200, "saltwater", 300), animals, equipped(), sea());
  it("tek birey ve büyük grup (9 ve üstü) uyarısız; çift sarı; arası sarı 'küçük grupta kavga eder', en çok 'dikkat'", () => {
    expect(codes(run(animal("damsel")))).not.toContain("conspecificSmallGroup");
    expect(run(animal("damsel", 9)).warnings.filter((warning) => warning.code.startsWith("conspecific"))).toEqual([]);
    expect(codes(run(animal("damsel", 2)))).toContain("conspecificPair");
    const three = run(animal("damsel", 3));
    expect(warningOf(three, "conspecificSmallGroup")).toMatchObject({
      level: "warning", title: "Damsel: küçük grupta kavga eder",
      message: "Kaynağa göre bu tür kendi türüne saldırgandır; tek, uyumlu bir çift ya da en az 9 bireylik bir grup olarak tutulabilir. Kayıtlı 3 birey bunların arasında kalıyor; küçük gruplarda kavga sık görülür. Kaynağın notu: Küçük gruplarda ölümler sık görülür. Kaynak: Fishkeeper.",
      params: { name: "Damsel", count: 3, groupFrom: 9, pairAccepted: true },
    });
    expect(three.status).toBe("warning");
    expect(three.score).toBeLessThanOrEqual(74);
    expect(codes(run(animal("damsel", 8)))).toContain("conspecificSmallGroup");
  });
  it("çifti kabul edilmeyen türde iki birey de küçük gruptur; metin çifti saymaz", () => {
    expect(warningOf(run(animal("groupOnly", 2)), "conspecificSmallGroup")?.message).toMatch(/^Kaynağa göre bu tür kendi türüne saldırgandır; tek ya da en az 7 bireylik bir grup olarak tutulabilir\./);
    expect(codes(run(animal("groupOnly", 7)))).not.toContain("conspecificSmallGroup");
  });
  it("iki keşiş yengeci türü 'uygun değil'; aynı türün iki bireyi uyarısız", () => {
    const mixed = run(animal("hermitBlue"), animal("hermitRed"));
    expect(warningOf(mixed, "incompatibleGroup")).toMatchObject({ level: "danger", title: "Farklı keşiş yengeci türleri bir arada", params: { group: "hermitCrab", fish: ["Mavi yengeç", "Kırmızı yengeç"] } });
    expect(mixed.status).toBe("danger");
    expect(codes(run(animal("hermitBlue", 2)))).not.toContain("incompatibleGroup");
  });
});

describe("2: tanınmayan canlı (motor bayrağı)", () => {
  it("motor puanı ve durumu değiştirmez, `incomplete` bayrağını verir; ekran puanı gizler", () => {
    const unknown: Livestock = { id: "x", aquariumId: "a", commonName: "Balon moli", category: "fish", quantity: 4, addedAt: "2026-01-01" };
    const result = analyze(tank(100), [unknown, animal("shoalA", 6)], equipped(), fresh25());
    expect(result.incomplete).toBe(true);
    expect(result.unevaluated?.[0]).toEqual({ code: "unknownAnimal", params: { name: "Balon moli", count: 4 } });
    expect(analyze(tank(100), [animal("shoalA", 6)], equipped(), fresh25()).incomplete).toBeUndefined();
  });
});
