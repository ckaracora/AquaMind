import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { loadLocaleBundle, messagesFor } from "@aquamind/localization";

// Yeni akvaryum kaydı yazılamazsa form sessiz kalmaz (kullanılabilirlik turu, 2026-11-12; karşı kontrol P2-2): düğmenin yanında üç dilde
// görünür bir hata çıkar, form korunur, yönlendirme olmaz. Yazılırsa akvaryumun kendi sayfası açılır (kusur 11).
await loadLocaleBundle("en");
await loadLocaleBundle("es");

describe("yeni akvaryum kaydı", () => {
  it("kayıt başarısızsa görünür hata, başarılıysa akvaryumun kendi sayfası", () => {
    const page = readFileSync("src/app/aquariums/new/page.tsx", "utf8");
    expect(page).toContain("if (!added) { setSaveFailed(true); return; }");
    expect(page).toContain('{saveFailed && <p role="alert"');
    expect(page).toContain("router.push(`/aquariums/${id}`)");
    expect(page).not.toContain('router.push("/aquariums")');
  });

  it("hata metni üç dilde", () => {
    expect(messagesFor("tr").aquariums.form.saveFailed).toContain("kaydedilemedi");
    expect(messagesFor("en").aquariums.form.saveFailed).toContain("couldn't be saved");
    expect(messagesFor("es").aquariums.form.saveFailed).toContain("No se pudo guardar");
  });
});
