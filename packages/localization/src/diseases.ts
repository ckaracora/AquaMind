// Hastalık ve tedavi sayfasının metinleri (docs/DECISIONS/0022-hastalik-ve-tedavi-sayfasi.md). Paketin ayrı giriş noktasıdır
// (`@aquamind/localization/diseases`): ana giriş bu dosyayı içe aktarmadığı için metinler yalnız bu sayfanın paketine girer.
import { DEFAULT_LOCALE, type Locale } from "./locales";
import { trDiseases, type DiseaseMessages } from "./messages/tr-diseases";

export type { DiseaseMessages } from "./messages/tr-diseases";

const catalogs: Record<Locale, DiseaseMessages> = { tr: trDiseases };

/** Dilin hastalık sayfası metinleri; bilinmeyen dil varsayılan dile düşer. */
export function diseaseMessagesFor(locale: Locale): DiseaseMessages {
  return catalogs[locale] ?? catalogs[DEFAULT_LOCALE];
}
