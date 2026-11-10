// Gizlilik sayfasının metinleri. Paketin ayrı giriş noktasıdır (`@aquamind/localization/privacy`): ana giriş bu dosyayı
// içe aktarmadığı için metinler yalnız bu sayfanın paketine girer.
import { localeBundle } from "./bundles";
import { DEFAULT_LOCALE, type Locale } from "./locales";
import { trPrivacy, type PrivacyMessages } from "./messages/tr-privacy";

export type { PrivacyMessages } from "./messages/tr-privacy";

/** Dilin gizlilik sayfası metinleri; bilinmeyen ya da paketi henüz yüklenmemiş dil varsayılan dile düşer. */
export function privacyMessagesFor(locale: Locale): PrivacyMessages {
  return locale === DEFAULT_LOCALE ? trPrivacy : localeBundle(locale)?.privacy ?? trPrivacy;
}
