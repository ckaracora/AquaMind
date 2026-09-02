# 0001 — Web uygulaması depo kökünde kalır

- Tarih: 2026-09-02
- Durum: Kabul edildi (Phase 0B)

## Bağlam

Uzun vadeli yön bir TypeScript monorepo'dur (`apps/web`, `apps/mobile`, `apps/admin`, `packages/*`). Bugün depoda yalnızca kökte çalışan bir Next.js 15 uygulaması var; ikinci bir uygulama yok. Uzakta açık bir katalog dalı (`codex/catalog-capacity-batch`) bulunuyor ve kataloglar deponun en büyük dosyaları.

## Karar

Web uygulaması Phase 0B'de kökte kalır. Kök `package.json` hem uygulama hem pnpm çalışma alanı köküdür. `apps/web` altına taşıma, `apps/mobile` oluşturulduğunda (Phase 2) tek bir mekanik pull request ile yapılır ve ayrı onay gerektirir.

## Gerekçe

Şimdi taşımak Vercel kök dizin ayarını, `tsconfig` yollarını, üç doğrulama betiğini, CI iş akışını, Tailwind içerik desenlerini ve tüm belgelerdeki yolları kırar; açık katalog dalıyla yeniden adlandırma çakışması garanti olur; ikinci uygulama olmadan hiçbir kazanım sağlamaz.

## Sonuçlar

- Kısa vadede biraz alışılmadık bir düzen: `src/` kökte, paylaşılan kod `packages/` altında.
- Paketler uygulamaya bağımlı olamaz; bu kural bugünden geçerlidir.
- Taşıma günü geldiğinde yalnızca yollar değişir; paket sınırları hazırdır.
