"use client";

// İkinci kademe (çapraz kontrollü) değerin yanındaki kısa bilgi (docs/DECISIONS/0045-ikinci-kademe-kaynaklar.md): kabul edilen kaynaklar bu değeri
// yazmıyor; değer birkaç bağımsız hobi kaynağının ortak değeri. Dokununca kaynak listesi açılır. Tür kartında (hacim, uzunluk, davranış) ve bitki
// kartında (sıcaklık, pH) kullanılır. Veri içe aktarmaz.
import { ChevronDown, Info } from "lucide-react";
import { sourceNameFromUrl } from "@/lib/species-card";
import { useI18n } from "@/providers/i18n-provider";

export function SecondarySourceNote({ urls }: { urls: readonly string[] }) {
  const { t } = useI18n();
  const links = [...new Set(urls.filter((url) => /^https:\/\//.test(url)))];
  // `summary` esnek kutu olduğu için tarayıcının açılır üçgeni görünmez; açık/kapalı durumu oktan anlaşılır (kontrol turu 2026-11-15).
  return <details className="mt-1 min-w-0 text-[11px] font-normal sm:text-[10px] group" data-secondary-source="">
    <summary className="flex min-h-11 cursor-pointer items-center gap-1 font-bold text-amber-200/90 sm:min-h-0"><Info size={12} aria-hidden="true" className="shrink-0" /><span className="min-w-0">{t.common.secondarySource}</span>{links.length > 0 && <ChevronDown size={12} aria-hidden="true" className="shrink-0 transition-transform group-open:rotate-180" />}</summary>
    {links.length > 0 && <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1">{links.map((url) => <li key={url} className="min-w-0"><a href={url} target="_blank" rel="noreferrer" className="break-all font-bold text-aqua hover:underline">{sourceNameFromUrl(url)}</a></li>)}</ul>}
  </details>;
}
