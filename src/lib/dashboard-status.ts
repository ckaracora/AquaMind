// Ana sayfanın durum hesapları. Katalog verisi içermez: türler ve ekipman verilen `CatalogLookup` üzerinden gelir; ana sayfa
// yalnızca seçili akvaryumun kayıtlarını yükler (src/lib/catalog-slice.ts, docs/DECISIONS/0016-gereken-katalog-kayitlarinin-yuklenmesi.md).
import { createHealthAnalyzer, type CatalogLookup } from "@/lib/health-analysis-core";
import { healthSummary, parameterStatuses, type ParameterStatus, type StatusTone } from "@/lib/water-status";
import type { Aquarium, Equipment, Livestock, WaterParameters } from "@/types/aquarium";

export interface DashboardStatus {
  summary: { text: string; tone: StatusTone };
  temperature: ParameterStatus;
  ph: ParameterStatus;
  nitrate: ParameterStatus;
  tds: ParameterStatus;
}

export function dashboardStatus(lookup: CatalogLookup, aquarium: Aquarium, animals: Livestock[], equipment: Equipment[], latest?: WaterParameters): DashboardStatus {
  const { temperature, ph, nitrate, tds } = parameterStatuses(animals, lookup.speciesForLivestock, latest, aquarium.type);
  return {
    summary: healthSummary(createHealthAnalyzer(lookup)(aquarium, animals, equipment, latest), animals.length > 0 || latest !== undefined),
    temperature,
    ph,
    nitrate,
    tds,
  };
}
