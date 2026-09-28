import type { LucideIcon } from "lucide-react";
import type { StatusTone } from "@/lib/water-status";

interface ParameterCardProps { icon: LucideIcon; label: string; value: string; status: string; statusTone?: StatusTone; tone?: "aqua" | "green" | "amber"; }

const tones = { aqua: "bg-aqua/10 text-aqua", green: "bg-emerald-400/10 text-emerald-400", amber: "bg-amber-400/10 text-amber-300" };
const statusTones: Record<StatusTone, string> = { good: "bg-emerald-400/10 text-emerald-400", warning: "bg-amber-400/10 text-amber-300", danger: "bg-red-400/10 text-red-300", neutral: "bg-white/[.05] text-[#82969e]" };

export function ParameterCard({ icon: Icon, label, value, status, statusTone = "neutral", tone = "aqua" }: ParameterCardProps) {
  return <div className="surface min-w-[148px] flex-1 p-4 sm:p-5">
    <div className="mb-5 flex items-start justify-between"><span className={`grid size-9 place-items-center rounded-lg ${tones[tone]}`}><Icon size={18}/></span><span className={`rounded-full px-2 py-1 text-[9px] font-extrabold uppercase tracking-wider ${statusTones[statusTone]}`}>{status}</span></div>
    <p className="text-xs font-semibold text-[#71858d]">{label}</p><p className="mt-1 text-2xl font-extrabold tracking-tight">{value}</p>
  </div>;
}
