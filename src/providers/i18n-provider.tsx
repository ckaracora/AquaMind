"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { DEFAULT_LOCALE, loadLocaleBundle, localeBundle, messagesFor, type Locale, type Messages } from "@aquamind/localization";
import { catalogTranslator, type CatalogTranslator } from "@aquamind/localization/catalog";
import { initialLocale, keepDocumentTitle, revealPage, storeLocale } from "@/lib/locale-choice";
import { createLocaleRequester } from "@/lib/locale-requests";

// Arayüz dili (docs/DECISIONS/0021-dil-altyapisi.md). Açılışta bu cihazda seçilmiş dil, yoksa tarayıcının dili kullanılır
// (`initialLocale`); Türkçe dışındaki dilin paketi önce yüklenir, dil sonra değişir. Paket beklenirken sayfayı `<head>` içindeki betik
// gizler; dil değişince ya da yükleme başarısız olunca sayfa gösterilir (başarısızlıkta Türkçe kalır). `setLocale` Ayarlar'daki seçimdir:
// paketi yükler, seçimi bu cihaza yazar ve dili değiştirir; yükleme başarısız olursa hata fırlatır ve dil değişmez. Açılıştaki yükleme ve
// seçimler aynı sıraya girer: yükleme sürerken yeni bir dil istenirse yalnız son istek uygulanır (`src/lib/locale-requests.ts`).
// `requestedLocale` son istenen dildir (paketi yükleniyor olabilir); Ayarlar'daki seçim onu gösterir.
// Sağlayıcının dışında kalan bileşen de varsayılan dili alır. `catalogText` katalogdan gelen Türkçe metni (tür adı, bakım notu) seçili dile
// çevirir (4. paket); Türkçede metin olduğu gibi kalır, çevirisi olmayan metinde `undefined` döner. `locale` verilirse (testler) dil sabittir.
interface I18nValue { locale: Locale; requestedLocale: Locale; t: Messages; catalogText: CatalogTranslator; setLocale: (locale: Locale) => Promise<void> }

const I18nContext = createContext<I18nValue>({
  locale: DEFAULT_LOCALE,
  requestedLocale: DEFAULT_LOCALE,
  t: messagesFor(DEFAULT_LOCALE),
  catalogText: catalogTranslator(DEFAULT_LOCALE),
  setLocale: async () => {},
});

export function I18nProvider({ locale: fixed, children }: { locale?: Locale; children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(fixed ?? DEFAULT_LOCALE);
  const [requestedLocale, setRequestedLocale] = useState<Locale>(fixed ?? DEFAULT_LOCALE);
  // Uygulanmış dil: son isteğin yüklemesi başarısız olursa seçim buna döner.
  const applied = useRef<Locale>(fixed ?? DEFAULT_LOCALE);
  const requester = useMemo(() => createLocaleRequester(loadLocaleBundle, (next, remember) => {
    if (remember) storeLocale(next);
    applied.current = next;
    setLocaleState(next);
  }), []);

  const request = useCallback(async (next: Locale, remember: boolean) => {
    setRequestedLocale(next);
    try {
      await requester.request(next, remember);
    } catch (error) {
      setRequestedLocale(applied.current);
      revealPage();
      throw error;
    }
  }, [requester]);

  useEffect(() => {
    if (fixed) return;
    const wanted = initialLocale();
    if (wanted !== DEFAULT_LOCALE) request(wanted, false).catch(() => {});
  }, [fixed, request]);

  // Sayfa, son istenen dil uygulanınca gösterilir (açılışta Türkçe dışındaki dil için betik gizlemişti).
  useEffect(() => {
    document.documentElement.lang = locale;
    if (locale === (requester.latest() ?? locale)) revealPage();
  }, [locale, requester]);

  // Sekme başlığı: sayfaların ortak başlığı sunucuda Türkçe yazılır. Next.js başlığı sayfa değişince ve sunucuda çizilen sayfalarda
  // (ör. sağlık analizi) üst bilgi akışla geldiğinde sonradan yeniden yazar; bu yüzden `<head>` izlenir ve başlık seçili dilde tutulur.
  useEffect(() => keepDocumentTitle(document, messagesFor(locale).app.title), [locale]);

  const setLocale = useCallback((next: Locale) => request(next, true), [request]);

  const value = useMemo(
    () => ({ locale, requestedLocale, t: messagesFor(locale), catalogText: catalogTranslator(locale, localeBundle(locale)?.catalogSpecies), setLocale }),
    [locale, requestedLocale, setLocale],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  return useContext(I18nContext);
}
