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
- Canlılarda sıcaklık, yetişkin boy ve en az hacim zorunludur, her kayıtta vardır; pH, su türü yalnız tuzlu su olan kayıtlar dışında zorunludur. Deniz canlılarının kaydında pH ve tuzluluk yoktur, çünkü bu değerler akvaryum düzeyindedir (karar 0029 ve 0030). Bu bilgiler tabloda gösterilmez.
- **Kaynak sayfası (ekipman ve bakım ürünleri):** kayıtta bir kaynak bağlantısı var. Bağlantının kime ait olduğu bu sayıda ayrılmaz: üreticinin ve kabul edilen mağazaların sayfalarının yanında eski, artık kabul edilmeyen bağlantılar da dahildir (ör. doğrulanmamışlar listesindeki bazı kayıtlar). Sitelere göre dağılım ürün sahibinin veri sayfasında görünür. **Doğrulanmamışlar listesi** (`src/data/catalog-equipment-unverified.ts`): değeri kaynakta bulunamayıp hesaptan çekilen kayıtlar. **Hesap değeri:** motorun kapasite hesabında kullandığı alanlar (filtrede debi ya da önerilen hacim veya hava motoruyla çalışma, ısıtıcıda güç ya da önerilen hacim); edilgen parçalar sayılmaz.
- **Bakım ürünleri, hacim:** yalnız hacmi olan ürünlerde sayılır (tank, akvaryum seti, akvateraryum, teraryum).
- **Bitkiler:** değer kuralı `docs/DATA_SOURCES.md` → "Bitkiler". Tropica sıcaklık ve pH yazmadığı için bu iki bilgi bitkilerin yaklaşık yarısında yok. "Bütün değerler dolu" ışık, CO₂, büyüme, boy, sıcaklık, pH ve yerleşimin hepsidir. "Yalnız uyarı kaydı", Fishkeeper'da ve Tropica'da sayfası olmayan, yalnız kaynaklı bir uyarısı (istilacı tür listesi ya da "su bitkisi değil") için katalogda olan bitkilerdir (karar 0026); bu kayıtların değeri yoktur ve değer satırlarının paydasına girer. "Su bitkisi değil etiketi" Practical Fishkeeping'in akvaryumda kaçınılacak ev bitkileri listesindeki bitkilerdir.

## Güncel durum

<!-- kapsam:başla -->
Ölçüm tarihi: 2026-11-13

### Canlılar (468 kayıt)

| Bilgi | Dolu | Oran |
|---|---|---|
| Kendi kaynak sayfası var (otomatik bağlantı değil) | 468/468 | %100 |
| Yalnız otomatik kaynak bağlantısı | 0/468 | %0 |
| En az tank uzunluğu | 426/468 | %91 |
| Akıntı | 403/468 | %86,1 |
| Davranış ya da bakım notu | 362/468 | %77,4 |
| Eş ad ya da satış adı | 420/468 | %89,7 |
| Son 92 günde doğrulanmış | 468/468 | %100 |

### Ekipman (3535 kayıt)

| Bilgi | Dolu | Oran |
|---|---|---|
| Kaynak sayfası | 3535/3535 | %100 |
| Doğrulanmamışlar listesinde değil | 3414/3535 | %96,6 |
| Hesap değeri (filtre, ısıtıcı, hava motoru) | 1123/1249 | %89,9 |
| Güç (W) | 1691/3535 | %47,8 |
| Önerilen hacim | 717/3535 | %20,3 |
| Son 92 günde doğrulanmış | 3535/3535 | %100 |

### Bakım ürünleri (1893 kayıt)

| Bilgi | Dolu | Oran |
|---|---|---|
| Kaynak sayfası | 1893/1893 | %100 |
| Hacim (tank, set, teraryum) | 126/147 | %85,7 |
| Son 92 günde doğrulanmış | 1893/1893 | %100 |

### Bitkiler (152 kayıt)

| Bilgi | Dolu | Oran |
|---|---|---|
| Işık | 144/152 | %94,7 |
| CO₂ | 123/152 | %80,9 |
| Büyüme hızı | 131/152 | %86,2 |
| Boy | 146/152 | %96,1 |
| Sıcaklık | 82/152 | %53,9 |
| pH | 79/152 | %52 |
| Yerleşim | 75/152 | %49,3 |
| Bütün değerler dolu | 37/152 | %24,3 |
| İstilacı tür etiketi | 10/152 | %6,6 |
| Su bitkisi değil etiketi | 3/152 | %2 |
| İngilizce ortak ad (Fishkeeper) | 49/152 | %32,2 |
| Yalnız uyarı kaydı (değer kaynağı yok) | 6/152 | %3,9 |
| Son 92 günde doğrulanmış | 152/152 | %100 |
<!-- kapsam:bitir -->

## Geçmiş

- 2026-11-13 (veri doldurma 2, veri aşaması; ürün sahibinin açık isteği "Evet, ekle", karar 0039 2. madde): 3 yeni bitki (Dracaena sanderiana ve Spathiphyllum wallisii "su bitkisi değil", Myriophyllum spicatum istilacı uyarı kaydı) ve dünkü 5 bitkiye İngilizce ortak ad (`docs/CATALOG_LOG.md`). Bitkiler 149 → 152 kayıt: ışık %95,3 → %94,7 (142 → 144), CO₂ %82,6 → %80,9, büyüme hızı %86,6 → %86,2 (129 → 131), boy %96,6 → %96,1 (144 → 146), sıcaklık %53,7 → %53,9 (80 → 82), pH %51,7 → %52 (77 → 79), yerleşim %50,3 → %49,3, bütün değerler dolu %24,8 → %24,3 (37), istilacı etiketi %6 → %6,6 (9 → 10), su bitkisi değil etiketi 1 → 3, İngilizce ortak ad 42 → 49, yalnız uyarı kaydı 5 → 6. Canlılar, ekipman ve bakım ürünleri değişmedi. "Son 92 günde doğrulanmış" %100 kaldı.
- 2026-11-12/13 (veri doldurma 1, veri aşaması; ürün sahibinin açık isteği, karar 0039 2. madde): 57 kayda 99 eş ad, 56 tatlı su kaydında en az hacim ve uzunluk, 25 yeni canlı ve 8 yeni bitki (`docs/CATALOG_LOG.md`, "2026-11-12 Arama adları paketi", "2026-11-12 En az hacim ve uzunluk" ve "2026-11-12 Eksik yaygın canlılar ve bitkiler" bölümleri). Canlılar 443 → 468 kayıt: en az tank uzunluğu %91 (403 → 426), akıntı %89,8 → %86,1 (398 → 403), davranış ya da bakım notu %76,1 → %77,4 (337 → 362), eş ad ya da satış adı %86,5 → %89,7 (383 → 420). Bitkiler 141 → 149 kayıt: ışık %96,5 → %95,3 (136 → 142), CO₂ %84,4 → %82,6 (119 → 123), büyüme hızı %87,2 → %86,6 (123 → 129), boy %97,9 → %96,6 (138 → 144), sıcaklık %53,2 → %53,7 (75 → 80), pH %51,1 → %51,7 (72 → 77), yerleşim %51,1 → %50,3 (72 → 75), bütün değerler dolu %25,5 → %24,8 (36 → 37), istilacı tür etiketi %5 → %6 (7 → 9), İngilizce ortak ad %29,8 → %28,2 (42/149), yalnız uyarı kaydı %2,1 → %3,4 (3 → 5). Ekipman ve bakım ürünleri değişmedi. Ölçüm tarihi 2026-11-13; "son 92 günde doğrulanmış" satırları %100 kaldı.
- 2026-11-12 (Canberk'in dalından paket A, veri aşaması; ürün sahibinin isteği): 11 ekipmanın kaynağı üreticiye ya da Türkiye distribütörüne bağlandı, değerleri o sayfadan geldi (Sobo SB-860A, SB-848, WP-4001; SunSun 502, 503; Dophin AP1302, 980F, FB1000 F, FB3000 F, FB4000 F, CF-300; `docs/CATALOG_LOG.md`, aynı günün bölümü). Sobo SB-848, WP-4001 ve SunSun 502, 503 doğrulanamayanlar listesinden çıktı. Değişen oranlar: doğrulanmamışlar listesinde değil %96,5 → %96,6 (3410 → 3414/3535), hesap değeri %89,4 → %89,9 (1117 → 1123/1249), güç %47,6 → %47,8 (1682 → 1691/3535), önerilen hacim %20,1 → %20,3 (712 → 717/3535). Ölçüm tarihi 2026-11-12; "son 92 günde doğrulanmış" satırları %100 kaldı.
- 2026-11-11 (Codex kontrolü): NovoRed Refill ve NanoBel metinleri düzeltildi; dört eksik yeniden doğrulamanın tarihi eski güne döndü, NovoRed Refill okuma gününü aldı (CATALOG_LOG son bölüm). `node scripts/data-coverage.cjs 2026-11-11` yeniden çalıştırıldı; önceki tablonun tüm sayıları ve oranları aynı kaldı. Tarihi geri alınan dört kayıt da 92 günlük aralıkta.
- 2026-11-11 (Chrome oturumunun kardeş kayıtları, veri aşaması; ürün sahibinin kararı): adında ² olmayan üç Oase kaydı (`oase-biomaster-250`, `-350`, `-600`) önceki nesil sayıldı; taşıdıkları BioMaster² değerleri hesaptan çekildi, kayıtlar doğrulanamayanlar listesinde (`docs/CATALOG_LOG.md`, aynı günün bölümü). Doğrulanmamışlar listesinde değil %96,5 (3413 → 3410), hesap değeri %89,7 → %89,4 (1120 → 1117/1249), güç %47,6 (1683 → 1682), önerilen hacim %20,2 → %20,1 (715 → 712). BioMaster² ailesinin sekiz kaydı, Twinstar S Line V5'in beş kaydı, Dennerle 5 m CO₂ hortumu ve üç güncel JBL CO₂ tüpü kaynağa karşı okundu, tarihleri 2026-11-11; Twinstar'ın üç güç değeri ve 1200S'in lümeni düzeltildi, 200S'in çelişkili uzunluğu kaldırıldı (aydınlatma bu tabloda hesap değerine girmez); bakım ürünlerinde yalnız metin değişti.
- 2026-11-11 (JBL PROTEMP S birleştirmesi, veri aşaması; ürün sahibinin kararı): aynı ürünün iki kez kataloglanmış altı çubuk ısıtıcısı tek kayıt oldu (`docs/CATALOG_LOG.md`, aynı günün bölümü). Eski adlı altı kopya (`jbl-protemp-s25 … s300`) katalogdan çıktı; kimlikleri kanonik kayda yönleniyor. Ekipman 3541 → 3535 kayıt. Doğrulanmamışlar listesinde değil %96,6 → %96,5 (3419/3541 → 3413/3535), güç %47,7 → %47,6, hesap değeri %89,7 (1126/1255 → 1120/1249), önerilen hacim %20,2 (716 → 715: kaynaksız 90–150 L'li eski S 100 çıktı). Kalan altı kaydın güç ve hacim değerleri değişmedi; adları JBL'in Almanca ve Türkiye sayfasındaki ad oldu.
- 2026-11-11 (ürün sahibiyle Chrome oturumu, veri aşaması): veri testinde Chrome gerektiren 25 kaydın kaynağı okundu, bütün dolu alanları doğrulandı ya da kaynağa göre düzeltildi ve doğrulama tarihi 2026-11-11 oldu (`docs/CATALOG_LOG.md`, aynı günün bölümü). Kaynakta olmayan metin parçaları çıkarıldı; sayısal değer değişmedi. Oranlar değişmedi; "son 92 günde doğrulanmış" satırları %100 kalsın diye ölçüm tarihi 2026-11-11.
- 2026-11-10 (veri testi düzeltmeleri, veri aşaması): Aquawing'in 16 filtresi eksenpet.com'un ürün sayfalarıyla doğrulandı (ürün sahibi kararı: eksenpet yalnız Aquawing için kaynak) ve doğrulanamayanlar listesinden çıktı; Sobo SB-8808'in gücü (10 W) distribütör sayfasından geldi. Doğrulanmamışlar listesinde değil %96,1 → %96,6, hesap değeri %88,4 → %89,7, güç %47,2 → %47,7. Canlılarda Afrika cüce kurbağasına kaynaklı topluluk notu (avcı işareti PR #87 denetiminde kaldırıldı), Maingano ile üç benekli guramiye kaynak farklarını anlatan bakım notu eklendi: davranış ya da bakım notu %75,4 → %76,1 (334 → 337). 142 kaydın doğrulama tarihi kaynağın okunduğu güne (2026-11-09 ya da 2026-11-10) yenilendi; "son 92 günde doğrulanmış" satırları %100 kaldı. ADA Super Jet ES'in 50 Hz değerleri, Tetra HT, ADA makas ve bakım ürünlerindeki metin düzeltmeleri oranları değiştirmedi.
- 2026-11-08 (ürün sahibiyle Chrome oturumu: Cikletist, Fluval, Resun ve Haqos; veri aşaması): değerleri www.haqos.com'a dayanan 15 Haqos kaydı (6 filtre, 7 ısıtıcı, 2 UV) doğrulanamayanlar listesine girdi (ürün sahibi kararı); Thermo-Sprite 2026-09-06'daki Betta doğrulamasıyla değerini korudu. Doğrulanmamışlar listesinde değil %96,5 → %96,1, hesap değeri %89,5 → %88,4, güç %47,6 → %47,2, önerilen hacim %20,5 → %20,2. AquaClear'ın üç debisi ürün sayfasının değerine döndü, Reef 4.0'a lümen ve renk sıcaklığı eklendi, Plant 4.0 Nano ve Reef 4.0 Nano'nun anlamı belirsiz uzunluk aralığı kaldırıldı; bunlar oranları değiştirmedi.
- 2026-11-04 (Trendyol'a bağlı ekipman, veri aşaması): değerleri yalnız Trendyol'da yayımlanan 23 kayıt (22 Shark armatürü, Meç Turbo Pipo) doğrulanamayanlar listesine girdi; RS-605 zaten listedeydi. Doğrulanmamışlar listesinde değil %97,2 → %96,5. Hesap değeri ve öbür oranlar değişmedi (aydınlatma ve Meç'in hava motoruyla çalışan filtresi hesaba değer vermiyordu).
- 2026-11-04 (bitkilerin İngilizce ortak adları, veri aşaması): bitkilere "İngilizce ortak ad (Fishkeeper)" satırı eklendi, 42/141 (%29,8). Değerler ve öbür oranlar değişmedi; ölçüm tarihi yeni satır için 2026-11-04.
- 2026-10-31 (JBL kaynak bağlantısı paketi 2): hesaba girmeyen 186 JBL kaydı yeni ürün sayfalarına bağlandı. Bu kayıtların 17'si Codex denetiminde 2026-10-31'de yeniden okunduğu için ölçüm tarihi 2026-10-31; oranlar değişmedi.
- 2026-10-30 (açık listedeki canlılar, paket 3): Fishipedia taslaklarına bağlı 12 kayıt yeniden okundu; Apistogramma commbrae ve Semaprochilodus insignis'in en az tank uzunluğu Seriously Fish tabanından geldi. En az tank uzunluğu %90,5 → %91.
- 2026-10-30 (açık listedeki canlılar, paket 2): 7 "diğer" kayıt kabul edilen kaynaklara bağlandı; ölçülen alanların hepsi zaten doluydu, tablo değişmedi.
- 2026-10-30 (açık listedeki canlılar, paket 1): 10 balık kabul edilen kaynaklara bağlandı; iki goodeid'in en az tank uzunluğu Seriously Fish tabanından geldi. En az tank uzunluğu %90,1 → %90,5.
- 2026-10-30 (JBL kaynak bağlantısı paketi): eski adresli 49 hesaplı JBL kaydı yeni sayfalara ya da açık belgelere bağlandı. 3 WHITE filtrenin değeri çekildi; üç kayıtta çelişen ya da kaynaksız hacim kaldırıldı, klasik i60, i100 ve i200'e kılavuzdaki hacim eklendi. Doğrulanmamışlar listesinde değil %97,3 → %97,2, hesap değeri %89,8 → %89,5, güç %47,7 → %47,6, önerilen hacim %20,6 → %20,5.
- 2026-10-30 (ekipman kaynak bağlantısı paketi 1): liste sayfasına bağlı 54 ekipman ürün sayfasına bağlandı. Aynı sayfada çelişen ya da sayfada olmayan güç beş kayıttan kaldırıldı (güç %47,9 → %47,7). Jingye CD300 ve YE-22'nin çelişkili hava debisi kaldırıldı (hesap değeri %90 → %89,8).
- 2026-10-30 (örnek denetimi): Boyu HT ve DR serilerinin 11 ısıtıcısının (HT 6, DR 5) gücü üretici sayfasında yazmadığı için hesaptan çekildi (karar 0019). Doğrulanmamışlar listesinde değil %97,6 → %97,3, hesap değeri %90,8 → %90, güç %48,2 → %47,9. Canlıların oranları değişmedi.
- 2026-10-30 (deniz kataloğu, karar 0031): canlılar 443 kayıt; 20 deniz başlangıç türü eklendi, 11 deniz kaydı kabul edilen kaynaklarla yenilendi. En az tank uzunluğu %94,8 → %90,1, akıntı %94,3 → %89,8: deniz kayıtlarının eski uzunluk ve akıntı değerleri kabul edilmeyen kaynaklardandı, kabul edilen kaynaklar çoğu türde bunları yazmıyor. Davranış ya da bakım notu %74,2 → %75,4.
- 2026-10-29 (bitki kataloğu 4): Practical Fishkeeping'in tür kutuları 22 bitki kaydına girdi; 13 kayıt sıcaklığı, 11 kayıt pH'ı ilk kez aldı, 4 kayıtta aralık daraldı. Sıcaklık %44 → %53,2, pH %43,3 → %51,1, bütün değerler dolu %21,3 → %25,5.
- 2026-10-28 (bitki kataloğu 3): bitkiler 141 kayıt; üç yalnız uyarı kaydı eklendi (*Azolla filiculoides*, *Ophiopogon japonicus*, *Pistia stratiotes*), değerleri olmadığı için değer satırlarının oranı biraz düştü (sıcaklık %44, pH %43,3, bütün değerler dolu %21,3); istilacı tür etiketi 7, su bitkisi değil etiketi 1.
- 2026-10-28 (ilk ölçüm): canlılar 423 kaydın hepsinde kendi kaynak sayfası; ekipman 3541 kayıt, hesap değeri %90,8; bakım ürünleri 1893 kayıt; bitkiler 138 kayıt, bütün değerler dolu %21,7 (sıcaklık %44,9, pH %44,2).
