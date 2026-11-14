// Bitki araması her dilde İngilizce ortak adda da arar (2026-11-14 sprinti): Türk hobiciler "java fern", "hornwort" gibi adları çok kullanır.
// Katalogun araması (src/data/catalog-plants.ts `searchPlants`) İngilizce adı yalnız İngilizce ekranda okur; bu işlev o dilin sonuçlarının
// arkasına yalnız İngilizce adla bulunan bitkileri ekler. Ad ekranda yine arayüz dilinde gösterilir: kayıt adı bilimsel addır.
import type { Locale } from "@aquamind/localization";
import type { PlantSearchResult } from "@/data/catalog-plants";

/** `own`: ekranın dilindeki arama; `english`: aynı aramanın İngilizce ekrandaki sonucu. */
export function withEnglishPlantMatches(own: PlantSearchResult[], english: PlantSearchResult[], locale: Locale): PlantSearchResult[] {
  if (locale === "en") return own;
  const seen = new Set(own.map((result) => result.item.id));
  const added = english.filter((result) => !seen.has(result.item.id)).map((result) => ({ ...result, matchedName: result.item.scientificName }));
  return added.length ? [...own, ...added] : own;
}
