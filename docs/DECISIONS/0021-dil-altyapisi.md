# 0021 — Dil altyapısı

- Tarih: 2026-10-19
- Durum: Kabul edildi (teknik karar, Claude; ürün sahibinin 2026-10-19 "dile uygun yapıya geçelim, çeviri kesin yapılacak, farklı dillere de" kararına dayanır, `docs/DECISIONS/0020-urun-hedefleri-ve-yol-haritasi.md`). 1. paket `codex/i18n-1` dalında; Codex 2. turda temiz; commit ve PR planlandı.

## Bağlam

Uygulamanın bütün metinleri koda Türkçe yazılmıştı: ekranlarda yaklaşık 860 metin (en çok ekipman, su değerleri ve bakım sayfalarında), sağlık analizi motorunda yaklaşık 35 uyarı ve ölçüt metni, katalogda tür adları ve açıklamaları. Tarih ve sayılar 21 yerde doğrudan `tr-TR` ile biçimleniyordu. Ayarlar sayfası sıcaklık (°C/°F), hacim (litre/galon) ve tarih biçimi seçtirip kaydediyordu ama bu tercihler hiçbir ekranda uygulanmıyordu. Ürün sahibi birden çok dil, App Store ve Google Play istiyor; telefon uygulaması (Expo) aynı metinleri kullanacak.

## Karar

1. **Ayrı ve bağımlılıksız paket:** `packages/localization` (`@aquamind/localization`). Web ve ileride telefon uygulaması aynı paketi kullanır. Tarih, sayı ve çoğul kuralları için tarayıcının ve telefonun yerleşik `Intl` arayüzü kullanılır; dış kütüphane ve kilit dosyasında dış bağımlılık yoktur.
2. **Dil dosyaları TypeScript nesnesidir.** Türkçe (`messages/tr.ts`) kaynak dildir; `Messages` tipi onun biçimidir. Başka bir dilin dosyası bu tipi karşılamazsa derleme hata verir; eksik çeviri yayına gidemez. Değişken içeren metin fonksiyondur (ör. `unsaved(collections)`); çoğul ve çekim her dilin kendi fonksiyonunda çözülür. Çeviri hizmeti gerekirse dosyalar betikle dışa aktarılır.
3. **Desteklenen diller** `SUPPORTED_LOCALES` listesindedir; şimdilik yalnız Türkçe. Bir dil, dosyası tamamlanınca listeye eklenir ve ayarlarda seçilebilir olur.
4. **Arayüz** metinleri `useI18n()` ile alır (`src/providers/i18n-provider.tsx`); sağlayıcının dışında kalan bileşen varsayılan dili alır. Gezinme verisi (`src/data/navigation.ts`) ad taşımaz; ad `navigation.items[key]` anahtarından gelir.
5. **Birimler:** değerler içeride metrik kalır (litre, °C, cm). Paket, gösterim ve form girişi için dönüşüm (`litersToGallons`, `celsiusToFahrenheit`, `cmToInches` ve tersleri) ve biçimleme (`formatVolume`, `formatTemperature`, `formatNumber`, `formatCalendarDate`) sağlar. Kaydedilen değerin birimi değişmez.
6. **Paketler** (her biri ayrı PR, Codex denetimli):
   1. Altyapı ve ortak bileşenler (menüler, sayfa başlığı, kaydetme uyarısı, sayfa adı ve açıklaması). Bu karar kaydı.
   2. Sayfaların metinleri ve tarih/sayı biçimi; ayarlardaki birim ve tarih tercihlerinin ekranlarda uygulanması (bugün kaydedilip kullanılmıyor).
   3. Sağlık analizi motoru: uyarı ve ölçütler kod ve değişken olarak üretilir, metin dil dosyasından yazılır. Kurallar ve puanlar değişmez; çıktı biçimi değiştiği için altın fikstür ayrı commit'te yeniden üretilir.
   4. Katalog: tür adları ve açıklamalar dile göre; bilimsel ad ve kimlik dilden bağımsız anahtar olarak kalır. İngilizce tür adları kaynaktan alınır, uydurulmaz.
   5. İngilizce: arayüz ve motor metinleri; ayarlarda dil seçimi.

## Sonuçlar

- 1. pakette Türkçe kullanıcı hiçbir fark görmez: metinler aynıdır, yalnız yerleri değişti.
- Yeni metin artık koda değil dil dosyasına yazılır. Kalan sayfalar 2. pakete kadar eski biçimde kalır.
- Telefon kullanılabilirlik testinin (`src/lib/__tests__/mobile-usability.test.ts`) bilinen ölçü istisnası (yan menünün arka planı) Türkçe ad yerine dil dosyası anahtarıyla (`t.navigation.closeMenu`) tanınır.
