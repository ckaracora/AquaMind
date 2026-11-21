// Tür dizini, tr (karar 0047).
import { IndexRoute, indexMetadata } from "@/components/public/public-routes";

export const dynamic = "force-static";

export function generateMetadata() {
  return indexMetadata("tr");
}

export default function Page() {
  return <IndexRoute locale="tr" />;
}
