// Dil altyapısı 3 (karar 0021): dil dosyasının motor kodlarından kurduğu Türkçe metin, motorun kendi Türkçe metniyle birebir aynı
// olmalıdır. Veri: altın fikstürün 1.033 vakası ve fikstürde geçmeyen kodları tetikleyen küçük senaryolar. Ayrıca motor kaynağındaki
// her kodun dil dosyasında karşılığı olduğu, dil dosyasında kullanılmayan kod kalmadığı ve her kodun en az bir kez sınandığı denetlenir.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { Aquarium, Equipment, Livestock, WaterParameters } from "@aquamind/domain";
import { createAnalyzer, type EquipmentProfileInput, type HealthAnalysis, type KnowledgeResolver, type SpeciesProfileInput } from "@aquamind/compatibility-engine";
import { engineMessagesFor } from "@aquamind/localization/engine";
import { engineMetricText, engineWarningText } from "@/lib/engine-text";

const tr = engineMessagesFor("tr");
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

function expectSameText(analysis: HealthAnalysis, label: string) {
  for (const metric of analysis.metrics) {
    seenDetailCodes.add(metric.detailCode);
    expect(Object.prototype.hasOwnProperty.call(tr.metricDetails, metric.detailCode), `${label}: ölçüt kodu dil dosyasında yok: ${metric.detailCode}`).toBe(true);
    expect(engineMetricText(tr, metric), `${label}: ${metric.key}`).toEqual({ label: metric.label, detail: metric.detail });
  }
  for (const warning of analysis.warnings) {
    seenWarningCodes.add(warning.code);
    expect(Object.prototype.hasOwnProperty.call(tr.warnings, warning.code), `${label}: uyarı kodu dil dosyasında yok: ${warning.code}`).toBe(true);
    expect(engineWarningText(tr, warning), `${label}: ${warning.code}`).toEqual({ title: warning.title, message: warning.message });
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
  ["tuzluluk aralık dışında", analyze(tank({ type: "saltwater" }), [animal("marine")], [], reading({ specificGravity: 1.01, temperature: 25, ph: 8.2 }))],
  ["geçersiz iki ölçüm", analyze(tank(), [animal("plain")], [], reading({ ammonia: -1, nitrate: Number.NaN }))],
  ["geçersiz tek ölçüm", analyze(tank(), [animal("plain")], [], reading({ nitrite: -1 }))],
  ["amonyak, pH ve sıcaklık yok", analyze(tank(), [animal("plain")], [], reading({ ammonia: 0.5 }))],
  ["zehirli amonyak ve yüksek nitrit", analyze(tank(), [animal("plain")], [], reading({ ammonia: 1, ph: 8.5, temperature: 28, nitrite: 0.5, nitrate: 120 }))],
  ["düşük amonyak ve nitrit", analyze(tank(), [animal("plain")], [], reading({ ammonia: 0.05, ph: 6.5, temperature: 24, nitrite: 0.1, nitrate: 60 }))],
  ["deniz akvaryumunda yüksek nitrat", analyze(tank({ type: "saltwater" }), [animal("marine")], [], reading({ nitrate: 150, specificGravity: 1.024 }))],
  ["yüzgeç ısırma", analyze(tank(), [animal("nipper"), animal("target")], [])],
  ["salyangoz yiyen balık", analyze(tank(), [animal("snailEater"), animal("snail", "snail", 3)], [])],
];

describe("motor metinleri dil dosyasından (karar 0021, 3. paket)", () => {
  it("altın fikstürün her vakasında Türkçe metin motorunkiyle birebir aynı", () => {
    expect(fixture.length).toBeGreaterThan(1000);
    for (const { name, result } of fixture) expectSameText(result, name);
  });

  it("fikstürde geçmeyen kodları tetikleyen senaryolarda da aynı", () => {
    for (const [name, analysis] of scenarios) expectSameText(analysis, name);
  });

  it("motorun her kodu dil dosyasında var, dil dosyasında kullanılmayan kod yok, her kod en az bir kez sınandı", () => {
    expect(sourceWarningCodes.size).toBe(48);
    expect(sourceDetailCodes.size).toBe(38);
    expect(new Set(Object.keys(tr.warnings))).toEqual(sourceWarningCodes);
    expect(new Set(Object.keys(tr.metricDetails))).toEqual(sourceDetailCodes);
    expect(new Set(Object.keys(tr.metricLabels))).toEqual(new Set(fixture[0].result.metrics.map((metric) => metric.key)));
    expect([...sourceWarningCodes].filter((code) => !seenWarningCodes.has(code))).toEqual([]);
    expect([...sourceDetailCodes].filter((code) => !seenDetailCodes.has(code))).toEqual([]);
  });

  it("dil dosyasında karşılığı olmayan kodda motorun Türkçe metnine düşer", () => {
    const warning = { level: "warning" as const, title: "Başlık", message: "Metin", code: "unknownCode", params: {} };
    expect(engineWarningText(tr, warning)).toEqual({ title: "Başlık", message: "Metin" });
    const metric = { key: "unknown", label: "Ad", score: 50, status: "warning" as const, detail: "Açıklama", detailCode: "unknownCode", detailParams: {} };
    expect(engineMetricText(tr, metric)).toEqual({ label: "Ad", detail: "Açıklama" });
    // Nesnenin kendi üyeleri (constructor, toString) kod sayılmaz; motorun metnine düşülür.
    for (const code of ["constructor", "toString", "__proto__"]) {
      expect(engineWarningText(tr, { ...warning, code })).toEqual({ title: "Başlık", message: "Metin" });
      expect(engineMetricText(tr, { ...metric, key: code, detailCode: code })).toEqual({ label: "Ad", detail: "Açıklama" });
    }
  });

  it("motor metinleri dil paketinin ana girişine bağlı değil (yalnız sağlık sayfasının paketine girer)", () => {
    for (const file of ["index.ts", "messages/tr.ts"]) {
      const source = readFileSync(fileURLToPath(new URL(`../../../packages/localization/src/${file}`, import.meta.url)), "utf8");
      expect(source, file).not.toMatch(/from "\.\/(?:messages\/)?(?:tr-)?engine"/);
    }
  });
});
