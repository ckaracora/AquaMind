import { describe, expect, it } from "vitest";
import { plantCatalog, type PlantProfile } from "@/data/catalog-plants";
import { speciesCatalog, type SpeciesProfile } from "@/data/catalog-species";
import { speciesBehavior, type BehaviorRecord } from "@/data/species-behavior";

// İkinci kaynak kademesi (docs/DECISIONS/0045-ikinci-kademe-kaynaklar.md, docs/DATA_SOURCES.md → "İkinci kademe (çapraz kontrollü) kaynaklar"):
// kabul edilen kaynakların yazmadığı değer birkaç bağımsız hobi kaynağıyla çapraz kontrol edilerek doldurulur ve işaretlenir. Bu dosya işaretin
// biçimini denetler: alan ve değer var, kaynak sayısı yeterli (bitki sıcaklığı/pH'ı en az 2, canlı hacmi/uzunluğu ve davranış en az 3), kaynaklar
// ayrı sitelerde (aynı sitenin sayfaları tek kaynaktır), kabul edilen kaynak ya da Wikipedia sayılmaz. Kopya metin, satıcı kalıbı ve yapay zekâ
// sitesi gibi bağımsızlık koşulları okuyarak denetlenir; kanıt docs/CATALOG_LOG.md'dedir.

/** Kabul edilen kaynaklar (docs/DATA_SOURCES.md): bunlar bir değeri yazıyorsa değer ikinci kademe değildir. */
const ACCEPTED_HOSTS = /(^|\.)(seriouslyfish\.com|fishkeeper\.co\.uk|practicalfishkeeping\.co\.uk|ornamentalfish\.org|fishbase\.(se|org|de|us|in)|fishi-pedia\.com|fishipedia\.(fr|it|es|de|com)|wirbellose\.de|scotcat\.com|tropica\.com|rspca\.org\.uk)$/;
const ACCEPTED_BEHAVIOR_SOURCES = new Set(["Seriously Fish", "Fishkeeper", "Practical Fishkeeping", "OATA", "Fishipedia", "wirbellose.de", "ScotCat"]);
const WIKIPEDIA = /(^|\.)wikipedia\.org$/;
const SPECIES_FIELDS = new Set(["minVolumeL", "minTankLengthCm"]);
const PLANT_FIELDS = new Set(["temperature", "ph"]);

/** Adresler: https, ayrı siteler (www. ve alt alan adı farkı aynı site sayılır: son iki etiket; .co.uk gibi ikili uzantıda son üç), kabul edilen kaynak ve Wikipedia değil. */
function urlProblems(label: string, urls: readonly string[], minimum: number): string[] {
  const problems: string[] = [];
  const sites = new Set<string>();
  for (const url of urls) {
    let host: string;
    try { host = new URL(url).hostname.toLowerCase(); } catch { problems.push(`${label}: geçersiz adres ${url}`); continue; }
    if (!url.startsWith("https://")) problems.push(`${label}: https değil ${url}`);
    if (ACCEPTED_HOSTS.test(host)) problems.push(`${label}: kabul edilen kaynak ikinci kademe sayılmaz ${url}`);
    if (WIKIPEDIA.test(host)) problems.push(`${label}: Wikipedia tek başına kaynak sayılmaz ${url}`);
    const parts = host.replace(/^www\./, "").split(".");
    sites.add(parts.slice(/^(co|com|org|net|gov|ac)$/.test(parts[parts.length - 2] ?? "") ? -3 : -2).join("."));
  }
  if (sites.size < minimum) problems.push(`${label}: en az ${minimum} ayrı site gerekir (${sites.size})`);
  return problems;
}

function speciesSecondaryProblems(items: readonly SpeciesProfile[]): string[] {
  return items.flatMap((item) => Object.entries(item.secondarySources ?? {}).flatMap(([field, urls]) => [
    ...(SPECIES_FIELDS.has(field) ? [] : [`${item.id}: ${field} ikinci kademeden yazılmaz`]),
    ...(item[field as keyof SpeciesProfile] === undefined ? [`${item.id}: ${field} işaretli ama değer yok`] : []),
    ...(item.sourceUrl && item.verifiedAt ? [] : [`${item.id}: doğrulanmış kayıt değil`]),
    ...urlProblems(`${item.id}.${field}`, urls ?? [], 3),
  ]));
}

function plantSecondaryProblems(items: readonly PlantProfile[]): string[] {
  return items.flatMap((item) => Object.entries(item.secondarySources ?? {}).flatMap(([field, urls]) => [
    ...(PLANT_FIELDS.has(field) ? [] : [`${item.id}: ${field} ikinci kademeden yazılmaz`]),
    ...(item[field as keyof PlantProfile] === undefined ? [`${item.id}: ${field} işaretli ama değer yok`] : []),
    ...(item.warningOnly ? [`${item.id}: yalnız uyarı kaydına değer yazılmaz`] : []),
    ...urlProblems(`${item.id}.${field}`, urls ?? [], 2),
  ]));
}

function behaviorSecondaryProblems(records: Readonly<Record<string, readonly BehaviorRecord[]>>): string[] {
  return Object.entries(records).flatMap(([id, list]) => list.filter((record) => record.tier === "secondary").flatMap((record) => [
    ...(record.source.trim() && !ACCEPTED_BEHAVIOR_SOURCES.has(record.source) ? [] : [`${id}.${record.flag}: kaynak adı bir hobi kaynağı olmalı`]),
    ...(record.evidence.trim() ? [] : [`${id}.${record.flag}: kanıt yok`]),
    ...urlProblems(`${id}.${record.flag}`, [record.sourceUrl, ...(record.additionalSourceUrls ?? [])], 3),
  ]));
}

describe("ikinci kademe işaretleri (karar 0045)", () => {
  it("katalogdaki canlı, bitki ve davranış kayıtlarında kural tutuyor", () => {
    expect(speciesSecondaryProblems(speciesCatalog)).toEqual([]);
    expect(plantSecondaryProblems(plantCatalog)).toEqual([]);
    expect(behaviorSecondaryProblems(speciesBehavior)).toEqual([]);
  });

  it("denetim sahte kayıtlarda kusuru yakalar", () => {
    const fish = speciesCatalog.find((item) => item.sourceUrl && item.verifiedAt && item.minTankLengthCm === undefined)!;
    const hobby = ["https://www.hobby-a.example/x", "https://hobby-b.example/y", "https://hobby-c.example/z"];
    expect(speciesSecondaryProblems([{ ...fish, secondarySources: { minVolumeL: hobby } }])).toEqual([]);
    expect(speciesSecondaryProblems([{ ...fish, secondarySources: { minVolumeL: [hobby[0], "https://hobby-a.example/other", hobby[1]] } }])).toEqual([`${fish.id}.minVolumeL: en az 3 ayrı site gerekir (2)`]);
    expect(speciesSecondaryProblems([{ ...fish, secondarySources: { minTankLengthCm: hobby } }])).toEqual([`${fish.id}: minTankLengthCm işaretli ama değer yok`]);
    expect(speciesSecondaryProblems([{ ...fish, secondarySources: { minVolumeL: [...hobby.slice(0, 2), "https://www.seriouslyfish.com/species/x/"] } }])).toContain(`${fish.id}.minVolumeL: kabul edilen kaynak ikinci kademe sayılmaz https://www.seriouslyfish.com/species/x/`);
    expect(speciesSecondaryProblems([{ ...fish, secondarySources: { temperature: hobby } as SpeciesProfile["secondarySources"] }])).toContain(`${fish.id}: temperature ikinci kademeden yazılmaz`);

    const plant = plantCatalog.find((item) => !item.warningOnly && item.temperature)!;
    expect(plantSecondaryProblems([{ ...plant, secondarySources: { temperature: hobby.slice(0, 2) } }])).toEqual([]);
    expect(plantSecondaryProblems([{ ...plant, secondarySources: { temperature: [hobby[0], "https://en.wikipedia.org/wiki/X"] } }])).toEqual([
      `${plant.id}.temperature: Wikipedia tek başına kaynak sayılmaz https://en.wikipedia.org/wiki/X`,
    ]);
    expect(plantSecondaryProblems([{ ...plant, secondarySources: { temperature: ["https://shop.hobby.co.uk/a", "https://www.hobby.co.uk/b"] } }])).toEqual([`${plant.id}.temperature: en az 2 ayrı site gerekir (1)`]);

    const record: BehaviorRecord = { flag: "finNipper", confidence: "explicit", evidence: "alıntılar", tier: "secondary", source: "Hobby A", sourceUrl: hobby[0], additionalSourceUrls: hobby.slice(1), verifiedAt: "2026-11-14" };
    expect(behaviorSecondaryProblems({ x: [record] })).toEqual([]);
    expect(behaviorSecondaryProblems({ x: [{ ...record, additionalSourceUrls: hobby.slice(1, 2) }] })).toEqual(["x.finNipper: en az 3 ayrı site gerekir (2)"]);
    expect(behaviorSecondaryProblems({ x: [{ ...record, source: "Fishkeeper" }] })).toEqual(["x.finNipper: kaynak adı bir hobi kaynağı olmalı"]);
  });
});
