// Herkese açık sayfaların kök belgesi (docs/DECISIONS/0047-herkese-acik-tur-sayfalari.md). Uygulama ekranlarının kök yerleşiminden ayrıdır:
// dil adresten gelir (`<html lang>`), dil seçme betiği, sağlayıcılar ve yerel depo yoktur. Sunucuda çizilir; tarayıcıya bileşen kodu gitmez.
// Görünüm bugünkü uygulamanın renkleriyle sadedir; yeni tasarım gelince yalnız bu klasördeki bileşenler değişir.
import type { ReactNode } from "react";
import type { Locale } from "@aquamind/localization";
import { SITE_NAME } from "@/lib/site-config";
import type { PublicFrame } from "@/lib/public-species";

export function PublicDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <html lang={locale}><body>{children}</body></html>;
}

/** Üst şerit (uygulama adı ve dil bağlantıları), içerik ve alt bilgi. */
export function PublicShell({ frame, children }: { frame: PublicFrame; children: ReactNode }) {
  const { text } = frame;
  return <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-4 sm:px-6">
    <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-white/[.06] py-3">
      <a href={frame.indexHref} className="inline-flex min-h-11 items-center text-base font-extrabold text-white">{SITE_NAME}</a>
      <nav aria-label={text.languages}><ul className="flex gap-1">{frame.languages.map((language) => <li key={language.locale}>
        <a href={language.href} hrefLang={language.locale} lang={language.locale} aria-current={language.current ? "page" : undefined}
          className={`inline-flex min-h-11 items-center rounded-lg px-2.5 text-[13px] font-bold ${language.current ? "text-aqua" : "text-[#91a3aa] hover:text-white"}`}>{language.name}</a>
      </li>)}</ul></nav>
    </header>
    <main className="flex-1 py-6">{children}</main>
    <footer className="border-t border-white/[.06] py-5 text-[12px] leading-relaxed text-[#71858d]">
      <p>{text.disclaimer}</p>
      <p className="mt-1"><a href="/" className="inline-flex min-h-11 items-center font-bold text-aqua hover:underline">{text.openApp}</a></p>
    </footer>
  </div>;
}
