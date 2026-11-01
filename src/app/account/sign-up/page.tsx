"use client";

import { useId, useState } from "react";
import { ErrorText, Notice, PasswordField, TextField, linkClass } from "@/components/account-form";
import { AccountPage } from "@/components/account-page";
import { normalizeEmail, signUp } from "@/lib/auth/actions";
import type { AuthErrorKey } from "@/lib/auth/errors";
import { useAuth } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";

// Hesap oluşturma (karar 0035, ekran 2 ve 3). E-posta onayı zorunludur (ürün sahibinin 2026-11-01 kararı): kayıttan sonra
// "E-postanı kontrol et" gösterilir. Bu e-postayla zaten bir hesap varsa ya da e-posta sınırı dolmuşsa ekran aynı kalır. "Yeniden
// gönder" kaydı aynı e-posta ve parolayla yeniden dener (parola yalnız bu ekranın belleğinde, ekrandan çıkınca silinir); böylece e-posta
// sınırı yüzünden hiç oluşmamış hesap da sınır kalkınca oluşur.
export default function SignUpPage() {
  const { t } = useI18n();
  const { client } = useAuth();
  const a = t.account;
  const errorId = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<AuthErrorKey | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [resent, setResent] = useState(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!client || busy) return;
    setBusy(true); setError(null);
    const result = await signUp(client.auth, email, password, window.location.origin);
    setBusy(false);
    if (result.ok) setSentTo(normalizeEmail(email)); else setError(result.error);
  }
  async function resend() {
    if (!client || busy || !sentTo) return;
    setBusy(true); setError(null); setResent(false);
    const result = await signUp(client.auth, sentTo, password, window.location.origin);
    setBusy(false);
    if (result.ok) setResent(true); else setError(result.error);
  }
  if (sentTo) return <AccountPage title={a.checkEmail.title}>
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-[#c6d3d7]">{a.checkEmail.body(sentTo)}</p>
      {error && <ErrorText>{a.errors[error]}</ErrorText>}
      {resent && <Notice>{a.checkEmail.resent}</Notice>}
      <button type="button" onClick={resend} disabled={busy} className="flex min-h-11 w-full items-center justify-center rounded-xl border border-white/[.12] px-4 py-2.5 text-sm font-bold text-[#dbe5e8] disabled:opacity-60">{a.checkEmail.resend}</button>
      <p className="text-xs text-[#91a3aa]">{a.checkEmail.spam}</p>
      <p className="text-xs leading-relaxed text-[#91a3aa]">{a.checkEmail.existingNote} <a href="/account/sign-in" className="inline-flex min-h-11 items-center font-bold text-aqua underline-offset-2 hover:underline">{a.signIn}</a></p>
      <p className="text-sm text-[#91a3aa]">{a.checkEmail.wrongAddress} <button type="button" onClick={() => { setSentTo(null); setPassword(""); setResent(false); setError(null) }} className="min-h-11 min-w-11 font-bold text-aqua underline-offset-2 hover:underline">{a.checkEmail.back}</button></p>
    </div>
  </AccountPage>;
  return <AccountPage title={a.signUpPage.title} description={a.signUpPage.description}>
    <form onSubmit={submit} noValidate className="space-y-4">
      <TextField label={a.form.email} type="email" autoComplete="email" value={email} onChange={setEmail} placeholder={a.form.emailPlaceholder} describedBy={error ? errorId : undefined}/>
      <PasswordField label={a.form.password} autoComplete="new-password" value={password} onChange={setPassword} hint={a.form.passwordHint} describedBy={error ? errorId : undefined}/>
      {error && <ErrorText id={errorId}>{a.errors[error]}</ErrorText>}
      <button type="submit" disabled={busy} className="flex min-h-11 w-full items-center justify-center rounded-xl bg-aqua px-4 py-2.5 text-sm font-extrabold text-ink disabled:opacity-60">{busy ? a.signUpPage.submitting : a.signUpPage.submit}</button>
      <p className="text-sm text-[#91a3aa]">{a.signUpPage.haveAccount} <a href="/account/sign-in" className={linkClass}>{a.signIn}</a></p>
    </form>
  </AccountPage>;
}
