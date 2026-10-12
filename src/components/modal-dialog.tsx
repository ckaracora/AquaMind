"use client";

import type { ReactNode } from "react";
import { useDialogFocus } from "@/lib/dialog-focus";

// Ekranı kaplayan pencerelerin ortak kabuğu: karartılmış arka plan, panel, erişilebilir pencere tanımı ve klavye odağı
// (src/lib/dialog-focus.ts). Başlık ve form çağıran taraftadır; başlığın id değeri `labelledBy` ile verilir.
export function ModalDialog({ close, labelledBy, describedBy, width = "max-w-xl", children }: {
  close: () => void;
  labelledBy: string;
  describedBy?: string;
  width?: "max-w-md" | "max-w-xl" | "max-w-2xl";
  children: ReactNode;
}) {
  const dialog = useDialogFocus<HTMLDivElement>(close);
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-5">
    <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby={labelledBy} aria-describedby={describedBy} tabIndex={-1} className={`max-h-[92vh] w-full ${width} overflow-y-auto rounded-t-2xl border border-white/[.08] bg-panel p-5 outline-none sm:rounded-2xl sm:p-7`}>{children}</div>
  </div>;
}
