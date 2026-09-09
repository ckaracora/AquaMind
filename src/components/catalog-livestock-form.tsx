"use client";

import { FormEvent, useState } from "react";
import { Search, X } from "lucide-react";
import { speciesById, speciesCatalog, speciesForCatalogExactSearch, speciesForCatalogSearch, speciesForCategoryAndWaterType, speciesGroup, speciesGroupLabels, speciesGroupsForCategoryAndWaterType, speciesWaterTypes } from "@/data/catalog";
import { unresolvedSpeciesForSearch } from "@/data/catalog-species-unresolved";
import type { SpeciesProfile } from "@/data/catalog";
import type { Aquarium, Livestock } from "@/types/aquarium";

const allCategories: Array<[Livestock["category"], string]> = [["fish", "Balık"], ["shrimp", "Karides"], ["snail", "Salyangoz"], ["other", "Diğer"]];
const field = "mt-1.5 w-full rounded-xl border border-white/[.08] bg-[#09171e] px-3 py-3 text-sm outline-none focus:border-aqua/60";
const normalizeSearch = (value: string) => value.trim().toLocaleLowerCase("tr-TR").replaceAll("ı", "i").replace(/\s+/g, " ");
const searchableText = (item: SpeciesProfile) => normalizeSearch(`${item.commonName} ${item.scientificName} ${(item.aliases ?? []).join(" ")}`);

export function CatalogLivestockForm({ aquarium, initialCategory, close, submit }: { aquarium: Aquarium; initialCategory: Livestock["category"]; close: () => void; submit: (e: FormEvent<HTMLFormElement>) => void }) {
  const compatibleSpecies = speciesCatalog.filter((item) => speciesWaterTypes(item).includes(aquarium.type));
  const categories = allCategories.filter(([key]) => compatibleSpecies.some((item) => item.category === key));
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
    aquarium.netVolumeLiters < requiredVolumeL ? `Seçilen adet için katalog referansı en az ${requiredVolumeL} L.` : "",
    profile.minTankLengthCm !== undefined && aquarium.lengthCm < profile.minTankLengthCm ? `Önerilen akvaryum uzunluğu en az ${profile.minTankLengthCm} cm.` : "",
    profile.tankLengthDataNote ?? "",
    quantity < profile.minGroup ? `Sosyal grup için en az ${profile.minGroup} adet öneriliyor.` : "",
  ].filter(Boolean) : [];

  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-5">
    <form onSubmit={submit} className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-2xl border border-white/[.08] bg-panel p-5 sm:rounded-2xl sm:p-7">
      <div className="mb-6 flex justify-between"><div><p className="eyebrow text-aqua">{aquarium.name}</p><h2 className="mt-1 text-xl font-extrabold">Canlı seç</h2><p className="mt-1 text-[10px] text-[#647981]">Ana sınıf → canlı grubu → tür sırasıyla ilerle.</p></div><button type="button" onClick={close} className="grid size-9 place-items-center rounded-xl bg-white/[.04] text-[#71858d]"><X size={17} /></button></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-bold text-[#91a3aa]">1. Ana sınıf<select value={category} onChange={(e) => changeCategory(e.target.value as Livestock["category"])} className={field}>{categories.map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
        <label className="text-xs font-bold text-[#91a3aa]">2. Canlı grubu<select value={group} onChange={(e) => changeGroup(e.target.value)} className={field}>{groups.map((item) => <option key={item} value={item}>{speciesGroupLabels[item]}</option>)}</select></label>
        <label className="relative text-xs font-bold text-[#91a3aa] sm:col-span-2">Tür veya varyete ara<Search size={15} className="pointer-events-none absolute left-3 top-[42px] text-[#586e77]" /><input value={query} onChange={(e) => changeQuery(e.target.value)} placeholder="Tüm canlı gruplarında Türkçe, bilimsel ad veya varyete ara..." className={`${field} pl-9`} /></label>
        {unresolvedMatch && <div className="rounded-xl border border-amber-300/20 bg-amber-300/[.07] p-4 sm:col-span-2"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-extrabold text-amber-300">Ad bulundu, bilimsel kimlik doğrulanamadı</p><p className="mt-1 text-sm font-bold text-amber-50">{unresolvedMatch.name}</p></div><span className="rounded-full bg-amber-300/10 px-2 py-1 text-[8px] font-bold text-amber-200">Güvenli beklemede</span></div><p className="mt-2 text-[10px] leading-relaxed text-amber-100/65">{unresolvedMatch.reason}</p><p className="mt-2 text-[9px] font-semibold text-amber-200/70">Yanlış hacim ve uyumluluk hesabı vermemek için bu canlı henüz eklenemez.</p><a href={unresolvedMatch.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block text-[9px] font-bold text-aqua hover:underline">Satış adı kaynağını aç</a></div>}
        <label className="text-xs font-bold text-[#91a3aa] sm:col-span-2">3. Tür<select required name="catalogId" value={hasSelectedProfile ? selected : ""} onChange={(e) => changeSpecies(e.target.value)} className={field}><option value="" disabled>{groupItems.length ? "Tür seç" : unresolvedMatch ? "Kimlik doğrulaması bekleniyor" : "Aramayla eşleşen tür yok"}</option>{groupItems.map((item) => <option key={item.id} value={item.id}>{item.commonName} · {item.scientificName}</option>)}</select></label>
        {hasSelectedProfile && profile && <div className="rounded-xl border border-aqua/15 bg-aqua/[.05] p-4 sm:col-span-2"><div className="flex justify-between"><div><p className="text-sm font-extrabold">{profile.commonName}</p><p className="mt-1 text-[10px] italic text-[#71858d]">{profile.scientificName}</p></div><span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[8px] font-bold text-emerald-400">Katalogda</span></div><div className="mt-3 grid grid-cols-3 gap-2 text-[9px]"><span>Yetişkin: <b>{profile.adultSizeCm} cm</b></span><span>Min: <b>{profile.minVolumeL} L</b></span><span>Grup: <b>{profile.minGroup}+</b></span></div></div>}
        <label className="text-xs font-bold text-[#91a3aa]">Adet<input required name="quantity" type="number" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className={field} /></label><label className="text-xs font-bold text-[#91a3aa]">Cinsiyet<select name="gender" className={field}><option value="unknown">Bilinmiyor</option><option value="mixed">Karışık</option><option value="male">Erkek</option><option value="female">Dişi</option></select></label>
        {issues.length > 0 && <div className="rounded-xl border border-amber-300/15 bg-amber-300/[.06] p-4 sm:col-span-2"><p className="text-[10px] font-extrabold text-amber-300">Kaydetmeden önce dikkat</p>{issues.map((issue) => <p key={issue} className="mt-2 text-[9px] text-amber-100/65">• {issue}</p>)}</div>}
        <label className="text-xs font-bold text-[#91a3aa]">Eklenme tarihi<input required name="addedAt" type="date" defaultValue={new Date().toISOString().slice(0, 10)} className={field} /></label><label className="text-xs font-bold text-[#91a3aa] sm:col-span-2">Notlar<textarea name="notes" rows={2} className={field} /></label>
      </div>
      <div className="mt-7 flex justify-end gap-2"><button type="button" onClick={close} className="rounded-xl border border-white/[.08] px-5 py-3 text-xs font-bold text-[#91a3aa]">Vazgeç</button><button disabled={!hasSelectedProfile || Boolean(unresolvedMatch)} className="rounded-xl bg-aqua px-5 py-3 text-xs font-extrabold text-ink disabled:opacity-40">Canlıyı ekle</button></div>
    </form>
  </div>;
}
