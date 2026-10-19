"use client";

import { FormEvent, useMemo, useState } from "react";
import { ArrowLeft, Calculator, Check, ImagePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { volumeFromLiters, volumeInputText, volumeInputToLiters } from "@aquamind/localization";
import { calculateGrossVolume } from "@/lib/aquarium-storage";
import { useDisplayFormat } from "@/lib/use-display-format";
import { useAquariums } from "@/providers/aquarium-provider";
import { useI18n } from "@/providers/i18n-provider";
import type { AquariumType } from "@/types/aquarium";

const fieldClass = "mt-2 w-full rounded-xl border border-white/[.08] bg-[#09171e] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#40545d] focus:border-aqua/60";

export default function NewAquariumPage() {
  const router = useRouter();
  const { addAquarium } = useAquariums();
  // Net hacim tercih edilen birimde (litre/galon) girilir, kayda litre yazılır.
  const fmt = useDisplayFormat();
  const { t } = useI18n();
  const [dimensions, setDimensions] = useState({ length: 100, width: 40, height: 50 });
  const gross = useMemo(() => calculateGrossVolume(dimensions.length, dimensions.width, dimensions.height), [dimensions]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // Boş ya da geçersiz hacim kayda yazılmaz: kayıt şemasına uymayan değer akvaryumu bir sonraki açılışta karantinaya düşürür.
    const netVolumeLiters = volumeInputToLiters(String(data.get("netVolume")), fmt.volumeUnit);
    if (!Number.isFinite(netVolumeLiters) || netVolumeLiters <= 0) return;
    addAquarium({
      id: crypto.randomUUID(), name: String(data.get("name")), type: data.get("type") as AquariumType,
      lengthCm: dimensions.length, widthCm: dimensions.width, heightCm: dimensions.height,
      netVolumeLiters, setupDate: String(data.get("setupDate")),
      description: String(data.get("description") || ""),
    });
    router.push("/aquariums");
  }

  return <AppShell><PageHeader title={t.aquariums.form.newPageTitle}/><div className="mx-auto max-w-[920px] px-5 py-8 sm:px-8 lg:py-10">
    <a href="/aquariums" className="-mt-3.5 mb-2.5 inline-flex min-h-11 items-center gap-2 text-xs font-bold text-[#82969e] hover:text-white"><ArrowLeft size={15}/>{t.aquariums.form.backToList}</a>
    <div className="mb-8"><p className="eyebrow mb-2 text-aqua">{t.aquariums.form.newEyebrow}</p><h1 className="text-2xl font-extrabold sm:text-3xl">{t.aquariums.form.newTitle}</h1><p className="mt-2 text-sm text-[#71858d]">{t.aquariums.form.newDescription}</p></div>
    <form onSubmit={submit} className="space-y-5">
      <section className="surface p-5 sm:p-7"><h2 className="mb-6 font-extrabold">{t.aquariums.form.general}</h2><div className="grid gap-5 sm:grid-cols-2"><label className="text-xs font-bold text-[#91a3aa]">{t.common.aquariumName}<input name="name" required placeholder={t.aquariums.form.namePlaceholder} className={fieldClass}/></label><label className="text-xs font-bold text-[#91a3aa]">{t.aquariums.form.type}<select name="type" className={fieldClass} defaultValue="freshwater"><option value="freshwater">{t.common.aquariumTypes.freshwater}</option><option value="saltwater">{t.common.aquariumTypes.saltwater}</option><option value="brackish">{t.common.aquariumTypes.brackish}</option></select></label><label className="text-xs font-bold text-[#91a3aa]">{t.common.setupDate}<input name="setupDate" required type="date" defaultValue={new Date().toISOString().slice(0,10)} className={fieldClass}/></label><label className="text-xs font-bold text-[#91a3aa] sm:col-span-2">{t.common.description}<textarea name="description" rows={3} placeholder={t.aquariums.form.descriptionPlaceholder} className={fieldClass}/></label></div></section>
      <section className="surface p-5 sm:p-7"><div className="mb-6 flex items-center justify-between"><h2 className="font-extrabold">{t.common.dimensionsAndVolume}</h2><span className="flex items-center gap-1.5 text-[11px] sm:text-[10px] font-bold text-aqua"><Calculator size={14}/>{t.aquariums.form.autoCalculated}</span></div><div className="grid grid-cols-3 gap-3">{([['length',t.common.length],['width',t.common.width],['height',t.common.height]] as const).map(([key,label]) => <label key={key} className="text-xs font-bold text-[#91a3aa]">{label}<div className="relative"><input required min="1" type="number" inputMode="numeric" value={dimensions[key]} onChange={(e) => setDimensions({...dimensions, [key]: Number(e.target.value)})} className={`${fieldClass} pr-10`}/><span className="absolute right-3 top-[22px] text-[11px] sm:text-[10px] text-[#586e77]">cm</span></div></label>)}</div><div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-aqua/15 bg-aqua/[.06] p-4"><p className="text-[11px] sm:text-[10px] font-bold uppercase tracking-wider text-aqua/70">{t.common.grossVolume}</p><p className="mt-1 text-2xl font-extrabold text-aqua">{fmt.volume(gross)}</p></div><label className="rounded-xl border border-white/[.07] bg-white/[.02] p-4 text-[11px] sm:text-[10px] font-bold uppercase tracking-wider text-[#71858d]">{t.common.estimatedNetVolume} ({fmt.volumeSymbol})<input name="netVolume" required min={volumeFromLiters(1, fmt.volumeUnit)} type="number" inputMode="decimal" step="any" defaultValue={volumeInputText(Math.round(gross * .85), fmt.volumeUnit)} key={`${gross}-${fmt.volumeUnit}`} className="-mb-1.5 -mt-0.5 min-h-11 w-full bg-transparent text-2xl font-extrabold tracking-normal text-white outline-none"/></label></div></section>
      <section className="surface flex items-center gap-4 p-5 sm:p-7"><span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white/[.04] text-[#71858d]"><ImagePlus size={21}/></span><div><p className="text-sm font-bold">{t.aquariums.form.photoTitle}</p><p className="mt-1 text-xs text-[#647981]">{t.aquariums.form.photoText}</p></div></section>
      <div className="flex justify-end gap-3"><a href="/aquariums" className="inline-flex min-h-11 items-center rounded-xl border border-white/[.08] px-5 py-3 text-xs font-bold text-[#91a3aa] sm:min-h-0">{t.common.cancel}</a><button className="flex min-h-11 min-w-11 items-center gap-2 rounded-xl bg-aqua px-5 py-3 text-xs font-extrabold text-ink sm:min-h-0 sm:min-w-0"><Check size={17}/>{t.aquariums.form.save}</button></div>
    </form>
  </div></AppShell>;
}
