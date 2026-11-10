// Katalog metinlerinin çevirisi (docs/DECISIONS/0021-dil-altyapisi.md, 4. paket). Paketin ayrı giriş noktasıdır
// (`@aquamind/localization/catalog`). Katalog Türkçe yazılır; çeviri tablosu Türkçe metnin içeriğinden üretilen kısa bir anahtarla
// (`catalogTextKey`) eşleşir. Türkçe metin değişirse anahtarı da değişir ve eski çeviri artık eşleşmez: eskimiş çeviri sessizce
// gösterilmez, eksik çeviri olarak görünür. Motorun uyarılarındaki katalog metinleri de (tür adı, bakım notu, kaynağın koşulu)
// aynı anahtarla çevrilir; bu yüzden motorun çıktısı değişmez.
import { DEFAULT_LOCALE, type Locale } from "./locales";

/** Bir dilin katalog çevirileri: `catalogTextKey(türkçeMetin)` → çeviri. */
export type CatalogTexts = Readonly<Record<string, string>>;

/** Katalog metnini çeviren fonksiyon; çevirisi olmayan metinde `undefined` döner. */
export type CatalogTranslator = (text: string) => string | undefined;

const FNV_PRIME = 0x01000193;

function fnv1a(text: string, offset: number): number {
  let hash = offset >>> 0;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, FNV_PRIME) >>> 0;
  }
  return hash >>> 0;
}

/**
 * Türkçe katalog metninin çeviri anahtarı: metnin UTF-16 kod birimleri üzerinden iki ayrı başlangıç değeriyle FNV-1a (32 bit),
 * 16 onaltılık karakter. Metin değişmeden anahtar değişmez; tarayıcıda ve telefonda aynı sonucu verir.
 */
export function catalogTextKey(text: string): string {
  const first = fnv1a(text, 0x811c9dc5);
  const second = fnv1a(text, 0x050c5d1f);
  return first.toString(16).padStart(8, "0") + second.toString(16).padStart(8, "0");
}

/** Varsayılan dil (Türkçe) katalogun kendi dilidir: metin olduğu gibi kalır. Başka dilde tablodaki çeviri kullanılır. */
export function catalogTranslator(locale: Locale, texts?: CatalogTexts): CatalogTranslator {
  if (locale === DEFAULT_LOCALE) return (text) => text;
  return (text) => {
    const key = catalogTextKey(text);
    return texts && Object.prototype.hasOwnProperty.call(texts, key) ? texts[key] : undefined;
  };
}
