# AquaMind ürün ve mimari özeti

## Ürün hedefi

AquaMind, akvaryum hobisindeki günlük yönetimi tek yerde toplayan mobil öncelikli bir uygulamadır. Temel hedef, yeni başlayan ve deneyimli kullanıcıların akvaryumlarını karmaşık teknik formlarla uğraşmadan yönetebilmesidir.

## Temel alanlar

- Akvaryum ve hacim bilgileri
- Su değerleri ve geçmişi
- Bakım günlüğü ve tekrarlayan görevler
- Canlı, bitki ve ekipman yönetimi
- Hacim, su değişimi ve kum litre hesaplayıcıları
- Canlı yükü, filtrasyon, ısıtıcı ve ekipman uygunluk uyarıları
- Ürün, ekipman ve canlı katalogları
- Normal ve premium sürüm ayrımı için ileride tanımlanacak özellikler

## Kullanıcı deneyimi ilkeleri

- Mobil ekran önceliklidir.
- Ana işlemler az adımda tamamlanmalıdır.
- Kullanıcı katalogdan bir ekipman seçtiğinde bilinen teknik değerler otomatik kullanılmalıdır.
- Uyarılar sade, açıklanabilir ve eyleme dönük olmalıdır.
- Belirsiz teknik bilgi kesin gerçekmiş gibi gösterilmemelidir.

## Güncel mimari

- Arayüz: Next.js App Router, React, TypeScript ve Tailwind CSS
- Yayın: GitHub bağlantılı Vercel projesi
- Katalog: `src/data/` altındaki sürüm kontrollü TypeScript dosyaları
- Kullanıcı verisi: `src/lib/aquarium-storage.ts` üzerinden tarayıcı `localStorage`
- Sağlık değerlendirmesi: `src/lib/health-analysis.ts`

## Planlanan mimari

- Supabase Auth ile kullanıcı hesapları
- Supabase PostgreSQL ile akvaryum ve günlük verileri
- Row Level Security ile kullanıcı verisi ayrımı
- Onaylı katalog verisi için kontrollü içe aktarma süreci
- Görseller için hakları doğrulanmış depolama veya kaynak bağlantısı

