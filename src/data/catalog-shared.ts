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
