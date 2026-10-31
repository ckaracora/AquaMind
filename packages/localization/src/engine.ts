// Sağlık analizi motorunun uyarı ve ölçüt metinleri (docs/DECISIONS/0021-dil-altyapisi.md, 3. paket). Paketin ayrı giriş
// noktasıdır (`@aquamind/localization/engine`): ana giriş bu dosyayı içe aktarmadığı için metinler yalnız onları kullanan sayfanın
// (sağlık analizi) paketine girer; ana girişi kullanan öteki sayfalar büyümez.
import { localeBundle } from "./bundles";
import { DEFAULT_LOCALE, type Locale } from "./locales";
import { trEngine, type EngineMessages } from "./messages/tr-engine";

export type { EngineMessages, EngineTextParams } from "./messages/tr-engine";
export { engineTextFormat, type EngineTextFormat } from "./engine-format";

/** Dilin motor metinleri; bilinmeyen ya da paketi henüz yüklenmemiş dil varsayılan dile düşer. */
export function engineMessagesFor(locale: Locale): EngineMessages {
  return locale === DEFAULT_LOCALE ? trEngine : localeBundle(locale)?.engine ?? trEngine;
}
