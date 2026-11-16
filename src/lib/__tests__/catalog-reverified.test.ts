import { describe, expect, it, vi } from "vitest";
import { careProductCatalog } from "@/data/care-product-catalog";
import { equipmentCatalog, type EquipmentProfile } from "@/data/catalog-equipment";
import { shopVerifiedAt, shopVerifiedEquipment, unverifiedAirFlowIds, unverifiedEquipmentIds, withdrawUnverifiedEquipmentValues } from "@/data/catalog-equipment-unverified";
import { plantCatalog } from "@/data/catalog-plants";
import { reverifiedCare, reverifiedEquipment, type ReverifiedGroup } from "@/data/catalog-reverified";
import { reverifiedCareDates } from "@/data/catalog-reverified-care-dates";
import { reverifiedEquipmentDates } from "@/data/catalog-reverified-equipment-dates";
import { reverifiedCareSources } from "@/data/catalog-reverified-care-sources";
import { reverifiedEquipmentSources } from "@/data/catalog-reverified-equipment-sources";
import { applyReverifiedDates, applyReverifiedSources, type ReverifiedDates } from "@/data/catalog-shared";
import { speciesCatalog } from "@/data/catalog-species";
import { isCalendarDate } from "@/lib/data-coverage";
import { localIsoDate } from "@/lib/local-date";

// Yeniden doğrulama tablosu (src/data/catalog-reverified.ts; docs/DATA_SOURCES.md → "Yeniden doğrulama tablosu"): kaynağı yeniden okunan
// kayıtların günü kimlikle tutulur; katalog kurulurken tablonun adressiz kopyası uygulanır. Tablo yanlış kayda, uydurma güne ya da kaydın
// kaynağı olmayan bir adrese gidemez; tarih geri gitmez; tabloda olmayan kayıt değişmez.

interface SourcedRecord { id: string; sourceUrl?: string; additionalSourceUrls?: string[]; verifiedAt?: string }
const catalogs: Record<string, readonly SourcedRecord[]> = {
  canlı: speciesCatalog, ekipman: equipmentCatalog, "bakım ürünü": careProductCatalog, bitki: plantCatalog,
};
const tables: [label: string, groups: readonly ReverifiedGroup[], dates: ReverifiedDates][] = [
  ["ekipman", reverifiedEquipment, reverifiedEquipmentDates], ["bakım ürünü", reverifiedCare, reverifiedCareDates],
];
// Okuma günü kaynağın açıldığı gündür; çalıştırıldığı yerin saat dilimi UTC'nin gerisindeyse UTC günü de kabul edilir.
const today = [localIsoDate(), new Date().toISOString().slice(0, 10)].sort().at(-1)!;
const rows = (groups: readonly ReverifiedGroup[]) => groups.flatMap(([readAt, url, ids]) => ids.map((id) => ({ id, readAt, url })));
const dayOf = (groups: readonly ReverifiedGroup[]) => new Map(rows(groups).map(({ id, readAt }) => [id, readAt]));
const later = (a: string | undefined, b: string) => ((a ?? "") < b ? b : a);

// Tabloya kaynak olabilen siteler (docs/DATA_SOURCES.md → "Kaynak önceliği", 1–3. sıra). Alt alan adları da sayılır (gb.aleas.cn, us.sicce.com).
const acceptedHosts: Record<string, string> = {
  // "Kabul edilen yerel ikincil kaynaklar"
  "atakanpetshop.com": "kabul edilen mağaza", "bettamarketim.com.tr": "kabul edilen mağaza", "aquarubi.com": "kabul edilen mağaza",
  "cikletistpetshop.com": "kabul edilen mağaza", "malawiizmir.com": "kabul edilen mağaza", "akvaryumexpress.com": "kabul edilen mağaza",
  // Üreticinin kendi sitesi (1. sıra) ya da Türkiye distribütörü (2. sıra)
  "aleas.cn": "Jeneca üreticisi (DATA_SOURCES)", "rissee.com": "Resun üreticisi (DATA_SOURCES)",
  "qimeigroup.com": "Dophin üreticisi (CATALOG_LOG, 2026-10-10)", "sunsun-china.com": "SunSun üreticisi Sensen Group (CATALOG_LOG, 2026-11-12 paket A)",
  "sobo.com.tr": "Sobo Türkiye distribütörü (CATALOG_LOG, 2026-10-16 tarama)", "sicce.com": "Sicce üreticisi (CATALOG_LOG, 2026-10-16 tarama)",
  "armaturk.com.tr": "Armatürk'ün resmî sitesi (CATALOG_LOG, Armatürk portföyü)", "sera.de": "Sera", "adana.co.jp": "ADA", "tropical.pl": "Tropical",
  "istaproducts.com": "ISTA", "orionled.com.tr": "OrionLED", "aquael.com": "Aquael", "eheim.com": "Eheim", "tetra.net": "Tetra",
  "tropica.com": "Tropica", "creaqua.com.tr": "Creaqua", "netlea.com": "Netlea", "shrimpsforever.com": "Shrimps Forever",
  // 2026-11-15 tarih yenileme 2: markanın kendi sitesi (1. sıra). Dayanak: sayfa altındaki şirket bilgisi, 2026-11-15 kontrolünde okundu.
  "dennerle.com": "Dennerle GmbH'nin sitesi", "co2art.eu": "CO2Art Technologies Limited'in AB mağazası (sayfa altı)",
  "twinstarstore.kr": "TWINSTAR Official Store, TWINSTAR Inc. (sayfa altı; CATALOG_LOG, 2026-11-11)", "2hraquarist.com": "The 2Hr Aquarist (APT markasının sahibi)",
  "ferplast.com": "Ferplast Official", "fluvalaquatics.com": "Fluval (Rolf C. Hagen) resmî sitesi", "oase.com": "Oase GmbH'nin sitesi",
  "haqos.com": "Zhongshan Hailong Electric Appliance Co. (sayfa altı: \"our own brand HAQOS\")",
  // 2026-11-16 tarih yenileme 2 (C bandı): markanın kendi sitesi (1. sıra, lider kararı).
  "jbl.de": "JBL GmbH & Co. KG'nin kendi sitesi",
};
// Markanın kendi kataloğu ya da kılavuzu başka bir sitede (2. sıra, "marka kataloğu"): yalnız bu dosyalar, sitenin öbür sayfaları değil.
const brandCatalogs = new Set([
  "https://www.as-aquaristik.de/media/39/39/01/1679328023/Chihiros%20Catalogue%202022%20english.pdf", // Chihiros 2022 kataloğu
  "https://europeanaquaristics.com/wp-content/uploads/B-LINE_EN.pdf", // Twinstar B-Line belgesi
]);
const acceptedSource = (url: string) => {
  if (brandCatalogs.has(url)) return true;
  const host = new URL(url).hostname.replace(/^www\./, "");
  return Object.keys(acceptedHosts).some((accepted) => host === accepted || host.endsWith(`.${accepted}`));
};

describe("yeniden doğrulama tablosunun uygulanması", () => {
  it("tarih yalnız ileri gider; katalogda olmayan kimlik bildirilir", () => {
    const items = [{ id: "eski", verifiedAt: "2026-08-17" }, { id: "yeni", verifiedAt: "2026-11-20" }, { id: "ayni", verifiedAt: "2026-11-15" }];
    const missing = applyReverifiedDates(items, [["2026-11-15", ["eski", "yeni", "ayni", "yok"]]]);
    expect(items.map((item) => item.verifiedAt)).toEqual(["2026-11-15", "2026-11-20", "2026-11-15"]);
    expect(missing).toEqual(["yok"]);
  });

  // Adres taşıması (catalog-reverified-*-sources.ts): eski ana adres kaynak izi olarak ek kaynaklara geçer (AGENTS.md, "Kaynak bilgisini kaybetme").
  it("adres taşıması eski adresi ek kaynakta tutar, yinelemez; bilinmeyen kimliği bildirir", () => {
    const items: { id: string; sourceUrl?: string; additionalSourceUrls?: string[] }[] = [
      { id: "liste", sourceUrl: "https://a.example/liste" },
      { id: "ekli", sourceUrl: "https://a.example/eski", additionalSourceUrls: ["https://a.example/yeni", "https://a.example/kilavuz", "https://a.example/eski"] },
      { id: "yalniz-ek", sourceUrl: "https://a.example/ana" },
    ];
    const missing = applyReverifiedSources(items, {
      liste: { sourceUrl: "https://a.example/urun" },
      ekli: { sourceUrl: "https://a.example/yeni", addSourceUrls: ["https://a.example/kilavuz"] },
      "yalniz-ek": { addSourceUrls: ["https://a.example/katalog.pdf"] },
      yok: { sourceUrl: "https://a.example/x" },
    });
    expect(missing).toEqual(["yok"]);
    expect(items[0]).toEqual({ id: "liste", sourceUrl: "https://a.example/urun", additionalSourceUrls: ["https://a.example/liste"] });
    expect(items[1]).toEqual({ id: "ekli", sourceUrl: "https://a.example/yeni", additionalSourceUrls: ["https://a.example/kilavuz", "https://a.example/eski"] });
    expect(items[2]).toEqual({ id: "yalniz-ek", sourceUrl: "https://a.example/ana", additionalSourceUrls: ["https://a.example/katalog.pdf"] });
  });

  // Mağaza doğrulaması (karar 0019; catalog-equipment-unverified.ts) da tarihi yalnız ileri götürür: iki adımın sırası sonucu değiştirmez.
  it("mağaza doğrulaması ile tablo hangi sırayla uygulanırsa uygulansın kayıt en geç günü taşır", () => {
    const id = Object.keys(shopVerifiedEquipment)[0];
    const record = (): EquipmentProfile => ({ id, category: "filter", brand: "X", model: "Y", specifications: "a", sourceUrl: "https://example.com/", verifiedAt: "2026-08-17" });
    for (const readAt of ["2026-11-15", "2026-10-01"]) {
      const expected = later(shopVerifiedAt, readAt);
      const shopFirst = [record()];
      withdrawUnverifiedEquipmentValues(shopFirst);
      applyReverifiedDates(shopFirst, [[readAt, [id]]]);
      const tableFirst = [record()];
      applyReverifiedDates(tableFirst, [[readAt, [id]]]);
      withdrawUnverifiedEquipmentValues(tableFirst);
      expect([shopFirst[0].verifiedAt, tableFirst[0].verifiedAt], readAt).toEqual([expected, expected]);
    }
  });

  // Tablo uygulanmadan önceki katalog: tarih kopyaları boşaltılarak modüller yeniden yüklenir. Gerçek katalogda yalnız tablodaki kayıtların
  // yalnız `verifiedAt` alanı değişmiş olmalı; o da eski günle okuma gününün geç olanı.
  it("gerçek katalogda yalnız tablodaki kayıtların günü değişir, başka alan ya da kayıt değişmez", async () => {
    vi.resetModules();
    vi.doMock("@/data/catalog-reverified-equipment-dates", () => ({ reverifiedEquipmentDates: [] }));
    vi.doMock("@/data/catalog-reverified-care-dates", () => ({ reverifiedCareDates: [] }));
    try {
      const raw = { ekipman: (await import("@/data/catalog-equipment")).equipmentCatalog, "bakım ürünü": (await import("@/data/care-product-catalog")).careProductCatalog };
      for (const [label, groups] of tables) {
        const before = new Map((raw[label as keyof typeof raw] as readonly SourcedRecord[]).map((item) => [item.id, item]));
        const day = dayOf(groups);
        const after = catalogs[label];
        expect(after.length, label).toBe(before.size);
        const changed: string[] = [];
        const wrong: string[] = [];
        for (const item of after) {
          const old = before.get(item.id);
          if (!old) { wrong.push(`${item.id}: tablo öncesi katalogda yok`); continue; }
          const { verifiedAt: oldDay, ...oldRest } = old;
          const { verifiedAt: newDay, ...newRest } = item;
          if (JSON.stringify(oldRest) !== JSON.stringify(newRest)) wrong.push(`${item.id}: verifiedAt dışında alan değişti`);
          const readAt = day.get(item.id);
          const expected = readAt ? later(oldDay, readAt) : oldDay;
          if (newDay !== expected) wrong.push(`${item.id}: ${oldDay} → ${newDay}, beklenen ${expected}`);
          if (newDay !== oldDay) changed.push(item.id);
        }
        expect(wrong, label).toEqual([]);
        expect(changed.length, `${label}: tablo hiçbir kaydı değiştirmedi`).toBeGreaterThan(0);
      }
    } finally {
      vi.doUnmock("@/data/catalog-reverified-equipment-dates");
      vi.doUnmock("@/data/catalog-reverified-care-dates");
      vi.resetModules();
    }
  });
});

describe.each(tables)("yeniden doğrulama tablosu: %s", (label, groups, dates) => {
  const catalog = catalogs[label];
  const byId = new Map(catalog.map((item) => [item.id, item]));

  it("adressiz kopya tabloyla aynı (değişince: node scripts/reverified-dates.cjs)", () => {
    const fromDates = new Map(dates.flatMap(([readAt, ids]) => ids.map((id) => [id, readAt])));
    expect([...fromDates].sort()).toEqual([...dayOf(groups)].sort());
    expect(dates.reduce((sum, [, ids]) => sum + ids.length, 0)).toBe(fromDates.size);
  });

  it("her kimlik kendi katalogunda var, tabloda yalnız bir kez geçiyor ve başka bir katalogun kimliği değil", () => {
    const ids = rows(groups).map((row) => row.id);
    expect(ids.length).toBeGreaterThan(0);
    expect(ids.filter((id) => !byId.has(id)), "katalogda olmayan kimlik").toEqual([]);
    expect(ids.filter((id, index) => ids.indexOf(id) !== index), "iki kez geçen kimlik").toEqual([]);
    for (const [other, items] of Object.entries(catalogs)) {
      if (other === label) continue;
      const otherIds = new Set(items.map((item) => item.id));
      expect(ids.filter((id) => otherIds.has(id)), `${other} kataloğuyla çakışan kimlik`).toEqual([]);
    }
  });

  // Değeri kabul edilmeyen kaynak yüzünden hesaptan çekilen kayıt (karar 0019) o kaynağı yeniden okuyarak doğrulanmış sayılmaz.
  it("değeri hesaptan çekilen ekipman tabloda yok", () => {
    const withdrawn = new Set([...unverifiedEquipmentIds, ...unverifiedAirFlowIds, ...Object.entries(shopVerifiedEquipment).filter(([, item]) => item.note).map(([id]) => id)]);
    expect(rows(groups).map((row) => row.id).filter((id) => withdrawn.has(id))).toEqual([]);
  });

  // "Doğrulandı" demek için kaynak kabul edilmiş olmalı (lider kararı, 2026-11-15; docs/CATALOG_SOURCE_GAPS.md "Kaynak kabul listesinde değil,
  // tarih yenilenmedi"). Yeni bir site eklenecekse dayanağı (docs/DATA_SOURCES.md ya da docs/CATALOG_LOG.md satırı) yanına yazılır.
  it("okunan adres docs/DATA_SOURCES.md'nin kabul ettiği bir kaynak", () => {
    const outside = rows(groups).filter(({ url }) => !acceptedSource(url)).map(({ id, url }) => `${id}: ${url}`);
    expect(outside).toEqual([]);
  });

  it("okuma günü takvimde olan bir gün ve gelecekte değil", () => {
    for (const [readAt] of groups) {
      expect(isCalendarDate(readAt), readAt).toBe(true);
      expect(readAt <= today, `${readAt} gelecekte`).toBe(true);
    }
  });

  // Adres kaydın kaynak adresiyle harfi harfine aynı olmalı: okunan sayfa ile kaydın bağladığı sayfa aynı sayfadır.
  it("okunan adres kaydın kaynak adreslerinden biri", () => {
    const mismatched = rows(groups).filter(({ id, url }) => {
      const item = byId.get(id);
      return !url.startsWith("https://") || !item || ![item.sourceUrl, ...(item.additionalSourceUrls ?? [])].includes(url);
    });
    expect(mismatched).toEqual([]);
  });
});

// 2026-11-15 tarih yenileme 2: yeniden okunurken kaynak adresi değişen kayıtlar (catalog-reverified-*-sources.ts). Taşıma yalnız aynı okumayla
// tabloya giren kayıtta olur; yeni ana adres kabul edilen kaynaktır ve katalogda gerçekten kaydın adresi olmuştur; ek kaynak eklenmişse kayıtta durur.
describe("kaynak adresi taşımaları", () => {
  for (const [label, sources, items, groups] of [
    ["ekipman", reverifiedEquipmentSources, equipmentCatalog, reverifiedEquipment],
    ["bakım ürünü", reverifiedCareSources, careProductCatalog, reverifiedCare],
  ] as const) {
    it(`${label}: taşınan kayıt katalogda ve tabloda; yeni adres kabul edilen HTTPS kaynak`, () => {
      const byId = new Map((items as readonly SourcedRecord[]).map((item) => [item.id, item]));
      const inTable = new Set(groups.flatMap(([, , ids]) => ids));
      const problems = Object.entries(sources).flatMap(([id, move]) => {
        const item = byId.get(id);
        if (!item) return [`${id}: katalogda yok`];
        const issues: string[] = [];
        if (!inTable.has(id)) issues.push(`${id}: tabloda yok`);
        if (move.sourceUrl && (item.sourceUrl !== move.sourceUrl || !move.sourceUrl.startsWith("https://") || !acceptedSource(move.sourceUrl))) issues.push(`${id}: ${move.sourceUrl}`);
        for (const url of move.addSourceUrls ?? []) if (!item.additionalSourceUrls?.includes(url) || !url.startsWith("https://") || !acceptedSource(url)) issues.push(`${id}: ek kaynak ${url}`);
        if (item.additionalSourceUrls?.includes(item.sourceUrl ?? "")) issues.push(`${id}: ana adres ek kaynaklarda da var`);
        return issues;
      });
      expect(problems).toEqual([]);
    });
  }

  // Taşımadan önceki katalog: adres dosyaları boşaltılıp modüller yeniden yüklenir. Taşınan her kaydın eski ana adresi ek kaynaklarda durmalı.
  it("taşınan kaydın eski ana adresi ek kaynaklarda duruyor", async () => {
    vi.resetModules();
    vi.doMock("@/data/catalog-reverified-equipment-sources", () => ({ reverifiedEquipmentSources: {} }));
    vi.doMock("@/data/catalog-reverified-care-sources", () => ({ reverifiedCareSources: {} }));
    try {
      const raw = [
        [reverifiedEquipmentSources, equipmentCatalog, (await import("@/data/catalog-equipment")).equipmentCatalog],
        [reverifiedCareSources, careProductCatalog, (await import("@/data/care-product-catalog")).careProductCatalog],
      ] as const;
      const lost: string[] = [];
      for (const [sources, items, before] of raw) {
        const now = new Map((items as readonly SourcedRecord[]).map((item) => [item.id, item]));
        const old = new Map((before as readonly SourcedRecord[]).map((item) => [item.id, item]));
        for (const [id, move] of Object.entries(sources)) {
          const previous = old.get(id)?.sourceUrl;
          if (!move.sourceUrl || !previous || previous === move.sourceUrl) continue;
          if (!now.get(id)?.additionalSourceUrls?.includes(previous)) lost.push(`${id}: ${previous}`);
        }
      }
      expect(lost).toEqual([]);
    } finally {
      vi.doUnmock("@/data/catalog-reverified-equipment-sources");
      vi.doUnmock("@/data/catalog-reverified-care-sources");
      vi.resetModules();
    }
  });
});
