// Sağlık analizi motorunun uyarı ve ölçüt metinleri (docs/DECISIONS/0021-dil-altyapisi.md, 3. paket). Paketin ayrı giriş
// noktasıdır (`@aquamind/localization/engine`): ana giriş bu dosyayı içe aktarmadığı için metinler yalnız onları kullanan sayfanın
// (sağlık analizi) paketine girer; ana girişi kullanan öteki sayfalar büyümez.
import { DEFAULT_LOCALE, type Locale } from "./locales";
import { trEngine, type EngineMessages } from "./messages/tr-engine";

export type { EngineMessages, EngineTextParams } from "./messages/tr-engine";
export { engineTextFormat, type EngineTextFormat } from "./engine-format";

const catalogs: Record<Locale, EngineMessages> = { tr: trEngine };

/** Dilin motor metinleri; bilinmeyen dil varsayılan dile düşer. */
export function engineMessagesFor(locale: Locale): EngineMessages {
  return catalogs[locale] ?? catalogs[DEFAULT_LOCALE];
}
