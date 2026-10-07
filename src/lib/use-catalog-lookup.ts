// Sayfaların yalnızca gereken katalog kayıtlarını yüklemesi için React kancası (docs/DECISIONS/0016-gereken-katalog-kayitlarinin-yuklenmesi.md).
// Kayıt listesi değişince (ör. başka akvaryum seçildi) yeniden yükler; bir listenin yüklemesi başka bir liste için asla kullanılmaz.
// Yükleme başarısız olursa `failed` döner ve `retry` aynı listeyi yeniden dener.
import { useEffect, useState } from "react";
import { loadCatalogSlice } from "@/lib/catalog-slice";
import type { CatalogLookup } from "@/lib/health-analysis-core";
import type { Equipment, Livestock } from "@/types/aquarium";

const requestKey = (animals: Livestock[], equipment: Equipment[]) => JSON.stringify([
  animals.map((item) => [item.catalogId ?? null, item.commonName, item.scientificName ?? null]),
  equipment.map((item) => [item.catalogId ?? null, item.brand ?? null, item.model ?? null]),
]);

export function useCatalogLookup(animals: Livestock[], equipment: Equipment[], enabled: boolean) {
  const key = requestKey(animals, equipment);
  const [result, setResult] = useState<{ key: string; lookup?: CatalogLookup; failed: boolean }>();
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    let active = true;
    // Aynı liste yeniden deneniyorsa eski hata yerine yeniden "hazırlanıyor" görünsün.
    setResult((previous) => (previous?.key === key ? undefined : previous));
    loadCatalogSlice(animals, equipment)
      .then((lookup) => { if (active) setResult({ key, lookup, failed: false }); })
      .catch(() => { if (active) setResult({ key, failed: true }); });
    return () => { active = false; };
    // Liste `key` ile izlenir; dizilerin kimliği her çizimde değişebileceği için bağımlılık olarak diziler kullanılmaz.
  }, [key, enabled, attempt]);
  const current = result?.key === key ? result : undefined;
  return { lookup: current?.lookup, failed: current?.failed ?? false, retry: () => setAttempt((value) => value + 1) };
}
