import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { loadLocaleBundle, messagesFor } from "@aquamind/localization";
import { catalogTranslator } from "@aquamind/localization/catalog";
import { enCatalogSpeciesCare } from "../../../packages/localization/src/messages/en-catalog-species-care";
import { speciesById } from "@/data/catalog-species";
import { speciesBehavior } from "@/data/species-behavior";
import { speciesCare } from "@/data/species-care";

// Tür kartının çizimi (veri sprinti F): katalog değerleri, davranış özeti, bakım bilgisi ve kaynaklar; olmayan alan çizilmez. Dil ve görüntü
// biçimi sağlayıcı yerine sınama değerleriyle verilir (src/lib/__tests__/livestock-search.test.ts ile aynı yöntem).
const store = vi.hoisted(() => ({ locale: "tr" as "tr" | "en" | "es" }));
vi.mock("@/providers/i18n-provider", async () => {
  const { localeBundle: bundle, messagesFor: messages } = await import("@aquamind/localization");
  const { catalogTranslator: translator } = await import("@aquamind/localization/catalog");
  return { useI18n: () => ({ t: messages(store.locale), locale: store.locale, catalogText: translator(store.locale, bundle(store.locale)?.catalogSpecies) }) };
});
vi.mock("@/lib/use-display-format", async () => {
  const { createDisplayFormat: format } = await import("@aquamind/localization");
  return { useDisplayFormat: () => format(store.locale, { temperature: "celsius", volume: "liters", dateFormat: "day-first" }) };
});
const { SpeciesCardContent } = await import("@/components/species-card");
await loadLocaleBundle("en");
await loadLocaleBundle("es");
afterEach(() => { store.locale = "tr"; });

const plain = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/&#x27;/g, "'").replace(/&quot;/g, "\"").replace(/&amp;/g, "&").replace(/\s+/g, " ");
const render = (id: string, loaded = true, careText: (text: string) => string | undefined = (text) => text) => {
  const profile = speciesById(id)!;
  return plain(renderToStaticMarkup(createElement(SpeciesCardContent, { profile, titleId: "t", data: loaded ? { behavior: speciesBehavior[id], care: speciesCare[id] } : undefined, failed: false, retry: () => {}, close: () => {}, careText })));
};

describe("tür kartı", () => {
  it("katalog değerlerini, davranışı, bakım bilgisini ve kaynakları gösterir", () => {
    const c = messagesFor("tr").livestock.card;
    const text = render("zebra-danio");
    const profile = speciesById("zebra-danio")!;
    expect(text).toContain(c.catalogTitle);
    expect(text).toContain(`${c.adultSize} ${String(profile.adultSizeCm).replace(".", ",")} cm`);
    expect(text).toContain(c.count(profile.minGroup));
    expect(text).toContain(c.careTitle);
    expect(text).toContain(speciesCare["zebra-danio"].diet!);
    expect(text).toContain(c.lifespanValue("3,5", "3,5", "about"));
    expect(text).toContain("5–20 dGH");
    expect(text).toContain(c.hardnessNote);
    expect(text).toContain("Seriously Fish");
    expect(text).toContain("FishBase");
    expect(text).toMatch(/Son doğrulama: \S*2026/);
  });

  it("'barışçıl' kaydı 'Kaynağa göre barışçıl' yazar; davranış kaydı olmayan tür 'Kaynaklar uyumunu yazmıyor' der", () => {
    const peaceful = Object.keys(speciesBehavior).find((id) => speciesById(id) && speciesBehavior[id].every((record) => record.flag === "peaceful"))!;
    expect(render(peaceful)).toContain("Kaynağa göre barışçıl");
    const unknown = ["neon-tetra", "cardinal-tetra", "guppy", "zebra-danio", "goldfish"].map((id) => speciesById(id)!).find((profile) => !speciesBehavior[profile.id] && !profile.communityCaution && !profile.predatory && !profile.speciesOnly);
    if (unknown) expect(render(unknown.id)).toContain("Kaynaklar uyumunu yazmıyor");
  });

  it("olmayan alan çizilmez: bakım kaydı olmayan türde bakım bölümü, uzunluğu olmayan türde uzunluk satırı yok", () => {
    const c = messagesFor("tr").livestock.card;
    const withoutCare = Object.keys(speciesBehavior).find((id) => speciesById(id) && !speciesCare[id])!;
    expect(render(withoutCare)).not.toContain(c.careTitle);
    const noLength = Object.keys(speciesCare).find((id) => speciesById(id) && speciesById(id)!.minTankLengthCm === undefined);
    if (noLength) expect(render(noLength)).not.toContain(c.minLength);
    const noLifespan = Object.keys(speciesCare).find((id) => !speciesCare[id].lifespan)!;
    expect(render(noLifespan)).not.toContain(c.careLabels.lifespan);
  });

  it("yüklenirken davranış bölümü 'yükleniyor' yazar; çevirisi olmayan bakım metni gösterilmez", () => {
    expect(render("zebra-danio", false)).toContain(messagesFor("tr").livestock.card.loading);
    store.locale = "en";
    const english = render("zebra-danio", true, catalogTranslator("en", enCatalogSpeciesCare));
    expect(english).toContain("Care information");
    expect(english).toContain("Diet");
    expect(english).toContain(catalogTranslator("en", enCatalogSpeciesCare)(speciesCare["zebra-danio"].diet!)!);
    expect(english).not.toContain(speciesCare["zebra-danio"].diet!);
    const hidden = render("zebra-danio", true, () => undefined);
    expect(hidden).not.toContain("Diet");
    expect(hidden).toContain("Lifespan");
  });
});
