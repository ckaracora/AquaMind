# 0003 — Arka uç adayı olarak Supabase üzerinde PostgreSQL

- Tarih: 2026-09-02
- Durum: Önerildi (uygulama Phase 1'de; Phase 0B'de proje oluşturulmadı veya bağlanmadı)

## Bağlam

Gereksinimler: ilişkisel ve tarihsel veri modeli, veritabanı düzeyinde yetkilendirme, e-posta/Google/Apple kimlik doğrulama, fotoğraf depolama, DM ve bildirim için gerçek zamanlı kanal, sunucu tarafı fonksiyonlar (yapay zekâ geçidi), 1k–10k kullanıcı için yalın başlangıç ve 100k+ için makul yol. Kubernetes, Kafka, Redis, mikroservis ve GraphQL katmanı istenmiyor.

## Karar

Supabase (PostgreSQL, Auth, Storage, Realtime, Edge Functions) birincil adaydır. Yetkilendirmenin gerçek kaynağı Row Level Security'dir. Şema yalnızca `supabase/migrations/` altındaki sürümlü dosyalarla değişir. Ortamlar: yerel (CLI), staging, production; üretim yalnızca kullanıcı onayıyla.

## Gerekçe

Tek sağlayıcı, tek kimlik doğrulama sınırı, veritabanı düzeyi yetki, yerel Docker geliştirme ve git içinde migration. En küçük ücretli katman hedef ölçeğe yeter; bağlantı havuzu, okuma kopyaları ve daha büyük hesaplama mimari değişikliği olmadan büyütür.

## Bedel ve azaltma

Kimlik doğrulama ve depolama için sağlayıcı bağımlılığı. Azaltma: düz Postgres şeması ve SQL migration'ları taşınabilir kalır; iş mantığı `packages/*` içinde, sağlayıcıya özgü kancalarda değil.

## Sonuçlar

- Phase 1'in ilk işi yerel Supabase ve çekirdek migration'lar; her tablo RLS politikaları ve beş aktörlü test matrisiyle gelir (`docs/SECURITY.md`).
- Kataloglar Postgres'e taşınırken `sourceUrl` ve `verifiedAt` değiştirilmeden aktarılır (`docs/DATABASE.md`).
