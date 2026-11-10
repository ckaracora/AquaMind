// İngilizce dil paketi (karar 0021, 5. paket): yalnız İngilizce seçilince `loadLocaleBundle("en")` ile ayrı bir parça olarak yüklenir.
// Türkçe dosyalardan yalnız tip alır; Türkçe metin bu parçaya girmez.
import type { LocaleBundle } from "../bundles";
import { en } from "./en";
import { enCatalogSpecies } from "./en-catalog-species";
import { enDiseases } from "./en-diseases";
import { enEngine } from "./en-engine";
import { enPlantWarnings } from "./en-plant-warnings";
import { enPrivacy } from "./en-privacy";

export const enBundle: LocaleBundle = {
  messages: en,
  engine: enEngine,
  plantWarnings: enPlantWarnings,
  diseases: enDiseases,
  privacy: enPrivacy,
  catalogSpecies: enCatalogSpecies,
};
