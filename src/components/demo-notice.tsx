"use client";

import { Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAquariums } from "@/providers/aquarium-provider";
import { useI18n } from "@/providers/i18n-provider";

// Örnek akvaryum bildirimi (kullanılabilirlik turu, 2026-11-12, ürün sahibi onayı): depo boşken sağlayıcı örnek veriyi yalnız ekranda
// gösterir (`demo` bayrakları, src/lib/aquarium-storage.ts `hydrateFromStorage`); ilk kez açan kişi bunun örnek olduğunu bilmiyordu.
// Genel Bakış'ta açıklamalı kutu, öbür sayfalarda tek satırlık şerit çıkar. Kullanıcı kendi akvaryumunu oluşturunca örnek ve bildirim kaybolur.

/** Ekrandaki akvaryumlar örnek mi? Örnek koleksiyon kaydedilmez; kullanıcı bir akvaryum ekleyince ya da örneği düzenleyince bayrak iner. */
export function useShowingDemoAquarium(): boolean {
  const { hydrated, demo } = useAquariums();
  return Boolean(hydrated && demo?.aquariums);
}

export function DemoBadge() {
  const { t } = useI18n();
  return <span className="inline-flex shrink-0 items-center rounded-full border border-amber-300/35 bg-amber-300/10 px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-amber-300 sm:text-[10px]">{t.demo.badge}</span>;
}

export function DemoNotice({ variant = "full" }: { variant?: "full" | "strip" }) {
  const showing = useShowingDemoAquarium();
  const pathname = usePathname();
  const { t } = useI18n();
  // Yeni akvaryum sayfasında kullanıcı zaten kendi akvaryumunu oluşturuyor.
  if (!showing || pathname === "/aquariums/new") return null;
  if (variant === "strip") return <div role="note" className="mx-5 mt-4 flex flex-wrap items-center gap-x-2 rounded-xl border border-amber-300/20 bg-amber-300/[.06] pl-3 pr-1 sm:mx-8 lg:mx-10">
    <DemoBadge/>
    <p className="min-w-0 flex-1 py-2 text-xs leading-snug text-amber-100/75">{t.demo.strip}</p>
    <a href="/aquariums/new" className="inline-flex min-h-11 min-w-11 w-full items-center justify-end px-2 text-xs font-extrabold text-aqua sm:w-auto sm:shrink-0">{t.demo.create}</a>
  </div>;
  return <div role="note" className="mx-5 mt-4 rounded-xl border border-amber-300/20 bg-amber-300/[.07] p-4 sm:mx-8 lg:mx-10">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <DemoBadge/>
        <p className="mt-2 text-sm font-bold text-amber-50">{t.demo.title}</p>
        <p className="mt-1 text-xs leading-relaxed text-amber-100/70">{t.demo.text}</p>
      </div>
      <a href="/aquariums/new" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-aqua px-4 py-2 text-xs font-extrabold text-ink"><Plus size={15} aria-hidden="true"/>{t.demo.create}</a>
    </div>
  </div>;
}
