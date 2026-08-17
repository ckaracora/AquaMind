"use client";

import { useParams } from "next/navigation";
import { Activity, ArrowLeft, CalendarDays, ChevronRight, Droplets, Fish, Leaf, Pencil, Plus, Ruler, SlidersHorizontal, Thermometer } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { equipment, livestock, maintenanceTasks, plants } from "@/data/mock-data";
import { calculateGrossVolume } from "@/lib/aquarium-storage";
import { useAquariums } from "@/providers/aquarium-provider";

const formatDate = (date: string) => new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", year: "numeric" }).format(new Date(date));
const tabs = ["Genel Bakış", "Su Değerleri", "Bakım", "Canlılar", "Bitkiler", "Ekipmanlar"];

export default function AquariumDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { aquariums, hydrated, waterReadings } = useAquariums();
  const aquarium = aquariums.find((item) => item.id === id);

  if (!hydrated) return <AppShell><PageHeader title="Akvaryum Detayı"/><div className="grid min-h-[60vh] place-items-center text-sm text-[#71858d]">Akvaryum yükleniyor…</div></AppShell>;
  if (!aquarium) return <AppShell><PageHeader title="Akvaryum Detayı"/><div className="mx-auto max-w-xl px-5 py-24 text-center"><h1 className="text-2xl font-extrabold">Akvaryum bulunamadı</h1><p className="mt-3 text-sm text-[#71858d]">Bu kayıt silinmiş veya artık mevcut değil.</p><a href="/aquariums" className="mt-6 inline-flex rounded-xl bg-aqua px-5 py-3 text-xs font-extrabold text-ink">Akvaryumlarıma dön</a></div></AppShell>;

  const readings = waterReadings.filter((item) => item.aquariumId === id);
  const latest = readings[0];
  const tasks = maintenanceTasks.filter((item) => item.aquariumId === id);
  const animals = livestock.filter((item) => item.aquariumId === id);
  const aquariumPlants = plants.filter((item) => item.aquariumId === id);
  const aquariumEquipment = equipment.filter((item) => item.aquariumId === id);
  const grossVolume = calculateGrossVolume(aquarium.lengthCm, aquarium.widthCm, aquarium.heightCm);

  return <AppShell><PageHeader title={aquarium.name}/><div className="mx-auto max-w-[1280px] px-5 py-7 sm:px-8 lg:px-10 lg:py-10">
    <div className="mb-6 flex items-center justify-between"><a href="/aquariums" className="inline-flex items-center gap-2 text-xs font-bold text-[#82969e] hover:text-white"><ArrowLeft size={15}/>Akvaryumlarıma dön</a><button className="inline-flex items-center gap-2 rounded-xl border border-white/[.08] px-4 py-2.5 text-xs font-bold text-[#91a3aa]"><Pencil size={14}/>Düzenle</button></div>

    <section className="surface relative mb-5 overflow-hidden bg-gradient-to-r from-[#0c2730] via-[#0d3b43] to-[#0b242c] p-6 sm:p-8">
      <div className="absolute -right-20 -top-28 size-80 rounded-full bg-aqua/10 blur-3xl"/>
      <div className="relative flex flex-col justify-between gap-7 sm:flex-row sm:items-end"><div><span className="rounded-full border border-aqua/20 bg-aqua/10 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-wider text-aqua">{aquarium.type === "freshwater" ? "Tatlı su" : aquarium.type === "saltwater" ? "Tuzlu su" : "Acı su"}</span><h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{aquarium.name}</h1><p className="mt-2 max-w-xl text-sm text-white/55">{aquarium.description || "Bu akvaryum için henüz açıklama eklenmemiş."}</p></div><div className="flex gap-6"><div><p className="text-3xl font-extrabold text-aqua">{aquarium.netVolumeLiters}<span className="ml-1 text-sm">L</span></p><p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-white/40">Net hacim</p></div><div className="border-l border-white/10 pl-6"><p className="text-sm font-extrabold">{formatDate(aquarium.setupDate)}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-white/40">Kurulum</p></div></div></div>
    </section>

    <nav className="mb-5 flex gap-1 overflow-x-auto rounded-xl border border-white/[.06] bg-[#0d1b23]/80 p-1.5">{tabs.map((tab, index) => <button key={tab} className={`shrink-0 rounded-lg px-4 py-2.5 text-[11px] font-bold ${index === 0 ? "bg-aqua/10 text-aqua" : "text-[#71858d] hover:text-white"}`}>{tab}</button>)}</nav>

    <div className="grid gap-5 xl:grid-cols-[1.4fr_.85fr]">
      <div className="space-y-5">
        <section className="surface p-5 sm:p-6"><div className="mb-5 flex items-center justify-between"><div><p className="eyebrow">Anlık durum</p><h2 className="mt-1 text-lg font-extrabold">Son su değerleri</h2></div><a href={`/water?aquarium=${id}`} className="flex items-center gap-1 text-[10px] font-bold text-aqua">Tümünü gör<ChevronRight size={13}/></a></div>
          {latest ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[
            [Thermometer, "Sıcaklık", `${latest.temperature}°C`, "İdeal"], [Activity, "pH", `${latest.ph}`, "Dengeli"], [Droplets, "TDS", `${latest.tds} ppm`, "Normal"], [Activity, "NO₃", `${latest.nitrate} ppm`, "Güvenli"],
          ].map(([Icon, label, value, status]) => { const ParameterIcon = Icon as typeof Thermometer; return <div key={String(label)} className="rounded-xl border border-white/[.06] bg-white/[.02] p-4"><div className="mb-5 flex justify-between"><span className="grid size-8 place-items-center rounded-lg bg-aqua/10 text-aqua"><ParameterIcon size={16}/></span><span className="text-[8px] font-extrabold uppercase text-emerald-400">{String(status)}</span></div><p className="text-[10px] font-bold text-[#647981]">{String(label)}</p><p className="mt-1 text-lg font-extrabold">{String(value)}</p></div>})}</div> : <EmptyLine text="Henüz su ölçümü eklenmemiş."/>}
        </section>

        <section className="surface p-5 sm:p-6"><div className="mb-5 flex items-center justify-between"><div><p className="eyebrow">Envanter</p><h2 className="mt-1 text-lg font-extrabold">Akvaryum yaşamı</h2></div><button className="grid size-9 place-items-center rounded-xl bg-aqua/10 text-aqua"><Plus size={16}/></button></div><div className="grid gap-3 sm:grid-cols-3"><InventoryCard icon={Fish} label="Canlılar" value={`${animals.reduce((sum, item) => sum + item.quantity, 0)} canlı`} sub={`${animals.length} tür`} color="text-cyan-300" bg="bg-cyan-300/10"/><InventoryCard icon={Leaf} label="Bitkiler" value={`${aquariumPlants.length} tür`} sub={`${aquariumPlants.reduce((sum, item) => sum + item.quantity, 0)} kayıt`} color="text-emerald-400" bg="bg-emerald-400/10"/><InventoryCard icon={SlidersHorizontal} label="Ekipmanlar" value={`${aquariumEquipment.length} ekipman`} sub="Tümü aktif" color="text-amber-300" bg="bg-amber-300/10"/></div></section>

        <section className="surface p-5 sm:p-6"><div className="mb-5"><p className="eyebrow">Teknik bilgi</p><h2 className="mt-1 text-lg font-extrabold">Ölçüler ve hacim</h2></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-4"><Metric icon={Ruler} label="Uzunluk" value={`${aquarium.lengthCm} cm`}/><Metric icon={Ruler} label="Genişlik" value={`${aquarium.widthCm} cm`}/><Metric icon={Ruler} label="Yükseklik" value={`${aquarium.heightCm} cm`}/><Metric icon={Droplets} label="Brüt hacim" value={`${grossVolume} L`}/></div></section>
      </div>

      <aside className="space-y-5"><section className="surface p-5 sm:p-6"><div className="mb-5 flex items-center justify-between"><div><p className="eyebrow">Bakım planı</p><h2 className="mt-1 text-lg font-extrabold">Yaklaşan görevler</h2></div><button className="grid size-9 place-items-center rounded-xl bg-white/[.04] text-aqua"><Plus size={16}/></button></div>{tasks.length ? <div className="space-y-2">{tasks.map((task, index) => <div key={task.id} className="flex items-center gap-3 rounded-xl border border-white/[.05] p-3.5"><span className={`grid size-9 shrink-0 place-items-center rounded-lg ${index === 0 ? "bg-aqua/10 text-aqua" : "bg-white/[.04] text-[#71858d]"}`}><CalendarDays size={16}/></span><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold">{task.title}</p><p className="mt-1 text-[9px] text-[#647981]">{formatDate(task.dueAt)}</p></div></div>)}</div> : <EmptyLine text="Yaklaşan bakım görevi yok."/>}<button className="mt-4 w-full rounded-xl border border-white/[.06] py-3 text-xs font-bold text-[#82969e]">Bakım planını aç</button></section>
        <section className="surface p-5 sm:p-6"><p className="eyebrow">Hızlı işlem</p><div className="mt-4 grid grid-cols-2 gap-2"><QuickAction icon={Droplets} label="Ölçüm ekle"/><QuickAction icon={CalendarDays} label="Bakım ekle"/><QuickAction icon={Fish} label="Canlı ekle"/><QuickAction icon={Leaf} label="Bitki ekle"/></div></section>
      </aside>
    </div>
  </div></AppShell>;
}

function EmptyLine({ text }: { text: string }) { return <div className="rounded-xl border border-dashed border-white/10 p-6 text-center text-xs text-[#647981]">{text}</div>; }
function InventoryCard({ icon: Icon, label, value, sub, color, bg }: { icon: typeof Fish; label: string; value: string; sub: string; color: string; bg: string }) { return <div className="rounded-xl border border-white/[.06] bg-white/[.02] p-4"><span className={`mb-5 grid size-9 place-items-center rounded-lg ${bg} ${color}`}><Icon size={18}/></span><p className="text-[10px] font-bold text-[#647981]">{label}</p><p className="mt-1 text-base font-extrabold">{value}</p><p className="mt-1 text-[9px] text-[#586e77]">{sub}</p></div>; }
function Metric({ icon: Icon, label, value }: { icon: typeof Ruler; label: string; value: string }) { return <div className="rounded-xl bg-white/[.025] p-4"><Icon size={15} className="mb-3 text-aqua"/><p className="text-[9px] font-bold uppercase tracking-wider text-[#586e77]">{label}</p><p className="mt-1 text-sm font-extrabold">{value}</p></div>; }
function QuickAction({ icon: Icon, label }: { icon: typeof Fish; label: string }) { return <button className="flex flex-col items-start rounded-xl border border-white/[.06] bg-white/[.02] p-3.5 text-left text-[10px] font-bold text-[#91a3aa] hover:border-aqua/20 hover:text-aqua"><Icon size={16} className="mb-3"/>{label}</button>; }
