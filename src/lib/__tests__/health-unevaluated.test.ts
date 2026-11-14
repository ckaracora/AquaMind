import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { UnevaluatedItem } from "@aquamind/compatibility-engine";
import { createDisplayFormat, loadLocaleBundle, messagesFor } from "@aquamind/localization";
import { engineMessagesFor, engineTextFormat } from "@aquamind/localization/engine";
import { withBehaviorRecords } from "@/lib/health-analysis-core";
import { analyzeAquarium } from "@/lib/health-analysis";
import { groupHealthWarnings, healthAdviceView, unevaluatedTexts } from "@/lib/health-warning-groups";
import type { SpeciesProfile } from "@/data/catalog-species";
import { equipmentCatalog as equipmentProfiles } from "@/data/catalog-equipment";
import { isVerifiedEquipmentProfile } from "@/data/catalog-shared";
import type { Aquarium, Equipment, Livestock, WaterParameters } from "@/types/aquarium";

// Motor 1.18.0 (docs/DECISIONS/0043-eksik-degerlendirme-ve-hukum-kurallari.md; ürün sahibinin onayı 2026-11-14): "Değerlendirilemeyenler" kartı.
// Ürün sahibinin şartı: "Neyi eksik değerlendirdiğini de söylesin. Güzel bir yazıyla, bilgi şeklinde, net, öz." Kartın metinleri üç dilde,
// her madde tek cümle; tanınmayan canlı varken hiçbir ekran "İyi" ya da "sorun görünmüyor" demez.

await loadLocaleBundle("en");
await loadLocaleBundle("es");
const engine = { tr: engineMessagesFor("tr"), en: engineMessagesFor("en"), es: engineMessagesFor("es") };
const ui = { tr: messagesFor("tr"), en: messagesFor("en"), es: messagesFor("es") };
const format = (locale: "tr" | "en" | "es") => engineTextFormat(createDisplayFormat(locale, { temperature: "celsius", volume: "liters", dateFormat: "day-first" }));
const engineSource = readFileSync("packages/compatibility-engine/src/index.ts", "utf8");
const page = () => readFileSync("src/app/aquariums/[id]/health/page.tsx", "utf8");

/** Motorun `UnevaluatedCode` türündeki kodlar. */
const engineCodes = new Set([...(/export type UnevaluatedCode=([^;]+);/.exec(engineSource)?.[1] ?? "").matchAll(/"([A-Za-z]+)"/g)].map((match) => match[1]));

const sample: UnevaluatedItem[] = [
  { code: "noReading", params: {} },
  { code: "equipmentNoCapacity", params: { name: "Stub Verisiz", category: "filter", note: "Üretici debi yayımlamıyor" } },
  { code: "unknownEquipment", params: { name: "", category: "heater" } },
  { code: "unknownEquipment", params: { name: "Marka Model", category: "air_pump" } },
  { code: "behaviorUnknown", params: { name: "Neon tetra" } },
  { code: "unverifiedAnimal", params: { name: "Neon tetra", count: 1 } },
  { code: "unknownAnimal", params: { name: "Balon moli", count: 4 } },
];

describe("kartın metinleri üç dilde", () => {
  it("motorun her kodunun üç dilde metni var, fazlası yok", () => {
    expect(engineCodes.size).toBe(6);
    for (const messages of Object.values(engine)) expect(new Set(Object.keys(messages.unevaluated))).toEqual(engineCodes);
  });

  it("Türkçe: başlık, giriş ve maddeler (önce canlılar, sonra cihazlar, en sonda su ölçümü)", () => {
    expect([engine.tr.unevaluatedTitle, engine.tr.unevaluatedIntro]).toEqual(["Değerlendirilemeyenler", "Bu sonuç aşağıdakileri kapsamıyor; puan yalnız bildiklerimize dayanıyor."]);
    expect(unevaluatedTexts(engine.tr, format("tr"), sample)).toEqual([
      "Balon moli (4 adet) katalogda yok; ihtiyaçları ve uyumu hesaba katılmadı.",
      "Neon tetra (1 adet) için katalog kaydı henüz doğrulanmadı; ihtiyaçları ve uyumu hesaba katılmadı.",
      "Kaynaklar Neon tetra türünün başka canlılarla uyumunu yazmıyor.",
      "Adı girilmemiş bir ısıtıcı katalogda yok; ısıtıcı hesabına katılmadı.",
      "Marka Model (hava motoru) katalogda yok; filtrasyon hesabına katılmadı.",
      "Stub Verisiz: hesap için gereken kapasite bilgisi eksik; filtrasyon hesabına katılmadı. Üretici debi yayımlamıyor.",
      "Su ölçümü yok; sıcaklık, pH, amonyak, nitrit ve nitrat değerlendirilmedi.",
    ]);
  });

  it("İngilizce (ABD) ve İspanyolca (Latin Amerika) maddeler", () => {
    expect(unevaluatedTexts(engine.en, format("en"), sample)).toEqual([
      "Balon moli (4 animals) isn't in the catalog; its needs and compatibility weren't taken into account.",
      "The catalog record for Neon tetra (1 animal) hasn't been verified yet; its needs and compatibility weren't taken into account.",
      "Sources don't say how Neon tetra gets along with other animals.",
      "An unnamed heater isn't in the catalog; it wasn't included in the heater calculation.",
      "Marka Model (air pump) isn't in the catalog; it wasn't included in the filtration calculation.",
      "Stub Verisiz: the capacity data needed for the calculation is missing; it wasn't included in the filtration calculation. Üretici debi yayımlamıyor.",
      "There is no water reading; temperature, pH, ammonia, nitrite and nitrate weren't assessed.",
    ]);
    expect(unevaluatedTexts(engine.es, format("es"), sample)).toEqual([
      "Balon moli (4 ejemplares) no está en el catálogo; no se tuvieron en cuenta sus necesidades ni su compatibilidad.",
      "El registro del catálogo de Neon tetra (1 ejemplar) aún no está verificado; no se tuvieron en cuenta sus necesidades ni su compatibilidad.",
      "Las fuentes no indican cómo se lleva Neon tetra con otros animales.",
      "Un calentador sin nombre no está en el catálogo; no se incluyó en el cálculo de calefacción.",
      "Marka Model (bomba de aire) no está en el catálogo; no se incluyó en el cálculo de filtración.",
      "Stub Verisiz: faltan los datos de capacidad que necesita el cálculo; no se incluyó en el cálculo de filtración. Üretici debi yayımlamıyor.",
      "No hay ninguna medición del agua; no se evaluaron la temperatura, el pH, el amoníaco, el nitrito ni el nitrato.",
    ]);
    // Katalog metni (kapasite notu) çeviri tablosundan gelir; çevirmen verilmezse aynen kalır. Başka hiçbir yerde Türkçe harf yok.
    for (const locale of ["en", "es"] as const) {
      const texts = [engine[locale].unevaluatedTitle, engine[locale].unevaluatedIntro, ...unevaluatedTexts(engine[locale], format(locale), sample.filter((item) => item.code !== "equipmentNoCapacity"))];
      expect(texts.join(" "), locale).not.toMatch(/[çğıöşÇĞİÖŞ]/);
    }
  });

  it("tür adı ve kapasite notu katalog çevirmeninden geçer; kullanıcının yazdığı ad ve cihazın marka-modeli aynen kalır", () => {
    const species = (value: string) => (value === "Neon tetra" ? "Neon tetra (EN)" : undefined);
    const equipment = (value: string) => (value === "Üretici debi yayımlamıyor" ? "The manufacturer doesn't publish a flow rate" : undefined);
    const texts = unevaluatedTexts(engine.en, format("en"), sample, species, equipment);
    expect(texts[1]).toContain("Neon tetra (EN)");
    expect(texts[0]).toContain("Balon moli");
    expect(texts[4]).toContain("Marka Model");
    expect(texts[5]).toContain("The manufacturer doesn't publish a flow rate.");
  });

  it("arayüz metinleri: rozet, ana sayfa cümlesi, risk yok kutusu, gösterge etiketleri, hesaba giren kayıtlar", () => {
    expect([ui.tr.health.incomplete, ui.en.health.incomplete, ui.es.health.incomplete]).toEqual(["Eksik değerlendirildi", "Incomplete assessment", "Evaluación incompleta"]);
    for (const messages of Object.values(ui)) {
      expect(messages.healthSummary.incomplete).toBeTruthy();
      expect(messages.health.noRiskIncompleteTitle).not.toBe(messages.health.noRiskTitle);
    }
    expect(ui.tr.healthSummary.incomplete).not.toMatch(/sorun görünmüyor/);
    expect(ui.tr.health.noRiskIncompleteTitle).not.toMatch(/görünmüyor/);
    expect(ui.tr.health.metricStatus).toEqual({ good: "Uygun", warning: "Sınırda", danger: "Yetersiz" });
    expect(ui.en.health.metricStatus).toEqual({ good: "Suitable", warning: "Borderline", danger: "Insufficient" });
    expect(ui.es.health.metricStatus).toEqual({ good: "Adecuado", warning: "Al límite", danger: "Insuficiente" });
    expect(ui.tr.health.recordsCounted(2, 2, 0)).toBe("Hesaba giren kayıtlar: 2/2");
    expect(ui.tr.health.recordsCounted(2, 3, 1)).toBe("Hesaba giren kayıtlar: 2/3 · 1 kayıt senin girdiğin değerle");
    expect(ui.en.health.recordsCounted(2, 3, 1)).toBe("Records included: 2/3 · 1 based on a value you entered");
    expect(ui.es.health.recordsCounted(2, 3, 1)).toBe("Registros incluidos: 2/3 · 1 con un valor que ingresaste");
  });
});

describe("sağlık sayfası", () => {
  const aquarium: Aquarium = { id: "a", name: "Deneme", type: "freshwater", lengthCm: 60, widthCm: 30, heightCm: 35, netVolumeLiters: 60, setupDate: "2026-11-14" };
  const unknown: Livestock = { id: "x", aquariumId: "a", commonName: "Balon moli", category: "fish", quantity: 4, addedAt: "2026-11-14" };
  const guppy: Livestock = { id: "g", aquariumId: "a", catalogId: "guppy", commonName: "Lepistes", category: "fish", quantity: 4, addedAt: "2026-11-14" };

  it("kartın kapsadığı kayıt uyarıları risk listesinde tekrar edilmez; her uyarı üç listeden tam birinde", () => {
    const analysis = analyzeAquarium(aquarium, [unknown, guppy], [{ id: "e", aquariumId: "a", category: "filter", brand: "Marka", model: "Yok", installedAt: "2026-11-14" }]);
    const { risks, notes, records } = groupHealthWarnings(analysis.warnings);
    expect(records.map((warning) => warning.code).sort()).toEqual(["unmatchedAnimals", "unmatchedEquipment"]);
    expect(risks.some((warning) => records.includes(warning))).toBe(false);
    expect(risks.length + notes.length + records.length).toBe(analysis.warnings.length);
    expect(analysis.incomplete).toBe(true);
    expect(unevaluatedTexts(engine.tr, format("tr"), analysis.unevaluated)[0]).toBe("Balon moli (4 adet) katalogda yok; ihtiyaçları ve uyumu hesaba katılmadı.");
  });

  it("sayfa kartı hükmün altında çizer; 'iyi' olacakken eksikse rozet ve halka sakin renkte 'Eksik değerlendirildi' yazar", () => {
    const source = page();
    expect(source).toContain("unevaluatedTexts(engineTexts,engineFormat,analysis.unevaluated,catalogText,equipmentText)");
    expect(source).toContain('const incompleteGood=analysis.status==="good"&&analysis.incomplete===true;');
    expect(source).toContain("const verdictLabel=incompleteGood?t.health.incomplete:t.health.overall[analysis.status];");
    expect(source).toContain('<ScoreRing score={analysis.score} status={incompleteGood?"neutral":analysis.status}/>');
    expect(source).toContain("{engineTexts.unevaluatedTitle}");
    // Kontrol turu: risk yok kutusunu, kartın görünürlüğünü ve nötr göstergeleri `healthAdviceView` belirler (aşağıdaki testler).
    expect(source).toContain("const advice=healthAdviceView(analysis,animals.length,awaiting.length);");
    expect(source).toContain("const showAdvice=advice.showAdvice;");
    expect(source).toContain("{advice.showUnevaluated&&unevaluated.length>0&&<section");
    expect(source).toContain('emptyBox==="clear"?{tone:"bg-emerald-400/10 text-emerald-400",icon:<CheckCircle2 size={19}/>,title:t.health.noRiskTitle');
    expect(source.match(/t\.health\.noRiskTitle/g)?.length).toBe(1);
    expect(source).toContain("unassessed?t.health.metricNotAssessed:t.health.metricStatus[status]");
    expect(source).toContain("noLivestock?engineTexts.unevaluatedIntroNoLivestock:engineTexts.unevaluatedIntro");
    // Göstergenin yanındaki çıplak yüzde yerine durum etiketi.
    expect(source).toContain(":t.health.metricStatus[status]}");
    expect(source).not.toContain("{score}%</span>");
  });
});

describe("kontrol turu: ekranın bir yeri 'eksik' ya da 'yetersiz' derken başka yeri 'sorun yok' demez", () => {
  const aquarium: Aquarium = { id: "a", name: "Deneme", type: "freshwater", lengthCm: 60, widthCm: 30, heightCm: 35, netVolumeLiters: 60, setupDate: "2026-11-14" };
  const guppy: Livestock = { id: "g", aquariumId: "a", catalogId: "guppy", commonName: "Lepistes", category: "fish", quantity: 4, addedAt: "2026-11-14" };
  const unknown: Livestock = { id: "x", aquariumId: "a", commonName: "Balon moli", category: "fish", quantity: 4, addedAt: "2026-11-14" };
  const reading: WaterParameters = { id: "w", aquariumId: "a", measuredAt: "2026-11-14T10:00:00.000Z", temperature: 25, ph: 7.2, ammonia: 0, nitrite: 0, nitrate: 10 };
  const filter = equipmentProfiles.find((profile) => profile.category === "filter" && profile.recommendedMaxL !== undefined && profile.recommendedMaxL >= 60 && profile.recommendedMaxL <= 120 && !profile.requiresAirPump && isVerifiedEquipmentProfile(profile))!;
  const heater = equipmentProfiles.find((profile) => profile.category === "heater" && profile.powerW !== undefined && profile.powerW >= 50 && profile.powerW <= 100 && isVerifiedEquipmentProfile(profile))!;
  const device = (id: string, profile: { id: string; category: Equipment["category"]; brand: string; model: string }): Equipment => ({ id, aquariumId: "a", catalogId: profile.id, category: profile.category, brand: profile.brand, model: profile.model, installedAt: "2026-11-14" });
  const good = [device("f", filter), device("h", heater)];

  it("hazırlık: tanınan lepistes, doğrulanmış filtre ve ısıtıcı ve ölçümle sonuç 'iyi', değerlendirilemeyen yok, yeşil kutu", () => {
    const analysis = analyzeAquarium(aquarium, [guppy], good, reading);
    expect(analysis.status).toBe("good");
    expect(analysis.unevaluated).toBeUndefined();
    const view = healthAdviceView(analysis, 1, 0);
    expect(view.emptyBox).toBe("clear");
    expect(view.unassessedMetrics.size).toBe(0);
  });

  it("P1: katalogda tanınmayan filtre ölçütü 'Yetersiz' yapıp hükmü 'dikkat'e çekerken yeşil 'Belirgin bir risk görünmüyor' çıkmaz", () => {
    const analysis = analyzeAquarium(aquarium, [guppy], [{ id: "f", aquariumId: "a", category: "filter", brand: "Marka", model: "Yok", installedAt: "2026-11-14" }, device("h", heater)], reading);
    expect(analysis.status).toBe("warning");
    expect(analysis.metrics.find((metric) => metric.key === "filter")?.status).toBe("danger");
    const view = healthAdviceView(analysis, 1, 1);
    expect(view.risks).toEqual([]);
    expect(view.emptyBox).toBe("verdict");
    expect(view.showUnevaluated).toBe(true);
  });

  it("P1: su ölçümü yokken (canlılar tanınsa da) yeşil kutu yerine 'Hesaba katılmayanlar yukarıdaki kartta' kutusu", () => {
    const analysis = analyzeAquarium(aquarium, [guppy], good);
    expect(analysis.status).toBe("good");
    expect(analysis.incomplete).toBeUndefined();
    expect(analysis.unevaluated?.map((item) => item.code)).toEqual(["noReading"]);
    expect(healthAdviceView(analysis, 1, 0).emptyBox).toBe("unevaluated");
    expect([ui.tr.health.noRiskUnevaluatedText, ui.en.health.noRiskUnevaluatedText, ui.es.health.noRiskUnevaluatedText]).toEqual([
      "Hesaba katılmayanlar yukarıdaki kartta yazıyor.", "What wasn't taken into account is listed in the card above.", "Lo que no se tuvo en cuenta aparece en la tarjeta de arriba.",
    ]);
  });

  it("tanınmayan canlı varken 'incomplete' kutusu; metin doğrulanmamış kaydı da kapsar", () => {
    const analysis = analyzeAquarium(aquarium, [guppy, unknown], good, reading);
    expect(healthAdviceView(analysis, 2, 0).emptyBox).toBe("incomplete");
    expect(ui.tr.health.noRiskIncompleteText).toBe("Tanınmayan ya da doğrulanmamış kayıtlar hesaba katılmadı; hangileri olduğu yukarıdaki kartta.");
    expect(ui.tr.healthSummary.incomplete).toContain("doğrulanmadı");
  });

  it("yalnız tanınmayan canlı varken canlıya bağlı göstergeler (yük, alan, sosyal, uyum, ısıtıcı yoksa ısıtıcı) yeşil 'Uygun' değil 'Değerlendirilemedi'", () => {
    const analysis = analyzeAquarium(aquarium, [unknown], [device("f", filter)], reading);
    for (const key of ["load", "space", "social", "compatibility", "heater"]) expect(analysis.metrics.find((metric) => metric.key === key)?.status, key).toBe("good");
    const view = healthAdviceView(analysis, 1, 0);
    expect([...view.unassessedMetrics].sort()).toEqual(["compatibility", "heater", "load", "social", "space"]);
    // Isıtıcı kayıtlıysa ısıtıcı ölçütü cihazın kendisine bakar; o zaman değerlendirilmiş sayılır. Tanınan bir canlı varsa hiçbir gösterge nötr değildir.
    expect([...healthAdviceView(analyzeAquarium(aquarium, [unknown], good, reading), 1, 0).unassessedMetrics]).not.toContain("heater");
    expect(healthAdviceView(analyzeAquarium(aquarium, [unknown, guppy], good, reading), 2, 0).unassessedMetrics.size).toBe(0);
    expect([ui.tr.health.metricNotAssessed, ui.en.health.metricNotAssessed, ui.es.health.metricNotAssessed]).toEqual(["Değerlendirilemedi", "Not assessed", "Sin evaluar"]);
    expect([ui.tr.health.metricNoLivestockCounted, ui.en.health.metricNoLivestockCounted, ui.es.health.metricNoLivestockCounted]).toEqual(["Hesaba giren canlı yok", "No livestock included in the calculation", "Ningún animal entró en el cálculo"]);
  });

  it("canlısız akvaryum: tanınmayan cihaz 'Değerlendirilemeyenler' kartında görünür; boş 'Bulgular ve Öneriler' kartı çizilmez", () => {
    const analysis = analyzeAquarium(aquarium, [], [{ id: "f", aquariumId: "a", category: "filter", brand: "Marka", model: "Yok", installedAt: "2026-11-14" }]);
    expect(analysis.unevaluated?.map((item) => item.code)).toEqual(["unknownEquipment"]);
    const withoutAwaiting = healthAdviceView(analysis, 0, 0);
    expect(withoutAwaiting).toMatchObject({ showUnevaluated: true, showAdvice: false, emptyBox: undefined });
    expect(withoutAwaiting.records.map((warning) => warning.code)).toEqual(["unmatchedEquipment"]);
    expect(healthAdviceView(analysis, 0, 1).showAdvice).toBe(true);
    expect([engine.tr.unevaluatedIntroNoLivestock, engine.en.unevaluatedIntroNoLivestock, engine.es.unevaluatedIntroNoLivestock]).toEqual([
      "Aşağıdaki kayıtlar hesaba katılmadı.", "The records below weren't taken into account.", "Los registros de abajo no se tuvieron en cuenta.",
    ]);
  });

  it("'verdict' kutusunun metni üç dilde", () => {
    expect([ui.tr.health.noRiskVerdictTitle, ui.en.health.noRiskVerdictTitle, ui.es.health.noRiskVerdictTitle]).toEqual(["Ayrı bir uyarı yok", "No separate warning", "Sin advertencias aparte"]);
    expect(ui.tr.health.noRiskVerdictText).toBe("Sonucu yukarıdaki göstergeler belirliyor; Sınırda ya da Yetersiz olanlara bak.");
    expect(ui.en.health.noRiskVerdictText).toBe("The result comes from the indicators above; check the ones marked Borderline or Insufficient.");
    expect(ui.es.health.noRiskVerdictText).toBe("El resultado viene de los indicadores de arriba; revisa los que dicen Al límite o Insuficiente.");
  });

  it("yalnız cihaz çevirmeni verilse de kapasite notu çevrilir", () => {
    const equipment = (value: string) => (value === "Üretici debi yayımlamıyor" ? "The manufacturer doesn't publish a flow rate" : undefined);
    expect(unevaluatedTexts(engine.en, format("en"), [sample[1]], undefined, equipment)[0]).toContain("The manufacturer doesn't publish a flow rate.");
  });
});

describe("davranış kayıtları (barışçıl ve 'balık avcısı değil')", () => {
  const profile = { id: "p", commonName: "P" } as SpeciesProfile;
  const record = { confidence: "explicit" as const, evidence: "e", source: "OATA" as const, sourceUrl: "https://example.org", verifiedAt: "2026-11-14" };

  it("motora not olarak geçer; uyarı üretmez", () => {
    expect(withBehaviorRecords(profile, [{ ...record, flag: "peaceful" }])?.behavior).toEqual({ peaceful: { source: "OATA" } });
    const notHunter = withBehaviorRecords(profile, [{ ...record, flag: "notPiscivorous", source: "Seriously Fish" }]);
    expect(notHunter).toMatchObject({ predatory: false, behavior: { notPiscivorous: { source: "Seriously Fish" } } });
  });
});
