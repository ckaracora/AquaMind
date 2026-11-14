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
- İstisna (ürün sahibi kararı, 2026-11-10): `eksenpet.com` yalnız Aquawing ürünleri için kabul edilen kaynaktır; başka markada kaynak sayılmaz. Gerekçe: Aquawing, Bursa Pet'in markasıdır; Eksen Pet kendi "Hakkımızda" sayfasına göre Bursa Pet'in Marmara ve Akdeniz bölgesindeki tek bayisi ve temsilcisidir. Değer karar 0019'un 3. maddesindeki kurallarla alınır: tam modelin eksenpet ürün sayfasının başlığında, açıklamasında ya da teknik tablosunda yazmalı; marka ya da liste sayfası yetmez.
- Doğrulanamayan kayıt adıyla listede kalır, değeri hesaptan çekilir ve kullanıcı cihazın etiket değerini kendisi girebilir (`docs/DECISIONS/0017-elle-girilen-ekipman-degerleri.md`). Küçük markalar için derin kaynak araştırması yapılmaz.
- Üreticinin sayfası adres değiştirdiyse ya da kapandıysa (2026-10-30, JBL kaynak bağlantısı paketi 2): ürünün yeni ya da arşiv sayfası, sayfanın SSS bölümü, üreticinin kılavuzu ve kataloğu kaynaktır. Bunların yazmadığı bir değer ya da ayrıntı üreticinin eski sayfasının internet arşivi (web.archive.org) kopyasında açıkça yazıyorsa o kopya ek kaynak olarak bağlanır; kopya üreticinin kendi sayfasıdır, tarihi bağlantıda görünür. Kopya aynı ürünün aynı nesline ve boyuna ait olmalıdır. Kopya kendi içinde çelişiyorsa değer sessizce seçilmez: üreticinin güncel bir kaynağıyla (ürün listesi, kılavuz) aynı olan değer kullanılır ve çelişki kayıt günlüğüne yazılır; böyle bir kaynak yoksa değer kullanılmaz. Üreticinin SSS ve blog yazıları da üreticinin kendi kaynağıdır. Hiçbirinde yazmayan ayrıntı kayıttan çıkarılır.
- Kabul edilen yerel mağazada doğrulama alan alan yapılır: değer tam modelin kendi ürün sayfasında yazmalıdır (marka ya da liste sayfası yetmez), yalnızca kayıtta önceden olan alan geri gelir, mağazanın değeri eskisinden farklıysa mağazanınki kullanılır, kabul edilen mağazalar ya da aynı sayfanın başlığı ile açıklaması aynı alanı farklı yayımlıyorsa o alan kullanılmaz.
- Şebeke değeri (2026-11-10, veri testi; teknik yöntem, Claude): Türkiye şebekesi 220–240 V, 50 Hz'dir. Kaynak aynı model için farklı voltaj ya da frekansta ayrı değer veriyorsa Türkiye'ninki alınır: 220–240 V (230 V) satırı; 50 ve 60 Hz değerleri ayrıysa 50 Hz değeri (ör. ADA Super Jet ES-900: 50 Hz'de 11 L/dakika = 660 L/saat ve 13 W; 60 Hz'de 12 L/dakika ve 15 W). Emsaller: `docs/CATALOG_LOG.md` 52, 701–706, 1300 ve 1658. satırlar (JBL EcoAir 40, Resun NLP200, Oase CrystalSkim, Fluval AC).
- Resun'un üretici kaynakları `resun-china.com` ve `rissee.com`'dur (2026-11-10, veri testi). `rissee.com`, Resun ve Rissee markalarının sahibi ve üreticisi Raoping Xingcheng Aquarium Products Co., Ltd'nin (饶平县兴成机电水族用品有限公司) kendi sitesidir: "About us" sayfası şirketin 1989'da kurulmuş bir üretici olduğunu ve "Resun" ile "Rissee" markalarının şirketin markaları olduğunu yazıyor (Çince sayfa: 品牌"日生"、"优之星"); ürün menüsünde RESUN ve RISSEE ayrı başlıklardır. Dağıtıcı değil, üretici kaynağı sayılır.
- Jeneca'nın üretici kaynağı `aleas.cn`'dir (İngilizce `www.aleas.cn`, Çince `gb.aleas.cn`; 2026-11-10, veri testi). Site 饶平县金利佳机电有限公司'nin (Jin Li Jia Electromechanical Co., Ltd) kendi sitesidir: İngilizce "About us" sayfası şirketin 2005'te kurulmuş bir üretici olduğunu, Çince "公司简介" sayfası şirketin markalarını "公司品牌JENECA, ALEAS" ve "金利佳旗下金利佳 JENECA、佳力仕 ALEAS两大品牌" diye yazıyor; ürün sayfaları "JENECA reserves the right to revise this product" diyor. Teknik tablo ürün sayfasının açıklamasındaki resimdeyse resim okunur; tabloda birden çok model varsa yalnız kaydın modelinin satırı kullanılır.

## Canlı verisi için özel kaynak kuralı

- Yerel mağazalar yalnızca Türkiye'de kullanılan satış adını, varyeteyi ve güncel bulunabilirliği karşılaştırmak için kullanılabilir.
- Bilimsel kimlik için FishBase, Catalog of Fishes, GBIF veya hakemli taksonomi yayını tercih edilir.
- Yetişkin boyu, minimum akvaryum, sıcaklık, pH, sosyal yapı ve özel bakım riskleri için kurumsal bakım rehberi veya yerleşik tür uzmanı veri tabanı kullanılmalıdır. Örnekler: Seriously Fish, Practical Fishkeeping, OATA, Fishipedia, Maidenhead Aquatics/Fishkeeper; kedi balıklarında ScotCat, Welsfans ve Corydoras World; goodeid'lerde Goodeid Working Group; *Parosphromenus*'ta Parosphromenus Project (2026-10-30); karides ve salyangozlarda aşağıdaki "Omurgasızlar" bölümü.
- Yerel mağazanın bakım metni, bilimsel kimlik veya zorunlu bakım eşikleri için tek başına yeterli kanıt sayılmaz.
- Ticari ad birden fazla türe uyuyorsa ya da mağaza adı ile uzman kaynak çelişiyorsa eşleme yapılmaz; kayıt çözülmemiş tutulur.
- İstisna (`docs/DECISIONS/0014-coklu-tur-satis-adi-profilleri.md`, ürün sahibi onayı 2026-10-05): katalogda zaten bulunan ve kullanıcı kayıtlarının bağlı olduğu bir profilin satış adı birden fazla türü kapsıyorsa profil kaldırılmaz. Bilimsel ad adayları gösterir, değerler adaylar arasında kaynaklı ve en koruyucu olanlardır (en büyük boy, en büyük akvaryum), kimlik belirsizliği kullanıcıya açıklanır. Yeni mağaza başlıkları için yukarıdaki kural aynen geçerlidir.
- Tek bir güvenilir sayfa tüm eşikleri yayımlamıyorsa ana bağlantı `sourceUrl`, kimlik/boy/özel bakım gibi bağımsız doğrulamalar `additionalSourceUrls` alanında HTTPS bağlantılarıyla saklanır.
- Fit çevirisi (2026-11-13, teknik yöntem, Claude): kaynak akvaryum ölçüsünü fit olarak yazıyorsa ("N ft", "5'") 1 ft = 30 cm alınır (4 ft = 120 cm, 5 ft = 150 cm, 6 ft = 180 cm); taban ölçüsünden hacim aynı çevrilmiş ölçülerle hesaplanır. Katalogdaki eski kayıtlar karışıktı (5 ft hem 150 hem 152 cm, 6 ft 180, 182 ve 183 cm); 2026-11-13 veri doldurma 1'den itibaren bu düzen kullanılır (`docs/CATALOG_LOG.md`, "2026-11-12 En az hacim ve uzunluk", karar 3).
- Atık katsayısı (`wasteFactor`, 2026-11-13, teknik yöntem, Claude): kaynaklı değildir, model değeridir (karar 0009). Yeni tatlı su kayıtlarında karar 0031'deki ortanca kullanılır: balıkta aynı boy aralığındaki bugünkü kayıtların ortancası, omurgasızda kategorinin ortancası. Bu, aşağıdaki "Deniz canlıları" bölümündeki 0031 kuralının tatlı suya genişletilmesidir; ilk uygulama 2026-11-13, 25 yeni kayıt (`docs/CATALOG_LOG.md`, "2026-11-12 Eksik yaygın canlılar ve bitkiler").
- Tatlı su adıyla satılan acı su veya deniz canlısı, salinite gereksinimi uygulamanın sağlık analizinde modellenmeden sıradan tatlı su profiline bağlanmaz.
- Resmî genel bakım bilgisi (ürün sahibi kararı, 2026-11-14): "Veterinerler, artık kim bakıyorsa, onların resmî genel bilgileri bizim için geçerlidir, özellikle tek görüşte birleşilenler." Resmî veteriner ve hayvan refahı kurumlarının genel bakım bilgisi (ör. OATA bakım kartları, RSPCA, veteriner birlikleri, üniversite ve devlet rehberleri) kabul edilen kaynaktır; kurumların birleştiği görüş önceliklidir. Türe özgü kabul edilen kaynak varsa o önce gelir. Genel rehberden alınan değer kayıt notunda ve katalog günlüğünde "genel rehber" diye belirtilir. Genel rehberin grup için verdiği alt sınır (ör. OATA'nın küçük kedi balıkları için 80 L'si) iri bir türün kayıttaki değerini düşürmek için kullanılmaz.
- FishBase boy farkı (2026-11-14, lider kararı, teknik yöntem): boyda kaynakların büyüğü alınır; ancak FishBase'in en büyük boyu bakım kaynaklarının (Seriously Fish, Fishkeeper, Practical Fishkeeping) en büyüğünü yarıdan fazla aşıyorsa (1,5 katından büyükse) bakım kaynağının en büyüğü alınır ve fark katalog günlüğüne yazılır. Örnek: güreşçi yarımgaga, FishBase 16,1 cm TL, Seriously Fish 5,5 cm → 5,5 cm. Bakım kaynağı yoksa FishBase'in boyu kullanılır.
- Fishipedia alanları (2026-11-14, teknik yöntem): Fishipedia sayfasındaki "Natural environment characteristics" (Fransızca "Caractéristiques du milieu naturel", İtalyanca "Caratteristiche dell'habitat naturale") bloğu ve "naturellement / lives naturally" diye yazılan değerler doğal ortamın değeridir; FishBase'in doğal kayıtları gibi sıcaklık ve pH ortak aralığına girmez. Akvaryum değeri yalnız öneri bloğundan ("Our recommendations", "Raccomandazioni generali", "Nos recommandations") alınır. Öneri bloğunun birçok türde aynı yazdığı pH 7,2–8 ve 6,8–7,2 şablon kuşkuludur (Tanganyika türlerinde öbür kaynakların pH 8–9'uyla kesişmiyor); ortak aralığa girmez.
- Grup sayısı aralığı (2026-11-14, teknik yöntem): kaynak en az grubu aralıkla yazıyorsa ("at least 8–10") ve kayıttaki değer bu aralığın içindeyse kayıttaki değer korunur; altındaysa aralığın alt ucu alınır. "Çift oluşsun diye 6 genç balık alın", "isterseniz grup", "en iyi grup halinde" gibi öneriler en az grup sayılmaz.

## Omurgasızlar (karides, salyangoz) için uzman kaynaklar

Ürün sahibi 2026-10-20'de kabul edilecek kaynakların seçimini gözlem ve gerekçeleriyle Claude'a bıraktı (`PROJECT_STATUS.md` → "Ürün sahibinin 2026-10-20 kararları", madde 3). Seçim 2026-10-20'de sayfalar okunarak yapıldı.

Gözlemler:

- Seriously Fish'te omurgasız sayfası yok; balıklarda kullanılan ana kaynak burada kullanılamıyor. Taban katalogdaki dört omurgasız kaydının (Amano, kiraz karides, Crystal Red, tavşan salyangoz) bağlantısı bilimsel addan üretilmiş, var olmayan bir Seriously Fish adresidir.
- Katalogdaki omurgasız kayıtlarının çoğu yerel mağazaya ya da tek yazarlı hobi ve satıcı sitelerine dayanıyor.
- Kurumsal kaynakların hiçbiri tek başına bütün alanları vermiyor: Fishkeeper akvaryum ölçüsü ve sayısal grup yayımlamıyor; OATA bütün karides ve salyangozlar için tek bir genel kart yayımlıyor.

Kabul edilen kaynaklar (öncelik sırasıyla):

1. **Fishkeeper (Maidenhead Aquatics):** tür ya da form sayfası olan taksonlarda ana kaynaktır (sıcaklık, pH, sertlik, boy, sosyal yapı, tank arkadaşı). Balıklarda da kabul edilen kurumsal yayıncıdır; satılan formları (rili, yellow fire, crystal red) ayrı sayfalarla kapsar. Cins sayfası (ör. *Tylomelania* spp., *Pomacea* sp.) o cinsteki kayıtları kapsar. Fishkeeper bir türü yalnız cins sayfasıyla kapsıyor ve wirbellose.de'de türe özgü kayıt varsa, sıcaklık ve pH'ta türe özgü kaydın aralığı da ortak aralığa girer (koruyucu; ör. *Pomacea diffusa*); öteki alanlarda wirbellose.de yalnız Fishkeeper'ın vermediği yerde kullanılır.
2. **Practical Fishkeeping:** adlı yazarların makaleleri ve okur sorularına verdikleri yanıtlar; kurulum ve biyotop yazılarındaki tür kutuları da buna dahildir. Neocaridina için en küçük akvaryumu ve en az grup sayısını, Caridina ve Sulawesi türleri için su değerlerini verir. Tür grubuna özgü sayı veren tek kurumsal kaynaktır. Site, kendi aramasıyla (başlık ve özet) ve alan adıyla sınırlı genel web aramasıyla taranır; sitenin kendi araması eski arşiv yolundaki (`/features/articles/`) ve başlığında tür adı geçmeyen yazıları kaçırabiliyor. Taranan ve değer veren yazılar katalog günlüğünde listelenir, tarama üç ayda bir yinelenir.
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
- **Boy:** katalog ile kaynağın büyüğü. Kaynak yalnız cins aralığı veriyorsa (ör. *Tylomelania* 2–12 cm) aralığın üstü alınır. Kaynak doğadaki ve akvaryumdaki boyu ayrı yazıyorsa (ör. wirbellose.de: *Melanoides* doğada 6,5 cm, akvaryumda nadiren 3 cm'nin üstünde) akvaryumdaki boy alınır.
- **Akvaryum:** hacim için türe ya da cinse özgü kaynak değeri. Hiçbir kabul edilen kaynak yayımlamıyorsa kayıttaki değer korunur; hiçbir durumda OATA tabanının altında değil (OATA'nın 10–20 L'lik tabanı küçük karides ve salyangozlar içindir, iri türlerin değerini düşürmek için kullanılmaz). Uzunluk yayımlanmıyorsa kayıttaki değer korunur.
- **Su türü:** kaynak acı ya da deniz suyu gerektiriyorsa kayıt o su türüne bağlanır ("Canlı verisi için özel kaynak kuralı"); tuzluluk aralığı kaynakta yoksa yazılmaz. Kaynak yalnız hafif acı suya dayanabildiğini yazıyorsa (ör. Fishkeeper'da zebra nerit, wirbellose.de'de *Melanoides*) kayıt tatlı su kalır ve bu dayanıklılık günlüğe yazılır. Acı su eklemek tuzluluk aralığı ister; motor da tuzluluk aralığı olan her canlı için, tatlı su akvaryumunda bile, özgül ağırlık ölçümü ister.
- **Grup:** türe ya da cinse özgü kaynak sayısı; kaynaklar farklı sayı veriyorsa türe ya da cinse adanmış yazının sayısı; yoksa karideste OATA'nın 5'i; salyangozda kaynak grup demiyorsa 1. Üreme ya da iki cinsiyetin bulunması için verilen sayılar (ör. Fishkeeper "both sexes", wirbellose.de "zur Zucht") en az grup sayılmaz.
- **Nitelikler:** kaynakla doğrudan çelişen nitelikler (akıntı, avcılık, tür akvaryumu) düzeltilir.
- **Eski kaynaklar:** ek kaynak olarak kalır.
- **Okuma:** değerler sayfa açılarak okunur; arama özeti kaynak sayılmaz.
- **Kerevit ve yengeç (2026-10-30):** aynı kaynaklar ve aynı değer kuralı kullanılır. Fishkeeper'da ve Practical Fishkeeping'de sayfası olmayan kerevitlerde wirbellose.de'nin tür ya da satılan form sayfası ya da Fishipedia'nın kabuklular bölümündeki tamamlanmış sayfa (`/crustacea/`, Fransızca `/fr/crustacea/`) ana kaynaktır; Fishipedia'nın taslak sayfaları alan alan değerlendirilir. Fishipedia'nın öneri pH'ı (7,2–8) birçok türde aynı ve doğal ortam pH'ından farklıysa veri modeli varsayılanı olduğundan şüphelenilir ve kullanılmaz (kaynak güvenilirliği değerlendirmesi); "ab 60x30 cm für ein Paar" gibi taban ölçüsünden yalnız uzunluk alınır, hacim yayımlanmıyorsa kayıttaki değer kalır.

## Amfibiler (aksolotl, kurbağalar)

2026-10-30'da açık listedeki üç amfibi kaydı için seçildi (teknik yöntem, Claude). Seriously Fish amfibi yayımlamıyor.

1. **Fishkeeper (Maidenhead Aquatics):** tür ya da cins sayfası olan amfibilerde ana kaynaktır (sıcaklık, pH, boy, uyumluluk).
2. **Fishipedia:** amfibi bölümündeki tamamlanmış sayfalar (`/amphibians/`); taslak sayfalar alan alan değerlendirilir (balıklardaki gibi).
3. **Practical Fishkeeping:** adlı yazarların bakım yazıları ve okur cevapları; akvaryum ölçüsü ve sosyal yapı için kullanılır.

Değer kuralı omurgasızlardakiyle aynıdır. Okul, satıcı ve tek yazarlı bakım sayfaları ek kaynak olarak kalır.

## Bitkiler

Ürün sahibi kaynak listesini 2026-10-25'te onayladı (`docs/DECISIONS/0023-bitki-katalogu.md`). Sayfalar 2026-10-25'te (UTC) açılarak okundu; değerler betikle işlendi.

Kabul edilen kaynaklar:

1. **Fishkeeper (Maidenhead Aquatics) bitki bilgi bankası:** ana kaynaktır (71 bitki). Sıcaklık aralığı, pH, ışık, büyüme hızı ve boyu verir; açıklama yerleşimi (ön, orta, arka plan, kök ya da taş üzeri, yüzen) yazar. Birkaç yazım hatası ve eski ad içerir (ör. "Elodea densa", "Chladoflora aegagropila"); adlar Fishkeeper'ın kendi eş ad satırı ve açıklamasıyla, gerekirse Tropica ile eşlenir.
2. **Tropica (bitki yetiştiricisi):** ışık ve CO₂ ihtiyacını tanımlı bir ölçekle verir (düşük, orta, yüksek; orta CO₂ 6–14 mg/L, yüksek yaklaşık 15–25 mg/L), ayrıca büyüme hızını ve iki ayda ulaşılan boyu. Sıcaklık ve pH vermez. Her ürün biçimi (saksı, doku kültürü, kök üzeri) ayrı sayfadır; aynı bitkinin sayfaları birlikte okunur. Boş alanlar ve başka bir bitkiyi anlatan açıklamalar (kopyalama hatası) vardır; açıklaması başka bitkiyi anlatan sayfa kullanılmaz. Fishkeeper'da kaydı olmayan bitkilerde ve Tropica'da ayrı sayfası olan formlarda ana kaynaktır (2. paket).
3. **Practical Fishkeeping:** destekleyici kaynaktır. Tür kutuları sıcaklık ve pH aralığı verdiğinde ortak aralığa girer; "akvaryumda kaçınılacak bitkiler" yazısı ("21 plants to avoid in the aquarium") su bitkisi olmayan bitkiler içindir: orada ev bitkisi olarak geçen ve Türk mağazasında satılan bitki "su bitkisi değil" etiketi alır (3. paket, *Ophiopogon japonicus*; yazı "Ophiopogon japonica" diye yazıyor). Tür kutuları 4. pakette (2026-10-29) tarandı: sitenin kendi araması (`/features/?Query=` ve `/fishkeeping-answers/?Query=`, bütün sonuç sayfaları; arama yalnız başlık ve özette eşleşir) ve alan adıyla sınırlı genel web araması. Taranan ve değer veren yazılar katalog günlüğündedir; tarama üç ayda bir yinelenir. Yalnız tek bir bitkinin kendi değer satırları sayılır ("Factfile", "Quick facts", "Plant profiles" ya da bitkinin adıyla başlayan kutu). Şunlar sayılmaz: bir cinsi ya da bitki grubunu tek aralıkla anlatan cümleler (ör. "Aponogeton'lar genelde pH 6,5–7,5"), kutu biçiminde olmayan anlatımlar, yazarın kendi akvaryumunun ve doğal yaşam alanının değerleri, aynı yazıdaki başka canlıların kutuları. Kutudan yalnız sıcaklık ve pH alınır.
4. **Flowgrow:** yalnız eş ad ve yanlış satış adı eşleştirmesi içindir; değer kaynağı değildir (sahibi bir satıcı; bazı değerler bütün bitkilerde aynı).

Kabul edilmeyenler: Dennerle (bitki veri tabanı yok), Aquasabi (satıcı; verisi Flowgrow'dan kopya). Yerel mağazalar canlılarda olduğu gibi yalnız satış adı ve bulunabilirlik içindir.

İstilacı ve yasak bitkiler için resmî listeler (değer vermez, yalnız etiket içindir):

- AB'nin istilacı yabancı türler listesi (Uygulama Yönetmeliği (AB) 2016/1141 ve değişiklikleri; EUR-Lex konsolide metni, 2025-08-07).
- İngiltere'nin satış yasağı (Wildlife and Countryside Act 1981 (Prohibition on Sale etc. of Invasive Non-native Plants) (England) Order 2014, madde 3; legislation.gov.uk'teki güncel metin). İlk metinde yedi bitki vardı; 2019'dan beri metinde *Azolla filiculoides*, *Ludwigia uruguayensis* ve *Crassula helmsii* kalıyor (öbürleri The Invasive Alien Species (Enforcement and Permitting) Order 2019 ile çıkarıldı). Etiket güncel metne göre konur.
- Florida Üniversitesi'nin (UF/IFAS) su ve istilacı bitkiler dizini: sayfanın başlığındaki liste durumu. Kullanılanlar ABD federal zararlı ot listesi ("Federal Noxious Weed List") ve Florida İstilacı Türler Konseyi'nin istilacı listesidir ("FISC Category 1" ya da "2"). FISC bir yasa listesi değildir; istilacı türleri sınıflandıran kurumsal bir listedir. Etiket yalnız başlıktaki liste durumundan konur; sayfanın düz metnindeki "birçok yerde istilacı" gibi cümleler etiket sayılmaz (ör. *Egeria densa*). Formun etiketi türünkidir; kaynak formu türün bir formu diye yazmıyorsa ("probably a variation" gibi) etiket taşımaz.
- Türkiye'de resmî bir liste bulunamadı. Metin, bitkinin Türkiye'de yasak olduğu anlamına gelmeyecek biçimde yazılır.

Yalnız uyarı kaydı (3. paket, `docs/DECISIONS/0026-bitki-uyari-kayitlari.md`): Fishkeeper'da ve Tropica'da sayfası olmayan, ama yukarıdaki resmî listelerden birinde, UF/IFAS'ın başlığında ya da Practical Fishkeeping'in kaçınılacak bitkiler listesinde geçen ve kabul edilen Türk mağazasında satılan bitki, değer alanları olmadan kataloğa girer. Ana kaynağı etiketinin kaynağıdır. Satış adı yalnız mağazanın ürün başlığından alınır. Stok durumu ölçüt değildir. Hiçbir kaynakta etiketi olmayan bitki girmez.

Değer kuralı (balık ve omurgasızlardaki kuralın bitki karşılığı):

- **Sıcaklık ve pH:** aralık veren kabul edilen kaynakların ortak aralığı. Aralık veren kaynaklar Fishkeeper ve Practical Fishkeeping'in tür kutularıdır (4. paket); Tropica sıcaklık ve pH vermez. Tropica'ya dayanan kayıtta bu alanlar Fishkeeper'daki türün sayfasından (kayıt o türün formuysa) ve Practical Fishkeeping'in kutusundan gelir; ikisi de yoksa boştur. Kutu yalnız sıcaklığı veriyorsa pH yalnız Fishkeeper'dan gelir, o da yoksa boş kalır. Formun kendi kutusu yoksa türün kutusu formuna da girer (form kuralı, aşağıda; ör. Java fern'in 'Windeløv', 'Narrow' ve 'Trident' formları). Fishkeeper'ın A. heterophylla sayfası sıcaklığı birimsiz yazıyor ("22-30"); °C olarak okundu.
- **Işık:** Tropica'nın üç düzeyli ölçeği kullanılır. Fishkeeper'ın düzeyleri bu ölçeğe çevrilir: çok düşük ve düşük "düşük", orta ve "moderate" "orta", yüksek ve çok yüksek "yüksek". Kayıtta aralık tutulur: alt uç, Fishkeeper aralığının alt ucu ile Tropica'nın ihtiyacından yüksek olanıdır ("en yüksek ihtiyaç"); üst uç Fishkeeper aralığının üst ucudur, en az alt uç kadar. Tropica yalnız ihtiyacı (tek düzey) verdiği için Tropica'ya dayanan kayıtta alt uç o düzeydir; üst uç Fishkeeper'daki türün aralığından gelir, tür Fishkeeper'da yoksa alt uçla aynıdır.
- **CO₂:** Tropica'nın ihtiyacı. Aynı bitkinin ürün sayfaları farklı yazıyorsa en yüksek ihtiyaç alınır. Tropica'da aynı bitkinin sayfası yoksa alan boş kalır. Fishkeeper'ın "CO₂ eklenmesi önerilir" gibi düzey vermeyen cümleleri değer sayılmaz.
- **Büyüme hızı:** kaynakların verdiği düzeylerin aralığı (Fishkeeper beş, Tropica üç düzey; Tropica'nın "High" düzeyi "hızlı" sayılır).
- **Boy:** kaynakların yazdığı en büyük boy. Tablolardaki boyun yanında açıklamada açıkça yazılan boy da sayılır: bitkinin boyu, gövde uzunluğu ya da rozetli, soğanlı ve stolonlu bitkilerde yaprak uzunluğu (bu bitkilerde boyu yapraklar belirler; Fishkeeper da *Crinum*'da boyu yaprak uzunluğuyla yazıyor). Kalınlık, en ve rizom uzunluğu sayılmaz. Fishkeeper boyu cm ve inç olarak yazar; yalnız cm okunur. Tropica'nın tablosundaki boy iki ayda ulaşılan boydur. Bu kesin bir üst sınır değildir: kaynaklar "+" işaretiyle bitkinin daha da uzayabileceğini yazar.
- **Yerleşim:** yalnız kaynak açıkça yazıyorsa (ör. "foreground plant", "attached to bogwood or rock"); boya göre tahmin edilmez. "Centrepiece" gibi bir düzleme denk gelmeyen ifadeler yerleşim sayılmaz.
- **Ad ve form:** bir kayıt kaynağın sayfasındaki bitkidir (tür, varyete ya da kültür formu). Tropica'nın sayfası yalnız aynı bitkiyse kullanılır; tür kaydına kültür formunun sayfası, kültür formu kaydına türün sayfası karışmaz. Tropica'nın ürün adı ile açıklaması farklı düzeyde ad veriyorsa açıklama esas alınır (ör. "Cryptocoryne crispatula" sayfası var. *balansae*'yi anlatıyor). Tırnak içindeki ad Flowgrow'a göre aynı bitkinin eş adı ya da ticari adıysa sayfa ve satış adı aynı bitkinindir: 'Pink' *A. reineckii* var. *rosaefolia*, 'Bogor Moss' *Taxiphyllum barbieri*, 'Bonsai' *Anubias* 'Petite', *C. axelrodii* *C. undulata*, 'Round Leaf' ve 'Gold Coin' *Anubias barteri* 'Coin Leaf'. Flowgrow'un seçilmiş form ("Auslese") dediği ad ayrı bir formdur (ör. *C. wendtii* 'Green Gecko'). Flowgrow'un bir kayıtta kaynak gösterdiği uzman sayfası da ad eşleştirmesi için okunabilir (ör. echinodorus.net'in "Ozelot rot" sayfası: 'Ozelot Red' = 'Ozelot'). Mağazada form adıyla satılan bitki türün kaydına bağlanır ve satış adı eş ad olarak yazılır, yalnız şu iki durumda bağlanmaz:
  - kaynakta o formun ayrı bir kaydı varsa form o kayda bağlanır (ör. 'Windeløv');
  - kaynağın kaydı bir formsa başka bir formun satış adı ona bağlanmaz (ör. *C. wendtii* 'Green' kaydına 'Green Gecko', *Echinodorus* 'Ozelot' kaydına 'Ozelot Narrow Mini').
- **Form kayıtları (2. paket):** Tropica'da ayrı sayfası olan ve satılan form kendi kaydını alır (ör. *Microsorum* 'Trident', *C. beckettii* 'Petchii'). Değerler formun Tropica sayfasından gelir; sayfanın vermediği alanlar (her zaman sıcaklık ve pH; gerekirse ışık, büyüme, boy, yerleşim) Fishkeeper'daki türün sayfasından gelir. Bu, balıklardaki "form sayfası varsa formun sayfası, yoksa türün sayfası" kuralıdır. Bütün ürünleri forma giden tür kataloğa girmez (satılan bitki kalmaz). Tropica'nın ürün adı formu yazmıyor ama açıklaması bir formu anlatıyorsa (ör. "Cryptocoryne nurii" sayfası 'Rose Maiden'ı, "Hydrocotyle tripartita" sayfası 'Japan'ı anlatıyor) kayıt o formdur. Bu kayda Tropica'nın kendi ürünü ve adında ya da açıklamasında formu yazan ürün bağlanır.
- **İngilizce ortak ad (2026-11-03, veri aşaması, karar 0036):** Fishkeeper sayfasının başlığı, olduğu gibi (kaynaktaki yazımla, ör. "Narrow Crinium"). Başlık Latince adsa (ör. "Anubias barteri (var. nana)", "Chladoflora aegagropila") ortak ad yoktur. Kendi Fishkeeper sayfası olmayan form kaydında türün Fishkeeper sayfasının başlığı kullanılır (ör. *Microsorum* 'Trident' için "Java Fern"). Yalnız Fishkeeper'ın başlıkları kullanıldı: Tropica'nın sayfa başlığı bilimsel addır, açıklamasında yer yer ortak ad geçer (ör. 'Trident' sayfasında "Java fern"), bunlar ad kaynağı olarak alınmadı. İspanyolca ortak ad için kabul edilen bir kaynak yoktur; Tropica'nın İspanyolca sitesi yok (dil seçenekleri EN, DE, FR, DA). İspanyolca ekranda bilimsel ad ve eş adlar gösterilir. Ad yalnız İngilizce ekranda gösterilir ve aranır.
- **Türkçe satış adları:** Türk mağazalarının Türkçe adları (ör. "Tilki kuyruğu", "Hygrophila polysperma (Zeytin)") eş adlarda kalır ve ayrıca işaretlenir (`turkishAliases`). Yalnız Türkçe ekranda gösterilir; aramada her dilde bulunur.
- **Tropica'nın yazdığı eski ve yanlış adlar:** satış adı eşleştirmesinde kullanılır (ör. "Previously known as Pogostemon erectus", "has been sold as Echinodorus bolivianus var. magdalenensis", "Used to be sold as Ludwigia perennis").
- **Tropica'nın ürün numarası:** mağazanın ürün sayfası Tropica'nın ürün numarasını yazıyorsa (ör. "33-101C") ürün o numaralı Tropica sayfasının bitkisidir. Mağazanın verdiği ad Flowgrow'a göre başka bir bitkiyse eş ad olarak yazılmaz (ör. "Var. Angustifolia" adıyla satılan 101C, Tropica'nın var. *glabra* sayfası; 'Siamensis' adıyla satılan 053A, 'Stricta'). Numaranın gösterdiği Tropica sayfası kopyalama hatası yüzünden kullanılmıyorsa ürün bağlanmaz.
- **Satış kanıtı:** her kayıtta bitkinin kabul edilen mağazada satıldığını gösteren ürün sayfaları saklanır (`shopUrls`). Ürün adı sayfası açılarak okunur.
- **Okuma:** değerler sayfa açılarak okunur; arama özeti kaynak sayılmaz. Kaynaklar üç ayda bir, katalogla birlikte yeniden açılır (karar 0020).
- **Ekranda (karar 0024):** bitki sayfası kaydın değerlerini olduğu gibi gösterir; kaynakta olmayan değer "Kaynakta yok" yazar, tahmin edilmez. Kaynak bağlantıları kaydın kendi sayfalarıdır (Fishkeeper, Tropica, Practical Fishkeeping, UF/IFAS ve resmî listeler). İstilacı tür uyarısı listenin adını ve kaynağını yazar ve "Türkiye'de yasak" anlamına gelmediğini söyler.

## Deniz canlıları (tuzlu su başlangıç paketi)

Ürün sahibi kaynak listesini 2026-10-29'da onayladı (`docs/DECISIONS/0029-tuzlu-su-baslangic-paketi.md`). Sayfalar 2026-10-29'da (UTC) açılarak okundu. Bu kurallar başlangıç paketinin kayıtlarına uygulanır. Katalogdaki 11 deniz kaydı bu kurallarla yeniden kaynaklandı ve 20 başlangıç türü eklendi (2026-10-30, `docs/DECISIONS/0031-deniz-katalogu.md`). Ürün sahibi aynı gün dört kuralı netleştirdi: ad, atık katsayısı, ana kaynaklarda sayfası olmayan kayıtlar ve akvaryum hacmi (aşağıda).

Kabul edilen kaynaklar:

1. **Fishkeeper (Maidenhead Aquatics):** deniz balıklarında ve omurgasızlarında ana kaynaktır (321 deniz balığı, 99 deniz omurgasızı; ör. temizlikçi karides *Lysmata amboinensis* 23–27 °C, resif uyumu "Excellent"). Türe özel verdiği alanlar sıcaklık, en büyük boy, resif uyumu ("Reef", "Reef with caution") ve huydur; huy ve beslenme düzyazıdadır. Açılan balık ve omurgasız sayfalarında aynı yazdığı özgül ağırlık (1.020–1.025) ve pH (8,1–8,4) tür değeri olarak alınmaz. En az akvaryum hacmi yazmaz.
2. **OATA (Ornamental Aquatic Trade Association):** genel su hedefleri için ana kaynaktır (kurulum rehberi, aşağıda). Tür grubu sayfaları (17 deniz balığı grubu, 4 omurgasız grubu) grup düzeyinde akvaryum hacmi ve bakım bilgisi için destekleyici kaynaktır. Bu sayfaların su tabloları türe özgü değildir, grubun genel değeridir ve gruptan gruba biraz değişir (ör. palyaço özgül ağırlık 1.020–1.025, pH 7,9–8,3; anemon 1.023–1.026, pH 8,1–8,3); tür değeri olarak alınmaz.
3. **Practical Fishkeeping:** destekleyicidir. Tür kutularındaki boy ve akvaryum ölçüsü alınır. Su değerleri alınmaz, çünkü su değerleri akvaryum düzeyinde OATA'dan gelir (karar 0029). İncelenen karides yazısı, o yazıdaki türler için değerleri tür kutularından çıkarıp standart resif değerlerini geçerli saydığını yazıyor. Öbür yazılar farklı genel değer verebilir (ör. ocellaris bakım yazısında KH 7–11 dKH).
4. **FishBase ve SeaLifeBase:** destekleyicidir: boy ve IUCN durumu. Sıcaklıkları doğal yaşam alanının değeridir, akvaryum aralığı olarak alınmaz.
5. **Fishipedia ve Meerwasser-Lexikon:** destekleyicidir. Fishipedia türe özel akvaryum hacmi, grup ve ön cam uzunluğu ile ("maintenance en aquarium" bölümü olan türlerde) sıcaklık aralığı için. Meerwasser-Lexikon bir topluluk veri tabanıdır ve yedek kaynaktır (karar 0031): hacimde yalnız OATA, Fishipedia ve Practical Fishkeeping değer vermiyorsa; sıcaklık ve boyda yalnız Fishkeeper'da ve Fishipedia'da sayfası olmayan kayıtlarda, kayıtta notuyla. Birim hatası görülen değer (ör. °F etiketiyle yazılmış °C değerleri) kullanılmaz.
6. **WoRMS (World Register of Marine Species):** yalnız geçerli bilimsel ad ve eş ad eşleştirmesi için; değer kaynağı değildir.

Kabul edilmeyenler: LiveAquaria (satıcı; açılan balık sayfalarında aynı genel su bloğu), Quality Marine (toptancı; genel su değerleri, ör. ocellaris 1.020–1.025, uzun dokunaçlı anemon 1.023–1.025), Reefs.com balık sayfaları (yazarsız ve tarihsiz; değerleri satıcıyla aynı), TFH (aynı blok, yazarsız), WetWebMedia (cins düzeyinde düzyazı; yapılandırılmış değer yok). Reef Builders, CORAL ve Advanced Aquarist arşivi haber ve makale siteleridir. Bazı yazılar türe özgü değer veriyor (ör. Reef Builders'ın Royal Gramma yazısında boy ve akvaryum hacmi), ama yapılandırılmış bir tür veri tabanı değildirler; bu pakette değer kaynağı olarak kabul edilmez.

Değer kuralı:

- **Tuzluluk, pH, KH ve öbür su değerleri:** tür kaydına yazılmaz. Deniz akvaryumunun son ölçümü OATA'nın ev akvaryumu kurulum rehberindeki ("How to set up and maintain a marine aquarium", Eylül 2022) hedeflerle karşılaştırılır. Akvaryumda deniz omurgasızı varsa omurgasızlı hedefler kullanılır.
  - Yalnız balık: özgül ağırlık 1.017–1.025, pH 8,0–8,2, amonyak ve nitrit sıfır, nitrat en çok 20 mg/L. Özgül ağırlığın üst sınırı motor 1.16.0'dan beri (karar 0041) OATA'nın deniz balığı bakım kartlarından gelir: katalogdaki deniz balıklarının bütün grupları 1.020–1.025, Fishkeeper'ın deniz balığı sayfaları da 1.020–1.025. Alt sınır rehberden; rehberin kendi yalnız balık aralığı 1.017–1.023.
  - Omurgasızlı: özgül ağırlık 1.024–1.026, pH 8,0–8,2, amonyak ve nitrit sıfır, KH 8–12 dKH. Rehber nitratı 5–10 mg/L ve fosfatı 0,04–0,1 mg/L diye, ikisinde de "türe bağlı" ("species depending") koşuluyla yazıyor. Bu iki aralık her omurgasızlı akvaryuma uygulanan bir eşik olarak kullanılmaz, bilgi olarak gösterilir.
  - Rehberin sıcaklık aralıkları (yalnız balık 24–27 °C, omurgasızlı 24–26 °C) bilgi olarak gösterilir, ayrıca değerlendirilmez. Sıcaklık türün aralığıyla değerlendirilir (aşağıda). OATA'nın tür grubu sayfalarının farklı değerleri günlüğe yazılır, hedef olarak kullanılmaz (tek istisna, karar 0041: yalnız balıklı özgül ağırlığın üst sınırı). OATA'nın ticaret için su kalitesi ölçütü (Ekim 2022) ev akvaryumu hedefi değildir; motorun bugünkü amonyak, nitrit ve nitrat tehlike sınırlarının kaynağı olarak kalır (karar 0008; deniz için serbest amonyak 0,01, nitrit 0,125, nitrat 100 mg/L). Uygulama: motor 1.13.0 (karar 0030); deniz kayıtlarının pH ve özgül ağırlık aralığı kaldırıldı, katalog denetimi bu alanları deniz kayıtlarında kabul etmez.
- **Sıcaklık:** türe özel tutma aralıklarının ortak aralığı (koruyucu; tatlı sudaki kural). Ana kaynak Fishkeeper'dır; Fishipedia'nın akvaryum bölümündeki aralık da ortak aralığa girer. Doğal yaşam alanı değeri (FishBase) ve "ideal" ya da üreme aralıkları kullanılmaz.
- **Boy:** kaynakların yazdığı en büyük yetişkin boy (Fishkeeper, Practical Fishkeeping, FishBase).
- **Akvaryum:** OATA'nın grup değeri ile Fishipedia'nın ve Practical Fishkeeping'in türe özel değerinin büyüğü (karar 0031; karar 0029'daki "en büyüğü" kuralının yerine). Meerwasser-Lexikon yalnız bunların hiçbiri değer vermiyorsa kullanılır. Fishkeeper'ın kendi sayfası birey başına hacim yazıyorsa (ör. turbo salyangoz 100 L, keşiş yengeci 35 L) ek birey hacmi olarak alınır; bu değer grup değerinden büyükse ilk birey için de en az hacimdir (turbo salyangoz 100 L). Grup değeri bir çift ya da tek balık içinse kayıtta bu yazılır. Uzunluk yalnız kaynak yazıyorsa (Practical Fishkeeping'in bilgi kutusu, Fishipedia'nın ön cam ölçüsü); yoksa "tank uzunluğu verisi sınırlı" notu yazılır.
- **Grup:** türe özel kaynağın verdiği en az sayı; kaynaklar farklıysa türe adanmış sayfanın sayısı. Fishkeeper tek tutmaya izin veriyorsa 1 alınır; öbür kaynağın farklı sayısı bakım notunda yazılır.
- **Ad:** Türkçe karşılık; Fishkeeper'ın İngilizce adı ve eş adları satış adı olarak kalır (karar 0031). Bilimsel ad WoRMS'un geçerli adıdır.
- **Atık katsayısı:** kaynaklı değildir, model değeridir (karar 0009). Yeni kayıtlarda bugünkü kayıtların ortancası: balıkta boy aralığına, omurgasızda kategoriye göre (karar 0031).
- **Resif uyumu ve huy:** Fishkeeper'ın yazdığı (balık ve omurgasız); Fishkeeper'da sayfası olmayan türde OATA ve Practical Fishkeeping'in açık ifadesi. Kaynağın yazmadığı uyum tahmin edilmez.
- **Satış kanıtı:** deniz canlılarında aranmaz (karar 0029). Türler Türk uzman deniz mağazalarında sık görülen başlangıç ailelerinden seçilir; mağaza kayıtta kaynak ya da satış adı olarak yer almaz.
- **Nesli tehlike:** FishBase'teki IUCN durumu "tehlikede" ya da daha kötüyse kayıtta kaynaklı bir bilgi notu yazılır.
- **Okuma:** değerler sayfa açılarak okunur; arama özeti kaynak sayılmaz. Kaynaklar üç ayda bir yeniden açılır (karar 0020).

## Hastalık ve tedavi yönlendirme kaynakları

Hastalık ve tedavi sayfası (`docs/DECISIONS/0022-hastalik-ve-tedavi-sayfasi.md`) teşhis koymaz ve ilaç önermez; yalnız aşağıdaki kaynaklara yönlendirir. Adresler `src/data/disease-guide.ts` içindedir; her sayfa 2026-10-22'de (UTC) açılarak okundu.

Kabul edilenler:

- **OATA (İngiltere süs balığı ticaret birliği):** bakım kartları veteriner onaylıdır. Hastalık belirtileri lepistes ve moli kartından, bakır uyarısı karides ve salyangoz kartından alınır (karides ve salyangozlar bakıra çok duyarlıdır, düşük düzeyde bile ölürler; akvaryuma eklenen her ilacın omurgasızlar için güvenli olduğundan emin olunmalıdır). Sayfa metni kaynağın ifadesini yumuşatmaz. "Find a fish vet" sayfası veteriner için Fish Veterinary Society'ye yönlendirir.
- **Florida Üniversitesi (UF/IFAS, EDIS yayınları; adresler ask.ifas.ufl.edu'ya taşındı):** FA031 (amonyak her zaman sıfır olmalı; balığın görünüşü ya da davranışı değişince hemen ölçülmeli), FA124 (yeni canlı ve bitki önce ayrı tutulur; hasta canlı için veterinere danışılır) ve balık sağlığı yönetimi konu sayfası.
- **Practical Fishkeeping:** Neale Monks'un yanıtı; bakır ve formalin içeren ilaçlar karidesler için öldürücüdür.
- **Türk Veteriner Hekimleri Birliği:** il veteriner hekimleri odalarının listesi. Herkese açık veteriner arama aracı yok; liste hangi hekimin balık baktığını göstermez.
- **Veteriner fakülteleri:** yalnız sayfası açılarak doğrulanan su ürünleri hastalıkları bölümleri. 2026-10-22'de doğrulanan: Erciyes Üniversitesi Veteriner Fakültesi, Sucul Hayvan Hastalıkları (Su Ürünleri ve Hastalıkları) Anabilim Dalı. Sayfa süs balığından söz etmez.
- **Fish Veterinary Society (İngiliz Veteriner Hekimler Birliği'nin uzmanlık şubesi):** İngiltere ve İrlanda'da süs balığı tedavi eden veteriner listesi.

Kullanılmayanlar:

- American Association of Fish Veterinarians (fishvets.org): sayfa açılamadı (HTTP 403).
- UF/IFAS FA165 (bakırın akvaryumda kullanımı): doz hesabı anlatır; sayfa tedavi önermediği için kullanılmaz.
- Doğrulanamayan fakülte sayfaları (İstanbul Üniversitesi-Cerrahpaşa: güvenlik doğrulaması; Fırat, Ondokuz Mayıs, Selçuk, Bursa Uludağ: bağlantı kurulamadı). Ankara Üniversitesi Veteriner Fakültesi'nde su ürünleri hastalıkları anabilim dalı yok; akuatik deney hayvanları araştırma merkezi bir hizmet birimi değildir.

Kaynaklar üç ayda bir, katalogla birlikte yeniden açılır (karar 0020).

## Tür bakım bilgisi alanları (`src/data/species-care.ts`, veri sprinti E3)

Beslenme, cinsiyet ayrımı, üreme, ömür, zorluk, yüzme bölgesi ve su sertliği yalnız kaynak sayfada açıkça yazıyorsa kaydedilir; kaynak yazmıyorsa alan yoktur (genel bilgiyle doldurulmaz). Alan başına kaynak adresi `sources` içindedir.
- Metin alanları (beslenme, cinsiyet, üreme): okuyucu özeti alıntıyla karşılaştırılır, alıntının desteklemediği ifade çıkarılır; en çok 2 kısa, betimleyici cümle; kesin olmayan alıntı kesin yazılmaz.
- Zorluk: Seriously Fish'in "Difficulty: N of 8" göstergesi ve yalın "Easy/Moderate/Difficult" zorluk sayılmaz; yalnız açık ifade ("easy to keep", "not recommended for beginners", "advanced aquarists only", "hardy" gibi).
- Ömür: yalnız sayı yazıyorsa; "en az", "en çok", "yaklaşık", "kayıtlı en yüksek" ayrımı `qualifier` ile tutulur.
- Yüzme bölgesi: akvaryumdaki davranış; doğadaki derinlik, "açık alan" ve "pelajik" gibi ifadeler alınmaz.
- Sertlik: dGH; KH, doğal yaşam alanı değeri, üreme suyu ve FishBase "dH range" alınmaz. "up to X" / "below X" için alt sınır yoktur (`null`, 0 yazılmaz). Birden çok kaynak varsa Seriously Fish, Practical Fishkeeping, OATA, wirbellose.de, Fishipedia, Scotcat, Fishkeeper sırasıyla ilki kullanılır. Yalnız kaydedilir, uyumluluk hesabına girmez.

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
- Bir sayfadaki değer de çelişki de yalnız ürün başlığında, açıklamasında ya da teknik tablosunda yazandan çıkar (karar 0019, 3. madde). Görsel dosya adı gibi bunların dışında geçen bir sayı değer sayılmaz, çelişki de oluşturmaz. Örnek (2026-11-10, veri testi): Sobo SB-8808'in Türkiye distribütörü sayfası başlıkta ve açıklamada 10 W yazıyor, 5,8 W yalnız ürün görselinin dosya adında geçiyor; kayıt 10 W taşır.
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

