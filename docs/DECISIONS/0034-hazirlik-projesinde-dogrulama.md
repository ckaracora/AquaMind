# 0034 — Hazırlık projesinde doğrulama (Phase 1B)

- Tarih: 2026-11-01
- Durum: Kabul edildi; ilk gerçek çalıştırma ürün sahibi hazırlık projesini açıp sırları girdikten sonra. İş akışı o güne kadar hiçbir şey yapmaz (yalnız elle başlatılır ve sır yoksa ilk adımda durur).
- Dayanak: karar 0032 (3. ve 4. madde), karar 0033 (1A şeması), `docs/SECURITY.md`.

## Ne geldi

- `.github/workflows/staging-db.yml` ("Hazırlık veritabanı"): yalnız elle başlatılır. Varsayılan denemedir (`supabase db push --dry-run`: gönderilecek migration'ları listeler, yazmaz). `apply` açıkken migration'ları gönderir, sonra doğrulama işini çalıştırır.
- `supabase/tests/catalog-checks.sql`: katalog ve izin denetimleri tek dosyada. Yerelde (`schema.test.ts`, PGlite) ve hazırlık projesinde (`psql`) aynı dosya çalışır; beklenmeyen durumda `AQ900` ile hangi denetimlerin düştüğünü yazar.
- `supabase/staging/client-scenarios.test.ts` ve `vitest.staging.config.mts` (`pnpm test:staging`): gerçek istemciyle yetki senaryoları. `pnpm verify`'a girmez (varsayılan Vitest yalnız `supabase/tests`'i okur); ortam değişkenleri yoksa açıkça hata verir.
- `supabase/config.toml`: Supabase CLI için en küçük yapılandırma (yerel yığın kullanılmaz).
- `@supabase/supabase-js` 2.118.0 yalnız geliştirme bağımlılığı, tam sürüm (2026-10-15'te yayımlandı; kilit dosyasına Supabase'in alt paketleri, `@supabase/phoenix` ve `iceberg-js` girdi). 1C'de uygulamanın istemcisi de olacak.

## Neden böyle

- **Gönderme Supabase'in belgelediği yolla:** `supabase/setup-cli` eylemi, `supabase link`, `supabase db push` (supabase.com/docs/guides/deployment/managing-environments). Eylem (v3.0.1, 2026-09-24; commit SHA'sıyla sabit) ve CLI (2.121.0, 2026-10-14) sabit sürümle; belgedeki `latest` kullanılmaz. Eylem CLI'yi kendi geçici klasöründe npm ile kurar (README ve kaynak kodu); CLI depo bağımlılığı olarak eklenmedi, deponun `allowBuilds` ayarı o kurulumu sınırlamaz. Bu yüzden eylem adımı hiçbir sır görmez (aşağıda).
- **Geçmiş:** CLI gönderilen migration'ları `supabase_migrations.schema_migrations` tablosunda tutar; sonraki gönderim uygulananları atlar (aynı belge). Hazırlık için yeni bir proje gerekir.
- **Gerçek istemci için `supabase-js`:** Supabase'in yeni anahtarlarıyla (`sb_publishable_…`, `sb_secret_…`) yönetici çağrılarının (test kullanıcısı oluşturma ve silme) ham HTTP biçimi belgelerde açık değil; anahtarlar `apikey` başlığında gider, `Authorization: Bearer` olarak gönderilmez (supabase.com/docs/guides/api/api-keys). Tahmin yerine resmî istemci kullanıldı.
- **Katalog denetimi `psql` ile, oturum havuzundan:** ücretsiz planda doğrudan bağlantı IPv6'dır, paylaşılan havuz IPv4'tür; havuz kullanıcı adı `postgres.<proje kimliği>`, sunucu adı bölgeden türetilemez, panelin "Connect" penceresinden kopyalanır (supabase.com/docs/guides/database/connecting-to-postgres). Bu yüzden sunucu adı ayrı bir değişkendir.

## Sırlar ve değişkenler

Hepsini ürün sahibi GitHub'da depo ayarlarına (Settings → Secrets and variables → Actions) kendisi girer. GitHub belgesine göre kişisel hesaptaki depoda depo düzeyindeki sırları ve değişkenleri ortak çalışanlar da oluşturabilir; ortam düzeyindekileri yalnız sahip (docs.github.com, "Using secrets in GitHub Actions"). Bu yüzden ortam değil, depo düzeyi kullanılır. Claude bu değerleri görmez, yazmaz, kopyalamaz.

| Ad | Tür | Nereden |
|---|---|---|
| `SUPABASE_ACCESS_TOKEN` | sır | Supabase hesap ayarları → erişim jetonları; yalnız hazırlık projesine kapsamlı, `supabase link` için Project Settings, API Keys ve API Key Secrets okuma izniyle |
| `STAGING_PROJECT_ID` | sır | panel adresindeki proje kimliği (`/dashboard/project/<kimlik>`) |
| `STAGING_DB_PASSWORD` | sır | proje oluşturulurken belirlenen veritabanı şifresi |
| `STAGING_PUBLISHABLE_KEY` | sır | Settings → API Keys, yayınlanabilir anahtar (`sb_publishable_…`) |
| `STAGING_SECRET_KEY` | sır | Settings → API Keys, bu iş akışına ayrılmış gizli anahtar (`sb_secret_…`) |
| `STAGING_POOLER_HOST` | değişken | Connect → Session pooler bağlantı metnindeki sunucu adı |

## Doğrulama işi

1. **Katalog ve izin denetimleri** (`catalog-checks.sql`): tablolar ve RLS, politika listesi, `anon`/`authenticated`/`service_role` tablo ve sütun izinleri, `PUBLIC` izni yokluğu, fonksiyon izinleri (`PUBLIC EXECUTE` yok), `security definer` listesi, sabit `search_path`, `auth.users` üzerindeki kayıt tetikleyicisi. Postgres sürümünü bilgi olarak yazar. Supabase'in yeni tablolara hazır verdiği izinler burada yakalanır.
2. **Gerçek istemciyle yetki senaryoları** (`pnpm test:staging`): yönetici istemcisiyle e-postası onaylı dört test kullanıcısı (`aquamind-staging-<çalıştırma>-<rol>@example.com`, rastgele parola, hiçbir yere yazılmaz) oluşturulur, yayınlanabilir anahtarla giriş yapar. Jetondaki rol `authenticated` olmalı. Profil, akvaryum ve üyelik için okuma, ekleme, değiştirme ve silmede beklenen izin ve ret (sahip, editör, izleyici, ilgisiz, anonim); yaşam döngüsü ve sunucunun 30 günlük süresi; değişmez sütun; sıfır hacim. Hata kodları yerel testlerle aynıdır (`42501`, `AQ003`, `AQ004`, `AQ005`, `23514`). Senaryolar ikinci bir sahip ve akvaryumla akvaryumlar arası sınırı ve farklı akvaryumlarda farklı rolü olan kullanıcının yetkisini de sınar (yerel testlerle aynı). Sonunda test kullanıcılarının akvaryumları ve kendileri silinir: her oluşturulan kullanıcı giriş başarısını beklemeden temizlik listesine yazılır, her silme denenir ve sonucu denetlenir, geride akvaryum ya da kullanıcı kalırsa çalışma başarısız olur. Temizlik hataları yalnız hata kodunu ya da istisna türünü, kurulumdaki iki PostgREST hatası kodla birlikte mesajını yazar; hiçbiri anahtar, parola ya da jeton içermez.

İki adım da geçerse taklidin farkı kapanmış sayılır (karar 0032) ve 1C başlayabilir. Biri düşerse fark önce taklitte ve gerekirse migration'da düzeltilir.

## İlk çalıştırmada doğrulanacaklar

Belgelerde açık olmayan ya da yerelde sınanamayan şeyler ilk denemede görülecek: en küçük `config.toml`'un yetip yetmediği; çalıştırıcıda `psql`'in bulunması (yoksa kurulur); özel SQLSTATE kodlarının PostgREST'ten `code` olarak gelmesi; hazırlık projesinin Postgres sürümü, Supabase'in hazır izinleri ve public şemasındaki gerçek nesne listesi (denetim tam liste bekler; yeni projede yalnız migration'ın nesneleri olmalı); başarılı ve başarısız adımların günlüklerinde hiçbir sır görünmemesi; kurulum ya da senaryo yarıda kalırsa temizliğin çalışması. (`setup-cli`'nin `version` girdisi README'de belgeli.) Sorun çıkarsa düzeltme ayrı küçük bir PR'la gelir.

## Güvenlik

- İş akışı hazırlık sırlarını ve hazırlık projesine kapsamlı erişim jetonunu (`SUPABASE_ACCESS_TOKEN`) okur; üretim projesi yok ve bu iş akışı ona bağlanamaz. Her sır yalnız onu kullanan adımın `env` alanında verilir; depo indirme, CLI, pnpm ve Node kurulumu, bağımlılık kurulumu ve `psql` kurulumu adımları sır görmez (GitHub'ın maskelemesi bir sürecin sırra erişmesini engellemez; docs.github.com, "Secure use reference"). Sırlar hiçbir adımda yazdırılmaz.
- Eylemler etiket yerine commit SHA'sıyla sabittir (yorumda etiket karşılığı); etiketin sonradan taşınması iş akışını değiştiremez.
- Gizli anahtar yalnız test kullanıcılarını oluşturup silmek ve sonda test akvaryumlarını temizlemek için kullanılır. Hazırlık projesinde gerçek kullanıcı yoktur (karar 0032).
- Veritabanı şifresi yalnız `link`/`db push` ve katalog denetimi için kullanılır.

## Geri alma

Hazırlık projesinde gerçek veri olmadığı için migration'ın geri alınması gerekirse `supabase/rollbacks/` altındaki SQL panelin SQL düzenleyicisinde ya da `psql` ile çalıştırılır ve `supabase_migrations.schema_migrations`'taki satır `supabase migration repair` ile düzeltilir. Depoda geri alma: iş akışı, `supabase/staging`, `vitest.staging.config.mts`, `supabase/config.toml` ve bağımlılık kaldırılır; uygulama etkilenmez.
