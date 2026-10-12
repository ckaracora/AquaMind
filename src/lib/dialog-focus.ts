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
 * Açık pencerelerden en üstte görünenin sırası; görünen pencere yoksa -1. Pencereler aynı katmanda (`fixed inset-0 z-50`)
 * açıldığı için belgede sonra gelen üstte çizilir; `follows(a, b)`, a belgede b'den sonra geliyorsa doğrudur.
 */
export function topDialogIndex<T>(dialogs: readonly T[], isRendered: (dialog: T) => boolean, follows: (a: T, b: T) => boolean): number {
  let top = -1;
  dialogs.forEach((dialog, index) => { if (isRendered(dialog) && (top < 0 || follows(dialog, dialogs[top]))) top = index; });
  return top;
}

// Açık pencereler. İki pencere birden açıksa (ör. dar ekranda açılan menü geniş ekranda gizlenip sonra yeniden görünürse)
// klavyeyi yalnızca en üstte görünen pencere işler; ekranda olmayan pencere klavyeye karışmaz.
type OpenDialog = { element: HTMLElement; close: () => void };
const openDialogs: OpenDialog[] = [];
const rendered = (element: HTMLElement) => element.getClientRects().length > 0;
const follows = (a: OpenDialog, b: OpenDialog) => Boolean(b.element.compareDocumentPosition(a.element) & Node.DOCUMENT_POSITION_FOLLOWING);
const topDialog = (): OpenDialog | undefined => openDialogs[topDialogIndex(openDialogs, (dialog) => rendered(dialog.element), follows)];

// Bütün pencereler için tek dinleyici: bir tuş basışını yalnızca o anda en üstte görünen pencere işler. Her pencerenin
// kendi dinleyicisi olsaydı, üstteki pencere Esc ile kapanırken alttaki pencere aynı basışı görüp o da kapanırdı.
function onKeyDown(event: KeyboardEvent) {
  if (event.key !== "Escape" && event.key !== "Tab") return;
  const top = topDialog();
  if (!top) return;
  if (event.key === "Escape") { event.preventDefault(); top.close(); return; }
  const items = Array.from(top.element.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(rendered);
  if (!items.length) { event.preventDefault(); return; }
  const target = trappedFocusIndex(items.length, items.indexOf(document.activeElement as HTMLElement), event.shiftKey);
  if (target === undefined) return;
  event.preventDefault();
  items[target].focus();
}

/**
 * Pencere açık kaldığı sürece odağı içeride tutar. Dönen ref pencerenin kök öğesine verilir; kök öğe `tabIndex={-1}` taşımalıdır.
 * İlk odak `data-autofocus` taşıyan öğeye, yoksa pencerenin kendisine gider. Çok alanlı formlarda ilk alan bilerek
 * işaretlenmez: odak bir yazı alanına giderse telefonda ekran klavyesi kendiliğinden açılır ve formu örter.
 */
export function useDialogFocus<T extends HTMLElement>(close: () => void) {
  const ref = useRef<T>(null);
  const closeRef = useRef(close);
  useEffect(() => { closeRef.current = close; });
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const entry: OpenDialog = { element: dialog, close: () => closeRef.current() };
    if (!openDialogs.length) document.addEventListener("keydown", onKeyDown);
    openDialogs.push(entry);
    (dialog.querySelector<HTMLElement>("[data-autofocus]") ?? dialog).focus();
    return () => {
      openDialogs.splice(openDialogs.indexOf(entry), 1);
      if (!openDialogs.length) document.removeEventListener("keydown", onKeyDown);
      // Altta başka bir pencere açık kaldıysa ve bu pencereyi açan öğe onun içinde değilse odak arkaya değil o pencereye gider.
      const remaining = topDialog()?.element;
      if (remaining && !remaining.contains(opener)) remaining.focus(); else opener?.focus();
    };
  }, []);
  return ref;
}
