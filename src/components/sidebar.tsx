"use client";

import { Box, Calculator, CalendarCheck, Droplets, Fish, Gauge, Leaf, PackageSearch, Settings, SlidersHorizontal, Waves } from "lucide-react";
import { usePathname } from "next/navigation";
import { primaryNavigationItems, settingsNavigationItem, type NavigationKey } from "@/data/navigation";

const navIcons: Record<NavigationKey,typeof Gauge> = {overview:Gauge,aquariums:Box,water:Droplets,maintenance:CalendarCheck,livestock:Fish,plants:Leaf,equipment:SlidersHorizontal,products:PackageSearch,calculators:Calculator,settings:Settings};

export function Sidebar() {
  const pathname = usePathname();
  return <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] border-r border-white/[.06] bg-[#09171e]/95 px-4 py-6 lg:flex lg:flex-col">
    <div className="mb-9 flex items-center gap-3 px-2">
      <span className="grid size-10 place-items-center rounded-xl bg-aqua text-ink shadow-[0_8px_30px_rgba(34,211,197,.22)]"><Waves size={23}/></span>
      <div><div className="text-lg font-extrabold tracking-tight">AquaMind</div><div className="text-[9px] font-bold uppercase tracking-[.24em] text-aqua/70">Aquarium intelligence</div></div>
    </div>
    <nav className="space-y-1">
      {primaryNavigationItems.map(({key,label,href}) => { const Icon=navIcons[key]; const active = href === "/" ? pathname === "/" : pathname.startsWith(href); return <a key={label} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-semibold transition ${active ? "bg-aqua/10 text-aqua" : "text-[#82969e] hover:bg-white/[.04] hover:text-white"}`}><Icon size={18}/>{label}{active&&<span className="ml-auto size-1.5 rounded-full bg-aqua"/>}</a>})}
    </nav>
    <div className="mt-auto border-t border-white/[.06] pt-4">
      <a href={settingsNavigationItem.href} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-semibold ${pathname.startsWith(settingsNavigationItem.href)?"bg-aqua/10 text-aqua":"text-[#82969e]"}`}><Settings size={18}/>{settingsNavigationItem.label}</a>
      <div className="mt-3 flex items-center gap-3 rounded-xl bg-white/[.025] p-3"><div className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-aqua to-cyan-700 text-xs font-extrabold text-ink">C</div><div><p className="text-xs font-bold">Canberk</p><p className="text-[10px] text-[#647981]">Ücretsiz plan</p></div></div>
    </div>
  </aside>;
}
