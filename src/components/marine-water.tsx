"use client";

import { Waves } from "lucide-react";
import type { MarineRow, MarineWaterAssessment } from "@aquamind/compatibility-engine";
import { useDisplayFormat } from "@/lib/use-display-format";
import { useI18n } from "@/providers/i18n-provider";

// Sağlık analizindeki "Deniz suyu" bölümü (motor 1.13.0, docs/DECISIONS/0030-deniz-suyu-hedefleri.md; taslak ürün sahibince 2026-10-30'da
// onaylandı). Hangi hedefin, neden seçildiğini; her değerin hedefini, son ölçümünü ve durumunu yazar. Hedef OATA'nın ev akvaryumu
// rehberindendir, türe özgü değildir. Değerlendirme motorundur; bu bileşen yalnız gösterir.

const tagTone: Record<MarineRow["status"], string> = {
  ok: "bg-emerald-400/10 text-emerald-300",
  warning: "bg-amber-300/10 text-amber-300",
  danger: "bg-red-400/10 text-red-300",
  missing: "bg-white/[.05] text-[#91a3aa]",
  info: "bg-white/[.05] text-[#91a3aa]",
};

export function MarineWaterSection({ marine }: { marine?: MarineWaterAssessment }) {
  const { t } = useI18n();
  const fmt = useDisplayFormat();
  if (!marine) return null;
  const c = t.health.marine;
  const units: Partial<Record<MarineRow["parameter"], string>> = c.units;
  const unit = (row: MarineRow) => (units[row.parameter] ? ` ${units[row.parameter]}` : "");
  const value = (row: MarineRow, amount: number) =>
    row.parameter === "temperature" ? fmt.temperature(amount) : `${fmt.measurement(amount)}${unit(row)}`;
  const target = (row: MarineRow) => {
    if (row.parameter === "temperature") return `${fmt.temperatureNumber(row.min!)}–${fmt.temperature(row.max!)}`;
    return row.min === undefined ? c.atMost(`${fmt.measurement(row.max!)}${unit(row)}`) : `${fmt.measurement(row.min)}–${fmt.measurement(row.max!)}${unit(row)}`;
  };
  const tag = (row: MarineRow) => {
    if (row.status === "ok") return c.status.ok;
    if (row.status === "missing") return c.status.missing;
    if (row.status === "info") return row.parameter === "temperature" ? c.status.temperatureInfo : c.status.speciesDependent;
    return c.status.outOfTarget(target(row));
  };
  return (
    <section className="surface mt-5 overflow-hidden" aria-labelledby="marine-water-title">
      <div className="flex gap-3 border-b border-white/[.06] p-5 sm:p-6">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-aqua/10 text-aqua"><Waves size={19} /></span>
        <div className="min-w-0">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 id="marine-water-title" className="mt-1 text-lg font-extrabold">{c.title[marine.profile]}</h2>
          <p className="mt-1 text-[13px] leading-relaxed text-[#91a3aa] sm:text-xs">{c.reason[marine.profile]} {c.source}</p>
        </div>
      </div>
      <dl className="divide-y divide-white/[.05]">
        {marine.rows.map((row) => (
          <div key={row.parameter} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-5 py-3.5 sm:grid-cols-[1fr_auto_auto] sm:px-6">
            <dt className="text-sm font-bold">{c.parameters[row.parameter]}</dt>
            <dd className="text-right text-sm tabular-nums text-[#c7d5d9]">{row.value === undefined ? c.noReading : value(row, row.value)}</dd>
            <dd className="col-span-2 sm:col-span-1 sm:text-right">
              <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-bold ${tagTone[row.status]}`}>{tag(row)}</span>
              {/* Hedefin dışındaki etiket hedefi zaten yazar; ölçüm yokken de hangi değerin hedeflendiği görünür. */}
              {row.status !== "warning" && row.status !== "danger" && row.max !== undefined && <span className="ml-2 text-[11px] text-[#71858d]">{row.status === "info" ? c.oataLabel(target(row)) : c.targetLabel(target(row))}</span>}
            </dd>
          </div>
        ))}
      </dl>
      <p className="border-t border-white/[.06] px-5 py-3.5 text-[12px] leading-relaxed text-[#71858d] sm:px-6 sm:text-[11px]">{c.note}</p>
    </section>
  );
}
