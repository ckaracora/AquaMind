import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { createDisplayFormat } from "@aquamind/localization";
import { careText, type CareTexts } from "@aquamind/localization/care";
import { catalogTextKey } from "@aquamind/localization/catalog";
import { SEGMENT_SEPARATOR, segmentPattern } from "@aquamind/localization/catalog-segments";
import { careProductCatalog } from "@/data/care-product-catalog";
import { enCatalogCare } from "../../../packages/localization/src/messages/en-catalog-care";
import { esCatalogCare } from "../../../packages/localization/src/messages/es-catalog-care";
import { readTranslations } from "./catalog-translation-checks";
import { meaningProblems, nameProblems, numberProblems, productNameWords, TURKISH, type NameRules } from "./segment-translation-checks";

// Bakım ürünü açıklamalarının İngilizce ve İspanyolca çevirisi (docs/DECISIONS/0021-dil-altyapisi.md, 8. paket). Kaynak JSON gözden
// geçirilen dosyadır; satır başına bir parça kalıbı (sayılar "#"), çevirisi ve litre ya da °C taşıyıp bilerek düz yazılan sayılar ("plain":
// doz oranı, ambalaj boyu, ürün ya da kit adındaki litre, sıcaklık farkı). Tablo ondan üretilir (`node scripts/catalog-translations.cjs`).
// Ortak denetimler `segment-translation-checks.ts`'tedir.

type CareEntry = ReturnType<typeof readTranslations>[number] & Record<"en" | "es", string> & { plain?: number[] };
const TABLES: Record<"en" | "es", CareTexts> = { en: enCatalogCare, es: esCatalogCare };
const TURKISH_NAMES = /TÜV|Türkiye|İzmir|Armatürk|Kühl/g;
const TRANSLATED_PROPER = new Set([
  "ABD", "SSS", "Türkiye", "Polonya", "Alman", "Almanca", "İngilizce", "İspanyol", "Japon", "Eylül", "Hamburg",
  "Tanganika", "Tanganjika", "Afrika", "Amerika", "Orta", "Kanada", "Almanya", "Japonya", "Hawaii",
  // "Beta" burada ad değil, beta-glukan ve beta-karoten sözcüklerinin başı (İspanyolcada "betaglucano", "betacaroteno").
  "Beta",
]);

/** Katalogdaki bütün açıklama kalıpları. */
const catalogPatterns = new Set(careProductCatalog.flatMap((item) => item.description.split(SEGMENT_SEPARATOR).map((segment) => segmentPattern(segment).pattern)));

describe.each(["en", "es"] as const)("bakım ürünlerinin %s çevirisi", (locale) => {
  const entries = readTranslations(locale, "care") as CareEntry[];
  const rules: NameRules = {
    translatedProper: TRANSLATED_PROPER,
    turkishNames: TURKISH_NAMES,
    brands: new Set(careProductCatalog.flatMap((item) => item.brand.split(/[^\p{L}\d]+/u)).filter((word) => word.length >= 3)),
    names: productNameWords(entries.map((entry) => entry.tr), careProductCatalog.map((item) => `${item.brand} ${item.model}`), TRANSLATED_PROPER),
  };

  it("katalogdaki her açıklamanın her parçasının çevirisi var; eskimiş ya da fazla çeviri yok", () => {
    expect(new Set(entries.map((entry) => entry.tr))).toEqual(catalogPatterns);
    expect(entries.every((entry) => entry.key === catalogTextKey(entry.tr))).toBe(true);
    expect(new Set(entries.map((entry) => entry.key)).size).toBe(entries.length);
    expect(entries.every((entry) => entry.fields.join() === "care.description")).toBe(true);
  });

  it("uygulamadaki tablo kaynakla aynı (betikle yeniden üretilmiş)", () => {
    expect(TABLES[locale]).toEqual(Object.fromEntries(entries.map((entry) => [entry.key, entry[locale]])));
  });

  it("iki dilde aynı sayılar bilerek düz yazılır (doz, ambalaj, ürün adı, sıcaklık farkı)", () => {
    const other = Object.fromEntries((readTranslations(locale === "en" ? "es" : "en", "care") as CareEntry[]).map((entry) => [entry.key, entry.plain ?? []]));
    expect(entries.filter((entry) => (entry.plain ?? []).join() !== (other[entry.key] ?? []).join()).map((entry) => entry.key)).toEqual([]);
  });

  it("her sayı bir kez ve doğru türde yazılır: akvaryum hacmi ve mutlak sıcaklık belirteçle, düz listesindekiler düz; birim ve sıra korunur", () => {
    expect(entries.flatMap((entry) => numberProblems(entry.tr, entry[locale], locale, entry.plain ?? []).map((problem) => `${entry.key} ${entry.tr}: ${problem}`))).toEqual([]);
  });

  it("güvenlik ve sınır ifadeleri korunur: olumsuzluk, yasak, en az, en çok, yalnız", () => {
    expect(entries.flatMap((entry) => meaningProblems(entry.tr, entry[locale], locale).map((problem) => `${entry.key} ${entry.tr}: ${problem}`))).toEqual([]);
  });

  it("adlar, kodlar ve kısaltmalar korunur; Türkçe harf kalmaz; dil kuralları", () => {
    expect(entries.flatMap((entry) => nameProblems(entry.tr, entry[locale], locale, rules).map((problem) => `${entry.key} ${entry.tr}: ${problem}`))).toEqual([]);
  });

  it("katalogdaki her açıklama metrik ve ABD birimleriyle yazılabilir; belirteç ya da Türkçe kalmaz", () => {
    for (const preferences of [{ temperature: "celsius", volume: "liters", dateFormat: "day-first" }, { temperature: "fahrenheit", volume: "gallons", dateFormat: "month-first" }] as const) {
      const fmt = createDisplayFormat(locale, preferences);
      for (const item of careProductCatalog) {
        const out = careText(item.description, TABLES[locale], fmt);
        expect(out, `${item.id}: ${item.description}`).toBeDefined();
        expect(out, item.id).not.toMatch(/[{}#]|NaN|undefined/);
        expect(TURKISH.test((out ?? "").replace(TURKISH_NAMES, "")), `${item.id}: ${out}`).toBe(false);
      }
    }
  }, 30_000);
});

describe("bakım ürünü çevirisi", () => {
  it("Türkçede açıklama aynen kalır; örnek ürün", () => {
    const tr = createDisplayFormat("tr", { temperature: "celsius", volume: "liters", dateFormat: "day-first" });
    for (const item of careProductCatalog) expect(careText(item.description, undefined, tr), item.id).toBe(item.description);
    const welsi = careProductCatalog.find((item) => item.model === "Welsi Gran")!;
    expect(welsi.description).toBe("Corydoras, loach ve diğer dip balıkları için batan granül yem");
    expect(careText(welsi.description, enCatalogCare, createDisplayFormat("en", { temperature: "celsius", volume: "liters", dateFormat: "day-first" }))).toBe("Sinking granules for Corydoras, loaches and other bottom-dwelling fish");
  });

  it("ürün kataloğu sayfası açıklamayı bakım çevirmeninden geçirir; arama çeviride de arar", () => {
    const page = readFileSync("src/app/products/page.tsx", "utf8");
    expect(page).toContain("const careText=useCareText();");
    expect(page).toContain("const shown=useMemo(()=>new Map(careProductCatalog.map(item=>[item.id,careText(item.description)])),[careText]);");
    expect(page).toContain("<ProductDescription text={shown.get(item.id)}/>");
    expect(page).toContain("${shown.get(item.id)??\"\"}");
    expect(page).not.toContain("catalogText");
  });
});
