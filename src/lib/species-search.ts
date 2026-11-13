// Canlı ekleme penceresinin araması (kullanılabilirlik turu, 2026-11-12). Yalnız bu arama içindir: katalog verisi, kayıtların katalogla
// eşlenmesi (`speciesForLivestock`) ve katalog parçalarının anahtarları (src/data/catalog-shared.ts `normalize`) değişmez.
//
// Hoşgörü üç katmandır:
// - Harf katlaması: Türkçe kuralla küçük harf (I → ı → i, İ → i), sonra aksanlar silinir (Unicode NFD + birleşik işaretler):
//   "papağan" = "papagan", "pez ángel" = "pez angel", "tetra neón" = "tetra neon", "çöpçü" = "copcu".
// - Ayırıcı katlaması: harf ve rakam dışındaki her şey (tire, nokta, ayraç, kesme işareti…) boşluk sayılır; ad karşılaştırması boşluksuz
//   anahtarla yapılır: "rummy nose" = "Rummy-nose", "glow light" = "Glowlight".
// - Yazım varyantları: `SPELLING_VARIANTS`. Veri değil, yalnız arama hoşgörüsüdür (ürün sahibi kararı 2026-11-12: liste büyütülmez).
import type { AquariumType, Livestock } from "@/types/aquarium";
import { speciesCatalog, speciesWaterTypes, type SpeciesProfile, type SpeciesSearchName } from "@/data/catalog-species";
import { unresolvedSpeciesListings, type UnresolvedSpeciesListing } from "@/data/catalog-species-unresolved";

/** Aranan sözcüğün yaygın yanlış yazımı → katalogdaki yazımı. Yalnız bu beş sözcük; liste büyütülmez. */
const SPELLING_VARIANTS: Readonly<Record<string, string>> = {
  koridoras: "corydoras",
  koridora: "corydoras",
  coridora: "corydoras",
  coridoras: "corydoras",
  oskar: "oscar",
};

const foldCache = new Map<string, string>();
/** Harf ve ayırıcı katlaması: küçük harf, aksansız, sözcükler tek boşlukla ayrılmış. Yazım varyantı uygulanmaz (katalogdaki adlar için). */
export function foldWords(value: string): string {
  let folded = foldCache.get(value);
  if (folded === undefined) {
    folded = value.toLocaleLowerCase("tr-TR").replaceAll("ı", "i").normalize("NFD").replace(/\p{M}+/gu, "").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
    if (foldCache.size > 50_000) foldCache.clear();
    foldCache.set(value, folded);
  }
  return folded;
}
/** Aranan metin: katlanmış sözcükler, yazım varyantları düzeltilmiş ("koridoras panda" → "corydoras panda"). */
export const searchWords = (query: string) => foldWords(query).split(" ").map((word) => SPELLING_VARIANTS[word] ?? word).join(" ");
const compact = (words: string) => words.replaceAll(" ", "");
/** Aranan metnin boşluksuz anahtarı; adlarla bu anahtar karşılaştırılır. */
export const searchKey = (query: string) => compact(searchWords(query));

interface FoldedNames { words: string[]; keys: string[] }
const namesCache = new WeakMap<SpeciesProfile, FoldedNames>();
/** Türün adları: [0] Türkçe ad, [1] bilimsel ad, sonra eş adlar. */
function namesOf(profile: SpeciesProfile): FoldedNames {
  let names = namesCache.get(profile);
  if (!names) {
    const words = [profile.commonName, profile.scientificName, ...(profile.aliases ?? [])].map(foldWords);
    names = { words, keys: words.map(compact) };
    namesCache.set(profile, names);
  }
  return names;
}
/** Ekranın dilindeki ad (Türkçede ya da çevirisi olmayan türde yok). */
function translatedOf(profile: SpeciesProfile, translatedName?: SpeciesSearchName): { words: string; key: string } | undefined {
  const name = translatedName?.(profile);
  if (name === undefined) return undefined;
  const words = foldWords(name);
  return { words, key: compact(words) };
}
const isExactName = (profile: SpeciesProfile, key: string, translatedName?: SpeciesSearchName) =>
  namesOf(profile).keys.includes(key) || translatedOf(profile, translatedName)?.key === key;
const hasNamePart = (profile: SpeciesProfile, key: string, translatedName?: SpeciesSearchName) =>
  namesOf(profile).keys.some((name) => name.includes(key)) || Boolean(translatedOf(profile, translatedName)?.key.includes(key));
const fits = (profile: SpeciesProfile, category: Livestock["category"], waterType: AquariumType) => profile.category === category && speciesWaterTypes(profile).includes(waterType);

/** Adlarından biri (çeviri dahil) aranan metne eşit olan, bu sınıf ve su türündeki ilk tür (katalog sırası). */
export function exactSpecies(query: string, category: Livestock["category"], waterType: AquariumType, translatedName?: SpeciesSearchName): SpeciesProfile | undefined {
  const key = searchKey(query);
  return key ? speciesCatalog.find((profile) => fits(profile, category, waterType) && isExactName(profile, key, translatedName)) : undefined;
}

/** Aranan metin bu su türünde hiçbir türün tam adı değil ama başka su türündeki bir türün tam adıysa o tür (katalog sırasıyla ilk). */
export function otherWaterExactSpecies(query: string, category: Livestock["category"], waterType: AquariumType, translatedName?: SpeciesSearchName): SpeciesProfile | undefined {
  const key = searchKey(query);
  if (!key || exactSpecies(query, category, waterType, translatedName)) return undefined;
  return speciesCatalog.find((profile) => profile.category === category && !speciesWaterTypes(profile).includes(waterType) && isExactName(profile, key, translatedName));
}

/** Türün adlarından biri aranan metni içeriyor mu (arama boşsa her tür uyar)? Penceredeki tür listesini süzer. */
export function speciesNameMatches(profile: SpeciesProfile, query: string, translatedName?: SpeciesSearchName): boolean {
  const key = searchKey(query);
  return !key || hasNamePart(profile, key, translatedName);
}

/** Bu sınıf ve su türünde adlarından biri aranan metni içeren bütün türler, katalog sırasıyla. */
export function matchingSpecies(query: string, category: Livestock["category"], waterType: AquariumType, translatedName?: SpeciesSearchName): SpeciesProfile[] {
  const key = searchKey(query);
  return key ? speciesCatalog.filter((profile) => fits(profile, category, waterType) && hasNamePart(profile, key, translatedName)) : [];
}

/**
 * Kısmi eşleşmenin sırası: 0. türün adı (Türkçe ad ya da ekranın dilindeki ad) aranan metinle başlar; 1. herhangi bir adı (bilimsel ad, eş ad
 * dahil) onunla başlar; 2. bir adın içindeki bir sözcük onunla başlar; 3. adın içinde geçer. "panda" yazan Panda çöpçü'yü bulur (katalog
 * sırasında önce gelen Lepistes'in yalnız eş adı "Panda Lepistes").
 */
export function partialRank(profile: SpeciesProfile, query: string, translatedName?: SpeciesSearchName): number {
  const words = searchWords(query);
  const key = compact(words);
  const own = namesOf(profile);
  const translated = translatedOf(profile, translatedName);
  const shownKeys = [own.keys[0], ...(translated ? [translated.key] : [])];
  if (shownKeys.some((name) => name.startsWith(key))) return 0;
  if ([...own.keys, ...(translated ? [translated.key] : [])].some((name) => name.startsWith(key))) return 1;
  return [...own.words, ...(translated ? [translated.words] : [])].some((name) => ` ${name}`.includes(` ${words}`)) ? 2 : 3;
}

/** Kısmi eşleşmelerin en iyisi (`partialRank`); eşitlikte katalog sırası. */
export function bestPartialMatch(query: string, category: Livestock["category"], waterType: AquariumType, translatedName?: SpeciesSearchName): SpeciesProfile | undefined {
  let best: SpeciesProfile | undefined;
  let bestRank = Number.POSITIVE_INFINITY;
  for (const profile of matchingSpecies(query, category, waterType, translatedName)) {
    const rank = partialRank(profile, query, translatedName);
    if (rank < bestRank) { best = profile; bestRank = rank; }
    if (rank === 0) break;
  }
  return best;
}

/**
 * Çözülmemiş satış adı (güvenlik kaydı): `exact` aranan metin satış adının ya da eş adının kendisi; değilse adın bir parçası. En az üç harf
 * gerekir. Sıralamadaki yeri `livestockSearch`'tedir (src/components/catalog-livestock-form.tsx).
 */
export function unresolvedListingFor(query: string, category: Livestock["category"], waterType: AquariumType): { listing: UnresolvedSpeciesListing; exact: boolean } | undefined {
  const key = searchKey(query);
  if (key.length < 3) return undefined;
  const compatible = unresolvedSpeciesListings.filter((item) => item.category === category && item.waterTypes.includes(waterType));
  // Yazım hoşgörüsü satış adlarına da uygulanır; adın tamamı düzeltilince güvenlik kaydı kaybolmaz.
  const keysOf = (item: UnresolvedSpeciesListing) => [item.name, ...(item.aliases ?? [])].map(searchKey);
  const exact = compatible.find((item) => keysOf(item).includes(key));
  if (exact) return { listing: exact, exact: true };
  const part = compatible.find((item) => keysOf(item).some((name) => name.includes(key)));
  return part ? { listing: part, exact: false } : undefined;
}

/**
 * Aranan metnin bir addaki yeri, adın özgün yazımıyla (vurgulamak için). Ad harf harf aynı kuralla katlanır; birleşik işaretler yok sayılır,
 * ayırıcılar boşluk olur. Bulunamazsa `undefined`.
 */
export function matchRange(text: string, query: string): [number, number] | undefined {
  const target = searchWords(query);
  if (!target) return undefined;
  let folded = "";
  const origin: number[] = [];
  let space = true;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (/\p{M}/u.test(char)) continue;
    const piece = foldWords(char);
    if (!piece) {
      if (!space) { folded += " "; origin.push(index); space = true; }
      continue;
    }
    for (const unit of piece) { folded += unit; origin.push(index); }
    space = false;
  }
  const at = folded.indexOf(target);
  return at < 0 ? undefined : [origin[at], origin[at + target.length - 1] + 1];
}
