// robots.txt (karar 0047): açma ayarı (`PUBLIC_PAGES_INDEXING=on`) kapalıyken her şey kapalı; açılınca yalnız herkese açık sayfalar açık.
import { robotsFile } from "@/lib/public-pages";

export const dynamic = "force-static";

export default function robots() {
  return robotsFile();
}
