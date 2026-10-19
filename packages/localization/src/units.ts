// Birim dönüşümleri. Uygulama içeride metrik tutar (litre, °C, cm); bu fonksiyonlar yalnızca gösterim ve form girişi içindir.

/** 1 ABD galonu = 3,785411784 litre (tanım gereği). */
export const LITERS_PER_US_GALLON = 3.785411784;
/** 1 inç = 2,54 cm (tanım gereği). */
export const CM_PER_INCH = 2.54;

export type VolumeUnit = "liters" | "gallons";
export type TemperatureUnit = "celsius" | "fahrenheit";

export const VOLUME_SYMBOLS: Record<VolumeUnit, string> = { liters: "L", gallons: "gal" };
export const TEMPERATURE_SYMBOLS: Record<TemperatureUnit, string> = { celsius: "°C", fahrenheit: "°F" };

export const litersToGallons = (liters: number) => liters / LITERS_PER_US_GALLON;
export const gallonsToLiters = (gallons: number) => gallons * LITERS_PER_US_GALLON;
export const celsiusToFahrenheit = (celsius: number) => celsius * 9 / 5 + 32;
export const fahrenheitToCelsius = (fahrenheit: number) => (fahrenheit - 32) * 5 / 9;
export const cmToInches = (cm: number) => cm / CM_PER_INCH;
export const inchesToCm = (inches: number) => inches * CM_PER_INCH;

const roundTo = (value: number, digits: number) => Math.round(value * 10 ** digits) / 10 ** digits;

/** Kayıttaki litre değeri tercih edilen birimde. */
export const volumeFromLiters = (liters: number, unit: VolumeUnit) => unit === "gallons" ? litersToGallons(liters) : liters;
/** Tercih edilen birimde girilen hacim litre olarak; galondan gelen değer 0,1 L'ye yuvarlanır. */
export const volumeToLiters = (value: number, unit: VolumeUnit) => unit === "gallons" ? roundTo(gallonsToLiters(value), 1) : value;
/** Kayıttaki °C değeri tercih edilen birimde. */
export const temperatureFromCelsius = (celsius: number, unit: TemperatureUnit) => unit === "fahrenheit" ? celsiusToFahrenheit(celsius) : celsius;
/** Tercih edilen birimde girilen sıcaklık °C olarak; °F'tan gelen değer 0,01 °C'ye yuvarlanır. */
export const temperatureToCelsius = (value: number, unit: TemperatureUnit) => unit === "fahrenheit" ? roundTo(fahrenheitToCelsius(value), 2) : value;

/**
 * Hacim alanının formdaki başlangıç metni: litre olduğu gibi, galon en çok bir ondalıkla. Sayı alanı noktalı ondalık ister ("31.7").
 */
export function volumeInputText(liters: number, unit: VolumeUnit): string {
  return unit === "gallons" ? String(roundTo(litersToGallons(liters), 1)) : String(liters);
}

/**
 * Formdaki hacim metnini litreye çevirir. Metin başlangıç metniyle aynıysa (kullanıcı değiştirmediyse) kayıttaki değer korunur;
 * böylece galonla açılıp kaydedilen form kayıttaki litreyi kaydırmaz. Sayı olmayan metin `NaN` verir.
 */
export function volumeInputToLiters(text: string, unit: VolumeUnit, original?: number): number {
  if (original !== undefined && text === volumeInputText(original, unit)) return original;
  return text.trim() === "" ? Number.NaN : volumeToLiters(Number(text), unit);
}
