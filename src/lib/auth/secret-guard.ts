// Gizli anahtar koruması (karar 0035). Next, `NEXT_PUBLIC_` ile başlayan her değişkeni derlemede tarayıcı paketine gömer; bu yüzden
// yalnız derleme anında (`next.config.ts`) çalışır ve tarayıcı paketine girmez.
// Yeni biçimdeki gizli anahtar: önek ve ardından en az 20 karakter. Yalnız öneki anan metin (ör. Vercel'in commit mesajı değişkeni
// `NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE` içinde "sb_secret_ anahtarlarını reddet") anahtar sayılmaz.
const NEW_SECRET = /sb_secret_[A-Za-z0-9_-]{20,}/;

/** Değer bir Supabase gizli anahtarı içeriyor mu: yeni biçim (`sb_secret_…`) ya da eski biçim (rolü `service_role` olan JWT). */
export function looksLikeSecretKey(value: string): boolean {
  if (NEW_SECRET.test(value)) return true;
  for (const token of value.match(/eyJ[\w-]*\.eyJ[\w-]*\.[\w-]*/g) ?? []) {
    try {
      const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8")) as { role?: unknown };
      if (payload.role === "service_role") return true;
    } catch { /* JWT değil */ }
  }
  return false;
}

/**
 * Tarayıcı paketine yazılan değişkenlerden (`NEXT_PUBLIC_` ile başlayan her ad) gizli anahtar taşıyanların adları. Next bu değerleri
 * derlemede pakete gömer; hesaplar kapalı kalsa da değer pakette olurdu. `next.config.ts` bu liste boş değilse derlemeyi durdurur.
 */
export function publicEnvWithSecrets(env: Record<string, string | undefined>): string[] {
  return Object.entries(env).filter(([name, value]) => name.startsWith("NEXT_PUBLIC_") && typeof value === "string" && looksLikeSecretKey(value)).map(([name]) => name).sort();
}
