// Dil altyapısı 3 ve 3b (karar 0021): dil dosyasının motor kodlarından kurduğu Türkçe metnin sözcükleri motorun kendi Türkçe metniyle
// birebir aynı olmalıdır; dil dosyasının yazdığı her sayı biçimleyiciden geçer ve değeri motorun metnindeki sayıyla aynıdır. Veri:
// altın fikstürün 1.033 vakası ve fikstürde geçmeyen kodları tetikleyen küçük senaryolar. Ayrıca motor kaynağındaki her kodun dil
// dosyasında karşılığı olduğu, dil dosyasında kullanılmayan kod kalmadığı ve her kodun en az bir kez sınandığı denetlenir. 3b'nin sayı
// ve birim yazımı (dilin ayırıcıları, galon tercihi) örnek cümlelerle ayrıca sınanır.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { Aquarium, Equipment, Livestock, WaterParameters } from "@aquamind/domain";
import { createAnalyzer, MARINE_NITRATE_LIMIT, MARINE_SPECIFIC_GRAVITY_SAFE, NITRATE_ABOVE_TAP_LIMIT, TAP_WATER_NITRATE_LIMIT, type EquipmentProfileInput, type HealthAnalysis, type KnowledgeResolver, type SpeciesProfileInput } from "@aquamind/compatibility-engine";
import { createDisplayFormat, type VolumeUnit } from "@aquamind/localization";
import { engineMessagesFor, engineTextFormat, type EngineTextFormat, type EngineTextParams } from "@aquamind/localization/engine";
import { catalogTranslator } from "@aquamind/localization/catalog";
import { SPECIES_CATALOG_LIST_PARAMS, SPECIES_CATALOG_PARAMS, engineMetricText, engineWarningText, translateCatalogParams } from "@/lib/engine-text";
import { MARINE_NITRATE_LIMIT_PPM, MARINE_SPECIFIC_GRAVITY_SAFE_MAX, MARINE_SPECIFIC_GRAVITY_SAFE_MIN, NITRATE_ABOVE_TAP_LIMIT_PPM, TAP_WATER_NITRATE_LIMIT_PPM } from "../../../packages/localization/src/messages/tr-engine";

const tr = engineMessagesFor("tr");
const formatFor = (volume: VolumeUnit) => engineTextFormat(createDisplayFormat("tr", { temperature: "celsius", volume, dateFormat: "day-first" }));
const liters = formatFor("liters");
const gallons = formatFor("gallons");
const engineSource = readFileSync(fileURLToPath(new URL("../../../packages/compatibility-engine/src/index.ts", import.meta.url)), "utf8");
const fixture = JSON.parse(readFileSync(fileURLToPath(new URL("../../../packages/compatibility-engine/test/fixtures/golden-v1.json", import.meta.url)), "utf8")) as Array<{ name: string; result: HealthAnalysis }>;

/** Motor kaynağındaki uyarı kodları: `code:` ifadesindeki tırnaklı adlar (koşullu kodlar dahil; karşılaştırılan değerler, ör. `==="saltwater"`, sayılmaz). */
const sourceWarningCodes = new Set([...engineSource.matchAll(/[{,]code:([^,]+?),params:/g)].flatMap((match) => [...match[1].matchAll(/(?<!=)"([A-Za-z]+)"/g)].map((name) => name[1])));
/** Motor kaynağındaki ölçüt açıklama kodları: `detailCode:` ifadeleri ve açıklama seçen dizilerin ilk öğeleri. */
const sourceDetailCodes = new Set([
  ...[...engineSource.matchAll(/detailCode:([^,]+?),detailParams:/g)].flatMap((match) => [...match[1].matchAll(/"([A-Za-z]+)"/g)].map((name) => name[1])),
  ...[...engineSource.matchAll(/const (?:compatibilityDetail|filterDetail|heaterDetail):[^=]+=(.+);/g)].flatMap((match) => [...match[1].matchAll(/\["([A-Za-z]+)",/g)].map((name) => name[1])),
]);

const seenWarningCodes = new Set<string>();
const seenDetailCodes = new Set<string>();

/**
 * Sınama biçimleyicisi: dil dosyasının biçimlediği her sayıyı değeri ve iki yuvarlama payıyla işaretler ("⟦13.04~0.05~0.05⟧"). İlk pay
 * motorun yazımı içindir (hacim ve adet motorda yuvarlanmadan yazılır, çevrim/saat ve santimetre bir ondalıkla, su ölçümü `digits`
 * ondalıkla), ikincisi gerçek Türkçe biçimleyicinin yazımı içindir (adet ve hacim en çok bir ondalık; su ölçümü en az `digits` ondalık).
 */
const mark = (value: number, engineTolerance: number, shownTolerance: number) => `⟦${value}~${engineTolerance}~${shownTolerance}⟧`;
const probe: EngineTextFormat = {
  number: (value) => mark(value, 0, 0.05),
  cycles: (value) => mark(value, 0.05, 0.05),
  measurement: (value, digits = 3) => mark(value, 0.5 * 10 ** -digits, 0.5 * 10 ** -digits),
  volume: (liters) => `${mark(liters, 0, 0.05)} L`,
  length: (cm) => `${mark(cm, 0.05, 0.05)} cm`,
};
const MARK = /⟦([^⟧]*)⟧/;
/** Motorun sayı yazımı: ondalık nokta ya da virgül, binlik ayırıcı yok, çok büyük ya da küçük değerde üslü yazım. */
const ENGINE_NUMBER = "(-?\\d+(?:[.,]\\d+)?(?:e[+-]?\\d+)?)";
/** Türkçe sayı yazımı: binlik nokta, ondalık virgül. Ondalık nokta ("13.0") bu kalıba uymaz. */
const TURKISH_NUMBER = "(-?(?:\\d{1,3}(?:\\.\\d{3})+|\\d+)(?:,\\d+)?)";
const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const readEngine = (token: string) => Number(token.replace(",", "."));
const readTurkish = (token: string) => Number(token.replace(/\./g, "").replace(",", "."));

/** İşaretlerin dışında kalan her şey `text` ile birebir aynı olmalı; işaretli her sayı `text`te pay içinde aynı değerle yazılmalı. */
function expectMarkedNumbers(probed: string, text: string, number: string, read: (token: string) => number, tolerance: 1 | 2, label: string) {
  const parts = probed.split(MARK);
  const match = new RegExp(`^${parts.map((part, index) => (index % 2 ? number : escapeRegExp(part))).join("")}$`).exec(text);
  expect(match, `${label}\n  dil dosyası: ${probed}\n  karşılaştırılan: ${text}`).not.toBeNull();
  parts.forEach((part, index) => {
    if (index % 2 === 0) return;
    const fields = part.split("~").map(Number);
    const token = match![(index + 1) / 2];
    expect(Math.abs(read(token) - fields[0]), `${label}: ${part} ↔ ${token}`).toBeLessThanOrEqual(fields[tolerance] + 1e-9);
  });
}

/** Sözcükler ve değerler motorun Türkçe metniyle aynı; gerçek Türkçe biçimleyicinin yazdığı sayılar da Türkçe yazımlı ve aynı değerde. */
function expectSameWords(probed: string, shown: string, engine: string, label: string) {
  expectMarkedNumbers(probed, engine, ENGINE_NUMBER, readEngine, 1, `${label} (motor)`);
  expectMarkedNumbers(probed, shown, TURKISH_NUMBER, readTurkish, 2, `${label} (ekran)`);
}

function expectSameText(analysis: HealthAnalysis, label: string) {
  for (const metric of analysis.metrics) {
    seenDetailCodes.add(metric.detailCode);
    expect(Object.prototype.hasOwnProperty.call(tr.metricDetails, metric.detailCode), `${label}: ölçüt kodu dil dosyasında yok: ${metric.detailCode}`).toBe(true);
    const text = engineMetricText(tr, probe, metric);
    expect(text.label, `${label}: ${metric.key}`).toBe(metric.label);
    expectSameWords(text.detail, engineMetricText(tr, liters, metric).detail, metric.detail, `${label}: ${metric.key}`);
  }
  for (const warning of analysis.warnings) {
    seenWarningCodes.add(warning.code);
    expect(Object.prototype.hasOwnProperty.call(tr.warnings, warning.code), `${label}: uyarı kodu dil dosyasında yok: ${warning.code}`).toBe(true);
    const text = engineWarningText(tr, probe, warning);
    const shown = engineWarningText(tr, liters, warning);
    expectSameWords(text.title, shown.title, warning.title, `${label}: ${warning.code} başlık`);
    expectSameWords(text.message, shown.message, warning.message, `${label}: ${warning.code}`);
  }
}

// Fikstürde geçmeyen kodlar için küçük bir çözümleyici (gerçek kataloğa dokunmaz).
const species: Record<string, SpeciesProfileInput> = {
  plain: { id: "plain", commonName: "Sakin tür", adultSizeCm: 4, minVolumeL: 40, minTankLengthCm: 45, minGroup: 1, temperature: [22, 27], ph: [6, 7.5], wasteFactor: 0.5 },
  unverified: { id: "unverified", commonName: "Doğrulanmamış tür", adultSizeCm: 4, minVolumeL: 40, minGroup: 1, temperature: [22, 27], ph: [6, 7.5], wasteFactor: 0.5 },
  nipper: { id: "nipper", commonName: "Isıran tür", adultSizeCm: 6, minVolumeL: 60, minGroup: 1, temperature: [22, 27], ph: [6, 7.5], wasteFactor: 0.8, behavior: { finNipper: { source: "Seriously Fish", condition: "Küçük gruplarda belirgin" } } },
  target: { id: "target", commonName: "Uzun yüzgeçli tür", adultSizeCm: 6, minVolumeL: 60, minGroup: 1, temperature: [22, 27], ph: [6, 7.5], wasteFactor: 0.8, behavior: { finNipTarget: { source: "Seriously Fish" } } },
  snailEater: { id: "snailEater", commonName: "Salyangoz yiyen tür", adultSizeCm: 10, minVolumeL: 100, minGroup: 1, temperature: [22, 27], ph: [6, 7.5], wasteFactor: 1, behavior: { eatsSnails: { source: "Fishkeeper", condition: "Küçük salyangozları kabuğundan çeker" } } },
  snail: { id: "snail", commonName: "Salyangoz türü", adultSizeCm: 2, minVolumeL: 10, minGroup: 1, temperature: [20, 28], ph: [6.5, 8], wasteFactor: 0.2 },
  halfCm: { id: "halfCm", commonName: "Buçuklu tür", adultSizeCm: 4.5, minVolumeL: 40, minTankLengthCm: 45, minGroup: 1, temperature: [22, 27], ph: [6, 7.5], wasteFactor: 0.5 },
  // Altın fikstürün tür çiftleri katalogla değişir (karar 0031); bu iki davranış kodu stub ile de sınanır.
  shrimpEater: { id: "shrimpEater", commonName: "Karides yiyen tür", adultSizeCm: 8, minVolumeL: 60, minTankLengthCm: 60, minGroup: 1, temperature: [22, 27], ph: [6, 7.5], wasteFactor: 0.8, behavior: { eatsShrimp: { source: "Fishkeeper", condition: "Küçük karidesler" } } },
  dwarfShrimp: { id: "dwarfShrimp", commonName: "Cüce karides türü", adultSizeCm: 3, minVolumeL: 20, minGroup: 1, temperature: [20, 28], ph: [6.5, 8], wasteFactor: 0.15 },
  hunter: { id: "hunter", commonName: "Fırsatçı avcı tür", adultSizeCm: 15, minVolumeL: 100, minTankLengthCm: 80, minGroup: 1, temperature: [22, 27], ph: [6, 7.5], wasteFactor: 1, behavior: { eatsSmallFish: { source: "Seriously Fish" } } },
  marine: { id: "marine", commonName: "Deniz türü", waterTypes: ["saltwater"], adultSizeCm: 5, minVolumeL: 100, minGroup: 1, temperature: [24, 27], ph: [8, 8.4], wasteFactor: 0.5, specificGravity: [1.02, 1.026] },
};
const devices: Record<string, EquipmentProfileInput> = {
  skimmer: { id: "skimmer", category: "filter", brand: "Stub", model: "Skimmer", auxiliaryFiltration: true },
  weakFlow: { id: "weakFlow", category: "filter", brand: "Stub", model: "Zayıf", ratedFlowLph: 200 },
  sized: { id: "sized", category: "filter", brand: "Stub", model: "Önerili", recommendedMaxL: 60 },
  flowOnly: { id: "flowOnly", category: "filter", brand: "Stub", model: "Debili", ratedFlowLph: 120 },
  unverifiedFilter: { id: "unverifiedFilter", category: "filter", brand: "Stub", model: "Doğrulanmamış", ratedFlowLph: 600 },
  rangeHeaterA: { id: "rangeHeaterA", category: "heater", brand: "Stub", model: "Aralıklı A", recommendedMinL: 50, recommendedMaxL: 100 },
  rangeHeaterB: { id: "rangeHeaterB", category: "heater", brand: "Stub", model: "Aralıklı B", recommendedMinL: 50, recommendedMaxL: 100 },
  bareHeater: { id: "bareHeater", category: "heater", brand: "Stub", model: "Verisiz" },
  wattHeater: { id: "wattHeater", category: "heater", brand: "Stub", model: "Yalnız watt", powerW: 100 },
  strong: { id: "strong", category: "filter", brand: "Stub", model: "Güçlü", ratedFlowLph: 2000 },
  big: { id: "big", category: "filter", brand: "Stub", model: "Büyük", recommendedMaxL: 600 },
  sized2: { id: "sized2", category: "filter", brand: "Stub", model: "Önerili 2", recommendedMaxL: 60 },
  bareFilter1: { id: "bareFilter1", category: "filter", brand: "Stub", model: "Verisiz 1" },
  bareFilter2: { id: "bareFilter2", category: "filter", brand: "Stub", model: "Verisiz 2" },
  bareFilter3: { id: "bareFilter3", category: "filter", brand: "Stub", model: "Verisiz 3" },
  bareFilter4: { id: "bareFilter4", category: "filter", brand: "Stub", model: "Verisiz 4" },
  notedFilter: { id: "notedFilter", category: "filter", brand: "Stub", model: "Notlu", capacityDataNote: "Üretici debi yayımlamıyor." },
};
const resolver: KnowledgeResolver = {
  speciesForLivestock: (item) => (item.catalogId ? species[item.catalogId] : undefined),
  profileForEquipment: (item) => (item.catalogId ? devices[item.catalogId] : undefined),
  isVerifiedSpeciesProfile: (profile) => profile !== undefined && profile.id !== "unverified",
  isVerifiedEquipmentProfile: (profile) => profile !== undefined && profile.id !== "unverifiedFilter",
};
const analyze = createAnalyzer(resolver);
const tank = (overrides: Partial<Aquarium> = {}): Aquarium => ({ id: "a", name: "Senaryo", type: "freshwater", lengthCm: 100, widthCm: 40, heightCm: 50, netVolumeLiters: 160, setupDate: "2026-01-01", ...overrides });
const animal = (catalogId: string, category: Livestock["category"] = "fish", quantity = 1): Livestock => ({ id: `l-${catalogId}`, aquariumId: "a", catalogId, commonName: species[catalogId]?.commonName ?? catalogId, category, quantity, addedAt: "2026-01-01" });
const device = (catalogId: string, category: Equipment["category"] = devices[catalogId]?.category ?? "filter"): Equipment => ({ id: `e-${catalogId}`, aquariumId: "a", catalogId, category, installedAt: "2026-01-01" });
const reading = (values: Partial<WaterParameters>): WaterParameters => ({ id: "w", aquariumId: "a", measuredAt: "2026-01-01T10:00:00Z", ...values });

const scenarios: Array<[string, HealthAnalysis]> = [
  ["eşleşmeyen ve doğrulanmamış kayıtlar", analyze(tank(), [animal("plain"), animal("unknown"), animal("unverified")], [device("unknownFilter", "filter"), device("unverifiedFilter")])],
  ["yalnız yüzey skimmeri", analyze(tank(), [animal("plain")], [device("skimmer")])],
  ["yetersiz etiket debisi", analyze(tank(), [animal("plain")], [device("weakFlow")])],
  ["karışık filtre, uygun hacmin üstünde", analyze(tank({ netVolumeLiters: 120 }), [animal("plain")], [device("sized"), device("flowOnly")])],
  ["karışık filtre, sınırın üstünde", analyze(tank({ netVolumeLiters: 300 }), [animal("plain")], [device("sized"), device("flowOnly")])],
  ["iki aralıklı ısıtıcı, watt yok", analyze(tank(), [animal("plain")], [device("rangeHeaterA"), device("rangeHeaterB")])],
  ["verisiz ısıtıcı", analyze(tank(), [animal("plain")], [device("bareHeater")])],
  // Altın fikstürde yalnız watt değerli ısıtıcı kalmadı (Boyu DR ısıtıcılarının gücü 2026-10-30 örnek denetiminde hesaptan çekildi).
  ["yalnız watt değerli ısıtıcı, uygun hacim", analyze(tank({ netVolumeLiters: 100 }), [animal("plain")], [device("wattHeater")])],
  ["tuzluluk aralık dışında", analyze(tank({ type: "saltwater" }), [animal("marine")], [], reading({ specificGravity: 1.01, temperature: 25, ph: 8.2 }))],
  ["geçersiz iki ölçüm", analyze(tank(), [animal("plain")], [], reading({ ammonia: -1, nitrate: Number.NaN }))],
  ["geçersiz tek ölçüm", analyze(tank(), [animal("plain")], [], reading({ nitrite: -1 }))],
  ["amonyak, pH ve sıcaklık yok", analyze(tank(), [animal("plain")], [], reading({ ammonia: 0.5 }))],
  ["zehirli amonyak ve yüksek nitrit", analyze(tank(), [animal("plain")], [], reading({ ammonia: 1, ph: 8.5, temperature: 28, nitrite: 0.5, nitrate: 120 }))],
  ["düşük amonyak ve nitrit", analyze(tank(), [animal("plain")], [], reading({ ammonia: 0.05, ph: 6.5, temperature: 24, nitrite: 0.1, nitrate: 60 }))],
  ["deniz akvaryumunda yüksek nitrat", analyze(tank({ type: "saltwater" }), [animal("marine")], [], reading({ nitrate: 150, specificGravity: 1.024 }))],
  ["yüzgeç ısırma", analyze(tank(), [animal("nipper"), animal("target")], [])],
  ["salyangoz yiyen balık", analyze(tank(), [animal("snailEater"), animal("snail", "snail", 3)], [])],
  ["güçlü akıntı", analyze(tank({ netVolumeLiters: 100 }), [animal("plain")], [device("strong")])],
  ["1.000 litrenin üstünde küçük filtre", analyze(tank({ netVolumeLiters: 1200 }), [animal("plain")], [device("big")])],
  ["buçuklu boyda çok küçük akvaryum", analyze(tank({ lengthCm: 12, widthCm: 8, heightCm: 10, netVolumeLiters: 5 }), [animal("halfCm")], [])],
  ["üretici önerisinin hemen üstünde", analyze(tank({ netVolumeLiters: 600.01 }), [animal("plain")], [device("big")])],
  ["sınırı çok az aşan nitrit ve çok düşük amonyak", analyze(tank(), [animal("plain")], [], reading({ ammonia: 0.0001, ph: 6.5, temperature: 24, nitrite: 0.2004 }))],
  ["deniz akvaryumunda sınırı çok az aşan nitrat", analyze(tank({ type: "saltwater" }), [animal("marine")], [], reading({ nitrate: 100.0004, specificGravity: 1.024 }))],
  ["tatlı suda tehlike sınırını çok az aşan nitrat", analyze(tank(), [animal("plain")], [], reading({ nitrate: 100.0004 }))],
  ["tatlı suda uyarı sınırını çok az aşan nitrat", analyze(tank(), [animal("plain")], [], reading({ nitrate: 50.0004 }))],
  ["altı ondalıkta bile ayırt edilmeyen değerler", analyze(tank({ netVolumeLiters: 600.0000001 }), [animal("plain")], [device("big")], reading({ ammonia: 1e-7, ph: 6.5, temperature: 24, nitrite: 0.2000004 }))],
  // Örneklerde başka türlü açılmayan dallar: "ve N ekipman daha", kaynağın kapasite notu, elle girilen değer, acı su, birden çok önerili filtre.
  ["kapasitesi eksik beş cihaz", analyze(tank(), [animal("plain")], ["bareFilter1", "bareFilter2", "bareFilter3", "bareFilter4", "bareHeater"].map((id) => device(id)))],
  ["notlu tek cihaz", analyze(tank(), [animal("plain")], [device("notedFilter")])],
  ["elle girilen debi", analyze(tank(), [animal("plain")], [{ id: "e-manual", aquariumId: "a", category: "filter", brand: "Listede", model: "Yok", installedAt: "2026-01-01", userRatedFlowLph: 800 }])],
  ["acı su akvaryumunda tatlı su türü", analyze(tank({ type: "brackish" }), [animal("plain")], [])],
  ["iki önerili filtrenin toplamının üstünde", analyze(tank({ netVolumeLiters: 150 }), [animal("plain")], [device("sized"), device("sized2")])],
  // Motor 1.13.0: deniz akvaryumunun OATA hedefleri (karar 0029, 0030).
  ["deniz: yalnız balık, hedef dışı tuzluluk, pH ve nitrat", analyze(tank({ type: "saltwater" }), [animal("marine")], [], reading({ specificGravity: 1.025, ph: 8.4, nitrate: 40, temperature: 25 }))],
  ["deniz: güvenli aralığın üstünde tuzluluk", analyze(tank({ type: "saltwater" }), [animal("marine")], [], reading({ specificGravity: 1.03, ph: 8.1, temperature: 25 }))],
  ["karides yiyen balık ve cüce karides", analyze(tank({ netVolumeLiters: 150 }), [animal("shrimpEater"), animal("dwarfShrimp", "shrimp", 5)], [])],
  ["fırsatçı avcı ve küçük balık", analyze(tank({ netVolumeLiters: 150 }), [animal("hunter"), animal("plain")], [])],
  ["deniz: omurgasızlı, düşük KH ve pH", analyze(tank({ type: "saltwater" }), [animal("marine"), animal("snail", "snail")], [], reading({ specificGravity: 1.022, ph: 7.9, kh: 6.5, temperature: 25 }))],
];
const scenario = (name: string) => scenarios.find(([label]) => label === name)![1];
const warningOf = (analysis: HealthAnalysis, code: string) => analysis.warnings.find((warning) => warning.code === code)!;
const metricOf = (analysis: HealthAnalysis, key: string) => analysis.metrics.find((metric) => metric.key === key)!;

describe("motor metinleri dil dosyasından (karar 0021, 3. paket)", () => {
  it("altın fikstürün her vakasında Türkçe metnin sözcükleri ve sayıların değeri motorunkiyle aynı", () => {
    expect(fixture.length).toBeGreaterThan(1000);
    for (const { name, result } of fixture) expectSameText(result, name);
  }, 30_000); // 1.033 vaka, iki biçimleyiciyle: sıcak çalıştırmada ~2 sn, soğuk ve paralel çalıştırmada 5 sn'yi aşabilir.

  it("fikstürde geçmeyen kodları tetikleyen senaryolarda da aynı", () => {
    for (const [name, analysis] of scenarios) expectSameText(analysis, name);
  });

  it("motorun her kodu dil dosyasında var, dil dosyasında kullanılmayan kod yok, her kod en az bir kez sınandı", () => {
    // 1.13.0: beş deniz suyu kodu (karar 0030).
    expect(sourceWarningCodes.size).toBe(53);
    expect(sourceDetailCodes.size).toBe(38);
    expect(new Set(Object.keys(tr.warnings))).toEqual(sourceWarningCodes);
    expect(new Set(Object.keys(tr.metricDetails))).toEqual(sourceDetailCodes);
    expect(new Set(Object.keys(tr.metricLabels))).toEqual(new Set(fixture[0].result.metrics.map((metric) => metric.key)));
    expect([...sourceWarningCodes].filter((code) => !seenWarningCodes.has(code))).toEqual([]);
    expect([...sourceDetailCodes].filter((code) => !seenDetailCodes.has(code))).toEqual([]);
  });

  it("dil dosyasında karşılığı olmayan kodda motorun Türkçe metnine düşer", () => {
    const warning = { level: "warning" as const, title: "Başlık", message: "Metin", code: "unknownCode", params: {} };
    expect(engineWarningText(tr, liters, warning)).toEqual({ title: "Başlık", message: "Metin" });
    const metric = { key: "unknown", label: "Ad", score: 50, status: "warning" as const, detail: "Açıklama", detailCode: "unknownCode", detailParams: {} };
    expect(engineMetricText(tr, liters, metric)).toEqual({ label: "Ad", detail: "Açıklama" });
    // Nesnenin kendi üyeleri (constructor, toString) kod sayılmaz; motorun metnine düşülür.
    for (const code of ["constructor", "toString", "__proto__"]) {
      expect(engineWarningText(tr, liters, { ...warning, code })).toEqual({ title: "Başlık", message: "Metin" });
      expect(engineMetricText(tr, liters, { ...metric, key: code, detailCode: code })).toEqual({ label: "Ad", detail: "Açıklama" });
    }
  });

  it("3b: sayılar dilin ayırıcılarıyla yazılır", () => {
    expect(engineWarningText(tr, liters, warningOf(scenario("güçlü akıntı"), "strongFlow")).message).toBe("Tahmini 13,0 çevrim/saat. Düşük akıntı seven türler için çıkışı dağıtmayı düşün.");
    expect(engineWarningText(tr, liters, warningOf(scenario("1.000 litrenin üstünde küçük filtre"), "filterTooSmallManufacturer")).message).toBe(
      "Akvaryumun net hacmi (1.200 L), filtrenin üreticisinin önerdiği en büyük hacmin (600 L) %50'den fazla üstünde. Akvaryuma uygun bir filtre ekleyin.",
    );
    expect(engineWarningText(tr, liters, warningOf(scenario("buçuklu boyda çok küçük akvaryum"), "spaceSevere")).message).toMatch(
      /^Kayıtlı adet için minimum 40 L ve 45 cm uzunluk referansı kullanıldı\. .* katalogdaki 4,5 cm yetişkin boyu .*: uzunluk en az 13,5 cm, genişlik en az 9 cm, su derinliği en az 4,5 cm\.$/,
    );
  });

  it("3b: dil dosyası sayıyı kendisi yazmaz, her sayı biçimleyiciden geçer", () => {
    // Bütün sayı değişkenleri ayırt edilebilir bir değerle değiştirilip sınama biçimleyicisiyle yazılır. İşaretler ve metin değişkenleri
    // (adlar, katalog metni) çıkarılınca geriye yalnız kalıbın sabit sayıları kalmalıdır: %50, 100 ppm, 50 ppm, 3× 2× 1×, "0 olmalıdır".
    const allowed = new Set(["0", "1", "2", "3", "50", "100"]);
    const leaks = new Set<string>();
    const sentinel = (params: EngineTextParams) => Object.fromEntries(Object.entries(params).map(([key, value]) => [key, typeof value === "number" ? 987654.321 : value]));
    const leftover = (text: string, params: EngineTextParams) => {
      let rest = text.split(MARK).filter((_, index) => index % 2 === 0).join("");
      // Uzun değerler önce çıkarılır: ad, katalog metninin içinde de geçebilir.
      const values = Object.values(params).flat().filter((value): value is string => typeof value === "string" && value !== "");
      for (const value of values.sort((a, b) => b.length - a.length)) rest = rest.split(value).join("");
      return rest.match(/\d+/g) ?? [];
    };
    for (const analysis of [...fixture.map(({ result }) => result), ...scenarios.map(([, analysis]) => analysis)]) {
      for (const warning of analysis.warnings) {
        const text = engineWarningText(tr, probe, { ...warning, params: sentinel(warning.params) });
        for (const digits of [...leftover(text.title, warning.params), ...leftover(text.message, warning.params)]) if (!allowed.has(digits)) leaks.add(`${warning.code}: ${digits}`);
      }
      for (const metric of analysis.metrics) {
        const text = engineMetricText(tr, probe, { ...metric, detailParams: sentinel(metric.detailParams) });
        for (const digits of leftover(text.detail, metric.detailParams)) if (!allowed.has(digits)) leaks.add(`${metric.detailCode}: ${digits}`);
      }
    }
    expect([...leaks]).toEqual([]);
  });

  it("3b: yuvarlama, uyarının söylediği farkı ya da sıfırdan büyük değeri gizlemez", () => {
    expect([liters.number(1200), liters.cycles(4), liters.length(13.5)]).toEqual(["1.200", "4,0", "13,5 cm"]);
    expect([liters.measurement(0.25), liters.measurement(0.012345, 4), liters.measurement(0), liters.measurement(0.0001)]).toEqual(["0,25", "0,0123", "0", "0,0001"]);
    expect([liters.measurement(0.2004, 3, 0.2), liters.measurement(0.2, 3, 0.2004)]).toEqual(["0,2004", "0,2"]);
    expect([liters.volume(600.01, 600), liters.volume(600, 600.01), liters.volume(600, 600)]).toEqual(["600,01 L", "600 L", "600 L"]);
    expect([gallons.volume(600.01, 600), gallons.volume(600, 600.01), gallons.volume(0.1), gallons.volume(0)]).toEqual(["158,51 gal", "158,5 gal", "0,03 gal", "0 gal"]);
    expect(engineWarningText(tr, liters, warningOf(scenario("üretici önerisinin hemen üstünde"), "filterOverManufacturer")).message).toMatch(
      /^Akvaryumun net hacmi \(600,01 L\), filtrenin üreticisinin önerdiği en büyük hacmin \(600 L\) üstünde\./,
    );
    const water = scenario("sınırı çok az aşan nitrit ve çok düşük amonyak");
    expect(engineWarningText(tr, liters, warningOf(water, "nitriteHigh")).message).toMatch(/^Nitrit 0,2004 ppm; güvenli üst sınır 0,2 ppm\./);
    expect(engineWarningText(tr, liters, warningOf(water, "ammoniaDetected")).message).toMatch(/^Toplam amonyak 0,0001 ppm\./);
    // Altı ondalık yetmeyince anlamlı basamak artırılır: farklı iki değer hiçbir zaman aynı, sıfırdan büyük değer hiçbir zaman "0" yazılmaz.
    expect([liters.measurement(1e-7), liters.measurement(0.2000004, 3, 0.2), liters.measurement(0.2, 3, 0.2000004)]).toEqual(["0,0000001", "0,2000004", "0,2"]);
    expect([liters.volume(600.0000001, 600), liters.volume(600, 600.0000001)]).toEqual(["600,0000001 L", "600 L"]);
    expect(gallons.volume(600.0000001, 600)).not.toBe(gallons.volume(600, 600.0000001));
    const tiny = scenario("altı ondalıkta bile ayırt edilmeyen değerler");
    expect(engineWarningText(tr, liters, warningOf(tiny, "nitriteHigh")).message).toMatch(/^Nitrit 0,2000004 ppm; güvenli üst sınır 0,2 ppm\./);
    expect(engineWarningText(tr, liters, warningOf(tiny, "ammoniaDetected")).message).toMatch(/^Toplam amonyak 0,0000001 ppm\./);
    expect(engineWarningText(tr, liters, warningOf(tiny, "filterOverManufacturer")).message).toMatch(/^Akvaryumun net hacmi \(600,0000001 L\), filtrenin üreticisinin önerdiği en büyük hacmin \(600 L\) üstünde\./);
    // Kalıptaki sabit sınırlar da değerle karşılaştırılır; sabitler motorunkilerle aynıdır.
    expect([MARINE_NITRATE_LIMIT_PPM, TAP_WATER_NITRATE_LIMIT_PPM, NITRATE_ABOVE_TAP_LIMIT_PPM]).toEqual([MARINE_NITRATE_LIMIT, TAP_WATER_NITRATE_LIMIT, NITRATE_ABOVE_TAP_LIMIT]);
    expect([MARINE_SPECIFIC_GRAVITY_SAFE_MIN, MARINE_SPECIFIC_GRAVITY_SAFE_MAX]).toEqual([...MARINE_SPECIFIC_GRAVITY_SAFE]);
    expect(engineWarningText(tr, liters, warningOf(scenario("deniz akvaryumunda sınırı çok az aşan nitrat"), "nitrateTooHighSaltwater")).message).toMatch(
      /^Nitrat 100,0004 ppm; deniz akvaryumu için üst sınır 100 ppm\./,
    );
    expect(engineWarningText(tr, liters, warningOf(scenario("tatlı suda tehlike sınırını çok az aşan nitrat"), "nitrateTooHigh")).message).toMatch(/^Nitrat 100,0004 ppm\. /);
    expect(engineWarningText(tr, liters, warningOf(scenario("tatlı suda uyarı sınırını çok az aşan nitrat"), "nitrateHigh")).message).toMatch(/^Nitrat 50,0004 ppm\. /);
  });

  it("3b: dil dosyasında sayı türündeki hiçbir değer metne biçimleyicisiz girmez (tip denetimi, bütün dallar)", async () => {
    // Çalışma zamanı denetimleri yalnız açılan dalları görür; bu denetim TypeScript tip bilgisiyle dosyanın tamamını tarar ve izin
    // listesiyle çalışır. Sayı türündeki (ya da sayı içeren birleşik türdeki) her ifade yalnız şunlardan biri olabilir: biçimleyicinin
    // (`f.`) bağımsız değişkeni, karşılaştırmanın ya da koşulun parçası, dizi sırası, ad tanımı, sayı sabiti tanımı. Başka her kullanım
    // (şablon parçası, birleştirme, `String()`, `JSON.stringify`, `toString`, köşeli parantezli çağrı, dizi içinde `join`...) hatadır.
    const ts = (await import("typescript")).default;
    type Node = import("typescript").Node;
    const file = fileURLToPath(new URL("../../../packages/localization/src/messages/tr-engine.ts", import.meta.url));
    const program = ts.createProgram([file], { strict: true, noEmit: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler });
    const checker = program.getTypeChecker();
    const source = program.getSourceFile(file)!;
    /** Değişkenleri okuyan yardımcılar (`p[key] as number` gibi); içleri taranmaz. */
    const readers = new Set(["num", "str", "list", "flag"]);
    const comparisons = new Set([
      ts.SyntaxKind.EqualsEqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsEqualsToken, ts.SyntaxKind.EqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsToken,
      ts.SyntaxKind.LessThanToken, ts.SyntaxKind.GreaterThanToken, ts.SyntaxKind.LessThanEqualsToken, ts.SyntaxKind.GreaterThanEqualsToken,
    ]);
    const numeric = (node: Node) => {
      const type = checker.getTypeAtLocation(node);
      return [type, ...(type.isUnion() ? type.types : [])].some((part) => (part.flags & (ts.TypeFlags.NumberLike | ts.TypeFlags.BigIntLike)) !== 0);
    };
    const allowed = (node: Node) => {
      const parent = node.parent;
      if (ts.isCallExpression(parent) && parent.arguments.some((argument) => argument === node)) {
        const callee = parent.expression;
        // `Boolean(n)` yalnız doğru/yanlış verir; sayı metne girmez.
        if (ts.isIdentifier(callee) && callee.text === "Boolean") return true;
        if (!ts.isPropertyAccessExpression(callee)) return false;
        if (ts.isIdentifier(callee.expression) && callee.expression.text === "f") return true;
        // Dizi kesme konumu (`names.slice(0, -1)`): sonuç yine dizidir, sayı metne girmez.
        return callee.name.text === "slice" && checker.typeToString(checker.getTypeAtLocation(callee.expression)).endsWith("[]");
      }
      if (ts.isConditionalExpression(parent) && parent.condition === node) return true;
      if ((ts.isIfStatement(parent) || ts.isWhileStatement(parent) || ts.isDoStatement(parent)) && parent.expression === node) return true;
      if (ts.isBinaryExpression(parent) && comparisons.has(parent.operatorToken.kind)) return true;
      if (ts.isPrefixUnaryExpression(parent) && parent.operator === ts.SyntaxKind.ExclamationToken) return true;
      if (ts.isElementAccessExpression(parent) && parent.argumentExpression === node) return true;
      if ((ts.isParameter(parent) || ts.isVariableDeclaration(parent) || ts.isBindingElement(parent)) && parent.name === node) return true;
      if (ts.isVariableDeclaration(parent) && parent.initializer === node && ts.isNumericLiteral(node)) return true;
      return false;
    };
    const problems: string[] = [];
    const visit = (node: Node) => {
      if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && readers.has(node.name.text)) return;
      // Yalnız en dıştaki sayı ifadesi değerlendirilir (`a - 1` içindeki `a` değil, `a - 1`); tip yazımları ifade değildir.
      if (ts.isExpression(node) && !ts.isPartOfTypeNode(node) && numeric(node) && !(ts.isExpression(node.parent) && numeric(node.parent)) && !allowed(node)) {
        problems.push(`${source.getLineAndCharacterOfPosition(node.getStart()).line + 1}: ${node.getText()}`);
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
    expect(problems).toEqual([]);
  }, 30_000);

  it("3b: dil dosyası her değişkeni kendi türünün okuyucusuyla okur (sayıyı metin gibi okumak yasak)", async () => {
    // Tip denetimi okuyucuların (`num`, `str`, `list`, `flag`) verdiği türe güvenir; sayı olan bir değişkeni `str` ile okumak onu
    // metin gibi gösterir. Motorun gerçekten gönderdiği türler fikstürden ve senaryolardan toplanır. Dil dosyası söz dizimi ağacıyla
    // taranır: okuyucuya yapılan her başvuru doğrudan bir çağrı olmalı (takma ad ya da değer olarak geçirme yok), çağrı `(p, "ad")`
    // biçiminde sabit bir adla yapılmalı, ad motorun gönderdiği değişkenlerden olmalı ve türü okuyucuyla aynı olmalıdır.
    const kinds = new Map<string, Set<string>>();
    for (const analysis of [...fixture.map(({ result }) => result), ...scenarios.map(([, analysis]) => analysis)]) {
      for (const params of [...analysis.warnings.map((warning) => warning.params), ...analysis.metrics.map((metric) => metric.detailParams)]) {
        for (const [key, value] of Object.entries(params)) kinds.set(key, (kinds.get(key) ?? new Set<string>()).add(Array.isArray(value) ? "list" : typeof value));
      }
    }
    const expected: Record<string, string> = { num: "number", str: "string", list: "list", flag: "boolean" };
    const ts = (await import("typescript")).default;
    const file = fileURLToPath(new URL("../../../packages/localization/src/messages/tr-engine.ts", import.meta.url));
    const source = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.ES2022, true);
    const problems: string[] = [];
    let reads = 0;
    const visit = (node: import("typescript").Node) => {
      if (ts.isIdentifier(node) && Object.hasOwn(expected, node.text)) {
        const reader = node.text;
        const parent = node.parent;
        const where = `${source.getLineAndCharacterOfPosition(node.getStart()).line + 1}: ${parent.getText()}`;
        if (ts.isVariableDeclaration(parent) && parent.name === node) {
          // Okuyucunun kendi tanımı.
        } else if (!ts.isCallExpression(parent) || parent.expression !== node) {
          problems.push(`${where} (okuyucu doğrudan çağrılmalı)`);
        } else {
          reads++;
          const [params, key, ...rest] = parent.arguments;
          if (!params || !ts.isIdentifier(params) || params.text !== "p" || !key || !ts.isStringLiteral(key) || rest.length) problems.push(`${where} (çağrı (p, "ad") biçiminde olmalı)`);
          else if (!kinds.has(key.text)) problems.push(`${where} (motor bu değişkeni göndermiyor)`);
          else if ([...kinds.get(key.text)!].some((kind) => kind !== expected[reader])) problems.push(`${where} (motorda ${[...kinds.get(key.text)!].join("/")})`);
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
    expect(reads).toBeGreaterThan(40);
    expect(problems).toEqual([]);
  });

  it("3b: hacimler ayarlardaki birimle yazılır (galon)", () => {
    const big = scenario("1.000 litrenin üstünde küçük filtre");
    expect(engineWarningText(tr, gallons, warningOf(big, "filterTooSmallManufacturer")).message).toBe(
      "Akvaryumun net hacmi (317 gal), filtrenin üreticisinin önerdiği en büyük hacmin (158,5 gal) %50'den fazla üstünde. Akvaryuma uygun bir filtre ekleyin.",
    );
    expect(engineMetricText(tr, gallons, metricOf(big, "filter")).detail).toBe("Üretici önerisi en fazla 158,5 gal");
    expect(engineWarningText(tr, gallons, warningOf(scenario("buçuklu boyda çok küçük akvaryum"), "spaceSevere")).message).toMatch(/^Kayıtlı adet için minimum 10,6 gal ve 45 cm uzunluk/);
    // Galon tercihinde dil dosyasının yazdığı hiçbir hacim litre değildir (katalogdan gelen metin değişkenleri hariç).
    for (const [name, analysis] of scenarios) {
      for (const warning of analysis.warnings.filter((item) => item.code !== "husbandryCaution" && item.code !== "communityCaution" && item.code !== "tankLengthNote")) {
        expect(engineWarningText(tr, gallons, warning).message, `${name}: ${warning.code}`).not.toMatch(/\d L\b/);
      }
      for (const metric of analysis.metrics) expect(engineMetricText(tr, gallons, metric).detail, `${name}: ${metric.key}`).not.toMatch(/\d L\b/);
    }
  });

  it("3b: her kod sayısını doğru türde yazar (adet, çevrim/saat, su ölçümü, hacim, uzunluk)", () => {
    // Her yazımda biçimleyicinin hangi yöntemiyle, hangi değişkenin, kaç ondalıkla ve hangi sırayla yazıldığı kaydedilir. Yanlış yöntem
    // ya da ondalık (ör. su ölçümünü bir ondalıklı adet gibi yazmak, iki değerin ondalıklarını değiştirmek) değeri çoğu örnekte
    // değiştirmediği ve sınama biçimleyicisinin payı dil dosyasının seçtiği ondalıktan türediği için yukarıdaki karşılaştırmalardan kaçabilir.
    const used = new Map<string, Set<string>>();
    const original = new Map<string, Set<string>>();
    /** Bir yazımda biçimleyiciye yapılan çağrıları "yöntem(ondalık):değişken" olarak sırayla kaydeder. */
    const calls = (params: EngineTextParams, render: (format: EngineTextFormat) => unknown) => {
      const list: string[] = [];
      const note = (method: string, value: number) => {
        const keys = Object.entries(params).filter(([, param]) => param === value).map(([key]) => key);
        list.push(`${method}:${keys.length ? keys.join("/") : "sabit"}`);
        return "0";
      };
      render({
        number: (value) => note("number", value),
        cycles: (value) => note("cycles", value),
        measurement: (value, digits = 3) => note(`measurement(${digits})`, value),
        volume: (value) => note("volume", value),
        length: (value) => note("length", value),
      });
      return list;
    };
    const add = (map: Map<string, Set<string>>, code: string, list: string[]) => list.length && map.set(code, (map.get(code) ?? new Set<string>()).add(list.join(" ")));
    // Tablo için her sayı değişkenine ayrı bir değer verilir; böylece kaydedilen yöntem değişkenine kesin bağlanır ve tablo verideki
    // rastlantısal eşitliklere (ör. hazır kayıt = toplam kayıt) bağlı olmaz. Bu değerler sayıya bağlı dalları (`=== 1`, sıfır) değiştirdiği
    // için gerçek verideki çağrılar da kaydedilir ve tablodaki bir sıranın alt dizisi olmaları istenir.
    const record = (code: string, params: EngineTextParams, render: (params: EngineTextParams, format: EngineTextFormat) => unknown) => {
      let next = 0;
      const distinct = Object.fromEntries(Object.entries(params).map(([key, value]) => [key, typeof value === "number" ? 1000 + ++next * 1.25 : value]));
      add(used, code, calls(distinct, (format) => render(distinct, format)));
      add(original, code, calls(params, (format) => render(params, format)));
    };
    for (const analysis of [...fixture.map(({ result }) => result), ...scenarios.map(([, analysis]) => analysis)]) {
      for (const warning of analysis.warnings) record(`uyarı ${warning.code}`, warning.params, (params, format) => engineWarningText(tr, format, { ...warning, params }));
      for (const metric of analysis.metrics) record(`ölçüt ${metric.detailCode}`, metric.detailParams, (params, format) => engineMetricText(tr, format, { ...metric, detailParams: params }));
    }
    const methodsOf = (sequence: string) => sequence.split(" ").map((call) => call.slice(0, call.indexOf(":")));
    const isSubsequence = (small: string[], large: string[]) => {
      let index = 0;
      for (const item of large) if (item === small[index]) index++;
      return index === small.length;
    };
    const unexplained = [...original].flatMap(([code, sequences]) =>
      [...sequences].filter((sequence) => ![...(used.get(code) ?? [])].some((full) => isSubsequence(methodsOf(sequence), methodsOf(full)))).map((sequence) => `${code}: ${sequence}`),
    );
    expect(unexplained).toEqual([]);
    const table = Object.fromEntries([...used].map(([code, sequences]) => [code, [...sequences].sort().join(" | ")]));
    expect(table).toEqual({
      "ölçüt estimatedOk": "number:watts",
      "ölçüt groupLow": "number:count",
      "ölçüt loadRatio": "number:percent",
      "ölçüt manufacturerMax": "volume:liters",
      "ölçüt mixedMax": "volume:liters",
      "ölçüt ratedTurnover": "cycles:turnover",
      "ölçüt recordsReady": "number:ready number:total number:userValue",
      "ölçüt spaceLimited": "number:count",
      "ölçüt spaceSevere": "number:count",
      "uyarı ammoniaDetected": "measurement(3):total",
      "uyarı ammoniaToxic": "measurement(4):free measurement(3):limit",
      "uyarı ammoniaWorstCase": "measurement(3):total measurement(3):limit",
      "uyarı conspecificMales": "number:count",
      "uyarı filterCapacityLow": "volume:volume volume:liters",
      "uyarı filterFlowInsufficient": "cycles:turnover",
      "uyarı filterFlowLow": "cycles:turnover cycles:min",
      "uyarı filterOverManufacturer": "volume:volume volume:liters",
      "uyarı filterTooSmallManufacturer": "volume:volume volume:liters",
      "uyarı filterTooSmallMixed": "volume:volume volume:liters",
      "uyarı groupLow": "number:count number:min",
      "uyarı marineKh": "measurement(3):min measurement(3):max measurement(2):value",
      "uyarı marineNitrate": "measurement(3):max measurement(2):value",
      "uyarı marinePh": "measurement(3):min measurement(3):max measurement(2):value",
      "uyarı marineSpecificGravity": "measurement(3):min measurement(3):max measurement(3):value",
      "uyarı marineSpecificGravityDanger": "measurement(3):value measurement(3):sabit measurement(3):sabit",
      "uyarı missingCapacity": "number:remaining",
      "uyarı nitrateHigh": "measurement(3):value measurement(3):sabit",
      "uyarı nitrateTooHigh": "measurement(3):value measurement(3):sabit measurement(3):sabit",
      "uyarı nitrateTooHighSaltwater": "measurement(3):value measurement(3):sabit",
      "uyarı nitriteDetected": "measurement(3):value",
      "uyarı nitriteHigh": "measurement(3):value measurement(3):limit",
      "uyarı salinityOutOfRange": "number:count",
      "uyarı spaceLimited": "volume:volume | volume:volume length:length",
      "uyarı spaceSevere": "volume:volume length:length length:size length:minLength length:minWidth length:minDepth | volume:volume length:size length:minLength length:minWidth length:minDepth",
      "uyarı strongFlow": "cycles:turnover",
      "uyarı unmatchedAnimals": "number:count",
      "uyarı unmatchedEquipment": "number:count",
      "uyarı unverifiedAnimals": "number:count",
      "uyarı unverifiedEquipment": "number:count",
    });
  });

  it("motor metinleri dil paketinin ana girişine bağlı değil (yalnız sağlık sayfasının paketine girer)", () => {
    for (const file of ["index.ts", "messages/tr.ts"]) {
      const source = readFileSync(fileURLToPath(new URL(`../../../packages/localization/src/${file}`, import.meta.url)), "utf8");
      expect(source, file).not.toMatch(/from "\.\/(?:messages\/)?(?:tr-)?engine"/);
    }
  });
});

describe("katalogdan gelen değişkenlerin çevirisi (karar 0021, 4. paket)", () => {
  // Katalogdan gelen Türkçe metin taşımayan metin değişkenleri: kaynak adları (özel ad), ekipman adı ve kapasite notu (ekipman aşaması),
  // dilden bağımsız kodlar (akvaryum türü, deniz suyu profili ve yönü, geçersiz ölçüm alanları).
  const notSpeciesCatalog = new Set(["source", "sources", "names", "note", "aquariumType", "profile", "direction", "fields"]);
  const speciesCatalog = new Set<string>([...SPECIES_CATALOG_PARAMS, ...SPECIES_CATALOG_LIST_PARAMS]);
  const analyses = [...fixture.map(({ name, result }) => [name, result] as const), ...scenarios];

  it("uyarı ve ölçütlerdeki her metin değişkeni sınıflandırılmış: ya katalog metni ya da bilerek çevrilmeyen değer", () => {
    const seen = new Set<string>();
    for (const [, analysis] of analyses) {
      for (const params of [...analysis.warnings.map((warning) => warning.params), ...analysis.metrics.map((metric) => metric.detailParams)]) {
        for (const [key, value] of Object.entries(params)) if (typeof value === "string" || Array.isArray(value)) seen.add(key);
      }
    }
    expect([...seen].filter((key) => !speciesCatalog.has(key) && !notSpeciesCatalog.has(key))).toEqual([]);
    for (const key of speciesCatalog) expect(seen.has(key), key).toBe(true);
  });

  it("motor kaynağındaki her değişken de sınıflandırılmış: senaryolarda çalışmayan dallar dahil", async () => {
    // Fikstür ve senaryolar her dalı çalıştırmaz. Motorun kaynağında `params`/`detailParams` nesnelerinin, adı `...Params` ya da
    // `...Detail` ile biten değişkenlerin ve fonksiyonların içindeki her anahtar toplanır. Senaryolarda yalnız sayı ya da mantıksal
    // değerle görülen anahtarlar metin değildir; kalan her anahtar metin sınıflarından birinde olmalıdır.
    const valueOnly = new Set<string>();
    const text = new Set<string>();
    for (const [, analysis] of analyses) {
      for (const params of [...analysis.warnings.map((warning) => warning.params), ...analysis.metrics.map((metric) => metric.detailParams)]) {
        for (const [key, value] of Object.entries(params)) (typeof value === "string" || Array.isArray(value) ? text : valueOnly).add(key);
      }
    }
    const { keys: source, unresolved } = await engineParamKeys();
    expect(unresolved, "tarama motorun params biçimlerini çözebilmeli").toEqual([]);
    expect([...text, ...valueOnly].filter((key) => !source.has(key)), "kaynak taraması senaryolardaki her anahtarı bulmalı").toEqual([]);
    expect([...source].filter((key) => !speciesCatalog.has(key) && !notSpeciesCatalog.has(key) && !(valueOnly.has(key) && !text.has(key)))).toEqual([]);
  });

  it("Türkçe çevirmenle metin aynen kalır", () => {
    const format = formatFor("liters");
    const identity = catalogTranslator("tr");
    for (const [name, analysis] of analyses) {
      for (const warning of analysis.warnings) expect(engineWarningText(tr, format, warning, identity), name).toEqual(engineWarningText(tr, format, warning));
    }
  });

  it("yalnız katalog metinleri çevrilir; kaynak adları ve kodlar çevrilmez", () => {
    const mark = (text: string) => `«${text}»`;
    const translated = translateCatalogParams(
      { name: "Neon tetra", text: "Not", condition: "", source: "Seriously Fish", sources: ["Fishkeeper"], eaters: ["A", "B"], noteConditions: ["koşul"], aquariumType: "freshwater", count: 3 },
      mark,
    );
    expect(translated).toEqual({ name: "«Neon tetra»", text: "«Not»", condition: "", source: "Seriously Fish", sources: ["Fishkeeper"], eaters: ["«A»", "«B»"], noteConditions: ["«koşul»"], aquariumType: "freshwater", count: 3 });
    // Çevirisi olmayan ad katalogdaki adla kalır; çevirisi olmayan not ve koşul boş verilir (ürün sahibi kararı 2026-10-30).
    expect(translateCatalogParams({ name: "Ad", eaters: ["A"], text: "Not", condition: "Koşul", noteConditions: ["K"], noteNames: ["N"] }, () => undefined))
      .toEqual({ name: "Ad", eaters: ["A"], text: "", condition: "", noteConditions: [""], noteNames: ["N"] });
    const nip = scenario("yüzgeç ısırma").warnings.find((warning) => warning.code === "finNip")!;
    const text = engineWarningText(tr, formatFor("liters"), nip, mark);
    expect(text.title).toContain(`«${nip.params.target}»`);
    expect(text.message).toContain(`«${nip.params.nipper}»`);
    expect(text.message).toContain(`Kaynak: ${nip.params.source}.`);
  });
});

/**
 * Motor kaynağında uyarı ve ölçüt değişkenlerinin anahtarları: `params`/`detailParams` değerleri ve adı `...Params`/`...Detail` ile biten
 * tanımlar. Tarama yalnız bu biçimleri izler; `params` değerinde başka bir biçim (adı `...Params` olmayan değişkenin yayılması, yardımcı
 * fonksiyon çağrısı) `unresolved` listesine girer ve test onu reddeder: yeni biçim ya `...Params` adıyla yazılır ya da tarama genişletilir.
 * Adı `...Params`/`...Detail` olan nesneye sonradan eklenen alanlar da toplanır.
 */
async function engineParamKeys(): Promise<{ keys: Set<string>; unresolved: string[] }> {
  const ts = (await import("typescript")).default;
  type Node = import("typescript").Node;
  const source = ts.createSourceFile("index.ts", engineSource, ts.ScriptTarget.ES2022, true);
  const keys = new Set<string>();
  const unresolved: string[] = [];
  // `params`/`detailParams` adlı yerel değişken (`{ params }` kısa yazımı) de izlenen bir addır.
  const named = (node: Node) => ts.isIdentifier(node) && /(^params$|^detailParams$|Params$|Detail$)/.test(node.text);
  // `params` değeri ya da yayılan ifade: nesne, koşullu ifade, `...Params`/`...Detail` adlı değişken ya da çağrı, `filterDetail[2]`.
  const check = (node: Node): void => {
    if (ts.isParenthesizedExpression(node)) return check(node.expression);
    if (ts.isConditionalExpression(node)) return [node.whenTrue, node.whenFalse].forEach(check);
    if (ts.isObjectLiteralExpression(node)) {
      for (const property of node.properties) {
        if ((ts.isPropertyAssignment(property) || ts.isShorthandPropertyAssignment(property)) && (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name))) keys.add(property.name.text);
        else if (ts.isSpreadAssignment(property)) check(property.expression);
        else unresolved.push(property.getText(source));
      }
      return;
    }
    if (named(node) || (ts.isCallExpression(node) && named(node.expression)) || (ts.isElementAccessExpression(node) && named(node.expression))) return;
    unresolved.push(node.getText(source));
  };
  const collect = (node: Node) => {
    if (ts.isObjectLiteralExpression(node)) check(node);
    else ts.forEachChild(node, collect);
  };
  const visit = (node: Node) => {
    if (ts.isPropertyAssignment(node) && ts.isIdentifier(node.name) && (node.name.text === "params" || node.name.text === "detailParams")) check(node.initializer);
    if (ts.isShorthandPropertyAssignment(node) && (node.name.text === "params" || node.name.text === "detailParams")) check(node.name);
    if (ts.isVariableDeclaration(node) && named(node.name) && node.initializer) collect(node.initializer);
    if (ts.isFunctionDeclaration(node) && node.name && named(node.name) && node.body) collect(node.body);
    // Sonradan eklenen alan (`spaceParams.extra = …`, `spaceParams["extra"] = …`) da anahtardır.
    if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
      const target = node.left;
      if (ts.isPropertyAccessExpression(target) && named(target.expression)) keys.add(target.name.text);
      if (ts.isElementAccessExpression(target) && named(target.expression)) {
        if (ts.isStringLiteral(target.argumentExpression)) keys.add(target.argumentExpression.text);
        else unresolved.push(target.getText(source));
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return { keys, unresolved };
}
