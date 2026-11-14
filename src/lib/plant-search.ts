// Bitki araması her dilde İngilizce ortak adda da arar (2026-11-14 sprinti): Türk hobiciler "java fern", "hornwort" gibi adları çok kullanır.
// Katalogun araması (src/data/catalog-plants.ts `searchPlants`) İngilizce adı yalnız İngilizce ekranda okur; bu işlev o dilin sonuçlarının
// arkasına yalnız İngilizce adla bulunan bitkileri ekler. Ad ekranda yine arayüz dilinde gösterilir: kayıt adı bilimsel addır.
import type { Locale } from "@aquamind/localization";
import type { PlantProfile, PlantSearchResult } from "@/data/catalog-plants";
import { suggestionEvidenceProblems, type PlantSearchSuggestion } from "@/data/search-suggestions";

/** `own`: ekranın dilindeki arama; `english`: aynı aramanın İngilizce ekrandaki sonucu. */
export function withEnglishPlantMatches(own: PlantSearchResult[], english: PlantSearchResult[], locale: Locale): PlantSearchResult[] {
  if (locale === "en") return own;
  const seen = new Set(own.map((result) => result.item.id));
  const added = english.filter((result) => !seen.has(result.item.id)).map((result) => ({ ...result, matchedName: result.item.scientificName }));
  return added.length ? [...own, ...added] : own;
}

/**
 * Öneri terimi katlaması: canlı aramasındaki gibi Türkçe kuralla küçük harf, aksansız, harf ve rakam dışı her şey boşluk
 * (src/lib/species-search.ts `foldWords`; o dosya canlı kataloğunu yüklediği için burada ayrıca yazılır).
 */
export const foldSuggestionWords = (value: string) => value.toLocaleLowerCase("tr-TR").replaceAll("ı", "i").normalize("NFD").replace(/\p{M}+/gu, "").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
const suggestionKey = (value: string) => foldSuggestionWords(value).replaceAll(" ", "");

/**
 * Bitki için "Bunu mu demek istedin?" (2026-11-14 sprinti; liste src/data/search-suggestions.ts `plantSearchSuggestions`): aranan metin bir
 * öneri teriminin kendisiyse terimin bütün bitkileri, öneri sırasıyla. Pencere bunu yalnız aramada hiç sonuç yokken gösterir; bitki
 * kendiliğinden seçilmez. `plantById` yüklenen katalog parçasından gelir.
 */
export function plantSuggestionsFor(query: string, suggestions: readonly PlantSearchSuggestion[], plantById: (id?: string) => PlantProfile | undefined): PlantProfile[] {
  const key = suggestionKey(query);
  if (!key) return [];
  const found: PlantProfile[] = [];
  for (const suggestion of suggestions) {
    if (suggestionKey(suggestion.term) !== key) continue;
    for (const id of suggestion.plantIds) {
      const item = plantById(id);
      if (item && !found.includes(item)) found.push(item);
    }
  }
  return found;
}

/**
 * Bitki öneri listesinin bütünlüğü: kimlik katalogda; kanıt kuralları canlıyla aynı (en az iki bağımsız site, alıntı terimi içerir,
 * `suggestionEvidenceProblems`); terim hiçbir bitkinin bilimsel, eş ya da İngilizce adıyla aynı değil; en az bir bitki, aynı bitki ve terim
 * bir kez. Sorun yoksa boş liste döner.
 */
export function plantSearchSuggestionProblems(suggestions: readonly PlantSearchSuggestion[], catalog: readonly PlantProfile[]): string[] {
  const problems: string[] = [];
  const ids = new Set(catalog.map((item) => item.id));
  const names = new Set(catalog.flatMap((item) => [item.scientificName, item.commonNameEn ?? "", ...(item.aliases ?? [])]).map(suggestionKey).filter(Boolean));
  const terms = new Set<string>();
  for (const { term, plantIds, evidence, addedAt } of suggestions) {
    const key = suggestionKey(term);
    if (!key) { problems.push(`boş terim: "${term}"`); continue; }
    if (terms.has(key)) problems.push(`${term}: terim iki kez yazılmış`);
    terms.add(key);
    if (names.has(key)) problems.push(`${term}: katalogdaki bir bitki adıyla aynı`);
    if (!plantIds.length) problems.push(`${term}: en az bir bitki olmalı`);
    if (new Set(plantIds).size !== plantIds.length) problems.push(`${term}: aynı bitki iki kez yazılmış`);
    for (const id of plantIds) if (!ids.has(id)) problems.push(`${term}: katalogda olmayan kimlik ${id}`);
    problems.push(...suggestionEvidenceProblems(term, evidence, addedAt, foldSuggestionWords));
  }
  return problems;
}
