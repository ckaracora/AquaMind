// Supabase Auth ve PostgREST hatalarını ekrandaki ileti anahtarına çevirir. Ham hata metni kullanıcıya gösterilmez
// (Supabase'in İngilizce iletileri dile çevrilemez ve iç ayrıntı taşıyabilir); tanınmayan her hata "unexpected" olur.
export type AuthErrorKey =
  | "emailInvalid"
  | "passwordShort"
  | "passwordMismatch"
  | "invalidCredentials"
  | "emailNotConfirmed"
  | "weakPassword"
  | "samePassword"
  | "rateLimited"
  /** E-posta gönderim sıklığı. Parola sıfırlamada başarı sayılır (hesabın varlığını ele vermesin); başka yerde ileti gösterilir. */
  | "emailRateLimited"
  /** Kayıtta başarı sayılır (actions.ts, signUp); ekrana çıkarsa iletisi genel hatayla aynıdır, hesabın varlığını söylemez. */
  | "accountExists"
  | "network"
  /** Tarayıcının deposunda yer kalmadı; oturum kaydedilemedi. */
  | "storageFull"
  /** Tarayıcının deposuna erişilemedi; bu cihazdaki oturum kapatılamadı. */
  | "storageUnavailable"
  | "linkInvalid"
  | "nicknameTaken"
  | "nicknameLength"
  | "unexpected";

interface ErrorLike { name?: unknown; code?: unknown; status?: unknown }

function asErrorLike(error: unknown): ErrorLike {
  return typeof error === "object" && error !== null ? (error as ErrorLike) : {};
}

export function authErrorKey(error: unknown): AuthErrorKey {
  const { name, code, status } = asErrorLike(error);
  // auth-js ağ hatasını `AuthRetryableFetchError` (durum 0 ya da 5xx) olarak verir; fetch'in kendisi TypeError atar.
  if (name === "AuthRetryableFetchError" || error instanceof TypeError) return "network";
  // Oturum deposuna yazılamadı (createAuthStorage yazma hatasını gizlemez).
  if (name === "QuotaExceededError" || name === "NS_ERROR_DOM_QUOTA_REACHED") return "storageFull";
  switch (code) {
    case "invalid_credentials": return "invalidCredentials";
    case "email_not_confirmed": return "emailNotConfirmed";
    case "weak_password": return "weakPassword";
    case "same_password": return "samePassword";
    case "over_request_rate_limit": return "rateLimited";
    case "over_email_send_rate_limit": return "emailRateLimited";
    case "user_already_exists":
    case "email_exists": return "accountExists";
    case "otp_expired":
    case "flow_state_expired":
    case "flow_state_not_found": return "linkInvalid";
    case "email_address_invalid":
    case "validation_failed": return "emailInvalid";
    // PostgREST: profiles.nickname benzersiz dizini ve uzunluk denetimi (1A migration'ı).
    case "23505": return "nicknameTaken";
    case "23514": return "nicknameLength";
  }
  if (status === 429) return "rateLimited";
  return "unexpected";
}
