# AquaMind veritabanı evrim planı

Son güncelleme: 2026-09-02. **Durum: tasarım.** Bu belgede anlatılan hiçbir tablo, migration veya Supabase projesi henüz oluşturulmamıştır. Phase 1'in çalışma taslağıdır; uygulama sırasında `supabase/migrations/` altındaki dosyalar gerçek kaynak olur ve bu belge onlara göre güncellenir.

## İlkeler

- İlişkisel, sorgulanabilir, tarihsel olarak anlamlı, denetlenebilir, kaynak izli, gerektiğinde sürümlü ve analitik dostu bir PostgreSQL şeması.
- Çekirdek ilişkiler açık sütun ve yabancı anahtarlarla tutulur; JSONB yalnızca gerçekten esnek yapılar (hesaplama anlık görüntüsü, bulgular) için kullanılır.
- Geçmiş akvaryuma aittir: canlı, bitki, ekipman, ölçüm, bakım ve sahiplik kayıtları silinmez, durumla kapatılır.
- Her kullanıcı verisi tablosu, tabloyu oluşturan migration'da RLS politikalarıyla birlikte gelir (bkz. `docs/SECURITY.md`).
- Mevcut `sourceUrl` ve `verifiedAt` değerleri olduğu gibi taşınır; güven veya doğrulama durumu uydurulmaz.

## Yol 1: bilgi (kataloglar)

Mevcut: `src/data/` altında TypeScript dizileri (228 canlı, 1557 ekipman, 507 bakım ürünü); içe aktarma anında doğrulanır, `scripts/` testleriyle sabitlenir, her kayıtta `sourceUrl` ve `verifiedAt`.

Hedef: yayımlanmış bilgi deposu olarak Postgres tabloları. Yönetici inceleme akışı gelene kadar TypeScript dosyaları yazım kaynağı olarak kalır; veritabanı onlardan üretilir.

Önerilen tablolar:

- `brands(id, name, normalized_name)`
- `species(id, slug, scientific_name, category, group, adult_size_cm, min_volume_l, min_tank_length_cm, min_group, temp_min, temp_max, ph_min, ph_max, flow, waste_factor, predatory, species_only, version, published_at)`
- `species_texts(species_id, locale, common_name, aliases[], community_caution, husbandry_caution)`
- `equipment_models(id, slug, brand_id, category, model, rated_flow_lph, power_w, recommended_min_l, recommended_max_l, adjustable_flow, requires_air_pump, tank_length_min_cm, tank_length_max_cm, integrated_heater_w, integrated_uvc_w, version, published_at)`
- `equipment_texts(equipment_id, locale, specifications, capacity_data_note)`
- `care_products(id, slug, brand_id, category, model, version, published_at)` ve `care_product_texts(care_product_id, locale, description)`
- `sources(id, url, host, kind)`; `kind`: `manufacturer`, `distributor`, `retailer`, `reference`, `template`
- `record_sources(record_type, record_id, source_id, verified_at, verified_by, method)`; `method`: `manual`, `legacy_import`
- `knowledge_releases(id, version, released_at, notes)`: bir motor sonucu hangi bilgi sürümünü kullandığını gösterebilsin

Koruma kuralları:

- `sourceUrl` ve `verifiedAt` değerleri `record_sources` içine değiştirilmeden kopyalanır; `verified_by` boş, `method = legacy_import`.
- Koddaki şablonla üretilmiş canlı kaynakları (bilimsel addan türetilen FishBase adresleri, 83 kayıt) `kind = template` alır; değer değişmez, fark görünür olur.
- Liste veya kategori sayfasına bağlanan bakım ürünü kaynakları (309 kayıt) olduğu gibi taşınır; yeniden doğrulama ayrı bir katalog görevidir. Bu kayıtların motorda "doğrulanmış" sayılmaya devam edip etmeyeceği ürün sahibinin kararıdır.
- Slug'lar mevcut kimliklere eşit tutulur; kullanıcı kayıtlarındaki `catalogId` çözümlenmeye devam eder.
- İçe aktarım, TypeScript kataloglarını okuyup SQL tohum dosyaları yazan bir betiktir. Mevcut sabitleme testleri TypeScript kaynağına karşı çalışmaya devam eder; bir gidiş-dönüş testi tohumlanan veritabanının aynı değerleri ürettiğini doğrular.
- Motor testleri veritabanına ihtiyaç duymaz; motor sürüm etiketli bir bilgi anlık görüntüsü tüketir.

## Yol 2: kullanıcı verisi (bugün `localStorage`)

Mevcut: yedi `aquamind:*:v1` anahtarı (altısı bütün dizi, biri tercihler); sahip yok, kalıcı silmeler; ayarlar sayfası `LocalExportV1` biçiminde JSON dışa aktarımı üretir (`packages/domain/src/local-export.ts`).

Hedef şema (hepsinde `created_at`, `updated_at` ve RLS):

- `profiles(user_id, nickname, display_name, locale)`
- `aquariums(id, owner_id, name, type, length_cm, width_cm, height_cm, net_volume_l, setup_date, description, visibility, status active|soft_deleted, deleted_at, purge_after)`
- `aquarium_members(aquarium_id, user_id, role owner|editor|viewer, invited_by, joined_at)`
- `aquarium_ownership_transfers(id, aquarium_id, from_user_id, to_user_id, status, requested_at, completed_at)` — denetim izi
- `livestock(id, aquarium_id, species_id, quantity, gender, status active|removed|transferred|sold|died, added_at, ended_at, notes, added_by)`
- `livestock_events(id, livestock_id, kind, quantity_delta, occurred_at, note, recorded_by)` — adet ve durum değişiklikleri, orijinal satır kaybolmadan
- `plants(id, aquarium_id, name, scientific_name, quantity, position, status, added_at, ended_at)`
- `equipment(id, aquarium_id, equipment_model_id, brand, model, category, installed_at, removed_at, status, notes)`
- `measurements(id, aquarium_id, session_id, measured_at, parameter, value, unit, source manual|sensor|import, device_id, recorded_by)` — uzun biçim: parametre başına bir satır, `session_id` "tek test oturumu" anlamını korur
- `maintenance_schedules(id, aquarium_id, type, title, interval_days, amount_percent, amount_liters, next_due_at, active)`
- `maintenance_events(id, aquarium_id, schedule_id, type, title, performed_at, amount_percent, amount_liters, notes, performed_by)`
- `photos(id, aquarium_id, subject_type, subject_id, storage_path, taken_at, uploaded_by)`
- `compatibility_calculations(id, aquarium_id, engine_version, ruleset_version, knowledge_version, input_snapshot jsonb, score, subscores jsonb, findings jsonb, calculated_at, calculated_by)`
- Gelecek, şemayla uyumlu: `devices`, `sensors`, `device_assignments`; `measurements.source = sensor` zaten tanımlı

Neden plan ve olay ayrı: "her 7 günde %25 su değişimi" bir plandır (`maintenance_schedules`); "1 Eylül'de %30 su değişimi yapıldı" bir olaydır (`maintenance_events`). Bugünkü `MaintenanceTask` ikisini tek kayıtta tutar ve tamamlanan tekrarlı görev sonraki tekrarı üretmez; bu ayrım Phase 1'de veri geçişiyle gelir.

### Bugünkü `localStorage`'dan eşleme

| Bugün | Hedef | Kural |
|---|---|---|
| `Aquarium` | `aquariums` + `aquarium_members(owner)` | Sahip, içe aktaran kullanıcı |
| `WaterParameters` satırı | Aynı `session_id`'yi paylaşan N `measurements` satırı | Boş olmayan her parametre bir satır; `source = import` |
| `completedAt` taşıyan `MaintenanceTask` | `maintenance_events` | `performed_at = completedAt` |
| `recurrenceDays` taşıyan, tamamlanmamış `MaintenanceTask` | `maintenance_schedules` | `next_due_at = dueAt` |
| Tek seferlik, tamamlanmamış `MaintenanceTask` | `interval_days = null` ile `maintenance_schedules` | |
| `Livestock` | `status = active` ile `livestock` | `species_id` `catalogId`'den, yoksa ad eşleşmesinden, yoksa eşleşmedi bayrağı |
| `Plant`, `Equipment` | `plants`, `equipment` | Doğrudan |
| Tohum kimlikleri (`aqua-1`, `w1`, `m1`, `l1`, `p1`, `e1`) | Kullanıcı açıkça istemedikçe atlanır | Demo veri gerçek veri olmamalı |
| Akvaryumu olmayan alt kayıtlar | Atlanır ve raporlanır | Bugünkü kalıcı silme bunları yetim bırakabiliyor |

### Geçiş adımları

1. **Phase 0B (tamamlandı):** dışa aktarım biçimi `LocalExportV1` olarak Zod şeması ve testle tanımlandı. Uygulama davranışı değişmedi.
1b. **Issue #8 (Codex yeniden denetimi bekliyor — `codex/local-storage-integrity` dalında, `main` içinde değil):** yerel veri yüklemede doğrulanıyor; bozuk değerler karantinaya alınıyor, demo veri kalıcı yazılmıyor ve akvaryum silme günlükle yapılıp bağlı kayıtları yetim bırakmıyor. Dışa aktarım bölümlendi: ana koleksiyonlar yalnızca geçerli ve yetim olmayan kullanıcı verisini, ayrı bölümler ise yetimleri, karantina değerlerini ve 30 gün saklanan silinmiş akvaryum paketlerini taşıyor. İçe aktarma bunun üç sonucunu dikkate almalıdır: (a) ana koleksiyonlar doğrudan aktarılabilir, (b) `orphans` bölümü kullanıcıya sorulmadan aktarılmaz, (c) `quarantine` bölümü ham metindir ve otomatik aktarılmaz. Ayrıntı: `docs/DECISIONS/0006-yerel-depolama-butunlugu.md`.
2. **Phase 1:** girişten sonra "yerel verileri içe aktar" akışı dışa aktarımı okur, doğrular, eşler, RLS altında normal API üzerinden yazar; içe aktarılan, atlanan ve eşleşmeyen kayıtları raporlar. Kullanıcı onaylayana kadar `localStorage` dokunulmadan kalır.
3. **Phase 2:** web'de `localStorage` okuma önbelleği, mobilde expo-sqlite; giden kutusu ve `updated_at` + `version` ile çakışma tespiti.
4. **Doğrulama:** tarayıcı fikstüründen yerel Supabase'e ve geri gidiş-dönüş testi; RLS politika matrisi aynı pakette.

## Migration ve ortam kuralları

- Şema yalnızca `supabase/migrations/` altındaki sürümlü dosyalarla değişir; Supabase panelinden veya SQL editöründen üretimde doğrudan değişiklik yapılmaz.
- Her migration önce yerel Supabase üzerinde, sonra staging'de çalıştırılır; üretim yalnızca kullanıcı onayıyla.
- Yapay zekâ kodlama araçları üretim kimlik bilgisi almaz ve üretim verisine bağlanmaz.
