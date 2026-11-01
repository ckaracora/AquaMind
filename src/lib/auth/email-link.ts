// E-postadaki bağlantının adres parametreleri (karar 0035): Supabase şablonu `token_hash` ve `type` ekler. Tür beklenenlerden biri
// değilse ya da anahtar yoksa bağlantı geçersiz sayılır. Anahtar yalnız harf, rakam, tire ve alt çizgi içerir.
const TOKEN_HASH = /^[A-Za-z0-9_-]{8,200}$/;

export function readEmailLink(search: string, types: readonly string[]): { tokenHash: string; type: string } | null {
  const params = new URLSearchParams(search);
  const tokenHash = params.get("token_hash") ?? "";
  const type = params.get("type") ?? "";
  if (!TOKEN_HASH.test(tokenHash) || !types.includes(type)) return null;
  return { tokenHash, type };
}
