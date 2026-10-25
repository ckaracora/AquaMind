import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { assertPlantCatalogIntegrity, plantById, plantCatalog, plantForName, type PlantProfile } from "@/data/catalog-plants";

// Bitki kataloğu 1. paket (docs/DECISIONS/0023-bitki-katalogu.md, docs/DATA_SOURCES.md → "Bitkiler"). Değerler kaynak sayfalarından
// okunup betikle işlendi. `plant-catalog.expected.json` aynı betiğin ürettiği kayıtlardır: katalogdaki her alanın elle değişmesini
// yakalar (kaynaktan yeniden üretilince ikisi birlikte güncellenir). Aşağıdaki sabitler kaynakların yazdığını ve değer kuralının sonucunu korur.
const copy = (): PlantProfile[] => plantCatalog.map((item) => structuredClone(item));
const withChange = (id: string, change: (item: PlantProfile) => void) => {
  const items = copy();
  change(items.find((item) => item.id === id)!);
  return items;
};
const ufUrl = (slug: string) => `https://plant-directory.ifas.ufl.edu/plant-directory/${slug}/`;

describe("bitki kataloğu bütünlüğü", () => {
  it("katalog, kaynaktan üretilen kayıtlarla alan alan aynı", () => {
    const expected = JSON.parse(readFileSync("src/lib/__tests__/plant-catalog.expected.json", "utf8")) as PlantProfile[];
    expect(plantCatalog).toEqual(expected);
  });

  it("54 bitki; her biri Fishkeeper sayfasına, kabul edilen Türk mağazasına ve tarihe bağlı", () => {
    expect(plantCatalog).toHaveLength(54);
    expect(new Set(plantCatalog.map((item) => item.id)).size).toBe(54);
    for (const item of plantCatalog) {
      // Fishkeeper'ın bitki listesi A. heterophylla'yı bilgi bankası dışındaki bir sayfaya bağlıyor.
      if (item.id === "anubias-heterophylla") expect(item.sourceUrl).toBe("https://www.fishkeeper.co.uk/fish/Anubias-Heterophylla");
      else expect(item.sourceUrl, item.id).toMatch(/^https:\/\/www\.fishkeeper\.co\.uk\/fish\/plant\/aquarium-plants\/[a-z0-9-]+$/);
      for (const url of item.additionalSourceUrls ?? []) expect(url, item.id).toMatch(/^https:\/\/tropica\.com\/en\/plants\/plantdetails\//);
      expect(item.shopUrls.length, item.id).toBeGreaterThan(0);
      for (const url of item.shopUrls) expect(["aquarubi.com", "www.akvaryumexpress.com"], `${item.id}: ${url}`).toContain(new URL(url).host);
      expect(item.verifiedAt, item.id).toBe("2026-10-25");
    }
    expect(() => assertPlantCatalogIntegrity()).not.toThrow();
  });

  it("bütünlük denetimi bozuk kaydı yakalar", () => {
    expect(() => assertPlantCatalogIntegrity(withChange("glossostigma-elatinoides", (item) => { item.temperature = [26, 15]; }))).toThrow(/aralığı/);
    expect(() => assertPlantCatalogIntegrity(withChange("glossostigma-elatinoides", (item) => { item.light = ["high", "low"]; }))).toThrow(/düzeyi/);
    expect(() => assertPlantCatalogIntegrity(withChange("glossostigma-elatinoides", (item) => { item.shopUrls = ["https://example.com/glossostigma"]; }))).toThrow(/mağaza/);
    expect(() => assertPlantCatalogIntegrity(withChange("glossostigma-elatinoides", (item) => { item.shopUrls = []; }))).toThrow(/mağaza/);
    expect(() => assertPlantCatalogIntegrity(withChange("glossostigma-elatinoides", (item) => { item.sourceUrl = "http://www.fishkeeper.co.uk/x"; }))).toThrow(/HTTPS/);
    expect(() => assertPlantCatalogIntegrity(withChange("egeria-densa", (item) => { item.aliases = ["Anubias nana"]; }))).toThrow(/aynı ad/);
    expect(() => assertPlantCatalogIntegrity(withChange("egeria-densa", (item) => { item.verifiedAt = "25.10.2026"; }))).toThrow(/tarihi/);
    expect(() => assertPlantCatalogIntegrity([...copy(), copy()[0]])).toThrow(/yinelenen kimlik/);
    expect(() => assertPlantCatalogIntegrity(withChange("egeria-densa", (item) => { item.heightCm = Number.NaN; }))).toThrow(/aralığı/);
    expect(() => assertPlantCatalogIntegrity(withChange("egeria-densa", (item) => { item.heightCm = Number.POSITIVE_INFINITY; }))).toThrow(/aralığı/);
    expect(() => assertPlantCatalogIntegrity(withChange("egeria-densa", (item) => { item.temperature = [Number.NaN, 26]; }))).toThrow(/aralığı/);
  });

  it("kopyalama hatalı Tropica sayfaları kaynak olarak kullanılmaz", () => {
    // Bu iki ürün sayfasının açıklaması başka bir bitkiyi anlatıyor (Pogostemon deccanensis ve bir gövdeli bitki).
    const urls = plantCatalog.flatMap((item) => item.additionalSourceUrls ?? []);
    expect(urls.filter((url) => url.includes("(101CLP)") || url.includes("(107CLP)"))).toEqual([]);
  });
});

describe("değer kuralı", () => {
  it("sıcaklık, pH, boy ve yerleşim Fishkeeper'dan; ışık ve CO₂ en yüksek ihtiyaçla", () => {
    expect(plantById("glossostigma-elatinoides")).toMatchObject({ temperature: [15, 26], ph: [5, 7.5], light: ["high", "high"], co2: "high", growth: ["fast", "fast"], heightCm: 5, placements: ["foreground"] });
    expect(plantById("anubias-barteri-var-nana")).toMatchObject({ temperature: [18, 28], ph: [5, 8.5], light: ["low", "high"], co2: "low", growth: ["very-slow", "slow"], heightCm: 15, placements: ["foreground", "onRoot", "onRock"] });
    expect(plantById("hottonia-palustris")).toMatchObject({ temperature: [10, 20], ph: [5.5, 7.5], light: ["high", "high"], co2: "low", heightCm: 30 });
  });

  it("Tropica'nın sayfası başka bir formu anlatıyorsa kullanılmaz", () => {
    // Tropica'nın "Rotala macrandra" sayfası 'Japan' formunu anlatıyor; tür kaydı yalnız Fishkeeper'dan.
    const rotala = plantById("rotala-macrandra");
    expect(rotala).toMatchObject({ temperature: [22, 28], ph: [5, 7], light: ["high", "high"], growth: ["fast", "fast"], heightCm: 55 });
    expect(rotala?.co2).toBeUndefined();
    expect(rotala?.additionalSourceUrls).toBeUndefined();
    // "Cryptocoryne crispatula" sayfası var. balansae'yi anlatıyor ve değeri veren ürün sayfası gösteriliyor.
    expect(plantById("cryptocoryne-crispatula-var-balansae")?.additionalSourceUrls).toEqual(["https://tropica.com/en/plants/plantdetails/Cryptocorynecrispatula(125TC)/18756"]);
  });

  it("Fishkeeper'ın aralığının altında kalan Tropica ihtiyacı alt ucu yükseltir", () => {
    // Fishkeeper "Very low-medium", Tropica "Medium": alt uç ortaya çıkar.
    expect(plantById("bolbitis-heudelotii")?.light).toEqual(["medium", "medium"]);
    // Tropica'nın ürün sayfaları farklı: biri düşük, ikisi orta CO₂ ve ışık diyor; en yüksek ihtiyaç alınır.
    expect(plantById("lilaeopsis-brasiliensis")).toMatchObject({ light: ["high", "high"], co2: "medium" });
  });

  it("boy kaynakların en büyüğü; Tropica'nın iki aylık boyu Fishkeeper'dan büyükse o alınır", () => {
    expect(plantById("cryptocoryne-wendtii-green")?.heightCm).toBe(30);
    expect(plantById("riccia-fluitans")?.heightCm).toBe(5);
    expect(plantById("crinum-calamistratum")?.heightCm).toBe(120);
  });

  it("açıklamada açıkça yazılan daha büyük boy da sayılır (boy, gövde ya da rozet bitkide yaprak uzunluğu)", () => {
    // Tropica: "Stems from 20-60 cm", "(50-150 cm, 2 cm wide)", "up to 80 cm long", "20-50 cm tall"; Fishkeeper: "longer leaves of up to 12cm".
    expect(plantById("pogostemon-stellatus")?.heightCm).toBe(60);
    expect(plantById("vallisneria-americana-var-gigantea")?.heightCm).toBe(150);
    expect(plantById("aponogeton-boivinianus")?.heightCm).toBe(80);
    expect(plantById("echinodorus-ozelot")?.heightCm).toBe(50);
    expect(plantById("helanthium-tenellum")?.heightCm).toBe(12);
    // Kalınlık sayılmaz: Tropica'nın 'Bogor Moss' sayfası "3-10 cm thick" diyor; boy tablodaki 3–10 cm'den.
    expect(plantById("taxiphyllum-barbieri")?.heightCm).toBe(10);
  });

  it("Tropica'nın ticari adı aynı bitkiyi gösteriyorsa sayfası kullanılır", () => {
    // Tropica 'Pink' = A. reineckii var. rosaefolia, 'Bogor Moss' = T. barbieri (Flowgrow eş adları).
    expect(plantById("alternanthera-reineckii-var-rosaefolia")).toMatchObject({ temperature: [17, 28], ph: [5, 8], light: ["medium", "high"], co2: "medium", growth: ["medium", "medium"], heightCm: 50 });
    expect(plantById("taxiphyllum-barbieri")).toMatchObject({ light: ["low", "high"], co2: "low", growth: ["slow", "medium"], heightCm: 10 });
    expect(plantById("taxiphyllum-barbieri")?.additionalSourceUrls?.[0]).toMatch(/Taxiphyllumbarbieri'BogorMoss'/);
  });

  it("kaynakta olmayan alan boş kalır", () => {
    const heterophylla = plantById("anubias-heterophylla");
    expect(heterophylla).toMatchObject({ temperature: [22, 30], light: ["medium", "medium"], heightCm: 80 });
    expect(heterophylla?.ph).toBeUndefined();
    expect(heterophylla?.growth).toBeUndefined();
    expect(heterophylla?.co2).toBeUndefined();
    // Tropica'da aynı bitkinin sayfası olmayanlarda CO₂ yazılmaz (18 kayıt).
    expect(plantCatalog.filter((item) => !item.co2).map((item) => item.id)).toEqual(plantCatalog.filter((item) => !item.additionalSourceUrls).map((item) => item.id));
    expect(plantCatalog.filter((item) => !item.co2)).toHaveLength(18);
  });

  it("yerleşim yalnız Fishkeeper açıklaması yazıyorsa dolu", () => {
    expect(plantById("microsorum-pteropus")?.placements).toEqual(["onRoot", "onRock"]);
    expect(plantById("hygrophila-polysperma")?.placements).toEqual(["background"]);
    expect(plantById("cryptocoryne-bullosa")?.placements).toEqual(["midground", "background"]);
    expect(plantById("salvinia-natans")?.placements).toEqual(["floating"]);
    expect(plantById("aponogeton-crispus")?.placements).toBeUndefined();
    expect(plantById("vallisneria-americana-var-gigantea")?.placements).toBeUndefined();
  });
});

describe("istilacı tür listeleri", () => {
  it("yalnız ABD federal zararlı ot listesindeki iki bitki işaretli; kaynak UF/IFAS bitki dizini", () => {
    const listed = plantCatalog.filter((item) => item.invasiveListings?.length);
    expect(listed.map((item) => [item.id, item.invasiveListings])).toEqual([
      ["limnophila-sessiliflora", [{ list: "us-federal-noxious-weed", sourceUrl: ufUrl("limnophila-sessiliflora") }]],
      ["hygrophila-polysperma", [{ list: "us-federal-noxious-weed", sourceUrl: ufUrl("hygrophila-polysperma") }]],
    ]);
  });
});

describe("adlar ve satış adları", () => {
  it("eş adlar ve Türk mağazalarındaki satış adları doğru kayda gider", () => {
    expect(plantForName("anubias nana")?.id).toBe("anubias-barteri-var-nana");
    expect(plantForName("Anubias Nana Petite")?.id).toBe("anubias-barteri-var-nana-petite");
    expect(plantForName("  Vesicularia   dubyana ")?.id).toBe("taxiphyllum-barbieri");
    expect(plantForName("Java moss")?.id).toBe("taxiphyllum-barbieri");
    expect(plantForName("Java fern")?.id).toBe("microsorum-pteropus");
    expect(plantForName("Microsorium pteropus 'Windelow'")?.id).toBe("microsorum-pteropus-windelov");
    expect(plantForName("Tilki kuyruğu")?.id).toBe("ceratophyllum-demersum");
    expect(plantForName("TİLKİ KUYRUĞU")?.id).toBe("ceratophyllum-demersum");
    expect(plantForName("Cryptocoryne lutea")?.id).toBe("cryptocoryne-walkeri");
    expect(plantForName("Cryptocoryne nevillii")?.id).toBe("cryptocoryne-x-willisii");
    expect(plantForName("Elodea densa")?.id).toBe("egeria-densa");
    expect(plantForName("Echinodorus tenellus")?.id).toBe("helanthium-tenellum");
    expect(plantForName("Cladophora aegagropila")?.id).toBe("aegagropila-linnaei");
    expect(plantForName("Bacopa amplexicaulis")?.id).toBe("bacopa-caroliniana");
    expect(plantForName("Hygrophila polysperma 'Rosanervig'")?.id).toBe("hygrophila-polysperma");
    // Flowgrow: 'Pink' ve 'Rosa' var. rosaefolia'nın eş adı; "Bogor moss" T. barbieri'nin ticari adı.
    expect(plantForName("Alternanthera reineckii 'Pink'")?.id).toBe("alternanthera-reineckii-var-rosaefolia");
    expect(plantForName("Alternanthera rosaefolia")?.id).toBe("alternanthera-reineckii-var-rosaefolia");
    expect(plantForName("Taxiphyllum barbieri 'Bogor Moss'")?.id).toBe("taxiphyllum-barbieri");
    // Flowgrow: 'Petite' ve 'Bonsai' aynı formun iki adı; C. axelrodii, C. undulata'nın eş adı (Aquarubi'nin ürün sayfası da öyle yazıyor).
    expect(plantForName("Anubias nana 'Bonsai'")?.id).toBe("anubias-barteri-var-nana-petite");
    expect(plantById("anubias-barteri-var-nana-petite")?.shopUrls).toEqual(expect.arrayContaining(["https://aquarubi.com/anubias-nana-bonsai", "https://aquarubi.com/stoffels-anubias-barteri-var-nana-bonsai-mini"]));
    expect(plantById("anubias-barteri-var-nana")?.shopUrls.some((url) => url.includes("bonsai"))).toBe(false);
    expect(plantForName("Cryptocoryne axelrodii")?.id).toBe("cryptocoryne-undulata");
    expect(plantForName("Cryptocoryne axelrodi")?.id).toBe("cryptocoryne-undulata");
    // echinodorus.net'in "Ozelot rot" sayfası (Flowgrow'un 'Ozelot' kaydının kaynağı) Fishkeeper'ın yazdığı melezi anlatıyor.
    expect(plantForName("Echinodorus 'Ozelot Red'")?.id).toBe("echinodorus-ozelot");
    expect(plantForName("")).toBeUndefined();
    expect(plantForName(undefined)).toBeUndefined();
  });

  it("kaynağın kaydı bir formsa başka bir formun ürünü ona bağlanmaz", () => {
    // 'Rosanervig' ayrı bir kültür formu (var. rosaefolia'ya bağlanmaz); 'Green Gecko' ayrı bir seçilmiş form ('Green' kaydına bağlanmaz);
    // 'Ozelot Narrow Mini' dar yapraklı ayrı bir form ('Ozelot' kaydına bağlanmaz).
    expect(plantForName("Alternanthera reineckii 'Rosanervig'")).toBeUndefined();
    const shops = plantCatalog.flatMap((item) => item.shopUrls);
    expect(shops.filter((url) => /gecko|narrow-mini|rosanervig/.test(url) && !/hygrophila|microsorium/.test(url))).toEqual([]);
  });
});

describe("bitki kataloğu modülü", () => {
  // Arayüz paketi gelene kadar hiçbir sayfa bitki kataloğunu indirmez.
  const sourceFiles = (dir: string): string[] => readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return entry === "__tests__" ? [] : sourceFiles(path);
    return /\.(ts|tsx)$/.test(entry) ? [path] : [];
  });
  it("uygulama kodu bitki kataloğunu içe aktarmaz", () => {
    const offenders = ["src/app", "src/components", "src/lib", "src/providers", "src/data"].flatMap((dir) => sourceFiles(dir))
      .filter((file) => !file.endsWith("catalog-plants.ts") && /catalog-plants/.test(readFileSync(file, "utf8")));
    expect(offenders).toEqual([]);
  });
});
