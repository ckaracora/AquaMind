import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { speciesCatalog, type SpeciesProfile } from "@/data/catalog-species";
import { speciesBehavior, type BehaviorRecord } from "@/data/species-behavior";
import { speciesCare } from "@/data/species-care";
import { behaviorSummary, cardSources, hasCareInfo, sourceNameFromUrl } from "@/lib/species-card";
import { en } from "../../../packages/localization/src/messages/en";
import { es } from "../../../packages/localization/src/messages/es";
import { tr } from "../../../packages/localization/src/messages/tr";

// Tür kartı (veri sprinti F, 2026-11-14): katalog değerleri, davranış özeti, bakım bilgisi ve kaynaklar. Olmayan alan gösterilmez.

const profile = (overrides: Partial<SpeciesProfile> = {}): SpeciesProfile => ({ id: "test-fish", commonName: "Deneme", scientificName: "Testus testus", category: "fish", adultSizeCm: 5, minVolumeL: 60, minGroup: 6, temperature: [22, 26], ph: [6, 7.5], wasteFactor: 1, ...overrides });
const record = (flag: BehaviorRecord["flag"], overrides: Partial<BehaviorRecord> = {}): BehaviorRecord => ({ flag, confidence: "explicit", evidence: "kanıt", source: "Seriously Fish", sourceUrl: "https://www.seriouslyfish.com/species/test/", verifiedAt: "2026-11-14", ...overrides });

describe("davranış özeti", () => {
  it("'barışçıl' kaydı 'Kaynağa göre barışçıl' satırıdır; kayıt yoksa 'Kaynaklar uyumunu yazmıyor'", () => {
    expect(behaviorSummary(profile(), [record("peaceful")])).toEqual({ lines: [{ kind: "peaceful", conflict: false, source: "Seriously Fish", sourceUrl: "https://www.seriouslyfish.com/species/test/" }], unknown: false });
    expect(tr.livestock.card.behavior.peaceful).toBe("Kaynağa göre barışçıl");
    expect(behaviorSummary(profile(), undefined)).toEqual({ lines: [], unknown: true });
    expect(tr.livestock.card.behaviorUnknown).toBe("Kaynaklar uyumunu yazmıyor");
    // Tank arkadaşı notu olan tür "bilinmiyor" sayılmaz; not ayrıca gösterilir.
    expect(behaviorSummary(profile({ communityCaution: "Not" }), undefined).unknown).toBe(false);
  });

  it("açık kayıt çelişkili kayda üstün gelir; yalnız çelişkili kayıt varsa satır 'kaynaklar çelişiyor' diye işaretlenir", () => {
    const lines = behaviorSummary(profile(), [record("eatsShrimp", { confidence: "conflict", condition: "Koşul" }), record("finNipper", { confidence: "conflict" }), record("finNipper")]).lines;
    expect(lines.map((line) => [line.kind, line.conflict, line.condition])).toEqual([["finNipper", false, undefined], ["eatsShrimp", true, "Koşul"]]);
  });

  it("aynı tür saldırganlığı ve küçük karides kaydı ayrı metinlerdir; kaynak asıl avcı değil diyorsa katalogdaki avcı işareti satır olmaz", () => {
    expect(behaviorSummary(profile(), [record("conspecificAggression", { value: "all" })]).lines[0].kind).toBe("conspecificAll");
    expect(behaviorSummary(profile(), [record("conspecificAggression", { value: "males" })]).lines[0].kind).toBe("conspecificMales");
    expect(behaviorSummary(profile(), [record("eatsShrimp", { smallShrimpOnly: true })]).lines[0].kind).toBe("eatsShrimpSmall");
    expect(behaviorSummary(profile({ predatory: true }), []).lines.map((line) => line.kind)).toEqual(["predatory"]);
    expect(behaviorSummary(profile({ predatory: true }), [record("notPiscivorous")]).lines.map((line) => line.kind)).toEqual(["notPiscivorous"]);
    expect(behaviorSummary(profile({ speciesOnly: true }), []).lines.map((line) => line.kind)).toEqual(["speciesOnly"]);
  });

  it("katalogdaki her türün her davranış satırının üç dilde metni var", () => {
    const kinds = new Set(speciesCatalog.flatMap((item) => behaviorSummary(item, speciesBehavior[item.id]).lines.map((line) => line.kind)));
    expect(kinds.size).toBeGreaterThan(8);
    for (const kind of kinds) for (const messages of [tr, en, es]) expect(messages.livestock.card.behavior[kind]?.length, kind).toBeGreaterThan(3);
    expect(Object.keys(en.livestock.card.behavior).sort()).toEqual(Object.keys(tr.livestock.card.behavior).sort());
    expect(Object.keys(es.livestock.card.behavior).sort()).toEqual(Object.keys(tr.livestock.card.behavior).sort());
  });
});

describe("kaynaklar", () => {
  it("kabul edilen kaynakların adı, öbürlerinin alan adı yazılır", () => {
    expect(sourceNameFromUrl("https://www.seriouslyfish.com/species/danio-rerio/")).toBe("Seriously Fish");
    expect(sourceNameFromUrl("https://www.fishkeeper.co.uk/fish/x")).toBe("Fishkeeper");
    expect(sourceNameFromUrl("https://www.fishbase.se/summary/Danio-rerio.html")).toBe("FishBase");
    expect(sourceNameFromUrl("https://ornamentalfish.org/what-we-do/")).toBe("OATA");
    expect(sourceNameFromUrl("https://www.fishi-pedia.com/fishes/x")).toBe("Fishipedia");
    expect(sourceNameFromUrl("https://www.fishipedia.fr/poissons/x")).toBe("Fishipedia");
    expect(sourceNameFromUrl("https://www.example.org/a")).toBe("example.org");
  });

  it("katalog, davranış ve bakım kaynakları bir kez listelenir; tarih en yenisidir", () => {
    const item = profile({ sourceUrl: "https://www.seriouslyfish.com/species/test/", additionalSourceUrls: ["https://www.fishkeeper.co.uk/fish/test"], verifiedAt: "2026-09-01" });
    const care = { diet: "Her şeyi yer.", sources: { diet: "https://www.fishkeeper.co.uk/fish/test", hardness: "https://www.fishbase.se/summary/Testus-testus.html" }, verifiedAt: "2026-11-14" };
    const result = cardSources(item, [record("peaceful", { verifiedAt: "2026-10-01" })], care);
    expect(result.sources.map((source) => source.name)).toEqual(["Seriously Fish", "Fishkeeper", "FishBase"]);
    expect(result.verifiedAt).toBe("2026-11-14");
    expect(cardSources(profile(), undefined, undefined)).toEqual({ sources: [] });
  });
});

describe("bakım bilgisi", () => {
  it("bakım kaydı olan her tür kartta bakım bölümü gösterir; kaydı olmayan türde bölüm yoktur", () => {
    for (const care of Object.values(speciesCare)) expect(hasCareInfo(care)).toBe(true);
    expect(hasCareInfo(undefined)).toBe(false);
  });

  it("ömür ve sertlik metinleri kaynağın verdiği biçimle yazılır (tek sınır, en az, en çok)", () => {
    const c = tr.livestock.card;
    expect(c.lifespanValue("3", "5")).toBe("3–5 yıl");
    expect(c.lifespanValue("3,5", "3,5", "about")).toBe("Yaklaşık 3,5 yıl");
    expect(c.lifespanValue("20", "20", "atLeast")).toBe("En az 20 yıl");
    expect(c.hardnessValue("5", "15")).toBe("5–15 dGH");
    expect(c.hardnessValue(undefined, "15")).toBe("En çok 15 dGH");
    expect(c.hardnessValue("12", undefined)).toBe("En az 12 dGH");
    expect(en.livestock.card.hardnessValue(undefined, "15")).toBe("Up to 15 dGH");
    expect(es.livestock.card.lifespanValue("2", "2", "about")).toBe("Unos 2 años");
  });
});

describe("tür kartı ekranları", () => {
  it("kart canlı kartından, canlı seçme penceresindeki türden ve 'Bu akvaryuma ne uyar?' listesinden açılır", () => {
    expect(readFileSync("src/app/livestock/page.tsx", "utf8")).toMatch(/<SpeciesCardDialog /);
    const form = readFileSync("src/components/catalog-livestock-form.tsx", "utf8");
    expect(form).toMatch(/<SpeciesCardButton /);
    expect(form).toMatch(/<AquariumFitDialog /);
    expect(readFileSync("src/components/aquarium-fit.tsx", "utf8")).toMatch(/<SpeciesCardDialog /);
    expect(readFileSync("src/app/aquariums/[id]/health/page.tsx", "utf8")).toMatch(/<AquariumFitDialog /);
  });

  it("bakım bilgisi çevirileri dil paketinin sınır denetiminde ayrı parça olarak aranır", () => {
    const script = readFileSync("scripts/check-locale-bundle.cjs", "utf8");
    for (const [file, marker] of [["en-catalog-species-care.ts", "Mature females are larger and appear fuller."], ["es-catalog-species-care.ts", "La hembra madura es más grande y se ve más llena."]]) {
      expect(script).toContain(`["${file}", "${marker}"]`);
      expect(readFileSync(`packages/localization/src/messages/${file}`, "utf8")).toContain(marker);
    }
  });
});
