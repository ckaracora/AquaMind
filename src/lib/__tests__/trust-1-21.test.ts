import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { UnevaluatedItem } from "@aquamind/compatibility-engine";
import { loadLocaleBundle, messagesFor } from "@aquamind/localization";
import { GenderSelect, LIVESTOCK_GENDERS } from "@/components/gender-select";
import { speciesById, speciesForLivestock } from "@/data/catalog-species";
import { speciesBehavior } from "@/data/species-behavior";
import { speciesFittingAquarium } from "@/lib/aquarium-fit";
import { dashboardStatus } from "@/lib/dashboard-status";
import type { CatalogLookup } from "@/lib/health-analysis-core";
import { uncountedAnimalNames } from "@/lib/health-warning-groups";
import type { Aquarium, Livestock } from "@/types/aquarium";

// Güven turu, motor 1.21.0 (docs/DECISIONS/0046-cinsiyet-toplam-alan-ve-av-hukmu.md): ekran tarafı. Cinsiyet seçimi (canlı ekleme ve düzenleme
// penceresi) ve tanınmayan canlı varken puanın gösterilmemesi (sağlık sayfası, ana sayfa, "Bu akvaryuma ne uyar?").
await loadLocaleBundle("en");
await loadLocaleBundle("es");
const read = (path: string) => readFileSync(path, "utf8");

describe("cinsiyet seçimi", () => {
  it("isteğe bağlı, varsayılanı 'Bilinmiyor'; seçenekler kaydın bütün bireylerini anlatır ve not neden sorulduğunu söyler", () => {
    const html = renderToStaticMarkup(createElement(GenderSelect, { field: "alan" }));
    expect(LIVESTOCK_GENDERS).toEqual(["unknown", "mixed", "male", "female"]);
    expect([...html.matchAll(/<option value="([a-z]+)"[^>]*>([^<]+)<\/option>/g)].map((match) => [match[1], match[2]])).toEqual([
      ["unknown", "Bilinmiyor"], ["mixed", "Karışık (erkek ve dişi)"], ["male", "Hepsi erkek"], ["female", "Hepsi dişi"],
    ]);
    expect(html).toMatch(/<option value="unknown" selected="">/);
    expect(html).toContain("Bazı türlerde erkekler birbiriyle kavga eder.");
    // Not, seçime ekran okuyucuyla da bağlıdır.
    const describedBy = html.match(/aria-describedby="([^"]+)"/)?.[1];
    expect(describedBy).toBeTruthy();
    expect(html).toContain(`<p id="${describedBy}"`);
    expect(html).not.toContain("required");
  });

  it("üç dilde metinler var (ABD İngilizcesi, Latin Amerika İspanyolcası)", () => {
    expect(messagesFor("en").livestock.form.genders).toEqual({ unknown: "Unknown", mixed: "Mixed (males and females)", male: "All male", female: "All female" });
    expect(messagesFor("es").livestock.form.genders).toEqual({ unknown: "Desconocido", mixed: "Mixto (machos y hembras)", male: "Todos machos", female: "Todas hembras" });
    for (const locale of ["tr", "en", "es"] as const) expect(messagesFor(locale).livestock.form.genderHelp.length, locale).toBeGreaterThan(60);
  });

  it("ekleme ve düzenleme penceresi aynı bileşeni kullanır; eski kayıtta alan yoksa 'Bilinmiyor' sayılır", () => {
    expect(read("src/components/catalog-livestock-form.tsx")).toContain("<GenderSelect field={field} value={gender} onChange={setGender} />");
    expect(read("src/components/livestock-edit-dialog.tsx")).toContain('<GenderSelect field={field} defaultValue={item.gender ?? "unknown"} />');
    for (const file of ["src/components/catalog-livestock-form.tsx", "src/components/livestock-edit-dialog.tsx"]) expect(read(file), file).not.toContain("t.livestock.form.genders.");
  });
});

const lookup: CatalogLookup = { speciesForLivestock, behaviorFor: (id) => speciesBehavior[id], profileForEquipment: () => undefined };
const tank: Aquarium = { id: "a", name: "Test", type: "freshwater", lengthCm: 60, widthCm: 30, heightCm: 35, netVolumeLiters: 60, setupDate: "2026-01-01" };
const known = (catalogId: string, quantity: number): Livestock => ({ id: `k-${catalogId}`, aquariumId: "a", catalogId, commonName: speciesById(catalogId)!.commonName, category: speciesById(catalogId)!.category, quantity, addedAt: "2026-01-01" });
const balloon: Livestock = { id: "x", aquariumId: "a", commonName: "Balon moli", category: "fish", quantity: 4, addedAt: "2026-01-01" };

describe("tanınmayan canlı varken puan gösterilmez", () => {
  it("hesaba katılmayan canlıların adları: tanınmayan (kullanıcının yazdığı ad) ve doğrulanmamış (katalog adı, çevrilir)", () => {
    const items: UnevaluatedItem[] = [{ code: "unknownAnimal" as const, params: { name: "Balon moli", count: 4 } }, { code: "unverifiedAnimal" as const, params: { name: "Neon tetra", count: 2 } }, { code: "noReading" as const, params: {} }, { code: "unknownAnimal" as const, params: { name: "  ", count: 1 } }];
    expect(uncountedAnimalNames(items)).toEqual(["Balon moli", "Neon tetra"]);
    expect(uncountedAnimalNames(items, (text) => (text === "Neon tetra" ? "Neon tetra (EN)" : undefined))).toEqual(["Balon moli", "Neon tetra (EN)"]);
    expect(uncountedAnimalNames(undefined)).toEqual([]);
  });

  it("sağlık sayfası: eksik değerlendirmede halka boş, sayı yerine 'Puan yok' ve adlar; 'Dikkat' ve 'Uygun değil' rozeti kalır", () => {
    const source = read("src/app/(app)/aquariums/[id]/health/page.tsx");
    expect(source).toContain("const uncounted=analysis.incomplete?uncountedAnimalNames(analysis.unevaluated,catalogText):[]; const hideScore=analysis.incomplete===true;");
    expect(source).toContain("<ScoreRing score={hideScore?undefined:analysis.score}");
    expect(source).toContain("{hideScore&&<p className=\"mt-3 text-xs leading-relaxed text-sky-200\">{t.health.uncountedAnimals(uncounted.join(\", \"))}</p>}");
    expect(source).toContain("{score!==undefined&&<circle");
    expect(source).toContain("<p className=\"px-6 text-sm font-extrabold text-sky-200\">{t.health.noScore}</p>");
    // Rozet kuralı değişmedi: yalnız "iyi" olacakken "Eksik değerlendirildi".
    expect(source).toContain("const verdictLabel=incompleteGood?t.health.incomplete:t.health.overall[analysis.status];");
    expect(messagesFor("tr").health.noScore).toBe("Puan yok");
    expect(messagesFor("tr").health.uncountedAnimals("Balon moli")).toBe("Puan gösterilmiyor; şu canlılar hesaba katılamadı: Balon moli.");
    expect(messagesFor("en").health.uncountedAnimals("Balloon molly")).toBe("No score is shown; these livestock couldn't be counted: Balloon molly.");
    expect(messagesFor("es").health.noScore).toBe("Sin puntuación");
  });

  it("ana sayfa: özet cümlesinin arkasında adlar; tanınan canlılarla ad yok", () => {
    const incomplete = dashboardStatus(lookup, tank, [balloon, known("guppy", 4)], []);
    expect(incomplete.uncounted).toEqual(["Balon moli"]);
    expect(dashboardStatus(lookup, tank, [known("guppy", 4)], []).uncounted).toEqual([]);
    expect(messagesFor("tr").dashboard.uncounted("Balon moli")).toBe("Hesaba katılmayan canlılar: Balon moli.");
    expect(messagesFor("es").dashboard.uncounted("Balon moli")).toBe("Animales no incluidos: Balon moli.");
    expect(read("src/app/(app)/page.tsx")).toContain("t.dashboard.uncounted(status.uncounted.join(\", \"))");
  });

  it("'Bu akvaryuma ne uyar?': hesaba katılamayan canlılar adlarıyla yazılır", () => {
    const candidates = [speciesById("neon-tetra")!, speciesById("corydoras-panda")!];
    expect(speciesFittingAquarium({ lookup, aquarium: tank, animals: [balloon], devices: [], latest: undefined, candidates }).uncounted).toEqual(["Balon moli"]);
    expect(speciesFittingAquarium({ lookup, aquarium: tank, animals: [known("guppy", 4)], devices: [], latest: undefined, candidates }).uncounted).toEqual([]);
    expect(read("src/components/aquarium-fit.tsx")).toContain("f.uncounted(result.uncounted.map((item) => catalogText(item) ?? item).join(\", \"))");
    expect(messagesFor("en").livestock.fit.uncounted("Balloon molly")).toBe("Livestock not recognized or not verified in the catalog weren't counted: Balloon molly.");
  });
});
