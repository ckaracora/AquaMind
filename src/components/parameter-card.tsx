import type { LucideIcon } from "lucide-react";

interface ParameterCardProps { icon: LucideIcon; label: string; value: string; status: string; tone?: "aqua" | "green" | "amber"; }

const tones = { aqua: "bg-aqua/10 text-aqua", green: "bg-emerald-400/10 text-emerald-400", amber: "bg-amber-400/10 text-amber-300" };

export function ParameterCard({ icon: Icon, label, value, status, tone = "aqua" }: ParameterCardProps) {
  return <div className="surface min-w-[148px] flex-1 p-4 sm:p-5">
    <div className="mb-5 flex items-start justify-between"><span className={`grid size-9 place-items-center rounded-lg ${tones[tone]}`}><Icon size={18}/></span><span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[9px] font-extrabold uppercase tracking-wider text-emerald-400">{status}</span></div>
    <p className="text-xs font-semibold text-[#71858d]">{label}</p><p className="mt-1 text-2xl font-extrabold tracking-tight">{value}</p>
  </div>;
}
