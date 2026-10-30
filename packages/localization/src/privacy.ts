// Gizlilik sayfasının metinleri. Paketin ayrı giriş noktasıdır (`@aquamind/localization/privacy`): ana giriş bu dosyayı
// içe aktarmadığı için metinler yalnız bu sayfanın paketine girer.
import { DEFAULT_LOCALE, type Locale } from "./locales";
import { trPrivacy, type PrivacyMessages } from "./messages/tr-privacy";

export type { PrivacyMessages } from "./messages/tr-privacy";

const catalogs: Record<Locale, PrivacyMessages> = { tr: trPrivacy };

/** Dilin gizlilik sayfası metinleri; bilinmeyen dil varsayılan dile düşer. */
export function privacyMessagesFor(locale: Locale): PrivacyMessages {
  return catalogs[locale] ?? catalogs[DEFAULT_LOCALE];
}
