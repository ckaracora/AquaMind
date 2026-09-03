"use client";

import { AlertTriangle } from "lucide-react";
import { useAquariums } from "@/providers/aquarium-provider";
import type { CollectionName } from "@/lib/aquarium-storage";

// Kullanıcı değişikliği bu cihaza yazılamadığında sessiz kalınmaz: değişikliğin
// geçici olduğu ve yedek alınabileceği açıkça söylenir (Issue #8).

const LABELS: Record<CollectionName, string> = {
  aquariums: "akvaryumlar",
  waterReadings: "su ölçümleri",
  maintenanceTasks: "bakım kayıtları",
  livestock: "canlılar",
  plants: "bitkiler",
  equipment: "ekipmanlar",
};

export function StorageWarning() {
  const { unsavedCollections, writeBlocked } = useAquariums();
  if (!writeBlocked && unsavedCollections.length === 0) return null;

  return (
    <div role="status" className="mx-5 mt-4 rounded-xl border border-amber-300/25 bg-amber-300/[.07] p-4 sm:mx-8 lg:mx-10">
      <div className="flex items-start gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-amber-300/10 text-amber-300">
          <AlertTriangle size={17} />
        </span>
        <div className="text-[11px] leading-relaxed text-amber-100/80">
          {writeBlocked && (
            <p className="font-bold text-amber-300">
              Tamamlanmamış bir silme işlemi sürüyor. Bu sırada yeni değişiklikler kaydedilemez ve denenen işlem uygulanmaz.
              Sayfayı yenileyin; işlem otomatik tamamlanmaya çalışılacak.
            </p>
          )}
          {unsavedCollections.length > 0 && (
            <>
              <p className="font-bold text-amber-300">
                Değişiklikleriniz bu cihazda saklanamadı ({unsavedCollections.map((name) => LABELS[name]).join(", ")}).
              </p>
              <p className="mt-1">
                Sayfayı yenilerseniz bu değişiklikler kaybolur. Depolama alanı dolu olabilir. Kaybetmemek için{" "}
                <a href="/settings" className="font-bold text-amber-300 underline">
                  Ayarlar → Verileri dışa aktar
                </a>{" "}
                ile yedek alın.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
