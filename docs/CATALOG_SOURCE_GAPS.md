# Kaynağı yalnızca FishBase olan türler

Son güncelleme: 2026-10-20 (aşağıdaki "Uzman bakım kaynağında bulunamayan balıklar" bölümü). Önceki güncelleme: 2026-10-05. İlk liste 2026-10-03'te `main` `18fdfeb` kataloğuyla üretildi (45 tür); 42'si 2026-10-04'te kaynaklandı (`docs/CATALOG_LOG.md` → "2026-10-04 Kaynağı yalnızca FishBase olan 42 türün kaynak yenilemesi"). Kalan 3 türün kimliği 2026-10-05'te düzeltildi (`docs/CATALOG_LOG.md` → "2026-10-05 Kimliği belirsiz 3 türün kimlik ve kaynak düzeltmesi"); liste boş.

## Neden önemli

Bu türlerin tek kaynağı bir FishBase özet sayfası. Bu kaynakların çoğu, katalog oluşturulurken bilimsel addan otomatik üretildi (`catalog-species-expanded.ts` içindeki `fishSource`). FishBase tür kimliği, boy ve su değerleri için iyi bir kaynak. Ama özet sayfaları **akvaryum hacmi yayımlamaz**; en küçük akvaryum uzunluğunu ise yalnızca bazı türler için verir (ör. beyaz bulut için 60 cm, kribensis için 80 cm; bu iki türde katalogdaki uzunluk FishBase'le aynı). Bu yüzden açık hacim ve uzunluk için ayrı değerlendirilmelidir:
- **Hacim (`minVolumeL`):** Bu türlerin hepsinde görünür bir kaynağa dayanmıyor.
- **Uzunluk (`minTankLengthCm`):** Tür tür denetlenmeli; FishBase'in uzunluk verdiği türlerde kaynaklı, vermediği türlerde kaynaksız.

Bu değerler doğrudan alan uyarısını belirler. Kaynağın önerisinin altı sarı uyarıdır; motor 1.6.0'dan beri balıklarda İsviçre ölçü sınırının da altı kırmızı uyarıdır (`docs/DECISIONS/0012-alan-uyarisinin-siddeti.md`). Listede hobinin en yaygın türleri var.

## Ölçüt

`sourceUrl` bir FishBase özet sayfası ve `additionalSourceUrls` boş, ya da yalnızca FishBase bağlantılarından oluşuyor. "Bağlantı" sütununda "otomatik", bağlantının kayıtta yazılmayıp `fishSource` ile bilimsel addan üretildiğini; "elle", kayıtta açıkça yazıldığını gösterir (42 otomatik, 3 elle).

## Düzeltme kuralı

`docs/DATA_SOURCES.md` geçerlidir:
- Hacim, uzunluk, grup ve bakım eşikleri kurumsal bakım rehberinden gelir. Öncelik Seriously Fish'tedir; sonra Practical Fishkeeping, Fishkeeper ve OATA gelir.
- FishBase kimlik ve boy için ek kaynak olarak kalabilir.
- Kaynak taban ölçüsü veriyorsa, katalog günlüğündeki mevcut yöntem kullanılır (ör. 180 × 60 cm taban → yaklaşık 648 L).
- Kaynakta olmayan değer uydurulmaz. Kaynaklar çelişirse fark not edilir.

Bu liste önce Canberk'in sıradaki katalog işi olarak önerildi (2026-10-03). Ürün sahibinin isteğiyle 2026-10-04'te işi Claude üstlendi ve 42 türü kaynaklandırdı; bu türler tablodan çıkarıldı. Kalan üç türde sorun kaynak eksikliğinden çok kimlik belirsizliğiydi; 2026-10-05'te ayrı bir işte çözüldü.

## Kalan liste (yok)

Kalan üç kaydın sorunu kaynak eksikliği değil kimlikti. Ürün sahibinin 2026-10-05 onayıyla (`docs/DECISIONS/0014-coklu-tur-satis-adi-profilleri.md`) üçü de satılan balığa göre yeniden tanımlandı ve kaynaklandı:

| Kimlik | Ad | Eski bilimsel ad | Yeni bilimsel ad | Ana kaynak |
|---|---|---|---|---|
| `ancistrus` | Cüce vatoz | *Ancistrus cirrhosus* | *Ancistrus* sp. '3' | Seriously Fish |
| `common-pleco` | Common vatoz | *Hypostomus plecostomus* | *Pterygoplichthys pardalis* / *P. disjunctivus* | Fishkeeper |
| `siamese-algae-eater` | Siamese algae eater | *Crossocheilus oblongus* | *Crossocheilus langei* / *C. atrilimes* | Seriously Fish |

Değerler, çelişkiler ve kaynak cümleleri katalog günlüğündedir. Yeni bir tarama bu ölçüte uyan tür bulursa bu bölüme eklenmelidir.

## Uzman bakım kaynağında bulunamayan balıklar (2026-10-20, geliştirilecek)

Yol haritasının 2. adımında (`docs/DECISIONS/0020-urun-hedefleri-ve-yol-haritasi.md`) ne ana ne de ek kaynağında uzman bakım kaynağı olmayan 86 balığın 70'i 2026-10-19/20'de kaynaklandı ya da satılan balığa göre yeniden tanımlandı (PR #37–40; `docs/CATALOG_LOG.md` → "2026-10-19 Tür kaynak yenilemesi 1–3" ve "Kimlik paketi 4"). Kalan 16 balıkta kabul edilen uzman kaynaklarda (Seriously Fish, Fishkeeper, ScotCat; Practical Fishkeeping, OATA ve Fishipedia da tarandı) tür düzeyinde bakım sayfası bulunamadı ya da kimlik sorusu var.

Ürün sahibinin 2026-10-20 kararı: değerler olduğu gibi kalır, liste geliştirilmek üzere tutulur. Kullanıcı ekranına ek not konmadı. Her üç ayda bir yapılan bilgi araştırmasında (0020) yeniden aranmalı; uzman görüşü (ör. Canberk) ya da yeni bir kabul edilen kaynak bulunursa işlenmeli.

| Kimlik | Ad | Bilimsel ad | Durum |
|---|---|---|---|
| `cochus-blue-tetra` | Cochu'nun mavi tetrası | *Boehlkea fredcochui* | Kimlik sorusu: Seriously Fish'te sayfası yok; Fishkeeper'ın Blue Tetra sayfası balığı *Knodus borki* olarak ele alıyor ve *B. fredcochui* adıyla yanlış ithal edildiğini yazıyor |
| `apisto-erythrura` | Kırmızı kuyruk cüce cichlid | *Apistogramma erythrura* | Seriously Fish'te sayfası yok |
| `saulosi-cichlid` | Saulosi | *Chindongo saulosi* | Seriously Fish'te sayfası yok |
| `teardrop-guianacara` | Dacrya Guianacara | *Guianacara dacrya* | Seriously Fish'te sayfası yok |
| `owroewefi-guianacara` | Owroewefi Guianacara | *Guianacara owroewefi* | Seriously Fish'te sayfası yok; Fishkeeper yalnız cins düzeyinde |
| `malayan-river-sole` | Malaya nehir dil balığı | *Brachirus panoides* | Uzman kaynakta sayfası yok |
| `african-arowana` | Afrika arowanası | *Heterotis niloticus* | Seriously Fish'te sayfası yok |
| `rubicundus-lipstick-goby` | Kızıl ruj gobisi | *Sicyopus rubicundus* | Seriously Fish ve Fishkeeper'da yok |
| `selheims-freshwater-sole` | Selheim tatlı su dil balığı | *Brachirus selheimi* | Seriously Fish ve Fishkeeper'da yok |
| `kners-yellow-flagtail` | Kner'in sarı kuyruklu prochilodusu | *Semaprochilodus kneri* | Seriously Fish ve Fishkeeper'da yok |
| `blood-parrot-cichlid` | Blood Parrot ciklet | melez | İnsan eliyle üretilmiş melez; uzman kaynakta tür sayfası yok |
| `cucuta-bristlenose-l149` | Cucuta Bristlenose L149 | *Ancistrus* sp. L149 | Seriously Fish, ScotCat ve Fishkeeper'da yok; Welsfans'a erişilemedi |
| `manacapuru-bristlenose-l148` | Manacapuru benekli vatoz L148 | *Ancistrus* sp. L148 | Seriously Fish, ScotCat ve Fishkeeper'da yok; Welsfans'a erişilemedi |
| `pink-lipped-moray` | Pembe dudaklı müren | *Echidna rhodochilus* | Uzman kaynakta sayfası yok; FishBase deniz, acı ve tatlı su diyor |
| `jonklaas-lipstick-goby` | Jonklaas ruj gobisi | *Sicyopus jonklaasi* | Türün uzman bakım kaynağı yok; Seriously Fish'e göre bu adla satılanlar çoğunlukla *S. exallisquamulus* (ayrı profil). Bakım notuna kimlik uyarısı eklendi (Kimlik paketi 4) |
| `red-tailed-snakehead` | Kırmızı kuyruklu yılanbaş | *Channa limbata* | Catalog of Fishes türü geçerli sayıyor; Seriously Fish ve FishBase *C. gachua*'nın eş anlamlısı sayıyor. Uzman bakım kaynağı tür adıyla yok; mevcut kaynak korundu |

Melek balığı ve Çin ejderinin en az grup sayısı ürün sahibinin 2026-10-20 kararıyla (4. madde) araştırıldı; ayrıntı `docs/CATALOG_LOG.md` → "2026-10-21 Omurgasız kaynak yenilemesi 3":

- Melek balığı: grup 2 korundu. OATA'nın Amerika ciklitleri kartı "groups or a pair at minimum" diyor. Fishkeeper, grup halinde tutulacaksa gençlerin birbirini taciz etmemesi için en az dört birey öneriyor. Practical Fishkeeping'de Neale Monks tek birey, çift ya da altı ve üstü grup öneriyor. En az çift, OATA'nın açık sayısı; üç kaynak ek kaynak olarak eklendi.
- Çin ejderi: grup 1 korundu. Seriously Fish "needs to be in a group" diyor ama sayı vermiyor; Fishipedia'da da sayı yok.

## Uzman bakım kaynağında bulunamayan omurgasızlar (2026-10-20, geliştirilecek)

Karides ve salyangoz için kabul edilen kaynaklar ürün sahibinin 2026-10-20 kararıyla seçildi (`docs/DATA_SOURCES.md` → "Omurgasızlar"). Karidesler iki pakette, salyangozlar üçüncü pakette kaynaklandı (`docs/CATALOG_LOG.md` → "2026-10-20 Omurgasız kaynak yenilemesi 1" ve "2", "2026-10-21 Omurgasız kaynak yenilemesi 3"). Kabul edilen hiçbir kaynakta bulunamayanlar değerleriyle kalır ve aynı balık listesindeki gibi geliştirilmek üzere tutulur.

| Kimlik | Ad | Bilimsel ad | Durum |
|---|---|---|---|
| `ghost-shrimp` | Hayalet karides | *Palaemonetes paludosus* | Fishkeeper, Practical Fishkeeping ve wirbellose.de'de sayfası yok (wirbellose.de'de yalnız *P. ivonicus* ve *P. antennarius*); kayıt eski kaynağıyla kaldı |
| `ramshorn-snail` | Ramshorn salyangoz | *Planorbella duryi* | Fishkeeper ve Practical Fishkeeping'de sayfası yok (Fishkeeper'daki "Colombian Giant Ramshorn" başka cins, *Marisa*); wirbellose.de yalnız boy veriyor (15 mm, katalogdaki 2,5 cm korundu); kayıt eski kaynağıyla kaldı |
| `sun-nerite-snail` | Sun Nerite salyangoz | *Clithon donovani* | Fishkeeper, Practical Fishkeeping ve wirbellose.de'de yok; kayıt eski kaynağıyla kaldı |
| `black-devil-snail` | Black Devil salyangoz | *Faunus ater* | Fishkeeper ve wirbellose.de'de yok (Fishkeeper'daki Lava snail *Faunus* sp. "magma" başka tür); Practical Fishkeeping yalnız boy veriyor (Lukhaup ve Hummel, 8–9 cm; katalogda 9 cm). Sıcaklık, pH, akvaryum ve grup eski kaynaktan kaldı |
| `pagoda-snail` | Pagoda salyangoz | *Brotia pagodula* | Sıcaklık, pH ve akvaryum değerleri kabul edilen kaynakta yok, eski katalogdaki değerler kaldı (Aquarium Glaser bu sayıları birebir doğrulamıyor); wirbellose.de'ye göre yalnız tür akvaryumu (işaret ve bakım notu eklendi) |
| `turbo-snail`, `tiger-nerite-snail`, `mini-tiger-nerite-snail`, `mini-nerite-snail`, `batik-nerite-snail`, `batman-nerite-snail` | Nerit satış adları | Neritidae sp. | Tür kimliği yok; kural gereği satış adı türe bağlanmaz (68 satış adı işi, ürün sahibiyle). İpuçları: Fishkeeper zebra neritin (*Neritina natalensis*) "Tiger Snail" adıyla da satıldığını yazıyor; wirbellose.de'de "Batik-Schnecke" adıyla iki tür var (*Neritina variegata*, *Neritodryas* cf. *dubia*) |

## Ana kaynağı kabul listesinde olmayan canlılar (örnek denetimi 2026-10-30, geliştirilecek)

Örnek denetiminin bütün katalog taramasında bulundu: ana kaynağın alan adı `docs/DATA_SOURCES.md`'deki uzman kaynaklardan biri değil. Yukarıdaki iki listedekiler burada tekrar edilmedi (20 kayıt). Değerleri yanlış olmak zorunda değil; kabul edilen bir kaynakla yeniden okunmaları gerekiyor.

- Paket 1 (2026-10-30, `docs/CATALOG_LOG.md`): 11 balığın 10'u Seriously Fish'e, Fishkeeper'a ya da kabul edilen tür uzmanına bağlandı (Flowerhorn, Celebes halfbeak, iki goodeid, Koyu kenarlı Splitfin, carpintis, Ikola Tropheus, Mogurnda adspersa, P. deissneri, yarım bantlı dikenli yılan balığı). Goodeid Working Group ve Parosphromenus Project kabul edilen uzman kaynaklara eklendi.
- Kalan:

| Kimlik | Ad | Bilimsel ad | Bugünkü ana kaynak |
|---|---|---|---|
| `tropheus-kiriza` | Kiriza Tropheus | *Tropheus* sp. "Black" Kiriza | zoopet.com (mağaza); Seriously Fish'te ve Fishkeeper'da bu formun sayfası yok; Fishipedia'daki taslak temel alanlarda hatalı (8–23 °C, pH "28–8,8") (2026-10-30) |

Paket 2 (2026-10-30, `docs/CATALOG_LOG.md`): 7 "diğer" kayıt Fishkeeper'a, Fishipedia'ya ya da wirbellose.de'ye bağlandı (Tayland mikro yengeci, üç kerevit, iki kurbağa, aksolotl).

Fishipedia'nın taslak sayfaları (2026-10-30): sayfa "hazırlanıyor; metinler veri modelinden geliyor" diyor ve Tropheus taslaklarında şablon hataları görüldü ("en az 0 birey", Kiriza'da 8–23 °C). Katalogdaki 31 Fishipedia bağlantısının (İngilizce, Fransızca, İspanyolca ve İtalyanca sürümler) hepsi açıldı. Ikola dışında kaynaklarından biri böyle bir taslak olan 12 kayıt var; değerleri alan alan yeniden okunmalı (sayfada tutarlı olan alan kullanılır, çelişen ya da hatalı alan kullanılmaz). Taslak sayfalar: *Cichla piquiti*, *Hyphessobrycon pyrrhonotus*, *Apistogramma commbrae*, *Centropyge loriculus*, *Corydoras similis*, *Pterygoplichthys pardalis*, *Salarias fasciatus*, *Semaprochilodus insignis*, *Vieja maculicauda* (İspanyolca), *Placidochromis milomo*, *Channa stewartii* ve *Cichla ocellaris* (İtalyanca).

## Ekipman kaynak bağlantıları (örnek denetimi 2026-10-30, geliştirilecek)

Örnek denetiminde ekipman değerlerinin çoğu doğru çıktı; bulunan iki değer hatası bu pakette düzeltildi (`docs/CATALOG_LOG.md`). Asıl sorun bağlantılarda. Sayılar 2026-10-30 taramasının, bu paketteki düzeltmelerden sonraki hâli.

- **JBL'in eski adresleri:** eski biçim `jbl.de/.../products/...` ya da `.../produkte/...`; bu adresler JBL'in ana sayfasına yönleniyor, JBL ürün sayfalarını `productsv2` adreslerine taşımış.
  - Hesaba giren 49 kayıt JBL kaynak bağlantısı paketinde (2026-10-30) kapandı. 46'sı yeni ürün sayfasına, hâlâ açılan bir JBL belgesine ya da JBL'in indirme bağlantısındaki kılavuza bağlandı. 3 WHITE filtrenin değeri hesaptan çekildi (`docs/CATALOG_LOG.md`). Katalog akışı testi yenisini engelliyor.
  - Kalan: 250 hesaba girmeyen kayıt (CO₂ 84, aydınlatma 14, UV 4, aksesuar ve öbürleri 148) ve değeri çekilen 3 WHITE kaydı. JBL'in eski kılavuzları `?mod=download&id=...` bağlantılarında da bulunabiliyor. Yeni sayfalar JBL'in ürün listesinde (Almanya, "Alle") sitenin arama kutusuyla bulunuyor.
- **Marka ya da liste sayfası kaynaklı ekipman (kapandı, 2026-10-30):** hesaba giren ve değer taşıyan 1.099 kaydın 54'ü bir mağazanın marka, kategori ya da sayfalı liste sayfasına bağlıydı (Atakan 32, Akvaryum Express 21, Aquarubi 1). Ekipman kaynak bağlantısı paketi 1'de hepsi ürünün kendi sayfasına bağlandı (Boyu WF-2055 üreticinin sayfasına); altı kayıtta alan düzeltildi (`docs/CATALOG_LOG.md`). Katalog akışı testi yenisinin eklenmesini engelliyor.
- **Başlık ve açıklaması çelişen mağaza değerleri (kapandı, 2026-10-30):** Ejet 3368, 3378, 3388 ve Jingye CD300'ün debisi karar 0019'dan önceki "düşük olanı al" yöntemiyle yazılmıştı; debi kaldırıldı. Ejet 3358'de kabul edilen sayfa tutarlı, değer kaldı.
- **Bugün açılamayan kaynaklar:** zorlanmadı. Ürün sahibi kendi tarayıcısında açarsa birlikte okunabilir.
  - Resun: 172 kayıt, 90'ı hesapta. Sitenin sertifikası kendinden imzalı.
  - Fluval: 87 kayıt, 40'ı hesapta. Cloudflare insan doğrulaması.
  - Haqos: 38 kayıt, 14'ü hesapta. Sertifika başka bir adrese ait.
- **Kabul edilmeyen kaynak:** Trendyol'a bağlı 24 kayıt; hiçbiri hesaba giren değer taşımıyor.
