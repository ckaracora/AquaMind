// Canlı aramasının başka dildeki ad dizini (src/lib/species-search-names.ts): derleme anında tek bir durağan JSON üretilir. İngilizce ve
// İspanyolca dil paketleri yalnız burada, sunucuda okunur; tarayıcı yalnız tür adlarını indirir. Kullanıcı verisi sunucuya gelmez.
import { loadLocaleBundle, localeBundle } from "@aquamind/localization";
import { catalogTranslator } from "@aquamind/localization/catalog";
import { speciesCatalog } from "@/data/catalog-species";
import { buildSpeciesSearchNames } from "@/lib/species-search-names-index";

export const dynamic = "force-static";

export async function GET() {
  await Promise.all([loadLocaleBundle("en"), loadLocaleBundle("es")]);
  const translators = (["en", "es"] as const).map((locale) => catalogTranslator(locale, localeBundle(locale)?.catalogSpecies));
  return Response.json(buildSpeciesSearchNames(speciesCatalog, translators));
}
