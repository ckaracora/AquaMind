"use client";

// "Bu akvaryuma ne uyar?" penceresi (veri sprinti F, 2026-11-14): sağlık sayfasından ve canlı seçme penceresinden açılır. Kurallar
// src/lib/aquarium-fit.ts içindedir. Tür kataloğu, davranış kayıtları ve akvaryumun ekipman parçaları pencere açılınca yüklenir (`import()`,
// src/lib/catalog-slice.ts); sağlık sayfasının ilk yüklemesi değişmez (karar 0016). Pencere sayfanın sonuna çizilir (portal), böylece canlı
// seçme penceresinin üstünde durur.
import { useEffect, useId, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Plus, X } from "lucide-react";
import { ModalDialog } from "@/components/modal-dialog";
import { SpeciesCardButton, SpeciesCardDialog } from "@/components/species-card";
import type { SpeciesProfile } from "@/data/catalog-species";
import { FIT_CATEGORIES, FIT_PAGE_SIZE, fitLookup, speciesFittingAquarium, type FitCategory, type FitResult } from "@/lib/aquarium-fit";
import { loadCatalogSlice } from "@/lib/catalog-slice";
import { useDisplayFormat } from "@/lib/use-display-format";
import { useI18n } from "@/providers/i18n-provider";
import type { Aquarium, Equipment, Livestock, WaterParameters } from "@/types/aquarium";

/** Pencerenin gereksindiği katalog modülleri ve ekipman parçaları; hesap yüklenince bir kez yapılır. */
async function computeFit(aquarium: Aquarium, animals: Livestock[], devices: Equipment[], latest: WaterParameters | undefined): Promise<FitResult> {
  const [{ speciesCatalog, speciesForLivestock }, { speciesBehavior }, equipment] = await Promise.all([
    import("@/data/catalog-species"), import("@/data/species-behavior"), loadCatalogSlice([], devices),
  ]);
  return speciesFittingAquarium({ lookup: fitLookup(speciesForLivestock, speciesBehavior, equipment), aquarium, animals, devices, latest, candidates: speciesCatalog });
}

/**
 * `pick` verilirse (canlı seçme penceresi) her türde "Seç" düğmesi vardır ve tür pencerede seçilir. Verilmezse (sağlık sayfası) "Ekle"
 * bağlantısı canlı sayfasında seçme penceresini o türle açar (`addHref`).
 */
export function AquariumFitDialog({ aquarium, animals, devices, latest, close, pick, addHref }: {
  aquarium: Aquarium; animals: Livestock[]; devices: Equipment[]; latest?: WaterParameters; close: () => void;
  pick?: (profile: SpeciesProfile) => void; addHref?: (profile: SpeciesProfile) => string;
}) {
  const { t, catalogText } = useI18n();
  const f = t.livestock.fit;
  const fmt = useDisplayFormat();
  const titleId = useId();
  const descriptionId = useId();
  const [result, setResult] = useState<FitResult>();
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [category, setCategory] = useState<FitCategory>("fish");
  const [shown, setShown] = useState(FIT_PAGE_SIZE);
  const [card, setCard] = useState<SpeciesProfile>();
  useEffect(() => {
    let active = true;
    setFailed(false);
    // Hesap tarayıcıyı kısa süre meşgul eder; "hesaplanıyor" yazısı önce çizilsin diye bir sonraki turda başlar.
    const timer = setTimeout(() => {
      computeFit(aquarium, animals, devices, latest)
        .then((next) => { if (active) setResult(next); })
        .catch(() => { if (active) setFailed(true); });
    }, 0);
    return () => { active = false; clearTimeout(timer); };
  }, [aquarium, animals, devices, latest, attempt]);
  const counts = useMemo(() => Object.fromEntries(FIT_CATEGORIES.map((key) => [key, result?.fits.filter((entry) => entry.profile.category === key).length ?? 0])) as Record<FitCategory, number>, [result]);
  const list = useMemo(() => result?.fits.filter((entry) => entry.profile.category === category) ?? [], [result, category]);
  const visible = list.slice(0, shown);
  const heaterOnly = result?.heaterOnly[category] ?? 0;
  const speciesCount = new Set(animals.map((item) => item.catalogId ?? item.commonName)).size;
  const name = (profile: SpeciesProfile) => catalogText(profile.commonName) ?? profile.commonName;
  return createPortal(<ModalDialog close={close} labelledBy={titleId} describedBy={descriptionId}>
    <div className="mb-4 flex justify-between gap-3"><div className="min-w-0"><p className="eyebrow text-aqua">{aquarium.name}</p><h2 id={titleId} className="mt-1 text-xl font-extrabold">{f.title}</h2><p id={descriptionId} className="mt-1 text-[11px] leading-relaxed text-[#71858d] sm:text-[10px]">{f.help}</p></div><button type="button" onClick={close} aria-label={t.common.close} className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/[.04] text-[#71858d] sm:size-9"><X size={17} /></button></div>
    <div className="rounded-xl border border-white/[.06] bg-white/[.025] p-3 text-[11px] leading-relaxed text-[#91a3aa] sm:text-[10px]"><p className="font-bold text-[#c9d6da]">{f.context(fmt.volume(aquarium.netVolumeLiters), `${fmt.number(aquarium.lengthCm)} cm`, speciesCount)}</p><p className="mt-0.5">{f.reading(Boolean(latest))}</p></div>
    <div role="group" aria-label={f.categoriesLabel} className="mt-4 flex gap-1 overflow-x-auto">{FIT_CATEGORIES.map((key) => <button key={key} type="button" aria-pressed={category === key} onClick={() => { setCategory(key); setShown(FIT_PAGE_SIZE); }} className="min-h-11 min-w-11 shrink-0 rounded-xl bg-white/[.025] px-4 py-2.5 text-[11px] font-bold text-[#647981] aria-pressed:bg-aqua/10 aria-pressed:text-aqua sm:text-[10px]">{result ? f.categoryCount(t.livestock.categories[key], counts[key]) : t.livestock.categories[key]}</button>)}</div>
    <div className="mt-3" aria-live="polite">
      {!result ? <div className="py-6 text-center"><p className="text-[13px] text-[#71858d] sm:text-xs">{failed ? f.failed : f.preparing}</p>{failed && <button type="button" onClick={() => setAttempt((value) => value + 1)} className="mt-3 min-h-11 min-w-11 rounded-xl bg-aqua px-5 py-3 text-xs font-extrabold text-ink sm:min-h-0 sm:min-w-0">{t.common.retry}</button>}</div>
        : <>
          {list.length === 0 && <p className="rounded-xl border border-white/[.06] p-4 text-[13px] leading-relaxed text-[#91a3aa] sm:text-xs">{f.empty}</p>}
          {visible.length > 0 && <ul className="divide-y divide-white/[.05] rounded-xl border border-white/[.06]">{visible.map(({ profile, quantity }) => {
            const shownName = name(profile);
            return <li key={profile.id} className="flex flex-wrap items-center gap-2 p-3">
              <div className="min-w-0 flex-1 basis-40"><p className="text-sm font-bold leading-snug">{shownName}</p><p className="text-[11px] italic text-[#71858d] sm:text-[10px]">{profile.scientificName}</p></div>
              <span className="shrink-0 rounded-full bg-aqua/10 px-2.5 py-1 text-[11px] font-extrabold text-aqua sm:text-[10px]">{f.count(quantity)}</span>
              <div className="flex shrink-0 gap-1.5"><SpeciesCardButton name={shownName} onClick={() => setCard(profile)} />
                {pick ? <button type="button" onClick={() => pick(profile)} aria-label={f.chooseFor(shownName)} className="min-h-11 min-w-11 rounded-xl bg-aqua px-4 text-xs font-extrabold text-ink">{f.choose}</button>
                  : addHref ? <a href={addHref(profile)} aria-label={f.addFor(shownName)} className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-xl bg-aqua px-4 text-xs font-extrabold text-ink"><Plus size={14} aria-hidden="true" />{f.add}</a> : null}</div>
            </li>;
          })}</ul>}
          {visible.length < list.length && <button type="button" onClick={() => setShown((value) => value + FIT_PAGE_SIZE)} className="mt-2 min-h-11 w-full rounded-xl border border-white/[.08] px-3 py-2 text-xs font-bold text-[#91a3aa] hover:border-aqua/30 hover:text-aqua">{f.showMore(list.length - visible.length)}</button>}
          {heaterOnly > 0 && <div className="mt-3 rounded-xl border border-amber-300/20 bg-amber-300/[.07] p-3"><p className="text-[11px] leading-relaxed text-amber-100/80 sm:text-[10px]">{f.heaterNote(heaterOnly)}</p><a href={`/equipment?aquarium=${encodeURIComponent(aquarium.id)}`} className="inline-flex min-h-11 items-center text-[11px] font-extrabold text-aqua hover:underline sm:text-[10px]">{f.heaterLink}</a></div>}
        </>}
    </div>
    <p className="mt-4 text-[11px] leading-relaxed text-[#71858d] sm:text-[10px]">{f.note}</p>
    {card && <SpeciesCardDialog profile={card} close={() => setCard(undefined)} />}
  </ModalDialog>, document.body);
}
