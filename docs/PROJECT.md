# AquaMind ürün ve mimari özeti

## Ürün hedefi

AquaMind, akvaryum hobisindeki günlük yönetimi tek yerde toplayan mobil öncelikli bir uygulamadır. Temel hedef, yeni başlayan ve deneyimli kullanıcıların akvaryumlarını karmaşık teknik formlarla uğraşmadan yönetebilmesidir.

Ürün sahibinin 2026-10-19 hedefleri (`docs/DECISIONS/0020-urun-hedefleri-ve-yol-haritasi.md`): App Store ve Google Play'de yayın (web sürümü de kalır), birden çok dil (ilk ek dil İngilizce), uygulama içi ödeme, on binlerce kullanıcı, modern ve akıcı bir deneyim. Uygulama hem bilgilendirir, hem akvaryumun düzenli kontrolünü sağlar, hem de kullanıcıların tanışıp etkileşime girdiği sosyal bir alan sunar.

## Temel alanlar

- Akvaryum ve hacim bilgileri
- Su değerleri ve geçmişi
- Bakım günlüğü ve tekrarlayan görevler
- Canlı, bitki ve ekipman yönetimi; bitki kataloğu ve tuzlu su başlangıç paketi (planlanan)
- Hacim, su değişimi ve kum litre hesaplayıcıları
- Canlı yükü, filtrasyon, ısıtıcı ve ekipman uygunluk uyarıları
- Ürün, ekipman ve canlı katalogları; kullanıcıların bilgiye artı/eksi verip düzeltme önerebilmesi (planlanan)
- Hastalık ve tedavi için güvenilir kaynaklara yönlendirme (planlanan)
- Sosyal alan: profil, akvaryum paylaşma, takip, beğeni, yorum (planlanan)
- Normal ve premium sürüm ayrımı (uygulama içi ödemeyle); özellik ayrımı ileride tanımlanacak

## Kullanıcı deneyimi ilkeleri

- Mobil ekran önceliklidir.
- Ana işlemler az adımda tamamlanmalıdır.
- Kullanıcı katalogdan bir ekipman seçtiğinde bilinen teknik değerler otomatik kullanılmalıdır.
- Uyarılar sade, açıklanabilir ve eyleme dönük olmalıdır.
- Belirsiz teknik bilgi kesin gerçekmiş gibi gösterilmemelidir.
- Metinler, tarih ve sayı biçimleri ve birimler (litre/galon, °C/°F, cm/inç) kullanıcının diline ve tercihine göre gösterilir.

## Güncel mimari

- Arayüz: Next.js App Router, React, TypeScript ve Tailwind CSS
- Yayın: GitHub bağlantılı Vercel projesi
- Katalog: `src/data/` altındaki sürüm kontrollü TypeScript dosyaları
- Kullanıcı verisi: `src/lib/aquarium-storage.ts` üzerinden tarayıcı `localStorage`
- Sağlık değerlendirmesi: `packages/compatibility-engine` içindeki deterministik motor, `src/lib/health-analysis.ts` uyarlayıcısı üzerinden
- Paylaşılan alan tipleri ve doğrulama şemaları: `packages/domain` (uygulama `src/types/aquarium.ts` köprüsüyle kullanır)
- Paket testleri: Vitest (`pnpm test`); doğrulama betikleri ve derleme ile birlikte `pnpm verify`

## Planlanan mimari

- Supabase Auth ile kullanıcı hesapları
- Supabase PostgreSQL ile akvaryum ve günlük verileri
- Row Level Security ile kullanıcı verisi ayrımı
- Onaylı katalog verisi için kontrollü içe aktarma süreci; katalog sunucuda sürümlü veri olur, çeviriler ve 3 aylık güncellemeler mağaza sürümü beklemeden ulaşır
- Çok dil: arayüz metinleri dil dosyalarında, motor uyarıları kod ve değişken olarak, katalog adları ve açıklamaları dile göre
- Expo ile iOS ve Android uygulaması; App Store ve Google Play ödeme sistemleri; e-posta, Google ve Apple ile giriş
- Sosyal içerik için şikâyet, engelleme ve içerik süzme
- Görseller için hakları doğrulanmış depolama veya kaynak bağlantısı
- Ayrıntılı hedef mimari, veritabanı evrimi, güvenlik sınırları ve motor sözleşmesi: `docs/ARCHITECTURE.md`, `docs/DATABASE.md`, `docs/SECURITY.md`, `docs/COMPATIBILITY.md`; kararlar `docs/DECISIONS/`

