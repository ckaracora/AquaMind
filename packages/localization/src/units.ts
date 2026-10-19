// Birim dönüşümleri. Uygulama içeride metrik tutar (litre, °C, cm); bu fonksiyonlar yalnızca gösterim ve form girişi içindir.

/** 1 ABD galonu = 3,785411784 litre (tanım gereği). */
export const LITERS_PER_US_GALLON = 3.785411784;
/** 1 inç = 2,54 cm (tanım gereği). */
export const CM_PER_INCH = 2.54;

export const litersToGallons = (liters: number) => liters / LITERS_PER_US_GALLON;
export const gallonsToLiters = (gallons: number) => gallons * LITERS_PER_US_GALLON;
export const celsiusToFahrenheit = (celsius: number) => celsius * 9 / 5 + 32;
export const fahrenheitToCelsius = (fahrenheit: number) => (fahrenheit - 32) * 5 / 9;
export const cmToInches = (cm: number) => cm / CM_PER_INCH;
export const inchesToCm = (inches: number) => inches * CM_PER_INCH;
