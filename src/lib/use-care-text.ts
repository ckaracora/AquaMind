"use client";

// Bakım ürünü kataloğunun çevirmeni (karar 0021, 8. paket): ürün açıklaması. Tablo yalnız ürün kataloğu sayfasında, ayrı bir parça
// olarak yüklenir (`useSegmentText`).
import { careTables } from "@aquamind/localization/care";
import { useSegmentText, type SegmentTranslator } from "@/lib/use-segment-text";

export function useCareText(): SegmentTranslator {
  return useSegmentText(careTables);
}
