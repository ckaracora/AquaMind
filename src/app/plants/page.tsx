"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Leaf, MapPin, Plus, Search, Sprout, Trash2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { PlantCardCatalog, PlantForm, plantPositions } from "@/components/plant-catalog";
import { PlantCardWarnings, PlantCatalogFailed } from "@/components/plant-warnings";
import { checkAquariumPlants, isLabelWarning } from "@/lib/plant-warning-text";
import { useDisplayFormat } from "@/lib/use-display-format";
import { usePlantCatalog } from "@/lib/use-plant-catalog";
import { useAquariums } from "@/providers/aquarium-provider";
import { useI18n } from "@/providers/i18n-provider";

// Bitki konumlarının kayıttaki Türkçe değeri ve ekrandaki adı src/components/plant-catalog.tsx içinde (`plantPositions`). Listede olmayan
// eski bir değer olduğu gibi yazılır.
const positionKeys=new Map<string,(typeof plantPositions)[number][1]>(plantPositions.map(([value,key])=>[value,key]));

export default function PlantsPage(){
 const {aquariums,plants,equipment,waterReadings,addPlant,removePlant}=useAquariums(); const fmt=useDisplayFormat(); const {t}=useI18n(); const [aquariumId,setAquariumId]=useState(aquariums[0]?.id??""); const [position,setPosition]=useState<string>("all");
 const positionLabel=(value:string)=>{const key=positionKeys.get(value);return key?t.plants.positions[key]:value}; const [query,setQuery]=useState(""); const [open,setOpen]=useState(false);
 useEffect(()=>{const requested=new URLSearchParams(location.search).get("aquarium");if(requested&&aquariums.some(a=>a.id===requested))setAquariumId(requested)},[aquariums]);
 const base=plants.filter(p=>p.aquariumId===aquariumId); const items=useMemo(()=>base.filter(p=>position==="all"||p.position===position).filter(p=>(p.name+" "+(p.scientificName??"")).toLowerCase().includes(query.toLowerCase())),[base,position,query]);
 // Katalog, pencere açılınca ya da listede bitki varken ayrı parça olarak yüklenir; eski kayıtlar bilimsel adla eşleşir.
 const catalog=usePlantCatalog(open||base.length>0);
 // Bitki uyarıları (docs/DECISIONS/0025-bitki-uyarilari.md): akvaryumun ekipmanı ve son su ölçümüyle, katalog yüklenince hesaplanır.
 // Katalog yüklenemezse kartlar kısa bilgi ve uyarı olmadan kalır; bunu söyleyen satır ve yeniden deneme düğmesi listenin üstünde.
 // Etiket uyarıları (su bitkisi değil, istilacı tür; karar 0028) kartta katalogun kısa uyarısı olarak zaten görünür, listeye girmez.
 const aquarium=aquariums.find(a=>a.id===aquariumId); const warnings=catalog.catalog&&aquarium?checkAquariumPlants(catalog.catalog,aquarium,plants,equipment,waterReadings).warnings.filter(w=>!isLabelWarning(w)):[];
 return <AppShell><PageHeader title={t.navigation.items.plants}/><div className="mx-auto max-w-[1200px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
  <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow mb-2 text-emerald-400">{t.plants.eyebrow}</p><h1 className="text-2xl font-extrabold sm:text-3xl">{t.navigation.items.plants}</h1><p className="mt-2 text-sm text-[#71858d]">{t.plants.description}</p></div><div className="flex gap-2"><label className="relative flex-1 sm:min-w-52"><select value={aquariumId} onChange={e=>setAquariumId(e.target.value)} className="min-h-11 w-full appearance-none rounded-xl border border-white/[.08] bg-panel px-4 py-3 pr-9 text-xs font-bold outline-none sm:min-h-0">{aquariums.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}</select><ChevronDown size={14} className="pointer-events-none absolute right-3 top-3.5 text-[#71858d]"/></label><button onClick={()=>setOpen(true)} className="flex min-h-11 min-w-11 items-center gap-2 rounded-xl bg-aqua px-4 py-3 text-xs font-extrabold text-ink sm:min-h-0 sm:min-w-0"><Plus size={16}/>{t.common.addPlant}</button></div></div>
  <div className="mb-5 grid grid-cols-1 gap-2 min-[360px]:grid-cols-3 min-[360px]:gap-3"><Summary icon={Leaf} label={t.plants.speciesTotal} value={base.length}/><Summary icon={Sprout} label={t.plants.total} value={base.reduce((s,p)=>s+p.quantity,0)}/><Summary icon={MapPin} label={t.plants.areas} value={new Set(base.map(p=>p.position).filter(Boolean)).size}/></div>
  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:justify-between"><div className="flex gap-1 overflow-x-auto">{["all",...plantPositions.map(([value])=>value)].map(p=><button key={p} onClick={()=>setPosition(p)} className={`min-h-11 min-w-11 shrink-0 rounded-xl px-3 py-2.5 text-[11px] sm:text-[10px] font-bold sm:min-h-0 sm:min-w-0 ${position===p?"bg-emerald-400/10 text-emerald-400":"bg-white/[.025] text-[#647981]"}`}>{p==="all"?t.common.all:positionLabel(p)}</button>)}</div><label className="relative"><Search size={15} className="absolute left-3 top-3 text-[#586e77]"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={t.plants.search} className="w-full rounded-xl border border-white/[.07] bg-panel py-2.5 pl-9 pr-3 text-xs outline-none sm:w-52"/></label></div>
  {catalog.failed&&base.length>0&&<PlantCatalogFailed retry={catalog.retry} boxed/>}
  {items.length?<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.map(plant=>{const profile=catalog.catalog?.plantForRecord(plant);return <article key={plant.id} className="surface overflow-hidden"><div className="relative grid h-36 place-items-center bg-gradient-to-br from-[#103528] via-[#0c2c26] to-[#0b2022]"><span className="grid size-16 place-items-center rounded-full bg-emerald-400/10 text-emerald-400"><Leaf size={31}/></span>{plant.position&&<span className="absolute right-3 top-3 rounded-full bg-black/25 px-2 py-1 text-[11px] sm:text-[8px] font-bold">{positionLabel(plant.position)}</span>}</div><div className="p-4"><div className="flex justify-between gap-3"><div><h2 className="text-sm font-extrabold">{plant.name}</h2><p className="mt-1 text-[11px] sm:text-[10px] italic text-[#647981]">{plant.scientificName||t.common.noScientificName}</p></div><span className="text-xl font-extrabold text-emerald-400">{plant.quantity}</span></div>{profile&&<PlantCardCatalog item={profile}/>}<PlantCardWarnings warnings={warnings.filter(w=>w.plantId===plant.id)}/><div className="mt-4 flex items-center justify-between border-t border-white/[.05] pt-3"><p className="text-[11px] sm:text-[9px] text-[#586e77]">{plant.catalogId&&profile?t.plants.catalog.fromCatalog(fmt.calendarDate(plant.addedAt)):t.plants.addedOn(fmt.calendarDate(plant.addedAt))}</p><button onClick={()=>confirm(t.common.confirmRemove(plant.name))&&removePlant(plant.id)} aria-label={t.plants.remove} className="-m-[15px] grid size-11 place-items-center rounded-xl text-[#586e77] hover:text-red-400"><Trash2 size={14}/></button></div></div></article>})}</div>:<Empty/>}
 </div>{open&&<PlantForm aquariumId={aquariumId} aquariumName={aquariums.find(a=>a.id===aquariumId)?.name??""} catalog={catalog} close={()=>setOpen(false)} save={plant=>{addPlant(plant);setOpen(false)}}/>}</AppShell>
}
// Özet kartları: 360 px ve üstünde yan yana üç kart, daha dar telefonda alt alta satırlar ("Yerleşim alanı" üç dar sütuna sığmıyor).
function Summary({icon:Icon,label,value}:{icon:typeof Leaf;label:string;value:number}){return <div className="surface flex items-center gap-3 p-3 min-[360px]:block min-[360px]:p-4"><Icon size={17} className="shrink-0 text-emerald-400 min-[360px]:mb-4"/><p className="text-2xl font-extrabold">{value}</p><p className="text-[11px] sm:text-[9px] font-bold uppercase tracking-wider text-[#647981] min-[360px]:mt-1">{label}</p></div>}
function Empty(){const {t}=useI18n();return <div className="surface grid min-h-64 place-items-center text-center"><div><Leaf size={38} className="mx-auto mb-3 text-emerald-400"/><p className="text-sm font-bold">{t.plants.emptyTitle}</p><p className="mt-1 text-xs text-[#647981]">{t.plants.emptyText}</p></div></div>}
