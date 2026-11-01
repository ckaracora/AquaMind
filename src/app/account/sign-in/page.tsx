"use client";

import { useId, useState } from "react";
import { ErrorText, Notice, PasswordField, TextField, linkClass } from "@/components/account-form";
import { AccountPage } from "@/components/account-page";
import { resendConfirmation, signIn } from "@/lib/auth/actions";
import type { AuthErrorKey } from "@/lib/auth/errors";
import { useAuth } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";

// Giriş (karar 0035, ekran 1). Başarılı girişten sonra ana sayfaya dönülür. E-postası onaylanmamış hesapta onay e-postası yeniden
// gönderilebilir.
export default function SignInPage() {
  const { t } = useI18n();
  const { client } = useAuth();
  const a = t.account;
  const errorId = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<AuthErrorKey | null>(null);
  const [resent, setResent] = useState(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!client || busy) return;
    setBusy(true); setError(null); setResent(false);
    const result = await signIn(client.auth, email, password);
    setBusy(false);
    if (result.ok) { window.location.assign("/"); return }
    setError(result.error);
  }
  async function resend() {
    if (!client || busy) return;
    setBusy(true);
    const result = await resendConfirmation(client.auth, email, window.location.origin);
    setBusy(false);
    if (result.ok) { setResent(true); setError(null) } else setError(result.error);
  }
  return <AccountPage title={a.signInPage.title} description={a.signInPage.description}>
    <form onSubmit={submit} noValidate className="space-y-4">
      <TextField label={a.form.email} type="email" autoComplete="email" value={email} onChange={setEmail} placeholder={a.form.emailPlaceholder} describedBy={error ? errorId : undefined}/>
      <PasswordField label={a.form.password} autoComplete="current-password" value={password} onChange={setPassword} describedBy={error ? errorId : undefined}/>
      {error && <ErrorText id={errorId}>{a.errors[error]}</ErrorText>}
      {error === "emailNotConfirmed" && <button type="button" onClick={resend} disabled={busy} className="flex min-h-11 w-full items-center justify-center rounded-xl border border-white/[.12] px-4 py-2.5 text-sm font-bold text-[#dbe5e8] disabled:opacity-60">{a.signInPage.resend}</button>}
      {resent && <Notice>{a.checkEmail.resent}</Notice>}
      <button type="submit" disabled={busy} className="flex min-h-11 w-full items-center justify-center rounded-xl bg-aqua px-4 py-2.5 text-sm font-extrabold text-ink disabled:opacity-60">{busy ? a.signInPage.submitting : a.signInPage.submit}</button>
      <div className="flex flex-wrap justify-between gap-3 text-sm"><a href="/account/forgot-password" className={linkClass}>{a.signInPage.forgot}</a><a href="/account/sign-up" className={linkClass}>{a.signInPage.noAccount}</a></div>
    </form>
    <p className="mt-6 rounded-xl bg-aqua/[.08] px-3 py-2.5 text-xs leading-relaxed text-[#9fe1d8]">{a.signInPage.guestNote}</p>
  </AccountPage>;
}
