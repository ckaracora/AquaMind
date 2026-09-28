import { describe, expect, it } from "vitest";
import type { Aquarium, AquariumType, Equipment, Livestock, WaterParameters } from "@aquamind/domain";
import { equipmentById, speciesById } from "@/data/catalog";
import { analyzeAquarium } from "@/lib/health-analysis";

// 2026-09-24 uyumluluk denetimindeki, akvaryumculukta cevabı bilinen senaryolar.
// Düzeltilenler gerçek test olarak sabitlenir; henüz düzeltilmeyenler `it.todo` ile görünür kalır.

const tank = (lengthCm: number, netVolumeLiters: number, type: AquariumType = "freshwater"): Aquarium => ({
  id: "t", name: "T", type, lengthCm, widthCm: 40, heightCm: 40, netVolumeLiters, setupDate: "2026-01-01",
});
const fish = (id: string, quantity: number): Livestock => {
  const profile = speciesById(id);
  if (!profile) throw new Error(`Katalogda yok: ${id}`);
  return { id: `${id}-${quantity}`, aquariumId: "t", catalogId: id, commonName: profile.commonName, scientificName: profile.scientificName, category: profile.category, quantity, addedAt: "2026-01-01" };
};
const device = (id: string): Equipment => {
  const profile = equipmentById(id);
  if (!profile) throw new Error(`Katalogda yok: ${id}`);
  return { id, aquariumId: "t", catalogId: id, category: profile.category, brand: profile.brand, model: profile.model, installedAt: "2026-01-01" };
};
const water = (values: Partial<WaterParameters> = {}): WaterParameters => ({
  id: "w", aquariumId: "t", measuredAt: "2026-09-20", temperature: 25, ph: 7, ammonia: 0, nitrite: 0, nitrate: 10, ...values,
});
const community = () => [fish("neon-tetra", 12), fish("corydoras-panda", 6), fish("ancistrus", 1)];
const communityDevices = () => [device("jbl-cristalprofi-i100"), device("eheim-thermo-100")];
const titles = (result: ReturnType<typeof analyzeAquarium>) => result.warnings.map((warning) => warning.title);

describe("denetim senaryoları: kesin tehlike genel durumu belirler", () => {
  it("tuzlu su akvaryumundaki neon tetra genel durumu tehlikeye çeker", () => {
    const result = analyzeAquarium(tank(80, 100, "saltwater"), [fish("neon-tetra", 12)], communityDevices(), water({ ph: 8.2 }));
    expect(result.status).toBe("danger");
    expect(result.score).toBeLessThan(50);
  });

  it("sıcaklık ihtiyaçları kesişmeyen diskus ve neon genel durumu tehlikeye çeker", () => {
    const result = analyzeAquarium(tank(120, 300), [fish("discus", 6), fish("neon-tetra", 15)], [device("jbl-e1502"), device("eheim-thermo-200")], water({ temperature: 28 }));
    expect(result.status).toBe("danger");
  });

  it("60 L'de astronot ve neon (avlanma) genel durumu tehlikeye çeker", () => {
    const result = analyzeAquarium(tank(60, 60), [fish("oscar", 1), fish("neon-tetra", 10)], [device("jbl-cristalprofi-i80"), device("eheim-thermo-50")], water());
    expect(result.status).toBe("danger");
    expect(titles(result)).toContain("Neon tetra için avlanma riski");
  });

  it("tahmine dayalı yük ve filtre uyarıları tek başına genel durumu tehlikeye çekmez", () => {
    const result = analyzeAquarium(tank(80, 100), community(), communityDevices(), water());
    expect(result.status).not.toBe("danger");
  });
});

describe("denetim senaryoları: su kalitesi", () => {
  it("1 ppm nitrit tehlikedir ve genel durumu tehlikeye çeker", () => {
    const result = analyzeAquarium(tank(80, 100), community(), communityDevices(), water({ ammonia: 2, nitrite: 1 }));
    expect(result.status).toBe("danger");
    expect(titles(result)).toContain("Nitrit sınırın üzerinde");
    expect(titles(result)).toContain("Amonyak ölçüldü");
    expect(result.metrics.find((metric) => metric.key === "water")!.score).toBeLessThan(100);
  });

  it("pH 8'de 1 ppm amonyak zehirli sınırı aşar", () => {
    const result = analyzeAquarium(tank(80, 100), community(), communityDevices(), water({ ammonia: 1, ph: 8, temperature: 26 }));
    expect(result.status).toBe("danger");
    expect(titles(result)).toContain("Zehirli amonyak sınırın üzerinde");
  });

  it("temiz su uyarı üretmez", () => {
    const result = analyzeAquarium(tank(80, 100), community(), communityDevices(), water());
    expect(titles(result).some((title) => /amonyak|nitrit|nitrat|geçersiz/i.test(title))).toBe(false);
  });

  it("negatif ölçüm 'uygun' sayılmaz: su puanına girmez ve geçersiz ölçüm uyarısı verir", () => {
    const waterScore = (result: ReturnType<typeof analyzeAquarium>) => result.metrics.find((metric) => metric.key === "water")!.score;
    const negative = analyzeAquarium(tank(80, 100), community(), communityDevices(), water({ ammonia: -1, nitrite: -1 }));
    const unmeasured = analyzeAquarium(tank(80, 100), community(), communityDevices(), water({ ammonia: undefined, nitrite: undefined }));
    expect(waterScore(negative)).toBe(waterScore(unmeasured));
    const warning = negative.warnings.find((item) => item.title === "Geçersiz su ölçümü");
    expect(warning?.level).toBe("warning");
    expect(warning?.message).toContain("amonyak ve nitrit değerleri geçersiz (negatif ya da geçerli bir sayı değil)");
  });

  it("sonsuz ölçüm de 'uygun' sayılmaz ve aynı uyarıyı verir", () => {
    const waterScore = (result: ReturnType<typeof analyzeAquarium>) => result.metrics.find((metric) => metric.key === "water")!.score;
    const infinite = analyzeAquarium(tank(80, 100), community(), communityDevices(), water({ nitrate: Infinity }));
    const unmeasured = analyzeAquarium(tank(80, 100), community(), communityDevices(), water({ nitrate: undefined }));
    expect(waterScore(infinite)).toBe(waterScore(unmeasured));
    expect(infinite.status).not.toBe("danger");
    expect(infinite.warnings.find((item) => item.title === "Geçersiz su ölçümü")?.message).toBe(
      "Son ölçümdeki nitrat değeri geçersiz (negatif ya da geçerli bir sayı değil); bu değer değerlendirmeye alınmadı. Yeniden ölçüp kaydedin.",
    );
  });

  it("pH yalnızca eksikse amonyak mesajı 'pH ve sıcaklık ölçülmedi' demez", () => {
    const result = analyzeAquarium(tank(80, 100), community(), communityDevices(), water({ ammonia: 0.5, ph: undefined }));
    const warning = result.warnings.find((item) => item.title === "Amonyak zehirli olabilir");
    expect(warning?.message).toContain("pH veya sıcaklık ölçümü eksik ya da geçersiz");
  });
});

describe("denetim senaryoları: filtre ve biyolojik yük", () => {
  const filterOrLoad = (result: ReturnType<typeof analyzeAquarium>) =>
    result.warnings.filter((warning) => /^Filtre (bu|üretici|debisi|kapasitesi)|Biyolojik yük/.test(warning.title));

  it("100 L'de 12 neon, 6 corydoras ve 1 vatoz yük veya filtre uyarısı almaz", () => {
    const result = analyzeAquarium(tank(80, 100), community(), communityDevices(), water());
    expect(filterOrLoad(result)).toEqual([]);
    expect(result.metrics.find((metric) => metric.key === "load")!.status).toBe("good");
    expect(result.status).toBe("good");
  });

  it("Eheim Classic 250, üreticinin 250 L sınırı içinde (200 L) filtre uyarısı almaz", () => {
    const result = analyzeAquarium(tank(100, 200), [fish("neon-tetra", 20), fish("corydoras-panda", 8), fish("ancistrus", 1)], [device("eheim-classic-250"), device("eheim-thermo-150")], water());
    expect(filterOrLoad(result)).toEqual([]);
    expect(result.metrics.find((metric) => metric.key === "filter")!.status).toBe("good");
  });

  it("200 L'de en fazla 80 L'lik JBL i60 tehlikedir ve genel durum 'iyi' görünmez", () => {
    const result = analyzeAquarium(tank(100, 200), [fish("neon-tetra", 20), fish("corydoras-panda", 8), fish("ancistrus", 1)], [device("jbl-cristalprofi-i60"), device("eheim-thermo-150")], water());
    expect(filterOrLoad(result).map((warning) => [warning.level, warning.title])).toEqual([["danger", "Filtre bu akvaryum için küçük"]]);
    expect(result.status).toBe("warning");
  });

  it("100 L'de 60 neon, 30 corydoras ve 5 vatoz yalnızca sarı yük uyarısı alır", () => {
    const result = analyzeAquarium(tank(80, 100), [fish("neon-tetra", 60), fish("corydoras-panda", 30), fish("ancistrus", 5)], communityDevices(), water());
    expect(filterOrLoad(result).map((warning) => [warning.level, warning.title])).toEqual([["warning", "Biyolojik yük yüksek olabilir"]]);
  });
});

describe("denetim senaryoları: henüz düzeltilmeyenler", () => {
  it.todo("Japon balığı ile neon tetra için küçük balık avlama uyarısı çıkmalı (davranış işareti)");
  it.todo("Melek balığı ile neon tetra için küçük balık avlama uyarısı çıkmalı (davranış işareti)");
  it.todo("Sumatra barb için yüzgeç ısırma uyarısı çıkmalı (davranış işareti)");
  it.todo("İki beta için 'erkekse birlikte tutulmamalı' uyarısı çıkmalı (aynı tür içi kural)");
  it.todo("Cüce gurami ile kiraz karides için karides avlama uyarısı çıkmalı (davranış işareti)");
  it.todo("Alan uyarısının şiddeti hacim açığıyla artmalı: 60 L'deki astronot (katalogda en az 300 L) yalnızca 'alan sınırda' uyarısı almamalı (alan kuralı)");
});
