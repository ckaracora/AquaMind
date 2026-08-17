import type { Metadata } from "next";
import "./globals.css";
import { AquariumProvider } from "@/providers/aquarium-provider";
import "@/data/catalog-coverage";

export const metadata: Metadata = {
  title: "AquaMind — Akvaryum yönetimi",
  description: "Akvaryumunuzu bilinçle yönetin.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="tr"><body><AquariumProvider>{children}</AquariumProvider></body></html>;
}
