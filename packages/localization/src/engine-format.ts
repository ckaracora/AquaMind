// Motor metinlerinde sayıların ve ölçülerin yazımı (docs/DECISIONS/0021-dil-altyapisi.md, 3b). Dile ve kullanıcının hacim tercihine
// bağlıdır; dil dosyaları sayıyı kendileri biçimlemez, bu biçimleyiciyi kullanır. Değerler motordan metrik gelir (litre, cm).
import type { DisplayFormat } from "./format";

export interface EngineTextFormat {
  /** Sayı, dilin ayırıcılarıyla, en çok bir ondalık (adet, yüzde, watt): "12", "1.200". */
  number(value: number): string;
  /** Tek ondalıklı sayı (çevrim/saat): "4,0", "13,5". */
  cycles(value: number): string;
  /**
   * Su ölçümü, en az `digits` ondalık hassasiyetle: "0,25", "0,0123". Sıfırdan büyük değer "0", `other` ile karşılaştırılan değer de
   * ondan farklıyken aynı görünmesin diye gerektiğinde daha çok ondalık yazılır ("0,2004 ppm; güvenli üst sınır 0,2 ppm").
   */
  measurement(value: number, digits?: number, other?: number): string;
  /** Hacim, tercih edilen birimde ve kısaltmasıyla: "120 L", "31,7 gal". `other` ve sıfır için `measurement` ile aynı kural. */
  volume(liters: number, other?: number): string;
  /** Uzunluk, santimetre (uzunluk birimi tercihi yok): "13,5 cm". */
  length(cm: number): string;
}

/** Önce denenecek en çok ondalık. */
const MAX_FRACTION_DIGITS = 6;
/**
 * Son çare: Intl'in izin verdiği en çok anlamlı basamak. Intl bu ayarla sayının en kısa tam yazımını verir ("0,0000001",
 * "600,0000001"); yazılan sayı farklıysa metin de farklıdır, sıfırdan büyükse metin "0" değildir. Tek sınır: hacim galona
 * çevrilirken sayının yaklaşık 15. anlamlı basamağından sonraki farklar ve sıfıra çok yakın (yaklaşık 1e-300 litre altı) hacimler
 * çevirmede kaybolabilir; uygulamadaki hacimler bu sınırların çok uzağındadır.
 */
const EXACT: Intl.NumberFormatOptions = { maximumSignificantDigits: 21 };

/**
 * Değeri `digits` ondalıkla yazar. Sıfırdan büyük bir değer "0" görünüyorsa ya da karşılaştırılan değerden farklıyken onunla aynı
 * görünüyorsa ondalık sayısını artırır (en çok altı); bu da yetmezse tam yazımı kullanır. Böylece yuvarlama, uyarının söylediği farkı
 * (sınırın üstünde, sıfırdan büyük) gizlemez.
 */
function distinct(write: (value: number, options: Intl.NumberFormatOptions) => string, value: number, digits: number, other?: number): string {
  for (let fraction = digits; fraction <= MAX_FRACTION_DIGITS; fraction++) {
    const options = { maximumFractionDigits: fraction };
    const text = write(value, options);
    const hidesValue = value !== 0 && text === write(0, options);
    const hidesDifference = other !== undefined && other !== value && text === write(other, options);
    if (!hidesValue && !hidesDifference) return text;
  }
  return write(value, EXACT);
}

/** Ekranın biçimleyicisinden (`createDisplayFormat`) motor metinlerinin biçimleyicisini kurar. */
export function engineTextFormat(display: DisplayFormat): EngineTextFormat {
  const decimal = (value: number, options: Intl.NumberFormatOptions) => display.number(value, options);
  const volume = (liters: number, options: Intl.NumberFormatOptions) => display.volume(liters, options);
  return {
    number: (value) => display.number(value),
    cycles: (value) => display.number(value, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
    measurement: (value, digits = 3, other) => distinct(decimal, value, digits, other),
    volume: (liters, other) => distinct(volume, liters, 1, other),
    length: (cm) => `${display.number(cm)} cm`,
  };
}
