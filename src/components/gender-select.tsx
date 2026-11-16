"use client";

// Canlı kaydının cinsiyet seçimi (motor 1.21.0, docs/DECISIONS/0046-cinsiyet-toplam-alan-ve-av-hukmu.md). İsteğe bağlıdır, varsayılan "Bilinmiyor".
// Seçenekler kaydın bütün bireylerini anlatır ("Hepsi erkek", "Hepsi dişi", "Karışık"); altındaki kısa not neden sorulduğunu söyler. Canlı ekleme
// penceresi ve canlı düzenleme penceresi aynı bileşeni kullanır.
import { useId } from "react";
import type { Livestock } from "@/types/aquarium";
import { useI18n } from "@/providers/i18n-provider";

export type LivestockGender = NonNullable<Livestock["gender"]>;
export const LIVESTOCK_GENDERS: readonly LivestockGender[] = ["unknown", "mixed", "male", "female"];

export function GenderSelect({ field, value, defaultValue, onChange }: { field: string; value?: LivestockGender; defaultValue?: LivestockGender; onChange?: (gender: LivestockGender) => void }) {
  const { t } = useI18n();
  const helpId = useId();
  return <div className="text-xs font-bold text-[#91a3aa]">
    <label>{t.livestock.form.gender}<select name="gender" aria-describedby={helpId} {...(value !== undefined ? { value } : { defaultValue: defaultValue ?? "unknown" })} onChange={onChange ? (e) => onChange(e.target.value as LivestockGender) : undefined} className={field}>{LIVESTOCK_GENDERS.map((gender) => <option key={gender} value={gender}>{t.livestock.form.genders[gender]}</option>)}</select></label>
    <p id={helpId} className="mt-1.5 text-[11px] font-normal leading-relaxed text-[#71858d] sm:text-[10px]">{t.livestock.form.genderHelp}</p>
  </div>;
}
