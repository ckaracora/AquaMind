// Uyumluluk motoru `packages/compatibility-engine` içine taşındı (bkz. docs/COMPATIBILITY.md).
// Bu dosya motoru katalogla bağlayan uyarlayıcıdır; `analyzeAquarium` imzası ve çıktısı
// Phase 0B'de birebir korunmuştur. Sağlık sayfası ve scripts/test-health.cjs bu yolu kullanır.
import { isVerifiedEquipmentProfile, isVerifiedSpeciesProfile, profileForEquipment, speciesForLivestock, type SpeciesProfile } from "@/data/catalog";
import { speciesBehavior, type BehaviorFlag, type BehaviorRecord } from "@/data/species-behavior";
import { createAnalyzer, type BehaviorNote, type SpeciesBehaviorInput } from "@aquamind/compatibility-engine";

export type { HealthAnalysis, HealthMetric } from "@aquamind/compatibility-engine";

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
export function withBehavior(profile: SpeciesProfile | undefined): (SpeciesProfile & { behavior?: SpeciesBehaviorInput }) | undefined {
  const records = profile && speciesBehavior[profile.id];
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

export const analyzeAquarium = createAnalyzer({
  speciesForLivestock: (item) => withBehavior(speciesForLivestock(item)),
  profileForEquipment,
  isVerifiedSpeciesProfile,
  isVerifiedEquipmentProfile,
});
