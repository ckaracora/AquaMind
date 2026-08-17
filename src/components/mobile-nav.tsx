"use client";

import { Box, CalendarCheck, Gauge, Menu, Plus } from "lucide-react";
import { usePathname } from "next/navigation";

export function MobileNav() {
  const pathname = usePathname();
  const tone = (active: boolean) => active ? "text-aqua" : "text-[#71858d]";
  return <nav className="fixed inset-x-0 bottom-0 z-40 flex h-[74px] items-center justify-around border-t border-white/10 bg-[#0a171e]/95 px-3 backdrop-blur-xl lg:hidden">
    <a href="/" className={`flex flex-col items-center gap-1 ${tone(pathname==="/")}`}><Gauge size={20}/><span className="text-[9px] font-bold">Genel</span></a>
    <a href="/aquariums" className={`flex flex-col items-center gap-1 ${tone(pathname.startsWith("/aquariums"))}`}><Box size={20}/><span className="text-[9px] font-bold">Akvaryumlar</span></a>
    <a href="/aquariums/new" aria-label="Yeni akvaryum" className="-mt-7 grid size-14 place-items-center rounded-full border-[5px] border-ink bg-aqua text-ink shadow-[0_8px_25px_rgba(34,211,197,.3)]"><Plus size={25}/></a>
    <a href="/maintenance" className={`flex flex-col items-center gap-1 ${tone(pathname.startsWith("/maintenance"))}`}><CalendarCheck size={20}/><span className="text-[9px] font-bold">Bakım</span></a>
    <a href="/settings" className={`flex flex-col items-center gap-1 ${tone(["/water","/livestock","/plants","/equipment","/products","/calculators","/settings"].some(p=>pathname.startsWith(p)))}`}><Menu size={20}/><span className="text-[9px] font-bold">Daha fazla</span></a>
  </nav>;
}
