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

## Ekipman değerleri için özel kural

- Ürün sahibi kararı 2026-10-11 (`docs/DECISIONS/0019-dogrulanamayan-ekipman-degerleri.md`): sağlık hesabında kullanılan ekipman değeri (debi, güç, önerilen hacim, akvaryum uzunluğu) yalnızca yukarıdaki önceliğin ilk üç sırasından, yani üretici, Türkiye distribütörü ya da kabul edilen yerel mağaza sayfasından doğrulanabiliyorsa kullanılır. "Birbirini doğrulayan iki ikincil kaynak" (4. sıra) ekipman değeri için yeterli sayılmaz.
- Doğrulanamayan kayıt adıyla listede kalır, değeri hesaptan çekilir ve kullanıcı cihazın etiket değerini kendisi girebilir (`docs/DECISIONS/0017-elle-girilen-ekipman-degerleri.md`). Küçük markalar için derin kaynak araştırması yapılmaz.
- Kabul edilen yerel mağazada doğrulama alan alan yapılır: değer tam modelin kendi ürün sayfasında yazmalıdır (marka ya da liste sayfası yetmez), yalnızca kayıtta önceden olan alan geri gelir, mağazanın değeri eskisinden farklıysa mağazanınki kullanılır, kabul edilen mağazalar ya da aynı sayfanın başlığı ile açıklaması aynı alanı farklı yayımlıyorsa o alan kullanılmaz.

## Canlı verisi için özel kaynak kuralı

- Yerel mağazalar yalnızca Türkiye'de kullanılan satış adını, varyeteyi ve güncel bulunabilirliği karşılaştırmak için kullanılabilir.
- Bilimsel kimlik için FishBase, Catalog of Fishes, GBIF veya hakemli taksonomi yayını tercih edilir.
- Yetişkin boyu, minimum akvaryum, sıcaklık, pH, sosyal yapı ve özel bakım riskleri için kurumsal bakım rehberi veya yerleşik tür uzmanı veri tabanı kullanılmalıdır. Örnekler: Seriously Fish, Practical Fishkeeping, OATA, Fishipedia, Maidenhead Aquatics/Fishkeeper; kedi balıklarında ScotCat, Welsfans ve Corydoras World.
- Yerel mağazanın bakım metni, bilimsel kimlik veya zorunlu bakım eşikleri için tek başına yeterli kanıt sayılmaz.
- Ticari ad birden fazla türe uyuyorsa ya da mağaza adı ile uzman kaynak çelişiyorsa eşleme yapılmaz; kayıt çözülmemiş tutulur.
- İstisna (`docs/DECISIONS/0014-coklu-tur-satis-adi-profilleri.md`, ürün sahibi onayı 2026-10-05): katalogda zaten bulunan ve kullanıcı kayıtlarının bağlı olduğu bir profilin satış adı birden fazla türü kapsıyorsa profil kaldırılmaz. Bilimsel ad adayları gösterir, değerler adaylar arasında kaynaklı ve en koruyucu olanlardır (en büyük boy, en büyük akvaryum), kimlik belirsizliği kullanıcıya açıklanır. Yeni mağaza başlıkları için yukarıdaki kural aynen geçerlidir.
- Tek bir güvenilir sayfa tüm eşikleri yayımlamıyorsa ana bağlantı `sourceUrl`, kimlik/boy/özel bakım gibi bağımsız doğrulamalar `additionalSourceUrls` alanında HTTPS bağlantılarıyla saklanır.
- Tatlı su adıyla satılan acı su veya deniz canlısı, salinite gereksinimi uygulamanın sağlık analizinde modellenmeden sıradan tatlı su profiline bağlanmaz.

## Zorunlu kayıt alanları

- Benzersiz kimlik
- Marka veya tür grubu
- Model, yaygın ad ve gerekiyorsa bilimsel ad
- Doğru kategori
- Doğrudan HTTPS kaynak bağlantısı (`sourceUrl`)
- Gerekiyorsa bağımsız çapraz doğrulama bağlantıları (`additionalSourceUrls`)
- `YYYY-MM-DD` biçiminde doğrulama tarihi (`verifiedAt`)
- Yalnızca kaynakta açıkça yayımlanan teknik/bakım değerleri

## Çelişki ve eksiklik

- İki kaynak çelişiyorsa fark kullanıcıdan saklanmaz.
- Güvenli ve doğrulanabilir bir değer seçilemiyorsa alan boş bırakılır.
- Debi, güç, hacim, canlı boyu ve minimum akvaryum değeri tahmin edilmez.
- Bir seri sayfasındaki değer farklı modele kopyalanmaz.
- Pasif ekipmana bağımsız motor kapasitesi atanmaz.
- Kullanıcının kendi cihazı için etiketten girdiği debi ya da güç katalog verisi değildir: yalnızca o kullanıcının kaydında durur, kataloğa yazılmaz ve başka bir kaydın kaynağı olarak kullanılmaz. Yalnızca katalogda doğrulanmış değeri olmayan kayıtta hesaba katılır ve sonuç bu şekilde işaretlenir (`docs/DECISIONS/0017-elle-girilen-ekipman-degerleri.md`).

## Görseller

- Ürün veya canlı görselleri kullanım hakkı kontrol edilmeden projeye kopyalanmaz.
- Tercih sırası: üretici tarafından kullanıma sunulan medya, izinli görsel, kendi çekimimiz veya yalnızca kaynak bağlantısı.
- Mağaza görseli indirilip yeniden yayımlanmadan önce izin durumu kontrol edilir.

## Ortak araştırma tablosu

Google Sheets aşamasında en az şu sütunlar bulunmalıdır:

`Tür`, `Marka`, `Kategori`, `Model`, `Teknik bilgiler`, `Birincil kaynak`, `İkincil kaynak`, `Doğrulama tarihi`, `Kontrol eden`, `Durum`, `Not`, `Görsel hakkı`.

Yalnızca `Doğrulandı` durumundaki satırlar uygulamaya aktarılır.

