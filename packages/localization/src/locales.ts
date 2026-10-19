// Desteklenen diller (docs/DECISIONS/0021-dil-altyapisi.md). Yeni dil, mesaj dosyası tamamlanınca buraya eklenir;
// mesaj dosyası `Messages` tipini karşılamazsa derleme hata verir.
export const SUPPORTED_LOCALES = ["tr"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "tr";

/** Tarih ve sayı biçimi için kullanılan BCP 47 dil etiketi. */
export const LOCALE_TAGS: Record<Locale, string> = { tr: "tr-TR" };

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}
