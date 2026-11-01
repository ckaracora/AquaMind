// Hesap işlemleri (karar 0035). Ekranlar Supabase'i doğrudan çağırmaz; bu işlevler girdiyi denetler, Supabase'e doğru seçeneklerle
// gider ve sonucu ekranın gösterebileceği bir anahtara çevirir. İstemci dışarıdan verilir; testler sahte istemciyle çalışır.
import type { SupabaseClient } from "@supabase/supabase-js";
import { authErrorKey, type AuthErrorKey } from "./errors";

export type AuthApi = Pick<SupabaseClient["auth"], "signInWithPassword" | "signUp" | "resend" | "verifyOtp" | "resetPasswordForEmail" | "updateUser" | "signOut">;
export type ActionFailure = { ok: false; error: AuthErrorKey };
export type ActionResult = { ok: true } | ActionFailure;

export const MIN_PASSWORD_LENGTH = 8;
export const NICKNAME_MAX_LENGTH = 100;

// E-posta posta sunucusunda doğrulanır; burada yalnız açık yazım hataları yakalanır.
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(email: string): string { return email.trim() }
export function isEmailShaped(email: string): boolean { return EMAIL_SHAPE.test(normalizeEmail(email)) }
// Karakter sayısı kod noktasıyla (emoji gibi iki birimlik karakterler bir sayılır); son söz Supabase'in parola ayarında.
export function isPasswordLongEnough(password: string): boolean { return [...password].length >= MIN_PASSWORD_LENGTH }

/** E-postadaki bağlantıların açacağı sayfalar. Köken, Supabase'in yönlendirme listesinde olmalıdır (docs/DECISIONS/0035). */
export const confirmUrl = (origin: string) => `${origin}/account/confirm`;
export const newPasswordUrl = (origin: string) => `${origin}/account/new-password`;

const fail = (error: unknown): ActionResult => ({ ok: false, error: authErrorKey(error) });
const settle = ({ error }: { error: unknown }): ActionResult => (error ? fail(error) : { ok: true });

// Hesabın var olup olmadığını ya da e-postasının onaylı olup olmadığını ele verecek hataları ekranda başarıdan ayırt edilmez kılar.
function hideAccountState(result: ActionResult, hidden: readonly AuthErrorKey[]): ActionResult {
  return !result.ok && hidden.includes(result.error) ? { ok: true } : result;
}

async function attempt(run: () => Promise<{ error: unknown }>): Promise<ActionResult> {
  try { return settle(await run()) } catch (error) { return fail(error) }
}

function credentialsProblem(email: string, password: string): ActionFailure | null {
  if (!isEmailShaped(email)) return { ok: false, error: "emailInvalid" };
  if (!isPasswordLongEnough(password)) return { ok: false, error: "passwordShort" };
  return null;
}

export function signIn(auth: AuthApi, email: string, password: string): Promise<ActionResult> {
  if (!isEmailShaped(email)) return Promise.resolve({ ok: false, error: "emailInvalid" });
  // Girişte uzunluk denetlenmez: eski ya da panelden verilmiş parolalar kısa olabilir; yanlışsa Supabase söyler.
  return attempt(() => auth.signInWithPassword({ email: normalizeEmail(email), password }));
}

// Kayıtlı bir e-postayla yeniden kayıt olunursa Supabase, "Confirm email" ve "Confirm phone" ikisi de açıksa sahte bir kullanıcı
// döndürür, biri kapalıysa `user_already_exists` hatası verir (supabase.com/docs, signUp). Ekran her durumda "E-postanı kontrol et"
// gösterir; hesabın varlığı ekrandan anlaşılmaz. (Auth API'sini doğrudan çağıran biri için güvence panel ayarlarına bağlıdır.)
export async function signUp(auth: AuthApi, email: string, password: string, origin: string): Promise<ActionResult> {
  const problem = credentialsProblem(email, password);
  if (problem) return problem;
  const result = await attempt(() => auth.signUp({ email: normalizeEmail(email), password, options: { emailRedirectTo: confirmUrl(origin) } }));
  // `over_email_send_rate_limit` (ör. projenin saatlik e-posta sınırı) da aynı ekranı açar: onaylı hesap o durumda e-posta yoluna hiç
  // girmeden başarı döndüğü için hatayı göstermek hesabı ayırt ettirirdi (Codex 4. tur). Supabase gönderim olmazsa kullanıcıyı da
  // oluşturmaz; bu yüzden ekrandaki "yeniden gönder" `resend` değil kaydın kendisini aynı bilgilerle yeniden dener (sign-up sayfası).
  // Kayıt yeniden denendiğinde onaysız hesaba onay e-postası yeniden gider, onaylı hesap yine sessizce başarı döner.
  return hideAccountState(result, ["accountExists", "emailRateLimited"]);
}

// Onaylı hesaba yeniden gönderme Supabase'te sessizce başarı döner, yeni hesaba kısa aralıkla ikinci istek `over_email_send_rate_limit`
// verir; ikisi de aynı "istek alındı" iletisini gösterir (ileti teslimi garanti etmez, gelmezse biraz sonra yeniden denemeyi söyler).
export async function resendConfirmation(auth: AuthApi, email: string, origin: string): Promise<ActionResult> {
  if (!isEmailShaped(email)) return { ok: false, error: "emailInvalid" };
  const result = await attempt(() => auth.resend({ type: "signup", email: normalizeEmail(email), options: { emailRedirectTo: confirmUrl(origin) } }));
  return hideAccountState(result, ["emailRateLimited"]);
}

export function confirmEmail(auth: AuthApi, tokenHash: string): Promise<ActionResult> {
  if (!tokenHash) return Promise.resolve({ ok: false, error: "linkInvalid" });
  return attempt(() => auth.verifyOtp({ token_hash: tokenHash, type: "email" }));
}

// Supabase kayıtlı olmayan adrese hemen başarı döndürür; kayıtlı adrese kısa aralıkla ikinci istek ya da projenin saatlik e-posta
// sınırı `over_email_send_rate_limit` verir. Bu hata da aynı "istek alındı" iletisini gösterir; ileti teslimi garanti etmez, gelmezse
// biraz sonra yeniden denemeyi söyler. Yoksa ileti hesabın varlığını ele verirdi.
export async function requestPasswordReset(auth: AuthApi, email: string, origin: string): Promise<ActionResult> {
  if (!isEmailShaped(email)) return { ok: false, error: "emailInvalid" };
  const result = await attempt(() => auth.resetPasswordForEmail(normalizeEmail(email), { redirectTo: newPasswordUrl(origin) }));
  return hideAccountState(result, ["emailRateLimited"]);
}

/** Sıfırlama bağlantısındaki anahtarla oturum açar; ardından `changePassword` yeni parolayı yazar. Anahtar tek kullanımlıktır. */
export function verifyRecovery(auth: AuthApi, tokenHash: string): Promise<ActionResult> {
  if (!tokenHash) return Promise.resolve({ ok: false, error: "linkInvalid" });
  return attempt(() => auth.verifyOtp({ token_hash: tokenHash, type: "recovery" }));
}

export function passwordProblem(password: string, repeat: string): ActionFailure | null {
  if (!isPasswordLongEnough(password)) return { ok: false, error: "passwordShort" };
  if (password !== repeat) return { ok: false, error: "passwordMismatch" };
  return null;
}

export function changePassword(auth: AuthApi, password: string, repeat: string): Promise<ActionResult> {
  const problem = passwordProblem(password, repeat);
  if (problem) return Promise.resolve(problem);
  return attempt(() => auth.updateUser({ password }));
}

// Yalnız bu cihazdaki oturum kapanır; başka cihazlardaki girişler sürer. Sonuç "bu cihazda oturum kapandı mı" sorusunun cevabıdır.
// Supabase hata döndürürse (ör. süresi dolmuş oturum çevrimdışıyken yenilenemedi) yerel oturum yine silinir (`clearLocal`): kullanıcı
// çıkış yapamadan kalmaz. Tarayıcının deposuna erişilemediği için o da silinemezse çıkış başarılı gösterilmez ("storageUnavailable").
export async function signOut(auth: AuthApi, clearLocal: () => boolean): Promise<ActionResult> {
  const result = await attempt(() => auth.signOut({ scope: "local" }));
  if (result.ok) return result;
  return clearLocal() ? { ok: true } : { ok: false, error: "storageUnavailable" };
}
