// Ekipman kataloğunun çevirisi (docs/DECISIONS/0021-dil-altyapisi.md, 7. paket). Teknik bilgi satırı ve kapasite notu " · " ile
// ayrılmış parçalardır; her parçanın sayıları "#" yapılınca kalıbı çıkar. Çeviri tablosu kalıbın anahtarından (`catalogTextKey`) çeviriye
// gider; çeviride {1}, {2}… parçanın sayılarını sırasıyla yerine koyar. {n:L} ve {n:l} litre, {n:C} ve {n:c} santigrat derecedir ve
// kullanıcının birimiyle yazılır (büyük harf birimiyle, küçük harf yalnız sayı: aralıklar "{1:l}–{2:L}"); sıcaklık farkı düz sayıdır.
// Öbür sayılar rakamlarına dokunulmadan dilin ayırıcılarıyla yazılır (kod, barkod ve öndeki sıfırlar korunur). Bir parçanın kalıbı tabloda
// yoksa metnin çevirisi yoktur (`undefined`); ekran bugünkü sayısal özete ya da genel cümleye düşer. Türkçede metin olduğu gibi kalır.
// Tablolar dil başına ayrı bir parçadadır ve yalnız ekipman gösteren ekranlar yükler. Eski tarayıcılar için geriye bakan (lookbehind)
// düzenli ifade kullanılmaz.
import { catalogTextKey } from "./catalog";
import type { DisplayFormat } from "./format";
import { DEFAULT_LOCALE, LOCALE_TAGS, type Locale } from "./locales";
import { celsiusToFahrenheit, litersToGallons } from "./units";

/** Kalıp anahtarı (`catalogTextKey(kalıp)`) → çeviri. */
export type EquipmentTexts = Readonly<Record<string, string>>;

export const EQUIPMENT_SEPARATOR = " · ";
const NUMBER = /[-+]?\d+(?:[.,]\d+)*/gu;
const TOKEN = /\{(\d+)(?::([LlCc]))?\}/g;

/** Parçanın kalıbı ve sayıları; işaret (-10, +50) yalnız önünde harf ya da rakam yoksa sayıya aittir (MT-60 model adı, 1-2 aralığı). */
export function equipmentPattern(segment: string): { pattern: string; numbers: string[] } {
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

/** Katalogdaki ekipman metninin (teknik bilgi satırı, kapasite notu) seçili dildeki hâli; Türkçede metnin kendisi, çevirisi eksikse `undefined`. */
export function equipmentText(text: string, texts: EquipmentTexts | undefined, fmt: DisplayFormat): string | undefined {
  if (fmt.locale === DEFAULT_LOCALE) return text;
  if (!texts) return undefined;
  const out: string[] = [];
  for (const segment of text.split(EQUIPMENT_SEPARATOR)) {
    const { pattern, numbers } = equipmentPattern(segment);
    const key = catalogTextKey(pattern);
    if (!Object.prototype.hasOwnProperty.call(texts, key)) return undefined;
    out.push(texts[key].replace(TOKEN, (_, index: string, type?: string) => renderNumber(numbers[Number(index) - 1], type, fmt)));
  }
  return out.join(EQUIPMENT_SEPARATOR);
}

type OtherLocale = Exclude<Locale, "tr">;

const loaders: Record<OtherLocale, () => Promise<EquipmentTexts>> = {
  en: () => import("./messages/en-catalog-equipment").then((module) => module.enCatalogEquipment),
  es: () => import("./messages/es-catalog-equipment").then((module) => module.esCatalogEquipment),
};

const tables: Partial<Record<OtherLocale, EquipmentTexts>> = {};

/** Yüklenmiş ekipman çeviri tablosu; Türkçede ve henüz yüklenmemiş dilde `undefined`. */
export function equipmentTextsFor(locale: Locale): EquipmentTexts | undefined {
  return locale === DEFAULT_LOCALE ? undefined : tables[locale as OtherLocale];
}

/** Dilin ekipman çeviri tablosunu yükler ve kaydeder; Türkçede ve daha önce yüklenmiş dilde hemen tamamlanır. */
export async function loadEquipmentTexts(locale: Locale): Promise<EquipmentTexts | undefined> {
  if (locale === DEFAULT_LOCALE) return undefined;
  const other = locale as OtherLocale;
  tables[other] ??= await loaders[other]();
  return tables[other];
}
