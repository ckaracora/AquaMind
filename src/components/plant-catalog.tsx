"use client";

import { FormEvent, useId, useState } from "react";
import { AlertTriangle, ChevronDown, ImagePlus, Leaf, Search, X } from "lucide-react";
import { ModalDialog } from "@/components/modal-dialog";
import type { PlantProfile, PlantSearchResult } from "@/data/catalog-plants";
import { localIsoDate } from "@/lib/local-date";
import type { usePlantCatalog } from "@/lib/use-plant-catalog";
import { useDisplayFormat } from "@/lib/use-display-format";
import { useI18n } from "@/providers/i18n-provider";
import type { Plant } from "@/types/aquarium";

// Bitki kataloğundan seçme (docs/DECISIONS/0024-bitki-secme.md). Bu dosya kataloğu yalnız tür olarak içe aktarır; kayıtlar
// `usePlantCatalog` ile ayrı bir parça olarak yüklenip buraya verilir.

// Bitki konumları. Kayda Türkçe adıyla yazılır (kayıt biçimi; var olan kayıtlar bu değerleri taşır), ekranda dil dosyasındaki ad
// gösterilir (`t.plants.positions[key]`). Katalogdaki yerleşimler aynı anahtarları kullanır ("other" dışında).
export const plantPositions = [["Ön plan", "foreground"], ["Orta plan", "midground"], ["Arka plan", "background"], ["Kök üzeri", "onRoot"], ["Kaya üzeri", "onRock"], ["Yüzen", "floating"], ["Diğer", "other"]] as const;
const positionValue = new Map<string, string>(plantPositions.map(([value, key]) => [key, value]));
const field = "mt-1.5 w-full rounded-xl border border-white/[.08] bg-[#09171e] px-3 py-3 text-sm outline-none focus:border-aqua/60";
const visibleResults = 8;
// Kaynak adları (özel ad; çevrilmez). Kayıttaki adreslerin sunucusuna göre.
const sourceNames: Record<string, string> = { "www.fishkeeper.co.uk": "Fishkeeper", "tropica.com": "Tropica", "plant-directory.ifas.ufl.edu": "UF/IFAS" };

/** Kaynağın önerdiği yerleşimler, kayıttaki konum değeriyle (ilki pencerede seçili gelir). */
export const suggestedPositions = (item: PlantProfile) => (item.placements ?? []).map((key) => positionValue.get(key)).filter((value): value is string => Boolean(value));

/** Pencerenin kaydı: katalogdan seçilen bitkide bilimsel ad ve katalog kimliği katalogdan; elle yazılan bitkide kullanıcının yazdığı. */
export function plantRecord(fields: { aquariumId: string; name: string; scientificName?: string; quantity: number; position: string; addedAt: string; notes: string }, item?: PlantProfile): Plant {
  const base = { id: crypto.randomUUID(), aquariumId: fields.aquariumId, name: fields.name, quantity: fields.quantity, position: fields.position, addedAt: fields.addedAt, notes: fields.notes };
  return item ? { ...base, scientificName: item.scientificName, catalogId: item.id } : { ...base, scientificName: fields.scientificName ?? "" };
}

/**
 * Pencerenin gönderdiği formdan kayıt. Katalog aramasında bitki seçilmemişse (ör. arama alanında Enter) kayıt kurulmaz; ad boşsa ya da adet
 * 1'den küçükse de kurulmaz (alanların `required`/`min` sınırı tarayıcıda atlanırsa diye).
 */
export function plantFromForm(data: FormData, state: { aquariumId: string; manual: boolean; selected?: PlantProfile }): Plant | undefined {
  if (!state.manual && !state.selected) return undefined;
  const text = (key: string) => String(data.get(key) ?? "");
  const quantity = Number(data.get("quantity"));
  if (!text("name").trim() || !Number.isFinite(quantity) || quantity < 1) return undefined;
  return plantRecord({ aquariumId: state.aquariumId, name: text("name"), scientificName: text("scientificName"), quantity, position: text("position"), addedAt: text("addedAt"), notes: text("notes") }, state.manual ? undefined : state.selected);
}

type Messages = ReturnType<typeof useI18n>["t"];
type Format = ReturnType<typeof useDisplayFormat>;
type CatalogState = ReturnType<typeof usePlantCatalog>;

// Kayıttaki değerlerin ekrandaki yazısı; kaynakta olmayan değer `undefined` döner ("Kaynakta yok" yazılır).
function plantValues(item: PlantProfile, t: Messages, fmt: Format) {
  const c = t.plants.catalog;
  const pair = <T extends string>(range: [T, T] | undefined, text: (value: T) => string) => range && (range[0] === range[1] ? text(range[0]) : `${text(range[0])}–${text(range[1])}`);
  const oneDecimal = { maximumFractionDigits: 1 };
  return {
    light: pair(item.light, (level) => c.levels[level]),
    co2: item.co2 && c.levels[item.co2],
    growth: pair(item.growth, (rate) => c.growthRates[rate]),
    temperature: item.temperature && `${fmt.temperatureNumber(item.temperature[0], oneDecimal)}–${fmt.temperatureNumber(item.temperature[1], oneDecimal)} ${fmt.temperatureSymbol}`,
    ph: item.ph && `${fmt.number(item.ph[0], oneDecimal)}–${fmt.number(item.ph[1], oneDecimal)}`,
    height: item.heightCm === undefined ? undefined : fmt.number(item.heightCm),
  };
}

/** Kısa bilgi (ışık, CO₂, boy): arama sonucunda ve bitki listesindeki kartta. */
export function PlantShortFacts({ item }: { item: PlantProfile }) {
  const { t } = useI18n();
  const fmt = useDisplayFormat();
  const c = t.plants.catalog;
  const values = plantValues(item, t, fmt);
  const chips = [
    `${c.light} ${values.light ?? c.missing.toLocaleLowerCase("tr-TR")}`,
    `${c.co2} ${values.co2 ?? c.missing.toLocaleLowerCase("tr-TR")}`,
    values.height ? c.heightShort(values.height) : `${c.height} ${c.missing.toLocaleLowerCase("tr-TR")}`,
  ];
  // Arama sonucu düğmesinin içinde de kullanıldığı için yalnız satır içi öğeler (düğmenin içinde liste olamaz).
  return <span className="flex flex-wrap gap-1.5">{chips.map((chip) => <span key={chip} className="rounded-lg bg-white/[.04] px-2 py-1 text-[11px] sm:text-[10px] font-bold text-[#91a3aa]">{chip}</span>)}</span>;
}

/** Bütün bilgiler: seçilen bitkide ve kartın ayrıntısında. Kaynakta olmayan bilgi "Kaynakta yok" yazar. Etiketler büyük harfe çevrilmez ("pH"). */
export function PlantFacts({ item }: { item: PlantProfile }) {
  const { t } = useI18n();
  const fmt = useDisplayFormat();
  const c = t.plants.catalog;
  const values = plantValues(item, t, fmt);
  const rows: [string, string | undefined][] = [
    [c.light, values.light && values.light.charAt(0).toLocaleUpperCase("tr-TR") + values.light.slice(1)],
    [c.co2, values.co2 && values.co2.charAt(0).toLocaleUpperCase("tr-TR") + values.co2.slice(1)],
    [c.temperature, values.temperature],
    [c.ph, values.ph],
    [c.height, values.height && c.heightUpTo(values.height)],
    [c.growth, values.growth],
  ];
  return <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">{rows.map(([label, value]) => <div key={label} className="rounded-xl bg-white/[.03] p-3"><dt className="text-[11px] sm:text-[10px] font-bold text-[#647981]">{label}</dt><dd className={`mt-1 text-xs font-bold ${value ? "text-[#dbe7ea]" : "text-[#647981]"}`}>{value ?? c.missing}</dd></div>)}</dl>;
}

/** İstilacı tür listesindeki bitkinin uyarısı (kaynaklı etiket; "Türkiye'de yasak" anlamına gelmez). `short` kartta tek satır yazar. */
export function PlantInvasiveNotice({ item, short = false }: { item: PlantProfile; short?: boolean }) {
  const { t } = useI18n();
  const c = t.plants.catalog.invasive;
  const listings = item.invasiveListings ?? [];
  if (!listings.length) return null;
  if (short) return <p className="flex items-center gap-1.5 text-[11px] sm:text-[10px] font-bold text-amber-300"><AlertTriangle size={13} className="shrink-0"/>{c.short}</p>;
  const lists = [listings.some((listing) => listing.list === "us-federal-noxious-weed") && c.federal, listings.some((listing) => listing.list === "fisc-invasive") && c.fisc].filter((text): text is string => Boolean(text));
  return <div className="flex gap-3 rounded-xl border border-amber-300/20 bg-amber-300/[.06] p-4"><AlertTriangle size={17} className="mt-0.5 shrink-0 text-amber-300"/><div><p className="text-xs font-extrabold text-amber-200">{c.title}</p><p className="mt-1 text-[11px] sm:text-[10px] leading-relaxed text-amber-100/80">{c.text(lists.join(c.and))}</p></div></div>;
}

/** Kaydın kaynakları (Fishkeeper, Tropica, UF/IFAS); her kaynağın ilk sayfasına bağlanır. */
export function PlantSources({ item }: { item: PlantProfile }) {
  const { t } = useI18n();
  const urls = [item.sourceUrl, ...(item.additionalSourceUrls ?? []), ...(item.invasiveListings ?? []).map((listing) => listing.sourceUrl)];
  const links = new Map<string, string>();
  for (const url of urls) {
    const name = sourceNames[new URL(url).host] ?? new URL(url).host;
    if (!links.has(name)) links.set(name, url);
  }
  return <p className="text-[11px] sm:text-[10px] text-[#647981]">{t.plants.catalog.sources}: {[...links].map(([name, url], index) => <span key={name}>{index > 0 && " · "}<a href={url} target="_blank" rel="noreferrer" className="font-bold text-aqua underline-offset-2 hover:underline">{name}</a></span>)}</p>;
}

/** Arama sonuçları: en çok sekiz sonuç; fazlası için aramanın daraltılması önerilir. */
export function PlantSearchResults({ results, select }: { results: PlantSearchResult[]; select: (result: PlantSearchResult) => void }) {
  const { t } = useI18n();
  const fmt = useDisplayFormat();
  const c = t.plants.catalog;
  if (!results.length) return <p className="rounded-xl bg-white/[.025] p-4 text-[11px] sm:text-[10px] text-[#91a3aa]">{c.noResult}</p>;
  return <div><p className="mb-2 text-[11px] sm:text-[10px] font-bold text-[#647981]" aria-live="polite">{c.resultCount(fmt.number(results.length))}</p><ul className="grid gap-2">{results.slice(0, visibleResults).map((result) => <li key={result.item.id}><button type="button" onClick={() => select(result)} className="min-h-11 min-w-11 w-full rounded-xl border border-white/[.06] bg-white/[.025] p-3 text-left hover:border-aqua/40 sm:min-h-0 sm:min-w-0"><span className="block text-sm font-extrabold italic">{result.item.scientificName}</span>{result.item.aliases?.length ? <span className="mt-0.5 block text-[11px] sm:text-[10px] text-[#71858d]">{result.item.aliases.slice(0, 3).join(" · ")}</span> : null}<span className="mt-2 block"><PlantShortFacts item={result.item}/></span></button></li>)}</ul>{results.length > visibleResults && <p className="mt-2 text-[11px] sm:text-[10px] text-[#647981]">{c.moreResults(fmt.number(results.length - visibleResults))}</p>}</div>;
}

/** Bitki listesindeki kartın katalog bilgisi: kısa bilgi, istilacı türde kısa uyarı ve açılan ayrıntı. */
export function PlantCardCatalog({ item }: { item: PlantProfile }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  const c = t.plants.catalog;
  return <div className="mt-3 grid gap-2"><PlantShortFacts item={item}/><PlantInvasiveNotice item={item} short/><button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls={detailsId} className="flex min-h-11 min-w-11 items-center gap-1 self-start rounded-xl text-[11px] sm:text-[10px] font-bold text-aqua sm:min-h-0 sm:min-w-0">{open ? c.hideDetails : c.showDetails}<ChevronDown size={13} className={open ? "rotate-180" : ""}/></button>{open && <div id={detailsId} className="grid gap-2"><PlantFacts item={item}/><PlantSources item={item}/></div>}</div>;
}

/** Adet, konum, tarih ve not alanları. Katalogdan seçilen bitkide konum kaynağın önerisiyle gelir; kaynak yerleşim yazmıyorsa "Seçilmedi". */
function PlantEntryFields({ suggested, fromCatalog }: { suggested: string[]; fromCatalog: boolean }) {
  const { t } = useI18n();
  const c = t.plants.catalog;
  const labelOf = (value: string) => t.plants.positions[plantPositions.find(([option]) => option === value)![1]];
  return <>
    <label className="text-xs font-bold text-[#91a3aa]">{t.common.quantity}<input required name="quantity" type="number" inputMode="numeric" min="1" defaultValue="1" className={field}/></label>
    <label className="text-xs font-bold text-[#91a3aa]">{t.plants.form.position}<select name="position" defaultValue={fromCatalog ? (suggested[0] ?? "") : undefined} className={field}>{fromCatalog && <option value="">{c.positionUnset}</option>}{plantPositions.map(([value, key]) => <option key={value} value={value}>{t.plants.positions[key]}</option>)}</select>{fromCatalog && <span className="mt-1 block text-[11px] sm:text-[10px] font-bold text-emerald-400">{suggested.length ? c.sourceSuggestions(suggested.map(labelOf).join(", ")) : c.noSourcePlacement}</span>}</label>
    <label className="text-xs font-bold text-[#91a3aa]">{t.common.addedDate}<input required name="addedAt" type="date" defaultValue={localIsoDate()} className={field}/></label>
    <label className="text-xs font-bold text-[#91a3aa] sm:col-span-2">{t.common.notes}<textarea name="notes" rows={3} className={field}/></label>
  </>;
}

/** Katalogdan seçilen bitki: bilgi kartı, istilacı uyarısı, kaynaklar ve kayıt alanları (ad aramaya uyan adla gelir). */
export function PlantSelectedFields({ selected, change }: { selected: PlantSearchResult; change: () => void }) {
  const { t } = useI18n();
  const c = t.plants.catalog;
  return <div className="grid gap-4">
    <div className="flex items-start justify-between gap-3"><div><p className="text-base font-extrabold italic">{selected.item.scientificName}</p>{selected.item.aliases?.length ? <p className="mt-0.5 text-[11px] sm:text-[10px] text-[#71858d]">{selected.item.aliases.slice(0, 3).join(" · ")}</p> : null}</div><button type="button" onClick={change} className="min-h-11 min-w-11 shrink-0 rounded-xl border border-white/[.08] px-3 text-[11px] sm:text-[10px] font-bold text-[#91a3aa] sm:min-h-0 sm:min-w-0 sm:py-2">{c.changePlant}</button></div>
    <PlantFacts item={selected.item}/>
    <PlantInvasiveNotice item={selected.item}/>
    <PlantSources item={selected.item}/>
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="text-xs font-bold text-[#91a3aa] sm:col-span-2">{t.plants.form.name}<input required name="name" defaultValue={selected.matchedName} className={field}/></label>
      <PlantEntryFields suggested={suggestedPositions(selected.item)} fromCatalog/>
    </div>
  </div>;
}

/** Bitki ekleme penceresi: önce katalogda arama; "Katalogda yok" ile elle yazma (bugünkü form). */
export function PlantForm({ aquariumId, aquariumName, catalog, close, save }: { aquariumId: string; aquariumName: string; catalog: CatalogState; close: () => void; save: (plant: Plant) => void }) {
  const titleId = useId();
  const { t } = useI18n();
  const c = t.plants.catalog;
  const [manual, setManual] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<PlantSearchResult>();
  const results = catalog.catalog && query.trim() ? catalog.catalog.searchPlants(query) : [];
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const plant = plantFromForm(new FormData(e.currentTarget), { aquariumId, manual, selected: selected?.item });
    if (plant) save(plant);
  }
  let body;
  if (manual) {
    body = <div className="grid gap-4 sm:grid-cols-2">
      <label className="text-xs font-bold text-[#91a3aa]">{t.plants.form.name}<input required name="name" placeholder={t.plants.form.namePlaceholder} className={field}/></label>
      <label className="text-xs font-bold text-[#91a3aa]">{t.plants.form.scientificName}<input name="scientificName" placeholder={t.plants.form.scientificPlaceholder} className={field}/></label>
      <PlantEntryFields suggested={[]} fromCatalog={false}/>
      <div className="flex items-center gap-3 rounded-xl border border-dashed border-white/10 p-4 text-[#647981] sm:col-span-2"><ImagePlus size={19}/><p className="text-[11px] sm:text-[10px]">{t.plants.form.photoLater}</p></div>
      <button type="button" onClick={() => setManual(false)} className="min-h-11 min-w-11 justify-self-start rounded-xl text-xs font-bold text-aqua sm:col-span-2 sm:min-h-0 sm:min-w-0">{c.backToCatalog}</button>
    </div>;
  } else if (selected) {
    body = <PlantSelectedFields key={selected.item.id} selected={selected} change={() => setSelected(undefined)}/>;
  } else {
    body = <div className="grid gap-4">
      <label className="text-xs font-bold text-[#91a3aa]">{c.searchLabel}<span className="relative block"><Search size={15} className="pointer-events-none absolute left-3 top-[1.15rem] text-[#586e77]"/><input type="search" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }} enterKeyHint="search" placeholder={c.searchPlaceholder} disabled={!catalog.catalog} className={`${field} pl-9`}/></span><span className="mt-1 block text-[11px] sm:text-[10px] font-normal text-[#647981]">{c.searchHint}</span></label>
      {catalog.catalog ? (query.trim() ? <PlantSearchResults results={results} select={setSelected}/> : null) : catalog.failed
        ? <div className="flex flex-wrap items-center gap-3 rounded-xl bg-red-400/[.06] p-4 text-[11px] sm:text-[10px] text-red-200"><span>{c.failed}</span><button type="button" onClick={catalog.retry} className="min-h-11 min-w-11 rounded-xl border border-red-300/20 px-3 font-bold sm:min-h-0 sm:min-w-0 sm:py-2">{c.retry}</button></div>
        : <p className="flex items-center gap-2 rounded-xl bg-white/[.025] p-4 text-[11px] sm:text-[10px] text-[#91a3aa]"><Leaf size={14} className="text-emerald-400"/>{c.loading}</p>}
      <button type="button" onClick={() => setManual(true)} className="min-h-11 min-w-11 justify-self-start rounded-xl text-xs font-bold text-aqua sm:min-h-0 sm:min-w-0">{c.manual}</button>
    </div>;
  }
  const canSave = manual || Boolean(selected);
  return <ModalDialog close={close} labelledBy={titleId}><form onSubmit={submit}>
    <div className="mb-6 flex justify-between"><div><p className="eyebrow text-emerald-400">{aquariumName}</p><h2 id={titleId} className="mt-1 text-xl font-extrabold">{t.plants.form.title}</h2></div><button type="button" onClick={close} aria-label={t.common.close} className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/[.04] text-[#71858d] sm:size-9"><X size={17}/></button></div>
    {body}
    <div className="mt-7 flex justify-end gap-2"><button type="button" onClick={close} className="min-h-11 min-w-11 rounded-xl border border-white/[.08] px-5 py-3 text-xs font-bold text-[#91a3aa] sm:min-h-0 sm:min-w-0">{t.common.cancel}</button>{canSave && <button className="min-h-11 min-w-11 rounded-xl bg-aqua px-5 py-3 text-xs font-extrabold text-ink sm:min-h-0 sm:min-w-0">{t.plants.form.submit}</button>}</div>
  </form></ModalDialog>;
}
