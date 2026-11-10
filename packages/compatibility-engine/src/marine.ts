// Deniz akvaryumunun su hedefleri (motor 1.13.0, docs/DECISIONS/0029-tuzlu-su-baslangic-paketi.md, 0030-deniz-suyu-hedefleri.md).
// Tuzluluk, pH ve KH kaynaklarda türe özgü değildir; deniz akvaryumunun son ölçümü OATA'nın ev akvaryumu kurulum rehberindeki
// hedeflerle karşılaştırılır ("How to set up and maintain a marine aquarium", Eylül 2022). Akvaryumda deniz omurgasızı varsa
// "omurgasızlı", yoksa "yalnız balık" hedefi kullanılır (ürün sahibinin 2026-10-30 kararı: otomatik).
// Ciddiyet (ürün sahibinin kararı): hedef dışı sarı uyarı; özgül ağırlık iki hedefin de dışındaysa (1.017'nin altı, 1.026'nın üstü)
// tehlike. Sıcaklık türün aralığıyla değerlendirilir; rehberin sıcaklığı ve "türe bağlı" nitrat/fosfat aralıkları yalnız bilgidir.
import type { AquariumType, Livestock, WaterParameters } from "@aquamind/domain";

export type MarineProfile = "fishOnly" | "invertebrates";
export type MarineRowStatus = "ok" | "warning" | "danger" | "missing" | "info";
export type MarineParameter = "specificGravity" | "ph" | "kh" | "nitrate" | "phosphate" | "temperature";

/** OATA kurulum rehberinin hedefleri. `limit` alanları değerlendirilir; `info` alanları yalnız gösterilir. */
export const MARINE_TARGETS = {
  fishOnly: {
    specificGravity: [1.017, 1.023],
    ph: [8.0, 8.2],
    nitrateMax: 20,
    temperatureInfo: [24, 27],
  },
  invertebrates: {
    specificGravity: [1.024, 1.026],
    ph: [8.0, 8.2],
    kh: [8, 12],
    nitrateInfo: [5, 10],
    phosphateInfo: [0.04, 0.1],
    temperatureInfo: [24, 26],
  },
} as const;

/** İki hedefin birleşimi: bunun dışındaki özgül ağırlık OATA'nın hiçbir ev akvaryumu hedefine girmez, tehlikedir. */
export const MARINE_SPECIFIC_GRAVITY_SAFE: readonly [number, number] = [1.017, 1.026];

export interface MarineRow {
  parameter: MarineParameter;
  status: MarineRowStatus;
  value?: number;
  min?: number;
  max?: number;
}

export interface MarineWaterAssessment {
  profile: MarineProfile;
  /** Deniz omurgasızı kayıtlı mı (hedefin neden seçildiği). */
  invertebratesPresent: boolean;
  rows: MarineRow[];
}

const valid = (value: number | undefined): value is number => value !== undefined && Number.isFinite(value) && value >= 0;

/**
 * Deniz akvaryumunun hedefi; deniz akvaryumu değilse yok. `animals` o akvaryumun canlılarıdır. Balık olmayan her canlı (karides, salyangoz,
 * öbürleri: anemon, denizyıldızı, mercan) omurgasız sayılır.
 */
export function marineProfileFor(type: AquariumType, animals: Pick<Livestock, "category">[]): MarineProfile | undefined {
  if (type !== "saltwater") return undefined;
  return animals.some((animal) => animal.category !== "fish") ? "invertebrates" : "fishOnly";
}

const inRange = (value: number, [min, max]: readonly [number, number]) => value >= min && value <= max;

/** Son ölçümün hedeflerle karşılaştırılması. Ölçüm yoksa satırlar "missing" döner. */
export function assessMarineWater(type: AquariumType, animals: Pick<Livestock, "category">[], latest?: WaterParameters): MarineWaterAssessment | undefined {
  const profile = marineProfileFor(type, animals);
  if (!profile) return undefined;
  const rows: MarineRow[] = [];
  const targets = MARINE_TARGETS[profile];
  const sg = latest?.specificGravity;
  if (!valid(sg)) rows.push({ parameter: "specificGravity", status: "missing", min: targets.specificGravity[0], max: targets.specificGravity[1] });
  else rows.push({ parameter: "specificGravity", value: sg, min: targets.specificGravity[0], max: targets.specificGravity[1],
    status: inRange(sg, targets.specificGravity) ? "ok" : inRange(sg, MARINE_SPECIFIC_GRAVITY_SAFE) ? "warning" : "danger" });
  const ph = latest?.ph;
  rows.push(valid(ph) ? { parameter: "ph", value: ph, min: targets.ph[0], max: targets.ph[1], status: inRange(ph, targets.ph) ? "ok" : "warning" }
    : { parameter: "ph", status: "missing", min: targets.ph[0], max: targets.ph[1] });
  if (profile === "fishOnly") {
    const nitrate = latest?.nitrate;
    rows.push(valid(nitrate) ? { parameter: "nitrate", value: nitrate, max: MARINE_TARGETS.fishOnly.nitrateMax, status: nitrate <= MARINE_TARGETS.fishOnly.nitrateMax ? "ok" : "warning" }
      : { parameter: "nitrate", status: "missing", max: MARINE_TARGETS.fishOnly.nitrateMax });
  } else {
    const t = MARINE_TARGETS.invertebrates;
    const kh = latest?.kh;
    rows.push(valid(kh) ? { parameter: "kh", value: kh, min: t.kh[0], max: t.kh[1], status: inRange(kh, t.kh) ? "ok" : "warning" }
      : { parameter: "kh", status: "missing", min: t.kh[0], max: t.kh[1] });
    rows.push({ parameter: "nitrate", status: "info", value: valid(latest?.nitrate) ? latest!.nitrate : undefined, min: t.nitrateInfo[0], max: t.nitrateInfo[1] });
    rows.push({ parameter: "phosphate", status: "info", value: valid(latest?.phosphate) ? latest!.phosphate : undefined, min: t.phosphateInfo[0], max: t.phosphateInfo[1] });
  }
  rows.push({ parameter: "temperature", status: "info", value: valid(latest?.temperature) ? latest!.temperature : undefined, min: targets.temperatureInfo[0], max: targets.temperatureInfo[1] });
  return { profile, invertebratesPresent: profile === "invertebrates", rows };
}
