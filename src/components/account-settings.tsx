"use client";

// Ayarlar › Hesap (karar 0035, ekran 5). Hesaplar açıksa bugünkü "Profil" bölümünün yerine gelir. Girişsizken giriş ve hesap
// oluşturma düğmeleri; girişliyken e-posta, isteğe bağlı takma ad, parola değiştirme ve çıkış. Bu cihazdaki verileri hesaba taşıma
// satırı, bulut verisi geldiğinde (1C-4) eklenecek.
import { useEffect, useId, useState } from "react";
import { UserRound } from "lucide-react";
import { ErrorText, Notice, PasswordField, TextField } from "@/components/account-form";
import { changePassword, NICKNAME_MAX_LENGTH, signOut } from "@/lib/auth/actions";
import { clearStoredSession } from "@/lib/auth/client";
import type { AuthErrorKey } from "@/lib/auth/errors";
import { loadNickname, saveNickname } from "@/lib/auth/profile";
import { useAuth, type AuthUser } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";


export function AccountSettings() {
  const { t } = useI18n();
  const { state } = useAuth();
  const s = t.account.settings;
  return <section id="account" className="surface scroll-mt-6 p-5 sm:p-6">
    <div className="mb-5 flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-aqua/10 text-aqua"><UserRound size={17}/></span><div><h2 className="text-sm font-extrabold">{s.title}</h2><p className="mt-1 text-[11px] text-[#647981] sm:text-[9px]">{state.status === "signed-in" ? s.description : s.guestDescription}</p></div></div>
    {state.status === "signed-in" ? <SignedIn user={state.user}/>
      : state.status === "signed-out" ? <div className="grid gap-3 sm:grid-cols-2"><a href="/account/sign-in" className="flex min-h-11 w-full items-center justify-center rounded-xl bg-aqua px-4 py-2.5 text-sm font-extrabold text-ink disabled:opacity-60">{t.account.signIn}</a><a href="/account/sign-up" className="flex min-h-11 w-full items-center justify-center rounded-xl border border-white/[.12] px-4 py-2.5 text-sm font-bold text-[#dbe5e8] disabled:opacity-60">{t.account.signUp}</a></div>
      : state.status === "unavailable" ? <ErrorText>{t.account.errors.network}</ErrorText>
      : <p role="status" className="text-xs text-[#91a3aa]">{t.account.loading}</p>}
  </section>;
}

function SignedIn({ user }: { user: AuthUser }) {
  const { t } = useI18n();
  const { client, markSignedOut } = useAuth();
  const a = t.account;
  const s = a.settings;
  const [nickname, setNickname] = useState<string | null>(null);
  // Takma ad okunamadıysa düzenleme düğmesi gösterilmez: mevcut ad bilinmeden üzerine yazılmasın.
  const [nicknameLoaded, setNicknameLoaded] = useState(false);
  const [editing, setEditing] = useState<"nickname" | "password" | null>(null);
  const [draft, setDraft] = useState("");
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<AuthErrorKey | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const errorId = useId();
  useEffect(() => {
    if (!client) return;
    let active = true;
    loadNickname(client, user.id).then(result => {
      if (!active) return;
      if (result.ok) { setNickname(result.nickname); setNicknameLoaded(true) } else setError(result.error);
    });
    return () => { active = false };
  }, [client, user.id]);
  function open(kind: "nickname" | "password") { setEditing(kind); setError(null); setSaved(null); setDraft(nickname ?? ""); setPassword(""); setRepeat("") }
  function cancel() { setEditing(null); setError(null) }
  async function submitNickname(event: React.FormEvent) {
    event.preventDefault();
    if (!client || busy) return;
    setBusy(true); setError(null);
    const result = await saveNickname(client, user.id, draft);
    setBusy(false);
    if (result.ok) { setNickname(result.nickname); setEditing(null); setSaved(s.nicknameSaved) } else setError(result.error);
  }
  async function submitPassword(event: React.FormEvent) {
    event.preventDefault();
    if (!client || busy) return;
    setBusy(true); setError(null);
    const result = await changePassword(client.auth, password, repeat);
    setBusy(false);
    if (result.ok) { setEditing(null); setPassword(""); setRepeat(""); setSaved(s.passwordSaved) } else setError(result.error);
  }
  async function leave() {
    if (!client || busy) return;
    setBusy(true); setError(null); setSaved(null);
    // Supabase hata verse de yerel oturum silinir (signOut, clearStoredSession). Sayfa yenilenmez: depolama doluyken yalnız bellekte
    // duran akvaryum değişiklikleri kaybolmasın. Oturum bu cihazda kapanamadıysa çıkış yapılmış gösterilmez.
    const result = await signOut(client.auth, clearStoredSession);
    setBusy(false);
    if (result.ok) markSignedOut(); else setError(result.error);
  }
  const row = "flex min-h-14 flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-white/[.06] py-2 text-sm last:border-b-0";
  return <div className="space-y-4">
    <div className="rounded-xl border border-white/[.07] px-4">
      <div className={row}><span className="text-xs font-bold text-[#91a3aa]">{s.email}</span><span className="min-w-0 break-all">{user.email}</span></div>
      <div className={row}><span className="text-xs font-bold text-[#91a3aa]">{s.nickname}</span><span className="flex min-w-0 items-center gap-2">{!nicknameLoaded && <span className="text-[#71858d]">{error ? "—" : "…"}</span>}{nicknameLoaded && nickname && <span className="min-w-0 break-all">{nickname}</span>}{nicknameLoaded && editing !== "nickname" && <button type="button" onClick={() => open("nickname")} className="min-h-11 min-w-11 rounded-xl px-3 text-xs font-bold text-aqua hover:bg-aqua/10">{nickname ? s.nicknameEdit : s.nicknameAdd}</button>}</span></div>
      {editing === "nickname" && <form onSubmit={submitNickname} noValidate className="space-y-3 border-b border-white/[.06] py-4 last:border-b-0">
        <TextField label={s.nickname} autoComplete="nickname" value={draft} onChange={setDraft} maxLength={NICKNAME_MAX_LENGTH} describedBy={error ? errorId : undefined}/>
        <p className="text-[11px] text-[#71858d]">{s.nicknameHelp}</p>
        {error && <ErrorText id={errorId}>{a.errors[error]}</ErrorText>}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" onClick={cancel} className="flex min-h-11 w-full items-center justify-center rounded-xl border border-white/[.12] px-4 py-2.5 text-sm font-bold text-[#dbe5e8] disabled:opacity-60 sm:w-auto">{s.cancel}</button><button type="submit" disabled={busy} className="flex min-h-11 w-full items-center justify-center rounded-xl bg-aqua px-4 py-2.5 text-sm font-extrabold text-ink disabled:opacity-60 sm:w-auto">{s.nicknameSave}</button></div>
      </form>}
      <div className={row}><span className="text-xs font-bold text-[#91a3aa]">{s.password}</span>{editing !== "password" && <button type="button" onClick={() => open("password")} className="min-h-11 min-w-11 rounded-xl px-3 text-xs font-bold text-aqua hover:bg-aqua/10">{s.passwordChange}</button>}</div>
      {editing === "password" && <form onSubmit={submitPassword} noValidate className="space-y-3 py-4">
        <PasswordField label={a.form.newPassword} autoComplete="new-password" value={password} onChange={setPassword} hint={a.form.passwordHint} describedBy={error ? errorId : undefined}/>
        <PasswordField label={a.form.repeatPassword} autoComplete="new-password" value={repeat} onChange={setRepeat} describedBy={error ? errorId : undefined}/>
        {error && <ErrorText id={errorId}>{a.errors[error]}</ErrorText>}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" onClick={cancel} className="flex min-h-11 w-full items-center justify-center rounded-xl border border-white/[.12] px-4 py-2.5 text-sm font-bold text-[#dbe5e8] disabled:opacity-60 sm:w-auto">{s.cancel}</button><button type="submit" disabled={busy} className="flex min-h-11 w-full items-center justify-center rounded-xl bg-aqua px-4 py-2.5 text-sm font-extrabold text-ink disabled:opacity-60 sm:w-auto">{s.passwordSave}</button></div>
      </form>}
    </div>
    {saved && <Notice>{saved}</Notice>}
    {error && !editing && <ErrorText>{a.errors[error]}</ErrorText>}
    <div className="space-y-2"><button type="button" onClick={leave} disabled={busy} className="flex min-h-11 w-full items-center justify-center rounded-xl border border-white/[.12] px-4 py-2.5 text-sm font-bold text-[#dbe5e8] disabled:opacity-60 sm:w-auto">{s.signOut}</button><p className="text-[11px] leading-relaxed text-[#71858d]">{s.signOutNote}</p></div>
  </div>;
}
