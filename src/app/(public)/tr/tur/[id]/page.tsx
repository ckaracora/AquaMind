// Tür sayfası, tr (karar 0047). Yalnız listedeki türler derlenir; başka kimlik 404 verir.
import { SpeciesRoute, speciesMetadata, speciesStaticParams } from "@/components/public/public-routes";

export const dynamic = "force-static";
export const dynamicParams = false;
export const generateStaticParams = speciesStaticParams;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  return speciesMetadata("tr", (await params).id);
}

export default async function Page({ params }: Props) {
  return <SpeciesRoute locale="tr" id={(await params).id} />;
}
