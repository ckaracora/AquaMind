// Herkese açık sayfaların es kök yerleşimi (karar 0047): uygulama ekranlarının yerleşiminden ayrı, dil adresten gelir.
import "../../globals.css";
import { PublicLayout, publicLayoutMetadata } from "@/components/public/public-routes";

export const metadata = publicLayoutMetadata();

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <PublicLayout locale="es">{children}</PublicLayout>;
}
