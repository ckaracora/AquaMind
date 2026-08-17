import { Box, Calculator, CalendarCheck, Droplets, Fish, Gauge, Leaf, Settings, SlidersHorizontal, Waves } from "lucide-react";

const items = [
  [Gauge, "Genel Bakış", "/"], [Box, "Akvaryumlarım", "/aquariums"], [Droplets, "Su Değerleri", "/water"],
  [CalendarCheck, "Bakım Günlüğü", "#"], [Fish, "Canlılar", "#"], [Leaf, "Bitkiler", "#"],
  [SlidersHorizontal, "Ekipmanlar", "#"], [Calculator, "Hesaplayıcılar", "#"],
] as const;

export function Sidebar() {
  return <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] border-r border-white/[.06] bg-[#09171e]/95 px-4 py-6 lg:flex lg:flex-col">
    <div className="mb-9 flex items-center gap-3 px-2">
      <span className="grid size-10 place-items-center rounded-xl bg-aqua text-ink shadow-[0_8px_30px_rgba(34,211,197,.22)]"><Waves size={23}/></span>
      <div><div className="text-lg font-extrabold tracking-tight">AquaMind</div><div className="text-[9px] font-bold uppercase tracking-[.24em] text-aqua/70">Aquarium intelligence</div></div>
    </div>
    <nav className="space-y-1">
      {items.map(([Icon, label, href]) => <a key={label} href={href} className="flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-semibold text-[#82969e] transition hover:bg-white/[.04] hover:text-white"><Icon size={18}/>{label}</a>)}
    </nav>
    <div className="mt-auto border-t border-white/[.06] pt-4">
      <a href="#" className="flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-semibold text-[#82969e]"><Settings size={18}/>Ayarlar</a>
      <div className="mt-3 flex items-center gap-3 rounded-xl bg-white/[.025] p-3"><div className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-aqua to-cyan-700 text-xs font-extrabold text-ink">MK</div><div><p className="text-xs font-bold">Mert Kaya</p><p className="text-[10px] text-[#647981]">Ücretsiz plan</p></div></div>
    </div>
  </aside>;
}
