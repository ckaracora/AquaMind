// Tür bakım bilgisinin çevirisi (veri sprinti E3): beslenme, cinsiyet ayrımı ve üreme metinleri. Metinler Türkçe yazılır
// (`src/data/species-care.ts`); çeviri tablosu Türkçe metnin anahtarıyla (`catalogTextKey`) eşleşir, dil başına ayrı parçada yüklenir ve
// yalnız bakım bilgisini gösteren ekran yükler. Çevirisi olmayan metin için `undefined` döner: ekran gizler ya da Türkçeyi gösterir.
import { catalogTranslator, type CatalogTexts, type CatalogTranslator } from "./catalog";
import { createSegmentTables } from "./catalog-segments";
import type { Locale } from "./locales";

export type SpeciesCareTexts = CatalogTexts;

export const speciesCareTables = createSegmentTables({
  en: () => import("./messages/en-catalog-species-care").then((module) => module.enCatalogSpeciesCare),
  es: () => import("./messages/es-catalog-species-care").then((module) => module.esCatalogSpeciesCare),
});

/** Yüklenmiş bakım bilgisi çeviri tablosu; Türkçede ve henüz yüklenmemiş dilde `undefined`. */
export const speciesCareTextsFor = (locale: Locale): SpeciesCareTexts | undefined => speciesCareTables.textsFor(locale);

/** Dilin tablosunu yükler ve kaydeder; Türkçede ve daha önce yüklenmiş dilde hemen tamamlanır. */
export const loadSpeciesCareTexts = (locale: Locale): Promise<SpeciesCareTexts | undefined> => speciesCareTables.load(locale);

/** Bakım metnini seçili dile çeviren fonksiyon (Türkçede metin olduğu gibi; tablo yüklenmemişse ya da çeviri yoksa `undefined`). */
export const speciesCareTranslator = (locale: Locale): CatalogTranslator => catalogTranslator(locale, speciesCareTextsFor(locale));
