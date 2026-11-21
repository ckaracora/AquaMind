import { existsSync, readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { formatNumber, loadLocaleBundle, localeBundle, messagesFor, SUPPORTED_LOCALES, type Locale } from "@aquamind/localization";
import { catalogTextKey } from "@aquamind/localization/catalog";
import { loadPublicPageMessages } from "@aquamind/localization/public-pages";
import { loadSpeciesCareTexts, speciesCareTextsFor } from "@aquamind/localization/species-care";
import { PublicSpeciesIndex, PublicSpeciesPage } from "@/components/public/public-species-page";
import { isVerifiedSpeciesProfile, speciesById, speciesWaterTypes } from "@/data/catalog-species";
import { searchSuggestions } from "@/data/search-suggestions";
import { speciesBehavior } from "@/data/species-behavior";
import { speciesCare } from "@/data/species-care";
import { requestedSpecies, addRequested } from "@/lib/aquarium-links";
import {
  PUBLIC_SPECIES_IDS, SPECIES_SEGMENT, publicPageMetadata, publicPaths, robotsFile, sitemapFile, speciesIndexPath, speciesPagePath, tryInAppHref,
} from "@/lib/public-pages";
import { groupSources, publicIndexView, publicSpeciesView } from "@/lib/public-species";
import { publicIndexingEnabled, SITE_NAME, siteOrigin } from "@/lib/site-config";

// Herkese açık tür sayfaları (docs/DECISIONS/0047-herkese-acik-tur-sayfalari.md): içerik yalnız katalogdan, Google'a kapalı başlar, üç dilde.

await Promise.all(["en", "es"].map(async (locale) => { await loadLocaleBundle(locale as Locale); await loadSpeciesCareTexts(locale as Locale); }));
const LOCALES = SUPPORTED_LOCALES;
const plain = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/&#x27;/g, "'").replace(/&quot;/g, "\"").replace(/&amp;/g, "&").replace(/\s+/g, " ");
const CLOSED = {} as Record<string, string | undefined>;
const OPEN = { PUBLIC_PAGES_INDEXING: "on", SITE_URL: "https://ornek.example" };

describe("tür listesi", () => {
  it("30 ayrı tür; hepsi katalogda, kaynaklı, doğrulanmış ve tatlı su türü", () => {
    expect(PUBLIC_SPECIES_IDS).toHaveLength(30);
    expect(new Set(PUBLIC_SPECIES_IDS).size).toBe(30);
    for (const id of PUBLIC_SPECIES_IDS) {
      const profile = speciesById(id);
      expect(isVerifiedSpeciesProfile(profile), id).toBe(true);
      expect(speciesWaterTypes(profile!), id).toContain("freshwater");
    }
  });

  it("her türün kaynaklı davranış ya da bakım bilgisi var", () => {
    for (const id of PUBLIC_SPECIES_IDS) expect(Boolean(speciesBehavior[id]?.length || speciesCare[id]), id).toBe(true);
  });

  it("her türün katalog metinleri (ad, notlar, davranış koşulları, bakım metinleri) İngilizce ve İspanyolcada çevrilmiş", () => {
    const missing: string[] = [];
    for (const id of PUBLIC_SPECIES_IDS) {
      const profile = speciesById(id)!;
      const texts = [profile.commonName, profile.communityCaution, profile.husbandryCaution, ...(speciesBehavior[id] ?? []).map((record) => record.condition)].filter((text): text is string => Boolean(text));
      const care = speciesCare[id];
      const careTexts = care ? [care.diet, care.sexing, care.breeding].filter((text): text is string => Boolean(text)) : [];
      for (const locale of ["en", "es"] as const) {
        const table = localeBundle(locale)!.catalogSpecies;
        const careTable = speciesCareTextsFor(locale)!;
        for (const text of texts) if (!(catalogTextKey(text) in table)) missing.push(`${id} ${locale}: ${text.slice(0, 40)}`);
        for (const text of careTexts) if (!(catalogTextKey(text) in careTable)) missing.push(`${id} ${locale} bakım: ${text.slice(0, 40)}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it("gündelik ad önerilerindeki tatlı su türlerinden dokuzu listede (seçim gerekçesi; öbür öneriler deniz, kerevit ya da daha az yaygın)", () => {
    const suggested = new Set(searchSuggestions.flatMap((suggestion) => suggestion.speciesIds));
    expect(PUBLIC_SPECIES_IDS.filter((id) => suggested.has(id)).length).toBeGreaterThanOrEqual(9);
  });
});

describe("adresler", () => {
  it("eşleşmeyen uygulama adresi uygulama yerleşimi altında gerçek 404 verir", async () => {
    const { default: UnknownPage } = await import("@/app/(app)/[...notFound]/page");
    expect(() => UnknownPage()).toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
  });

  it("planlanan biçimde: /tr/tur, /en/species, /es/especies", () => {
    expect(SPECIES_SEGMENT).toEqual({ tr: "tur", en: "species", es: "especies" });
    expect(speciesPagePath("tr", "neon-tetra")).toBe("/tr/tur/neon-tetra");
    expect(speciesPagePath("en", "neon-tetra")).toBe("/en/species/neon-tetra");
    expect(speciesPagePath("es", "neon-tetra")).toBe("/es/especies/neon-tetra");
    expect(speciesIndexPath("es")).toBe("/es/especies");
  });

  it("adres dosyaları her dilin kendi klasöründe; uygulama ekranları kendi grubunda, adresleri değişmeden", () => {
    for (const locale of LOCALES) {
      expect(existsSync(`src/app/(public)/${locale}/layout.tsx`)).toBe(true);
      expect(existsSync(`src/app/(public)/${locale}/${SPECIES_SEGMENT[locale]}/page.tsx`)).toBe(true);
      expect(existsSync(`src/app/(public)/${locale}/${SPECIES_SEGMENT[locale]}/[id]/page.tsx`)).toBe(true);
    }
    expect(existsSync("src/app/layout.tsx")).toBe(false);
    for (const page of ["page.tsx", "livestock/page.tsx", "aquariums/[id]/health/page.tsx", "settings/page.tsx"]) expect(existsSync(`src/app/(app)/${page}`), page).toBe(true);
  });

  it("herkese açık yerleşimde dil seçme betiği ve sağlayıcılar yok; uygulama yerleşiminde ikisi de duruyor", () => {
    const publicSources = ["src/components/public/public-document.tsx", "src/components/public/public-routes.tsx", "src/components/public/public-species-page.tsx", "src/lib/public-species.ts", "src/lib/public-pages.ts"]
      .map((file) => readFileSync(file, "utf8"));
    for (const source of publicSources) {
      expect(source).not.toMatch(/LOCALE_BOOT_SCRIPT|I18nProvider|AquariumProvider|"use client"|localStorage/);
    }
    const appLayout = readFileSync("src/app/(app)/layout.tsx", "utf8");
    expect(appLayout).toContain("LOCALE_BOOT_SCRIPT");
    expect(appLayout).toContain("<I18nProvider><AquariumProvider>");
    expect(appLayout).toContain("robots: { index: false, follow: false }");
  });

  it("\"Kendi akvaryumunda dene\" canlı seçme penceresini bu tür seçili açar", () => {
    const href = tryInAppHref("neon-tetra");
    expect(href.startsWith("/livestock?")).toBe(true);
    const search = href.slice(href.indexOf("?"));
    expect(addRequested(search)).toBe(true);
    expect(requestedSpecies(search)).toBe("neon-tetra");
  });
});

describe("açma ayarı ve üst bilgi", () => {
  it("yalnız PUBLIC_PAGES_INDEXING=on açar", () => {
    expect(publicIndexingEnabled(CLOSED)).toBe(false);
    for (const value of ["1", "true", "ON", "yes", ""]) expect(publicIndexingEnabled({ PUBLIC_PAGES_INDEXING: value })).toBe(false);
    expect(publicIndexingEnabled(OPEN)).toBe(true);
  });

  it("alan adı ortam değişkeninden; yoksa Vercel üretim adresi, o da yoksa yerel adres", () => {
    expect(siteOrigin({ SITE_URL: "https://ornek.example/" })).toBe("https://ornek.example");
    expect(siteOrigin({ SITE_URL: "ornek.example" })).toBe("https://ornek.example");
    expect(siteOrigin({ VERCEL_PROJECT_PRODUCTION_URL: "uygulama.vercel.app" })).toBe("https://uygulama.vercel.app");
    expect(siteOrigin({ VERCEL_PROJECT_PRODUCTION_URL: "https://uygulama.vercel.app" })).toBe("https://uygulama.vercel.app");
    expect(siteOrigin({})).toBe("http://localhost:3000");
  });

  it("uygulama adı tek yerden: dil dosyasındaki ad, üç dilde aynı", async () => {
    for (const locale of LOCALES) expect(messagesFor(locale).app.name).toBe(SITE_NAME);
  });

  it("her sayfada kapalıyken noindex, tek canonical ve üç dilin hreflang bağlantısı", () => {
    for (const { pathFor } of publicPaths()) {
      for (const locale of LOCALES) {
        const meta = publicPageMetadata(locale, pathFor, "başlık", "açıklama", OPEN);
        const closed = publicPageMetadata(locale, pathFor, "başlık", "açıklama", CLOSED);
        expect(closed.robots).toEqual({ index: false, follow: false });
        expect(meta.robots).toEqual({ index: true, follow: true });
        expect(meta.alternates?.canonical).toBe(`https://ornek.example${pathFor(locale)}`);
        expect(meta.alternates?.languages).toEqual({
          tr: `https://ornek.example${pathFor("tr")}`, en: `https://ornek.example${pathFor("en")}`, es: `https://ornek.example${pathFor("es")}`, "x-default": `https://ornek.example${pathFor("en")}`,
        });
      }
    }
    expect(publicPaths()).toHaveLength(31);
  });

  it("robots.txt kapalıyken her şeyi kapatır; açılınca yalnız herkese açık sayfaları açar", () => {
    expect(robotsFile(CLOSED)).toEqual({ rules: [{ userAgent: "*", disallow: "/" }] });
    expect(robotsFile(OPEN)).toEqual({ rules: [{ userAgent: "*", allow: ["/tr/tur", "/en/species", "/es/especies", "/_next/static/", "/icon.svg"], disallow: "/" }], sitemap: "https://ornek.example/sitemap.xml" });
  });

  it("site haritası kapalıyken boş; açılınca 31 sayfa × 3 dil", () => {
    expect(sitemapFile(CLOSED)).toEqual([]);
    const open = sitemapFile(OPEN);
    expect(open).toHaveLength(93);
    expect(open[0]).toEqual({ url: "https://ornek.example/tr/tur", alternates: { languages: { tr: "https://ornek.example/tr/tur", en: "https://ornek.example/en/species", es: "https://ornek.example/es/especies", "x-default": "https://ornek.example/en/species" } } });
  });
});

describe("sayfa içeriği", () => {
  it.each(LOCALES)("%s: başlık ve açıklama dolu, türün adı ve bilimsel adı içinde", async (locale) => {
    const text = await loadPublicPageMessages(locale);
    const index = await publicIndexView(locale);
    expect(index.title.trim()).not.toBe("");
    expect(index.description.trim()).not.toBe("");
    expect(index.species).toHaveLength(30);
    expect(text.tryButton.trim()).not.toBe("");
    for (const id of PUBLIC_SPECIES_IDS) {
      const view = (await publicSpeciesView(locale, id))!;
      expect(view, id).toBeDefined();
      expect(view.title.trim().length, id).toBeGreaterThan(view.name.length);
      expect(view.title).toContain(view.name);
      expect(view.description).toContain(view.name);
      expect(view.description).toContain(view.scientificName);
    }
  });

  it("dilin metinleri gerçekten o dilde: İngilizce ve İspanyolca sayfada Türkçe tür adı ve Türkçe etiket yok", async () => {
    const betta = (locale: Locale) => publicSpeciesView(locale, "betta");
    const tr = (await betta("tr"))!;
    for (const locale of ["en", "es"] as const) {
      const view = (await betta(locale))!;
      expect(view.name).not.toBe(tr.name);
      const html = plain(renderToStaticMarkup(createElement(PublicSpeciesPage, { view })));
      for (const word of ["Katalog değerleri", "Davranış", "Kaynaklar", "Sıcaklık", "Beta balığı"]) expect(html, `${locale} ${word}`).not.toContain(word);
    }
  });

  it.each(LOCALES)("%s: sayfadaki sayılar katalogdakiyle aynı (boy, hacim, uzunluk, grup, sıcaklık, pH)", async (locale) => {
    for (const id of PUBLIC_SPECIES_IDS) {
      const profile = speciesById(id)!;
      const view = (await publicSpeciesView(locale, id))!;
      const html = plain(renderToStaticMarkup(createElement(PublicSpeciesPage, { view })));
      const number = (value: number) => formatNumber(value, locale, { maximumFractionDigits: 3 });
      const range = (low: number, high: number) => (low === high ? number(low) : `${number(low)}–${number(high)}`);
      const expected = [
        `${number(profile.adultSizeCm)} cm`,
        `${number(profile.minVolumeL)} L`,
        ...(profile.minTankLengthCm !== undefined ? [`${number(profile.minTankLengthCm)} cm`] : []),
        messagesFor(locale).livestock.card.count(profile.minGroup),
        `${range(profile.temperature[0], profile.temperature[1])} °C`,
        ...(profile.ph ? [range(profile.ph[0], profile.ph[1])] : []),
        ...(profile.additionalVolumePerAnimalL ? [`${number(profile.additionalVolumePerAnimalL)} L`] : []),
      ];
      for (const value of expected) expect(html, `${locale} ${id}: ${value}`).toContain(value);
      // Katalogda olmayan satır çizilmez.
      const labels = messagesFor(locale).livestock.card;
      if (!profile.ph) expect(view.facts.map((row) => row.label), id).not.toContain(labels.ph);
      if (profile.minTankLengthCm === undefined) expect(view.facts.map((row) => row.label), id).not.toContain(labels.minLength);
      if (!profile.flow) expect(view.facts.map((row) => row.label), id).not.toContain(labels.flow);
    }
  });

  it("İngilizce sayfa ABD birimlerini parantez içinde ekler; Türkçe ve İspanyolca yalnız metrik", async () => {
    const en = plain(renderToStaticMarkup(createElement(PublicSpeciesPage, { view: (await publicSpeciesView("en", "neon-tetra"))! })));
    expect(en).toContain("54 L (14.3 gal)");
    expect(en).toContain("21–25 °C (69.8–77 °F)");
    expect(en).toContain("3 cm (1.2 in)");
    for (const locale of ["tr", "es"] as const) {
      const html = plain(renderToStaticMarkup(createElement(PublicSpeciesPage, { view: (await publicSpeciesView(locale, "neon-tetra"))! })));
      expect(html).not.toMatch(/gal\b|°F/);
    }
  });

  it("kaynak adları ve bağlantıları sayfanın altında; bütün kaynak adresleri https", async () => {
    for (const id of PUBLIC_SPECIES_IDS) {
      const view = (await publicSpeciesView("tr", id))!;
      expect(view.sources.length, id).toBeGreaterThan(0);
      for (const source of view.sources) for (const url of source.urls) expect(url).toMatch(/^https:\/\//);
      const html = renderToStaticMarkup(createElement(PublicSpeciesPage, { view }));
      expect(html).toContain(`href="${view.sources[0].urls[0].replace(/&/g, "&amp;")}"`);
      expect(html).toContain(`href="/livestock?add=1&amp;species=${id}"`);
    }
  });

  it("aynı adlı kaynaklar tek adın altında toplanır", () => {
    expect(groupSources([{ name: "A", url: "https://a/1" }, { name: "B", url: "https://b/1" }, { name: "A", url: "https://a/2" }]))
      .toEqual([{ name: "A", urls: ["https://a/1", "https://a/2"] }, { name: "B", urls: ["https://b/1"] }]);
  });

  it("listede olmayan tür için sayfa yok", async () => {
    expect(await publicSpeciesView("tr", "ocellaris-clownfish")).toBeUndefined();
    expect(await publicSpeciesView("tr", "yok-boyle-tur")).toBeUndefined();
  });

  it("dizin her türe kendi dilinin adresiyle bağlanır", async () => {
    for (const locale of LOCALES) {
      const view = await publicIndexView(locale);
      const html = renderToStaticMarkup(createElement(PublicSpeciesIndex, { view }));
      for (const id of PUBLIC_SPECIES_IDS) expect(html).toContain(`href="${speciesPagePath(locale, id)}"`);
    }
  });
});
