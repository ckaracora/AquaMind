# AquaMind proje durumu

Son güncelleme: 2026-09-02

## Doğrulanmış temel

- GitHub: `https://github.com/ckaracora/AquaMind`
- Ana dal: `main` (uzak ucu `242f899`, PR #3 birleştirmesi)
- Başlangıç commit'i: `7d8fb01 fix: approve sharp build dependency`
- Canlı önizleme: `https://aqua-mind-three.vercel.app/` (Phase 0B değişikliklerini içermiyor; push edilmedi)
- Görev panosu: `https://github.com/users/ckaracora/projects/1`
- Teknoloji: Next.js 15, React 19, TypeScript, Tailwind CSS, pnpm 11.11.0 çalışma alanı, Vitest
- `pnpm verify`: 2026-09-02 tarihinde `codex/phase-0b-foundation` dalında yerelde başarılı (tip denetimi, katalog akışı, 35 sağlık senaryosu, katalog denetimi, 19 Vitest testi, üretim derlemesi); Corepack üzerinden tam olarak pnpm 11.11.0 ile de doğrulandı (`corepack pnpm verify`)
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
- [x] GitHub Actions otomatik doğrulaması (Issue #2): PR #3 ile 2026-08-26'da `main` dalına birleştirildi (uzak çalıştırma sonucu bu oturumda doğrulanmadı)
- [ ] Phase 0B mimari temel (Issue #4): Codex denetimi tamamlandı ve iki bulgu giderildi; `codex/phase-0b-foundation` dalı GitHub'a gönderildi; pull request, `main` birleştirmesi ve yayın kullanıcı onayı bekliyor (aşağıda)
- [ ] Ortak katalog araştırma tablosu hazırlanacak
- [ ] Supabase tasarımı ve geçişi: tasarım belgesi hazır (`docs/DATABASE.md`, `docs/SECURITY.md`), uygulama Phase 1
- [ ] İki bilgisayarlı devir provası yapılacak

## Phase 0B — Mimari temel (Issue #4)

- Issue: `https://github.com/ckaracora/AquaMind/issues/4`
- Dal: `codex/phase-0b-foundation` (GitHub'a gönderildi); taban `242f899` = `origin/main`
- Durum: Codex denetimi tamamlandı (2 bulgu giderildi); değişiklikler commit edildi ve dal push edildi; pull request açılmadı; `main` birleştirmesi ve yayın kullanıcı onayı bekliyor
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
- Bilinen riskler: Bu dala push CI'ı tetiklemez; workflow yalnızca `main` push'unda ve pull request olaylarında çalışır, otomatik doğrulama PR açılınca görülecek. Vercel `packageManager` alanını yalnızca corepack açıksa dikkate alır ve `transpilePackages` ile kök çalışma alanı yayını bu oturumda doğrulanamadı (push yok); ilk PR önizlemesinde kontrol edilmeli. `scripts/test-health.cjs` Vitest içinde alt süreç olarak da çalıştığı için `pnpm verify` bu betiği iki kez çalıştırır (yaklaşık 2 sn).
- Ayrı issue adayları (Phase 0B dışında bırakıldı): `aquarium-storage.ts` içindeki yetim alt kayıt ve bozuk anahtar davranışları, panodaki sabit yer tutucular, `next lint`, `AGENTS.md` "Zorunlu doğrulama" açıklamasına Vitest'in eklenmesi, `engines` alanı

## Sıradaki tek iş

Issue #4 için kullanıcı onayıyla `codex/phase-0b-foundation` dalından `main` hedefli pull request açmak, otomatik doğrulamanın pull request üzerinde başarılı çalıştığını görmek ve kullanıcı onayıyla `main` dalına birleştirmek.

## Oturum sonu devir şablonu

- Yapılan görev: Issue #4 Phase 0B mimari temel (M1–M7)
- Değişen dosyalar: `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `next.config.ts`, `src/types/aquarium.ts`, `src/lib/health-analysis.ts`, `README.md`, `docs/PROJECT.md`, `AGENTS.md` (yalnızca ekleme), `CLAUDE.md`, `PROJECT_STATUS.md`; yeni: `vitest.config.mts`, `packages/domain/**`, `packages/compatibility-engine/**`, `docs/ARCHITECTURE.md`, `docs/DATABASE.md`, `docs/SECURITY.md`, `docs/COMPATIBILITY.md`, `docs/DECISIONS/**`
- Çalıştırılan kontroller: her kilometre taşından sonra `pnpm verify`; `pnpm test`; `git diff --check`; korunan yolların blob hash karşılaştırması; devir öncesi `corepack pnpm verify` (pnpm 11.11.0)
- Sonuç: tümü başarılı
- Bilinen hata veya risk: yukarıdaki "Bilinen riskler"
- GitHub'a gönderildi mi: Evet, `codex/phase-0b-foundation` dalı (pull request açılmadı, `main` birleştirilmedi)
- Vercel'e yayımlandı mı: Hayır
- Sonraki tek iş: kullanıcı onayıyla pull request ve `main` birleştirmesi (yukarıda)
