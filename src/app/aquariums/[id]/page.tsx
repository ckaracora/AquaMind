"use client";

import { useParams } from "next/navigation";
import { Activity, ArrowLeft, CalendarDays, ChevronRight, Droplets, Fish, Leaf, Pencil, Plus, Ruler, SlidersHorizontal, Thermometer } from "lucide-react";
import { useMemo } from "react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { calculateGrossVolume } from "@/lib/aquarium-storage";
import { useCatalogLookup } from "@/lib/use-catalog-lookup";
import { useDisplayFormat } from "@/lib/use-display-format";
import { latestReading, parameterStatuses, pendingStatus, unavailableStatus, type ParameterStatus, type StatusTone } from "@/lib/water-status";
import { useAquariums } from "@/providers/aquarium-provider";
import { useI18n } from "@/providers/i18n-provider";

const statusText: Record<StatusTone, string> = { good: "text-emerald-400", warning: "text-amber-300", danger: "text-red-300", neutral: "text-[#82969e]" };
const tabs = [["overview", ""], ["health", "health"], ["water", "/water"], ["maintenance", "/maintenance"], ["livestock", "/livestock"], ["plants", "/plants"], ["equipment", "/equipment"]] as const;

export default function AquariumDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { aquariums, hydrated, waterReadings, maintenanceTasks, livestock, plants, equipment } = useAquariums();
  const fmt = useDisplayFormat();
  const { t } = useI18n();
  const formatDate = (date: string) => fmt.date(date, { day: "numeric", month: "short", year: "numeric" });
  // Su ölçümleri dilin ondalık ayırıcısıyla, sıcaklık ayarlardaki birimde yazılır.
  const shown = (value: number | undefined, unit = "") => value === undefined ? "—" : `${fmt.measurement(value)}${unit}`;
  const aquarium = aquariums.find((item) => item.id === id);
  const animals = useMemo(() => livestock.filter((item) => item.aquariumId === id), [livestock, id]);
  // Su değeri kartlarının etiketleri ana sayfayla aynı kuraldan gelir; yalnızca bu akvaryumdaki türlerin katalog kayıtları yüklenir
  // (docs/DECISIONS/0016-gereken-katalog-kayitlarinin-yuklenmesi.md).
  const { lookup, failed, retry } = useCatalogLookup(animals, [], Boolean(aquarium));

  if (!hydrated) return <AppShell><PageHeader title={t.aquariums.detail.pageTitle}/><div className="grid min-h-[60vh] place-items-center text-sm text-[#71858d]">{t.aquariums.detail.loading}</div></AppShell>;
  if (!aquarium) return <AppShell><PageHeader title={t.aquariums.detail.pageTitle}/><div className="mx-auto max-w-xl px-5 py-24 text-center"><h1 className="text-2xl font-extrabold">{t.aquariums.detail.notFoundTitle}</h1><p className="mt-3 text-sm text-[#71858d]">{t.aquariums.detail.notFoundText}</p><a href="/aquariums" className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-aqua px-5 py-3 text-xs font-extrabold text-ink">{t.aquariums.detail.back}</a></div></AppShell>;

  const latest = latestReading(waterReadings.filter((item) => item.aquariumId === id));
  const statuses = parameterStatuses(animals, lookup?.speciesForLivestock, latest, aquarium.type, failed ? unavailableStatus : pendingStatus);
  // "Yaklaşan görevler" yalnızca tamamlanmamış görevleri gösterir (ana sayfayla aynı kural; eskiden tamamlananlar da listeleniyordu).
  const tasks = maintenanceTasks.filter((item) => item.aquariumId === id && !item.completedAt);
  const aquariumPlants = plants.filter((item) => item.aquariumId === id);
  const aquariumEquipment = equipment.filter((item) => item.aquariumId === id);
  const grossVolume = calculateGrossVolume(aquarium.lengthCm, aquarium.widthCm, aquarium.heightCm);

  return <AppShell><PageHeader title={aquarium.name}/><div className="mx-auto max-w-[1280px] px-5 py-7 sm:px-8 lg:px-10 lg:py-10">
    <div className="mb-6 flex items-center justify-between"><a href="/aquariums" className="inline-flex min-h-11 items-center gap-2 text-xs font-bold text-[#82969e] hover:text-white sm:min-h-0"><ArrowLeft size={15}/>{t.aquariums.detail.back}</a><a href={`/aquariums/${id}/edit`} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/[.08] px-4 py-2.5 text-xs font-bold text-[#91a3aa] sm:min-h-0"><Pencil size={14}/>{t.aquariums.detail.edit}</a></div>

    <section className="surface relative mb-5 overflow-hidden bg-gradient-to-r from-[#0c2730] via-[#0d3b43] to-[#0b242c] p-6 sm:p-8">
      <div className="absolute -right-20 -top-28 size-80 rounded-full bg-aqua/10 blur-3xl"/>
      <div className="relative flex flex-col justify-between gap-7 sm:flex-row sm:items-end"><div><span className="rounded-full border border-aqua/20 bg-aqua/10 px-3 py-1.5 text-[11px] sm:text-[9px] font-extrabold uppercase tracking-wider text-aqua">{t.common.aquariumTypes[aquarium.type]}</span><h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{aquarium.name}</h1><p className="mt-2 max-w-xl text-sm text-white/55">{aquarium.description || t.aquariums.detail.noDescription}</p></div><div className="flex gap-6"><div><p className="text-3xl font-extrabold text-aqua">{fmt.volumeNumber(aquarium.netVolumeLiters)}<span className="ml-1 text-sm">{fmt.volumeSymbol}</span></p><p className="mt-1 text-[11px] sm:text-[10px] font-bold uppercase tracking-wider text-white/40">{t.common.netVolume}</p></div><div className="border-l border-white/10 pl-6"><p className="text-sm font-extrabold">{formatDate(aquarium.setupDate)}</p><p className="mt-1 text-[11px] sm:text-[10px] font-bold uppercase tracking-wider text-white/40">{t.common.setup}</p></div></div></div>
    </section>

    <nav className="mb-5 flex gap-1 overflow-x-auto rounded-xl border border-white/[.06] bg-[#0d1b23]/80 p-1.5">{tabs.map(([tab,path], index) => <a key={tab} href={path === "health" ? `/aquariums/${id}/health` : path ? `${path}?aquarium=${id}` : "#"} className={`inline-flex min-h-11 shrink-0 items-center rounded-lg px-4 py-2.5 text-[11px] font-bold sm:min-h-0 ${index === 0 ? "bg-aqua/10 text-aqua" : "text-[#71858d] hover:text-white"}`}>{t.aquariums.detail.tabs[tab]}</a>)}</nav>

    <div className="grid gap-5 xl:grid-cols-[1.4fr_.85fr]">
      <div className="space-y-5">
        <section className="surface p-5 sm:p-6"><div className="mb-5 flex items-center justify-between"><div><p className="eyebrow">{t.aquariums.detail.statusEyebrow}</p><h2 className="mt-1 text-lg font-extrabold">{t.aquariums.detail.latestWater}</h2></div><a href={`/water?aquarium=${id}`} className="-my-3.5 flex min-h-11 items-center gap-1 text-[11px] sm:text-[10px] font-bold text-aqua">{t.aquariums.detail.viewAll}<ChevronRight size={13}/></a></div>
          {latest ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{([
            { icon: Thermometer, label: t.common.temperature, value: latest.temperature === undefined ? "—" : fmt.temperature(latest.temperature), status: statuses.temperature }, { icon: Activity, label: "pH", value: shown(latest.ph), status: statuses.ph }, { icon: Droplets, label: "TDS", value: shown(latest.tds, " ppm"), status: statuses.tds }, { icon: Activity, label: "NO₃", value: shown(latest.nitrate, " ppm"), status: statuses.nitrate },
          ] satisfies Array<{ icon: typeof Thermometer; label: string; value: string; status: ParameterStatus }>).map(({ icon: ParameterIcon, label, value, status }) => <div key={label} className="rounded-xl border border-white/[.06] bg-white/[.02] p-4"><div className="mb-5 flex justify-between"><span className="grid size-8 place-items-center rounded-lg bg-aqua/10 text-aqua"><ParameterIcon size={16}/></span><span className={`text-[11px] sm:text-[8px] font-extrabold uppercase ${statusText[status.tone]}`}>{t.waterStatus[status.key]}</span></div><p className="text-[11px] sm:text-[10px] font-bold text-[#647981]">{label}</p><p className="mt-1 text-lg font-extrabold">{value}</p></div>)}</div> : <EmptyLine text={t.aquariums.detail.noReadings}/>}
          {latest && failed && <p role="status" className="mt-3 text-[11px] text-amber-300">{t.common.speciesRangesFailed} <button type="button" onClick={retry} className="-my-3.5 inline-flex min-h-11 min-w-11 items-center font-bold underline underline-offset-2">{t.common.retry}</button></p>}
        </section>

        <section className="surface p-5 sm:p-6"><div className="mb-5 flex items-center justify-between"><div><p className="eyebrow">{t.aquariums.detail.inventoryEyebrow}</p><h2 className="mt-1 text-lg font-extrabold">{t.aquariums.detail.inventoryTitle}</h2></div><a href={`/livestock?aquarium=${id}`} aria-label={t.common.addLivestock} className="grid size-11 shrink-0 place-items-center rounded-xl bg-aqua/10 text-aqua sm:size-9"><Plus size={16}/></a></div><div className="grid gap-3 sm:grid-cols-3"><InventoryCard icon={Fish} label={t.common.livestock} value={t.common.livestockCount(animals.reduce((sum, item) => sum + item.quantity, 0))} sub={t.common.speciesCount(animals.length)} color="text-cyan-300" bg="bg-cyan-300/10"/><InventoryCard icon={Leaf} label={t.common.plants} value={t.common.speciesCount(aquariumPlants.length)} sub={t.common.recordCount(aquariumPlants.reduce((sum, item) => sum + item.quantity, 0))} color="text-emerald-400" bg="bg-emerald-400/10"/><InventoryCard icon={SlidersHorizontal} label={t.common.equipment} value={t.aquariums.detail.equipmentCount(aquariumEquipment.length)} sub={t.aquariums.detail.allActive} color="text-amber-300" bg="bg-amber-300/10"/></div></section>

        <section className="surface p-5 sm:p-6"><div className="mb-5"><p className="eyebrow">{t.aquariums.detail.technicalEyebrow}</p><h2 className="mt-1 text-lg font-extrabold">{t.common.dimensionsAndVolume}</h2></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-4"><Metric icon={Ruler} label={t.common.length} value={`${aquarium.lengthCm} cm`}/><Metric icon={Ruler} label={t.common.width} value={`${aquarium.widthCm} cm`}/><Metric icon={Ruler} label={t.common.height} value={`${aquarium.heightCm} cm`}/><Metric icon={Droplets} label={t.common.grossVolume} value={fmt.volume(grossVolume)}/></div></section>
      </div>

      <aside className="space-y-5"><section className="surface p-5 sm:p-6"><div className="mb-5 flex items-center justify-between"><div><p className="eyebrow">{t.aquariums.detail.maintenanceEyebrow}</p><h2 className="mt-1 text-lg font-extrabold">{t.aquariums.detail.upcomingTasks}</h2></div><a href={`/maintenance?aquarium=${id}`} aria-label={t.common.addMaintenance} className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/[.04] text-aqua sm:size-9"><Plus size={16}/></a></div>{tasks.length ? <div className="space-y-2">{tasks.map((task, index) => <div key={task.id} className="flex items-center gap-3 rounded-xl border border-white/[.05] p-3.5"><span className={`grid size-9 shrink-0 place-items-center rounded-lg ${index === 0 ? "bg-aqua/10 text-aqua" : "bg-white/[.04] text-[#71858d]"}`}><CalendarDays size={16}/></span><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold">{task.title}</p><p className="mt-1 text-[11px] sm:text-[9px] text-[#647981]">{formatDate(task.dueAt)}</p></div></div>)}</div> : <EmptyLine text={t.aquariums.detail.noUpcomingTasks}/>}<a href={`/maintenance?aquarium=${id}`} className="mt-4 flex min-h-11 w-full items-center justify-center rounded-xl border border-white/[.06] py-3 text-xs font-bold text-[#82969e] hover:text-white sm:min-h-0">{t.aquariums.detail.openMaintenance}</a></section>
        <section className="surface p-5 sm:p-6"><p className="eyebrow">{t.aquariums.detail.quickActions}</p><div className="mt-4 grid grid-cols-2 gap-2"><QuickAction icon={Droplets} label={t.common.addReading} href={`/water?aquarium=${id}`}/><QuickAction icon={CalendarDays} label={t.common.addMaintenance} href={`/maintenance?aquarium=${id}`}/><QuickAction icon={Fish} label={t.common.addLivestock} href={`/livestock?aquarium=${id}`}/><QuickAction icon={Leaf} label={t.common.addPlant} href={`/plants?aquarium=${id}`}/></div></section>
      </aside>
    </div>
  </div></AppShell>;
}

function EmptyLine({ text }: { text: string }) { return <div className="rounded-xl border border-dashed border-white/10 p-6 text-center text-xs text-[#647981]">{text}</div>; }
function InventoryCard({ icon: Icon, label, value, sub, color, bg }: { icon: typeof Fish; label: string; value: string; sub: string; color: string; bg: string }) { return <div className="rounded-xl border border-white/[.06] bg-white/[.02] p-4"><span className={`mb-5 grid size-9 place-items-center rounded-lg ${bg} ${color}`}><Icon size={18}/></span><p className="text-[11px] sm:text-[10px] font-bold text-[#647981]">{label}</p><p className="mt-1 text-base font-extrabold">{value}</p><p className="mt-1 text-[11px] sm:text-[9px] text-[#586e77]">{sub}</p></div>; }
function Metric({ icon: Icon, label, value }: { icon: typeof Ruler; label: string; value: string }) { return <div className="rounded-xl bg-white/[.025] p-4"><Icon size={15} className="mb-3 text-aqua"/><p className="text-[11px] sm:text-[9px] font-bold uppercase tracking-wider text-[#586e77]">{label}</p><p className="mt-1 text-sm font-extrabold">{value}</p></div>; }
function QuickAction({ icon: Icon, label, href }: { icon: typeof Fish; label: string; href: string }) { return <a href={href} className="flex flex-col items-start rounded-xl border border-white/[.06] bg-white/[.02] p-3.5 text-left text-[11px] sm:text-[10px] font-bold text-[#91a3aa] hover:border-aqua/20 hover:text-aqua"><Icon size={16} className="mb-3"/>{label}</a>; }
