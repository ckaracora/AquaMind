// Sitenin adı, adresi ve arama motorlarına açılma ayarı (docs/DECISIONS/0047-herkese-acik-tur-sayfalari.md). Yalnız sunucuda ve derleme
// anında okunur; değerler derlemeye yazılır, ayar değişince yeniden derlemek gerekir.
// - Ad tek yerden gelir: dil dosyasındaki uygulama adı (`app.name`, packages/localization/src/messages/tr.ts). Ad değişince oradaki üç
//   dil dosyasında değişir; test üçünün aynı olduğunu denetler.
// - Adres `SITE_URL` ortam değişkeninden gelir (ör. `https://ornek.com`); yoksa Vercel'in üretim adresi, o da yoksa yerel adres.
// - `PUBLIC_PAGES_INDEXING=on` olmadıkça herkese açık sayfalar `noindex` taşır, robots.txt her şeyi kapatır, site haritası boştur.
//   Açılınca yalnız herkese açık sayfalar açılır; uygulama ekranları kapalı kalır.
import { DEFAULT_LOCALE, messagesFor } from "@aquamind/localization";

export const SITE_NAME = messagesFor(DEFAULT_LOCALE).app.name;

/** Arama motorlarına açma ayarının adı ve açık değeri. */
export const INDEXING_ENV = "PUBLIC_PAGES_INDEXING";
export const INDEXING_ON = "on";

type Env = Readonly<Record<string, string | undefined>>;

/** Herkese açık sayfalar arama motorlarına açık mı? Yalnız `PUBLIC_PAGES_INDEXING=on` açar; başka her değer kapalıdır. */
export function publicIndexingEnabled(env: Env = process.env): boolean {
  return env[INDEXING_ENV] === INDEXING_ON;
}

/** Sitenin kök adresi (`metadataBase`, `canonical`, `hreflang`, site haritası). Sonda eğik çizgi yoktur. */
export function siteOrigin(env: Env = process.env): string {
  const configured = env.SITE_URL?.trim();
  const vercel = env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const raw = configured || vercel || "http://localhost:3000";
  return new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`).origin;
}
