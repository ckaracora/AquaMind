// Çevrilecek katalog metinleri (docs/DECISIONS/0021-dil-altyapisi.md, 4. paket). Çeviri aşamalıdır (ürün sahibi kararı 2026-10-30):
// önce canlılar — kullanıcıya gösterilen ad, bakım ve uyum uyarıları, kaynağın davranış koşulu; sonra ekipman, sonra bakım ürünleri.
// Uygulama sayfaları bu modülü kullanmaz; testler ve çeviri betikleri kullanır. Kataloglar parametre olarak verilir.
import { catalogTextKey } from "@aquamind/localization/catalog";

/** Canlılar aşamasında çevrilen alanlar. `behavior.condition` kaynağın koşul notudur; `evidence` araştırma notudur, gösterilmez. */
export const SPECIES_TEXT_FIELDS = [
  "species.commonName",
  "species.husbandryCaution",
  "species.communityCaution",
  "species.tankLengthDataNote",
  "behavior.condition",
] as const;
export type SpeciesTextField = (typeof SPECIES_TEXT_FIELDS)[number];

export interface CatalogTextEntry<Field extends string = string> {
  field: Field;
  /** Metnin geçtiği kaydın kimliği (davranışta tür kimliği). */
  id: string;
  text: string;
  key: string;
}

interface SpeciesTextSource {
  id: string;
  commonName: string;
  husbandryCaution?: string;
  communityCaution?: string;
  tankLengthDataNote?: string;
}

interface BehaviorTextSource {
  condition?: string;
}

const entry = <Field extends string>(field: Field, id: string, text: string): CatalogTextEntry<Field> => ({ field, id, text, key: catalogTextKey(text) });

/** Canlılar aşamasının bütün metinleri; boş alanlar atlanır. Aynı metin birden çok kayıtta geçebilir (çevirisi bir kez yapılır). */
export function speciesCatalogTexts(
  species: readonly SpeciesTextSource[],
  behavior: Readonly<Record<string, readonly BehaviorTextSource[]>>,
): CatalogTextEntry<SpeciesTextField>[] {
  const out: CatalogTextEntry<SpeciesTextField>[] = [];
  for (const profile of species) {
    out.push(entry("species.commonName", profile.id, profile.commonName));
    if (profile.husbandryCaution) out.push(entry("species.husbandryCaution", profile.id, profile.husbandryCaution));
    if (profile.communityCaution) out.push(entry("species.communityCaution", profile.id, profile.communityCaution));
    if (profile.tankLengthDataNote) out.push(entry("species.tankLengthDataNote", profile.id, profile.tankLengthDataNote));
  }
  for (const [id, records] of Object.entries(behavior)) {
    for (const record of records) if (record.condition) out.push(entry("behavior.condition", id, record.condition));
  }
  return out;
}
