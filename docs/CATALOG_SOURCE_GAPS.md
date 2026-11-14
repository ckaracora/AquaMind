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
| `turbo-snail`, `tiger-nerite-snail`, `mini-tiger-nerite-snail`, `mini-nerite-snail`, `batik-nerite-snail`, `batman-nerite-snail` | Nerit satış adları | Neritidae sp. | Tür kimliği yok; kural gereği satış adı türe bağlanmaz. 68 satış adı oturumunda (2026-11-08, ürün sahibiyle) Cikletist'in nerit sayfaları da tür bilgisi vermedi; çözülmedi. İpuçları: Fishkeeper zebra neritin (*Neritina natalensis*) "Tiger Snail" adıyla da satıldığını yazıyor; wirbellose.de'de "Batik-Schnecke" adıyla iki tür var (*Neritina variegata*, *Neritodryas* cf. *dubia*) |

## Ana kaynağı kabul listesinde olmayan canlılar (örnek denetimi 2026-10-30, geliştirilecek)

Örnek denetiminin bütün katalog taramasında bulundu: ana kaynağın alan adı `docs/DATA_SOURCES.md`'deki uzman kaynaklardan biri değil. Yukarıdaki iki listedekiler burada tekrar edilmedi (20 kayıt). Değerleri yanlış olmak zorunda değil; kabul edilen bir kaynakla yeniden okunmaları gerekiyor.

- Paket 1 (2026-10-30, `docs/CATALOG_LOG.md`): 11 balığın 10'u Seriously Fish'e, Fishkeeper'a ya da kabul edilen tür uzmanına bağlandı (Flowerhorn, Celebes halfbeak, iki goodeid, Koyu kenarlı Splitfin, carpintis, Ikola Tropheus, Mogurnda adspersa, P. deissneri, yarım bantlı dikenli yılan balığı). Goodeid Working Group ve Parosphromenus Project kabul edilen uzman kaynaklara eklendi.
- Kalan:

| Kimlik | Ad | Bilimsel ad | Bugünkü ana kaynak |
|---|---|---|---|
| `tropheus-kiriza` | Kiriza Tropheus | *Tropheus* sp. "Black" Kiriza | zoopet.com (mağaza); Seriously Fish'te ve Fishkeeper'da bu formun sayfası yok; Fishipedia'daki taslak temel alanlarda hatalı (8–23 °C, pH "28–8,8") (2026-10-30) |

Paket 2 (2026-10-30, `docs/CATALOG_LOG.md`): 7 "diğer" kayıt Fishkeeper'a, Fishipedia'ya ya da wirbellose.de'ye bağlandı (Tayland mikro yengeci, üç kerevit, iki kurbağa, aksolotl).

Fishipedia'nın taslak sayfaları (2026-10-30): sayfa "hazırlanıyor; metinler veri modelinden geliyor" diyor ve Tropheus taslaklarında şablon hataları görüldü ("en az 0 birey", Kiriza'da 8–23 °C). Katalogdaki 31 Fishipedia bağlantısının (İngilizce, Fransızca, İspanyolca ve İtalyanca sürümler) hepsi açıldı. Ikola dışında kaynaklarından biri böyle bir taslak olan 12 kayıt vardı; paket 3'te (2026-10-30, `docs/CATALOG_LOG.md`) hepsi alan alan yeniden okundu, Seriously Fish'te sayfası olan 8'i SF'ye bağlandı (madde kapandı). Taslak sayfalar: *Cichla piquiti*, *Hyphessobrycon pyrrhonotus*, *Apistogramma commbrae*, *Centropyge loriculus*, *Corydoras similis*, *Pterygoplichthys pardalis*, *Salarias fasciatus*, *Semaprochilodus insignis*, *Vieja maculicauda* (İspanyolca), *Placidochromis milomo*, *Channa stewartii* ve *Cichla ocellaris* (İtalyanca).

## En az hacmi kabul edilen kaynakta bulunmayan canlılar (2026-11-12, geliştirilecek)

"Veri tamam mı" değerlendirmesinde (2026-11-12) hacim yayımlayan kabul edilen bir kaynağa bağlı olmayan 123 canlı kaydı bulundu (ölçüt: `sourceUrl` ve `additionalSourceUrls` alanlarında Seriously Fish, Practical Fishkeeping, Fishipedia, wirbellose.de, OATA, Meerwasser-Lexikon, Welsfans, Corydoras World, Goodeid WG ya da Parosphromenus Project yok). Veri modelinde kaynaksız hacmi işaretleyen bir alan yok (`tankLengthDataNote` yalnız uzunluk boşken kullanılıyor); bu yüzden liste burada tutulur. İlk 60 tatlı su türü 2026-11-12'de kaynaklandı (`docs/CATALOG_LOG.md` → "2026-11-12 En az hacim ve uzunluk: 60 tatlı su türü"). Değerler olduğu gibi kalır; her üç ayda bir yapılan bilgi araştırmasında (karar 0020) yeniden aranır.

Kabul edilen kaynaklarda bulunamayanlar (değer değişmedi):

| Kimlik | Ad | Alan | Durum |
|---|---|---|---|
| `jaguar-cichlid` | Jaguar ciklet | hacim (680 L), uzunluk (182 cm) | Seriously Fish'in ölçüsü (120 × 45 × 37,5 cm, 212 L) "MUCH larger for 12"+" diyor, yetişkini kapsamıyor; Fishipedia'nın taslağı (2000 L, 150 cm cephe) kendi içinde tutarsız; Fishkeeper ve FishBase ölçü yazmıyor |
| `skunk-cory` | Skunk çöpçü | hacim (75 L), uzunluk (60 cm) | Fishkeeper ticari balığın *Hoplisoma granti* olduğunu yazıyor; Seriously Fish'te ve Fishipedia'da yalnız gerçek *Brochis arcuata* var |
| `green-laser-cory-cw009` | Green Laser çöpçü CW009 | hacim (100 L), uzunluk (80 cm) | Seriously Fish ve Fishipedia'da sayfa yok; Fishkeeper ve ScotCat ölçü yazmıyor; Welsfans'ta *Corydoras* yok |
| `blood-parrot-cichlid` | Blood Parrot ciklet | hacim (120 L) | Melez; uzman kaynakta tür sayfası yok. Uzunluk Practical Fishkeeping'ten (120 cm) |
| `clown-pleco` | Palyaço vatoz | hacim (80 L) | Seriously Fish ve Fishipedia'da sayfa yok; Fishkeeper ölçü yazmıyor. Uzunluk Welsfans'tan (60 cm) |

- Corydoras World tür sayfaları üyelik istiyor (2026-11-12, Chrome'da denendi): sayfa yalnız başlık gösteriyor, içerik ücretli üyeliğe kapalı. Skunk, CW009, benekli, üç çizgili, adolfoi ve zümrüt çöpçüde bu kaynaktan değer alınamadı.
- Saulosi'nin Fishkeeper sayfası 2026-11-12'de bulundu ve ek kaynak oldu (uzunluk); ana kaynak (aquariumcoop.com) kabul edilen kaynak değil. Fishkeeper'ın sıcaklık ve boy değerleri kayıttan farklı (24–26 °C ve 10 cm; kayıt 24–28 °C ve 9 cm); ayrı iş.

Henüz bakılmayan 62 tatlı su kaydı (değerleri olduğu gibi; sıradaki paket): `sparkling-limia`, `cochus-blue-tetra`, `rubicundus-lipstick-goby`, `red-tailed-rasbora`, `somphongs-dwarf-rasbora`, `cherryspot-rasbora`, `six-banded-barb`, `melon-barb`, `apisto-erythrura`, `apisto-panduro`, `redhead-tapajos`, `tropheus-kiriza`, `uaru-cichlid`, `teardrop-guianacara`, `owroewefi-guianacara`, `silver-maskaheros`, `malayan-river-sole`, `selheims-freshwater-sole`, `kners-yellow-flagtail`, `red-neon-blue-eye`, `parkinsons-rainbowfish`, `bluefin-notho`, `normans-lampeye`, `snakeskin-gourami`, `betta-imbellis`, `royal-farlowella`, `ninja-woodcat`, `south-american-bumblebee-catfish`, `golden-king-tiger-pleco-l333`, `orange-seam-pleco-l106`, `colombian-zebra-pleco-l129`, `orinoco-angel-pleco-l201`, `royal-pleco-l190`, `mega-clown-pleco-l340`, `vampire-pleco-l240`, `butterfly-pleco-l052`, `cucuta-bristlenose-l149`, `brokenline-royal-pleco-l191`, `black-spotted-flyer-pleco-l244`, `blue-spotted-bristlenose-l059a`, `anthrax-flyer-pleco-l235`, `lujans-pleco-l127`, `peckoltia-l103`, `manacapuru-bristlenose-l148`, `ucayali-flathead-pleco`, `highfin-spotted-cory-cw027`, `red-tailed-snakehead`, `half-banded-spiny-eel`, `african-arowana`, `rainbow-shiner`, `spotted-congo-puffer`, `ghost-shrimp`, `ramshorn-snail`, `sun-nerite-snail`, `turbo-snail`, `tiger-nerite-snail`, `mini-tiger-nerite-snail`, `mini-nerite-snail`, `batik-nerite-snail`, `batman-nerite-snail`, `red-clawed-crayfish`, `african-dwarf-frog`. Kimliği olmayan nerit satış adları ve Ekim'de aranıp bulunamayan hayalet karides ile ramshorn yukarıdaki listelerde de var. 123'ün kalan kaydı (`pink-lipped-moray`) acı ve tuzlu su kaydıdır.
- Olası iyileştirme: OATA'nın tatlı su grup kartlarındaki hacimler bugünkü kurallarda tatlı su balığı için kaynak değildir (2026-11-12 lider kararı; dondurma sırasında yeni kural yok). Kural gelirse etkisi günlükteki bölümde yazılı.

## Davranışı bugünkü davranış kayıtlarıyla anlatılamadığı için eklenmeyen canlılar (2026-11-12, geliştirilecek)

Eksik yaygın canlılar paketinde (`docs/CATALOG_LOG.md`, "Eksik yaygın canlılar ve bitkiler") değerleri kabul edilen kaynaklarla hazır, ama kaynaklarında davranış ifadesi geçtiği için davranış kaydı zorunlu olan iki tür bekletildi (lider kararı, 2026-11-12). `src/data/species-behavior.ts`'deki bayraklardan hiçbiri kaynağın anlattığını doğru söylemiyor; yanlış kayıt, kayıtsız eklemekten kötü sayıldı.

| Aday kimlik | Tür | Kaynağın ifadesi | Neden bekliyor |
|---|---|---|---|
| `sardine-cichlid` | *Cyprichromis leptosoma* (Seriously Fish) | "Male fish form 3-dimensional breeding territories in the open water ... rival males are chased away"; aynı sayfa "Always buy a shoal of at least eight" ve büyük grupta birden çok baskın erkek görülebileceğini yazıyor | `conspecificAggression` ("males") iki ve üstü bireyde "erkekler kavga eder, ayırın" uyarısı verir; kaynak en az 8'lik sürü öneriyor |
| `marbled-hatchetfish` | *Carnegiella strigata* (Seriously Fish) | "when kept in larger groups any aggression is spread between individuals" | Saldırganlık grup büyüdükçe dağılıyor; "males" (erkekler kavga eder) ve "all" (tek tutulmalı) bunu anlatmıyor |

- Grup büyüklüğüne bağlı ya da yalnız üreme bölgesinde görülen saldırganlık için bir davranış biçimi (motor işi, ürün sahibinin onayıyla) gelirse ikisi de taslaktaki değerleriyle eklenebilir.

## Sıcaklık ortak aralığı tek noktaya inen canlılar (2026-11-13, geliştirilecek)

Eksik yaygın canlılar paketinde (`docs/CATALOG_LOG.md`, "Eksik yaygın canlılar ve bitkiler") sıcaklık ve pH, kabul edilen kaynakların tutma aralıklarının ortak aralığı olarak yeniden hesaplandı (`docs/DATA_SOURCES.md`, "Sıcaklık ve pH"; karar 0014 yöntemi). İki türde sıcaklığın ortak aralığı tek bir dereceye iniyor. Karar 0014'te ve katalogda bunun nasıl ele alınacağı yazılı değil (katalogdaki en dar sıcaklık aralığı 1 °C); türler kayıtları ve davranışlarıyla çıkarılıp bekletildi (lider kararı, 2026-11-13).

| Aday kimlik | Tür | Kaynakların sıcaklığı | Ortak aralık | Öbür değerler (hazır) |
|---|---|---|---|---|
| `trewavasae-cichlid` | *Labeotropheus trewavasae* (Seriously Fish) | Seriously Fish 24–28 °C, Fishkeeper 21–24 °C (FishBase'in doğal yaşam alanı değeriyle aynı, Ref. 1672); Fishipedia taslağının 23–28 °C'si şablon | yalnız 24 °C | 15 cm, 300 L, 120 cm, grup 4, pH 7,6–8,5; davranış `conspecificAggression` ("males") |
| `red-devil-cichlid` | *Amphilophus labiatus* (Seriously Fish) | Seriously Fish ve Fishkeeper 22–28 °C; Fishipedia taslağı 28–33 °C (FishBase Ref. 7335 ve taslağın kendi doğal ortam alanıyla aynı) | yalnız 28 °C | 40 cm, 1000 L, uzunluk kaynakta yok (not), grup 2, pH 7,2–7,8, tür akvaryumu; davranış `conspecificAggression` ("all") |

- Bir kaynağın değerinin FishBase'inkiyle aynı olması tek başına dışlama nedeni sayılmadı: bu paketin Fishkeeper sayfalarının sekizinde (Trewavasae dahil), Seriously Fish sayfalarının üçünde de sıcaklık FishBase'le aynı.
- Açılacak yol bir kural ister (karar ürün sahibinde): ortak aralık tek noktaya ya da boşa indiğinde ne yapılacağı (ör. tek noktayı kabul etmek ya da ana kaynağın aralığına dönmek). Kural gelince iki tür yukarıdaki değerlerle eklenebilir.

## Ekipman kaynak bağlantıları (örnek denetimi 2026-10-30, geliştirilecek)

Örnek denetiminde ekipman değerlerinin çoğu doğru çıktı; bulunan iki değer hatası bu pakette düzeltildi (`docs/CATALOG_LOG.md`). Asıl sorun bağlantılarda. Sayılar 2026-10-30 taramasının, bu paketteki düzeltmelerden sonraki hâli.

- **JBL'in eski adresleri:** eski biçim `jbl.de/.../products/...` ya da `.../produkte/...`; bu adresler JBL'in ana sayfasına yönleniyor, JBL ürün sayfalarını `productsv2` adreslerine taşımış.
  - Hesaba giren 49 kayıt JBL kaynak bağlantısı paketinde (2026-10-30) kapandı. 46'sı yeni ürün sayfasına, hâlâ açılan bir JBL belgesine ya da JBL'in indirme bağlantısındaki kılavuza bağlandı. 3 WHITE filtrenin değeri hesaptan çekildi (`docs/CATALOG_LOG.md`). Katalog akışı testi yenisini engelliyor.
  - Hesaba girmeyen 186 kayıt JBL kaynak bağlantısı paketi 2'de (2026-10-30) yeni ürün sayfalarına bağlandı; birkaç ad, arşiv durumu ve kaynaksız ayrıntı düzeltildi (`docs/CATALOG_LOG.md`). Katalog akışı testi yeni bir eski adresi engelliyor.
  - Kalan: yeni sayfası bulunamayan 68 kayıt (CO₂ 34, Diğer 31, değeri çekilen 3 WHITE filtre), ana kaynağı açılmayan ürün PDF bağlantısı olan 1 kayıt ve ana kaynağı açılan 22 kaydın eski adresteki bir ek kaynağı. Sonraki paket: eski sayfaların internet arşivi kopyaları (web.archive.org; ülke parametreli adreslerde daha çok kopya var), JBL'in 2015 kataloğu ve `?mod=download&id=...` bağlantılarındaki kılavuzlar.
- **Marka ya da liste sayfası kaynaklı ekipman (kapandı, 2026-10-30):** hesaba giren ve değer taşıyan 1.099 kaydın 54'ü bir mağazanın marka, kategori ya da sayfalı liste sayfasına bağlıydı (Atakan 32, Akvaryum Express 21, Aquarubi 1). Ekipman kaynak bağlantısı paketi 1'de hepsi ürünün kendi sayfasına bağlandı (Boyu WF-2055 üreticinin sayfasına); altı kayıtta alan düzeltildi (`docs/CATALOG_LOG.md`). Katalog akışı testi yenisinin eklenmesini engelliyor.
- **Başlık ve açıklaması çelişen mağaza değerleri (kapandı, 2026-10-30):** Ejet 3368, 3378, 3388 ve Jingye CD300'ün debisi karar 0019'dan önceki "düşük olanı al" yöntemiyle yazılmıştı; debi kaldırıldı. Ejet 3358'de kabul edilen sayfa tutarlı, değer kaldı.
- **Bugün açılamayan kaynaklar:** zorlanmadı. İnternet arşivindeki ham kopyalarla okundu; arşivde olmayan Fluval sayfaları 2026-11-08'de ürün sahibinin Chrome'unda birlikte okundu. Resun ve Haqos sayfalarında sertifika uyarısı geçilmedi. Paket 1 ve 2 (2026-11-04, `docs/CATALOG_LOG.md` → "Resun, Fluval ve Haqos: arşiv kopyalarıyla doğrulama, paket 1" ve "paket 2") ve Chrome oturumu (2026-11-08, `docs/CATALOG_LOG.md` → "2026-11-08 Ürün sahibiyle Chrome oturumu"):
  - Resun: 172 kayıt, 90'ı hesapta. Sitenin sertifikası kendinden imzalı.
    - Paket 1 ve 2: 56 sayfadaki 160 kayıt tuttu; hesaba giren 81'i de bunlardan.
    - Üreticinin kendi sayfasında iki ad çelişkisi var (Terminator 56/55, U2/UV1205). Kayıtların değeri yok.
    - Not (2026-11-08): arşivde olmayan 6 sayfa (395–400; EFC, HCB, NLP serileri hesapta, 9 kayıt; toplam 12 kayıt). Ürün sahibi sertifika uyarısını geçmemeyi seçti; kabul edilen altı mağazada bu modeller yok. Ürün sahibinin kararıyla değerleriyle kalır: aynı çekimden 160 kayıt arşiv kopyalarıyla hatasız çıktı.
  - Fluval: 87 kayıt, 40'ı hesapta. Cloudflare insan doğrulaması; ürün sayfaları doğrudan istekte 403.
    - Paket 1 ve 2: 58 kayıt arşiv kopyası ya da kılavuzla tuttu.
    - Düzeltilenler: SP4, SP6 ve Plant 3.0'ın (7500 → 6500 K) değerleri, U1'in açıklaması. Hesaba giren 40 kaydın debisi ve hacmi doğrulandı.
    - Okuma tamamlandı, Nano bulgusu kapandı (2026-11-08): kalan 22 kayıt üreticinin sayfasında okundu. AquaClear'ın gücü tuttu, debisi ürün sayfasının değerine döndü (AC30 568, AC70 1136, AC110 1892 L/saat). Yüzey süpürücülerin açıklaması sayfaya göre yazıldı ("motorsuz" sayfada yok), AC20/30/50 kendi sayfasına bağlandı. 4.0 nesli LED'lerin yayımlanan sayıları tuttu; Reef 4.0 seri sayfasına bağlandı, lümen ve renk sıcaklığı eklendi. 87 kaydın hepsi okundu. Plant 4.0 Nano ve Reef 4.0 Nano: sayfadaki 'Size Range 11.5–20 cm' neyin ölçüsü olduğunu söylemiyor (ışık 15,25 cm kare); akvaryum uzunluğu olarak kullanılmaz, alan ve açıklama parçası kaldırıldı (Codex kontrolü).
  - Haqos: ana kaynağı www.haqos.com olan 38 kayıt; oturumdan önce 14'ü hesap değeri taşıyordu, 2026-11-08 çekme işleminden sonra yalnız Thermo-Sprite (1 kayıt) taşıyor. Sertifika başka bir adrese ait. Ürün açıklamaları resim; resimlerin arşivde kopyası yok, görsel sunucusu açılmıyor.
    - Kapandı (2026-11-08): ürün sahibi sertifika uyarısını geçmemeyi seçti; kabul edilen altı mağazada bu modeller yok. Ürün sahibinin kararıyla www.haqos.com'a dayanan, hiç doğrulanamamış değerler çekildi: 15 kayıt (6 filtre, 7 ısıtıcı, 2 UV) doğrulanamayanlar listesinde, kayıtlar adıyla kalır. HEC-600'ün debisi (520 L/saat) Malawi İzmir'in ürün sayfasında doğrulandı; mağazaların farklı yazdığı su seviyesi açıklamadan çıktı. Thermo-Sprite'ın 15 W'ı 2026-09-06'da Betta'nın ürün sayfasında doğrulanmıştı; sayfa bugün 404 ve arşivde yok, değer o tarihteki doğrulamayla kalır. Sayısal değeri olmayan 21 kayıt değişmedi.
- **Kabul edilmeyen kaynak (kapandı, 2026-11-04):** Trendyol'a bağlı 24 kayıt vardı; hiçbiri hesaba giren değer taşımıyordu. Kabul edilen beş mağazada (Akvaryum Express, Atakan, Malawi İzmir, Aquarubi, Betta) aranıp bulunamayan 23'ü (22 Shark armatürü, Meç Turbo Pipo) doğrulanamayanlar listesine girdi: kayıt adıyla kalır, Trendyol'dan gelen lümen, akvaryum uzunluğu ve gövde ölçüsü çekilir, açıklama "değerler doğrulanamadı" der. RS-605 zaten listedeydi. Cikletist'te de (2026-11-08, ürün sahibiyle) Shark armatürleri, RS-605 ve Meç Turbo Pipo yok; değerler çekili kalır (`docs/CATALOG_LOG.md` → "2026-11-04 Trendyol'a bağlı ekipman" ve "2026-11-08 Ürün sahibiyle Chrome oturumu"). Katalog akışı testi Trendyol'a bağlı yeni bir değerin eklenmesini engelliyor.

## 2026-11-14 Katalog denetimi: açık kalanlar (Claude, veri sprinti E1)

Tatlı su ve acı su kayıtlarının (437) kaynak sayfaları yeniden açıldı; ayrıntı `docs/CATALOG_LOG.md` → "2026-11-14 Katalog denetimi". Burada yalnız kapanmayanlar var.

- **Hacmi kaynaksız kalan 54 kayıt:** hacim yayımlayan kabul edilen bir kaynağa (Seriously Fish, Practical Fishkeeping, Fishipedia, wirbellose.de, OATA, Welsfans, Goodeid WG, Parosphromenus Project) bağlı değiller; kayıttaki hacim korunur, kaynaklı değildir. Okuyucular bu kayıtlarda türe özgü hacim bulamadı. OATA'nın grup kartları (kedi balıkları 80 L, Amerika cikletleri 120/300 L, gökkuşağı 45 L, killi 40 L, kurbağa ve salyangozlarda 10 L) yalnız alt sınır verdiği ve kayıttaki değerler bu sınırın üstünde olduğu için kayda bağlanmadı (genel rehber iri türün değerini düşürmek için kullanılmaz, `docs/DATA_SOURCES.md`). Kayıtlar: `sparkling-limia`, `cochus-blue-tetra`, `rubicundus-lipstick-goby`, `redhead-tapajos`, `tropheus-kiriza`, `teardrop-guianacara`, `owroewefi-guianacara`, `malayan-river-sole`, `selheims-freshwater-sole`, `kners-yellow-flagtail`, `red-neon-blue-eye`, `parkinsons-rainbowfish`, `bluefin-notho`, `normans-lampeye`, `snakeskin-gourami`, `royal-farlowella`, `ninja-woodcat`, `clown-pleco`, `south-american-bumblebee-catfish`, `skunk-cory`, `orange-seam-pleco-l106`, `colombian-zebra-pleco-l129`, `orinoco-angel-pleco-l201`, `royal-pleco-l190`, `mega-clown-pleco-l340`, `vampire-pleco-l240`, `butterfly-pleco-l052`, `cucuta-bristlenose-l149`, `brokenline-royal-pleco-l191`, `black-spotted-flyer-pleco-l244`, `blue-spotted-bristlenose-l059a`, `anthrax-flyer-pleco-l235`, `lujans-pleco-l127`, `peckoltia-l103`, `manacapuru-bristlenose-l148`, `ucayali-flathead-pleco`, `green-laser-cory-cw009`, `highfin-spotted-cory-cw027`, `delhezi-bichir`, `red-tailed-snakehead`, `half-banded-spiny-eel`, `pink-lipped-moray`, `african-arowana`, `rainbow-shiner`, `spotted-congo-puffer`, `sun-nerite-snail`, `turbo-snail`, `tiger-nerite-snail`, `mini-tiger-nerite-snail`, `mini-nerite-snail`, `batik-nerite-snail`, `batman-nerite-snail`, `red-clawed-crayfish`, `african-dwarf-frog`.
- **Ana kaynağı kabul listesinde olmayan kayıtlar:** `tropheus-kiriza` (zoopet; Fishipedia taslağı bozuk, Seriously Fish sayfası yok), `cucuta-bristlenose-l149` (plantedaquaria; hiçbir kabul edilen kaynak açılmadı), `manacapuru-bristlenose-l148` (suedamerikafans.de; Welsfans ile aynı yayıncı olup olmadığı doğrulanmadı), yedi nerit satış adı ve turbo salyangoz (aquarubi.com, mağaza). Hayalet karides ve ramshorn salyangozun ana kaynağı OATA'nın karides ve salyangoz kartıdır (genel rehber); kartın 10 L'si kayıttaki hacimden küçük, değer korundu, türe özgü kaynak yok.
- **Rakip uygulama ve içerik sitelerine dayanan değerler:** 28 kayıttan 30 bağlantı çıkarıldı (tankbud.com 21, aquairi.app 4, guidarium.com 3, app-aquatic.com 2). Değeri yalnız bunlara dayanan alan bulunan tek kayıt Sparkling Limia'ydı (TankBud 22–28 °C, pH 7,2–8,5); Fishkeeper'ın 24–30 °C ve pH 7,5–8,5'i ile değiştirildi. Öbür kayıtlarda kabul edilen kaynağın vermediği alanlar (çoğunlukla hacim ve uzunluk) yukarıdaki listede ve günlükteki "uygulanmayanlar" bölümünde.
- **Lider kararı bekleyen büyük farklar:** boyu %35'ten fazla değişecek 21 alan, hacmi ya da uzunluğu %30'dan fazla küçülecek 10 alan ve kaynakların ortak aralığı boş ya da çok dar çıkan 6 sıcaklık/pH alanı uygulanmadı; liste günlükte.

## Sıcaklığı ve pH'ı kabul edilen kaynakta olmayan bitkiler (2026-11-14, veri sprinti tur 2, geliştirilecek)

Değerli 146 bitkinin 82'sinde sıcaklık, 79'unda pH var (152 kaydın %53,9'u ve %52,0'si; altı kayıt yalnız uyarı kaydı, karar 0026). 2026-11-14'te bu iki alan için kabul edilen bütün kaynaklar yeniden tarandı; yeni değer bulunamadı, kayıtlar değişmedi. Ayrıntı `docs/CATALOG_LOG.md` → "2026-11-14 Bitkilerde sıcaklık ve pH taraması".

- **Neden boş:** bu kayıtların hepsi Tropica'ya dayanıyor ve Tropica sıcaklık ve pH yayımlamıyor (2026-11-14'te yeniden doğrulandı). Fishkeeper'ın bitki bilgi bankasında sayfaları yok (liste bugün de 71 bitki; site haritasında 2026-10-25'ten beri yeni bitki sayfası yok). Practical Fishkeeping'in tür kutularında yoklar (2026-10-29 taraması; o günden beri yayımlanan yazıların hiçbiri sıcaklık ve pH kutusu taşımıyor). Resmî ve üniversite kaynaklarında (OATA'nın bitkili akvaryum rehberi, UF/IFAS) türe özgü akvaryum aralığı yok.
- **Sıcaklık ve pH ikisi de boş (64):** `ammannia-crassicaulis`, `alternanthera-reineckii-mini`, `alternanthera-reineckii-rosanervig`, `anubias-barteri-mini-coin`, `anubias-barteri-var-caladiifolia`, `anubias-gracilis`, `anubias-barteri-var-glabra`, `bacopa-australis`, `bacopa-salzmannii-purple`, `blyxa-japonica`, `bucephalandra-diabolica-kedagang`, `bucephalandra-pygmaea-bukit-kelam`, `cryptocoryne-nurii-rose-maiden`, `cryptocoryne-wendtii-mi-oya`, `cryptocoryne-wendtii-tropica`, `echinodorus-red-diamond`, `echinodorus-reni`, `echinodorus-rose`, `eleocharis-acicularis`, `eleocharis-montevidensis`, `eleocharis-pusilla-mini`, `eriocaulon-cinereum`, `eriocaulon-vietnam`, `gratiola-viscidula`, `helanthium-bolivianum-quadricostatus`, `hydrocotyle-tripartita-japan`, `hygrophila-corymbosa`, `hygrophila-corymbosa-stricta`, `hygrophila-corymbosa-compact`, `hygrophila-difformis`, `hygrophila-lancea-araguaia`, `hygrophila-odora`, `hygrophila-pinnatifida`, `lagenandra-meeboldii-red`, `leptodictyum-riparium`, `limnobium-laevigatum`, `limnophila-aquatica`, `limnophila-hippuridoides`, `lindernia-rotundifolia-variegated`, `littorella-uniflora`, `lobelia-cardinalis`, `marsilea-minuta`, `micranthemum-glomeratum`, `micranthemum-tweediei-monte-carlo`, `myriophyllum-mattogrossense`, `myriophyllum-guyana`, `phyllanthus-fluitans`, `pogostemon-deccanensis`, `proserpinaca-palustris-cuba`, `ranunculus-inundatus`, `riccardia-chamedryfolia`, `rotala-indica-bonsai`, `rotala-rotundifolia`, `rotala-rotundifolia-blood-red`, `rotala-rotundifolia-hra`, `rotala-wallichii`, `sagittaria-subulata`, `sagittaria-subulata-needle-leaf`, `schismatoglottis-prietoi`, `taxiphyllum-spiky-moss`, `taxiphyllum-flame-moss`, `utricularia-graminifolia`, `vesicularia-ferriei-weeping-moss`, `hydrocotyle-verticillata`.
- **Yalnız pH boş (3):** `anubias-heterophylla` (Fishkeeper yalnız sıcaklık yazıyor), `eleocharis-parvula` ve `marsilea-hirsuta` (Practical Fishkeeping'in yanıtı yalnız sıcaklık veriyor).
- **Ürün sahibinin kararı (2026-11-14):** "boş kalır, kartta 'Kaynak yayımlamıyor' yazar". Kaynağı olmayan sıcaklık ve pH uydurulmaz ve tahmin edilmez; bitki kartı boş alanı "Kaynak yayımlamıyor" (İngilizce "Not published by the source", İspanyolca "La fuente no la publica" / "no lo publica"), yalnız uyarı kaydında "Kaynakta yok" diye gösterir (`src/components/plant-catalog.tsx`). Aşağıdaki maddeler yeni bir kaynak kararı gelirse yeniden açılır.
- **Lider kararı bekleyen (uygulanmadı):**
  - *Micranthemum tweediei* 'Monte Carlo': Fishkeeper'da `https://www.fishkeeper.co.uk/fish/Micranthemum-Monte-Carlo` sayfası var ("Plant Advice"; "Temperature 18-24", pH yok, "Height 6 cm", "Moderate Light", "Origin Eurasia"). Sayfa bilgi bankasının listesinden bağlanmıyor, bilgi bankası sayfalarının kalıp metnini taşımıyor; değerleri Fishkeeper'ın AquaFleur ürün sayfasıyla (`aquafleur-tropical-aquarium-plant-micranthemum-monte-carlo-5cm-pot`) birebir aynı ve menşe satırı yanlış (Tropica "South America"). Tedarikçinin ürün verisi olduğu için kullanılmadı. Kabul edilirse sıcaklık 18–24 °C olur, boy kaynakların büyüğüyle 5 → 6 cm; 24 °C üst sınırı 25–26 °C'lik akvaryumda uyarı verir.
  - Fishkeeper'ın AquaFleur ürün sayfaları (site haritasında 39 adres, açılan 38 sayfanın 24'ünde tablo): yalnız sıcaklık veriyor, pH yok; çok farklı cinslerde aynı aralık (22–28 °C on bir bitkide, 20–28 °C yedi bitkide). Kuraldaki "farklı cinsleri tek değerle anlatan satıcı ve ürün yazıları" kapsamında; kullanılmadı. Katalogdaki boş kayıtlardan karşılığı olanlar: *A. reineckii* 'Mini' 22–28, *Lobelia cardinalis* 20–28, *Lagenandra meeboldii* 'Red' 22–28, *Rotala* 'Blood Red' 22–28, *Eleocharis acicularis* 22–28 °C.
  - Hedef (%85) bu kaynaklarla tutmuyor: 152 kaydın %85'i için 48 sıcaklık ve 51 pH daha gerekir. Yol yeni bir kaynak kararı ister (ürün sahibinde). Adaylar: Christel Kasselmann'ın bitki başvuru kitabı ("Aquarienpflanzen" / "Aquarium Plants"; türe göre sıcaklık verir, çevrimiçi değil, kitaptan okunmalı) ya da satıcı olmayan bir uzman veri tabanı. Flowgrow (sahibi satıcı; bazı değerler bütün bitkilerde aynı), Aquasabi ve hobi siteleri kural gereği kabul edilmiyor.

## Hacmi hâlâ kaynaksız tatlı su canlıları (2026-11-14, veri sprinti tur 2, geliştirilecek)

Tur 2'de hacmi kaynaksız kayıtlar Seriously Fish (yeni site haritası), Fishipedia'nın dört dil site haritası, Practical Fishkeeping'in site haritası, ScotCat, Welsfans, wirbellose.de ve OATA'nın tatlı su bakım kartlarıyla yeniden arandı; ayrıntı `docs/CATALOG_LOG.md` → "2026-11-14 Tur 2: kaynaksız hacim". Bu bölüm yukarıdaki "Hacmi kaynaksız kalan 54 kayıt" maddesinin yerine geçer. Kayıttaki değerler korunur.

- **Hiçbir kabul edilen kaynakta türe ya da cinse özgü hacim yok (25):** `sparkling-limia`, `rubicundus-lipstick-goby`, `tropheus-kiriza`, `teardrop-guianacara`, `owroewefi-guianacara`, `malayan-river-sole`, `selheims-freshwater-sole`, `kners-yellow-flagtail`, `parkinsons-rainbowfish`, `royal-farlowella`, `south-american-bumblebee-catfish`, `colombian-zebra-pleco-l129`, `orinoco-angel-pleco-l201`, `vampire-pleco-l240`, `black-spotted-flyer-pleco-l244`, `anthrax-flyer-pleco-l235`, `lujans-pleco-l127`, `peckoltia-l103`, `green-laser-cory-cw009`, `highfin-spotted-cory-cw027`, `red-tailed-snakehead`, `half-banded-spiny-eel`, `african-arowana`, `spotted-congo-puffer`, `african-dwarf-frog`. Welsfans ve ScotCat bu kedi balıklarında yalnız akvaryum uzunluğu yazıyor; OATA'nın kedi balığı (80 L), Amerika cikleti (120/300 L), gökkuşağı (45/120 L) ve killi (40/90 L) kartları kayıttaki değerden küçük ve genel rehber iri türün değerini düşürmek için kullanılmaz (`docs/DATA_SOURCES.md`).
- **Kaynağı bağlı ama hacmi lider kararı bekleyen (3):** `orange-seam-pleco-l106` (Seriously Fish 120 × 30 cm/~108 L, kayıt 180 L; %40 küçülme), `snakeskin-gourami` (Seriously Fish ~108 L, kayıt 300 L; %64), `manacapuru-bristlenose-l148` (Practical Fishkeeping'in *Ancistrus* yazısı 60 × 30 × 30 cm/54 L tek balık ya da çift, OATA tabanı 80 L, kayıt 120 L; %33). `ninja-woodcat` (*Tatia musaica*) hacmi açıkta kalır: kayıttaki 60 × 30 × 30 cm tabanının (54 L, eski not 56 L yazıyordu) tek kaynağı Aquarismo Paulista; bu site 2026-11-11 günlüğünden beri kabul edilen kaynak sayılmıyor (Fishkeeper ölçü yazmıyor, Fishipedia taslağı 1 birey/50 L ile zorunlu grubu çelişiyor). Değer korunur, kaynaklı değildir. Kırmızı kıskaçlı kerevitin 250 L'si de kaynaksız: wirbellose.de yalnız "ab 1m" (uzunluk) yazıyor, OATA'nın kerevit kartı hacim vermiyor, Seriously Fish ve Fishipedia'da tür yok.
- **Kimlik ya da kapsam yüzünden kullanılmayan sayfalar:** Red Head Tapajos için Seriously Fish *Geophagus* sp. 'orange head' (180 × 60 cm/~648 L, grup için) ve Fishipedia'nın 'Tapajos Orange Head' taslağı (500 L) sayfada *G. pyrocephalus* ya da "red head" adını yazmıyor; L240 için Seriously Fish'in *L. galaxias* sayfası L240'ı ayrı bir "cf. galaxias" biçimi sayıyor (~243 L); L201 için *H. inspector* (Seriously Fish'te L102) ve *H. contradens* (Fishipedia) sayfaları L201'i anmıyor; Kiriza için Fishipedia taslağı bozuk (8–23 °C), Seriously Fish yalnız *T. moorii*'nin tek bireyini veriyor; Skunk için Seriously Fish *Brochis arcuata* sayfası hacim yazmıyor ve kimlik farklı.
- **Taslak ya da büyük değişiklik yüzünden bekletilen (lider kararı):** Fishipedia'nın *Monodactylus argenteus* (280 L, kayıt 600 L) ve *Scatophagus argus* (280 L, kayıt 680 L) taslakları acı su kayıtlarında %50'den fazla küçültüyor; uygulanmadı. Koi için Fishipedia'nın tamamlanmış Fransızca sayfası kutuda 6.000 L, metinde 5.000 L yazıyor (sayfa içinde çelişki); hacim OATA'nın 4.500 L'si kaldı. Japon balığında Fishipedia'nın 200 L'si beş balık içindir, kayıt OATA'nın "ilk balık 100 L + her ek balık 50 L" düzenini kullanıyor; uygulanmadı.
- **PRL karides sıcaklığı (tek noktaya inen ortak aralık):** Fishkeeper 18–25, Horvath (Practical Fishkeeping, bee ve melezleri) 18–23, Lukhaup (Practical Fishkeeping, King Kong ve benzeri Taiwan Bee hatları, tutma) 17–22 ve wirbellose.de (Crystal Red) "ca. 22–25 °C" ortak aralığı yalnız 22 °C. Bağımsız ölçümün 22–23 °C'si Lukhaup'u dışarıda bırakıyor; katalog PRL'yi Ekim kararında Taiwan Bee hatlarıyla birlikte saydı. Kural gelene kadar 18–22 °C kalır (yukarıdaki "Sıcaklık ortak aralığı tek noktaya inen canlılar" ile aynı soru). Aynı kaynaklara bağlı 17 *C. cantonensis* kaydı aynı durumda.
- **Davranış:** Mercan kırmızısı kalem balığında Seriously Fish "in confined quarters serious injury or even death can occur" ve "when kept in larger groups any aggression is spread" diyor; bugünkü bayraklar bunu anlatmıyor (mermer baltabalığıyla aynı durum). Bakım notu riski yazıyor; davranış kaydı önerisi lidere iletildi.
- **Ölçüm notu:** bağımsız ölçüm "hacim yayımlayan kaynak" olarak yalnız Seriously Fish, Fishipedia ve Practical Fishkeeping adreslerini sayıyor (bugün 68 kayıt, 49'u tatlı su). `docs/DATA_SOURCES.md`'nin kabul ettiği wirbellose.de, OATA, Goodeid WG ve Fishkeeper'ın yayımladığı ölçüler de sayılınca kaynak bağlantısı olmayan 28 kayıt (27'si tatlı su) kalıyor; hacmi gerçekten kaynaksız tatlı su kaydı yukarıdaki 25 + 3 + kerevit = 29.
