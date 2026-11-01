"use client";

import { useEffect, useRef, useState } from "react";
import { ErrorText, Notice, linkClass } from "@/components/account-form";
import { AccountPage } from "@/components/account-page";
import { confirmEmail } from "@/lib/auth/actions";
import { readEmailLink } from "@/lib/auth/email-link";
import type { AuthErrorKey } from "@/lib/auth/errors";
import { useAuth } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";

// E-posta onayı (karar 0035). Onay e-postasındaki bağlantı bu sayfayı açar; anahtar sayfa açılınca değil düğmeye dokununca
// doğrulanır. Bazı posta hizmetleri bağlantıları önceden açtığı için açılışta doğrulamak anahtarı kullanıcıdan önce tüketebilirdi.
export default function ConfirmPage() {
  const { t } = useI18n();
  const { client } = useAuth();
  const a = t.account;
  const [tokenHash, setTokenHash] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<AuthErrorKey | null>(null);
  // Anahtar okunur okunmaz adresten silinir: tarayıcı geçmişinde ve sonraki isteklerin başvuru başlığında kalmasın (karar 0035).
  // Geliştirmede React etkiyi iki kez çalıştırır; ikinci çalıştırma silinmiş adresi okuyup bağlantıyı geçersiz saymasın.
  const linkRead = useRef(false);
  useEffect(() => {
    if (linkRead.current) return;
    linkRead.current = true;
    const link = readEmailLink(window.location.search, ["email", "signup"]);
    if (window.location.search) window.history.replaceState(null, "", window.location.pathname);
    if (link) setTokenHash(link.tokenHash); else setError("linkInvalid");
  }, []);
  async function confirm() {
    if (!client || busy || !tokenHash) return;
    setBusy(true); setError(null);
    const result = await confirmEmail(client.auth, tokenHash);
    setBusy(false);
    if (result.ok) setDone(true); else setError(result.error);
  }
  return <AccountPage title={a.confirmPage.title} description={done || error ? undefined : a.confirmPage.body} allowSignedIn>
    <div className="space-y-4">
      {done ? <>
        <Notice>{a.confirmPage.done}</Notice>
        <a href="/" className="flex min-h-11 w-full items-center justify-center rounded-xl bg-aqua px-4 py-2.5 text-sm font-extrabold text-ink disabled:opacity-60">{a.confirmPage.continue}</a>
      </> : error ? <>
        <ErrorText>{a.errors[error]}</ErrorText>
        {error === "linkInvalid" && <p className="text-sm leading-relaxed text-[#91a3aa]">{a.confirmPage.invalidHelp} <a href="/account/sign-in" className={linkClass}>{a.signIn}</a></p>}
        {error !== "linkInvalid" && <button type="button" onClick={confirm} disabled={busy} className="flex min-h-11 w-full items-center justify-center rounded-xl bg-aqua px-4 py-2.5 text-sm font-extrabold text-ink disabled:opacity-60">{a.confirmPage.submit}</button>}
      </> : <button type="button" onClick={confirm} disabled={busy || !tokenHash} className="flex min-h-11 w-full items-center justify-center rounded-xl bg-aqua px-4 py-2.5 text-sm font-extrabold text-ink disabled:opacity-60">{busy ? a.confirmPage.submitting : a.confirmPage.submit}</button>}
    </div>
  </AccountPage>;
}
