// "Bunu mu demek istedin?" önerileri (2026-11-14 sprinti). Gündelik ad veri değil, arama önerisidir: canlı ekleme penceresinde yazılan ad
// katalogda hiç eşleşmiyorsa ve bir terimle aynıysa (harf, aksan, tire ve boşluk katlanmış) en çok üç düğme çıkar; tür kendiliğinden
// seçilmez, kullanıcı düğmeye basar. Kurallar (src/lib/species-search.ts `searchSuggestionProblems`, testi
// src/lib/__tests__/search-suggestions.test.ts): kimlikler katalogda olmalı; her kayıtta en az iki ayrı siteden kanıt (adres ve sayfadaki
// alıntı); terim hiçbir katalog türünün ya da çözülmemiş satış adının tam adıyla çakışmamalı. Liste boş başlar; veri ajanı kanıtla doldurur.

export interface SearchSuggestionEvidence {
  /** Adın geçtiği sayfa. */
  url: string;
  /** Sayfadaki alıntı (adın geçtiği cümle). */
  quote: string;
}

export interface SearchSuggestion {
  /** Kullanıcının yazdığı gündelik ad (ör. bir mağaza ya da forum adı). */
  term: string;
  /** Terimin gittiği katalog türleri (1–3). */
  speciesIds: string[];
  evidence: SearchSuggestionEvidence[];
  /** Eklendiği gün, YYYY-AA-GG. */
  addedAt: string;
}

export const searchSuggestions: SearchSuggestion[] = [];
