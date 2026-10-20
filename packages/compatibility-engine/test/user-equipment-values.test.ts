import { describe, expect, it } from "vitest";
import type { Aquarium, Equipment, Livestock } from "@aquamind/domain";
import { createAnalyzer, userValueFor, userValueKindFor, userValueLimitsFor, type EquipmentProfileInput, type KnowledgeResolver, type SpeciesProfileInput } from "../src";

// Kural seti 1.8.0: katalogda doğrulanmış kapasite verisi olmayan ekipmanda kullanıcının etiketten girdiği
// debi ya da güç hesaba katılır (docs/DECISIONS/0017-elle-girilen-ekipman-degerleri.md).

const species: Record<string, SpeciesProfileInput> = {
  tropical: { id: "tropical", commonName: "Tropik tür", adultSizeCm: 4, wasteFactor: 0.5, minVolumeL: 40, minGroup: 1, temperature: [24, 28], ph: [6, 8], flow: "medium" },
};

const devices: Record<string, EquipmentProfileInput> = {
  verifiedFilter: { id: "verifiedFilter", category: "filter", brand: "Stub", model: "F400", ratedFlowLph: 400 },
  sizedFilter: { id: "sizedFilter", category: "filter", brand: "Stub", model: "F-100L", recommendedMaxL: 100 },
  // Katalogda adı var, değeri doğrulanamamış (capacityDataNote ile hesap dışı).
  namedFilter: { id: "namedFilter", category: "filter", brand: "Stub", model: "LT-300", capacityDataNote: "Debi doğrulanamadı." },
  spongeFilter: { id: "spongeFilter", category: "filter", brand: "Stub", model: "Pipo", requiresAirPump: true },
  skimmer: { id: "skimmer", category: "filter", brand: "Stub", model: "Skimmer", auxiliaryFiltration: true },
  passivePart: { id: "passivePart", category: "filter", brand: "Stub", model: "Aparat", passiveComponent: true },
  // Isıtıcısı doğrulanmış, debisi yayımlanmamış ısıtıcılı filtre: yalnız debi elle girilebilir.
  heatedFilter: { id: "heatedFilter", category: "filter", brand: "Stub", model: "Thermo", integratedHeaterW: 100 },
  verifiedHeater: { id: "verifiedHeater", category: "heater", brand: "Stub", model: "H100", powerW: 100 },
  namedHeater: { id: "namedHeater", category: "heater", brand: "Stub", model: "AL-28 50 W", capacityDataNote: "Güç doğrulanamadı." },
  namedAirPump: { id: "namedAirPump", category: "air_pump", brand: "Stub", model: "AP1302", capacityDataNote: "Hava debisi doğrulanamadı." },
  verifiedAirPump: { id: "verifiedAirPump", category: "air_pump", brand: "Stub", model: "AP-100", ratedFlowLph: 100 },
};

const resolver: KnowledgeResolver = {
  speciesForLivestock: (item) => (item.catalogId ? species[item.catalogId] : undefined),
  profileForEquipment: (item) => (item.catalogId ? devices[item.catalogId] : undefined),
  isVerifiedSpeciesProfile: (profile) => profile !== undefined,
  isVerifiedEquipmentProfile: (profile) => profile !== undefined,
};
const analyze = createAnalyzer(resolver);

const tank = (netVolumeLiters: number): Aquarium => ({ id: "a", name: "Stub", type: "freshwater", lengthCm: 80, widthCm: 35, heightCm: 40, netVolumeLiters, setupDate: "2026-01-01" });
const fish: Livestock = { id: "l-tropical", aquariumId: "a", catalogId: "tropical", commonName: "Tropik tür", category: "fish", quantity: 1, addedAt: "2026-01-01" };
const item = (category: Equipment["category"], extra: Partial<Equipment> = {}): Equipment => ({ id: `e-${extra.catalogId ?? "manual"}-${category}`, aquariumId: "a", category, installedAt: "2026-01-01", ...extra });
const run = (volume: number, equipment: Equipment[]) => analyze(tank(volume), [fish], equipment);
const metric = (result: ReturnType<typeof run>, key: string) => result.metrics.find((entry) => entry.key === key)!;
const titles = (result: ReturnType<typeof run>) => result.warnings.map((warning) => warning.title);

describe("elle girilen ekipman değeri: hangi kayıtta girilebilir", () => {
  it("katalogda olmayan filtre, hava motoru ve ısıtıcıda girilebilir", () => {
    expect(userValueKindFor("filter")).toBe("flow");
    expect(userValueKindFor("air_pump")).toBe("flow");
    expect(userValueKindFor("heater")).toBe("power");
  });

  it("kapasite hesabına girmeyen kategorilerde girilemez", () => {
    for (const category of ["lighting", "co2", "uv", "dosing_pump", "other"] as const) expect(userValueKindFor(category), category).toBeUndefined();
  });

  it("katalogda değeri eksik kayıtta girilebilir", () => {
    expect(userValueKindFor("filter", devices.namedFilter)).toBe("flow");
    expect(userValueKindFor("heater", devices.namedHeater)).toBe("power");
    expect(userValueKindFor("air_pump", devices.namedAirPump)).toBe("flow");
  });

  it("katalogda doğrulanmış değeri olan kayıtta girilemez", () => {
    expect(userValueKindFor("filter", devices.verifiedFilter)).toBeUndefined();
    expect(userValueKindFor("filter", devices.sizedFilter)).toBeUndefined();
    expect(userValueKindFor("heater", devices.verifiedHeater)).toBeUndefined();
    expect(userValueKindFor("air_pump", devices.verifiedAirPump)).toBeUndefined();
  });

  it("pasif, yardımcı ve hava motoruyla çalışan filtrede girilemez", () => {
    expect(userValueKindFor("filter", devices.passivePart)).toBeUndefined();
    expect(userValueKindFor("filter", devices.skimmer)).toBeUndefined();
    expect(userValueKindFor("filter", devices.spongeFilter)).toBeUndefined();
  });

  it("kabul edilen aralık kategoriye göre verilir", () => {
    expect(userValueLimitsFor("filter")).toEqual({ kind: "flow", min: 20, max: 20000 });
    expect(userValueLimitsFor("air_pump")).toEqual({ kind: "flow", min: 10, max: 50000 });
    expect(userValueLimitsFor("heater")).toEqual({ kind: "power", min: 5, max: 2000 });
    expect(userValueLimitsFor("lighting")).toBeUndefined();
  });

  it("aralık dışındaki, sayı olmayan ya da yanlış alandaki değer hesaba katılmaz", () => {
    expect(userValueFor(item("filter", { userRatedFlowLph: 400 }))).toEqual({ kind: "flow", value: 400 });
    expect(userValueFor(item("filter", { userRatedFlowLph: 20 }))).toEqual({ kind: "flow", value: 20 });
    expect(userValueFor(item("filter", { userRatedFlowLph: 19 }))).toBeUndefined();
    expect(userValueFor(item("filter", { userRatedFlowLph: 50000 }))).toBeUndefined();
    expect(userValueFor(item("filter", { userRatedFlowLph: Number.NaN }))).toBeUndefined();
    expect(userValueFor(item("filter", { userRatedFlowLph: 0 }))).toBeUndefined();
    expect(userValueFor(item("filter", { userPowerW: 100 }))).toBeUndefined();
    expect(userValueFor(item("heater", { userRatedFlowLph: 400 }))).toBeUndefined();
    expect(userValueFor(item("heater", { userPowerW: 100 }))).toEqual({ kind: "power", value: 100 });
    expect(userValueFor(item("heater", { userPowerW: 3000 }))).toBeUndefined();
  });
});

describe("elle girilen ekipman değeri: filtre", () => {
  it("katalogda olmayan filtre girilen debiyle, debisi doğrulanmış filtreyle aynı kuralla değerlendirilir", () => {
    for (const volume of [80, 100, 101, 200, 201]) {
      const manual = run(volume, [item("filter", { brand: "Aquawing", model: "AQ604F", userRatedFlowLph: 400 })]);
      const verified = run(volume, [item("filter", { catalogId: "verifiedFilter" })]);
      expect(metric(manual, "filter").score, `${volume} L puan`).toBe(metric(verified, "filter").score);
      expect(metric(manual, "filter").detail, `${volume} L açıklama`).toBe(metric(verified, "filter").detail);
      expect(manual.score, `${volume} L genel puan`).toBe(verified.score);
    }
  });

  it("saatte 4 çevrim uygun, 2 çevrimin altı tehlike (sınırlar dahil)", () => {
    const filter = [item("filter", { userRatedFlowLph: 400 })];
    expect(metric(run(100, filter), "filter").score).toBe(95);
    expect(metric(run(101, filter), "filter").score).toBe(60);
    expect(metric(run(200, filter), "filter").score).toBe(60);
    expect(metric(run(201, filter), "filter").score).toBe(35);
  });

  it("sonuç elle girilen değere dayandığını belirtir; doğrulanmış kayıtta işaret yoktur", () => {
    const manual = run(100, [item("filter", { userRatedFlowLph: 400 })]);
    expect(metric(manual, "filter").userProvided).toBe(true);
    // Veri güveni satırı sayıyı açıklamasında verir; ayrıca işaretlenmez.
    expect("userProvided" in metric(manual, "confidence")).toBe(false);
    expect(metric(manual, "confidence").detail).toBe("2/2 güvenlik kaydı hesaplamaya hazır · 1 kayıt senin girdiğin değerle");
    const verified = run(100, [item("filter", { catalogId: "verifiedFilter" })]);
    expect("userProvided" in metric(verified, "filter")).toBe(false);
    expect("userProvided" in metric(verified, "confidence")).toBe(false);
    expect(metric(verified, "confidence").detail).toBe("2/2 güvenlik kaydı hesaplamaya hazır");
  });

  it("değer girilince 'katalogla eşleşmeyen ekipman' uyarısı kalkar; girilmezse durur", () => {
    expect(titles(run(100, [item("filter", { brand: "Aquawing", model: "AQ604F" })]))).toContain("Katalogla eşleşmeyen ekipman kaydı var");
    expect(titles(run(100, [item("filter", { brand: "Aquawing", model: "AQ604F", userRatedFlowLph: 400 })]))).not.toContain("Katalogla eşleşmeyen ekipman kaydı var");
  });

  it("katalogda adı olup değeri eksik filtrede girilen debi kullanılır ve 'kapasite bilgisi eksik' uyarısı kalkar", () => {
    const without = run(100, [item("filter", { catalogId: "namedFilter" })]);
    expect(titles(without)).toContain("Ekipman kapasite bilgisi eksik");
    expect(metric(without, "filter").detail).toBe("Debi bilgisi doğrulanmayı bekliyor");
    const withValue = run(100, [item("filter", { catalogId: "namedFilter", userRatedFlowLph: 400 })]);
    expect(titles(withValue)).not.toContain("Ekipman kapasite bilgisi eksik");
    expect(metric(withValue, "filter").score).toBe(95);
    expect(metric(withValue, "filter").userProvided).toBe(true);
  });

  it("aynı cihaz iki kez kayıtlıysa ve yalnız birine değer girildiyse diğeri için uyarı sürer", () => {
    const pair = run(100, [item("filter", { id: "e-1", catalogId: "namedFilter", userRatedFlowLph: 400 }), item("filter", { id: "e-2", catalogId: "namedFilter" })]);
    expect(titles(pair)).toContain("Ekipman kapasite bilgisi eksik");
    expect(metric(pair, "confidence").detail).toBe("2/3 güvenlik kaydı hesaplamaya hazır · 1 kayıt senin girdiğin değerle");
    const both = run(100, [item("filter", { id: "e-1", catalogId: "namedFilter", userRatedFlowLph: 400 }), item("filter", { id: "e-2", catalogId: "namedFilter", userRatedFlowLph: 400 })]);
    expect(titles(both)).not.toContain("Ekipman kapasite bilgisi eksik");
    expect(metric(both, "confidence").detail).toBe("3/3 güvenlik kaydı hesaplamaya hazır · 2 kayıt senin girdiğin değerle");
  });

  it("katalogda doğrulanmış değer varken girilen değer yok sayılır", () => {
    const base = run(100, [item("filter", { catalogId: "verifiedFilter" })]);
    const overridden = run(100, [item("filter", { catalogId: "verifiedFilter", userRatedFlowLph: 5000 })]);
    expect(overridden).toEqual(base);
    const sized = run(100, [item("filter", { catalogId: "sizedFilter", userRatedFlowLph: 5000 })]);
    expect(sized).toEqual(run(100, [item("filter", { catalogId: "sizedFilter" })]));
  });

  it("aralık dışındaki değer hesaba katılmaz", () => {
    expect(run(100, [item("filter", { userRatedFlowLph: 50000 })])).toEqual(run(100, [item("filter")]));
  });

  it("yardımcı skimmer ve hava motorlu sünger filtre girilen debiyle ana filtre sayılmaz", () => {
    expect(run(100, [item("filter", { catalogId: "skimmer", userRatedFlowLph: 400 })])).toEqual(run(100, [item("filter", { catalogId: "skimmer" })]));
    expect(run(100, [item("filter", { catalogId: "spongeFilter", userRatedFlowLph: 400 })])).toEqual(run(100, [item("filter", { catalogId: "spongeFilter" })]));
  });

  it("doğrulanmış ve elle girilen filtre birlikteyken kapasiteler toplanır ve sonuç işaretlenir", () => {
    const mixed = run(200, [item("filter", { catalogId: "verifiedFilter" }), item("filter", { id: "e-2", userRatedFlowLph: 400 })]);
    expect(metric(mixed, "filter").score).toBe(95);
    expect(metric(mixed, "filter").userProvided).toBe(true);
    expect(metric(mixed, "confidence").detail).toBe("3/3 güvenlik kaydı hesaplamaya hazır · 1 kayıt senin girdiğin değerle");
  });
});

describe("elle girilen ekipman değeri: ısıtıcı", () => {
  it("katalogda olmayan ısıtıcı girilen güçle, gücü doğrulanmış ısıtıcıyla aynı kuralla değerlendirilir", () => {
    for (const volume of [60, 67, 100, 200, 201]) {
      const manual = run(volume, [item("filter", { catalogId: "verifiedFilter" }), item("heater", { brand: "Stub", model: "X", userPowerW: 100 })]);
      const verified = run(volume, [item("filter", { catalogId: "verifiedFilter" }), item("heater", { catalogId: "verifiedHeater" })]);
      expect(metric(manual, "heater").score, `${volume} L puan`).toBe(metric(verified, "heater").score);
      expect(metric(manual, "heater").detail, `${volume} L açıklama`).toBe(metric(verified, "heater").detail);
    }
  });

  it("sonuç elle girilen değere dayandığını belirtir", () => {
    const result = run(100, [item("heater", { userPowerW: 100 })]);
    expect(metric(result, "heater").userProvided).toBe(true);
    expect(metric(result, "heater").detail).toBe("Toplam 100 W için tahmini hacim uygun");
    expect("userProvided" in metric(result, "filter")).toBe(false);
  });

  it("ısıtıcılı filtrede yalnız debi elle girildiyse filtre işaretlenir, ısıtıcı işaretlenmez", () => {
    const result = run(100, [item("filter", { catalogId: "heatedFilter", userRatedFlowLph: 400 })]);
    expect(metric(result, "filter")).toMatchObject({ score: 95, userProvided: true });
    // Isıtıcı gücü katalogdan (doğrulanmış 100 W) gelir; elle girilen değere dayanmaz.
    expect(metric(result, "heater").detail).toBe("Toplam 100 W için tahmini hacim uygun");
    expect("userProvided" in metric(result, "heater")).toBe(false);
    expect(metric(result, "confidence").detail).toBe("2/2 güvenlik kaydı hesaplamaya hazır · 1 kayıt senin girdiğin değerle");
  });

  it("katalogda adı olup gücü eksik ısıtıcıda girilen güç kullanılır", () => {
    const without = run(100, [item("heater", { catalogId: "namedHeater" })]);
    expect(metric(without, "heater").detail).toBe("Watt veya hacim verisi doğrulanmayı bekliyor");
    const withValue = run(100, [item("heater", { catalogId: "namedHeater", userPowerW: 100 })]);
    expect(metric(withValue, "heater").score).toBe(95);
    expect(titles(withValue)).not.toContain("Ekipman kapasite bilgisi eksik");
  });
});

describe("elle girilen ekipman değeri: hava motoru", () => {
  it("sünger filtre, debisi elle girilen hava motoruyla çalışır sayılır ve sonuç işaretlenir", () => {
    const without = run(60, [item("filter", { catalogId: "spongeFilter" }), item("air_pump", { catalogId: "namedAirPump" })]);
    expect(titles(without)).toContain("Sünger filtre için hava motoru gerekli");
    const withValue = run(60, [item("filter", { catalogId: "spongeFilter" }), item("air_pump", { catalogId: "namedAirPump", userRatedFlowLph: 96 })]);
    expect(titles(withValue)).not.toContain("Sünger filtre için hava motoru gerekli");
    expect(metric(withValue, "filter").detail).toBe("Hava motorlu sünger filtre bağlantısı hazır");
    expect(metric(withValue, "filter").userProvided).toBe(true);
    const verified = run(60, [item("filter", { catalogId: "spongeFilter" }), item("air_pump", { catalogId: "verifiedAirPump" })]);
    expect(metric(withValue, "filter").score).toBe(metric(verified, "filter").score);
    expect("userProvided" in metric(verified, "filter")).toBe(false);
  });
});

describe("elle girilen ekipman değeri: eski kayıtlar", () => {
  it("elle değeri olmayan kayıtlarda çıktı alanları ve sonuç değişmez", () => {
    const result = run(100, [item("filter", { catalogId: "verifiedFilter" }), item("heater", { catalogId: "verifiedHeater" })]);
    expect(result.metrics.some((entry) => "userProvided" in entry)).toBe(false);
    expect(Object.keys(metric(result, "filter")).sort()).toEqual(["detail", "detailCode", "detailParams", "key", "label", "score", "status"]);
  });
});
