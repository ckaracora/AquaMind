# AquaMind mimarisi

Son güncelleme: 2026-09-03 (Issue #8 — yerel depolama bütünlüğü). Bu belge iki bölümden oluşur: **mevcut yapı** (depoda bugün olan) ve **hedef mimari** (planlanan, henüz uygulanmamış). Planlanan kısımlar tamamlanmış gibi gösterilmez.

## Mevcut yapı (Phase 0B sonrası)

Depo, kökünde çalışan Next.js 15 web uygulamasını barındıran bir pnpm çalışma alanıdır. Web uygulaması `apps/web` altına taşınmamıştır; bu ayrı ve onaylı bir görevdir (bkz. `docs/DECISIONS/0001-web-uygulamasi-kokte-kalir.md`).

| Yer | İçerik | Notlar |
|---|---|---|
| `src/` | Next.js App Router uygulaması, bileşenler, sağlayıcı, `localStorage` katmanı | Ürün davranışı Phase 0B'de değişmedi |
| `src/data/` | Canlı, ekipman ve bakım ürünü katalogları; içe aktarma anı bütünlük denetimleri | Yerinde kaldı, tek bayt değişmedi |
| `src/types/aquarium.ts` | Tip köprüsü: aynı adları `@aquamind/domain` üzerinden yeniden dışa aktarır | 13 tüketici değişmeden çalışır |
| `src/lib/health-analysis.ts` | Uyarlayıcı: kataloğu motora bağlar ve `analyzeAquarium`'u aynı imzayla dışa aktarır | Sağlık sayfası ve `scripts/test-health.cjs` bu yolu kullanır |
| `packages/domain` | `@aquamind/domain`: alan tipleri, Zod şemaları, tercihler, depo anahtarları ve günlük/arşiv şemaları, `LocalExportV1` | Şemalar uygulamada kullanılıyor: `src/lib/aquarium-storage.ts` yüklemeyi ve dışa aktarmayı bunlarla doğruluyor. Bu nedenle zod istemci paketine dahildir |
| `packages/compatibility-engine` | `@aquamind/compatibility-engine`: deterministik uyumluluk/sağlık motoru, `createAnalyzer(resolver)` | Kataloğu içe aktarmaz; bilgiye `KnowledgeResolver` ile ulaşır |
| `scripts/` | CommonJS doğrulama betikleri (katalog akışı, sağlık senaryoları, katalog denetimi) | Değişmedi; `pnpm verify` içinde kalır |
| `vitest.config.mts` | Vitest yapılandırması; `packages/**/*.test.ts` | `@` takma adı `src/` hedefler |
| `.github/workflows/verify.yml` | `pnpm verify`; yalnızca `main` dalına push'ta ve tüm pull request olaylarında tetiklenir (diğer dallara push tetiklemez) | Değişmedi |

### Bağımlılık yönü

```
src/app (Next.js sayfaları)
  └─► src/lib/health-analysis.ts  (uyarlayıcı)
        ├─► src/data/catalog.ts                   (bilgi: canlı ve ekipman profilleri)
        └─► @aquamind/compatibility-engine        (hesaplama; kataloğu bilmez)
              └─► @aquamind/domain (yalnızca tip)

src/types/aquarium.ts ─► @aquamind/domain (yalnızca tip; çalışma zamanında silinir)
scripts/*.cjs ─► src/data, src/lib/health-analysis.ts (kendi TS yükleyicileriyle)
```

Kural: paketler uygulamaya (`src/`) bağımlı olamaz. Uygulama paketlere bağımlıdır. Katalog bugün `src/data` içinde olduğu için motor kataloğa değil, uyarlayıcının verdiği çözümleyiciye bağlıdır.

### Tarayıcı deposu (yerel kullanıcı verisi)

> Bu bölüm Issue #8'in `codex/local-storage-integrity` dalındaki durumunu anlatır. Değişiklik Codex yeniden denetimi ve kullanıcı onayı bekliyor; `main` dalında henüz yoktur.

Kullanıcı verisi hâlâ tarayıcı `localStorage` alanındadır; anahtar adları ve JSON biçimi (`aquamind:*:v1`) geriye uyumluluk için değişmemiştir. `src/lib/aquarium-storage.ts` üç güvence sağlar (ayrıntı: `docs/DECISIONS/0006-yerel-depolama-butunlugu.md`):

- **Doğrulama ve karantina.** Yükleme `packages/domain` içindeki Zod şemalarıyla doğrulanır. Bozuk veya şemaya uymayan değer asla demo/varsayılan ile değiştirilmez; ham değer `<anahtar>:corrupt:<ISO>` altına kopyalanır ve birincil anahtar yalnızca kopya yazılabildiyse onarılır. Kısmen bozuk koleksiyonda geçerli satırlar korunur.
- **Kaydetme askısı ve aktif günlük koruması.** Normal `saveX()` çağrıları, modül içi askı bayrağı açıkken veya `aquamind:journal:v1` anahtarı varken fiziksel olarak yazamaz. Hidrasyon da askı altında yapılır; bu yüzden demo veri kalıcı olarak yazılmaz.
- **Günlüklü silme.** `localStorage` transaction desteklemediği için akvaryum silme yazma öncesi günlükle yapılır: günlük (tam yük) → silinen akvaryum paketi (30 gün saklanır) → altı koleksiyon → günlük silinir. Yarıda kesilirse sonraki açılışta toparlama tamamlar; bağlı kayıtlar sessizce kaybolmaz.

Ayarlar sayfasındaki JSON yedeği yapılandırılmıştır: ana koleksiyonlar yalnızca geçerli ve yetim olmayan kullanıcı verisini taşır; yetim kayıtlar, karantina değerleri ve silinen akvaryum paketleri ayrı bölümlerdedir. Aynı sayfada, kayıt içeriği göstermeyen bir kurtarma/karantina özeti bulunur.

### Paketlerin yayım biçimi

- Paketler derlenmiş çıktı değil TypeScript kaynağı yayımlar (`main`, `types`, `exports` → `./src/index.ts`).
- Next.js bunları `next.config.ts` içindeki `transpilePackages` ile derler.
- Doğrulama betikleri, pnpm'in `node_modules/@aquamind/*` sembolik bağı ve kendi `.ts` kancaları üzerinden aynı kaynağı okur.
- Kök `tsconfig.json` include deseni (`**/*.ts`) paketleri de kapsar; `tsc --noEmit` tüm çalışma alanını denetler.

### Araç zinciri ve kilit dosyası politikası

- Node 24, pnpm 11.11.0. `package.json` içindeki `packageManager` alanı CI'daki (`pnpm/action-setup`, `version: 11.11.0`) sürümle aynıdır; farklı olsaydı CI hata verirdi.
- Varsayılan kurulum: `pnpm install --frozen-lockfile`.
- Yeni bir workspace paketi veya bağımlılık eklerken kilit dosyası **bir kez** `pnpm install` ile yenilenir, ardından frozen kurulumla tutarlılık doğrulanır. Phase 0B'de bu üç kez yapıldı: `@aquamind/domain` + `zod`, `vitest`, `@aquamind/compatibility-engine`.
- `engines` alanı eklenmedi: Vercel Node sürümünü bu alandan seçer ve bu aşamada yayın doğrulanamaz.

### Doğrulama

```bash
pnpm verify
```

Sırasıyla: `tsc --noEmit`, `scripts/test-catalog-flow.cjs`, `scripts/test-health.cjs`, `scripts/audit-catalog.cjs`, `vitest run`, `next build`. Vitest paketi testleri `pnpm test` ile ayrıca çalıştırılabilir. Motorun değişmezliği `packages/compatibility-engine/test/golden.test.ts` ile 604 vakalık altın fikstüre karşı denetlenir (bkz. `docs/COMPATIBILITY.md`).

## Hedef mimari (planlanan)

Aşağıdakiler karar verilmiş yön, uygulanmış iş değildir.

### Platformlar

- **Web**: mevcut Next.js uygulaması. Mobil uygulama oluşturulduğunda (Phase 2) tek bir mekanik PR ile `apps/web` altına taşınır.
- **Mobil (iOS, Android)**: `apps/mobile` altında Expo ile React Native; `@aquamind/domain` ve `@aquamind/compatibility-engine` paketlerini kullanır. Phase 2.
- **Yönetici**: `apps/admin` altında ayrı, sunucu tarafında render edilen Next.js uygulaması; service role yalnızca sunucuda. Phase 3.

### Arka uç adayı: Supabase

PostgreSQL, Auth, Storage, Realtime ve Edge Functions tek sağlayıcıda. Yetkilendirme veritabanı düzeyinde (RLS) yapılır. Şema yalnızca `supabase/migrations/` altındaki sürümlü dosyalarla değişir. Ayrıntı: `docs/DATABASE.md`, `docs/SECURITY.md`, `docs/DECISIONS/0003-supabase-postgres-adayi.md`. Phase 0B'de hiçbir Supabase projesi oluşturulmadı veya bağlanmadı.

### Paket haritası (hedef)

| Paket | Durum | Amaç |
|---|---|---|
| `packages/domain` | Var | Alan tipleri, doğrulama şemaları, dışa/içe aktarma biçimleri |
| `packages/compatibility-engine` | Var | Deterministik puanlama; sürümlü kural seti |
| `packages/knowledge` | Planlanan (Phase 2) | Kataloglar `src/data`'dan buraya taşınır; açık katalog dalları birleştikten sonra |
| `packages/ui`, `packages/localization`, `packages/ai` | Planlanan (Phase 2–3) | İhtiyaç doğduğunda, boş paket açılmaz |
| `supabase/` | Planlanan (Phase 1) | Migration, fonksiyon ve politika dosyaları |

### Ortamlar

- `development`: yerel Supabase (CLI, Docker) ve `.env.local` (git dışı). Depoda yalnızca `.env.example` (adlar, değer yok).
- `staging`: ayrı Supabase projesi, Vercel önizleme ortamı.
- `production`: ayrı Supabase projesi; yalnızca kullanıcı onayıyla ve migration üzerinden değişir. Yapay zekâ araçları üretim verisine bağlanmaz.

### Gözlemlenebilirlik

Sentry (web, mobil, fonksiyonlar; sürüm etiketli), Supabase logları, ürün analitiği için PostHog veya eşdeğeri, `ai_requests` ve `admin_audit_log` tabloları. Web'de Sentry Phase 1 başında; geri kalanı veriyi üreten özelliklerle birlikte.

### Yapay zekâ geçidi

İstemci hiçbir zaman sağlayıcıyla konuşmaz. Kimliği doğrulanmış sunucu uç noktası, kullanıcının erişebildiği akvaryum verisinden bağlam kurar, sunucuda tutulan anahtarla sağlayıcıyı çağırır, yanıtı doğrular, üst veriyi kaydeder. Uyumluluk puanı yapay zekânın girdisidir, çıktısı değildir. Phase 3.

### Çevrimdışı yön

Web'de `localStorage` hesap öncesi dönemde birincil depo olarak kalır; hesaplar geldiğinde okuma önbelleğine dönüşür. Mobilde expo-sqlite önbellek ve ertelenmiş yazımlar için giden kutusu; çakışma tespiti `updated_at` + `version` sütunlarıyla, V1 politikası satır başına son yazan kazanır. Phase 2.

### Ölçek hedefi

1k–10k kullanıcı için en yalın çözüm; 100k+ için mimari değişikliği gerektirmeyen yol (bağlantı havuzu, okuma kopyaları, daha büyük hesaplama). Kubernetes, Kafka, Redis, mikroservis ve GraphQL katmanı ölçülmüş bir ihtiyaç olmadan eklenmez. Bu hedefler ölçüm değil tasarım hedefidir; yük testi yapılmadan "destekliyor" iddia edilmez.

## Phase planı

| Phase | İçerik | Durum |
|---|---|---|
| 0A | Depo denetimi ve mimari plan | Tamamlandı (2026-09-01) |
| 0B | Workspace, `packages/domain`, `packages/compatibility-engine`, Vitest, belgeler, yönetişim | Bu belge; yerelde tamamlandı, Codex incelemesi bekliyor |
| 1 | Yerel Supabase, çekirdek şema ve RLS, politika testleri, kimlik doğrulama (e-posta, Google), yerel veri içe aktarımı, plan/olay ayrımı, kalıcı uyumluluk hesaplamaları, staging | Planlanan |
| 2 | Expo uygulaması, web'in `apps/web` altına taşınması, `packages/knowledge`, çevrimdışı önbellek | Planlanan |
| 3 | Sosyal, yapay zekâ geçidi, AquaMap, abonelikler, yönetici uygulaması | Planlanan |

## Phase 0B'de bilinçli olarak yapılmayanlar

Ürün özelliği, kimlik doğrulama, RLS, Supabase bağlantısı, mobil veya yönetici uygulaması, katalog taşıma, `aquarium-storage.ts` değişikliği, `localStorage` anahtarlarının merkezileştirilmesi, motor sonuç nesnesine yeni alan (sürüm veya bulgu kodu), `engines` alanı, i18n çatısı, `next lint` düzeltmesi, panodaki sabit yer tutucuların kaldırılması. Bu son maddeler ayrı issue olarak ele alınır.
