"use client";

// Tür kartı penceresi (veri sprinti F, 2026-11-14): canlı kartından, canlı seçme penceresindeki türden ve "Bu akvaryuma ne uyar?" listesinden
// açılır. Katalog değerleri hemen görünür; davranış kayıtları ve bakım bilgisi pencere açılınca ayrı parça olarak yüklenir (`import()`), sayfanın
// ilk yüklemesine girmez. Kaynakta yazmayan alanın satırı çizilmez (src/lib/species-card.ts). Pencere sayfanın sonuna çizilir (portal): başka bir
// pencerenin içinden açıldığında onun üstünde durur ve klavyeyi o işler (src/lib/dialog-focus.ts).
import { useEffect, useId, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, Info, X } from "lucide-react";
import { ModalDialog } from "@/components/modal-dialog";
import type { SpeciesProfile } from "@/data/catalog-species";
import type { BehaviorRecord } from "@/data/species-behavior";
import type { SpeciesCare } from "@/data/species-care";
import { behaviorSummary, cardSources, CARE_TEXT_FIELDS, hasCareInfo } from "@/lib/species-card";
import { useDisplayFormat } from "@/lib/use-display-format";
import { useSpeciesCareText } from "@/lib/use-species-care-text";
import { useI18n } from "@/providers/i18n-provider";

export interface CardData { behavior?: BehaviorRecord[]; care?: SpeciesCare }

/** Davranış ve bakım kayıtları; modüller bir kez yüklenir, sonraki kartlar bellekteki modülü kullanır. */
async function loadCardData(id: string): Promise<CardData> {
  const [{ speciesBehavior }, { speciesCare }] = await Promise.all([import("@/data/species-behavior"), import("@/data/species-care")]);
  return { behavior: speciesBehavior[id], care: speciesCare[id] };
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return <div className="grid gap-0.5 py-2.5 sm:grid-cols-[11rem_1fr] sm:gap-3"><dt className="text-[11px] font-bold text-[#71858d] sm:text-[10px]">{label}</dt><dd className="text-[13px] leading-relaxed text-[#d7e2e5] sm:text-xs">{children}</dd></div>;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className="mt-5 border-t border-white/[.06] pt-4"><h3 className="text-sm font-extrabold">{title}</h3>{children}</section>;
}

export function SpeciesCardDialog({ profile, close }: { profile: SpeciesProfile; close: () => void }) {
  const careText = useSpeciesCareText();
  const titleId = useId();
  const [state, setState] = useState<{ id: string; data?: CardData; failed: boolean }>({ id: profile.id, failed: false });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setState({ id: profile.id, failed: false });
    loadCardData(profile.id)
      .then((data) => { if (active) setState({ id: profile.id, data, failed: false }); })
      .catch(() => { if (active) setState({ id: profile.id, failed: true }); });
    return () => { active = false; };
  }, [profile.id, attempt]);
  const data = state.id === profile.id ? state.data : undefined;
  const failed = state.id === profile.id && state.failed;
  return createPortal(<ModalDialog close={close} labelledBy={titleId}>
    <SpeciesCardContent profile={profile} titleId={titleId} data={data} failed={failed} retry={() => setAttempt((value) => value + 1)} close={close} careText={careText} />
  </ModalDialog>, document.body);
}

/**
 * Kartın içeriği. `data` yüklenene kadar yoktur (davranış bölümü "yükleniyor" yazar). `careText` bakım metnini ekranın diline çevirir; çevirisi
 * olmayan metin gösterilmez.
 */
export function SpeciesCardContent({ profile, titleId, data, failed, retry, close, careText }: {
  profile: SpeciesProfile; titleId: string; data?: CardData; failed: boolean; retry: () => void; close: () => void; careText: (text: string) => string | undefined;
}) {
  const { t, catalogText } = useI18n();
  const c = t.livestock.card;
  const fmt = useDisplayFormat();
  const name = catalogText(profile.commonName) ?? profile.commonName;
  const range = (low: number, high: number, write: (value: number) => string) => (low === high ? write(low) : `${write(low)}–${write(high)}`);
  const summary = data ? behaviorSummary(profile, data.behavior) : undefined;
  const sources = cardSources(profile, data?.behavior, data?.care);
  // Katalog notları ve kaynağın koşulu katalog metnidir: çevirisi olmayan dilde gösterilmez (ürün sahibi kararı 2026-10-30).
  const communityNote = profile.communityCaution ? catalogText(profile.communityCaution) : undefined;
  const husbandryNote = profile.husbandryCaution ? catalogText(profile.husbandryCaution) : undefined;
  const care = data && hasCareInfo(data.care) ? data.care : undefined;
  const careTexts = care ? CARE_TEXT_FIELDS.map((field) => [field, care[field] ? careText(care[field]) : undefined] as const).filter((entry): entry is readonly [typeof entry[0], string] => entry[1] !== undefined) : [];
  const hardness = care?.hardnessDgh;
  return <>
    <div className="mb-4 flex justify-between gap-3"><div className="min-w-0"><p className="eyebrow text-aqua">{c.eyebrow}</p><h2 id={titleId} className="mt-1 text-xl font-extrabold">{name}</h2><p className="mt-1 text-[11px] italic text-[#71858d] sm:text-[10px]">{profile.scientificName}</p></div><button type="button" onClick={close} aria-label={t.common.close} className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/[.04] text-[#71858d] sm:size-9"><X size={17} /></button></div>
    <section><h3 className="text-sm font-extrabold">{c.catalogTitle}</h3><dl className="mt-1 divide-y divide-white/[.05]">
      <Row label={c.adultSize}>{fmt.number(profile.adultSizeCm)} cm</Row>
      <Row label={c.minVolume}>{fmt.volume(profile.minVolumeL)}{profile.additionalVolumePerAnimalL ? <span className="block text-[11px] text-[#91a3aa] sm:text-[10px]">{c.extraVolume(fmt.volume(profile.additionalVolumePerAnimalL))}</span> : null}</Row>
      {profile.minTankLengthCm !== undefined && <Row label={c.minLength}>{fmt.number(profile.minTankLengthCm)} cm</Row>}
      <Row label={c.minGroup}>{c.count(profile.minGroup)}</Row>
      <Row label={c.temperature}>{range(profile.temperature[0], profile.temperature[1], (value) => fmt.temperatureNumber(value))} {fmt.temperatureSymbol}</Row>
      {profile.ph && <Row label={c.ph}>{range(profile.ph[0], profile.ph[1], (value) => fmt.measurement(value))}</Row>}
      {profile.flow && <Row label={c.flow}>{c.flows[profile.flow]}</Row>}
    </dl></section>
    <Section title={c.behaviorTitle}>
      {summary ? <>
        {summary.lines.length > 0 && <ul className="mt-2 space-y-2.5">{summary.lines.map((line, index) => {
          const condition = line.condition ? catalogText(line.condition) : undefined;
          return <li key={`${line.kind}-${index}`} className="text-[13px] leading-relaxed sm:text-xs"><p className="font-bold text-[#d7e2e5]">{line.conflict && <span className="mr-1.5 rounded-full bg-amber-300/10 px-2 py-0.5 text-[11px] font-extrabold text-amber-300 sm:text-[10px]">{c.conflict}</span>}{c.behavior[line.kind]}</p>{condition && <p className="mt-0.5 text-[#91a3aa]">{condition}</p>}{line.source && <p className="mt-0.5 text-[11px] text-[#71858d] sm:text-[10px]">{c.source(line.source)}</p>}</li>;
        })}</ul>}
        {summary.unknown && <div className="mt-2 flex gap-2.5 rounded-xl border border-sky-300/15 bg-sky-300/[.04] p-3"><Info size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-sky-300" /><div><p className="text-[13px] font-bold sm:text-xs">{c.behaviorUnknown}</p><p className="mt-0.5 text-[11px] leading-relaxed text-[#91a3aa] sm:text-[10px]">{c.behaviorUnknownHelp}</p></div></div>}
      </> : <p className="mt-2 text-[13px] text-[#71858d] sm:text-xs">{failed ? c.loadFailed : c.loading}</p>}
      {failed && <button type="button" onClick={retry} className="mt-2 min-h-11 min-w-11 rounded-xl border border-aqua/25 px-4 py-2.5 text-xs font-extrabold text-aqua hover:bg-aqua/10 sm:min-h-0 sm:min-w-0">{t.common.retry}</button>}
      {(communityNote || husbandryNote) && <div className="mt-3 rounded-xl border border-white/[.06] bg-white/[.025] p-3"><p className="text-[11px] font-extrabold text-[#91a3aa] sm:text-[10px]">{c.sourceNote}</p>{[communityNote, husbandryNote].filter(Boolean).map((note) => <p key={note} className="mt-1 text-[13px] leading-relaxed text-[#c9d6da] sm:text-xs">{note}</p>)}</div>}
    </Section>
    {care && <Section title={c.careTitle}><dl className="mt-1 divide-y divide-white/[.05]">
      {careTexts.map(([field, text]) => <Row key={field} label={c.careLabels[field]}>{text}</Row>)}
      {care.lifespan && <Row label={c.careLabels.lifespan}>{c.lifespanValue(fmt.number(care.lifespan.years[0]), fmt.number(care.lifespan.years[1]), care.lifespan.qualifier)}</Row>}
      {care.difficulty && <Row label={c.careLabels.difficulty}>{c.difficulties[care.difficulty]}</Row>}
      {care.swimLevels && care.swimLevels.length > 0 && <Row label={c.careLabels.swimLevel}>{care.swimLevels.map((level) => c.swimLevels[level]).join(", ")}</Row>}
      {hardness && <Row label={c.careLabels.hardness}>{c.hardnessValue(hardness[0] === null ? undefined : fmt.number(hardness[0]), hardness[1] === null ? undefined : fmt.number(hardness[1]))}<span className="block text-[11px] text-[#71858d] sm:text-[10px]">{c.hardnessNote}</span></Row>}
    </dl></Section>}
    {sources.sources.length > 0 && <Section title={c.sourcesTitle}><ul className="mt-1 flex flex-wrap gap-x-4">{sources.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1 text-[13px] font-bold text-aqua hover:underline sm:text-xs">{source.name}<ExternalLink size={12} aria-hidden="true" /></a></li>)}</ul>{sources.verifiedAt && <p className="text-[11px] text-[#71858d] sm:text-[10px]">{c.verifiedAt(fmt.calendarDate(sources.verifiedAt))}</p>}</Section>}
  </>;
}

/** Tür kartını açan küçük düğme (simge ve "Tür kartı" yazısı); 44 piksellik dokunma alanı. */
export function SpeciesCardButton({ name, onClick }: { name: string; onClick: () => void }) {
  const { t } = useI18n();
  return <button type="button" onClick={onClick} aria-label={t.livestock.card.openFor(name)} className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-aqua/25 px-3 text-[11px] font-extrabold text-aqua hover:bg-aqua/10 sm:text-[10px]"><Info size={13} aria-hidden="true" />{t.livestock.card.open}</button>;
}
