"use client";

import { Activity, CalendarDays, ChevronRight, CircleGauge, Droplets, FlaskConical, Plus, Thermometer, Waves } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { MobileNav } from "@/components/mobile-nav";
import { ParameterCard, statusTones } from "@/components/parameter-card";
import { Sidebar } from "@/components/sidebar";
import { greetingForHour, type GreetingKey } from "@/lib/greeting";
import { dashboardStatus } from "@/lib/dashboard-status";
import { latestReading, nitrateStatus, pendingStatus } from "@/lib/water-status";
import { useCatalogLookup } from "@/lib/use-catalog-lookup";
import { useDisplayFormat } from "@/lib/use-display-format";
import { useAquariums } from "@/providers/aquarium-provider";
import { useI18n } from "@/providers/i18n-provider";

const summaryTones = { good: "text-[#71858d]", neutral: "text-[#71858d]", warning: "text-amber-300", danger: "text-red-300" } as const;

export default function Dashboard() {
  const { aquariums, waterReadings, maintenanceTasks, livestock, plants, equipment } = useAquariums();
  const { t } = useI18n();
  // Sıcaklık, hacim ve tarih ayarlardaki tercihe göre yazılır (docs/DECISIONS/0021-dil-altyapisi.md).
  const fmt = useDisplayFormat();
  const formatDay = (date: string) => fmt.date(date, { day: "numeric", month: "short" });
  // Su ölçümleri dilin ondalık ayırıcısıyla yazılır ("7,2"); girilmemiş değer boş kalır.
  const measured = (value?: number) => value === undefined ? "" : fmt.measurement(value);
  const [selectedId, setSelectedId] = useState("");
  // Sayfa önceden derlendiği için saat, derleme sunucusunda değil tarayıcıda okunur.
  const [greeting, setGreeting] = useState<GreetingKey>();
  useEffect(() => setGreeting(greetingForHour(new Date().getHours())), []);
  const aquarium = aquariums.find((item) => item.id === selectedId) ?? aquariums[0];
  // Durum hesapları yalnızca seçili akvaryumun canlı ve ekipman kayıtlarını içeren katalog parçalarıyla yapılır; kataloğun tamamı
  // indirilmez (docs/DECISIONS/0016-gereken-katalog-kayitlarinin-yuklenmesi.md). Parçalar alınamazsa "hesaplanıyor" yazısı sonsuza kadar kalmaz.
  const aquariumId = aquarium?.id;
  const animals = useMemo(() => livestock.filter((item) => item.aquariumId === aquariumId), [livestock, aquariumId]);
  const devices = useMemo(() => equipment.filter((item) => item.aquariumId === aquariumId), [equipment, aquariumId]);
  const { lookup, failed: statusLoadFailed } = useCatalogLookup(animals, devices, Boolean(aquarium));
  if (!aquarium) return <div className="min-h-screen"><Sidebar/><main className="pb-28 lg:ml-[248px]"><div className="grid min-h-screen place-items-center px-5 text-center"><div><Waves size={45} className="mx-auto mb-5 text-aqua"/><h1 className="text-2xl font-extrabold">{t.dashboard.welcomeTitle}</h1><p className="mt-2 text-sm text-[#71858d]">{t.dashboard.welcomeText}</p><a href="/aquariums/new" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-aqua px-5 py-3 text-xs font-extrabold text-ink sm:min-h-0"><Plus size={16}/>{t.dashboard.createAquarium}</a></div></div></main><MobileNav/></div>;
  const aquariumReadings = waterReadings.filter((item) => item.aquariumId === aquarium.id);
  // Sağlık sayfasıyla aynı kural: en son ölçüm tarihe göre seçilir.
  const latest = latestReading(aquariumReadings);
  const status = lookup ? dashboardStatus(lookup, aquarium, animals, devices, latest) : undefined;
  const summary = status ? { text: t.healthSummary[status.summary.key], tone: status.summary.tone } : { text: statusLoadFailed ? t.dashboard.statusLoadFailed : t.dashboard.statusPending, tone: "neutral" as const };
  const temperatureStatus = status?.temperature ?? pendingStatus;
  const phStatus = status?.ph ?? pendingStatus;
  const nitrate = status?.nitrate ?? pendingStatus;
  const tds = status?.tds ?? pendingStatus;
  const upcomingTasks = maintenanceTasks.filter((item) => item.aquariumId === aquarium.id && !item.completedAt).slice(0, 3);
  // "Akvaryumum" kartı seçili akvaryumun kendi kayıtlarından yazılır (eskiden sabit örnek değerler gösteriyordu).
  const animalCount = animals.reduce((sum, item) => sum + item.quantity, 0);
  const plantSpecies = plants.filter((item) => item.aquariumId === aquarium.id).length;
  return <div className="min-h-screen">
    <Sidebar />
    <main className="pb-28 lg:ml-[248px] lg:pb-10">
      <header className="flex h-[74px] items-center justify-between border-b border-white/[.05] px-5 sm:px-8 lg:px-10">
        <div className="flex items-center gap-3 lg:hidden"><span className="grid size-9 place-items-center rounded-xl bg-aqua text-ink"><Waves size={20}/></span><span className="font-extrabold">{t.app.name}</span></div>
        <div className="hidden items-center gap-2 text-xs text-[#647981] lg:flex"><span>{t.navigation.dashboard}</span><ChevronRight size={13}/><span className="text-[#aab9be]">{t.navigation.items.overview}</span></div>
      </header>
      <div className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 lg:px-10 lg:py-10">
        <section className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="eyebrow mb-2 text-aqua">{fmt.date(new Date(),{day:"numeric",month:"long",weekday:"long"})}</p><h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{greeting ? t.greeting[greeting] : t.greeting.fallback}</h1><p className={`mt-2 text-sm ${summaryTones[summary.tone]}`}>{summary.text} <a href={`/aquariums/${aquarium.id}/health`} className="-my-3.5 inline-block py-3.5 font-bold text-aqua hover:underline">{t.dashboard.openHealth}</a></p></div>
          <label className="surface flex w-full items-center justify-between gap-4 px-4 py-3 text-left sm:w-auto"><div><p className="text-[11px] sm:text-[10px] font-bold uppercase tracking-wider text-[#647981]">{t.dashboard.activeAquarium}</p><select value={aquarium.id} onChange={e=>setSelectedId(e.target.value)} className="-mb-2.5 -mt-1.5 min-h-11 min-w-40 bg-transparent text-sm font-bold outline-none">{aquariums.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}</select></div><ChevronRight size={16} className="text-aqua"/></label>
        </section>

        <section className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
          <ParameterCard icon={Thermometer} label={t.common.temperature} value={latest?.temperature !== undefined ? fmt.temperature(latest.temperature) : "—"} status={t.waterStatus[temperatureStatus.key]} statusTone={temperatureStatus.tone} />
          <ParameterCard icon={FlaskConical} label={t.dashboard.phValue} value={latest?.ph !== undefined ? fmt.measurement(latest.ph) : "—"} status={t.waterStatus[phStatus.key]} statusTone={phStatus.tone} tone="green" />
          <ParameterCard icon={CircleGauge} label="TDS" value={latest?.tds !== undefined ? `${fmt.measurement(latest.tds)} ppm` : "—"} status={t.waterStatus[tds.key]} statusTone={tds.tone} />
          <ParameterCard icon={Activity} label={t.dashboard.nitrate} value={latest?.nitrate !== undefined ? `${fmt.measurement(latest.nitrate)} ppm` : "—"} status={t.waterStatus[nitrate.key]} statusTone={nitrate.tone} tone="green" />
        </section>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.45fr_.9fr]">
          <section className="surface overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/[.06] p-5 sm:p-6"><div><p className="eyebrow">{t.dashboard.myAquarium}</p><h2 className="mt-1 text-lg font-extrabold">{aquarium.name}</h2></div><a href={`/aquariums/${aquarium.id}`} className="-my-3.5 inline-flex min-h-11 shrink-0 items-center text-xs font-bold text-aqua">{t.common.viewDetails}</a></div>
            <div className="grid sm:grid-cols-[1.1fr_1fr]">
              <div className="relative min-h-[210px] overflow-hidden bg-gradient-to-br from-[#123441] via-[#0d5960] to-[#09232c] p-6">
                <div className="absolute -bottom-16 -right-8 size-52 rounded-full bg-aqua/10 blur-2xl"/><div className="absolute left-8 top-14 h-24 w-3 rounded-full bg-emerald-300/30 blur-sm"/><div className="absolute left-16 top-24 h-20 w-2 -rotate-12 rounded-full bg-emerald-400/30"/>
                <span className="relative rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[11px] sm:text-[10px] font-bold uppercase backdrop-blur">{t.common.aquariumTypes[aquarium.type]}</span>
                <div className="absolute bottom-6 left-6"><p className="text-3xl font-extrabold">{fmt.volumeNumber(aquarium.netVolumeLiters)}<span className="ml-1 text-base text-white/60">{fmt.volumeSymbol}</span></p><p className="mt-1 text-xs text-white/55">{t.common.netVolume}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-px bg-white/[.05]">
                {[[t.common.setup, fmt.date(aquarium.setupDate, { day: "numeric", month: "short", year: "numeric" })], [t.dashboard.dimensions, `${aquarium.lengthCm} × ${aquarium.widthCm} × ${aquarium.heightCm}`], [t.common.livestock, t.common.livestockCount(animalCount)], [t.common.plants, t.common.speciesCount(plantSpecies)]].map(([label,value]) => <div key={label} className="bg-panel p-5"><p className="text-[11px] sm:text-[10px] font-bold uppercase tracking-wider text-[#586e77]">{label}</p><p className="mt-2 text-sm font-bold">{value}</p></div>)}
              </div>
            </div>
          </section>

          <section className="surface p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between"><div><p className="eyebrow">{t.dashboard.planEyebrow}</p><h2 className="mt-1 text-lg font-extrabold">{t.dashboard.upcomingMaintenance}</h2></div><a href={`/maintenance?aquarium=${aquarium.id}`} aria-label={t.common.addMaintenance} className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/[.05] text-aqua sm:size-9"><Plus size={17}/></a></div>
            <div className="space-y-2">{upcomingTasks.map((task, index) => <div key={task.id} className="flex items-center gap-3 rounded-xl border border-white/[.05] bg-white/[.018] p-3.5"><span className={`grid size-10 shrink-0 place-items-center rounded-xl ${index === 0 ? 'bg-aqua/10 text-aqua' : 'bg-white/[.04] text-[#71858d]'}`}>{index === 0 ? <Droplets size={18}/> : <CalendarDays size={18}/>}</span><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold">{task.title}</p><p className="mt-1 text-[11px] sm:text-[10px] text-[#647981]">{formatDay(task.dueAt)}</p></div><span className="text-[11px] sm:text-[10px] font-bold text-[#71858d]">{formatDay(task.dueAt)}</span></div>)}</div>
            <a href={`/maintenance?aquarium=${aquarium.id}`} className="mt-4 flex min-h-11 w-full items-center justify-center rounded-xl border border-white/[.06] py-3 text-xs font-bold text-[#82969e] hover:text-white sm:min-h-0">{t.dashboard.fullPlan}</a>
          </section>
        </div>

        <section className="surface mt-5 p-5 sm:p-6">
          <div className="mb-6 flex items-center justify-between"><div><p className="eyebrow">{t.dashboard.lastReadings}</p><h2 className="mt-1 text-lg font-extrabold">{t.dashboard.waterSummary}</h2></div><a href={`/water?aquarium=${aquarium.id}`} className="inline-flex min-h-11 items-center rounded-lg bg-aqua/10 px-3 py-2 text-[11px] sm:text-[10px] font-extrabold text-aqua sm:min-h-0">{t.common.addReading}</a></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left"><thead><tr className="border-b border-white/[.06] text-[11px] sm:text-[10px] uppercase tracking-wider text-[#586e77]"><th className="pb-3 font-bold">{t.dashboard.date}</th><th className="pb-3 font-bold">{t.common.temperature}</th><th className="pb-3 font-bold">pH</th><th className="pb-3 font-bold">GH / KH</th><th className="pb-3 font-bold">TDS</th><th className="pb-3 font-bold">NO₃</th></tr></thead><tbody>{aquariumReadings.slice(0,3).map((row) => <tr key={row.id} className="border-b border-white/[.035] text-xs last:border-0"><td className="py-4 font-bold">{formatDay(row.measuredAt)}</td><td className="py-4 text-[#9aabb1]">{row.temperature !== undefined ? fmt.temperature(row.temperature) : "—"}</td><td className="py-4 text-[#9aabb1]">{measured(row.ph)}</td><td className="py-4 text-[#9aabb1]">{measured(row.gh)} / {measured(row.kh)}</td><td className="py-4 text-[#9aabb1]">{measured(row.tds)}</td><td className="py-4">{row.nitrate !== undefined ? <span className={`rounded-full px-2 py-1 font-bold ${statusTones[nitrateStatus(row, aquarium.type).tone]}`}>{measured(row.nitrate)} ppm</span> : <span className="text-[#9aabb1]">—</span>}</td></tr>)}</tbody></table></div>
        </section>
      </div>
    </main>
    <MobileNav />
  </div>;
}
