// Tür ve ekipman katalog modüllerinin ortak yardımcıları. Modüller ayrı yüklenebilsin diye catalog.ts'den ayrıldı
// (docs/DECISIONS/0015-katalog-modulleri-ve-sayfa-hizi.md). Bu dosya katalog verisi içermez; tarayıcıda yalnızca gereken
// kayıtları yükleyen kod da kullanır (docs/DECISIONS/0016-gereken-katalog-kayitlarinin-yuklenmesi.md).
import type { EquipmentProfile } from "./catalog-equipment";
import type { SpeciesProfile } from "./catalog-species";
export const normalize = (value?: string) => value?.trim().toLocaleLowerCase("tr-TR").replaceAll("ı","i").replace(/\s+/g," ");
export function assertUniqueIds<T extends {id:string}>(label:string,items:T[]){const seen=new Set<string>();for(const item of items){if(seen.has(item.id))throw new Error(`${label} kataloğunda yinelenen kimlik: ${item.id}`);seen.add(item.id)}}
export const isVerifiedSpeciesProfile = (profile?: SpeciesProfile): profile is SpeciesProfile => Boolean(profile?.sourceUrl&&profile?.verifiedAt);
export const isVerifiedEquipmentProfile = (profile?: EquipmentProfile): profile is EquipmentProfile => Boolean(profile?.sourceUrl&&profile?.verifiedAt&&!profile.specifications.toLocaleLowerCase("tr-TR").includes("doğrulama bekliyor"));
// Katalog kimliği olmayan ekipman marka ve model adıyla eşlenir; anahtar biçimlendirilmiş iki adı ayırıcıyla birleştirir.
export const brandModelKey = (brand: string, model: string) => `${brand}\u0000${model}`;
