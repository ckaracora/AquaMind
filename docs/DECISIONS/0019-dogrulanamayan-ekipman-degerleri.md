# 0019 — Doğrulanamayan ekipman değerlerinin hesaptan çekilmesi

- Tarih: 2026-10-16 (kabul edilen mağaza taraması 2026-10-17)
- Durum: Kabul edildi (ürün sahibi kararı 2026-10-11); uygulama `codex/equipment-care-3` dalında `e2dd8ac` ve `8f066cf` (altın fikstür) olarak kaydedildi, PR #30. Codex üç tur denetledi; 3. turun test düzeltmesi ürün sahibinin 2026-10-19 kararıyla "temiz" almadan gönderildi.

## Bağlam

2026-10-07 taramasında sağlık hesabında kullanılan filtre, hava motoru ve ısıtıcı kayıtlarının bir bölümünün tek kaynağı `docs/DATA_SOURCES.md` sırasına uymuyordu. Boyu (PR #22) ile Jeneca ve Dophin (PR #23) üreticinin sitelerinden yeniden kaynaklandı. Kalan kayıtlar küçük markalara aitti; bunların çoğunun bulunabilir bir üretici sitesi yok ve değerleri yabancı mağazalarda, pazar yerlerinde, kılavuz sitelerinde ya da kabul edilmemiş yerel mağazalarda yayımlanıyor.

Ürün sahibi 2026-10-11'de iki karar verdi:

1. Kabul edilen yerel mağaza listesi (6 mağaza) değişmeyecek (2026-10-07).
2. Küçük markalar için derin kaynak araştırması yapılmayacak. Basit kural: değer yalnızca üretici sitesinden ya da kabul edilen 6 mağazadan doğrulanabiliyorsa kalır; aksi halde değer silinir, cihaz adıyla ve kapasite notuyla listede kalır, kullanıcı etiket değerini kendisi girer (0017). Tek toplu paket.

## Karar

1. **Kapsam.** Sağlık hesabında kullanılan ekipman (filtre, hava motoru, ısıtıcı ve ısıtıcılı cihaz; pasif parçalar hariç). Kaynak sınıflandırması: üretici ya da resmî marka sitesi, Türkiye distribütörü (kaynak önceliğinde 2. sıra; ör. Sobo için yetkili distribütör Angora Akvaryum'un `sobo.com.tr` sitesi), kabul edilen 6 yerel mağaza. Bunların dışındaki kaynaklar "zayıf" sayılır.
2. **Tarama (2026-10-16).** Zayıf kaynaklı ve sayısal değeri olan 170 kayıt bulundu. Aquawing AQ-A1000, AQ-A2000, AQ-A3000 ve Nubios YU-118C değişmez: zaten hesap dışıydı ve güç değerleri 2026-09-25 denetiminde Türkiye kaynağıyla doğrulandı. Kalan 166 kayıt bu kararın kapsamındadır.
3. **Kabul edilen mağazalarda arama (2026-10-17).** 166 kaydın her modeli kabul edilen mağazaların kendi aramasıyla ya da filtre ve hava motoru kategorilerinin bütün sayfalarıyla arandı (Akvaryum Express, Atakan Petshop, Malawi İzmir, Aquarubi, Betta Marketim). Çikletist Pet Shop sayfası insan doğrulaması (Cloudflare) istediği için açılamadı; bu doğrulama geçilmedi. Bir değer şu kurallarla doğrulanmış sayılır:
   - Değer, tam modelin kendi ürün sayfasında (başlık, açıklama ya da teknik tablo) yazar. Marka ya da liste sayfasındaki genel metin yetmez; model kodu farklı tür (ör. Sobo WP-190F için mağazadaki WP-190F-UV5) eşleştirilmez.
   - Yalnızca kayıtta önceden olan alanlar geri gelir; kayda yeni alan (ör. mağazanın yazdığı ama kayıtta olmayan akvaryum hacmi) eklenmez.
   - Mağazanın değeri eski kaynaktan farklıysa mağazanınki kullanılır (ör. WaterBear Q serisi, Resun LP-200, Sobo SB-860A gücü, Sobo WP-303H hacmi).
   - Kabul edilen mağazalar ya da aynı sayfanın başlığı ile açıklaması aynı alanı farklı yayımlıyorsa o alan kullanılmaz ve açıklamada farkı söyler (ör. Aquawing AQ1300F gücü 25 W / 30 W, AQ680 önerilen hacmi 80 L / 350 L, WaterBear WB-2770 debisi 800 / 900 L/saat, Resun LP-20 hava debisi 28 L/dakika / 1500 L/saat).
   - Ejet 905F için Malawi İzmir'in 1000 L/saat değeri, 2026-08-27 Ejet denetiminde eldeki 470 L/saat kaydıyla çelişkili bulunup kullanılmamıştı; mağaza sayfası güç de vermiyor. Hangisinin doğru olduğu kurala uyan bir kaynaktan çözülemediği için ikisi de kullanılmaz.
   - Hava debisi L/dakika yazıldıysa L/saate çevrilir (×60); çok çıkışlı motorda çıkışlar toplanır.
4. **Sonuç.** 166 kaydın:
   - 76'sı kabul edilen mağazada doğrulandı (`shopVerifiedEquipment`): kaynak bağlantısı mağaza sayfasına geçer, doğrulama tarihi 2026-10-17 olur, açıklama mağaza sayfasına göre yeniden yazılır, doğrulanmayan alan çekilir. 71'i bağımsız kapasite hesabına girer. Dördünde (Aquawing AQ312, Resun LP-20, Sobo SB-860A, WaterBear WB-2770) yalnız güç doğrulandığı için kapasite notu kalır; Xinyou XY-2835 sünger filtredir ve 40 litre hacim sınırı geri gelir.
   - 86'sının bütün sayısal değerleri çekilir (`unverifiedEquipmentIds`): mağazalarda bulunamadı, mağaza değer vermiyor ya da değer kullanılamadı.
   - Regent 6500, 7500, 8500 ve 9500'te yalnız hava debisi çekilir (`unverifiedAirFlowIds`): mağazaların ürün sayfaları gücü yayımlıyor, debiyi yayımlamıyor. Atakan Petshop'un marka sayfasındaki "6500 cc/dk hava akışı" gibi ifadeler ürün sayfası değil ve sayılar model adlarıyla aynı; Akvaryum Express 9500 için birimsiz "900-1600 litre" yazıyor.
   - Bilinçli istisna: Regent güçleri bu pakette yeniden değerlendirilmedi; önceki denetimde belirlenen değerler kalır (6500, 8500 ve 9500'te Türkiye ürün etiketi). 9500 için Atakan Petshop ve Akvaryum Express 4 W, Malawi İzmir 5 W yazıyor; bu fark kaydın açıklamasında zaten belirtiliyor ve hava motorunda güç otomatik hesaba girmiyor. Bu yüzden çelişki kuralı (3. madde) Regent gücüne uygulanmadı.
5. **Uygulama.** Listeler ve işlev `src/data/catalog-equipment-unverified.ts` dosyasındadır; katalog yüklenirken çalışır. Değeri çekilen kayıtta açıklamadan sayısal ya da yazıyla yazılmış değer parçaları çıkarılır ("debi doğrulanamadı", "hava debisi doğrulanamadı" ya da "önerilen hacim doğrulanamadı" eklenir) ve kayda kaynağı adıyla bir kapasite notu yazılır ("Değerlerin kaynağı …; üretici, Türkiye distribütörü ya da kabul edilen yerel mağazalarda doğrulanamadı. Otomatik hesapta kullanılmaz."). Kaynak bağlantısı, doğrulama tarihi, ürün kodu ve barkod kalır. Kaynağın yayımladığı eski değerler kaydın tanımlandığı dosyada belge olarak durur.
6. **Hava motoruyla çalışan sünger filtreler** (Xinyou, 11 kayıt): önerilen hacim çekilir, "hava motoruna bağlı filtre" özelliği kalır. Bu kayıtlar kapasite notu almaz (katalog bütünlük kuralı); motor bunları hacim önerisi olmadan hava motoruna bağlı filtre olarak değerlendirir (mevcut kural).
7. **Ekipman sayfası.** Katalogdan seçilen cihazın kartı, kayda eklenme anında kopyalanan açıklamayı değil güncel katalog açıklamasını gösterir (`specificationsForEquipment`); kayıttaki eski metin silinmez. Katalogla eşleşmeyen cihazda kayıttaki metin kalır.
8. **Motor değişmez.** Değeri çekilen cihaz, katalogda değeri olmayan bir cihazla aynı kuraldan geçer: "Ekipman kapasite bilgisi eksik" uyarısı ve 0017'deki elle değer girişi. Filtrenin değeri çekildiyse filtrasyon uygunluğu nötr (60, uyarı) değerlendirilir; hava motorunun debisi çekildiyse sünger filtre çalışan filtre sayılmaz ve filtrasyon uygunluğu 45 (tehlike) olur. `ENGINE_VERSION` ve `RULESET_VERSION` değişmez.

## Sonuçlar

- Bu cihazlardan birini kaydeden kullanıcı sağlık analizinde "Ekipman kapasite bilgisi eksik" uyarısını görür ve cihazın etiketindeki debiyi ya da gücü girerek sonucu geri alabilir.
- Altın fikstürde 1.033 vakadan 4'ü değişir (3 filtre, 1 hava motoru vakası; hepsi hiçbir kabul edilen mağazada doğrulanamayan Aquawing kayıtları: AQ101F, AQ101FB, AQ102F, AQ160). Fikstür ayrı commit'te (`8f066cf`) yeniden üretildi.
- Bilinen sınırlar:
  - Çikletist Pet Shop taranamadı; değeri çekilen 86 kayıttan bazıları orada doğrulanabilir. Ürün sahibi sayfayı kendi tarayıcısında açarsa ayrı bir paketle bakılabilir.
  - Hava motorunun debisi bilinmediğinde motor, sünger filtre için "hava motoru gerekli … katalogdan uygun bir hava motoru ekleyin" uyarısını verir; kullanıcının listede değeri olmayan bir hava motoru varsa bu metin yanıltıcı olabilir. Metnin değişmesi motor değişikliğidir ve ayrı bir ürün kararı gerektirir.
  - Mağaza sayfaları zamanla değişebilir; değerler 2026-10-17'de okunan hâlleriyle işlendi.
