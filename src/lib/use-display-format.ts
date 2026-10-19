"use client";

import { useMemo } from "react";
import { createDisplayFormat, type DisplayFormat } from "@aquamind/localization";
import { useAquariums } from "@/providers/aquarium-provider";
import { useI18n } from "@/providers/i18n-provider";

/**
 * Ekranların sayı, hacim, sıcaklık ve tarih biçimleyicisi: arayüz diline ve ayarlardaki birim/tarih tercihine bağlıdır
 * (docs/DECISIONS/0021-dil-altyapisi.md). Değerler kayıtta metrik kalır; yalnızca gösterim ve form girişi çevrilir.
 */
export function useDisplayFormat(): DisplayFormat {
  const { locale } = useI18n();
  const { preferences } = useAquariums();
  return useMemo(() => createDisplayFormat(locale, preferences), [locale, preferences]);
}
