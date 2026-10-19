"use client";

import { AlertTriangle } from "lucide-react";
import { useAquariums } from "@/providers/aquarium-provider";
import { useI18n } from "@/providers/i18n-provider";

// Kullanıcı değişikliği bu cihaza yazılamadığında sessiz kalınmaz: değişikliğin
// geçici olduğu ve yedek alınabileceği açıkça söylenir (Issue #8). Metinler dil dosyasında (storageWarning).

export function StorageWarning() {
  const { unsavedCollections, writeBlocked } = useAquariums();
  const { t } = useI18n();
  if (!writeBlocked && unsavedCollections.length === 0) return null;

  return (
    <div role="status" className="mx-5 mt-4 rounded-xl border border-amber-300/25 bg-amber-300/[.07] p-4 sm:mx-8 lg:mx-10">
      <div className="flex items-start gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-amber-300/10 text-amber-300">
          <AlertTriangle size={17} />
        </span>
        <div className="text-[11px] leading-relaxed text-amber-100/80">
          {writeBlocked && (
            <p className="font-bold text-amber-300">{t.storageWarning.deletePending}</p>
          )}
          {unsavedCollections.length > 0 && (
            <>
              <p className="font-bold text-amber-300">
                {t.storageWarning.unsaved(unsavedCollections.map((name) => t.storageWarning.collections[name]).join(", "))}
              </p>
              <p className="mt-1">
                {t.storageWarning.unsavedHelpBefore}{" "}
                <a href="/settings" className="-my-3.5 inline-block py-3.5 font-bold text-amber-300 underline">
                  {t.storageWarning.unsavedHelpLink}
                </a>{" "}
                {t.storageWarning.unsavedHelpAfter}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
