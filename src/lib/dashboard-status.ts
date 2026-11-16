// Ana sayfanın durum hesapları. Katalog verisi içermez: türler ve ekipman verilen `CatalogLookup` üzerinden gelir; ana sayfa
// yalnızca seçili akvaryumun kayıtlarını yükler (src/lib/catalog-slice.ts, docs/DECISIONS/0016-gereken-katalog-kayitlarinin-yuklenmesi.md).
import { createHealthAnalyzer, type CatalogLookup } from "@/lib/health-analysis-core";
import { uncountedAnimalNames } from "@/lib/health-warning-groups";
import { healthSummary, parameterStatuses, type HealthSummaryKey, type ParameterStatus, type StatusTone } from "@/lib/water-status";
import type { CatalogTranslator } from "@aquamind/localization/catalog";
import type { Aquarium, Equipment, Livestock, WaterParameters } from "@/types/aquarium";

export interface DashboardStatus {
  summary: { key: HealthSummaryKey; tone: StatusTone };
  /** Motor 1.21.0 (karar 0046): hesaba katılmayan (tanınmayan ya da doğrulanmamış) canlıların adları; özet cümlesinin arkasına yazılır. */
  uncounted: string[];
  temperature: ParameterStatus;
  ph: ParameterStatus;
  nitrate: ParameterStatus;
  tds: ParameterStatus;
  /** Tatlı su dışındaki akvaryumda TDS kartının yerinde gösterilir (deniz akvaryumunda OATA hedefiyle, karar 0030). */
  specificGravity: ParameterStatus;
}

export function dashboardStatus(lookup: CatalogLookup, aquarium: Aquarium, animals: Livestock[], equipment: Equipment[], latest?: WaterParameters, translate?: CatalogTranslator): DashboardStatus {
  const { temperature, ph, nitrate, tds, specificGravity } = parameterStatuses(animals, lookup.speciesForLivestock, latest, aquarium.type);
  const analysis = createHealthAnalyzer(lookup)(aquarium, animals, equipment, latest);
  return {
    summary: healthSummary(analysis, animals.length > 0 || latest !== undefined),
    uncounted: analysis.incomplete ? uncountedAnimalNames(analysis.unevaluated, translate) : [],
    temperature,
    ph,
    nitrate,
    tds,
    specificGravity,
  };
}
