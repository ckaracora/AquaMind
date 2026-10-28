"use client";

import { useMemo } from "react";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import type { PlantWarning } from "@aquamind/compatibility-engine/plants";
import { plantWarningFormat, plantWarningMessagesFor } from "@aquamind/localization/plant-warnings";
import { checkAquariumPlants, plantWarningText, warningsFirst, type AquariumPlantCheck } from "@/lib/plant-warning-text";
import { useDisplayFormat } from "@/lib/use-display-format";
import { usePlantCatalog } from "@/lib/use-plant-catalog";
import { useI18n } from "@/providers/i18n-provider";
import type { Aquarium, Equipment, Plant, WaterParameters } from "@/types/aquarium";

// Bitki uyarıları (docs/DECISIONS/0025-bitki-uyarilari.md): bitki kartında kısa liste, sağlık analizinde ayrı bölüm. Uyarılar sağlık
// puanını etkilemez; sağlık analizinde bu not yazılır. Bu dosya kataloğu içe aktarmaz; kayıtlar `usePlantCatalog` ile yüklenir.

function usePlantWarningTexts() {
  const { locale } = useI18n();
  const display = useDisplayFormat();
  const messages = plantWarningMessagesFor(locale);
  const format = useMemo(() => plantWarningFormat(display), [display]);
  return { messages, text: (warning: PlantWarning) => plantWarningText(messages, format, warning) };
}

const tone = (warning: PlantWarning) => (warning.level === "warning" ? "bg-amber-300/10 text-amber-300" : "bg-aqua/10 text-aqua");
const LevelIcon = ({ warning, size }: { warning: PlantWarning; size: number }) => (warning.level === "warning" ? <AlertTriangle size={size} /> : <Info size={size} />);

/** Bitki kartındaki kısa liste: sarı uyarı ya da mavi bilgi notu, başlık ve açıklama. */
export function PlantCardWarnings({ warnings }: { warnings: PlantWarning[] }) {
  const { text } = usePlantWarningTexts();
  if (!warnings.length) return null;
  return (
    <ul className="mt-3 space-y-2">
      {warnings.map((warning) => {
        const shown = text(warning);
        return (
          <li key={warning.code} className="flex gap-2.5 rounded-xl bg-white/[.025] p-2.5">
            <span className={`grid size-7 shrink-0 place-items-center rounded-lg ${tone(warning)}`}><LevelIcon warning={warning} size={14} /></span>
            <div className="min-w-0">
              <p className="text-xs font-extrabold">{shown.title}</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-[#91a3aa]">{shown.message}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** Bitki kataloğu yüklenemediğinde: kısa bilginin ve uyarıların gösterilemediğini söyler, yeniden deneme düğmesi verir. */
export function PlantCatalogFailed({ retry, boxed }: { retry: () => void; boxed?: boolean }) {
  const { t } = useI18n();
  const { messages } = usePlantWarningTexts();
  return (
    <div role="alert" className={`flex flex-wrap items-center gap-4 p-5 ${boxed ? "surface mb-5" : ""}`}>
      <p className="min-w-0 flex-1 text-[13px] text-[#91a3aa] sm:text-xs">{messages.loadFailed}</p>
      <button type="button" onClick={retry} className="min-h-11 min-w-11 rounded-xl bg-aqua px-4 py-2.5 text-xs font-extrabold text-ink sm:min-h-0 sm:min-w-0">{t.common.retry}</button>
    </div>
  );
}

/**
 * Sağlık analizindeki bölümün içeriği. `result` yoksa katalog yükleniyor ya da yüklenemedi (`failed`). Katalogla eşleşmeyen bitki için
 * uyarı hesaplanmaz; bu bitkiler adlarıyla yazılır. Hiçbir bitki eşleşmediyse yeşil "uyarı yok" gösterilmez (değerlendirilmedi demektir).
 */
export function PlantWarningsBody({ result, failed, retry }: { result?: AquariumPlantCheck; failed: boolean; retry: () => void }) {
  const { messages, text } = usePlantWarningTexts();
  if (!result) return failed ? <PlantCatalogFailed retry={retry} /> : <p className="p-5 text-[13px] text-[#71858d] sm:text-xs">{messages.preparing}</p>;
  const warnings = warningsFirst(result.warnings);
  const names = [...new Set(result.unmatched.map((plant) => plant.name.trim()).filter(Boolean))].join(", ");
  const checked = result.checked > 0;
  return (
    <div className="divide-y divide-white/[.05]">
      {warnings.map((warning) => {
        const shown = text(warning);
        return (
          <div key={`${warning.plantId}-${warning.code}`} className="flex gap-4 p-5">
            <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${tone(warning)}`}><LevelIcon warning={warning} size={19} /></span>
            <div className="min-w-0">
              <p className="text-sm font-extrabold">{shown.title}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-[#91a3aa] sm:text-xs">{shown.message}</p>
            </div>
          </div>
        );
      })}
      {!warnings.length && checked && (
        <div className="flex items-center gap-4 p-5">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-400/10 text-emerald-400"><CheckCircle2 size={19} /></span>
          <p className="min-w-0 text-[13px] text-[#91a3aa] sm:text-xs">{result.unmatched.length ? messages.noneForMatched : messages.none}</p>
        </div>
      )}
      {result.unmatched.length > 0 && (
        <div className="flex items-center gap-4 p-5">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/[.04] text-[#91a3aa]"><Info size={19} /></span>
          <p className="min-w-0 text-[13px] leading-relaxed text-[#91a3aa] sm:text-xs">{checked ? messages.unmatched(names) : messages.noneChecked(names)}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Sağlık analizindeki "Bitki uyarıları" bölümü. Akvaryumda bitki yoksa görünmez. Bitki kataloğu ayrı parça olarak yüklenir; yüklenirken
 * bekleme metni, yüklenemezse yeniden deneme düğmesi gösterilir. Önce sarı uyarılar, sonra bilgi notları sıralanır. Sağlık puanı ve genel
 * durum bu bölümden etkilenmez.
 */
export function PlantWarningsSection({ aquarium, plants, equipment, readings }: { aquarium: Aquarium; plants: Plant[]; equipment: Equipment[]; readings: WaterParameters[] }) {
  const { messages } = usePlantWarningTexts();
  const hasPlants = plants.some((plant) => plant.aquariumId === aquarium.id);
  const { catalog, failed, retry } = usePlantCatalog(hasPlants);
  const result = useMemo(() => (catalog ? checkAquariumPlants(catalog, aquarium, plants, equipment, readings) : undefined), [catalog, aquarium, plants, equipment, readings]);
  if (!hasPlants) return null;
  return (
    <section className="surface mt-5 overflow-hidden">
      <div className="border-b border-white/[.06] p-5 sm:p-6">
        <p className="eyebrow">{messages.eyebrow}</p>
        <h2 className="mt-1 text-lg font-extrabold">{messages.title}</h2>
        <p className="mt-1 text-[13px] text-[#71858d] sm:text-xs">{messages.note}</p>
      </div>
      <PlantWarningsBody result={result} failed={failed} retry={retry} />
    </section>
  );
}
