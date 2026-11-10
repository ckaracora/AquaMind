// AquaMind dil altyapısı (docs/DECISIONS/0021-dil-altyapisi.md): dil dosyaları, dile göre biçimleme ve birim dönüşümü.
// Bağımlılıksızdır; web ve ileride telefon uygulaması aynı paketi kullanır.
import { localeBundle } from "./bundles";
import { DEFAULT_LOCALE, type Locale } from "./locales";
import { tr, type Messages } from "./messages/tr";

export { DEFAULT_LOCALE, LOCALE_NAMES, LOCALE_TAGS, SUPPORTED_LOCALES, isLocale, type Locale } from "./locales";
export { loadLocaleBundle, localeBundle, type LocaleBundle } from "./bundles";
export {
  createDisplayFormat, formatCalendarDate, formatDate, formatNumber, formatTemperature, formatVolume,
  type DateOrder, type DisplayFormat, type DisplayPreferences,
} from "./format";
export {
  CM_PER_INCH, LITERS_PER_US_GALLON, TEMPERATURE_SYMBOLS, VOLUME_SYMBOLS, celsiusToFahrenheit, cmToInches, fahrenheitToCelsius,
  gallonsToLiters, inchesToCm, litersToGallons, temperatureFromCelsius, temperatureToCelsius, volumeFromLiters, volumeInputText,
  volumeInputToLiters, volumeToLiters, type TemperatureUnit, type VolumeUnit,
} from "./units";
export type { Messages } from "./messages/tr";

/** Dilin arayüz metinleri; bilinmeyen ya da paketi henüz yüklenmemiş dil varsayılan dile düşer (`loadLocaleBundle`). */
export function messagesFor(locale: Locale): Messages {
  return locale === DEFAULT_LOCALE ? tr : localeBundle(locale)?.messages ?? tr;
}
