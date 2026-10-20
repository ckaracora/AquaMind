# 0021 — Dil altyapısı

- Tarih: 2026-10-19
- Durum: Kabul edildi (teknik karar, Claude; ürün sahibinin 2026-10-19 "dile uygun yapıya geçelim, çeviri kesin yapılacak, farklı dillere de" kararına dayanır, `docs/DECISIONS/0020-urun-hedefleri-ve-yol-haritasi.md`). 1. paket PR #32 (`671a719`), 2a PR #33 (`4fd4bbf`), 2b PR #34 (`1e19313`), 2c PR #35 (`7d1bde3`), 2d PR #36 (`9722806`) ile birleştirildi. 3. paket (motor çıktı biçimi) için `docs/COMPATIBILITY.md` gereği ayrı ürün sahibi onayı istendi; ürün sahibi 2026-10-20'de onayladı. 3. paket PR #42 (`4c3900b`) ile birleştirildi (motor 1.10.0; aşağıda "3. paket ayrıntıları"); 3b `codex/i18n-3b` dalında uygulandı (aşağıda "3b ayrıntıları").

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
   3. Sağlık analizi motoru: uyarı ve ölçütler kod ve değişken olarak üretilir, metin dil dosyasından yazılır. Kurallar ve puanlar değişmez; çıktı biçimi değiştiği için altın fikstür ayrı commit'te yeniden üretilir. Motor metinlerinde birim tercihi ve dile göre sayı biçimi, Türkçe ekranda görünür fark yarattığı için ayrı küçük pakette (3b) gelir.
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
- **Bilerek kalanlar:** motorun uyarı ve ölçüt metinleri kod ve değişkene geçtikten sonra (3. paket) 3b paketinde tercih birimine geçti. Debi (L/saat) ve elle girilen ekipman değeri uyarıları, kum hesabı (litre, kg) ve "10 L kova" şimdilik metrik kalır; galon/saat gibi birimler İngilizce paketinde değerlendirilir. Katalogdaki serbest metin açıklamalar 4. pakette ele alınır. Aramadaki Türkçe küçük harf eşleştirmesi (`toLocaleLowerCase("tr-TR")`) katalog Türkçe olduğu için arayüz dilinden bağımsız kalır.
- **Türkçe kullanıcının gördüğü fark:** ondalık virgül ve binlik nokta ("25,4 °C", "6,8", "1.500 L"), sıcaklıkla birim arasında boşluk, net hacim etiketinde birim. Metinler aynıdır.

## 2b ayrıntıları

- **Kapsam:** ana sayfa, akvaryum listesi, akvaryum sayfası, yeni akvaryum, akvaryumu düzenle ve sağlık analizi sayfalarının metinleri; su değeri durum etiketleri ve selamlama.
- **Yardımcı modüller metin değil anahtar döndürür:** `src/lib/water-status.ts` (`ParameterStatus.key`, özet cümlesi `healthSummary(...).key`) ve `src/lib/greeting.ts`. Ekran metni seçili dilin dosyasından alır; böylece aynı kural her dilde çalışır ve testler metne değil anahtara bakar. Anahtarların Türkçe metni ayrı bir testle eskiden ekranda yazan metne bağlanır.
- **Ortak sözcükler:** birden çok ekranda aynı anlamla geçen sözcükler (`common`: akvaryum tipleri, "Net hacim", "Kurulum", "Vazgeç", sayılı "… canlı", "… tür") tek yerde tutulur. Kimyasal ve ölçü simgeleri (pH, TDS, NO₃, ppm, cm) dilden bağımsız olduğu için koda yazılı kalır.
- **Büyük harf:** büyük harfle görünen etiketler dil dosyasında olağan yazımla tutulur, büyük harf CSS ile verilir (`uppercase`); sayfanın dili Türkçe olduğu için "Brüt hacim" "BRÜT HACİM" olarak görünür.
- **Doğrulama yöntemi:** yerel sunucu ile canlı sitenin aynı sayfalarındaki görünen metin, erişilebilir adlar, yer tutucular ve seçenekler satır satır karşılaştırılır; bilinçli düzeltmeler dışında fark olmamalıdır. İki sekme aynı pencere boyutunda olmalıdır (telefon ve masaüstü düzeni farklı metin gösterir).

## 2c ayrıntıları

- **Kapsam:** su değerleri, bakım günlüğü, canlılar ve bitkiler sayfaları; ölçüm, bakım, canlı ekleme ve bitki ekleme pencereleri.
- **Kayıtta Türkçe tutulan değerler:** bitki konumu kayda Türkçe adıyla yazılır ("Ön plan" ...). Kayıt biçimini değiştirmek var olan kullanıcı verisinin taşınmasını gerektirir; bu, hesaplar ve bulut aşamasında (Phase 1) kayıt biçimiyle birlikte ele alınacaktır. O zamana kadar bu Türkçe değerler sabit kimlik gibi kullanılır, ekranda dil dosyasındaki ad gösterilir; listede olmayan eski bir değer olduğu gibi yazılır. Bakım görevinin başlığı da kullanıcı içeriğidir; boş bırakılırsa tür adı o anki dilde kaydedilir.
- **Ortak sözcükler:** birden çok ekranda aynı anlamla geçen sözcükler (`common`) bu pakette genişletildi; 2b'de sayfaya özgü tutulan aynı metinler ("Tarih", "… kayıt", "… silinsin mi?", tür aralıkları yüklenemedi uyarısı) ortak anahtara bağlandı.

## 2d ayrıntıları

- **Kapsam:** ekipman, ürün kataloğu, hesaplayıcılar ve ayarlar sayfaları; ekipman ekleme ve elle değer pencereleri. Bu paketle 2. paket tamamlanır: bütün sayfaların arayüz metinleri dil dosyasındadır, kodda yalnız birim ve kimyasal simgeleri kalır.
- **Metin üreten yardımcı modüller:** elle girilen ekipman değerinin hata ve uyarı cümleleri (`src/lib/user-equipment-value.ts`) sayılar ve aralıklarla kurulur. Kural ve yuvarlama modülde kalır; cümle kalıpları dil dosyasındadır, sayı biçimi seçili dilden gelir (`UserValueTexts`). Böylece hesap tek yerde, metin her dilde doğru kalır.
- **Kimlikli listeler:** hesaplayıcının kum türleri kodda yalnız kimlik ve yoğunlukla tutulur; adları ve açıklamaları dil dosyasındadır. Her kimliğin dil dosyasında karşılığı olduğu test edilir.
- **Bilerek kalanlar:** ürün kategorileri ve ürün açıklamaları, ekipman açıklamaları ve kapasite notları katalog içeriğidir (4. paket). Sağlık analizi motorunun uyarı ve ölçüt metinleri 3. pakette kod ve değişkene geçer.

## 3. paket ayrıntıları

- **Sonuç biçimi v2 (motor 1.10.0):** her uyarı `code` (ör. `filterFlowLow`) ve `params` (ör. `{ turnover: 3.2, min: 4 }`), her ölçüt `detailCode` ve `detailParams` taşır. Değişkenler sayı, metin, doğru/yanlış ya da ad listesidir; ölçüler içeride metriktir (litre, cm). Kural seti (1.9.0), puanlar, durumlar ve uyarıların sırası değişmedi.
- **Kodlar:** 48 uyarı ve 38 ölçüt açıklaması kodu; ölçütlerin adı `key` alanından gelir. Kod kararlı bir addır: metin değişse de kod aynı kalır, yeni bir anlam yeni kod alır.
- **Metin dil dosyasında:** ekran uyarı ve ölçüt metnini dil paketinin ayrı girişinden kurar (`@aquamind/localization/engine`: `engineMessagesFor(locale)`, `EngineMessages` tipi; metinler `packages/localization/src/messages/tr-engine.ts`, kuran modül `src/lib/engine-text.ts`). Başka dilin motor metinleri `EngineMessages` tipini karşılamazsa derleme hata verir. Dil dosyasında karşılığı olmayan bir kod gelirse motorun kendi Türkçe metni gösterilir; ekran boş kalmaz.
- **Sayfa hızı:** motor metinleri arayüz metinlerinden (`Messages`) ayrı tutulur ve paketin ana girişi onları içe aktarmaz. Ana giriş bütün sayfalarda yüklendiği için, metinler ona bağlı olsaydı her sayfa yaklaşık 5 kB büyürdü (ilk denemede ölçüldü); ayrı girişle motor metinleri yalnız sağlık analizi sayfasına girer (ilk yükleme 159 → 165 kB). Motoru kullanan ana sayfa ve ekipman sayfası motorun kendi büyümesiyle (kod ve değişken alanları) 1 kB büyür; öteki sayfalar `main` ile aynıdır. Bunu bir test korur (ana girişte ve `messages/tr.ts`'te motor metinlerinin içe aktarılmaması).
- **Türkçe alanlar kaldı:** motor `title`, `message`, `label` ve `detail` alanlarını eskisi gibi üretir. Bu alanlar eşitlik testinin ölçüsüdür ve kalıcı hesaplama kaydı (Phase 1) tasarlanana kadar kalır.
- **Eşitlik güvencesi:** `src/lib/__tests__/engine-text.test.ts` dil dosyasının kurduğu metni motorun Türkçe metniyle altın fikstürün 1.033 vakasında ve fikstürde geçmeyen kodları tetikleyen 16 senaryoda karşılaştırır. Ayrıca motor kaynağındaki her kodun dil dosyasında karşılığı olduğunu, dil dosyasında kullanılmayan kod kalmadığını ve her kodun en az bir kez sınandığını denetler. Bu yüzden Türkçe kullanıcı hiçbir fark görmez.
- **Altın fikstür:** yeni alanlar eklendiği için yeniden üretildi; ayrı commit'te kaydedilir. Yeni alanlar çıkarılınca fikstür bir önceki sürümle (`bfaa8e8`) 1.033 vakanın hepsinde birebir aynıdır.
- **Katalogdan gelen değişkenler:** tür ve ekipman adları ile katalogdan gelen bakım ve davranış metinleri (`text`, `note`, `condition`, `source`) değişkenlerde Türkçe katalog metni olarak taşınır. Dil dosyası bunları cümleye yerleştirir, motorun cümlesinden ayrıştırmaz; çevirileri katalogla birlikte 4. pakette gelir.
- **Bilerek kalanlar (3b):** motor metinlerinde birim tercihi (galon) ve dile göre sayı biçimi henüz uygulanmadı. Dil dosyası sayıları bilerek motorun bugünkü biçimiyle yazar (hacim litre; güçlü akıntı uyarısındaki çevrim/saat ve alan uyarısındaki santimetreler ondalık noktayla, su değerleri ve filtre çevrimi virgülle). Bunları uygulamak Türkçe ekranda görünür fark yaratacağı için eşitliği kanıtlanmış bu paketin üstüne ayrı küçük paket olarak geldi (aşağıda "3b ayrıntıları").

## 3b ayrıntıları

- **Kapsam:** sağlık analizi sayfasındaki uyarı ve ölçüt metinlerinde ayarlardaki hacim tercihi (litre ya da galon) ve dilin sayı biçimi. Motor değişmedi: sürüm 1.10.0, altın fikstür aynı.
- **Biçimleyici:** dil dosyası sayıyı kendisi yazmaz; ekranın biçimleyicisinden kurulan `EngineTextFormat` ile yazar (`packages/localization/src/engine-format.ts`, `engineTextFormat`):
  - `number`: adet, yüzde ve watt;
  - `cycles`: çevrim/saat, tek ondalık;
  - `measurement`: su ölçümü, en az üç ondalık hassasiyet (serbest amonyakta dört);
  - `volume`: hacim, tercih edilen birimde, en az bir ondalık hassasiyet;
  - `length`: uzunluk, santimetre.
- **Yuvarlama farkı gizlemez:** su ölçümü ve hacim, sıfırdan büyük bir değer "0" görünecekse ya da uyarının karşılaştırdığı iki değer farklıyken aynı görünecekse gerektiği kadar ondalıkla yazılır (en çok altı; o da yetmezse sayının tam yazımıyla, ör. "0,0000001"): "Nitrit 0,2004 ppm; güvenli üst sınır 0,2 ppm", "Akvaryumun net hacmi (600,01 L) … (600 L) üstünde", "0,03 gal". Uyarının dayandığı sabit sınır da değerle karşılaştırılır: deniz akvaryumunda nitrat 100 ppm ("Nitrat 100,0004 ppm; … üst sınır 100 ppm"), tatlı ve acı suda tehlike sınırı 100 ppm (musluk suyu 50 + 50) ve uyarı sınırı 50 ppm. Sabitler motorun `MARINE_NITRATE_LIMIT`, `TAP_WATER_NITRATE_LIMIT` ve `NITRATE_ABOVE_TAP_LIMIT` değerleriyle aynıdır ve testle bağlıdır. Farklı iki değer aynı, sıfırdan büyük değer "0" yazılmaz; tek sınır, hacim galona çevrilirken sayının yaklaşık 15. anlamlı basamağından sonraki farkların ve sıfıra aşırı yakın hacimlerin çevirmede kaybolmasıdır. Motorun eski metni bu durumlarda iki değeri aynı ya da "0" yazıyordu.
- **Türkçe kullanıcının gördüğü fark** (sözcükler aynı):
  - güçlü akıntı uyarısında ondalık virgül ("13.0" yerine "13,0");
  - alan uyarısındaki santimetrelerde ondalık virgül ("13,5 cm");
  - 1.000 ve üstü sayılarda binlik nokta ("1.200 L");
  - ondalıklı net hacimde virgül ve bir ondalık (karşılaştırılan değerle aynı görünecekse daha çok);
  - filtre debisi uyarısında önerilen en az çevrim de tek ondalıkla ("en az 4,0");
  - sınırı çok az aşan ya da çok küçük su değerleri gerektiği kadar ondalıkla (yukarıda);
  - galon tercihinde hacimler galonla ("317 gal", "158,5 gal").
- **Bilerek kalanlar:**
  - Uzunluk santimetre kalır, çünkü uzunluk birimi tercihi yok; akvaryum ölçüleri formda da santimetredir.
  - Katalogdan gelen metinlerdeki sayılar (ör. "yaklaşık 54 litre") katalog içeriğidir ve 4. pakette ele alınır.
  - Sıcaklık ve debi motor metinlerinde geçmez.
- **Test** (`src/lib/__tests__/engine-text.test.ts`):
  - Eşitlik testi işaretli bir sınama biçimleyicisiyle çalışır. Dil dosyasının biçimlediği her sayı işaretlenir; işaretlerin dışındaki her şey (sözcükler, katalogdan gelen metin) motorun Türkçe metniyle birebir aynı olmalıdır.
  - İşaretli sayıların değeri iki yerde denetlenir. Motorun metnindeki sayıyla aynı olmalıdır: hacim ve adet tam eşit; çevrim/saat ve santimetre en çok 0,05, su ölçümü yuvarlama payı kadar farklı. Gerçek Türkçe biçimleyicinin yazdığı metinde de Türkçe yazımla (binlik nokta, ondalık virgül; ondalık nokta kabul edilmez) aynı değeri taşımalıdır.
  - Tip denetimi: TypeScript tip bilgisiyle dil dosyasının tamamı, açılmayan dallar dahil taranır ve izin listesiyle çalışır. Sayı türündeki her ifade yalnız biçimleyicinin bağımsız değişkeni, karşılaştırma ya da koşul (`?:`, `if`, `!`, `Boolean()`), dizi sırası ya da kesme konumu, ad tanımı ya da sayı sabiti tanımı olabilir. Başka her kullanım (şablon, birleştirme, `String()`, `JSON.stringify`, `toString`, köşeli parantezli çağrı, dizide `join`) hatadır.
  - Okuyucu denetimi: tip denetimi okuyucuların (`num`, `str`, `list`, `flag`) verdiği türe güvendiği için dil dosyası söz dizimi ağacıyla ayrıca taranır. Okuyucuya yapılan her başvuru doğrudan bir çağrı olmalı (takma ad ya da değer olarak geçirme yok), çağrı `(p, "ad")` biçiminde sabit bir adla yapılmalı, ad motorun gerçekten gönderdiği değişkenlerden olmalı ve türü okuyucuyla aynı olmalıdır (sayı olan bir değişkeni metin gibi okumak yasak).
  - Sızıntı denetimi: örneklerde açılan dallarda bütün sayı değişkenleri ayırt edilebilir bir değerle değiştirilip yazılır. İşaretler ve metin değişkenleri çıkarılınca geriye yalnız kalıbın sabit sayıları kalmalıdır.
  - Yöntem tablosu: her uyarı ve ölçüt kodunda hangi değişkenin hangi sırayla, hangi türde (adet, çevrim/saat, su ölçümü ve ondalık sayısı, hacim, uzunluk) yazıldığı tabloyla sabitlenir. Kayıt sırasında her sayı değişkenine ayrı bir değer verildiği için tablo verideki rastlantısal eşitliklere bağlı değildir; bu değerler sayıya bağlı dalları değiştirdiğinden gerçek verideki çağrı sırası da kaydedilir ve tablodaki bir sıranın alt dizisi olmalıdır. Sınama biçimleyicisinin kabul payı dil dosyasının seçtiği ondalıktan türediği için ondalık sayısı ayrıca bu tabloyla bağlanır.
  - Örneklerde başka türlü açılmayan dallar için senaryolar vardır: "ve N ekipman daha", kaynağın kapasite notu, elle girilen değer, acı su, birden çok önerili filtre, altı ondalıkta bile ayırt edilmeyen değerler, deniz ve tatlı su sınırlarını çok az aşan nitrat.
  - Yuvarlama kuralı, litre ve galon tercihleri örnek cümlelerle sınanır. Galon tercihinde dil dosyasının yazdığı hiçbir hacim litre değildir.
  - Bozma denemeleri: noktalı çevrim, biçimleyicisiz sayı (düz, parantezli, tek tırnaklı, aritmetikli), sabit litre, değişen sözcük, yanlış değer, yanlış değişken, küçük su değeri farkı, su ölçümünde yanlış yöntem, her zaman "0" ya da sıfır ondalık yazan su biçimi, ayırt etmeyen hacim biçimi, tam yazıma düşmeyen biçim, çevrim yerine adet, serbest amonyakta dört yerine üç ondalık, serbest amonyak ile sınırın ondalıklarının yer değiştirmesi, adet 1 iken biçimleyicisiz sayı (düz, köşeli parantezli `toString`, `JSON.stringify`), kalan ekipman sayısında hesaplanmış ham sayı ve çevrim yöntemi, açılmayan dallarda değişen sözcükler, nitrat sınırlarıyla (deniz, tatlı su tehlike ve uyarı) eşleştirilmeyen değer, adet 1 iken çevrim yöntemi, sayının metin okuyucusuyla okunması, değişken adının sabit yazılmaması, okuyucunun boşluklu ya da değer olarak çağrılması. Her biri en az bir testi kırdı; zararsız `Boolean(sayı)` koşulu kabul edilir.
