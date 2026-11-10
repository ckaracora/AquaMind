// Dil paketleri (docs/DECISIONS/0021-dil-altyapisi.md, 5. paket). Varsayılan dilin (Türkçe) metinleri her girişte durağan olarak
// bulunur. Başka bir dilin bütün metinleri (arayüz, motor, bitki uyarıları, hastalık ve gizlilik sayfaları, canlıların katalog çevirisi)
// tek bir parçadadır ve yalnız o dil seçilince yüklenir; Türkçe kullanan kimse bu metinleri indirmez. Yüklenen paket burada kaydedilir;
// girişlerin `...MessagesFor(locale)` fonksiyonları buradan okur. Sağlayıcı dili paketi yüklendikten sonra değiştirir; yüklenmemiş
// dilde varsayılan dilin metni döner.
import type { CatalogTexts } from "./catalog";
import { DEFAULT_LOCALE, type Locale } from "./locales";
import type { Messages } from "./messages/tr";
import type { DiseaseMessages } from "./messages/tr-diseases";
import type { EngineMessages } from "./messages/tr-engine";
import type { PlantWarningMessages } from "./messages/tr-plant-warnings";
import type { PrivacyMessages } from "./messages/tr-privacy";

export interface LocaleBundle {
  messages: Messages;
  engine: EngineMessages;
  plantWarnings: PlantWarningMessages;
  diseases: DiseaseMessages;
  privacy: PrivacyMessages;
  /** Canlılar aşamasının katalog çevirisi (`catalogTextKey` → metin). */
  catalogSpecies: CatalogTexts;
}

type OtherLocale = Exclude<Locale, "tr">;

const loaders: Record<OtherLocale, () => Promise<LocaleBundle>> = {
  en: () => import("./messages/en-bundle").then((module) => module.enBundle),
  es: () => import("./messages/es-bundle").then((module) => module.esBundle),
};

const bundles: Partial<Record<OtherLocale, LocaleBundle>> = {};

/** Yüklenmiş dil paketi; varsayılan dilde ve henüz yüklenmemiş dilde `undefined`. */
export function localeBundle(locale: Locale): LocaleBundle | undefined {
  return locale === DEFAULT_LOCALE ? undefined : bundles[locale as OtherLocale];
}

/** Dilin paketini yükler ve kaydeder. Varsayılan dil ve daha önce yüklenmiş dil hemen tamamlanır; yükleme hatası çağırana iletilir. */
export async function loadLocaleBundle(locale: Locale): Promise<void> {
  if (locale === DEFAULT_LOCALE || bundles[locale as OtherLocale]) return;
  bundles[locale as OtherLocale] = await loaders[locale as OtherLocale]();
}
