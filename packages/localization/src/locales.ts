// Desteklenen diller (docs/DECISIONS/0021-dil-altyapisi.md). Yeni dil, mesaj dosyaları tamamlanınca buraya ve dil paketlerinin
// yükleyicisine (`bundles.ts`) eklenir; dosyalar Türkçe dosyaların tiplerini karşılamazsa derleme hata verir.
export const SUPPORTED_LOCALES = ["tr", "en", "es"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "tr";

/**
 * Tarih ve sayı biçimi için kullanılan BCP 47 dil etiketi. İngilizce Amerikan İngilizcesi, İspanyolca Latin Amerika ortak İspanyolcasıdır
 * (ürün sahibi kararları, 2026-10-31).
 */
export const LOCALE_TAGS: Record<Locale, string> = { tr: "tr-TR", en: "en-US", es: "es-419" };

/** Dil seçiminde her dilin kendi dilindeki adı (çevrilmez). */
export const LOCALE_NAMES: Record<Locale, string> = { tr: "Türkçe", en: "English", es: "Español" };

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}
