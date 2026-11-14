"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { DID_YOU_MEAN_LIMIT } from "@/data/search-suggestions";
import { useI18n } from "@/providers/i18n-provider";

/** Bir "Bunu mu demek istedin?" düğmesi: gösterilen ad (arayüz dilinde) ve bilimsel ad. */
export interface DidYouMeanItem { id: string; name: string; scientificName: string }

/**
 * "Bunu mu demek istedin?" düğmeleri (2026-11-14 sprinti; canlı ve bitki ekleme penceresi aynı düzeni kullanır, liste
 * src/data/search-suggestions.ts). İlk `DID_YOU_MEAN_LIMIT` öneri görünür; ad daha çok türe gidiyorsa "Tümünü göster" ile hepsi açılır ve
 * odak yeni açılan ilk düğmeye geçer. Tür kendiliğinden seçilmez; kullanıcı düğmeye basınca seçilir. Arama değişince pencere bileşeni yeni
 * `key` verir; açılmış liste kapanır.
 */
export function DidYouMeanButtons({ items, selectedId, pick, className = "" }: { items: DidYouMeanItem[]; selectedId?: string; pick: (id: string) => void; className?: string }) {
  const { t } = useI18n();
  const f = t.livestock.form;
  const [showAll, setShowAll] = useState(false);
  const list = useRef<HTMLDivElement>(null);
  const revealing = useRef(false);
  useEffect(() => {
    if (!showAll || !revealing.current) return;
    revealing.current = false;
    list.current?.querySelectorAll("button")[DID_YOU_MEAN_LIMIT]?.focus();
  }, [showAll]);
  const visible = showAll ? items : items.slice(0, DID_YOU_MEAN_LIMIT);
  return <div ref={list} className={`grid gap-2 ${className}`}>{visible.map((item) => {
    const pressed = item.id === selectedId;
    return <button key={item.id} type="button" aria-pressed={pressed} onClick={() => pick(item.id)} className="flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border border-aqua/30 bg-aqua/[.06] px-3 py-2.5 text-left transition-colors hover:bg-aqua/[.11] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua aria-pressed:border-aqua aria-pressed:bg-aqua/[.15]">
      <span className="grid min-w-0 gap-0.5"><span className="text-sm font-bold leading-snug">{f.didYouMean(item.name)}</span><span className="text-[11px] sm:text-[10px] italic text-[#71858d]">{item.scientificName}</span></span>
      {pressed && <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-aqua px-2 py-1 text-xs font-extrabold text-ink"><Check size={12} strokeWidth={3.5} aria-hidden="true" />{f.otherWaterSuggestionChosen}</span>}
    </button>;
  })}{visible.length < items.length && <button type="button" onClick={() => { revealing.current = true; setShowAll(true); }} className="min-h-11 w-full rounded-xl border border-white/[.08] px-3 py-2 text-xs font-bold text-[#91a3aa] hover:border-aqua/30 hover:text-aqua">{f.otherWaterSuggestionsShowAll(items.length)}</button>}</div>;
}
