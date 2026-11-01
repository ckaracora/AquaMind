"use client";

// Hesap sayfalarının kabuğu (giriş, hesap oluşturma, e-posta onayı, parola sıfırlama; karar 0035): kenar çubuğu olmadan ortada tek kart.
// Hesaplar kapalıysa (ortam değişkeni yok, bugün canlı site) sayfa yalnız "henüz açık değil" der; Supabase çağrılmaz.
import { ArrowLeft, Waves } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";

export function AccountPage({ title, description, children, allowSignedIn = false }: { title: string; description?: string; children: React.ReactNode; allowSignedIn?: boolean }) {
  const { t } = useI18n();
  const { state } = useAuth();
  const a = t.account;
  let body: React.ReactNode = children;
  if (state.status === "disabled") body = <Message title={a.unavailable.title} text={a.unavailable.body} action={<a href="/" className="flex min-h-11 w-full items-center justify-center rounded-xl bg-aqua px-4 py-2.5 text-sm font-extrabold text-ink disabled:opacity-60">{a.unavailable.back}</a>}/>;
  else if (state.status === "unavailable") body = <Message title={title} text={a.errors.network} action={<a href="/" className="flex min-h-11 w-full items-center justify-center rounded-xl bg-aqua px-4 py-2.5 text-sm font-extrabold text-ink disabled:opacity-60">{a.unavailable.back}</a>}/>;
  else if (state.status === "signed-in" && !allowSignedIn) body = <Message title={a.alreadySignedIn} text={state.user.email ?? ""} action={<a href="/settings#account" className="flex min-h-11 w-full items-center justify-center rounded-xl bg-aqua px-4 py-2.5 text-sm font-extrabold text-ink disabled:opacity-60">{a.openAccount}</a>}/>;
  const showHeading = state.status !== "disabled" && state.status !== "unavailable" && !(state.status === "signed-in" && !allowSignedIn);
  return <div className="flex min-h-screen flex-col items-center px-4 py-8 sm:justify-center">
    <main className="w-full max-w-[420px]">
      <a href="/" className="mb-6 inline-flex min-h-11 items-center gap-2 text-xs font-bold text-[#91a3aa] hover:text-white"><ArrowLeft size={15} aria-hidden="true"/>{a.unavailable.back}</a>
      <div className="surface p-6 sm:p-7">
        <div className="mb-6 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-aqua text-ink"><Waves size={22} aria-hidden="true"/></span><span className="text-lg font-extrabold tracking-tight">{t.app.name}</span></div>
        {showHeading && <div className="mb-5"><h1 className="text-xl font-extrabold">{title}</h1>{description && <p className="mt-1.5 text-sm text-[#91a3aa]">{description}</p>}</div>}
        {state.status === "loading" ? <p role="status" className="text-sm text-[#91a3aa]">{a.loading}</p> : body}
      </div>
    </main>
  </div>;
}

function Message({ title, text, action }: { title: string; text: string; action: React.ReactNode }) {
  return <div className="space-y-4"><h1 className="text-xl font-extrabold">{title}</h1>{text && <p className="text-sm leading-relaxed text-[#91a3aa]">{text}</p>}{action}</div>;
}
