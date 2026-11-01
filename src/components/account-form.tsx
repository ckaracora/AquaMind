"use client";

// Hesap ekranlarının ortak parçaları (karar 0035): alanlar, parola göster/gizle, hata ve bilgi satırları. Düğmelerin sınıfları her
// düğmede açıkça yazılıdır: telefon kullanılabilirlik testi dokunma alanını kaynaktaki sınıftan okur (mobile-usability.test.ts).
// Hata satırı `role="alert"` ile ekran okuyucuya hemen duyurulur; alan, hatayı `aria-describedby` ile gösterir.
import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useI18n } from "@/providers/i18n-provider";

export const fieldClass = "mt-1.5 w-full rounded-xl border border-white/[.08] bg-[#09171e] px-3 py-3 text-sm outline-none focus:border-aqua/60";
// Bağlantılar cümle içinde dursa da telefonda en az 44 piksel yüksekliğinde dokunma alanı taşır.
export const linkClass = "inline-flex min-h-11 items-center font-bold text-aqua underline-offset-2 hover:underline";

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "email" | "text";
  autoComplete: string;
  placeholder?: string;
  describedBy?: string;
  maxLength?: number;
}

export function TextField({ label, value, onChange, type = "text", autoComplete, placeholder, describedBy, maxLength }: FieldProps) {
  const id = useId();
  return <div><label htmlFor={id} className="text-xs font-bold text-[#91a3aa]">{label}</label>
    <input id={id} type={type} inputMode={type === "email" ? "email" : undefined} autoComplete={autoComplete} autoCapitalize="none" spellCheck={false} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} aria-describedby={describedBy} maxLength={maxLength} className={fieldClass}/>
  </div>;
}

export function PasswordField({ label, value, onChange, autoComplete, hint, describedBy }: { label: string; value: string; onChange: (value: string) => void; autoComplete: "current-password" | "new-password"; hint?: string; describedBy?: string }) {
  const { t } = useI18n();
  const id = useId();
  const hintId = useId();
  const [visible, setVisible] = useState(false);
  const described = [hint ? hintId : null, describedBy].filter(Boolean).join(" ") || undefined;
  return <div><label htmlFor={id} className="text-xs font-bold text-[#91a3aa]">{label}</label>
    <div className="relative">
      <input id={id} type={visible ? "text" : "password"} autoComplete={autoComplete} value={value} onChange={e => onChange(e.target.value)} aria-describedby={described} className={`${fieldClass} pr-14`}/>
      <button type="button" onClick={() => setVisible(v => !v)} aria-pressed={visible} aria-label={visible ? t.account.form.hide : t.account.form.show} aria-controls={id} className="absolute bottom-0 right-0 grid size-12 place-items-center text-[#91a3aa] hover:text-white">{visible ? <EyeOff size={17} aria-hidden="true"/> : <Eye size={17} aria-hidden="true"/>}</button>
    </div>
    {hint && <p id={hintId} className="mt-1.5 text-[11px] text-[#71858d]">{hint}</p>}
  </div>;
}

export function ErrorText({ id, children }: { id?: string; children: React.ReactNode }) {
  return <p id={id} role="alert" className="rounded-xl border border-amber-300/25 bg-amber-300/[.07] px-3 py-2.5 text-xs font-bold leading-relaxed text-amber-200">{children}</p>;
}

export function Notice({ children }: { children: React.ReactNode }) {
  return <p role="status" className="rounded-xl bg-aqua/[.08] px-3 py-2.5 text-xs leading-relaxed text-[#9fe1d8]">{children}</p>;
}
