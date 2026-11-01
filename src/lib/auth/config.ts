// Hesaplar (karar 0035): Supabase Auth yalnız iki ortam değişkeni de geçerliyse açılır. Değişken yoksa (bugün canlı site) hesaplar
// kapalıdır: giriş bağlantıları görünmez, Supabase istemcisi yüklenmez, içerik politikası değişmez. Önizlemede hazırlık projesinin
// değerleri, üretimde üretim projesinin değerleri kullanılır; değerleri ürün sahibi Vercel'e kendisi girer (docs/SECURITY.md).
export interface AuthConfig {
  /** Supabase proje adresi, yalnız köken (`https://<proje kimliği>.supabase.co`). */
  url: string;
  /** Yayınlanabilir anahtar (`sb_publishable_…`); tarayıcıya gitmesi için tasarlanmıştır, yetkiyi RLS verir. */
  publishableKey: string;
}

// Supabase proje kimliği 20 küçük harf ve rakamdır (ör. panel adresindeki `/dashboard/project/<kimlik>`).
const SUPABASE_HOST = /^[a-z0-9]{20}\.supabase\.co$/;

export function readAuthConfig(url: string | undefined, publishableKey: string | undefined): AuthConfig | null {
  const rawUrl = url?.trim();
  const key = publishableKey?.trim();
  if (!rawUrl || !key) return null;
  let parsed: URL;
  try { parsed = new URL(rawUrl) } catch { return null }
  if (parsed.protocol !== "https:" || !SUPABASE_HOST.test(parsed.hostname) || parsed.port || parsed.username || parsed.password) return null;
  if (parsed.pathname !== "/" || parsed.search || parsed.hash) return null;
  // Gizli anahtar asla tarayıcıya gitmemeli; derleme de bu durumda durur (next.config.ts, secret-guard.ts).
  if (!key.startsWith("sb_publishable_")) return null;
  return { url: parsed.origin, publishableKey: key };
}

// Next, `process.env.NEXT_PUBLIC_…` ifadelerini derlemede değeriyle değiştirir; bu yüzden adlar açıkça yazılır.
export const authConfig = readAuthConfig(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
