# 0011 — İkinci katalog entegrasyonu (`b1fb27d`) ve taban ısıtıcısı kuralı

- Tarih: 2026-10-03
- Durum: Kabul edildi — ürün sahibi (`buraksenfx`) 2026-10-03'te taban ısıtıcısı kuralını soru formuyla (önerilen seçenek) ve AquaMatch menü öğesinin "Yakında" olarak görünmesini sohbette açıkça onayladı. Codex denetimi ilk turda temiz geçti (2026-10-03). Birleştirme, kod ve belgeler (`9e3dac6`) ile altın fikstür (`d1b29cd`) ayrı commit'ler olarak kaydedildi; PR #15 (`https://github.com/ckaracora/AquaMind/pull/15`) kullanıcı onayıyla 2026-10-03'te merge commit yöntemiyle `main` dalına birleştirildi (`f3fd24b`) ve canlıda (`main` push'unda `Doğrulama` `37122563141` ve Vercel üretim dağıtımı başarılı; canlı menüde AquaMatch görünüyor)

## Bağlam

Canberk, ilk entegrasyondan (PR #11, `950a70f`) sonra `codex/catalog-capacity-batch` dalına iki commit daha gönderdi. İkisi de 2026-10-03 tarihli: `e407423` ve `b1fb27d`. Bu commit'ler şunları getiriyor:

- **Katalog:** 417'den 423'e canlı, 3009'dan 3541'e ekipman, 1027'den 1893'e bakım ürünü. Bazı türlerin eşikleri kaynaklarla yenilendi. Aynı türü iki ayrı profil olarak gösteren iki yinelenen kayıt kaldırıldı: `cobalt-goby` (Stiphodon semoni) ve `mystery-snail` (Pomacea diffusa).
- **Sağlık senaryoları:** 52'den 113'e çıktı.
- **Menü:** Masaüstü ve mobil menüde tıklanamayan bir "AquaMatch — Yakında" öğesi eklendi.
- **Isıtıcı:** Eski motor dosyasında (`src/lib/health-analysis.ts`) taban ısıtma kablolarının ısıtıcı kapasitesine katılmaması sağlandı.

Dal hâlâ `950a70f` tabanlı olduğu için birleştirmede üç dosya çakıştı: `PROJECT_STATUS.md`, `src/components/sidebar.tsx` ve `src/lib/health-analysis.ts`.

## Karar

1. **Taban ısıtıcısı (motor 1.5.0).** Pasif kayıtlar (`passiveComponent`) ısıtıcı kapasitesine katılmaz.
   - **Etkilenen kayıtlar:** Katalogdaki 10 JBL PROTEMP b kaydı. Bunlar b10/b20/b40/b60 III, arşiv b10/b20/b40/b60, b40 II ve b60 II modelleri.
   - **Kaynak:** JBL'nin "Undergravel heating - not for heating the water!" yazısı (13.11.2022) taban ısıtıcısının suyu termostatlı ısıtıcı gibi ısıtmak için olmadığını, yalnızca taban içindeki su dolaşımı için olduğunu açıkça yazıyor: https://www.jbl.de/en/blog/detail/756/undergravel-heating-not-for-heating-the-water?country=sg . Bu bağlantıyı Codex denetimde buldu. JBL'nin ProScape rehberi (s. 18), kablonun amacını taban içindeki ısı dolaşımıyla bitki köklerini besin bakımından beslemek olarak anlatıyor. Katalog kaydının ürün sayfası özeti de kablonun suyu ısıtan termostatlı ana ısıtıcının yerine geçmediğini yazıyor.
   - **Kullanıcıya etkisi:** Akvaryumda ısıtıcı olarak yalnızca taban kablosu seçilmişse, ısıtıcı kartı hiç ısıtıcı seçilmemiş gibi "Katalogdan ısıtıcı bulunamadı" gösterir; tropik türde puan düşüktür. Gerçek bir ısıtıcının yanında seçilen taban kablosu hesabı değiştirmez.
   - **Sürüm:** `ENGINE_VERSION` ve `RULESET_VERSION` 1.5.0'a yükseltildi.
2. **Çakışmalar.**
   - `PROJECT_STATUS.md`: `main`'in yapısı korundu. Canberk'in katalog günlüğü, ilk entegrasyondaki yöntemle `docs/CATALOG_LOG.md` dosyasına yeniden taşındı. Dosyada artık 227 bölüm var; 109'u yeni. Eski 119 bölümün hiçbiri kaybolmadı ya da değişmedi. Yalnızca eski dosyanın son bölümünün ("2026-09-11 Aquael güncel portföy genişletmesi") sonuna, Canberk'in yeni bir başlık açmadan eklediği 87 satır geldi.
   - `src/components/sidebar.tsx`: AquaMatch simgesi ile `main`'deki "Misafir" simgesi birlikte içe aktarıldı.
   - `src/lib/health-analysis.ts`: `main`'deki uyarlayıcı korundu. Isıtıcı düzeltmesi motora (`packages/compatibility-engine/src/index.ts`) taşındı.
3. **Sağlık senaryosu.** Canberk'in kaplan kürek burun senaryosu (1000 L), biyolojik yük ölçütünün "tehlike" olmasını bekliyordu. Bu, 1.3.0'dan önceki kuraldır. 2026-09-28'de onaylanan 1.3.0 kuralında tahmini yük tehlike vermez; buradaki oran %140 olduğu için ölçüt "iyi"dir (bkz. 0009). Beklenti onaylı kurala göre düzeltildi. Senaryoya ayrıca genel durumun "tehlike" olduğu denetimi eklendi; nedeni avlanma ve tür akvaryumu. Diğer 112 senaryo değişmeden geçiyor.
4. **Davranış verisi.** Kaldırılan `cobalt-goby` kimliğinin tek kaydı çıkarıldı; aynı kayıt `cobalt-blue-goby-semoni` altında zaten vardı. Davranış verisi artık 156 tür için 201 kayıttır.
5. **AquaMatch.** Uygulamanın sosyal bölümü için ayrılmış, tıklanamayan bir menü öğesidir. Sayfası ve işlevi yoktur; Canberk başlattı ve ürün sahibi görünmesini onayladı.

## Eski kayıtlar ne olur?

Kullanıcının tarayıcıda saklanan canlı kaydı kaldırılan bir kimliği gösteriyorsa (`cobalt-goby`, `mystery-snail`), `speciesForLivestock` bilimsel ad ya da ortak ad üzerinden birleştirilmiş profile ulaşır. Bu iki kimlik sırasıyla `cobalt-blue-goby-semoni` ve `apple-snail` profillerine çözümleniyor; ikisi de aynı bilimsel türdür. `localStorage` biçimi ve anahtarları değişmedi.

## Doğrulama

- `packages/compatibility-engine/test/heater.test.ts`: yalnız taban kablosunu ve taban kablosu ile gerçek ısıtıcıyı stub kayıtlarla sınar. İki test de eski kuralla çalıştırıldığında başarısız oldu; yani testler kuralı gerçekten yakalıyor.
- `scripts/test-health.cjs`: 113 senaryo geçiyor; `legacy-scripts.test.ts` artık 113'ü bekliyor.
- Altın fikstür onaydan sonra yeniden üretildi; artık 1033 vaka. Farkların nedenini ayırmak için iki üretim yapıldı: yeni katalog ile motor 1.4.0, ve yeni katalog ile motor 1.5.0.
  - **Isıtıcı kuralı:** Hiçbir vakayı değiştirmedi; altın vakalarda taban kablosu yok.
  - **Katalog değişikliği** (motor 1.4.0, eski 1020 vaka ile yeni 1033 vaka karşılaştırması):
    - 943 vaka ortak.
    - 77 vaka adı kalktı ve 90 vaka adı eklendi. Nedenleri: yeni ve kaldırılan türler, tür çifti ile ekipman seçimlerinin kayması.
    - Ortak vakaların 238'inin sonucu değişti; hepsinin girdisi ya da ilgili katalog kaydı da değişmişti. Bunların 127'sinde girdi aynı ama tür kaydı değişmiş, 111'inde vaka kurulumu değişmişti.
    - Açıklanamayan fark yok.
- `corepack pnpm verify` başarılı.
- Codex denetimi (1. tur, 2026-10-03): temiz, P1–P3 bulgu yok. Codex şunları doğruladı: 25 dosya anlık görüntüyle eşleşiyor; Canberk'in dokunulmayan 9 dosyası `b1fb27d` ile aynı; çakışma çözümleri doğru; motordaki tek kural farkı pasif ısıtıcıların dışlanması; katalog günlüğü dönüşümü ve eski içerik korunmuş; davranış verisi dış kopyada bayt bayt yeniden üretildi; eski kimlikler doğru profillere çözümleniyor; altın fikstür sınıflandırması tekrarlandı (ısıtıcıdan değişen 0, açıklanamayan 0); `pnpm verify` dış kopyada başarılı. Dış kopyada `/livestock` ve `/products` boyutları yuvarlama nedeniyle 1 kB yüksek çıktı (376 ve 225 kB).

## Değerlendirilen alternatifler

- **Taban kablosunu küçük bir ısıtıcı gibi saymaya devam etmek:** Kullanıcıya yanlış biçimde "ısıtıcı uygun" denirdi. Üretici kabloyu ana ısıtıcı olarak sunmuyor.
- **Canberk'in yük beklentisini korumak için 1.3.0 yük kuralını geri almak:** Onaylı bir kuralı geri almak olurdu. Hacim açığı zaten alan uyarısında görünüyor; alan uyarısının şiddeti ayrı bir iş olarak bekliyor.

## Geri alma

Entegrasyon birleştirme commit'i geri alındığında katalog `950a70f` hâline, motor 1.4.0'a döner. Bu durumda altın fikstür commit'i de geri alınır. Kullanıcı verisi ve depolama biçimi etkilenmez.
