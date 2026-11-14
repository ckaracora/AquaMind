// Ekipman ekleme penceresinin model araması (2026-11-14 sprinti). Marka seçilmeden de çalışır: arama seçili ekipman türündeki bütün
// markalarda arar, model seçilince marka kendiliğinden gelir. "Oase BioMaster" gibi markayla başlayan yazım da bulunur.
import { equipmentForBrandInCategory, equipmentForCategory, equipmentMatchesModelQuery, type EquipmentProfile } from "@/data/catalog-equipment";
import type { Equipment } from "@/types/aquarium";

/**
 * Markanın hobide yaygın başka yazımı → katalogdaki marka (2026-11-14 sprinti, E5). Veri değil, yalnız arama hoşgörüsüdür: kayıtların
 * markası değişmez. "Dolphin" Dophin'in, "Jebo" Lifetech ürünlerinin (katalog Jebo ürünlerini Lifetech markasında tutar), "Venus Aqua"
 * Venusaqua'nın satış yazımıdır.
 */
export const BRAND_SEARCH_ALIASES: Readonly<Record<string, string>> = {
  dolphin: "Dophin",
  jebo: "Lifetech",
  "venus aqua": "Venusaqua",
};

/** Aranan metnin başındaki marka (katalogdaki ad ya da eş yazımı) bu kaydın markasıysa, markadan sonraki kısım; değilse undefined. */
function afterBrand(item: EquipmentProfile, query: string): string | undefined {
  const typed = query.trim().toLocaleLowerCase("tr-TR").replace(/\s+/g, " ");
  const names = [item.brand.toLocaleLowerCase("tr-TR"), ...Object.keys(BRAND_SEARCH_ALIASES).filter((alias) => BRAND_SEARCH_ALIASES[alias] === item.brand)];
  for (const name of names) {
    if (typed === name && name !== names[0]) return "";
    if (typed.startsWith(`${name} `)) return typed.slice(name.length + 1);
  }
  return undefined;
}

export function equipmentModelMatches(item: EquipmentProfile, query: string): boolean {
  if (equipmentMatchesModelQuery(item, query)) return true;
  const rest = afterBrand(item, query);
  return rest !== undefined && equipmentMatchesModelQuery(item, rest);
}

/** Listede görünen modeller: marka seçiliyse o markanın aramaya uyanları; marka yoksa yalnız arama yazılınca bütün markalarda arananlar. */
export function visibleEquipmentModels(category: Equipment["category"], brand: string, query: string): EquipmentProfile[] {
  if (brand) return equipmentForBrandInCategory(category, brand).filter((item) => equipmentModelMatches(item, query));
  if (!query.trim()) return [];
  return equipmentForCategory(category).filter((item) => equipmentModelMatches(item, query));
}
