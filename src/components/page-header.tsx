import { Bell, ChevronRight, Search, Waves } from "lucide-react";

export function PageHeader({ title }: { title: string }) {
  return <header className="flex h-[74px] items-center justify-between border-b border-white/[.05] px-5 sm:px-8 lg:px-10">
    <div className="flex items-center gap-3 lg:hidden"><span className="grid size-9 place-items-center rounded-xl bg-aqua text-ink"><Waves size={20}/></span><span className="font-extrabold">AquaMind</span></div>
    <div className="hidden items-center gap-2 text-xs text-[#647981] lg:flex"><a href="/">Panel</a><ChevronRight size={13}/><span className="text-[#aab9be]">{title}</span></div>
    <div className="flex items-center gap-2"><button aria-label="Ara" className="grid size-9 place-items-center rounded-xl text-[#82969e]"><Search size={18}/></button><button aria-label="Bildirimler" className="relative grid size-9 place-items-center rounded-xl text-[#82969e]"><Bell size={18}/><span className="absolute right-2 top-2 size-1.5 rounded-full bg-amber-400"/></button></div>
  </header>;
}
