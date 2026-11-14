// Canlı seçme penceresinde, eklemeden önce gösterilen uyarılar (kullanılabilirlik turu, 2026-11-12, ürün sahibi onayı: "uyarı görünür,
// ekleme serbest"). Yeni kural yoktur: sağlık analizi bu akvaryumun kayıtlarıyla bir kez adaysız, bir kez adaylı çalıştırılır; adayla yeni
// çıkan uyarılardan canlıya zarar ya da uyumsuzluk anlatanlar gösterilir. Motorun sonucu, puanı ve hükmü değişmez.
// Katalog verisi içe aktarılmaz: kayıtlar sağlık sayfasındaki gibi `CatalogLookup` ile (yalnız gereken katalog parçaları) gelir.
import { LIVESTOCK_RISK_WARNING_CODES, type HealthWarning } from "@aquamind/compatibility-engine";
import { createHealthAnalyzer, type CatalogLookup } from "@/lib/health-analysis-core";
import { sortWarningsBySeverity } from "@/lib/health-warning-groups";
import type { Aquarium, Equipment, Livestock, WaterParameters } from "@/types/aquarium";

/**
 * Seçme anında gösterilen uyarı kodları: canlı riski sınıfı (karar 0040; yenme ve yaralanma, alan ve kalabalık, aralık dışı su değeri) ve
 * uyumsuzluk anlatan kodlar (asıl avcı, tür akvaryumu, ortak sıcaklık/pH/akıntı aralığı yok, aynı tür saldırganlığı, karides uyumu
 * doğrulanmadı, akvaryum çok küçük) ve canlı varken kesin tehlike olan su değerleri (zehirli amonyak, sınırı aşan nitrit). `spaceLimited` ve
 * `groupLow` alınmaz: pencere hacmi, uzunluğu ve grup sayısını kendi kutusunda söyler.
 * Bilgi notları (bakım ve topluluk notu), kayıt ve ekipman uyarıları alınmaz.
 */
export const SELECTION_WARNING_CODES: ReadonlySet<string> = new Set([
  ...[...LIVESTOCK_RISK_WARNING_CODES].filter((code) => code !== "spaceLimited" && code !== "groupLow"),
  "predation", "speciesOnly", "temperatureConflict", "phConflict", "flowConflict", "shrimpUnverified", "spaceSevere",
  "ammoniaToxic", "ammoniaWorstCase", "nitriteHigh",
]);

const warningKey = (warning: HealthWarning) => `${warning.code}|${JSON.stringify(warning.params)}`;

/** Aday canlı eklenince yeni çıkan, `SELECTION_WARNING_CODES` sınıfındaki uyarılar; kırmızılar önce. */
export function newWarningsForCandidate(lookup: CatalogLookup, aquarium: Aquarium, animals: Livestock[], devices: Equipment[], latest: WaterParameters | undefined, candidate: Livestock): HealthWarning[] {
  const analyze = createHealthAnalyzer(lookup);
  const before = new Set(analyze(aquarium, animals, devices, latest).warnings.map(warningKey));
  const after = analyze(aquarium, [...animals, candidate], devices, latest).warnings;
  return sortWarningsBySeverity(after.filter((warning) => SELECTION_WARNING_CODES.has(warning.code) && !before.has(warningKey(warning))));
}
