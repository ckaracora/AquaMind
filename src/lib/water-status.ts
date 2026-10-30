// Su değeri kartları (ana sayfa, akvaryum sayfası, su değerleri sayfası) ve ana sayfanın özet cümlesi. Etiketler sabit yazılmaz;
// son ölçüm, akvaryumdaki türlerin katalog aralıkları ve uyumluluk motorunun sonucundan hesaplanır. Fonksiyonlar metin değil anahtar
// döndürür; ekran metni dil dosyasından alır (`t.waterStatus[key]`, `t.healthSummary[key]`; docs/DECISIONS/0021-dil-altyapisi.md).
import { assessMarineWater, assessWaterQuality, type HealthAnalysis, type MarineRow } from "@aquamind/compatibility-engine";
import type { Messages } from "@aquamind/localization";
import { isVerifiedSpeciesProfile } from "@/data/catalog-shared";
import type { SpeciesProfile } from "@/data/catalog-species";
import type { AquariumType, Livestock, WaterParameters } from "@/types/aquarium";

export type StatusTone = "good" | "warning" | "danger" | "neutral";
export type WaterStatusKey = keyof Messages["waterStatus"];
export type HealthSummaryKey = keyof Messages["healthSummary"];
export interface ParameterStatus { key: WaterStatusKey; tone: StatusTone; }

/**
 * Doğrulanmış türlerin ortak sıcaklık ve pH aralığı. Kesişim yoksa alt sınır üst sınırdan büyük olur.
 * Türler verilen eşleme fonksiyonuyla bulunur (tam katalog ya da yalnızca gereken parçalar; docs/DECISIONS/0016-gereken-katalog-kayitlarinin-yuklenmesi.md).
 */
export function commonSpeciesRanges(animals: Livestock[], speciesFor: (item: Livestock) => SpeciesProfile | undefined): { temperature?: [number, number]; ph?: [number, number] } {
  const profiles = animals.map((item) => speciesFor(item)).filter(isVerifiedSpeciesProfile);
  if (!profiles.length) return {};
  const common = (ranges: [number, number][]): [number, number] | undefined =>
    ranges.length ? [Math.max(...ranges.map((range) => range[0])), Math.min(...ranges.map((range) => range[1]))] : undefined;
  // Deniz canlılarının pH aralığı yoktur (karar 0029); pH yalnız aralığı olan türlerle hesaplanır.
  return { temperature: common(profiles.map((profile) => profile.temperature)), ph: common(profiles.flatMap((profile) => (profile.ph ? [profile.ph] : []))) };
}

export function rangeStatus(value: number | undefined, range: [number, number] | undefined): ParameterStatus {
  if (value === undefined) return { key: "noReading", tone: "neutral" };
  if (!range) return { key: "noSpeciesData", tone: "neutral" };
  if (range[0] > range[1]) return { key: "speciesConflict", tone: "danger" };
  return value >= range[0] && value <= range[1] ? { key: "inRange", tone: "good" } : { key: "outOfRange", tone: "danger" };
}

export function nitrateStatus(latest: WaterParameters | undefined, type: AquariumType): ParameterStatus {
  const { nitrate, invalid } = assessWaterQuality(latest, type);
  if (invalid.includes("nitrate")) return { key: "invalidReading", tone: "warning" };
  if (!nitrate) return { key: "noReading", tone: "neutral" };
  if (nitrate.level === "danger") return { key: "veryHigh", tone: "danger" };
  if (nitrate.level === "warning") return { key: "mayBeHigh", tone: "warning" };
  return { key: "inRange", tone: "good" };
}

/** Katalogda tür aralığı olmayan değerler (TDS, özgül ağırlık) yalnızca bilgi amaçlı gösterilir. */
export function informationalStatus(value: number | undefined): ParameterStatus {
  return value === undefined ? { key: "noReading", tone: "neutral" } : { key: "informational", tone: "neutral" };
}

/** TDS için katalogda tür aralığı olmadığından değer yalnızca bilgi amaçlı gösterilir. */
export const tdsStatus = informationalStatus;

/** Katalog kayıtları yüklenirken gösterilen etiket. */
export const pendingStatus: ParameterStatus = { key: "pending", tone: "neutral" };

/** Türlerin katalog kayıtları yüklenemediğinde sıcaklık ve pH için gösterilen etiket (sayfa ayrıca yeniden deneme sunar). */
export const unavailableStatus: ParameterStatus = { key: "unavailable", tone: "warning" };

export interface ParameterStatuses { temperature: ParameterStatus; ph: ParameterStatus; nitrate: ParameterStatus; tds: ParameterStatus; specificGravity: ParameterStatus; }

/** Deniz akvaryumunun hedef satırının etiketi (motorun `assessMarineWater` sonucu; OATA hedefi). */
export function marineRowStatus(row: MarineRow | undefined): ParameterStatus | undefined {
  if (!row || row.status === "info") return undefined;
  if (row.status === "missing") return { key: "noReading", tone: "neutral" };
  if (row.status === "ok") return { key: "inTarget", tone: "good" };
  return { key: "outOfTarget", tone: row.status === "danger" ? "danger" : "warning" };
}

/**
 * Su değeri kartlarının etiketleri. Sıcaklık ve pH akvaryumdaki doğrulanmış türlerin ortak aralığıyla, nitrat motorun su kalitesi
 * kuralıyla karşılaştırılır; TDS ve özgül ağırlık yalnızca bilgi amaçlıdır. Deniz akvaryumunda pH ve özgül ağırlık (yalnız balıklı
 * akvaryumda nitrat da) OATA'nın hedefiyle karşılaştırılır (motor 1.13.0, karar 0029); 100 mg/L'nin üstündeki nitrat yine "çok yüksek".
 * Her sayfa aynı kuralı buradan alır.
 * Türlerin katalog kayıtları henüz yoksa (`speciesFor` verilmemiş) ölçülmüş sıcaklık ve pH `unknownRange` etiketini alır (yüklenirken
 * `pendingStatus`, yüklenemediyse `unavailableStatus`); katalog gerektirmeyen etiketler yine hesaplanır.
 */
export function parameterStatuses(animals: Livestock[], speciesFor: ((item: Livestock) => SpeciesProfile | undefined) | undefined, latest: WaterParameters | undefined, type: AquariumType, unknownRange: ParameterStatus = pendingStatus): ParameterStatuses {
  const ranges = speciesFor ? commonSpeciesRanges(animals, speciesFor) : undefined;
  const range = (value: number | undefined, key: "temperature" | "ph") => (value === undefined || ranges ? rangeStatus(value, ranges?.[key]) : unknownRange);
  const marine = assessMarineWater(type, animals, latest);
  const row = (parameter: MarineRow["parameter"]) => marineRowStatus(marine?.rows.find((item) => item.parameter === parameter));
  const nitrate = nitrateStatus(latest, type);
  return {
    temperature: range(latest?.temperature, "temperature"),
    ph: row("ph") ?? range(latest?.ph, "ph"),
    nitrate: nitrate.tone === "danger" || nitrate.key === "invalidReading" ? nitrate : row("nitrate") ?? nitrate,
    tds: informationalStatus(latest?.tds),
    specificGravity: row("specificGravity") ?? informationalStatus(latest?.specificGravity),
  };
}

/** En son ölçüm, kayıt sırasına değil ölçüm tarihine göre seçilir (ana sayfa, sağlık sayfası ve akvaryum sayfası aynı kuralı kullanır). */
export function latestReading<T extends Pick<WaterParameters, "measuredAt">>(readings: T[]): T | undefined {
  return [...readings].sort((a, b) => +new Date(b.measuredAt) - +new Date(a.measuredAt))[0];
}

export function healthSummary(analysis: HealthAnalysis, hasData: boolean): { key: HealthSummaryKey; tone: StatusTone } {
  if (!hasData) return { key: "noData", tone: "neutral" };
  if (analysis.status === "danger") return { key: "danger", tone: "danger" };
  if (analysis.status === "warning") return { key: "warning", tone: "warning" };
  return { key: "good", tone: "good" };
}
