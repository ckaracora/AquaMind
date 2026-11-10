// İspanyolca dil paketi (karar 0021, İspanyolca paketi): yalnız İspanyolca seçilince `loadLocaleBundle("es")` ile ayrı bir parça olarak
// yüklenir. Türkçe dosyalardan yalnız tip alır; Türkçe ve İngilizce metin bu parçaya girmez.
import type { LocaleBundle } from "../bundles";
import { es } from "./es";
import { esCatalogSpecies } from "./es-catalog-species";
import { esDiseases } from "./es-diseases";
import { esEngine } from "./es-engine";
import { esPlantWarnings } from "./es-plant-warnings";
import { esPrivacy } from "./es-privacy";

export const esBundle: LocaleBundle = {
  messages: es,
  engine: esEngine,
  plantWarnings: esPlantWarnings,
  diseases: esDiseases,
  privacy: esPrivacy,
  catalogSpecies: esCatalogSpecies,
};
