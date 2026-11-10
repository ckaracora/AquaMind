// Güvenlik başlıkları (docs/SECURITY.md → "Tarayıcı güvenlik başlıkları"). Uygulama dışarıya istek göndermez, dış betik,
// yazı tipi ya da resim yüklemez; bu yüzden içerik politikası her şeyi aynı kaynağa sınırlar.
// - `script-src 'unsafe-inline'`: Next.js sayfaya kendi satır içi betiklerini yazar; tek kullanımlık anahtar (nonce) her
//   isteği sunucuda çizmeyi gerektirir ve sayfaların önceden derlenmesini bozar. Dış betik yine yüklenemez.
// - Geliştirme sunucusu sıcak yenileme için `eval` kullanır; `'unsafe-eval'` yalnız geliştirmede eklenir.
// - Vercel önizlemelerindeki araç çubuğu için Vercel'in belgelediği adresler yalnız önizlemede eklenir
//   (https://vercel.com/docs/vercel-toolbar/managing-toolbar).
// HSTS başlığını Vercel kendisi gönderir; burada yinelenmez.
export interface HeaderEnv {
  development: boolean;
  vercelPreview: boolean;
}

export function contentSecurityPolicy(env: HeaderEnv): string {
  const toolbar = env.vercelPreview;
  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": ["'self'", "'unsafe-inline'", ...(env.development ? ["'unsafe-eval'"] : []), ...(toolbar ? ["https://vercel.live"] : [])],
    "style-src": ["'self'", "'unsafe-inline'", ...(toolbar ? ["https://vercel.live"] : [])],
    "img-src": ["'self'", "data:", "blob:", ...(toolbar ? ["https://vercel.live", "https://vercel.com"] : [])],
    "font-src": ["'self'", "data:", ...(toolbar ? ["https://vercel.live", "https://assets.vercel.com"] : [])],
    "connect-src": ["'self'", ...(env.development ? ["ws:"] : []), ...(toolbar ? ["https://vercel.live", "wss://ws-us3.pusher.com"] : [])],
    "frame-src": toolbar ? ["https://vercel.live"] : ["'none'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
  };
  // `upgrade-insecure-requests` eklenmez: yerelde http ile açılan üretim derlemesini bozar; Vercel zaten HSTS ile https zorlar.
  return Object.entries(directives).map(([name, values]) => `${name} ${values.join(" ")}`).join("; ");
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
