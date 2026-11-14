// Ekipman ekleme penceresinin model araması (2026-11-14 sprinti). Marka seçilmeden de çalışır: arama seçili ekipman türündeki bütün
// markalarda arar, model seçilince marka kendiliğinden gelir. "Oase BioMaster" gibi markayla başlayan yazım da bulunur.
import { equipmentForBrandInCategory, equipmentForCategory, equipmentMatchesModelQuery, type EquipmentProfile } from "@/data/catalog-equipment";
import type { Equipment } from "@/types/aquarium";

export function equipmentModelMatches(item: EquipmentProfile, query: string): boolean {
  if (equipmentMatchesModelQuery(item, query)) return true;
  const typed = query.trim().toLocaleLowerCase("tr-TR");
  const prefix = `${item.brand.toLocaleLowerCase("tr-TR")} `;
  return typed.startsWith(prefix) && equipmentMatchesModelQuery(item, query.trim().slice(prefix.length));
}

/** Listede görünen modeller: marka seçiliyse o markanın aramaya uyanları; marka yoksa yalnız arama yazılınca bütün markalarda arananlar. */
export function visibleEquipmentModels(category: Equipment["category"], brand: string, query: string): EquipmentProfile[] {
  if (brand) return equipmentForBrandInCategory(category, brand).filter((item) => equipmentModelMatches(item, query));
  if (!query.trim()) return [];
  return equipmentForCategory(category).filter((item) => equipmentModelMatches(item, query));
}
