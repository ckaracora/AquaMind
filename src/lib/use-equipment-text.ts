"use client";

// Ekipman kataloğunun çevirmeni (karar 0021, 7. paket): teknik bilgi satırı ve kapasite notu. Tablo yalnız ekipman gösteren ekranlarda,
// ayrı bir parça olarak yüklenir (`useSegmentText`); `enabled` yanlışsa yüklenmez (ör. sağlık analizinde kapasite notu olan cihaz yoksa).
import { equipmentTables } from "@aquamind/localization/equipment";
import { useSegmentText, type SegmentTranslator } from "@/lib/use-segment-text";

export { tableForLocale } from "@/lib/use-segment-text";
export type EquipmentTranslator = SegmentTranslator;

export function useEquipmentText(enabled = true): EquipmentTranslator {
  return useSegmentText(equipmentTables, enabled);
}
