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
Ölçüm tarihi: 2026-10-30

### Canlılar (443 kayıt)

| Bilgi | Dolu | Oran |
|---|---|---|
| Kendi kaynak sayfası var (otomatik bağlantı değil) | 443/443 | %100 |
| Yalnız otomatik kaynak bağlantısı | 0/443 | %0 |
| En az tank uzunluğu | 399/443 | %90,1 |
| Akıntı | 398/443 | %89,8 |
| Davranış ya da bakım notu | 334/443 | %75,4 |
| Eş ad ya da satış adı | 383/443 | %86,5 |
| Son 92 günde doğrulanmış | 443/443 | %100 |

### Ekipman (3541 kayıt)

| Bilgi | Dolu | Oran |
|---|---|---|
| Kaynak sayfası | 3541/3541 | %100 |
| Doğrulanmamışlar listesinde değil | 3455/3541 | %97,6 |
| Hesap değeri (filtre, ısıtıcı, hava motoru) | 1140/1255 | %90,8 |
| Güç (W) | 1706/3541 | %48,2 |
| Önerilen hacim | 730/3541 | %20,6 |
| Son 92 günde doğrulanmış | 3541/3541 | %100 |

### Bakım ürünleri (1893 kayıt)

| Bilgi | Dolu | Oran |
|---|---|---|
| Kaynak sayfası | 1893/1893 | %100 |
| Hacim (tank, set, teraryum) | 126/147 | %85,7 |
| Son 92 günde doğrulanmış | 1893/1893 | %100 |

### Bitkiler (141 kayıt)

| Bilgi | Dolu | Oran |
|---|---|---|
| Işık | 136/141 | %96,5 |
| CO₂ | 119/141 | %84,4 |
| Büyüme hızı | 123/141 | %87,2 |
| Boy | 138/141 | %97,9 |
| Sıcaklık | 75/141 | %53,2 |
| pH | 72/141 | %51,1 |
| Yerleşim | 72/141 | %51,1 |
| Bütün değerler dolu | 36/141 | %25,5 |
| İstilacı tür etiketi | 7/141 | %5 |
| Su bitkisi değil etiketi | 1/141 | %0,7 |
| Yalnız uyarı kaydı (değer kaynağı yok) | 3/141 | %2,1 |
| Son 92 günde doğrulanmış | 141/141 | %100 |
<!-- kapsam:bitir -->

## Geçmiş

- 2026-10-30 (deniz kataloğu, karar 0031): canlılar 443 kayıt; 20 deniz başlangıç türü eklendi, 11 deniz kaydı kabul edilen kaynaklarla yenilendi. En az tank uzunluğu %94,8 → %90,1, akıntı %94,3 → %89,8: deniz kayıtlarının eski uzunluk ve akıntı değerleri kabul edilmeyen kaynaklardandı, kabul edilen kaynaklar çoğu türde bunları yazmıyor. Davranış ya da bakım notu %74,2 → %75,4.
- 2026-10-29 (bitki kataloğu 4): Practical Fishkeeping'in tür kutuları 22 bitki kaydına girdi; 13 kayıt sıcaklığı, 11 kayıt pH'ı ilk kez aldı, 4 kayıtta aralık daraldı. Sıcaklık %44 → %53,2, pH %43,3 → %51,1, bütün değerler dolu %21,3 → %25,5.
- 2026-10-28 (bitki kataloğu 3): bitkiler 141 kayıt; üç yalnız uyarı kaydı eklendi (*Azolla filiculoides*, *Ophiopogon japonicus*, *Pistia stratiotes*), değerleri olmadığı için değer satırlarının oranı biraz düştü (sıcaklık %44, pH %43,3, bütün değerler dolu %21,3); istilacı tür etiketi 7, su bitkisi değil etiketi 1.
- 2026-10-28 (ilk ölçüm): canlılar 423 kaydın hepsinde kendi kaynak sayfası; ekipman 3541 kayıt, hesap değeri %90,8; bakım ürünleri 1893 kayıt; bitkiler 138 kayıt, bütün değerler dolu %21,7 (sıcaklık %44,9, pH %44,2).
