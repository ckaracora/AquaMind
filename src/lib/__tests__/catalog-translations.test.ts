import { describe, expect, it } from "vitest";
import { catalogTextKey } from "@aquamind/localization/catalog";
import { speciesCatalog } from "@/data/catalog-species";
import { speciesBehavior } from "@/data/species-behavior";
import { speciesCatalogTexts } from "@/lib/catalog-texts";
import { enCatalogSpecies } from "../../../packages/localization/src/messages/en-catalog-species";
import { PROPER, codes, latinNameFinder, readTranslations, turkishTimedNumberWords, values } from "./catalog-translation-checks";

// Canlıların İngilizce çevirisi (docs/DECISIONS/0021-dil-altyapisi.md, "4b"): kaynak JSON gözden geçirilen dosyadır, tablo ondan üretilir
// (`node scripts/catalog-translations.cjs`). Çeviri Claude'undur; burada sayılar, birimler, özel adlar, Latince adlar, kimlik kodları ve
// ad yöntemi denetlenir. Dilden bağımsız parçalar `catalog-translation-checks.ts` dosyasındadır.

const entries = readTranslations("en") as Array<ReturnType<typeof readTranslations>[number] & { en: string }>;
const texts = speciesCatalogTexts(speciesCatalog, speciesBehavior);
const latinNames = latinNameFinder(entries.map((entry) => entry.tr));

/** Ölçü birimleri aynı sayıda geçmeli (litre ile galon, cm ile inç karışmasın). */
// Sözcük sınırı Unicode harfe göredir (`\b` Türkçe harfleri sözcük saymaz: "zayıftır" içinde "ft" bulunurdu).
const UNITS: Array<[string, RegExp, RegExp]> = [
  ["litre", /(?<!\p{L})litre/giu, /(?<!\p{L})liter/giu],
  ["L", /\d\s?L(?![\p{L}\d])/gu, /\d\s?L(?![\p{L}\d])/gu],
  ["galon", /(?<!\p{L})galon/giu, /(?<!\p{L})gallon/giu],
  ["cm", /(?<!\p{L})cm(?!\p{L})/gu, /(?<!\p{L})cm(?!\p{L})/gu],
  ["mm", /(?<!\p{L})mm(?!\p{L})/gu, /(?<!\p{L})mm(?!\p{L})/gu],
  ["°C", /°C/g, /°C/g],
  ["kg", /(?<!\p{L})kg(?!\p{L})/gu, /(?<!\p{L})kg(?!\p{L})/gu],
  ["mg/L", /mg\/L/g, /mg\/L/g],
  ["g/L", /(?<!m)g\/L/g, /(?<!m)g\/L/g],
  ["m", /\d\s?m(?![\p{L}\d/])/gu, /\d\s?m(?![\p{L}\d/])/gu],
  ["metre", /(?<!\p{L})metre/giu, /(?<!\p{L})meter/giu],
  ["%", /%/g, /%/g],
  ["SG", /(?<!\p{L})SG(?!\p{L})/gu, /(?<!\p{L})SG(?!\p{L})/gu],
  ["dGH", /dGH/g, /dGH/g],
  ["dKH", /dKH/g, /dKH/g],
  ["ft", /(?<!\p{L})(?:ft|fit)(?!\p{L})/gu, /(?<!\p{L})ft(?!\p{L})/gu],
  ["inç", /(?<!\p{L})inç/gu, /(?<!\p{L})inch/gu],
  // Süreler: "Günışığı", "güncel", "yıldız", "yılan" süre değildir; "gündüz" İngilizcede "day" olarak geçer.
  ["dakika", /(?<!\p{L})dakika/giu, /(?<!\p{L})minute/giu],
  ["saat", /(?<!\p{L})saat/giu, /(?<!\p{L})hour/giu],
  ["gün", /(?<!\p{L})gün(?!cel|ışı|ey|eş|dem)/giu, /(?<!\p{L})(?:days?|daily)(?!\p{L})/giu],
  ["hafta", /(?<!\p{L})hafta/giu, /(?<!\p{L})week/giu],
  ["ay", /(?<!\p{L})ay(?:da|dan|lar\p{L}*|lık|ı|dır)?(?!\p{L})/giu, /(?<!\p{L})month/giu],
  ["yıl", /(?<!\p{L})yıl(?!dız|an)/giu, /(?<!\p{L})(?:year|annual)/giu],
  // Sıklık: "haftada 2–3 kez" (birim başına tekrar) ile "2–3 haftada bir" (tekrarlar arası süre) ve tekrarın çokluğu karışmasın.
  // Sayıdan sonra gelen "2–3 dakikada" süre bildirir, sıklık sayılmaz.
  ["sıklık", /(?<!\d\S*\s|birkaç\s)(?<!\p{L})(?:günde|haftada|ayda|yılda|saatte)(?!\p{L})(?! bir(?!\p{L}))/giu, /(?<!\p{L})(?:per|a) (?:hour|day|week|month|year)(?!\p{L})/giu],
  ["aralık", /(?<!\p{L})(?:\d\S*|birkaç|iki|üç|dört|beş)\s(?:günde|haftada|ayda|yılda|saatte) bir(?!\p{L})/giu, /(?<!\p{L})every (?:other (?:hour|day|week|month|year)|(?:few|two|three|four|five|\d\S*) (?:hour|day|week|month|year)s)(?!\p{L})/giu],
  ["günlük/haftalık", /(?<!\p{L})(?:günlük|haftalık)(?!\p{L})/giu, /(?<!\p{L})(?:daily|weekly)(?!\p{L})/giu],
  ["birkaç + süre", /(?<!\p{L})birkaç (?:saat|gün|hafta|ay|yıl)/giu, /(?<!\p{L})(?:several|(?:a|every) few) (?:hour|day|week|month|year)s(?!\p{L})/giu],
  ["birkaç kez", /(?<!\p{L})(?:günde|haftada|ayda|yılda|saatte) (?:yaklaşık )?birkaç (?:kez|defa|kere)/giu, /(?<!\p{L})several times (?:a|per) (?:hour|day|week|month|year)(?!\p{L})/giu],
  ["bir kez", /(?<!\p{L})(?:günde|haftada|ayda|yılda|saatte) (?:yaklaşık )?bir (?:kez|defa|kere)/giu, /(?<!\p{L})once (?:a|per) (?:hour|day|week|month|year)(?!\p{L})/giu],
  ["iki kez", /(?<!\p{L})(?:günde|haftada|ayda|yılda|saatte) (?:yaklaşık )?iki (?:kez|defa|kere)/giu, /(?<!\p{L})twice (?:a|per) (?:hour|day|week|month|year)(?!\p{L})/giu],
];
/** Yazıyla yazılmış süre miktarları ("iki-üç ay" ↔ "two to three months"): sayı denetimi yalnız rakamları okur. */
const EN_NUMBER_WORDS: Record<string, number> = { two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
const englishTimedNumberWords = (text: string) => {
  const words = Object.keys(EN_NUMBER_WORDS).join("|");
  const phrase = new RegExp(`(?<!\\p{L})(?:${words})(?:(?:\\s(?:to|or)\\s|\\s?[-–]\\s?)(?:${words}))?[\\s-](?:hours?|days?|weeks?|months?|years?)(?!\\p{L})`, "giu");
  return (text.match(phrase) ?? []).flatMap((match) => [...match.toLowerCase().matchAll(/\p{L}+/gu)].map((word) => EN_NUMBER_WORDS[word[0]]).filter((value) => value !== undefined)).sort();
};
const TURKISH = /[çğıöşüÇĞİÖŞÜ]/;
describe("canlıların İngilizce çeviri kaynağı", () => {
  it("canlılar aşamasının her metninin çevirisi var; eskimiş ya da fazla çeviri yok", () => {
    const current = new Set(texts.map((item) => item.key));
    expect(new Set(entries.map((entry) => entry.key))).toEqual(current);
    expect(entries.every((entry) => entry.key === catalogTextKey(entry.tr))).toBe(true);
    expect(new Set(entries.map((entry) => entry.key)).size).toBe(entries.length);
  });

  it("uygulamadaki tablo kaynakla aynı (betikle yeniden üretilmiş)", () => {
    expect(enCatalogSpecies).toEqual(Object.fromEntries(entries.map((entry) => [entry.key, entry.en])));
  });

  it("sayılar, birimler, kaynak ve Latince adlar, kimlik kodları korunur; Türkçe harf kalmaz", () => {
    for (const entry of entries) {
      // Kaynaktan alınan ad kaynağın yazımıdır (ör. eklenmiş L numarası); sayı denetimi çevrilen metinler içindir, kodlar ayrıca denetlenir.
      if (entry.method !== "k") expect(values(entry.en, "en"), entry.key).toEqual(values(entry.tr, "tr"));
      expect(englishTimedNumberWords(entry.en), `${entry.key} süre sözcükleri`).toEqual(turkishTimedNumberWords(entry.tr));
      for (const [unit, tr, en] of UNITS) expect((entry.en.match(en) ?? []).length, `${entry.key} ${unit}`).toBe((entry.tr.match(tr) ?? []).length);
      for (const name of PROPER) expect(entry.en.split(name).length, `${entry.key} ${name}`).toBe(entry.tr.split(name).length);
      for (const latin of latinNames(entry.tr)) expect(entry.en.includes(latin), `${entry.key} ${latin}`).toBe(true);
      for (const code of codes(entry.tr)) expect(codes(entry.en), `${entry.key} ${code}`).toContain(code);
      expect(TURKISH.test(entry.en), entry.key).toBe(false);
      expect(entry.en.trim()).not.toBe("");
    }
  });

  it("her tür adının yöntemi yazılı; kaynaktan alınan adın kaynağı var; iki tür aynı İngilizce adı almaz", () => {
    const names = entries.filter((entry) => entry.fields.includes("species.commonName"));
    expect(names).toHaveLength(new Set(speciesCatalog.map((profile) => profile.commonName)).size);
    for (const entry of names) {
      expect(["a", "k", "t"], entry.tr).toContain(entry.method);
      if (entry.method === "a") expect(entry.en, entry.tr).toBe(entry.tr);
      if (entry.method === "k") expect(entry.source, entry.tr).toMatch(/^https:\/\//);
    }
    expect(new Set(names.map((entry) => entry.en)).size).toBe(names.length);
    expect(entries.filter((entry) => !entry.fields.includes("species.commonName")).every((entry) => entry.method === undefined)).toBe(true);
  });
});
