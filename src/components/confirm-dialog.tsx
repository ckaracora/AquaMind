"use client";

import { useId } from "react";
import { Trash2, X } from "lucide-react";
import { ModalDialog } from "@/components/modal-dialog";
import { useI18n } from "@/providers/i18n-provider";

/**
 * Silme onayı (2026-11-14 sprinti): tarayıcının `window.confirm` kutusu yerine ortak pencere (src/components/modal-dialog.tsx). Klavye odağı
 * pencerede kalır, Esc ve "Vazgeç" kapatır. Silme düğmesi kırmızıdır; odak ilk olarak pencereye gider, yanlışlıkla Enter silmez.
 */
export function ConfirmDialog({ title, text, confirmLabel, close, confirm }: { title: string; text?: string; confirmLabel: string; close: () => void; confirm: () => void }) {
  const { t } = useI18n();
  const titleId = useId();
  const textId = useId();
  return <ModalDialog close={close} labelledBy={titleId} describedBy={text ? textId : undefined} width="max-w-md">
    <div className="mb-5 flex items-start justify-between gap-3"><h2 id={titleId} className="text-lg font-extrabold">{title}</h2><button type="button" onClick={close} aria-label={t.common.close} className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/[.04] text-[#71858d] sm:size-9"><X size={17}/></button></div>
    {text && <p id={textId} className="text-sm leading-relaxed text-[#91a3aa]">{text}</p>}
    <div className="mt-7 flex justify-end gap-2"><button type="button" onClick={close} className="min-h-11 min-w-11 rounded-xl border border-white/[.08] px-5 py-3 text-xs font-bold text-[#91a3aa] sm:min-h-0 sm:min-w-0">{t.common.cancel}</button><button type="button" onClick={() => { confirm(); close(); }} className="flex min-h-11 min-w-11 items-center gap-2 rounded-xl bg-red-500/90 px-5 py-3 text-xs font-extrabold text-white hover:bg-red-500 sm:min-h-0 sm:min-w-0"><Trash2 size={15}/>{confirmLabel}</button></div>
  </ModalDialog>;
}
