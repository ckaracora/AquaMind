"use client";

import { AlertTriangle, BookOpen, Droplets, ExternalLink, ShieldAlert, Stethoscope } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { diseaseMessagesFor } from "@aquamind/localization/diseases";
import { aquariumsWithInvertebrates, copperSources, diseaseSources, firstSteps, guideSources, requestedAquariumId, vetSources, type DiseaseSourceId } from "@/data/disease-guide";
import { waterReadingHref } from "@/lib/aquarium-links";
import { useAquariums } from "@/providers/aquarium-provider";
import { useI18n } from "@/providers/i18n-provider";

// Hastalık ve tedavi sayfası (docs/DECISIONS/0022-hastalik-ve-tedavi-sayfasi.md): teşhis koymaz, ilaç önermez; güvenilir kaynaklara ve
// veterinere yönlendirir. Bakır uyarısı karides ya da salyangoz bulunan akvaryumlarda adıyla öne çıkar; sağlık analizinden gelindiyse
// (`?aquarium=`) o akvaryum başta yazılır ve su ölçümü bağlantısı o akvaryuma gider. Sayfa metinleri dil paketinin ayrı girişinden gelir
// (`@aquamind/localization/diseases`); menü adı ana dil dosyasındadır. Adres (`search`) sayfadan verilir; böylece bileşen testte çizilebilir.
export function DiseaseGuideView({search}:{search:string}){
 const {aquariums,livestock,hydrated}=useAquariums(); const {t,locale}=useI18n(); const d=diseaseMessagesFor(locale);
 const from=hydrated?requestedAquariumId(search,aquariums):undefined; const invertebrates=hydrated?aquariumsWithInvertebrates(aquariums,livestock,from):[];
 return <AppShell><PageHeader title={t.navigation.items.diseases}/><div className="mx-auto max-w-[900px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
  <div className="mb-6"><p className="eyebrow mb-2 text-aqua">{d.eyebrow}</p><h1 className="text-2xl font-extrabold sm:text-3xl">{t.navigation.items.diseases}</h1><p className="mt-2 text-sm text-[#71858d]">{d.description}</p></div>
  <div role="note" className="mb-5 flex gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/[.07] p-4"><ShieldAlert size={19} aria-hidden="true" className="mt-0.5 shrink-0 text-amber-300"/><p className="text-sm font-bold leading-relaxed text-amber-100">{d.notice}</p></div>
  <section aria-labelledby="first-steps" className="surface p-5 sm:p-6">
   <SectionTitle id="first-steps" icon={Droplets} title={d.firstStepsTitle}/>
   <ul className="mt-4 space-y-4">{firstSteps.map(step=><li key={step.key} className="border-l-2 border-aqua/30 pl-3"><p className="text-sm leading-relaxed">{d.steps[step.key]}</p><p className="mt-1 flex flex-wrap items-center gap-x-2 text-[11px] text-[#71858d]">{d.sourceLabel}:{step.sources.map(id=><a key={id} href={diseaseSources[id].url} target="_blank" rel="noreferrer" hrefLang={diseaseSources[id].language} className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 px-1 font-bold text-aqua hover:underline">{d.sources[id].publisher}<span className="rounded-full bg-white/[.06] px-1.5 text-[11px] font-bold text-[#91a3aa]" aria-hidden="true">{d.languageShort[diseaseSources[id].language]}</span><span className="sr-only"> ({d.language[diseaseSources[id].language]}, {d.opensNewTab})</span></a>)}</p></li>)}</ul>
   <a href={waterReadingHref(from)} className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-aqua px-4 py-2.5 text-xs font-extrabold text-ink">{d.addReading}</a>
  </section>
  <section aria-labelledby="copper" className="surface mt-5 p-5 sm:p-6">
   <SectionTitle id="copper" icon={AlertTriangle} title={d.copperTitle}/>
   {invertebrates.length>0&&<ul className="mt-4 space-y-2">{invertebrates.map(({aquarium,kinds})=><li key={aquarium.id} className="flex gap-3 rounded-xl border border-amber-300/25 bg-amber-300/[.08] p-3"><AlertTriangle size={17} aria-hidden="true" className="mt-0.5 shrink-0 text-amber-300"/><p className="text-sm font-bold leading-relaxed">{d.copperAquarium(aquarium.name,kinds)}</p></li>)}</ul>}
   <p className="mt-4 text-sm leading-relaxed text-[#b4c3c8]">{d.copperGeneral}</p>
   <SourceList ids={copperSources}/>
  </section>
  <section aria-labelledby="vets" className="surface mt-5 p-5 sm:p-6">
   <SectionTitle id="vets" icon={Stethoscope} title={d.vetTitle}/>
   <p className="mt-3 text-sm leading-relaxed text-[#b4c3c8]">{d.vetHelp}</p>
   <SourceList ids={vetSources}/>
  </section>
  <section aria-labelledby="guides" className="surface mt-5 p-5 sm:p-6">
   <SectionTitle id="guides" icon={BookOpen} title={d.guidesTitle}/>
   <SourceList ids={guideSources}/>
  </section>
  <p className="mt-5 text-center text-[11px] text-[#71858d]">{d.sponsorNote}</p>
 </div></AppShell>
}

function SectionTitle({id,icon:Icon,title}:{id:string;icon:typeof Droplets;title:string}){return <h2 id={id} className="flex items-center gap-3 text-lg font-extrabold"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-aqua/10 text-aqua"><Icon size={17} aria-hidden="true"/></span>{title}</h2>}

// Kaynak bağlantıları yeni sekmede açılır; dili (TR/EN) etiketle, tam adıyla ekran okuyucuya söylenir.
function SourceList({ids}:{ids:readonly DiseaseSourceId[]}){const {locale}=useI18n();const d=diseaseMessagesFor(locale);return <ul className="mt-4 divide-y divide-white/[.06]">{ids.map(id=>{const source=diseaseSources[id];const text=d.sources[id];return <li key={id}><a href={source.url} target="_blank" rel="noreferrer" hrefLang={source.language} className="flex min-h-11 items-center justify-between gap-3 py-3 hover:text-aqua"><span className="min-w-0"><span className="block text-sm font-bold">{text.name}</span><span className="mt-0.5 block text-[11px] text-[#71858d]">{text.publisher}</span></span><span className="flex shrink-0 items-center gap-2"><span className="rounded-full bg-white/[.06] px-2 py-0.5 text-[11px] font-bold text-[#91a3aa]" aria-hidden="true">{d.languageShort[source.language]}</span><span className="sr-only">{d.language[source.language]}, {d.opensNewTab}</span><ExternalLink size={14} aria-hidden="true" className="text-[#586e77]"/></span></a></li>})}</ul>}
