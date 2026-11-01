import { afterEach, describe, expect, it, vi } from "vitest";
import { changePassword, confirmEmail, confirmUrl, isEmailShaped, isPasswordLongEnough, newPasswordUrl, passwordProblem, requestPasswordReset, resendConfirmation, signIn, signOut, signUp, verifyRecovery, type AuthApi } from "@/lib/auth/actions";
import { readAuthConfig } from "@/lib/auth/config";
import { readEmailLink } from "@/lib/auth/email-link";
import { authErrorKey } from "@/lib/auth/errors";
import { loadNickname, saveNickname, type ProfileApi } from "@/lib/auth/profile";
import { looksLikeSecretKey, publicEnvWithSecrets } from "@/lib/auth/secret-guard";
import { contentSecurityPolicy, headerRules } from "@/lib/security-headers";

// Hesaplar 1C-1 (docs/DECISIONS/0035-giris-temeli.md): Supabase'e giden çağrılar sahte istemciyle sınanır; gerçek Supabase'e karşı
// aynı işlevler hazırlık testlerinde çalışır (supabase/staging/auth-flows.test.ts).
const REF = "abcdefghijklmnopqrst";
const URL_OK = `https://${REF}.supabase.co`;
const KEY_OK = "sb_publishable_abc123";

describe("hesap ayarı (ortam değişkenleri)", () => {
  it("iki değer de geçerliyse açılır, adres kökene indirgenir", () => {
    expect(readAuthConfig(URL_OK, KEY_OK)).toEqual({ url: URL_OK, publishableKey: KEY_OK });
    expect(readAuthConfig(`${URL_OK}/`, ` ${KEY_OK} `)).toEqual({ url: URL_OK, publishableKey: KEY_OK });
  });
  it("biri eksik ya da boşsa kapalıdır (bugünkü canlı site)", () => {
    expect(readAuthConfig(undefined, undefined)).toBeNull();
    expect(readAuthConfig(URL_OK, undefined)).toBeNull();
    expect(readAuthConfig(undefined, KEY_OK)).toBeNull();
    expect(readAuthConfig("  ", KEY_OK)).toBeNull();
  });
  it("yalnız https ve <20 karakterlik kimlik>.supabase.co kabul edilir", () => {
    for (const url of [`http://${REF}.supabase.co`, `https://${REF}.supabase.co.evil.example`, `https://evil.example/${REF}.supabase.co`, "https://short.supabase.co", `https://${REF}.supabase.co:8443`, `https://user:pw@${REF}.supabase.co`, `${URL_OK}/rest/v1`, `${URL_OK}/?x=1`, `${URL_OK}/#a`, "not a url"]) {
      expect(readAuthConfig(url, KEY_OK), url).toBeNull();
    }
  });
  it("büyük harfli adres aynı köken sayılır (URL alan adını küçültür)", () => {
    expect(readAuthConfig(`https://${REF.toUpperCase()}.supabase.co`, KEY_OK)).toEqual({ url: URL_OK, publishableKey: KEY_OK });
  });
  it("gizli anahtar asla kabul edilmez", () => {
    expect(readAuthConfig(URL_OK, "sb_secret_abc")).toBeNull();
    expect(readAuthConfig(URL_OK, "eyJhbGciOi.legacy.anon")).toBeNull();
  });
});

describe("gizli anahtar koruması (derleme)", () => {
  const jwt = (role: string) => `eyJhbGciOiJIUzI1NiJ9.${Buffer.from(JSON.stringify({ iss: "supabase", role })).toString("base64url")}.imza`;
  it("yeni ve eski biçimdeki gizli anahtarı tanır; yayınlanabilir anahtarı ve anon JWT'yi tanımaz", () => {
    // Gerçek biçimde (önek + 31 karakter) ama sahte; düz metin olarak yazılmaz ki depo taramaları gerçek anahtar sanmasın.
    const key = ["sb", "secret", "Sahte0Deneme1Anahtari2Degil3abc"].join("_");
    expect(looksLikeSecretKey(key)).toBe(true);
    expect(looksLikeSecretKey(` ${key} `)).toBe(true);
    expect(looksLikeSecretKey(`https://x/?k=${key}`)).toBe(true);
    // Yalnız öneki anan metin anahtar değildir (Vercel'in commit mesajı değişkeni).
    expect(looksLikeSecretKey("fix: reject sb_secret_ keys before build")).toBe(false);
    expect(looksLikeSecretKey("sb_secret_abc")).toBe(false);
    expect(jwt("service_role").startsWith("eyJ")).toBe(true);
    expect(looksLikeSecretKey(jwt("service_role"))).toBe(true);
    expect(looksLikeSecretKey(jwt("anon"))).toBe(false);
    expect(looksLikeSecretKey(KEY_OK)).toBe(false);
    expect(looksLikeSecretKey(URL_OK)).toBe(false);
    expect(looksLikeSecretKey("eyJ.bozuk.eyJ")).toBe(false);
  });
  it("tarayıcıya giden her değişkeni denetler (yalnız anahtar değişkenini değil), öbürlerine bakmaz", () => {
    // Gerçek biçimde (önek + 31 karakter) ama sahte; düz metin olarak yazılmaz ki depo taramaları gerçek anahtar sanmasın.
    const key = ["sb", "secret", "Sahte0Deneme1Anahtari2Degil3abc"].join("_");
    expect(publicEnvWithSecrets({ NEXT_PUBLIC_SUPABASE_URL: key, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: KEY_OK })).toEqual(["NEXT_PUBLIC_SUPABASE_URL"]);
    expect(publicEnvWithSecrets({ NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: ` ${key}`, NEXT_PUBLIC_OTHER: jwt("service_role") })).toEqual(["NEXT_PUBLIC_OTHER", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"]);
    expect(publicEnvWithSecrets({ STAGING_SECRET_KEY: key, NEXT_PUBLIC_SUPABASE_URL: URL_OK, NEXT_PUBLIC_EMPTY: undefined, NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE: "fix: reject sb_secret_ keys" })).toEqual([]);
  });
});

describe("içerik güvenlik politikası", () => {
  const base = { development: false, vercelPreview: false };
  it("hesaplar kapalıyken değişmez", () => {
    expect(contentSecurityPolicy({ ...base, supabaseOrigin: null })).toBe(contentSecurityPolicy(base));
    expect(contentSecurityPolicy(base)).toContain("connect-src 'self';");
  });
  it("hesap sayfalarında başvuru başlığı gönderilmez; kural genel kuraldan sonra gelir", () => {
    const rules = headerRules(base);
    expect(rules.map(rule => rule.source)).toEqual(["/:path*", "/account/:path*"]);
    expect(rules[1].headers).toEqual([{ key: "Referrer-Policy", value: "no-referrer" }]);
    expect(rules[0].headers.find(header => header.key === "Referrer-Policy")?.value).toBe("strict-origin-when-cross-origin");
  });
  it("hesaplar açıkken yalnız connect-src'ye Supabase kökeni eklenir", () => {
    const withAuth = contentSecurityPolicy({ ...base, supabaseOrigin: URL_OK });
    expect(withAuth).toContain(`connect-src 'self' ${URL_OK};`);
    expect(withAuth.replace(` ${URL_OK}`, "")).toBe(contentSecurityPolicy(base));
  });
});

describe("hata anahtarları", () => {
  it.each([
    ["invalid_credentials", "invalidCredentials"], ["email_not_confirmed", "emailNotConfirmed"], ["weak_password", "weakPassword"],
    ["same_password", "samePassword"], ["over_request_rate_limit", "rateLimited"], ["over_email_send_rate_limit", "emailRateLimited"],
    ["user_already_exists", "accountExists"], ["email_exists", "accountExists"],
    ["otp_expired", "linkInvalid"], ["flow_state_expired", "linkInvalid"], ["email_address_invalid", "emailInvalid"],
    ["23505", "nicknameTaken"], ["23514", "nicknameLength"], ["some_new_code", "unexpected"],
  ])("%s → %s", (code, key) => expect(authErrorKey({ code })).toBe(key));
  it("ağ hataları ve 429", () => {
    expect(authErrorKey({ name: "AuthRetryableFetchError", status: 0 })).toBe("network");
    expect(authErrorKey(new TypeError("Failed to fetch"))).toBe("network");
    expect(authErrorKey({ status: 429 })).toBe("rateLimited");
    expect(authErrorKey(null)).toBe("unexpected");
    expect(authErrorKey("metin")).toBe("unexpected");
  });
});

type Call = [string, unknown];
function fakeAuth(results: Partial<Record<keyof AuthApi, { error: unknown } | Error>> = {}) {
  const calls: Call[] = [];
  const handler = (name: keyof AuthApi) => async (...args: unknown[]) => {
    calls.push([name, args.length === 1 ? args[0] : args]);
    const result = results[name];
    if (result instanceof Error) throw result;
    return { data: {}, error: result?.error ?? null };
  };
  const auth = Object.fromEntries((["signInWithPassword", "signUp", "resend", "verifyOtp", "resetPasswordForEmail", "updateUser", "signOut"] as const).map(name => [name, handler(name)])) as unknown as AuthApi;
  return { auth, calls };
}
const ORIGIN = "https://aqua-mind-git-x-ckaracoras-projects.vercel.app";

describe("girdi denetimi", () => {
  it("e-posta biçimi", () => {
    expect(isEmailShaped(" ad@ornek.com ")).toBe(true);
    for (const bad of ["", "ad", "ad@", "@ornek.com", "ad@ornek", "a d@ornek.com"]) expect(isEmailShaped(bad), bad).toBe(false);
  });
  it("parola en az 8 karakter (kod noktası)", () => {
    expect(isPasswordLongEnough("1234567")).toBe(false);
    expect(isPasswordLongEnough("12345678")).toBe(true);
    expect(isPasswordLongEnough("🐟🐟🐟🐟🐟🐟🐟")).toBe(false);
    expect(passwordProblem("12345678", "12345679")).toEqual({ ok: false, error: "passwordMismatch" });
    expect(passwordProblem("1234567", "1234567")).toEqual({ ok: false, error: "passwordShort" });
    expect(passwordProblem("12345678", "12345678")).toBeNull();
  });
});

describe("Supabase çağrıları", () => {
  it("giriş: e-posta kırpılır; kısa parola girişte engellenmez", async () => {
    const { auth, calls } = fakeAuth();
    expect(await signIn(auth, " ad@ornek.com ", "kisa")).toEqual({ ok: true });
    expect(calls).toEqual([["signInWithPassword", { email: "ad@ornek.com", password: "kisa" }]]);
  });
  it("giriş: geçersiz e-postada Supabase çağrılmaz", async () => {
    const { auth, calls } = fakeAuth();
    expect(await signIn(auth, "ad", "12345678")).toEqual({ ok: false, error: "emailInvalid" });
    expect(calls).toEqual([]);
  });
  it("giriş hatası ve atılan istisna anahtara çevrilir", async () => {
    expect(await signIn(fakeAuth({ signInWithPassword: { error: { code: "email_not_confirmed" } } }).auth, "ad@ornek.com", "x")).toEqual({ ok: false, error: "emailNotConfirmed" });
    expect(await signIn(fakeAuth({ signInWithPassword: new TypeError("Failed to fetch") }).auth, "ad@ornek.com", "x")).toEqual({ ok: false, error: "network" });
  });
  it("kayıt: onay bağlantısı bu sitenin onay sayfasına döner", async () => {
    const { auth, calls } = fakeAuth();
    expect(await signUp(auth, "ad@ornek.com", "12345678", ORIGIN)).toEqual({ ok: true });
    expect(calls).toEqual([["signUp", { email: "ad@ornek.com", password: "12345678", options: { emailRedirectTo: `${ORIGIN}/account/confirm` } }]]);
    expect(confirmUrl(ORIGIN)).toBe(`${ORIGIN}/account/confirm`);
  });
  it("kayıt: kayıtlı adres ekranda yeni kayıttan ayırt edilmez", async () => {
    expect(await signUp(fakeAuth({ signUp: { error: { code: "user_already_exists" } } }).auth, "ad@ornek.com", "12345678", ORIGIN)).toEqual({ ok: true });
    // E-posta sıklığı hatası da aynı ekranı açar (onaylı hesap bu durumda sessizce başarı döner); ekrandaki "yeniden gönder" kaydı
    // yeniden dener, böylece sınır yüzünden oluşmamış hesap sonradan oluşur (sign-up sayfası).
    expect(await signUp(fakeAuth({ signUp: { error: { code: "over_email_send_rate_limit" } } }).auth, "ad@ornek.com", "12345678", ORIGIN)).toEqual({ ok: true });
    expect(await signUp(fakeAuth({ signUp: { error: { code: "over_request_rate_limit" } } }).auth, "ad@ornek.com", "12345678", ORIGIN)).toEqual({ ok: false, error: "rateLimited" });
  });
  it("kayıt: kısa parola ve geçersiz e-posta Supabase'e gitmez", async () => {
    const { auth, calls } = fakeAuth();
    expect(await signUp(auth, "ad@ornek.com", "1234567", ORIGIN)).toEqual({ ok: false, error: "passwordShort" });
    expect(await signUp(auth, "ad", "12345678", ORIGIN)).toEqual({ ok: false, error: "emailInvalid" });
    expect(calls).toEqual([]);
  });
  it("onay e-postasını yeniden gönderme", async () => {
    const { auth, calls } = fakeAuth();
    await resendConfirmation(auth, "ad@ornek.com", ORIGIN);
    expect(calls).toEqual([["resend", { type: "signup", email: "ad@ornek.com", options: { emailRedirectTo: `${ORIGIN}/account/confirm` } }]]);
  });
  it("yeniden gönderme: e-posta sıklığı hatası onaylı hesabın sessiz başarısından ayırt edilmez; IP sınırı ve ağ hatası gösterilir", async () => {
    expect(await resendConfirmation(fakeAuth({ resend: { error: { code: "over_email_send_rate_limit" } } }).auth, "ad@ornek.com", ORIGIN)).toEqual({ ok: true });
    expect(await resendConfirmation(fakeAuth().auth, "ad@ornek.com", ORIGIN)).toEqual({ ok: true });
    expect(await resendConfirmation(fakeAuth({ resend: { error: { code: "over_request_rate_limit" } } }).auth, "ad@ornek.com", ORIGIN)).toEqual({ ok: false, error: "rateLimited" });
    expect(await resendConfirmation(fakeAuth({ resend: new TypeError("Failed to fetch") }).auth, "ad@ornek.com", ORIGIN)).toEqual({ ok: false, error: "network" });
  });
  it("e-posta onayı ve parola sıfırlama anahtarları doğru türle doğrulanır", async () => {
    const { auth, calls } = fakeAuth();
    await confirmEmail(auth, "pkce_abc");
    await verifyRecovery(auth, "pkce_def");
    expect(calls).toEqual([["verifyOtp", { token_hash: "pkce_abc", type: "email" }], ["verifyOtp", { token_hash: "pkce_def", type: "recovery" }]]);
    expect(await confirmEmail(auth, "")).toEqual({ ok: false, error: "linkInvalid" });
    expect(await verifyRecovery(auth, "")).toEqual({ ok: false, error: "linkInvalid" });
    expect(calls).toHaveLength(2);
  });
  it("sıfırlama isteği yeni parola sayfasına döner", async () => {
    const { auth, calls } = fakeAuth();
    await requestPasswordReset(auth, " ad@ornek.com", ORIGIN);
    expect(calls).toEqual([["resetPasswordForEmail", ["ad@ornek.com", { redirectTo: `${ORIGIN}/account/new-password` }]]]);
    expect(newPasswordUrl(ORIGIN)).toBe(`${ORIGIN}/account/new-password`);
  });
  it("sıfırlama: kayıtlı adrese ikinci istek de aynı ileti (hesabın varlığı ele verilmez); IP sınırı ve ağ hatası gösterilir", async () => {
    expect(await requestPasswordReset(fakeAuth({ resetPasswordForEmail: { error: { code: "over_email_send_rate_limit" } } }).auth, "ad@ornek.com", ORIGIN)).toEqual({ ok: true });
    expect(await requestPasswordReset(fakeAuth({ resetPasswordForEmail: { error: { code: "over_request_rate_limit" } } }).auth, "ad@ornek.com", ORIGIN)).toEqual({ ok: false, error: "rateLimited" });
    expect(await requestPasswordReset(fakeAuth({ resetPasswordForEmail: new TypeError("Failed to fetch") }).auth, "ad@ornek.com", ORIGIN)).toEqual({ ok: false, error: "network" });
  });
  it("parola değiştirme önce iki alanı denetler", async () => {
    const { auth, calls } = fakeAuth();
    expect(await changePassword(auth, "12345678", "1234567x")).toEqual({ ok: false, error: "passwordMismatch" });
    expect(calls).toEqual([]);
    expect(await changePassword(auth, "12345678", "12345678")).toEqual({ ok: true });
    expect(calls).toEqual([["updateUser", { password: "12345678" }]]);
    expect(await changePassword(fakeAuth({ updateUser: { error: { code: "same_password" } } }).auth, "12345678", "12345678")).toEqual({ ok: false, error: "samePassword" });
  });
  it("çıkış yalnız bu cihazda; başarılıysa yerel silmeye gerek yok", async () => {
    const { auth, calls } = fakeAuth();
    const clearLocal = vi.fn();
    expect(await signOut(auth, clearLocal)).toEqual({ ok: true });
    expect(calls).toEqual([["signOut", { scope: "local" }]]);
    expect(clearLocal).not.toHaveBeenCalled();
  });
  it("çıkış hata verirse (süresi dolmuş oturum çevrimdışı yenilenemedi) yerel oturum yine silinir ve çıkış tamamlanmış sayılır", async () => {
    const offline = vi.fn(() => true);
    expect(await signOut(fakeAuth({ signOut: { error: { name: "AuthRetryableFetchError", status: 0 } } }).auth, offline)).toEqual({ ok: true });
    expect(offline).toHaveBeenCalledOnce();
    const thrown = vi.fn(() => true);
    expect(await signOut(fakeAuth({ signOut: new TypeError("Failed to fetch") }).auth, thrown)).toEqual({ ok: true });
    expect(thrown).toHaveBeenCalledOnce();
  });
  it("yerel oturum da silinemediyse (depoya erişilemedi) çıkış yapılmış gösterilmez", async () => {
    expect(await signOut(fakeAuth({ signOut: new DOMException("engelli", "SecurityError") }).auth, () => false)).toEqual({ ok: false, error: "storageUnavailable" });
  });
});

describe("e-posta bağlantısı", () => {
  it("anahtar ve tür okunur; beklenmeyen tür ya da biçim reddedilir", () => {
    expect(readEmailLink("?token_hash=pkce_0123abcd&type=email", ["email", "signup"])).toEqual({ tokenHash: "pkce_0123abcd", type: "email" });
    expect(readEmailLink("?token_hash=0123abcdef&type=recovery", ["recovery"])).toEqual({ tokenHash: "0123abcdef", type: "recovery" });
    expect(readEmailLink("?token_hash=0123abcdef&type=recovery", ["email"])).toBeNull();
    expect(readEmailLink("?type=email", ["email"])).toBeNull();
    expect(readEmailLink("?token_hash=short&type=email", ["email"])).toBeNull();
    expect(readEmailLink("?token_hash=abc%20defghij&type=email", ["email"])).toBeNull();
    expect(readEmailLink("", ["email"])).toBeNull();
  });
});

function fakeDb(response: { data?: unknown; error?: unknown; status: number } | Error) {
  const calls: unknown[][] = [];
  const builder: Record<string, (...args: unknown[]) => unknown> = {};
  const settle = () => response instanceof Error ? Promise.reject(response) : Promise.resolve({ data: null, error: null, ...response });
  for (const name of ["select", "update", "eq"]) builder[name] = (...args) => { calls.push([name, ...args]); return builder };
  builder.maybeSingle = () => { calls.push(["maybeSingle"]); return settle() };
  (builder as { then?: unknown }).then = (resolve: (v: unknown) => unknown, reject: (e: unknown) => unknown) => settle().then(resolve, reject);
  const db = { from: (table: string) => { calls.push(["from", table]); return builder } } as unknown as ProfileApi;
  return { db, calls };
}

describe("takma ad", () => {
  it("yalnız kendi satırından okunur", async () => {
    const { db, calls } = fakeDb({ data: { nickname: "Balıkçı" }, status: 200 });
    expect(await loadNickname(db, "u1")).toEqual({ ok: true, nickname: "Balıkçı" });
    expect(calls).toEqual([["from", "profiles"], ["select", "nickname"], ["eq", "user_id", "u1"], ["maybeSingle"]]);
    expect(await loadNickname(fakeDb({ data: null, status: 200 }).db, "u1")).toEqual({ ok: true, nickname: null });
  });
  it("kırpılarak yazılır; boşsa silinir", async () => {
    const { db, calls } = fakeDb({ status: 204 });
    expect(await saveNickname(db, "u1", "  Balıkçı  ")).toEqual({ ok: true, nickname: "Balıkçı" });
    expect(await saveNickname(db, "u1", "   ")).toEqual({ ok: true, nickname: null });
    expect(calls).toEqual([["from", "profiles"], ["update", { nickname: "Balıkçı" }], ["eq", "user_id", "u1"], ["from", "profiles"], ["update", { nickname: null }], ["eq", "user_id", "u1"]]);
  });
  it("100 karakteri aşan ad gönderilmez", async () => {
    const { db, calls } = fakeDb({ status: 204 });
    expect(await saveNickname(db, "u1", "a".repeat(101))).toEqual({ ok: false, error: "nicknameLength" });
    expect(await saveNickname(db, "u1", "🐟".repeat(100))).toEqual({ ok: true, nickname: "🐟".repeat(100) });
    expect(calls.filter(c => c[0] === "update")).toHaveLength(1);
  });
  it("benzersizlik, ağ ve beklenmeyen hatalar", async () => {
    expect(await saveNickname(fakeDb({ error: { code: "23505" }, status: 409 }).db, "u1", "Ad")).toEqual({ ok: false, error: "nicknameTaken" });
    expect(await saveNickname(fakeDb({ error: { code: "", message: "TypeError: Failed to fetch" }, status: 0 }).db, "u1", "Ad")).toEqual({ ok: false, error: "network" });
    expect(await loadNickname(fakeDb({ error: { code: "", message: "TypeError: Failed to fetch" }, status: 0 }).db, "u1")).toEqual({ ok: false, error: "network" });
    expect(await loadNickname(fakeDb(new Error("x")).db, "u1")).toEqual({ ok: false, error: "unexpected" });
  });
});

describe("oturum deposu ve yerel oturumun silinmesi", () => {
  afterEach(() => { vi.unstubAllEnvs(); vi.resetModules() });
  const backend = (initial: Record<string, string> = {}) => {
    const items = new Map(Object.entries(initial));
    const state = { full: false, blocked: false };
    const guard = () => { if (state.blocked) throw new DOMException("engelli", "SecurityError") };
    return {
      items,
      state,
      get length() { guard(); return items.size },
      key: (i: number) => { guard(); return [...items.keys()][i] ?? null },
      getItem: (key: string) => { guard(); return items.get(key) ?? null },
      setItem: (key: string, value: string) => { guard(); if (state.full) throw new DOMException("dolu", "QuotaExceededError"); items.set(key, value) },
      removeItem: (key: string) => { guard(); items.delete(key) },
    };
  };
  const KEY = `sb-${REF}-auth-token`;
  it("yerel depo varken her şey doğrudan ona gider (öbür sekmenin yenilemesi ve çıkışı hemen görülür)", async () => {
    const { createAuthStorage } = await import("@/lib/auth/client");
    const local = backend();
    const store = createAuthStorage(() => local);
    store.setItem(KEY, "a");
    expect(local.items.get(KEY)).toBe("a");
    local.items.set(KEY, "baska-sekme-yeniledi");
    expect(store.getItem(KEY)).toBe("baska-sekme-yeniledi");
    local.items.delete(KEY);
    expect(store.getItem(KEY)).toBeNull();
  });
  it("yer kalmadıysa yazma hatası gizlenmez, bellekte yarım oturum tutulmaz; ekranda 'yer kalmadı'", async () => {
    const { createAuthStorage } = await import("@/lib/auth/client");
    const local = backend({ [KEY]: "eski" });
    local.state.full = true;
    const store = createAuthStorage(() => local);
    expect(() => store.setItem(KEY, "yeni")).toThrow(DOMException);
    expect(store.getItem(KEY)).toBe("eski");
    expect(authErrorKey(new DOMException("dolu", "QuotaExceededError"))).toBe("storageFull");
  });
  it("yerel depo hiç yoksa ya da ilk kullanımda erişim engelliyse yalnız bellek kullanılır", async () => {
    const { createAuthStorage } = await import("@/lib/auth/client");
    const none = createAuthStorage(() => null);
    none.setItem("k", "v");
    expect(none.getItem("k")).toBe("v");
    none.clear("k");
    expect(none.getItem("k")).toBeNull();
    const denied = createAuthStorage(() => { throw new DOMException("engelli", "SecurityError") });
    denied.setItem("k", "v");
    expect(denied.getItem("k")).toBe("v");
  });
  it("silme yalnız bu projenin oturum anahtarlarına dokunur", async () => {
    const { createAuthStorage } = await import("@/lib/auth/client");
    const local = backend({ [KEY]: "o", [`${KEY}-code-verifier`]: "v", [`${KEY}-user`]: "u", "sb-y-auth-token": "baska", "aquamind:aquariums:v1": "[]", [`${KEY}x`]: "z" });
    createAuthStorage(() => local).clear(KEY);
    expect([...local.items.keys()]).toEqual(["sb-y-auth-token", "aquamind:aquariums:v1", `${KEY}x`]);
  });
  it("silme sırasında erişim engelliyse silme başarısız döner; depodaki oturum olduğu gibi kalır (yalnız bellekte işaret tutulmaz)", async () => {
    const { createAuthStorage } = await import("@/lib/auth/client");
    const local = backend({ [KEY]: "oturum", [`${KEY}-user`]: "u" });
    const store = createAuthStorage(() => local);
    expect(store.getItem(KEY)).toBe("oturum");
    local.state.blocked = true;
    expect(store.clear(KEY)).toBe(false);
    expect(store.getItem(KEY)).toBeNull();
    local.state.blocked = false;
    expect(store.getItem(KEY)).toBe("oturum");
    expect(store.clear(KEY)).toBe(true);
    expect(local.items.size).toBe(0);
    // Öbür sekmede açılan yeni oturum hiçbir işaret yüzünden silinmez.
    local.items.set(KEY, "yeni-giris");
    expect(store.getItem(KEY)).toBe("yeni-giris");
  });
  const session = () => {
    const now = Math.floor(Date.now() / 1000);
    return { access_token: "sahte.erisim.jetonu", token_type: "bearer", expires_in: 3600, expires_at: now + 3600, refresh_token: "sahte-yenileme", user: { id: "11111111-1111-1111-1111-111111111111", aud: "authenticated", role: "authenticated", email: "ad@ornek.com", app_metadata: {}, user_metadata: {}, created_at: "2026-11-01T00:00:00Z" } };
  };
  const sdk = async (local: ReturnType<typeof backend>) => {
    const { createAuthStorage } = await import("@/lib/auth/client");
    const { createClient } = await import("@supabase/supabase-js");
    const storage = createAuthStorage(() => local);
    const requests: string[] = [];
    const fetch = async (input: RequestInfo | URL) => {
      requests.push(String(input).replace(URL_OK, "").split("?")[0]);
      return new Response(JSON.stringify(session()), { status: 200, headers: { "content-type": "application/json" } });
    };
    const client = createClient(URL_OK, KEY_OK, { global: { fetch }, auth: { storage, storageKey: KEY, persistSession: true, autoRefreshToken: false, detectSessionInUrl: false } });
    return { client, storage, requests };
  };
  it("gerçek supabase-js: oturum yerel depoda; silince getSession boş (ağ yok, sahte yanıt)", async () => {
    const local = backend();
    const { client, storage, requests } = await sdk(local);
    expect(await signIn(client.auth, "ad@ornek.com", "12345678")).toEqual({ ok: true });
    expect(requests).toEqual(["/auth/v1/token"]);
    expect(local.items.has(KEY)).toBe(true);
    storage.clear(KEY);
    expect((await client.auth.getSession()).data.session).toBeNull();
  });
  it("gerçek supabase-js: yer kalmadıysa giriş 'yer kalmadı' der, oturum bellekte de kalmaz", async () => {
    const local = backend();
    local.state.full = true;
    const { client } = await sdk(local);
    expect(await signIn(client.auth, "ad@ornek.com", "12345678")).toEqual({ ok: false, error: "storageFull" });
    expect((await client.auth.getSession()).data.session).toBeNull();
  });
  it("gerçek supabase-js: çıkışta depoya erişilemiyorsa çıkış yapılmış gösterilmez; erişim dönünce yeniden denenir", async () => {
    const local = backend();
    const { client, storage } = await sdk(local);
    expect(await signIn(client.auth, "ad@ornek.com", "12345678")).toEqual({ ok: true });
    local.state.blocked = true;
    expect(await signOut(client.auth, () => storage.clear(KEY))).toEqual({ ok: false, error: "storageUnavailable" });
    local.state.blocked = false;
    expect((await client.auth.getSession()).data.session).not.toBeNull();
    expect(await signOut(client.auth, () => storage.clear(KEY))).toEqual({ ok: true });
    expect((await client.auth.getSession()).data.session).toBeNull();
  });
  it("oturum anahtarı supabase-js'in varsayılanıyla aynı; hesaplar kapalıyken yok", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", URL_OK);
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", KEY_OK);
    vi.resetModules();
    expect((await import("@/lib/auth/client")).AUTH_STORAGE_KEY).toBe(KEY);
    vi.unstubAllEnvs();
    vi.resetModules();
    expect((await import("@/lib/auth/client")).AUTH_STORAGE_KEY).toBeNull();
  });
});
