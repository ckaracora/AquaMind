"use client";

import { FormEvent, useMemo, useState } from "react";
import { ArrowLeft, Calculator, Check, ImagePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { calculateGrossVolume } from "@/lib/aquarium-storage";
import { useAquariums } from "@/providers/aquarium-provider";
import type { AquariumType } from "@/types/aquarium";

const fieldClass = "mt-2 w-full rounded-xl border border-white/[.08] bg-[#09171e] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#40545d] focus:border-aqua/60";

export default function NewAquariumPage() {
  const router = useRouter();
  const { addAquarium } = useAquariums();
  const [dimensions, setDimensions] = useState({ length: 100, width: 40, height: 50 });
  const gross = useMemo(() => calculateGrossVolume(dimensions.length, dimensions.width, dimensions.height), [dimensions]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    addAquarium({
      id: crypto.randomUUID(), name: String(data.get("name")), type: data.get("type") as AquariumType,
      lengthCm: dimensions.length, widthCm: dimensions.width, heightCm: dimensions.height,
      netVolumeLiters: Number(data.get("netVolume")), setupDate: String(data.get("setupDate")),
      description: String(data.get("description") || ""),
    });
    router.push("/aquariums");
  }

  return <AppShell><PageHeader title="Yeni Akvaryum"/><div className="mx-auto max-w-[920px] px-5 py-8 sm:px-8 lg:py-10">
    <a href="/aquariums" className="mb-6 inline-flex items-center gap-2 text-xs font-bold text-[#82969e] hover:text-white"><ArrowLeft size={15}/>Akvaryumlara dön</a>
    <div className="mb-8"><p className="eyebrow mb-2 text-aqua">Yeni başlangıç</p><h1 className="text-2xl font-extrabold sm:text-3xl">Yeni akvaryum oluştur</h1><p className="mt-2 text-sm text-[#71858d]">Temel bilgileri girerek takip etmeye başla.</p></div>
    <form onSubmit={submit} className="space-y-5">
      <section className="surface p-5 sm:p-7"><h2 className="mb-6 font-extrabold">Genel bilgiler</h2><div className="grid gap-5 sm:grid-cols-2"><label className="text-xs font-bold text-[#91a3aa]">Akvaryum adı<input name="name" required placeholder="Örn. Amazon Nehri" className={fieldClass}/></label><label className="text-xs font-bold text-[#91a3aa]">Akvaryum tipi<select name="type" className={fieldClass} defaultValue="freshwater"><option value="freshwater">Tatlı su</option><option value="saltwater">Tuzlu su</option><option value="brackish">Acı su</option></select></label><label className="text-xs font-bold text-[#91a3aa]">Kurulum tarihi<input name="setupDate" required type="date" defaultValue={new Date().toISOString().slice(0,10)} className={fieldClass}/></label><label className="text-xs font-bold text-[#91a3aa] sm:col-span-2">Açıklama<textarea name="description" rows={3} placeholder="Akvaryumun hakkında kısa bir not..." className={fieldClass}/></label></div></section>
      <section className="surface p-5 sm:p-7"><div className="mb-6 flex items-center justify-between"><h2 className="font-extrabold">Ölçüler ve hacim</h2><span className="flex items-center gap-1.5 text-[10px] font-bold text-aqua"><Calculator size={14}/>Otomatik hesaplanır</span></div><div className="grid grid-cols-3 gap-3">{([['length','Uzunluk'],['width','Genişlik'],['height','Yükseklik']] as const).map(([key,label]) => <label key={key} className="text-xs font-bold text-[#91a3aa]">{label}<div className="relative"><input required min="1" type="number" value={dimensions[key]} onChange={(e) => setDimensions({...dimensions, [key]: Number(e.target.value)})} className={`${fieldClass} pr-10`}/><span className="absolute right-3 top-[22px] text-[10px] text-[#586e77]">cm</span></div></label>)}</div><div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-aqua/15 bg-aqua/[.06] p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-aqua/70">Brüt hacim</p><p className="mt-1 text-2xl font-extrabold text-aqua">{gross} L</p></div><label className="rounded-xl border border-white/[.07] bg-white/[.02] p-4 text-[10px] font-bold uppercase tracking-wider text-[#71858d]">Tahmini net hacim<input name="netVolume" required min="1" type="number" defaultValue={Math.round(gross * .85)} key={gross} className="mt-1 w-full bg-transparent text-2xl font-extrabold tracking-normal text-white outline-none"/></label></div></section>
      <section className="surface flex items-center gap-4 p-5 sm:p-7"><span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white/[.04] text-[#71858d]"><ImagePlus size={21}/></span><div><p className="text-sm font-bold">Akvaryum fotoğrafı</p><p className="mt-1 text-xs text-[#647981]">Fotoğraf yükleme, bulut depolama aşamasında etkinleştirilecek.</p></div></section>
      <div className="flex justify-end gap-3"><a href="/aquariums" className="rounded-xl border border-white/[.08] px-5 py-3 text-xs font-bold text-[#91a3aa]">Vazgeç</a><button className="flex items-center gap-2 rounded-xl bg-aqua px-5 py-3 text-xs font-extrabold text-ink"><Check size={17}/>Akvaryumu kaydet</button></div>
    </form>
  </div></AppShell>;
}
