"use client";

import { Activity, Bell, CalendarDays, ChevronRight, CircleGauge, Droplets, FlaskConical, Plus, Search, Thermometer, Waves } from "lucide-react";
import { MobileNav } from "@/components/mobile-nav";
import { ParameterCard } from "@/components/parameter-card";
import { Sidebar } from "@/components/sidebar";
import { aquariums as seedAquariums, maintenanceTasks, waterReadings } from "@/data/mock-data";
import { useAquariums } from "@/providers/aquarium-provider";

const formatDay = (date: string) => new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" }).format(new Date(date));

export default function Dashboard() {
  const { aquariums } = useAquariums();
  const aquarium = aquariums[0] ?? seedAquariums[0];
  const latest = waterReadings[0];
  return <div className="min-h-screen">
    <Sidebar />
    <main className="pb-28 lg:ml-[248px] lg:pb-10">
      <header className="flex h-[74px] items-center justify-between border-b border-white/[.05] px-5 sm:px-8 lg:px-10">
        <div className="flex items-center gap-3 lg:hidden"><span className="grid size-9 place-items-center rounded-xl bg-aqua text-ink"><Waves size={20}/></span><span className="font-extrabold">AquaMind</span></div>
        <div className="hidden items-center gap-2 text-xs text-[#647981] lg:flex"><span>Panel</span><ChevronRight size={13}/><span className="text-[#aab9be]">Genel Bakış</span></div>
        <div className="flex items-center gap-2"><button aria-label="Ara" className="grid size-9 place-items-center rounded-xl text-[#82969e] hover:bg-white/5"><Search size={18}/></button><button aria-label="Bildirimler" className="relative grid size-9 place-items-center rounded-xl text-[#82969e] hover:bg-white/5"><Bell size={18}/><span className="absolute right-2 top-2 size-1.5 rounded-full bg-amber-400"/></button><button className="hidden rounded-xl bg-aqua px-4 py-2.5 text-xs font-extrabold text-ink sm:flex sm:items-center sm:gap-2"><Plus size={16}/>Yeni kayıt</button></div>
      </header>
      <div className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 lg:px-10 lg:py-10">
        <section className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="eyebrow mb-2 text-aqua">17 Ağustos, Pazartesi</p><h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Günaydın, Mert.</h1><p className="mt-2 text-sm text-[#71858d]">Akvaryumunda bugün her şey yolunda görünüyor.</p></div>
          <button className="surface flex w-full items-center justify-between gap-4 px-4 py-3 text-left sm:w-auto"><div><p className="text-[10px] font-bold uppercase tracking-wider text-[#647981]">Aktif akvaryum</p><p className="mt-1 text-sm font-bold">{aquarium.name}</p></div><ChevronRight size={16} className="text-aqua"/></button>
        </section>

        <section className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
          <ParameterCard icon={Thermometer} label="Sıcaklık" value={`${latest.temperature}°C`} status="İdeal" />
          <ParameterCard icon={FlaskConical} label="pH değeri" value={`${latest.ph}`} status="Dengeli" tone="green" />
          <ParameterCard icon={CircleGauge} label="TDS" value={`${latest.tds} ppm`} status="Normal" />
          <ParameterCard icon={Activity} label="Nitrat (NO₃)" value={`${latest.nitrate} ppm`} status="Güvenli" tone="green" />
        </section>

        <div className="grid gap-5 xl:grid-cols-[1.45fr_.9fr]">
          <section className="surface overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/[.06] p-5 sm:p-6"><div><p className="eyebrow">Akvaryumum</p><h2 className="mt-1 text-lg font-extrabold">{aquarium.name}</h2></div><button className="text-xs font-bold text-aqua">Detayları gör</button></div>
            <div className="grid sm:grid-cols-[1.1fr_1fr]">
              <div className="relative min-h-[210px] overflow-hidden bg-gradient-to-br from-[#123441] via-[#0d5960] to-[#09232c] p-6">
                <div className="absolute -bottom-16 -right-8 size-52 rounded-full bg-aqua/10 blur-2xl"/><div className="absolute left-8 top-14 h-24 w-3 rounded-full bg-emerald-300/30 blur-sm"/><div className="absolute left-16 top-24 h-20 w-2 -rotate-12 rounded-full bg-emerald-400/30"/>
                <span className="relative rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[10px] font-bold backdrop-blur">TATLI SU · BİTKİLİ</span>
                <div className="absolute bottom-6 left-6"><p className="text-3xl font-extrabold">{aquarium.netVolumeLiters}<span className="ml-1 text-base text-white/60">L</span></p><p className="mt-1 text-xs text-white/55">Net hacim</p></div>
              </div>
              <div className="grid grid-cols-2 gap-px bg-white/[.05]">
                {[['Kurulum','12 Mar 2024'],['Boyutlar','100 × 45 × 50'],['Canlılar','24 canlı'],['Bitkiler','8 tür']].map(([label,value]) => <div key={label} className="bg-panel p-5"><p className="text-[10px] font-bold uppercase tracking-wider text-[#586e77]">{label}</p><p className="mt-2 text-sm font-bold">{value}</p></div>)}
              </div>
            </div>
          </section>

          <section className="surface p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between"><div><p className="eyebrow">Plan</p><h2 className="mt-1 text-lg font-extrabold">Yaklaşan bakımlar</h2></div><button aria-label="Bakım ekle" className="grid size-9 place-items-center rounded-xl bg-white/[.05] text-aqua"><Plus size={17}/></button></div>
            <div className="space-y-2">{maintenanceTasks.map((task, index) => <div key={task.id} className="flex items-center gap-3 rounded-xl border border-white/[.05] bg-white/[.018] p-3.5"><span className={`grid size-10 shrink-0 place-items-center rounded-xl ${index === 0 ? 'bg-aqua/10 text-aqua' : 'bg-white/[.04] text-[#71858d]'}`}>{index === 0 ? <Droplets size={18}/> : <CalendarDays size={18}/>}</span><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold">{task.title}</p><p className="mt-1 text-[10px] text-[#647981]">{index === 0 ? '2 gün sonra' : formatDay(task.dueAt)}</p></div><span className="text-[10px] font-bold text-[#71858d]">{formatDay(task.dueAt)}</span></div>)}</div>
            <button className="mt-4 w-full rounded-xl border border-white/[.06] py-3 text-xs font-bold text-[#82969e] hover:text-white">Tüm bakım planı</button>
          </section>
        </div>

        <section className="surface mt-5 p-5 sm:p-6">
          <div className="mb-6 flex items-center justify-between"><div><p className="eyebrow">Son 3 ölçüm</p><h2 className="mt-1 text-lg font-extrabold">Su değerleri özeti</h2></div><button className="rounded-lg bg-aqua/10 px-3 py-2 text-[10px] font-extrabold text-aqua">Ölçüm ekle</button></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left"><thead><tr className="border-b border-white/[.06] text-[10px] uppercase tracking-wider text-[#586e77]"><th className="pb-3 font-bold">Tarih</th><th className="pb-3 font-bold">Sıcaklık</th><th className="pb-3 font-bold">pH</th><th className="pb-3 font-bold">GH / KH</th><th className="pb-3 font-bold">TDS</th><th className="pb-3 font-bold">NO₃</th></tr></thead><tbody>{waterReadings.map((row) => <tr key={row.id} className="border-b border-white/[.035] text-xs last:border-0"><td className="py-4 font-bold">{formatDay(row.measuredAt)}</td><td className="py-4 text-[#9aabb1]">{row.temperature}°C</td><td className="py-4 text-[#9aabb1]">{row.ph}</td><td className="py-4 text-[#9aabb1]">{row.gh} / {row.kh}</td><td className="py-4 text-[#9aabb1]">{row.tds}</td><td className="py-4"><span className="rounded-full bg-emerald-400/10 px-2 py-1 font-bold text-emerald-400">{row.nitrate} ppm</span></td></tr>)}</tbody></table></div>
        </section>
      </div>
    </main>
    <MobileNav />
  </div>;
}
