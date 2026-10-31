import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Locale } from "@aquamind/localization";
import { createLocaleRequester } from "@/lib/locale-requests";

// Dil isteklerinin sırası (karar 0021, 5. paket): paket yüklenirken yeni dil istenirse yalnız son istek uygulanır.

/** Elle bitirilen yükleme: her dil için bekleyen söz ve onu bitiren/düşüren fonksiyonlar. */
function manualLoader() {
  const pending = new Map<Locale, Array<{ resolve: () => void; reject: (error: Error) => void }>>();
  const load = (locale: Locale) => (locale === "tr" ? Promise.resolve() : new Promise<void>((resolve, reject) => pending.set(locale, [...(pending.get(locale) ?? []), { resolve, reject }])));
  return {
    load,
    finish: (locale: Locale) => pending.get(locale)!.forEach((item) => item.resolve()),
    fail: (locale: Locale) => pending.get(locale)!.forEach((item) => item.reject(new Error("ağ hatası"))),
  };
}

describe("dil isteklerinin sırası", () => {
  it("İngilizce yüklenirken Türkçe seçilirse geç biten İngilizce yükleme seçimi ezmez", async () => {
    const loader = manualLoader();
    const applied: Array<[Locale, boolean]> = [];
    const requester = createLocaleRequester(loader.load, (locale, remember) => applied.push([locale, remember]));
    const english = requester.request("en", false);
    const turkish = requester.request("tr", true);
    await turkish;
    expect(applied).toEqual([["tr", true]]);
    loader.finish("en");
    await english;
    expect(applied).toEqual([["tr", true]]);
    expect(requester.latest()).toBe("tr");
  });

  it("açılıştaki istek iki kez başlarsa (StrictMode) yalnız sonuncusu uygulanır", async () => {
    const loader = manualLoader();
    const applied: Locale[] = [];
    const requester = createLocaleRequester(loader.load, (locale) => applied.push(locale));
    const first = requester.request("en", false);
    const second = requester.request("en", false);
    loader.finish("en");
    await Promise.all([first, second]);
    expect(applied).toEqual(["en"]);
  });

  it("son isteğin yükleme hatası çağırana iletilir; geride kalan isteğin hatası sessizdir", async () => {
    const loader = manualLoader();
    const applied: Locale[] = [];
    const requester = createLocaleRequester(loader.load, (locale) => applied.push(locale));
    const failing = requester.request("en", true);
    loader.fail("en");
    await expect(failing).rejects.toThrow("ağ hatası");
    expect(applied).toEqual([]);

    const loader2 = manualLoader();
    const requester2 = createLocaleRequester(loader2.load, (locale) => applied.push(locale));
    const superseded = requester2.request("en", true);
    await requester2.request("tr", true);
    loader2.fail("en");
    await expect(superseded).resolves.toBeUndefined();
    expect(applied).toEqual(["tr"]);
  });

  it("sağlayıcı açılış yüklemesini ve Ayarlar'daki seçimi aynı sıraya koyar; Ayarlar son istenen dili gösterir", () => {
    const provider = readFileSync("src/providers/i18n-provider.tsx", "utf8");
    expect(provider).toContain("if (wanted !== DEFAULT_LOCALE) request(wanted, false).catch(() => {});");
    expect(provider).toContain("const setLocale = useCallback((next: Locale) => request(next, true), [request]);");
    expect(provider).not.toMatch(/loadLocaleBundle\([a-z]+\)\.then/);
    // Sekme başlığı seçili dilde tutulur (davranış testi: locale-choice.test.ts).
    expect(provider).toContain("useEffect(() => keepDocumentTitle(document, messagesFor(locale).app.title), [locale]);");
    const settings = readFileSync("src/app/settings/page.tsx", "utf8");
    expect(settings).toContain("value={requestedLocale}");
    expect(settings).not.toContain("value===locale");
  });
});
