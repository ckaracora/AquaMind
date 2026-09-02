# 0002 — Kademeli monorepo: önce paketler, sonra uygulamalar

- Tarih: 2026-09-02
- Durum: Kabul edildi (Phase 0B)

## Bağlam

Üç seçenek değerlendirildi: (1) monorepo'ya hemen tam geçiş, (2) kademeli geçiş, (3) yapıyı değiştirmemek. Mobil ve yönetici uygulamaları alan tiplerine ve uyumluluk motoruna kopyalamadan ihtiyaç duyacak.

## Karar

Seçenek 2. Phase 0B'de pnpm çalışma alanı etkinleştirildi ve yalnızca gerçek sınırı olan iki paket çıkarıldı: `packages/domain` (tipler, şemalar, dışa aktarma biçimi) ve `packages/compatibility-engine` (deterministik motor). Boş veya "ileride lazım olur" paketi açılmadı. Kataloglar `src/data` altında kaldı; `packages/knowledge` açık katalog dalları birleştikten sonra (Phase 2) gelir.

## Gerekçe

Bu iki paket, üç istemcinin (web, mobil, sunucu fonksiyonları) kesişim noktasıdır. Çıkarımları küçük ve mekanikti; yeniden dışa aktarma köprüleriyle hiçbir tüketici değişmedi ve `pnpm verify` her adımda yeşil kaldı. Seçenek 3 ileride çekirdek alan tanımlarının kopyalanmasına yol açardı; seçenek 1 gereksiz kırılma yaratırdı.

## Sonuçlar

- Paketler TypeScript kaynağı yayımlar; Next `transpilePackages`, betikler `.ts` kancası, `tsc` kök include deseni ile aynı kaynağı okur.
- Yeni paket eklemek kilit dosyasını bir kez frozen olmadan yenilemeyi gerektirir; bu belgelenir, sonra frozen kurulum kuralı sürer.
- Kök `tsc` artık paketleri de denetler; paket testlerindeki tip hatası `pnpm verify`'ı kırar (istenen).
