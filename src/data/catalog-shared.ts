// Tür ve ekipman katalog modüllerinin ortak yardımcıları. Modüller ayrı yüklenebilsin diye catalog.ts'den ayrıldı
// (docs/DECISIONS/0015-katalog-modulleri-ve-sayfa-hizi.md). Bu dosya katalog verisi içermez; tarayıcıda yalnızca gereken
// kayıtları yükleyen kod da kullanır (docs/DECISIONS/0016-gereken-katalog-kayitlarinin-yuklenmesi.md).
import type { EquipmentProfile } from "./catalog-equipment";
import type { SpeciesProfile } from "./catalog-species";
export const normalize = (value?: string) => value?.trim().toLocaleLowerCase("tr-TR").replaceAll("ı","i").replace(/\s+/g," ");
export function assertUniqueIds<T extends {id:string}>(label:string,items:T[]){const seen=new Set<string>();for(const item of items){if(seen.has(item.id))throw new Error(`${label} kataloğunda yinelenen kimlik: ${item.id}`);seen.add(item.id)}}
export const isVerifiedSpeciesProfile = (profile?: SpeciesProfile): profile is SpeciesProfile => Boolean(profile?.sourceUrl&&profile?.verifiedAt);
export const isVerifiedEquipmentProfile = (profile?: EquipmentProfile): profile is EquipmentProfile => Boolean(profile?.sourceUrl&&profile?.verifiedAt&&!profile.specifications.toLocaleLowerCase("tr-TR").includes("doğrulama bekliyor"));
// Bir türün aramada ve ad eşlemesinde kullanılan adları (Türkçe ad, bilimsel ad, eş adlar), `normalize` ile biçimlendirilmiş.
export const speciesNameKeys = (profile: SpeciesProfile) => [normalize(profile.commonName) ?? "", normalize(profile.scientificName) ?? "", ...(profile.aliases ?? []).map((alias) => normalize(alias) ?? "")];
/** Ad eşlemesinde bir adın gösterdiği tür: kimliği ve bütün adları (`speciesNameKeys`). */
export interface SpeciesNameCandidate { id: string; names: readonly string[] }
/**
 * Katalog kimliği olmayan ya da kimliği katalogda bulunmayan canlı kaydının ad eşlemesi (2026-11-14, kural 3; docs/DECISIONS/0044 ek).
 * Tam katalog (`speciesForLivestock`) ve parça yükleyici (`loadCatalogSlice`) aynı kuralı kullanır. `scientific` kaydın bilimsel adının
 * bilimsel ad dizininde, `common` ortak adının ad dizininde (Türkçe ad ve eş adlar) gösterdiği türdür.
 * - Yalnız bir ad yazılıysa o adın türü (bugünkü davranış).
 * - İki ad da aynı türü gösteriyorsa ya da ortak ad bilimsel adın türünün adlarından biriyse o tür; bilimsel ad tanınıyor, ortak ad
 *   hiçbir türün adı değilse (kullanıcının kendi verdiği ad) yine bilimsel adın türü.
 * - Bilimsel ad bir türü, ortak ad başka bir türü gösteriyorsa ya da bilimsel ad tanınmıyor ama ortak ad bir türün adıysa kayıt çözülmez:
 *   motor onu tanınmayan canlı (`unknownAnimal`) sayar ve analizi eksik (`incomplete`) işaretler. Tanınmayan bilimsel ad ortak adın türünün
 *   eş adıysa (ör. eski bilimsel ad) kayıt o türdür.
 */
export function speciesIdForNames(scientificKey: string | undefined, commonKey: string | undefined, scientific: SpeciesNameCandidate | undefined, common: SpeciesNameCandidate | undefined): string | undefined {
  if (!scientificKey) return commonKey ? common?.id : undefined;
  if (!commonKey) return scientific?.id;
  if (scientific) return !common || common.id === scientific.id || scientific.names.includes(commonKey) ? scientific.id : undefined;
  return common?.names.includes(scientificKey) ? common.id : undefined;
}
// Katalog kimliği olmayan ekipman marka ve model adıyla eşlenir; anahtar biçimlendirilmiş iki adı ayırıcıyla birleştirir.
export const brandModelKey = (brand: string, model: string) => `${brand}\u0000${model}`;

/** Yeniden doğrulama tablosunun adressiz kopyası (src/data/catalog-reverified.ts'ten üretilir): okuma günü ve o gün doğrulanan kimlikler. */
export type ReverifiedDates = readonly (readonly [readAt: string, ids: readonly string[]])[];
/**
 * Yeniden okunan kayıtların `verifiedAt` alanını okuma gününe çeker (docs/DATA_SOURCES.md → "Yeniden doğrulama tablosu"). Tarih yalnız ileri
 * gider: kaydın kendi günü daha yeniyse o kalır. Katalogda bulunmayan kimlikleri döndürür; katalog modülü bunlarda her ortamda hata verir.
 */
export function applyReverifiedDates<T extends { id: string; verifiedAt?: string }>(catalog: readonly T[], dates: ReverifiedDates): string[] {
  const byId = new Map(catalog.map((item) => [item.id, item]));
  const missingIds: string[] = [];
  for (const [readAt, ids] of dates) {
    for (const id of ids) {
      const item = byId.get(id);
      if (!item) missingIds.push(id);
      else if ((item.verifiedAt ?? "") < readAt) item.verifiedAt = readAt;
    }
  }
  return missingIds;
}

/**
 * Kaynağa karşı yeniden okunurken adresi değişen kayıtlar (docs/DATA_SOURCES.md → "Yeniden doğrulama tablosu"): kayıt liste, kategori ya da
 * başka boyun sayfasına bağlıydı, ya da eski adres artık açılmıyor veya başka sayfaya yönleniyor. `sourceUrl` modelin kendi sayfası olur; eski
 * adres kaynak izi olarak `additionalSourceUrls`'e geçer (AGENTS.md, "Kaynak bilgisini kaybetme"), nedeni docs/CATALOG_LOG.md'de yazılır.
 * `addSourceUrls` aynı okumada kullanılan ek kaynaktır.
 */
export type ReverifiedSources = Readonly<Record<string, { readonly sourceUrl?: string; readonly addSourceUrls?: readonly string[] }>>;
/**
 * Yeni kaynak adreslerini yazar; eski ana adresi ek kaynakların sonuna ekler, yeni ana adres ek kaynaklarda da geçiyorsa oradan çıkar.
 * Katalogda bulunmayan kimlikleri döndürür.
 */
export function applyReverifiedSources<T extends { id: string; sourceUrl?: string; additionalSourceUrls?: string[] }>(catalog: readonly T[], sources: ReverifiedSources): string[] {
  const byId = new Map(catalog.map((item) => [item.id, item]));
  const missingIds: string[] = [];
  for (const [id, { sourceUrl, addSourceUrls }] of Object.entries(sources)) {
    const item = byId.get(id);
    if (!item) {
      missingIds.push(id);
      continue;
    }
    const previousUrl = item.sourceUrl;
    if (sourceUrl) item.sourceUrl = sourceUrl;
    const additional = [...(item.additionalSourceUrls ?? []), ...(addSourceUrls ?? []), ...(previousUrl ? [previousUrl] : [])].filter((url, index, all) => url !== item.sourceUrl && all.indexOf(url) === index);
    if (additional.length) item.additionalSourceUrls = additional;
    else if ("additionalSourceUrls" in item) delete item.additionalSourceUrls;
  }
  return missingIds;
}
