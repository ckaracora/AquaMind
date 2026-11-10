import { describe, expect, it } from "vitest";
import { catalogTextKey, catalogTranslator, type CatalogTexts } from "../src/catalog";
import type { Locale } from "../src/locales";

// Katalog metinlerinin çevirisi (docs/DECISIONS/0021-dil-altyapisi.md, 4. paket).

describe("katalog metni anahtarı", () => {
  it("bilinen değerleri verir; 32 bitlik FNV-1a ile uyumlu", () => {
    expect(catalogTextKey("")).toBe("811c9dc5050c5d1f");
    expect(catalogTextKey("a")).toBe("e40c292c70772d5a");
    expect(catalogTextKey("Neon tetra")).toBe("607734ad425affcf");
    expect(catalogTextKey("Çok küçük akvaryumda bölgeci olabilir.")).toBe("8f51898aaff9bed0");
  });

  it("her zaman 16 onaltılık karakter; metin değişince değişir", () => {
    for (const text of ["", "x", "Kaynak: Seriously Fish.", "a".repeat(5000)]) expect(catalogTextKey(text)).toMatch(/^[0-9a-f]{16}$/);
    expect(catalogTextKey("Neon tetra")).not.toBe(catalogTextKey("Neon tetra "));
    expect(catalogTextKey("Neon tetra")).not.toBe(catalogTextKey("neon tetra"));
  });
});

describe("katalog çevirmeni", () => {
  const texts: CatalogTexts = { [catalogTextKey("Neon tetra")]: "Neon tetra (EN)" };

  it("Türkçe katalogun kendi dili: metin olduğu gibi kalır, tablo kullanılmaz", () => {
    const translate = catalogTranslator("tr", texts);
    expect(translate("Neon tetra")).toBe("Neon tetra");
    expect(translate("Tabloda olmayan metin")).toBe("Tabloda olmayan metin");
  });

  it("başka dilde tablodaki çeviriyi verir; eksik ya da eskimiş çeviride undefined döner", () => {
    const translate = catalogTranslator("en" as Locale, texts);
    expect(translate("Neon tetra")).toBe("Neon tetra (EN)");
    expect(translate("Neon tetra.")).toBeUndefined();
    expect(translate("constructor")).toBeUndefined();
    expect(catalogTranslator("en" as Locale)("Neon tetra")).toBeUndefined();
  });
});
