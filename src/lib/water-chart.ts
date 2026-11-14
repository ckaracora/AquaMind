// Su değerleri sayfasındaki pH ve sıcaklık grafiği (2026-11-14 sprinti). Girilmeyen değer çizilmez: eskiden boş pH 7, boş sıcaklık 25 °C
// sayılıp uydurma nokta çiziliyordu. Ölçümler eşit aralıkla yan yana dizilir; değeri olan ardışık ölçümler bir çizgi olur, değersiz ölçüm
// çizgide boşluk bırakır, tek başına kalan değer nokta olarak çizilir.
import type { WaterParameters } from "@/types/aquarium";

export interface ChartPoint { x: number; y: number }

/**
 * `readings` eskiden yeniye; `low` ve `high` eksenin alt ve üst değeri. Çizim alanı 100 × 100 birimdir: x 10–90, y 85 (low) – 20 (high).
 * Dönen her parça değeri olan ardışık ölçümlerdir; değer aralık dışındaysa kenara yaslanmaz, olduğu gibi çizilir.
 */
export function chartSegments(readings: readonly WaterParameters[], key: "ph" | "temperature", low: number, high: number): ChartPoint[][] {
  const segments: ChartPoint[][] = [];
  let current: ChartPoint[] = [];
  const step = readings.length > 1 ? 80 / (readings.length - 1) : 0;
  readings.forEach((reading, index) => {
    const value = reading[key];
    if (value === undefined || !Number.isFinite(value)) {
      if (current.length) segments.push(current);
      current = [];
      return;
    }
    current.push({ x: 10 + index * step, y: 85 - ((value - low) / (high - low)) * 65 });
  });
  if (current.length) segments.push(current);
  return segments;
}

/** Grafikte en az iki değer olmalı (ikisi de aynı ölçüde olmak zorunda değil). */
export const chartHasValues = (readings: readonly WaterParameters[]) =>
  readings.filter((reading) => reading.ph !== undefined).length >= 2 || readings.filter((reading) => reading.temperature !== undefined).length >= 2;
