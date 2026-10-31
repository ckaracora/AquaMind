import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { loadLocaleBundle, messagesFor } from "@aquamind/localization";
import { careCategoryLabels } from "@/data/care-product-catalog";

// Ürün kataloğunun kategori adları dil dosyasında (karar 0021, 5. paket); ürün açıklaması katalog metnidir, çevirisi olmayan dilde
// gösterilmez.

describe("ürün kataloğu kategorileri", () => {
  it("Türkçe adlar katalogdakilerle aynı ve aynı sırada; İngilizcede her kategorinin adı var", async () => {
    await loadLocaleBundle("en");
    expect(Object.entries(messagesFor("tr").products.categories)).toEqual(Object.entries(careCategoryLabels));
    expect(Object.keys(messagesFor("en").products.categories)).toEqual(Object.keys(careCategoryLabels));
    for (const label of Object.values(messagesFor("en").products.categories)) expect(label).not.toMatch(/[çğıöşüÇĞİÖŞÜ]|^\s*$/);
  });

  it("sayfa kategori adını dil dosyasından, açıklamayı katalog çevirmeninden alır", () => {
    const page = readFileSync("src/app/products/page.tsx", "utf8");
    expect(page).not.toContain("careCategoryLabels");
    expect(page).toContain("t.products.categories[item.category]");
    expect(page).toContain("const shown=catalogText(text)");
  });
});

describe("arama örnekleri", () => {
  it("bitki aramasının örnek adlarının her biri her dilde katalogda sonuç verir", async () => {
    const { searchPlants } = await import("@/data/catalog-plants");
    for (const locale of ["tr", "en"] as const) {
      const hint = messagesFor(locale).plants.catalog.searchHint;
      const examples = hint.replace(/^[^ ]+ /, "").split(", ");
      expect(examples.length, locale).toBeGreaterThan(1);
      for (const example of examples) expect(searchPlants(example).length, `${locale}: ${example}`).toBeGreaterThan(0);
    }
  });
});
