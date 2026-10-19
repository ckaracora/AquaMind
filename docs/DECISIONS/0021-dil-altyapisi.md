# 0021 — Dil altyapısı

- Tarih: 2026-10-19
- Durum: Kabul edildi (teknik karar, Claude; ürün sahibinin 2026-10-19 "dile uygun yapıya geçelim, çeviri kesin yapılacak, farklı dillere de" kararına dayanır, `docs/DECISIONS/0020-urun-hedefleri-ve-yol-haritasi.md`). 1. paket PR #32 ile birleştirildi (`671a719`). 2. paket alt paketlere bölündü; 2a `codex/i18n-2a` dalında, Codex 2. turda temiz; commit ve PR planlandı.

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
   2. Sayfaların metinleri ve tarih/sayı biçimi; ayarlardaki birim ve tarih tercihlerinin ekranlarda uygulanması (bugün kaydedilip kullanılmıyor). İş büyük olduğu için alt paketlere bölündü:
      - 2a: birim ve tarih tercihleri, sayı ve tarih biçimi (aşağıda "2a ayrıntıları").
      - 2b: ana sayfa ve akvaryum sayfalarının metinleri; su değeri durum etiketleri (`src/lib/water-status.ts`).
      - 2c: su değerleri, bakım, canlılar, bitkiler ve canlı ekleme penceresinin metinleri.
      - 2d: ekipman, ürün kataloğu, hesaplayıcılar, ayarlar ve ortak pencerelerin metinleri; elle girilen ekipman değeri metinleri.
   3. Sağlık analizi motoru: uyarı ve ölçütler kod ve değişken olarak üretilir, metin dil dosyasından yazılır. Kurallar ve puanlar değişmez; çıktı biçimi değiştiği için altın fikstür ayrı commit'te yeniden üretilir.
   4. Katalog: tür adları ve açıklamalar dile göre; bilimsel ad ve kimlik dilden bağımsız anahtar olarak kalır. İngilizce tür adları kaynaktan alınır, uydurulmaz.
   5. İngilizce: arayüz ve motor metinleri; ayarlarda dil seçimi.

## Sonuçlar

- 1. pakette Türkçe kullanıcı hiçbir fark görmez: metinler aynıdır, yalnız yerleri değişti.
- Yeni metin artık koda değil dil dosyasına yazılır. Kalan sayfalar 2. pakete kadar eski biçimde kalır.
- Telefon kullanılabilirlik testinin (`src/lib/__tests__/mobile-usability.test.ts`) bilinen ölçü istisnası (yan menünün arka planı) Türkçe ad yerine dil dosyası anahtarıyla (`t.navigation.closeMenu`) tanınır.

## 2a ayrıntıları

- **Tercihlerin yeri:** tercihler veri sağlayıcısında (`AquariumProvider`) tutulur ve uygulama açılırken, yarım kalmış silme toparlandıktan sonra bir kez okunur; bozuk tercih karantinaya alınır ve kurtarma özetine girer. Ayarlar sayfası `updatePreferences` ile kaydeder; kayıt başarılıysa bütün ekranlar yeni tercihe geçer. Ekranlar biçimleyiciyi `useDisplayFormat()` ile alır; biçimleme kuralları dil paketindedir (`createDisplayFormat`), böylece telefon uygulaması aynı kuralları kullanır.
- **Sayılar:** dilin ayırıcılarıyla yazılır. Su ölçümleri en çok üç ondalıkla (0,25 ppm, 1,025 SG yuvarlanmasın), hacim bir ondalıkla, °C iki ondalığa kadar, °F tek ondalıkla.
- **Tarihler:** sayısal tarih ayarlardaki sırayla ("GG.AA.YYYY" / "AA/GG/YYYY"); ay adlı ve saatli tarih dilin kuralıyla. ISO takvim günü saat dilimine göre kaydırılmaz.
- **Form girişi:** sıcaklık ve hacim seçilen birimde girilir, kayda metrik yazılır (°F'tan gelen 0,01 °C'ye, galondan gelen 0,1 L'ye yuvarlanır). Düzenleme formunda değiştirilmeyen hacim alanı kayıttaki litreyi aynen korur; birim dönüşümü kaydı kaydırmaz. Hacim alanları her iki birimde ondalık kabul eder ve telefonda ondalıklı sayı tuş takımını açar; alt sınırları 1 L'nin tercih birimindeki karşılığıdır. Boş ya da geçersiz net hacim kayda yazılmaz (kayıt şemasına uymayan değer akvaryumu karantinaya düşürür).
- **Bilerek kalanlar:** motorun uyarı ve ölçüt metinleri 3. pakette (kod ve değişkene geçince) tercih birimine geçer. Debi (L/saat) ve elle girilen ekipman değeri uyarıları, kum hesabı (litre, kg) ve "10 L kova" şimdilik metrik kalır; galon/saat gibi birimler İngilizce paketinde değerlendirilir. Katalogdaki serbest metin açıklamalar 4. pakette ele alınır. Aramadaki Türkçe küçük harf eşleştirmesi (`toLocaleLowerCase("tr-TR")`) katalog Türkçe olduğu için arayüz dilinden bağımsız kalır.
- **Türkçe kullanıcının gördüğü fark:** ondalık virgül ve binlik nokta ("25,4 °C", "6,8", "1.500 L"), sıcaklıkla birim arasında boşluk, net hacim etiketinde birim. Metinler aynıdır.
