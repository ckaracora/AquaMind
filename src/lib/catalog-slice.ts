// Bir akvaryumun analizi için yalnızca gereken katalog kayıtlarını yükler (docs/DECISIONS/0016-gereken-katalog-kayitlarinin-yuklenmesi.md).
// Katalog verisi içermez: kayıtlar derleme anında üretilen parçalardan (src/app/catalog-data/**) istenir. Eşleme kuralları katalog
// modüllerindeki `speciesForLivestock` ve `profileForEquipment` ile aynıdır:
// - katalog kimliği varsa ve katalogda bulunuyorsa o kayıt;
// - yoksa canlıda bilimsel ad ya da ortak ad/eş ad eşleşmesi (iki ad çelişiyorsa ya da bilimsel ad tanınmıyorsa çözülmez; kural
//   `speciesIdForNames`, 2026-11-14), ekipmanda marka + model.
// Ekipmanda birleştirilip kaldırılan eski kimlik (`formerIds`) ve eş ad (`aliases`) parçalara yazılır (src/data/catalog-bucket-builders.ts): eski
// kimlik kendi parçasında birleştirildiği kaydın profiliyle, eş ad marka/model dizininde o kaydın kimliğiyle durur. Yükleyici bunları ayrıca
// çözmez; kullanıcı kaydı değişmeden okuma anında birleştirilen kayıtla hesaplanır (2026-11-11, JBL PROTEMP S).
import { catalogBucketOf, catalogBucketPath, type CatalogBucketKind, type EquipmentBucket, type EquipmentModelBucket, type SpeciesBucket, type SpeciesNameBucket } from "@/data/catalog-buckets";
import type { EquipmentProfile } from "@/data/catalog-equipment";
import { brandModelKey, normalize, speciesIdForNames, speciesNameKeys } from "@/data/catalog-shared";
import type { SpeciesProfile } from "@/data/catalog-species";
import type { BehaviorRecord } from "@/data/species-behavior";
import type { CatalogLookup } from "@/lib/health-analysis-core";
import type { Equipment, Livestock } from "@/types/aquarium";

export type FetchCatalogJson = (path: string) => Promise<unknown>;

const fetchFromNetwork: FetchCatalogJson = async (path) => {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Katalog parçası alınamadı: ${path} (${response.status})`);
  return response.json();
};

// Parçalar sayfa açık kaldıkça bellekte tutulur; başarısız istek önbellekten çıkarılır ki yeniden denenebilsin.
const cachesByFetcher = new WeakMap<FetchCatalogJson, Map<string, Promise<unknown>>>();
function cachedFetch(fetchJson: FetchCatalogJson): FetchCatalogJson {
  let cache = cachesByFetcher.get(fetchJson);
  if (!cache) cachesByFetcher.set(fetchJson, cache = new Map());
  const bucketCache = cache;
  return (path) => {
    let request = bucketCache.get(path);
    if (!request) {
      request = fetchJson(path).catch((error: unknown) => { bucketCache.delete(path); throw error; });
      bucketCache.set(path, request);
    }
    return request;
  };
}

const isDefined = <T,>(value: T | undefined): value is T => value !== undefined;
const unique = <T,>(values: T[]) => [...new Set(values)];

export async function loadCatalogSlice(animals: Livestock[], equipment: Equipment[], fetchJson: FetchCatalogJson = fetchFromNetwork): Promise<CatalogLookup> {
  const get = cachedFetch(fetchJson);
  const loaded: Record<CatalogBucketKind, Set<number>> = { species: new Set(), equipment: new Set(), speciesNames: new Set(), equipmentModels: new Set() };
  const species = new Map<string, { profile: SpeciesProfile; behavior?: BehaviorRecord[] }>();
  const devices = new Map<string, EquipmentProfile>();
  const scientificIndex = new Map<string, [string, number]>(), nameIndex = new Map<string, [string, number]>(), modelIndex = new Map<string, string>();

  async function load<T>(kind: CatalogBucketKind, keys: string[], store: (bucket: T) => void) {
    const buckets = unique(keys.map((key) => catalogBucketOf(key, kind))).filter((bucket) => !loaded[kind].has(bucket));
    const contents = await Promise.all(buckets.map((bucket) => get(catalogBucketPath(kind, bucket)) as Promise<T>));
    contents.forEach((content, index) => { store(content); loaded[kind].add(buckets[index]); });
  }
  const loadSpecies = (ids: string[]) => load<SpeciesBucket>("species", ids, (bucket) => {
    for (const [id, profile, behavior] of bucket) if (!species.has(id)) species.set(id, { profile, ...(behavior ? { behavior } : {}) });
  });
  const loadEquipment = (ids: string[]) => load<EquipmentBucket>("equipment", ids, (bucket) => {
    for (const [id, profile] of bucket) if (!devices.has(id)) devices.set(id, profile);
  });
  const loadNames = (keys: string[]) => load<SpeciesNameBucket>("speciesNames", keys, (bucket) => {
    for (const [key, id, position] of bucket.scientific) scientificIndex.set(key, [id, position]);
    for (const [key, id, position] of bucket.names) nameIndex.set(key, [id, position]);
  });
  const loadModels = (keys: string[]) => load<EquipmentModelBucket>("equipmentModels", keys, (bucket) => {
    for (const [key, id] of bucket) modelIndex.set(key, id);
  });

  // Yüklenmemiş bir parçaya bakılırsa sessizce "bulunamadı" denmez; bu bir programlama hatasıdır.
  const requireLoaded = (kind: CatalogBucketKind, key: string) => {
    if (!loaded[kind].has(catalogBucketOf(key, kind))) throw new Error(`Katalog parçası yüklenmeden arandı: ${kind} / ${key}`);
  };
  const speciesById = (id: string) => { requireLoaded("species", id); return species.get(id); };
  const equipmentById = (id: string) => { requireLoaded("equipment", id); return devices.get(id); };
  const speciesKeys = (item: Livestock) => [normalize(item.scientificName), normalize(item.commonName)] as const;
  // Ad kuralı yalnız bilimsel adayın adlarını, bilimsel aday yoksa ortak ad adayının adlarını okur.
  // İki farklı aday bulunduğunda ortak ad adayının profilini ayrıca indirmek gerekmez.
  const nameCandidateIds = (item: Livestock) => speciesKeys(item).map((key, index) => {
    if (!key) return undefined;
    requireLoaded("speciesNames", key);
    return (index === 0 ? scientificIndex : nameIndex).get(key)?.[0];
  });
  const fallbackSpeciesId = (item: Livestock) => {
    const [scientificName, commonName] = speciesKeys(item);
    const [scientificCandidate, commonCandidate] = nameCandidateIds(item);
    const candidate = (id: string | undefined) => {
      const profile = id === undefined ? undefined : speciesById(id)?.profile;
      return profile && id !== undefined ? { id, names: speciesNameKeys(profile) } : undefined;
    };
    const scientific = candidate(scientificCandidate);
    const common = commonCandidate === undefined ? undefined : scientific
      ? { id: commonCandidate, names: [] } : candidate(commonCandidate);
    return speciesIdForNames(scientificName, commonName, scientific, common);
  };
  const equipmentKey = (item: Equipment) => {
    const brand = normalize(item.brand), model = normalize(item.model);
    return brand === undefined || model === undefined ? undefined : brandModelKey(brand, model);
  };
  const fallbackEquipmentId = (item: Equipment) => {
    const key = equipmentKey(item);
    if (key === undefined) return undefined;
    requireLoaded("equipmentModels", key);
    return modelIndex.get(key);
  };

  // 1. Katalog kimliği olan kayıtlar.
  await Promise.all([loadSpecies(animals.map((item) => item.catalogId).filter(isDefined)), loadEquipment(equipment.map((item) => item.catalogId).filter(isDefined))]);
  // 2. Kimliği olmayan ya da katalogda bulunmayanlar için ad ve model dizinleri.
  const unmatchedAnimals = animals.filter((item) => item.catalogId === undefined || !species.has(item.catalogId));
  const unmatchedEquipment = equipment.filter((item) => item.catalogId === undefined || !devices.has(item.catalogId));
  await Promise.all([loadNames(unmatchedAnimals.flatMap(speciesKeys).filter((key): key is string => Boolean(key))), loadModels(unmatchedEquipment.map(equipmentKey).filter(isDefined))]);
  // 3. Dizinden bulunan kayıtlar.
  await Promise.all([loadSpecies(unmatchedAnimals.map((item) => nameCandidateIds(item).find(isDefined)).filter(isDefined)), loadEquipment(unmatchedEquipment.map(fallbackEquipmentId).filter(isDefined))]);

  return {
    speciesForLivestock(item) {
      const direct = item.catalogId === undefined ? undefined : speciesById(item.catalogId);
      if (direct) return direct.profile;
      const id = fallbackSpeciesId(item);
      return id === undefined ? undefined : speciesById(id)?.profile;
    },
    behaviorFor(id) {
      return speciesById(id)?.behavior;
    },
    profileForEquipment(item) {
      const direct = item.catalogId === undefined ? undefined : equipmentById(item.catalogId);
      if (direct) return direct;
      const id = fallbackEquipmentId(item);
      return id === undefined ? undefined : equipmentById(id);
    },
  };
}
