// Deniz akvaryumunun su hedefleri (motor 1.13.0, docs/DECISIONS/0029-tuzlu-su-baslangic-paketi.md, 0030-deniz-suyu-hedefleri.md; 1.16.0, 0041; 1.17.0, 0042).
// Tuzluluk, pH ve KH kaynaklarda türe özgü değildir; deniz akvaryumunun son ölçümü OATA'nın ev akvaryumu kurulum rehberindeki
// hedeflerle karşılaştırılır ("How to set up and maintain a marine aquarium", Eylül 2022). Akvaryumda deniz omurgasızı varsa
// "omurgasızlı", yoksa "yalnız balık" hedefi kullanılır (ürün sahibinin 2026-10-30 kararı: otomatik).
// 1.16.0 (karar 0041): yalnız balıklı hedefin üst sınırı 1.025. Alt sınır (1.017) kurulum rehberinden; üst sınır OATA'nın deniz balığı bakım
// kartlarından (katalogdaki deniz balıklarının bütün grupları 1.020–1.025, Eylül 2022) ve Fishkeeper'ın deniz balığı sayfalarından (1.020–1.025).
// Ciddiyet (ürün sahibinin kararı): hedef dışı sarı uyarı; özgül ağırlık iki hedefin de dışındaysa (1.017'nin altı, 1.026'nın üstü)
// tehlike. 1.17.0 (karar 0042, ürün sahibinin isteği "sınırda dikkat bandı"): güvenli aralığın hemen dışındaki bir okuma basamağı (0,001)
// sarıdır; yalnız balıklı akvaryumda iki uçta (1.016, 1.027), omurgasızlı akvaryumda yalnız üst uçta (1.027). Bant kaynaklı bir değer değildir.
// Sıcaklık türün aralığıyla değerlendirilir; rehberin sıcaklığı ve "türe bağlı" nitrat/fosfat aralıkları yalnız bilgidir.
import type { AquariumType, Livestock, WaterParameters } from "@aquamind/domain";

export type MarineProfile = "fishOnly" | "invertebrates";
export type MarineRowStatus = "ok" | "warning" | "danger" | "missing" | "info";
export type MarineParameter = "specificGravity" | "ph" | "kh" | "nitrate" | "phosphate" | "temperature";

/** OATA kurulum rehberinin hedefleri (yalnız balıklı tuzluluğun üst sınırı OATA bakım kartlarından, 1.16.0). `limit` alanları değerlendirilir; `info` alanları yalnız gösterilir. */
export const MARINE_TARGETS = {
  fishOnly: {
    specificGravity: [1.017, 1.025],
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

/** İki hedefin birleşimi: bunun dışındaki özgül ağırlık OATA'nın hiçbir ev akvaryumu hedefine girmez (kesin tehlikenin metnindeki aralık). */
export const MARINE_SPECIFIC_GRAVITY_SAFE: readonly [number, number] = [1.017, 1.026];

/**
 * Kesin tehlike sınırları (1.17.0, karar 0042); sınırlar dahil sarıdır, dışı kesin tehlikedir. Güvenli aralığın bir okuma basamağı
 * (0,001) dışına kadar olan ölçüm, hedefin hemen dışındadır ve ölçüm payı içindedir: sarı uyarı, genel sonuç en fazla "dikkat".
 * - Yalnız balık: iki uçta (1.016 ve 1.027). Alt sınır rehberin yalnız balık hedefinin (1.017) bir basamak altı.
 * - Omurgasızlı: yalnız üst uçta (1.027). Alt tehlike sınırı (1.017) bu hedefin (1.024) yedi basamak altındadır; aradaki değerler zaten
 *   sarıdır. Kaynaklar omurgasızın tuzluluk değişimine balıktan duyarlı olduğunu yazar; alt uç genişletilmedi.
 * Bant kaynaklı bir sayı değildir; teknik karardır (okuma basamağı ve ölçüm payı, karar 0042).
 */
export const MARINE_SPECIFIC_GRAVITY_DANGER_LIMITS: Readonly<Record<MarineProfile, readonly [number, number]>> = {
  fishOnly: [1.016, 1.027],
  invertebrates: [1.017, 1.027],
};

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
/**
 * Özgül ağırlık karşılaştırmasının payı (1.17.0, karar 0042): yalnız kayan nokta artığını yutar; hesapla gelen sınır değeri
 * (ör. 1,028 − 0,001 = 1,0270000000000001) sınırın kendisi sayılır. Elle girilen ölçümü (form her ondalığa izin verir; 1,0271, 1,02701)
 * başka basamağa taşımaz: kurallar yazıldığı gibi kalır (sınır dahil sarı, dışı kesin tehlike).
 */
const SPECIFIC_GRAVITY_TOLERANCE = 1e-9;
const inSpecificGravityRange = (value: number, [min, max]: readonly [number, number]) => value >= min - SPECIFIC_GRAVITY_TOLERANCE && value <= max + SPECIFIC_GRAVITY_TOLERANCE;

/** Son ölçümün hedeflerle karşılaştırılması. Ölçüm yoksa satırlar "missing" döner. */
export function assessMarineWater(type: AquariumType, animals: Pick<Livestock, "category">[], latest?: WaterParameters): MarineWaterAssessment | undefined {
  const profile = marineProfileFor(type, animals);
  if (!profile) return undefined;
  const rows: MarineRow[] = [];
  const targets = MARINE_TARGETS[profile];
  const sg = latest?.specificGravity;
  if (!valid(sg)) rows.push({ parameter: "specificGravity", status: "missing", min: targets.specificGravity[0], max: targets.specificGravity[1] });
  else rows.push({ parameter: "specificGravity", value: sg, min: targets.specificGravity[0], max: targets.specificGravity[1],
    status: inSpecificGravityRange(sg, targets.specificGravity) ? "ok" : inSpecificGravityRange(sg, MARINE_SPECIFIC_GRAVITY_DANGER_LIMITS[profile]) ? "warning" : "danger" });
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
