// Herkese açık tür sayfalarının adresleri, tür listesi ve üst bilgisi (docs/DECISIONS/0047-herkese-acik-tur-sayfalari.md). Veri içermez;
// katalog yalnız sayfaların kendisinde (src/lib/public-species.ts) okunur.
import type { Metadata, MetadataRoute } from "next";
import { SUPPORTED_LOCALES, type Locale } from "@aquamind/localization";
import { ADD_PARAM, SPECIES_PARAM } from "@/lib/aquarium-links";
import { publicIndexingEnabled, siteOrigin } from "@/lib/site-config";

export const PUBLIC_LOCALES: readonly Locale[] = SUPPORTED_LOCALES;

/** Tür sayfalarının dile göre adres kelimesi: `/tr/tur/<kimlik>`, `/en/species/<kimlik>`, `/es/especies/<kimlik>`. */
export const SPECIES_SEGMENT: Record<Locale, string> = { tr: "tur", en: "species", es: "especies" };

/**
 * İlk paketin 30 tatlı su türü (2026-11-21). Seçim: uygulamanın Türkçe gündelik ad önerilerindeki (src/data/search-suggestions.ts) tatlı su
 * türleri ve Türkiye'deki mağazalarda yaygın türler; yalnız kaynağı ve doğrulama tarihi olan, üç dilde çevirisi tam olan, kaynaklı davranış
 * ya da bakım bilgisi bulunan kayıtlar. Bu şartları test denetler (src/lib/__tests__/public-pages.test.ts).
 */
export const PUBLIC_SPECIES_IDS: readonly string[] = [
  "neon-tetra", "cardinal-tetra", "guppy", "betta", "molly", "platy", "swordtail", "corydoras-panda", "peppered-cory", "ancistrus",
  "goldfish", "angelfish", "discus", "dwarf-gourami", "pearl-gourami", "tiger-barb", "cherry-barb", "zebra-danio", "harlequin-rasbora",
  "ember-tetra", "black-skirt-tetra", "kribensis", "ramirezi", "oscar", "blood-parrot-cichlid", "yellow-lab", "otocinclus", "cherry-shrimp",
  "amano-shrimp", "nerite-snail",
];

export const speciesIndexPath = (locale: Locale) => `/${locale}/${SPECIES_SEGMENT[locale]}`;
export const speciesPagePath = (locale: Locale, id: string) => `${speciesIndexPath(locale)}/${encodeURIComponent(id)}`;

/** "Kendi akvaryumunda dene": canlılar sayfası, canlı seçme penceresi bu tür seçili açılır (src/lib/aquarium-links.ts). */
export const tryInAppHref = (id: string) => `/livestock?${ADD_PARAM}=1&${SPECIES_PARAM}=${encodeURIComponent(id)}`;

/** Dile bağlı sayfaların dil bağlantıları: her dil kendi adresiyle, dil seçimi olmayan ziyaretçi için İngilizce (`x-default`). */
export function languageAlternates(pathFor: (locale: Locale) => string, origin: string): Record<Locale | "x-default", string> {
  return {
    tr: `${origin}${pathFor("tr")}`,
    en: `${origin}${pathFor("en")}`,
    es: `${origin}${pathFor("es")}`,
    "x-default": `${origin}${pathFor("en")}`,
  };
}

type Env = Readonly<Record<string, string | undefined>>;

/** Open Graph dil etiketi (dil_BÖLGE): Türkçe, ABD İngilizcesi, Latin Amerika İspanyolcası. */
const OPEN_GRAPH_LOCALES: Record<Locale, string> = { tr: "tr_TR", en: "en_US", es: "es_LA" };

/** Arama motoru izni: açma ayarı kapalıyken `noindex, nofollow`. */
export const publicRobots = (env: Env = process.env): NonNullable<Metadata["robots"]> =>
  publicIndexingEnabled(env) ? { index: true, follow: true } : { index: false, follow: false };

/** Bir herkese açık sayfanın üst bilgisi: başlık, açıklama, tek `canonical`, dil bağlantıları ve arama motoru izni. */
export function publicPageMetadata(locale: Locale, pathFor: (locale: Locale) => string, title: string, description: string, env: Env = process.env): Metadata {
  const origin = siteOrigin(env);
  const url = `${origin}${pathFor(locale)}`;
  return {
    title,
    description,
    alternates: { canonical: url, languages: languageAlternates(pathFor, origin) },
    robots: publicRobots(env),
    openGraph: { title, description, url, type: "article", locale: OPEN_GRAPH_LOCALES[locale] },
  };
}

/** Herkese açık sayfaların bütün adresleri (site haritası ve test): dizin ve tür sayfaları, üç dilde. */
export function publicPaths(): { pathFor: (locale: Locale) => string }[] {
  return [{ pathFor: speciesIndexPath }, ...PUBLIC_SPECIES_IDS.map((id) => ({ pathFor: (locale: Locale) => speciesPagePath(locale, id) }))];
}

/**
 * robots.txt: kapalıyken her şey kapalı; açılınca yalnız herkese açık sayfalar açık, uygulama ekranları kapalı. Sayfanın görünümü için
 * gereken dosyalar (Next'in durağan dosyaları: CSS, yazı tipi, betik; site simgesi) da açıktır; kapalı olursa arama motoru sayfayı
 * biçimsiz görür.
 */
export function robotsFile(env: Env = process.env): MetadataRoute.Robots {
  if (!publicIndexingEnabled(env)) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: [...PUBLIC_LOCALES.map((locale) => speciesIndexPath(locale)), "/_next/static/", "/icon.svg"], disallow: "/" }],
    sitemap: `${siteOrigin(env)}/sitemap.xml`,
  };
}

/** Site haritası: kapalıyken boş; açılınca her sayfa üç dil bağlantısıyla. */
export function sitemapFile(env: Env = process.env): MetadataRoute.Sitemap {
  if (!publicIndexingEnabled(env)) return [];
  const origin = siteOrigin(env);
  return publicPaths().flatMap(({ pathFor }) => PUBLIC_LOCALES.map((locale) => ({
    url: `${origin}${pathFor(locale)}`,
    alternates: { languages: languageAlternates(pathFor, origin) },
  })));
}
