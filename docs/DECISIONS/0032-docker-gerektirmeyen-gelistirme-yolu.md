# 0032 — Hesaplar ve bulut: Docker gerektirmeyen geliştirme yolu

- Tarih: 2026-11-01
- Durum: Kabul edildi. Ürün sahibi 2026-11-01'de dil altyapısından sonraki iş olarak "Hesaplar ve bulut planı"nı seçti; seçenekte Docker gerektirmeyen yol ve ileride ücretsiz bir Supabase projesi açması gerektiği yazıyordu. Yöntem teknik karardır (Claude). Yol haritasının 7. adımı (karar 0020); arka uç adayı karar 0003; Phase 1A planı Issue #7.

## Bağlam

- Phase 1A planı (Issue #7, 2026-09-02 onaylı) yerel Supabase'i Docker üzerinde kurmayı istiyordu. Bu bilgisayarda Docker kurulu değil ve BIOS'ta SVM Mode kapalı (2026-09-24'te yeniden doğrulandı); plan o günden beri bekliyor.
- Supabase belgeleri (2026-11-01'de okundu):
  - Yerel yığın Docker kapsayıcılarında çalışır ("That stack runs in Docker containers, so you need a container runtime installed first"; supabase.com/docs/guides/local-development/cli/getting-started).
  - Kapsayıcısız "native runtime" deneyseldir ve Windows'ta desteklenmez ("Windows | Not supported. Use Docker."; supabase.com/docs/guides/local-development/docker-and-native-runtimes).
  - `supabase test db` yerel yığını ister; `supabase db pull` Docker ister. `link`, `db push`, `gen types --project-id` için belgede Docker şartı yazmıyor (ilk kullanımda denenecek).
  - Varsayılan roller: `anon`, `authenticated`, `authenticator`, `service_role` (RLS'yi atlar, `bypassrls`). Belge `auth.uid()`'nin hangi ayarı okuduğunu yazmıyor; RLS testi örneği kimliği `set local request.jwt.claim.sub` ile verir.
  - Ücretsiz plan: en çok 2 etkin proje, 1 hafta kullanılmayan proje duraklatılır, proje başına 500 MB veritabanı, otomatik yedek yok (supabase.com/pricing).
- PGlite (Postgres'in WASM derlemesi; npm paketi `@electric-sql/pglite`, Apache-2.0, bağımlılığı yok) Node'da kurulum gerektirmeden çalışır. Belgeleri rol ve RLS desteğini ne doğruluyor ne dışlıyor; "single user/connection" diyor. Bu yüzden 2026-11-01'de depo dışındaki bir klasörde 0.5.8 sürümüyle (PostgreSQL 18.3) denendi. 14 denetimin hepsi geçti:
  - rol oluşturma (`anon`, `authenticated`, `service_role` `bypassrls`) ve işlem içinde `set local role`;
  - süper kullanıcı olmayan rolde RLS'nin uygulanması: başkası adına ekleme RLS'nin `with check` koşuluna takıldı (`42501`), başkasının satırını okuma hata vermeden boş sonuç döndü, `service_role` hepsini gördü;
  - tablo izinleri (`revoke`, `grant`, `has_table_privilege`): izni olmayan tabloya doğrudan yazma ve anonim okuma tablo izni katmanında reddedildi (`42501`; aynı kod, farklı katman — testler katmanı ayrıca denetler);
  - `security definer` fonksiyon ve tetikleyici (sahip üyeliğini yazan tetikleyici, kullanıcının yazamadığı tabloya yazdı);
  - plpgsql, özel SQLSTATE kodu (`AQ001`), `gen_random_uuid()`;
  - `request.jwt.claim.sub` ve `request.jwt.claims` ile `auth.uid()`;
  - test başına temiz kopya `clone()` (~0,75 sn); ilk açılış ~3,5 sn (aynı anda tam derleme çalışırken ~13 sn). Bu yüzden testler veritabanını dosya başına bir kez kurar, her test kopyayla başlar.
- Deney sütun izinlerini, profil oluşturma tetikleyicisini, yaşam döngüsü geçişlerini, fonksiyon izinlerini (`PUBLIC EXECUTE`) ve boş `search_path` davranışını sınamadı; bunlar 1A'nın kabul testleridir. Codex'in tekrarında sütun izinleri, boş `search_path` ve kopyaların birbirinden yalıtımı da çalıştı. Not: tablo düzeyinde `update` izni varken yalnız bir sütuna `update` vermek öbür sütunları korumaz (supabase.com/docs/guides/database/postgres/column-level-security); migration'lar önce tablo düzeyindeki izni geri alır, sonra sütun izni verir.

## Karar

1. **Yerel doğrulama PGlite ile.** Migration'lar `supabase/migrations/` altında düz SQL dosyalarıdır. Testler aynı dosyaları sırayla bir PGlite veritabanına uygular ve yetki matrisini (`docs/SECURITY.md`: sahip, editör, izleyici, ilgisiz, anonim) orada sınar. Testler `pnpm verify` ve CI içinde çalışır; ağ ya da gizli anahtar gerekmez. `@electric-sql/pglite` yalnız geliştirme bağımlılığı olur (tam sürüm sabit, kurulumdan en az iki hafta önce yayımlanmış); uygulamanın çalışma zamanına ve istemci paketine girmez.
2. **Supabase taklidi yalnız testte.** Supabase'in hazır getirdiği parçalar test için küçük bir SQL dosyasıyla kurulur: üç rol, `auth` şeması, `auth.users` tablosunun testin kullandığı sütunları ve `auth.uid()` (`request.jwt.claim.sub`, yoksa `request.jwt.claims` içindeki `sub`). Bu dosya `supabase/migrations/` altında değildir ve gerçek projeye gönderilmez.
3. **Gerçek Supabase'te ikinci doğrulama.** Hazırlık (staging) projesi ürün sahibinin hesabında açılır (ücretsiz plan; bölge olarak AB'de bir merkez önerilir). Migration'lar oraya `supabase db push` ile, ürün sahibinin GitHub'a kendisinin girdiği sırlarla elle tetiklenen bir iş akışından gönderilir; Claude şifre ya da anahtar görmez ve yazmaz. Taklidin gerçek Supabase'ten farkı (rollerin hazır izinleri, `auth.uid()`'nin tanımı, Postgres sürümü) orada iki yolla kapatılır; ikisi de geçmeden fark kapanmış sayılmaz:
   - **Katalog ve izin denetimleri** (1A'daki denetimlerin aynısı, gerçek projede): her kullanıcı tablosunda RLS etkin ve politikalar tanımlı (`pg_tables`, `pg_policies`); `anon`, `authenticated` ve `PUBLIC` için tablo ve sütun izinleri beklenen liste (`information_schema.role_table_grants`, `role_column_grants`, `has_table_privilege`, `has_column_privilege`); fonksiyon izinleri (`has_function_privilege`; `PUBLIC` için `pg_proc.proacl` boş değil ve `aclexplode` ile `EXECUTE` yok); `security definer` fonksiyonlarda sabit `search_path`. Supabase'in yeni tablolara hazır verdiği izinler bu denetimle yakalanır.
   - **Gerçek istemciyle yetki senaryoları:** `@supabase/supabase-js` ile test kullanıcıları (sahip, editör, izleyici, ilgisiz) ve anonim istemci; her tablo için okuma, ekleme, değiştirme ve silmede beklenen izin ve ret (yetki matrisinin özeti, olumlu ve olumsuz durumlar ayrı). Bu projede yalnız test kullanıcıları olur; gerçek kullanıcı hesabı yasal hazırlıktan önce açılmaz (0020, 11. adım).
4. **1A yalnız yerel doğrulamayla geçici kabul edilir.** 1A'nın migration'ı hiçbir gerçek projeye gönderilmez ve uygulama hiçbir veritabanına bağlanmaz. Migration, 1B'de hazırlık projesinde 3. maddedeki iki denetimden geçmeden 1C (giriş ve uygulamanın bağlanması) başlamaz. `AGENTS.md`'deki "önce yerel test veritabanında, sonra hazırlık projesinde" kuralı böyle okunur.
5. **Ortak SQL.** PGlite PostgreSQL 18'dir; hazırlık projesinin sürümü proje açılınca okunur. Migration'lar iki sürümde ortak özelliklerle yazılır. PGlite tek bağlantılı olduğu için eşzamanlı oturum gerektiren denemeler (yarış durumu) hazırlık projesinde yapılır.

## Aşamalar

Phase 1 dört pakete bölünür; her paket ayrı dalda, Codex denetimiyle gelir.

| Paket | İçerik | Ürün sahibinden |
|---|---|---|
| 1A | İlk migration: `profiles`, `aquariums`, `aquarium_members`; tablo ve sütun izinleri, RLS, sahip üyeliğini yazan tetikleyici, değişmez alanlar, yaşam döngüsü (Issue #7'deki kurallar); Supabase taklidi; PGlite ile yetki matrisi testleri. Uygulama veritabanına bağlanmaz, `localStorage` ve `src/lib/aquarium-storage.ts` değişmez. | Bir şey istenmez |
| 1B | Hazırlık projesine gönderme iş akışı, gerçek Supabase'te katalog ve izin denetimleri ile gerçek istemciyle yetki senaryoları (3. madde), `.env.example` (yalnız adlar) | Supabase hesabı ve hazırlık projesi; sırları GitHub'a kendisi girer (adım adım anlatılır) |
| 1C | Giriş (`docs/SECURITY.md`'deki sıra: önce e-posta ve parola, sonra Google), hesap ekranları, canlı, bitki, ekipman, ölçüm ve bakım tabloları, yerel verinin hesaba aktarılması (`docs/DATABASE.md`); hesapsız kullanım sürer. Ekran taslakları kodlamadan önce ürün sahibine gösterilir. Apple ile giriş telefon uygulamasıyla gelir (Apple geliştirici hesabı gerekir) | Taslak onayı; Google giriş ayarı için Google hesabıyla birkaç adım |
| 1D | Katalogun sunucuya taşınması (`packages/knowledge`), bilgi geri bildirimi (artı/eksi, düzeltme önerisi) ve inceleme listesi | Kapsam onayı |

Gerçek kullanıcı hesabı açılmadan önce (yasal hazırlıkla birlikte, 0020'nin 11. adımı): yumuşak silinen akvaryumların temizleme işi, hesap kapatma ve sahiplik devri (Issue #7'de 1A dışı bırakılan işler).

## Değerlendirilen seçenekler

- **Docker Desktop ve BIOS'ta SVM:** Supabase'in önerdiği, gerçeğe en yakın yol; ama ürün sahibinin BIOS ayarı değiştirmesini ve Docker kurmasını ister, bu bilgisayarda yapılmadı. İleride açılırsa aynı migration'lar yerel yığında da çalışır; testler oraya taşınabilir.
- **Yalnız uzak geliştirme projesi:** her test ağ ve gizli anahtar ister, CI'ya proje sırrı girer, ücretsiz proje bir hafta kullanılmayınca durur, paylaşılan veriyle testler kırılgan olur.
- **Bilgisayarda gerçek PostgreSQL çalıştırmak:** kurucu ya da kurucusuz ZIP dağıtımıyla mümkün (postgresql.org/download/windows; `pg_ctl` ile hizmet kaydı olmadan başlatılabilir). Bedeli: ikili dosyaların sürümünü geliştirici makinesinde ve CI'da ayrı ayrı yönetmek, sunucuyu başlatıp durdurmak, port ve veri klasörü. Gerçek Postgres olduğu için eşzamanlı oturumları da sınar; PGlite ise her yerde aynı npm paketidir ve test sürecinin içinde açılır. Yarış durumları hazırlık projesinde sınanacağı için PGlite seçildi.
- **Supabase native runtime:** Windows'ta desteklenmiyor.

## Bedel ve azaltma

- PGlite belgelerinde "Alpha" olarak işaretli; yalnız test aracıdır. Bozulursa ya da sürüm farkı sorun çıkarırsa testler hazırlık projesine ya da Docker'lı yerel yığına taşınır; migration dosyaları değişmez.
- Taklit gerçek Supabase'in her ayrıntısını taşımaz. Azaltma: taklit küçük tutulur, gerçek projede 3. maddedeki katalog ve izin denetimleri ile yetki senaryoları çalıştırılır (1B), fark çıkarsa taklit ve gerekirse migration düzeltilir.

## Geri alma

`@electric-sql/pglite` kaldırılır, test dosyaları başka bir veritabanına bağlanır. Migration'lar ve RLS politikaları aynen kalır.

## Sonuçlar

- `docs/ARCHITECTURE.md`, `docs/DATABASE.md`, `docs/SECURITY.md` ve `AGENTS.md`'deki "yerel Supabase" ifadeleri bu kararla güncellendi: yerel doğrulama PGlite ve Supabase taklidiyle, ikinci doğrulama hazırlık projesinde.
- Issue #7'nin kapsamı 1A paketi olarak sürer; Docker şartı kalkar. Issue #7'nin Docker'a bağlı maddeleri değişir: `supabase db reset` yerine migration'lar her test dosyasında boş PGlite'a sırayla uygulanır; Supabase CLI ve sürüm paritesi denetimi 1B'de, gönderme iş akışıyla gelir; "yerel olmayan adrese karşı çalışmayı reddet" koruması gerekmez (veritabanı test sürecinin içindedir); `@supabase/supabase-js` ile istemci davranışı testleri 1B'de gerçek projede yapılır; ayrı `rls` CI işi yerine testler `pnpm verify` içindedir.
