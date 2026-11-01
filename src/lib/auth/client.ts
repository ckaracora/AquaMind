// Supabase istemcisi (karar 0035). Yalnız hesaplar açıksa ve ilk kez gerektiğinde ayrı bir parça olarak yüklenir; hesapsız
// kullanımda ve canlı sitede (ortam değişkeni yok) hiç indirilmez. Oturum bu tarayıcının yerel deposunda tutulur; yedek ve "tüm
// verileri sil" yalnız `aquamind:` anahtarlarına dokunduğu için oturumu etkilemez.
import type { SupabaseClient } from "@supabase/supabase-js";
import { authConfig } from "./config";

let pending: Promise<SupabaseClient> | null = null;

/** Oturumun yerel depodaki anahtarı (supabase-js'in varsayılanıyla aynı ad; açıkça verilir ki çıkışta silinebilsin). */
export const AUTH_STORAGE_KEY = authConfig ? `sb-${new URL(authConfig.url).hostname.split(".")[0]}-auth-token` : null;

type Backend = Pick<Storage, "getItem" | "setItem" | "removeItem" | "length" | "key">;

/**
 * Supabase istemcisine verilen oturum deposu (karar 0035). auth-js kendi başına bırakılırsa yerel depo açılışta yazılamıyorsa kendi
 * belleğine geçer; o bellek dışarıdan silinemez ve başarısız bir çıkıştan sonra oturum yenilenip geri gelebilirdi (Codex 3. tur).
 * - Yerel depo varsa her okuma ve yazma doğrudan ona gider; öbür sekmelerin yenilediği ya da kapattığı oturum hemen görülür.
 *   Yazma ve silme hatası gizlenmez, çağırana iletilir (girişte "yer kalmadı", çıkışta "oturum kapatılamadı"); yarısı bellekte bir
 *   oturum ya da yalnız bellekte duran bir "silindi" işareti tutulmaz (Codex 4. ve 5. tur: sekmeler arası uyuşmazlık, sayfa kapanınca
 *   kaybolan koruma).
 * - Yerel depo hiç yoksa ya da erişim engelliyse (ilk kullanımda bir kez bakılır) yalnız bellek kullanılır; o durumda öbür sekmelerle
 *   paylaşılan bir depo da yoktur.
 */
export function createAuthStorage(backend: () => Backend | null) {
  const memory = new Map<string, string>();
  let chosen: Backend | null | undefined;
  const local = (): Backend | null => {
    if (chosen === undefined) {
      try {
        const store = backend();
        store?.getItem(SESSION_PROBE);
        chosen = store ?? null;
      } catch { chosen = null }
    }
    return chosen;
  };
  const matches = (key: string, prefix: string) => key === prefix || key.startsWith(`${prefix}-`);
  return {
    getItem(key: string): string | null {
      const store = local();
      if (!store) return memory.get(key) ?? null;
      // Okunamazsa oturum yok sayılır; depodaki oturum silinmez, erişim dönünce yine okunur.
      try { return store.getItem(key) } catch { return null }
    },
    setItem(key: string, value: string): void {
      const store = local();
      if (store) store.setItem(key, value); else memory.set(key, value);
    },
    removeItem(key: string): void {
      const store = local();
      if (store) store.removeItem(key); else memory.delete(key);
    },
    /**
     * `prefix` ve `prefix-…` anahtarlarını siler (depo okunamasa da oturumun bilinen üç anahtarı denenir). Hepsi silindiyse `true`;
     * depoya erişilemediği için biri kaldıysa `false` (oturum bu cihazda kapanmamıştır).
     */
    clear(prefix: string): boolean {
      for (const key of [...memory.keys()]) if (matches(key, prefix)) memory.delete(key);
      const store = local();
      if (!store) return true;
      const keys = new Set([prefix, `${prefix}-code-verifier`, `${prefix}-user`]);
      try {
        for (let i = 0; i < store.length; i++) {
          const key = store.key(i);
          if (key && matches(key, prefix)) keys.add(key);
        }
      } catch { /* depo okunamadı; bilinen anahtarlar denenir */ }
      let cleared = true;
      for (const key of keys) {
        try { store.removeItem(key) } catch { cleared = false }
      }
      return cleared;
    },
  };
}

// Yerel deponun erişilebilir olduğunu anlamak için okunan anahtar (yazılmaz).
const SESSION_PROBE = "aquamind:auth-storage-probe";

export const authStorage = createAuthStorage(() => (typeof window === "undefined" ? null : window.localStorage));

/**
 * Bu cihazdaki oturumu doğrudan siler. Supabase'in çıkışı, süresi dolmuş oturumu sunucuya ulaşamadığı için yenileyemezse yerel
 * oturumu silmeden döner (auth-js 2.118.0, `_signOut` → `_useSession`); kullanıcı çıkış yapamadan kalmasın diye o durumda çağrılır.
 * Anahtarın ekleri (`-code-verifier`, `-user`) de silinir. İstemci oturumu her seferinde bu depodan okuduğu için silinen oturum
 * sonraki çağrılarda ve otomatik yenilemede de yoktur. Depoya erişilemediği için silinemediyse `false` döner.
 */
export function clearStoredSession(): boolean {
  return AUTH_STORAGE_KEY ? authStorage.clear(AUTH_STORAGE_KEY) : true;
}

export function loadAuthClient(): Promise<SupabaseClient> | null {
  const config = authConfig;
  if (!config) return null;
  pending ??= import("@supabase/supabase-js").then(({ createClient }) => createClient(config.url, config.publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: AUTH_STORAGE_KEY ?? undefined,
      storage: authStorage,
      // E-posta bağlantıları adreste oturum taşımaz; anahtar sayfadaki düğmeyle doğrulanır (karar 0035).
      detectSessionInUrl: false,
      flowType: "pkce",
    },
  }));
  // Yükleme başarısız olursa (ör. bağlantı koptu) sonraki çağrı yeniden dener.
  pending.catch(() => { pending = null });
  return pending;
}
