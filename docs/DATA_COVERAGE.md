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
- **Bitkiler:** değer kuralı `docs/DATA_SOURCES.md` → "Bitkiler". Tropica sıcaklık ve pH yazmadığı için bu iki bilgi bitkilerin yaklaşık yarısında yok. "Bütün değerler dolu" ışık, CO₂, büyüme, boy, sıcaklık, pH ve yerleşimin hepsidir.

## Güncel durum

<!-- kapsam:başla -->
Ölçüm tarihi: 2026-10-28

### Canlılar (423 kayıt)

| Bilgi | Dolu | Oran |
|---|---|---|
| Kendi kaynak sayfası var (otomatik bağlantı değil) | 423/423 | %100 |
| Yalnız otomatik kaynak bağlantısı | 0/423 | %0 |
| En az tank uzunluğu | 401/423 | %94,8 |
| Akıntı | 399/423 | %94,3 |
| Davranış ya da bakım notu | 314/423 | %74,2 |
| Eş ad ya da satış adı | 363/423 | %85,8 |
| Son 92 günde doğrulanmış | 423/423 | %100 |

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

### Bitkiler (138 kayıt)

| Bilgi | Dolu | Oran |
|---|---|---|
| Işık | 136/138 | %98,6 |
| CO₂ | 119/138 | %86,2 |
| Büyüme hızı | 123/138 | %89,1 |
| Boy | 138/138 | %100 |
| Sıcaklık | 62/138 | %44,9 |
| pH | 61/138 | %44,2 |
| Yerleşim | 72/138 | %52,2 |
| Bütün değerler dolu | 30/138 | %21,7 |
| İstilacı tür etiketi | 5/138 | %3,6 |
| Son 92 günde doğrulanmış | 138/138 | %100 |
<!-- kapsam:bitir -->

## Geçmiş

- 2026-10-28 (ilk ölçüm): canlılar 423 kaydın hepsinde kendi kaynak sayfası; ekipman 3541 kayıt, hesap değeri %90,8; bakım ürünleri 1893 kayıt; bitkiler 138 kayıt, bütün değerler dolu %21,7 (sıcaklık %44,9, pH %44,2).
