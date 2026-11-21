"use client";

import { AlertTriangle, ExternalLink, ShieldCheck } from "lucide-react";
import { privacyMessagesFor } from "@aquamind/localization/privacy";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { useI18n } from "@/providers/i18n-provider";

// Gizlilik sayfası (docs/DECISIONS/0027-yedekten-geri-yukleme.md → "Gizlilik sayfası"). Uygulamanın bugünkü davranışını
// anlatır; metinler dil paketinin ayrı girişinden gelir (`@aquamind/localization/privacy`). Henüz belirlenmemiş bilgiler
// (`pending`) sarı kutuda açıkça "belirlenmedi" diye yazılır; tahminle doldurulmaz.
export default function PrivacyPage() {
  const { locale } = useI18n();
  const p = privacyMessagesFor(locale);
  return <AppShell><PageHeader title={p.title}/><div className="mx-auto max-w-[760px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
    <div className="mb-6"><p className="eyebrow mb-2 text-aqua">{p.eyebrow}</p><h1 className="text-2xl font-extrabold sm:text-3xl">{p.title}</h1><p className="mt-2 text-sm text-[#71858d]">{p.updated(p.updatedAt)}</p></div>
    <div role="note" className="mb-5 flex gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/[.07] p-4"><AlertTriangle size={19} aria-hidden="true" className="mt-0.5 shrink-0 text-amber-300"/><p className="text-sm font-bold leading-relaxed text-amber-100">{p.draftNotice}</p></div>
    <section aria-labelledby="privacy-summary" className="surface p-5 sm:p-6">
      <h2 id="privacy-summary" className="flex items-center gap-2 text-base font-extrabold"><ShieldCheck size={18} aria-hidden="true" className="text-emerald-400"/>{p.summaryTitle}</h2>
      <ul className="mt-4 space-y-3">{p.summary.map(line => <li key={line} className="border-l-2 border-aqua/30 pl-3 text-sm leading-relaxed">{line}</li>)}</ul>
    </section>
    {p.sections.map((section, index) => <section key={section.title} aria-labelledby={`privacy-${index}`} className="surface mt-5 p-5 sm:p-6">
      <h2 id={`privacy-${index}`} className="text-base font-extrabold">{section.title}</h2>
      <div className="mt-3 space-y-3">{section.paragraphs.map(text => <p key={text} className="text-sm leading-relaxed text-[#b4c3c8]">{text}</p>)}</div>
      {section.pending && <p className="mt-3 rounded-xl border border-amber-300/25 bg-amber-300/[.08] p-3 text-sm font-bold text-amber-100">{section.pending}</p>}
      {section.link && <a href={section.link.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-aqua underline">{section.link.label}<ExternalLink size={14} aria-hidden="true"/><span className="sr-only">, {p.opensNewTab}</span></a>}
    </section>)}
    <a href="/settings" className="mt-6 inline-flex min-h-11 items-center text-sm font-bold text-aqua underline">{p.backToSettings}</a>
  </div></AppShell>;
}
