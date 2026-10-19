import type { Metadata } from "next";
import "./globals.css";
import { DEFAULT_LOCALE, messagesFor } from "@aquamind/localization";
import { AquariumProvider } from "@/providers/aquarium-provider";
import { I18nProvider } from "@/providers/i18n-provider";
import "@/data/catalog-coverage";

const messages = messagesFor(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: messages.app.title,
  description: messages.app.description,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang={DEFAULT_LOCALE}><body><I18nProvider><AquariumProvider>{children}</AquariumProvider></I18nProvider></body></html>;
}
