// Canlı aramasının başka dildeki ad dizini (2026-11-14 sprinti). Arayüz dili ne olursa olsun canlı araması türün İngilizce ve İspanyolca
// katalog adlarında da arar (ör. Türkçe ekranda "cherry shrimp" → Kiraz karides). Bu adlar dil paketlerindedir ve paket yalnız o dil
// seçilince yüklenir (docs/DECISIONS/0021, 5. paket); Türkçe kullanan kimse bütün paketi indirmesin diye yalnız tür adları derleme anında
// tek bir durağan JSON parçasına yazılır (src/app/catalog-data/species-search-names/route.ts, katalog parçalarıyla aynı düzen, 0016).
// Pencere açılınca bir kez istenir; yüklenene kadar ya da yüklenemezse arama bugünkü adlarla çalışır.
// Saf kurucu ve tip src/lib/species-search-names-index.ts'te (sunucu yolu kancasız dosyayı içe aktarır); burada yalnız tarayıcı kancası var.
import { useEffect, useState } from "react";
import type { SpeciesOtherNames } from "@/lib/species-search";
import { otherNamesFrom, SPECIES_SEARCH_NAMES_PATH, type SpeciesSearchNameIndex } from "@/lib/species-search-names-index";

export { buildSpeciesSearchNames, otherNamesFrom, SPECIES_SEARCH_NAMES_PATH, type SpeciesSearchNameIndex } from "@/lib/species-search-names-index";

let request: Promise<SpeciesSearchNameIndex> | undefined;
let loaded: SpeciesOtherNames | undefined;

/** Dizini bir kez ister; yüklenince arama işlevi döner, öncesinde ya da hatada `undefined`. */
export function useSpeciesSearchNames(): SpeciesOtherNames | undefined {
  const [names, setNames] = useState<SpeciesOtherNames | undefined>(() => loaded);
  useEffect(() => {
    if (loaded) { setNames(() => loaded); return; }
    let active = true;
    request ??= fetch(SPECIES_SEARCH_NAMES_PATH).then((response) => {
      if (!response.ok) throw new Error(String(response.status));
      return response.json() as Promise<SpeciesSearchNameIndex>;
    });
    request.then((index) => { loaded = otherNamesFrom(index); if (active) setNames(() => loaded); }).catch(() => { request = undefined; });
    return () => { active = false; };
  }, []);
  return names;
}
