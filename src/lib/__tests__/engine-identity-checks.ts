// Kontrol turu 2: gerçek çözümleyiciler ve ekran metinleri; Vitest ve doğrulama betikleri aynı kontrolleri kullanır.
import assert from "node:assert/strict";
import { createAnalyzer, type SpeciesProfileInput } from "@aquamind/compatibility-engine";
import type { Aquarium, Livestock } from "@aquamind/domain";
import { createDisplayFormat } from "@aquamind/localization";
import { catalogTranslator } from "@aquamind/localization/catalog";
import { engineTextFormat } from "@aquamind/localization/engine";
import { enEngine } from "../../../packages/localization/src/messages/en-engine";
import { esEngine } from "../../../packages/localization/src/messages/es-engine";
import { enCatalogSpecies } from "../../../packages/localization/src/messages/en-catalog-species";
import { esCatalogSpecies } from "../../../packages/localization/src/messages/es-catalog-species";
import { buildCatalogBucket } from "@/data/catalog-bucket-builders";
import { catalogBucketOf, catalogBucketPath } from "@/data/catalog-buckets";
import { speciesById, speciesCatalog, speciesForLivestock } from "@/data/catalog-species";
import { speciesBehavior, type BehaviorRecord } from "@/data/species-behavior";
import { loadCatalogSlice } from "@/lib/catalog-slice";
import { createHealthAnalyzer, withBehaviorRecords } from "@/lib/health-analysis-core";
import { analyzeAquarium } from "@/lib/health-analysis";
import { engineWarningText } from "@/lib/engine-text";

const tank: Aquarium = { id: "review", name: "Review", type: "freshwater", lengthCm: 300, widthCm: 100, heightCm: 100, netVolumeLiters: 1000, setupDate: "2026-01-01" };
const animal = (id: string, quantity = 1): Livestock => ({ id: `record-${id}`, aquariumId: tank.id, catalogId: id, commonName: id, category: "fish", quantity, addedAt: "2026-01-01" });
const stub = (id: string, behavior: SpeciesProfileInput["behavior"] = {}): SpeciesProfileInput => ({ id, commonName: id, minGroup: 1, adultSizeCm: 5, minVolumeL: 20, temperature: [22, 27], ph: [6, 8], wasteFactor: 0.1, behavior });
const run = (profiles: SpeciesProfileInput[], animals: Livestock[]) => createAnalyzer({
  speciesForLivestock: (item) => profiles.find((profile) => profile.id === item.catalogId),
  profileForEquipment: () => undefined, isVerifiedSpeciesProfile: (p) => p !== undefined, isVerifiedEquipmentProfile: () => false,
})(tank, animals, []);
const codes = (result: ReturnType<typeof run>) => result.warnings.map((w) => w.code);

export function assertEngine119Review() {
  const group = { incompatibleGroup: { source: "Fishkeeper", group: "clownfish" } };
  const pair = { conspecificAggression: { source: "Fishkeeper", value: "all" as const, pairAccepted: true as const } };
  const a = stub("a", { ...group, ...pair }), b = stub("b", group);
  assert(!codes(run([a, b], [animal("a", 2), animal("b", 0)])).includes("incompatibleGroup"), "Adedi 0 olan ikinci tür grup yasağını tetiklemez");
  for (const quantity of [0, 1, 2, 3]) {
    const result = run([a], [animal("a", quantity)]);
    assert.equal(codes(result).includes("conspecificPair"), quantity === 2);
    assert.equal(codes(result).includes("conspecificAll"), quantity >= 3);
    if (quantity === 2) assert(result.score <= 74 && result.status === "warning");
    if (quantity === 3) assert(result.score <= 49 && result.status === "danger");
  }
  // Son kapı 3 (lider kararı 2026-11-14): 0040 grup istisnası korunur. En az grubu 1 olan türde iki birey: pairAccepted sarı, değilse kırmızı.
  // En az grubu 2 ve üstü olan türde kayıtlı adet bu sayıyı aşmıyorsa uyarı yok (pairAccepted olsa da); aşarsa kırmızı.
  for (const minGroup of [1, 2, 6]) for (const pairAccepted of [false, true]) {
    const profile = { ...stub("pair", { conspecificAggression: { source: "Fishkeeper", value: "all", ...(pairAccepted ? { pairAccepted: true as const } : {}) } }), minGroup };
    const result = run([profile], [animal("pair"), animal("pair")]);
    if (minGroup === 1) {
      assert.equal(codes(result).filter((code) => code === (pairAccepted ? "conspecificPair" : "conspecificAll")).length, 1);
      assert.equal(result.status, pairAccepted ? "warning" : "danger");
      assert(result.score <= (pairAccepted ? 74 : 49));
    } else {
      assert(!codes(result).some((code) => code === "conspecificPair" || code === "conspecificAll"), `minGroup ${minGroup}: çift uyarı almaz`);
    }
    const trio = run([profile], [animal("pair", 2), animal("pair")]);
    if (minGroup <= 2) {
      assert(codes(trio).includes("conspecificAll") && !codes(trio).includes("conspecificPair"));
      assert(trio.status === "danger" && trio.score <= 49);
    } else assert(!codes(trio).includes("conspecificAll"), "Grup sayısına kadar uyarı yok");
  }
  const groupLoner = { ...stub("group", { conspecificAggression: { source: "Fishkeeper", value: "all" } }), minGroup: 6 };
  for (const count of [3, 6]) assert(!codes(run([groupLoner], [animal("group", count)])).includes("conspecificAll"), "Çift dışındaki eski grup hükmü korunur");
  // Katalogdaki 23 çift kaydının hepsi: en az grubu 1 ise iki sarı; 2 ve üstüyse iki uyarısız; grup sayısını aşan adet kırmızı.
  for (const [id, records] of Object.entries(speciesBehavior)) {
    if (!records.some((record) => record.pairAccepted)) continue;
    const profile = speciesById(id)!;
    for (const quantity of [2, 3]) {
      const result = analyzeAquarium({ ...tank, type: profile.waterTypes?.[0] ?? "freshwater", netVolumeLiters: 12000, lengthCm: 600 }, [{ ...animal(id, quantity), category: profile.category }], []);
      const exempt = profile.minGroup >= 2 && quantity <= profile.minGroup;
      const expected = exempt ? undefined : quantity === 2 ? "conspecificPair" : "conspecificAll";
      assert.equal(codes(result).filter((code) => code === "conspecificPair" || code === "conspecificAll").join(), expected ?? "", id);
      if (expected) assert(result.score <= (quantity === 2 ? 74 : 49), id);
    }
  }
  const mixed = run([a, b], [animal("a"), animal("a"), animal("b"), animal("b", 0)]);
  assert.equal(codes(mixed).filter((code) => code === "incompatibleGroup").length, 1);
  assert.equal(codes(mixed).filter((code) => code === "conspecificPair").length, 1);
  assert.deepEqual(mixed.warnings.find((w) => w.code === "incompatibleGroup")?.params.fish, ["a", "b"]);
  assert(mixed.score <= 49 && mixed.status === "danger", "Grup yasağı çiftin sarı tavanından önceliklidir");
  assert.equal(codes(run([a], [animal("a"), animal("a"), animal("a")])).filter((code) => code === "conspecificAll").length, 1);

  // Çelişki uyarlayıcıda kaybolmamalı, avcı bayrağını/av boyunu değiştirmemeli.
  const profile = { ...speciesById("guppy")!, communityCaution: undefined, predatory: undefined, speciesOnly: undefined };
  for (const flag of ["notPiscivorous", "incompatibleGroup"] as const) {
    const record: BehaviorRecord = { flag, confidence: "conflict", source: "Fishkeeper", sourceUrl: "https://www.fishkeeper.co.uk/", verifiedAt: "2026-11-14", evidence: "Test", ...(flag === "incompatibleGroup" ? { group: "clownfish" } : { maxPreyCm: 2 }) };
    const adapted = withBehaviorRecords(profile, [record])!;
    assert.equal(adapted.behavior?.[flag]?.conflict, true, `${flag}: çelişki korunur`);
    assert.equal(adapted.behavior?.eatsSmallFish, undefined);
    assert.equal(withBehaviorRecords({ ...profile, predatory: true }, [record])?.predatory, true);
    const animals = [animal(profile.id), animal("other")];
    const result = run([adapted, stub("other", group)], animals);
    const before = run([profile, stub("other", group)], animals);
    assert.deepEqual([result.score, result.status, result.metrics, result.warnings], [before.score, before.status, before.metrics, before.warnings]);
    assert(result.unevaluated?.some((item) => item.code === "behaviorUnknown" && item.params.name === profile.commonName && item.params.conflict === true));
  }
}

export function assertEngine119Translations() {
  const records = [
    analyzeAquarium({ ...tank, type: "saltwater" }, [animal("percula-clownfish", 2), animal("maroon-clownfish")], []),
    analyzeAquarium(tank, [animal("pearl-cichlid", 2)], []),
    analyzeAquarium(tank, [animal("betta"), { ...animal("cherry-shrimp", 10), category: "shrimp" as const }], []),
    analyzeAquarium(tank, [animal("moonlight-gourami"), animal("chili-rasbora", 10)], []),
  ];
  const expectedCodes = ["incompatibleGroup", "conspecificPair", "shrimpUnverified", "smallFishPredation"];
  for (const [locale, messages, texts] of [["en", enEngine, enCatalogSpecies], ["es", esEngine, esCatalogSpecies]] as const) {
    const translate = catalogTranslator(locale, texts);
    const format = engineTextFormat(createDisplayFormat(locale, { temperature: "celsius", volume: "liters", dateFormat: "day-first" }));
    for (const [index, result] of records.entries()) {
      const warning = result.warnings.find((w) => w.code === expectedCodes[index]);
      assert(warning, expectedCodes[index]);
      const text = engineWarningText(messages, format, warning, translate);
      const rendered = `${text.title} ${text.message}`;
      for (const key of ["name", "hunter", "prey", "fish", "shrimp", "condition"]) {
        const value = warning.params[key];
        for (const raw of typeof value === "string" ? [value] : Array.isArray(value) ? value : []) {
          if (!raw) continue;
          const localized = translate(raw);
          assert(localized, `${locale}: çeviri eksik: ${raw}`);
          assert(rendered.includes(localized), `${locale}: çevrilen değişken metinde yok: ${raw}`);
          if (localized !== raw) assert(!rendered.includes(raw), `${locale}: Türkçe değişken ekranda kaldı: ${raw}`);
        }
      }
    }
    for (const [id, behavior] of Object.entries(speciesBehavior)) {
      if (!behavior.some((record) => record.pairAccepted || record.flag === "incompatibleGroup")) continue;
      assert(translate(speciesById(id)!.commonName), `${locale}: ${id} adı eksik`);
      for (const record of behavior) if (record.pairAccepted && record.condition) assert(translate(record.condition), `${locale}: ${id} çift koşulu eksik`);
    }
  }
}

export async function assertIdentity119Review() {
  const cases: Array<[string, string | undefined, string | undefined, string | undefined]> = [
    ["Neon tetra", "Poecilia reticulata", undefined, undefined],
    ["Neon tetra", "Poecilia reticulata", "removed", undefined],
    ["Lepistes", "Poecilia fantasia", undefined, undefined],
    ["Lepistes", "Poecilia fantasia", "removed", undefined],
    ["Guppy", "Poecilia reticulata", undefined, "guppy"],
    ["Benim balığım", "Poecilia reticulata", undefined, "guppy"],
    ["Midas ciklet", "Cichlasoma citrinellum", undefined, "midas-cichlid"],
    ["Neon tetra", "Poecilia reticulata", "guppy", "guppy"],
    ["  ", "  ", undefined, undefined],
  ];
  // Eski yedeklerde tek ad (ortak, bilimsel veya ortak ad alanında eş ad) değişmeden çözülür.
  for (const profile of speciesCatalog) {
    cases.push([profile.commonName, undefined, undefined, speciesForLivestock({ ...animal(""), catalogId: undefined, commonName: profile.commonName })?.id]);
    cases.push(["", profile.scientificName, undefined, speciesForLivestock({ ...animal(""), catalogId: undefined, commonName: "", scientificName: profile.scientificName })?.id]);
    for (const alias of profile.aliases ?? []) cases.push([alias, undefined, undefined, speciesForLivestock({ ...animal(""), catalogId: undefined, commonName: alias })?.id]);
  }
  const paths: string[] = [];
  const fetchJson = async (path: string) => { paths.push(path); return JSON.parse(JSON.stringify(buildCatalogBucket(path))); };
  for (const [commonName, scientificName, catalogId, expected] of cases) {
    const item = { ...animal(""), commonName, scientificName, catalogId };
    const slice = await loadCatalogSlice([item], [], fetchJson);
    assert.equal(speciesForLivestock(item)?.id, expected, `${commonName} / ${scientificName}`);
    assert.equal(slice.speciesForLivestock(item)?.id, expected);
    if (scientificName && commonName.trim()) {
      const full = analyzeAquarium(tank, [item], []);
      assert.deepEqual(createHealthAnalyzer(slice)(tank, [item], []), full);
      if (!expected) assert(full.incomplete && full.unevaluated?.some((gap) => gap.code === "unknownAnimal"));
    }
  }
  const requests: string[] = [];
  const conflict = { ...animal(""), catalogId: undefined, commonName: "Neon tetra", scientificName: "Poecilia reticulata" };
  const slice = await loadCatalogSlice([conflict], [], async (path) => { requests.push(path); return buildCatalogBucket(path); });
  assert.equal(slice.speciesForLivestock(conflict), undefined);
  assert.notEqual(catalogBucketOf("guppy", "species"), catalogBucketOf("neon-tetra", "species"));
  assert.deepEqual(requests.filter((path) => path.startsWith("/catalog-data/species/")), [catalogBucketPath("species", catalogBucketOf("guppy", "species"))], "İkinci adayın profili indirilmez");
  const blankRequests: string[] = [];
  const blank = { ...animal(""), catalogId: undefined, commonName: "  ", scientificName: " " };
  const empty = await loadCatalogSlice([blank], [], async (path) => { blankRequests.push(path); return buildCatalogBucket(path); });
  assert.equal(empty.speciesForLivestock(blank), undefined);
  assert.deepEqual(blankRequests, [], "Boş adlar için katalog indirilmez");
}
