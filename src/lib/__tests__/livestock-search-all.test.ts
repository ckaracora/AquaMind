import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { loadLocaleBundle, localeBundle, messagesFor, type Locale } from "@aquamind/localization";
import { catalogTranslator } from "@aquamind/localization/catalog";
import { plantById, plantCatalog, searchPlants } from "@/data/catalog-plants";
import { speciesById, speciesCatalog, speciesWaterTypes, type SpeciesProfile } from "@/data/catalog-species";
import { unresolvedSpeciesListings } from "@/data/catalog-species-unresolved";
import { DID_YOU_MEAN_LIMIT, evidenceSite, plantSearchSuggestions, searchSuggestions, type SearchSuggestion } from "@/data/search-suggestions";
import { plantSearchSuggestionProblems, plantSuggestionsFor, withEnglishPlantMatches } from "@/lib/plant-search";
import { searchSuggestionProblems, searchSuggestionsFor } from "@/lib/species-search";
import { buildSpeciesSearchNames, otherNamesFrom } from "@/lib/species-search-names";
import type { Livestock } from "@/types/aquarium";

// 2026-11-14 sprinti: canlı araması bütün sınıflarda ve türün başka dillerdeki katalog adlarında da arar; pencere boş açılır, elle yazılan
// adet aramayla ezilmez; "Bunu mu demek istedin?" önerileri; bitki araması İngilizce adda da arar. Çözülmemiş satış adı kuralı aynı kalır.
vi.mock("@/providers/i18n-provider", async () => {
  const { messagesFor: messages } = await import("@aquamind/localization");
  return { useI18n: () => ({ t: messages("tr"), locale: "tr", catalogText: (text: string) => text }) };
});
vi.mock("@/lib/use-display-format", async () => {
  const { createDisplayFormat: format } = await import("@aquamind/localization");
  return { useDisplayFormat: () => format("tr", { temperature: "celsius", volume: "liters", dateFormat: "day-first" }) };
});
const { changeLivestockCategory, changeLivestockQuantity, changeLivestockQuery, changeLivestockSpecies, DidYouMean, livestockFormStart, livestockSearch, pickLivestockSuggestion } = await import("@/components/catalog-livestock-form");
await loadLocaleBundle("en");
await loadLocaleBundle("es");

const t = messagesFor("tr");
const translators = (["en", "es"] as const).map((locale) => catalogTranslator(locale, localeBundle(locale)?.catalogSpecies));
const otherNames = otherNamesFrom(buildSpeciesSearchNames(speciesCatalog, translators));
const translatedNameFor = (locale: Locale) => {
  const text = catalogTranslator(locale, localeBundle(locale)?.catalogSpecies);
  return (profile: SpeciesProfile) => { const name = text(profile.commonName); return name !== undefined && name !== profile.commonName ? name : undefined; };
};
const context = (locale: Locale = "tr", withOther = true) => ({ waterType: "freshwater" as const, translatedName: translatedNameFor(locale), otherNames: withOther ? otherNames : undefined });
const species = (id: string) => speciesById(id)!;

describe("arama bütün sınıflarda arar", () => {
  it("Balık seçiliyken \"kiraz karides\" Kiraz karidesi bulur; sınıf ve grup kendiliğinden değişir", () => {
    const start = changeLivestockCategory("fish", "freshwater");
    expect(livestockSearch("kiraz karides", "fish", context())).toMatchObject({ kind: "exact", profile: { id: "cherry-shrimp" } });
    const typed = changeLivestockQuery(start, "kiraz karides", context());
    expect(typed).toMatchObject({ category: "shrimp", group: "shrimp", selected: "cherry-shrimp", quantity: species("cherry-shrimp").minGroup });
    // Salyangoz seçiliyken balık adı da bulunur.
    expect(changeLivestockQuery(changeLivestockCategory("snail", "freshwater"), "neon tetra", context())).toMatchObject({ category: "fish", selected: "neon-tetra" });
    // Kısmi eşleşmede eşit sırada seçili sınıf önce gelir.
    expect(livestockSearch("lepist", "fish", context())).toMatchObject({ kind: "partial", profile: { id: "guppy" } });
  });

  it("çözülmemiş satış adı hangi sınıf seçili olursa olsun seçimi engeller ve sınıfı satış adınınkine çevirir", () => {
    const categories: Livestock["category"][] = ["fish", "shrimp", "snail", "other"];
    for (const listing of unresolvedSpeciesListings) for (const waterType of listing.waterTypes) for (const start of categories) {
      const ctx = { ...context(), waterType };
      for (const name of [listing.name, ...(listing.aliases ?? [])]) {
        const search = livestockSearch(name, start, ctx);
        expect(search.kind, `${name} / ${start}`).toBe("unresolved");
        const state = changeLivestockQuery(changeLivestockCategory(start, waterType), name, ctx);
        expect(state.selected, `${name} / ${start}`).toBe("");
      }
    }
  }, 120_000);
});

describe("başka dillerdeki adlar", () => {
  it("Türkçe ekranda İngilizce ticari adlar türü bulur; İngilizce ekranda Türkçe ad bulur", () => {
    expect(changeLivestockQuery(changeLivestockCategory("fish", "freshwater"), "cherry shrimp", context())).toMatchObject({ category: "shrimp", selected: "cherry-shrimp" });
    expect(changeLivestockQuery(changeLivestockCategory("fish", "freshwater"), "assassin snail", context())).toMatchObject({ category: "snail", selected: "assassin-snail" });
    expect(livestockSearch("ghost shrimp", "fish", context())).toMatchObject({ profile: { id: "ghost-shrimp" } });
    expect(livestockSearch("amano shrimp", "fish", context())).toMatchObject({ profile: { id: "amano-shrimp" } });
    expect(livestockSearch("lepistes", "fish", context("en"))).toMatchObject({ kind: "exact", profile: { id: "guppy" } });
    // Dizin yüklenmeden önce (bugünkü gibi) İngilizce ad Türkçe ekranda bulunmaz.
    expect(livestockSearch("assassin snail", "fish", context("tr", false)).kind).toBe("none");
  });

  it("dizin yalnız Türkçe adlarından farklı adları tutar ve kimlikler katalogdadır", () => {
    const index = buildSpeciesSearchNames(speciesCatalog, translators);
    expect(index["cherry-shrimp"]).toContain("Cherry Shrimp");
    const ids = new Set(speciesCatalog.map((item) => item.id));
    for (const [id, names] of Object.entries(index)) {
      expect(ids.has(id), id).toBe(true);
      expect(names.length, id).toBeGreaterThan(0);
      expect(names.length, id).toBeLessThanOrEqual(2);
    }
    // Parça küçük kalmalı (sayfa hızı): yalnız tür adları.
    expect(JSON.stringify(index).length).toBeLessThan(250_000);
  });
});

describe("boş açılış ve adet", () => {
  it("pencere tür seçmeden açılır; tür seçilince adet türün en az grup sayısıdır, elle yazılan adet aramayla ezilmez", () => {
    const start = livestockFormStart("fish", "freshwater");
    expect(start).toMatchObject({ selected: "", query: "", quantity: 1, quantityTouched: false });
    expect(changeLivestockQuery(start, "neon tetra", context()).quantity).toBe(species("neon-tetra").minGroup);
    const typed = changeLivestockQuantity(start, 3);
    expect(changeLivestockQuery(typed, "neon tetra", context())).toMatchObject({ selected: "neon-tetra", quantity: 3 });
    expect(changeLivestockSpecies(typed, "guppy").quantity).toBe(3);
    expect(pickLivestockSuggestion(typed, species("guppy")).quantity).toBe(3);
    // Aramayı silmek seçimi kaldırır; ekleme düğmesi yine kapanır.
    expect(changeLivestockQuery(changeLivestockQuery(start, "neon tetra", context()), "", context()).selected).toBe("");
  });
});

describe("Bunu mu demek istedin?", () => {
  const sample: SearchSuggestion[] = [
    { term: "Qwxz pırıltı balığı", speciesIds: ["neon-tetra", "guppy"], evidence: [{ url: "https://a.example/x", quote: "bir qwxz pırıltı balığı" }, { url: "https://b.example/y", quote: "Qwxz Pırıltı Balığı" }], addedAt: "2026-11-14" },
  ];

  it("terim katlanarak eşleşir; tür kendiliğinden seçilmez, düğmeye basınca seçilir", () => {
    expect(searchSuggestionsFor("qwxz-PIRILTI  baligi", "freshwater", sample).map((item) => item.id)).toEqual(["neon-tetra", "guppy"]);
    expect(searchSuggestionsFor("qwxz piriltı", "freshwater", sample)).toEqual([]);
    expect(searchSuggestionsFor("Qwxz pırıltı balığı", "saltwater", sample)).toEqual([]);
    const typed = changeLivestockQuery(changeLivestockCategory("fish", "freshwater"), "Qwxz pırıltı balığı", context());
    expect(typed.selected).toBe("");
    expect(pickLivestockSuggestion(typed, species("guppy"))).toMatchObject({ selected: "guppy", fromSuggestion: true, category: "fish" });
    const html = renderToStaticMarkup(createElement(DidYouMean, { suggestions: [species("guppy")], pick: () => {} }));
    expect(html).toContain(t.livestock.form.didYouMean("Lepistes").replace("?", ""));
    expect(html).toMatch(/^<div[^>]*><button type="button" aria-pressed="false" class="[^"]*\bmin-h-11\b/);
  });

  it("ad çok türe gidiyorsa hepsi gelir; ilk altısı görünür, fazlası \"Tümünü göster\" ile açılır", () => {
    expect(DID_YOU_MEAN_LIMIT).toBe(6);
    const many = ["neon-tetra", "guppy", "cherry-shrimp", "molly", "platy", "oscar", "koi-carp", "tiger-barb"];
    const wide: SearchSuggestion[] = [{ ...sample[0], speciesIds: many }];
    expect(searchSuggestionsFor("Qwxz pırıltı balığı", "freshwater", wide).map((item) => item.id)).toEqual(many);
    const html = renderToStaticMarkup(createElement(DidYouMean, { suggestions: many.map(species), pick: () => {} }));
    expect(html.match(/aria-pressed=/g)).toHaveLength(DID_YOU_MEAN_LIMIT);
    expect(html).toContain(t.livestock.form.otherWaterSuggestionsShowAll(many.length));
    const few = renderToStaticMarkup(createElement(DidYouMean, { suggestions: many.slice(0, 6).map(species), pick: () => {} }));
    expect(few).not.toContain(t.livestock.form.otherWaterSuggestionsShowAll(6));
    // Gerçek liste: "Istakoz" katalogdaki bütün tatlı su kerevitlerine gider.
    expect(searchSuggestionsFor("istakoz", "freshwater", searchSuggestions).length).toBeGreaterThan(3);
  });

  it("listedeki her terim pencerede gerçekten öneri olarak çıkar: katalogda eşleşme yok, terimin türleri bu su türünde var", () => {
    for (const { term, speciesIds } of searchSuggestions) {
      for (const water of ["freshwater", "brackish", "saltwater"] as const) {
        const own = speciesIds.filter((id) => speciesWaterTypes(species(id)).includes(water));
        if (!own.length) continue;
        for (const category of ["fish", "shrimp", "snail", "other"] as const) expect(livestockSearch(term, category, { ...context(), waterType: water }).kind, `${term} ${water} ${category}`).toBe("none");
        expect(searchSuggestionsFor(term, water, searchSuggestions).map((item) => item.id), term).toEqual(own);
      }
    }
  });

  it("öneri listesinin bütünlüğü: kimlik katalogda, iki bağımsız siteden terimi içeren kanıt, terim katalog adıyla çakışmaz", () => {
    expect(searchSuggestionProblems(searchSuggestions)).toEqual([]);
    expect(searchSuggestionProblems(sample)).toEqual([]);
    const bad: SearchSuggestion[] = [
      { term: "Lepistes", speciesIds: ["guppy"], evidence: [{ url: "https://a.example/x", quote: "lepistes" }, { url: "https://b.example/y", quote: "Lepistes" }], addedAt: "2026-11-14" },
      { term: "Yok böyle", speciesIds: ["olmayan-tur"], evidence: [{ url: "https://a.example/x", quote: "yok böyle" }, { url: "https://www.a.example/z", quote: "Yok böyle" }], addedAt: "14.11.2026" },
      { term: "Qwxz aynı şirket", speciesIds: ["guppy", "guppy"], evidence: [{ url: "https://www.akvaryum.market/a", quote: "qwxz aynı şirket" }, { url: "https://bitki.market/b", quote: "Qwxz aynı şirket" }, { url: "https://blog.akvaryum.market/c", quote: "qwxz aynı şirket" }], addedAt: "2026-11-14" },
      { term: "Qwxz alıntısız", speciesIds: [], evidence: [{ url: "https://a.example/x", quote: "başka bir şey" }, { url: "https://b.example/y", quote: "qwxz alıntısız" }], addedAt: "2026-11-14" },
    ];
    const problems = searchSuggestionProblems(bad).join("\n");
    expect(problems).toContain("Lepistes: katalogdaki");
    expect(problems).toContain("olmayan kimlik olmayan-tur");
    expect(problems).toContain("Yok böyle: en az iki ayrı siteden kanıt");
    expect(problems).toContain("YYYY-AA-GG");
    // Aynı şirketin siteleri (alt alan adı ya da kardeş site) tek sayılır; aynı tür iki kez yazılamaz.
    expect(problems).toContain("Qwxz aynı şirket: en az iki ayrı siteden kanıt gerekir (1)");
    expect(problems).toContain("Qwxz aynı şirket: aynı tür iki kez");
    expect(problems).toContain("Qwxz alıntısız: alıntı terimi içermiyor (https://a.example/x)");
    expect(problems).toContain("Qwxz alıntısız: en az bir tür");
    expect(evidenceSite("https://mail.akvaryum.com/Forum/x")).toBe("akvaryum.com");
    expect(evidenceSite("https://blog.tetra.net/tr-tr/x")).toBe("tetra.net");
    expect(evidenceSite("https://www.emamapet.com.tr/blog")).toBe("emamapet.com.tr");
    expect(evidenceSite("https://evcilhayvan.market/x")).toBe("akvaryum.market");
  });
});

describe("bitki aramasında \"Bunu mu demek istedin?\"", () => {
  it("terim katlanarak eşleşir ve terimin bütün bitkilerini verir; listedeki her terimde aramada sonuç yoktur", () => {
    expect(plantSuggestionsFor("KRIPTOKORIN", plantSearchSuggestions, plantById).map((item) => item.id)).toEqual(plantSearchSuggestions.find((item) => item.term === "Kriptokorin")!.plantIds);
    expect(plantSuggestionsFor("java eğreltisi", plantSearchSuggestions, plantById)[0]).toMatchObject({ id: "microsorum-pteropus" });
    expect(plantSuggestionsFor("java", plantSearchSuggestions, plantById)).toEqual([]);
    for (const { term } of plantSearchSuggestions) {
      for (const locale of ["tr", "en", "es"] as const) expect(withEnglishPlantMatches(searchPlants(term, locale), searchPlants(term, "en"), locale), `${term} ${locale}`).toEqual([]);
    }
  });

  it("bitki öneri listesinin bütünlüğü canlıdakiyle aynı kuralla", () => {
    expect(plantSearchSuggestionProblems(plantSearchSuggestions, plantCatalog)).toEqual([]);
    const problems = plantSearchSuggestionProblems([
      { term: "Microsorum pteropus", plantIds: ["microsorum-pteropus", "olmayan-bitki"], evidence: [{ url: "https://a.example/x", quote: "Microsorum pteropus" }], addedAt: "2026-11-14" },
    ], plantCatalog).join("\n");
    expect(problems).toContain("katalogdaki bir bitki adıyla aynı");
    expect(problems).toContain("olmayan kimlik olmayan-bitki");
    expect(problems).toContain("en az iki ayrı siteden kanıt gerekir (1)");
  });
});

describe("bitki araması İngilizce adda da arar", () => {
  it("Türkçe ve İspanyolca ekranda \"hornwort\" Tilki kuyruğunu bulur; kayıt adı bilimsel addır", () => {
    for (const locale of ["tr", "es"] as const) {
      const results = withEnglishPlantMatches(searchPlants("hornwort", locale), searchPlants("hornwort", "en"), locale);
      expect(results[0], locale).toMatchObject({ item: { id: "ceratophyllum-demersum" }, matchedName: "Ceratophyllum demersum" });
    }
    // Kendi dilindeki eşleşme önce gelir ve değişmez.
    expect(withEnglishPlantMatches(searchPlants("tilki kuyrugu", "tr"), searchPlants("tilki kuyrugu", "en"), "tr")[0]).toMatchObject({ matchedName: "Tilki kuyruğu" });
    expect(withEnglishPlantMatches(searchPlants("hornwort", "en"), [], "en")).toEqual(searchPlants("hornwort", "en"));
  });
});
