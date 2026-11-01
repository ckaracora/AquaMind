"use client";

import { useId, useState } from "react";
import { ErrorText, Notice, TextField, linkClass } from "@/components/account-form";
import { AccountPage } from "@/components/account-page";
import { requestPasswordReset } from "@/lib/auth/actions";
import type { AuthErrorKey } from "@/lib/auth/errors";
import { useAuth } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";

// Parola sıfırlama isteği (karar 0035). Supabase, e-postayla bir hesap olup olmadığını söylemez; ekran da her durumda aynı iletiyi verir.
export default function ForgotPasswordPage() {
  const { t } = useI18n();
  const { client } = useAuth();
  const a = t.account;
  const errorId = useId();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<AuthErrorKey | null>(null);
  const [sent, setSent] = useState(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!client || busy) return;
    setBusy(true); setError(null); setSent(false);
    const result = await requestPasswordReset(client.auth, email, window.location.origin);
    setBusy(false);
    if (result.ok) setSent(true); else setError(result.error);
  }
  return <AccountPage title={a.forgotPage.title} description={a.forgotPage.description}>
    <form onSubmit={submit} noValidate className="space-y-4">
      <TextField label={a.form.email} type="email" autoComplete="email" value={email} onChange={setEmail} placeholder={a.form.emailPlaceholder} describedBy={error ? errorId : undefined}/>
      {error && <ErrorText id={errorId}>{a.errors[error]}</ErrorText>}
      {sent && <Notice>{a.forgotPage.sent}</Notice>}
      <button type="submit" disabled={busy} className="flex min-h-11 w-full items-center justify-center rounded-xl bg-aqua px-4 py-2.5 text-sm font-extrabold text-ink disabled:opacity-60">{busy ? a.forgotPage.submitting : a.forgotPage.submit}</button>
      <p className="text-sm"><a href="/account/sign-in" className={linkClass}>{a.forgotPage.back}</a></p>
    </form>
  </AccountPage>;
}
