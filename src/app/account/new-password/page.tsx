"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ErrorText, Notice, PasswordField, linkClass } from "@/components/account-form";
import { AccountPage } from "@/components/account-page";
import { changePassword, passwordProblem, verifyRecovery } from "@/lib/auth/actions";
import { readEmailLink } from "@/lib/auth/email-link";
import type { AuthErrorKey } from "@/lib/auth/errors";
import { useAuth } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";

// Yeni parola (karar 0035). Sıfırlama e-postasındaki bağlantı bu sayfayı açar. Anahtar tek kullanımlıktır ve ancak kullanıcı formu
// gönderince doğrulanır: önce parolalar denetlenir, sonra anahtarla oturum açılır, sonra parola yazılır. Parola reddedilirse
// oturum açık kaldığı için yeniden denemede anahtar tekrar istenmez.
export default function NewPasswordPage() {
  const { t } = useI18n();
  const { client } = useAuth();
  const a = t.account;
  const errorId = useId();
  const [tokenHash, setTokenHash] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<AuthErrorKey | null>(null);
  // Anahtar okunur okunmaz adresten silinir: tarayıcı geçmişinde ve sonraki isteklerin başvuru başlığında kalmasın (karar 0035).
  // Geliştirmede React etkiyi iki kez çalıştırır; ikinci çalıştırma silinmiş adresi okuyup bağlantıyı geçersiz saymasın.
  const linkRead = useRef(false);
  useEffect(() => {
    if (linkRead.current) return;
    linkRead.current = true;
    const link = readEmailLink(window.location.search, ["recovery"]);
    if (window.location.search) window.history.replaceState(null, "", window.location.pathname);
    if (link) setTokenHash(link.tokenHash); else setError("linkInvalid");
  }, []);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!client || busy || !tokenHash) return;
    const problem = passwordProblem(password, repeat);
    if (problem) { setError(problem.error); return }
    setBusy(true); setError(null);
    if (!verified) {
      const verification = await verifyRecovery(client.auth, tokenHash);
      if (!verification.ok) { setBusy(false); setError(verification.error); return }
      setVerified(true);
    }
    const result = await changePassword(client.auth, password, repeat);
    setBusy(false);
    if (result.ok) { setDone(true); setPassword(""); setRepeat("") } else setError(result.error);
  }
  const linkBroken = error === "linkInvalid" && !verified;
  return <AccountPage title={a.newPasswordPage.title} allowSignedIn>
    {done ? <div className="space-y-4"><Notice>{a.newPasswordPage.done}</Notice><a href="/" className="flex min-h-11 w-full items-center justify-center rounded-xl bg-aqua px-4 py-2.5 text-sm font-extrabold text-ink disabled:opacity-60">{a.newPasswordPage.continue}</a></div>
      : linkBroken ? <div className="space-y-4"><ErrorText>{a.errors.linkInvalid}</ErrorText><p className="text-sm"><a href="/account/forgot-password" className={linkClass}>{a.forgotPage.title}</a></p></div>
      : <form onSubmit={submit} noValidate className="space-y-4">
        <PasswordField label={a.form.newPassword} autoComplete="new-password" value={password} onChange={setPassword} hint={a.form.passwordHint} describedBy={error ? errorId : undefined}/>
        <PasswordField label={a.form.repeatPassword} autoComplete="new-password" value={repeat} onChange={setRepeat} describedBy={error ? errorId : undefined}/>
        {error && <ErrorText id={errorId}>{a.errors[error]}</ErrorText>}
        <button type="submit" disabled={busy || !tokenHash} className="flex min-h-11 w-full items-center justify-center rounded-xl bg-aqua px-4 py-2.5 text-sm font-extrabold text-ink disabled:opacity-60">{busy ? a.newPasswordPage.submitting : a.newPasswordPage.submit}</button>
      </form>}
  </AccountPage>;
}
