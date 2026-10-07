// Ana sayfadaki su değeri kartları ve özet cümlesi. Etiketler sabit yazılmaz; son ölçüm,
// akvaryumdaki türlerin katalog aralıkları ve uyumluluk motorunun sonucundan hesaplanır.
import { assessWaterQuality, type HealthAnalysis } from "@aquamind/compatibility-engine";
import { isVerifiedSpeciesProfile } from "@/data/catalog-shared";
import type { SpeciesProfile } from "@/data/catalog-species";
import type { AquariumType, Livestock, WaterParameters } from "@/types/aquarium";

export type StatusTone = "good" | "warning" | "danger" | "neutral";
export interface ParameterStatus { label: string; tone: StatusTone; }

/**
 * Doğrulanmış türlerin ortak sıcaklık ve pH aralığı. Kesişim yoksa alt sınır üst sınırdan büyük olur.
 * Türler verilen eşleme fonksiyonuyla bulunur (tam katalog ya da yalnızca gereken parçalar; docs/DECISIONS/0016-gereken-katalog-kayitlarinin-yuklenmesi.md).
 */
export function commonSpeciesRanges(animals: Livestock[], speciesFor: (item: Livestock) => SpeciesProfile | undefined): { temperature?: [number, number]; ph?: [number, number] } {
  const profiles = animals.map((item) => speciesFor(item)).filter(isVerifiedSpeciesProfile);
  if (!profiles.length) return {};
  const common = (pick: (profile: (typeof profiles)[number]) => [number, number]): [number, number] =>
    [Math.max(...profiles.map((profile) => pick(profile)[0])), Math.min(...profiles.map((profile) => pick(profile)[1]))];
  return { temperature: common((profile) => profile.temperature), ph: common((profile) => profile.ph) };
}

export function rangeStatus(value: number | undefined, range: [number, number] | undefined): ParameterStatus {
  if (value === undefined) return { label: "Ölçüm yok", tone: "neutral" };
  if (!range) return { label: "Tür verisi yok", tone: "neutral" };
  if (range[0] > range[1]) return { label: "Türler uyuşmuyor", tone: "danger" };
  return value >= range[0] && value <= range[1] ? { label: "Uygun", tone: "good" } : { label: "Aralık dışında", tone: "danger" };
}

export function nitrateStatus(latest: WaterParameters | undefined, type: AquariumType): ParameterStatus {
  const { nitrate, invalid } = assessWaterQuality(latest, type);
  if (invalid.includes("nitrate")) return { label: "Geçersiz ölçüm", tone: "warning" };
  if (!nitrate) return { label: "Ölçüm yok", tone: "neutral" };
  if (nitrate.level === "danger") return { label: "Çok yüksek", tone: "danger" };
  if (nitrate.level === "warning") return { label: "Yüksek olabilir", tone: "warning" };
  return { label: "Uygun", tone: "good" };
}

/** TDS için katalogda tür aralığı olmadığından değer yalnızca bilgi amaçlı gösterilir. */
export function tdsStatus(value: number | undefined): ParameterStatus {
  return value === undefined ? { label: "Ölçüm yok", tone: "neutral" } : { label: "Bilgi amaçlı", tone: "neutral" };
}

export function healthSummary(analysis: HealthAnalysis, hasData: boolean): { text: string; tone: StatusTone } {
  if (!hasData) return { text: "Durum özeti için canlı ve su ölçümü ekle.", tone: "neutral" };
  if (analysis.status === "danger") return { text: "Sağlık analizi acil ilgilenmen gereken bir durum gösteriyor.", tone: "danger" };
  if (analysis.status === "warning") return { text: "Sağlık analizinde dikkat gerektiren konular var.", tone: "warning" };
  return { text: "Sağlık analizinde öne çıkan bir sorun görünmüyor.", tone: "good" };
}
