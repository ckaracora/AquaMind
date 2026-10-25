import { existsSync, readFileSync } from "node:fs";
import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { messagesFor } from "@aquamind/localization";
import { diseaseMessagesFor } from "@aquamind/localization/diseases";
import { aquariumsWithInvertebrates, copperSources, diseaseSources, firstSteps, guideSources, requestedAquariumId, vetSources, type DiseaseSourceId } from "@/data/disease-guide";
import { AQUARIUM_PARAM, diseaseGuideHref, waterReadingHref } from "@/lib/aquarium-links";
import { allNavigationItems } from "@/data/navigation";
import type { Aquarium, Livestock } from "@/types/aquarium";

// Hastalık ve tedavi sayfası (docs/DECISIONS/0022-hastalik-ve-tedavi-sayfasi.md).
const t = messagesFor("tr");
const d = diseaseMessagesFor("tr");
const tank = (id: string, name: string): Aquarium => ({ id, name, type: "freshwater", lengthCm: 60, widthCm: 30, heightCm: 35, netVolumeLiters: 54, setupDate: "2026-01-01" });
const animal = (aquariumId: string, category: Livestock["category"], quantity = 1): Livestock => ({ id: `${aquariumId}-${category}-${quantity}`, aquariumId, commonName: category, category, quantity, addedAt: "2026-01-01" });

// Sayfanın içeriği gerçek bileşen çıktısıyla sınanır: veri sağlayıcısı ve kabuk yerine sınama değerleri verilir. Adres (`search`) bileşene
// doğrudan verilir; sayfa (src/app/diseases/page.tsx) yalnız tarayıcıdaki adresi okuyup bu bileşene geçirir.
const store = vi.hoisted(() => ({ value: { aquariums: [] as Aquarium[], livestock: [] as Livestock[], hydrated: true } }));
vi.mock("@/providers/aquarium-provider", () => ({ useAquariums: () => store.value }));
vi.mock("@/providers/i18n-provider", async () => {
  const { messagesFor: messages } = await import("@aquamind/localization");
  return { useI18n: () => ({ t: messages("tr"), locale: "tr" }) };
});
vi.mock("@/components/app-shell", () => ({ AppShell: ({ children }: { children: ReactNode }) => children }));
vi.mock("@/components/page-header", () => ({ PageHeader: () => null }));
const { DiseaseGuideView } = await import("@/components/disease-guide-view");
const render = (search = "") => renderToStaticMarkup(createElement(DiseaseGuideView, { search }));
const decode = (html: string) => html.replace(/&#x27;/g, "'").replace(/&quot;/g, "\"").replace(/&amp;/g, "&");

describe("bakır uyarısının akvaryumları", () => {
  const tanks = [tank("a", "Salon"), tank("b", "Karides"), tank("c", "Nano"), tank("d", "Boş")];
  const animals = [
    animal("a", "fish", 6),
    animal("b", "shrimp", 10), animal("b", "snail", 2),
    animal("c", "snail", 3), animal("c", "fish", 4),
    animal("d", "shrimp", 0),
  ];

  it("karides ya da salyangoz bulunan akvaryumları türüyle bulur; adedi sıfır olan kaydı saymaz", () => {
    expect(aquariumsWithInvertebrates(tanks, animals).map(({ aquarium, kinds }) => [aquarium.id, kinds])).toEqual([["b", "both"], ["c", "snail"]]);
    expect(aquariumsWithInvertebrates(tanks, [animal("a", "shrimp", 1)]).map(({ kinds }) => kinds)).toEqual(["shrimp"]);
    expect(aquariumsWithInvertebrates(tanks, [animal("a", "fish", 3), animal("a", "other", 1)])).toEqual([]);
    expect(aquariumsWithInvertebrates(tanks, [animal("silinmis", "shrimp", 4)])).toEqual([]);
  });

  it("sağlık analizinden gelinen akvaryumu başa alır; bilinmeyen ya da omurgasızı olmayan akvaryum sırayı değiştirmez", () => {
    expect(aquariumsWithInvertebrates(tanks, animals, "c").map(({ aquarium }) => aquarium.id)).toEqual(["c", "b"]);
    expect(aquariumsWithInvertebrates(tanks, animals, "a").map(({ aquarium }) => aquarium.id)).toEqual(["b", "c"]);
    expect(aquariumsWithInvertebrates(tanks, animals, "yok").map(({ aquarium }) => aquarium.id)).toEqual(["b", "c"]);
  });

  it("uyarı akvaryumun adını ve içindeki omurgasızları yazar", () => {
    expect(d.copperAquarium("Karides", "both")).toBe("Karides akvaryumunda karides ve salyangoz var. Bu canlılar bakıra çok duyarlıdır ve düşük düzeyde bile ölürler; eklediğin ilacın omurgasızlar için güvenli olduğundan emin ol.");
    expect(d.copperAquarium("Nano", "snail")).toMatch(/^Nano akvaryumunda salyangoz var\. /);
    expect(d.copperAquarium("Salon", "shrimp")).toMatch(/^Salon akvaryumunda karides var\. /);
  });
});

describe("sayfanın metinleri kaynağa sadık", () => {
  it("ilk adımlar ve bakır uyarısı kaynakların söylediğini yazar; teşhis ya da ilaç önerisi yok", () => {
    expect(d.notice).toBe("AquaMind hastalık teşhisi koymaz ve ilaç önermez. Bu sayfa seni güvenilir kaynaklara ve veterinere yönlendirir.");
    // UF/IFAS FA031: "should also be tested immediately any time fish appearance or behavior changes (including reduced feeding)";
    // "In healthy ponds and tanks, ammonia levels should always be zero."
    expect(d.steps.water).toBe("Suyu hemen ölç: balığın görünüşü ya da davranışı değiştiğinde, yem yemesi azaldığında bile amonyak hemen ölçülmeli. Sağlıklı bir akvaryumda amonyak her zaman sıfırdır.");
    // OATA lepistes ve moli kartı: "Signs of disease can include clamped fins, flicking against gravel or décor and shimmying (shaking)."
    expect(d.steps.signs).toBe("Hastalık belirtileri arasında yüzgeçleri kapalı tutma, çakıla ya da dekora sürtünme, titreme, beyaz benek ya da pamuksu oluşum var. Belirti göstermeyen balık da hastalık taşıyabilir.");
    // UF/IFAS FA124: "All animal and plant life should be quarantined before introduction into an established aquarium system".
    expect(d.steps.quarantine).toBe("Yeni aldığın canlıyı ve bitkiyi ana akvaryuma koymadan önce ayrı bir akvaryumda tut. Hasta canlı için veterinere ya da balık sağlığı uzmanına danış.");
    // OATA karides ve salyangoz kartı: "very sensitive to copper" ... "will die if exposed even to low levels"; "Always ensure that any treatments
    // added to the aquarium are safe for invertebrates." Practical Fishkeeping (Monks): "Copper and formalin-based medications are lethal to shrimps."
    expect(d.copperGeneral).toBe("Karides ve salyangozlar bakıra çok duyarlıdır; düşük düzeyde bile bakıra maruz kalırlarsa ölürler. Akvaryuma eklediğin her ilacın omurgasızlar için güvenli olduğundan emin ol. Bakır ve formalin içeren ilaçlar karidesler için öldürücüdür.");
    expect(d.vetHelp).toBe("Süs balığı tedavi eden bir veteriner bulmak için il veteriner hekimleri odasını arayıp balık bakan hekim sorabilirsin. Veteriner fakültelerinin su ürünleri hastalıkları bölümleri balık hastalıkları üzerine çalışır; süs balığına hizmet verip vermediklerini önce sor.");
    expect(d.sponsorNote).toBe("Sponsorlu içerik olursa açıkça \"Sponsorlu\" diye işaretlenir ve önerileri etkilemez.");
  });

  it("her kaynağın adı ve yayımcısı dil dosyasında", () => {
    for (const id of Object.keys(diseaseSources) as DiseaseSourceId[]) {
      expect(d.sources[id].name.trim()).not.toBe("");
      expect(d.sources[id].publisher.trim()).not.toBe("");
    }
  });

  it("sayfa metinleri dil paketinin ana girişine bağlı değil (yalnız bu sayfanın paketine girer)", () => {
    for (const file of ["index.ts", "messages/tr.ts"]) {
      const source = readFileSync(`packages/localization/src/${file}`, "utf8");
      expect(source, file).not.toMatch(/["'`]\.\/(?:messages\/)?(?:tr-)?diseases(?:\.ts)?["'`]/);
    }
    // Hastalık sayfasının metinleri ana dil dosyasına başka bir adla da kopyalanmamalı.
    const main = JSON.stringify(t);
    const texts = [d.notice, d.description, d.copperGeneral, d.vetHelp, d.sponsorNote, ...Object.values(d.steps), ...Object.values(d.sources).map((source) => source.name)];
    for (const text of texts) expect(main.includes(JSON.stringify(text).slice(1, -1)), text).toBe(false);
    expect(readFileSync("src/components/disease-guide-view.tsx", "utf8")).toContain('from "@aquamind/localization/diseases"');
  });
});

describe("kaynaklar", () => {
  const used: DiseaseSourceId[] = [...firstSteps.flatMap((step) => step.sources), ...copperSources, ...vetSources, ...guideSources];

  it("her kaynak HTTPS, okuma tarihli ve dili belli; sayfada kullanılmayan kaynak yok", () => {
    for (const [id, source] of Object.entries(diseaseSources)) {
      expect(source.id).toBe(id);
      expect(source.url).toMatch(/^https:\/\/[^\s]+$/);
      expect(source.verifiedAt).toBe("2026-10-22");
      expect(["tr", "en"]).toContain(source.language);
      expect(used).toContain(id);
    }
  });

  it("açılarak doğrulanan adresler: ilk adımlar, bakır uyarısı, veteriner kaynakları ve rehberler", () => {
    expect(firstSteps.map((step) => [step.key, step.sources.map((id) => diseaseSources[id].url)])).toEqual([
      ["water", ["https://ask.ifas.ufl.edu/fa031"]],
      ["signs", ["https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-tropical-freshwater-fish/how-to-look-after-guppies-and-mollies/"]],
      ["quarantine", ["https://ask.ifas.ufl.edu/fa124"]],
    ]);
    expect(copperSources.map((id) => diseaseSources[id].url)).toEqual([
      "https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-tropical-freshwater-invertebrates/how-to-look-after-freshwater-shrimp-and-snails/",
      "https://www.practicalfishkeeping.co.uk/fishkeeping-answers/articles/are-there-any-shrimps-my-fish-wont-eat",
    ]);
    expect(vetSources.map((id) => [diseaseSources[id].url, diseaseSources[id].language])).toEqual([
      ["https://tvhb.org.tr/odalar/", "tr"],
      ["https://veteriner.erciyes.edu.tr/tr/d/su-urunleri-ve-hastaliklari-anabilim-dali-tanitimi/klinik-oncesi-bolumler", "tr"],
      ["https://www.fishvetsociety.org.uk/find-a-vet/", "en"],
    ]);
    expect(guideSources.map((id) => diseaseSources[id].url)).toEqual([
      "https://ask.ifas.ufl.edu/topics/fish-health-management",
      "https://ornamentalfish.org/what-we-do/advice-information/care-sheets/",
      "https://ask.ifas.ufl.edu/fa031",
    ]);
  });
});

describe("sayfanın çıktısı", () => {
  beforeEach(() => {
    store.value = { aquariums: [tank("a", "Salon"), tank("b", "Karides"), tank("c", "Nano")], livestock: [animal("a", "fish", 6), animal("b", "shrimp", 10), animal("c", "snail", 2)], hydrated: true };
  });

  it("karides ya da salyangoz bulunan akvaryumları bakır uyarısında adıyla yazar; veri yüklenmeden akvaryum uyarısı göstermez", () => {
    const html = decode(render());
    expect(html).toContain(d.copperAquarium("Karides", "shrimp"));
    expect(html).toContain(d.copperAquarium("Nano", "snail"));
    expect(html).not.toContain("Salon akvaryumunda");
    expect(html.indexOf("Karides akvaryumunda")).toBeLessThan(html.indexOf("Nano akvaryumunda"));
    expect(html).toContain(d.copperGeneral);
    store.value = { ...store.value, hydrated: false };
    const waiting = decode(render());
    expect(waiting).not.toContain("akvaryumunda");
    expect(waiting).toContain(d.copperGeneral);
  });

  it("sağlık analizinden gelinen akvaryum (?aquarium=) bakır uyarısında başa gelir ve su ölçümü bağlantısı o akvaryuma gider", () => {
    const from = decode(render("?aquarium=c"));
    expect(from.indexOf("Nano akvaryumunda")).toBeGreaterThan(-1);
    expect(from.indexOf("Nano akvaryumunda")).toBeLessThan(from.indexOf("Karides akvaryumunda"));
    expect(from).toMatch(/<a href="\/water\?aquarium=c"[^>]*>Su ölçümü ekle<\/a>/);
    // Kayıtlı olmayan akvaryum, başka sorgu anahtarı ve veri yüklenmeden önceki durum sırayı ve su bağlantısını değiştirmez.
    for (const search of ["?aquarium=yok", "?tank=c", ""]) {
      const html = decode(render(search));
      expect(html.indexOf("Karides akvaryumunda"), search).toBeLessThan(html.indexOf("Nano akvaryumunda"));
      expect(html, search).toMatch(/<a href="\/water"[^>]*>Su ölçümü ekle<\/a>/);
    }
    store.value = { ...store.value, hydrated: false };
    expect(decode(render("?aquarium=c"))).toMatch(/<a href="\/water"[^>]*>Su ölçümü ekle<\/a>/);
  });

  it("uyarıyı, ilk adımları ve su ölçümü bağlantısını gösterir", () => {
    const html = decode(render());
    expect(html).toContain(d.notice);
    for (const step of firstSteps) expect(html).toContain(d.steps[step.key]);
    expect(html).toMatch(/<a href="\/water"[^>]*>Su ölçümü ekle<\/a>/);
  });

  it("her dış bağlantı yeni sekmede, doğru dille açılır ve en az 44 × 44 piksel dokunma alanı vardır", () => {
    const html = decode(render());
    const links = [...html.matchAll(/<a ([^>]*)>(.*?)<\/a>/g)].filter(([, attributes]) => /href="https:/.test(attributes));
    const expected = [...firstSteps.flatMap((step) => step.sources), ...copperSources, ...vetSources, ...guideSources];
    expect(links.map(([, attributes]) => attributes.match(/href="([^"]+)"/)?.[1])).toEqual(expected.map((id) => diseaseSources[id].url));
    links.forEach(([, attributes, content], index) => {
      const source = diseaseSources[expected[index]];
      expect(attributes).toContain('target="_blank"');
      expect(attributes).toContain('rel="noreferrer"');
      expect(attributes).toContain(`hrefLang="${source.language}"`);
      const classes = (attributes.match(/class="([^"]*)"/)?.[1] ?? "").split(/\s+/);
      expect(classes).toContain("min-h-11");
      // Satır boyu bağlantılar (liste, `flex`) tam genişliktedir; satır içindeki kaynak etiketi (`inline-flex`) en az 44 piksel genişliktedir.
      expect(classes.includes("flex") || (classes.includes("inline-flex") && classes.includes("min-w-11"))).toBe(true);
      expect(content).toContain(`${d.language[source.language]}, ${d.opensNewTab}`);
      expect(content).toContain(`>${d.languageShort[source.language]}<`);
    });
  });
});

describe("sayfanın yeri", () => {
  it("yan menüde ve sağlık analizinde bağlantısı var", () => {
    expect(allNavigationItems.find((item) => item.key === "diseases")).toEqual({ key: "diseases", href: "/diseases" });
    expect(t.navigation.items.diseases).toBe("Hastalık ve Tedavi");
    expect(existsSync("src/app/diseases/page.tsx")).toBe(true);
    const health = readFileSync("src/app/aquariums/[id]/health/page.tsx", "utf8");
    expect(health).toContain("href={diseaseGuideHref(id)}");
    // Sağlık analizi bağlantıyı küçük yardımcıdan kurar; hastalık sayfasının kaynak listesini kendi paketine almaz.
    expect(health).toContain('from "@/lib/aquarium-links"');
    expect(health).not.toMatch(/["'`]@\/data\/disease-guide["'`]/);
  });

  it("sayfa tarayıcıdaki adresi içeriği çizen bileşene verir", () => {
    const page = readFileSync("src/app/diseases/page.tsx", "utf8");
    expect(page).toContain("setSearch(location.search)");
    expect(page).toContain("<DiseaseGuideView search={search}/>");
  });

  it("akvaryum kimliği adreste kodlanır ve geri okunur; su ölçümü sayfası aynı anahtarı okur", () => {
    expect(AQUARIUM_PARAM).toBe("aquarium");
    expect(diseaseGuideHref("aqua-1")).toBe("/diseases?aquarium=aqua-1");
    expect(diseaseGuideHref("custom&part")).toBe("/diseases?aquarium=custom%26part");
    expect(waterReadingHref("custom&part")).toBe("/water?aquarium=custom%26part");
    expect(waterReadingHref()).toBe("/water");
    const odd = tank("custom&part", "Özel");
    expect(requestedAquariumId(new URL(`https://aquamind.test${diseaseGuideHref(odd.id)}`).search, [odd])).toBe("custom&part");
    expect(requestedAquariumId("?aquarium=yok", [odd])).toBeUndefined();
    expect(requestedAquariumId("?tank=custom%26part", [odd])).toBeUndefined();
    expect(readFileSync("src/app/water/page.tsx", "utf8")).toContain('searchParams.get("aquarium")');
  });
});
