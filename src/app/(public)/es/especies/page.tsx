// Tür dizini, es (karar 0047).
import { IndexRoute, indexMetadata } from "@/components/public/public-routes";

export const dynamic = "force-static";

export function generateMetadata() {
  return indexMetadata("es");
}

export default function Page() {
  return <IndexRoute locale="es" />;
}
