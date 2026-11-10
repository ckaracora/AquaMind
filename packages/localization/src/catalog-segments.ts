// Parçalı katalog metinlerinin çevirisi (docs/DECISIONS/0021-dil-altyapisi.md, 7. ve 8. paket): ekipmanın teknik bilgi satırı ve kapasite
// notu, bakım ürünlerinin açıklaması. Metin " · " ile ayrılmış parçalardır; her parçanın sayıları "#" yapılınca kalıbı çıkar. Çeviri tablosu
// kalıbın anahtarından (`catalogTextKey`) çeviriye gider; çeviride {1}, {2}… parçanın sayılarını sırasıyla yerine koyar. {n:L} ve {n:l} litre,
// {n:C} ve {n:c} santigrat derecedir ve kullanıcının birimiyle yazılır (büyük harf birimiyle, küçük harf yalnız sayı: aralıklar
// "{1:l}–{2:L}"); sıcaklık farkı, doz oranı ve ambalaj boyu düz sayıdır. Öbür sayılar rakamlarına dokunulmadan dilin ayırıcılarıyla yazılır
// (kod, barkod ve öndeki sıfırlar korunur). Bir parçanın kalıbı tabloda yoksa metnin çevirisi yoktur (`undefined`). Türkçede metin olduğu
// gibi kalır. Tablolar katalog ve dil başına ayrı bir parçadadır (`createSegmentTables`). Eski tarayıcılar için geriye bakan (lookbehind)
// düzenli ifade kullanılmaz.
import { catalogTextKey } from "./catalog";
import type { DisplayFormat } from "./format";
import { DEFAULT_LOCALE, LOCALE_TAGS, type Locale } from "./locales";
import { celsiusToFahrenheit, litersToGallons } from "./units";

/** Kalıp anahtarı (`catalogTextKey(kalıp)`) → çeviri. */
export type SegmentTexts = Readonly<Record<string, string>>;

export const SEGMENT_SEPARATOR = " · ";
const NUMBER = /[-+]?\d+(?:[.,]\d+)*/gu;
const TOKEN = /\{(\d+)(?::([LlCc]))?\}/g;

/** Parçanın kalıbı ve sayıları; işaret (-10, +50) yalnız önünde harf ya da rakam yoksa sayıya aittir (MT-60 model adı, 1-2 aralığı). */
export function segmentPattern(segment: string): { pattern: string; numbers: string[] } {
  const numbers: string[] = [];
  const pattern = segment.replace(NUMBER, (match: string, offset: number) => {
    const signIsText = /^[-+]/.test(match) && /[\p{L}\d]$/u.test(segment.slice(0, offset));
    numbers.push(signIsText ? match.slice(1) : match);
    return signIsText ? `${match[0]}#` : "#";
  });
  return { pattern, numbers };
}

/** Türkçe yazılmış sayının değeri: virgül ondalık; noktadan sonra tam üç rakam binlik, başka sayıda rakam ondalıktır (kaynaktan gelen yazım). */
export function turkishNumberValue(text: string): number {
  return Number(text.replace(/\.(\d{3})(?=\D|$)/g, "$1").replace(/[.,](\d+)$/, ".$1").replace(/,/g, "."));
}

/** Dilin binlik ve ondalık ayırıcısı; biçimleyici dil başına bir kez kurulur (bütün katalog binlerce sayı yazar). */
const separatorCache = new Map<string, { group: string; decimal: string }>();
function separators(tag: string) {
  let found = separatorCache.get(tag);
  if (!found) {
    const parts = new Intl.NumberFormat(tag).formatToParts(1234.5);
    found = { group: parts.find((part) => part.type === "group")?.value ?? ",", decimal: parts.find((part) => part.type === "decimal")?.value ?? "." };
    separatorCache.set(tag, found);
  }
  return found;
}

/** Rakamlar aynen, ayırıcılar dilin: Türkçe virgül ondalık, nokta + tam üç rakam binlik, nokta + başka sayıda rakam ondalık. */
function localizedDigits(text: string, tag: string): string {
  const { group, decimal } = separators(tag);
  return text.replace(/([.,])(\d+)/g, (_, mark: string, digits: string) => (mark === "." && digits.length === 3 ? group : decimal) + digits);
}

function renderNumber(raw: string | undefined, type: string | undefined, fmt: DisplayFormat): string {
  if (raw === undefined) return "";
  const tag = LOCALE_TAGS[fmt.locale];
  if (type === "L" || type === "l") {
    const liters = turkishNumberValue(raw);
    const number = fmt.volumeUnit === "liters" ? localizedDigits(raw, tag) : fmt.number(litersToGallons(liters), { maximumFractionDigits: Math.abs(liters) < 4 ? 2 : 1 });
    return type === "L" ? `${number} ${fmt.volumeSymbol}` : number;
  }
  if (type === "C" || type === "c") {
    const number = fmt.temperatureUnit === "celsius" ? localizedDigits(raw, tag) : fmt.number(celsiusToFahrenheit(turkishNumberValue(raw)), { maximumFractionDigits: 1 });
    return type === "C" ? `${number} ${fmt.temperatureSymbol}` : number;
  }
  return localizedDigits(raw, tag);
}

/** Parçalı katalog metninin seçili dildeki hâli; Türkçede metnin kendisi, çevirisi eksikse `undefined`. */
export function segmentText(text: string, texts: SegmentTexts | undefined, fmt: DisplayFormat): string | undefined {
  if (fmt.locale === DEFAULT_LOCALE) return text;
  if (!texts) return undefined;
  const out: string[] = [];
  for (const segment of text.split(SEGMENT_SEPARATOR)) {
    const { pattern, numbers } = segmentPattern(segment);
    const key = catalogTextKey(pattern);
    if (!Object.prototype.hasOwnProperty.call(texts, key)) return undefined;
    out.push(texts[key].replace(TOKEN, (_, index: string, type?: string) => renderNumber(numbers[Number(index) - 1], type, fmt)));
  }
  return out.join(SEGMENT_SEPARATOR);
}

type OtherLocale = Exclude<Locale, "tr">;

/** Bir kataloğun dil başına ayrı parçadaki tabloları: yüklenmiş tablo (`textsFor`) ve yükleyici (`load`). Türkçede tablo yoktur. */
export interface SegmentTables {
  textsFor(locale: Locale): SegmentTexts | undefined;
  load(locale: Locale): Promise<SegmentTexts | undefined>;
}

export function createSegmentTables(loaders: Record<OtherLocale, () => Promise<SegmentTexts>>): SegmentTables {
  const tables: Partial<Record<OtherLocale, SegmentTexts>> = {};
  return {
    textsFor: (locale) => (locale === DEFAULT_LOCALE ? undefined : tables[locale as OtherLocale]),
    async load(locale) {
      if (locale === DEFAULT_LOCALE) return undefined;
      const other = locale as OtherLocale;
      tables[other] ??= await loaders[other]();
      return tables[other];
    },
  };
}
