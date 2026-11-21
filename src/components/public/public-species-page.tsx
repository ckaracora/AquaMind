// Herkese açık tür sayfası ve tür dizini (docs/DECISIONS/0047-herkese-acik-tur-sayfalari.md). Hazır metinle çizilir (src/lib/public-species.ts);
// bu bileşenler katalog okumaz ve tarayıcıda çalışmaz. Boş alanın satırı çizilmez.
import type { ReactNode } from "react";
import type { PublicIndexView, PublicRow, PublicSpeciesView } from "@/lib/public-species";
import { PublicShell } from "@/components/public/public-document";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className="mt-6 rounded-2xl border border-white/[.06] bg-panel p-4 sm:p-5"><h2 className="text-base font-extrabold">{title}</h2>{children}</section>;
}

function Rows({ rows }: { rows: PublicRow[] }) {
  return <dl className="mt-2 divide-y divide-white/[.05]">{rows.map((row) => <div key={row.label} className="grid gap-0.5 py-2.5 sm:grid-cols-[12rem_1fr] sm:gap-3">
    <dt className="text-[12px] font-bold text-[#91a3aa]">{row.label}</dt>
    <dd className="text-[14px] leading-relaxed text-[#d7e2e5]">{row.value}
      {row.detail && <span className="block text-[12px] text-[#91a3aa]">{row.detail}</span>}
      {row.secondary && <span className="block text-[12px] font-bold text-amber-200/90">{row.secondary}</span>}
    </dd>
  </div>)}</dl>;
}

export function PublicSpeciesPage({ view }: { view: PublicSpeciesView }) {
  const { text, labels } = view;
  return <PublicShell frame={view}>
    <nav aria-label={text.eyebrow}><a href={view.indexHref} className="inline-flex min-h-11 items-center text-[13px] font-bold text-aqua hover:underline">← {text.allSpecies}</a></nav>
    <p className="eyebrow mt-2 text-aqua">{text.eyebrow}</p>
    <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">{view.name}</h1>
    <p className="mt-1 text-[13px] italic text-[#91a3aa]">{view.scientificName}</p>
    <p className="mt-3 text-[14px] leading-relaxed text-[#c9d6da]">{view.description}</p>

    <Section title={labels.catalogTitle}><Rows rows={view.facts} /><p className="mt-2 text-[12px] text-[#71858d]">{text.catalogNote}</p></Section>

    {(view.behavior.length > 0 || view.behaviorUnknown || view.notes.length > 0) && <Section title={labels.behaviorTitle}>
      {view.behavior.length > 0 && <ul className="mt-2 space-y-3">{view.behavior.map((line, index) => <li key={`${line.text}-${index}`} className="text-[14px] leading-relaxed">
        <p className="font-bold text-[#d7e2e5]">{line.conflict && <span className="mr-1.5 rounded-full bg-amber-300/10 px-2 py-0.5 text-[12px] font-extrabold text-amber-300">{line.conflict}</span>}{line.text}</p>
        {line.condition && <p className="mt-0.5 text-[#91a3aa]">{line.condition}</p>}
        {line.source && <p className="mt-0.5 text-[12px] text-[#71858d]">{line.source}</p>}
        {line.secondary && <p className="mt-0.5 text-[12px] font-bold text-amber-200/90">{line.secondary}</p>}
      </li>)}</ul>}
      {view.behaviorUnknown && <p className="mt-2 text-[14px] font-bold text-[#d7e2e5]">{view.behaviorUnknown}</p>}
      {view.notes.length > 0 && <div className="mt-3 rounded-xl border border-white/[.06] bg-white/[.025] p-3"><p className="text-[12px] font-extrabold text-[#91a3aa]">{labels.sourceNote}</p>{view.notes.map((note) => <p key={note} className="mt-1 text-[14px] leading-relaxed text-[#c9d6da]">{note}</p>)}</div>}
    </Section>}

    {view.care.length > 0 && <Section title={labels.careTitle}><Rows rows={view.care} /></Section>}

    <section className="mt-6 rounded-2xl border border-aqua/25 bg-aqua/[.06] p-4 sm:p-5">
      <h2 className="text-base font-extrabold">{text.tryTitle}</h2>
      <p className="mt-1 text-[14px] leading-relaxed text-[#c9d6da]">{text.tryText}</p>
      <a href={view.tryHref} className="mt-3 inline-flex min-h-11 items-center rounded-xl bg-aqua px-4 text-[14px] font-extrabold text-ink hover:brightness-110">{text.tryButton}</a>
    </section>

    {view.sources.length > 0 && <section className="mt-6 text-[12px] leading-relaxed text-[#71858d]">
      <h2 className="font-extrabold text-[#91a3aa]">{labels.sourcesTitle}</h2>
      <p className="mt-1">{text.sourcesIntro}</p>
      <ul className="flex flex-wrap gap-x-4">{view.sources.map((source) => <li key={source.name} className="inline-flex flex-wrap items-center gap-x-2">
        {source.urls.map((url, index) => <a key={url} href={url} aria-label={index === 0 ? undefined : `${source.name} ${index + 1}`} className="inline-flex min-h-11 min-w-6 items-center font-bold text-aqua hover:underline">{index === 0 ? source.name : index + 1}</a>)}
      </li>)}</ul>
      {view.verifiedAt && <p>{view.verifiedAt}</p>}
    </section>}
  </PublicShell>;
}

export function PublicSpeciesIndex({ view }: { view: PublicIndexView }) {
  const { text } = view;
  return <PublicShell frame={view}>
    <p className="eyebrow text-aqua">{text.eyebrow}</p>
    <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">{view.title}</h1>
    <p className="mt-3 text-[14px] leading-relaxed text-[#c9d6da]">{view.description}</p>
    <p className="mt-1 text-[12px] text-[#71858d]">{text.indexIntro} {text.speciesCount(view.species.length)}</p>
    <ul className="mt-5 divide-y divide-white/[.05] rounded-2xl border border-white/[.06] bg-panel">{view.species.map((species) => <li key={species.id}>
      <a href={species.href} className="flex min-h-11 flex-col justify-center px-4 py-2.5 hover:bg-white/[.03]">
        <span className="text-[14px] font-bold text-[#d7e2e5]">{species.name}</span>
        <span className="text-[12px] italic text-[#91a3aa]">{species.scientificName}</span>
      </a>
    </li>)}</ul>
  </PublicShell>;
}
