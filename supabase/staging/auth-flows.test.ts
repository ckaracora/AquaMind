import { randomBytes, randomUUID } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { changePassword, confirmEmail, confirmUrl, signIn, signOut, verifyRecovery } from "../../src/lib/auth/actions";
import { loadNickname, saveNickname } from "../../src/lib/auth/profile";

// Hazırlık projesinde giriş akışları (karar 0035). Uygulamanın kullandığı işlevler (`src/lib/auth`) gerçek Supabase Auth'a karşı çalışır
// ve projenin ayarlarını da denetler: e-posta ve telefon onayı açık (Auth'un herkese açık ayar ucundan), parola en az 8 karakter,
// önizleme adresleri yönlendirme listesinde.
// E-posta gönderilmez: onay ve sıfırlama anahtarları yönetici istemcisinin `generateLink` çağrısıyla alınır. Yalnız
// `.github/workflows/staging-db.yml` çalıştırır (`pnpm test:staging`). Anahtarlar, parolalar ve jetonlar hiçbir yere yazdırılmaz.

const env = (name: string) => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} tanımlı değil (yalnız hazırlık iş akışında çalışır)`);
  return value;
};
const projectId = env("STAGING_PROJECT_ID");
if (!/^[a-z0-9]+$/.test(projectId)) throw new Error("STAGING_PROJECT_ID beklenen biçimde değil");
const url = `https://${projectId}.supabase.co`;
const publishableKey = env("STAGING_PUBLISHABLE_KEY");
const secretKey = env("STAGING_SECRET_KEY");
const options = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } };
// Vercel önizleme adresi biçimi (docs/DECISIONS/0035, "Supabase ayarları"); yönlendirme listesindeki joker bunu kapsamalı.
const PREVIEW_ORIGIN = "https://aqua-mind-git-staging-check-ckaracoras-projects.vercel.app";

const run = randomUUID().slice(0, 8);
const admin = createClient(url, secretKey, options);
const fresh = (): SupabaseClient => createClient(url, publishableKey, options);
const registered: string[] = [];
const email = `aquamind-staging-${run}-auth@example.com`;
const otherEmail = `aquamind-staging-${run}-auth2@example.com`;
let password = randomBytes(18).toString("base64url");
let userId = "";
let signupTokenHash = "";
let signupRedirect = "";

beforeAll(async () => {
  const link = await admin.auth.admin.generateLink({ type: "signup", email, password, options: { redirectTo: confirmUrl(PREVIEW_ORIGIN) } });
  if (link.error || !link.data.user) throw new Error(`kayıt bağlantısı oluşturulamadı: ${link.error?.code ?? link.error?.status ?? "?"}`);
  registered.push(link.data.user.id);
  userId = link.data.user.id;
  signupTokenHash = link.data.properties.hashed_token;
  signupRedirect = link.data.properties.redirect_to;
}, 60_000);

// Temizlik: yanıtı kaybolmuş bir oluşturma isteğinin kullanıcısı `registered`'a girmemiş olabilir; bu çalıştırmanın e-posta önekiyle
// eşleşen kullanıcılar da aranıp silinir. Hazırlık projesinde gerçek kullanıcı yoktur (karar 0032); yalnız bu öneke dokunulur.
afterAll(async () => {
  const problems: string[] = [];
  const listed = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (listed.error) problems.push(`kullanıcılar listelenemedi (${listed.error.code ?? listed.error.status ?? "?"})`);
  for (const user of listed.data?.users ?? []) if (user.email?.startsWith(`aquamind-staging-${run}-`) && !registered.includes(user.id)) registered.push(user.id);
  if (!registered.length && !problems.length) return;
  for (const id of registered) {
    try {
      const result = await admin.auth.admin.deleteUser(id);
      if (result.error) problems.push(`kullanıcı silinemedi (${result.error.code ?? result.error.status ?? "?"})`);
    } catch (error) {
      problems.push(`kullanıcı silinemedi (${(error as Error).name})`);
    }
  }
  const left = await admin.from("profiles").select("user_id").in("user_id", registered);
  if (left.error || left.data.length) problems.push(`geride kullanıcı kaldı (${left.data?.length ?? "?"})`);
  if (problems.length) throw new Error(`Temizlik tamamlanmadı: ${problems.join(" | ")}`);
}, 60_000);

describe("proje ayarları", () => {
  it("e-posta ve telefon onayı açık: normal kayıt onay ister; kayıtlı adresle yeniden kayıt hata vermez (hesabın varlığı sızmaz)", async () => {
    const response = await fetch(`${url}/auth/v1/settings`, { headers: { apikey: publishableKey } });
    expect(response.status).toBe(200);
    const settings = await response.json() as { mailer_autoconfirm?: unknown; phone_autoconfirm?: unknown };
    expect(settings.mailer_autoconfirm).toBe(false);
    expect(settings.phone_autoconfirm).toBe(false);
  });
  it("önizleme adresi yönlendirme listesinde (yoksa Supabase site adresine düşer)", () => {
    expect(signupRedirect).toBe(confirmUrl(PREVIEW_ORIGIN));
  });
  it("e-postası onaylanmamış kullanıcı giriş yapamaz", async () => {
    expect(await signIn(fresh().auth, email, password)).toEqual({ ok: false, error: "emailNotConfirmed" });
  });
});

describe("e-posta onayı ve giriş", () => {
  const client = fresh();
  it("geçersiz anahtar reddedilir", async () => {
    expect(await confirmEmail(fresh().auth, "0".repeat(56))).toEqual({ ok: false, error: "linkInvalid" });
  });
  it("onay anahtarı oturum açar ve e-postayı onaylar", async () => {
    expect(await confirmEmail(client.auth, signupTokenHash)).toEqual({ ok: true });
    const { data } = await client.auth.getSession();
    expect(data.session?.user.id).toBe(userId);
    const user = await admin.auth.admin.getUserById(userId);
    expect(user.data.user?.email_confirmed_at).toBeTruthy();
  });
  it("aynı anahtar ikinci kez kullanılamaz", async () => {
    expect(await confirmEmail(fresh().auth, signupTokenHash)).toEqual({ ok: false, error: "linkInvalid" });
  });
  it("onaydan sonra giriş; yanlış parola reddedilir", async () => {
    expect(await signIn(fresh().auth, email, password)).toEqual({ ok: true });
    expect(await signIn(fresh().auth, email, `${password}x`)).toEqual({ ok: false, error: "invalidCredentials" });
  });
});

describe("takma ad", () => {
  it("yoktur, eklenir, büyük-küçük harf farkıyla başkası alamaz, silinir", async () => {
    const client = fresh();
    expect(await signIn(client.auth, email, password)).toEqual({ ok: true });
    expect(await loadNickname(client, userId)).toEqual({ ok: true, nickname: null });
    const nickname = `Balikci-${run}`;
    expect(await saveNickname(client, userId, `  ${nickname} `)).toEqual({ ok: true, nickname });
    expect(await loadNickname(client, userId)).toEqual({ ok: true, nickname });

    const otherPassword = randomBytes(18).toString("base64url");
    const other = await admin.auth.admin.createUser({ email: otherEmail, password: otherPassword, email_confirm: true });
    if (other.error || !other.data.user) throw new Error(`ikinci kullanıcı oluşturulamadı: ${other.error?.code ?? "?"}`);
    registered.push(other.data.user.id);
    const otherClient = fresh();
    expect(await signIn(otherClient.auth, otherEmail, otherPassword)).toEqual({ ok: true });
    expect(await saveNickname(otherClient, other.data.user.id, nickname.toUpperCase())).toEqual({ ok: false, error: "nicknameTaken" });
    // Başkasının satırı okunamaz ve değiştirilemez (RLS): değişiklik sessizce hiçbir satıra dokunmaz.
    expect(await loadNickname(otherClient, userId)).toEqual({ ok: true, nickname: null });
    await saveNickname(otherClient, userId, "baskasi");
    expect(await loadNickname(client, userId)).toEqual({ ok: true, nickname });

    expect(await saveNickname(client, userId, "   ")).toEqual({ ok: true, nickname: null });
    expect(await loadNickname(client, userId)).toEqual({ ok: true, nickname: null });
  });
});

describe("parola", () => {
  it("sunucu 8 karakterden kısa parolayı reddeder (panel ayarı)", async () => {
    const client = fresh();
    expect(await signIn(client.auth, email, password)).toEqual({ ok: true });
    const short = await client.auth.updateUser({ password: "Ab1!xyz" });
    expect(short.error?.code).toBe("weak_password");
  });
  it("aynı parola reddedilir; yenisi yazılır ve onunla girilir", async () => {
    const client = fresh();
    expect(await signIn(client.auth, email, password)).toEqual({ ok: true });
    expect(await changePassword(client.auth, password, password)).toEqual({ ok: false, error: "samePassword" });
    const next = randomBytes(18).toString("base64url");
    expect(await changePassword(client.auth, next, next)).toEqual({ ok: true });
    password = next;
    expect(await signIn(fresh().auth, email, password)).toEqual({ ok: true });
  });
  it("sıfırlama anahtarıyla yeni parola", async () => {
    const link = await admin.auth.admin.generateLink({ type: "recovery", email });
    if (link.error) throw new Error(`sıfırlama bağlantısı oluşturulamadı: ${link.error.code ?? "?"}`);
    const client = fresh();
    expect(await verifyRecovery(client.auth, link.data.properties.hashed_token)).toEqual({ ok: true });
    const next = randomBytes(18).toString("base64url");
    expect(await changePassword(client.auth, next, next)).toEqual({ ok: true });
    password = next;
    expect(await signIn(fresh().auth, email, password)).toEqual({ ok: true });
    expect(await verifyRecovery(fresh().auth, link.data.properties.hashed_token)).toEqual({ ok: false, error: "linkInvalid" });
  });
});

describe("çıkış", () => {
  it("bu cihazdaki oturum kapanır", async () => {
    const client = fresh();
    expect(await signIn(client.auth, email, password)).toEqual({ ok: true });
    const clearLocal = vi.fn();
    expect(await signOut(client.auth, clearLocal)).toEqual({ ok: true });
    expect(clearLocal).not.toHaveBeenCalled();
    const { data } = await client.auth.getSession();
    expect(data.session).toBeNull();
  });
});
