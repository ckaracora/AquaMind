// Tür kartı (veri sprinti F, 2026-11-14): katalog değerleri, davranış özeti, bakım bilgisi ve kaynaklar. Bu dosya veri içermez; kayıtlar
// çağırandan gelir (kart penceresi davranış ve bakım dosyalarını gerektiğinde `import()` ile yükler, src/components/species-card.tsx).
// Olmayan alan gösterilmez: kaynakta yazmayan değer için satır kurulmaz, "bilinmiyor" diye boş satır da yazılmaz.
import type { SpeciesProfile } from "@/data/catalog-species";
import type { BehaviorFlag, BehaviorRecord } from "@/data/species-behavior";
import type { SpeciesCare } from "@/data/species-care";

/**
 * Davranış özetinin bir satırı. `kind` dil dosyasındaki metnin anahtarıdır (`t.livestock.card.behavior[kind]`). `condition` kaynağın Türkçe
 * notudur (katalog çevirmeninden geçer; çevirisi yoksa ekran göstermez). `conflict`: kaynaklar çelişiyor, motor bunu uyarıya çevirmez.
 */
export type BehaviorLineKind = Exclude<BehaviorFlag, "conspecificAggression"> | "eatsShrimpSmall" | "conspecificMales" | "conspecificAll" | "predatory" | "speciesOnly";
export interface BehaviorLine { kind: BehaviorLineKind; conflict: boolean; condition?: string; source?: string; sourceUrl?: string }

/** Ekrandaki sıra: önce risk anlatanlar, sonra güven verenler, en sonda "barışçıl". */
const FLAG_ORDER: BehaviorFlag[] = ["eatsSmallFish", "conspecificAggression", "finNipper", "finNipTarget", "eatsShrimp", "eatsSnails", "notPiscivorous", "shrimpSafe", "peaceful"];

/**
 * Davranış özeti. Her davranış bir kez yazılır: açık kayıt varsa o, yoksa çelişkili kayıt (motorun seçtiği kayıtla aynı, src/lib/health-analysis-core.ts).
 * Katalogdaki "avcı" ve "tür akvaryumu" işaretleri de satırdır; kaynak türün asıl avcı olmadığını açıkça yazıyorsa "avcı" satırı çıkmaz (motor
 * da bu durumda işareti kaldırır). Hiç satır yoksa `unknown` doğrudur: ekran "Kaynaklar uyumunu yazmıyor" der. Tank arkadaşı notu
 * (`communityCaution`) ayrı gösterilir ve tek başına türü "davranışı bilinen" yapmaz; "Kaynaklar uyumunu yazmıyor" yalnız davranış kaydı da işaret de
 * not da yoksa yazılır.
 */
export function behaviorSummary(profile: SpeciesProfile, records: readonly BehaviorRecord[] | undefined): { lines: BehaviorLine[]; unknown: boolean } {
  const list = records ?? [];
  const pick = (flag: BehaviorFlag) => list.find((record) => record.flag === flag && record.confidence === "explicit") ?? list.find((record) => record.flag === flag);
  const notPiscivorous = list.some((record) => record.flag === "notPiscivorous" && record.confidence === "explicit");
  const lines: BehaviorLine[] = [];
  if (profile.speciesOnly) lines.push({ kind: "speciesOnly", conflict: false });
  if (profile.predatory && !notPiscivorous) lines.push({ kind: "predatory", conflict: false });
  for (const flag of FLAG_ORDER) {
    const record = pick(flag);
    if (!record) continue;
    if (flag === "conspecificAggression" && !record.value) continue;
    const kind: BehaviorLineKind = flag === "conspecificAggression" ? (record.value === "all" ? "conspecificAll" : "conspecificMales")
      : flag === "eatsShrimp" && record.smallShrimpOnly ? "eatsShrimpSmall" : flag as BehaviorLineKind;
    lines.push({ kind, conflict: record.confidence === "conflict", ...(record.condition ? { condition: record.condition } : {}), source: record.source, sourceUrl: record.sourceUrl });
  }
  return { lines, unknown: lines.length === 0 && !profile.communityCaution };
}

/** Kabul edilen kaynakların görünen adları (docs/DATA_SOURCES.md); listede olmayan adres alan adıyla yazılır. */
const SOURCE_NAMES: ReadonlyArray<[RegExp, string]> = [
  [/(^|\.)seriouslyfish\.com$/, "Seriously Fish"],
  [/(^|\.)fishkeeper\.co\.uk$/, "Fishkeeper"],
  [/(^|\.)practicalfishkeeping\.co\.uk$/, "Practical Fishkeeping"],
  [/(^|\.)ornamentalfish\.org$/, "OATA"],
  [/(^|\.)fishbase\.(se|org|de|us|in)$/, "FishBase"],
  [/(^|\.)(fishi-pedia\.com|fishipedia\.(fr|it|es|de|com))$/, "Fishipedia"],
  [/(^|\.)wirbellose\.de$/, "wirbellose.de"],
  [/(^|\.)scotcat\.com$/, "ScotCat"],
  [/(^|\.)planetcatfish\.com$/, "PlanetCatfish"],
  [/(^|\.)rspca\.org\.uk$/, "RSPCA"],
];

export function sourceNameFromUrl(url: string): string {
  let host: string;
  try { host = new URL(url).hostname.toLowerCase(); } catch { return url; }
  return SOURCE_NAMES.find(([pattern]) => pattern.test(host))?.[1] ?? host.replace(/^www\./, "");
}

/**
 * Kartın kaynak listesi: katalog kaydının kaynakları, davranış kayıtlarının ve bakım bilgisinin kaynak sayfaları; her adres bir kez, ilk geçtiği
 * sırayla. `verifiedAt` en yeni doğrulama tarihidir (katalog, davranış ve bakım kayıtları arasında).
 */
export function cardSources(profile: SpeciesProfile, records: readonly BehaviorRecord[] | undefined, care: SpeciesCare | undefined): { sources: { name: string; url: string }[]; verifiedAt?: string } {
  const urls = [
    ...(profile.sourceUrl ? [profile.sourceUrl] : []), ...(profile.additionalSourceUrls ?? []),
    ...(records ?? []).flatMap((record) => [record.sourceUrl, ...(record.additionalSourceUrls ?? [])]),
    ...Object.values(care?.sources ?? {}),
  ].filter((url): url is string => typeof url === "string" && /^https:\/\//.test(url));
  const dates = [profile.verifiedAt, ...(records ?? []).map((record) => record.verifiedAt), care?.verifiedAt].filter((date): date is string => typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date));
  return {
    sources: [...new Set(urls)].map((url) => ({ name: sourceNameFromUrl(url), url })),
    ...(dates.length ? { verifiedAt: dates.reduce((latest, date) => (date > latest ? date : latest)) } : {}),
  };
}

/** Bakım bilgisinin metin alanları; ekran sırası budur. */
export const CARE_TEXT_FIELDS = ["diet", "sexing", "breeding"] as const;
/** Kartta gösterilecek bakım bilgisi var mı? (Olmayan bölüm çizilmez.) */
export const hasCareInfo = (care: SpeciesCare | undefined): care is SpeciesCare => Boolean(care && (CARE_TEXT_FIELDS.some((field) => care[field]) || care.lifespan || care.difficulty || care.swimLevels?.length || care.hardnessDgh));
