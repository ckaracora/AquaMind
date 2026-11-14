"use client";

// Tür bakım bilgisinin çevirmeni (veri sprinti E3, tür kartı F): beslenme, cinsiyet ayrımı ve üreme metinleri Türkçe metnin anahtarıyla
// (`catalogTextKey`) çevrilir; tablo dil başına ayrı parçadır ve yalnız tür kartı açılınca yüklenir (`@aquamind/localization/species-care`).
// Türkçede metin olduğu gibi kalır. Başka dilde tablo yüklenene kadar ya da çevirisi olmayan metinde çevirmen `undefined` verir; ekran o metni
// göstermez (ürün sahibi kararı 2026-10-30: çevirisi olmayan not gösterilmez). Tablo dilin kendisiyle tutulur, eski dilin tablosu kullanılmaz.
import { useCallback, useEffect, useState } from "react";
import { catalogTranslator, type CatalogTexts } from "@aquamind/localization/catalog";
import { speciesCareTables } from "@aquamind/localization/species-care";
import { useI18n } from "@/providers/i18n-provider";
import type { Locale } from "@aquamind/localization";

export function useSpeciesCareText(): (text: string) => string | undefined {
  const { locale } = useI18n();
  const [loaded, setLoaded] = useState<{ locale: Locale; texts?: CatalogTexts }>(() => ({ locale, texts: speciesCareTables.textsFor(locale) }));
  useEffect(() => {
    let active = true;
    setLoaded({ locale, texts: speciesCareTables.textsFor(locale) });
    speciesCareTables.load(locale)
      .then((texts) => { if (active) setLoaded({ locale, texts }); })
      .catch(() => undefined);
    return () => { active = false; };
  }, [locale]);
  const texts = loaded.locale === locale ? loaded.texts : undefined;
  return useCallback((text: string) => catalogTranslator(locale, texts)(text), [locale, texts]);
}
