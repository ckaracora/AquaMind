import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_PREFERENCES } from "@aquamind/domain";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@aquamind/localization";
import {
  LOCALE_BOOT_SCRIPT, LOCALE_PENDING_ATTRIBUTE, LOCALE_REVEAL_TIMEOUT_MS, LOCALE_STORAGE_KEY, initialLocale, keepDocumentTitle, localeFromLanguages, regionalPreferences,
  storeLocale, storedLocale,
} from "@/lib/locale-choice";

// Arayüz dilinin seçimi (docs/DECISIONS/0021-dil-altyapisi.md, 5. paket): bu cihazda seçilmiş dil, yoksa tarayıcının dili.

const memoryStorage = (entries: Record<string, string> = {}) => {
  const data = new Map(Object.entries(entries));
  return { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => void data.set(key, value), data };
};

afterEach(() => vi.unstubAllGlobals());

describe("tarayıcı dili", () => {
  it("dil listesinde desteklenen ilk dil seçilir; yoksa Türkçe", () => {
    expect(localeFromLanguages(["en-US", "tr-TR"])).toBe("en");
    expect(localeFromLanguages(["tr-TR", "en-US"])).toBe("tr");
    expect(localeFromLanguages(["en-GB"])).toBe("en");
    expect(localeFromLanguages(["EN"])).toBe("en");
    expect(localeFromLanguages(["de-DE", "en-US"])).toBe("en");
    expect(localeFromLanguages(["de-DE", "fr-FR"])).toBe(DEFAULT_LOCALE);
    expect(localeFromLanguages([])).toBe(DEFAULT_LOCALE);
    expect(localeFromLanguages([""])).toBe(DEFAULT_LOCALE);
  });
});

describe("birimlerin ilk ayarı (kayıtlı tercih yokken)", () => {
  it("tarayıcının ilk dil etiketinin bölgesi ABD ise galon, °F ve AA/GG/YYYY; öbür bölgelerde varsayılanlar", () => {
    const us = { ...DEFAULT_PREFERENCES, temperature: "fahrenheit", volume: "gallons", dateFormat: "month-first" };
    expect(regionalPreferences(["en-US", "tr-TR"])).toEqual(us);
    expect(regionalPreferences(["es-US"])).toEqual(us);
    expect(regionalPreferences(["en-us"])).toEqual(us);
    for (const languages of [["en-GB"], ["en-CA"], ["en-AU"], ["en"], ["tr-TR", "en-US"], ["tr"], ["zh-Hant-TW"], [], [""]]) {
      expect(regionalPreferences(languages), languages.join()).toEqual(DEFAULT_PREFERENCES);
    }
    // Bildirim ve görünüm tercihleri değişmez.
    expect(regionalPreferences(["en-US"], { ...DEFAULT_PREFERENCES, productNews: true }).productNews).toBe(true);
  });

  it("sağlayıcı bu ayarı yalnız kayıtlı tercih yoksa kullanır (depoya yazmaz)", () => {
    expect(readFileSync("src/providers/aquarium-provider.tsx", "utf8")).toContain("setPreferences(loadPreferences(browserPreferenceDefaults()));");
  });
});

describe("cihazda saklanan seçim", () => {
  it("yalnız desteklenen dil okunur; depo okunamazsa seçim yok sayılır", () => {
    expect(storedLocale(memoryStorage({ [LOCALE_STORAGE_KEY]: "en" }))).toBe("en");
    expect(storedLocale(memoryStorage({ [LOCALE_STORAGE_KEY]: "tr" }))).toBe("tr");
    expect(storedLocale(memoryStorage({ [LOCALE_STORAGE_KEY]: "de" }))).toBeUndefined();
    expect(storedLocale(memoryStorage())).toBeUndefined();
    expect(storedLocale({ getItem: () => { throw new Error("SecurityError"); } })).toBeUndefined();
    expect(storedLocale(undefined)).toBeUndefined();
  });

  it("seçim tarayıcının dilinden önce gelir; yazılan seçim sonraki açılışta okunur", () => {
    const storage = memoryStorage();
    vi.stubGlobal("window", { localStorage: storage });
    vi.stubGlobal("navigator", { languages: ["en-US"], language: "en-US" });
    expect(initialLocale()).toBe("en");
    expect(storeLocale("tr")).toBe(true);
    expect(storage.data.get(LOCALE_STORAGE_KEY)).toBe("tr");
    expect(initialLocale()).toBe("tr");
  });

  it("depo yazılamazsa seçim bu oturumda geçerli kalır ama hata fırlatmaz", () => {
    vi.stubGlobal("window", { localStorage: { getItem: () => null, setItem: () => { throw new Error("QuotaExceededError"); } } });
    expect(storeLocale("en")).toBe(false);
  });

  it("anahtar sıfırlamada silinen önekle başlar ve yedek dosyasının anahtarları arasında yok", () => {
    expect(LOCALE_STORAGE_KEY.startsWith("aquamind:")).toBe(true);
    expect(readFileSync("packages/domain/src/local-export.ts", "utf8")).not.toContain(LOCALE_STORAGE_KEY);
    expect(readFileSync("packages/domain/src/local-storage.ts", "utf8")).not.toContain(LOCALE_STORAGE_KEY);
  });
});

describe("sekme başlığı", () => {
  /** Sahte belge ve gözlemci: `<head>` değişikliğini elle bildirir, başlık yazımlarını sayar. */
  const fakeDocument = (initial: string) => {
    let title = initial;
    let writes = 0;
    const observers: Array<{ callback: () => void; target?: unknown; options?: MutationObserverInit; connected: boolean }> = [];
    class FakeObserver {
      private entry: { callback: () => void; target?: unknown; options?: MutationObserverInit; connected: boolean };
      constructor(callback: () => void) { this.entry = { callback, connected: false }; observers.push(this.entry); }
      observe(target: unknown, options?: MutationObserverInit) { this.entry.target = target; this.entry.options = options; this.entry.connected = true; }
      disconnect() { this.entry.connected = false; }
      takeRecords() { return []; }
    }
    const head = {};
    const doc = { head, get title() { return title; }, set title(value: string) { title = value; writes += 1; } };
    /** Next.js'in başlığı yeniden yazması: başlık değişir ve bağlı gözlemciler bildirim alır. */
    const nextWrites = (value: string) => { title = value; for (const observer of observers) if (observer.connected) observer.callback(); };
    return { doc: doc as unknown as Pick<Document, "title" | "head">, Observer: FakeObserver as unknown as typeof MutationObserver, nextWrites, observers, head, writes: () => writes, title: () => title };
  };

  it("başlığı hemen seçili dilde yazar; Next.js sonradan Türkçe yazarsa yeniden İngilizceye çevirir; aynıysa yazmaz", () => {
    const page = fakeDocument("AquaMind — Akvaryum yönetimi");
    const stop = keepDocumentTitle(page.doc, "AquaMind — Aquarium management", page.Observer);
    expect(page.title()).toBe("AquaMind — Aquarium management");
    expect(page.observers.map((observer) => observer.target)).toEqual([page.head]);
    // `<title>` öğesinin değişmesi (childList), içindeki metnin değişmesi (characterData, öğenin altında: subtree) izlenir.
    expect(page.observers[0].options).toEqual({ childList: true, subtree: true, characterData: true });
    page.nextWrites("AquaMind — Akvaryum yönetimi");
    expect(page.title()).toBe("AquaMind — Aquarium management");
    const before = page.writes();
    page.nextWrites("AquaMind — Aquarium management");
    expect(page.writes()).toBe(before);
    // Dil değişince (efekt temizlenir) eski gözlemci durur; yeni dilin başlığı geçerli olur.
    stop();
    expect(page.observers.every((observer) => !observer.connected)).toBe(true);
    keepDocumentTitle(page.doc, "AquaMind — Akvaryum yönetimi", page.Observer);
    page.nextWrites("AquaMind — Akvaryum yönetimi");
    expect(page.title()).toBe("AquaMind — Akvaryum yönetimi");
  });
});

describe("açılış betiği", () => {
  /** Betiği sahte bir sayfada çalıştırır; `<html>` özniteliklerini ve kurulan zamanlayıcıyı döner. */
  const boot = (stored: string | null, languages: string[] | undefined, language = "", storageThrows = false) => {
    const attributes = new Map<string, string>();
    const html = { lang: DEFAULT_LOCALE as string, setAttribute: (name: string, value: string) => void attributes.set(name, value), removeAttribute: (name: string) => void attributes.delete(name) };
    const timers: Array<[() => void, number]> = [];
    const localStorage = { getItem: (key: string) => { if (storageThrows) throw new Error("SecurityError"); return key === LOCALE_STORAGE_KEY ? stored : null; } };
    new Function("document", "localStorage", "navigator", "setTimeout", LOCALE_BOOT_SCRIPT)(
      { documentElement: html }, localStorage, { languages, language }, (callback: () => void, delay: number) => timers.push([callback, delay]),
    );
    return { html, attributes, timers };
  };
  const cases: Array<[string | null, string[] | undefined, string, boolean]> = [
    [null, ["en-US"], "", false],
    [null, ["tr-TR", "en-US"], "", false],
    [null, ["de-DE", "en-GB"], "", false],
    [null, ["de-DE"], "", false],
    [null, [], "en-US", false],
    [null, undefined, "en", false],
    [null, undefined, "", false],
    ["tr", ["en-US"], "", false],
    ["en", ["tr-TR"], "", false],
    ["xx", ["en-US"], "", false],
    ["en", ["tr-TR"], "", true],
  ];

  it.each(cases)("sağlayıcıyla aynı dili seçer (kayıt %s, diller %j, dil %s, depo hatası %s)", (stored, languages, language, storageThrows) => {
    const expected = (storageThrows ? undefined : storedLocale(memoryStorage(stored === null ? {} : { [LOCALE_STORAGE_KEY]: stored })))
      ?? localeFromLanguages(languages?.length ? languages : [language]);
    const { html, attributes, timers } = boot(stored, languages, language, storageThrows);
    expect(html.lang).toBe(expected);
    if (expected === DEFAULT_LOCALE) {
      // Türkçede sayfa gizlenmez.
      expect(attributes.has(LOCALE_PENDING_ATTRIBUTE)).toBe(false);
      expect(timers).toEqual([]);
    } else {
      // Başka dilde paket gelene kadar gizlenir; paket hiç gelmezse emniyet zamanlayıcısı sayfayı gösterir.
      expect(attributes.has(LOCALE_PENDING_ATTRIBUTE)).toBe(true);
      expect(timers.map(([, delay]) => delay)).toEqual([LOCALE_REVEAL_TIMEOUT_MS]);
      timers[0][0]();
      expect(attributes.has(LOCALE_PENDING_ATTRIBUTE)).toBe(false);
    }
  });

  it("desteklenen diller betiğe gömülü; yeni dil eklenince betik de kapsar", () => {
    expect(LOCALE_BOOT_SCRIPT).toContain(JSON.stringify(SUPPORTED_LOCALES));
  });

  it("sayfa gizliyken yalnız gövde gizlenir; düzen betiği `<head>` içinde çalıştırır", () => {
    expect(readFileSync("src/app/globals.css", "utf8")).toContain(`html[${LOCALE_PENDING_ATTRIBUTE}] body { visibility: hidden; }`);
    const layout = readFileSync("src/app/layout.tsx", "utf8");
    expect(layout).toContain("<head><script dangerouslySetInnerHTML={{ __html: LOCALE_BOOT_SCRIPT }}/></head>");
    expect(layout).toContain("suppressHydrationWarning");
  });
});
