import { DEFAULT_PREFERENCES, type Preferences } from "@aquamind/domain";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, isLocale, type Locale } from "@aquamind/localization";

// Arayüz dilinin seçimi (docs/DECISIONS/0021-dil-altyapisi.md, 5. paket; ürün sahibi kararı 2026-10-31). Kullanıcının Ayarlar'da seçtiği
// dil bu cihazda saklanır; bir cihaz tercihidir, yedeğe girmez ve yedekten gelmez. Seçim yoksa tarayıcının dil listesinde desteklenen ilk
// dil kullanılır (İngilizce tarayıcı → İngilizce), listede desteklenen dil yoksa varsayılan dil (Türkçe). "Tüm verileri sıfırla" bu
// anahtarı da siler; sonra yine tarayıcının diline bakılır.

/** Seçilen dilin anahtarı (`aquamind:` önekiyle; sıfırlamada silinir). */
export const LOCALE_STORAGE_KEY = "aquamind:locale:v1";

/**
 * Varsayılan dil dışındaki bir dil açılırken, dil paketi yüklenene kadar sayfa bu öznitelikle gizlenir (globals.css); böylece İngilizce
 * kullanıcı önce Türkçe metni görmez. Sağlayıcı dili değiştirince ya da yükleme başarısız olunca kaldırır; betik de emniyet için
 * `LOCALE_REVEAL_TIMEOUT_MS` sonra kaldırır (paket gelmezse sayfa Türkçe görünür).
 */
export const LOCALE_PENDING_ATTRIBUTE = "data-locale-loading";
export const LOCALE_REVEAL_TIMEOUT_MS = 4000;

/** Tarayıcının dil listesinde (ör. `["de-DE", "en-US"]`) desteklenen ilk dil; yoksa varsayılan dil. */
export function localeFromLanguages(languages: readonly string[]): Locale {
  for (const tag of languages) {
    const primary = String(tag).toLowerCase().split("-")[0];
    if (isLocale(primary)) return primary;
  }
  return DEFAULT_LOCALE;
}

/** Bu cihazda seçilmiş dil; seçim yoksa, geçersizse ya da depoya erişilemiyorsa `undefined`. */
export function storedLocale(storage: Pick<Storage, "getItem"> | undefined): Locale | undefined {
  try {
    const value = storage?.getItem(LOCALE_STORAGE_KEY);
    return isLocale(value) ? value : undefined;
  } catch {
    return undefined;
  }
}

function browserLanguages(): string[] {
  if (typeof navigator === "undefined") return [];
  return navigator.languages?.length ? [...navigator.languages] : [navigator.language ?? ""];
}

function localStorageOrUndefined(): Storage | undefined {
  try {
    return typeof window === "undefined" ? undefined : window.localStorage;
  } catch {
    return undefined;
  }
}

/**
 * Kayıtlı tercih yoksa birimlerin ilk ayarı tarayıcının bölgesine göredir (ürün sahibi kararı 2026-10-31): dil listesindeki ilk etiketin
 * bölgesi ABD ise galon, °F ve AA/GG/YYYY; öbür bölgelerde varsayılanlar (litre, °C, GG.AA.YYYY). Kullanıcı tercihlerini kaydettiyse
 * onlar geçerlidir; bu ayar depoya kendiliğinden yazılmaz.
 */
export function regionalPreferences(languages: readonly string[], base: Preferences = DEFAULT_PREFERENCES): Preferences {
  const region = /^[a-z]{2,3}(?:-[a-z]{4})?-([a-z]{2}|\d{3})(?:-|$)/i.exec(String(languages[0] ?? ""))?.[1]?.toUpperCase();
  return region === "US" ? { ...base, temperature: "fahrenheit", volume: "gallons", dateFormat: "month-first" } : base;
}

/** Bu tarayıcıda kayıtlı tercih yokken kullanılacak tercihler (`regionalPreferences`). */
export function browserPreferenceDefaults(): Preferences {
  return regionalPreferences(browserLanguages());
}

/** Sayfa açılırken kullanılacak dil: bu cihazda seçilmiş dil, yoksa tarayıcının dili. */
export function initialLocale(): Locale {
  return storedLocale(localStorageOrUndefined()) ?? localeFromLanguages(browserLanguages());
}

/** Seçilen dili bu cihaza yazar; depo yazılamazsa (gizli pencere, dolu depo) `false` döner, dil yine de bu oturumda geçerlidir. */
export function storeLocale(locale: Locale): boolean {
  try {
    localStorageOrUndefined()?.setItem(LOCALE_STORAGE_KEY, locale);
    return true;
  } catch {
    return false;
  }
}

/** Dil paketi beklenirken gizlenen sayfayı gösterir. */
export function revealPage(): void {
  if (typeof document !== "undefined") document.documentElement.removeAttribute(LOCALE_PENDING_ATTRIBUTE);
}

/**
 * Sayfa çizilmeden önce `<head>` içinde çalışan betik: `initialLocale` ile aynı kuralı uygular; dil varsayılan dil değilse `<html lang>`
 * değerini değiştirir ve sayfayı paket yüklenene kadar gizler. React yüklenmeden çalıştığı için düz JavaScript'tir; davranışı testte
 * `initialLocale` ile karşılaştırılır.
 */
export const LOCALE_BOOT_SCRIPT = `(function(){try{var d=document.documentElement,s=${JSON.stringify(SUPPORTED_LOCALES)},l=null;try{l=localStorage.getItem(${JSON.stringify(LOCALE_STORAGE_KEY)})}catch(e){}if(s.indexOf(l)<0){l=${JSON.stringify(DEFAULT_LOCALE)};var n=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||""];for(var i=0;i<n.length;i++){var p=String(n[i]).toLowerCase().split("-")[0];if(s.indexOf(p)>=0){l=p;break}}}if(l!==${JSON.stringify(DEFAULT_LOCALE)}){d.lang=l;d.setAttribute(${JSON.stringify(LOCALE_PENDING_ATTRIBUTE)},"");setTimeout(function(){d.removeAttribute(${JSON.stringify(LOCALE_PENDING_ATTRIBUTE)})},${LOCALE_REVEAL_TIMEOUT_MS})}}catch(e){}})();`;
