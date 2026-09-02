// Uyumluluk motoru `packages/compatibility-engine` içine taşındı (bkz. docs/COMPATIBILITY.md).
// Bu dosya motoru katalogla bağlayan uyarlayıcıdır; `analyzeAquarium` imzası ve çıktısı
// Phase 0B'de birebir korunmuştur. Sağlık sayfası ve scripts/test-health.cjs bu yolu kullanır.
import { isVerifiedEquipmentProfile, isVerifiedSpeciesProfile, profileForEquipment, speciesForLivestock } from "@/data/catalog";
import { createAnalyzer } from "@aquamind/compatibility-engine";

export type { HealthAnalysis, HealthMetric } from "@aquamind/compatibility-engine";

export const analyzeAquarium = createAnalyzer({
  speciesForLivestock,
  profileForEquipment,
  isVerifiedSpeciesProfile,
  isVerifiedEquipmentProfile,
});
