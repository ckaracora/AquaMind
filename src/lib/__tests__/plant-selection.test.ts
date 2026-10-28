import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createDisplayFormat, messagesFor, type DisplayPreferences } from "@aquamind/localization";
import * as plantCatalogModule from "@/data/catalog-plants";
import { plantById, plantForRecord, searchPlants } from "@/data/catalog-plants";

// Bitki sayfasında katalogdan seçme (docs/DECISIONS/0024-bitki-secme.md). Bileşenler gerçek çıktılarıyla sınanır; dil ve görüntü
// biçimi sağlayıcı yerine sınama değerleriyle verilir.
const t = messagesFor("tr");
const store = vi.hoisted(() => ({ preferences: { temperature: "celsius", volume: "liters", dateFormat: "day-first" } as DisplayPreferences }));
vi.mock("@/providers/i18n-provider", async () => {
  const { messagesFor: messages } = await import("@aquamind/localization");
  return { useI18n: () => ({ t: messages("tr"), locale: "tr" }) };
});
vi.mock("@/lib/use-display-format", async () => {
  const { createDisplayFormat: format } = await import("@aquamind/localization");
  return { useDisplayFormat: () => format("tr", store.preferences) };
});
const { PlantCardCatalog, PlantFacts, PlantForm, PlantInvasiveNotice, PlantSearchResults, PlantSelectedFields, PlantShortFacts, PlantSources, plantFromForm, plantRecord, suggestedPositions } = await import("@/components/plant-catalog");
const decode = (html: string) => html.replace(/&#x27;/g, "'").replace(/&quot;/g, "\"").replace(/&amp;/g, "&");
const text = (html: string) => decode(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const item = (id: string) => plantById(id)!;
const render = (element: Parameters<typeof renderToStaticMarkup>[0]) => decode(renderToStaticMarkup(element));

beforeEach(() => { store.preferences = { temperature: "celsius", volume: "liters", dateFormat: "day-first" }; });

describe("katalogda arama", () => {
  it("bilimsel ad, eş ad ve satış adıyla bulur; Türkçe harf, büyük-küçük harf, tırnak ve işaret farkı gözetmez", () => {
    expect(searchPlants("java fern").map((result) => [result.item.id, result.matchedName])).toEqual([["microsorum-pteropus", "Java fern"]]);
    expect(searchPlants("tilki kuyrugu")[0]).toMatchObject({ item: { id: "ceratophyllum-demersum" }, matchedName: "Tilki kuyruğu" });
    expect(searchPlants("TİLKİ")[0]?.item.id).toBe("ceratophyllum-demersum");
    expect(searchPlants("windelov")[0]?.item.id).toBe("microsorum-pteropus-windelov");
    expect(searchPlants("anubias nana golden").map((result) => result.matchedName)).toEqual(["Anubias nana 'Golden'", "Anubias nana 'Golden Coin'"]);
    expect(searchPlants("nesaea")[0]?.item.id).toBe("ammannia-crassicaulis");
    // Kesme işareti sözcüğü bölmez: 'H'ra' tırnaksız "Hra" yazılır.
    for (const query of ["Rotala rotundifolia Hra", "Rotala Hra", "rotala vietnam hra", "H'ra"]) expect(searchPlants(query)[0]?.item.id, query).toBe("rotala-rotundifolia-hra");
    expect(searchPlants("")).toEqual([]);
    expect(searchPlants("   ")).toEqual([]);
    expect(searchPlants("kaktüs")).toEqual([]);
  });

  it("adın tamamı ve başı önce gelir; aynı sırada kısa ad önce (en çok aranan ad önerilir)", () => {
    const anubias = searchPlants("anubias");
    expect(anubias[0]).toMatchObject({ item: { id: "anubias-barteri-var-nana" }, matchedName: "Anubias nana" });
    expect(anubias.every((result) => result.item.scientificName.startsWith("Anubias"))).toBe(true);
    // "Rotala rotundifolia" adın tamamı; formları ve öbür Rotala'lar arkada.
    expect(searchPlants("rotala rotundifolia")[0]?.item.id).toBe("rotala-rotundifolia");
    // Sözcüklerin hepsi aynı adda geçmelidir.
    expect(searchPlants("nana coffeefolia")).toEqual([]);
  });
});

describe("kullanıcının bitki kaydı ve katalog", () => {
  it("katalog kimliği varsa o kayıt; yoksa (eski ve elle yazılan kayıt) bilimsel ad, sonra ad", () => {
    expect(plantForRecord({ name: "Bitkim", catalogId: "staurogyne-repens" })?.id).toBe("staurogyne-repens");
    expect(plantForRecord({ name: "Anubias Nana", scientificName: "Anubias barteri var. nana" })?.id).toBe("anubias-barteri-var-nana");
    expect(plantForRecord({ name: "Java moss", scientificName: "" })?.id).toBe("taxiphyllum-barbieri");
    expect(plantForRecord({ name: "Amazon kılıcı", scientificName: "Echinodorus grisebachii" })).toBeUndefined();
    // Bilimsel ad yazılı ama katalogda yoksa ad denenmez: ad daha genel bir satış adı olabilir ('Siamensis' katalogda bilerek yok).
    expect(plantForRecord({ name: "Hygrophila corymbosa", scientificName: "Hygrophila corymbosa 'Siamensis'" })).toBeUndefined();
    expect(plantForRecord({ name: "Anubias Nana", scientificName: "Anubias barteri var. angustifolia" })).toBeUndefined();
    expect(plantForRecord({ name: "Anubias Nana", scientificName: "  " })?.id).toBe("anubias-barteri-var-nana");
    // Katalogdan çıkmış bir kimlik başka kayda düşmez.
    expect(plantForRecord({ name: "Anubias nana", catalogId: "kaldirilmis-kayit" })).toBeUndefined();
  });

  it("katalogdan seçilen bitki bilimsel adı ve katalog kimliğiyle; elle yazılan bitki yazıldığı gibi kaydedilir", () => {
    const fields = { aquariumId: "aqua-1", name: "Zeytin", scientificName: "yazılan ad", quantity: 5, position: "Arka plan", addedAt: "2026-10-28", notes: "" };
    const fromCatalog = plantRecord(fields, item("hygrophila-polysperma"));
    expect(fromCatalog).toMatchObject({ aquariumId: "aqua-1", name: "Zeytin", scientificName: "Hygrophila polysperma", catalogId: "hygrophila-polysperma", quantity: 5, position: "Arka plan", addedAt: "2026-10-28" });
    const manual = plantRecord(fields);
    expect(manual).toMatchObject({ name: "Zeytin", scientificName: "yazılan ad", quantity: 5 });
    expect(manual.catalogId).toBeUndefined();
    expect(fromCatalog.id).not.toBe(manual.id);
  });

  it("pencere formu: bitki seçilmeden gönderilirse (arama alanında Enter) kayıt kurulmaz; ad boş ya da adet 1'den küçükse de kurulmaz", () => {
    const formData = (values: Record<string, string>) => { const data = new FormData(); for (const [key, value] of Object.entries(values)) data.set(key, value); return data; };
    const filled = { name: "Zeytin", quantity: "3", position: "", addedAt: "2026-10-28", notes: "" };
    // Arama görünümünde formda yalnız arama alanı var: ad, adet ve tarih yok.
    expect(plantFromForm(formData({}), { aquariumId: "aqua-1", manual: false })).toBeUndefined();
    expect(plantFromForm(formData(filled), { aquariumId: "aqua-1", manual: false })).toBeUndefined();
    const fromCatalog = plantFromForm(formData(filled), { aquariumId: "aqua-1", manual: false, selected: item("rotala-rotundifolia") });
    expect(fromCatalog).toMatchObject({ aquariumId: "aqua-1", name: "Zeytin", quantity: 3, position: "", addedAt: "2026-10-28", scientificName: "Rotala rotundifolia", catalogId: "rotala-rotundifolia" });
    // Elle yazmaya geçildiyse daha önce seçilen bitkinin kimliği kayda girmez.
    const manual = plantFromForm(formData({ ...filled, scientificName: "Rotala sp." }), { aquariumId: "aqua-1", manual: true, selected: item("rotala-rotundifolia") });
    expect(manual).toMatchObject({ name: "Zeytin", scientificName: "Rotala sp.", quantity: 3 });
    expect(manual?.catalogId).toBeUndefined();
    expect(plantFromForm(formData({ ...filled, name: "  " }), { aquariumId: "aqua-1", manual: true })).toBeUndefined();
    expect(plantFromForm(formData({ ...filled, quantity: "0" }), { aquariumId: "aqua-1", manual: true })).toBeUndefined();
    expect(plantFromForm(formData({ ...filled, quantity: "" }), { aquariumId: "aqua-1", manual: false, selected: item("rotala-rotundifolia") })).toBeUndefined();
  });

  it("kaynağın önerdiği yerleşim kayıttaki konum değerine çevrilir; ilki pencerede seçili gelir", () => {
    expect(suggestedPositions(item("hygrophila-polysperma"))).toEqual(["Arka plan"]);
    expect(suggestedPositions(item("anubias-barteri-var-nana"))).toEqual(["Ön plan", "Kök üzeri", "Kaya üzeri"]);
    expect(suggestedPositions(item("ceratophyllum-demersum"))).toEqual(["Yüzen"]);
    expect(suggestedPositions(item("rotala-rotundifolia"))).toEqual([]);
  });
});

describe("bitkinin bilgileri", () => {
  it("bütün bilgiler dilin biçimiyle; kaynakta olmayan bilgi \"Kaynakta yok\" yazar", () => {
    expect(text(renderToStaticMarkup(createElement(PlantFacts, { item: item("hygrophila-polysperma") })))).toBe(
      "Işık Düşük–yüksek CO₂ Düşük Sıcaklık 18–30 °C pH 5–9 Boy 40 cm'ye kadar Büyüme Çok hızlı");
    expect(text(renderToStaticMarkup(createElement(PlantFacts, { item: item("anubias-barteri-var-nana") })))).toContain("pH 5–8,5");
    // Tropica'ya dayanan kayıt: sıcaklık ve pH yok.
    expect(text(renderToStaticMarkup(createElement(PlantFacts, { item: item("staurogyne-repens") })))).toBe(
      "Işık Düşük CO₂ Düşük Sıcaklık Kaynakta yok pH Kaynakta yok Boy 10 cm'ye kadar Büyüme Orta");
    expect(text(renderToStaticMarkup(createElement(PlantFacts, { item: item("anubias-heterophylla") })))).toBe(
      "Işık Orta CO₂ Kaynakta yok Sıcaklık 22–30 °C pH Kaynakta yok Boy 80 cm'ye kadar Büyüme Kaynakta yok");
  });

  it("sıcaklık ayarlardaki birimle yazılır", () => {
    store.preferences = { ...store.preferences, temperature: "fahrenheit" };
    expect(text(renderToStaticMarkup(createElement(PlantFacts, { item: item("hygrophila-polysperma") })))).toContain("Sıcaklık 64,4–86 °F");
  });

  it("kısa bilgi ışık, CO₂ ve boydur", () => {
    expect(text(renderToStaticMarkup(createElement(PlantShortFacts, { item: item("anubias-barteri-var-nana") })))).toBe("Işık düşük–yüksek CO₂ düşük 15 cm");
    expect(text(renderToStaticMarkup(createElement(PlantShortFacts, { item: item("anubias-heterophylla") })))).toBe("Işık orta CO₂ kaynakta yok 80 cm");
  });

  it("istilacı tür uyarısı kaynaklı listeleri yazar ve Türkiye'de yasak anlamına gelmediğini söyler; listede olmayan bitkide uyarı yok", () => {
    expect(text(renderToStaticMarkup(createElement(PlantInvasiveNotice, { item: item("hygrophila-polysperma") })))).toBe(
      "Doğaya bırakmayın. Bu bitki ABD'de federal zararlı ot listesinde ve Florida İstilacı Türler Konseyi'nin listesinde (UF/IFAS). Bu, Türkiye'de yasak olduğu anlamına gelmez.");
    expect(text(renderToStaticMarkup(createElement(PlantInvasiveNotice, { item: item("rotala-rotundifolia") })))).toBe(
      "Doğaya bırakmayın. Bu bitki Florida İstilacı Türler Konseyi'nin listesinde (UF/IFAS). Bu, Türkiye'de yasak olduğu anlamına gelmez.");
    expect(text(renderToStaticMarkup(createElement(PlantInvasiveNotice, { item: item("rotala-rotundifolia"), short: true })))).toBe("Doğaya bırakmayın (istilacı tür listesinde)");
    expect(renderToStaticMarkup(createElement(PlantInvasiveNotice, { item: item("staurogyne-repens") }))).toBe("");
    expect(renderToStaticMarkup(createElement(PlantInvasiveNotice, { item: item("staurogyne-repens"), short: true }))).toBe("");
  });

  it("kaynaklar kaydın sayfalarına bağlanır; aynı kaynak bir kez yazılır", () => {
    const html = render(createElement(PlantSources, { item: item("hygrophila-polysperma") }));
    expect(text(html)).toBe("Kaynak: Fishkeeper · Tropica · UF/IFAS");
    expect(html).toContain('href="https://www.fishkeeper.co.uk/fish/plant/aquarium-plants/hygrophila-polysperma-"');
    expect(html).toContain('href="https://tropica.com/en/plants/plantdetails/Hygrophilapolysperma(050)/4483"');
    expect(html).toContain('href="https://plant-directory.ifas.ufl.edu/plant-directory/hygrophila-polysperma/"');
    expect(text(render(createElement(PlantSources, { item: item("anubias-barteri-var-nana") })))).toBe("Kaynak: Fishkeeper · Tropica");
  });
});

describe("bitki ekleme penceresi", () => {
  const catalogState = (state: Partial<{ catalog: typeof plantCatalogModule; failed: boolean }>) => ({ catalog: undefined, failed: false, retry: () => {}, ...state });
  const form = (state: Partial<{ catalog: typeof plantCatalogModule; failed: boolean }>) => render(createElement(PlantForm, { aquariumId: "aqua-1", aquariumName: "Salon akvaryumu", catalog: catalogState(state), close: () => {}, save: () => {} }));

  it("önce katalogda arama ve \"Katalogda yok\" seçeneği; bitki seçilmeden kaydetme düğmesi yok", () => {
    const html = form({ catalog: plantCatalogModule });
    expect(text(html)).toContain("Katalogda ara");
    expect(html).toContain('placeholder="Bilimsel ad, satış adı ya da eş ad"');
    expect(text(html)).toContain("Örn. anubias nana, java fern, tilki kuyruğu");
    expect(text(html)).toContain("Katalogda yok, kendim yazacağım");
    expect(text(html)).not.toContain(t.plants.form.submit);
    expect(html).not.toContain("disabled");
  });

  it("katalog yüklenirken ve yüklenemediğinde elle yazma seçeneği kalır", () => {
    const loading = form({});
    expect(text(loading)).toContain("Bitki kataloğu hazırlanıyor…");
    expect(loading).toContain("disabled");
    expect(text(loading)).toContain("Katalogda yok, kendim yazacağım");
    const failed = form({ failed: true });
    expect(text(failed)).toContain("Bitki kataloğu yüklenemedi. Yeniden dene");
    expect(text(failed)).toContain("Katalogda yok, kendim yazacağım");
  });

  it("arama sonuçları en çok sekiz; sonuç sayısı ve fazlası yazılır; sonuç yoksa elle yazma önerilir", () => {
    const results = searchPlants("anubias");
    const html = render(createElement(PlantSearchResults, { results, select: () => {} }));
    expect(text(html)).toContain(`Katalogda ${results.length} sonuç`);
    expect(html.match(/<button/g)).toHaveLength(8);
    expect(text(html)).toContain(`${results.length - 8} sonuç daha; aramayı daralt`);
    expect(text(html)).toContain("Anubias barteri var. nana Anubias nana · Anubias nana 'Golden' · Anubias nana 'Pangolino' Işık düşük–yüksek CO₂ düşük 15 cm");
    expect(text(render(createElement(PlantSearchResults, { results: [], select: () => {} })))).toBe("Katalogda bulunamadı. Başka bir adla ara ya da bitkiyi kendin yaz.");
  });
});

describe("seçilen bitkinin alanları", () => {
  const fields = (id: string, matchedName = item(id).scientificName) => render(createElement(PlantSelectedFields, { selected: { item: item(id), matchedName }, change: () => {} }));
  const selectedPosition = (html: string) => [...html.matchAll(/<option value="([^"]*)"( selected="")?>/g)].filter((match) => match[2]).map((match) => match[1]);

  it("kaynağın önerdiği ilk yerleşim seçili gelir ve altında bütün öneriler yazılır; ad aramaya uyan adla gelir", () => {
    const polysperma = fields("hygrophila-polysperma", "Hygrophila polysperma (Zeytin)");
    expect(selectedPosition(polysperma)).toEqual(["Arka plan"]);
    expect(text(polysperma)).toContain("Kaynağın önerisi: Arka plan");
    expect(polysperma).toContain('value="Hygrophila polysperma (Zeytin)"');
    const nana = fields("anubias-barteri-var-nana");
    expect(selectedPosition(nana)).toEqual(["Ön plan"]);
    expect(text(nana)).toContain("Kaynağın önerisi: Ön plan, Kök üzeri, Kaya üzeri");
  });

  it("kaynak yerleşim yazmıyorsa konum seçilmez (tahmin edilmez) ve bu yazılır", () => {
    const html = fields("rotala-rotundifolia");
    expect(selectedPosition(html)).toEqual([""]);
    expect(html).toContain('<option value="" selected="">Seçilmedi</option>');
    expect(text(html)).toContain("Kaynak yerleşim yazmıyor; istersen sen seç.");
    expect(text(html)).not.toContain("Kaynağın önerisi");
  });

  it("bilgi kartı, istilacı uyarısı ve kaynaklar seçilen bitkide görünür", () => {
    const html = text(fields("hygrophila-polysperma"));
    expect(html).toContain("Sıcaklık 18–30 °C");
    expect(html).toContain("Doğaya bırakmayın.");
    expect(html).toContain("Kaynak: Fishkeeper · Tropica · UF/IFAS");
    expect(html).toContain("Başka bitki seç");
  });
});

describe("bitki listesindeki kart", () => {
  it("kısa bilgi, istilacı türde kısa uyarı ve kapalı ayrıntı düğmesi", () => {
    const html = render(createElement(PlantCardCatalog, { item: item("hygrophila-polysperma") }));
    expect(text(html)).toBe("Işık düşük–yüksek CO₂ düşük 40 cm Doğaya bırakmayın (istilacı tür listesinde) Ayrıntılar");
    expect(html).toContain('aria-expanded="false"');
    expect(text(render(createElement(PlantCardCatalog, { item: item("staurogyne-repens") })))).toBe("Işık düşük CO₂ düşük 10 cm Ayrıntılar");
  });

  it("listedeki tarih satırı katalogdan seçilen bitkiyi gösterir", () => {
    expect(t.plants.catalog.fromCatalog(createDisplayFormat("tr", store.preferences).calendarDate("2026-10-25"))).toBe("Katalogdan · 25.10.2026");
  });
});
