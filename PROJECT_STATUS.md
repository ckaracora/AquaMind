# AquaMind proje durumu

Son güncelleme: 2026-08-26

## Doğrulanmış temel

- GitHub: `https://github.com/ckaracora/AquaMind`
- Ana dal: `main`
- Başlangıç commit'i: `7d8fb01 fix: approve sharp build dependency`
- Canlı önizleme: `https://aqua-mind-three.vercel.app/`
- Görev panosu: `https://github.com/users/ckaracora/projects/1`
- Teknoloji: Next.js 15, React 19, TypeScript, Tailwind CSS, pnpm
- `pnpm verify`: 2026-08-26 tarihinde yerelde başarılı
- Arkadaş kurulumu: `buraksenfx` hesabı collaborator; Windows kopyasında kurulum ve tüm doğrulamalar başarılı
- GitHub Actions: Issue #2 ve Pull Request #3 tamamlandı; `main` dalına gönderilen değişikliklerde `pnpm verify` otomatik çalışıyor

## Mevcut veri durumu

- Kataloglar `src/data/` altında sürüm kontrollü TypeScript verisidir.
- Akvaryumlar, ölçümler, bakım, canlılar, bitkiler ve ekipmanlar şimdilik tarayıcı `localStorage` alanında saklanır.
- Kullanıcı hesabı, bulut senkronizasyonu ve gerçek veritabanı henüz yoktur.
- Supabase geçişi gelecek aşamadır; tamamlanmış gibi gösterilmemelidir.

## Ortak çalışma kurulumu

- [x] GitHub collaborator eklendi
- [x] Proje arkadaşın Windows bilgisayarına klonlandı
- [x] Bağımlılıklar kuruldu ve `pnpm verify` geçti
- [x] Ortak talimat belgeleri hazırlandı ve GitHub'a gönderildi
- [x] GitHub görev şablonları, devir sistemi, etiketler ve ortak görev panosu etkinleştirildi
- [x] GitHub Actions otomatik doğrulaması kuruldu ve `main` dalında başarıyla çalıştı
- [x] İki bilgisayarlı devir provası kayıp veya çakışma olmadan tamamlandı

Google Sheets ortak çalışmanın ön şartı değildir. Kataloglar şimdilik GitHub'daki sürüm kontrollü TypeScript dosyalarında yönetilecek. Harici araştırma tablosu ancak katalog yönetimi darboğaza dönüşürse yeniden değerlendirilecek.

Supabase de ortak çalışma kurulumunun parçası değildir. Kullanıcı hesabı, bulut senkronizasyonu ve kalıcı veri ihtiyacı ürün geliştirme aşamasında ayrı bir Issue olarak ele alınacaktır.

## Ortak çalışma kurulum sonucu

Ortak çalışma kurulumu tamamlandı. İki bilgisayar da GitHub üzerinden sırayla çalışabilir; Claude kod yazabilir, Codex denetleyebilir ve kullanıcı isterse bu roller görev bazında değişebilir.

## Sıradaki tek iş

Görev panosundan sıradaki ürün geliştirme işini seçmek veya yeni bir Issue açmak; yalnızca seçilen görev üzerinde çalışmaya başlamak.

## Oturum sonu devir şablonu

- Yapılan görev:
- Değişen dosyalar:
- Çalıştırılan kontroller:
- Sonuç:
- Bilinen hata veya risk:
- GitHub'a gönderildi mi:
- Vercel'e yayımlandı mı:
- Sonraki tek iş:
