"use client";

import { Box, CalendarDays, Droplets, Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { useDisplayFormat } from "@/lib/use-display-format";
import { useAquariums } from "@/providers/aquarium-provider";
import { useI18n } from "@/providers/i18n-provider";

export default function AquariumsPage() {
  const { aquariums, removeAquarium } = useAquariums();
  const fmt = useDisplayFormat();
  const { t } = useI18n();
  return <AppShell><PageHeader title={t.navigation.items.aquariums}/><div className="mx-auto max-w-[1200px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
    <div className="mb-8 flex items-end justify-between gap-4"><div><p className="eyebrow mb-2 text-aqua">{t.aquariums.list.eyebrow}</p><h1 className="text-2xl font-extrabold sm:text-3xl">{t.navigation.items.aquariums}</h1><p className="mt-2 text-sm text-[#71858d]">{t.aquariums.list.description}</p></div><a href="/aquariums/new" aria-label={t.aquariums.list.add} className="flex min-h-11 shrink-0 items-center gap-2 rounded-xl bg-aqua px-4 py-3 text-xs font-extrabold text-ink sm:min-h-0"><Plus size={17}/><span className="hidden sm:inline">{t.aquariums.list.add}</span></a></div>
    {aquariums.length === 0 ? <div className="surface grid min-h-72 place-items-center p-8 text-center"><div><Box className="mx-auto mb-4 text-aqua" size={38}/><h2 className="font-extrabold">{t.aquariums.list.emptyTitle}</h2><p className="mt-2 text-sm text-[#71858d]">{t.aquariums.list.emptyText}</p></div></div> : <div className="grid gap-4 md:grid-cols-2">{aquariums.map((aquarium) => <article key={aquarium.id} className="surface overflow-hidden">
      <div className="relative h-36 bg-gradient-to-br from-[#123441] via-[#0d5960] to-[#09232c] p-5"><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[11px] sm:text-[9px] font-bold uppercase">{t.common.aquariumTypes[aquarium.type]}</span><div className="absolute bottom-5 left-5"><h2 className="text-xl font-extrabold">{aquarium.name}</h2><p className="mt-1 text-xs text-white/55">{aquarium.description || t.aquariums.list.noDescription}</p></div></div>
      <div className="grid grid-cols-3 gap-px bg-white/[.05]"><div className="bg-panel p-4"><Droplets size={15} className="mb-2 text-aqua"/><p className="text-sm font-extrabold">{fmt.volume(aquarium.netVolumeLiters)}</p><p className="text-[11px] sm:text-[9px] text-[#647981]">{t.common.netVolume}</p></div><div className="bg-panel p-4"><Box size={15} className="mb-2 text-aqua"/><p className="text-sm font-extrabold">{aquarium.lengthCm}×{aquarium.widthCm}</p><p className="text-[11px] sm:text-[9px] text-[#647981]">{t.aquariums.list.baseCm}</p></div><div className="bg-panel p-4"><CalendarDays size={15} className="mb-2 text-aqua"/><p className="text-sm font-extrabold">{fmt.date(aquarium.setupDate, { year: "numeric" })}</p><p className="text-[11px] sm:text-[9px] text-[#647981]">{t.common.setup}</p></div></div>
      <div className="flex items-center justify-between p-4"><a href={`/aquariums/${aquarium.id}`} className="-my-3.5 inline-flex min-h-11 items-center text-xs font-bold text-aqua">{t.aquariums.list.viewDetails}</a><button onClick={() => confirm(t.common.confirmRemove(aquarium.name)) && removeAquarium(aquarium.id)} aria-label={t.aquariums.list.remove} className="-m-1.5 grid size-11 place-items-center rounded-lg sm:m-0 sm:size-8 text-[#647981] hover:bg-red-400/10 hover:text-red-400"><Trash2 size={15}/></button></div>
    </article>)}</div>}
  </div></AppShell>;
}
