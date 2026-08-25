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

Test başarısızsa veya kapsam dışı/riskli değişiklik varsa push yapma ve kullanıcıya bildir. Bu söz `main` dalına birleştirme, zorla push veya Vercel/canlı yayın izni değildir.

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
