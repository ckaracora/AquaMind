// Site haritası (karar 0047): açma ayarı kapalıyken boş; açılınca herkese açık sayfalar üç dil bağlantısıyla.
import { sitemapFile } from "@/lib/public-pages";

export const dynamic = "force-static";

export default function sitemap() {
  return sitemapFile();
}
