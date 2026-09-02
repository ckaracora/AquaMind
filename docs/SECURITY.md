# AquaMind güvenlik planı

Son güncelleme: 2026-09-02. **Durum: tasarım.** Uygulama bugün tamamen istemci tarafında çalışır; kullanıcı hesabı, arka uç ve gizli anahtar yoktur. Bu belge Phase 1 ve sonrası için bağlayıcı ilkeleri tanımlar. Hiçbir kullanıcı verisi tablosu burada tanımlanan yetkilendirme stratejisi ve testleri olmadan üretime çıkmaz.

## Temel ilke

Arayüzde gizlemek yetki değildir. Yetkilendirme kararı veritabanında (Row Level Security) verilir; istemci yalnızca sonucu gösterir. İstemciden gelen sahiplik bilgisine güvenilmez.

## Satır düzeyi güvenlik (RLS)

- Her kullanıcı verisi tablosunda RLS, tabloyu oluşturan migration'da etkinleştirilir; politikalar aynı migration'da gelir.
- SQL yardımcı fonksiyonları `is_aquarium_member(aquarium_id, min_role)` ve `is_aquarium_owner(aquarium_id)` (`security definer`) akvaryum kapsamlı her politikanın temelidir.
- Roller:
  - **Sahip (owner):** akvaryum, üyeler, sahiplik devri ve yumuşak silme dahil tam okuma ve yazma.
  - **Editör (editor):** operasyonel tablolarda (canlı, bitki, ekipman, ölçüm, bakım, fotoğraf) ekleme ve güncelleme; üye yönetimi ve akvaryum silme yok.
  - **İzleyici (viewer):** yalnızca okuma.
  - **İlgisiz kullanıcı:** hiçbir satır.
  - **Anonim:** açıkça herkese açık görünümler dışında hiçbir şey.
- Herkese açık erişim yalnızca beyaz listeye alınmış sütunları yansıtan görünümler veya RPC'ler üzerinden verilir (örneğin `public_aquarium_profiles`); tablo politikaları genişletilmez.
- Sahiplik devri tek bir SQL fonksiyonunda çalışır: denetim satırını ekler, `owner_id` ve üye rollerini atomik olarak değiştirir, alt satırlara dokunmaz. Ölçüm, bakım, canlı, ekipman ve fotoğraf geçmişi akvaryuma bağlı kalır.
- Politika test matrisi (sahip, editör, izleyici, ilgisiz, anonim) her tablo için CI'da yerel Supabase'e karşı çalışır. Testi olmayan politika birleştirilmez.

## Gizli anahtarlar

- Herkese açık istemciler yalnızca Supabase URL'sini ve anon anahtarını alır. Anon anahtarı yalnızca RLS yetkilendirme katmanı olduğu için güvenlidir.
- `service_role`, yapay zekâ sağlayıcı anahtarları, RevenueCat gizli anahtarı ve webhook gizli anahtarları Vercel ve Supabase ortam ayarlarında yaşar; yalnızca sunucu kodunda okunur; asla `NEXT_PUBLIC_` önekiyle veya Expo paketinde görünmez.
- Depoda yalnızca `.env.example` (ad var, değer yok) bulunur. `.gitignore` zaten `.env*` dosyalarını dışlar.
- Yapay zekâ kodlama araçları üretim kimlik bilgisi almaz; yerel geliştirme CLI'nin yerel anahtarlarını kullanır.

## Kimlik doğrulama sınırı

- Supabase Auth: önce e-posta/parola, sonra Google, iOS mağaza politikasının gerektirdiği durumda Apple. Misafir ve telefon girişi yok.
- Web: Supabase SSR yardımcılarıyla sunucu tarafı oturum; mobil: güvenli depolamayla Supabase istemcisi.
- Apple, Google ile giriş sunan bir iOS uygulamasında Apple ile girişi zorunlu kılar; mobil açılış sağlayıcı seçimi ürün sahibinin kararıdır.

## Özel ve herkese açık veri

- Varsayılan gizli. `profiles` yalnızca takma ad ve herkese açık alanları bir görünüm üzerinden sunar; e-posta ve kimlik doğrulama verisi `auth.users` dışına çıkmaz.
- Akvaryumlar sahip `visibility = public` yapmadıkça gizlidir; bu yalnızca herkese açık görünümü açar.

## AquaMap ve konum gizliliği

- İki ayrı tablo: yalnızca kullanıcının okuyabildiği `user_locations` (kesin koordinat) ve sunucu fonksiyonunun kaba bir hücreye (yaklaşık 1–5 km) titreşimle eşlediği, yalnızca isteğe bağlı doldurulan `discovery_cells`.
- Harita ve yakınımdakiler sorguları hücre başına küme sayıları ve yaklaşık konumlar döndüren RPC'ler üzerinden çalışır; `user_locations` satırları asla döndürülmez.
- Mesafe filtreleri (2, 5, 10, 25, 50 km) hücre aralığı sorgularıdır.
- Vazgeçmek veya hesabı silmek her iki satırı da siler.

## Yapay zekâ anahtarı koruması

- İstemci hiçbir zaman sağlayıcıyla doğrudan konuşmaz.
- Geçit: kullanıcıyı doğrular → yalnızca kullanıcının okuyabildiği akvaryumlardan bağlam kurar → ilgisiz kişisel veriyi ayıklar → sağlayıcıyı sunucu anahtarıyla çağırır → yanıt biçimini doğrular → üst veriyi (sağlayıcı, model, istek türü, gecikme, kullanım, maliyet, sonuç) kaydeder, istem gövdelerini kaydetmez → sonucu döndürür.
- Uyumluluk puanı hiçbir zaman yapay zekâ tarafından üretilmez; yapay zekâ yalnızca deterministik motorun sonucunu açıklar.

## Silme ve gizlilik

- Akvaryum silme: `soft_deleted` durumu ve `purge_after = deleted_at + 30 gün`; pencere içinde geri yükleme bir durum değişikliğidir; süre dolunca zamanlanmış bir iş alt satırları ve fotoğrafları temizler.
- Hesap silme: sahip olunan akvaryumlar devredilir veya silinir; kişisel satırlar, depolama nesneleri ve keşif hücreleri temizlenir; işlem kaydedilir.

## Yapay zekâ kodlama araçları için kurallar

`AGENTS.md` "Mimari yönetişim" bölümü bağlayıcıdır: yetkilendirme atlanmaz, gizli anahtar açığa çıkarılmaz, kesin konum açığa çıkarılmaz, üretim şeması elle değiştirilmez, üretim verisine bağlanılmaz.
