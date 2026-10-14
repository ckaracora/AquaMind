// Su değeri kartları (ana sayfa, akvaryum sayfası, su değerleri sayfası) ve ana sayfanın özet cümlesi. Etiketler sabit yazılmaz;
// son ölçüm, akvaryumdaki türlerin katalog aralıkları ve uyumluluk motorunun sonucundan hesaplanır.
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

/** Katalogda tür aralığı olmayan değerler (TDS, özgül ağırlık) yalnızca bilgi amaçlı gösterilir. */
export function informationalStatus(value: number | undefined): ParameterStatus {
  return value === undefined ? { label: "Ölçüm yok", tone: "neutral" } : { label: "Bilgi amaçlı", tone: "neutral" };
}

/** TDS için katalogda tür aralığı olmadığından değer yalnızca bilgi amaçlı gösterilir. */
export const tdsStatus = informationalStatus;

/** Katalog kayıtları yüklenirken gösterilen etiket. */
export const pendingStatus: ParameterStatus = { label: "…", tone: "neutral" };

/** Türlerin katalog kayıtları yüklenemediğinde sıcaklık ve pH için gösterilen etiket (sayfa ayrıca yeniden deneme sunar). */
export const unavailableStatus: ParameterStatus = { label: "Yüklenemedi", tone: "warning" };

export interface ParameterStatuses { temperature: ParameterStatus; ph: ParameterStatus; nitrate: ParameterStatus; tds: ParameterStatus; specificGravity: ParameterStatus; }

/**
 * Su değeri kartlarının etiketleri. Sıcaklık ve pH akvaryumdaki doğrulanmış türlerin ortak aralığıyla, nitrat motorun su kalitesi
 * kuralıyla karşılaştırılır; TDS ve özgül ağırlık yalnızca bilgi amaçlıdır. Her sayfa aynı kuralı buradan alır.
 * Türlerin katalog kayıtları henüz yoksa (`speciesFor` verilmemiş) ölçülmüş sıcaklık ve pH `unknownRange` etiketini alır (yüklenirken
 * `pendingStatus`, yüklenemediyse `unavailableStatus`); katalog gerektirmeyen etiketler yine hesaplanır.
 */
export function parameterStatuses(animals: Livestock[], speciesFor: ((item: Livestock) => SpeciesProfile | undefined) | undefined, latest: WaterParameters | undefined, type: AquariumType, unknownRange: ParameterStatus = pendingStatus): ParameterStatuses {
  const ranges = speciesFor ? commonSpeciesRanges(animals, speciesFor) : undefined;
  const range = (value: number | undefined, key: "temperature" | "ph") => (value === undefined || ranges ? rangeStatus(value, ranges?.[key]) : unknownRange);
  return {
    temperature: range(latest?.temperature, "temperature"),
    ph: range(latest?.ph, "ph"),
    nitrate: nitrateStatus(latest, type),
    tds: informationalStatus(latest?.tds),
    specificGravity: informationalStatus(latest?.specificGravity),
  };
}

/** En son ölçüm, kayıt sırasına değil ölçüm tarihine göre seçilir (ana sayfa, sağlık sayfası ve akvaryum sayfası aynı kuralı kullanır). */
export function latestReading<T extends Pick<WaterParameters, "measuredAt">>(readings: T[]): T | undefined {
  return [...readings].sort((a, b) => +new Date(b.measuredAt) - +new Date(a.measuredAt))[0];
}

export function healthSummary(analysis: HealthAnalysis, hasData: boolean): { text: string; tone: StatusTone } {
  if (!hasData) return { text: "Durum özeti için canlı ve su ölçümü ekle.", tone: "neutral" };
  if (analysis.status === "danger") return { text: "Sağlık analizi acil ilgilenmen gereken bir durum gösteriyor.", tone: "danger" };
  if (analysis.status === "warning") return { text: "Sağlık analizinde dikkat gerektiren konular var.", tone: "warning" };
  return { text: "Sağlık analizinde öne çıkan bir sorun görünmüyor.", tone: "good" };
}
