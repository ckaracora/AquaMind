import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { loadLocaleBundle, messagesFor } from "@aquamind/localization";
import { catalogTranslator } from "@aquamind/localization/catalog";
import { enCatalogSpeciesCare } from "../../../packages/localization/src/messages/en-catalog-species-care";
import { speciesById, type SpeciesProfile } from "@/data/catalog-species";
import { speciesBehavior, type BehaviorRecord } from "@/data/species-behavior";
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

// İkinci kademe (karar 0045): kabul edilen kaynakların yazmadığı hacim, uzunluk ya da davranış birkaç hobi kaynağının ortak değeriyle doldurulduysa
// değerin yanında kısa bilgi ve açılır kaynak listesi. Sahte kayıtla (katalog verisi değil).
describe("ikinci kademe değerler (karar 0045)", () => {
  const hobby = ["https://hobby-one.example/fish", "https://hobby-two.example/fish", "https://hobby-three.example/fish"];
  const renderProfile = (profile: SpeciesProfile, behavior?: BehaviorRecord[]) => plain(renderToStaticMarkup(createElement(SpeciesCardContent, { profile, titleId: "t", data: { behavior, care: undefined }, failed: false, retry: () => {}, close: () => {}, careText: (text: string) => text })));
  const base = speciesById("zebra-danio")!;
  const secondary: SpeciesProfile = { ...base, minTankLengthCm: 80, secondarySources: { minVolumeL: hobby, minTankLengthCm: hobby } };

  it("hacim ve uzunluk satırında üç dilde kısa bilgi; kaynak listesinde hobi kaynakları", () => {
    const labels = { tr: "Birkaç hobi kaynağının ortak değeri", en: "Shared value from several hobby sources", es: "Valor común de varias fuentes de aficionados" } as const;
    for (const locale of ["tr", "en", "es"] as const) {
      store.locale = locale;
      const text = renderProfile(secondary);
      expect(text.split(labels[locale]).length - 1, locale).toBe(2);
      expect(text, locale).toContain("hobby-three.example");
    }
    store.locale = "tr";
    expect(renderProfile(base)).not.toContain(labels.tr);
  });

  it("ikinci kademe davranış kaydı kaynağın yanında kısa bilgiyle; kabul edilen kaynaklı kayıtta yok", () => {
    const record: BehaviorRecord = { flag: "finNipper", confidence: "explicit", evidence: "üç hobi kaynağı", tier: "secondary", source: "Hobby One", sourceUrl: hobby[0], additionalSourceUrls: hobby.slice(1), verifiedAt: "2026-11-14" };
    const text = renderProfile(base, [record]);
    expect(text).toContain("Kaynak: Hobby One Birkaç hobi kaynağının ortak değeri hobby-one.example hobby-two.example hobby-three.example");
    expect(renderProfile(base, [{ ...record, tier: undefined, source: "Seriously Fish", sourceUrl: "https://www.seriouslyfish.com/species/test/" }])).not.toContain("hobi kaynağının");
  });

  it("telefon genişliğinde taşmaz: bağlantılar kırılır, satır daralabilir", () => {
    const html = renderToStaticMarkup(createElement(SpeciesCardContent, { profile: secondary, titleId: "t", data: { behavior: undefined, care: undefined }, failed: false, retry: () => {}, close: () => {}, careText: (text: string) => text }));
    expect(html).toContain("<details");
    expect(html).toMatch(/class="break-all /);
    expect(html).toMatch(/<details class="mt-1 min-w-0 /);
  });
});
