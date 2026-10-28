import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import { assertPlantCatalogIntegrity, plantById, plantCatalog, plantForName, type PlantProfile } from "@/data/catalog-plants";

// Bitki kataloğu 1. ve 2. paket (docs/DECISIONS/0023-bitki-katalogu.md, docs/DATA_SOURCES.md → "Bitkiler"). Değerler kaynak sayfalarından
// okunup betikle işlendi. `plant-catalog.expected.json` aynı betiğin ürettiği kayıtlardır: katalogdaki her alanın elle değişmesini
// yakalar (kaynaktan yeniden üretilince ikisi birlikte güncellenir). Aşağıdaki sabitler kaynakların yazdığını ve değer kuralının sonucunu korur.
const copy = (): PlantProfile[] => plantCatalog.map((item) => structuredClone(item));
const withChange = (id: string, change: (item: PlantProfile) => void) => {
  const items = copy();
  change(items.find((item) => item.id === id)!);
  return items;
};
const ufUrl = (slug: string) => `https://plant-directory.ifas.ufl.edu/plant-directory/${slug}/`;
const FISHKEEPER = /^https:\/\/www\.fishkeeper\.co\.uk\/fish\/plant\/aquarium-plants\/[a-z0-9-]+$/;
const TROPICA = /^https:\/\/tropica\.com\/en\/plants\/plantdetails\//;
const fromFishkeeper = (item: PlantProfile) => !TROPICA.test(item.sourceUrl);
// 1. ve 2. paket (kaynaktan üretilen kayıtlar); 3. paketin yalnız uyarı kayıtları ayrı sınanır (karar 0026).
const sourced = plantCatalog.filter((item) => !item.warningOnly);

describe("bitki kataloğu bütünlüğü", () => {
  it("katalog, kaynaktan üretilen kayıtlarla alan alan aynı", () => {
    const expected = JSON.parse(readFileSync("src/lib/__tests__/plant-catalog.expected.json", "utf8")) as PlantProfile[];
    expect(sourced).toEqual(expected);
  });

  it("3. paket: üç yalnız uyarı kaydı; değer yok, etiket ve ana kaynak resmî listeden ya da Practical Fishkeeping'den, satış Türk mağazasında", () => {
    expect(plantCatalog.filter((item) => item.warningOnly)).toEqual([
      { id: "azolla-filiculoides", scientificName: "Azolla filiculoides", warningOnly: true, invasiveListings: [{ list: "england-sale-ban", sourceUrl: "https://www.legislation.gov.uk/uksi/2014/538/article/3" }], sourceUrl: "https://www.legislation.gov.uk/uksi/2014/538/article/3", shopUrls: ["https://aquarubi.com/azolla-filiculoides-porsiyon"], verifiedAt: "2026-10-28" },
      { id: "ophiopogon-japonicus", scientificName: "Ophiopogon japonicus", warningOnly: true, notAquatic: { sourceUrl: "https://www.practicalfishkeeping.co.uk/features/21-plants-to-avoid-in-the-aquarium/" }, sourceUrl: "https://www.practicalfishkeeping.co.uk/features/21-plants-to-avoid-in-the-aquarium/", shopUrls: ["https://aquarubi.com/ophiopogon-japonicus"], verifiedAt: "2026-10-28" },
      { id: "pistia-stratiotes", scientificName: "Pistia stratiotes", aliases: ["Su marulu"], warningOnly: true, invasiveListings: [{ list: "eu-union-list", sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02016R1141-20250807" }, { list: "fisc-invasive", category: 1, sourceUrl: ufUrl("pistia-stratiotes") }], sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02016R1141-20250807", shopUrls: ["https://aquarubi.com/pistia-stratiotes-su-marulu"], verifiedAt: "2026-10-28" },
    ]);
    // Satış adıyla da bulunur.
    expect(plantForName("su marulu")?.id).toBe("pistia-stratiotes");
  });

  it("138 bitki: 52'si Fishkeeper'a, 86'sı Tropica'ya dayanıyor; her biri kabul edilen Türk mağazasına ve tarihe bağlı", () => {
    expect(plantCatalog).toHaveLength(141);
    expect(new Set(plantCatalog.map((item) => item.id)).size).toBe(141);
    expect(sourced).toHaveLength(138);
    expect(sourced.filter(fromFishkeeper)).toHaveLength(52);
    for (const item of sourced) {
      if (fromFishkeeper(item)) {
        // Fishkeeper'ın bitki listesi A. heterophylla'yı bilgi bankası dışındaki bir sayfaya bağlıyor.
        if (item.id === "anubias-heterophylla") expect(item.sourceUrl).toBe("https://www.fishkeeper.co.uk/fish/Anubias-Heterophylla");
        else expect(item.sourceUrl, item.id).toMatch(FISHKEEPER);
        for (const url of item.additionalSourceUrls ?? []) expect(url, item.id).toMatch(TROPICA);
      } else {
        // Tropica'ya dayanan kayıtta öteki kaynaklar Tropica sayfaları ya da (formlarda) türün Fishkeeper sayfasıdır.
        for (const url of item.additionalSourceUrls ?? []) expect(TROPICA.test(url) || FISHKEEPER.test(url), `${item.id}: ${url}`).toBe(true);
      }
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
    // Yalnız uyarı kaydı: değer alanı, etiketsiz kayıt ya da etiketin kaynağı olmayan ana kaynak kabul edilmez; yeni listeler HTTPS olmalı.
    expect(() => assertPlantCatalogIntegrity(withChange("pistia-stratiotes", (item) => { item.light = ["low", "low"]; }))).toThrow(/yalnız uyarı/);
    expect(() => assertPlantCatalogIntegrity(withChange("ophiopogon-japonicus", (item) => { item.heightCm = 30; }))).toThrow(/yalnız uyarı/);
    expect(() => assertPlantCatalogIntegrity(withChange("ophiopogon-japonicus", (item) => { delete item.notAquatic; }))).toThrow(/yalnız uyarı/);
    expect(() => assertPlantCatalogIntegrity(withChange("azolla-filiculoides", (item) => { item.sourceUrl = "https://tropica.com/en/plants/plantdetails/x"; }))).toThrow(/yalnız uyarı/);
    expect(() => assertPlantCatalogIntegrity(withChange("azolla-filiculoides", (item) => { item.warningOnly = false as unknown as true; }))).toThrow(/yalnız uyarı/);
    expect(() => assertPlantCatalogIntegrity(withChange("azolla-filiculoides", (item) => { item.invasiveListings = [{ list: "england-sale-ban", sourceUrl: "http://www.legislation.gov.uk/x" }]; }))).toThrow(/HTTPS/);
    expect(() => assertPlantCatalogIntegrity(withChange("ophiopogon-japonicus", (item) => { item.notAquatic = { sourceUrl: "http://www.practicalfishkeeping.co.uk/x" }; }))).toThrow(/HTTPS/);
    expect(() => assertPlantCatalogIntegrity(withChange("azolla-filiculoides", (item) => { item.invasiveListings = [{ list: "turkey-ban" as "eu-union-list", sourceUrl: item.sourceUrl }]; }))).toThrow(/istilacı/);
    expect(() => assertPlantCatalogIntegrity(withChange("egeria-densa", (item) => { item.heightCm = Number.NaN; }))).toThrow(/aralığı/);
    expect(() => assertPlantCatalogIntegrity(withChange("egeria-densa", (item) => { item.heightCm = Number.POSITIVE_INFINITY; }))).toThrow(/aralığı/);
    expect(() => assertPlantCatalogIntegrity(withChange("egeria-densa", (item) => { item.temperature = [Number.NaN, 26]; }))).toThrow(/aralığı/);
    expect(() => assertPlantCatalogIntegrity(withChange("rotala-rotundifolia", (item) => { item.invasiveListings = [{ list: "fisc-invasive", category: 3 as 1, sourceUrl: ufUrl("rotala-rotundifolia") }]; }))).toThrow(/istilacı/);
  });

  it("kopyalama hatalı ya da başka formu anlatan Tropica sayfaları kaynak olarak kullanılmaz", () => {
    // 101CLP ve 107CLP başka bir bitkiyi anlatıyor; 'Broad Leaf'in doku kültürü sayfası (110BTC) "red version" diye başka bir formu.
    const urls = plantCatalog.flatMap((item) => [item.sourceUrl, ...(item.additionalSourceUrls ?? [])]);
    expect(urls.filter((url) => /\((101CLP|107CLP|110BTC)\)/.test(url))).toEqual([]);
    // Bu sayfanın ürünü ('Broad Leaf' Vitro) kimliği belirsiz olduğu için hiçbir kayda bağlanmadı.
    expect(plantCatalog.flatMap((item) => item.shopUrls).filter((url) => url.includes("undulata-broad-leaf-vitro"))).toEqual([]);
  });
});

describe("değer kuralı", () => {
  it("sıcaklık, pH, boy ve yerleşim Fishkeeper'dan; ışık ve CO₂ en yüksek ihtiyaçla", () => {
    expect(plantById("glossostigma-elatinoides")).toMatchObject({ temperature: [15, 26], ph: [5, 7.5], light: ["high", "high"], co2: "high", growth: ["fast", "fast"], heightCm: 5, placements: ["foreground"] });
    expect(plantById("anubias-barteri-var-nana")).toMatchObject({ temperature: [18, 28], ph: [5, 8.5], light: ["low", "high"], co2: "low", growth: ["very-slow", "slow"], heightCm: 15, placements: ["foreground", "onRoot", "onRock"] });
    expect(plantById("hottonia-palustris")).toMatchObject({ temperature: [10, 20], ph: [5.5, 7.5], light: ["high", "high"], co2: "low", heightCm: 30 });
  });

  it("Tropica'nın sayfası başka bir formu anlatıyorsa tür kaydına karışmaz", () => {
    // Tropica'nın "Rotala macrandra" sayfası 'Japan' formunu anlatıyor; tür kaydı yalnız Fishkeeper'dan, sayfa 'Japan' kaydında.
    const rotala = plantById("rotala-macrandra");
    expect(rotala).toMatchObject({ temperature: [22, 28], ph: [5, 7], light: ["high", "high"], growth: ["fast", "fast"], heightCm: 55 });
    expect(rotala?.co2).toBeUndefined();
    expect(rotala?.additionalSourceUrls).toBeUndefined();
    expect(plantById("rotala-macrandra-japan")).toMatchObject({ sourceUrl: "https://tropica.com/en/plants/plantdetails/Rotalamacrandra(032TC)/4445", light: ["high", "high"], co2: "high", temperature: [22, 28] });
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
    // Tropica: "Stems from 20-60 cm", "(50-150 cm, 2 cm wide)", "up to 80 cm long", "20-50 cm tall", "15-40 cm tall",
    // "grows to a height of 50 cm", "Stems becomes 40-50 cm long".
    expect(plantById("pogostemon-stellatus")?.heightCm).toBe(60);
    expect(plantById("vallisneria-americana-var-gigantea")?.heightCm).toBe(150);
    expect(plantById("aponogeton-boivinianus")?.heightCm).toBe(80);
    expect(plantById("echinodorus-ozelot")?.heightCm).toBe(50);
    expect(plantById("echinodorus-reni")?.heightCm).toBe(40);
    expect(plantById("sagittaria-subulata")?.heightCm).toBe(50);
    expect(plantById("rotala-sp-green")?.heightCm).toBe(50);
    // "Stems becomes 30-50 cm"; sürgünle yayılan rozet bitkide "3-8 cm long, eliptic leaves"; "stems from 15-40 cm".
    expect(plantById("ammannia-crassicaulis")?.heightCm).toBe(50);
    expect(plantById("schismatoglottis-prietoi")?.heightCm).toBe(8);
    expect(plantById("hygrophila-corymbosa-stricta")?.heightCm).toBe(40);
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
    // Fishkeeper'a dayanan kayıtta CO₂ yalnız Tropica'da aynı bitkinin sayfası varsa yazılır (16 kayıtta yok).
    const fk = sourced.filter(fromFishkeeper);
    expect(fk.filter((item) => !item.co2).map((item) => item.id)).toEqual(fk.filter((item) => !item.additionalSourceUrls?.some((url) => TROPICA.test(url))).map((item) => item.id));
    expect(fk.filter((item) => !item.co2)).toHaveLength(16);
    // Tropica sıcaklık ve pH vermez: Tropica'ya dayanan kayıtta yalnız Fishkeeper'daki türün formuysa (10 kayıt) yazılır.
    const tropica = sourced.filter((item) => !fromFishkeeper(item));
    expect(tropica.filter((item) => item.temperature || item.ph).map((item) => item.id)).toEqual(tropica.filter((item) => item.additionalSourceUrls?.some((url) => FISHKEEPER.test(url))).map((item) => item.id));
    expect(tropica.filter((item) => item.temperature)).toHaveLength(10);
    // Tropica sayfasının alanları boşsa değer yazılmaz ('Needle Leaf': yalnız açıklamadaki boy ve yerleşim).
    const needle = plantById("sagittaria-subulata-needle-leaf");
    expect(needle).toMatchObject({ heightCm: 30, placements: ["background"] });
    expect(needle?.light).toBeUndefined();
    expect(needle?.co2).toBeUndefined();
  });

  it("yerleşim yalnız kaynağın açıklaması yazıyorsa dolu", () => {
    expect(plantById("microsorum-pteropus")?.placements).toEqual(["onRoot", "onRock"]);
    expect(plantById("hygrophila-polysperma")?.placements).toEqual(["background"]);
    expect(plantById("cryptocoryne-bullosa")?.placements).toEqual(["midground", "background"]);
    expect(plantById("salvinia-natans")?.placements).toEqual(["floating"]);
    expect(plantById("aponogeton-crispus")?.placements).toBeUndefined();
    expect(plantById("vallisneria-americana-var-gigantea")?.placements).toBeUndefined();
    // Tropica: "ideal, undemanding foreground plant", "suitable as a background plant", "decorative floating plant",
    // "Plant several stems in a group at the background".
    expect(plantById("sagittaria-subulata")?.placements).toEqual(["foreground"]);
    expect(plantById("pogostemon-deccanensis")?.placements).toEqual(["background"]);
    expect(plantById("hygrophila-corymbosa-stricta")?.placements).toEqual(["background"]);
    expect(plantById("limnobium-laevigatum")?.placements).toEqual(["floating"]);
    expect(plantById("echinodorus-reni")?.placements).toBeUndefined();
  });
});

describe("form kayıtları (Tropica'da ayrı sayfası olan formlar)", () => {
  it("formun değerleri Tropica sayfasından; sayfanın vermediği alanlar Fishkeeper'daki türün sayfasından", () => {
    // 'Trident': Tropica ışık ve CO₂ düşük, boy 15–20 cm; sıcaklık ve pH Java fern'in Fishkeeper sayfasından; ışığın üst ucu da oradan.
    expect(plantById("microsorum-pteropus-trident")).toMatchObject({
      light: ["low", "high"], co2: "low", heightCm: 20, temperature: [18, 30], ph: [5, 8],
      additionalSourceUrls: ["https://www.fishkeeper.co.uk/fish/plant/aquarium-plants/microsorum-pteropus"],
    });
    // 'Narrow': aynı tür sayfasından sıcaklık, pH ve ışığın üst ucu.
    expect(plantById("microsorum-pteropus-narrow")).toMatchObject({ light: ["low", "high"], co2: "low", heightCm: 20, temperature: [18, 30], ph: [5, 8] });
    // 'Petchii': Fishkeeper'daki C. beckettii'nin sıcaklığı (24–28 °C).
    expect(plantById("cryptocoryne-beckettii-petchii")).toMatchObject({ temperature: [24, 28], ph: [5.5, 8], light: ["low", "high"], co2: "low", heightCm: 15 });
    // 'Broad Leaf': kullanılan Tropica sayfası ışık vermiyor; ışık türün sayfasından, CO₂ boş.
    const broad = plantById("cryptocoryne-undulata-broad-leaf");
    expect(broad).toMatchObject({ light: ["low", "high"], temperature: [22, 28], heightCm: 30 });
    expect(broad?.co2).toBeUndefined();
    // Yerleşim: Tropica yazmıyorsa türün Fishkeeper açıklamasından ('Rosanervig' arka plan).
    expect(plantById("hygrophila-polysperma-rosanervig")?.placements).toEqual(["background"]);
    // 'Coin Leaf': Flowgrow "selected from cultivated Anubias barteri var. nana"; sıcaklık, pH ve ışığın üst ucu var. nana'nın Fishkeeper sayfasından.
    expect(plantById("anubias-barteri-coin-leaf")).toMatchObject({
      light: ["low", "high"], co2: "low", growth: ["slow", "slow"], heightCm: 15, temperature: [18, 28], ph: [5, 8.5], placements: ["onRock", "onRoot"],
      additionalSourceUrls: ["https://www.fishkeeper.co.uk/fish/plant/aquarium-plants/anubias-barteri-var-nana"],
    });
    // Fishkeeper'da türü olmayan form yalnız Tropica'dan ('Stricta'; büyüme hızı Tropica'da boş).
    const stricta = plantById("hygrophila-corymbosa-stricta");
    expect(stricta).toMatchObject({ light: ["low", "low"], co2: "low" });
    expect([stricta?.growth, stricta?.temperature, stricta?.ph]).toEqual([undefined, undefined, undefined]);
  });

  it("formların ürünleri tür kaydından ayrıldı; bütün ürünleri forma giden türler kataloğa girmez", () => {
    const shops = (id: string) => plantById(id)?.shopUrls ?? [];
    expect(shops("microsorum-pteropus").filter((url) => /trident-(saksi|on-wood)|stoffels-microsorum-pteropus-trident|narrow-(bankwood|saksi|on-wood)/.test(url))).toEqual([]);
    expect(shops("microsorum-pteropus")).toEqual(expect.arrayContaining(["https://aquarubi.com/microsorium-pteropus-trident-mini", "https://aquarubi.com/microsorium-pteropus-sp-narrow-mini-saksi"]));
    expect(shops("anubias-barteri-var-nana").some((url) => url.includes("pinto"))).toBe(false);
    // Flowgrow: 'Round Leaf' = 'Coin Leaf' = 'Gold Coin'; Aquarubi'nin "Golden Coin" ürünü bu formu anlatıyor.
    expect(shops("anubias-barteri-var-nana").some((url) => url.includes("golden-coin"))).toBe(false);
    expect(shops("anubias-barteri-coin-leaf")).toEqual(["https://aquarubi.com/anubias-barteri-var-nana-golden-coin"]);
    expect(plantForName("Anubias nana 'Golden Coin'")?.id).toBe("anubias-barteri-coin-leaf");
    expect(plantForName("Anubias barteri 'Round Leaf'")?.id).toBe("anubias-barteri-coin-leaf");
    expect(shops("hygrophila-polysperma").some((url) => url.includes("rosanervig"))).toBe(false);
    expect(shops("rotala-macrandra").some((url) => url.includes("tropica-rotala-macrandra"))).toBe(false);
    expect(shops("cryptocoryne-undulata").some((url) => url.includes("broad-lea"))).toBe(false);
    expect(shops("cryptocoryne-undulata-broad-leaf")).toEqual(["https://aquarubi.com/tropica-cryptocoryne-undulata-broad-leaves"]);
    expect(plantById("cryptocoryne-beckettii")).toBeUndefined();
    expect(plantById("helanthium-tenellum")).toBeUndefined();
  });
});

describe("istilacı tür listeleri", () => {
  it("UF/IFAS dizininin başlığındaki ABD federal zararlı ot ve FISC listeleri; formlar türün işaretini taşır", () => {
    const federal = { list: "us-federal-noxious-weed" as const };
    const listed = plantCatalog.filter((item) => item.invasiveListings?.length);
    expect(listed.map((item) => [item.id, item.invasiveListings])).toEqual([
      ["limnophila-sessiliflora", [{ ...federal, sourceUrl: ufUrl("limnophila-sessiliflora") }, { list: "fisc-invasive", category: 2, sourceUrl: ufUrl("limnophila-sessiliflora") }]],
      ["hygrophila-polysperma", [{ ...federal, sourceUrl: ufUrl("hygrophila-polysperma") }, { list: "fisc-invasive", category: 1, sourceUrl: ufUrl("hygrophila-polysperma") }]],
      ["hygrophila-polysperma-rosanervig", [{ ...federal, sourceUrl: ufUrl("hygrophila-polysperma") }, { list: "fisc-invasive", category: 1, sourceUrl: ufUrl("hygrophila-polysperma") }]],
      ["rotala-rotundifolia", [{ list: "fisc-invasive", category: 2, sourceUrl: ufUrl("rotala-rotundifolia") }]],
      // Tropica: 'Blood Red' "the most intensely red-colored variation of Rotala rotundifolia".
      ["rotala-rotundifolia-blood-red", [{ list: "fisc-invasive", category: 2, sourceUrl: ufUrl("rotala-rotundifolia") }]],
      // 3. paket: resmî listeler (AB, İngiltere) ve UF/IFAS'ın başlığı (Pistia: "FISC Category 1"; Azolla Florida'nın yerli bitkisi).
      ["azolla-filiculoides", [{ list: "england-sale-ban", sourceUrl: "https://www.legislation.gov.uk/uksi/2014/538/article/3" }]],
      ["pistia-stratiotes", [{ list: "eu-union-list", sourceUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02016R1141-20250807" }, { list: "fisc-invasive", category: 1, sourceUrl: ufUrl("pistia-stratiotes") }]],
    ]);
    // 'H'ra' yalnız "probably a variation", 'Green' ayrı bir Rotala sp.: işaret taşımaz.
    expect(plantById("rotala-rotundifolia-hra")?.invasiveListings).toBeUndefined();
    expect(plantById("rotala-sp-green")?.invasiveListings).toBeUndefined();
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
    expect(plantForName("Echinodorus tenellus 'Green'")?.id).toBe("helanthium-tenellum-green");
    expect(plantForName("Cladophora aegagropila")?.id).toBe("aegagropila-linnaei");
    expect(plantForName("Bacopa amplexicaulis")?.id).toBe("bacopa-caroliniana");
    expect(plantForName("Hygrophila polysperma 'Rosanervig'")?.id).toBe("hygrophila-polysperma-rosanervig");
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
    // Tropica'nın yazdığı eski ve yanlış satış adları: "Previously known as Pogostemon erectus", "has been sold as Echinodorus bolivianus
    // var. magdalenensis", "Used to be called ... Micranthemum micranthemoides", "Used to be sold as Ludwigia perennis".
    expect(plantForName("Pogostemon erectus")?.id).toBe("pogostemon-deccanensis");
    expect(plantForName("Echinodorus magdalenensis")?.id).toBe("helanthium-bolivianum-quadricostatus");
    expect(plantForName("Micranthemum micranthemoides")?.id).toBe("micranthemum-glomeratum");
    expect(plantForName("Ludwigia perennis")?.id).toBe("ludwigia-glandulosa");
    expect(plantForName("Hemianthus callitrichoides 'Cuba'")?.id).toBe("micranthemum-callitrichoides-cuba");
    expect(plantForName("Anubias nana 'Pinto'")?.id).toBe("anubias-barteri-var-nana-pinto");
    expect(plantForName("Microsorum 'Narrow Leaf'")?.id).toBe("microsorum-pteropus-narrow");
    expect(plantForName("Christmas moss")?.id).toBe("vesicularia-montagnei-christmas-moss");
    expect(plantForName("Hygrophila corymbosa (Limon)")?.id).toBe("hygrophila-corymbosa");
    // Flowgrow: var. glabra'nın eş adları; HC 'Cuba' Küba'dan getirilen H. callitrichoides (ayrı form değil).
    expect(plantForName("Anubias minima")?.id).toBe("anubias-barteri-var-glabra");
    expect(plantForName("Anubias lanceolata")?.id).toBe("anubias-barteri-var-glabra");
    expect(plantForName("Hemianthus callitrichoides")?.id).toBe("micranthemum-callitrichoides-cuba");
    expect(plantById("micranthemum-callitrichoides-cuba")?.shopUrls).toContain("https://aquarubi.com/stoffels-micranthemum-callitrichoides-in-vitro");
    // Tropica'nın 'Bukit Kelam' sayfaları bitkiyi 'Wavy Green' diye anlatıyor.
    expect(plantForName("Bucephalandra 'Wavy Green'")?.id).toBe("bucephalandra-pygmaea-bukit-kelam");
    // Flowgrow: Nesaea crassicaulis, Ammannia crassicaulis'in eş adı.
    expect(plantForName("Nesaea crassicaulis")?.id).toBe("ammannia-crassicaulis");
    // Aquarubi'nin "Var. Angustifolia" ürünü Tropica'nın 33-101C ürünü, yani 101C (var. glabra) sayfası; angustifolia ayrı bir varyete
    // olduğu için ad olarak eklenmedi.
    expect(plantById("anubias-barteri-var-glabra")?.shopUrls).toContain("https://aquarubi.com/tropica-anubias-barteri-var-angustifolia");
    expect(plantForName("Anubias barteri var. angustifolia")).toBeUndefined();
    // Aynı kural: "Tropica Cryptocoryne Wendtii" 33-109E ('Tropica'); "Tropica Hygrophila 'Siamensis'" 33-053A ('Stricta'; Flowgrow 'Siamensis'i ayrı
    // form sayıyor, ad olarak eklenmedi).
    expect(plantById("cryptocoryne-wendtii-tropica")?.shopUrls).toContain("https://aquarubi.com/tropica-cryptocoryne-wendtii");
    expect(plantById("hygrophila-corymbosa-stricta")?.shopUrls).toEqual(["https://aquarubi.com/tropica-hygrophila-siamensis"]);
    expect(plantForName("Hygrophila corymbosa 'Siamensis'")).toBeUndefined();
    expect(plantForName("")).toBeUndefined();
    expect(plantForName(undefined)).toBeUndefined();
  });

  it("kaynağın kaydı bir formsa başka bir formun ürünü ona bağlanmaz", () => {
    const shops = (id: string) => plantById(id)?.shopUrls ?? [];
    // 'Rosanervig' A. reineckii'nin ayrı bir kültür formu; 'Green Gecko' ayrı bir seçilmiş form; 'Ozelot Narrow Mini' dar yapraklı ayrı bir form.
    expect(shops("alternanthera-reineckii-var-rosaefolia").some((url) => url.includes("rosanervig"))).toBe(false);
    expect(shops("alternanthera-reineckii-rosanervig")).toEqual(["https://aquarubi.com/tropica-alternanthera-reineckii-rosanervig"]);
    expect(shops("cryptocoryne-wendtii-green").some((url) => url.includes("gecko"))).toBe(false);
    expect(shops("echinodorus-ozelot").some((url) => url.includes("narrow-mini"))).toBe(false);
    // Adında ya da açıklamasında formu yazmayan ürün form kaydına bağlanmaz (Tropica'nın 'Rose Maiden' ve 'Japan' sayfaları; Tropica'nın ürünü ya da
    // formu yazan ürün bağlı). "T/C Mini Cup" ve "Hydrocotyle Tripartita" ürünlerinin açıklaması formu yazıyor ("“Rose Maiden” adı altında",
    // "Hydrocotyle sp. ‘Japan’"); Stoffels'in "Eleocharis Pusilla" ürünü 'Mini' yazmıyor.
    expect(shops("cryptocoryne-nurii-rose-maiden")).toEqual(["https://aquarubi.com/cryptocoryne-nurii-rosen-maiden", "https://aquarubi.com/cryptocoryne-nurii-t-c-mini-cup"]);
    expect(shops("hydrocotyle-tripartita-japan")).toContain("https://aquarubi.com/hydrocotyle-tripartita");
    expect(shops("eleocharis-pusilla-mini")).toEqual(["https://aquarubi.com/tropica-eleocharis-pusilla-mini-in-vitro"]);
    // APC'nin 'Blood Red' ürünü türü ve formu yazıyor ("Rotala rotundifolia blood red"); aynı metni 'Singapore' adıyla veren ürün bağlanmadı.
    expect(shops("rotala-rotundifolia-blood-red")).toEqual(["https://aquarubi.com/tropica-rotala-rotundifolia-blood-red-in-vitro", "https://aquarubi.com/rotala-blood-red-vitro-apc"]);
    // Tropica'nın "Lindernia rotundifolia" sayfası 'Variegated'i anlatıyor: Tropica'nın ürünü ve 'Variegated' adlı ürün bağlı, formu yazmayan değil.
    expect(shops("lindernia-rotundifolia-variegated")).toEqual(["https://aquarubi.com/tropica-lindernia-rotundifolia", "https://aquarubi.com/lindernia-rotundifolia-variegated"]);
    // 'Mini Round', 'Japan' ve 'Godzilla' adlı Kedagang ürünleri başka formlar.
    expect(shops("bucephalandra-diabolica-kedagang").filter((url) => /mini-round|japan|godzilla/.test(url))).toEqual([]);
    expect(shops("bucephalandra-pygmaea-bukit-kelam")).not.toContain("https://aquarubi.com/bucephalandra-pygmaea");
    // Flowgrow: kırmızı "mattogrossense" M. tuberculatum; gerçek M. mattogrossense tamamen yeşil — kırmızı ve 'Golden' ürünler bağlanmaz.
    expect(shops("myriophyllum-mattogrossense")).toEqual(["https://aquarubi.com/myriophyllum-mattogrossense-green", "https://aquarubi.com/tropica-myriophyllum-mattogrossense"]);
    expect(plantForName("Myriophyllum mattogrossense 'Red'")).toBeUndefined();
  });
});

describe("bitki kataloğu modülü", () => {
  // Bitki sayfasının ilk yüklemesi büyümez: kayıtlar yalnız `usePlantCatalog` kancasıyla ayrı bir parça olarak yüklenir
  // (docs/DECISIONS/0024-bitki-secme.md). Tür içe aktarması (`import type`, `typeof import(...)`) derlemede silindiği için pakete kayıt taşımaz.
  // Dosyalar TypeScript'in kendi ayrıştırıcısıyla okunur: tırnak türü ve yazım biçimi denetimi yanıltmaz.
  const sourceFiles = (dir: string): string[] => readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return entry === "__tests__" ? [] : sourceFiles(path);
    return /\.(ts|tsx)$/.test(entry) ? [path] : [];
  });
  const isCatalog = (node: ts.Node | undefined) => Boolean(node && ts.isStringLiteralLike(node) && /(^|\/)catalog-plants(\.ts)?$/.test(node.text));
  // Dosyanın katalogla bağı: değer olarak içe aktarma (statik, yeniden dışa aktarma, require) ve ayrı parça yüklemesi (`import(...)`).
  const catalogUses = (file: string, text: string) => {
    const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    const uses = { value: [] as string[], dynamic: 0, typeOnly: 0 };
    const visit = (node: ts.Node) => {
      if (ts.isImportDeclaration(node) && isCatalog(node.moduleSpecifier)) {
        const clause = node.importClause;
        const bindings = clause?.namedBindings;
        const valueNames = !clause ? ["(yan etki)"] : clause.isTypeOnly ? [] : [
          ...(clause.name ? [clause.name.text] : []),
          ...(bindings && ts.isNamespaceImport(bindings) ? [`* as ${bindings.name.text}`] : []),
          ...(bindings && ts.isNamedImports(bindings) ? bindings.elements.filter((element) => !element.isTypeOnly).map((element) => element.name.text) : []),
        ];
        if (valueNames.length) uses.value.push(`import ${valueNames.join(", ")}`); else uses.typeOnly++;
      } else if (ts.isExportDeclaration(node) && isCatalog(node.moduleSpecifier)) {
        if (node.isTypeOnly) uses.typeOnly++; else uses.value.push("export … from");
      } else if (ts.isImportEqualsDeclaration(node) && ts.isExternalModuleReference(node.moduleReference) && isCatalog(node.moduleReference.expression)) {
        uses.value.push("import = require");
      } else if (ts.isCallExpression(node) && isCatalog(node.arguments[0])) {
        if (node.expression.kind === ts.SyntaxKind.ImportKeyword) uses.dynamic++;
        else if (ts.isIdentifier(node.expression) && node.expression.text === "require") uses.value.push("require");
      } else if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument) && isCatalog(node.argument.literal)) {
        uses.typeOnly++;
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
    return uses;
  };
  const appFiles = () => ["src/app", "src/components", "src/lib", "src/providers", "src/data"].flatMap((dir) => sourceFiles(dir))
    .map((file) => ({ file: file.replaceAll("\\", "/"), text: readFileSync(file, "utf8") }))
    .filter(({ file }) => !file.endsWith("src/data/catalog-plants.ts"));

  it("uygulama kodu kataloğu yalnız kancadaki ayrı parça olarak yükler; öbür dosyalar ondan yalnız tür alır", () => {
    const users = appFiles().map(({ file, text }) => ({ file, ...catalogUses(file, text) })).filter(({ value, dynamic, typeOnly }) => value.length || dynamic || typeOnly);
    expect(users.map(({ file }) => file).sort()).toEqual(["src/components/plant-catalog.tsx", "src/lib/use-plant-catalog.ts"]);
    expect(users.flatMap(({ file, value }) => value.map((use) => `${file}: ${use}`))).toEqual([]);
    expect(users.filter(({ dynamic }) => dynamic).map(({ file }) => file)).toEqual(["src/lib/use-plant-catalog.ts"]);
  });

  it("denetim değer içe aktarmasını her yazımda tanır; tür içe aktarmasını ve ayrı parça yüklemesini ayırır", () => {
    const uses = (text: string) => catalogUses("ornek.tsx", text);
    expect(uses("import { plantCatalog } from '@/data/catalog-plants';").value).toEqual(["import plantCatalog"]);
    expect(uses('import * as plants from "@/data/catalog-plants"').value).toEqual(["import * as plants"]);
    expect(uses('import "./catalog-plants";').value).toEqual(["import (yan etki)"]);
    expect(uses("import { type PlantProfile, plantById } from \"@/data/catalog-plants\";").value).toEqual(["import plantById"]);
    expect(uses("export { plantById } from '../data/catalog-plants';").value).toEqual(["export … from"]);
    expect(uses("const plants = require('@/data/catalog-plants');").value).toEqual(["require"]);
    expect(uses("import type { PlantProfile } from '@/data/catalog-plants';\ntype M = typeof import('@/data/catalog-plants');")).toEqual({ value: [], dynamic: 0, typeOnly: 2 });
    expect(uses("import { type PlantProfile } from '@/data/catalog-plants';").value).toEqual([]);
    expect(uses("const load = () => import('@/data/catalog-plants');").dynamic).toBe(1);
    expect(uses("import { plantCatalog } from '@/data/catalog-species';")).toEqual({ value: [], dynamic: 0, typeOnly: 0 });
  });
});
