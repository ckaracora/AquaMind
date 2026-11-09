# Veri kapsamı

Katalogların her bilgisinin yüzde kaçının dolu olduğu ve kaynağının türü. Ürün sahibi 2026-10-28'de "hangi konuda yüzde kaç verimiz var, bilelim; ileride geliştirirken lazım olur" dedi. Bu belge o isteğin kalıcı kaydıdır.

## Nasıl ölçülür

- Tablo betikle üretilir: `node scripts/data-coverage.cjs` (ölçüm tarihi verilebilir: `node scripts/data-coverage.cjs 2026-10-28`; verilmezse bilgisayarın bugünkü günü). Hesap `src/lib/data-coverage.ts`'tedir.
- Bir katalog değişince aşağıdaki "Güncel durum" bölümü betiğin çıktısıyla yenilenir. `src/lib/__tests__/data-coverage.test.ts` belgedeki tabloyu, belgede yazan ölçüm tarihiyle yeniden hesaplar; tablo eskiyse test kırılır.
- Eski ölçümler "Geçmiş" bölümünde kısa satırlar olarak kalır.

## Satırlar ne demek

- **Kendi kaynak sayfası var (otomatik bağlantı değil):** kaydın kendi kaynak bağlantısı var. Bu, her değerin o sayfadan okunduğunu tek başına kanıtlamaz; değerlerin hangi sayfadan nasıl okunduğu `docs/CATALOG_LOG.md`'dedir.
- **Yalnız otomatik kaynak bağlantısı:** kendi kaynağı olmayan canlı kaydına katalog bilimsel addan bir FishBase ya da Seriously Fish bağlantısı ekler (`generatedSourceSpeciesIds`, `src/data/catalog-species.ts`). Bu bağlantı değerlerin o sayfadan okunduğunu göstermez.
- **Son 92 günde doğrulanmış:** kaydın doğrulama tarihi ölçüm günü ya da ölçüm gününden en çok 92 gün önce (ölçüm gününden sonraki tarih sayılmaz). Kaynaklar 3 ayda bir yeniden araştırılır (karar 0020); bu oran düştükçe sıradaki araştırma turu yaklaşır.
- Canlılarda sıcaklık, pH, yetişkin boy ve en az hacim zorunludur, her kayıtta vardır; tabloda gösterilmez.
- **Kaynak sayfası (ekipman ve bakım ürünleri):** kayıtta bir kaynak bağlantısı var. Bağlantının kime ait olduğu bu sayıda ayrılmaz: üreticinin ve kabul edilen mağazaların sayfalarının yanında eski, artık kabul edilmeyen bağlantılar da dahildir (ör. doğrulanmamışlar listesindeki bazı kayıtlar). Sitelere göre dağılım ürün sahibinin veri sayfasında görünür. **Doğrulanmamışlar listesi** (`src/data/catalog-equipment-unverified.ts`): değeri kaynakta bulunamayıp hesaptan çekilen kayıtlar. **Hesap değeri:** motorun kapasite hesabında kullandığı alanlar (filtrede debi ya da önerilen hacim veya hava motoruyla çalışma, ısıtıcıda güç ya da önerilen hacim); edilgen parçalar sayılmaz.
- **Bakım ürünleri, hacim:** yalnız hacmi olan ürünlerde sayılır (tank, akvaryum seti, akvateraryum, teraryum).
- **Bitkiler:** değer kuralı `docs/DATA_SOURCES.md` → "Bitkiler". Tropica sıcaklık ve pH yazmadığı için bu iki bilgi bitkilerin yaklaşık yarısında yok. "Bütün değerler dolu" ışık, CO₂, büyüme, boy, sıcaklık, pH ve yerleşimin hepsidir. "Yalnız uyarı kaydı", Fishkeeper'da ve Tropica'da sayfası olmayan, yalnız kaynaklı bir uyarısı (istilacı tür listesi ya da "su bitkisi değil") için katalogda olan bitkilerdir (karar 0026); bu kayıtların değeri yoktur ve değer satırlarının paydasına girer. "Su bitkisi değil etiketi" Practical Fishkeeping'in akvaryumda kaçınılacak ev bitkileri listesindeki bitkilerdir.

## Güncel durum

<!-- kapsam:başla -->
Ölçüm tarihi: 2026-11-03

### Canlılar (438 kayıt)

| Bilgi | Dolu | Oran |
|---|---|---|
| Kendi kaynak sayfası var (otomatik bağlantı değil) | 438/438 | %100 |
| Yalnız otomatik kaynak bağlantısı | 0/438 | %0 |
| En az tank uzunluğu | 409/438 | %93,4 |
| Akıntı | 396/438 | %90,4 |
| Davranış ya da bakım notu | 338/438 | %77,2 |
| Eş ad ya da satış adı | 389/438 | %88,8 |
| Son 92 günde doğrulanmış | 438/438 | %100 |

### Ekipman (3877 kayıt)

| Bilgi | Dolu | Oran |
|---|---|---|
| Kaynak sayfası | 3877/3877 | %100 |
| Doğrulanmamışlar listesinde değil | 3811/3877 | %98,3 |
| Hesap değeri (filtre, ısıtıcı, hava motoru) | 1264/1359 | %93 |
| Güç (W) | 1862/3877 | %48 |
| Önerilen hacim | 834/3877 | %21,5 |
| Son 92 günde doğrulanmış | 3877/3877 | %100 |

### Bakım ürünleri (3105 kayıt)

| Bilgi | Dolu | Oran |
|---|---|---|
| Kaynak sayfası | 3105/3105 | %100 |
| Hacim (tank, set, teraryum) | 169/198 | %85,4 |
| Son 92 günde doğrulanmış | 3105/3105 | %100 |

### Bitkiler (141 kayıt)

| Bilgi | Dolu | Oran |
|---|---|---|
| Işık | 136/141 | %96,5 |
| CO₂ | 119/141 | %84,4 |
| Büyüme hızı | 123/141 | %87,2 |
| Boy | 138/141 | %97,9 |
| Sıcaklık | 62/141 | %44 |
| pH | 61/141 | %43,3 |
| Yerleşim | 72/141 | %51,1 |
| Bütün değerler dolu | 30/141 | %21,3 |
| İstilacı tür etiketi | 7/141 | %5 |
| Su bitkisi değil etiketi | 1/141 | %0,7 |
| Yalnız uyarı kaydı (değer kaynağı yok) | 3/141 | %2,1 |
| Son 92 günde doğrulanmış | 141/141 | %100 |
<!-- kapsam:bitir -->

## Geçmiş

- 2026-11-03 (Xinyou üretici hacim doğrulaması): Xinyou/Junyou üreticisinin tam model sayfalarında XY-168, XY-180, XY-280, XY-2810, XY-2811, XY-2812, XY-2813, XY-2870, XY-2880 ve XY-380 için yayımlanan hacim sınırları ile sünger ölçüleri doğrudan okundu. İkincil kaynak farklılıklarında üretici değeri esas alındı; doğrulanmamışlar dışında kalan ekipman 3811/3877'ye, önerilen hacim kapsamı 834/3877'ye yükseldi. Bu cihazlar harici hava motoruyla çalıştığı için bağımsız filtre debisi uydurulmadı. Üretici sayfası kendi içinde çelişen XY-2836/XY-2902 ile üretici teknik değeri bulunmayan XY-2906/XY-2907 hesap dışında kaldı.
- 2026-11-03 (Resun LP-20 resmî teknik tablo): üreticinin LP20/LP40 sayfasındaki model tablosu LP-20 için 1500 L/saat, 17 W, 0,028 MPa, 6 çıkış ve 2,2 m azami hava taşı derinliği yayımlıyor. Mağazalar arasındaki 1500/1680 L/saat farkı üretici verisiyle çözüldü; kayıt otomatik kapasite hesabına geri alındı ve genel hesap değeri 1264/1359 ile %93'e yükseldi.
- 2026-11-03 (Aquawing AQ-WP distribütör doğrulaması): Aquawing'in sahibi Bursa Pet'in bölgesel temsilcisi Eksen Pet'in marka/ürün kataloğunda 12 AQ-WP modeli tam model kodu, barkod, debi ve güçle yeniden doğrulandı; Aquawing kapasite kapsamı 65/88'den 77/88'e, genel hesap değeri 1263/1359 ile %92,9'a yükseldi.
- 2026-11-03 (SunSun HW-502/HW-503 kimlik ve kapasite düzeltmesi): üreticinin resmî HW seri tablosuyla eski `502` ve `503` kayıtları HW-502 (320 L/saat, 5 W) ve HW-503 (350 L/saat, 5 W) olarak düzeltildi. Türkiye'de 600 L/saat ve 6 W ile satılan ayrı 503B kaydıyla karışıklık giderildi; kaynaksız 60 L hacim sınırı kaldırıldı. SunSun kapasite kapsamı 48/48'e, genel hesap değeri 1251/1359 ile %92,1'e yükseldi.
- 2026-11-03 (WaterBear WB-2770): Cikletist Petshop'un tam model sayfasındaki 800 L/saat debi ile Aquarubi'nin tam model sayfasındaki 12 W güç birleştirildi; çelişkili mağaza açıklamasındaki 900 L/saat ve güvenilir olmayan hacim önerileri kullanılmadı. WaterBear hesap kapsamı 20/20'ye, genel ekipman hesap değeri 1249/1359 ile %91,9'a yükseldi.
- 2026-11-03 (Resun LP seri kaynak denetimi): üreticinin resmî LP60–300 başlıklı sayfasındaki teknik tablo yalnız LP60, LP100 ve LP200 satırlarını yayımlıyor. LP60 (4200 L/saat, 50 W) ve LP100 (8400 L/saat, 100 W) resmî kaynağa taşındı. LP200 için üreticinin 14.000/15.000 L/saat ve 230 W değerleri ile kabul edilen yerel mağazanın 15.000 L/saat ve 200 W değeri karşılaştırıldı; otomatik hesapta yayımlanmış güvenli alt debi 14.000 L/saat kullanıldı, çelişkili güç alanı kaldırıldı. LP300 sayısal satırı resmî tabloda bulunmadığından hesap dışında kaldı; kapsam oranı değişmedi.
- 2026-11-02 (Sobo distribütör doğrulaması): Türkiye yetkili distribütörünün tam model sayfalarıyla SB-848 (540 L/saat, 12 W), SB-860A (720 L/saat, 10 W) ve WP-4001 (2000 L/saat, 30 W, 200 L) güvenli kapasite hesabına geri alındı; ekipman hesap değeri kapsamı 1248/1359 ile %91,8'e yükseldi.
- 2026-11-02 (kerevit kaynak denetimi): canlılar 438 seçilebilir kayıt; Meksika cüce kereviti, elektrik mavi kerevit ve kırmızı kıskaçlı kerevit kabul edilen Wirbellose/Fishkeeper kaynaklarıyla yenilendi; onaylı tür bakım eşiği bulunamayan minik cüce kerevit otomatik sağlık hesabından çıkarılıp açıklamalı güvenlik listesine alındı.
- 2026-11-02 (omurgasız kaynak güvenliği): canlılar 439 seçilebilir kayıt; zorunlu bakım eşikleri yalnız satıcı/ikincil profilden gelen genel Pinto, Galaxy Fishbone, kırmızı bataklık kereviti ve mermer kerevit otomatik sağlık hesabından çıkarılıp açıklamalı güvenlik listesine alındı.
- 2026-10-31 (katalog ana entegrasyonu): canlılar 443, ekipman 3877, bakım ürünleri 3105 kayıt; ekipman hesap değeri kapsamı %91,6; bitkiler 141 kayıt.
- 2026-10-28 (bitki kataloğu 3): bitkiler 141 kayıt; üç yalnız uyarı kaydı eklendi (*Azolla filiculoides*, *Ophiopogon japonicus*, *Pistia stratiotes*), değerleri olmadığı için değer satırlarının oranı biraz düştü (sıcaklık %44, pH %43,3, bütün değerler dolu %21,3); istilacı tür etiketi 7, su bitkisi değil etiketi 1.
- 2026-10-28 (ilk ölçüm): canlılar 423 kaydın hepsinde kendi kaynak sayfası; ekipman 3541 kayıt, hesap değeri %90,8; bakım ürünleri 1893 kayıt; bitkiler 138 kayıt, bütün değerler dolu %21,7 (sıcaklık %44,9, pH %44,2).
