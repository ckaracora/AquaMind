// Katalog parçalarının içeriği (docs/DECISIONS/0016-gereken-katalog-kayitlarinin-yuklenmesi.md). Yalnızca sunucuda,
// derleme anında (src/app/catalog-data/**) ve testlerde çalışır; tarayıcı paketine girmez. Ad ve model dizinleri, katalog
// modüllerinin kendi aramalarında kullandığı dizinlerdir; böylece tarayıcıdaki yükleyici aynı sonucu verir.
import { catalogBucketCounts, catalogBucketOf, type CatalogBucketKind, type EquipmentBucket, type EquipmentModelBucket, type SpeciesBucket, type SpeciesNameBucket } from "./catalog-buckets";
import { equipmentCatalog, equipmentModelIndex } from "./catalog-equipment";
import { speciesCatalog, speciesNameIndex } from "./catalog-species";
import { speciesBehavior } from "./species-behavior";

export const catalogBucketNumbers = (kind: CatalogBucketKind) => Array.from({ length: catalogBucketCounts[kind] }, (_, bucket) => bucket);

export function buildSpeciesBucket(bucket: number): SpeciesBucket {
  return speciesCatalog.filter((profile) => catalogBucketOf(profile.id, "species") === bucket)
    .map((profile) => [profile.id, profile, Object.hasOwn(speciesBehavior, profile.id) ? speciesBehavior[profile.id] : null]);
}

export function buildEquipmentBucket(bucket: number): EquipmentBucket {
  return equipmentCatalog.filter((profile) => catalogBucketOf(profile.id, "equipment") === bucket).map((profile) => [profile.id, profile]);
}

export function buildSpeciesNameBucket(bucket: number): SpeciesNameBucket {
  const { scientific, names } = speciesNameIndex();
  const entries = (index: ReadonlyMap<string, number>) => [...index].filter(([key]) => catalogBucketOf(key, "speciesNames") === bucket)
    .map(([key, position]): [string, string, number] => [key, speciesCatalog[position].id, position]);
  return { scientific: entries(scientific), names: entries(names) };
}

export function buildEquipmentModelBucket(bucket: number): EquipmentModelBucket {
  return [...equipmentModelIndex()].filter(([key]) => catalogBucketOf(key, "equipmentModels") === bucket).map(([key, profile]) => [key, profile.id]);
}

/** Yolu verilen parçanın içeriği; testlerde yükleyiciye ağ yerine verilir. */
export function buildCatalogBucket(path: string): unknown {
  const match = /^\/catalog-data\/(species|equipment|species-names|equipment-models)\/(\d+)$/.exec(path);
  if (!match) throw new Error(`Bilinmeyen katalog parçası: ${path}`);
  const bucket = Number(match[2]);
  if (match[1] === "species") return buildSpeciesBucket(bucket);
  if (match[1] === "equipment") return buildEquipmentBucket(bucket);
  if (match[1] === "species-names") return buildSpeciesNameBucket(bucket);
  return buildEquipmentModelBucket(bucket);
}
