// Bitki kataloğunu yalnız gerektiğinde (bitki ekleme penceresi açılınca ya da listede bitki varken) ayrı bir parça olarak yükleyen React kancası.
// Sayfanın ilk yüklemesi büyümez (docs/DECISIONS/0024-bitki-secme.md, 0016'daki "gereken kayıtlar sonradan yüklenir" ilkesi).
// Yükleme başarısız olursa `failed` döner ve `retry` yeniden dener; uygulama kodunda kataloğu yükleyen tek yer burasıdır.
import { useEffect, useState } from "react";

export type PlantCatalogModule = typeof import("@/data/catalog-plants");

export function usePlantCatalog(enabled: boolean) {
  const [state, setState] = useState<{ catalog?: PlantCatalogModule; failed: boolean }>({ failed: false });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!enabled || state.catalog) return;
    let active = true;
    setState({ failed: false });
    import("@/data/catalog-plants")
      .then((catalog) => { if (active) setState({ catalog, failed: false }); })
      .catch(() => { if (active) setState({ failed: true }); });
    return () => { active = false; };
    // Yüklenen katalog bir daha yüklenmez; bağımlılıklarda yalnız açılış ve deneme sayısı var.
  }, [enabled, attempt]);
  return { catalog: state.catalog, failed: state.failed, retry: () => setAttempt((value) => value + 1) };
}
