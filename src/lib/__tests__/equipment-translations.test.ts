import { describe, expect, it } from "vitest";
import { createDisplayFormat } from "@aquamind/localization";
import { catalogTextKey } from "@aquamind/localization/catalog";
import { EQUIPMENT_SEPARATOR, equipmentPattern, equipmentText, type EquipmentTexts } from "@aquamind/localization/equipment";
import { careProductCatalog } from "@/data/care-product-catalog";
import { equipmentCatalog } from "@/data/catalog-equipment";
import { enCatalogEquipment } from "../../../packages/localization/src/messages/en-catalog-equipment";
import { esCatalogEquipment } from "../../../packages/localization/src/messages/es-catalog-equipment";
import { readTranslations, spainOnlySpanish } from "./catalog-translation-checks";

// Ekipman kataloğunun İngilizce ve İspanyolca çevirisi (docs/DECISIONS/0021-dil-altyapisi.md, 7. paket). Kaynak JSON gözden geçirilen
// dosyadır; satır başına bir parça kalıbı (sayılar "#") ve çevirisi. Tablo ondan üretilir (`node scripts/catalog-translations.cjs`).
// Çeviride {n} sayıları sırasıyla yerine koyar; {n:L}/{n:l} hacim, {n:C}/{n:c} sıcaklıktır (kullanıcının birimiyle yazılır).

const TABLES: Record<"en" | "es", EquipmentTexts> = { en: enCatalogEquipment, es: esCatalogEquipment };
const TOKEN = /\{(\d+)(?::([LlCc]))?\}/g;
/** Adlarda geçen Türkçe harfler: belgelendirme işareti, ülke, şehir (mağaza adı) ve marka adı. */
const TURKISH_NAMES = /TÜV|Türkiye|İzmir|Armatürk/g;
const TURKISH = /[çğıöşüÇĞİÖŞÜ]/;
/** Çevrilen özel adlar ve kısaltmalar (ülke, şehir, dil, ay; ABD, SSS = sık sorulan sorular): korunacak ad sayılmaz. */
const TRANSLATED_PROPER = new Set(["ABD", "SSS", "Türkiye", "Polonya", "Alman", "Almanca", "İngilizce", "İspanyol", "Japon", "Eylül", "Hamburg"]);
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
const RANGE_LINK = /^\s?[–/-]\s?#/;

/** Kalıptaki her sayının birimi (aralık ve "/" zincirinin sonundaki): litre, °C ya da başka; aralığın ilk sayısı mı. */
function numberUnits(pattern: string): Array<{ unit?: "L" | "C"; rangeStart: boolean }> {
  return [...pattern.matchAll(/#/g)].map((match) => {
    let rest = pattern.slice((match.index ?? 0) + 1);
    const rangeStart = RANGE_LINK.test(rest);
    while (RANGE_LINK.test(rest)) rest = rest.replace(RANGE_LINK, "");
    const unit = /^\s?(?:L(?![/\p{L}\d])|L'|litre)/u.test(rest) ? "L" : /^\s?°C/.test(rest) ? "C" : undefined;
    return { unit, rangeStart };
  });
}

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

/**
 * Korunacak adlar ve kodlar, çevirideki biçimleriyle: büyük harfli kısaltmalar (LED, UV, CO), rakam ya da sayı içerenler (IPX#, LT-#; sayı
 * aynı yer tutucuyla), iç büyük harfli adlar (LightControl, MPa) ve cümle başında olmayan büyük harfli adlar (Dennerle, Fluval, Malawi İzmir).
 */
function protectedTokens(pattern: string): Array<{ token: string; matcher: RegExp }> {
  const sentenceStarts = new Set([...pattern.matchAll(/(?:^|[.;:(]\s*)([\p{L}\d#]+)/gu)].map((match) => match.index + match[0].length - match[1].length));
  const out: Array<{ token: string; matcher: RegExp }> = [];
  for (const match of pattern.matchAll(/[\p{L}\d#]+/gu)) {
    const token = match[0];
    if (token.length < 2 || TRANSLATED_PROPER.has(token)) continue;
    const upper = (token.match(/\p{Lu}/gu) ?? []).length;
    const name = /^\p{Lu}/u.test(token) && !sentenceStarts.has(match.index);
    if (!(/[\d#]/.test(token) || upper >= 2 || /\p{Lu}/u.test(token.slice(1)) || name)) continue;
    let index = (pattern.slice(0, match.index).match(/#/g) ?? []).length;
    const source = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/#/g, () => `\\{${++index}(?::[LlCc])?\\}`);
    // Büyük harfle biten kısaltma çoğul eki alabilir (LEDs).
    const plural = /\p{Lu}$/u.test(token) ? "s?" : "";
    out.push({ token, matcher: new RegExp(`(?<![\\p{L}\\d])${source}${plural}(?![\\p{L}\\d])`, "u") });
  }
  // Tireli model kodları (LT-#, YU-#C, #-K#L) bütün olarak ve kendi sayılarıyla: sayı başka bir koda kaymaz.
  for (const match of pattern.matchAll(/[\p{Lu}\d#]+(?:-[\p{Lu}\d#]+)+/gu)) {
    const token = match[0];
    if (!/#/.test(token) || !/\p{Lu}/u.test(token)) continue;
    let index = (pattern.slice(0, match.index).match(/#/g) ?? []).length;
    const source = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/#/g, () => `\\{${++index}(?::[LlCc])?\\}`);
    out.push({ token, matcher: new RegExp(`(?<![\\p{L}\\d])${source}(?![\\p{L}\\d])`, "u") });
  }
  return out;
}

/** Aynı önekli model kodlarının yer tutucuları ("LT-#, LT-# ve LT-#"): çeviride de aynı sırada geçer (sayı başka koda kaymaz). */
function samePrefixCodes(pattern: string): number[][] {
  const byPrefix = new Map<string, number[]>();
  let index = 0;
  for (const match of pattern.matchAll(/([\p{Lu}]{1,4})-#|#/gu)) {
    index += 1;
    if (match[1]) byPrefix.set(match[1], [...(byPrefix.get(match[1]) ?? []), index]);
  }
  return [...byPrefix.values()].filter((indices) => indices.length > 1);
}

/** Katalogdaki marka adlarının sözcükleri (Fluval, Dennerle, Shark, Sicce…): kalıbın neresinde olursa olsun çeviride aynen kalır. */
const BRAND_WORDS = new Set(equipmentCatalog.flatMap((item) => item.brand.split(/[^\p{L}\d]+/u)).filter((word) => word.length >= 3));
const brandsIn = (pattern: string) => (pattern.match(/[\p{L}\d]+/gu) ?? []).filter((word) => BRAND_WORDS.has(word));

/**
 * Ürün ve seri adları (Glossy, Leddy, AquaClear…): yalnız Latin harfli, büyük harfle başlayan, Türkçe kalıplarda hiç küçük harfle geçmeyen
 * ve katalogdaki bir ekipmanın ya da bakım ürününün marka/model adında geçen sözcükler. Cümle başında da korunur (büyük-küçük harf serbest:
 * "paintball" cins adı olarak küçük yazılabilir).
 */
const WORD = /\p{L}[\p{L}\d]*/gu;
function productNameWords(patterns: readonly string[]): Set<string> {
  const lower = new Set(patterns.flatMap((pattern) => (pattern.match(WORD) ?? []).filter((word) => /^\p{Ll}/u.test(word)).map((word) => word.toLocaleLowerCase("tr"))));
  const catalogNames = new Set([...equipmentCatalog, ...careProductCatalog].flatMap((item) => `${item.brand} ${item.model}`.match(WORD) ?? []));
  return new Set(patterns.flatMap((pattern) => pattern.match(WORD) ?? []).filter((word) =>
    word.length >= 3 && /^[A-Z][A-Za-z]*$/.test(word) && !TRANSLATED_PROPER.has(word) && !lower.has(word.toLocaleLowerCase("tr")) && catalogNames.has(word)));
}

/** Sayıdan sonra düz yazılan birimler ve çevirideki karşılıkları (debi, uzunluk, güç…); litre ve °C belirteçle ayrıca denetlenir. */
const PLAIN_UNITS: Array<[string, Record<"en" | "es", string>]> = [
  ...["mAh", "mA", "mbar", "MPa", "GHz", "Hz", "dB", "mm²", "mm", "cm", "m²", "m³", "m", "W", "V", "A", "K", "lm", "lx", "kg", "g", "ml", "bar", "psi", "%", "ppm", "°dKH", "°KH"]
    .map((unit): [string, Record<"en" | "es", string>] => [unit, { en: unit, es: unit }]),
  ["L/saat", { en: "L/h", es: "L/h" }], ["L/sa", { en: "L/h", es: "L/h" }], ["m³/saat", { en: "m³/h", es: "m³/h" }],
  ["L/dakika", { en: "L/min", es: "L/min" }], ["L/dak", { en: "L/min", es: "L/min" }], ["L/dk", { en: "L/min", es: "L/min" }],
  ["inç", { en: "(?:in|inch|inches|\")", es: "(?:de )?pulgadas?" }],
];
const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const TR_UNIT = new RegExp(`^\\s?(${[...PLAIN_UNITS.map(([unit]) => unit)].sort((a, b) => b.length - a.length).map(escape).join("|")})(?![\\p{L}\\d])`, "u");
const UNIT_TARGET = new Map(PLAIN_UNITS.map(([unit, targets]) => [unit, { en: unit === "inç" ? targets.en : escape(targets.en), es: unit === "inç" ? targets.es : escape(targets.es) }]));

/** Kalıpta aralığın son sayısından ya da tek sayıdan sonra gelen düz birim: [yer tutucu, birim]. */
function plainUnits(pattern: string): Array<[number, string]> {
  const out: Array<[number, string]> = [];
  [...pattern.matchAll(/#/g)].forEach((match, offset) => {
    const rest = pattern.slice((match.index ?? 0) + 1);
    if (RANGE_LINK.test(rest)) return;
    const unit = TR_UNIT.exec(rest)?.[1];
    if (unit) out.push([offset + 1, unit]);
  });
  return out;
}

/** Aralık, ölçü ya da tarih olarak birbirine bağlı sayı grupları ("#–#", "# × # × #", "#/#/#", "#-#-#"): yer tutucu sırası korunur. */
const joinedGroups = (pattern: string): number[][] => {
  const groups: number[][] = [];
  let index = 0;
  for (const match of pattern.matchAll(/#(?:\s?[–/×-]\s?#)+|#/g)) {
    const count = (match[0].match(/#/g) ?? []).length;
    if (count > 1) groups.push(Array.from({ length: count }, (_, offset) => index + offset + 1));
    index += count;
  }
  return groups;
};

describe.each(["en", "es"] as const)("ekipmanın %s çevirisi", (locale) => {
  const entries = readTranslations(locale, "equipment") as Array<ReturnType<typeof readTranslations>[number] & Record<"en" | "es", string>>;

  it("katalogdaki her satırın ve kapasite notunun her parçasının çevirisi var; eskimiş ya da fazla çeviri yok; alanlar doğru", () => {
    expect(new Set(entries.map((entry) => entry.tr))).toEqual(new Set(catalogPatterns.keys()));
    expect(entries.every((entry) => entry.key === catalogTextKey(entry.tr))).toBe(true);
    expect(new Set(entries.map((entry) => entry.key)).size).toBe(entries.length);
    for (const entry of entries) expect(entry.fields, entry.tr).toEqual([...(catalogPatterns.get(entry.tr) ?? [])].sort());
  });

  it("uygulamadaki tablo kaynakla aynı (betikle yeniden üretilmiş)", () => {
    expect(TABLES[locale]).toEqual(Object.fromEntries(entries.map((entry) => [entry.key, entry[locale]])));
  });

  it("her sayı bir kez ve doğru türde yazılır: litre ve mutlak sıcaklık belirteçle, ad, kod ve sıcaklık farkı düz", () => {
    for (const entry of entries) {
      const text = entry[locale];
      const label = `${entry.key} ${entry.tr}`;
      const tokens = [...text.matchAll(TOKEN)].map((match) => ({ index: Number(match[1]), type: match[2] }));
      const units = numberUnits(entry.tr);
      expect(tokens.map((token) => token.index).sort((a, b) => a - b), label).toEqual(units.map((_, index) => index + 1));
      expect(text.replace(TOKEN, ""), label).not.toMatch(/[#{}\d]/);
      for (const token of tokens) {
        const { unit, rangeStart } = units[token.index - 1];
        const plain = (unit === "L" && PLAIN_LITERS.has(entry.tr)) || (unit === "C" && (TEMPERATURE_DIFFERENCES[entry.tr] ?? []).includes(token.index));
        const expected = plain || !unit ? undefined : unit;
        expect(token.type?.toUpperCase(), `${label}: {${token.index}}`).toBe(expected);
        // Küçük harf (birimsiz sayı) yalnız birimi aralığın sonunda yazılan sayıda.
        if (token.type && token.type === token.type.toLowerCase()) expect(rangeStart, `${label}: {${token.index}:${token.type}}`).toBe(true);
      }
      // Düz yazılan litre ve °C birimi çeviride de durur.
      expect((text.match(/\{\d+\}\s?L(?![/\p{L}\d])/gu) ?? []).length, `${label} düz litre`).toBe(PLAIN_LITERS.has(entry.tr) ? units.filter((unit) => unit.unit === "L" && !unit.rangeStart).length : 0);
      expect((text.match(/°C/g) ?? []).length, `${label} düz °C`).toBe(new Set((TEMPERATURE_DIFFERENCES[entry.tr] ?? []).map((index) => numberUnits(entry.tr).slice(index - 1).findIndex((unit) => !unit.rangeStart) + index)).size);
      // Düz birim aynı sayıya bağlı ve doğru karşılıkla kalır (L/saat → L/h; cm cm kalır, mm'ye dönmez).
      for (const [index, unit] of plainUnits(entry.tr)) {
        const after = text.slice(text.search(new RegExp(`\\{${index}(?::[LlCc])?\\}`)) + `{${index}}`.length);
        expect(after, `${label}: {${index}} ${unit}`).toMatch(new RegExp(`^[\\s-]?${UNIT_TARGET.get(unit)?.[locale]}(?![\\p{L}\\d])`, "u"));
      }
      // Türkçede sayıdan önce yazılan yüzde ("%#", "yüzde #") çeviride aynı sayıya bağlı kalır.
      [...entry.tr.matchAll(/#/g)].forEach((match, offset) => {
        if (!/(?:%|yüzde\s)$/u.test(entry.tr.slice(0, match.index))) return;
        expect(text, `${label}: {${offset + 1}} yüzde`).toMatch(new RegExp(`%\\s?\\{${offset + 1}\\}|\\{${offset + 1}\\}\\s?%|\\{${offset + 1}\\}\\s(?:percent|por ciento)`));
      });
      for (const group of [...joinedGroups(entry.tr), ...samePrefixCodes(entry.tr)]) {
        const positions = group.map((index) => text.search(new RegExp(`\\{${index}(?::[LlCc])?\\}`)));
        expect(positions, `${label}: ${group.join("–")} sırası`).toEqual([...positions].sort((a, b) => a - b));
      }
    }
  });

  it("adlar, kodlar ve kısaltmalar korunur; Türkçe harf kalmaz; dil kuralları", () => {
    const names = productNameWords(entries.map((entry) => entry.tr));
    for (const entry of entries) {
      const text = entry[locale];
      const label = `${entry.key} ${entry.tr}`;
      for (const { token, matcher } of protectedTokens(entry.tr)) expect(text, `${label}: ${token}`).toMatch(matcher);
      for (const brand of brandsIn(entry.tr)) expect(text.match(/[\p{L}\d]+/gu) ?? [], `${label}: marka ${brand}`).toContain(brand);
      const words = (text.match(WORD) ?? []).map((word) => word.toLowerCase());
      for (const name of (entry.tr.match(WORD) ?? []).filter((word) => names.has(word))) {
        expect(words.includes(name.toLowerCase()) || words.includes(`${name.toLowerCase()}s`), `${label}: ad ${name}`).toBe(true);
      }
      expect(TURKISH.test(text.replace(TURKISH_NAMES, "")), label).toBe(false);
      if (locale === "es") expect(spainOnlySpanish(text.replace(TOKEN, "")), label).toEqual([]);
      expect(text.trim()).not.toBe("");
    }
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
