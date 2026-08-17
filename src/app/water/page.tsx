"use client";

import { FormEvent, Suspense, useMemo, useState } from "react";
import { Activity, Check, ChevronDown, CircleGauge, Droplets, FlaskConical, Plus, Thermometer, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { useAquariums } from "@/providers/aquarium-provider";
import type { WaterParameters } from "@/types/aquarium";

const inputClass = "mt-1.5 w-full rounded-xl border border-white/[.08] bg-[#09171e] px-3 py-3 text-sm outline-none focus:border-aqua/60";
const fields: Array<[keyof WaterParameters, string, string]> = [
  ["temperature", "Sıcaklık", "°C"], ["ph", "pH", ""], ["gh", "GH", "dGH"], ["kh", "KH", "dKH"], ["tds", "TDS", "ppm"],
  ["ammonia", "NH₃/NH₄", "ppm"], ["nitrite", "NO₂", "ppm"], ["nitrate", "NO₃", "ppm"], ["phosphate", "PO₄", "ppm"], ["iron", "Fe", "ppm"],
];

export default function WaterPage() {
  return <Suspense fallback={<AppShell><PageHeader title="Su Değerleri"/><div className="grid min-h-[60vh] place-items-center text-sm text-[#71858d]">Su değerleri yükleniyor…</div></AppShell>}><WaterContent/></Suspense>;
}

function WaterContent() {
  const searchParams = useSearchParams();
  const { aquariums, waterReadings, addWaterReading } = useAquariums();
  const initialId = searchParams.get("aquarium");
  const [aquariumId, setAquariumId] = useState(initialId && aquariums.some((a) => a.id === initialId) ? initialId : aquariums[0]?.id ?? "");
  const [showForm, setShowForm] = useState(false);
  const readings = useMemo(() => waterReadings.filter((item) => item.aquariumId === aquariumId).sort((a, b) => +new Date(b.measuredAt) - +new Date(a.measuredAt)), [aquariumId, waterReadings]);
  const latest = readings[0];

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const reading: WaterParameters = { id: crypto.randomUUID(), aquariumId, measuredAt: new Date(String(data.get("measuredAt"))).toISOString() };
    for (const [key] of fields) { const value = data.get(key); if (value !== null && value !== "") Object.assign(reading, { [key]: Number(value) }); }
    addWaterReading(reading); setShowForm(false);
  }

  return <AppShell><PageHeader title="Su Değerleri"/><div className="mx-auto max-w-[1280px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow mb-2 text-aqua">Su kimyası</p><h1 className="text-2xl font-extrabold sm:text-3xl">Su Değerleri</h1><p className="mt-2 text-sm text-[#71858d]">Değişimleri izle, dengeyi koru.</p></div><div className="flex gap-2"><label className="relative flex-1 sm:min-w-52"><select value={aquariumId} onChange={(e) => setAquariumId(e.target.value)} className="w-full appearance-none rounded-xl border border-white/[.08] bg-panel px-4 py-3 pr-9 text-xs font-bold outline-none">{aquariums.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select><ChevronDown size={14} className="pointer-events-none absolute right-3 top-3.5 text-[#71858d]"/></label><button onClick={() => setShowForm(true)} className="flex items-center gap-2 rounded-xl bg-aqua px-4 py-3 text-xs font-extrabold text-ink"><Plus size={16}/>Ölçüm ekle</button></div></div>

    {!aquariumId ? <div className="surface p-12 text-center text-sm text-[#71858d]">Önce bir akvaryum oluşturmalısın.</div> : <>
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4"><ValueCard icon={Thermometer} label="Sıcaklık" value={latest?.temperature} unit="°C"/><ValueCard icon={FlaskConical} label="pH" value={latest?.ph}/><ValueCard icon={CircleGauge} label="TDS" value={latest?.tds} unit="ppm"/><ValueCard icon={Activity} label="Nitrat" value={latest?.nitrate} unit="ppm"/></div>
      <div className="grid gap-5 xl:grid-cols-[1.25fr_.8fr]">
        <section className="surface p-5 sm:p-6"><div className="mb-6"><p className="eyebrow">Trend</p><h2 className="mt-1 text-lg font-extrabold">pH ve sıcaklık grafiği</h2></div><WaterChart readings={[...readings].reverse().slice(-8)}/></section>
        <section className="surface p-5 sm:p-6"><p className="eyebrow">Dağılım</p><h2 className="mt-1 text-lg font-extrabold">Son ölçüm özeti</h2><div className="mt-5 grid grid-cols-2 gap-2">{fields.slice(2).map(([key,label,unit]) => <div key={key} className="rounded-xl bg-white/[.025] p-3"><p className="text-[9px] font-bold text-[#586e77]">{label}</p><p className="mt-1 text-sm font-extrabold">{latest?.[key] ?? "—"} <span className="text-[9px] text-[#647981]">{unit}</span></p></div>)}</div></section>
      </div>
      <section className="surface mt-5 overflow-hidden"><div className="flex items-center justify-between border-b border-white/[.06] p-5 sm:p-6"><div><p className="eyebrow">Kayıtlar</p><h2 className="mt-1 text-lg font-extrabold">Ölçüm geçmişi</h2></div><span className="text-[10px] font-bold text-[#647981]">{readings.length} kayıt</span></div><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-xs"><thead><tr className="border-b border-white/[.06] text-[9px] uppercase tracking-wider text-[#586e77]"><th className="px-5 py-3">Tarih</th>{fields.map(([,label]) => <th key={label} className="px-3 py-3">{label}</th>)}</tr></thead><tbody>{readings.map((r) => <tr key={r.id} className="border-b border-white/[.035] last:border-0"><td className="whitespace-nowrap px-5 py-4 font-bold">{new Date(r.measuredAt).toLocaleString("tr-TR", { day:"2-digit", month:"short", hour:"2-digit", minute:"2-digit" })}</td>{fields.map(([key]) => <td key={key} className="px-3 py-4 text-[#91a3aa]">{r[key] ?? "—"}</td>)}</tr>)}</tbody></table>{!readings.length && <div className="p-10 text-center text-xs text-[#647981]">Henüz ölçüm kaydı yok.</div>}</div></section>
    </>}
  </div>{showForm && <MeasurementForm aquariumName={aquariums.find((a) => a.id === aquariumId)?.name ?? ""} onClose={() => setShowForm(false)} onSubmit={submit}/>}</AppShell>;
}

function ValueCard({ icon: Icon, label, value, unit = "" }: { icon: typeof Droplets; label: string; value?: number; unit?: string }) { return <div className="surface p-4 sm:p-5"><div className="mb-5 flex justify-between"><span className="grid size-9 place-items-center rounded-lg bg-aqua/10 text-aqua"><Icon size={18}/></span><span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[8px] font-extrabold uppercase text-emerald-400">Normal</span></div><p className="text-[10px] font-bold text-[#647981]">{label}</p><p className="mt-1 text-xl font-extrabold">{value ?? "—"} <span className="text-[10px] text-[#71858d]">{unit}</span></p></div>; }

function WaterChart({ readings }: { readings: WaterParameters[] }) {
  if (readings.length < 2) return <div className="grid h-52 place-items-center rounded-xl border border-dashed border-white/10 text-xs text-[#647981]">Grafik için en az iki ölçüm gerekli.</div>;
  const points = readings.map((r, i) => `${10 + i * (80 / (readings.length - 1))},${85 - (((r.ph ?? 7) - 5) / 4) * 65}`).join(" ");
  const tempPoints = readings.map((r, i) => `${10 + i * (80 / (readings.length - 1))},${85 - (((r.temperature ?? 25) - 20) / 10) * 65}`).join(" ");
  return <div><svg viewBox="0 0 100 100" className="h-52 w-full overflow-visible"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#22d3c5" stopOpacity=".25"/><stop offset="1" stopColor="#22d3c5" stopOpacity="0"/></linearGradient></defs>{[20,40,60,80].map(y=><line key={y} x1="8" x2="92" y1={y} y2={y} stroke="rgba(255,255,255,.06)" strokeWidth=".4"/>)}<polyline points={points} fill="none" stroke="#22d3c5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><polyline points={tempPoints} fill="none" stroke="#fbbf24" strokeWidth="1.2" strokeDasharray="2 2" strokeLinecap="round"/></svg><div className="flex justify-center gap-5 text-[9px] font-bold"><span className="text-aqua">— pH</span><span className="text-amber-300">-- Sıcaklık</span></div></div>;
}

function MeasurementForm({ aquariumName, onClose, onSubmit }: { aquariumName: string; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) { return <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-5"><form onSubmit={onSubmit} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-white/[.08] bg-panel p-5 sm:rounded-2xl sm:p-7"><div className="mb-6 flex items-start justify-between"><div><p className="eyebrow text-aqua">{aquariumName}</p><h2 className="mt-1 text-xl font-extrabold">Yeni su ölçümü</h2></div><button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-xl bg-white/[.04] text-[#71858d]"><X size={17}/></button></div><label className="text-xs font-bold text-[#91a3aa]">Tarih ve saat<input required name="measuredAt" type="datetime-local" defaultValue={new Date(Date.now() - new Date().getTimezoneOffset()*60000).toISOString().slice(0,16)} className={inputClass}/></label><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">{fields.map(([key,label,unit]) => <label key={key} className="text-[10px] font-bold text-[#91a3aa]">{label}<div className="relative"><input name={key} type="number" step="any" placeholder="—" className={`${inputClass} pr-10`}/><span className="absolute right-3 top-5 text-[8px] text-[#586e77]">{unit}</span></div></label>)}</div><div className="mt-7 flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-xl border border-white/[.08] px-5 py-3 text-xs font-bold text-[#91a3aa]">Vazgeç</button><button className="flex items-center gap-2 rounded-xl bg-aqua px-5 py-3 text-xs font-extrabold text-ink"><Check size={16}/>Kaydet</button></div></form></div>; }
