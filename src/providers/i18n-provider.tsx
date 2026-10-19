"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { DEFAULT_LOCALE, messagesFor, type Locale, type Messages } from "@aquamind/localization";

// Arayüz dili (docs/DECISIONS/0021-dil-altyapisi.md). Şimdilik yalnız Türkçe; dil seçimi İngilizce tamamlanınca ayarlara eklenir.
// Sağlayıcının dışında kalan bileşen de varsayılan dili alır.
interface I18nValue { locale: Locale; t: Messages }

const I18nContext = createContext<I18nValue>({ locale: DEFAULT_LOCALE, t: messagesFor(DEFAULT_LOCALE) });

export function I18nProvider({ locale = DEFAULT_LOCALE, children }: { locale?: Locale; children: ReactNode }) {
  const value = useMemo(() => ({ locale, t: messagesFor(locale) }), [locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  return useContext(I18nContext);
}
