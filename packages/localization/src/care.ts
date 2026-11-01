// Bakım ürünü kataloğunun çevirisi (docs/DECISIONS/0021-dil-altyapisi.md, 8. paket): ürün açıklaması. Parçalı metin çevirisinin kuralları
// `catalog-segments.ts`'tedir; burada bakım ürünü tabloları (dil başına ayrı parça, yalnız ürün kataloğu sayfası yükler).
import { createSegmentTables, segmentText, type SegmentTexts } from "./catalog-segments";
import type { Locale } from "./locales";

export type CareTexts = SegmentTexts;
/** Katalogdaki bakım ürünü açıklamasının seçili dildeki hâli; Türkçede metnin kendisi, çevirisi eksikse `undefined`. */
export const careText = segmentText;

export const careTables = createSegmentTables({
  en: () => import("./messages/en-catalog-care").then((module) => module.enCatalogCare),
  es: () => import("./messages/es-catalog-care").then((module) => module.esCatalogCare),
});

/** Yüklenmiş bakım ürünü çeviri tablosu; Türkçede ve henüz yüklenmemiş dilde `undefined`. */
export const careTextsFor = (locale: Locale): CareTexts | undefined => careTables.textsFor(locale);

/** Dilin bakım ürünü çeviri tablosunu yükler ve kaydeder; Türkçede ve daha önce yüklenmiş dilde hemen tamamlanır. */
export const loadCareTexts = (locale: Locale): Promise<CareTexts | undefined> => careTables.load(locale);
