// Canlı aramasının başka dildeki ad dizininin saf kısmı (kurucu, tip, adres). React kancası içermez; böylece derleme anında dizini
// üreten sunucu yolu (src/app/catalog-data/species-search-names/route.ts) bunu güvenle içe aktarır. Kanca src/lib/species-search-names.ts'te.
import type { SpeciesProfile } from "@/data/catalog-species";
import { foldWords, type SpeciesOtherNames } from "@/lib/species-search";

/** Kimlik → türün başka dillerdeki adları (Türkçe adı ve eş adlarıyla aynı olanlar yazılmaz). */
export type SpeciesSearchNameIndex = Record<string, string[]>;
export const SPECIES_SEARCH_NAMES_PATH = "/catalog-data/species-search-names";

/** Dizini kurar: her tür için verilen dillerdeki ad (çevirisi olan), katlanınca kendi adlarından ve birbirinden farklıysa. */
export function buildSpeciesSearchNames(species: readonly SpeciesProfile[], translators: ReadonlyArray<(text: string) => string | undefined>): SpeciesSearchNameIndex {
  const index: SpeciesSearchNameIndex = {};
  for (const profile of species) {
    const seen = new Set([profile.commonName, profile.scientificName, ...(profile.aliases ?? [])].map(foldWords));
    const names: string[] = [];
    for (const translate of translators) {
      const name = translate(profile.commonName);
      if (!name) continue;
      const key = foldWords(name);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      names.push(name);
    }
    if (names.length) index[profile.id] = names;
  }
  return index;
}

/** Dizinden arama işlevi. */
export const otherNamesFrom = (index: SpeciesSearchNameIndex): SpeciesOtherNames => (profile) => index[profile.id];
