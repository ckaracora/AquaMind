import { describe, expect, it } from "vitest";
import type { Aquarium, Equipment, Livestock } from "@aquamind/domain";
import { createAnalyzer, type EquipmentProfileInput, type KnowledgeResolver, type SpeciesProfileInput } from "../src";

// Kural seti 1.3.0: filtre yeterliliği, tahmini biyolojik yük ve tehlike uyarısının genel duruma etkisi
// (docs/DECISIONS/0009-filtre-yuk-ve-genel-durum.md). Eşikler stub kayıtlarla sınırlarından sınanır.

const base = { minVolumeL: 10, minGroup: 1, temperature: [22, 28] as [number, number], ph: [6, 8] as [number, number], flow: "medium" as const };
const species: Record<string, SpeciesProfileInput> = {
  calm: { id: "calm", commonName: "Sakin tür", adultSizeCm: 3, wasteFactor: 0.5, ...base },
  // 100 L'de (etkin 85 L) 21 birey yük oranı ≈ 2,47; 22 birey ≈ 2,59.
  blob: { id: "blob", commonName: "Yük türü", adultSizeCm: 10, wasteFactor: 1, ...base },
};

const devices: Record<string, EquipmentProfileInput> = {
  cap100: { id: "cap100", category: "filter", brand: "Stub", model: "C100", ratedFlowLph: 400, recommendedMaxL: 100 },
  cap60: { id: "cap60", category: "filter", brand: "Stub", model: "C60", ratedFlowLph: 240, recommendedMaxL: 60 },
  flowOnly: { id: "flowOnly", category: "filter", brand: "Stub", model: "F400", ratedFlowLph: 400 },
  capOnly: { id: "capOnly", category: "filter", brand: "Stub", model: "V100", recommendedMaxL: 100 },
  sponge: { id: "sponge", category: "filter", brand: "Stub", model: "S100", requiresAirPump: true, recommendedMaxL: 100 },
  airPump: { id: "airPump", category: "air_pump", brand: "Stub", model: "A100", ratedFlowLph: 100 },
  heater: { id: "heater", category: "heater", brand: "Stub", model: "H100", powerW: 100, recommendedMinL: 50, recommendedMaxL: 250 },
};

const resolver: KnowledgeResolver = {
  speciesForLivestock: (item) => (item.catalogId ? species[item.catalogId] : undefined),
  profileForEquipment: (item) => (item.catalogId ? devices[item.catalogId] : undefined),
  isVerifiedSpeciesProfile: (profile) => profile !== undefined,
  isVerifiedEquipmentProfile: (profile) => profile !== undefined,
};
const analyze = createAnalyzer(resolver);

const tank = (netVolumeLiters: number): Aquarium => ({ id: "a", name: "Stub", type: "freshwater", lengthCm: 100, widthCm: 40, heightCm: 50, netVolumeLiters, setupDate: "2026-01-01" });
const animal = (catalogId: string, quantity: number): Livestock => ({ id: `l-${catalogId}`, aquariumId: "a", catalogId, commonName: species[catalogId].commonName, category: "fish", quantity, addedAt: "2026-01-01" });
const device = (catalogId: string): Equipment => ({ id: `e-${catalogId}`, aquariumId: "a", catalogId, category: devices[catalogId].category, installedAt: "2026-01-01" });
const run = (volume: number, animals: Livestock[], ids: string[]) => analyze(tank(volume), animals, ids.map(device));
const filterWarnings = (result: ReturnType<typeof analyze>) => result.warnings.filter((warning) => /^Filtre (bu|üretici|debisi|kapasitesi)/.test(warning.title));
const metric = (result: ReturnType<typeof analyze>, key: string) => result.metrics.find((item) => item.key === key)!;

describe("filtre: üretici hacim önerisi esas alınır", () => {
  it("akvaryum önerilen hacmin içindeyse uygun", () => {
    const result = run(100, [animal("calm", 5)], ["cap100", "heater"]);
    expect(filterWarnings(result)).toEqual([]);
    expect(metric(result, "filter")).toMatchObject({ score: 95, status: "good", detail: "Üretici önerisi en fazla 100 L" });
  });

  it("%50'ye kadar aşım uyarı, fazlası tehlike", () => {
    const over = run(150, [animal("calm", 5)], ["cap100", "heater"]);
    expect(filterWarnings(over).map((warning) => [warning.level, warning.title])).toEqual([["warning", "Filtre üretici önerisinin üstünde"]]);
    expect(metric(over, "filter").status).toBe("warning");

    const far = run(151, [animal("calm", 5)], ["cap100", "heater"]);
    expect(filterWarnings(far).map((warning) => [warning.level, warning.title])).toEqual([["danger", "Filtre bu akvaryum için küçük"]]);
    expect(filterWarnings(far)[0].message).toContain("(151 L)");
    expect(metric(far, "filter").status).toBe("danger");
  });

  it("birden fazla filtrenin önerilen hacimleri toplanır", () => {
    const result = run(160, [animal("calm", 5)], ["cap100", "cap60", "heater"]);
    expect(filterWarnings(result)).toEqual([]);
    expect(metric(result, "filter").detail).toBe("Üretici önerisi en fazla 160 L");
  });

  it("hava motoru olmayan sünger filtre hesaba girmez; hava motoruyla önerilen hacmi kullanılır", () => {
    const withoutPump = run(100, [animal("calm", 5)], ["sponge", "heater"]);
    expect(metric(withoutPump, "filter")).toMatchObject({ score: 45, status: "danger" });
    expect(withoutPump.warnings.map((warning) => warning.title)).toContain("Sünger filtre için hava motoru gerekli");

    const withPump = run(100, [animal("calm", 5)], ["sponge", "airPump", "heater"]);
    expect(metric(withPump, "filter")).toMatchObject({ score: 95, status: "good", detail: "Üretici önerisi en fazla 100 L" });
  });
});

describe("filtre: hacim önerisi yoksa etiket debisi", () => {
  it("saatte 4 çevrim ve üstü uygun, 2–4 uyarı, 2'nin altı tehlike", () => {
    expect(filterWarnings(run(100, [animal("calm", 5)], ["flowOnly", "heater"]))).toEqual([]);
    expect(metric(run(100, [animal("calm", 5)], ["flowOnly", "heater"]), "filter").detail).toBe("Etiket debisiyle 4,0 çevrim/saat");

    const low = filterWarnings(run(200, [animal("calm", 5)], ["flowOnly", "heater"]));
    expect(low.map((warning) => [warning.level, warning.title])).toEqual([["warning", "Filtre debisi düşük olabilir"]]);

    const tooLow = filterWarnings(run(201, [animal("calm", 5)], ["flowOnly", "heater"]));
    expect(tooLow.map((warning) => [warning.level, warning.title])).toEqual([["danger", "Filtre debisi yetersiz"]]);
  });

  it("hacim önerisi olup debisi olmayan filtre hesaba hazır sayılır", () => {
    const result = run(100, [animal("calm", 5)], ["capOnly", "heater"]);
    expect(filterWarnings(result)).toEqual([]);
    expect(metric(result, "filter")).toMatchObject({ score: 95, detail: "Üretici önerisi en fazla 100 L" });
    expect(metric(result, "confidence").score).toBe(100);
    expect(result.warnings.map((warning) => warning.title)).not.toContain("Ekipman kapasite bilgisi eksik");
  });

  it("karışık sette her filtrenin karşıladığı hacim toplanır: öneri ya da etiket debisinin saatte 4 çevrimi", () => {
    // capOnly: uygun 100 L, sınır 150 L. flowOnly (400 L/saat): uygun 100 L, sınır 200 L. Toplam: uygun 200 L, sınır 350 L.
    const fits = run(200, [animal("calm", 5)], ["capOnly", "flowOnly", "heater"]);
    expect(filterWarnings(fits)).toEqual([]);
    expect(metric(fits, "filter").detail).toBe("Üretici önerisi ve etiket debisine göre en fazla 200 L");

    const over = filterWarnings(run(201, [animal("calm", 5)], ["capOnly", "flowOnly", "heater"]));
    expect(over.map((warning) => [warning.level, warning.title])).toEqual([["warning", "Filtre kapasitesi düşük olabilir"]]);

    const far = filterWarnings(run(351, [animal("calm", 5)], ["capOnly", "flowOnly", "heater"]));
    expect(far.map((warning) => [warning.level, warning.title])).toEqual([["danger", "Filtre bu akvaryum için küçük"]]);
    expect(far[0].message).toContain("(350 L)");
  });
});

describe("tahmini biyolojik yük", () => {
  it("eşiğin altında uyarı vermez; üstünde yalnızca uyarı verir, hiçbir zaman tehlike vermez", () => {
    const below = run(100, [animal("blob", 21)], ["cap100", "heater"]);
    expect(below.warnings.map((warning) => warning.title)).not.toContain("Biyolojik yük yüksek olabilir");
    expect(metric(below, "load").status).toBe("good");

    for (const quantity of [22, 200]) {
      const above = run(100, [animal("blob", quantity)], ["cap100", "heater"]);
      expect(above.warnings.find((warning) => warning.title === "Biyolojik yük yüksek olabilir")?.level).toBe("warning");
      expect(metric(above, "load")).toMatchObject({ score: 60, status: "warning" });
    }
  });

  it("yüksek yük filtre hedefini yükseltmez", () => {
    const result = run(100, [animal("blob", 30)], ["cap100", "heater"]);
    expect(filterWarnings(result)).toEqual([]);
  });
});

describe("genel durum", () => {
  it("kesin olmayan bir tehlike uyarısı varken genel durum en fazla 'dikkat' olur", () => {
    const result = run(151, [animal("calm", 5)], ["cap100", "heater"]);
    expect(result.score).toBeLessThanOrEqual(74);
    expect(result.status).toBe("warning");
  });

  it("tehlike uyarısı yoksa genel puan ortalamadır", () => {
    const result = run(100, [animal("calm", 5)], ["cap100", "heater"]);
    const average = Math.round(result.metrics.reduce((sum, item) => sum + item.score, 0) / result.metrics.length);
    expect(result.score).toBe(average);
    expect(result.status).toBe("good");
  });
});
