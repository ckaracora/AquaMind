// Sağlık analizinin katalog verisi içermeyen çekirdeği (docs/DECISIONS/0016-gereken-katalog-kayitlarinin-yuklenmesi.md).
// Kayıtlar bir `CatalogLookup` üzerinden gelir: tam katalog (src/lib/health-analysis.ts) ya da yalnızca gereken parçalar
// (src/lib/catalog-slice.ts). Böylece sağlık sayfası ve ana sayfa, kataloğun tamamını indirmeden aynı analizi yapar.
import { createAnalyzer, type BehaviorNote, type SpeciesBehaviorInput } from "@aquamind/compatibility-engine";
import type { EquipmentProfile } from "@/data/catalog-equipment";
import { isVerifiedEquipmentProfile, isVerifiedSpeciesProfile } from "@/data/catalog-shared";
import type { SpeciesProfile } from "@/data/catalog-species";
import type { BehaviorFlag, BehaviorRecord } from "@/data/species-behavior";
import type { Equipment, Livestock } from "@/types/aquarium";

export interface CatalogLookup {
  speciesForLivestock(item: Livestock): SpeciesProfile | undefined;
  behaviorFor(id: string): BehaviorRecord[] | undefined;
  profileForEquipment(item: Equipment): EquipmentProfile | undefined;
}

const noteFrom = (record: BehaviorRecord): BehaviorNote => ({
  source: record.source,
  ...(record.condition ? { condition: record.condition } : {}),
  ...(record.confidence === "conflict" ? { conflict: true } : {}),
});

/**
 * Davranış bilgisi katalog dosyalarından ayrı tutulur (src/data/species-behavior.ts, docs/DECISIONS/0010-davranis-uyarilari.md).
 * Her davranış için açık kaynaklı kayıt, yoksa çelişkili kayıt (motor bunu uyarıya çevirmez) kullanılır.
 * Kaynağa göre asıl avcı olmayan türün katalogdaki "avcı" işareti kaldırılır; kaynak küçük balıklar için sayısal bir av boyu
 * veriyorsa (ör. threadfin acara: "a couple of centimetres", 2 cm) tür, o boy sınırıyla fırsatçı avcı sayılır.
 */
export function withBehaviorRecords(profile: SpeciesProfile | undefined, records: BehaviorRecord[] | undefined): (SpeciesProfile & { behavior?: SpeciesBehaviorInput }) | undefined {
  if (!profile || !records) return profile;
  const pick = (flag: BehaviorFlag) => records.find((record) => record.flag === flag && record.confidence === "explicit") ?? records.find((record) => record.flag === flag);
  const behavior: SpeciesBehaviorInput = {};
  for (const flag of ["finNipper", "finNipTarget", "eatsShrimp", "shrimpSafe", "eatsSnails", "eatsSmallFish"] as const) {
    const record = pick(flag);
    if (record) behavior[flag] = noteFrom(record);
  }
  const aggression = pick("conspecificAggression");
  if (aggression?.value) behavior.conspecificAggression = { ...noteFrom(aggression), value: aggression.value };
  const notPiscivorous = records.find((record) => record.flag === "notPiscivorous" && record.confidence === "explicit");
  if (notPiscivorous?.maxPreyCm !== undefined && !behavior.eatsSmallFish?.source) behavior.eatsSmallFish = { ...noteFrom(notPiscivorous), maxPreyCm: notPiscivorous.maxPreyCm };
  return { ...profile, ...(notPiscivorous ? { predatory: false } : {}), behavior };
}

export function createHealthAnalyzer(lookup: CatalogLookup) {
  return createAnalyzer({
    speciesForLivestock: (item) => {
      const profile = lookup.speciesForLivestock(item);
      return withBehaviorRecords(profile, profile && lookup.behaviorFor(profile.id));
    },
    profileForEquipment: (item) => lookup.profileForEquipment(item),
    isVerifiedSpeciesProfile,
    isVerifiedEquipmentProfile,
  });
}
