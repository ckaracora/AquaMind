# AquaMind agent kuralları

Bu dosya Codex, Claude Code ve projede çalışan diğer yapay zekâ araçları için ana talimattır. Çalışmaya başlamadan önce bu dosyanın tamamını, `PROJECT_STATUS.md`, `CONTRIBUTING.md` ve ilgili `docs/` belgelerini oku.

## Proje amacı

AquaMind, akvaryum hobisini kolaylaştıran mobil öncelikli bir yönetim uygulamasıdır. Kullanıcı deneyimi sade, anlaşılır ve mümkün olduğunca otomatik olmalıdır. Kullanıcıdan katalogdaki bir cihazın teknik değerlerini tekrar girmesi beklenmemelidir.

## Tek gerçek kaynak

- Kodun güncel kaynağı GitHub deposundaki `main` dalıdır.
- Kullanıcılar eş zamanlı çalışmaz; çalışma sırayla devredilir.
- Her oturumun başında `git status --short`, aktif dal, uzak bağlantı ve son commit kontrol edilir.
- Yerel değişiklik varsa üzerine yazma, silme, resetleme veya pull yapma; önce kullanıcıya bildir.
- Bir önceki aracın özetine tek başına güvenme. Git geçmişi, dosyalar ve testlerle doğrula.

## Roller ve devir

- Claude Code varsayılan olarak uygulama kodunu yazar.
- Codex varsayılan olarak değişiklikleri inceler, test eder ve riskleri raporlar.
- Kullanıcı açıkça isterse bu roller değişebilir.
- Claude ve Codex aynı anda aynı çalışma klasöründe değişiklik yapmaz.
- Görev sonunda `PROJECT_STATUS.md` güncellenir: yapılanlar, testler, kalanlar ve sonraki adım.

## Değişiklik sınırları

- Yalnızca kullanıcının verdiği görev kapsamındaki dosyaları değiştir.
- İlgisiz kullanıcı değişikliklerini koru.
- `git reset --hard`, zorla push, geniş kapsamlı silme ve geçmişi yeniden yazma yapma.
- Commit, GitHub push, pull request birleştirme ve Vercel yayını ancak kullanıcı açıkça istediğinde yapılır.
- Gizli anahtarları, parolaları ve `.env*` içeriklerini GitHub'a ekleme veya mesajlarda paylaşma.

## Kullanıcı devir sözü

Kullanıcı **“AquaMind'i GitHub'a devret”** dediğinde bu, mevcut görev branch'i için şu işlemlere açık izin verir:

1. Çalışma alanını ve görev kapsamını kontrol et.
2. `PROJECT_STATUS.md` ve devir notunu gerçek durumla güncelle.
3. `pnpm verify` çalıştır.
4. Testler başarılıysa ilgili değişiklikleri açıklayıcı commit ile kaydet.
5. Mevcut görev branch'ini GitHub'a push et ve uzak sonucu doğrula.
6. Sonuç mesajında görev branch'i veya Pull Request bağlantısını kullanıcıya ilet.
7. `PROJECT_STATUS.md` içindeki güncel canlı uygulama bağlantısını ve bu yayının yeni değişiklikleri içerip içermediğini açıkça bildir.

Test başarısızsa veya kapsam dışı/riskli değişiklik varsa push yapma ve kullanıcıya bildir. Bu söz `main` dalına birleştirme, zorla push veya Vercel/canlı yayın izni değildir.

Kullanıcı **“AquaMind'i GitHub'dan devral”** dediğinde:

1. Yerel çalışma alanını kontrol et; kaydedilmemiş değişiklik varsa üzerine yazmadan durumu bildir.
2. Uzak dalları yenile ve devredilen görev branch'i ile commit'i doğrula.
3. Devir belgelerini ve değişiklikleri oku; güvenliyse görev branch'ini `--ff-only` yöntemiyle devral.
4. `pnpm verify` çalıştır ve kaldığı noktayı özetle.
5. Sonuç mesajında görev branch'i veya Pull Request bağlantısını, güncel canlı uygulama bağlantısını ve canlı yayının devredilen değişiklikleri içerip içermediğini açıkça bildir.

Bu devralma sözü commit, push, `main` birleştirmesi veya Vercel/canlı yayın izni değildir.

## Teknik çalışma düzeni

- Teknoloji: Next.js 15, React 19, TypeScript ve Tailwind CSS.
- Paket yöneticisi: pnpm. Bağımlılık kurarken `pnpm install --frozen-lockfile` kullan.
- Paket sürümlerini görev gerektirmedikçe yükseltme.
- Uygulama mobil önceliklidir; değişiklikleri dar ve geniş ekranlarda değerlendir.
- Kullanıcı verileri şu anda tarayıcı `localStorage` alanındadır. Supabase geçişi tamamlanmış gibi davranma.

## Zorunlu doğrulama

Değişiklikten sonra, hata veya açık bir engel yoksa:

```bash
pnpm verify
```

Bu komut TypeScript, katalog akışı, sağlık senaryoları, katalog denetimi ve üretim derlemesini çalıştırır. Başarısız testleri gizleme veya atlama. Test çalıştırılmadıysa bunu açıkça belirt.

## Katalog ve sağlık verisi kuralları

- Teknik değerleri, canlı gereksinimlerini veya uyumluluk verilerini tahmin etme.
- Önce üreticinin resmî ürün sayfası veya kullanım kılavuzu kullanılır.
- Resmî kaynak bulunamazsa `docs/DATA_SOURCES.md` içindeki güvenilir ikincil kaynaklar kullanılabilir.
- Her katalog kaydı doğrulanabilir HTTPS `sourceUrl` ve `YYYY-MM-DD` biçiminde `verifiedAt` taşımalıdır.
- Kaynaklar çelişiyorsa kesin değer seçme; çelişkiyi not et veya alanı boş bırak.
- Kaynakta yayımlanmayan kapasite, debi, güç veya öneri değeri uydurulmaz.
- Sağlık ve biyolojik yük sonuçları kesin tıbbi/veteriner hüküm değil, açıklanabilir hobi rehberliği olarak sunulur.

## Başvuru belgeleri

- Ürün amacı ve mimari: `docs/PROJECT.md`
- Veri kaynakları: `docs/DATA_SOURCES.md`
- Güncel devir noktası: `PROJECT_STATUS.md`
- İnsan çalışma akışı: `CONTRIBUTING.md`
- Görev ve devir şablonları: `docs/HANDOFF.md`

## Mimari yönetişim

Bu bölüm `docs/ARCHITECTURE.md`, `docs/DATABASE.md`, `docs/SECURITY.md` ve
`docs/COMPATIBILITY.md` belgeleriyle birlikte okunur. Çelişki varsa kullanıcı
talebi, sonra bu dosya, sonra ilgili belge geçerlidir.

### Asla

- Mimariyi sessizce değiştirme. Paket sınırlarını, veri modelini veya depolama
  katmanını değiştiren her iş önce `docs/DECISIONS/` altında kısa bir karar
  kaydı ister.
- Yetkilendirmeyi atlama. Arayüzde gizlemek yetki değildir. Her kullanıcı verisi
  tablosu veritabanı seviyesinde (RLS) politikaları ve testleri olmadan üretime
  çıkmaz.
- Gizli anahtar açığa çıkarma. `service_role`, yapay zekâ sağlayıcı anahtarları
  ve ödeme anahtarları yalnızca sunucu tarafında kalır; `NEXT_PUBLIC_*` altına
  veya mobil pakete girmez. Depoya `.env.example` dışında ortam dosyası eklenmez.
- Uyumluluk puanını yapay zekâya hesaplatma. Puan, alt puanlar ve bulgular
  yalnızca `packages/compatibility-engine` içindeki deterministik ve testli
  motordan gelir. Yapay zekâ yalnızca açıklama üretir.
- Tarihsel veriyi gereksiz yere yok etme. Canlı, bitki, ekipman, ölçüm, bakım ve
  sahiplik kayıtları silinmez; durum değişikliğiyle kapatılır. Akvaryum silme
  yumuşak silmedir ve kurtarma süresi vardır.
- Kesin konum açığa çıkarma. Kullanıcının tam koordinatı yalnızca kendisine
  görünür. Keşif ve harita özellikleri yalnızca yaklaşık hücre tablosunu kullanır.
- Gerekçesiz bağımlılık ekleme. Yeni çalışma zamanı bağımlılığı, çözdüğü sorun ve
  değerlendirilen alternatif yazılmadan eklenmez. Görev gerektirmedikçe sürüm
  yükseltilmez.
- Üretim şemasını elle değiştirme. Her şema değişikliği `supabase/migrations/`
  altında sürümlü bir dosyadır. Supabase panelinden veya SQL editöründen üretimde
  doğrudan değişiklik yapılmaz. Yapay zekâ araçları üretim verisine bağlanmaz.
- Çekirdek alan tanımlarını çoğaltma. Alan tipleri ve doğrulama şemaları
  `packages/domain` içinde tek yerde tanımlanır; uygulamalar içe aktarır,
  kopyalamaz.
- Kaynak bilgisini kaybetme. Mevcut `sourceUrl` ve `verifiedAt` değerleri
  değiştirilmez, silinmez ve yeniden üretilmez. Güven veya doğrulama durumu
  uydurulmaz; bilinmiyorsa boş bırakılır.

### Her zaman

- Önce mevcut mimariyi incele. İlgili paket, belge ve testleri okumadan tasarım
  önerme.
- Çalışan davranışı koru. `pnpm verify`, mevcut `localStorage` davranışı ve
  katalog testleri geçmeye devam eder. Bir davranışı kaldırmak ayrı ve onaylı
  bir görevdir.
- Şema değişikliğinde migration kullan ve migration'ı yerel Supabase üzerinde
  çalıştırarak doğrula.
- Kritik davranışı test et. Uyumluluk motoru, RLS yetki matrisi, sahiplik devri,
  ortak roller ve tarihsel bütünlük değişiklikleri testsiz teslim edilmez.
- İlgili belgeyi aynı görevde güncelle. Mimari, veritabanı, güvenlik veya motor
  değişince ilgili `docs/` belgesi de değişir.
- Önemli mimari değişikliği açıkla. Neden, alternatifler ve geri alma yolu karar
  kaydında yazılır.
- Basit tut. 1k–10k kullanıcı için yeterli en yalın çözümü seç. Kubernetes,
  Kafka, mikroservis ve önbellek katmanı gibi altyapılar ölçülmüş bir ihtiyaç
  olmadan eklenmez.
- Kaynak izini koru. Yeni bilgi kaydı `sourceUrl`, `verifiedAt` ve doğrulama
  yöntemiyle gelir.
- Tarihsel bütünlüğü koru. Geçmiş kayıtları etkileyen her değişiklikte "eski
  kayıtlar ne olur?" sorusu görev özetinde yanıtlanır.

### Depo düzeni

- Web uygulaması depo kökündedir (`src/`). Paylaşılan kod `packages/` altındadır.
  Uygulamayı `apps/web` altına taşımak ayrı bir onaylı görevdir.
- `packages/domain`: alan tipleri, doğrulama şemaları ve yerel dışa aktarma biçimi.
- `packages/compatibility-engine`: deterministik uyumluluk motoru ve testleri.
- `src/data/`: katalog verisi. Şimdilik yerinde kalır.
- `supabase/`: migration, fonksiyon ve politika dosyaları. Phase 1 ile oluşur.

### Ortamlar

- `development`: yerel Supabase (CLI) ve `.env.local`.
- `staging`: ayrı Supabase projesi ve Vercel önizleme ortamı.
- `production`: ayrı Supabase projesi. Yalnızca kullanıcı onayıyla ve migration
  üzerinden değişir.
