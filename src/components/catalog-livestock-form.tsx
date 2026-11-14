"use client";

import { FormEvent, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { AlertTriangle, Check, Search, ShieldAlert, X } from "lucide-react";
import { engineMessagesFor, engineTextFormat } from "@aquamind/localization/engine";
import { ModalDialog } from "@/components/modal-dialog";
import { speciesById, speciesCatalog, speciesForLivestock, speciesForCategoryAndWaterType, speciesGroup, speciesGroupsForCategoryAndWaterType, speciesWaterTypes } from "@/data/catalog-species";
import type { SpeciesProfile, SpeciesSearchName } from "@/data/catalog-species";
import type { UnresolvedSpeciesListing } from "@/data/catalog-species-unresolved";
import { searchSuggestions } from "@/data/search-suggestions";
import { bestPartialMatch, exactSpecies, matchingSpecies, matchRange, otherWaterExactSpecies, partialRank, searchSuggestionsFor, searchWords, speciesNameMatches, unresolvedListingFor, type SpeciesOtherNames } from "@/lib/species-search";
import { useSpeciesSearchNames } from "@/lib/species-search-names";
import { engineWarningText } from "@/lib/engine-text";
import { localIsoDate } from "@/lib/local-date";
import { newWarningsForCandidate } from "@/lib/selection-warnings";
import { useCatalogLookup } from "@/lib/use-catalog-lookup";
import { useDisplayFormat } from "@/lib/use-display-format";
import { useI18n } from "@/providers/i18n-provider";
import type { Aquarium, AquariumType, Equipment, Livestock, WaterParameters } from "@/types/aquarium";

// Canlı sınıfları; adları dil dosyasındadır (`t.livestock.categories[category]`).
const allCategories: Livestock["category"][] = ["fish", "shrimp", "snail", "other"];
const field = "mt-1.5 w-full rounded-xl border border-white/[.08] bg-[#09171e] px-3 py-3 text-sm outline-none focus:border-aqua/60";

type SpeciesGroupKey = NonNullable<SpeciesProfile["group"]>;

/** En çok bu kadar öneri görünür; fazlası "Tümünü göster" ile açılır (ürün sahibi kararı 2026-11-11). */
export const VISIBLE_SUGGESTIONS = 3;

/** Arama kutusuna yazılanın sonucu. `otherWater`: ad başka su türündeki bir türün tam adı; tür seçilmez, uyarı ve öneriler çıkar. */
export type LivestockSearch =
  | { kind: "empty" }
  | { kind: "exact"; profile: SpeciesProfile }
  | { kind: "unresolved"; listing: UnresolvedSpeciesListing }
  | { kind: "otherWater"; profile: SpeciesProfile; suggestions: SpeciesProfile[] }
  | { kind: "partial"; profile: SpeciesProfile }
  | { kind: "none" };

/**
 * Akvaryumun su türü, ekranın dilindeki tür adı (aramayla aynı biçimde; Türkçede verilmez ya da `undefined` döner) ve türün başka dillerdeki
 * katalog adları (yüklenince; src/lib/species-search-names.ts).
 */
export interface LivestockSearchContext { waterType: AquariumType; translatedName?: SpeciesSearchName; otherNames?: SpeciesOtherNames }

/** Aramanın sınıf sırası: seçili sınıf önce, sonra öbürleri. Arama bütün sınıflarda arar (2026-11-14 sprinti). */
const categoryOrder = (category: Livestock["category"]) => [category, ...allCategories.filter((item) => item !== category)];

/// Eşleşme sırası (ürün sahibi kararı 2026-11-11; 2026-11-12 kullanılabilirlik turunda inceltildi). Ekranda gösterilen değerler ve arama
// değişince yapılan seçim aynı sırayı kullanır. Adlar harf, aksan, tire ve küçük bir yazım listesiyle hoşgörülü karşılaştırılır
// (src/lib/species-search.ts). Arama bütün sınıflarda arar (2026-11-14 sprinti): her adımda önce seçili sınıf, sonra öbür sınıflar
// denenir; eşleşme başka sınıftaysa pencere sınıfı ve grubu kendisi değiştirir. Türün başka dillerdeki katalog adları da aranır.
// 1. arama boş; 2. çözülmemiş satış adının kendisi (güvenlik kutusu); 3. bu su türünde tam ad (çeviri dahil); 4. başka su türünde tam ad
// (çeviri dahil): seçim yok, uyarı ve bu akvaryum türü ile o türün sınıfındaki bütün kısmi eşleşmeler öneri olarak; 5. katalogda kısmi
// eşleşme (`bestPartialMatch`: adı aranan metinle başlayan tür önce; sınıflar arasında da daha iyi sıra kazanır, eşitlikte seçili sınıf);
// 6. çözülmemiş satış adının bir parçası (güvenlik kutusu; katalogda kısmi eşleşme yoksa); 7. eşleşme yok. Satış adının parçası eskiden
// (2026-09-02) katalogdaki kısmi eşleşmenin önündeydi: "panda" engelli "PANDA GARRARUFA YOSUN YİYİCİ" kutusunu, "Neon" "BLUE NEON GOBBY GOBİ"
// kutusunu açıyordu. Satış adının kendisi yazılınca kutu yine açılır.
export function livestockSearch(query: string, category: Livestock["category"], { waterType, translatedName, otherNames }: LivestockSearchContext): LivestockSearch {
  if (!searchWords(query)) return { kind: "empty" };
  const order = categoryOrder(category);
  // Belirsiz satış adı katalog eş adıyla çakışsa da sessizce bir türe bağlanmaz.
  const listings = order.map((item) => unresolvedListingFor(query, item, waterType));
  const exactListing = listings.find((listing) => listing?.exact);
  if (exactListing) return { kind: "unresolved", listing: exactListing.listing };
  for (const item of order) {
    const exact = exactSpecies(query, item, waterType, translatedName, otherNames);
    if (exact) return { kind: "exact", profile: exact };
  }
  for (const item of order) {
    const otherWater = otherWaterExactSpecies(query, item, waterType, translatedName, otherNames);
    if (otherWater) return { kind: "otherWater", profile: otherWater, suggestions: matchingSpecies(query, otherWater.category, waterType, translatedName, otherNames) };
  }
  let partial: SpeciesProfile | undefined;
  let partialRankFound = Number.POSITIVE_INFINITY;
  for (const item of order) {
    const found = bestPartialMatch(query, item, waterType, translatedName, otherNames);
    if (!found) continue;
    const rank = partialRank(found, query, translatedName, otherNames);
    if (rank < partialRankFound) { partial = found; partialRankFound = rank; }
  }
  if (partial) return { kind: "partial", profile: partial };
  const listing = listings.find(Boolean);
  return listing ? { kind: "unresolved", listing: listing.listing } : { kind: "none" };
}

/**
 * Penceredeki seçimler. `fromSuggestion`: tür bir öneriden (başka su türü uyarısı ya da "Bunu mu demek istedin?") seçildi (kartta yazar,
 * ekran okuyucu okur). `quantityTouched`: kullanıcı adedi elle yazdı; arama ve seçim artık adedi değiştirmez.
 */
export interface LivestockFormState {
  category: Livestock["category"];
  group: SpeciesGroupKey;
  query: string;
  /** Seçili türün kimliği; boşsa tür seçilmemiştir. */
  selected: string;
  quantity: number;
  quantityTouched: boolean;
  fromSuggestion: boolean;
  showAllSuggestions: boolean;
}

const firstGroup = (category: Livestock["category"], waterType: AquariumType): SpeciesGroupKey => {
  const first = speciesForCategoryAndWaterType(category, waterType)[0];
  return first ? speciesGroup(first) : "other";
};
const hasSpecies = (category: Livestock["category"], waterType: AquariumType) => speciesForCategoryAndWaterType(category, waterType).length > 0;
/** Tür seçilince adet o türün en az grup sayısı olur; kullanıcı adedi elle yazdıysa ya da tür zaten seçiliyse adet korunur. */
const quantityFor = (state: LivestockFormState, profile: SpeciesProfile) => state.quantityTouched || state.selected === profile.id ? state.quantity : profile.minGroup;

/** Sınıf değişince (ve pencere açılınca): tür seçilmez (göz atmak içindir), arama ve öneri bilgisi silinir. */
export function changeLivestockCategory(category: Livestock["category"], waterType: AquariumType): LivestockFormState {
  return { category, group: firstGroup(category, waterType), query: "", selected: "", quantity: 1, quantityTouched: false, fromSuggestion: false, showAllSuggestions: false };
}

/** Pencere boş açılır (2026-11-14 sprinti); sınıf, akvaryumun su türünde canlısı olan bir sınıf olmalıdır. */
export function livestockFormStart(initialCategory: Livestock["category"], waterType: AquariumType): LivestockFormState {
  const compatible = speciesCatalog.filter((item) => speciesWaterTypes(item).includes(waterType));
  return changeLivestockCategory(compatible.some((item) => item.category === initialCategory) ? initialCategory : (compatible[0]?.category ?? initialCategory), waterType);
}

/** Grup değişince tür seçilmez; kullanıcı listeden seçer. Arama silinir, adet korunur. */
// Su türü eski çağıranlar için kabul edilir; grup değişince artık tür seçilmediği için gerekmez.
export function changeLivestockGroup(state: LivestockFormState, group: SpeciesGroupKey, _waterType?: AquariumType): LivestockFormState {
  return { ...state, group, query: "", selected: "", fromSuggestion: false, showAllSuggestions: false };
}

/** Kullanıcı adedi elle yazınca adet bundan sonra aramayla ezilmez. */
export const changeLivestockQuantity = (state: LivestockFormState, quantity: number): LivestockFormState => ({ ...state, quantity, quantityTouched: true });

export function changeLivestockQuery(state: LivestockFormState, query: string, context: LivestockSearchContext): LivestockFormState {
  const next: LivestockFormState = { ...state, query, fromSuggestion: false, showAllSuggestions: false };
  const search = livestockSearch(query, state.category, context);
  switch (search.kind) {
    case "empty":
    case "none":
      return { ...next, selected: "" };
    case "exact":
    case "partial":
      return { ...next, category: search.profile.category, group: speciesGroup(search.profile), selected: search.profile.id, quantity: quantityFor(state, search.profile) };
    case "unresolved":
      return { ...next, category: search.listing.category, group: search.listing.group, selected: "" };
    case "otherWater": {
      // Öneriler türün sınıfındadır; o sınıfın bu su türünde canlısı varsa pencere o sınıfa geçer.
      const category = search.profile.category;
      if (category === state.category || !hasSpecies(category, context.waterType)) return { ...next, selected: "" };
      return { ...next, category, group: firstGroup(category, context.waterType), selected: "" };
    }
  }
}

/** Listeden tür seçilince öneri bilgisi silinir. */
export function changeLivestockSpecies(state: LivestockFormState, id: string): LivestockFormState {
  const profile = speciesById(id);
  return { ...state, selected: id, quantity: profile ? quantityFor(state, profile) : state.quantity, fromSuggestion: false };
}

/** Öneriye tıklanınca sınıf ve grup o türünkine geçer ve tür seçilir; adet türün en az grup sayısı olur (elle yazıldıysa ya da zaten seçiliyse korunur). */
export function pickLivestockSuggestion(state: LivestockFormState, profile: SpeciesProfile): LivestockFormState {
  return { ...state, category: profile.category, group: speciesGroup(profile), selected: profile.id, quantity: quantityFor(state, profile), fromSuggestion: true };
}

export const showAllLivestockSuggestions = (state: LivestockFormState): LivestockFormState => ({ ...state, showAllSuggestions: true });

function Highlighted({ text, query }: { text: string; query: string }): ReactNode {
  const range = matchRange(text, query);
  if (!range) return text;
  return <>{text.slice(0, range[0])}<span className="font-extrabold text-[#edf7f6] underline decoration-aqua/60 decoration-2 underline-offset-2">{text.slice(range[0], range[1])}</span>{text.slice(range[1])}</>;
}

/**
 * Başka su türü uyarısı ve öneriler (ürün sahibi kararı 2026-11-11). Tür kendiliğinden seçilmez; öneriye tıklanınca seçilir. Tür seçilince
 * uyarı küçülür (başlık ve aranan türün adı kalır), öbür öneriler görünür kalır. En çok `VISIBLE_SUGGESTIONS` öneri görünür. `query` aramanın
 * aranan metindir (vurgu `matchRange` ile aynı hoşgörüyle bulunur, src/lib/species-search.ts); `announced` öneriden seçilen türün adıdır.
 */
export function OtherWaterNotice({ match, aquariumType, suggestions, query, selectedId, announced, showAll, pick, showAllSuggestions }: {
  match: SpeciesProfile; aquariumType: AquariumType; suggestions: SpeciesProfile[]; query: string; selectedId?: string; announced?: string; showAll: boolean;
  pick: (profile: SpeciesProfile) => void; showAllSuggestions: () => void;
}) {
  const { t, catalogText } = useI18n();
  const f = t.livestock.form;
  const speciesName = (item: SpeciesProfile) => catalogText(item.commonName) ?? item.commonName;
  const list = useRef<HTMLDivElement>(null);
  const revealing = useRef(false);
  // "Tümünü göster" düğmesi kaybolunca odak, yeni açılan ilk öneriye geçer.
  useEffect(() => {
    if (!showAll || !revealing.current) return;
    revealing.current = false;
    list.current?.querySelectorAll("button")[VISIBLE_SUGGESTIONS]?.focus();
  }, [showAll]);
  const chosen = selectedId !== undefined && suggestions.some((item) => item.id === selectedId);
  const visible = showAll ? suggestions : suggestions.slice(0, VISIBLE_SUGGESTIONS);
  return <div className="rounded-xl border border-amber-300/20 bg-amber-300/[.07] p-4 sm:col-span-2">
    <p className="text-[11px] sm:text-[10px] font-extrabold text-amber-300">{f.otherWaterTitle}</p>
    <p className="mt-1 text-sm font-bold text-amber-50">{speciesName(match)}</p>
    {!chosen && <p className="mt-1 text-[11px] sm:text-[10px] italic text-amber-100/65">{match.scientificName}</p>}
    {!chosen && <p className="mt-2 text-[11px] sm:text-[10px] leading-relaxed text-amber-100/65">{f.otherWaterText(aquariumType, speciesWaterTypes(match))}</p>}
    {suggestions.length > 0 && <div className="mt-3 border-t border-amber-300/15 pt-3">
      <p className="text-[11px] sm:text-[10px] font-extrabold text-[#edf7f6]">{f.otherWaterSuggestions(suggestions.length)}</p>
      {!chosen && <p className="mt-1 text-[11px] sm:text-[10px] leading-normal text-[#91a3aa]">{f.otherWaterSuggestionHint}</p>}
      <div ref={list} className="mt-2 grid gap-2">{visible.map((item) => {
        const shown = speciesName(item);
        const pressed = item.id === selectedId;
        // Gösterilen ad aranan metni içermiyorsa eşleşen ad (ör. satış adı "Koi lepistes") ayraç içinde yazılır; bilimsel ad zaten görünür.
        const alias = matchRange(shown, query) || matchRange(item.scientificName, query) ? undefined : [item.commonName, ...(item.aliases ?? [])].find((name) => name !== shown && matchRange(name, query));
        return <button key={item.id} type="button" aria-pressed={pressed} onClick={() => pick(item)} className="flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border border-aqua/30 bg-aqua/[.06] px-3 py-2.5 text-left transition-colors hover:bg-aqua/[.11] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua aria-pressed:border-aqua aria-pressed:bg-aqua/[.15]">
          <span className="grid min-w-0 gap-0.5"><span className="text-sm font-bold leading-snug"><Highlighted text={shown} query={query} />{alias && <span className="font-medium text-[#91a3aa]"> (<Highlighted text={alias} query={query} />)</span>}</span><span className="text-[11px] sm:text-[10px] italic text-[#71858d]"><Highlighted text={item.scientificName} query={query} /></span></span>
          <span className="shrink-0 text-xs font-extrabold text-aqua">{pressed ? <span className="inline-flex items-center gap-1 rounded-full bg-aqua px-2 py-1 text-ink"><Check size={12} strokeWidth={3.5} aria-hidden="true" />{f.otherWaterSuggestionChosen}</span> : f.otherWaterSuggestionChoose}</span>
        </button>;
      })}</div>
      {visible.length < suggestions.length && <button type="button" onClick={() => { revealing.current = true; showAllSuggestions(); }} className="mt-2 min-h-11 w-full rounded-xl border border-white/[.08] px-3 py-2 text-xs font-bold text-[#91a3aa] hover:border-aqua/30 hover:text-aqua">{f.otherWaterSuggestionsShowAll(suggestions.length)}</button>}
    </div>}
    <p className="sr-only" aria-live="polite">{announced ? f.otherWaterSuggestionPicked(announced) : ""}</p>
  </div>;
}

/**
 * "Bunu mu demek istedin?" düğmeleri (2026-11-14 sprinti; liste src/data/search-suggestions.ts). Tür kendiliğinden seçilmez; kullanıcı
 * düğmeye basınca seçilir, kartta öneriden seçildiği yazar. Ad arayüz dilinde gösterilir.
 */
export function DidYouMean({ suggestions, selectedId, pick }: { suggestions: SpeciesProfile[]; selectedId?: string; pick: (profile: SpeciesProfile) => void }) {
  const { t, catalogText } = useI18n();
  const f = t.livestock.form;
  return <div className="grid gap-2 sm:col-span-2">{suggestions.map((item) => {
    const pressed = item.id === selectedId;
    return <button key={item.id} type="button" aria-pressed={pressed} onClick={() => pick(item)} className="flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border border-aqua/30 bg-aqua/[.06] px-3 py-2.5 text-left transition-colors hover:bg-aqua/[.11] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua aria-pressed:border-aqua aria-pressed:bg-aqua/[.15]">
      <span className="grid min-w-0 gap-0.5"><span className="text-sm font-bold leading-snug">{f.didYouMean(catalogText(item.commonName) ?? item.commonName)}</span><span className="text-[11px] sm:text-[10px] italic text-[#71858d]">{item.scientificName}</span></span>
      {pressed && <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-aqua px-2 py-1 text-xs font-extrabold text-ink"><Check size={12} strokeWidth={3.5} aria-hidden="true" />{f.otherWaterSuggestionChosen}</span>}
    </button>;
  })}</div>;
}

/** Seçili türün kartı. `searchedFor` verilirse tür öneriden seçilmiştir; kartın altında kullanıcının aradığı adla yazar. */
export function SelectedSpeciesCard({ profile, searchedFor }: { profile: SpeciesProfile; searchedFor?: string }) {
  const fmt = useDisplayFormat();
  const { t, catalogText } = useI18n();
  const f = t.livestock.form;
  return <div className="rounded-xl border border-aqua/15 bg-aqua/[.05] p-4 sm:col-span-2"><div className="flex justify-between"><div><p className="text-sm font-extrabold">{catalogText(profile.commonName) ?? profile.commonName}</p><p className="mt-1 text-[11px] sm:text-[10px] italic text-[#71858d]">{profile.scientificName}</p></div><span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[11px] sm:text-[8px] font-bold text-emerald-400">{f.inCatalog}</span></div><div className="mt-3 grid grid-cols-3 gap-2 text-[11px] sm:text-[9px]"><span>{f.adultSize} <b>{profile.adultSizeCm} cm</b></span><span>{f.minVolume} <b>{fmt.volume(profile.minVolumeL)}</b></span><span>{f.minGroup} <b>{profile.minGroup}+</b></span></div>{searchedFor !== undefined && <p className="mt-3 flex items-start gap-1.5 border-t border-aqua/15 pt-2.5 text-[11px] sm:text-[10px] font-semibold leading-normal text-aqua"><Check size={13} strokeWidth={3} aria-hidden="true" className="mt-0.5 shrink-0" /><span>{f.chosenFromSuggestion(searchedFor)}</span></p>}</div>;
}

/** Motor gibi, aynı katalog türünün eski kayıtlarını da yeni adetle birlikte sayar. */
export function quantityAfterAdding(profile: SpeciesProfile, quantity: number, animals: Livestock[]): number {
  return quantity + animals.reduce((total, item) => total + (speciesForLivestock(item)?.id === profile.id ? item.quantity : 0), 0);
}

const NO_ANIMALS: Livestock[] = [];
const NO_DEVICES: Equipment[] = [];

/**
 * Canlı seçme penceresi. `animals`, `devices` ve `latest` bu akvaryumun kayıtlarıdır: seçilen canlının onlarla birlikte yeni getirdiği
 * avlanma ve uyumsuzluk uyarıları eklemeden önce gösterilir (src/lib/selection-warnings.ts). Verilmezse akvaryum boş sayılır.
 */
export function CatalogLivestockForm({ aquarium, initialCategory, close, submit, animals = NO_ANIMALS, devices = NO_DEVICES, latest }: { aquarium: Aquarium; initialCategory: Livestock["category"]; close: () => void; submit: (e: FormEvent<HTMLFormElement>) => void; animals?: Livestock[]; devices?: Equipment[]; latest?: WaterParameters }) {
  // Katalogdaki hacim referansları ayarlardaki birimde (litre/galon) yazılır.
  const fmt = useDisplayFormat();
  const { t, locale, catalogText } = useI18n();
  // Tür adı çevirisi yoksa katalogdaki ad kalır; çevirisi olmayan not gösterilmez (ürün sahibi kararı 2026-10-30).
  const speciesName = (item: SpeciesProfile) => catalogText(item.commonName) ?? item.commonName;
  // Başka dilde tür adının çevirisi de aranır; Türkçe ad, bilimsel ad ve eş adlar her dilde aranır. Türkçede çeviri adın kendisidir.
  // Ad olduğu gibi verilir; küçük harf, aksan ve tire katlaması tek yerde yapılır (src/lib/species-search.ts `foldWords`).
  const translatedName: SpeciesSearchName = (item) => {
    const name = catalogText(item.commonName);
    return name !== undefined && name !== item.commonName ? name : undefined;
  };
  // Türün başka dillerdeki katalog adları da aranır (ör. Türkçe ekranda "cherry shrimp"); dizin ayrı parçadır, yüklenene kadar yoktur.
  const otherNames = useSpeciesSearchNames();
  const searchContext: LivestockSearchContext = { waterType: aquarium.type, translatedName, otherNames };
  const compatibleSpecies = speciesCatalog.filter((item) => speciesWaterTypes(item).includes(aquarium.type));
  const categories = allCategories.filter((key) => compatibleSpecies.some((item) => item.category === key));
  const [form, setForm] = useState(() => livestockFormStart(initialCategory, aquarium.type));
  const { category, group, query, selected, quantity } = form;
  // Cinsiyet seçimi denetimli alandır; kayda formdan, seçme anındaki analize aday canlıyla gider.
  const [gender, setGender] = useState<NonNullable<Livestock["gender"]>>("unknown");
  const categoryItems = speciesForCategoryAndWaterType(category, aquarium.type);
  const groups = speciesGroupsForCategoryAndWaterType(category, aquarium.type);
  const normalizedQuery = searchWords(query);
  const allGroupItems = categoryItems.filter((item) => speciesGroup(item) === group);
  // Listede aramaya uyan türler; "Bunu mu demek istedin?" ile seçilen tür adı aramaya uymasa da listede kalır.
  const groupItems = allGroupItems.filter((item) => item.id === selected || speciesNameMatches(item, query, translatedName, otherNames));
  const profile = speciesById(selected);
  const search = livestockSearch(query, category, searchContext);
  // "Bunu mu demek istedin?" (2026-11-14 sprinti): katalogda hiç eşleşme yoksa ve ad bir öneri terimiyse en çok üç düğme; tür seçilmez.
  const didYouMean = search.kind === "none" ? searchSuggestionsFor(query, aquarium.type, searchSuggestions) : [];
  const unresolvedMatch = search.kind === "unresolved" ? search.listing : undefined;
  // Aranan ad bu akvaryum türünde tam ad değil ama başka su türündeki doğrulanmış bir türün tam adıysa tür seçilmez; türün bu akvaryum
  // türüne uygun olmadığı söylenir (veri testi, 2026-11-10) ve bu akvaryuma uygun, adı benzeyen türler öneri olarak çıkar (2026-11-11).
  const otherWaterMatch = search.kind === "otherWater" ? search : undefined;
  // Çözülmemiş satış adının gerekçesi katalog metnidir: çevirisi olmayan dilde gösterilmez (ürün sahibi kararı 2026-10-30); ad katalogdaki adla kalır.
  const unresolvedReason = unresolvedMatch ? catalogText(unresolvedMatch.reason) : undefined;

  const hasSelectedProfile = Boolean(profile && groupItems.some((item) => item.id === profile.id));
  const chosenFromSuggestion = form.fromSuggestion && hasSelectedProfile;
  const population = profile ? quantityAfterAdding(profile, quantity, animals) : quantity;
  const requiredVolumeL = profile ? profile.minVolumeL + Math.max(0, population - 1) * (profile.additionalVolumePerAnimalL ?? 0) : 0;
  const issues = profile ? [
    aquarium.netVolumeLiters < requiredVolumeL ? t.livestock.form.volumeIssue(fmt.volume(requiredVolumeL)) : "",
    profile.minTankLengthCm !== undefined && aquarium.lengthCm < profile.minTankLengthCm ? t.livestock.form.lengthIssue(profile.minTankLengthCm) : "",
    profile.tankLengthDataNote ? (catalogText(profile.tankLengthDataNote) ?? "") : "",
    population < profile.minGroup ? t.livestock.form.groupIssue(profile.minGroup) : "",
  ].filter(Boolean) : [];
  // Seçme anındaki uyarılar (kullanılabilirlik turu, 2026-11-12): sağlık analizi aday canlıyla ve adaysız çalıştırılır, adayla yeni çıkan
  // avlanma ve uyumsuzluk uyarıları gösterilir. Ekleme engellenmez; aynı uyarı eklendikten sonra Sağlık Analizi'nde de çıkar.
  const candidateQuantity = Number.isFinite(quantity) && quantity >= 1 ? Math.round(quantity) : 1;
  const candidate = useMemo<Livestock | undefined>(() => hasSelectedProfile && profile && !unresolvedMatch
    ? { id: "selection-candidate", aquariumId: aquarium.id, catalogId: profile.id, commonName: profile.commonName, scientificName: profile.scientificName, category: profile.category, quantity: candidateQuantity, gender, addedAt: localIsoDate() }
    : undefined, [hasSelectedProfile, profile, unresolvedMatch, aquarium.id, candidateQuantity, gender]);
  const lookupAnimals = useMemo(() => (candidate ? [...animals, candidate] : animals), [animals, candidate]);
  const { lookup, failed: riskFailed } = useCatalogLookup(lookupAnimals, devices, Boolean(candidate));
  const riskWarnings = useMemo(() => (lookup && candidate ? newWarningsForCandidate(lookup, aquarium, animals, devices, latest, candidate) : []), [lookup, candidate, aquarium, animals, devices, latest]);
  const engineTexts = engineMessagesFor(locale);
  const engineFormat = useMemo(() => engineTextFormat(fmt), [fmt]);
  const titleId = useId();
  const descriptionId = useId();

  return <ModalDialog close={close} labelledBy={titleId} describedBy={descriptionId}>
    <form onSubmit={submit}>
      <div className="mb-6 flex justify-between"><div><p className="eyebrow text-aqua">{aquarium.name}</p><h2 id={titleId} className="mt-1 text-xl font-extrabold">{t.livestock.form.title}</h2><p id={descriptionId} className="mt-1 text-[11px] sm:text-[10px] text-[#647981]">{t.livestock.form.help}</p></div><button type="button" onClick={close} aria-label={t.common.close} className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/[.04] text-[#71858d] sm:size-9"><X size={17} /></button></div>
      <div className="grid gap-4 sm:grid-cols-2">
        {aquarium.type !== "freshwater" && <p role="note" className="rounded-xl border border-white/[.08] bg-white/[.025] p-3 text-[11px] sm:text-[10px] leading-relaxed text-[#91a3aa] sm:col-span-2">{t.livestock.form.limitedCoverage(aquarium.type)}</p>}
        {/* Arama ilk adımdır ve bütün sınıflarda arar; sınıf ve grup göz atmak içindir (2026-11-14 sprinti). */}
        <label className="relative text-xs font-bold text-[#91a3aa] sm:col-span-2">{t.livestock.form.search}<Search size={15} className="pointer-events-none absolute left-3 top-[42px] text-[#586e77]" /><input type="search" value={query} onChange={(e) => { const next = e.target.value; setForm((current) => changeLivestockQuery(current, next, searchContext)); }} onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }} enterKeyHint="search" placeholder={t.livestock.form.searchPlaceholder} className={`${field} pl-9`} /><span className="mt-1 block text-[11px] sm:text-[10px] font-normal text-[#647981]">{t.livestock.form.searchAllHint}</span></label>
        {didYouMean.length > 0 && <DidYouMean suggestions={didYouMean} selectedId={hasSelectedProfile ? selected : undefined} pick={(item) => setForm((current) => pickLivestockSuggestion(current, item))} />}
        {unresolvedMatch && <div className="rounded-xl border border-amber-300/20 bg-amber-300/[.07] p-4 sm:col-span-2"><div className="flex items-start justify-between gap-3"><div><p className="text-[11px] sm:text-[10px] font-extrabold text-amber-300">{t.livestock.form.unresolvedTitle}</p><p className="mt-1 text-sm font-bold text-amber-50">{catalogText(unresolvedMatch.name) ?? unresolvedMatch.name}</p></div><span className="rounded-full bg-amber-300/10 px-2 py-1 text-[11px] sm:text-[8px] font-bold text-amber-200">{t.livestock.form.unresolvedBadge}</span></div>{unresolvedReason && <p className="mt-2 text-[11px] sm:text-[10px] leading-relaxed text-amber-100/65">{unresolvedReason}</p>}<p className="mt-2 text-[11px] sm:text-[9px] font-semibold text-amber-200/70">{t.livestock.form.unresolvedBlocked}</p><a href={unresolvedMatch.sourceUrl} target="_blank" rel="noreferrer" className="-mb-[15.25px] -mt-[3.25px] inline-flex min-h-11 items-center text-[11px] sm:text-[9px] font-bold text-aqua hover:underline">{t.livestock.form.unresolvedSource}</a></div>}
        {otherWaterMatch && <OtherWaterNotice match={otherWaterMatch.profile} aquariumType={aquarium.type} suggestions={otherWaterMatch.suggestions} query={normalizedQuery} selectedId={hasSelectedProfile ? selected : undefined} announced={chosenFromSuggestion && profile ? speciesName(profile) : undefined} showAll={form.showAllSuggestions} pick={(item) => setForm((current) => pickLivestockSuggestion(current, item))} showAllSuggestions={() => setForm(showAllLivestockSuggestions)} />}
        <p className="-mb-2 text-[11px] sm:text-[10px] font-bold text-[#647981] sm:col-span-2">{t.livestock.form.browseTitle}</p>
        <label className="text-xs font-bold text-[#91a3aa]">{t.livestock.form.category}<select value={category} onChange={(e) => setForm(changeLivestockCategory(e.target.value as Livestock["category"], aquarium.type))} className={field}>{categories.map((key) => <option key={key} value={key}>{t.livestock.categories[key]}</option>)}</select></label>
        <label className="text-xs font-bold text-[#91a3aa]">{t.livestock.form.group}<select value={group} onChange={(e) => { const next = e.target.value as SpeciesGroupKey; setForm((current) => changeLivestockGroup(current, next, aquarium.type)); }} className={field}>{groups.map((item) => <option key={item} value={item}>{t.livestock.speciesGroups[item]}</option>)}</select></label>
        <label className="text-xs font-bold text-[#91a3aa] sm:col-span-2">{t.livestock.form.species}<select required name="catalogId" value={hasSelectedProfile ? selected : ""} onChange={(e) => { const next = e.target.value; setForm((current) => changeLivestockSpecies(current, next)); }} className={field}><option value="" disabled>{groupItems.length ? t.livestock.form.chooseSpecies : unresolvedMatch ? t.livestock.form.awaitingIdentity : t.livestock.form.noMatch}</option>{groupItems.map((item) => <option key={item.id} value={item.id}>{speciesName(item)} · {item.scientificName}</option>)}</select></label>
        {hasSelectedProfile && profile && <SelectedSpeciesCard profile={profile} searchedFor={chosenFromSuggestion ? query.trim() : undefined} />}
        <label className="text-xs font-bold text-[#91a3aa]">{t.common.quantity}<input required name="quantity" type="number" inputMode="numeric" min="1" value={quantity} onChange={(e) => { const next = Number(e.target.value); setForm((current) => changeLivestockQuantity(current, next)); }} className={field} /></label><label className="text-xs font-bold text-[#91a3aa]">{t.livestock.form.gender}<select name="gender" value={gender} onChange={(e) => setGender(e.target.value as NonNullable<Livestock["gender"]>)} className={field}><option value="unknown">{t.livestock.form.genders.unknown}</option><option value="mixed">{t.livestock.form.genders.mixed}</option><option value="male">{t.livestock.form.genders.male}</option><option value="female">{t.livestock.form.genders.female}</option></select></label>
        {issues.length > 0 && <div className="rounded-xl border border-amber-300/15 bg-amber-300/[.06] p-4 sm:col-span-2"><p className="text-[11px] sm:text-[10px] font-extrabold text-amber-300">{t.livestock.form.beforeSaving}</p>{issues.map((issue) => <p key={issue} className="mt-2 text-[11px] sm:text-[9px] text-amber-100/65">• {issue}</p>)}</div>}
        {candidate && (riskWarnings.length > 0 ? <div className="grid gap-2 sm:col-span-2">{riskWarnings.map((warning, index) => {
          const text = engineWarningText(engineTexts, engineFormat, warning, catalogText);
          const danger = warning.level === "danger";
          return <div key={`${warning.code}-${index}`} role="note" className={`rounded-xl border p-4 ${danger ? "border-red-400/25 bg-red-400/[.07]" : "border-amber-300/20 bg-amber-300/[.07]"}`}>
            <p className={`flex items-center gap-1.5 text-[11px] sm:text-[10px] font-extrabold ${danger ? "text-red-400" : "text-amber-300"}`}>{danger ? <ShieldAlert size={13} aria-hidden="true" /> : <AlertTriangle size={13} aria-hidden="true" />}{t.livestock.form.riskTitle}</p>
            <p className={`mt-1.5 text-sm font-bold ${danger ? "text-red-50" : "text-amber-50"}`}>{text.title}</p>
            <p className={`mt-1 text-[11px] sm:text-[10px] leading-relaxed ${danger ? "text-red-100/70" : "text-amber-100/65"}`}>{text.message}</p>
          </div>;
        })}<p className="text-[11px] sm:text-[10px] text-[#71858d]">{t.livestock.form.riskNote}</p></div>
          : riskFailed ? <p className="text-[11px] sm:text-[10px] text-[#71858d] sm:col-span-2">{t.livestock.form.riskFailed}</p>
          : !lookup ? <p className="text-[11px] sm:text-[10px] text-[#71858d] sm:col-span-2">{t.livestock.form.riskChecking}</p> : null)}
        <label className="text-xs font-bold text-[#91a3aa]">{t.common.addedDate}<input required name="addedAt" type="date" defaultValue={localIsoDate()} className={field} /></label><label className="text-xs font-bold text-[#91a3aa] sm:col-span-2">{t.common.notes}<textarea name="notes" rows={2} className={field} /></label>
      </div>
      <div className="mt-7 flex justify-end gap-2"><button type="button" onClick={close} className="min-h-11 min-w-11 rounded-xl border border-white/[.08] px-5 py-3 text-xs font-bold text-[#91a3aa] sm:min-h-0 sm:min-w-0">{t.common.cancel}</button><button disabled={!hasSelectedProfile || Boolean(unresolvedMatch)} className="min-h-11 min-w-11 rounded-xl bg-aqua px-5 py-3 text-xs font-extrabold text-ink disabled:opacity-40 sm:min-h-0 sm:min-w-0">{t.livestock.form.submit}</button></div>
    </form>
  </ModalDialog>;
}
