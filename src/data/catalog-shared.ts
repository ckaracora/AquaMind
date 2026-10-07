// Tür ve ekipman katalog modüllerinin ortak yardımcıları. Modüller ayrı yüklenebilsin diye catalog.ts'den ayrıldı
// (docs/DECISIONS/0015-katalog-modulleri-ve-sayfa-hizi.md).
export const normalize = (value?: string) => value?.trim().toLocaleLowerCase("tr-TR").replaceAll("ı","i").replace(/\s+/g," ");
export function assertUniqueIds<T extends {id:string}>(label:string,items:T[]){const seen=new Set<string>();for(const item of items){if(seen.has(item.id))throw new Error(`${label} kataloğunda yinelenen kimlik: ${item.id}`);seen.add(item.id)}}
