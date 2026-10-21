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
- Yetişkin boyu, minimum akvaryum, sıcaklık, pH, sosyal yapı ve özel bakım riskleri için kurumsal bakım rehberi veya yerleşik tür uzmanı veri tabanı kullanılmalıdır. Örnekler: Seriously Fish, Practical Fishkeeping, OATA, Fishipedia, Maidenhead Aquatics/Fishkeeper; kedi balıklarında ScotCat, Welsfans ve Corydoras World; karides ve salyangozlarda aşağıdaki "Omurgasızlar" bölümü.
- Yerel mağazanın bakım metni, bilimsel kimlik veya zorunlu bakım eşikleri için tek başına yeterli kanıt sayılmaz.
- Ticari ad birden fazla türe uyuyorsa ya da mağaza adı ile uzman kaynak çelişiyorsa eşleme yapılmaz; kayıt çözülmemiş tutulur.
- İstisna (`docs/DECISIONS/0014-coklu-tur-satis-adi-profilleri.md`, ürün sahibi onayı 2026-10-05): katalogda zaten bulunan ve kullanıcı kayıtlarının bağlı olduğu bir profilin satış adı birden fazla türü kapsıyorsa profil kaldırılmaz. Bilimsel ad adayları gösterir, değerler adaylar arasında kaynaklı ve en koruyucu olanlardır (en büyük boy, en büyük akvaryum), kimlik belirsizliği kullanıcıya açıklanır. Yeni mağaza başlıkları için yukarıdaki kural aynen geçerlidir.
- Tek bir güvenilir sayfa tüm eşikleri yayımlamıyorsa ana bağlantı `sourceUrl`, kimlik/boy/özel bakım gibi bağımsız doğrulamalar `additionalSourceUrls` alanında HTTPS bağlantılarıyla saklanır.
- Tatlı su adıyla satılan acı su veya deniz canlısı, salinite gereksinimi uygulamanın sağlık analizinde modellenmeden sıradan tatlı su profiline bağlanmaz.

## Omurgasızlar (karides, salyangoz) için uzman kaynaklar

Ürün sahibi 2026-10-20'de kabul edilecek kaynakların seçimini gözlem ve gerekçeleriyle Claude'a bıraktı (`PROJECT_STATUS.md` → "Ürün sahibinin 2026-10-20 kararları", madde 3). Seçim 2026-10-20'de sayfalar okunarak yapıldı.

Gözlemler:

- Seriously Fish'te omurgasız sayfası yok; balıklarda kullanılan ana kaynak burada kullanılamıyor. Taban katalogdaki dört omurgasız kaydının (Amano, kiraz karides, Crystal Red, tavşan salyangoz) bağlantısı bilimsel addan üretilmiş, var olmayan bir Seriously Fish adresidir.
- Katalogdaki omurgasız kayıtlarının çoğu yerel mağazaya ya da tek yazarlı hobi ve satıcı sitelerine dayanıyor.
- Kurumsal kaynakların hiçbiri tek başına bütün alanları vermiyor: Fishkeeper akvaryum ölçüsü ve sayısal grup yayımlamıyor; OATA bütün karides ve salyangozlar için tek bir genel kart yayımlıyor.

Kabul edilen kaynaklar (öncelik sırasıyla):

1. **Fishkeeper (Maidenhead Aquatics):** tür ya da form sayfası olan taksonlarda ana kaynaktır (sıcaklık, pH, sertlik, boy, sosyal yapı, tank arkadaşı). Balıklarda da kabul edilen kurumsal yayıncıdır; satılan formları (rili, yellow fire, crystal red) ayrı sayfalarla kapsar.
2. **Practical Fishkeeping:** adlı yazarların makaleleri ve okur sorularına verdikleri yanıtlar; kurulum ve biyotop yazılarındaki tür kutuları da buna dahildir. Neocaridina için en küçük akvaryumu ve en az grup sayısını, Caridina ve Sulawesi türleri için su değerlerini verir. Tür grubuna özgü sayı veren tek kurumsal kaynaktır. Site, kendi aramasıyla (başlık ve özet) taranır; taranan ve değer veren yazılar katalog günlüğünde listelenir, tarama üç ayda bir yinelenir.
3. **wirbellose.de (Almanca omurgasız veri tabanı):** yalnız ilk iki kaynağın kapsamadığı yerde kullanılır. İlk ikisinin kapsamadığı taksonlarda bütün alanlar için kullanılır (ör. *Caridina serrata*, *Planorbella duryi*, *Brotia*). İlk ikisinin kapsadığı taksonlarda yalnız onların vermediği alan için kullanılır: ör. Practical Fishkeeping'in su değerlerini verdiği *C. dennerli*'de ve Fishkeeper'ın kapsadığı *Tylomelania* ile nerit salyangozlarında akvaryum ölçüsü, *C. mariae*'de boy (wirbellose.de'nin *C. mariae* sayfası akvaryum ölçüsü vermiyor). Değerleri sıcaklık, pH ve akvaryum ölçüsüdür.
   - Gerekçe: omurgasızlarda Seriously Fish'e en yakın kaynaktır; alanları sabittir ve uzun süredir yayındadır.
   - Zayıf yanları: yazar ve tarih tür sayfasında değil, kategori listesinde yazar; kaynakça yoktur. Bazı alanlar bakıcının kendi suyunu anlatır ya da açıkça hatalıdır.
   - Bu yüzden yalnız tür aralığı olarak yazılmış alanlar alınır; bakıcı anekdotu ve hatalı görünen alan kullanılmaz.
4. **OATA (ticaret birliği, veteriner onaylı) "How to look after freshwater shrimp and snails" (Eylül 2022):** yalnız genel taban kurallar için kullanılır:
   - küçük karides ve salyangoz grubu için en az 10 L, apple snail ve Amano için yaklaşık 20 L;
   - karides en az 5'li grup;
   - ağza sığabilecek ya da avcı balık yok;
   - salyangozla puffer ya da loach yok;
   - bakır yasak.

   Türe özgü sıcaklık ve pH için kullanılmaz. Kart değerlerin bu grup için genel rehber olduğunu kendisi söyler; ayrıca cherry karidesi *C. cantonensis* altına koyan bir taksonomi hatası içerir.
5. **Destek kaynakları:** kimlik, doğal ortam ya da çapraz doğrulama içindir; tek başına bakım değeri kaynağı sayılmaz.
   - Hakemli yayınlar (von Rintelen & Cai 2009; Klotz & von Rintelen 2014; von Rintelen & Glaubrecht 2008): Sulawesi türlerinin kimliği ve göl değerleri.
   - USGS NAS: *Melanoides* ve *Pomacea diffusa*.
   - Aquarium Glaser (Frank Schäfer'in tarihli, zaman zaman kaynakçalı yazıları): ithalatçı olduğu için yalnız kabul edilen bir kaynağı doğrularken ya da onunla çelişirken kullanılır.
   - applesnail.net: *Pomacea* kimliği.

Kabul edilmeyenler:

- Shrimp Science, aquariumbreeder.com, The Shrimp Farm: tek hobi yazarı; kaynakçasız ya da kendi içinde çelişkili; satıcı.
- Dennerle: ürün satıcısı; *C. dennerli* için yayımladığı değerler hakemli saha verisiyle çelişiyor.
- Planet Inverts: alan adı park edilmiş.
- Chris Lukhaup: site kapalı.
- Yerel mağazalar: kural gereği yalnız satış adı ve bulunabilirlik için.

Değer kuralı (balıklardaki kuralın omurgasız karşılığı):

- **Sıcaklık ve pH:** aralık veren kabul edilen kaynakların tutma (dayanma) aralıklarının ortak aralığı (koruyucu; balıklardaki karar 0014 yöntemi). Şunlar kullanılmaz, günlüğe not edilir: "en iyi", "ideal" ya da üreme için verilen dar aralıklar; farklı cinsleri tek değerle anlatan satıcı ve ürün yazıları; okurun kendi akvaryumunun değerleri; birim hatası olan değerler (ör. °C yerine °F yazılmış). Fishkeeper'da form sayfası varsa formun sayfası, yoksa türün sayfası alınır. OATA'nın genel aralığı türe özgü olmadığı için hesaba katılmaz. Ortak aralığa giren kaynakların değerleri ve aradaki fark katalog günlüğüne yazılır. Aralık veren kabul edilen kaynak yoksa kayıttaki değer korunur ve kaynakların verdiği tekil değerlerle (ör. "yaklaşık 29 °C", "pH 7,5'ten") tutarlı olduğu günlüğe yazılır; bakıcının kendi suyunu anlatan değer kullanılmaz.
- **Boy:** katalog ile kaynağın büyüğü.
- **Akvaryum:** hacim için türe ya da cinse özgü kaynak değeri. Hiçbir kabul edilen kaynak yayımlamıyorsa kayıttaki değer korunur; hiçbir durumda OATA tabanının altında değil (OATA'nın 10–20 L'lik tabanı küçük karides ve salyangozlar içindir, iri türlerin değerini düşürmek için kullanılmaz). Uzunluk yayımlanmıyorsa kayıttaki değer korunur.
- **Su türü:** kaynak acı ya da deniz suyu gerektiriyorsa kayıt o su türüne bağlanır ("Canlı verisi için özel kaynak kuralı"); tuzluluk aralığı kaynakta yoksa yazılmaz.
- **Grup:** türe ya da cinse özgü kaynak sayısı; kaynaklar farklı sayı veriyorsa türe ya da cinse adanmış yazının sayısı; yoksa karideste OATA'nın 5'i; salyangozda kaynak grup demiyorsa 1.
- **Nitelikler:** kaynakla doğrudan çelişen nitelikler (akıntı, avcılık, tür akvaryumu) düzeltilir.
- **Eski kaynaklar:** ek kaynak olarak kalır.
- **Okuma:** değerler sayfa açılarak okunur; arama özeti kaynak sayılmaz.

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

