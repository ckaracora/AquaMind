// Herkese açık tür sayfalarının metinleri (docs/DECISIONS/0047-herkese-acik-tur-sayfalari.md). Paketin ayrı giriş noktasıdır
// (`@aquamind/localization/public-pages`). Sayfalar sunucuda, derleme anında çizilir; başka dilin metni yalnız istenince ayrı parça olarak
// yüklenir (`import()`), dil paketine ve uygulama ekranlarının paketine girmez.
import { DEFAULT_LOCALE, type Locale } from "./locales";
import { trPublicPages, type PublicPageMessages } from "./messages/tr-public-pages";

export type { PublicPageMessages, SpeciesDescriptionParts } from "./messages/tr-public-pages";

const loaders: Record<Exclude<Locale, "tr">, () => Promise<PublicPageMessages>> = {
  en: () => import("./messages/en-public-pages").then((module) => module.enPublicPages),
  es: () => import("./messages/es-public-pages").then((module) => module.esPublicPages),
};

/** Dilin herkese açık sayfa metinleri; varsayılan dilde hemen döner. */
export async function loadPublicPageMessages(locale: Locale): Promise<PublicPageMessages> {
  return locale === DEFAULT_LOCALE ? trPublicPages : loaders[locale as Exclude<Locale, "tr">]();
}
