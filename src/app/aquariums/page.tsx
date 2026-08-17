"use client";

import { Box, CalendarDays, Droplets, Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { useAquariums } from "@/providers/aquarium-provider";

export default function AquariumsPage() {
  const { aquariums, removeAquarium } = useAquariums();
  return <AppShell><PageHeader title="Akvaryumlarım"/><div className="mx-auto max-w-[1200px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
    <div className="mb-8 flex items-end justify-between gap-4"><div><p className="eyebrow mb-2 text-aqua">Koleksiyon</p><h1 className="text-2xl font-extrabold sm:text-3xl">Akvaryumlarım</h1><p className="mt-2 text-sm text-[#71858d]">Tüm akvaryumlarını tek yerden yönet.</p></div><a href="/aquariums/new" className="flex shrink-0 items-center gap-2 rounded-xl bg-aqua px-4 py-3 text-xs font-extrabold text-ink"><Plus size={17}/><span className="hidden sm:inline">Yeni akvaryum</span></a></div>
    {aquariums.length === 0 ? <div className="surface grid min-h-72 place-items-center p-8 text-center"><div><Box className="mx-auto mb-4 text-aqua" size={38}/><h2 className="font-extrabold">İlk akvaryumunu oluştur</h2><p className="mt-2 text-sm text-[#71858d]">Ölçülerini gir; hacmini AquaMind hesaplasın.</p></div></div> : <div className="grid gap-4 md:grid-cols-2">{aquariums.map((aquarium) => <article key={aquarium.id} className="surface overflow-hidden">
      <div className="relative h-36 bg-gradient-to-br from-[#123441] via-[#0d5960] to-[#09232c] p-5"><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[9px] font-bold uppercase">{aquarium.type === 'freshwater' ? 'Tatlı su' : aquarium.type === 'saltwater' ? 'Tuzlu su' : 'Acı su'}</span><div className="absolute bottom-5 left-5"><h2 className="text-xl font-extrabold">{aquarium.name}</h2><p className="mt-1 text-xs text-white/55">{aquarium.description || 'Açıklama eklenmemiş'}</p></div></div>
      <div className="grid grid-cols-3 gap-px bg-white/[.05]"><div className="bg-panel p-4"><Droplets size={15} className="mb-2 text-aqua"/><p className="text-sm font-extrabold">{aquarium.netVolumeLiters} L</p><p className="text-[9px] text-[#647981]">Net hacim</p></div><div className="bg-panel p-4"><Box size={15} className="mb-2 text-aqua"/><p className="text-sm font-extrabold">{aquarium.lengthCm}×{aquarium.widthCm}</p><p className="text-[9px] text-[#647981]">Taban cm</p></div><div className="bg-panel p-4"><CalendarDays size={15} className="mb-2 text-aqua"/><p className="text-sm font-extrabold">{new Date(aquarium.setupDate).toLocaleDateString('tr-TR', { year: 'numeric' })}</p><p className="text-[9px] text-[#647981]">Kurulum</p></div></div>
      <div className="flex items-center justify-between p-4"><a href={`/aquariums/${aquarium.id}`} className="text-xs font-bold text-aqua">Detayları gör →</a><button onClick={() => confirm(`${aquarium.name} silinsin mi?`) && removeAquarium(aquarium.id)} aria-label="Akvaryumu sil" className="grid size-8 place-items-center rounded-lg text-[#647981] hover:bg-red-400/10 hover:text-red-400"><Trash2 size={15}/></button></div>
    </article>)}</div>}
  </div></AppShell>;
}
