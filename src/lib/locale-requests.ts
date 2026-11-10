import type { Locale } from "@aquamind/localization";

// Dil isteklerinin sırası (karar 0021, 5. paket). Paket yüklenmesi zaman alır; bu sırada yeni bir dil istenirse (açılışta İngilizce
// yüklenirken Ayarlar'dan Türkçe seçilmesi gibi) yalnız son istek uygulanır. Önceki isteğin yüklemesi sonradan biterse ya da hata
// verirse hiçbir şey değişmez; son isteğin yükleme hatası çağırana iletilir.

export interface LocaleRequester {
  /** Dili ister: paketi yükler, hâlâ son istekse `apply` ile uygular. `remember`: seçim bu cihaza yazılsın mı (Ayarlar'daki seçim). */
  request: (locale: Locale, remember: boolean) => Promise<void>;
  /** Son istenen dil (yüklenmekte olabilir). */
  latest: () => Locale | undefined;
}

export function createLocaleRequester(load: (locale: Locale) => Promise<void>, apply: (locale: Locale, remember: boolean) => void): LocaleRequester {
  let sequence = 0;
  let latest: Locale | undefined;
  return {
    latest: () => latest,
    request: async (locale, remember) => {
      const id = ++sequence;
      latest = locale;
      try {
        await load(locale);
      } catch (error) {
        if (id === sequence) throw error;
        return;
      }
      if (id === sequence) apply(locale, remember);
    },
  };
}
