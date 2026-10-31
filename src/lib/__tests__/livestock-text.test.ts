import { describe, expect, it } from "vitest";
import { catalogTranslator } from "@aquamind/localization/catalog";
import { speciesCatalog } from "@/data/catalog-species";
import { livestockDisplayName, livestockSearchText } from "@/lib/livestock-text";

// Canlılar sayfasının kart adı ve arama metni (docs/DECISIONS/0021-dil-altyapisi.md, 4. paket).

describe("canlı kartının adı ve arama metni", () => {
  it("Türkçede ad ve arama metni 4. paketten öncekiyle aynı", () => {
    const identity = catalogTranslator("tr");
    for (const profile of speciesCatalog) {
      const name = livestockDisplayName(profile.commonName, profile.commonName, identity);
      expect(name).toBe(profile.commonName);
      expect(livestockSearchText(profile.commonName, name, profile.scientificName)).toBe(profile.commonName + " " + profile.scientificName);
    }
    expect(livestockSearchText("Adsız", "Adsız", undefined)).toBe("Adsız ");
  });

  it("yalnız kataloğun bugünkü adı çevrilir; kullanıcının ve eski kataloğun adı kalır", () => {
    const english = (text: string) => ({ "Neon tetra": "Neon Tetra", "Benim balığım": "My fish" })[text];
    expect(livestockDisplayName("Neon tetra", "Neon tetra", english)).toBe("Neon Tetra");
    expect(livestockDisplayName("Benim balığım", "Neon tetra", english)).toBe("Benim balığım");
    expect(livestockDisplayName("Neon tetra", undefined, english)).toBe("Neon tetra");
    expect(livestockDisplayName("Kardinal tetra", "Kardinal tetra", english)).toBe("Kardinal tetra");
  });

  it("çevrilmiş ad aramaya yalnız kayıttaki addan farklıysa eklenir", () => {
    expect(livestockSearchText("Neon tetra", "Neon Tetra", "Paracheirodon innesi")).toBe("Neon tetra Neon Tetra Paracheirodon innesi");
    expect(livestockSearchText("Neon tetra", "Neon tetra", "Paracheirodon innesi")).toBe("Neon tetra Paracheirodon innesi");
  });
});
