// Herkese açık sayfaların adres dosyalarının ortak gövdesi (src/app/(public)/<dil>/...). Her dil kendi klasöründe kök yerleşime sahiptir;
// adres dosyaları yalnız dili verip buradaki fonksiyonları çağırır. Sayfalar derleme anında üretilir (`force-static`, listedeki kimlikler).
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import type { Locale } from "@aquamind/localization";
import { PublicDocument } from "@/components/public/public-document";
import { PublicSpeciesIndex, PublicSpeciesPage } from "@/components/public/public-species-page";
import { PUBLIC_SPECIES_IDS, publicPageMetadata, publicRobots, speciesIndexPath, speciesPagePath } from "@/lib/public-pages";
import { publicIndexView, publicSpeciesView } from "@/lib/public-species";
import { SITE_NAME, siteOrigin } from "@/lib/site-config";

/** Dilin kök yerleşiminin üst bilgisi: sitenin adresi, başlık kalıbı (`<sayfa> | <ad>`) ve arama motoru izni. */
export function publicLayoutMetadata(): Metadata {
  return { metadataBase: new URL(siteOrigin()), title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` }, applicationName: SITE_NAME, robots: publicRobots() };
}

export function PublicLayout({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <PublicDocument locale={locale}>{children}</PublicDocument>;
}

export const speciesStaticParams = () => PUBLIC_SPECIES_IDS.map((id) => ({ id }));

export async function speciesMetadata(locale: Locale, id: string): Promise<Metadata> {
  const view = await publicSpeciesView(locale, id);
  if (!view) return { robots: { index: false, follow: false } };
  return publicPageMetadata(locale, (other) => speciesPagePath(other, id), view.title, view.description);
}

export async function SpeciesRoute({ locale, id }: { locale: Locale; id: string }) {
  const view = await publicSpeciesView(locale, id);
  if (!view) notFound();
  return <PublicSpeciesPage view={view} />;
}

export async function indexMetadata(locale: Locale): Promise<Metadata> {
  const view = await publicIndexView(locale);
  return publicPageMetadata(locale, speciesIndexPath, view.title, view.description);
}

export async function IndexRoute({ locale }: { locale: Locale }) {
  return <PublicSpeciesIndex view={await publicIndexView(locale)} />;
}
