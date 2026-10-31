// Bitki uyarılarının metinleri ve sayı biçimi (docs/DECISIONS/0025-bitki-uyarilari.md). Paketin ayrı giriş noktasıdır
// (`@aquamind/localization/plant-warnings`): ana giriş bu dosyayı içe aktarmadığı için metinler yalnız bitki ve sağlık sayfalarının
// paketine girer.
import { distinct } from "./engine-format";
import type { DisplayFormat } from "./format";
import { localeBundle } from "./bundles";
import { DEFAULT_LOCALE, type Locale } from "./locales";
import { trPlantWarnings, type PlantWarningMessages } from "./messages/tr-plant-warnings";

export type { PlantWarningMessages, PlantWarningParams } from "./messages/tr-plant-warnings";

/**
 * Bitki uyarılarında sayıların yazımı. Karşılaştırılan değer (`other`, ör. aşılan sınır) ondan farklıyken aynı görünmesin diye
 * gerektiğinde daha çok ondalık yazılır ("son ölçüm 28,01 °C", aralık "22–28 °C").
 */
export interface PlantWarningFormat {
  /** Birimsiz su ölçümü (pH), en az iki ondalık hassasiyetle: "6,5", "7,25". */
  measurement(value: number, other?: number): string;
  /** Sıcaklık, tercih edilen birimde ve simgesiyle: "28 °C", "82,4 °F". */
  temperature(celsius: number, other?: number): string;
  /** Birimsiz, tercih edilen birimdeki sıcaklık (aralığın ilk ucu: "22–28 °C"). */
  temperatureNumber(celsius: number): string;
  /** Uzunluk, santimetre: "40 cm". */
  length(cm: number, other?: number): string;
}

/** Ekranın biçimleyicisinden (`createDisplayFormat`) bitki uyarılarının biçimleyicisini kurar. */
export function plantWarningFormat(display: DisplayFormat): PlantWarningFormat {
  // Ekranın sıcaklık yazımıyla aynı hassasiyet: °C iki ondalık, °F (çevrilmiş değer) bir ondalık.
  const temperatureDigits = display.temperatureUnit === "fahrenheit" ? 1 : 2;
  const temperatureNumber = (celsius: number, other?: number) => distinct((value, options) => display.temperatureNumber(value, options), celsius, temperatureDigits, other);
  const decimal = (value: number, options: Intl.NumberFormatOptions) => display.number(value, options);
  return {
    measurement: (value, other) => distinct(decimal, value, 2, other),
    temperature: (celsius, other) => `${temperatureNumber(celsius, other)} ${display.temperatureSymbol}`,
    temperatureNumber: (celsius) => temperatureNumber(celsius),
    length: (cm, other) => `${distinct(decimal, cm, 1, other)} cm`,
  };
}

/** Dilin bitki uyarısı metinleri; bilinmeyen ya da paketi henüz yüklenmemiş dil varsayılan dile düşer. */
export function plantWarningMessagesFor(locale: Locale): PlantWarningMessages {
  return locale === DEFAULT_LOCALE ? trPlantWarnings : localeBundle(locale)?.plantWarnings ?? trPlantWarnings;
}
