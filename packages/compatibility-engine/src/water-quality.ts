// Su kalitesi değerlendirmesi: amonyak, nitrit ve nitrat.
//
// Eşikler: OATA water quality criteria (Ekim 2022),
// https://ornamentalfish.org/wp-content/uploads/OATA-Water-quality-criteria-Oct-2022.pdf
// Serbest (iyonlaşmamış) amonyak oranı: Florida DEP, "Calculation of un-ionized ammonia in
// fresh water" (Rev. 2, 2001; Thurston ve ark. verisi),
// https://floridadep.gov/sites/default/files/5-Unionized-Ammonia-SOP_1.pdf
// Musluk suyu nitrat üst sınırı: İnsani Tüketim Amaçlı Sular Hakkında Yönetmelik,
// Resmî Gazete 17.02.2005, Ek-1 (nitrat 50 mg/L).
//
// Test kiti değerleri mg/L (ppm) kabul edilir; amonyak değeri toplam amonyaktır (NH₃/NH₄⁺).
import type { AquariumType, WaterParameters } from "@aquamind/domain";

export type WaterQualityLevel = "ok" | "warning" | "danger";

/** OATA azami değerleri (mg/L). Acı su için OATA ölçütü olmadığından daha sıkı olan deniz değerleri kullanılır. */
export const WATER_QUALITY_LIMITS: Record<AquariumType, { freeAmmonia: number; nitrite: number }> = {
  freshwater: { freeAmmonia: 0.02, nitrite: 0.2 },
  brackish: { freeAmmonia: 0.01, nitrite: 0.125 },
  saltwater: { freeAmmonia: 0.01, nitrite: 0.125 },
};

/** OATA: tatlı su için "musluk suyunun en fazla 50 mg/L üstü", deniz için "en fazla 100 mg/L". */
export const NITRATE_ABOVE_TAP_LIMIT = 50;
/** Yasal musluk suyu üst sınırı; akvaryumda bunun 50 mg/L üstü OATA sınırının kesin aşıldığını gösterir. */
export const TAP_WATER_NITRATE_LIMIT = 50;
export const MARINE_NITRATE_LIMIT = 100;

/** Toplam amonyağın serbest (zehirli) NH₃ olan kesri. Florida DEP: pKa = 0,0901821 + 2729,92 / (°C + 273,2). */
export function unionizedAmmoniaFraction(ph: number, temperatureC: number): number {
  const pKa = 0.0901821 + 2729.92 / (temperatureC + 273.2);
  return 1 / (Math.pow(10, pKa - ph) + 1);
}

export type WaterQualityParameter = "ammonia" | "nitrite" | "nitrate";

export interface WaterQualityAssessment {
  ammonia?: {
    level: WaterQualityLevel;
    total: number;
    /** Serbest amonyak (mg/L). pH veya sıcaklık yoksa ya da geçersizse en kötü durum olarak toplam amonyağa eşittir. */
    free: number;
    /** pH veya sıcaklık ölçümü eksik ya da geçersiz olduğu için serbest amonyak hesaplanamadı. */
    worstCase: boolean;
    limit: number;
  };
  nitrite?: { level: WaterQualityLevel; value: number; limit: number };
  nitrate?: { level: WaterQualityLevel; value: number };
  /** Girilmiş ama geçersiz (negatif, sayı olmayan veya sonsuz) değerler. Değerlendirilmez ve "uygun" sayılmaz. */
  invalid: WaterQualityParameter[];
}

/** Ölçüm değeri girilmiş mi ve fiziksel olarak mümkün mü (sonlu ve negatif olmayan). */
const isValidReading = (value: number | undefined): value is number => value !== undefined && Number.isFinite(value) && value >= 0;

export function assessWaterQuality(latest: WaterParameters | undefined, type: AquariumType): WaterQualityAssessment {
  const result: WaterQualityAssessment = { invalid: [] };
  if (!latest) return result;
  const limits = WATER_QUALITY_LIMITS[type];
  for (const key of ["ammonia", "nitrite", "nitrate"] as const) {
    if (latest[key] !== undefined && !isValidReading(latest[key])) result.invalid.push(key);
  }

  if (isValidReading(latest.ammonia)) {
    const total = latest.ammonia;
    const measurable = isValidReading(latest.ph) && isValidReading(latest.temperature);
    const free = measurable ? total * unionizedAmmoniaFraction(latest.ph!, latest.temperature!) : total;
    const level: WaterQualityLevel = total <= 0 ? "ok" : free > limits.freeAmmonia ? "danger" : "warning";
    result.ammonia = { level, total, free, worstCase: !measurable, limit: limits.freeAmmonia };
  }

  if (isValidReading(latest.nitrite)) {
    const value = latest.nitrite;
    const level: WaterQualityLevel = value <= 0 ? "ok" : value > limits.nitrite ? "danger" : "warning";
    result.nitrite = { level, value, limit: limits.nitrite };
  }

  if (isValidReading(latest.nitrate)) {
    const value = latest.nitrate;
    const level: WaterQualityLevel =
      type === "saltwater"
        ? value > MARINE_NITRATE_LIMIT ? "danger" : "ok"
        : value > TAP_WATER_NITRATE_LIMIT + NITRATE_ABOVE_TAP_LIMIT ? "danger" : value > NITRATE_ABOVE_TAP_LIMIT ? "warning" : "ok";
    result.nitrate = { level, value };
  }

  return result;
}
