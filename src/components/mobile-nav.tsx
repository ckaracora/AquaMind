"use client";

import { useEffect, useState } from "react";
import { Box, Calculator, CalendarCheck, Droplets, Fish, Gauge, Leaf, Menu, PackageSearch, Plus, Settings, SlidersHorizontal, Waves, X } from "lucide-react";
import { usePathname } from "next/navigation";

const drawerItems = [
  [Gauge,"Genel Bakış","/"],[Box,"Akvaryumlarım","/aquariums"],[Droplets,"Su Değerleri","/water"],
  [CalendarCheck,"Bakım Günlüğü","/maintenance"],[Fish,"Canlılar","/livestock"],[Leaf,"Bitkiler","/plants"],
  [SlidersHorizontal,"Ekipmanlar","/equipment"],[PackageSearch,"Ürün Kataloğu","/products"],[Calculator,"Hesaplayıcılar","/calculators"],
  [Settings,"Ayarlar","/settings"],
] as const;

export function MobileNav() {
  const pathname = usePathname();
  const [open,setOpen]=useState(false);
  const tone = (active: boolean) => active ? "text-aqua" : "text-[#71858d]";
  const secondaryActive=["/water","/livestock","/plants","/equipment","/products","/calculators","/settings"].some(p=>pathname.startsWith(p));
  useEffect(()=>setOpen(false),[pathname]);
  useEffect(()=>{document.body.style.overflow=open?"hidden":"";return()=>{document.body.style.overflow=""}},[open]);
  return <>
    {open&&<div className="fixed inset-0 z-50 lg:hidden">
      <button type="button" aria-label="Menüyü kapat" onClick={()=>setOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm"/>
      <aside id="mobile-side-menu" role="dialog" aria-modal="true" aria-label="Ana menü" className="absolute inset-y-0 left-0 flex w-[min(86vw,320px)] flex-col border-r border-white/10 bg-[#09171e] px-4 py-5 shadow-2xl">
        <div className="mb-7 flex items-center gap-3 px-2"><span className="grid size-10 place-items-center rounded-xl bg-aqua text-ink"><Waves size={22}/></span><div><p className="text-base font-extrabold">AquaMind</p><p className="text-[8px] font-bold uppercase tracking-[.22em] text-aqua/70">Aquarium intelligence</p></div><button type="button" onClick={()=>setOpen(false)} aria-label="Menüyü kapat" className="ml-auto grid size-9 place-items-center rounded-xl bg-white/[.05] text-[#91a3aa]"><X size={18}/></button></div>
        <nav className="space-y-1 overflow-y-auto">
          {drawerItems.map(([Icon,label,href])=>{const active=href==="/"?pathname==="/":pathname.startsWith(href);return <a key={href} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-semibold ${active?"bg-aqua/10 text-aqua":"text-[#91a3aa]"}`}><Icon size={18}/>{label}{active&&<span className="ml-auto size-1.5 rounded-full bg-aqua"/>}</a>})}
        </nav>
        <div className="mt-auto rounded-xl bg-white/[.025] p-3"><p className="text-xs font-bold">Mert Kaya</p><p className="mt-1 text-[10px] text-[#647981]">Ücretsiz plan</p></div>
      </aside>
    </div>}
    <nav aria-label="Mobil ana menü" className="fixed inset-x-0 bottom-0 z-40 flex h-[74px] items-center justify-around border-t border-white/10 bg-[#0a171e]/95 px-3 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
      <a href="/" className={`flex min-w-12 flex-col items-center gap-1 ${tone(pathname==="/")}`}><Gauge size={20}/><span className="text-[9px] font-bold">Genel</span></a>
      <a href="/aquariums" className={`flex min-w-12 flex-col items-center gap-1 ${tone(pathname.startsWith("/aquariums"))}`}><Box size={20}/><span className="text-[9px] font-bold">Akvaryumlar</span></a>
      <a href="/aquariums/new" aria-label="Yeni akvaryum" className="-mt-7 grid size-14 place-items-center rounded-full border-[5px] border-ink bg-aqua text-ink shadow-[0_8px_25px_rgba(34,211,197,.3)]"><Plus size={25}/></a>
      <a href="/maintenance" className={`flex min-w-12 flex-col items-center gap-1 ${tone(pathname.startsWith("/maintenance"))}`}><CalendarCheck size={20}/><span className="text-[9px] font-bold">Bakım</span></a>
      <button type="button" aria-expanded={open} aria-controls="mobile-side-menu" onClick={()=>setOpen(true)} className={`flex min-w-12 flex-col items-center gap-1 ${tone(secondaryActive||open)}`}><Menu size={20}/><span className="text-[9px] font-bold">Menü</span></button>
    </nav>
  </>;
}
