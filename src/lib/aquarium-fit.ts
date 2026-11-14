// "Bu akvaryuma ne uyar?" (veri sprinti F, 2026-11-14). Yeni kural yoktur: her aday tür, canlı seçme penceresindeki gibi (src/lib/selection-warnings.ts)
// bu akvaryumun canlıları, ekipmanı ve son ölçümüyle bir kez sağlık analizine eklenir; adayla yeni çıkan uyarı yoksa tür listelenir. Motorun
// sonucu, puanı ve hükmü değişmez. Bu dosya katalog verisi içermez: adaylar, davranış kayıtları ve katalog araması çağırandan gelir (pencere
// bunları açılınca `import()` ile yükler; sağlık sayfasının ilk yüklemesine girmez, karar 0016).
//
// Koruyucu kurallar (ürün sahibinin onayı, 2026-11-14):
// - Yalnız davranışı kaynakta açıkça yazan türler önerilir (başka canlılarla ilgili en az bir açık kaynaklı davranış kaydı: risk kaydı ya da
//   "barışçıl"; bkz. `behaviorDocumented`). Kaydı olmayan ya da yalnız çelişkili kaydı olan tür önerilmez; kayıt olmaması "sorun yok" demek değildir.
// - Doğrulanmış katalog kaydı olmayan, bu su türüne uymayan ve akvaryumda zaten bulunan tür önerilmez.
// - Aday türün kaynaktaki en az grup sayısıyla eklenir ("8 adet"); grup, alan ve hacim de o adetle hesaplanır.
// - Seçme penceresinin gösterdiği uyarılara ek olarak alan ve grup uyarıları (pencere bunları kendi kutusunda yazar), su türü uyumsuzluğu, tek
//   değerde buluşan sıcaklık ve ısıtıcı eksikliği de türü listeden çıkarır. Bilgi notları (bakım ve topluluk notu), kayıt ve ekipman
//   kapasitesi uyarıları çıkarmaz.
// - Bir uyarı, kodu ve değerleri adaysız analizde aynen yoksa "yeni" sayılır (seçme penceresiyle aynı karşılaştırma). Listede çıkan tür seçme
//   penceresinde seçilince canlı riski uyarısı göstermez.
import { LIVESTOCK_RISK_WARNING_CODES, type HealthWarning } from "@aquamind/compatibility-engine";
import { isVerifiedSpeciesProfile } from "@/data/catalog-shared";
import type { SpeciesProfile } from "@/data/catalog-species";
import type { BehaviorRecord } from "@/data/species-behavior";
import { createHealthAnalyzer, type CatalogLookup } from "@/lib/health-analysis-core";
import { SELECTION_WARNING_CODES } from "@/lib/selection-warnings";
import type { Aquarium, Equipment, Livestock, WaterParameters } from "@/types/aquarium";

/** Listenin sınıfları (filtre düğmeleri); "diğer" (kurbağa, kerevit, yengeç…) listelenmez. */
export const FIT_CATEGORIES = ["fish", "shrimp", "snail"] as const;
export type FitCategory = (typeof FIT_CATEGORIES)[number];
/** Bir seferde gösterilen en çok tür; fazlası "Daha fazla göster" ile açılır. */
export const FIT_PAGE_SIZE = 30;

/** Adayla yeni çıkınca türü listeden çıkaran uyarı kodları. */
export const FIT_BLOCKING_CODES: ReadonlySet<string> = new Set([
  ...SELECTION_WARNING_CODES, ...LIVESTOCK_RISK_WARNING_CODES, "habitatMismatch", "temperatureRangeNarrow", "heaterMissing",
]);

/**
 * Davranışı kaynakta açıkça yazıyor mu: başka canlılarla ilgili en az bir açık kaynaklı kayıt (risk kaydı, "barışçıl", "karidesle tutulabilir",
 * "asıl avcı değil"). Çelişkili kayıt sayılmaz. Yalnız kendi türüne saldırganlık kaydı da sayılmaz: başka canlılarla uyumu söylemez; motor da
 * böyle bir türü "davranışı bilinmiyor" sayar (karar 0043, `behaviorKnown`).
 */
export const behaviorDocumented = (records: readonly BehaviorRecord[] | undefined): boolean => Boolean(records?.some((record) => record.confidence === "explicit" && record.flag !== "conspecificAggression"));

export interface FitEntry { profile: SpeciesProfile; quantity: number }
export interface FitResult {
  /** Uyan türler, aday listesinin (katalog) sırasıyla. */
  fits: FitEntry[];
  /** Yalnız ısıtıcı kayıtlı olmadığı için listeye girmeyen tropikal türler (dürüst not için sınıf başına sayı). */
  heaterOnly: Record<FitCategory, number>;
}

export interface FitInput {
  /** Akvaryumun canlıları, aday türler ve ekipmanı için katalog araması (aday kayıtlarının `catalogId` değeri adayın kimliğidir). */
  lookup: CatalogLookup;
  aquarium: Aquarium;
  animals: Livestock[];
  devices: Equipment[];
  latest: WaterParameters | undefined;
  candidates: readonly SpeciesProfile[];
}

const warningKey = (warning: HealthWarning) => `${warning.code}|${JSON.stringify(warning.params)}`;
const isFitCategory = (category: Livestock["category"]): category is FitCategory => (FIT_CATEGORIES as readonly string[]).includes(category);
const waterTypesOf = (profile: SpeciesProfile) => profile.waterTypes ?? ["freshwater"];

/** Aday türün analize eklenen kaydı (kaydedilmez). */
export function fitCandidate(aquarium: Aquarium, profile: SpeciesProfile): Livestock {
  return { id: `fit-candidate-${profile.id}`, aquariumId: aquarium.id, catalogId: profile.id, commonName: profile.commonName, scientificName: profile.scientificName, category: profile.category, quantity: profile.minGroup, gender: "unknown", addedAt: "2000-01-01" };
}

export function speciesFittingAquarium({ lookup, aquarium, animals, devices, latest, candidates }: FitInput): FitResult {
  const analyze = createHealthAnalyzer(lookup);
  const before = new Set(analyze(aquarium, animals, devices, latest).warnings.map(warningKey));
  const present = new Set(animals.map((item) => lookup.speciesForLivestock(item)?.id).filter((id): id is string => id !== undefined));
  const fits: FitEntry[] = [];
  const heaterOnly: Record<FitCategory, number> = { fish: 0, shrimp: 0, snail: 0 };
  for (const profile of candidates) {
    if (!isFitCategory(profile.category) || !waterTypesOf(profile).includes(aquarium.type) || !isVerifiedSpeciesProfile(profile) || present.has(profile.id)) continue;
    if (!behaviorDocumented(lookup.behaviorFor(profile.id))) continue;
    const candidate = fitCandidate(aquarium, profile);
    const blocking = analyze(aquarium, [...animals, candidate], devices, latest).warnings
      .filter((warning) => FIT_BLOCKING_CODES.has(warning.code) && !before.has(warningKey(warning)));
    if (!blocking.length) fits.push({ profile, quantity: candidate.quantity });
    else if (blocking.every((warning) => warning.code === "heaterMissing")) heaterOnly[profile.category] += 1;
  }
  return { fits, heaterOnly };
}

/**
 * Pencerenin araması: akvaryumun canlıları ve aday türler tam tür kataloğundan, davranış kayıtları davranış dosyasından, ekipman profilleri
 * yalnız gereken katalog parçalarından (src/lib/catalog-slice.ts). Böylece ekipman kataloğunun tamamı indirilmez.
 */
export function fitLookup(speciesForLivestock: CatalogLookup["speciesForLivestock"], behavior: Readonly<Record<string, BehaviorRecord[]>>, equipment: Pick<CatalogLookup, "profileForEquipment">): CatalogLookup {
  return { speciesForLivestock, behaviorFor: (id) => behavior[id], profileForEquipment: (item) => equipment.profileForEquipment(item) };
}
