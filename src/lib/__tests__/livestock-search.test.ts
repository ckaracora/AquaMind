import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { loadLocaleBundle, localeBundle, messagesFor, type Locale } from "@aquamind/localization";
import { catalogTranslator } from "@aquamind/localization/catalog";
import { normalize } from "@/data/catalog-shared";
import { speciesById, speciesCatalog, speciesForCatalogSearch, speciesForOtherWaterExactSearch, speciesWaterTypes, type SpeciesProfile } from "@/data/catalog-species";
import type { Aquarium, AquariumType, Livestock } from "@/types/aquarium";

// Canlı ekleme penceresinde arama önerisi (ürün sahibi kararı 2026-11-11). Aranan ad başka su türündeki bir türün tam adıysa tür
// kendiliğinden seçilmez: uyarı çıkar, bu akvaryuma uygun benzer adlı türler düğme olarak gösterilir, kullanıcı tıklarsa seçilir.
// Pencerenin seçim kuralları bileşenin kullandığı saf işlevlerle, uyarı ve tür kartı gerçek bileşen çıktısıyla sınanır; dil ve görüntü
// biçimi sağlayıcı yerine sınama değerleriyle verilir.
const store = vi.hoisted(() => ({ locale: "tr" as "tr" | "en" | "es" }));
vi.mock("@/providers/i18n-provider", async () => {
  const { localeBundle: bundle, messagesFor: messages } = await import("@aquamind/localization");
  const { catalogTranslator: translator } = await import("@aquamind/localization/catalog");
  return { useI18n: () => ({ t: messages(store.locale), locale: store.locale, catalogText: translator(store.locale, bundle(store.locale)?.catalogSpecies) }) };
});
vi.mock("@/lib/use-display-format", async () => {
  const { createDisplayFormat: format } = await import("@aquamind/localization");
  return { useDisplayFormat: () => format("tr", { temperature: "celsius", volume: "liters", dateFormat: "day-first" }) };
});
const {
  CatalogLivestockForm, changeLivestockCategory, changeLivestockGroup, changeLivestockQuery, changeLivestockSpecies, livestockSearch, OtherWaterNotice,
  pickLivestockSuggestion, SelectedSpeciesCard, showAllLivestockSuggestions, VISIBLE_SUGGESTIONS,
} = await import("@/components/catalog-livestock-form");
await loadLocaleBundle("en");
await loadLocaleBundle("es");
afterEach(() => { store.locale = "tr"; });

const t = messagesFor("tr");
const waterTypes = ["freshwater", "brackish", "saltwater"] as const;
const norm = (value: string) => normalize(value) ?? "";
const decode = (html: string) => html.replace(/&#x27;/g, "'").replace(/&quot;/g, "\"").replace(/&amp;/g, "&");
const plain = (html: string) => decode(html.replace(/<[^>]+>/g, ""));
const buttons = (html: string): string[] => [...(html.match(/<button[^>]*>[\s\S]*?<\/button>/g) ?? [])];
const species = (id: string) => speciesById(id)!;

// Pencerenin verdiği çeviri adı: aramayla aynı biçimde, yalnız Türkçe addan farklıysa (bileşendeki `translatedName` ile aynı kural).
const translatedNames = new Map<Locale, (profile: SpeciesProfile) => string | undefined>();
const translatedNameFor = (locale: Locale) => {
  if (!translatedNames.has(locale)) {
    const text = catalogTranslator(locale, localeBundle(locale)?.catalogSpecies);
    const cache = new Map<string, string | undefined>();
    translatedNames.set(locale, (profile) => {
      if (!cache.has(profile.id)) { const name = text(profile.commonName); cache.set(profile.id, name !== undefined && name !== profile.commonName ? norm(name) : undefined); }
      return cache.get(profile.id);
    });
  }
  return translatedNames.get(locale)!;
};
const contextFor = (waterType: AquariumType, locale: Locale = "tr") => ({ waterType, translatedName: translatedNameFor(locale) });

type NoticeProps = Parameters<typeof OtherWaterNotice>[0];
const renderNotice = (props: Omit<NoticeProps, "pick" | "showAllSuggestions" | "showAll"> & { showAll?: boolean }) =>
  decode(renderToStaticMarkup(createElement(OtherWaterNotice, { showAll: false, pick: () => {}, showAllSuggestions: () => {}, ...props })));
const noticeFor = (query: string, category: Livestock["category"], waterType: AquariumType, locale: Locale = "tr") => {
  const search = livestockSearch(query, category, contextFor(waterType, locale));
  if (search.kind !== "otherWater") throw new Error(`${query}: başka su türü uyarısı yok (${search.kind})`);
  return { match: search.profile, aquariumType: waterType, suggestions: search.suggestions, query: norm(query) };
};

// Bugün kendiliğinden seçime düşen 6 ad (taslak "Altı adın hepsinde aynı düzen"); öneriler katalog sırasıyla.
const sixNames = [
  { query: "Mavi neon gobi", category: "fish", waterType: "freshwater", found: "blue-neon-goby", suggestions: ["blue-neon-goby-atropurpureus"], labels: ["Filipin mavi neon gobisi"] },
  { query: "Koi", category: "fish", waterType: "brackish", found: "koi-carp", suggestions: ["guppy", "swordtail"], labels: ["Lepistes (Koi lepistes)", "Kılıçkuyruk (Koi kılıçkuyruk)"] },
  { query: "Angelfish", category: "fish", waterType: "brackish", found: "angelfish", suggestions: ["silver-mono"], labels: ["Gümüş Mono / Mono Argentus (Mono Angelfish)"] },
  { query: "Melek balığı", category: "fish", waterType: "saltwater", found: "angelfish", suggestions: ["flame-angelfish"], labels: ["Alev cüce melek balığı"] },
  { query: "Angelfish", category: "fish", waterType: "saltwater", found: "angelfish", suggestions: ["flame-angelfish", "silver-mono"], labels: ["Alev cüce melek balığı (Flame Angelfish)", "Gümüş Mono / Mono Argentus (Mono Angelfish)"] },
  { query: "Turbo salyangoz", category: "snail", waterType: "saltwater", found: "turbo-snail", suggestions: ["marine-turbo-snail"], labels: ["Deniz turbo salyangozu"] },
] as const;

describe("başka su türündeki tam ad: uyarı ve öneri, kendiliğinden seçim yok", () => {
  it("6 adın hepsinde uyarı çıkar, tür seçilmez; öneriler bu akvaryum türündeki bütün kısmi eşleşmelerdir", () => {
    for (const { query, category, waterType, found, suggestions } of sixNames) {
      const label = `${query} / ${waterType}`;
      const search = livestockSearch(query, category, contextFor(waterType));
      expect(search.kind, label).toBe("otherWater");
      if (search.kind !== "otherWater") continue;
      expect(search.profile.id, label).toBe(found);
      expect(search.suggestions.map((item) => item.id), label).toEqual([...suggestions]);
      // Bugün kendiliğinden seçilen tür (katalog sırasındaki ilk kısmi eşleşme) artık yalnız ilk öneridir.
      expect(speciesForCatalogSearch(query, category, waterType)?.id, label).toBe(suggestions[0]);
      const start = changeLivestockCategory(category, waterType);
      const typed = changeLivestockQuery(start, query, contextFor(waterType));
      expect(typed, label).toEqual({ ...start, query, selected: "", fromSuggestion: false, showAllSuggestions: false });
    }
  });

  it("6 adın uyarısı türün adını, neden uymadığını ve öneri düğmelerini taslaktaki gibi yazar", () => {
    for (const { query, category, waterType, found, labels } of sixNames) {
      const label = `${query} / ${waterType}`;
      const html = renderNotice(noticeFor(query, category, waterType));
      expect(html, label).toContain(t.livestock.form.otherWaterTitle);
      expect(html, label).toContain(species(found).commonName);
      expect(html, label).toContain(species(found).scientificName);
      expect(html, label).toContain(t.livestock.form.otherWaterText(waterType, speciesWaterTypes(species(found))));
      expect(html, label).toContain(t.livestock.form.otherWaterSuggestions(labels.length));
      expect(html, label).toContain(t.livestock.form.otherWaterSuggestionHint);
      const shown = buttons(html);
      expect(shown, label).toHaveLength(labels.length);
      shown.forEach((button, index) => {
        expect(button, label).toMatch(/^<button type="button" aria-pressed="false" class="[^"]*\bmin-h-11\b/);
        expect(plain(button), label).toBe(`${labels[index]}${species(sixNames.find((item) => item.query === query && item.waterType === waterType)!.suggestions[index]).scientificName}${t.livestock.form.otherWaterSuggestionChoose}`);
      });
    }
    // Tek öneride başlık tekildir.
    expect(renderNotice(noticeFor("Turbo salyangoz", "snail", "saltwater"))).toContain(">Bu akvaryuma uygun benzer adlı tür<");
    expect(renderNotice(noticeFor("Koi", "fish", "brackish"))).toContain(">Bu akvaryuma uygun benzer adlı türler<");
  });

  it("aranan metin addaki yazımıyla vurgulanır", () => {
    const koi = renderNotice(noticeFor("Koi", "fish", "brackish"));
    expect(koi).toMatch(/\(<span class="[^"]*underline[^"]*">Koi<\/span> lepistes\)/);
    const turbo = renderNotice(noticeFor("TURBO  SALYANGOZ", "snail", "saltwater"));
    expect(turbo).toMatch(/Deniz <span class="[^"]*underline[^"]*">turbo salyangoz<\/span>u/);
    const angel = renderNotice(noticeFor("MELEK BALIĞI", "fish", "saltwater"));
    expect(angel).toMatch(/Alev cüce <span class="[^"]*underline[^"]*">melek balığı<\/span>/);
  });

  it("İngilizce ve İspanyolca ekranda başka su türündeki türün çeviri adı da uyarı çıkarır; kısmi eşleşme seçilmez", () => {
    const cases = [
      // Türkçe adla da başka su türünde bulunur, ama bugün İngilizce adın kısmi eşleşmesi ("Philippine Blue Neon Goby") seçiliyordu.
      { locale: "en", query: "Neon Goby", category: "fish", waterType: "freshwater", found: "blue-neon-goby", suggestions: ["blue-neon-goby-atropurpureus"] },
      // Yalnız çeviri adıyla bulunur.
      { locale: "es", query: "Gobio neón azul", category: "fish", waterType: "freshwater", found: "blue-neon-goby", suggestions: ["blue-neon-goby-atropurpureus"] },
      { locale: "es", query: "Pez ángel", category: "fish", waterType: "saltwater", found: "angelfish", suggestions: ["flame-angelfish"] },
      { locale: "es", query: "Caracol turbo", category: "snail", waterType: "saltwater", found: "turbo-snail", suggestions: ["marine-turbo-snail"] },
      { locale: "en", query: "Siamese fighting fish", category: "fish", waterType: "brackish", found: "betta", suggestions: [] },
      { locale: "en", query: "Koi Carp", category: "fish", waterType: "brackish", found: "koi-carp", suggestions: [] },
      { locale: "en", query: "Koi", category: "fish", waterType: "brackish", found: "koi-carp", suggestions: ["guppy", "swordtail"] },
    ] as const;
    for (const { locale, query, category, waterType, found, suggestions } of cases) {
      const label = `${locale}: ${query} / ${waterType}`;
      const context = contextFor(waterType, locale);
      const search = livestockSearch(query, category, context);
      expect(search.kind, label).toBe("otherWater");
      if (search.kind !== "otherWater") continue;
      expect(search.profile.id, label).toBe(found);
      expect(search.suggestions.map((item) => item.id), label).toEqual([...suggestions]);
      expect(changeLivestockQuery(changeLivestockCategory(category, waterType), query, context).selected, label).toBe("");
    }
    // Eski Türkçe arama çeviri adını bilmez; eskiden bu adlarda uyarı çıkmıyordu.
    expect(speciesForOtherWaterExactSearch("Gobio neón azul", "fish", "freshwater")).toBeUndefined();
    expect(speciesForOtherWaterExactSearch("Siamese fighting fish", "fish", "brackish")).toBeUndefined();
    expect(livestockSearch("Siamese fighting fish", "fish", contextFor("brackish")).kind).toBe("none");
  });

  it("çeviri adının kendi su türündeki tam eşleşmesi bugünkü gibi o türü seçer", () => {
    const context = contextFor("freshwater", "es");
    const search = livestockSearch("Carpa koi", "fish", context);
    expect(search).toMatchObject({ kind: "exact", profile: { id: "koi-carp" } });
    expect(changeLivestockQuery(changeLivestockCategory("fish", "freshwater"), "Carpa koi", context)).toMatchObject({ selected: "koi-carp", group: "coldwater" });
  });

  it("eşleşme sırası: boş arama, bu su türünde tam ad, çözülmemiş satış adı, başka su türünde tam ad, kısmi ad, hiçbiri", () => {
    const fresh = contextFor("freshwater");
    const start = changeLivestockCategory("fish", "freshwater");
    expect(livestockSearch("  ", "fish", fresh).kind).toBe("empty");
    expect(changeLivestockQuery({ ...start, selected: "" }, "  ", fresh)).toMatchObject({ selected: start.selected, quantity: start.quantity });
    expect(livestockSearch("Lepistes", "fish", fresh)).toMatchObject({ kind: "exact", profile: { id: "guppy" } });
    expect(livestockSearch("SİLVER ARGUS", "fish", fresh)).toMatchObject({ kind: "unresolved", listing: { name: "SİLVER ARGUS BALIKLARI" } });
    // Çözülmemiş satış adının kendisi başka su türündeki tam adın önüne geçer (veri testi, 2026-11-10).
    expect(livestockSearch("Blue Neon Goby", "fish", fresh)).toMatchObject({ kind: "unresolved", listing: { name: "BLUE NEON GOBBY GOBİ" } });
    expect(livestockSearch("ARGUS BALIKLARI", "fish", fresh)).toMatchObject({ kind: "otherWater", profile: { id: "spotted-scat" } });
    expect(livestockSearch("lepist", "fish", fresh)).toMatchObject({ kind: "partial", profile: { id: "guppy" } });
    expect(changeLivestockQuery(start, "lepist", fresh)).toMatchObject({ group: "livebearer", selected: "guppy", quantity: species("guppy").minGroup, fromSuggestion: false });
    expect(livestockSearch("böyle bir balık yok", "fish", fresh).kind).toBe("none");
    expect(changeLivestockQuery(start, "böyle bir balık yok", fresh).selected).toBe("");
  });

  it("bütün katalog adları: başka su türündeki tam ad hiçbir dilde kendiliğinden kısmi seçime ya da sessiz sonuca düşmez", () => {
    const offenders: string[] = [];
    let checked = 0;
    for (const locale of ["tr", "en", "es"] as const) {
      const text = catalogTranslator(locale, localeBundle(locale)?.catalogSpecies);
      for (const profile of speciesCatalog) {
        const translated = text(profile.commonName);
        const names = new Set([profile.commonName, profile.scientificName, ...(profile.aliases ?? []), ...(translated === undefined ? [] : [translated])]);
        for (const waterType of waterTypes) {
          if (speciesWaterTypes(profile).includes(waterType)) continue;
          const context = contextFor(waterType, locale);
          const start = changeLivestockCategory(profile.category, waterType);
          for (const name of names) {
            checked += 1;
            const search = livestockSearch(name, profile.category, context);
            const selected = changeLivestockQuery(start, name, context).selected;
            // Kabul edilen sonuçlar: uyarı (seçim yok); ad bu su türünde de bir türün tam adıysa o tür; çözülmemiş satış adının kendisi.
            const accepted = search.kind === "otherWater" ? selected === ""
              : search.kind === "exact" ? selected === search.profile.id
                : search.kind === "unresolved" ? selected === "" && [search.listing.name, ...(search.listing.aliases ?? [])].some((item) => norm(item) === norm(name))
                  : false;
            if (!accepted) offenders.push(`${locale}: ${name} / ${profile.category} / ${waterType} → ${search.kind}${"profile" in search ? ` ${search.profile.id}` : ""} (seçim: ${selected || "yok"})`);
          }
        }
      }
    }
    expect(checked).toBeGreaterThan(12_000);
    expect(offenders).toEqual([]);
  }, 180_000);
});

describe("öneriye tıklama", () => {
  const brackish = contextFor("brackish");
  const typedKoi = () => changeLivestockQuery(changeLivestockCategory("fish", "brackish"), "Koi", brackish);

  it("grup türün grubuna geçer, tür seçilir, adet türün en az grup sayısı olur ve öneriden seçildiği tutulur", () => {
    const picked = pickLivestockSuggestion(typedKoi(), species("guppy"));
    expect(picked).toMatchObject({ query: "Koi", group: "livebearer", selected: "guppy", quantity: species("guppy").minGroup, fromSuggestion: true });
    const other = pickLivestockSuggestion({ ...picked, quantity: 9 }, species("swordtail"));
    expect(other).toMatchObject({ selected: "swordtail", quantity: species("swordtail").minGroup, fromSuggestion: true });
    // Seçili öneriye yeniden tıklamak kullanıcının yazdığı adedi bozmaz.
    expect(pickLivestockSuggestion({ ...other, quantity: 9 }, species("swordtail")).quantity).toBe(9);
  });

  it("öneri başka gruptaysa grup değişir (tatlı suda Mavi neon gobi: Tetralar → Goby ve kaya balıkları)", () => {
    const fresh = contextFor("freshwater");
    const typed = changeLivestockQuery(changeLivestockCategory("fish", "freshwater"), "Mavi neon gobi", fresh);
    expect(typed.group).toBe("tetra");
    expect(pickLivestockSuggestion(typed, species("blue-neon-goby-atropurpureus"))).toMatchObject({ group: "goby", selected: "blue-neon-goby-atropurpureus", fromSuggestion: true });
  });

  it("öneri bilgisi arama, sınıf ya da grup değişince ve listeden başka tür seçilince silinir; \"Tümünü göster\" de aramayla kapanır", () => {
    const picked = pickLivestockSuggestion(showAllLivestockSuggestions(typedKoi()), species("guppy"));
    expect(picked).toMatchObject({ fromSuggestion: true, showAllSuggestions: true });
    const afterwards = {
      "arama değişti": changeLivestockQuery(picked, "Koi l", brackish),
      "arama silindi": changeLivestockQuery(picked, "", brackish),
      "aynı ad yeniden yazıldı": changeLivestockQuery(picked, "Koi", brackish),
      "grup değişti": changeLivestockGroup(picked, "livebearer", "brackish"),
      "sınıf değişti": changeLivestockCategory("fish", "brackish"),
      "listeden tür seçildi": changeLivestockSpecies(picked, "swordtail"),
    };
    for (const [label, state] of Object.entries(afterwards)) expect(state.fromSuggestion, label).toBe(false);
    for (const label of ["arama değişti", "arama silindi", "aynı ad yeniden yazıldı", "grup değişti", "sınıf değişti"] as const) expect(afterwards[label].showAllSuggestions, label).toBe(false);
    // Aynı ad yeniden yazılınca seçim yine boştur: tür yalnız tıklamayla seçilir.
    expect(afterwards["aynı ad yeniden yazıldı"].selected).toBe("");
  });
});

describe("uyarının görünümü", () => {
  const koi = () => noticeFor("Koi", "fish", "brackish");

  it("öneri seçilince uyarı küçülür: başlık ve aranan türün adı kalır, öbür öneri görünür kalır; seçilen düğme basılı görünür", () => {
    const before = renderNotice(koi());
    expect(before).toContain("<p class=\"sr-only\" aria-live=\"polite\"></p>");
    const after = renderNotice({ ...koi(), selectedId: "guppy", announced: "Lepistes" });
    expect(after).toContain(t.livestock.form.otherWaterTitle);
    expect(after).toContain(">Koi sazanı<");
    expect(after).not.toContain("Cyprinus carpio");
    expect(after).not.toContain(t.livestock.form.otherWaterText("brackish", ["freshwater"]));
    expect(after).not.toContain(t.livestock.form.otherWaterSuggestionHint);
    expect(after).toContain(t.livestock.form.otherWaterSuggestions(2));
    const [guppy, swordtail] = buttons(after);
    expect(guppy).toContain("aria-pressed=\"true\"");
    expect(plain(guppy)).toBe(`Lepistes (Koi lepistes)Poecilia reticulata${t.livestock.form.otherWaterSuggestionChosen}`);
    expect(swordtail).toContain("aria-pressed=\"false\"");
    expect(plain(swordtail)).toContain(t.livestock.form.otherWaterSuggestionChoose);
    // Seçim ekran okuyucuya okunur.
    expect(after).toContain("<p class=\"sr-only\" aria-live=\"polite\">Lepistes seçildi.</p>");
  });

  it("en çok üç öneri görünür; fazlası \"Tümünü göster\" düğmesinin arkasındadır", () => {
    const many = speciesCatalog.filter((item) => item.category === "fish" && speciesWaterTypes(item).includes("brackish")).slice(0, 5);
    expect(many).toHaveLength(5);
    const props = { match: species("koi-carp"), aquariumType: "brackish" as const, suggestions: many, query: "" };
    const closed = buttons(renderNotice(props));
    expect(closed).toHaveLength(VISIBLE_SUGGESTIONS + 1);
    expect(closed.slice(0, VISIBLE_SUGGESTIONS).map((button) => button.includes("aria-pressed"))).toEqual([true, true, true]);
    expect(closed[VISIBLE_SUGGESTIONS]).toMatch(/^<button type="button" class="[^"]*\bmin-h-11\b[^"]*\bw-full\b/);
    expect(plain(closed[VISIBLE_SUGGESTIONS])).toBe("Tümünü göster (5)");
    const open = buttons(renderNotice({ ...props, showAll: true }));
    expect(open).toHaveLength(5);
    expect(open.every((button) => button.includes("aria-pressed=\"false\""))).toBe(true);
    // Listeden seçilen tür sınırın dışındaysa dördüncü öneri eklenmez; yalnız Tümünü göster ile görünür.
    const selectedHidden = buttons(renderNotice({ ...props, selectedId: many[4].id }));
    expect(selectedHidden).toHaveLength(VISIBLE_SUGGESTIONS + 1);
    expect(selectedHidden.slice(0, VISIBLE_SUGGESTIONS).every((button) => button.includes("aria-pressed=\"false\""))).toBe(true);
    expect(plain(selectedHidden[VISIBLE_SUGGESTIONS])).toBe("Tümünü göster (5)");
    const revealed = buttons(renderNotice({ ...props, selectedId: many[4].id, showAll: true }));
    expect(revealed).toHaveLength(5);
    expect(revealed[4]).toContain("aria-pressed=\"true\"");
    // Üç ya da daha az öneride düğme yoktur.
    expect(buttons(renderNotice({ ...props, suggestions: many.slice(0, 3) }))).toHaveLength(3);
  });

  it("önerisi olmayan adda yalnız bugünkü uyarı çıkar", () => {
    const html = renderNotice(noticeFor("Koi sazanı", "fish", "brackish"));
    expect(html).toContain(t.livestock.form.otherWaterText("brackish", ["freshwater"]));
    expect(html).not.toContain(t.livestock.form.otherWaterSuggestions(1));
    expect(buttons(html)).toEqual([]);
  });

  it("İngilizce ve İspanyolca ekranda çeviri adları ve yeni metinler", () => {
    store.locale = "en";
    const en = renderNotice({ ...noticeFor("Koi", "fish", "brackish", "en"), selectedId: "guppy", announced: "Guppy" });
    expect(en).toContain(">Koi Carp<");
    expect(en).toContain(">Similarly named species that suit this aquarium<");
    expect(buttons(en).map(plain)).toEqual(["Guppy (Koi lepistes)Poecilia reticulataSelected", "Swordtail (Koi kılıçkuyruk)Xiphophorus helleriiSelect"]);
    expect(en).toContain(">Guppy selected.</p>");
    store.locale = "es";
    const es = renderNotice(noticeFor("Caracol turbo", "snail", "saltwater", "es"));
    expect(es).toContain(">Caracol turbo<");
    expect(es).toContain(">Especie de nombre parecido apta para este acuario<");
    expect(es).toContain(">Si eliges una, el volumen y la compatibilidad se calculan para esa especie.<");
    expect(buttons(es).map(plain)).toEqual(["Caracol turbo de marAstraea sp.Elegir"]);
  });
});

describe("tür kartı ve pencere", () => {
  it("tür öneriden seçildiyse kartın altında kullanıcının aradığı adla yazar", () => {
    const chosen = plain(renderToStaticMarkup(createElement(SelectedSpeciesCard, { profile: species("guppy"), searchedFor: "Koi" })));
    expect(chosen).toContain("Bu türü öneriden sen seçtin. Aradığın ad: Koi");
    const listed = plain(renderToStaticMarkup(createElement(SelectedSpeciesCard, { profile: species("guppy") })));
    expect(listed).toContain("Lepistes");
    expect(listed).not.toContain("öneriden");
  });

  it("pencere açılınca arama boştur, uyarı yoktur ve sınıfın ilk türü seçilidir", () => {
    const aquarium: Aquarium = { id: "a", name: "Argus akvaryumu", type: "brackish", lengthCm: 100, widthCm: 40, heightCm: 50, netVolumeLiters: 120, setupDate: "2026-01-01" };
    const html = decode(renderToStaticMarkup(createElement(CatalogLivestockForm, { aquarium, initialCategory: "fish", close: () => {}, submit: () => {} })));
    expect(html).toContain(t.livestock.form.title);
    expect(html).not.toContain(t.livestock.form.otherWaterTitle);
    const first = changeLivestockCategory("fish", "brackish");
    expect(html).toContain(`<option value="${first.selected}" selected="">`);
  });
});

describe("yeni metinler", () => {
  it("Türkçe, ABD İngilizcesi ve Latin Amerika İspanyolcası", () => {
    const expected = {
      tr: ["Bu akvaryuma uygun benzer adlı tür", "Bu akvaryuma uygun benzer adlı türler", "Seçersen hacim ve uyumluluk hesabı bu türe göre yapılır.", "Seç", "Seçildi", "Tümünü göster (4)", "Lepistes seçildi.", "Bu türü öneriden sen seçtin. Aradığın ad: Koi"],
      en: ["Similarly named species that suits this aquarium", "Similarly named species that suit this aquarium", "If you choose one, volume and compatibility are calculated for that species.", "Select", "Selected", "Show all (4)", "Guppy selected.", "You chose this species from a suggestion. You searched for: Koi"],
      es: ["Especie de nombre parecido apta para este acuario", "Especies de nombre parecido aptas para este acuario", "Si eliges una, el volumen y la compatibilidad se calculan para esa especie.", "Elegir", "Elegida", "Mostrar todas (4)", "Se eligió Guppy.", "Elegiste esta especie de una sugerencia. Buscaste: Koi"],
    } as const;
    for (const locale of ["tr", "en", "es"] as const) {
      const f = messagesFor(locale).livestock.form;
      const name = locale === "tr" ? "Lepistes" : "Guppy";
      expect([f.otherWaterSuggestions(1), f.otherWaterSuggestions(2), f.otherWaterSuggestionHint, f.otherWaterSuggestionChoose, f.otherWaterSuggestionChosen, f.otherWaterSuggestionsShowAll(4), f.otherWaterSuggestionPicked(name), f.chosenFromSuggestion("Koi")], locale).toEqual(expected[locale]);
    }
  });
});
