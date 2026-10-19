"use client";

import { FormEvent, useId, useState } from "react";
import { Search, X } from "lucide-react";
import { ModalDialog } from "@/components/modal-dialog";
import { speciesById, speciesCatalog, speciesForCatalogExactSearch, speciesForCatalogSearch, speciesForCategoryAndWaterType, speciesGroup, speciesGroupLabels, speciesGroupsForCategoryAndWaterType, speciesWaterTypes } from "@/data/catalog-species";
import { unresolvedSpeciesForSearch } from "@/data/catalog-species-unresolved";
import type { SpeciesProfile } from "@/data/catalog-species";
import { useDisplayFormat } from "@/lib/use-display-format";
import { useI18n } from "@/providers/i18n-provider";
import type { Aquarium, Livestock } from "@/types/aquarium";

// Canlı sınıfları; adları dil dosyasındadır (`t.livestock.categories[category]`).
const allCategories: Livestock["category"][] = ["fish", "shrimp", "snail", "other"];
const field = "mt-1.5 w-full rounded-xl border border-white/[.08] bg-[#09171e] px-3 py-3 text-sm outline-none focus:border-aqua/60";
const normalizeSearch = (value: string) => value.trim().toLocaleLowerCase("tr-TR").replaceAll("ı", "i").replace(/\s+/g, " ");
const searchableText = (item: SpeciesProfile) => normalizeSearch(`${item.commonName} ${item.scientificName} ${(item.aliases ?? []).join(" ")}`);

export function CatalogLivestockForm({ aquarium, initialCategory, close, submit }: { aquarium: Aquarium; initialCategory: Livestock["category"]; close: () => void; submit: (e: FormEvent<HTMLFormElement>) => void }) {
  // Katalogdaki hacim referansları ayarlardaki birimde (litre/galon) yazılır.
  const fmt = useDisplayFormat();
  const { t } = useI18n();
  const compatibleSpecies = speciesCatalog.filter((item) => speciesWaterTypes(item).includes(aquarium.type));
  const categories = allCategories.filter((key) => compatibleSpecies.some((item) => item.category === key));
  const initialCompatibleCategory = compatibleSpecies.some((item) => item.category === initialCategory) ? initialCategory : (compatibleSpecies[0]?.category ?? initialCategory);
  const [category, setCategory] = useState(initialCompatibleCategory);
  const categoryItems = speciesForCategoryAndWaterType(category, aquarium.type);
  const groups = speciesGroupsForCategoryAndWaterType(category, aquarium.type);
  const [group, setGroup] = useState<NonNullable<SpeciesProfile["group"]>>(groups[0] ?? "other");
  const [query, setQuery] = useState("");
  const normalizedQuery = normalizeSearch(query);
  const allGroupItems = categoryItems.filter((item) => speciesGroup(item) === group);
  const groupItems = allGroupItems.filter((item) => searchableText(item).includes(normalizedQuery));
  const [selected, setSelected] = useState(allGroupItems[0]?.id ?? "");
  const profile = speciesById(selected);
  const [quantity, setQuantity] = useState(profile?.minGroup ?? 1);
  const exactVerifiedMatch = normalizedQuery ? speciesForCatalogExactSearch(normalizedQuery, category, aquarium.type) : undefined;
  const unresolvedMatch = normalizedQuery && !exactVerifiedMatch ? unresolvedSpeciesForSearch(query, category, aquarium.type) : undefined;
  const verifiedSearchMatch = exactVerifiedMatch ?? (unresolvedMatch ? undefined : (normalizedQuery ? speciesForCatalogSearch(normalizedQuery, category, aquarium.type) : undefined));

  function changeCategory(next: Livestock["category"]) {
    const items = speciesForCategoryAndWaterType(next, aquarium.type);
    const nextGroup = items[0] ? speciesGroup(items[0]) : "other";
    setCategory(next); setGroup(nextGroup); setQuery(""); setSelected(items[0]?.id ?? ""); setQuantity(items[0]?.minGroup ?? 1);
  }

  function changeGroup(next: string) {
    const typedGroup = next as NonNullable<SpeciesProfile["group"]>;
    const item = categoryItems.find((candidate) => speciesGroup(candidate) === typedGroup);
    setGroup(typedGroup); setQuery(""); setSelected(item?.id ?? ""); setQuantity(item?.minGroup ?? 1);
  }

  function changeQuery(next: string) {
    setQuery(next);
    const normalized = normalizeSearch(next);
    if (!normalized) {
      const item = allGroupItems[0];
      setSelected(item?.id ?? ""); setQuantity(item?.minGroup ?? 1); return;
    }
    const exactVerified = speciesForCatalogExactSearch(normalized, category, aquarium.type);
    if (exactVerified) { setGroup(speciesGroup(exactVerified)); setSelected(exactVerified.id); setQuantity(exactVerified.minGroup); return; }
    const unresolved = unresolvedSpeciesForSearch(next, category, aquarium.type);
    if (unresolved) { setGroup(unresolved.group); setSelected(""); return; }
    const item = speciesForCatalogSearch(normalized, category, aquarium.type);
    if (item) { setGroup(speciesGroup(item)); setSelected(item.id); setQuantity(item.minGroup); return; }
    setSelected("");
  }

  function changeSpecies(id: string) { setSelected(id); setQuantity(speciesById(id)?.minGroup ?? 1); }

  const hasSelectedProfile = Boolean(profile && groupItems.some((item) => item.id === profile.id));
  const requiredVolumeL = profile ? profile.minVolumeL + Math.max(0, quantity - 1) * (profile.additionalVolumePerAnimalL ?? 0) : 0;
  const issues = profile ? [
    aquarium.netVolumeLiters < requiredVolumeL ? t.livestock.form.volumeIssue(fmt.volume(requiredVolumeL)) : "",
    profile.minTankLengthCm !== undefined && aquarium.lengthCm < profile.minTankLengthCm ? t.livestock.form.lengthIssue(profile.minTankLengthCm) : "",
    profile.tankLengthDataNote ?? "",
    quantity < profile.minGroup ? t.livestock.form.groupIssue(profile.minGroup) : "",
  ].filter(Boolean) : [];
  const titleId = useId();
  const descriptionId = useId();

  return <ModalDialog close={close} labelledBy={titleId} describedBy={descriptionId}>
    <form onSubmit={submit}>
      <div className="mb-6 flex justify-between"><div><p className="eyebrow text-aqua">{aquarium.name}</p><h2 id={titleId} className="mt-1 text-xl font-extrabold">{t.livestock.form.title}</h2><p id={descriptionId} className="mt-1 text-[11px] sm:text-[10px] text-[#647981]">{t.livestock.form.help}</p></div><button type="button" onClick={close} aria-label={t.common.close} className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/[.04] text-[#71858d] sm:size-9"><X size={17} /></button></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-bold text-[#91a3aa]">{t.livestock.form.category}<select value={category} onChange={(e) => changeCategory(e.target.value as Livestock["category"])} className={field}>{categories.map((key) => <option key={key} value={key}>{t.livestock.categories[key]}</option>)}</select></label>
        <label className="text-xs font-bold text-[#91a3aa]">{t.livestock.form.group}<select value={group} onChange={(e) => changeGroup(e.target.value)} className={field}>{groups.map((item) => <option key={item} value={item}>{speciesGroupLabels[item]}</option>)}</select></label>
        <label className="relative text-xs font-bold text-[#91a3aa] sm:col-span-2">{t.livestock.form.search}<Search size={15} className="pointer-events-none absolute left-3 top-[42px] text-[#586e77]" /><input value={query} onChange={(e) => changeQuery(e.target.value)} placeholder={t.livestock.form.searchPlaceholder} className={`${field} pl-9`} /></label>
        {unresolvedMatch && <div className="rounded-xl border border-amber-300/20 bg-amber-300/[.07] p-4 sm:col-span-2"><div className="flex items-start justify-between gap-3"><div><p className="text-[11px] sm:text-[10px] font-extrabold text-amber-300">{t.livestock.form.unresolvedTitle}</p><p className="mt-1 text-sm font-bold text-amber-50">{unresolvedMatch.name}</p></div><span className="rounded-full bg-amber-300/10 px-2 py-1 text-[11px] sm:text-[8px] font-bold text-amber-200">{t.livestock.form.unresolvedBadge}</span></div><p className="mt-2 text-[11px] sm:text-[10px] leading-relaxed text-amber-100/65">{unresolvedMatch.reason}</p><p className="mt-2 text-[11px] sm:text-[9px] font-semibold text-amber-200/70">{t.livestock.form.unresolvedBlocked}</p><a href={unresolvedMatch.sourceUrl} target="_blank" rel="noreferrer" className="-mb-[15.25px] -mt-[3.25px] inline-flex min-h-11 items-center text-[11px] sm:text-[9px] font-bold text-aqua hover:underline">{t.livestock.form.unresolvedSource}</a></div>}
        <label className="text-xs font-bold text-[#91a3aa] sm:col-span-2">{t.livestock.form.species}<select required name="catalogId" value={hasSelectedProfile ? selected : ""} onChange={(e) => changeSpecies(e.target.value)} className={field}><option value="" disabled>{groupItems.length ? t.livestock.form.chooseSpecies : unresolvedMatch ? t.livestock.form.awaitingIdentity : t.livestock.form.noMatch}</option>{groupItems.map((item) => <option key={item.id} value={item.id}>{item.commonName} · {item.scientificName}</option>)}</select></label>
        {hasSelectedProfile && profile && <div className="rounded-xl border border-aqua/15 bg-aqua/[.05] p-4 sm:col-span-2"><div className="flex justify-between"><div><p className="text-sm font-extrabold">{profile.commonName}</p><p className="mt-1 text-[11px] sm:text-[10px] italic text-[#71858d]">{profile.scientificName}</p></div><span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[11px] sm:text-[8px] font-bold text-emerald-400">{t.livestock.form.inCatalog}</span></div><div className="mt-3 grid grid-cols-3 gap-2 text-[11px] sm:text-[9px]"><span>{t.livestock.form.adultSize} <b>{profile.adultSizeCm} cm</b></span><span>{t.livestock.form.minVolume} <b>{fmt.volume(profile.minVolumeL)}</b></span><span>{t.livestock.form.minGroup} <b>{profile.minGroup}+</b></span></div></div>}
        <label className="text-xs font-bold text-[#91a3aa]">{t.common.quantity}<input required name="quantity" type="number" inputMode="numeric" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className={field} /></label><label className="text-xs font-bold text-[#91a3aa]">{t.livestock.form.gender}<select name="gender" className={field}><option value="unknown">{t.livestock.form.genders.unknown}</option><option value="mixed">{t.livestock.form.genders.mixed}</option><option value="male">{t.livestock.form.genders.male}</option><option value="female">{t.livestock.form.genders.female}</option></select></label>
        {issues.length > 0 && <div className="rounded-xl border border-amber-300/15 bg-amber-300/[.06] p-4 sm:col-span-2"><p className="text-[11px] sm:text-[10px] font-extrabold text-amber-300">{t.livestock.form.beforeSaving}</p>{issues.map((issue) => <p key={issue} className="mt-2 text-[11px] sm:text-[9px] text-amber-100/65">• {issue}</p>)}</div>}
        <label className="text-xs font-bold text-[#91a3aa]">{t.common.addedDate}<input required name="addedAt" type="date" defaultValue={new Date().toISOString().slice(0, 10)} className={field} /></label><label className="text-xs font-bold text-[#91a3aa] sm:col-span-2">{t.common.notes}<textarea name="notes" rows={2} className={field} /></label>
      </div>
      <div className="mt-7 flex justify-end gap-2"><button type="button" onClick={close} className="min-h-11 min-w-11 rounded-xl border border-white/[.08] px-5 py-3 text-xs font-bold text-[#91a3aa] sm:min-h-0 sm:min-w-0">{t.common.cancel}</button><button disabled={!hasSelectedProfile || Boolean(unresolvedMatch)} className="min-h-11 min-w-11 rounded-xl bg-aqua px-5 py-3 text-xs font-extrabold text-ink disabled:opacity-40 sm:min-h-0 sm:min-w-0">{t.livestock.form.submit}</button></div>
    </form>
  </ModalDialog>;
}
