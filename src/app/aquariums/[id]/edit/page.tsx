"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { calculateGrossVolume } from "@/lib/aquarium-storage";
import { useAquariums } from "@/providers/aquarium-provider";
import type { AquariumType } from "@/types/aquarium";

const field="mt-2 w-full rounded-xl border border-white/[.08] bg-[#09171e] px-4 py-3 text-sm outline-none focus:border-aqua/60";

export default function EditAquariumPage(){
 const {id}=useParams<{id:string}>(); const router=useRouter(); const {aquariums,hydrated,updateAquarium}=useAquariums(); const aquarium=aquariums.find(a=>a.id===id);
 const [size,setSize]=useState({length:0,width:0,height:0});
 useEffect(()=>{if(aquarium)setSize({length:aquarium.lengthCm,width:aquarium.widthCm,height:aquarium.heightCm})},[aquarium]);
 const gross=useMemo(()=>calculateGrossVolume(size.length,size.width,size.height),[size]);
 if(!hydrated)return <AppShell><PageHeader title="Akvaryumu Düzenle"/><div className="grid min-h-[60vh] place-items-center text-sm text-[#71858d]">Yükleniyor…</div></AppShell>;
 if(!aquarium)return <AppShell><PageHeader title="Akvaryumu Düzenle"/><div className="p-16 text-center">Akvaryum bulunamadı.</div></AppShell>;
 function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();const d=new FormData(e.currentTarget);updateAquarium({...aquarium!,name:String(d.get("name")),type:d.get("type") as AquariumType,lengthCm:size.length,widthCm:size.width,heightCm:size.height,netVolumeLiters:Number(d.get("netVolume")),setupDate:String(d.get("setupDate")),description:String(d.get("description")||"")});router.push(`/aquariums/${id}`)}
 return <AppShell><PageHeader title="Akvaryumu Düzenle"/><div className="mx-auto max-w-[850px] px-5 py-8 sm:px-8 lg:py-10"><a href={`/aquariums/${id}`} className="mb-6 inline-flex items-center gap-2 text-xs font-bold text-[#82969e]"><ArrowLeft size={15}/>Detaya dön</a><div className="mb-7"><p className="eyebrow mb-2 text-aqua">{aquarium.name}</p><h1 className="text-2xl font-extrabold sm:text-3xl">Akvaryumu düzenle</h1></div><form onSubmit={submit} className="space-y-5"><section className="surface grid gap-5 p-5 sm:grid-cols-2 sm:p-7"><label className="text-xs font-bold text-[#91a3aa]">Akvaryum adı<input required name="name" defaultValue={aquarium.name} className={field}/></label><label className="text-xs font-bold text-[#91a3aa]">Tür<select name="type" defaultValue={aquarium.type} className={field}><option value="freshwater">Tatlı su</option><option value="saltwater">Tuzlu su</option><option value="brackish">Acı su</option></select></label><label className="text-xs font-bold text-[#91a3aa]">Kurulum tarihi<input required name="setupDate" type="date" defaultValue={aquarium.setupDate.slice(0,10)} className={field}/></label><label className="text-xs font-bold text-[#91a3aa] sm:col-span-2">Açıklama<textarea name="description" rows={3} defaultValue={aquarium.description} className={field}/></label></section><section className="surface p-5 sm:p-7"><h2 className="mb-5 font-extrabold">Ölçüler ve hacim</h2><div className="grid grid-cols-3 gap-3">{(["length","width","height"] as const).map((key,i)=><label key={key} className="text-[10px] font-bold text-[#91a3aa]">{["Uzunluk","Genişlik","Yükseklik"][i]}<input type="number" min="1" value={size[key]} onChange={e=>setSize({...size,[key]:Number(e.target.value)})} className={field}/></label>)}</div><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-aqua/[.06] p-4"><p className="text-[9px] font-bold text-aqua/70">BRÜT HACİM</p><p className="mt-1 text-2xl font-extrabold text-aqua">{gross} L</p></div><label className="rounded-xl bg-white/[.025] p-4 text-[9px] font-bold text-[#647981]">TAHMİNİ NET HACİM<input name="netVolume" type="number" min="1" defaultValue={aquarium.netVolumeLiters} className="mt-1 w-full bg-transparent text-2xl font-extrabold text-white outline-none"/></label></div></section><div className="flex justify-end gap-2"><a href={`/aquariums/${id}`} className="rounded-xl border border-white/[.08] px-5 py-3 text-xs font-bold text-[#91a3aa]">Vazgeç</a><button className="flex items-center gap-2 rounded-xl bg-aqua px-5 py-3 text-xs font-extrabold text-ink"><Check size={16}/>Değişiklikleri kaydet</button></div></form></div></AppShell>
}
