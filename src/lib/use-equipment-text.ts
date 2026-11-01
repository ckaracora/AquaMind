"use client";

// Ekipman kataloğunun çevirmeni (karar 0021, 7. paket): teknik bilgi satırı ve kapasite notu için seçili dilin tablosunu ayrı bir parça
// olarak yükleyen React kancası. Türkçede tablo yoktur, metin olduğu gibi kalır. Başka dilde tablo yüklenene kadar (ya da yükleme
// başarısız olursa) çevirmen `undefined` verir: ekran bugünkü sayısal özete ya da uyarının genel cümlesine düşer. Tablo dilin kendisiyle
// birlikte tutulur; dil değişince eski dilin tablosu bir an bile kullanılmaz. `enabled` yanlışsa tablo yüklenmez (ör. sağlık analizinde
// kapasite notu olan cihaz yoksa).
import { useCallback, useEffect, useState } from "react";
import { equipmentText, equipmentTextsFor, loadEquipmentTexts, type EquipmentTexts } from "@aquamind/localization/equipment";
import type { Locale } from "@aquamind/localization";
import { useDisplayFormat } from "@/lib/use-display-format";

export type EquipmentTranslator = (text: string) => string | undefined;

/** Yüklenen tablonun hangi dile ait olduğu; yalnız seçili dilinki kullanılır. */
export function tableForLocale(loaded: { locale: Locale; texts?: EquipmentTexts }, locale: Locale): EquipmentTexts | undefined {
  return loaded.locale === locale ? loaded.texts : undefined;
}

export function useEquipmentText(enabled = true): EquipmentTranslator {
  const fmt = useDisplayFormat();
  const locale = fmt.locale;
  const [loaded, setLoaded] = useState<{ locale: Locale; texts?: EquipmentTexts }>(() => ({ locale, texts: equipmentTextsFor(locale) }));
  useEffect(() => {
    if (!enabled) return;
    let active = true;
    setLoaded({ locale, texts: equipmentTextsFor(locale) });
    loadEquipmentTexts(locale)
      .then((texts) => { if (active) setLoaded({ locale, texts }); })
      .catch(() => undefined);
    return () => { active = false; };
  }, [locale, enabled]);
  const texts = tableForLocale(loaded, locale);
  return useCallback((text: string) => equipmentText(text, texts, fmt), [texts, fmt]);
}
