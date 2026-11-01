"use client";

// Kenar çubuğunun ve telefondaki yan menünün altındaki hesap kartı (karar 0035). Hesaplar kapalıyken ya da oturum yüklenirken
// bugünkü "Misafir" kartı aynen görünür (canlı site değişmez). Girişsizken karttan giriş sayfasına, girişliyken Ayarlar › Hesap
// bölümüne gidilir.
import { ChevronRight, UserRound } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";

export function AccountCard({ variant }: { variant: "sidebar" | "menu" }) {
  const { t } = useI18n();
  const { state } = useAuth();
  const a = t.account;
  const sidebar = variant === "sidebar";
  const small = sidebar ? "text-[10px]" : "text-[11px] sm:text-[10px]";
  const avatar = <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-aqua to-cyan-700 text-ink"><UserRound size={16} aria-hidden="true"/></span>;
  const link = `${sidebar ? "mt-3" : "mt-auto"} flex min-h-11 items-center gap-3 rounded-xl bg-white/[.025] p-3 hover:bg-white/[.05]`;
  const chevron = <ChevronRight size={15} className="shrink-0 text-[#647981]" aria-hidden="true"/>;
  if (state.status === "signed-in") return <a href="/settings#account" className={link}>{avatar}<span className="min-w-0 flex-1"><span className="block text-xs font-bold">{a.signedInAs}</span><span className={`block truncate text-[#91a3aa] ${small}`}>{state.user.email ?? a.openAccount}</span></span>{chevron}</a>;
  if (state.status === "signed-out") return <a href="/account/sign-in" className={link}>{avatar}<span className="min-w-0 flex-1"><span className="block text-xs font-bold">{a.guest}</span><span className={`block font-bold text-aqua ${small}`}>{a.signIn}</span></span>{chevron}</a>;
  if (sidebar) return <div className="mt-3 flex items-center gap-3 rounded-xl bg-white/[.025] p-3"><div className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-aqua to-cyan-700 text-xs font-extrabold text-ink"><UserRound size={16}/></div><div><p className="text-xs font-bold">{a.guest}</p><p className="text-[10px] text-[#647981]">{a.freePlan}</p></div></div>;
  return <div className="mt-auto rounded-xl bg-white/[.025] p-3"><p className="text-xs font-bold">{a.guest}</p><p className="mt-1 text-[11px] sm:text-[10px] text-[#647981]">{a.freePlan}</p></div>;
}
