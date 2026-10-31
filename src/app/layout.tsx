import type { Metadata } from "next";
import "./globals.css";
import { DEFAULT_LOCALE, messagesFor } from "@aquamind/localization";
import { AquariumProvider } from "@/providers/aquarium-provider";
import { LOCALE_BOOT_SCRIPT } from "@/lib/locale-choice";
import { I18nProvider } from "@/providers/i18n-provider";
import "@/data/catalog-coverage";

const messages = messagesFor(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: messages.app.title,
  description: messages.app.description,
};

// Sayfalar sunucuda varsayılan dilde (Türkçe) çizilir. Kullanıcının dili başkaysa `<head>` içindeki betik, React yüklenmeden `<html lang>`
// değerini değiştirir ve sayfayı dil paketi yüklenene kadar gizler (src/lib/locale-choice.ts); bu yüzden `<html>` özniteliklerindeki
// fark hidrasyon uyarısı sayılmaz.
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang={DEFAULT_LOCALE} suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: LOCALE_BOOT_SCRIPT }}/></head><body><I18nProvider><AquariumProvider>{children}</AquariumProvider></I18nProvider></body></html>;
}
