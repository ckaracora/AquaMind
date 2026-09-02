# AquaMind proje durumu

Son güncelleme: 2026-09-02

## Doğrulanmış temel

- GitHub: `https://github.com/ckaracora/AquaMind`
- Ana dal: `main` (uzak ucu `7e8d63b6ff032f18e142490d2f307b4fe15a202d`, PR #5 squash merge). Yerel `main`, 2026-09-02'de `git pull --ff-only` ile `origin/main` ile senkronize edildi
- Başlangıç commit'i: `7d8fb01 fix: approve sharp build dependency`
- Canlı uygulama: `https://aqua-mind-three.vercel.app/` (Phase 0B değişikliklerini içeriyor; `main` merge sonrası Vercel üretim dağıtımı 2026-09-02'de tamamlandı)
- Görev panosu: `https://github.com/users/ckaracora/projects/1`
- Teknoloji: Next.js 15, React 19, TypeScript, Tailwind CSS, pnpm 11.11.0 çalışma alanı, Vitest
- `pnpm verify`: 2026-09-02 tarihinde `codex/phase-0b-foundation` dalında yerelde başarılı (tip denetimi, katalog akışı, 35 sağlık senaryosu, katalog denetimi, 19 Vitest testi, üretim derlemesi); Corepack üzerinden tam olarak pnpm 11.11.0 ile de doğrulandı (`corepack pnpm verify`). GitHub Actions `Doğrulama` workflow'u PR #5 üzerinde ve `main` push'unda başarılı
- Arkadaş kurulumu: `buraksenfx` hesabı collaborator; Windows kopyasında kurulum ve tüm doğrulamalar başarılı

## Mevcut veri durumu

- Kataloglar `src/data/` altında sürüm kontrollü TypeScript verisidir; Phase 0B'de tek bayt değişmedi.
- Akvaryumlar, ölçümler, bakım, canlılar, bitkiler ve ekipmanlar şimdilik tarayıcı `localStorage` alanında saklanır; `src/lib/aquarium-storage.ts` değişmedi.
- Alan tipleri `packages/domain` içinde tanımlıdır; uygulama `src/types/aquarium.ts` köprüsüyle aynı adları kullanır. Zod şemaları ve `LocalExportV1` yalnızca test ve gelecekteki içe/dışa aktarma sınırı içindir.
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
- [ ] Ortak katalog araştırma tablosu hazırlanacak
- [ ] Supabase tasarımı ve geçişi: tasarım belgesi hazır (`docs/DATABASE.md`, `docs/SECURITY.md`), uygulama Phase 1
- [ ] İki bilgisayarlı devir provası yapılacak

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
- Ayrı issue adayları (Phase 0B dışında bırakıldı): `aquarium-storage.ts` içindeki yetim alt kayıt ve bozuk anahtar davranışları, panodaki sabit yer tutucular, `next lint`, `AGENTS.md` "Zorunlu doğrulama" açıklamasına Vitest'in eklenmesi, `engines` alanı, GitHub Actions action sürümlerinin güncellenmesi (Node 20 uyarısı)

## Sıradaki tek iş

Phase 1 için kapsamı net bir Issue açılması ve yerel Supabase/RLS temelinin planlanması. Bu iş için henüz Issue veya dal açılmadı; tasarım girdileri `docs/DATABASE.md` ve `docs/SECURITY.md` içindedir.

## Oturum sonu devir şablonu

- Yapılan görev: Issue #4 Phase 0B mimari temel (M1–M7); ardından merge sonrası durum temizliği ve yerel `main` senkronizasyonu
- Değişen dosyalar: `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `next.config.ts`, `src/types/aquarium.ts`, `src/lib/health-analysis.ts`, `README.md`, `docs/PROJECT.md`, `AGENTS.md` (yalnızca ekleme), `CLAUDE.md`, `PROJECT_STATUS.md`; yeni: `vitest.config.mts`, `packages/domain/**`, `packages/compatibility-engine/**`, `docs/ARCHITECTURE.md`, `docs/DATABASE.md`, `docs/SECURITY.md`, `docs/COMPATIBILITY.md`, `docs/DECISIONS/**` (tümü PR #5 ile `main` içinde); kapanış görevinde yalnızca `PROJECT_STATUS.md`
- Çalıştırılan kontroller: her kilometre taşından sonra `pnpm verify`; `pnpm test`; `git diff --check`; korunan yolların blob hash karşılaştırması; devir öncesi ve kapanışta `corepack pnpm verify` (pnpm 11.11.0); GitHub Actions `Doğrulama` PR #5 ve `main` üzerinde başarılı
- Sonuç: tümü başarılı
- Bilinen hata veya risk: yukarıdaki "Bilinen riskler"
- GitHub'a gönderildi mi: Evet; PR #5 squash merge ile `main` dalına birleştirildi (`7e8d63b`), Issue #4 kapandı
- Vercel'e yayımlandı mı: Evet, `main` merge sonrası otomatik üretim dağıtımı tamamlandı (`https://aqua-mind-three.vercel.app/`)
- Sonraki tek iş: Phase 1 için kapsamı net bir Issue açılması ve yerel Supabase/RLS temelinin planlanması (yukarıda)
