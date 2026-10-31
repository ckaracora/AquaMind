import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// İngilizce metinler Amerikan İngilizcesidir (ürün sahibi kararı 2026-10-31; karar 0021, 5. paket): liter, color, catalog, fertilize.
// Arayüz, motor, bitki uyarıları, hastalık ve gizlilik sayfaları ve canlıların katalog çevirisi taranır. Yorumlar (Türkçe) taranmaz.

const MESSAGES = "packages/localization/src/messages/";
/** İngiliz yazımı sözcük kökleri; sözcüğün başında aranır ("colour" → "colours", "coloured"). */
const BRITISH = [
  "colour", "discolour", "multicolour", "behaviour", "favour", "unfavour", "rumour", "odour", "harbour", "neighbour", "vapour", "humour", "tumour",
  "labour", "vigour", "armour", "endeavour", "litre", "millilitre", "metre", "centimetre", "millimetre", "kilometre", "centre", "fibre", "calibre",
  "lustre", "sombre", "theatre", "manoeuvr", "catalogu", "dialogue", "analogue", "defence", "offence", "licence", "pretence", "practis", "programme",
  "aluminium", "sulph", "grey", "tyre", "mould", "moult", "liquorice", "whilst", "amongst", "learnt", "enquir", "skilful", "sceptic", "mollusc",
  "ageing", "judgement", "fulfilment", "enrolment", "instalment", "towards", "artefact", "cheque", "draught",
  "plough", "haem", "anaem", "oedema", "diarrhoea", "faec", "oesophag", "anaesth", "septicaem", "foetus", "paediatric", "oestrogen", "leukaem",
  "travell", "labell", "mislabell", "relabell", "modell", "levell", "signall", "fuell", "channell", "counsell", "marvell",
  "woollen", "jewellery", "analys", "paralys", "catalys", "hydrolys",
];
/**
 * Yalnız sözcüğün tamamı olarak İngiliz yazımı: "Plec" (ABD'de "Pleco"; "Plecostomus" Latince addır); fulfil, enrol, cancelled, totalled
 * (Amerikan yazımı fulfill, enroll, canceled, totaled; "cancellation" ve "totally" iki yazımda da aynıdır).
 */
const BRITISH_WORDS = new Set(["plec", "plecs", "fulfil", "fulfils", "enrol", "enrols", "cancelled", "cancelling", "totalled", "totalling"]);
/** Amerikan İngilizcesinde de -ise ile yazılan sözcükler (aşağıdaki -ise/-isation kuralının dışında). */
const ISE_ALLOWED = new Set([
  "advise", "advertise", "arise", "chastise", "comprise", "compromise", "concise", "demise", "despise", "devise", "disguise", "enterprise", "excise",
  "exercise", "expertise", "franchise", "improvise", "incise", "merchandise", "precise", "premise", "promise", "raise", "revise", "rise", "supervise",
  "surmise", "surprise", "televise", "wise", "noise", "poise", "praise", "cruise", "bruise", "guise", "paradise", "anise", "treatise", "reprise",
  "apprise", "tortoise", "turquoise", "porpoise", "otherwise", "likewise", "clockwise", "counterclockwise", "lengthwise", "unwise", "sunrise",
  "kaiser",
]);
// "analys" kökü "analyses" (çoğul ad), "analysis" ve "analyst" sözcüklerinde Amerikan yazımıdır.
const ANALYS_ALLOWED = /^(?:analys(?:is|es|t|ts)|paralys(?:is|es)|catalys(?:is|t|ts)|hydrolys(?:is|es))$/i;

const stripComments = (source: string) => source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'`\\])\/\/.*$/gm, "$1");

function britishWords(text: string): string[] {
  const found: string[] = [];
  // Kod adları (`modelListed`) büyük harften bölünür.
  for (const match of text.matchAll(/\p{Lu}?\p{Ll}+|\p{Lu}+(?!\p{Ll})/gu)) {
    const word = match[0];
    const lower = word.toLowerCase();
    if ((BRITISH.some((stem) => lower.startsWith(stem)) && !ANALYS_ALLOWED.test(lower)) || BRITISH_WORDS.has(lower)) found.push(word);
    const ise = /^(\p{L}{3,}?)is(?:e|es|ed|er|ers|ing|ation|ations|able)$/u.exec(lower);
    if (ise && !ISE_ALLOWED.has(`${ise[1]}ise`)) found.push(word);
  }
  return found;
}

describe("İngilizce metinler Amerikan yazımıyla", () => {
  const files = readdirSync(MESSAGES).filter((name) => /^en(?:-[a-z-]+)?\.ts$/.test(name) && name !== "en-catalog-species.ts");

  it.each(files)("%s İngiliz yazımı içermez", (name) => {
    expect(britishWords(stripComments(readFileSync(`${MESSAGES}${name}`, "utf8")))).toEqual([]);
  });

  it("canlıların katalog çevirisi İngiliz yazımı içermez (tablo bu kaynaktan üretilir)", () => {
    const entries = JSON.parse(readFileSync("packages/localization/translations/en-species.json", "utf8")) as Array<{ key: string; en: string }>;
    expect(entries.flatMap((entry) => britishWords(entry.en).map((word) => `${entry.key}: ${word}`))).toEqual([]);
  });

  it("denetim İngiliz yazımını yakalar, Amerikan yazımını ve -ise ile yazılan sözcükleri geçirir", () => {
    expect(britishWords("Colour, litres, catalogue, fertiliser, organised, recognises, behaviour, moulting, grey, Royal Plec L190, analysed")).toEqual([
      "Colour", "litres", "catalogue", "fertiliser", "organised", "recognises", "behaviour", "moulting", "grey", "Plec", "analysed",
    ]);
    expect(britishWords("Color, liters, catalog, fertilizer, organized, advise, exercise, surprise, otherwise, analysis, analyses, Royal Pleco, Kaiser tetra, premises")).toEqual([]);
    expect(britishWords("fulfill, fulfillment, enroll, enrollment, canceled, cancellation, totaled, totally")).toEqual([]);
    expect(britishWords("fulfil, enrolment, cancelled, totalled")).toEqual(["fulfil", "enrolment", "cancelled", "totalled"]);
  });
});
