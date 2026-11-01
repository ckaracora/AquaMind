"use client";

// Oturum durumu (karar 0035). Hesaplar kapalıysa (ortam değişkeni yok) Supabase hiç yüklenmez ve durum "disabled" kalır.
// Açıksa istemci sayfa çizildikten sonra ayrı parça olarak yüklenir; oturum bu tarayıcının yerel deposundadır
// (`sb-<proje kimliği>-auth-token`) ve Supabase süresi dolmadan kendisi yeniler.
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { loadAuthClient } from "@/lib/auth/client";
import { authConfig } from "@/lib/auth/config";

export type AuthUser = { id: string; email: string | null };
export type AuthState =
  | { status: "disabled" }
  | { status: "loading" }
  | { status: "unavailable" }
  | { status: "signed-out" }
  | { status: "signed-in"; user: AuthUser };

interface AuthContextValue {
  state: AuthState;
  client: SupabaseClient | null;
  /** Yerel oturum Supabase'in olayı olmadan silindiğinde (çıkış hata verdi) durumu "signed-out" yapar; sayfa yenilenmez. */
  markSignedOut: () => void;
}

const AuthContext = createContext<AuthContextValue>({ state: { status: "disabled" }, client: null, markSignedOut: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(authConfig ? { status: "loading" } : { status: "disabled" });
  const [client, setClient] = useState<SupabaseClient | null>(null);
  useEffect(() => {
    const pending = loadAuthClient();
    if (!pending) return;
    let active = true;
    let unsubscribe = () => {};
    pending.then(supabase => {
      if (!active) return;
      setClient(supabase);
      // İlk olay (INITIAL_SESSION) yerel depodaki oturumu bildirir; giriş, çıkış ve yenileme sonraki olaylardır.
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!active) return;
        setState(session ? { status: "signed-in", user: { id: session.user.id, email: session.user.email ?? null } } : { status: "signed-out" });
      });
      unsubscribe = () => data.subscription.unsubscribe();
    }).catch(() => { if (active) setState({ status: "unavailable" }) });
    return () => { active = false; unsubscribe() };
  }, []);
  const value = useMemo(() => ({ state, client, markSignedOut: () => setState(current => current.status === "signed-in" ? { status: "signed-out" } : current) }), [state, client]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue { return useContext(AuthContext) }
