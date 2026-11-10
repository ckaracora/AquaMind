// Parçalı katalog çevirilerinin ortak denetimleri (karar 0021, 7. ve 8. paket): ekipmanın teknik bilgi satırı ve kapasite notu, bakım
// ürünlerinin açıklaması. Kalıpta her "#" bir sayıdır; çeviride {n} sayıları sırasıyla yerine koyar, {n:L}/{n:l} hacim, {n:C}/{n:c} sıcaklıktır
// (kullanıcının birimiyle yazılır). Denetimler sorunları liste olarak döndürür; testler boş liste bekler.
import { spainOnlySpanish } from "./catalog-translation-checks";

export const TOKEN = /\{(\d+)(?::([LlCc]))?\}/g;
export const TURKISH = /[çğıöşüÇĞİÖŞÜ]/;
export const WORD = /\p{L}[\p{L}\d]*/gu;
const RANGE_LINK = /^\s?[–/-]\s?#/;
const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const tokenAt = (index: number) => new RegExp(`\\{${index}(?::[LlCc])?\\}`);

/** Kalıptaki her sayının birimi (aralık ve "/" zincirinin sonundaki): litre, °C ya da başka; aralığın ilk sayısı mı. */
export function numberUnits(pattern: string): Array<{ unit?: "L" | "C"; rangeStart: boolean }> {
  return [...pattern.matchAll(/#/g)].map((match) => {
    let rest = pattern.slice((match.index ?? 0) + 1);
    const rangeStart = RANGE_LINK.test(rest);
    while (RANGE_LINK.test(rest)) rest = rest.replace(RANGE_LINK, "");
    const unit = /^\s?(?:L(?![/\p{L}\d])|L'|litre)/u.test(rest) ? "L" : /^\s?°C/.test(rest) ? "C" : undefined;
    return { unit, rangeStart };
  });
}

/** Sayıdan sonra düz yazılan birimler ve çevirideki karşılıkları (debi, uzunluk, güç…); litre ve °C belirteçle ayrıca denetlenir. */
const PLAIN_UNITS: Array<[string, Record<"en" | "es", string>]> = [
  ...["mAh", "mA", "mbar", "MPa", "GHz", "Hz", "dB", "mm²", "mm", "cm", "m²", "m³", "m", "W", "V", "A", "K", "lm", "lx", "kg", "g", "mg", "ml", "bar", "psi", "%", "ppm", "°dKH", "°KH", "°dGH"]
    .map((unit): [string, Record<"en" | "es", string>] => [unit, { en: escape(unit), es: escape(unit) }]),
  ["L/saat", { en: "L/h", es: "L/h" }], ["L/sa", { en: "L/h", es: "L/h" }], ["m³/saat", { en: "m³/h", es: "m³/h" }],
  ["L/dakika", { en: "L/min", es: "L/min" }], ["L/dak", { en: "L/min", es: "L/min" }], ["L/dk", { en: "L/min", es: "L/min" }],
  ["inç", { en: "(?:in|inch|inches|\")", es: "(?:de )?pulgadas?" }],
];
const TR_UNIT = new RegExp(`^\\s?(${PLAIN_UNITS.map(([unit]) => unit).sort((a, b) => b.length - a.length).map(escape).join("|")})(?![\\p{L}\\d])`, "u");
const UNIT_TARGET = new Map(PLAIN_UNITS);

/**
 * Kalıpta aralığın son sayısından ya da tek sayıdan sonra gelen düz birim: [yer tutucu, birim]. Tek başına çarpan ("damla sayısı ×#
 * mg/L") birime bağlanmaz; ölçü zincirinin ("# × # × # cm") son sayısı bağlanır.
 */
function plainUnits(pattern: string): Array<[number, string]> {
  const out: Array<[number, string]> = [];
  [...pattern.matchAll(/#/g)].forEach((match, offset) => {
    const rest = pattern.slice((match.index ?? 0) + 1);
    const before = pattern.slice(0, match.index);
    if (RANGE_LINK.test(rest) || (/×\s?$/.test(before) && !/#\s?×\s?$/.test(before))) return;
    const unit = TR_UNIT.exec(rest)?.[1];
    if (unit) out.push([offset + 1, unit]);
  });
  return out;
}

/** Aralık, ölçü ya da tarih olarak birbirine bağlı sayı grupları ("#–#", "# × # × #", "#/#/#", "#-#-#"): yer tutucu sırası korunur. */
function joinedGroups(pattern: string): number[][] {
  const groups: number[][] = [];
  let index = 0;
  for (const match of pattern.matchAll(/#(?:\s?[–/×-]\s?#)+|#/g)) {
    const count = (match[0].match(/#/g) ?? []).length;
    if (count > 1) groups.push(Array.from({ length: count }, (_, offset) => index + offset + 1));
    index += count;
  }
  return groups;
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

/**
 * Sayıların sorunları: her sayı bir kez ve doğru türde (litre ve mutlak sıcaklık belirteçle; `plain` listesindeki — ad, kod, doz, ambalaj,
 * sıcaklık farkı — düz ve birimi ardında), küçük harfli belirteç yalnız aralığın ilk sayısında, düz birim aynı sayıya bağlı ve doğru
 * karşılıkla, önde yazılan yüzde aynı sayıya bağlı, aralık/ölçü/tarih ve aynı önekli kodlarda sıra korunur.
 */
export function numberProblems(tr: string, text: string, locale: "en" | "es", plain: readonly number[]): string[] {
  const problems: string[] = [];
  const tokens = [...text.matchAll(TOKEN)].map((match) => ({ index: Number(match[1]), type: match[2] }));
  const units = numberUnits(tr);
  const indices = tokens.map((token) => token.index).sort((a, b) => a - b);
  if (indices.join() !== units.map((_, index) => index + 1).join()) problems.push(`yer tutucular ${indices.join(",")}`);
  if (/[#{}\d]/.test(text.replace(TOKEN, ""))) problems.push("yer tutucu dışında rakam ya da süslü parantez");
  for (const index of plain) if (!units[index - 1]?.unit) problems.push(`düz listesindeki {${index}} litre ya da °C değil`);
  for (const token of tokens) {
    const { unit, rangeStart } = units[token.index - 1] ?? { rangeStart: false };
    const expected = !unit || plain.includes(token.index) ? undefined : unit;
    if (token.type?.toUpperCase() !== expected) problems.push(`{${token.index}} türü ${token.type ?? "düz"}, beklenen ${expected ?? "düz"}`);
    if (token.type && token.type === token.type.toLowerCase() && !rangeStart) problems.push(`{${token.index}:${token.type}} aralık başı değil`);
    if (unit && !token.type && !rangeStart) {
      const after = text.slice(text.search(tokenAt(token.index)) + `{${token.index}}`.length);
      if (!(unit === "L" ? /^\s?L(?![/\p{L}\d])/u : /^\s?°C/).test(after)) problems.push(`düz {${token.index}} ardında ${unit === "L" ? "L" : "°C"} yok`);
    }
  }
  for (const [index, unit] of plainUnits(tr)) {
    const after = text.slice(text.search(tokenAt(index)) + `{${index}}`.length);
    if (!new RegExp(`^[\\s-]?${UNIT_TARGET.get(unit)?.[locale]}(?![\\p{L}\\d])`, "u").test(after)) problems.push(`{${index}} ardında ${unit} karşılığı yok`);
  }
  // Önde yazılan yüzde, sayıya ya da bağlı olduğu aralığın bir ucuna bitişik kalır ("yüzde #–#" → "{1}–{2}%").
  const groups = joinedGroups(tr);
  [...tr.matchAll(/#/g)].forEach((match, offset) => {
    if (!/(?:%|yüzde\s)$/u.test(tr.slice(0, match.index))) return;
    const members = groups.find((group) => group.includes(offset + 1)) ?? [offset + 1];
    const near = members.map((n) => `%\\s?\\{${n}\\}|\\{${n}\\}\\s?%|\\{${n}\\}\\s(?:percent|por ciento)`).join("|");
    if (!new RegExp(near).test(text)) problems.push(`{${offset + 1}} yüzdesi yok`);
  });
  for (const group of [...joinedGroups(tr), ...samePrefixCodes(tr)]) {
    const positions = group.map((index) => text.search(tokenAt(index)));
    if (positions.join() !== [...positions].sort((a, b) => a - b).join()) problems.push(`${group.join("–")} sırası değişmiş`);
  }
  return problems;
}

/** Olumsuz ekli ama çeviride tek sözcükle karşılanan sıfatlar (paslanmaz → stainless, geçirmez → airtight, istenmeyen → unwanted). */
const LEXICAL_NEGATIVES = "paslanmaz|kırılmaz|geçirmez|sızdırmaz|kaymaz|[iİ]stenmeyen|doymamış|çözünmez|dağılmayan";
/** Türkçe olumsuz fiil ekleri (-mAz, -mAmAlI, -mIyor, -mAdIğ-, -mAmIş, -mAyAn, -mAmAk) ile "değil" ve "yok". */
const TURKISH_NEGATION = new RegExp(
  `(?<!\\p{L})(?!(?:${LEXICAL_NEGATIVES})(?!\\p{L}))\\p{L}+(?:m[ae]z(?:l[ae]r)?(?:d[ıiuü]r)?|m[ae]m[ae]l[ıi](?:d[ıiuü]r)?(?:l[ae]r)?|m[ıiuü]yor(?:l[ae]r)?|` +
    `m[ae]d[ıiuü]ğ\\p{L}*|m[ae]m[ıiuü]ş(?:t[ıiuü]r)?|m[ae]y[ae]n(?:l[ae]r)?|m[ae]m[ae]k)(?!\\p{L})|(?<!\\p{L})(?:değil\\p{L}*|yok(?:tur)?)(?!\\p{L})`,
  "giu",
);
/**
 * Güvenlik ve sınır ifadeleri: olumsuzluk, yasak ("-mamalı/-memeli"), "en az", "en çok/en fazla/azami", "yalnız/yalnızca/sadece". Çeviride
 * en az aynı sayıda karşılık bulunmalı; düşen kısıt ya da tersine dönen yasak yakalanır. Yasak yalnız yasak kalıbıyla karşılanır ("should not",
 * "do not", "no debe", "ni mezclarse"): metindeki başka bir olumsuzluk ("does not replace", "no sustituye") onu karşılamaz. Bağlaç olan "ni"
 * ve "nor" olumsuzluk sayılmaz; "en çok" karşılığı sınırı aşan "more than" ya da "más de" olamaz.
 */
const MEANING: Array<[string, RegExp, Record<"en" | "es", RegExp>]> = [
  ["olumsuz", TURKISH_NEGATION, { en: /\b(?:not|never|no|without|neither|none|nothing|cannot|free|non)\b|n't\b/gi, es: /(?<!\p{L})(?:no|nunca|jamás|sin|libre|ningun\p{L}*|nada|tampoco|evit\p{L}*)(?!\p{L})/giu }],
  ["yasak", /\p{L}+(?:mamalı|memeli)/giu, {
    en: /\b(?:should not|shouldn't|must not|mustn't|do not|don't|never|avoid\w*|cannot|can't|may not|not to be)\b|\b(?:not all|no)\b[^;,.]*?\bshould\b/gi,
    es: /(?<!\p{L})(?:no (?:se )?deb\p{L}*|no (?:se )?pued\p{L}*|nunca|jamás|evit\p{L}*|ni \p{L}+(?:ar|er|ir)(?:se)?)(?!\p{L})/giu,
  }],
  ["en az", /(?<!\p{L})(?:en az|asgari)(?!\p{L})/giu, { en: /\b(?:at least|minimum|min\.|or more|no less than)/gi, es: /(?<!\p{L})(?:al menos|como mínimo|mínim[oa]|o más|no menos de)(?!\p{L})/giu }],
  ["en çok", /(?<!\p{L})(?:en çok|en fazla|azami)(?!\p{L})/giu, { en: /\b(?:at most|maximum|max\.|up to|no more than|or less|most)/gi, es: /(?<!\p{L})(?:como máximo|máxim[oa]|máx\.|hasta|no más de|o menos)/giu }],
  ["yalnız", /(?<!\p{L})(?:yalnız|yalnızca|sadece)(?!\p{L})/giu, { en: /\b(?:only|solely|exclusively|just|alone)\b/gi, es: /(?<!\p{L})(?:solo|sólo|sola|solos|solas|solamente|únicamente|exclusivamente)(?!\p{L})/giu }],
];
export function meaningProblems(tr: string, text: string, locale: "en" | "es"): string[] {
  return MEANING.flatMap(([kind, source, targets]) => {
    const wanted = (tr.match(source) ?? []).length;
    const found = (text.match(targets[locale]) ?? []).length;
    return found < wanted ? [`${kind}: Türkçede ${wanted}, çeviride ${found}`] : [];
  });
}

export interface NameRules {
  /** Çevrilen özel adlar ve kısaltmalar (ülke, şehir, dil, ay; ABD, SSS = sık sorulan sorular): korunacak ad sayılmaz. */
  translatedProper: ReadonlySet<string>;
  /** Adlarda geçen Türkçe harfler (marka, şehir, ülke, belgelendirme işareti). */
  turkishNames: RegExp;
  /** Katalogdaki marka adlarının sözcükleri: kalıbın neresinde olursa olsun aynen kalır. */
  brands: ReadonlySet<string>;
  /** Ürün ve seri adları (`productNameWords`): cümle başında da korunur. */
  names: ReadonlySet<string>;
}

/**
 * Korunacak adlar ve kodlar, çevirideki biçimleriyle: büyük harfli kısaltmalar (LED, UV, CO), rakam ya da sayı içerenler (IPX#, LT-#; sayı
 * aynı yer tutucuyla), iç büyük harfli adlar (LightControl, MPa), cümle başında olmayan büyük harfli adlar (Dennerle, Malawi İzmir) ve
 * tireli model kodları bütün olarak (LT-#, YU-#C, #-K#L).
 */
function protectedTokens(pattern: string, translatedProper: ReadonlySet<string>, turkishNames: RegExp): Array<{ token: string; matcher: RegExp }> {
  const sentenceStarts = new Set([...pattern.matchAll(/(?:^|[.;:(]\s*)([\p{L}\d#]+)/gu)].map((match) => match.index + match[0].length - match[1].length));
  const knownTurkishName = new RegExp(`^(?:${turkishNames.source})$`, "u");
  const out: Array<{ token: string; matcher: RegExp }> = [];
  const placeholders = (token: string, at: number) => {
    let index = (pattern.slice(0, at).match(/#/g) ?? []).length;
    return escape(token).replace(/#/g, () => `\\{${++index}(?::[LlCc])?\\}`);
  };
  for (const match of pattern.matchAll(/[\p{L}\d#]+/gu)) {
    const token = match[0];
    if (token.length < 2 || translatedProper.has(token)) continue;
    // Türkçe harfli sözcük Türkçe ad ya da çekimli sözcüktür (Güney, Dağı, Spirulinalı); yalnız bilinen adlar (İzmir, Armatürk) korunur.
    if (TURKISH.test(token) && !knownTurkishName.test(token)) continue;
    const upper = (token.match(/\p{Lu}/gu) ?? []).length;
    const name = /^\p{Lu}/u.test(token) && !sentenceStarts.has(match.index);
    const code = /[\d#]/.test(token) || upper >= 2 || /\p{Lu}/u.test(token.slice(1));
    if (!code && !name) continue;
    // Kısaltma çoğul eki alabilir (LEDs); düz ad çoğul ve küçük harfle yazılabilir (Power Filters, shubunkins).
    const suffix = code ? (/\p{Lu}$/u.test(token) ? "s?" : "") : "(?:s|es)?";
    out.push({ token, matcher: new RegExp(`(?<![\\p{L}\\d])${placeholders(token, match.index)}${suffix}(?![\\p{L}\\d])`, code ? "u" : "iu") });
  }
  for (const match of pattern.matchAll(/[\p{Lu}\d#]+(?:-[\p{Lu}\d#]+)+(?![\p{L}\d])/gu)) {
    const token = match[0];
    if (!/#/.test(token) || !/\p{Lu}/u.test(token)) continue;
    out.push({ token, matcher: new RegExp(`(?<![\\p{L}\\d])${placeholders(token, match.index)}(?![\\p{L}\\d])`, "u") });
  }
  return out;
}

/**
 * Ürün ve seri adları (Glossy, Leddy, AquaClear…): yalnız Latin harfli, büyük harfle başlayan, Türkçe kalıplarda hiç küçük harfle geçmeyen
 * ve katalogdaki bir ürünün marka/model adında geçen sözcükler.
 */
export function productNameWords(patterns: readonly string[], catalogNames: Iterable<string>, translatedProper: ReadonlySet<string>): Set<string> {
  const lower = new Set(patterns.flatMap((pattern) => (pattern.match(WORD) ?? []).filter((word) => /^\p{Ll}/u.test(word)).map((word) => word.toLocaleLowerCase("tr"))));
  const named = new Set([...catalogNames].flatMap((name) => name.match(WORD) ?? []));
  return new Set(patterns.flatMap((pattern) => pattern.match(WORD) ?? []).filter((word) =>
    word.length >= 3 && /^[A-Z][A-Za-z]*$/.test(word) && !translatedProper.has(word) && !lower.has(word.toLocaleLowerCase("tr")) && named.has(word)));
}

/** Adların, kodların ve dilin sorunları: korunan ad ve kodlar, markalar, ürün/seri adları (büyük-küçük harf ve çoğul -s serbest), Türkçe harf, İspanya/voseo. */
export function nameProblems(tr: string, text: string, locale: "en" | "es", rules: NameRules): string[] {
  const problems: string[] = [];
  for (const { token, matcher } of protectedTokens(tr, rules.translatedProper, rules.turkishNames)) if (!matcher.test(text)) problems.push(`ad/kod ${token}`);
  const exact: string[] = text.match(/[\p{L}\d]+/gu) ?? [];
  for (const brand of (tr.match(/[\p{L}\d]+/gu) ?? []).filter((word) => rules.brands.has(word))) if (!exact.includes(brand)) problems.push(`marka ${brand}`);
  const words = (text.match(WORD) ?? []).map((word) => word.toLowerCase());
  for (const name of (tr.match(WORD) ?? []).filter((word) => rules.names.has(word))) {
    if (!words.includes(name.toLowerCase()) && !words.includes(`${name.toLowerCase()}s`)) problems.push(`ad ${name}`);
  }
  if (TURKISH.test(text.replace(rules.turkishNames, ""))) problems.push("Türkçe harf");
  if (locale === "es") problems.push(...spainOnlySpanish(text.replace(TOKEN, "")).map((word) => `İspanya/voseo ${word}`));
  if (!text.trim()) problems.push("boş");
  return problems;
}
