// Ekipman kataloğunun çevirisi (docs/DECISIONS/0021-dil-altyapisi.md, 7. paket): teknik bilgi satırı ve kapasite notu. Parçalı metin
// çevirisinin kuralları `catalog-segments.ts`'tedir; burada ekipman tabloları (dil başına ayrı parça, yalnız ekipman gösteren ekranlar
// yükler) ve eski adlar.
import { createSegmentTables, SEGMENT_SEPARATOR, segmentPattern, segmentText, type SegmentTexts } from "./catalog-segments";
import type { Locale } from "./locales";

export { turkishNumberValue } from "./catalog-segments";
export type EquipmentTexts = SegmentTexts;
export const EQUIPMENT_SEPARATOR = SEGMENT_SEPARATOR;
export const equipmentPattern = segmentPattern;
/** Katalogdaki ekipman metninin (teknik bilgi satırı, kapasite notu) seçili dildeki hâli; Türkçede metnin kendisi, çevirisi eksikse `undefined`. */
export const equipmentText = segmentText;

export const equipmentTables = createSegmentTables({
  en: () => import("./messages/en-catalog-equipment").then((module) => module.enCatalogEquipment),
  es: () => import("./messages/es-catalog-equipment").then((module) => module.esCatalogEquipment),
});

/** Yüklenmiş ekipman çeviri tablosu; Türkçede ve henüz yüklenmemiş dilde `undefined`. */
export const equipmentTextsFor = (locale: Locale): EquipmentTexts | undefined => equipmentTables.textsFor(locale);

/** Dilin ekipman çeviri tablosunu yükler ve kaydeder; Türkçede ve daha önce yüklenmiş dilde hemen tamamlanır. */
export const loadEquipmentTexts = (locale: Locale): Promise<EquipmentTexts | undefined> => equipmentTables.load(locale);
