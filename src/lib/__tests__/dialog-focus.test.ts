import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { messagesFor } from "@aquamind/localization";
import { topDialogIndex, trappedFocusIndex } from "@/lib/dialog-focus";

// Pencere içindeki klavye odağı (src/lib/dialog-focus.ts): Sekme tuşu odağı pencerenin dışına çıkarmamalı.

describe("trappedFocusIndex", () => {
  it("son öğede Sekme ilk öğeye, ilk öğede Shift+Sekme son öğeye döner", () => {
    expect(trappedFocusIndex(5, 4, false)).toBe(0);
    expect(trappedFocusIndex(5, 0, true)).toBe(4);
  });

  it("aradaki öğelerde tarayıcının kendi sırasına karışmaz", () => {
    expect(trappedFocusIndex(5, 0, false)).toBeUndefined();
    expect(trappedFocusIndex(5, 2, false)).toBeUndefined();
    expect(trappedFocusIndex(5, 2, true)).toBeUndefined();
    expect(trappedFocusIndex(5, 4, true)).toBeUndefined();
  });

  it("odak pencerenin dışındaysa içeri alır", () => {
    expect(trappedFocusIndex(5, -1, false)).toBe(0);
    expect(trappedFocusIndex(5, -1, true)).toBe(4);
    expect(trappedFocusIndex(5, 9, false)).toBe(0);
  });

  it("tek öğeli pencerede odak o öğede kalır; öğe yoksa hedef yoktur", () => {
    expect(trappedFocusIndex(1, 0, false)).toBe(0);
    expect(trappedFocusIndex(1, 0, true)).toBe(0);
    expect(trappedFocusIndex(0, -1, false)).toBeUndefined();
  });
});

// İki pencere birden açıksa klavyeyi yalnızca en üstte görünen pencere işler (Codex 1. tur bulgusu).
describe("topDialogIndex", () => {
  // `order`: belgedeki sıra. Sayfa formları <main> içinde, yan menü ondan sonra gelir; aynı katmanda sonra gelen üstte çizilir.
  type Dialog = { name: string; visible: boolean; order: number };
  const top = (dialogs: Dialog[]) => dialogs[topDialogIndex(dialogs, (dialog) => dialog.visible, (a, b) => a.order > b.order)]?.name;
  const menu = (visible: boolean): Dialog => ({ name: "menü", visible, order: 2 });
  const form = (visible: boolean): Dialog => ({ name: "form", visible, order: 1 });

  it("tek pencere açıksa o pencere, hiçbiri görünmüyorsa hiçbiri klavyeyi işlemez", () => {
    expect(top([form(true)])).toBe("form");
    expect(top([menu(false)])).toBeUndefined();
    expect(top([])).toBeUndefined();
    expect(topDialogIndex([], () => true, () => true)).toBe(-1);
  });

  it("gizlenen menü açık kalsa da klavyeyi görünen form işler", () => {
    expect(top([menu(false), form(true)])).toBe("form");
    expect(top([form(true), menu(false)])).toBe("form");
  });

  it("ikisi de görünüyorsa açılış sırasına değil belgedeki sıraya bakılır: üstte çizilen menü işler", () => {
    expect(top([menu(true), form(true)])).toBe("menü");
    expect(top([form(true), menu(true)])).toBe("menü");
  });

  it("üstteki pencere kapanınca klavye altta kalan pencereye geçer", () => {
    const open = [menu(true), form(true)];
    expect(top(open.filter((dialog) => dialog.name !== "menü"))).toBe("form");
  });
});

// Yeni bir pencere klavye odağı olmadan eklenmesin diye kaynak dosyalar taranır (testler tarayıcı ortamında çalışmıyor).
describe("açılan pencereler", () => {
  const sourceFiles = (dir: string): string[] => readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return entry === "__tests__" ? [] : sourceFiles(path);
    return /\.tsx$/.test(entry) ? [path.replaceAll("\\", "/")] : [];
  });
  const sources = ["src/app", "src/components"].flatMap((dir) => sourceFiles(dir)).map((file) => ({ file, text: readFileSync(file, "utf8") }));
  const count = (text: string, part: string) => text.split(part).length - 1;

  it("ekranı kaplayan pencere kabuğu yalnızca ortak bileşende ve mobil menüde tanımlıdır", () => {
    expect(sources.filter(({ text }) => text.includes("fixed inset-0 z-50")).map(({ file }) => file).sort()).toEqual(["src/components/mobile-nav.tsx", "src/components/modal-dialog.tsx"]);
  });

  it("pencere tanımı taşıyan her dosya odağı içeride tutar ve pencereyi erişilebilir biçimde tanıtır", () => {
    const dialogs = sources.filter(({ text }) => text.includes('role="dialog"'));
    expect(dialogs.map(({ file }) => file).sort()).toEqual(["src/components/mobile-nav.tsx", "src/components/modal-dialog.tsx"]);
    for (const { file, text } of dialogs) {
      expect(text, file).toContain("useDialogFocus<");
      expect(text, file).toMatch(/ref=\{dialog\} [^>]*role="dialog" aria-modal="true" aria-label(ledby)?=[^>]* tabIndex=\{-1\}/);
    }
  });

  it("ortak pencereyi kullanan her form başlığını pencereye bağlar ve kapatma düğmesine ad verir", () => {
    const users = sources.filter(({ text }) => text.includes("<ModalDialog "));
    expect(users.map(({ file }) => file).sort()).toEqual([
      "src/app/equipment/page.tsx", "src/app/maintenance/page.tsx", "src/app/settings/page.tsx", "src/app/water/page.tsx", "src/components/catalog-livestock-form.tsx", "src/components/plant-catalog.tsx",
    ]);
    for (const { file, text } of users) {
      const dialogs = count(text, "<ModalDialog ");
      expect(count(text, "labelledBy={titleId}"), file).toBe(dialogs);
      expect(count(text, "<h2 id={titleId}"), file).toBe(dialogs);
      // Kapatma düğmesinin adı koda yazılı ("Kapat") ya da dil dosyasından (`t.common.close`) gelir (docs/DECISIONS/0021-dil-altyapisi.md).
      expect(count(text, 'aria-label="Kapat"') + count(text, "aria-label={t.common.close}"), file).toBe(dialogs);
      expect(count(text, "describedBy={descriptionId}"), file).toBe(count(text, "<p id={descriptionId}"));
    }
    expect(messagesFor("tr").common.close).toBe("Kapat");
  });
});
