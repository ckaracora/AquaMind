"use client";

import { ChevronRight, Waves } from "lucide-react";
import { useI18n } from "@/providers/i18n-provider";

export function PageHeader({ title }: { title: string }) {
  const { t } = useI18n();
  return <header className="flex h-[74px] items-center justify-between border-b border-white/[.05] px-5 sm:px-8 lg:px-10">
    <div className="flex items-center gap-3 lg:hidden"><span className="grid size-9 place-items-center rounded-xl bg-aqua text-ink"><Waves size={20}/></span><span className="font-extrabold">{t.app.name}</span></div>
    <div className="hidden items-center gap-2 text-xs text-[#647981] lg:flex"><a href="/">{t.navigation.dashboard}</a><ChevronRight size={13}/><span className="text-[#aab9be]">{title}</span></div>
  </header>;
}
