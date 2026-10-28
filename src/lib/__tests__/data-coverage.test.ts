import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { careProductCatalog } from "@/data/care-product-catalog";
import { equipmentCatalog } from "@/data/catalog-equipment";
import { unverifiedEquipmentIds } from "@/data/catalog-equipment-unverified";
import { plantCatalog } from "@/data/catalog-plants";
import { generatedSourceSpeciesIds, speciesCatalog, withGeneratedSource, type SpeciesProfile } from "@/data/catalog-species";
import { coverageMarkdown, dataCoverage, isCalendarDate, parseCoverageArgs, RECENT_DAYS, type CoverageInput } from "@/lib/data-coverage";

// Veri kapsamı raporu (docs/DATA_COVERAGE.md): belgedeki tablo katalogların bugünkü hâliyle aynı kalmalı.
const catalogs: CoverageInput = { species: speciesCatalog, generatedSourceSpeciesIds, equipment: equipmentCatalog, unverifiedEquipmentIds, care: careProductCatalog, plants: [...plantCatalog] };
const empty: CoverageInput = { species: [], generatedSourceSpeciesIds: [], equipment: [], unverifiedEquipmentIds: [], care: [], plants: [] };
const rowOf = (input: CoverageInput, catalog: string, label: string, measuredOn = "2026-10-28") => dataCoverage(input, measuredOn).catalogs.find((item) => item.name === catalog)!.rows.find((item) => item.label === label)!;

describe("veri kapsamı belgesi", () => {
  it("belgedeki güncel tablo, belgenin ölçüm tarihiyle yeniden hesaplanan tabloyla aynı (katalog değişince belge yenilenir)", () => {
    const text = readFileSync("docs/DATA_COVERAGE.md", "utf8").replace(/\r\n/g, "\n");
    const section = text.split("<!-- kapsam:başla -->\n")[1]?.split("\n<!-- kapsam:bitir -->")[0];
    expect(section, "belgede kapsam işaretleri yok").toBeDefined();
    const measuredOn = section!.match(/^Ölçüm tarihi: (\d{4}-\d{2}-\d{2})$/m)?.[1];
    expect(measuredOn).toBeDefined();
    expect(section).toBe(coverageMarkdown(dataCoverage(catalogs, measuredOn!)));
  });
});

describe("kapsam hesabı", () => {
  it("otomatik kaynak bağlantısı kendi kaynağı sayılmaz", () => {
    const species = [
      { id: "a", scientificName: "A a", category: "fish", sourceUrl: "https://www.fishbase.se/summary/A-a.html", verifiedAt: "2026-08-17" },
      { id: "b", scientificName: "B b", category: "fish", sourceUrl: "https://www.seriouslyfish.com/species/b-b/", verifiedAt: "2026-10-01" },
    ];
    const input = { ...empty, species, generatedSourceSpeciesIds: ["a"] };
    expect(rowOf(input, "Canlılar", "Kendi kaynak sayfası var (otomatik bağlantı değil)")).toMatchObject({ count: 1, total: 2 });
    expect(rowOf(input, "Canlılar", "Yalnız otomatik kaynak bağlantısı")).toMatchObject({ count: 1, total: 2 });
    // Katalogda bugün otomatik bağlantılı tür yok.
    expect(generatedSourceSpeciesIds).toEqual([]);
  });

  it("katalog kaynağı olmayan balığa, karidese ve salyangoza otomatik bağlantı ekler ve bunu listeye yazar; ötekilere dokunmaz", () => {
    const base = { commonName: "Örnek", adultSizeCm: 3, minVolumeL: 20, minGroup: 1, temperature: [22, 26] as [number, number], ph: [6, 7.5] as [number, number], wasteFactor: 1 };
    const species = (id: string, scientificName: string, category: SpeciesProfile["category"], source?: { sourceUrl?: string; verifiedAt?: string }): SpeciesProfile => ({ ...base, id, scientificName, category, ...source });
    const generated: string[] = [];
    const results = [
      species("balik", "Puntius titteya", "fish"),
      species("karides", "Neocaridina davidi", "shrimp"),
      species("salyangoz", "Clithon corona", "snail"),
      species("tarihsiz", "Danio rerio", "fish", { sourceUrl: "https://www.seriouslyfish.com/species/danio-rerio/" }),
      species("kaynakli", "Danio margaritatus", "fish", { sourceUrl: "https://www.seriouslyfish.com/species/danio-margaritatus/", verifiedAt: "2026-10-19" }),
      species("cins", "Corydoras sp. CW010", "fish"),
      species("melez", "Flowerhorn hybrid", "fish"),
      species("diger", "Procambarus clarkii", "other"),
    ].map((item) => withGeneratedSource(item, generated));
    expect(generated).toEqual(["balik", "karides", "salyangoz", "tarihsiz"]);
    expect(results.map((item) => item.sourceUrl)).toEqual([
      "https://www.fishbase.se/summary/Puntius-titteya.html",
      "https://www.seriouslyfish.com/species/neocaridina-davidi/",
      "https://www.seriouslyfish.com/species/clithon-corona/",
      "https://www.fishbase.se/summary/Danio-rerio.html",
      "https://www.seriouslyfish.com/species/danio-margaritatus/",
      undefined, undefined, undefined,
    ]);
  });

  it(`"son ${RECENT_DAYS} gün" ölçüm gününden geriye sayılır; iki sınır günü dahil, ölçüm gününden sonraki tarih sayılmaz`, () => {
    const care = ["2026-07-28", "2026-07-27", "2026-10-28", "2026-10-29"].map((verifiedAt, index) => ({ id: String(index), category: "food", sourceUrl: "https://example.com", verifiedAt }));
    expect(rowOf({ ...empty, care }, "Bakım ürünleri", `Son ${RECENT_DAYS} günde doğrulanmış`)).toMatchObject({ count: 2, total: 4 });
    // Geçmiş bir günle ölçülünce bugünkü doğrulamalar sayılmaz.
    expect(rowOf(catalogs, "Bitkiler", `Son ${RECENT_DAYS} günde doğrulanmış`, "2000-01-01")).toMatchObject({ count: 0 });
  });

  it("ölçüm tarihi takvimde olan bir gün olmalı", () => {
    expect(isCalendarDate("2026-10-28")).toBe(true);
    expect(isCalendarDate("2028-02-29")).toBe(true);
    for (const value of ["2026-02-31", "2026-13-01", "2026-10-28T00:00", "28.10.2026", ""]) expect(isCalendarDate(value), value).toBe(false);
    expect(() => dataCoverage(empty, "2026-02-31")).toThrow(/Geçersiz ölçüm tarihi/);
    // Takvimde olmayan doğrulama tarihi (Date.parse onu 1 Ekim'e kaydırır) son günlerde doğrulanmış sayılmaz.
    const care = [{ id: "a", category: "food", sourceUrl: "https://example.com", verifiedAt: "2026-09-31" }];
    expect(rowOf({ ...empty, care }, "Bakım ürünleri", `Son ${RECENT_DAYS} günde doğrulanmış`)).toMatchObject({ count: 0, total: 1 });
  });

  it("betiğin argümanları: tarih ve --json sıradan bağımsız; hatalı argüman açıklayıcı hata verir", () => {
    const today = "2026-10-28";
    expect(parseCoverageArgs([], today)).toEqual({ measuredOn: today });
    expect(parseCoverageArgs(["2000-01-01"], today)).toEqual({ measuredOn: "2000-01-01" });
    expect(parseCoverageArgs(["2000-01-01", "--json", "veri.json"], today)).toEqual({ measuredOn: "2000-01-01", jsonPath: "veri.json" });
    expect(parseCoverageArgs(["--json", "veri.json", "2000-01-01"], today)).toEqual({ measuredOn: "2000-01-01", jsonPath: "veri.json" });
    // Tarihe benzeyen dosya adı tarih sayılmaz.
    expect(parseCoverageArgs(["--json", "2026-01-01"], today)).toEqual({ measuredOn: today, jsonPath: "2026-01-01" });
    expect(parseCoverageArgs(["--json", "klasör adı/veri.json"], today)).toEqual({ measuredOn: today, jsonPath: "klasör adı/veri.json" });
    for (const args of [["--json"], ["--json", "--json"], ["2026-02-31"], ["2026-10-28", "2026-10-29"], ["--json", "a.json", "--json", "b.json"]]) {
      expect(parseCoverageArgs(args, today), args.join(" ")).toHaveProperty("error");
    }
  });

  it("boş liste ve boş metin dolu sayılmaz; hacim yalnız hacmi olan ürünlerde sayılır", () => {
    const plants = [
      { id: "a", sourceUrl: "https://tropica.com/x", verifiedAt: "2026-10-25", light: ["low", "low"], placements: [] },
      { id: "b", sourceUrl: "https://tropica.com/y", verifiedAt: "2026-10-25", light: ["low", "low"], placements: ["foreground"] },
    ];
    expect(rowOf({ ...empty, plants }, "Bitkiler", "Yerleşim")).toMatchObject({ count: 1, total: 2 });
    const species = [
      { id: "a", scientificName: "A a", category: "fish", sourceUrl: "https://example.com", verifiedAt: "2026-10-01", flow: "" },
      { id: "b", scientificName: "B b", category: "fish", sourceUrl: "https://example.com", verifiedAt: "2026-10-01", flow: "low" },
    ];
    expect(rowOf({ ...empty, species }, "Canlılar", "Akıntı")).toMatchObject({ count: 1, total: 2 });
    // "Bütün değerler dolu": yedi alanın her biri gerekir; biri eksik olan kayıt sayılmaz.
    const full = { sourceUrl: "https://tropica.com/x", verifiedAt: "2026-10-25", light: ["low", "low"], co2: "low", growth: ["slow", "slow"], heightCm: 10, temperature: [20, 28], ph: [6, 7.5], placements: ["foreground"] };
    const keys = ["light", "co2", "growth", "heightCm", "temperature", "ph", "placements"] as const;
    const complete = [{ id: "tam", ...full }, ...keys.map((key) => ({ id: key, ...full, [key]: undefined }))];
    expect(rowOf({ ...empty, plants: complete }, "Bitkiler", "Bütün değerler dolu")).toMatchObject({ count: 1, total: 8 });
    const care = [
      { id: "tank", category: "tank", sourceUrl: "https://example.com", verifiedAt: "2026-10-01", volumeL: 54 },
      { id: "set", category: "aquarium_set", sourceUrl: "https://example.com", verifiedAt: "2026-10-01" },
      { id: "food", category: "food", sourceUrl: "https://example.com", verifiedAt: "2026-10-01" },
    ];
    expect(rowOf({ ...empty, care }, "Bakım ürünleri", "Hacim (tank, set, teraryum)")).toMatchObject({ count: 1, total: 2 });
  });

  it("tablo yüzdeyi Türkçe ondalıkla yazar; kaydı olmayan satırda yüzde yerine çizgi", () => {
    const species = [1, 2, 3].map((n) => ({ id: String(n), scientificName: `S ${n}`, category: "fish", sourceUrl: "https://example.com", verifiedAt: "2026-10-01", flow: n === 1 ? "low" : undefined }));
    const markdown = coverageMarkdown(dataCoverage({ ...empty, species }, "2026-10-28"));
    expect(markdown).toContain("| Akıntı | 1/3 | %33,3 |");
    expect(markdown).toContain("### Ekipman (0 kayıt)");
    expect(markdown).toContain("| Kaynak sayfası | 0/0 | — |");
    expect(markdown.startsWith("Ölçüm tarihi: 2026-10-28\n")).toBe(true);
  });
});
