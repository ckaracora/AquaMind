// Güvenlik başlıkları (docs/SECURITY.md → "Tarayıcı güvenlik başlıkları"). Uygulama dış betik, yazı tipi ya da resim yüklemez; bu
// yüzden içerik politikası her şeyi aynı kaynağa sınırlar. Tek dış istek, hesaplar açıksa (karar 0035) Supabase projesinin kendisine
// gider: `connect-src` yalnız o kökeni ekler; hesaplar kapalıyken politika değişmez.
// - `script-src 'unsafe-inline'`: Next.js sayfaya kendi satır içi betiklerini yazar; tek kullanımlık anahtar (nonce) her
//   isteği sunucuda çizmeyi gerektirir ve sayfaların önceden derlenmesini bozar. Dış betik yine yüklenemez.
// - Geliştirme sunucusu sıcak yenileme için `eval` kullanır; `'unsafe-eval'` yalnız geliştirmede eklenir.
// - Vercel önizlemelerindeki araç çubuğu için Vercel'in belgelediği adresler yalnız önizlemede eklenir
//   (https://vercel.com/docs/vercel-toolbar/managing-toolbar).
// HSTS başlığını Vercel kendisi gönderir; burada yinelenmez.
export interface HeaderEnv {
  development: boolean;
  vercelPreview: boolean;
  /** Hesaplar açıksa Supabase projesinin kökeni (`https://<proje kimliği>.supabase.co`), değilse yok. */
  supabaseOrigin?: string | null;
}

export function contentSecurityPolicy(env: HeaderEnv): string {
  const toolbar = env.vercelPreview;
  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": ["'self'", "'unsafe-inline'", ...(env.development ? ["'unsafe-eval'"] : []), ...(toolbar ? ["https://vercel.live"] : [])],
    "style-src": ["'self'", "'unsafe-inline'", ...(toolbar ? ["https://vercel.live"] : [])],
    "img-src": ["'self'", "data:", "blob:", ...(toolbar ? ["https://vercel.live", "https://vercel.com"] : [])],
    "font-src": ["'self'", "data:", ...(toolbar ? ["https://vercel.live", "https://assets.vercel.com"] : [])],
    "connect-src": ["'self'", ...(env.supabaseOrigin ? [env.supabaseOrigin] : []), ...(env.development ? ["ws:"] : []), ...(toolbar ? ["https://vercel.live", "wss://ws-us3.pusher.com"] : [])],
    "frame-src": toolbar ? ["https://vercel.live"] : ["'none'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
  };
  // `upgrade-insecure-requests` eklenmez: yerelde http ile açılan üretim derlemesini bozar; Vercel zaten HSTS ile https zorlar.
  return Object.entries(directives).map(([name, values]) => `${name} ${values.join(" ")}`).join("; ");
}

// Hesap sayfaları e-postadaki tek kullanımlık anahtarı adreste taşıyabilir (`/account/confirm`, `/account/new-password`); sayfa onu
// okuyup adresten siler, ama o ana kadar yüklenen dosyaların isteklerinde `Referer` başlığı tam adresi taşırdı. Bu sayfalarda başlık
// hiç gönderilmez. Next aynı adı taşıyan başlıkta sonraki kuralı uygular.
export function headerRules(env: HeaderEnv) {
  return [
    { source: "/:path*", headers: securityHeaders(env) },
    { source: "/account/:path*", headers: [{ key: "Referrer-Policy", value: "no-referrer" }] },
  ];
}

export function securityHeaders(env: HeaderEnv) {
  return [
    { key: "Content-Security-Policy", value: contentSecurityPolicy(env) },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ];
}
