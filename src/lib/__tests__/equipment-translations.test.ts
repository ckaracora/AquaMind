import { describe, expect, it } from "vitest";
import { createDisplayFormat } from "@aquamind/localization";
import { catalogTextKey } from "@aquamind/localization/catalog";
import { EQUIPMENT_SEPARATOR, equipmentPattern, equipmentText, type EquipmentTexts } from "@aquamind/localization/equipment";
import { careProductCatalog } from "@/data/care-product-catalog";
import { equipmentCatalog } from "@/data/catalog-equipment";
import { enCatalogEquipment } from "../../../packages/localization/src/messages/en-catalog-equipment";
import { esCatalogEquipment } from "../../../packages/localization/src/messages/es-catalog-equipment";
import { readTranslations } from "./catalog-translation-checks";
import { meaningProblems, nameProblems, numberProblems, numberUnits, productNameWords, TURKISH, type NameRules } from "./segment-translation-checks";

// Ekipman kataloğunun İngilizce ve İspanyolca çevirisi (docs/DECISIONS/0021-dil-altyapisi.md, 7. paket). Kaynak JSON gözden geçirilen
// dosyadır; satır başına bir parça kalıbı (sayılar "#") ve çevirisi. Tablo ondan üretilir (`node scripts/catalog-translations.cjs`).
// Ortak denetimler `segment-translation-checks.ts`'tedir.

const TABLES: Record<"en" | "es", EquipmentTexts> = { en: enCatalogEquipment, es: esCatalogEquipment };
const TURKISH_NAMES = /TÜV|Türkiye|İzmir|Armatürk/g;
const TRANSLATED_PROPER = new Set(["ABD", "SSS", "Türkiye", "Polonya", "Finlandiya", "Alman", "Almanca", "İngilizce", "İspanyol", "Japon", "Eylül", "Hamburg"]);
/** Litre birimi taşıyan ama ad ya da kod olan sayılar: düz yazılır, dönüştürülmez. */
const PLAIN_LITERS = new Set(["#L paslanmaz çelik", "AquaArt Discovery Line # L için beyaz ve mavi LED", "AquaArt Discovery Line #/# L için beyaz ve mavi LED", "ürün kodu #-K#L"]);
/** °C birimi taşıyan ama sıcaklık farkı olan sayılar (artış, soğutma, kademe, ± hassasiyet, gösterim çözünürlüğü): düz yazılır. */
const TEMPERATURE_DIFFERENCES: Record<string, number[]> = {
  "# °C kademeler": [1],
  "# °C ön ayarlı, sert plastik korumalı mini ısıtıcı; tabloda # L'de kapaklı # °C ve # L'de # °C sıcaklık artışı": [3, 5],
  "#–# °C buharlaşmalı soğutma": [1, 2],
  "#–# °C, # °C gösterim": [3],
  "±# °C doğruluk": [1],
  "±# °C kontrol": [1],
  "±# °C kontrol hassasiyeti": [1],
  "±# °C ölçüm hassasiyeti": [1],
  "buharlaşma yoluyla #–# °C soğutma": [1, 2],
  "Tatlı ve tuzlu suya uygun kompakt MH mini ısıtıcı; tabloda #–# L için #–# °C sıcaklık artışı": [3, 4],
  "üreticinin belirttiği su soğutma etkisi #–# °C": [1, 2],
};
const plainIndices = (pattern: string) => [
  ...(PLAIN_LITERS.has(pattern) ? numberUnits(pattern).flatMap((unit, index) => (unit.unit === "L" ? [index + 1] : [])) : []),
  ...(TEMPERATURE_DIFFERENCES[pattern] ?? []),
];

/** Katalogdaki bütün kalıplar ve geçtikleri alanlar (teknik bilgi satırı, kapasite notu). */
const catalogPatterns = new Map<string, Set<string>>();
for (const item of equipmentCatalog) {
  for (const [field, text] of [["equipment.specifications", item.specifications], ["equipment.capacityDataNote", item.capacityDataNote]] as const) {
    for (const segment of text ? text.split(EQUIPMENT_SEPARATOR) : []) {
      const { pattern } = equipmentPattern(segment);
      catalogPatterns.set(pattern, (catalogPatterns.get(pattern) ?? new Set()).add(field));
    }
  }
}

describe.each(["en", "es"] as const)("ekipmanın %s çevirisi", (locale) => {
  const entries = readTranslations(locale, "equipment") as Array<ReturnType<typeof readTranslations>[number] & Record<"en" | "es", string>>;
  const rules: NameRules = {
    translatedProper: TRANSLATED_PROPER,
    turkishNames: TURKISH_NAMES,
    brands: new Set(equipmentCatalog.flatMap((item) => item.brand.split(/[^\p{L}\d]+/u)).filter((word) => word.length >= 3)),
    names: productNameWords(entries.map((entry) => entry.tr), [...equipmentCatalog, ...careProductCatalog].map((item) => `${item.brand} ${item.model}`), TRANSLATED_PROPER),
  };

  it("katalogdaki her satırın ve kapasite notunun her parçasının çevirisi var; eskimiş ya da fazla çeviri yok; alanlar doğru", () => {
    expect(new Set(entries.map((entry) => entry.tr))).toEqual(new Set(catalogPatterns.keys()));
    expect(entries.every((entry) => entry.key === catalogTextKey(entry.tr))).toBe(true);
    expect(new Set(entries.map((entry) => entry.key)).size).toBe(entries.length);
    for (const entry of entries) expect(entry.fields, entry.tr).toEqual([...(catalogPatterns.get(entry.tr) ?? [])].sort());
  });

  it("uygulamadaki tablo kaynakla aynı (betikle yeniden üretilmiş)", () => {
    expect(TABLES[locale]).toEqual(Object.fromEntries(entries.map((entry) => [entry.key, entry[locale]])));
  });

  it("her sayı bir kez ve doğru türde yazılır: litre ve mutlak sıcaklık belirteçle, ad, kod ve sıcaklık farkı düz; birim ve sıra korunur", () => {
    expect(entries.flatMap((entry) => numberProblems(entry.tr, entry[locale], locale, plainIndices(entry.tr)).map((problem) => `${entry.key} ${entry.tr}: ${problem}`))).toEqual([]);
  });

  it("güvenlik ve sınır ifadeleri korunur: olumsuzluk, yasak, en az, en çok, yalnız", () => {
    expect(entries.flatMap((entry) => meaningProblems(entry.tr, entry[locale], locale).map((problem) => `${entry.key} ${entry.tr}: ${problem}`))).toEqual([]);
  });

  it("adlar, kodlar ve kısaltmalar korunur; Türkçe harf kalmaz; dil kuralları", () => {
    expect(entries.flatMap((entry) => nameProblems(entry.tr, entry[locale], locale, rules).map((problem) => `${entry.key} ${entry.tr}: ${problem}`))).toEqual([]);
  });

  it("katalogdaki her teknik bilgi satırı ve kapasite notu metrik ve ABD birimleriyle yazılabilir; belirteç ya da Türkçe kalmaz", () => {
    for (const preferences of [{ temperature: "celsius", volume: "liters", dateFormat: "day-first" }, { temperature: "fahrenheit", volume: "gallons", dateFormat: "month-first" }] as const) {
      const fmt = createDisplayFormat(locale, preferences);
      for (const item of equipmentCatalog) {
        for (const text of [item.specifications, item.capacityDataNote ?? ""].filter(Boolean)) {
          const out = equipmentText(text, TABLES[locale], fmt);
          expect(out, `${item.id}: ${text}`).toBeDefined();
          expect(out, item.id).not.toMatch(/[{}#]|NaN|undefined/);
          expect(TURKISH.test((out ?? "").replace(TURKISH_NAMES, "")), `${item.id}: ${out}`).toBe(false);
        }
      }
    }
  }, 30_000);
});

describe("ekipman çevirisi örnekleri", () => {
  const metric = { temperature: "celsius", volume: "liters", dateFormat: "day-first" } as const;
  const us = { temperature: "fahrenheit", volume: "gallons", dateFormat: "month-first" } as const;
  it("Sera fil bioactive 130: dış filtre, debi ve güç", () => {
    const sera = equipmentCatalog.find((item) => item.id === "sera-fil-bioactive-130")!;
    expect(sera.specifications).toBe("Dış filtre · 300 L/saat · 11 W");
    expect(equipmentText(sera.specifications, enCatalogEquipment, createDisplayFormat("en", metric))).toBe("Canister filter · 300 L/h · 11 W");
    expect(equipmentText(sera.specifications, esCatalogEquipment, createDisplayFormat("es", metric))).toBe("Filtro externo · 300 L/h · 11 W");
  });

  it("sıcaklık farkı ve hassasiyet °F tercihinde de °C kalır; mutlak sıcaklık °F olur", () => {
    expect(equipmentText("±1,0 °C doğruluk", enCatalogEquipment, createDisplayFormat("en", us))).toBe("±1.0 °C accuracy");
    expect(equipmentText("25 °C sabit sıcaklıklı kompakt ısıtıcı", enCatalogEquipment, createDisplayFormat("en", us))).toContain("77 °F");
  });
});
