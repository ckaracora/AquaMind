"use client";

import { useEffect, useState } from "react";
import { Box, Calculator, CalendarCheck, Droplets, Fish, Gauge, HeartHandshake, Leaf, Menu, PackageSearch, Plus, Settings, SlidersHorizontal, Stethoscope, Waves, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { allNavigationItems, type NavigationKey } from "@/data/navigation";
import { useDialogFocus } from "@/lib/dialog-focus";
import { useI18n } from "@/providers/i18n-provider";

const navIcons: Record<NavigationKey,typeof Gauge> = {overview:Gauge,aquariums:Box,water:Droplets,maintenance:CalendarCheck,livestock:Fish,plants:Leaf,equipment:SlidersHorizontal,products:PackageSearch,calculators:Calculator,diseases:Stethoscope,aquamatch:HeartHandshake,settings:Settings};

// Yan menü ayrı bir bileşendir: klavye odağı (src/lib/dialog-focus.ts) menü açılınca kurulur, kapanınca kalkar.
function MobileMenu({pathname,close}:{pathname:string;close:()=>void}) {
  const dialog=useDialogFocus<HTMLElement>(close);
  const { t } = useI18n();
  return <div className="fixed inset-0 z-50 lg:hidden">
    <button type="button" aria-label={t.navigation.closeMenu} tabIndex={-1} onClick={close} className="absolute inset-0 bg-black/70 backdrop-blur-sm"/>
    <aside ref={dialog} id="mobile-side-menu" role="dialog" aria-modal="true" aria-label={t.navigation.mainMenu} tabIndex={-1} className="absolute inset-y-0 left-0 flex w-[min(86vw,320px)] flex-col border-r border-white/10 bg-[#09171e] px-4 py-5 shadow-2xl outline-none">
      <div className="mb-7 flex items-center gap-3 px-2"><span className="grid size-10 place-items-center rounded-xl bg-aqua text-ink"><Waves size={22}/></span><div><p className="text-base font-extrabold">{t.app.name}</p><p lang={t.app.taglineLang} className="text-[11px] font-bold uppercase tracking-[.06em] text-aqua/70 sm:text-[8px] sm:tracking-[.22em]">{t.app.tagline}</p></div><button type="button" onClick={close} aria-label={t.navigation.closeMenu} className="ml-auto grid size-11 shrink-0 place-items-center rounded-xl bg-white/[.05] text-[#91a3aa]"><X size={18}/></button></div>
      <nav className="space-y-1 overflow-y-auto">
        {allNavigationItems.map(({key,href,comingSoon})=>{const Icon=navIcons[key];const label=t.navigation.items[key];if(comingSoon)return <div key={href} aria-disabled="true" className="flex cursor-default items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-semibold text-[#91a3aa]"><Icon size={18}/><span>{label}<span className="mt-0.5 block text-[11px] sm:text-[9px] font-bold uppercase tracking-wider text-aqua/60">{t.navigation.comingSoon}</span></span></div>;const active=href==="/"?pathname==="/":pathname.startsWith(href);return <a key={href} href={href} className={`flex min-h-11 items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-semibold ${active?"bg-aqua/10 text-aqua":"text-[#91a3aa]"}`}><Icon size={18}/>{label}{active&&<span className="ml-auto size-1.5 rounded-full bg-aqua"/>}</a>})}
      </nav>
      <div className="mt-auto rounded-xl bg-white/[.025] p-3"><p className="text-xs font-bold">{t.account.guest}</p><p className="mt-1 text-[11px] sm:text-[10px] text-[#647981]">{t.account.freePlan}</p></div>
    </aside>
  </div>;
}

export function MobileNav() {
  const pathname = usePathname();
  const [open,setOpen]=useState(false);
  const { t } = useI18n();
  const tone = (active: boolean) => active ? "text-aqua" : "text-[#71858d]";
  const secondaryActive=["/water","/livestock","/plants","/equipment","/products","/calculators","/diseases","/settings"].some(p=>pathname.startsWith(p));
  useEffect(()=>setOpen(false),[pathname]);
  // Menü yalnız dar ekranda görünür (lg:hidden). Ekran genişleyince kapatılır; yoksa gizli kalıp sayfa kaydırmasını kilitli bırakır.
  useEffect(()=>{const wide=window.matchMedia("(min-width: 1024px)");const closeIfWide=()=>{if(wide.matches)setOpen(false)};wide.addEventListener("change",closeIfWide);return()=>wide.removeEventListener("change",closeIfWide)},[]);
  useEffect(()=>{document.body.style.overflow=open?"hidden":"";return()=>{document.body.style.overflow=""}},[open]);
  return <>
    {open&&<MobileMenu pathname={pathname} close={()=>setOpen(false)}/>}
    <nav aria-label={t.navigation.mobileMainMenu} className="fixed inset-x-0 bottom-0 z-40 flex h-[74px] items-center justify-around border-t border-white/10 bg-[#0a171e]/95 px-3 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
      <a href="/" className={`flex min-h-11 min-w-12 flex-col items-center justify-center gap-1 ${tone(pathname==="/")}`}><Gauge size={20}/><span className="text-[11px] sm:text-[9px] font-bold">{t.navigation.shortItems.overview}</span></a>
      <a href="/aquariums" className={`flex min-h-11 min-w-12 flex-col items-center justify-center gap-1 ${tone(pathname.startsWith("/aquariums"))}`}><Box size={20}/><span className="text-[11px] sm:text-[9px] font-bold">{t.navigation.shortItems.aquariums}</span></a>
      <a href="/aquariums/new" aria-label={t.navigation.newAquarium} className="-mt-7 grid size-14 place-items-center rounded-full border-[5px] border-ink bg-aqua text-ink shadow-[0_8px_25px_rgba(34,211,197,.3)]"><Plus size={25}/></a>
      <a href="/maintenance" className={`flex min-h-11 min-w-12 flex-col items-center justify-center gap-1 ${tone(pathname.startsWith("/maintenance"))}`}><CalendarCheck size={20}/><span className="text-[11px] sm:text-[9px] font-bold">{t.navigation.shortItems.maintenance}</span></a>
      <button type="button" aria-expanded={open} aria-controls="mobile-side-menu" onClick={()=>setOpen(true)} className={`flex min-h-11 min-w-12 flex-col items-center justify-center gap-1 ${tone(secondaryActive||open)}`}><Menu size={20}/><span className="text-[11px] sm:text-[9px] font-bold">{t.navigation.shortItems.menu}</span></button>
    </nav>
  </>;
}
