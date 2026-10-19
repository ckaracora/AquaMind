// Dile ve kullanıcı tercihine göre gösterim. Değerler metrik gelir; birim tercihi yalnızca ekranda uygulanır.
import { LOCALE_TAGS, type Locale } from "./locales";
import { celsiusToFahrenheit, litersToGallons } from "./units";

export type VolumeUnit = "liters" | "gallons";
export type TemperatureUnit = "celsius" | "fahrenheit";
export type DateOrder = "day-first" | "month-first";

export function formatNumber(value: number, locale: Locale, options: Intl.NumberFormatOptions = { maximumFractionDigits: 1 }): string {
  return value.toLocaleString(LOCALE_TAGS[locale], options);
}

/** Hacim: litre değeri tercih edilen birimde, birim kısaltmasıyla ("120 L", "31,7 gal"). */
export function formatVolume(liters: number, unit: VolumeUnit, locale: Locale): string {
  return unit === "gallons" ? `${formatNumber(litersToGallons(liters), locale)} gal` : `${formatNumber(liters, locale)} L`;
}

/** Sıcaklık: °C değeri tercih edilen birimde ("25,4 °C", "77,7 °F"). */
export function formatTemperature(celsius: number, unit: TemperatureUnit, locale: Locale): string {
  return unit === "fahrenheit" ? `${formatNumber(celsiusToFahrenheit(celsius), locale)} °F` : `${formatNumber(celsius, locale)} °C`;
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Takvim tarihi: "GG.AA.YYYY" ya da "AA/GG/YYYY" (ayarlar sayfasındaki tarih biçimi). ISO tarih ("2026-10-19") saat dilimine göre
 * kaymasın diye yerel takvim günü olarak okunur. Takvimde olmayan gün ("2026-02-29", "2026-04-31") başka bir güne kaydırılmaz;
 * geçersiz girdi boş metin verir.
 */
export function formatCalendarDate(value: string | Date, order: DateOrder): string {
  const iso = typeof value === "string" ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(value) : null;
  const date = iso ? new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3])) : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  if (iso && (date.getFullYear() !== Number(iso[1]) || date.getMonth() !== Number(iso[2]) - 1 || date.getDate() !== Number(iso[3]))) return "";
  const day = pad(date.getDate()), month = pad(date.getMonth() + 1), year = date.getFullYear();
  return order === "month-first" ? `${month}/${day}/${year}` : `${day}.${month}.${year}`;
}
