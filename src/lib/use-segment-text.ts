"use client";

// Parçalı katalog metinlerinin çevirmeni (karar 0021, 7. ve 8. paket): kataloğun seçili dildeki tablosunu ayrı bir parça olarak yükleyen
// React kancası. Türkçede tablo yoktur, metin olduğu gibi kalır. Başka dilde tablo yüklenene kadar (ya da yükleme başarısız olursa)
// çevirmen `undefined` verir: ekran bugünkü yedeğine (sayısal özet, genel cümle ya da gizli açıklama) düşer. Tablo dilin kendisiyle
// birlikte tutulur; dil değişince eski dilin tablosu bir an bile kullanılmaz. `enabled` yanlışsa tablo yüklenmez.
import { useCallback, useEffect, useState } from "react";
import { segmentText, type SegmentTables, type SegmentTexts } from "@aquamind/localization/catalog-segments";
import type { Locale } from "@aquamind/localization";
import { useDisplayFormat } from "@/lib/use-display-format";

export type SegmentTranslator = (text: string) => string | undefined;

/** Yüklenen tablonun hangi dile ait olduğu; yalnız seçili dilinki kullanılır. */
export function tableForLocale(loaded: { locale: Locale; texts?: SegmentTexts }, locale: Locale): SegmentTexts | undefined {
  return loaded.locale === locale ? loaded.texts : undefined;
}

export function useSegmentText(tables: SegmentTables, enabled = true): SegmentTranslator {
  const fmt = useDisplayFormat();
  const locale = fmt.locale;
  const [loaded, setLoaded] = useState<{ locale: Locale; texts?: SegmentTexts }>(() => ({ locale, texts: tables.textsFor(locale) }));
  useEffect(() => {
    if (!enabled) return;
    let active = true;
    setLoaded({ locale, texts: tables.textsFor(locale) });
    tables.load(locale)
      .then((texts) => { if (active) setLoaded({ locale, texts }); })
      .catch(() => undefined);
    return () => { active = false; };
  }, [tables, locale, enabled]);
  const texts = tableForLocale(loaded, locale);
  return useCallback((text: string) => segmentText(text, texts, fmt), [texts, fmt]);
}
