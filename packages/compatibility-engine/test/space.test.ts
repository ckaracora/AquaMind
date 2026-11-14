import { describe, expect, it } from "vitest";
import type { Aquarium, Livestock } from "@aquamind/domain";
import { createAnalyzer, type KnowledgeResolver, type SpeciesProfileInput } from "../src";

// Kural seti 1.6.0: alan uyarısının şiddeti (docs/DECISIONS/0012-alan-uyarisinin-siddeti.md).
// Kaynağın önerisinin altı uyarı; aynı zamanda İsviçre Hayvan Koruma Yönetmeliği'nin balık boyuna göre ölçü
// sınırının (uzunluk 3×, derinlik 1×) altıysa tehlike. Kural seti 1.11.0 (motor 1.14.0, docs/DECISIONS/0037-genel-durum-ve-uyari-duzeltmeleri.md):
// yalnız genişliği (2×) yetmeyen balık sarı "akvaryum bu tür için dar" uyarısı alır. Eşikler stub kayıtlarla sınırlarından sınanır.

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
const spaceWarnings = (result: ReturnType<typeof analyze>) => result.warnings.filter((warning) => /: (alan sınırda|akvaryum çok küçük|akvaryum bu tür için dar)$/.test(warning.title));
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
    expect(danger[0].message).toContain("İsviçre Hayvan Koruma Yönetmeliği'nin ölçü kuralındaki uzunluk (3×) ve su derinliği (1× vücut boyu) sınırlarından uyarlanan AquaMind sınırının altında");
    expect(danger[0].message).toContain("katalogdaki 20 cm yetişkin boyu (çoğu türde toplam boy) kullanır: uzunluk en az 60 cm, su derinliği en az 20 cm.");
    expect(danger[0].message).not.toContain("genişlik");
    expect(spaceWarnings(analyze(tank(60, 40, 40, 150), [animal("cichlid")], []))[0].level).toBe("warning");
  });

  it("derinlik 1 × yetişkin boyun altındaysa da tehlike", () => {
    expect(spaceWarnings(analyze(tank(80, 40, 19, 150), [animal("cichlid")], []))[0].level).toBe("danger");
    // Genişlik de yetmese tür için tek alan uyarısı çıkar: kırmızı olan.
    expect(spaceWarnings(analyze(tank(80, 39, 19, 150), [animal("cichlid")], [])).map((warning) => [warning.level, warning.code])).toEqual([["danger", "spaceSevere"]]);
  });

  it("1.14.0: yalnız genişlik 2 × yetişkin boyun altındaysa sarı \"akvaryum bu tür için dar\" (sınırda tam 2 × alan sınırda)", () => {
    const result = analyze(tank(80, 39, 40, 150), [animal("cichlid")], []);
    const [narrow] = spaceWarnings(result);
    expect([narrow.level, narrow.code, narrow.title]).toEqual(["warning", "spaceNarrow", "Stub çiklit: akvaryum bu tür için dar"]);
    expect(narrow.message).toBe(
      "Kayıtlı adet için minimum 200 L ve 100 cm uzunluk referansı kullanıldı. Akvaryumun genişliği (39 cm), katalogdaki 20 cm yetişkin boyun iki katından az. AquaMind bu öneriyi İsviçre Hayvan Koruma Yönetmeliği'nin ölçü kuralından (genişlik 2× vücut boyu) uyarlar; yönetmelik kuyruk yüzgeci hariç boyu, AquaMind çoğu türde toplam boyu kullanır. Genişliği en az 40 cm olan bir akvaryum daha uygundur.",
    );
    expect(narrow.params).toEqual({ name: "Stub çiklit", volume: 200, hasLength: true, length: 100, size: 20, width: 39, minWidth: 40 });
    expect(spaceWarnings(result)).toHaveLength(1);
    expect(result.warnings.some((warning) => warning.level === "danger")).toBe(false);
    // Tek türde sarı alan uyarısı ölçütü tehlikeye düşürmez (taban 60, karar 0037).
    expect(metric(result, "space")).toMatchObject({ score: 60, status: "warning", detailCode: "spaceLimited" });
    expect(spaceWarnings(analyze(tank(80, 40, 40, 150), [animal("cichlid")], [])).map((warning) => warning.code)).toEqual(["spaceLimited"]);
    // Balık olmayan canlıda genişlik uyarısı da çıkmaz.
    expect(spaceWarnings(analyze(tank(80, 39, 40, 150), [animal("crayfish", "other")], [])).map((warning) => warning.code)).toEqual(["spaceLimited"]);
  });

  it("kaynak tank uzunluğu yayımlamasa da hacim altındaki akvaryumda İsviçre sınırı uygulanır", () => {
    const [warning] = spaceWarnings(analyze(tank(50, 40, 40, 100), [animal("noLength")], []));
    expect([warning.level, warning.title]).toEqual(["danger", "Uzunluksuz tür: akvaryum çok küçük"]);
    expect(warning.message).toContain("kaynak tank uzunluğu yayımlamıyor");
  });

  // 1.18.0 (karar 0043): hacim gerekenin yarısından küçükse her kategoride kesin tehlike; bu yüzden hacim yarının üstünde tutulur.
  it("balık olmayan canlıda İsviçre ölçü kuralıyla tehlikeye çıkmaz", () => {
    expect(spaceWarnings(analyze(tank(30, 20, 20, 150), [animal("crayfish", "other")], []))[0].level).toBe("warning");
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
