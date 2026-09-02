# 0004 — Uyumluluk puanı yalnızca deterministik motordan gelir

- Tarih: 2026-09-02
- Durum: Kabul edildi (Phase 0B)

## Bağlam

Uyumluluk, AquaMind'in kritik sistemidir. "AquaMind neden %73 hesapladı?" sorusu yanıtlanabilir, sonuç yeniden üretilebilir olmalı ve yapay zekâ puanı belirlememelidir. Mevcut motor `src/lib/health-analysis.ts` içinde kataloğa doğrudan bağlı, sürümsüz ve tek fonksiyondu.

## Karar

1. Motor `packages/compatibility-engine` içine birebir taşındı; kataloğu içe aktarmaz, bilgiye `KnowledgeResolver` arayüzüyle ulaşır. Uygulama tarafındaki uyarlayıcı (`src/lib/health-analysis.ts`) kataloğu bağlar ve `analyzeAquarium` imzasını korur.
2. `ENGINE_VERSION` ve `RULESET_VERSION` ayrı sabitler olarak dışa aktarılır; sonuç nesnesine alan eklenmez.
3. Motorun değişmezliği 604 vakalık altın fikstür ve mevcut 35 senaryo betiğiyle güvence altındadır. Puanı değiştiren her değişiklik ayrı onay, sürüm artışı ve bilinçli fikstür yenilemesi gerektirir.
4. Yapay zekâ ileride yalnızca motor sonucunu açıklar; puan üretmez.

## Gerekçe

Deterministik, testli ve versiyonlanabilir bir motor olmadan açıklanabilirlik ve güven mümkün değildir. Çözümleyici sınırı, motorun mobilde, sunucuda ve ileride veritabanından beslenen bilgiyle aynı şekilde çalışmasını sağlar.

## Sonuçlar

- Phase 1'de her hesaplama sonucu motor, kural seti ve bilgi sürümüyle birlikte saklanır.
- Kararlı bulgu kodları ve yerelleştirme, sonuç biçiminin sürümlenmesiyle (v2) ayrı onayla gelir.
- Katalog tipleri şimdilik `src/data/catalog.ts` içinde kalır; motor yalnızca okuduğu alanları bildirir ve uyum `tsc` ile denetlenir.
