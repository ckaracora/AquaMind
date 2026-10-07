// Uyumluluk motoru `packages/compatibility-engine` içine taşındı (bkz. docs/COMPATIBILITY.md).
// Bu dosya motoru tam katalogla bağlayan uyarlayıcıdır; `analyzeAquarium` imzası ve çıktısı Phase 0B'de birebir korunmuştur.
// scripts/test-health.cjs ve testler bu yolu kullanır. Sağlık sayfası ve ana sayfa ise kataloğun tamamını indirmemek için aynı
// çekirdeği (src/lib/health-analysis-core.ts) yalnızca gereken katalog parçalarıyla çalıştırır (src/lib/catalog-slice.ts).
import { profileForEquipment } from "@/data/catalog-equipment";
import { speciesForLivestock, type SpeciesProfile } from "@/data/catalog-species";
import { speciesBehavior } from "@/data/species-behavior";
import { createHealthAnalyzer, withBehaviorRecords, type CatalogLookup } from "@/lib/health-analysis-core";

export type { HealthAnalysis, HealthMetric } from "@aquamind/compatibility-engine";

export const fullCatalogLookup: CatalogLookup = {
  speciesForLivestock,
  behaviorFor: (id) => speciesBehavior[id],
  profileForEquipment,
};

/** Tam katalogdaki davranış kayıtlarıyla profil (davranış kuralları: src/lib/health-analysis-core.ts). */
export function withBehavior(profile: SpeciesProfile | undefined) {
  return withBehaviorRecords(profile, profile && speciesBehavior[profile.id]);
}

export const analyzeAquarium = createHealthAnalyzer(fullCatalogLookup);
