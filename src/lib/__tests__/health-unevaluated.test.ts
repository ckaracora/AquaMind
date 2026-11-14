import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { UnevaluatedItem } from "@aquamind/compatibility-engine";
import { createDisplayFormat, loadLocaleBundle, messagesFor } from "@aquamind/localization";
import { engineMessagesFor, engineTextFormat } from "@aquamind/localization/engine";
import { withBehaviorRecords } from "@/lib/health-analysis-core";
import { analyzeAquarium } from "@/lib/health-analysis";
import { groupHealthWarnings, unevaluatedTexts } from "@/lib/health-warning-groups";
import type { SpeciesProfile } from "@/data/catalog-species";
import type { Aquarium, Livestock } from "@/types/aquarium";

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
    expect(source).toContain("analysis.incomplete?t.health.noRiskIncompleteTitle:t.health.noRiskTitle");
    // Göstergenin yanındaki çıplak yüzde yerine durum etiketi.
    expect(source).toContain("{t.health.metricStatus[status]}");
    expect(source).not.toContain("{score}%</span>");
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
