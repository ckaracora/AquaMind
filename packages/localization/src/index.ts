// AquaMind dil altyapısı (docs/DECISIONS/0021-dil-altyapisi.md): dil dosyaları, dile göre biçimleme ve birim dönüşümü.
// Bağımlılıksızdır; web ve ileride telefon uygulaması aynı paketi kullanır.
import { DEFAULT_LOCALE, type Locale } from "./locales";
import { tr, type Messages } from "./messages/tr";

export { DEFAULT_LOCALE, LOCALE_TAGS, SUPPORTED_LOCALES, isLocale, type Locale } from "./locales";
export { formatCalendarDate, formatNumber, formatTemperature, formatVolume, type DateOrder, type TemperatureUnit, type VolumeUnit } from "./format";
export { CM_PER_INCH, LITERS_PER_US_GALLON, celsiusToFahrenheit, cmToInches, fahrenheitToCelsius, gallonsToLiters, inchesToCm, litersToGallons } from "./units";
export type { Messages } from "./messages/tr";

const catalogs: Record<Locale, Messages> = { tr };

/** Dilin arayüz metinleri; bilinmeyen dil varsayılan dile düşer. */
export function messagesFor(locale: Locale): Messages {
  return catalogs[locale] ?? catalogs[DEFAULT_LOCALE];
}
