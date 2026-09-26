# AquaMind proje durumu

Son güncelleme: 2026-09-24

## Doğrulanmış temel

- GitHub: `https://github.com/ckaracora/AquaMind`
- Ana dal: `main` (uzak ucu `7b60ffb1eb01fa3e125e4a27b9dd9295b0e1d3aa`, PR #10 squash merge, 2026-09-03). Yerel `main` 2026-09-24'te `origin/main` ile aynı
- Başlangıç commit'i: `7d8fb01 fix: approve sharp build dependency`
- Canlı uygulama: `https://aqua-mind-three.vercel.app/` (Phase 0B ve Issue #8 değişikliklerini içeriyor; en son `7b60ffb` (PR #10, yalnızca belge) için Vercel üretim dağıtımı 2026-09-03'te `success` durumuyla tamamlandı ve site 2026-09-24'te HTTP 200 döndürdü. Katalog entegrasyonu henüz canlıda değil. Tarayıcıda arayüz kontrolü ayrıca yapılmadı)
- Görev panosu: `https://github.com/users/ckaracora/projects/1`
- Teknoloji: Next.js 15, React 19, TypeScript, Tailwind CSS, pnpm 11.11.0 çalışma alanı, Vitest
- `pnpm verify`: 2026-09-24 tarihinde `codex/catalog-integration` dalında (taban `7b60ffb`, katalog birleştirmesi commit edilmeden önce) yerelde başarılı: tip denetimi, katalog akışı (1027 bakım ürünü), 52 sağlık senaryosu, hesaplayıcılar, katalog denetimi, 118 Vitest testi (selamlama değişikliği dahil), üretim derlemesi; Corepack üzerinden pnpm 11.11.0 ile (`corepack pnpm verify`). GitHub Actions `Doğrulama` en son PR #10 üzerinde ve `7b60ffb` `main` push'unda başarılı (çalıştırma `33711373282`)
- Arkadaş kurulumu: `buraksenfx` hesabı collaborator; Windows kopyasında kurulum ve tüm doğrulamalar başarılı

## Mevcut veri durumu

- Kataloglar `src/data/` altında sürüm kontrollü TypeScript verisidir; Phase 0B'de değişmedi. Katalog entegrasyonuyla (aşağıda; henüz `main` dalında değil) 417 canlı, 3009 ekipman ve 1027 bakım ürününe genişliyor; katalog çalışma günlüğü `docs/CATALOG_LOG.md` içinde.
- Akvaryumlar, ölçümler, bakım, canlılar, bitkiler ve ekipmanlar şimdilik tarayıcı `localStorage` alanında saklanır. Issue #8 ile depolama katmanı doğrulama, karantina, kaydetme askısı ve günlüklü silme kazandı; `aquamind:*:v1` anahtar adları ve JSON biçimi değişmedi.
- Alan tipleri `packages/domain` içinde tanımlıdır; uygulama `src/types/aquarium.ts` köprüsüyle aynı adları kullanır. Zod şemaları, tercihler ve `LocalExportV1` artık uygulamada da kullanılır (yükleme doğrulaması ve dışa aktarma).
- Kullanıcı hesabı, bulut senkronizasyonu ve gerçek veritabanı henüz yoktur.
- Supabase geçişi gelecek aşamadır; tasarım `docs/DATABASE.md` içindedir, hiçbir Supabase projesi oluşturulmadı veya bağlanmadı.

## Ortak çalışma kurulumu

- [x] GitHub collaborator eklendi
- [x] Proje arkadaşın Windows bilgisayarına klonlandı
- [x] Bağımlılıklar kuruldu ve `pnpm verify` geçti
- [x] Ortak talimat belgeleri hazırlandı ve GitHub'a gönderildi
- [x] GitHub görev şablonları, devir sistemi, etiketler ve ortak görev panosu etkinleştirildi
- [x] GitHub Actions otomatik doğrulaması (Issue #2): PR #3 ile 2026-08-26'da `main` dalına birleştirildi; PR #5 ve `main` push'u üzerinde başarıyla çalıştığı 2026-09-02'de doğrulandı
- [x] Phase 0B mimari temel (Issue #4): tamamlandı; PR #5 squash merge ile `main` dalına birleştirildi (`7e8d63b`), Issue #4 kapandı (aşağıda)
- [x] localStorage veri bütünlüğü (Issue #8): tamamlandı; PR #9 squash merge ile `main` dalına birleştirildi (`76cabd2`), Issue #8 kapandı (aşağıda)
- [ ] Katalog genişletmesi (Canberk'in `codex/catalog-capacity-batch` dalı, `950a70f`): `codex/catalog-integration` dalında `main` ile birleştirildi ve yerelde doğrulandı; commit, Codex denetimi, pull request ve kullanıcı onayı bekliyor (aşağıda)
- [ ] Uyumluluk denetimi (2026-09-24) bulgularının düzeltilmesi (aşağıda)
- [ ] Ortak katalog araştırma tablosu şimdilik ertelendi; katalog verisi sürüm kontrollü dosyalar ve kaynak bağlantılarıyla ilerliyor (Canberk'in katalog dalındaki durum)
- [ ] Supabase tasarımı ve geçişi: tasarım belgesi hazır (`docs/DATABASE.md`, `docs/SECURITY.md`), uygulama Phase 1
- [x] İki bilgisayarlı devir provası tamamlandı (Canberk'in katalog dalındaki durum belgesinde işaretlendi)

## Phase 0B — Mimari temel (Issue #4, tamamlandı)

- Issue: `https://github.com/ckaracora/AquaMind/issues/4`
- Dal: `codex/phase-0b-foundation` (taban `242f899`); PR #5 (`https://github.com/ckaracora/AquaMind/pull/5`) ile squash merge edildi; `main` commit'i `7e8d63b6ff032f18e142490d2f307b4fe15a202d`
- Durum: tamamlandı (2026-09-02). Sıra: Codex denetimi (2 bulgu giderildi) → PR #5 açıldı → GitHub Actions `Doğrulama` PR üzerinde başarılı → kullanıcı onayıyla squash merge → `main` push'unda `Doğrulama` yeniden başarılı → Vercel üretim dağıtımı tamamlandı → Issue #4 otomatik kapandı
- Yerel depo: `main` dalı `origin/main` ile senkronize edildi (`7e8d63b`); `codex/phase-0b-foundation` dalı yerelde ve uzakta korunuyor; bu durum kapanışı `codex/project-status-closeout` dalında hazırlandı ve GitHub'a gönderildi
- Codex denetimi bulguları ve giderilmesi: (1) `docs/ARCHITECTURE.md` içindeki CI tetikleyici ifadesi gerçek workflow ile uyumlu hale getirildi (yalnızca `main` dalına push ve tüm pull request olayları); workflow değiştirilmedi. (2) Sürüm paritesi doğrulandı: `package.json` `packageManager` ve workflow pnpm sürümü `11.11.0`, Node 24; `corepack pnpm --version` tam olarak 11.11.0 verdi ve `corepack pnpm verify` başarılı. Sürümler, lockfile ve workflow değiştirilmedi.
- Yapılanlar:
  - `package.json` → `packageManager: pnpm@11.11.0` (CI'daki `pnpm/action-setup` sürümüyle aynı; kaynak kodu doğrulandı, farklı olsaydı hata verirdi)
  - pnpm çalışma alanı: `pnpm-workspace.yaml` → `packages/*` (`allowBuilds` korundu)
  - `packages/domain`: alan tipleri (byte-birebir kopya), Zod 4.5.4 şemaları, tip/şema eşdeğerlik denetimleri, `LocalExportV1`, 10 test
  - `packages/compatibility-engine`: motor gövdesi `src/lib/health-analysis.ts` içinden programatik olarak taşındı (altı çözümleyici değişimi dışında birebir), `createAnalyzer(resolver)` sınırı, `ENGINE_VERSION`/`RULESET_VERSION` ayrı sabitler, sonuç nesnesi değişmedi
  - `src/lib/health-analysis.ts` uyarlayıcıya dönüştü; `analyzeAquarium` imzası korundu; sağlık sayfası ve `scripts/test-health.cjs` değişmedi
  - Vitest 4.1.11: `vitest.config.mts`, `pnpm test`, `pnpm verify` içine `vitest run` (betiklerden sonra, derlemeden önce)
  - 604 vakalık altın fikstür motor taşınmadan önce alındı (`packages/compatibility-engine/test/fixtures/golden-v1.json`); taşınan motor bu fikstürle bayt bayt aynı
  - Belgeler: `docs/ARCHITECTURE.md`, `docs/DATABASE.md`, `docs/SECURITY.md`, `docs/COMPATIBILITY.md`, `docs/DECISIONS/0001–0004`; `README.md` ve `docs/PROJECT.md` güncellendi
  - `AGENTS.md`: yalnızca sona ekleme ("Mimari yönetişim"; 77 satır eklendi, 0 satır silindi); `CLAUDE.md` okuma listesi genişletildi
- Kilit dosyası: frozen olmayan `pnpm install` üç kez, her biri yeni bir workspace paketi veya bağımlılık için (domain + zod; vitest; compatibility-engine). Her seferinde ardından `pnpm install --frozen-lockfile` ile tutarlılık doğrulandı.
- Dokunulmayanlar: `src/data/**`, `scripts/**`, `.github/**`, `src/app/**`, `src/components/**`, `src/providers/**`, `src/lib/aquarium-storage.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `.gitignore`, `docs/DATA_SOURCES.md`, `docs/HANDOFF.md`, `CONTRIBUTING.md`
- Paket boyutu: ilk yükleme JS değişmedi (sağlık 189 kB, ekipman 187 kB, canlı 188 kB, ortak 102 kB)
- Bilinen riskler: Vercel önizleme (PR #5) ve üretim (`main`) dağıtımları `packageManager` ve `transpilePackages` ile başarıyla derlendi; bu risk kapandı. `scripts/test-health.cjs` Vitest içinde alt süreç olarak da çalıştığı için `pnpm verify` bu betiği iki kez çalıştırır (yaklaşık 2 sn). GitHub, `actions/checkout@v4`, `actions/setup-node@v4` ve `pnpm/action-setup@v4` için Node 20 kullanımdan kaldırma uyarısı gösteriyor; başarısızlık değil, action sürümlerinin güncellenmesi ayrı bir görev.
- Ayrı issue adayları (Phase 0B dışında bırakıldı): panodaki sabit yer tutucular, `next lint`, `AGENTS.md` "Zorunlu doğrulama" açıklamasına Vitest'in eklenmesi, `engines` alanı, GitHub Actions action sürümlerinin güncellenmesi (Node 20 uyarısı). `aquarium-storage.ts` içindeki yetim alt kayıt ve bozuk anahtar davranışları Issue #8 ile giderildi.

## Issue #8 — localStorage veri bütünlüğü (tamamlandı)

- Issue: `https://github.com/ckaracora/AquaMind/issues/8`
- Dal: `codex/local-storage-integrity` (taban `258b600`); PR #9 (`https://github.com/ckaracora/AquaMind/pull/9`) ile squash merge edildi; `main` commit'i `76cabd2f7fe5aab3a03b1bce4a7dd1d8f4dee8fa`
- Durum: tamamlandı (2026-09-03). Sıra: Codex denetimi (dört tur, sonuncusu temiz) → görev dalı GitHub'a gönderildi → PR #9 açıldı → GitHub Actions `Doğrulama` pull request üzerinde başarılı → kullanıcı onayıyla squash merge (`76cabd2`) → `main` push'unda `Doğrulama` yeniden başarılı → Vercel üretim dağıtımı `success` → Issue #8 otomatik kapandı (2026-09-03 02:33 UTC, PR gövdesindeki `Closes #8` ile)
- Merge sonrası doğrulamalar: `main` push'u için `Doğrulama` çalıştırması `33708095377` başarılı (iş `pnpm verify`: success); `76cabd2` için Vercel birleşik durumu `success` ("Deployment has completed"); canlı site `https://aqua-mind-three.vercel.app/` HTTP 200 döndürdü ve Issue #8 değişikliklerini içeren `76cabd2` derlemesini sunuyor
- Yerel depo: `main` dalı `git pull --ff-only` ile `origin/main` ile senkronize edildi (`76cabd2`); `codex/local-storage-integrity` dalı yerelde ve uzakta korunuyor (silinmedi); bu durum kapanışı `codex/issue-8-closeout` dalında hazırlandı, commit edildi ve `origin/codex/issue-8-closeout` olarak GitHub'a push edildi. Pull request açılmadı ve `main` birleştirmesi yapılmadı
- Phase 1A (Issue #7) **hâlâ beklemede**: bu Windows bilgisayarında Docker Desktop kurulu değil ve sanallaştırma BIOS/UEFI'de kapalı (Gigabyte B450M H: `Del` → `F2` → M.I.T. → Advanced CPU Core Settings → **SVM Mode**). BIOS ayarı kullanıcı tarafından açılmadan yerel Supabase başlatılamaz. Issue #7'nin dalına, issue'suna ve planına dokunulmadı
- Yapılanlar:
  - Adım 0: kod değişmeden koruyucu (regresyon) testleri yazıldı; geçerli veri gidiş-dönüşü, eksik anahtarda fallback, sunucu tarafı davranışı, anahtar adları, bilinmeyen ek alanların korunması ve `calculateGrossVolume` sabitlendi. `vitest.config.mts` include deseni `src/**/*.test.ts` kapsayacak şekilde genişletildi; yeni test bağımlılığı eklenmedi
  - Güvenli yükleme: altı koleksiyon ve tercihler `packages/domain` Zod şemalarıyla doğrulanıyor. Bozuk değer demo/varsayılan ile ASLA üzerine yazılmıyor; ham değer `<anahtar>:corrupt:<ISO>` altına kopyalanıyor ve birincil anahtar yalnızca kopya yazılabildiyse onarılıyor. Kısmen bozuk koleksiyonda geçerli satırlar korunuyor; doğrulamadan geçen satırlar orijinal nesneler olduğu için bilinmeyen ek alanlar kaybolmuyor
  - Demo veri artık kalıcı yazılmıyor: hidrasyon kaydetme askısı altında çalışıyor. Halihazırda depolanmış tohum kayıtları kullanıcı verisi sayıldı; silinmedi veya yeniden sınıflandırılmadı
  - Kaydetme askısı üç katmanlı: (1) depolama modülünde askı sayacı, (2) `aquamind:journal:v1` anahtarının varlığı — aktif günlük varken normal kaydetmeler fiziksel olarak yazamıyor, başka sekmenin araya girmesi engelleniyor, (3) sağlayıcıda `useRef` koruması. Askı, altı kaydetme efektinden sonra tanımlanan serbest bırakma efektiyle kalkıyor
  - Günlüklü silme: `localStorage` transaction desteklemediği için sıra günlük (tam yük) → silinen akvaryum paketi → altı koleksiyon → günlük silinir. Günlük yazılamazsa silme reddediliyor ve hiçbir şey değişmiyor. Açılışta yarım kalan günlük toparlanıyor; adımlar yinelenebilir. Bozuk günlükte aktif veriye dokunulmuyor, ham değer karantinada korunuyor
  - Akvaryum silme artık bağlı ölçüm, bakım, canlı, bitki ve ekipman kayıtlarını da kaldırıyor; yetim kayıt oluşmuyor. Silinen paket 30 gün saklanıyor, süresi dolanlar yüklemede temizleniyor
  - Mevcut yetim kayıtlar otomatik silinmiyor; sayılıyor ve raporlanıyor
  - Dışa aktarma bölümlendi: ana koleksiyonlar yalnızca geçerli ve yetim olmayan kullanıcı verisi; yetimler, karantina ham değerleri ve silinen paketler ayrı ve etiketli bölümlerde. `LocalExportV1` sürüm 1 olarak kaldı (yeni bölümler isteğe bağlı), eski yedekler geçerli
  - Ayarlar sayfası: tercihler ortak güvenli yükleyiciden geçiyor, doğrudan `JSON.parse` kaldırıldı, bozuk tercih varsayılanla üzerine yazılmıyor. Kayıt içeriği göstermeyen kurtarma/karantina özeti eklendi
  - `packages/domain`: `preferences.ts` (tip, şema, varsayılanlar) ve `local-storage.ts` (anahtar adları, silinen paket ve günlük şemaları) eklendi
  - Belgeler: `docs/DECISIONS/0006-yerel-depolama-butunlugu.md`; `docs/ARCHITECTURE.md` ve `docs/DATABASE.md` güncellendi
- Codex denetimi (1. tur) bulguları ve düzeltmeleri:
  - **P1 — demo veri:** her koleksiyon için verinin depodan mı geldiği artık `hydrateFromStorage` ile takip ediliyor (`DemoFlags`). Demo kayıtlar ne kalıcı depoya ne de yedeğin ana koleksiyonlarına giriyor (`persistedOnly`). Kullanıcının açık değişikliği yalnızca o kaydı gerçek veriye dönüştürüyor; bir alt kayıt yazıldığında ait olduğu demo akvaryum da yükseltiliyor, böylece kalıcı yetim oluşmuyor. Dokunulmamış demo kayıtlar taşınmıyor.
  - **P1 — bozuk veri + karantina:** `readArrayForStep` ve `readEntries` artık `ReadOutcome` döndürüyor. Ham değer güvenle karantinaya alınamadıysa ilgili anahtar `[]` veya başka bir değerle **ezilmiyor**; silme `incomplete` durumunda duruyor ve günlük korunuyor. Silinmiş akvaryum arşivindeki şemaya uymayan satırlar da karantina başarılı olmadan filtrelenip yeniden yazılmıyor.
  - **Ayarlar:** `savePreferences` `false` dönerse "Kaydedildi" gösterilmiyor; kullanıcıya verinin bu cihazda henüz saklanmadığını söyleyen kısa bir uyarı çıkıyor.
  - **Belgeler:** bu dosyadaki `origin/main` bilgisi düzeltildi; `docs/ARCHITECTURE.md` tarihi ve `packages/domain` açıklaması gerçek davranışla (şemalar uygulamada kullanılıyor) uyumlandı.
- Codex denetimi (2. tur) bulguları ve düzeltmeleri:
  - **P1 — kaydedilemeyen kullanıcı verisi:** `saveX` sonuçları artık yok sayılmıyor. Saf ve test edilebilir iki koordinasyon fonksiyonu eklendi: `persistCollection(collection, rows)` (`saved` | `blocked-journal` | `blocked-suspended` | `failed` | `unavailable`) ve `checkMutationGate()`. Aktif günlük varken veri değiştiren işlemler **state'e hiç dokunmadan** reddediliyor. Kota hatasında değişiklik bellekte kalıyor ama sessiz kalınmıyor: `unsavedCollections` işaretleniyor ve `AppShell` içindeki yeni `StorageWarning` bileşeni kullanıcıya değişikliğin bu cihazda saklanmadığını, yenilemede kaybolacağını ve Ayarlar → Verileri dışa aktar ile yedek alabileceğini söylüyor.
  - **P2 — silinmiş akvaryum arşivi:** bozuk arşiv karantinaya güvenle alındıktan sonra ana anahtar geçerli satırlarla onarılıyor (ayrıştırılamayan arşiv boşaltılıyor), böylece aynı bozuk değer her yüklemede yeni karantina kopyası üretmiyor. Karantina yazılamazsa arşiv aynen korunuyor.
  - **P2 — belgeler:** merge öncesinde `docs/DATABASE.md`, `docs/DECISIONS/0006` ve `docs/ARCHITECTURE.md` Issue #8'i "Codex yeniden denetimi bekliyor" olarak gösterecek şekilde güncellendi; o aşamada hiçbir belgede tamamlandı ifadesi yoktu. Merge sonrasındaki gerçek durum aşağıdaki "Merge sonrası belge düzeltmesi" satırında yazılıdır.
  - **Kapsam notu:** P1'in "kullanıcıya açıkça bildir" gereği bir arayüz yüzeyi gerektirdiği için `src/components/app-shell.tsx` içine tek satırlık `<StorageWarning/>` eklendi ve `src/components/storage-warning.tsx` oluşturuldu. Bu iki dosya önceki turun dokunulmayacaklar listesindeydi; denetimde ayrıca değerlendirilmeli.
- Codex denetimi (3. tur) bulguları ve düzeltmeleri:
  - **P2 — açılışta yarım günlük uyarısı:** hidrasyonda `recoverPendingJournal()` sonrası `hasPendingJournal()` sonucu `writeBlocked` olarak kullanılıyor; toparlama başarısız kaldıysa `StorageWarning` kullanıcı hiçbir işlem denemeden görünüyor, başarılı toparlamada görünmüyor. Uyarı metni her iki bağlama uyacak şekilde düzeltildi. Beş senaryo için test eklendi (günlük yok, başarılı toparlama, toparlanamadı, bozuk günlük karantinaya alındı, karantinaya alınamadı).
  - **P2 — durum belgesi:** bu bölümdeki "Dokunulmayanlar" listesi düzeltildi ve `src/components/` istisnası açıkça yazıldı.
- Codex denetimi (4. tur): temiz geçti; yeni bulgu yok.
- Testler: 114 Vitest testi geçiyor (33 koruyucu + 62 bütünlük/demo + 19 mevcut paket testi). Kapsam: açılışta yarım kalan günlük uyarısının koşulu, kaydetme koordinasyonu (aktif günlükte ekleme, kota hatasında ekleme, başarılı yazma, askı, depo yokluğu), arşiv onarımı ve karantina döngüsü, demo takibi ve taze depoda yedek içeriği, karantina kota hatasında ham değerin korunması, bozuk arşiv, tercih kaydetme başarısızlığı, bozuk JSON, dizi olmayan kök, şemaya uymayan satır, kısmen bozuk koleksiyon, bozuk tercih, karantina döngüsü olmaması, askı, aktif günlük koruması, silme sırası, kesinti (koleksiyon ve paket adımında), kota hatası (günlük yazımında silme reddi), toparlamanın yinelenebilirliği, ikinci silme, bozuk günlük, 30 günlük saklama, yetim tespiti ve dışa aktarma bölümleri
- `corepack pnpm verify` (pnpm 11.11.0): başarılı — tip denetimi, katalog akışı, 35 sağlık senaryosu, katalog denetimi, 114 Vitest testi, üretim derlemesi
- Paket boyutu (bilinçli maliyet): doğrulama artık uygulamada çalıştığı için zod istemci paketine girdi. Sağlayıcıyı kullanan sayfalarda ilk yükleme JS'i yaklaşık 25–28 kB arttı (`/settings` 110 → 138 kB, `/livestock` 188 → 214 kB, `/aquariums/[id]/health` 189 → 215 kB). Sağlayıcıyı kullanmayan `/calculators` (110 kB) ve `/products` (122 kB) ile ortak paket (102 kB) değişmedi
- Dokunulmayanlar: `src/data/**`, `scripts/**`, `.github/**`, `packages/compatibility-engine/**`, ayarlar dışındaki `src/app/**`, `tsconfig.json`, `AGENTS.md`, `CONTRIBUTING.md`, `docs/HANDOFF.md`, `docs/DATA_SOURCES.md`, `docs/COMPATIBILITY.md`
- `src/components/` açık istisnası: Codex 2. tur P1 bulgusundaki "kullanıcıya açıkça bildir" gereği bir arayüz yüzeyi gerektirdiği için iki dosya kapsama alındı — `src/components/app-shell.tsx` (tek satır: `<StorageWarning/>` eklendi) ve yeni `src/components/storage-warning.tsx`. `src/components/` altındaki diğer dosyalar (sidebar, mobile-nav, page-header, parameter-card, catalog-livestock-form) değişmedi. Bu istisna denetimde ayrıca değerlendirilmelidir.
- Geri alma: `aquamind:*:v1` anahtar adları ve JSON biçimi değişmediği için dal geri alındığında eski kod aynı veriyi okumaya devam eder. Yeni anahtarlar (`:corrupt:*`, `deleted-aquariums`, `journal`) eski sürümce yok sayılır
- Bilinen riskler: zod nedeniyle paket büyümesi (yukarıda ölçüldü); silinen akvaryumlar için geri yükleme arayüzü yok (veri korunuyor, arayüz ayrı iş); tam çoklu-sekme eşzamanlılığı kapsam dışı, yalnızca aktif günlük görüldüğünde yazma engelleniyor
- Merge sonrası belge düzeltmesi (aynı dalda yapıldı): `docs/DECISIONS/0006-yerel-depolama-butunlugu.md` durumu "Önerildi" yerine **"Kabul edildi (Issue #8) — PR #9 ile `main` dalına squash merge edildi (`76cabd2`)"** oldu; `docs/ARCHITECTURE.md` tarayıcı deposu bölümündeki "`main` dalında henüz yoktur" notu merge ve yayın gerçeğiyle değiştirildi; `docs/DATABASE.md` madde 1b "Codex yeniden denetimi bekliyor" yerine "tamamlandı — PR #9 ile birleştirildi" oldu

## Katalog entegrasyonu (Canberk'in dalı `950a70f`)

- Kaynak: `codex/catalog-capacity-batch`, son commit `950a70f` (2026-09-14; 13 commit, 27 Ağustos–14 Eylül). Canberk veri çekmeye devam ediyor; o dala dokunulmadı. Sonraki commit'leri ayrı bir birleştirmeyle alınacak
- Dal: `codex/catalog-integration`, taban `main` (`7b60ffb`); `git merge --no-ff --no-commit` ile birleştirildi. Henüz commit ve push edilmedi
- Kapsam: 417 canlı (403'ü tatlı su, 10'u acı su, 14'ü deniz profiline uygun; bazı türler birden fazla su türüne), 3009 ekipman, 1027 bakım ürünü; dalın arayüz değişiklikleri (canlı formu, menü, hesaplayıcılar) ve 52 sağlık senaryosu. `src/data/` ve `scripts/` dalla bayt bayt aynı
- Çakışmalar (4 dosya) ve çözümleri:
  - `src/lib/health-analysis.ts`: `main`'deki uyarlayıcı korundu. Dalın motor kuralları (yaşam ortamı, tuzluluk, birey başına ek hacim, isteğe bağlı tank uzunluğu, pasif ve yardımcı filtre) `packages/compatibility-engine/src/index.ts` içine taşındı. Taşınan motor, dalın özgün motoruyla aynı katalogda 1020 vakanın tamamında birebir aynı çıktıyı verdi. Karar kaydı: `docs/DECISIONS/0007-katalog-entegrasyonu-motor-kurallari.md`
  - `src/types/aquarium.ts`: `main`'deki tip köprüsü korundu; dalın eklediği `specificGravity` alanı `packages/domain` tipine ve Zod şemasına eklendi
  - `package.json`: iki tarafın betikleri birleşti; `verify` artık `scripts/test-calculators.cjs` betiğini de çalıştırıyor
  - `PROJECT_STATUS.md`: `main`'in yapısı korundu. Dalın 119 bölümlük katalog günlüğü değiştirilmeden `docs/CATALOG_LOG.md` dosyasına taşındı (yalnızca "Sıradaki tek iş" başlığı yeniden adlandırıldı); dalın kontrol listesindeki iki durum yukarıya işlendi
- Otomatik birleşen `src/app/settings/page.tsx` elle denetlendi: Issue #8 mantığı yerinde; tek fark profil adındaki örnek değerin "Mert Kaya"dan "Canberk"e çevrilmesi
- Motor sürümü: `ENGINE_VERSION` ve `RULESET_VERSION` 1.1.0. Altın fikstür, ürün sahibinin 2026-09-24 onayından sonra 604 vakadan 1020 vakaya yeniden üretildi; `docs/COMPATIBILITY.md` motor değiştirme kuralı gereği birleştirme commit'inden ayrı bir commit'te kaydedilmesi planlandı. Vaka üreticisi artık her türü kendi su türünde dener, yayımlanmamış tank uzunluğunu destekler ve hava motoru vakalarını gerçek bir sünger filtreyle kurar (katalog büyüyünce ilk 60 filtre içinde sünger filtre kalmamış, vakalar sessizce dış filtreyle çalışmaya başlamıştı). Eski fikstürle ortak 523 vakanın 269'u aynı; 125'i girdisindeki katalog kaydı değiştiği için, 129'u yalnızca alan uyarısı metni ("Kayıtlı adet için minimum …") değiştiği için farklı; açıklanamayan fark yok
- Güncellenen belgeler ve testler: `docs/COMPATIBILITY.md` (kural seti 1.1.0, 52 senaryo, fikstür), `docs/DATABASE.md` ve `docs/ARCHITECTURE.md` (katalog sayıları, betikler, doğrulama sırası); `legacy-scripts.test.ts` artık 52 senaryoyu bekliyor
- Doğrulama: `corepack pnpm verify` başarılı (yukarıda), `git diff --check` temiz
- Paket boyutu (bilinen maliyet): katalog istemciye gönderildiği için ilk yükleme JS'i arttı: `/livestock` 215 → 319 kB, `/equipment` 215 → 307 kB (selamlama değişikliğindeki kişi simgesiyle 308 kB), `/aquariums/[id]/health` 216 → 310 kB, `/products` 151 → 168 kB. Kalıcı çözüm kataloğun sunucuya veya veritabanına taşınmasıdır (Phase 1–2)
- Bilinen riskler: Aşağıdaki uyumluluk denetimi bulguları bu birleştirmeyle çözülmez; yalnızca su türü kontrolü gelir. Birleştirmeyle gelen sabit "Canberk" adı (önceden sabit "Mert") ayrı bir değişiklikle kaldırıldı (aşağıda). Canberk'in sonraki notları dalında `PROJECT_STATUS.md`'ye eklenirse bir sonraki birleştirmede yine çakışır; yeni katalog notları `docs/CATALOG_LOG.md`'ye yazılmalıdır

## Selamlama ve profil adı (katalog entegrasyonunun üstünde, ayrı değişiklik)

- Kullanıcı isteği: her ziyaretçiye gösterilen sabit kişi adı yerine esnek, isimsiz bir selamlama
- Ana sayfa: "Günaydın, Canberk." yerine ziyaretçinin cihaz saatine göre "Günaydın." (05.00–11.59), "İyi günler." (12.00–17.59) veya "İyi akşamlar." (18.00–04.59). Sayfa önceden derlendiği için saat tarayıcıda okunur; ilk çizimde "Merhaba." görünür. Mantık `src/lib/greeting.ts`, testler `src/lib/__tests__/greeting.test.ts` (4 test)
- Menü ve mobil menü: sabit ad yerine "Misafir" (baş harf yerine kişi simgesi). Ayarlar → Profil'deki ad alanı boş ve "Adınız" ipucunu gösteriyor; alan önceden de kaydedilmiyordu. Hesaplar geldiğinde (Phase 1) gerçek ad buraya bağlanır
- Kapsam dışı: selamlamanın altındaki sabit "Akvaryumunda bugün her şey yolunda görünüyor." cümlesi ve su değeri kartlarının sabit etiketleri, uyumluluk denetiminin birinci acil maddesidir; ayrı görevde düzeltilecek
- Doğrulama: `corepack pnpm verify` başarılı (118 Vitest testi). Tarayıcıda görsel kontrol yapılmadı

## Uyumluluk denetimi (2026-09-24)

- Yöntem: motor kodu satır satır okundu; akvaryumculukta cevabı bilinen 11 senaryo hem `main` hem katalog dalında çalıştırıldı; katalog otomatik tutarlılık kontrollerinden geçirildi; 189 balık türünün sıcaklık, pH ve boy değerleri FishBase kayıtlarıyla karşılaştırıldı. Denetim sırasında dosya değiştirilmedi
- Senaryo sonuçları (doğru / kısmen / yanlış alarm / kaçırdı): `main` 0/2/2/7, katalog dalı 0/5/2/4
- Acil (kullanıcıya yanlış güven veren): (1) ana sayfadaki su değeri kartlarının "İdeal", "Dengeli", "Normal", "Güvenli" etiketleri ve "her şey yolunda" cümlesi koda sabit yazılı; (2) amonyak, nitrit ve nitrat hiçbir yerde değerlendirilmiyor (2 ppm amonyakta su uyumu 100); (3) genel puan sekiz ölçütün ortalaması olduğu için tehlike uyarısı varken "iyi" görünebiliyor (diskus + neon: 78); (4) su türü kontrolü yok, katalog entegrasyonuyla geliyor
- Kaçırılanlar: yüzgeç ısırma (Sumatra barb), küçük balık avlama (melek, Japon balığı) ve karides avlama (gurami) işaretsiz; tank arkadaşı uyarıları yalnızca başka tür varken çıktığı için iki erkek beta uyarısı hiç görünmüyor; alan uyarısının şiddeti hacim açığıyla artmıyor
- Yanlış alarmlar: filtre kuralı (etkin debi %65, en az 5 çevrim/saat) üreticiyle çelişiyor; debisi ve önerilen hacmi olan 273 filtrenin 263'ü üreticinin azami hacminde "tehlike" alıyor (katalog dalında 345'te 332). Biyolojik yük eşiği 100 L'de 12 neon, 6 corydoras ve 1 vatozu "tehlike" sayıyor
- Veri: ekipman açıklamalarındaki sayılar hesap alanlarıyla tutarlı; FishBase karşılaştırmasında bariz tür hatası bulunmadı. Ancak `main`'de 89 türün (katalog dalında 77) kaynağı bilimsel addan otomatik üretilmiş FishBase veya SeriouslyFish bağlantısı; bunların 14'ünde sıcaklık veya pH, gösterilen kaynaktan belirgin biçimde farklı. İncelenecek kayıtlar: inci pullu cichlid 24–25 °C (dal), Senegal bichir 35 cm (`main`) ve 70 cm (dal), Channa asiatica 35 cm ve 160 L (dal), Japon balığı 25 cm ve 100 L, Boyu EFU filtreleri (debi önerilen hacme eşit), "arı goby" adının iki türde olması
- Düzeltme kuralı: katalog değerleri hafızadan değil, kaydedilen kaynaklarla düzeltilir; eşik ve davranış kararları Canberk'in akvaryumculuk görüşüyle netleştirilir

## Sıradaki tek iş

Codex'in `codex/catalog-integration` dalındaki yerel değişiklikleri salt okuma ile denetlemesi. Ardından kullanıcı onayıyla üç commit (birleştirme, ayrı altın fikstür, selamlama), GitHub'a gönderme ve pull request. `main` birleştirmesi ve üretim yayını ayrıca onay ister. Motor kurallarına `docs/COMPATIBILITY.md` gereği ürün sahibi onayı 2026-09-24'te verildi (`docs/DECISIONS/0007-katalog-entegrasyonu-motor-kurallari.md`). Ardından uyumluluk denetimindeki acil düzeltmeler ayrı görevler olarak yapılır.

Phase 1A (Issue #7) — **engelli** (2026-09-24'te yeniden doğrulandı): Docker Desktop kurulu değil ve BIOS/UEFI'de SVM Mode kapalı. Kullanıcı BIOS ayarını açıp Docker Desktop'ı kurana kadar bekliyor. Uyumluluk düzeltmeleri Docker gerektirmediği için bu sürede yapılabilir. Issue #7'ye 2026-09-16'da yazılan yorum ilgisiz bir hesabın ücretli hizmet reklamıdır; dikkate alınmamalıdır.

## Oturum sonu devir şablonu

- Yapılan görev: uyumluluk ve katalog denetimi (dosya değiştirmeden); Canberk'in katalog dalının (`950a70f`) `main` ile birleştirilmesi (motor kurallarının pakete taşınması, çakışmaların çözümü, altın fikstürün yeniden üretimi, belgeler); sabit kişi adının isimsiz, saate göre değişen selamlamayla değiştirilmesi
- Değişen dosyalar: birleştirmeyle gelen katalog (`src/data/**`), betikler (`scripts/**`), arayüz (`src/app/**`, `src/components/{catalog-livestock-form,mobile-nav,sidebar}.tsx`, `src/lib/calculators.ts`) ve `docs/DATA_SOURCES.md`; çözüm için `packages/compatibility-engine/src/{index,version}.ts`, `packages/compatibility-engine/test/{legacy-scripts.test.ts,fixtures/golden-cases.ts,fixtures/golden-v1.json}`, `packages/domain/src/{aquarium,schemas}.ts`, `package.json`, `PROJECT_STATUS.md`, `docs/{COMPATIBILITY,DATABASE,ARCHITECTURE}.md`; yeni: `docs/CATALOG_LOG.md`, `docs/DECISIONS/0007-katalog-entegrasyonu-motor-kurallari.md`. Selamlama için `src/app/page.tsx`, `src/components/{sidebar,mobile-nav}.tsx`, `src/app/settings/page.tsx`; yeni: `src/lib/greeting.ts`, `src/lib/__tests__/greeting.test.ts`
- Çalıştırılan kontroller: `tsc --noEmit`; özgün ve taşınan motorun 1020 vakada karşılaştırılması (1020/1020 aynı); eski ve yeni fikstür farklarının sınıflandırılması; `src/data` ve `scripts` klasörlerinin dalla aynı olduğunun doğrulanması; `corepack pnpm verify`; `git diff --check`
- Sonuç: tümü başarılı
- Bilinen hata veya risk: yukarıdaki "Katalog entegrasyonu" bölümündeki riskler ve "Uyumluluk denetimi"
- GitHub'a gönderildi mi: Hayır. Birleştirme yerelde duruyor, commit edilmedi
- Vercel'e yayımlandı mı: Hayır. Canlı uygulama (`https://aqua-mind-three.vercel.app/`) `7b60ffb` sürümünde ve katalog entegrasyonunu içermiyor
- Sonraki tek iş: Codex denetimi, ardından kullanıcı onayıyla commit, push ve pull request (yukarıda)
