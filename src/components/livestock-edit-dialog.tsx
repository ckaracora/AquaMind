"use client";

import { FormEvent, useId } from "react";
import { Check, X } from "lucide-react";
import { ModalDialog } from "@/components/modal-dialog";
import { useI18n } from "@/providers/i18n-provider";
import type { Livestock } from "@/types/aquarium";

const field = "mt-1.5 w-full rounded-xl border border-white/[.08] bg-[#09171e] px-3 py-3 text-sm outline-none focus:border-aqua/60";

/**
 * Formdan düzenlenmiş canlı kaydı (2026-11-14 sprinti): adet, cinsiyet, eklenme tarihi ve not değişir; tür, kimlik ve akvaryum aynen kalır.
 * Adet en az 1 tam sayı olmalı, tarih YYYY-AA-GG; geçersizse `undefined` (kayıt değişmez).
 */
export function editedLivestock(item: Livestock, data: FormData): Livestock | undefined {
  const quantity = Number(data.get("quantity"));
  const addedAt = String(data.get("addedAt") ?? "");
  if (!Number.isInteger(quantity) || quantity < 1 || !/^\d{4}-\d{2}-\d{2}$/.test(addedAt)) return undefined;
  const gender = String(data.get("gender") ?? "unknown");
  const notes = String(data.get("notes") ?? "").trim();
  return { ...item, quantity, gender: (["unknown", "mixed", "male", "female"].includes(gender) ? gender : "unknown") as Livestock["gender"], addedAt, notes };
}

export function LivestockEditDialog({ item, name, close, save }: { item: Livestock; name: string; close: () => void; save: (item: Livestock) => void }) {
  const { t } = useI18n();
  const titleId = useId();
  const helpId = useId();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = editedLivestock(item, new FormData(event.currentTarget));
    if (next) save(next);
  }
  return <ModalDialog close={close} labelledBy={titleId} describedBy={helpId} width="max-w-md"><form onSubmit={submit}>
    <div className="mb-6 flex justify-between gap-3"><div><p className="eyebrow text-aqua">{name}</p><h2 id={titleId} className="mt-1 text-xl font-extrabold">{t.livestock.editTitle}</h2><p id={helpId} className="mt-1 text-[11px] sm:text-[10px] text-[#647981]">{t.livestock.editHelp}</p></div><button type="button" onClick={close} aria-label={t.common.close} className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/[.04] text-[#71858d] sm:size-9"><X size={17}/></button></div>
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="text-xs font-bold text-[#91a3aa]">{t.common.quantity}<input required name="quantity" type="number" inputMode="numeric" min="1" step="1" defaultValue={item.quantity} className={field}/></label>
      <label className="text-xs font-bold text-[#91a3aa]">{t.livestock.form.gender}<select name="gender" defaultValue={item.gender ?? "unknown"} className={field}><option value="unknown">{t.livestock.form.genders.unknown}</option><option value="mixed">{t.livestock.form.genders.mixed}</option><option value="male">{t.livestock.form.genders.male}</option><option value="female">{t.livestock.form.genders.female}</option></select></label>
      <label className="text-xs font-bold text-[#91a3aa] sm:col-span-2">{t.common.addedDate}<input required name="addedAt" type="date" defaultValue={item.addedAt.slice(0, 10)} className={field}/></label>
      <label className="text-xs font-bold text-[#91a3aa] sm:col-span-2">{t.common.notes}<textarea name="notes" rows={3} defaultValue={item.notes ?? ""} className={field}/></label>
    </div>
    <div className="mt-7 flex justify-end gap-2"><button type="button" onClick={close} className="min-h-11 min-w-11 rounded-xl border border-white/[.08] px-5 py-3 text-xs font-bold text-[#91a3aa] sm:min-h-0 sm:min-w-0">{t.common.cancel}</button><button className="flex min-h-11 min-w-11 items-center gap-2 rounded-xl bg-aqua px-5 py-3 text-xs font-extrabold text-ink sm:min-h-0 sm:min-w-0"><Check size={16}/>{t.common.save}</button></div>
  </form></ModalDialog>;
}
