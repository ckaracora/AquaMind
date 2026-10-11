// Açılan pencerelerde klavye odağı (WAI-ARIA "dialog" kalıbı): pencere açılınca odak içeri girer, Sekme tuşuyla
// pencerenin içinde döner, Esc pencereyi kapatır ve kapanınca odak pencereyi açan öğeye geri döner.
import { useEffect, useRef } from "react";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Sekme tuşuna basıldığında odağın taşınacağı sıra; tarayıcının kendi sırası zaten pencerenin içinde kalıyorsa `undefined`.
 * `current`, odaktaki öğenin pencere içindeki sırasıdır; odak pencerenin dışındaysa -1.
 */
export function trappedFocusIndex(count: number, current: number, backwards: boolean): number | undefined {
  if (count <= 0) return undefined;
  if (current < 0 || current >= count) return backwards ? count - 1 : 0;
  if (backwards && current === 0) return count - 1;
  if (!backwards && current === count - 1) return 0;
  return undefined;
}

/**
 * Pencere açık kaldığı sürece odağı içeride tutar. Dönen ref pencerenin kök öğesine verilir.
 * İlk odak `data-autofocus` taşıyan öğeye, yoksa penceredeki ilk odaklanabilir öğeye gider.
 */
export function useDialogFocus<T extends HTMLElement>(close: () => void) {
  const ref = useRef<T>(null);
  const closeRef = useRef(close);
  useEffect(() => { closeRef.current = close; });
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusable = () => Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
    (dialog.querySelector<HTMLElement>("[data-autofocus]") ?? focusable()[0] ?? dialog).focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") { event.preventDefault(); closeRef.current(); return; }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) { event.preventDefault(); return; }
      const target = trappedFocusIndex(items.length, items.indexOf(document.activeElement as HTMLElement), event.shiftKey);
      if (target === undefined) return;
      event.preventDefault();
      items[target].focus();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("keydown", onKeyDown); opener?.focus(); };
  }, []);
  return ref;
}
