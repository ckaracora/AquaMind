"use client";

import { FormEvent, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Check, Search, X } from "lucide-react";
import { ModalDialog } from "@/components/modal-dialog";
import { speciesById, speciesCatalog, speciesForCatalogExactSearch, speciesForCatalogSearch, speciesForCategoryAndWaterType, speciesForOtherWaterExactName, speciesGroup, speciesGroupsForCategoryAndWaterType, speciesMatchesForCatalogSearch, speciesWaterTypes } from "@/data/catalog-species";
import { unresolvedSpeciesForSearch } from "@/data/catalog-species-unresolved";
import type { SpeciesProfile, SpeciesSearchName } from "@/data/catalog-species";
import type { UnresolvedSpeciesListing } from "@/data/catalog-species-unresolved";
import { localIsoDate } from "@/lib/local-date";
import { useDisplayFormat } from "@/lib/use-display-format";
import { useI18n } from "@/providers/i18n-provider";
import type { Aquarium, AquariumType, Livestock } from "@/types/aquarium";

// Canlı sınıfları; adları dil dosyasındadır (`t.livestock.categories[category]`).
const allCategories: Livestock["category"][] = ["fish", "shrimp", "snail", "other"];
const field = "mt-1.5 w-full rounded-xl border border-white/[.08] bg-[#09171e] px-3 py-3 text-sm outline-none focus:border-aqua/60";
const normalizeSearch = (value: string) => value.trim().toLocaleLowerCase("tr-TR").replaceAll("ı", "i").replace(/\s+/g, " ");
const searchableText = (item: SpeciesProfile) => normalizeSearch(`${item.commonName} ${item.scientificName} ${(item.aliases ?? []).join(" ")}`);

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

/** Akvaryumun su türü ve ekranın dilindeki tür adı (aramayla aynı biçimde; Türkçede verilmez ya da `undefined` döner). */
export interface LivestockSearchContext { waterType: AquariumType; translatedName?: SpeciesSearchName }

// Eşleşme sırası (ürün sahibi kararı 2026-11-11). Ekranda gösterilen değerler ve arama değişince yapılan seçim aynı sırayı kullanır:
// 1. arama boş; 2. bu su türünde tam ad (çeviri dahil); 3. çözülmemiş satış adı (güvenlik kutusu); 4. başka su türünde tam ad (çeviri
// dahil): seçim yok, uyarı ve bu akvaryum türü ile sınıfındaki bütün kısmi eşleşmeler öneri olarak; 5. kısmi eşleşme (katalog sırasındaki
// ilk tür, bugünkü gibi); 6. eşleşme yok.
export function livestockSearch(query: string, category: Livestock["category"], { waterType, translatedName }: LivestockSearchContext): LivestockSearch {
  const normalized = normalizeSearch(query);
  if (!normalized) return { kind: "empty" };
  const translatedMatch = (exact: boolean) => translatedName === undefined ? undefined : speciesForCategoryAndWaterType(category, waterType).find((item) => {
    const name = translatedName(item);
    return name !== undefined && (exact ? name === normalized : name.includes(normalized));
  });
  const exact = speciesForCatalogExactSearch(query, category, waterType) ?? translatedMatch(true);
  if (exact) return { kind: "exact", profile: exact };
  const listing = unresolvedSpeciesForSearch(query, category, waterType);
  const otherWater = speciesForOtherWaterExactName(query, category, waterType, translatedName);
  // Satış adının kendisi (tam eşleşme) güvenlik kutusunu açar; daha uzun satış adının içinden bulunması başka su türündeki tam adın önüne
  // geçmez. Türkçe adlarda bunu çözülmemiş arama kendisi yapar (`unresolvedSpeciesForSearch`); ekranın dilindeki adlar için burada yapılır.
  if (listing && (!otherWater || [listing.name, ...(listing.aliases ?? [])].some((name) => normalizeSearch(name) === normalized))) return { kind: "unresolved", listing };
  if (otherWater) return { kind: "otherWater", profile: otherWater, suggestions: speciesMatchesForCatalogSearch(query, category, waterType, translatedName) };
  const partial = speciesForCatalogSearch(query, category, waterType) ?? translatedMatch(false);
  return partial ? { kind: "partial", profile: partial } : { kind: "none" };
}

/** Penceredeki seçimler. `fromSuggestion`: tür, başka su türü uyarısının önerisinden seçildi (kartta yazar, ekran okuyucu okur). */
export interface LivestockFormState {
  category: Livestock["category"];
  group: SpeciesGroupKey;
  query: string;
  /** Seçili türün kimliği; boşsa tür seçilmemiştir. */
  selected: string;
  quantity: number;
  fromSuggestion: boolean;
  showAllSuggestions: boolean;
}

/** Sınıf değişince (ve pencere açılınca): sınıfın ilk türü seçilir, arama ve öneri bilgisi silinir. */
export function changeLivestockCategory(category: Livestock["category"], waterType: AquariumType): LivestockFormState {
  const first = speciesForCategoryAndWaterType(category, waterType)[0];
  return { category, group: first ? speciesGroup(first) : "other", query: "", selected: first?.id ?? "", quantity: first?.minGroup ?? 1, fromSuggestion: false, showAllSuggestions: false };
}

/** Pencere açılırken sınıf, akvaryumun su türünde canlısı olan bir sınıf olmalıdır. */
export function livestockFormStart(initialCategory: Livestock["category"], waterType: AquariumType): LivestockFormState {
  const compatible = speciesCatalog.filter((item) => speciesWaterTypes(item).includes(waterType));
  return changeLivestockCategory(compatible.some((item) => item.category === initialCategory) ? initialCategory : (compatible[0]?.category ?? initialCategory), waterType);
}

export function changeLivestockGroup(state: LivestockFormState, group: SpeciesGroupKey, waterType: AquariumType): LivestockFormState {
  const first = speciesForCategoryAndWaterType(state.category, waterType).find((item) => speciesGroup(item) === group);
  return { ...state, group, query: "", selected: first?.id ?? "", quantity: first?.minGroup ?? 1, fromSuggestion: false, showAllSuggestions: false };
}

export function changeLivestockQuery(state: LivestockFormState, query: string, context: LivestockSearchContext): LivestockFormState {
  const next: LivestockFormState = { ...state, query, fromSuggestion: false, showAllSuggestions: false };
  const search = livestockSearch(query, state.category, context);
  switch (search.kind) {
    case "empty": {
      const first = speciesForCategoryAndWaterType(state.category, context.waterType).find((item) => speciesGroup(item) === state.group);
      return { ...next, selected: first?.id ?? "", quantity: first?.minGroup ?? 1 };
    }
    case "exact":
    case "partial":
      return { ...next, group: speciesGroup(search.profile), selected: search.profile.id, quantity: search.profile.minGroup };
    case "unresolved":
      return { ...next, group: search.listing.group, selected: "" };
    case "otherWater":
    case "none":
      return { ...next, selected: "" };
  }
}

/** Listeden tür seçilince öneri bilgisi silinir. */
export function changeLivestockSpecies(state: LivestockFormState, id: string): LivestockFormState {
  return { ...state, selected: id, quantity: speciesById(id)?.minGroup ?? 1, fromSuggestion: false };
}

/** Öneriye tıklanınca grup o türün grubuna geçer ve tür seçilir; adet türün en az grup sayısı olur (zaten seçiliyse adet korunur). */
export function pickLivestockSuggestion(state: LivestockFormState, profile: SpeciesProfile): LivestockFormState {
  return { ...state, group: speciesGroup(profile), selected: profile.id, quantity: state.selected === profile.id ? state.quantity : profile.minGroup, fromSuggestion: true };
}

export const showAllLivestockSuggestions = (state: LivestockFormState): LivestockFormState => ({ ...state, showAllSuggestions: true });

// Aranan metnin addaki yeri: ad, aramayla aynı kuralla harf harf küçültülür (Türkçe büyük-küçük harf, "ı", boşluklar); bulunan parça
// özgün yazımıyla vurgulanır.
function matchRange(text: string, query: string): [number, number] | undefined {
  if (!query) return undefined;
  let normalized = "";
  const origin: number[] = [];
  let space = true;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (/\s/.test(char)) {
      if (!space) { normalized += " "; origin.push(index); space = true; }
      continue;
    }
    const lower = char.toLocaleLowerCase("tr-TR").replaceAll("ı", "i");
    for (let unit = 0; unit < lower.length; unit += 1) { normalized += lower[unit]; origin.push(index); }
    space = false;
  }
  const at = normalized.indexOf(query);
  return at < 0 ? undefined : [origin[at], origin[at + query.length - 1] + 1];
}

function Highlighted({ text, query }: { text: string; query: string }): ReactNode {
  const range = matchRange(text, query);
  if (!range) return text;
  return <>{text.slice(0, range[0])}<span className="font-extrabold text-[#edf7f6] underline decoration-aqua/60 decoration-2 underline-offset-2">{text.slice(range[0], range[1])}</span>{text.slice(range[1])}</>;
}

/**
 * Başka su türü uyarısı ve öneriler (ürün sahibi kararı 2026-11-11). Tür kendiliğinden seçilmez; öneriye tıklanınca seçilir. Tür seçilince
 * uyarı küçülür (başlık ve aranan türün adı kalır), öbür öneriler görünür kalır. En çok `VISIBLE_SUGGESTIONS` öneri görünür. `query` aramanın
 * `normalizeSearch` biçimidir; `announced` öneriden seçilen türün adıdır (ekran okuyucu okur).
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

/** Seçili türün kartı. `searchedFor` verilirse tür öneriden seçilmiştir; kartın altında kullanıcının aradığı adla yazar. */
export function SelectedSpeciesCard({ profile, searchedFor }: { profile: SpeciesProfile; searchedFor?: string }) {
  const fmt = useDisplayFormat();
  const { t, catalogText } = useI18n();
  const f = t.livestock.form;
  return <div className="rounded-xl border border-aqua/15 bg-aqua/[.05] p-4 sm:col-span-2"><div className="flex justify-between"><div><p className="text-sm font-extrabold">{catalogText(profile.commonName) ?? profile.commonName}</p><p className="mt-1 text-[11px] sm:text-[10px] italic text-[#71858d]">{profile.scientificName}</p></div><span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[11px] sm:text-[8px] font-bold text-emerald-400">{f.inCatalog}</span></div><div className="mt-3 grid grid-cols-3 gap-2 text-[11px] sm:text-[9px]"><span>{f.adultSize} <b>{profile.adultSizeCm} cm</b></span><span>{f.minVolume} <b>{fmt.volume(profile.minVolumeL)}</b></span><span>{f.minGroup} <b>{profile.minGroup}+</b></span></div>{searchedFor !== undefined && <p className="mt-3 flex items-start gap-1.5 border-t border-aqua/15 pt-2.5 text-[11px] sm:text-[10px] font-semibold leading-normal text-aqua"><Check size={13} strokeWidth={3} aria-hidden="true" className="mt-0.5 shrink-0" /><span>{f.chosenFromSuggestion(searchedFor)}</span></p>}</div>;
}

export function CatalogLivestockForm({ aquarium, initialCategory, close, submit }: { aquarium: Aquarium; initialCategory: Livestock["category"]; close: () => void; submit: (e: FormEvent<HTMLFormElement>) => void }) {
  // Katalogdaki hacim referansları ayarlardaki birimde (litre/galon) yazılır.
  const fmt = useDisplayFormat();
  const { t, catalogText } = useI18n();
  // Tür adı çevirisi yoksa katalogdaki ad kalır; çevirisi olmayan not gösterilmez (ürün sahibi kararı 2026-10-30).
  const speciesName = (item: SpeciesProfile) => catalogText(item.commonName) ?? item.commonName;
  // Başka dilde tür adının çevirisi de aranır; Türkçe ad, bilimsel ad ve eş adlar her dilde aranır. Türkçede çeviri adın kendisidir.
  const translatedName: SpeciesSearchName = (item) => {
    const name = catalogText(item.commonName);
    return name !== undefined && name !== item.commonName ? normalizeSearch(name) : undefined;
  };
  const searchContext: LivestockSearchContext = { waterType: aquarium.type, translatedName };
  const compatibleSpecies = speciesCatalog.filter((item) => speciesWaterTypes(item).includes(aquarium.type));
  const categories = allCategories.filter((key) => compatibleSpecies.some((item) => item.category === key));
  const [form, setForm] = useState(() => livestockFormStart(initialCategory, aquarium.type));
  const { category, group, query, selected, quantity } = form;
  const categoryItems = speciesForCategoryAndWaterType(category, aquarium.type);
  const groups = speciesGroupsForCategoryAndWaterType(category, aquarium.type);
  const normalizedQuery = normalizeSearch(query);
  const allGroupItems = categoryItems.filter((item) => speciesGroup(item) === group);
  const groupItems = allGroupItems.filter((item) => searchableText(item).includes(normalizedQuery) || Boolean(translatedName(item)?.includes(normalizedQuery)));
  const profile = speciesById(selected);
  const search = livestockSearch(query, category, searchContext);
  const unresolvedMatch = search.kind === "unresolved" ? search.listing : undefined;
  // Aranan ad bu akvaryum türünde tam ad değil ama başka su türündeki doğrulanmış bir türün tam adıysa tür seçilmez; türün bu akvaryum
  // türüne uygun olmadığı söylenir (veri testi, 2026-11-10) ve bu akvaryuma uygun, adı benzeyen türler öneri olarak çıkar (2026-11-11).
  const otherWaterMatch = search.kind === "otherWater" ? search : undefined;
  // Çözülmemiş satış adının gerekçesi katalog metnidir: çevirisi olmayan dilde gösterilmez (ürün sahibi kararı 2026-10-30); ad katalogdaki adla kalır.
  const unresolvedReason = unresolvedMatch ? catalogText(unresolvedMatch.reason) : undefined;

  const hasSelectedProfile = Boolean(profile && groupItems.some((item) => item.id === profile.id));
  const chosenFromSuggestion = form.fromSuggestion && hasSelectedProfile;
  const requiredVolumeL = profile ? profile.minVolumeL + Math.max(0, quantity - 1) * (profile.additionalVolumePerAnimalL ?? 0) : 0;
  const issues = profile ? [
    aquarium.netVolumeLiters < requiredVolumeL ? t.livestock.form.volumeIssue(fmt.volume(requiredVolumeL)) : "",
    profile.minTankLengthCm !== undefined && aquarium.lengthCm < profile.minTankLengthCm ? t.livestock.form.lengthIssue(profile.minTankLengthCm) : "",
    profile.tankLengthDataNote ? (catalogText(profile.tankLengthDataNote) ?? "") : "",
    quantity < profile.minGroup ? t.livestock.form.groupIssue(profile.minGroup) : "",
  ].filter(Boolean) : [];
  const titleId = useId();
  const descriptionId = useId();

  return <ModalDialog close={close} labelledBy={titleId} describedBy={descriptionId}>
    <form onSubmit={submit}>
      <div className="mb-6 flex justify-between"><div><p className="eyebrow text-aqua">{aquarium.name}</p><h2 id={titleId} className="mt-1 text-xl font-extrabold">{t.livestock.form.title}</h2><p id={descriptionId} className="mt-1 text-[11px] sm:text-[10px] text-[#647981]">{t.livestock.form.help}</p></div><button type="button" onClick={close} aria-label={t.common.close} className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/[.04] text-[#71858d] sm:size-9"><X size={17} /></button></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-bold text-[#91a3aa]">{t.livestock.form.category}<select value={category} onChange={(e) => setForm(changeLivestockCategory(e.target.value as Livestock["category"], aquarium.type))} className={field}>{categories.map((key) => <option key={key} value={key}>{t.livestock.categories[key]}</option>)}</select></label>
        <label className="text-xs font-bold text-[#91a3aa]">{t.livestock.form.group}<select value={group} onChange={(e) => { const next = e.target.value as SpeciesGroupKey; setForm((current) => changeLivestockGroup(current, next, aquarium.type)); }} className={field}>{groups.map((item) => <option key={item} value={item}>{t.livestock.speciesGroups[item]}</option>)}</select></label>
        <label className="relative text-xs font-bold text-[#91a3aa] sm:col-span-2">{t.livestock.form.search}<Search size={15} className="pointer-events-none absolute left-3 top-[42px] text-[#586e77]" /><input value={query} onChange={(e) => { const next = e.target.value; setForm((current) => changeLivestockQuery(current, next, searchContext)); }} placeholder={t.livestock.form.searchPlaceholder} className={`${field} pl-9`} /></label>
        {unresolvedMatch && <div className="rounded-xl border border-amber-300/20 bg-amber-300/[.07] p-4 sm:col-span-2"><div className="flex items-start justify-between gap-3"><div><p className="text-[11px] sm:text-[10px] font-extrabold text-amber-300">{t.livestock.form.unresolvedTitle}</p><p className="mt-1 text-sm font-bold text-amber-50">{catalogText(unresolvedMatch.name) ?? unresolvedMatch.name}</p></div><span className="rounded-full bg-amber-300/10 px-2 py-1 text-[11px] sm:text-[8px] font-bold text-amber-200">{t.livestock.form.unresolvedBadge}</span></div>{unresolvedReason && <p className="mt-2 text-[11px] sm:text-[10px] leading-relaxed text-amber-100/65">{unresolvedReason}</p>}<p className="mt-2 text-[11px] sm:text-[9px] font-semibold text-amber-200/70">{t.livestock.form.unresolvedBlocked}</p><a href={unresolvedMatch.sourceUrl} target="_blank" rel="noreferrer" className="-mb-[15.25px] -mt-[3.25px] inline-flex min-h-11 items-center text-[11px] sm:text-[9px] font-bold text-aqua hover:underline">{t.livestock.form.unresolvedSource}</a></div>}
        {otherWaterMatch && <OtherWaterNotice match={otherWaterMatch.profile} aquariumType={aquarium.type} suggestions={otherWaterMatch.suggestions} query={normalizedQuery} selectedId={hasSelectedProfile ? selected : undefined} announced={chosenFromSuggestion && profile ? speciesName(profile) : undefined} showAll={form.showAllSuggestions} pick={(item) => setForm((current) => pickLivestockSuggestion(current, item))} showAllSuggestions={() => setForm(showAllLivestockSuggestions)} />}
        <label className="text-xs font-bold text-[#91a3aa] sm:col-span-2">{t.livestock.form.species}<select required name="catalogId" value={hasSelectedProfile ? selected : ""} onChange={(e) => { const next = e.target.value; setForm((current) => changeLivestockSpecies(current, next)); }} className={field}><option value="" disabled>{groupItems.length ? t.livestock.form.chooseSpecies : unresolvedMatch ? t.livestock.form.awaitingIdentity : t.livestock.form.noMatch}</option>{groupItems.map((item) => <option key={item.id} value={item.id}>{speciesName(item)} · {item.scientificName}</option>)}</select></label>
        {hasSelectedProfile && profile && <SelectedSpeciesCard profile={profile} searchedFor={chosenFromSuggestion ? query.trim() : undefined} />}
        <label className="text-xs font-bold text-[#91a3aa]">{t.common.quantity}<input required name="quantity" type="number" inputMode="numeric" min="1" value={quantity} onChange={(e) => { const next = Number(e.target.value); setForm((current) => ({ ...current, quantity: next })); }} className={field} /></label><label className="text-xs font-bold text-[#91a3aa]">{t.livestock.form.gender}<select name="gender" className={field}><option value="unknown">{t.livestock.form.genders.unknown}</option><option value="mixed">{t.livestock.form.genders.mixed}</option><option value="male">{t.livestock.form.genders.male}</option><option value="female">{t.livestock.form.genders.female}</option></select></label>
        {issues.length > 0 && <div className="rounded-xl border border-amber-300/15 bg-amber-300/[.06] p-4 sm:col-span-2"><p className="text-[11px] sm:text-[10px] font-extrabold text-amber-300">{t.livestock.form.beforeSaving}</p>{issues.map((issue) => <p key={issue} className="mt-2 text-[11px] sm:text-[9px] text-amber-100/65">• {issue}</p>)}</div>}
        <label className="text-xs font-bold text-[#91a3aa]">{t.common.addedDate}<input required name="addedAt" type="date" defaultValue={localIsoDate()} className={field} /></label><label className="text-xs font-bold text-[#91a3aa] sm:col-span-2">{t.common.notes}<textarea name="notes" rows={2} className={field} /></label>
      </div>
      <div className="mt-7 flex justify-end gap-2"><button type="button" onClick={close} className="min-h-11 min-w-11 rounded-xl border border-white/[.08] px-5 py-3 text-xs font-bold text-[#91a3aa] sm:min-h-0 sm:min-w-0">{t.common.cancel}</button><button disabled={!hasSelectedProfile || Boolean(unresolvedMatch)} className="min-h-11 min-w-11 rounded-xl bg-aqua px-5 py-3 text-xs font-extrabold text-ink disabled:opacity-40 sm:min-h-0 sm:min-w-0">{t.livestock.form.submit}</button></div>
    </form>
  </ModalDialog>;
}
