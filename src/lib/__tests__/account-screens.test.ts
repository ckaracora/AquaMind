import { createElement, type FunctionComponent } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { loadLocaleBundle, type Locale } from "@aquamind/localization";
import type { AuthState } from "@/providers/auth-provider";

// Hesap ekranları (docs/DECISIONS/0035-giris-temeli.md): gerçek bileşen çıktısı, oturum durumu ve dil sınama değerleriyle.
const store = vi.hoisted(() => ({ state: { status: "disabled" } as AuthState, locale: "tr" as Locale }));
vi.mock("@/providers/auth-provider", () => ({ useAuth: () => ({ state: store.state, client: null }) }));
vi.mock("@/providers/i18n-provider", async () => {
  const { messagesFor } = await import("@aquamind/localization");
  return { useI18n: () => ({ t: messagesFor(store.locale), locale: store.locale }) };
});
const { AccountCard } = await import("@/components/account-card");
const { AccountSettings } = await import("@/components/account-settings");
const { default: SignInPage } = await import("@/app/account/sign-in/page");
const { default: SignUpPage } = await import("@/app/account/sign-up/page");
const { default: ConfirmPage } = await import("@/app/account/confirm/page");
const { default: ForgotPasswordPage } = await import("@/app/account/forgot-password/page");
const { default: NewPasswordPage } = await import("@/app/account/new-password/page");
await loadLocaleBundle("en");
await loadLocaleBundle("es");

const render = <P extends object>(component: FunctionComponent<P>, props: P, state: AuthState = store.state, locale: Locale = "tr") => {
  store.state = state;
  store.locale = locale;
  return renderToStaticMarkup(createElement(component, props));
};
const decode = (html: string) => html.replace(/&#x27;/g, "'").replace(/&quot;/g, "\"").replace(/&amp;/g, "&");
const user = { id: "u1", email: "ad@ornek.com" };

describe("hesap kartı", () => {
  // Hesaplar kapalıyken (bugünkü canlı site) kart, 1C-1 öncesindeki kartla birebir aynıdır.
  const before = {
    sidebar: "<div class=\"mt-3 flex items-center gap-3 rounded-xl bg-white/[.025] p-3\"><div class=\"grid size-9 place-items-center rounded-full bg-gradient-to-br from-aqua to-cyan-700 text-xs font-extrabold text-ink\"><svg",
    menu: "<div class=\"mt-auto rounded-xl bg-white/[.025] p-3\"><p class=\"text-xs font-bold\">Misafir</p><p class=\"mt-1 text-[11px] sm:text-[10px] text-[#647981]\">Ücretsiz plan</p></div>",
  };
  for (const status of ["disabled", "loading", "unavailable"] as const) {
    it(`${status}: eski misafir kartı, bağlantı yok`, () => {
      const sidebar = render(AccountCard, { variant: "sidebar" }, { status });
      expect(sidebar.startsWith(before.sidebar)).toBe(true);
      expect(sidebar).toContain("Misafir</p><p class=\"text-[10px] text-[#647981]\">Ücretsiz plan</p>");
      expect(render(AccountCard, { variant: "menu" }, { status })).toBe(before.menu);
      expect(sidebar).not.toContain("<a ");
    });
  }
  it("girişsiz: giriş sayfasına bağlantı", () => {
    for (const variant of ["sidebar", "menu"] as const) {
      const html = render(AccountCard, { variant }, { status: "signed-out" });
      expect(html).toMatch(/^<a href="\/account\/sign-in"/);
      expect(html).toContain(">Giriş yap<");
    }
  });
  it("girişli: e-posta ve Ayarlar › Hesap bağlantısı", () => {
    const html = render(AccountCard, { variant: "sidebar" }, { status: "signed-in", user });
    expect(html).toMatch(/^<a href="\/settings#account"/);
    expect(html).toContain("ad@ornek.com");
    expect(render(AccountCard, { variant: "menu" }, { status: "signed-in", user: { id: "u1", email: null } })).toContain("Hesap ayarları");
  });
});

describe("hesap sayfaları", () => {
  const pages = [SignInPage, SignUpPage, ConfirmPage, ForgotPasswordPage, NewPasswordPage];
  it("hesaplar kapalıyken hiçbir sayfa form göstermez", () => {
    for (const page of pages) {
      const html = decode(render(page, {}, { status: "disabled" }));
      expect(html).toContain("Hesaplar henüz açık değil");
      expect(html).not.toContain("<form");
      expect(html).not.toContain("<input");
    }
  });
  it("Supabase yüklenemezse bağlantı hatası", () => {
    for (const page of pages) expect(decode(render(page, {}, { status: "unavailable" }))).toContain("Bağlantı kurulamadı");
  });
  it("yüklenirken form yok", () => {
    for (const page of pages) {
      const html = render(page, {}, { status: "loading" });
      expect(html).toContain("Yükleniyor");
      expect(html).not.toContain("<form");
    }
  });
  it("giriş formu: alanlar, otomatik doldurma ve bağlantılar", () => {
    const html = decode(render(SignInPage, {}, { status: "signed-out" }));
    expect(html).toContain("Hesabına giriş yap");
    expect(html).toContain("autoComplete=\"email\"");
    expect(html).toContain("autoComplete=\"current-password\"");
    expect(html).toContain("href=\"/account/forgot-password\"");
    expect(html).toContain("href=\"/account/sign-up\"");
    expect(html).toContain("Hesap şart değil");
  });
  it("kayıt formu: yeni parola ve en az 8 karakter ipucu; gizlilik satırı yok (karar 0035)", () => {
    const html = decode(render(SignUpPage, {}, { status: "signed-out" }));
    expect(html).toContain("autoComplete=\"new-password\"");
    expect(html).toContain("En az 8 karakter");
    expect(html).not.toMatch(/gizlilik/i);
  });
  it("girişliyken giriş ve kayıt sayfaları hesabı gösterir; onay ve yeni parola açık kalır", () => {
    const signedIn: AuthState = { status: "signed-in", user };
    for (const page of [SignInPage, SignUpPage, ForgotPasswordPage]) {
      const html = render(page, {}, signedIn);
      expect(html).toContain("Zaten giriş yaptın");
      expect(html).toContain("href=\"/settings#account\"");
      expect(html).not.toContain("<form");
    }
    expect(render(ConfirmPage, {}, signedIn)).toContain("E-postamı onayla");
    expect(render(NewPasswordPage, {}, signedIn)).toContain("<form");
  });
  it("İngilizce ve İspanyolca", () => {
    expect(render(SignInPage, {}, { status: "signed-out" }, "en")).toContain("Sign in to your account");
    expect(render(SignInPage, {}, { status: "signed-out" }, "es")).toContain("Inicia sesión en tu cuenta");
    expect(render(AccountCard, { variant: "sidebar" }, { status: "signed-out" }, "en")).toContain(">Sign in<");
  });
});

describe("Ayarlar › Hesap", () => {
  it("girişsiz: giriş ve hesap oluşturma", () => {
    const html = render(AccountSettings, {}, { status: "signed-out" });
    expect(html).toContain("id=\"account\"");
    expect(html).toContain("href=\"/account/sign-in\"");
    expect(html).toContain("href=\"/account/sign-up\"");
  });
  it("girişli: e-posta, takma ad, parola ve çıkış", () => {
    const html = decode(render(AccountSettings, {}, { status: "signed-in", user }));
    for (const text of ["ad@ornek.com", "Takma ad", "Parola", "Değiştir", "Çıkış yap", "Bu cihazdaki veriler yerinde kalır"]) expect(html).toContain(text);
    // Takma ad okunana kadar düzenleme düğmesi yok (mevcut ad bilinmeden üzerine yazılmasın).
    expect(html).not.toContain(">Ekle<");
  });
});
