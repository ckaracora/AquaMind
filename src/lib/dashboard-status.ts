// Ana sayfanın durum hesapları. Uyumluluk motoru kataloğun tamamını gerektirdiği için bu modül
// ana sayfaya dinamik olarak yüklenir; böylece sayfanın ilk yükü kataloğu içermez (bkz. src/app/page.tsx).
import { analyzeAquarium } from "@/lib/health-analysis";
import { commonSpeciesRanges, healthSummary, nitrateStatus, rangeStatus, tdsStatus, type ParameterStatus, type StatusTone } from "@/lib/water-status";
import type { Aquarium, Equipment, Livestock, WaterParameters } from "@/types/aquarium";

export interface DashboardStatus {
  summary: { text: string; tone: StatusTone };
  temperature: ParameterStatus;
  ph: ParameterStatus;
  nitrate: ParameterStatus;
  tds: ParameterStatus;
}

export function dashboardStatus(aquarium: Aquarium, animals: Livestock[], equipment: Equipment[], latest?: WaterParameters): DashboardStatus {
  const ranges = commonSpeciesRanges(animals);
  return {
    summary: healthSummary(analyzeAquarium(aquarium, animals, equipment, latest), animals.length > 0 || latest !== undefined),
    temperature: rangeStatus(latest?.temperature, ranges.temperature),
    ph: rangeStatus(latest?.ph, ranges.ph),
    nitrate: nitrateStatus(latest, aquarium.type),
    tds: tdsStatus(latest?.tds),
  };
}
