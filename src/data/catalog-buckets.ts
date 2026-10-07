// Sağlık analizi ve ana sayfa durumu yalnızca gereken katalog kayıtlarını indirsin diye katalog sabit sayıda parçaya
// bölünür (docs/DECISIONS/0016-gereken-katalog-kayitlarinin-yuklenmesi.md). Bir kaydın parçası, kimliğinin ya da
// biçimlendirilmiş adının özetinden (FNV-1a) hesaplanır. Parçaları derleme anında üreten yanıtlar
// (src/app/catalog-data/**) ve tarayıcıdaki yükleyici (src/lib/catalog-slice.ts) aynı fonksiyonu kullanır.
// Bu dosya katalog verisi içermez; yalnızca tip içe aktarır.
import type { EquipmentProfile } from "./catalog-equipment";
import type { SpeciesProfile } from "./catalog-species";
import type { BehaviorRecord } from "./species-behavior";

export const catalogBucketCounts = { species: 32, equipment: 64, speciesNames: 16, equipmentModels: 32 } as const;
export type CatalogBucketKind = keyof typeof catalogBucketCounts;

const pathSegments: Record<CatalogBucketKind, string> = { species: "species", equipment: "equipment", speciesNames: "species-names", equipmentModels: "equipment-models" };

/** Anahtarın (kimlik ya da biçimlendirilmiş ad) parça numarası: 32 bit FNV-1a özetinin parça sayısına göre kalanı. */
export function catalogBucketOf(key: string, kind: CatalogBucketKind): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < key.length; index++) {
    hash ^= key.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash % catalogBucketCounts[kind];
}

export const catalogBucketPath = (kind: CatalogBucketKind, bucket: number) => `/catalog-data/${pathSegments[kind]}/${bucket}`;

// JSON biçimleri. Nesne yerine dizi kullanılır; böylece "constructor" gibi bir ad, nesnenin kendi özelliğiyle karışmaz.
/** Canlı parçası: [kimlik, profil, davranış kayıtları ya da null], katalog sırasıyla. */
export type SpeciesBucket = [id: string, profile: SpeciesProfile, behavior: BehaviorRecord[] | null][];
/** Ekipman parçası: [kimlik, profil], katalog sırasıyla. */
export type EquipmentBucket = [id: string, profile: EquipmentProfile][];
/** Canlı ad dizini parçası: biçimlendirilmiş ad → [kimlik, katalogdaki sıra]; bilimsel ad ve ortak ad/eş ad ayrı. */
export interface SpeciesNameBucket { scientific: [key: string, id: string, position: number][]; names: [key: string, id: string, position: number][] }
/** Ekipman marka/model dizini parçası: marka/model anahtarı → kimlik. */
export type EquipmentModelBucket = [key: string, id: string][];
