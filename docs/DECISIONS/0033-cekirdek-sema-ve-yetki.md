# 0033 — Çekirdek şema ve yetki (Phase 1A)

- Tarih: 2026-11-01
- Durum: Kabul edildi. Önce yalnız yerel doğrulamayla geçiciydi (karar 0032, 4. madde); 2026-11-01'de hazırlık projesine gönderildi ve oradaki denetimden geçti (karar 0034), geçicilik kalktı. Uygulama veritabanına henüz bağlanmıyor (1C). Migration dosyasının başındaki yorum gönderimden önceki durumu anlatır; uygulanmış migration değiştirilmez.
- Dayanak: Issue #7 (Phase 1A planı, 2026-09-02 onaylı), karar 0003 (Supabase), karar 0032 (Docker gerektirmeyen yol), `docs/SECURITY.md`, `docs/DATABASE.md`.

## Ne geldi

- `supabase/migrations/20261101160000_core_aquariums.sql`: `profiles`, `aquariums`, `aquarium_members`; tablo ve sütun izinleri, RLS politikaları, tetikleyiciler.
- `supabase/rollbacks/20261101160000_core_aquariums.sql`: geri alma SQL'i (Supabase CLI bu klasörü okumaz).
- `supabase/tests/`: Supabase taklidi (`supabase-shim.sql`), test veritabanı yardımcısı (`test-database.ts`), yetki matrisi ve kurallar (`core-aquariums.test.ts`), katalog ve izin denetimleri (`schema.test.ts`). Testler `pnpm verify` içindeki Vitest'le çalışır (`vitest.config.mts`; genel test süresi sınırı 5 sn'den 15 sn'ye çıktı: PGlite açılırken paralel çalışan ağır motor testi 5,2 sn sürüp düşmüştü).
- `@electric-sql/pglite` 0.5.8 (PostgreSQL 18.3; 2026-08-26'da yayımlandı) yalnız geliştirme bağımlılığı, tam sürüm.

## Şema

| Tablo | Sütunlar | Silme davranışı |
|---|---|---|
| `profiles` | `user_id` (PK), `nickname` (boş başlar; büyük-küçük harf gözetmeden benzersiz), `display_name`, `locale` (`tr`, `en`, `es`), zaman damgaları | `auth.users` silinince profil de silinir |
| `aquariums` | `id`, `owner_id`, `name`, `type` (`freshwater`, `saltwater`, `brackish` — `@aquamind/domain` ile aynı), ölçüler (boş olabilir, doluysa > 0), `net_volume_l` (> 0), `setup_date`, `description`, `status` (`active`, `soft_deleted`), `deleted_at`, `purge_after`, zaman damgaları | sahibi olan kullanıcı silinemez (`restrict`) |
| `aquarium_members` | (`aquarium_id`, `user_id`) PK, `role` (`owner`, `editor`, `viewer`), `invited_by`, `joined_at`; akvaryum başına tek sahip | akvaryumla birlikte silinir; üyeliği olan kullanıcı silinemez; daveti yapan silinirse `invited_by` boşalır |

Metin alanlarında yalnız uzunluk sınırı var (ad 1–100, takma ad ve görünen ad en çok 100, açıklama en çok 2.000). Takma adın biçim kuralları sosyal özellikle birlikte ürün sahibine sorulacak.

## Yetki

İki katman ayrı denetlenir: tablo ve sütun izinleri (GRANT) ve satır politikaları (RLS). `anon` ve `PUBLIC` için hiçbir tablo ya da fonksiyon izni yoktur. Migration önce her şeyi geri alır, sonra yalnız gerekeni açar (Supabase'in yeni tablolara hazır verdiği izinler kalmasın).

| Tablo | Okuma | Ekleme | Değiştirme | Silme |
|---|---|---|---|---|
| `profiles` | kendi satırı | yok (yalnız kayıt tetikleyicisi) | kendi satırında `nickname`, `display_name`, `locale` | yok |
| `aquariums` | sahip ve üyeler (yumuşak silinmiş dahil) | kendi adına (`owner_id = auth.uid()`); sütunlar: ad, tür, ölçüler, hacim, kurulum tarihi, açıklama | sahip ve editör: ayrıntılar; durum yalnız sahip; izleyici reddedilir | yok |
| `aquarium_members` | akvaryumun üyeleri | yalnız sahip; `owner` rolü verilemez | yalnız sahip, sahip olmayan üyenin rolü | yok |

Sonuç türleri: izin reddi `42501`; RLS'nin gizlediği satır boş sonuç ya da 0 satır; RLS `with check` reddi `42501`; tetikleyici kuralları kendi kodlarıyla:

| Kod | Anlamı |
|---|---|
| `AQ001` | değişmez alan değiştirilemez (`profiles.user_id`, `created_at`; `aquariums.id`, `owner_id`, `created_at`; üyeliğin akvaryumu, kullanıcısı, katılma zamanı) |
| `AQ002` | durum ya da zaman damgası istemciden yazılamaz; geçersiz durum geçişi |
| `AQ003` | izleyici akvaryumu değiştiremez |
| `AQ004` | durum geçişini yalnız sahip yapar |
| `AQ005` | sahip üyeliği değiştirilemez ya da akvaryum dururken silinemez |

Yaşam döngüsü: yeni akvaryum etkin başlar; etkin → yumuşak silinmiş ve geri dönüş yalnız sahibin; `deleted_at` ve `purge_after` (30 gün sonra) sunucu atar; aynı durumda kalırken zaman damgasına dokunmak reddedilir; `aquariums_lifecycle` CHECK kısıtı ikinci savunma hattıdır. Temizleme işi gerçek kullanıcıdan önce gelecek (karar 0032).

Fonksiyonlar: politika yardımcıları `is_aquarium_member` ve `is_aquarium_owner` yalnız `authenticated` için; tetikleyici yardımcılarını kimse doğrudan çağıramaz. `security definer` olanlar yalnız gerekli dört fonksiyon (iki yardımcı, profil oluşturma, sahip üyeliği); bütün fonksiyonlarda `search_path` boş ve sabit, gövdelerde nesneler tam nitelenmiş.

## Issue #7'den ayrılan noktalar

- **Silme izni hiçbir tabloda yok, üyelikte de.** Issue #7'nin izin bölümü "DELETE hiçbir tabloda verilmez" diyor, politika tablosu ise sahibin üyelik silmesine izin veriyordu; ikisi çelişiyordu. Tarihsel veriyi silmeme ilkesine (`AGENTS.md`) uygun olan seçildi: üye çıkarma, geçmişi koruyan biçimde paylaşım özelliğiyle gelecek.
- **Akvaryum okuma politikasında sahip koşulu ayrıca yazılı** (`owner_id = auth.uid() or is_aquarium_member(id)`). `insert ... returning` yeni satırı okuma politikasına da sokar; sahip üyeliği ise ekleme sonrası tetikleyicide oluştuğu için yalnız üyelik koşuluyla sahip eklediği akvaryumu geri okuyamıyordu (taslak denemesinde görüldü).
- **İzleyicinin değiştirme denemesi tetikleyicide `AQ003` ile reddedilir.** Issue #7 "üye; sütun izinleri tetikleyicide" diyordu; değiştirme politikası üyeleri geçirir, rolü tetikleyici denetler.
- **Sahip satırı akvaryum dururken servis rolüyle de silinemez** (`AQ005`); akvaryum silinince zincirleme gider. Servis rolünde üç tablonun `TRUNCATE` ve `TRIGGER` izinleri de kaldırıldı: `TRUNCATE` satır tetikleyicilerini çalıştırmaz (sahip satırı koruması atlanırdı) ve tarihsel veriyi toptan siler; `TRIGGER` izniyle koruyucu tetikleyiciler değiştirilebilir. Servis rolü yalnız satır işlemleri (okuma, ekleme, değiştirme, silme) yapar. "Sahip üyeliği olmayan akvaryum yoktur" değişmezi böylece satır işlemlerinde ve `TRUNCATE`'te servis rolüne karşı da korunur; şemayı değiştirebilen yönetici (`postgres`) bunun dışındadır.
- **`invited_by` sunucuda atanır**; istemci bu sütunu yazamaz.
- Docker'a bağlı maddelerin karşılığı karar 0032'de (CLI ve sürüm paritesi, gerçek istemci testleri ve `rls` CI işi 1B'de; testler `pnpm verify` içinde).

## Supabase taklidi

Testlerde `anon`, `authenticated`, `service_role` (`bypassrls`) rolleri, `auth` şeması, `auth.users` (`id`, `email`, `created_at`) ve `auth.uid()` (`request.jwt.claim.sub`, yoksa `request.jwt.claims` içindeki `sub`) kurulur. En geniş varsayımla public şemasındaki yeni tablo, fonksiyon ve dizilere bu üç role hazır izin verilir; migration'ın bunları açıkça geri aldığı böylece sınanır. Gerçek Supabase'in davranışı 1B'de hazırlık projesinde aynı denetimlerle doğrulanacak (karar 0032, 3. madde).

## Testler

- `core-aquariums.test.ts` (28 test): üç tablo × beş aktör × dört işlem; iki ayrı sahip ve akvaryum arasında sınır (okuma, üye ekleme, rol ve akvaryum değiştirme) ve farklı akvaryumlarda farklı rolü olan kullanıcının yetkisinin hedef akvaryumdaki role göre değerlendirilmesi; hacim ve üç ölçünün sıfırdan büyük olması (ekleme ve değiştirmede 0 ve -1), adın boş olmaması, türün listede olması; değişmez alanlar; `updated_at`'in sunucuda ilerlemesi; yaşam döngüsünün bütün geçişleri ve CHECK kısıtı; sahip üyeliği değişmezi ve servis rolünde `TRUNCATE` reddi; kullanıcı silme koruması; takma ad benzersizliği.
- `schema.test.ts` (10 test): `anon` ve `PUBLIC` için tablo ve sütun izni yokluğu; `service_role`'de `TRUNCATE` ve `TRIGGER` yokluğu, satır işlemlerinin varlığı; `authenticated` için tablo düzeyinde yalnız okuma ve sütun listeleri; fonksiyon izinleri (`has_function_privilege`; `PUBLIC` için `proacl` boş değil ve `aclexplode` ile `EXECUTE` yok); `security definer` listesi ve sabit `search_path`; RLS ve politika listesi; migration adları, geri alma dosyası ve geri alıp yeniden uygulama.
- Veritabanı dosya başına bir kez kurulur, her test `clone()` ile temiz kopyadan başlar.
- 28 bozma denemesinin hepsi testleri düşürdü (izinlerin geri alınmaması, politikanın herkese açılması, yardımcılarda ve tetikleyicinin rol sorgusunda akvaryum filtresinin kalkması, sıfır hacim ya da ölçünün kabulü, servis rolünde `TRIGGER`, `search_path` eksikliği, izleyicinin değiştirebilmesi, sürenin 7 güne inmesi, sahip satırının silinebilmesi, `updated_at` tetikleyicisinin kalkması, servis rolünde `TRUNCATE`, geri almanın bir fonksiyonu unutması…).
- `service_role` yalnız RLS'yi aşar (`bypassrls`); tablolara erişimi Supabase'in hazır verdiği izinlerden (testte taklitten) gelir.

## Geri alma

`supabase/rollbacks/20261101160000_core_aquariums.sql` migration'ın oluşturduğu her şeyi kaldırır (veri silinir; yalnız yerel test veritabanında ya da veri olmayan hazırlık projesinde). Depoda geri alma: `supabase/` klasörü, `vitest.config.mts`'teki ek ve bağımlılık kaldırılır; uygulama etkilenmez.

## Kapsam dışı

Hazırlık ya da üretim projesi, `supabase link`, uygulamanın bağlanması, giriş ekranı, `localStorage` aktarımı, `visibility`, canlı/bitki/ekipman/ölçüm/bakım/fotoğraf tabloları (1C), temizleme işi, hesap kapatma, sahiplik devri, üye çıkarma. Davet kabulü de yok: Issue #7'nin tasarımında sahip bir kullanıcıyı onayı olmadan üye ekleyebilir (eklenen yalnız o akvaryumu görür); paylaşım özelliği gelmeden önce daveti kabul adımı eklenmeli.
