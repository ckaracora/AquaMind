import { Box, CalendarCheck, Gauge, Menu, Plus } from "lucide-react";

export function MobileNav() {
  return <nav className="fixed inset-x-0 bottom-0 z-40 flex h-[74px] items-center justify-around border-t border-white/10 bg-[#0a171e]/95 px-3 backdrop-blur-xl lg:hidden">
    <a href="/" className="flex flex-col items-center gap-1 text-aqua"><Gauge size={20}/><span className="text-[9px] font-bold">Genel</span></a>
    <a href="/aquariums" className="flex flex-col items-center gap-1 text-[#71858d]"><Box size={20}/><span className="text-[9px] font-bold">Akvaryumlar</span></a>
    <a href="/aquariums/new" aria-label="Yeni akvaryum" className="-mt-7 grid size-14 place-items-center rounded-full border-[5px] border-ink bg-aqua text-ink shadow-[0_8px_25px_rgba(34,211,197,.3)]"><Plus size={25}/></a>
    <a href="#" className="flex flex-col items-center gap-1 text-[#71858d]"><CalendarCheck size={20}/><span className="text-[9px] font-bold">Bakım</span></a>
    <a href="#" className="flex flex-col items-center gap-1 text-[#71858d]"><Menu size={20}/><span className="text-[9px] font-bold">Daha fazla</span></a>
  </nav>;
}
