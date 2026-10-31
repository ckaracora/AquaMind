import { describe, expect, it } from "vitest";
import { catalogTextKey } from "@aquamind/localization/catalog";
import { speciesCatalog } from "@/data/catalog-species";
import { speciesBehavior } from "@/data/species-behavior";
import { speciesCatalogTexts } from "@/lib/catalog-texts";
import { esCatalogSpecies } from "../../../packages/localization/src/messages/es-catalog-species";
import { PROPER, codes, latinNameFinder, readTranslations, spainOnlySpanish, turkishTimedNumberWords, values } from "./catalog-translation-checks";

// Canlıların İspanyolca çevirisi (docs/DECISIONS/0021-dil-altyapisi.md, İspanyolca paketi; Latin Amerika ortak İspanyolcası): kaynak JSON
// gözden geçirilen dosyadır, tablo ondan üretilir (`node scripts/catalog-translations.cjs`). İngilizce testin (catalog-translations.test.ts)
// denetimleri İspanyolca kalıplarla: sayılar (ondalık nokta, binlik virgül), birimler, süreler ve sıklıklar, özel ve Latince adlar, kodlar.
// İspanyolca adlarda yöntem `a` (katalogdaki ad uluslararası satış adı) ya da `t` (katalog adının çevirisi); İspanyolca kaynak adı yok.

const entries = readTranslations("es") as Array<ReturnType<typeof readTranslations>[number] & { es: string }>;
const texts = speciesCatalogTexts(speciesCatalog, speciesBehavior);
const latinNames = latinNameFinder(entries.map((entry) => entry.tr));

/** Ölçü birimleri, süreler ve sıklıklar aynı sayıda geçmeli. Sözcük sınırı Unicode harfe göredir. */
const UNITS: Array<[string, RegExp, RegExp]> = [
  ["litre", /(?<!\p{L})litre/giu, /(?<!\p{L})litro/giu],
  ["L", /\d\s?L(?![\p{L}\d])/gu, /\d\s?L(?![\p{L}\d])/gu],
  ["galon", /(?<!\p{L})galon/giu, /(?<!\p{L})gal[oó]n/giu],
  ["cm", /(?<!\p{L})cm(?!\p{L})/gu, /(?<!\p{L})cm(?!\p{L})/gu],
  ["mm", /(?<!\p{L})mm(?!\p{L})/gu, /(?<!\p{L})mm(?!\p{L})/gu],
  ["°C", /°C/g, /°C/g],
  ["kg", /(?<!\p{L})kg(?!\p{L})/gu, /(?<!\p{L})kg(?!\p{L})/gu],
  ["mg/L", /mg\/L/g, /mg\/L/g],
  ["g/L", /(?<!m)g\/L/g, /(?<!m)g\/L/g],
  ["m", /\d\s?m(?![\p{L}\d/])/gu, /\d\s?m(?![\p{L}\d/])/gu],
  ["metre", /(?<!\p{L})metre/giu, /(?<!\p{L})metro/giu],
  ["%", /%/g, /%/g],
  ["SG", /(?<!\p{L})SG(?!\p{L})/gu, /(?<!\p{L})SG(?!\p{L})/gu],
  ["dGH", /dGH/g, /dGH/g],
  ["dKH", /dKH/g, /dKH/g],
  ["ft", /(?<!\p{L})(?:ft|fit)(?!\p{L})/gu, /(?<!\p{L})pies?(?!\p{L})/gu],
  ["inç", /(?<!\p{L})inç/gu, /(?<!\p{L})pulgada/gu],
  // Süreler ("gündüz" İspanyolcada "día" olarak geçer; "diamond" gibi adlar sayılmaz).
  ["dakika", /(?<!\p{L})dakika/giu, /(?<!\p{L})minuto/giu],
  ["saat", /(?<!\p{L})saat/giu, /(?<!\p{L})horas?(?!\p{L})/giu],
  ["gün", /(?<!\p{L})gün(?!cel|ışı|ey|eş|dem)/giu, /(?<!\p{L})(?:días?|diari[oa]s?|diariamente)(?!\p{L})/giu],
  ["hafta", /(?<!\p{L})hafta/giu, /(?<!\p{L})semana/giu],
  ["ay", /(?<!\p{L})ay(?:da|dan|lar\p{L}*|lık|ı|dır)?(?!\p{L})/giu, /(?<!\p{L})(?:mes(?:es)?|mensual\p{L}*)(?!\p{L})/giu],
  ["yıl", /(?<!\p{L})yıl(?!dız|an)/giu, /(?<!\p{L})(?:años?|anual\p{L}*)(?!\p{L})/giu],
  // Sıklık: birim başına tekrar ("haftada 2–3 kez" ↔ "2–3 veces por semana") ile tekrarlar arası süre ("2–3 haftada bir" ↔ "cada 2–3
  // semanas") ve tekrarın çokluğu karışmasın.
  ["sıklık", /(?<!\d\S*\s|birkaç\s)(?<!\p{L})(?:günde|haftada|ayda|yılda|saatte)(?!\p{L})(?! bir(?!\p{L}))/giu, /(?<!\p{L})(?:por|al|a la) (?:hora|día|semana|mes|año)(?!\p{L})/giu],
  ["aralık", /(?<!\p{L})(?:\d\S*|birkaç|iki|üç|dört|beş)\s(?:günde|haftada|ayda|yılda|saatte) bir(?!\p{L})/giu, /(?<!\p{L})cada (?:pocos|pocas|dos|tres|cuatro|cinco|\d\S*) (?:horas|días|semanas|meses|años)(?!\p{L})/giu],
  ["günlük/haftalık", /(?<!\p{L})(?:günlük|haftalık)(?!\p{L})/giu, /(?<!\p{L})(?:diari[oa]s?|semanal(?:es)?)(?!\p{L})/giu],
  ["birkaç + süre", /(?<!\p{L})birkaç (?:saat|gün|hafta|ay|yıl)/giu, /(?<!\p{L})(?:varios|varias|unos pocos|unas pocas|pocos|pocas) (?:horas|días|semanas|meses|años)(?!\p{L})/giu],
  ["birkaç kez", /(?<!\p{L})(?:günde|haftada|ayda|yılda|saatte) (?:yaklaşık )?birkaç (?:kez|defa|kere)/giu, /(?<!\p{L})varias veces (?:por|al|a la) (?:hora|día|semana|mes|año)(?!\p{L})/giu],
  ["bir kez", /(?<!\p{L})(?:günde|haftada|ayda|yılda|saatte) (?:yaklaşık )?bir (?:kez|defa|kere)/giu, /(?<!\p{L})una vez (?:por|al|a la) (?:hora|día|semana|mes|año)(?!\p{L})/giu],
  ["iki kez", /(?<!\p{L})(?:günde|haftada|ayda|yılda|saatte) (?:yaklaşık )?iki (?:kez|defa|kere)/giu, /(?<!\p{L})dos veces (?:por|al|a la) (?:hora|día|semana|mes|año)(?!\p{L})/giu],
];

/** Yazıyla yazılmış süre miktarları ("iki-üç ay" ↔ "dos a tres meses"); yalnız süre birimine bağlı sözcükler sayılır. */
const ES_NUMBER_WORDS: Record<string, number> = { dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10 };
const spanishTimedNumberWords = (text: string) => {
  const words = Object.keys(ES_NUMBER_WORDS).join("|");
  const phrase = new RegExp(`(?<!\\p{L})(?:${words})(?:(?:\\s(?:a|o)\\s|\\s?[-–]\\s?)(?:${words}))?\\s(?:horas?|días?|semanas?|meses|mes|años?)(?!\\p{L})`, "giu");
  return (text.match(phrase) ?? []).flatMap((match) => [...match.toLowerCase().matchAll(/\p{L}+/gu)].map((word) => ES_NUMBER_WORDS[word[0]]).filter((value) => value !== undefined)).sort();
};
/** Türkçe harf kalmaz; İspanyolcadaki "ü" yalnız "güe/güi" içinde (pingüino). */
const TURKISH = /[çğıöşÇĞİÖŞ]|ü(?![ei])|Ü/;

describe("canlıların İspanyolca çeviri kaynağı", () => {
  it("canlılar aşamasının her metninin çevirisi var; eskimiş ya da fazla çeviri yok", () => {
    expect(new Set(entries.map((entry) => entry.key))).toEqual(new Set(texts.map((item) => item.key)));
    expect(entries.every((entry) => entry.key === catalogTextKey(entry.tr))).toBe(true);
    expect(new Set(entries.map((entry) => entry.key)).size).toBe(entries.length);
  });

  it("uygulamadaki tablo kaynakla aynı (betikle yeniden üretilmiş)", () => {
    expect(esCatalogSpecies).toEqual(Object.fromEntries(entries.map((entry) => [entry.key, entry.es])));
  });

  it("sayılar, birimler, süreler, sıklıklar, kaynak ve Latince adlar, kimlik kodları korunur; Türkçe harf ve İspanya'ya özgü sözcük kalmaz", () => {
    // Kimlik kodlarındaki rakamlar sayı sayılmaz (kodlar ayrıca denetlenir; İngilizce kaynağın eklediği kod, ör. L010A, adda kalabilir).
    const withoutCodes = (text: string) => codes(text).reduce((rest, code) => rest.replace(code, ""), text);
    for (const entry of entries) {
      expect(values(withoutCodes(entry.es), "en"), entry.key).toEqual(values(withoutCodes(entry.tr), "tr"));
      expect(spanishTimedNumberWords(entry.es), `${entry.key} süre sözcükleri`).toEqual(turkishTimedNumberWords(entry.tr));
      for (const [unit, tr, es] of UNITS) expect((entry.es.match(es) ?? []).length, `${entry.key} ${unit}`).toBe((entry.tr.match(tr) ?? []).length);
      for (const name of PROPER) expect(entry.es.split(name).length, `${entry.key} ${name}`).toBe(entry.tr.split(name).length);
      for (const latin of latinNames(entry.tr)) expect(entry.es.includes(latin), `${entry.key} ${latin}`).toBe(true);
      for (const code of codes(entry.tr)) expect(codes(entry.es), `${entry.key} ${code}`).toContain(code);
      expect(TURKISH.test(entry.es), entry.key).toBe(false);
      expect(spainOnlySpanish(entry.es), entry.key).toEqual([]);
      expect(entry.es.trim()).not.toBe("");
    }
  });

  it("her tür adının yöntemi yazılı (a: katalogdaki ad, t: çeviri); iki tür aynı İspanyolca adı almaz", () => {
    const names = entries.filter((entry) => entry.fields.includes("species.commonName"));
    expect(names).toHaveLength(new Set(speciesCatalog.map((profile) => profile.commonName)).size);
    for (const entry of names) {
      expect(["a", "t"], entry.tr).toContain(entry.method);
      if (entry.method === "a") expect(entry.es, entry.tr).toBe(entry.tr);
      else expect(entry.es, entry.tr).not.toBe(entry.tr);
    }
    expect(new Set(names.map((entry) => entry.es.toLocaleLowerCase("es"))).size).toBe(names.length);
    expect(entries.filter((entry) => !entry.fields.includes("species.commonName")).every((entry) => entry.method === undefined)).toBe(true);
  });
});
