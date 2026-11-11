import type { Aquarium } from "@/types/aquarium";

/**
 * Sayfadaki akvaryum seçimi: seçilen kimlik listede varsa o akvaryum, yoksa listenin ilki; liste boşsa `undefined` (sayfa boş durumu
 * gösterir, pencere açılmaz). Seçim her çizimde güncel listeden türetilir, saklanan kimliğe güvenilmez: sağlayıcı ilk çizimde örnek
 * veriyle başlar, kullanıcının akvaryumları depodan sonra gelir; ilk çizimde saklanan kimlik bu yüzden listede olmayabilir (hata
 * 2026-11-11: canlılar sayfasında "Canlı ekle" penceresi çöküyordu). Ana sayfa aynı kuralı kullanır.
 * Canlılar, ekipman, bitki, su ve bakım sayfaları seçimi bu işlevle yapar (src/lib/__tests__/aquarium-selection-pages.test.ts).
 */
export function selectedAquarium(aquariums: readonly Aquarium[], selectedId: string | undefined): Aquarium | undefined {
  return aquariums.find((aquarium) => aquarium.id === selectedId) ?? aquariums[0];
}
