// Profil (1A şeması, karar 0033): kullanıcı yalnız kendi `profiles` satırını okur ve yalnız takma ad, görünen ad ve dil sütunlarını
// değiştirebilir. Takma ad isteğe bağlıdır (ürün sahibinin 2026-11-01 kararı); boş bırakılırsa silinir. Benzersizlik büyük-küçük
// harfe duyarsızdır ve veritabanında denetlenir.
import type { SupabaseClient } from "@supabase/supabase-js";
import { authErrorKey, type AuthErrorKey } from "./errors";
import { NICKNAME_MAX_LENGTH } from "./actions";

export type ProfileApi = Pick<SupabaseClient, "from">;
export type NicknameResult = { ok: true; nickname: string | null } | { ok: false; error: AuthErrorKey };

// PostgREST istemcisi ağ hatasında istisna atmaz; durum kodu 0 olan bir hata döndürür.
const failure = (error: unknown, status: number): NicknameResult => ({ ok: false, error: status === 0 ? "network" : authErrorKey(error) });

export function normalizeNickname(raw: string): string | null {
  const nickname = raw.trim();
  return nickname ? nickname : null;
}

export async function loadNickname(db: ProfileApi, userId: string): Promise<NicknameResult> {
  try {
    const { data, error, status } = await db.from("profiles").select("nickname").eq("user_id", userId).maybeSingle();
    if (error) return failure(error, status);
    const nickname = (data as { nickname?: unknown } | null)?.nickname;
    return { ok: true, nickname: typeof nickname === "string" ? nickname : null };
  } catch (error) {
    return { ok: false, error: authErrorKey(error) };
  }
}

export async function saveNickname(db: ProfileApi, userId: string, raw: string): Promise<NicknameResult> {
  const nickname = normalizeNickname(raw);
  if (nickname && [...nickname].length > NICKNAME_MAX_LENGTH) return { ok: false, error: "nicknameLength" };
  try {
    const { error, status } = await db.from("profiles").update({ nickname }).eq("user_id", userId);
    return error ? failure(error, status) : { ok: true, nickname };
  } catch (error) {
    return { ok: false, error: authErrorKey(error) };
  }
}
