# AquaMind veri kaynağı politikası

## Kaynak önceliği

1. Üreticinin resmî ürün/tür sayfası veya kullanım kılavuzu
2. Türkiye distribütörü veya marka kataloğu
3. Güvenilir, ürüne özel yerel mağaza sayfası
4. Birbirini doğrulayan iki güvenilir ikincil kaynak

Arama sonucu özeti, yapay zekâ cevabı, forum yorumu veya ilgisiz kategori sayfası tek başına teknik kaynak kabul edilmez.

## Kabul edilen yerel ikincil kaynaklar

- `https://atakanpetshop.com/`
- `https://bettamarketim.com.tr/`
- `https://aquarubi.com/`
- `https://www.cikletistpetshop.com/`
- `https://malawiizmir.com/`
- `https://www.akvaryumexpress.com/`

Bu liste otomatik doğruluk garantisi değildir. Her bağlantı doğru marka, model ve varyanta ait olmalıdır.

## Zorunlu kayıt alanları

- Benzersiz kimlik
- Marka veya tür grubu
- Model, yaygın ad ve gerekiyorsa bilimsel ad
- Doğru kategori
- Doğrudan HTTPS kaynak bağlantısı (`sourceUrl`)
- `YYYY-MM-DD` biçiminde doğrulama tarihi (`verifiedAt`)
- Yalnızca kaynakta açıkça yayımlanan teknik/bakım değerleri

## Çelişki ve eksiklik

- İki kaynak çelişiyorsa fark kullanıcıdan saklanmaz.
- Güvenli ve doğrulanabilir bir değer seçilemiyorsa alan boş bırakılır.
- Debi, güç, hacim, canlı boyu ve minimum akvaryum değeri tahmin edilmez.
- Bir seri sayfasındaki değer farklı modele kopyalanmaz.
- Pasif ekipmana bağımsız motor kapasitesi atanmaz.

## Görseller

- Ürün veya canlı görselleri kullanım hakkı kontrol edilmeden projeye kopyalanmaz.
- Tercih sırası: üretici tarafından kullanıma sunulan medya, izinli görsel, kendi çekimimiz veya yalnızca kaynak bağlantısı.
- Mağaza görseli indirilip yeniden yayımlanmadan önce izin durumu kontrol edilir.

## Ortak araştırma tablosu

Google Sheets aşamasında en az şu sütunlar bulunmalıdır:

`Tür`, `Marka`, `Kategori`, `Model`, `Teknik bilgiler`, `Birincil kaynak`, `İkincil kaynak`, `Doğrulama tarihi`, `Kontrol eden`, `Durum`, `Not`, `Görsel hakkı`.

Yalnızca `Doğrulandı` durumundaki satırlar uygulamaya aktarılır.

