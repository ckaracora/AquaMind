// Dile ve kullanıcı tercihine göre gösterim. Değerler metrik gelir; birim tercihi yalnızca ekranda uygulanır.
import { LOCALE_TAGS, type Locale } from "./locales";
import { TEMPERATURE_SYMBOLS, VOLUME_SYMBOLS, temperatureFromCelsius, volumeFromLiters, type TemperatureUnit, type VolumeUnit } from "./units";

export type { TemperatureUnit, VolumeUnit } from "./units";
export type DateOrder = "day-first" | "month-first";

export function formatNumber(value: number, locale: Locale, options: Intl.NumberFormatOptions = { maximumFractionDigits: 1 }): string {
  return value.toLocaleString(LOCALE_TAGS[locale], options);
}

/** Hacim: litre değeri tercih edilen birimde, birim kısaltmasıyla ("120 L", "31,7 gal"). */
export function formatVolume(liters: number, unit: VolumeUnit, locale: Locale, options?: Intl.NumberFormatOptions): string {
  return `${formatNumber(volumeFromLiters(liters, unit), locale, options)} ${VOLUME_SYMBOLS[unit]}`;
}

/** Sıcaklık: °C değeri tercih edilen birimde ("25,4 °C", "77,7 °F"). */
export function formatTemperature(celsius: number, unit: TemperatureUnit, locale: Locale, options?: Intl.NumberFormatOptions): string {
  return `${formatNumber(temperatureFromCelsius(celsius, unit), locale, options)} ${TEMPERATURE_SYMBOLS[unit]}`;
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Tarih girdisini okur. ISO tarih ("2026-10-19") saat dilimine göre kaymasın diye yerel takvim günü olarak okunur; takvimde olmayan
 * gün ("2026-02-29", "2026-04-31") başka bir güne kaydırılmaz. Geçersiz girdi `undefined` verir.
 */
function readDate(value: string | Date): Date | undefined {
  const iso = typeof value === "string" ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(value) : null;
  const date = iso ? new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3])) : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  if (iso && (date.getFullYear() !== Number(iso[1]) || date.getMonth() !== Number(iso[2]) - 1 || date.getDate() !== Number(iso[3]))) return undefined;
  return date;
}

/** Takvim tarihi: "GG.AA.YYYY" ya da "AA/GG/YYYY" (ayarlar sayfasındaki tarih biçimi). Geçersiz girdi boş metin verir. */
export function formatCalendarDate(value: string | Date, order: DateOrder): string {
  const date = readDate(value);
  if (!date) return "";
  const day = pad(date.getDate()), month = pad(date.getMonth() + 1), year = date.getFullYear();
  return order === "month-first" ? `${month}/${day}/${year}` : `${day}.${month}.${year}`;
}

/** Ay adlı ya da saatli tarih, dilin kuralıyla ("19 Eki 2026", "19 Ekim Pazartesi"). Geçersiz girdi boş metin verir. */
export function formatDate(value: string | Date, locale: Locale, options: Intl.DateTimeFormatOptions): string {
  const date = readDate(value);
  return date ? new Intl.DateTimeFormat(LOCALE_TAGS[locale], options).format(date) : "";
}

/** Ekranların kullandığı tercihler (ayarlar sayfası; `@aquamind/domain` içindeki `Preferences` bu biçimi karşılar). */
export interface DisplayPreferences {
  temperature: TemperatureUnit;
  volume: VolumeUnit;
  dateFormat: DateOrder;
}

/** Su ölçümleri (pH, ppm, özgül ağırlık) yuvarlanmadan yazılır: kullanıcı 0,25 ppm ya da 1,025 SG girmiş olabilir. */
const MEASUREMENT_DIGITS: Intl.NumberFormatOptions = { maximumFractionDigits: 3 };

/** Dile ve kullanıcı tercihine bağlanmış biçimleyiciler; ekranlar `tr-TR` ya da birim yazmak yerine bunları kullanır. */
export function createDisplayFormat(locale: Locale, preferences: DisplayPreferences) {
  // Girilen °C değeri iki ondalığa kadar korunur; °F'a çevrilen değer termometre gibi tek ondalıkla yazılır.
  const temperatureDigits: Intl.NumberFormatOptions = { maximumFractionDigits: preferences.temperature === "fahrenheit" ? 1 : 2 };
  return {
    locale,
    volumeUnit: preferences.volume,
    temperatureUnit: preferences.temperature,
    volumeSymbol: VOLUME_SYMBOLS[preferences.volume],
    temperatureSymbol: TEMPERATURE_SYMBOLS[preferences.temperature],
    number: (value: number, options?: Intl.NumberFormatOptions) => formatNumber(value, locale, options),
    /** Su ölçümü (birimsiz sayı): en çok üç ondalık, dilin ayırıcılarıyla ("7,2", "0,25", "1,025"). */
    measurement: (value: number) => formatNumber(value, locale, MEASUREMENT_DIGITS),
    volume: (liters: number, options?: Intl.NumberFormatOptions) => formatVolume(liters, preferences.volume, locale, options),
    /** Birimsiz, tercih edilen birimdeki hacim (aralık yazarken: "60–200" + birim). */
    volumeNumber: (liters: number, options?: Intl.NumberFormatOptions) => formatNumber(volumeFromLiters(liters, preferences.volume), locale, options),
    temperature: (celsius: number, options: Intl.NumberFormatOptions = temperatureDigits) => formatTemperature(celsius, preferences.temperature, locale, options),
    /** Birimsiz, tercih edilen birimdeki sıcaklık (tablo hücresi ve birimi ayrı yazılan kartlar için). */
    temperatureNumber: (celsius: number, options: Intl.NumberFormatOptions = temperatureDigits) => formatNumber(temperatureFromCelsius(celsius, preferences.temperature), locale, options),
    calendarDate: (value: string | Date) => formatCalendarDate(value, preferences.dateFormat),
    date: (value: string | Date, options: Intl.DateTimeFormatOptions) => formatDate(value, locale, options),
  };
}

export type DisplayFormat = ReturnType<typeof createDisplayFormat>;
