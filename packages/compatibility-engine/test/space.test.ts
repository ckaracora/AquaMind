import { describe, expect, it } from "vitest";
import type { Aquarium, Livestock } from "@aquamind/domain";
import { createAnalyzer, type KnowledgeResolver, type SpeciesProfileInput } from "../src";

// Kural seti 1.6.0: alan uyarısının şiddeti (docs/DECISIONS/0012-alan-uyarisinin-siddeti.md).
// Kaynağın önerisinin altı uyarı; aynı zamanda İsviçre Hayvan Koruma Yönetmeliği'nin balık boyuna göre ölçü
// sınırının (uzunluk 3×, genişlik 2×, derinlik 1×) altıysa tehlike. Eşikler stub kayıtlarla sınırlarından sınanır.

const base = { minGroup: 1, temperature: [22, 28] as [number, number], ph: [6, 8] as [number, number], flow: "medium" as const, wasteFactor: 0.5 };
const species: Record<string, SpeciesProfileInput> = {
  // 20 cm balık: İsviçre sınırı 60 × 40 × 20 cm. Kaynak 200 L ve 100 cm istiyor.
  cichlid: { id: "cichlid", commonName: "Stub çiklit", adultSizeCm: 20, minVolumeL: 200, minTankLengthCm: 100, ...base },
  // Yılan balığı gibi uzun tür: kaynağın uzunluğu (100 cm) İsviçre sınırından (3 × 50 = 150 cm) küçük.
  eel: { id: "eel", commonName: "Stub yılan balığı", adultSizeCm: 50, minVolumeL: 300, minTankLengthCm: 100, ...base },
  // Kaynak tank uzunluğu yayımlamıyor.
  noLength: { id: "noLength", commonName: "Uzunluksuz tür", adultSizeCm: 20, minVolumeL: 200, ...base },
  // Omurgasız: yönetmelik süs balıklarını kapsar.
  crayfish: { id: "crayfish", commonName: "Stub kerevit", adultSizeCm: 20, minVolumeL: 200, minTankLengthCm: 100, ...base },
  small: { id: "small", commonName: "Küçük tür", adultSizeCm: 3, minVolumeL: 20, minTankLengthCm: 40, ...base },
};

const resolver: KnowledgeResolver = {
  speciesForLivestock: (item) => (item.catalogId ? species[item.catalogId] : undefined),
  profileForEquipment: () => undefined,
  isVerifiedSpeciesProfile: (profile) => profile !== undefined,
  isVerifiedEquipmentProfile: () => false,
};
const analyze = createAnalyzer(resolver);

const tank = (lengthCm: number, widthCm: number, heightCm: number, netVolumeLiters: number): Aquarium => ({ id: "a", name: "Stub", type: "freshwater", lengthCm, widthCm, heightCm, netVolumeLiters, setupDate: "2026-01-01" });
const animal = (catalogId: string, category: Livestock["category"] = "fish"): Livestock => ({ id: `l-${catalogId}`, aquariumId: "a", catalogId, commonName: species[catalogId].commonName, category, quantity: 1, addedAt: "2026-01-01" });
const spaceWarnings = (result: ReturnType<typeof analyze>) => result.warnings.filter((warning) => /: (alan sınırda|akvaryum çok küçük)$/.test(warning.title));
const metric = (result: ReturnType<typeof analyze>, key: string) => result.metrics.find((item) => item.key === key)!;

describe("alan: kaynağın önerisi esas alınır", () => {
  it("kaynağın önerisini karşılayan akvaryum alan uyarısı almaz", () => {
    expect(spaceWarnings(analyze(tank(100, 50, 50, 200), [animal("cichlid")], []))).toEqual([]);
  });

  it("kaynak altı ama İsviçre sınırı üstü uyarıdır (sarı)", () => {
    // 80 × 40 × 40 cm, 150 L: kaynak altı; uzunluk 80 ≥ 60, genişlik 40 ≥ 40, derinlik 40 ≥ 20.
    const result = analyze(tank(80, 40, 40, 150), [animal("cichlid")], []);
    expect(spaceWarnings(result).map((warning) => [warning.level, warning.title])).toEqual([["warning", "Stub çiklit: alan sınırda"]]);
    expect(result.warnings.some((warning) => warning.level === "danger")).toBe(false);
  });

  it("kaynağın uzunluğu İsviçre sınırından küçükse kaynağa uyan akvaryum yine uyarı almaz", () => {
    // Yılan balığı: 100 cm kaynak uzunluğu ve 300 L karşılanıyor; 100 < 150 olsa da tehlike yok.
    expect(spaceWarnings(analyze(tank(100, 100, 50, 300), [animal("eel")], []))).toEqual([]);
  });
});

describe("alan: kaynak ve İsviçre sınırının altı tehlikedir", () => {
  it("uzunluk 3 × yetişkin boyun altındaysa tehlike (sınırda tam 3 × uyarı)", () => {
    const danger = spaceWarnings(analyze(tank(59, 40, 40, 150), [animal("cichlid")], []));
    expect(danger.map((warning) => [warning.level, warning.title])).toEqual([["danger", "Stub çiklit: akvaryum çok küçük"]]);
    expect(danger[0].message).toContain("Kayıtlı adet için minimum 200 L ve 100 cm uzunluk referansı kullanıldı.");
    expect(danger[0].message).toContain("İsviçre Hayvan Koruma Yönetmeliği'nin ölçü kuralından (uzunluk 3×, genişlik 2×, su derinliği 1× vücut boyu) uyarlanan AquaMind sınırının altında");
    expect(danger[0].message).toContain("katalogdaki 20 cm yetişkin boyu (çoğu türde toplam boy) kullanır: uzunluk en az 60 cm, genişlik en az 40 cm, su derinliği en az 20 cm");
    expect(spaceWarnings(analyze(tank(60, 40, 40, 150), [animal("cichlid")], []))[0].level).toBe("warning");
  });

  it("genişlik 2 × ya da derinlik 1 × yetişkin boyun altındaysa da tehlike", () => {
    expect(spaceWarnings(analyze(tank(80, 39, 40, 150), [animal("cichlid")], []))[0].level).toBe("danger");
    expect(spaceWarnings(analyze(tank(80, 40, 19, 150), [animal("cichlid")], []))[0].level).toBe("danger");
  });

  it("kaynak tank uzunluğu yayımlamasa da hacim altındaki akvaryumda İsviçre sınırı uygulanır", () => {
    const [warning] = spaceWarnings(analyze(tank(50, 40, 40, 100), [animal("noLength")], []));
    expect([warning.level, warning.title]).toEqual(["danger", "Uzunluksuz tür: akvaryum çok küçük"]);
    expect(warning.message).toContain("kaynak tank uzunluğu yayımlamıyor");
  });

  it("balık olmayan canlıda tehlikeye çıkmaz", () => {
    expect(spaceWarnings(analyze(tank(30, 20, 20, 30), [animal("crayfish", "other")], []))[0].level).toBe("warning");
  });

  it("girilmemiş (0) ölçü denetlenmez", () => {
    expect(spaceWarnings(analyze(tank(80, 0, 0, 150), [animal("cichlid")], []))[0].level).toBe("warning");
  });

  it("yüzme alanı ölçütü tehlikeye iner; genel durum en fazla dikkat olur, tehlikeye çekilmez", () => {
    const result = analyze(tank(59, 40, 40, 150), [animal("cichlid"), animal("small")], []);
    expect(metric(result, "space")).toMatchObject({ score: 35, status: "danger", detail: "1 tür için akvaryum çok küçük" });
    expect(result.score).toBeLessThanOrEqual(74);
    expect(result.score).toBeGreaterThan(49);
    expect(result.status).toBe("warning");
  });
});
