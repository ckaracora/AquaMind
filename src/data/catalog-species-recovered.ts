import type { SpeciesProfile } from "./catalog-species";

// Güncel main ile eski katalog dalı kaynak tarihi karşılaştırılarak seçildi:
// yalnız eski dalda bulunan kayıtlar ve eski dalda doğrulama tarihi daha yeni olan kayıtlar.
const recoveredSpeciesCandidates: SpeciesProfile[] = [
  {
    "id": "rummy-nose",
    "commonName": "Bleher kırmızı burun tetra",
    "scientificName": "Petitella bleheri",
    "aliases": [
      "Hemigrammus bleheri",
      "Firehead Tetra",
      "Brilliant Rummy-nose Tetra",
      "Bleher's Rummy-nose Tetra"
    ],
    "category": "fish",
    "group": "tetra",
    "waterTypes": [
      "freshwater"
    ],
    "adultSizeCm": 5,
    "minVolumeL": 120,
    "minTankLengthCm": 90,
    "minGroup": 10,
    "temperature": [
      23,
      26
    ],
    "ph": [
      5.5,
      7
    ],
    "wasteFactor": 0.75,
    "communityCaution": "Çok barışçıl fakat hareketli bir sürü balığıdır; en az 10 birey tutulmalı ve iri, saldırgan ya da yem rekabetinde baskın türlerle eşleştirilmemelidir. Petitella rhodostoma ve Petitella georgiae ile görünüşü karışabildiğinden genel Kırmızı Burun veya Rummy-nose satış adı tek başına kesin tür kanıtı değildir.",
    "husbandryCaution": "FishBase güncel bilimsel adı Petitella bleheri, eski adı Hemigrammus bleheri ve 3,6 cm standart boy yayımlar; Seriously Fish akvaryumda yaklaşık 5 cm standart boy, en az 10 birey, 90 cm cephe, 23–26 °C ve pH 5,5–7,0 verir. Fishipedia en az 120 litre yayımladığı için sağlık analizinde 120 litre/90 cm birlikte kullanılır. Olgun, kararlı ve temiz su; loş ışık, kum, kök/dal, yaprak örtüsü ve açık yüzme alanı gerekir. Elverişsiz koşullarda baş rengi solar; haftalık kısmi su değişimi zorunludur. Kaynaklar genel bakım için tek bir akıntı sınıfı yayımlamadığından akıntı değeri tahmin edilmez.",
    "sourceUrl": "https://www.seriouslyfish.com/species/hemigrammus-bleheri/",
    "additionalSourceUrls": [
      "https://www.fishbase.se/summary/Hemigrammus-bleheri.html",
      "https://www.fishipedia.it/pesci/hemigrammus-bleheri"
    ],
    "verifiedAt": "2026-10-09"
  },
  {
    "id": "green-fire-tetra",
    "commonName": "Yeşil ateş tetra",
    "scientificName": "Aphyocharax rathbuni",
    "category": "fish",
    "group": "tetra",
    "adultSizeCm": 7.1,
    "minVolumeL": 54,
    "minTankLengthCm": 60,
    "minGroup": 6,
    "temperature": [
      20,
      26
    ],
    "ph": [
      6.5,
      7.5
    ],
    "flow": "medium",
    "wasteFactor": 0.8,
    "aliases": [
      "Green Fire Tetra",
      "Red Belly Tetra",
      "Red-bellied Tetra",
      "Red Belly Bloodfin",
      "Rathbun's Bloodfin",
      "Redflank Bloodfin",
      "Rubinsalmler",
      "Aphyocharax stramineus",
      "Piabarchus stramineus",
      "YEŞİL ATEŞ TETRA APHYOCARAX RATHBUNİ"
    ],
    "waterTypes": [
      "freshwater"
    ],
    "communityCaution": "Hareketli ve yüzgeç ısırmaya eğilimli bir sürü balığıdır. En az altılı grup gerekir; çok yavaş, ürkek veya uzun yüzgeçli balıklar yerine benzer boyda, sağlam ve hızlı yüzen tank arkadaşları seçilmelidir.",
    "husbandryCaution": "En az 60 × 30 cm taban ve yaklaşık 54 litre hacim, en az altılı sürü, uzun açık yüzme alanı ile bitkili ve gölgeli kenarlar gerekir. Seriously Fish akvaryum balıkları için 4,5 cm standart boy bildirirken FishBase doğadaki azami standart boyu 7,1 cm verir; biyolojik yük hesabında güvenli tarafta kalmak için bilimsel azami boy korunmuştur. 20–26 °C, pH 6,5–7,5 ve kararlı temiz tatlı su sağlanmalı; orta ve dağıtılmış akıntı kullanılmalıdır. Kaliteli kuru yemler küçük canlı veya dondurulmuş yemlerle düzenli olarak çeşitlendirilmelidir. Paraguay, Paraná ve Uruguay drenajlarının yüzen ya da kıyı üstü bitkilerle gölgelenen akarsu kesimlerinden gelir. Aphyocharax stramineus ve Piabarchus stramineus eski eş adlardır. Red Belly Tetra/Red Belly Bloodfin adı resmî balıkçılık listesi ve birden fazla güncel ihracat stok listesinde bu türe bağlanır; kırmızı sırtlı Hyphessobrycon pyrrhonotus ise ayrı Flame-back Bleeding Heart Tetra türüdür.",
    "sourceUrl": "https://www.seriouslyfish.com/species/aphyocharax-rathbuni",
    "additionalSourceUrls": [
      "https://www.fishbase.se/summary/aphyocharax-rathbuni.html",
      "https://www.fishbase.se/Nomenclature/12340",
      "https://www4.fisheries.go.th/local/file_document/20180808152413_1_file.pdf",
      "https://www.indopisces.com/stocklist",
      "https://www.fisch.importstation.de/id6fresh.htm",
      "https://www.cikletistpetshop.com/red-belly-tetra"
    ],
    "verifiedAt": "2026-10-05"
  },
  {
    "id": "flameback-bleeding-heart-tetra",
    "commonName": "Alev sırtlı kanayan kalp tetra",
    "scientificName": "Hyphessobrycon pyrrhonotus",
    "category": "fish",
    "group": "tetra",
    "adultSizeCm": 4.5,
    "minVolumeL": 100,
    "minTankLengthCm": 100,
    "minGroup": 10,
    "temperature": [
      20,
      28
    ],
    "ph": [
      4,
      7
    ],
    "flow": "medium",
    "wasteFactor": 0.7,
    "aliases": [
      "Flame-back Bleeding Heart Tetra",
      "Flameback Bleeding Heart Tetra",
      "Red-back Bleeding Heart Tetra"
    ],
    "speciesOnly": true,
    "communityCaution": "Barışçıl bir sürü balığıdır; en az onlu grup halinde, benzer boydaki sakin türlerle tutulmalıdır. İri balık ve kabuklular için kolay av olabilir; erişkin erkekler kendi aralarında sınırlı bölge davranışı gösterebilir.",
    "husbandryCaution": "En az 100 litre ve 100 cm cephe, olgun biyolojik filtre, çok temiz su, haftalık bakım, bitkili ve gölgeli kenarlar ile açık yüzme alanı gerekir. Güvenilir tür kaynakları bu canlıyı Flame-back Bleeding Heart Tetra olarak adlandırır; Red Belly Tetra/Red Belly Bloodfin adı Aphyocharax rathbuni'ye aittir. Yalnız bilimsel kimliği Hyphessobrycon pyrrhonotus olarak doğrulanan canlılar bu profile eklenmelidir.",
    "sourceUrl": "https://www.seriouslyfish.com/species/hyphessobrycon-pyrrhonotus",
    "additionalSourceUrls": [
      "https://www.fishbase.se/summary/Hyphessobrycon-pyrrhonotus.html",
      "https://www.fishi-pedia.com/fishes/hyphessobrycon-pyrrhonotus"
    ],
    "verifiedAt": "2026-10-05"
  },
  {
    "id": "blue-neon-goby-atropurpureus",
    "commonName": "Filipin mavi neon gobisi",
    "scientificName": "Stiphodon atropurpureus",
    "category": "fish",
    "group": "goby",
    "adultSizeCm": 5,
    "minVolumeL": 54,
    "minTankLengthCm": 60,
    "minGroup": 3,
    "temperature": [
      22,
      26
    ],
    "ph": [
      6.5,
      7.5
    ],
    "flow": "high",
    "wasteFactor": 0.5,
    "aliases": [
      "Stiphodon atropurpureus"
    ],
    "communityCaution": "Barışçıldır; yalnız benzer boyda, iyi oksijenlenmiş akarsuları seven ve yem rekabetinde baskın olmayan türlerle tutulmalıdır. Erkekler gevşek bölge savunabilir; bir erkek ve en az iki dişilik düzen daha güvenlidir.",
    "husbandryCaution": "En az 60 × 30 cm tabanlı, tamamen olgunlaşmış akarsu akvaryumu; saatte yaklaşık 10–15 kat çevrim, yüksek oksijen, yosun ve biyofilm kaplı taşlar, güçlü aydınlatma, haftalık %30–50 su değişimi ve boşluksuz kapak gerekir. Tür zorunlu biyofilm/aufwuchs otlayıcısıdır; yeni, çıplak veya aşırı temizlenmiş akvaryumda ek yem verilse bile aç kalabilir. Deniz larva evresi nedeniyle ticaretteki bireyler yabani kökenlidir ve sorumlu kaynaktan alınmalıdır. Blue Neon Goby ticari adı başka Stiphodon türleri için de kullanıldığından yalnız bilimsel kimliği doğrulanan canlılar bu profile eklenmelidir.",
    "sourceUrl": "https://www.seriouslyfish.com/species/stiphodon-atropurpureus/",
    "additionalSourceUrls": [
      "https://www.fishbase.se/identification/SpeciesList.php?genus=Stiphodon",
      "https://www.aquaristatlas.com/gobies/stiphodon-atropurpureus/"
    ],
    "verifiedAt": "2026-10-08"
  },
  {
    "id": "cobalt-blue-goby-semoni",
    "commonName": "Kobalt mavi gobi",
    "scientificName": "Stiphodon semoni",
    "category": "fish",
    "group": "goby",
    "adultSizeCm": 5,
    "minVolumeL": 54,
    "minTankLengthCm": 60,
    "minGroup": 3,
    "temperature": [
      22,
      28
    ],
    "ph": [
      6.5,
      7.5
    ],
    "flow": "high",
    "wasteFactor": 0.5,
    "aliases": [
      "Cobalt Blue Goby",
      "Semon's Goby",
      "Stiphodon semoni"
    ],
    "communityCaution": "Barışçıldır; yalnız benzer boyda, iyi oksijenlenmiş akarsuları seven ve yem rekabetinde baskın olmayan türlerle tutulmalıdır. Erkekler gevşek bölge savunabilir; bir erkek ve en az iki dişilik düzen daha güvenlidir.",
    "husbandryCaution": "En az 60 × 30 cm tabanlı, tamamen olgunlaşmış akarsu akvaryumu; saatte yaklaşık 10–15 kat çevrim, yüksek oksijen, yosun ve biyofilm kaplı taşlar, güçlü aydınlatma, haftalık %30–50 su değişimi ve boşluksuz kapak gerekir. Tür biyofilm ve bentik alg otlayıcısıdır; olgun yüzeyler ve sürekli doğal yem kaynağı yoksa zayıflayabilir. Deniz larva evresi nedeniyle ticaretteki bireyler yabani kökenlidir ve sorumlu kaynaktan alınmalıdır. Ticarette S. elegans, S. atropurpureus, Sumatran Blue Neon ve başka adlarla karıştırılabildiğinden bilimsel kimlik doğrulanmalıdır.",
    "sourceUrl": "https://www.seriouslyfish.com/species/stiphodon-semoni/",
    "additionalSourceUrls": [
      "https://www.fishbase.se/summary/Stiphodon_semoni.html",
      "https://ejournal-balitbang.kkp.go.id/index.php/jppi/article/download/13663/9532"
    ],
    "verifiedAt": "2026-10-08"
  },
  {
    "id": "panda-garra",
    "commonName": "Panda garra",
    "scientificName": "Garra flavatra",
    "category": "fish",
    "group": "bottom",
    "adultSizeCm": 9,
    "minVolumeL": 81,
    "minTankLengthCm": 90,
    "minGroup": 3,
    "temperature": [
      22,
      27
    ],
    "ph": [
      6.5,
      7.5
    ],
    "flow": "high",
    "wasteFactor": 0.9,
    "aliases": [
      "Panda Garra",
      "Rainbow Garra",
      "Clown Garra",
      "Banded Butterfly Garra"
    ],
    "communityCaution": "Genellikle barışçıldır; tek tutulduğunda benzer biçimli dip balıklarına daha bölgeci davranabilir. En az üçlü grupta hiyerarşi davranışı görülebileceği için yeterli taban alanı, taş ve görüş bariyeri sağlanmalıdır.",
    "husbandryCaution": "En az 90 × 30 cm taban ve yaklaşık 81 litre, olgun biyolojik filtre, saatte 10 kattan yüksek çevrim, çok temiz ve oksijenli su, biyofilmli taşlar, parlak aydınlatma ve boşluksuz kapak gerekir. Yalnız yosunla beslenmez; bitkisel içerikli yemlerle birlikte ölçülü proteinli yem sunulmalıdır. Panda Garra adı Garra flavatra içindir; ayrı Garra rufa türü veya bilimsel kimlik vermeyen birleşik Garrarufa satış adı bu profile otomatik bağlanmamalıdır.",
    "sourceUrl": "https://www.seriouslyfish.com/species/garra-flavatra",
    "additionalSourceUrls": [
      "https://www.fishbase.se/summary/Garra_flavatra.html",
      "https://www.practicalfishkeeping.co.uk/features/panda-garra-garra-flavatra/",
      "https://www.dof.gov.mm/my/file-download/download/public/114"
    ],
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "silver-scat",
    "commonName": "Gümüş argus / Silver scat",
    "scientificName": "Selenotoca multifasciata",
    "category": "fish",
    "group": "other",
    "adultSizeCm": 40,
    "minVolumeL": 600,
    "minTankLengthCm": 244,
    "minGroup": 6,
    "temperature": [
      20,
      28
    ],
    "ph": [
      7.5,
      8.5
    ],
    "flow": "high",
    "wasteFactor": 3.5,
    "aliases": [
      "Silver Scat",
      "Spotbanded Scat",
      "Spot-banded Scat",
      "Striped Scat",
      "Banded Scat",
      "Scatophagus multifasciatus"
    ],
    "waterTypes": [
      "brackish",
      "saltwater"
    ],
    "specificGravity": [
      1.005,
      1.026
    ],
    "speciesOnly": true,
    "communityCaution": "En az altılı sürü hâlinde tutulmalı ve tüm grup aynı anda eklenmelidir. Yalnız aynı sert-alkali, acı su/deniz suyu gereksinimini paylaşan iri türlerle düşünülmelidir. Zehirli sırt dikenleri ağrılı yaralanmaya yol açabildiğinden elleme ve bakım sırasında koruyucu önlem gerekir.",
    "husbandryCaution": "FishBase 40 cm standart boy ve 20–28 °C; OATA altılı grup için en az 600 litre, pH 7,5–8,5, güçlü akıntı ve yüksek çözünmüş oksijen yayımlar. Fishkeeper erişkin grup için yaklaşık 8 × 2 × 2 ft akvaryum, yani 8 ft'nin doğrudan birim dönüşümüyle en az 244 cm cephe önerir; hacim bu ölçülerden türetilmedi. Yavrular acı suda başlayabilse de erişkinler tam deniz koşullarına geçirilmelidir; tuzluluk refraktometre veya hidrometreyle izlenmeli, sıfır amonyak/nitrit ve sık kısmi su değişimi sağlanmalıdır. Bitkisel madde içeren çeşitli omnivor beslenme gerekir ve canlı bitkiler yenebilir. Genel Silver Argus satış adı Scatophagus argus ile karışabildiğinden yalnız bilimsel kimliği Selenotoca multifasciata olarak doğrulanan balık bu profile bağlanmalıdır.",
    "sourceUrl": "https://www.fishbase.se/summary/Selenotoca-multifasciata.html",
    "additionalSourceUrls": [
      "https://ornamentalfish.org/what-we-do/advice-information/care-sheets/brackish-fish/how-to-look-after-monos-scats-archerfish/",
      "https://www.fishkeeper.co.uk/fish/freshwater/brackish-water-fish/silver-scat-",
      "https://fishesofaustralia.net.au/Home/species/2213"
    ],
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "deissners-licorice-gourami",
    "commonName": "Deissner meyan kökü guramisi",
    "scientificName": "Parosphromenus deissneri",
    "category": "fish",
    "group": "labyrinth",
    "adultSizeCm": 4,
    "minVolumeL": 25,
    "minTankLengthCm": 40,
    "minGroup": 2,
    "temperature": [
      22,
      28
    ],
    "ph": [
      3,
      6.5
    ],
    "flow": "low",
    "wasteFactor": 0.45,
    "aliases": [
      "Deissner's Licorice Gourami",
      "Deissner's Liquorice Gourami",
      "Parosphromenus deissneri"
    ],
    "predatory": true,
    "speciesOnly": true,
    "communityCaution": "Yem rekabetinde geri kalan hassas bir mikroavcıdır; tür akvaryumunda uyumlu çift olarak tutulması en güvenli seçenektir. Genel Licorice Gourami adı başka Parosphromenus türlerini de kapsar.",
    "husbandryCaution": "En az 25 litre ve 40 cm uzunluk, biyolojik olarak olgun çok yumuşak ve asidik siyah su, bol humik madde/yaprak, mağara, loş ışık, çok düşük akıntı ve düzenli küçük su değişimleri gerekir. Büyük veya düzensiz su değişimleri yapılmamalı; biyolojik olarak olgunlaşmamış tanka eklenmemelidir. Çoğu kuru yemi reddedebildiği için küçük canlı yemler sunulmalıdır. Gerçek P. deissneri Bangka ve Belitung'a endemiktir, ticarette nadirdir ve başka Parosphromenus türleri bu adla sıkça yanlış etiketlenir; bilimsel kimlik ve köken doğrulanmalıdır.",
    "sourceUrl": "https://parosphromenus-project.org/species/parosphromenus-deissneri/",
    "additionalSourceUrls": [
      "https://www.seriouslyfish.com/species/parosphromenus-deissneri",
      "https://www.fishbase.se/summary/12078",
      "https://parosphromenus-project.org/articles-by-wentian-shi/rediscovery-of-the-sapphire-from-bangka-parosphromenus-deissneri/"
    ],
    "verifiedAt": "2026-10-08"
  },
  {
    "id": "starry-borneo-sucker",
    "commonName": "Yıldızlı Borneo vantuzu",
    "scientificName": "Gastromyzon stellatus",
    "category": "fish",
    "group": "bottom",
    "adultSizeCm": 5.5,
    "minVolumeL": 68,
    "minTankLengthCm": 75,
    "minGroup": 4,
    "temperature": [
      20,
      24
    ],
    "ph": [
      6,
      7.5
    ],
    "flow": "high",
    "wasteFactor": 0.5,
    "aliases": [
      "Starry Borneo Sucker",
      "Spotted Borneo Sucker",
      "Gastromyzon stellatus"
    ],
    "speciesOnly": true,
    "communityCaution": "Barışçıldır fakat yalnız serin, yüksek oksijenli ve hızlı akıntılı suya uyumlu küçük akarsu türleriyle düşünülmelidir. İri, saldırgan, sıcak su isteyen veya yem rekabeti yüksek canlılarla tutulmamalıdır.",
    "husbandryCaution": "En az dörtlü grup için 75 × 30 cm taban ve yaklaşık 68 litre; biyolojik olarak olgun, çok temiz ve yüksek oksijenli akarsu kurulumu, saatte 8–12 tank hacmi dolaşım, biyofilmli düz taşlar, parlak ışık ve boşluksuz kapak gerekir. Sürekli alg ve mikroorganizma otlağı sağlanmalı; yalnız tablet yemle yaşatılması veya zayıf bireylerin yem rekabetine bırakılması beklenmemelidir. G. stellatus, G. zebrinus ile ara desenler gösterebilir ve karma sevkiyatlar çoğu kez yalnız Borneo sucker diye etiketlenir; bu profil sadece bilimsel kimliği doğrulanmış birey içindir.",
    "sourceUrl": "https://www.seriouslyfish.com/species/gastromyzon-stellatus",
    "additionalSourceUrls": [
      "https://www.fishbase.se/summary/Gastromyzon_stellatus.html",
      "https://www.seriouslyfish.com/genus/gastromyzon"
    ],
    "verifiedAt": "2026-10-08"
  },
  {
    "id": "butterfly-loach-beaufortia",
    "commonName": "Çin kelebek loachu",
    "scientificName": "Beaufortia kweichowensis",
    "category": "fish",
    "group": "bottom",
    "adultSizeCm": 7.5,
    "minVolumeL": 54,
    "minTankLengthCm": 60,
    "minGroup": 6,
    "temperature": [
      16,
      24
    ],
    "ph": [
      6.5,
      8
    ],
    "flow": "high",
    "wasteFactor": 0.8,
    "aliases": [
      "Chinese Hillstream Loach",
      "Beaufortia kweichowensis"
    ],
    "communityCaution": "Barışçıl ve sosyal olsa da yalnız serin, güçlü akıntılı ve yüksek oksijenli su isteyen küçük akarsu türleriyle birleştirilmelidir. Sürekli sıcak su isteyen, iri, saldırgan veya yem rekabeti yüksek canlılarla uygun değildir.",
    "husbandryCaution": "En az altılı grup için 60 × 30 cm taban ve yaklaşık 54 litre; biyolojik olarak olgun, çok temiz ve yüksek oksijenli akarsu kurulumu, saatte 8–12 tank hacmi dolaşım, biyofilmli düz taşlar, güçlü aydınlatma ve boşluksuz kapak gerekir. Yalnız kuru/tablet yeme güvenilmemeli; sürekli alg ve mikroorganizma otlağı korunmalıdır. Tür Çin kökenlidir; Butterfly Loach, Hong Kong pleco ve Borneo sucker adları başka Gastromyzontidae türlerine de uygulandığından bu profil yalnız doğrulanmış Beaufortia kweichowensis içindir.",
    "sourceUrl": "https://www.seriouslyfish.com/species/beaufortia-kweichowensis",
    "additionalSourceUrls": [
      "https://www.fishbase.se/summary/Beaufortia-kweichowensis.html",
      "https://www.seriouslyfish.com/genus/beaufortia"
    ],
    "verifiedAt": "2026-10-08"
  },
  {
    "id": "striped-twig-catfish",
    "commonName": "Çizgili dal kedi balığı",
    "scientificName": "Farlowella vittata",
    "category": "fish",
    "group": "bottom",
    "adultSizeCm": 22.5,
    "minVolumeL": 81,
    "minTankLengthCm": 90,
    "minGroup": 1,
    "temperature": [
      24,
      27
    ],
    "ph": [
      6,
      7
    ],
    "flow": "low",
    "wasteFactor": 1.5,
    "aliases": [
      "Striped Twig Catfish",
      "Farlowella vittata"
    ],
    "communityCaution": "Çok sakin ve çekingen olduğu için iri, hareketli veya yem rekabeti yüksek balıklarla tutulmamalıdır. Benzer gereksinimli küçük ve barışçıl türler dışında genel topluluk akvaryumuna uygun değildir.",
    "husbandryCaution": "En az 90 × 30 cm taban ve yaklaşık 81 litre; biyolojik olarak olgun, kusursuz temiz ve iyi oksijenli su, düşük akıntı, kum, bol kök/dal, biyofilm ve düzenli bitkisel ek yem gerekir. Yeni kuruluma eklenmemeli, karın çöküklüğü olan veya karantinası belirsiz birey alınmamalıdır. FishBase 22,5 cm azami standart boy yayımlarken ayrıntılı bakım kaynağı ticaretteki bireyler için 15 cm verir; boy farkı kullanıcıdan saklanmaz, ancak yayımlanan 81 litre/90 cm bakım eşiği tahminle büyütülmez. Genel Colombian Farlowella adı bilimsel kimlik olmadan bu profile bağlanmaz.",
    "sourceUrl": "https://www.seriouslyfish.com/species/farlowella-vittata",
    "additionalSourceUrls": [
      "https://www.fishbase.se/summary/farlowella-vittata.html",
      "https://nas.er.usgs.gov/queries/FactSheet.aspx?speciesID=2879",
      "https://aunap.gov.co/documentos/inspeccion/resoluciones/Res1924De2015.pdf"
    ],
    "verifiedAt": "2026-10-08"
  },
  {
    "id": "hillstream-loach",
    "commonName": "Kelebek vatoz",
    "scientificName": "Sewellia lineolata",
    "category": "fish",
    "group": "bottom",
    "adultSizeCm": 6.5,
    "minVolumeL": 68,
    "minTankLengthCm": 75,
    "minGroup": 6,
    "temperature": [
      20,
      24
    ],
    "ph": [
      6,
      7.5
    ],
    "flow": "high",
    "wasteFactor": 0.9,
    "aliases": [
      "Tiger Hillstream Loach",
      "Reticulated Hillstream Loach",
      "Vietnamese Hillstream Loach",
      "Gold Ring Butterfly Sucker"
    ],
    "communityCaution": "Benzer biçimli daha çekingen Gastromyzon türlerini yem ve bölge rekabetinde baskılayabilir; yalnız serin, yüksek oksijenli ve güçlü akıntılı suya uyumlu küçük akarsu türleriyle düşünülmelidir.",
    "husbandryCaution": "En az altılı grup için 75 × 30 cm taban ve yaklaşık 68 litre; biyolojik olarak olgun, çok temiz ve yüksek oksijenli akarsu kurulumu, saatte 15–20 tank hacmi dolaşım, biyofilmli taşlar, güçlü ışık ve boşluksuz kapak gerekir. Sürekli doğal otlak sağlanmalı, zayıf bireyler yem rekabetine bırakılmamalıdır. Tür Vietnam ve Mekong kökenlidir; genel Butterfly Loach veya Borneo sucker etiketi bilimsel kimlik kanıtı değildir.",
    "sourceUrl": "https://www.seriouslyfish.com/species/sewellia-lineolata",
    "additionalSourceUrls": [
      "https://www.fishbase.se/summary/Sewellia-lineolata.html"
    ],
    "verifiedAt": "2026-10-08"
  },
  {
    "id": "three-lined-cory",
    "commonName": "Three-lined çöpçü (False Julii)",
    "scientificName": "Hoplisoma trilineatum",
    "category": "fish",
    "group": "bottom",
    "adultSizeCm": 6.1,
    "minVolumeL": 75,
    "minTankLengthCm": 60,
    "minGroup": 6,
    "temperature": [
      22,
      26
    ],
    "ph": [
      6,
      8
    ],
    "flow": "medium",
    "wasteFactor": 0.9,
    "aliases": [
      "Three-lined Cory",
      "Threestripe Corydoras",
      "False Julii Cory",
      "Corydoras trilineatus"
    ],
    "communityCaution": "Çok barışçıl ve sosyal bir dip balığıdır; en az altılı kendi türü grubunda, iri veya saldırgan olmayan sakin türlerle tutulmalıdır.",
    "husbandryCaution": "En az 60 cm uzunluk ve koruyucu 75 litre; yumuşak ince kum, gölgeli sığınaklar, temiz ve iyi oksijenli taban, orta akıntı ve düzenli su değişimi gerekir. Artan yüzeye hava almak için erişilebilir su yüzeyi bırakılmalı ve yalnız dipte kalan artıklarla beslenmesi beklenmemelidir. FishBase 6,1 cm azami standart boy, 60 cm akvaryum, 22–26 °C, pH 6,0–8,0 ve en az beşli grup; uzman bakım kaynağı altılı grubu önerir. Ticarette çoğu kez Julii veya Leopard Cory diye yanlış etiketlendiğinden bilimsel kimlik ya da doğrulanmış köken olmadan gerçek Hoplisoma julii profiline bağlanmamalıdır.",
    "sourceUrl": "https://www.seriouslyfish.com/species/hoplisoma-trilineatum",
    "additionalSourceUrls": [
      "https://www.fishbase.se/summary/Corydoras-trilineatus.html",
      "https://www.fishkeeper.co.uk/fish/freshwater/catfish/false-julii-cory-"
    ],
    "verifiedAt": "2026-10-08"
  },
  {
    "id": "true-julii-cory",
    "commonName": "Gerçek Julii çöpçü",
    "scientificName": "Hoplisoma julii",
    "category": "fish",
    "group": "bottom",
    "adultSizeCm": 5.5,
    "minVolumeL": 81,
    "minTankLengthCm": 90,
    "minGroup": 6,
    "temperature": [
      20,
      26
    ],
    "ph": [
      5.5,
      7.5
    ],
    "flow": "medium",
    "wasteFactor": 0.8,
    "aliases": [
      "Leopard Corydoras",
      "Leopard Cory",
      "Corydoras julii"
    ],
    "communityCaution": "Barışçıl bir sürü balığıdır; en az altılı grup halinde benzer boydaki sakin türlerle tutulmalıdır.",
    "husbandryCaution": "En az 90 × 30 cm taban ve yaklaşık 81 litre; ince ve yumuşak kum, çok temiz taban, gölgeli sığınaklar, erişilebilir su yüzeyi ve çeşitli batan yemler gerekir. Dipte kalan artıklarla yaşaması veya akvaryumu temizlemesi beklenmemelidir. Ticarette Julii adıyla satılanların çoğu benzer desenli Hoplisoma trilineatum olabildiğinden bilimsel kimlik veya köken doğrulanmadan bu profil seçilmemelidir; küçük baş noktaları tek başına kesin kanıt değildir.",
    "sourceUrl": "https://www.seriouslyfish.com/species/hoplisoma-julii",
    "additionalSourceUrls": [
      "https://www.fishbase.se/summary/10923",
      "https://www.fishkeeper.co.uk/fish/freshwater/catfish/false-julii-cory-"
    ],
    "verifiedAt": "2026-10-08"
  },
  {
    "id": "chinese-snakehead",
    "commonName": "Çin yılanbaşı",
    "scientificName": "Channa asiatica",
    "category": "fish",
    "group": "monster",
    "adultSizeCm": 35,
    "minVolumeL": 160,
    "minTankLengthCm": 100,
    "minGroup": 2,
    "temperature": [
      15,
      25
    ],
    "ph": [
      6,
      8
    ],
    "flow": "low",
    "wasteFactor": 3,
    "aliases": [
      "Chinese Snakehead",
      "Small Snakehead",
      "Channa asiatica"
    ],
    "predatory": true,
    "speciesOnly": true,
    "communityCaution": "Zorunlu avcıdır; küçük balık ve omurgasızları yer. Genel topluluk akvaryumuna uygun değildir ve yalnız kanıtlanmış uyumlu çift düşünülmelidir.",
    "husbandryCaution": "Uyumlu çift için en az 100 × 40 cm taban ve yaklaşık 160 litre, 30 cm veya daha fazla su derinliği, loş ışık, yoğun saklanma alanı, yüzeye engelsiz erişim, nemli hava boşluğu ve tamamen kapalı ağır kapak gerekir. FishBase örnekleminde 23,5 cm TL yayımlanırken uzman bakım profili 35 cm SL bildirdiği için sağlık analizi koruyucu 35 cm eşiğini kullanır. Memeli/kanatlı eti ve hastalık taşıyabilen yem balıkları kullanılmamalıdır. Çin ve kuzey Vietnam kökenli bu tür, Hindistan kökenli gökkuşağı yılanbaş Channa bleheri ile aynı değildir.",
    "sourceUrl": "https://www.seriouslyfish.com/species/channa-asiatica",
    "additionalSourceUrls": [
      "https://www.fishbase.se/summary/Channa-asiatica"
    ],
    "verifiedAt": "2026-10-08"
  },
  {
    "id": "red-tailed-snakehead",
    "commonName": "Kırmızı kuyruklu yılanbaş",
    "scientificName": "Channa limbata",
    "category": "fish",
    "group": "monster",
    "adultSizeCm": 20,
    "minVolumeL": 100,
    "minTankLengthCm": 80,
    "minGroup": 1,
    "temperature": [
      22,
      28
    ],
    "ph": [
      5.5,
      8
    ],
    "flow": "low",
    "wasteFactor": 2,
    "aliases": [
      "Channa limbata",
      "Red-tailed Snakehead",
      "Dwarf Snakehead",
      "CHANNA GOLDEN LİMBATA",
      "Channa Golden Limbata",
      "Golden Limbata",
      "Xanthic Golden Channa limbata"
    ],
    "predatory": true,
    "speciesOnly": true,
    "communityCaution": "Avcı ve bölgecidir; küçük balık, karides ve diğer omurgasızları yer. Tek birey veya yalnızca kanıtlanmış uyumlu çift, tür akvaryumunda düşünülmelidir.",
    "husbandryCaution": "Tek birey veya uyumlu çift için en az 80 × 40 cm taban ve yaklaşık 100 litre; loş ışık, yoğun bitki/kök/mağara saklanma alanları, yüzeye engelsiz erişim, nemli hava boşluğu ve tamamen kapalı ağır kapak gerekir. Golden/Xanthic adı iki bağımsız güncel stok kaynağında Channa limbata üretim formu olarak doğrulanır; ayrı tür değildir ve tek başına yerel popülasyon bilgisini kanıtlamaz. Bakım profili renk formuna değil doğrulanmış tür kimliğine dayanır.",
    "sourceUrl": "https://channaturkiye.com/cuce-turler/channa-limbata/",
    "additionalSourceUrls": [
      "https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp?spid=34187",
      "https://journal.ipb.ac.id/jai/article/download/52145/28773/293734",
      "https://www.cikletistpetshop.com/channa-golden-limbata",
      "https://www.seahorseaquariums.com/News/New-Arrivals/New%20Arrivals%2003-03-23",
      "https://goldenaquaria.lk/shop/channa-golden-limbata-xanthic4-inch/"
    ],
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "half-banded-spiny-eel",
    "commonName": "Yarım bantlı dikenli yılan balığı",
    "scientificName": "Macrognathus circumcinctus",
    "category": "fish",
    "group": "monster",
    "adultSizeCm": 28.6,
    "minVolumeL": 200,
    "minTankLengthCm": 100,
    "minGroup": 5,
    "temperature": [
      24,
      27
    ],
    "ph": [
      6,
      7
    ],
    "wasteFactor": 2,
    "aliases": [
      "HALF BANDED SPINY EEL",
      "Half-banded Spiny Eel",
      "Half Banded Eel",
      "Striped-belly Spiny Eel",
      "Macrognathus circumcinctus"
    ],
    "waterTypes": [
      "freshwater"
    ],
    "predatory": true,
    "communityCaution": "Genellikle sakin olsa da gece aktif bir mikro avcıdır; küçük karides, yavru ve ağzına sığan küçük balıklarla güvenli değildir. Uzman bakım kaynağı sosyal dikenli yılan balıklarının beşli veya daha büyük gruplarını önerir.",
    "husbandryCaution": "En az 100 cm cepheli, yaklaşık 200 litrelik; keskin olmayan ince kumlu, gölgeli ve bol saklanma alanlı bir akvaryum gerekir; kapak tamamen kaçışsız olmalı, filtre emişleri korunmalı ve temiz su sürdürülmelidir. FishBase bilimsel azami boyu 28,6 cm verirken akvaryum ticareti kaynakları çoğunlukla 20 cm bildirir; sağlık analizi daha koruyucu bilimsel azami boyu kullanır. Donmuş/canlı hayvansal yemler karanlıkta hedefli verilmelidir. 'Zigzag eel' ticari adı iri Mastacembelus armatus için de kullanıldığından bilimsel ad olmadan bu profile bağlanmamalıdır.",
    "sourceUrl": "https://www.fishbase.se/summary/Macrognathus-circumcinctus.html",
    "additionalSourceUrls": [
      "https://www.fishkeeper.co.uk/fish/freshwater/miscellaneous/half-banded-spiny-eel",
      "https://my-fish.org/my-fishothek/mastacembelus-circumcinctus-gurtelstachelaal/"
    ],
    "verifiedAt": "2026-10-08"
  },
  {
    "id": "tire-track-eel",
    "commonName": "Lastik izli dikenli yılan balığı",
    "scientificName": "Mastacembelus armatus",
    "category": "fish",
    "group": "monster",
    "adultSizeCm": 90,
    "minVolumeL": 432,
    "minTankLengthCm": 120,
    "minGroup": 1,
    "temperature": [
      22,
      28
    ],
    "ph": [
      6,
      7.5
    ],
    "flow": "low",
    "wasteFactor": 6,
    "aliases": [
      "Tire-track Eel",
      "Tyre Track Eel",
      "Mastacembelus armatus"
    ],
    "waterTypes": [
      "freshwater",
      "brackish"
    ],
    "predatory": true,
    "communityCaution": "Gece aktif bir avcıdır ve ağzına sığan balıkları yer. Yalnız iri ve sakin tank arkadaşlarıyla uzman topluluğunda düşünülebilir; kendi türüne karşı saldırganlık görülebildiğinden tek birey en güvenli varsayımdır.",
    "husbandryCaution": "Erişkin için en az 120 × 60 cm tabanlı, yaklaşık 432 litrelik sistem; yumuşak derin kum, sabitlenmiş dekor, loş saklanma bölgeleri, güçlü biyolojik filtrasyon fakat nazik su hareketi ve tamamen kaçışsız kapak gerekir. FishBase türü tatlı ve acı suda kaydeder; Seriously Fish hafif acı suyu tercih ettiğini bildirir. Etli donmuş yemler hedefli sunulmalı, canlı yem balıkları hastalık riski nedeniyle kullanılmamalıdır. Zigzag eel adı daha küçük Macrognathus circumcinctus için de kullanıldığından bilimsel kimlik doğrulanmalıdır.",
    "sourceUrl": "https://www.seriouslyfish.com/species/mastacembelus-armatus/",
    "additionalSourceUrls": [
      "https://www.fishbase.se/summary/Mastacembelus_armatus.html",
      "https://www.fishkeeper.co.uk/fish/freshwater/miscellaneous/tyre-track-eel"
    ],
    "verifiedAt": "2026-10-08"
  },
  {
    "id": "pink-lipped-moray",
    "commonName": "Pembe dudaklı müren",
    "scientificName": "Echidna rhodochilus",
    "category": "fish",
    "group": "monster",
    "adultSizeCm": 33.8,
    "minVolumeL": 450,
    "minGroup": 1,
    "temperature": [
      23,
      28
    ],
    "ph": [
      7.5,
      8
    ],
    "wasteFactor": 3,
    "aliases": [
      "Pink-lipped Moray Eel",
      "Pink-lipped Moray",
      "Echidna rhodochilus",
      "WHITE CHECK EEL MÜREN",
      "White Check Eel",
      "White Cheek Eel",
      "White Cheek Moray",
      "Freshwater White-Cheeked Moray"
    ],
    "waterTypes": [
      "brackish",
      "saltwater"
    ],
    "specificGravity": [
      1.005,
      1.015
    ],
    "predatory": true,
    "speciesOnly": true,
    "communityCaution": "Küçük balık ve kabukluları avlar; mağarasını savunabilir ve beslenme sırasında görüşten çok kokuya yöneldiği için iri tank arkadaşlarını yanlışlıkla ısırabilir. Tek birey ve uzman acı su kurulumu en güvenli seçenektir.",
    "husbandryCaution": "En az 450 litre, sert ve alkali acı su, SG 1.005–1.015, çok sayıda sağlam mağara, güçlü biyolojik filtrasyon ve tamamen kaçışsız ağır kapak gerekir. Uzun süreli tam tatlı su bakımı kanıtlanmadığından 'freshwater moray' satış adına rağmen tatlı su kataloğunda gösterilmez. Hakemli bilimsel kaynak ve iki bağımsız ticaret kaynağı White Cheek adını Echidna rhodochilus ile eşler; mağazadaki White Check yazımı bu ticari adın varyantı olarak tutulur. Yem maşasıyla kabuklu ve deniz kökenli etli yem verilmeli; çıplak elle beslenmemelidir.",
    "tankLengthDataNote": "Kaynaklar 33,8 cm erişkin boy ve 450 litre minimum hacim yayımlıyor ancak sayısal minimum akvaryum uzunluğu vermiyor; bu nedenle uzunluk değeri tahmin edilmedi.",
    "sourceUrl": "https://www.fishbase.se/summary/Echidna-rhodochilus.html",
    "additionalSourceUrls": [
      "https://ws.nmmba.gov.tw/Download.ashx?icon=.pdf&n=NiBIdWFuZyBldCBhbC5wZGY%3D&u=LzAwMS9VcGxvYWQvMjIzL3JlbGZpbGUvNjQ1Ny8xMTc1Ni80OWZmNDM4Zi1hZTA2LTQ2NjYtYTI1OS1jOWJhODNkNDMxZTYucGRm",
      "https://www.aquaportail.com/fiche-poisson-3677-echidna-rhodochilus.html",
      "https://www.marinespecies.org/aphia.php?p=taxdetails&id=278680",
      "https://onlinelibrary.wiley.com/doi/full/10.1002/jmor.21776",
      "https://www.leopardaquatic.com/white-cheek-eel/",
      "https://aquadistribution.co.uk/?product=freshwater-moray-eel-white-cheek-echidna-rhodochilus-20cm",
      "https://www.cikletistpetshop.com/white-check-eel-muren"
    ],
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "duckbill-catfish-sorubim-lima",
    "commonName": "Ördek gagalı kedi balığı",
    "scientificName": "Sorubim lima",
    "category": "fish",
    "group": "monster",
    "adultSizeCm": 54.2,
    "minVolumeL": 1125,
    "minTankLengthCm": 200,
    "minGroup": 1,
    "temperature": [
      23.3,
      30
    ],
    "ph": [
      6,
      7.5
    ],
    "wasteFactor": 4.5,
    "aliases": [
      "Duckbill Catfish",
      "Lima Shovelnose",
      "Hockey Stick Catfish",
      "Sorubim lima"
    ],
    "predatory": true,
    "speciesOnly": true,
    "communityCaution": "Gece aktif bir balık ve kabuklu avcısıdır; ağzına sığan tüm canlıları yiyebilir. Ancak kamu akvaryumu ölçeğinde kendisini yutamayacak kadar iri ve sakin türlerle düşünülebilir.",
    "husbandryCaution": "Uzun süreli bakım için en az 200 × 75 cm taban ve yaklaşık 1.125 litre, çok güçlü biyolojik filtrasyon, yüksek oksijen, geniş açık yüzme alanı, loş bölgeler, yumuşak kum ve sağlam kök sığınakları gerekir. Yüksek atık nedeniyle haftalık %30–50 su değişimi gerekir. Canlı yem balıkları hastalık taşıyabilir; memeli/kanatlı eti uygun olmayan yağ içerir. Satış boyu erişkin gereksinimini yansıtmaz. Sorubim elongatus ve diğer Sorubim türleri benzer görünebildiğinden yalnız bilimsel kimliği doğrulanan canlılar bu profile eklenmelidir.",
    "sourceUrl": "https://www.seriouslyfish.com/species/sorubim-lima/",
    "additionalSourceUrls": [
      "https://www.fishbase.se/summary/12144"
    ],
    "verifiedAt": "2026-10-08"
  },
  {
    "id": "barred-shovelnose-catfish",
    "commonName": "Çizgili kürek burun kedi balığı",
    "scientificName": "Pseudoplatystoma fasciatum",
    "category": "fish",
    "group": "monster",
    "adultSizeCm": 104,
    "minVolumeL": 10368,
    "minTankLengthCm": 360,
    "minGroup": 1,
    "temperature": [
      22,
      26
    ],
    "ph": [
      6,
      7.6
    ],
    "wasteFactor": 8,
    "aliases": [
      "Barred Shovelnose",
      "Pseudoplatystoma fasciatum"
    ],
    "predatory": true,
    "speciesOnly": true,
    "communityCaution": "Çok iri ve fırsatçı bir balık avcısıdır; standart ev akvaryumundaki canlıların çoğunu yutabilir. Kendi türüne ve başka iri Pimelodidae üyelerine karşı bölgeci olabilir.",
    "husbandryCaution": "Standart ev akvaryumu canlısı değildir. Tam erişkin için yaklaşık 360 × 240 × 120 cm ve 10.368 litre dahi doğal yüzme alanını tam karşılamayan kamu akvaryumu ölçeğinde bir alt sınırdır; güçlü sump filtrasyonu, korumalı ekipman ve çok geniş açık yüzme alanı gerekir. Canlı yem balıkları hastalık taşıdığı, memeli/kanatlı eti ise uygun olmayan yağ içerdiği için kullanılmamalıdır. P. tigrinum ile desen örtüşebilir ve kırmızı kuyruklu kedi balığı melezleri de ticarette bulunur; yalnız bilimsel kimliği doğrulanan canlılar bu profile eklenmelidir.",
    "sourceUrl": "https://www.seriouslyfish.com/species/pseudoplatystoma-fasciatum/",
    "additionalSourceUrls": [
      "https://fishbase.se/identification/SpeciesList.php?genus=Pseudoplatystoma"
    ],
    "verifiedAt": "2026-10-08"
  },
  {
    "id": "tiger-shovelnose-catfish",
    "commonName": "Kaplan kürek burun kedi balığı",
    "scientificName": "Pseudoplatystoma tigrinum",
    "category": "fish",
    "group": "monster",
    "adultSizeCm": 130,
    "minVolumeL": 10368,
    "minTankLengthCm": 360,
    "minGroup": 1,
    "temperature": [
      22,
      26
    ],
    "ph": [
      6,
      7.6
    ],
    "wasteFactor": 9,
    "aliases": [
      "Tiger Shovelnose",
      "Tiger Sorubim",
      "Pseudoplatystoma tigrinum"
    ],
    "predatory": true,
    "speciesOnly": true,
    "communityCaution": "Çok iri ve fırsatçı bir balık/kabuklu avcısıdır; standart ev akvaryumundaki canlıların çoğunu yutabilir. Kendi türüne ve başka iri Pimelodidae üyelerine karşı bölgeci olabilir.",
    "husbandryCaution": "Standart ev akvaryumu canlısı değildir. FishBase 130 cm azami toplam boy yayımlar; tam erişkin için yaklaşık 360 × 240 × 120 cm ve 10.368 litre dahi doğal yüzme alanını tam karşılamayan kamu akvaryumu ölçeğinde bir alt sınırdır. Güçlü sump filtrasyonu, korumalı ekipman ve çok geniş açık yüzme alanı gerekir. Canlı yem balıkları hastalık taşıdığı, memeli/kanatlı eti ise uygun olmayan yağ içerdiği için kullanılmamalıdır. P. fasciatum ile desen örtüşebilir ve kırmızı kuyruklu kedi balığı melezleri de ticarette bulunur; yalnız bilimsel kimliği doğrulanan canlılar bu profile eklenmelidir.",
    "sourceUrl": "https://www.seriouslyfish.com/species/pseudoplatystoma-tigrinum",
    "additionalSourceUrls": [
      "https://www.fishbase.se/summary/Pseudoplatystoma_tigrinum.html"
    ],
    "verifiedAt": "2026-10-08"
  },
  {
    "id": "piquiti-peacock-bass",
    "commonName": "Piquiti peacock bass",
    "scientificName": "Cichla piquiti",
    "category": "fish",
    "group": "monster",
    "adultSizeCm": 80,
    "minVolumeL": 5000,
    "minTankLengthCm": 300,
    "minGroup": 1,
    "temperature": [
      21,
      32
    ],
    "ph": [
      5.8,
      7.3
    ],
    "wasteFactor": 5.5,
    "aliases": [
      "Cichla piquiti",
      "Piquiti Peacock Bass",
      "Pavón Piquiti",
      "BLUE AZUL PEACOCK BASS",
      "Blue Azul Peacock Bass",
      "Azul Peacock Bass",
      "Blue Azul",
      "Azul"
    ],
    "waterTypes": [
      "freshwater"
    ],
    "predatory": true,
    "speciesOnly": true,
    "communityCaution": "Büyük, bölgeci ve fırsatçı bir avcıdır; daha küçük balıklar ile kabukluların tamamını av olarak görür. Benzer davranışlı türlere ve kendi türüne karşı saldırganlaşabildiğinden standart topluluk akvaryumuna uygun değildir. Resmî ve kurumsal ticaret kaynakları Blue Azul/Azul adını Cichla piquiti ile eşler; yine de yalnız genel Peacock Bass etiketi veya doğrulanmamış melez stok bu profile bağlanmamalıdır.",
    "husbandryCaution": "Bu profil bilimsel kimliği Cichla piquiti olan ve resmî/ticari çapraz kaynaklarda aynı türe bağlanan Blue Azul/Azul satış adı içindir. FishBase 48 cm toplam boy yayımlarken uzman bakım kaynağı 80 cm azami boy verir; biyolojik yükte koruyucu 80 cm üst ölçeği kullanılır. Tek birey için dahi doğrudan yayımlanan en az 5.000 litre ve 300 cm cephe, çok güçlü korumalı filtrasyon ve geniş açık yüzme alanı gerekir. Güvenilir kaynak tek bir akıntı eşiği yayımlamadığından akıntı değeri tahmin edilmedi. Canlı yem balığı yerine çeşitli güvenli taze/dondurulmuş ve hazırlanmış yemler tercih edilmeli; doğaya kesinlikle bırakılamaz.",
    "sourceUrl": "https://www.fishi-pedia.com/fishes/cichla-piquiti",
    "additionalSourceUrls": [
      "https://www.fishbase.se/summary/cichla-piquiti.html",
      "https://peraturan.bpk.go.id/Download/151860/Permen%20KKP%20Nomor%2019%20tahun%202020.pdf",
      "https://www.qualitymarine.com/aquatropic/fish/cichlids/american/peacock-bass-blue-azul-18374/",
      "https://www.cikletistpetshop.com/blue-azul-peacock-bass"
    ],
    "verifiedAt": "2026-10-05"
  },
  {
    "id": "ghost-shrimp",
    "commonName": "Hayalet karides",
    "scientificName": "Palaemon paludosus",
    "category": "shrimp",
    "group": "shrimp",
    "adultSizeCm": 5,
    "minVolumeL": 20,
    "minGroup": 1,
    "temperature": [
      20,
      26
    ],
    "ph": [
      6.8,
      8
    ],
    "wasteFactor": 0.2,
    "aliases": [
      "Palaemonetes paludosus",
      "Eastern Grass Shrimp",
      "Riverine Grass Shrimp",
      "Florida Ghost Shrimp",
      "Glass Shrimp"
    ],
    "communityCaution": "Yalnız bilimsel kimliği Palaemon paludosus olarak doğrulanmış bireyler bu profile bağlanmalıdır. Küçük ve sakin balıklarla erişkinler yaşayabilse de ağız boyu büyük ciklet, gurami, loach ve başka avcılar erişkinleri veya yavruları yiyebilir. Mağazalarda Hayalet karides adıyla uzun kollu ve avcı Macrobrachium türleri de satılabildiğinden uzun kıskaçlı belirsiz stok topluluk akvaryumuna eklenmemelidir.",
    "husbandryCaution": "Doğrudan bakım kaynağı 3–5 cm erişkin boy, 20–26 °C, pH 6,8–8,0, GH 5–15, KH 2–10 ve TDS 150–350 ppm yayımlar; biyolojik yükte koruyucu 5 cm kullanılmıştır. En az 20 litre, olgun biyofilm, moss/bitki sığınağı, karides güvenli filtre emişi, sıfır amonyak ve nitrit gerekir. Bakırdan, ani TDS/sıcaklık değişiminden ve yalnız yemlik amaçlı zayıf stoktan kaçınılmalıdır. Palaemon paludosus tatlı suda çoğalabilir; Hayalet karides ticari adı bilimsel kimlik doğrulaması değildir.",
    "tankLengthDataNote": "Bakım kaynakları en az 20 litre yayımlıyor ancak santimetre cinsinden minimum tank uzunluğu, zorunlu sosyal grup veya tek bir akıntı sınıfı vermiyor; bu alanlar tahmin edilmedi.",
    "sourceUrl": "https://tankandtendril.com/invertebrates/ghost-shrimp/",
    "additionalSourceUrls": [
      "https://www.marinespecies.org/aphia.php?id=587741&p=taxdetails",
      "https://www.itis.gov/servlet/SingleRpt/SingleRpt?search_topic=TSN&search_value=1192108",
      "https://nas.er.usgs.gov/queries/factsheet.aspx?SpeciesID=1207",
      "https://tankbud.com/species/freshwater-invertebrates"
    ],
    "verifiedAt": "2026-10-04"
  },
  {
    "id": "ramshorn-snail",
    "commonName": "Ramshorn salyangoz",
    "scientificName": "Planorbella duryi",
    "category": "snail",
    "group": "snail",
    "adultSizeCm": 2.5,
    "minVolumeL": 10,
    "minGroup": 1,
    "temperature": [
      18,
      28
    ],
    "ph": [
      6.5,
      8
    ],
    "wasteFactor": 0.3,
    "aliases": [
      "Rhamshorn Salyangoz",
      "RAMSHORN SALYANGOZ 4 ADET STRAFORLU GÖNDERİM"
    ],
    "communityCaution": "Barışçıldır ancak puffer, loach, kerevit, yengeç ve katil salyangozlar tarafından yenebilir. Farklı renk formları birlikte ürediğinde seçilmiş renkler karışabilir.",
    "husbandryCaution": "Doğrudan tür kaynağı 2,5 cm erişkin kabuk çapı ve 10 litre veya üzerini önerir. Olgun biofilm, kalsiyum/mineralce yeterli su, sıfır amonyak ve nitrit, bakırsız bakım gerekir. Fazla yem hızlı nüfus artışına yol açar; salyangozları kimyasal ilaçla kontrol etmek yerine yemleme azaltılmalıdır.",
    "tankLengthDataNote": "Doğrudan bakım kaynağı 10 litre veya üzerini öneriyor ancak santimetre cinsinden minimum akvaryum uzunluğu yayımlamıyor; tahmini uzunluk kullanılmadı.",
    "sourceUrl": "https://www.garnelio.de/en/pink-ramshorn-snail-planorbella-duryi-duryi",
    "additionalSourceUrls": [
      "https://aquascapedia.com/snail-profiles/red-ramshorn-snail/",
      "https://www.cikletistpetshop.com/ramshorn-jumbo-boy-salyangoz-383"
    ],
    "verifiedAt": "2026-10-03"
  },
  {
    "id": "sun-nerite-snail",
    "commonName": "Sun dikenli Nerite",
    "scientificName": "Clithon donovani",
    "category": "snail",
    "group": "snail",
    "adultSizeCm": 1.5,
    "minVolumeL": 19,
    "minGroup": 1,
    "temperature": [
      22,
      28
    ],
    "ph": [
      7.4,
      8
    ],
    "wasteFactor": 0.3,
    "aliases": [
      "Sun Nerite Snail",
      "Sun Thorn Nerite",
      "Horned Nerite",
      "Dikenli Nerite"
    ],
    "communityCaution": "Barışçıldır ve karideslerle uyumludur; ancak puffer, loach, kerevit, yengeç ve katil salyangozlarla birlikte güvenli değildir. Akvaryumdan çıkabildiği için kapak veya düşük su seviyesi gerekir.",
    "husbandryCaution": "WoRMS Clithon donovani adını kabul edilen tür olarak listeler. Doğrudan bakım kaynakları yaklaşık 1,5 cm erişkin boy, en az 5 galon (yaklaşık 19 litre), 22–28 °C ve alkali su yayımlar. GH en az 6 olacak şekilde mineralce yeterli, olgun alg/biofilm bulunan ve nitratı düşük akvaryum gerekir; gerektiğinde spirulina, salyangoz yemi ve sebzeyle desteklenmelidir. Bakır içeren ürün kullanılmamalıdır. Tatlı suda yumurta bırakabilse de larvaların gelişmesi için acı su gerekir.",
    "tankLengthDataNote": "Doğrudan bakım kaynağı yaklaşık 19 litre minimum yayımlıyor ancak santimetre cinsinden minimum akvaryum uzunluğu vermiyor; tahmini uzunluk kullanılmadı.",
    "sourceUrl": "https://aquaticmotiv.com/products/3-horned-nerite-snails-clithon-donovani-1",
    "additionalSourceUrls": [
      "https://www.ecoarium.pt/caracois/2745-clithon-donovani-sun-snail",
      "https://www.marinespecies.org/aphia.php?p=taxlist&tName=Clithon",
      "https://aquarubi.com/sun-dikenli-nerite-snail-0-5-1cm-5-adet"
    ],
    "verifiedAt": "2026-10-04"
  },
  {
    "id": "turbo-snail",
    "commonName": "Turbo salyangoz",
    "scientificName": "Celetaia persculpta",
    "category": "snail",
    "group": "snail",
    "adultSizeCm": 5,
    "minVolumeL": 54,
    "minGroup": 1,
    "temperature": [
      24,
      28
    ],
    "ph": [
      7,
      7.5
    ],
    "wasteFactor": 0.5,
    "aliases": [
      "Blue Turbo Snail",
      "Freshwater Turbo Snail",
      "Celetaia persclupa"
    ],
    "communityCaution": "Barışçıldır ve karideslerle uyumludur; ancak puffer, loach, kerevit, yengeç ve katil salyangozlarla birlikte güvenli değildir. Yerel satış sayfasındaki yazım hatalı `Celetaia persclupa` biçimindedir; doğru kabul edilen tür adı Celetaia persculpta'dır.",
    "husbandryCaution": "Celetaia persculpta Poso Gölü'ne endemik, sıradan Nerite olmayan bir Viviparidae türüdür. Uzman kaynak 5 cm erişkin boy, en az 54 litre, 24–28 °C ve pH 6,0–7,5 yayımlar; yerel kaynak 26–30 °C ve pH 7,0–8,5 verdiği için güvenli ortak pH 7,0–7,5 kullanıldı ve sıcaklıkta uzman profil esas alındı. İnce kum veya yuvarlak çakıl, olgun mikroorganizma/biofilm, yaprak, toz spirulina ya da çok ince planktonik yem ve yüksek oksijen gerekir. Bakır kullanılmamalıdır. Yerel sayfanın hermafrodit ve kolay üreme iddiası diğer kaynaklarla çeliştiğinden kesin bilgi olarak kullanılmadı; doğal stok baskısı nedeniyle satın alma yerine mevcut bireyin korunması öncelik olmalıdır.",
    "tankLengthDataNote": "Doğrudan uzman bakım kaynağı 54 litre minimum yayımlıyor ancak santimetre cinsinden minimum akvaryum uzunluğu vermiyor; tahmini uzunluk kullanılmadı.",
    "sourceUrl": "https://www.interaquaristik.de/tiere/schnecken/turboschnecke-celetaia-persculpta/a-86598/",
    "additionalSourceUrls": [
      "https://www.gbif.org/species/9996900",
      "https://heimbiotop.de/viviparidae.html",
      "https://aquarubi.com/turbo-salyangoz-4cm"
    ],
    "verifiedAt": "2026-10-04"
  },
  {
    "id": "batman-nerite-snail",
    "commonName": "Batman Nerite salyangoz",
    "scientificName": "Neripteron auriculatum",
    "category": "snail",
    "group": "snail",
    "adultSizeCm": 3,
    "minVolumeL": 30,
    "minGroup": 1,
    "temperature": [
      22,
      26
    ],
    "ph": [
      7,
      7.5
    ],
    "wasteFactor": 0.4,
    "aliases": [
      "Batman Snail",
      "Bat Snail",
      "Neritina auriculata",
      "Neripteron auriculata"
    ],
    "communityCaution": "Barışçıldır ve karideslerle uyumludur; ancak puffer, loach, kerevit, yengeç, katil salyangoz ve başka salyangoz avcılarıyla birlikte güvenli değildir. Güçlü tutunan hayvan kabuğundan zorlanarak çekilmemelidir.",
    "husbandryCaution": "GBIF Batman Nerite ortak adını kabul edilen Neripteron auriculatum türüne bağlar. İki doğrudan bakım kaynağı 3 cm erişkin boy yayımlar; daha koruyucu 30 litre minimum kullanıldı. Kaynakların ortak güvenli aralığı 22–26 °C ve pH 7,0–7,5'tir. Olgun alg ve biyofilm bulunan, mineralce yeterli ve nitratı düşük akvaryum gerekir; gerektiğinde bitkisel salyangoz yemiyle desteklenmeli ve bakır içeren ürün kullanılmamalıdır. Kabuk biçimi nedeniyle sırtüstü kalan birey kendi başına dönemeyebilir; akvaryuma ayak tarafı alta gelecek biçimde yerleştirilmeli ve düzenli kontrol edilmelidir. Tatlı suda kalıcı nüfus oluşturmaz; larva gelişimi acı veya deniz suyu evresi gerektirir.",
    "tankLengthDataNote": "Doğrudan bakım kaynakları 30 litreye kadar koruyucu minimum hacim yayımlıyor ancak santimetre cinsinden minimum akvaryum uzunluğu vermiyor; tahmini uzunluk kullanılmadı.",
    "sourceUrl": "https://www.interaquaristik.de/tiere/schnecken/fledermausschnecke-neripteron-auriculata/a-8459",
    "additionalSourceUrls": [
      "https://www.gbif.org/species/8463530",
      "https://aquaticarts.com/products/batman-nerite-snail",
      "https://aquarubi.com/batman-nerite-salyangoz"
    ],
    "verifiedAt": "2026-10-04"
  },
  {
    "id": "thai-micro-crab",
    "commonName": "Tayland mikro yengeci",
    "scientificName": "Limnopilos naiyanetri",
    "category": "other",
    "group": "other",
    "adultSizeCm": 2.5,
    "minVolumeL": 20,
    "minGroup": 5,
    "temperature": [
      22,
      28
    ],
    "ph": [
      6.5,
      7.5
    ],
    "flow": "low",
    "wasteFactor": 0.15,
    "aliases": [
      "Thai Micro Crab",
      "False Spider Crab",
      "Thai Micro Spider Crab"
    ],
    "speciesOnly": true,
    "communityCaution": "Tamamen sucul ve barışçıl olmasına rağmen savunmasızdır; iri veya avcı balıklar, kerevitler ve çoğu yengeç tarafından yenebilir. En güvenli düzen kendi türünden küçük bir grup ile karides ve küçük salyangozların bulunduğu balıksız, yoğun bitkili akvaryumdur.",
    "husbandryCaution": "Practical Fishkeeping türün yalnız Tayland'daki bir nehirden bilinen tamamen sucul bir mikro yengeç olduğunu, erişkin kabuk genişliğinin yaklaşık 1 cm olduğunu ve 22–28 °C aralığında tutulabildiğini yayımlar. Uzun bacak açıklığı için eski profildeki koruyucu 2,5 cm biyolojik yük değeri korunmuştur. Kabul edilen kaynak minimum hacim, grup sayısı, pH veya tek bir akıntı sınıfı yayımlamadığından mevcut 20 litre, beşli grup, pH 6,5–7,5 ve düşük akıntı değerleri kaynak kuralına göre korunur ancak bağımsız olarak doğrulanmış eşikler sayılmaz. Yalnız olgun, yoğun moss/kök yüzeyli ve biyofilmi gelişmiş akvaryuma eklenmeli; korumalı filtre emişi, çok ince askı yem, sıfır amonyak/nitrit ve bakırsız bakım sağlanmalıdır.",
    "tankLengthDataNote": "Practical Fishkeeping santimetre cinsinden minimum tank uzunluğu yayımlamıyor; eski 30 cm önerisi zorunlu eşik yapılmadı. Mevcut 20 litre ve beşli grup değerleri kabul edilen kaynakta ayrıca doğrulanamadı.",
    "sourceUrl": "https://www.practicalfishkeeping.co.uk/features/articles/thai-micro-crab-limnopilos-naiyanetri",
    "additionalSourceUrls": [
      "https://tankbud.com/species/thai-micro-crab",
      "https://melbournetropical.com/fish/thai-micro-crab",
      "https://aquariumhq.app/invertebrates/thai-micro-crab",
      "https://lkcnhm.nus.edu.sg/wp-content/uploads/sites/11/app/uploads/2017/06/39rbz363-368.pdf"
    ],
    "verifiedAt": "2026-11-02"
  },
  {
    "id": "mexican-dwarf-crayfish",
    "commonName": "Turuncu Meksika cüce kereviti",
    "scientificName": "Cambarellus patzcuarensis",
    "category": "other",
    "group": "crayfish",
    "adultSizeCm": 5,
    "minVolumeL": 50,
    "minTankLengthCm": 30,
    "minGroup": 1,
    "temperature": [
      10,
      25
    ],
    "ph": [
      6.5,
      9
    ],
    "wasteFactor": 0.6,
    "aliases": [
      "Meksika cüce kereviti",
      "Orange Dwarf Crayfish",
      "CPO",
      "Cambarellus patzcuarensis orange",
      "MEKSİKA CÜCE KEREVİT 2 ADET"
    ],
    "predatory": true,
    "speciesOnly": true,
    "communityCaution": "Küçük olsa da bölgeci ve fırsatçı bir kerevittir; salyangozları, karidesleri ve dipte uyuyan ya da yavaş balıkları yakalayıp yaralayabilir. Tek birey veya iyi yapılandırılmış geniş bir çift düzeni en güvenlisidir; farklı kerevit türleriyle karıştırılmamalıdır.",
    "husbandryCaution": "Wirbellose.de erişkin dişi ve erkeklerde 5 cm boy, 10–25 °C, pH 6,5–9, GH en az 6 ve bir çift için en az 30 cm akvaryum yayımlar; türün kendi içinde oldukça saldırgan olduğunu ve çok sayıda saklanma alanı istediğini belirtir. Kabul edilen kaynak litre cinsinden minimum hacim yayımlamadığından mevcut koruyucu 50 litre eşiği kaynak kuralına göre korunur ancak bağımsız doğrulanmış litre sınırı sayılmaz. Çok sayıda ayrı mağara, görüş bariyeri, yaprak örtüsü, kaçışsız kapak, sıfır amonyak/nitrit ve mineralce yeterli su gerekir; kabuk değişiminde eski kabuk tankta bırakılmalıdır. Turuncu CPO, Lago de Pátzcuaro kökenli türün seçilmiş renk formudur; genç turuncu Procambarus clarkii ile karıştırılmamalıdır. Kuzey/Orta Amerika kökenli kerevit olarak ölümcül kerevit vebasını taşıyabileceğinden su, bitki, dekor veya canlı hiçbir şekilde doğaya ya da hassas kerevit sistemlerine aktarılmamalıdır.",
    "sourceUrl": "https://www.wirbellose.de/artendatenbank/cambarellus-patzcuarensis-sp-orange-oranger-zwergkrebs-cpo/",
    "additionalSourceUrls": [
      "https://www.garnelio.de/en/detail/index/sArticle/854",
      "https://aquairi.app/learn/en/dwarf-mexican-crayfish-care-guide",
      "https://www.sera.de/fileadmin/epapers/PDF/11113_RG_Garnelen-und-Krebse_US.pdf"
    ],
    "verifiedAt": "2026-11-02"
  },
  {
    "id": "least-dwarf-crayfish",
    "commonName": "Minik cüce kerevit",
    "scientificName": "Cambarellus diminutus",
    "category": "other",
    "group": "crayfish",
    "adultSizeCm": 2.5,
    "minVolumeL": 20,
    "minGroup": 1,
    "temperature": [
      18,
      26
    ],
    "ph": [
      6.5,
      8
    ],
    "flow": "low",
    "wasteFactor": 0.35,
    "aliases": [
      "Least Dwarf Crayfish",
      "Least Crayfish",
      "Mini Lobster",
      "Cambarellus diminutus",
      "DİMİNİTUS CÜCE KEREVİT 3 ADET"
    ],
    "communityCaution": "Kerevitler arasında görece sakin olsa da fırsatçıdır; yeni kabuk değiştirmiş karidesleri, yavruları ve yavaş dip canlılarını yaralayabilir. En güvenli düzen tek birey veya bol sığınaklı, yalnız kendi türünden küçük bir gruptur.",
    "husbandryCaution": "Doğrudan bakım kaynağı yaklaşık 2,5 cm erişkin boy, tek birey için en az 20 litre, 18–26 °C ve pH 6,5–8,0 yayımlar. Yaprak örtüsü, kök ve bitkiler arasında ayrı saklanma alanları; kararlı mineral değeri, sıfır amonyak/nitrit ve kaçışsız kapak gerekir. Kabuk değişiminden sonra eski kabuk mineral geri kazanımı için akvaryumda bırakılmalıdır. USFWS türün yalnız güney Alabama ve Mississippi'de yirmiden az bölgeden bilindiğini ve akvaryum salımıyla yeni ekosistemlere taşınabileceğini bildirir; canlı, su ve dekor doğaya bırakılmamalıdır.",
    "tankLengthDataNote": "Doğrudan bakım kaynağı 20 litre minimum yayımlıyor ancak santimetre cinsinden minimum tank uzunluğu vermiyor; eski 30 cm tahmini kaldırıldı.",
    "sourceUrl": "https://tankbud.com/species/least-dwarf-crayfish",
    "additionalSourceUrls": [
      "https://www.fws.gov/sites/default/files/documents/Ecological-Risk-Screening-Summary-Least-Crayfish.pdf",
      "https://www.cikletistpetshop.com/diminitus-cuce-kerevit-3-adet-1460"
    ],
    "verifiedAt": "2026-10-04"
  },
  {
    "id": "electric-blue-crayfish",
    "commonName": "Elektrik mavi kerevit",
    "scientificName": "Procambarus alleni",
    "category": "other",
    "group": "crayfish",
    "adultSizeCm": 20,
    "minVolumeL": 120,
    "minTankLengthCm": 90,
    "minGroup": 1,
    "temperature": [
      20,
      24
    ],
    "ph": [
      6.5,
      8
    ],
    "wasteFactor": 2.2,
    "aliases": [
      "Electric Blue Crayfish",
      "Electric Blue Lobster",
      "Florida Blue Crayfish",
      "Sapphire Crayfish",
      "Cambarus alleni"
    ],
    "predatory": true,
    "speciesOnly": true,
    "communityCaution": "İri, bölgeci ve istekli bir avcıdır; balıkları, karidesleri, salyangozları ve diğer kerevitleri yakalayıp yaralayabilir. Tek bireylik tür akvaryumu en güvenli düzendir; bitkileri kesebilir veya sökebilir.",
    "husbandryCaution": "Wirbellose.de dişilerde 10 cm, erkeklerde 8 cm boy; 20–24 °C oda sıcaklığı (daha soğuğa da dayanım), pH 6,5–8, GH 10–25 ve bir çift için 60 × 30 cm akvaryum yayımlar. Eski uzman profili 20 cm azami boy, tek birey için 120 litre ve 90 × 38 cm taban verdiğinden kaynak kuralındaki koruyucu büyük sınırlar biyolojik yük ve alan hesabında korunmuştur; bunlar Wirbellose.de'nin yayımladığı minimumlar değildir. Tür çoğunlukla yalnız yaşar, kabuk değişimi sonrasında yamyamlık görülebilir ve fırsat bulduğunda balık yakalayabilir. Çok sayıda sağlam mağara, görüş bariyeri, mineralce yeterli su, güçlü biyolojik filtrasyon, sıfır amonyak/nitrit ve tamamen kaçışsız kapak gerekir; eski kabuk tankta bırakılmalıdır. USFWS türün kerevit vebası ve chytrid mantarı taşıyabildiğini bildirir; canlı, su, bitki, dekor veya ekipman başka kerevit sistemlerine ya da doğaya aktarılmamalıdır.",
    "sourceUrl": "https://www.wirbellose.de/artendatenbank/procambarus-alleni-sp-blau-florida-krebs/",
    "additionalSourceUrls": [
      "https://www.fishkeeping.co.uk/modules/caresheets/caresheet.php?caresheetID=133",
      "https://aquairi.app/learn/en/procambarus-alleni-care-guide",
      "https://www.fws.gov/sites/default/files/documents/Ecological-Risk-Screening-Summary-Florida-Crayfish.pdf",
      "https://www.gbif.org/taxon/7WLQR"
    ],
    "verifiedAt": "2026-11-02"
  },
  {
    "id": "red-clawed-crayfish",
    "commonName": "Kırmızı kıskaçlı kerevit",
    "scientificName": "Cherax quadricarinatus",
    "category": "other",
    "group": "crayfish",
    "adultSizeCm": 25,
    "minVolumeL": 200,
    "minTankLengthCm": 100,
    "minGroup": 1,
    "temperature": [
      24,
      27
    ],
    "ph": [
      7.2,
      8
    ],
    "wasteFactor": 3,
    "aliases": [
      "Red-clawed Crayfish",
      "Australian Red Claw",
      "Australian Redclaw",
      "Queensland Red Claw",
      "Blue Lobster",
      "Astacus quadricarinatus"
    ],
    "predatory": true,
    "speciesOnly": true,
    "communityCaution": "İri ve bölgeci bir avcıdır; balıkları ve diğer omurgasızları yakalayıp yiyebilir. Kendi türüyle alan yetersizse uzuv kayıplı ciddi kavgalar görülebilir; tek bireylik tür akvaryumu en güvenli düzendir.",
    "husbandryCaution": "Fishkeeper 20–25 cm erişkin boy ve en az 200 litre yayımlar; biyolojik yükte koruyucu 25 cm kullanıldı. Wirbellose.de 15–18 cm, 24–27 °C, pH 7'nin üzeri ve en az 100 cm akvaryum yayımlar; sıcaklık aralığı kabul edilen kaynakların güvenli ortak bölümüne daraltıldı. Güçlü filtrasyon ve oksijenlenme, sert-alkali su, çok sayıda mağara, kalsiyum kaynağı ve tüm kablo/boru boşluklarını kapatan kaçışsız kapak gerekir. Kaynaklar tek bir akıntı sınıfı yayımlamadığından akıntı değeri tahmin edilmedi. Bitkileri sökebilir veya yiyebilir; yavaş balıkları avlayabilir ve kabuk değiştirdikten sonra eski kabuk tankta bırakılmalıdır. USFWS 25–35 cm'ye ulaşabilen örnekler ve çok sayıda ülkeye yayılmış yabani popülasyonlar bildirir; canlı, su, bitki veya dekor kesinlikle doğaya bırakılmamalıdır.",
    "sourceUrl": "https://www.fishkeeper.co.uk/fish/freshwater/miscellaneous/red-clawed-crayfish",
    "additionalSourceUrls": [
      "https://melbournetropical.com/fish/redclaw-crayfish",
      "https://www.wirbellose.de/artendatenbank/cherax-quadricarinatus-australischer-flusskrebs/",
      "https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-tropical-freshwater-invertebrates/how-to-look-after-crayfish-and-freshwater-crabs/",
      "https://www.fws.gov/sites/default/files/documents/Ecological-Risk-Screening-Summary-Redclaw.pdf",
      "https://www.gbif.org/taxon/7S74F"
    ],
    "verifiedAt": "2026-11-02"
  },
  {
    "id": "african-dwarf-frog",
    "commonName": "Afrika cüce kurbağası",
    "scientificName": "Hymenochirus sp.",
    "category": "other",
    "group": "other",
    "adultSizeCm": 4,
    "minVolumeL": 54,
    "minTankLengthCm": 60,
    "minGroup": 4,
    "temperature": [
      22,
      25
    ],
    "ph": [
      7,
      7.8
    ],
    "flow": "low",
    "wasteFactor": 0.5,
    "aliases": [
      "African Dwarf Frog",
      "Congo Frog",
      "Hymenochirus boettgeri",
      "Hymenochirus boetgeri",
      "Hymenochirus curtipes"
    ],
    "speciesOnly": true,
    "communityCaution": "Afrika cüce kurbağası ticari adı H. boettgeri, H. curtipes veya esaret melezi için kullanılabilir; köken ya da tür teşhisi olmadan tek türe kesin bağlanmamalıdır. Yavaş yem alır ve balıklarla yem rekabetinde aç kalabilir; en güvenli düzen en az dört benzer boylu Hymenochirus bireyinden oluşan tür akvaryumudur. Xenopus, kerevit, yengeç ve avcı balıklarla birleştirilmemelidir.",
    "husbandryCaution": "Uzman bakım kaynağı erişkinlerde 3–4 cm ve küçük grup için en az 60 × 30 × 30 cm/yaklaşık 54 litre; OATA ise sucul kurbağalarda en az dörtlü grup önerir. Koruyucu profil 4 cm, 54 litre, 60 cm, dörtlü grup, 22–25 °C ve pH 7,0–7,8 kullanır. Tamamen sucul fakat akciğerle nefes aldığı için yüzeye engelsiz erişim, boşluksuz güvenli kapak, düşük akıntı ve korumalı filtre emişi gerekir. Hedefli küçük yemlerle her bireyin yediği izlenmeli; ince kum veya yutulamayacak pürüzsüz taban kullanılmalıdır. Derisi geçirgendir: bakır, sabun, pestisit ve rastgele balık ilacı kullanılmamalı; yeni bireyler karantinaya alınmalı ve hiçbir zaman doğaya bırakılmamalıdır.",
    "sourceUrl": "https://academy.herpeton.net/en/caresheets/amphibians/hymenochirus-boettgeri/",
    "additionalSourceUrls": [
      "https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-aquatic-animals/how-to-look-after-axolotls-and-aquatic-frogs/",
      "https://www.fishkeeping.co.uk/modules/caresheets/caresheet.php?caresheetID=96"
    ],
    "verifiedAt": "2026-10-04"
  },
  {
    "id": "axolotl",
    "commonName": "Axolotl",
    "scientificName": "Ambystoma mexicanum",
    "category": "other",
    "group": "coldwater",
    "adultSizeCm": 30,
    "minVolumeL": 78,
    "minTankLengthCm": 76,
    "minGroup": 1,
    "temperature": [
      15,
      18
    ],
    "ph": [
      6.5,
      8
    ],
    "flow": "low",
    "wasteFactor": 2.5,
    "aliases": [
      "Meksika semenderi",
      "Mexican Walking Fish"
    ],
    "predatory": true,
    "speciesOnly": true,
    "communityCaution": "Soliter bakım en güvenli seçenektir. Balık, karides, salyangoz ve başka türler avlanabilir; balıklar da dış solungaçlarını yaralayabilir veya hastalık taşıyabilir. Birden fazla axolotl ancak benzer boyda, yeterince geniş ve ayrı saklanma alanlı bir sistemde yakından izlenerek düşünülmelidir.",
    "husbandryCaution": "NSW kurumsal rehberi 15–18 °C, pH 6,5–8,0, minimum su dolaşımı ve tür akvaryumu önerir; sıcaklık hiçbir zaman 22 °C üzerine çıkmamalıdır. Tek erişkin için kaynaklı 20 galon/yaklaşık 78 litre uzun akvaryum ve yaklaşık 76 cm taban kullanılmıştır. Güçlü akıntı ve parlak ışık strese yol açar; loş saklanma alanları, sıfır amonyak/nitrit ve sıcaklığı eşleşen düzenli kısmi su değişimleri gerekir. İnce kum, çıplak taban veya başından büyük pürüzsüz taş kullanılmalı; yutulabilir çakıl kullanılmamalıdır. Sıcak iklimde fan tek başına yetmiyorsa güvenilir soğutma planı gerekir. Doğal popülasyon kritik tehlikededir; yalnız yasal ve güvenilir esaret üretimi birey alınmalı, egzotik hayvan veterinerine erişim önceden düşünülmeli, canlı veya akvaryum atık suyu doğaya bırakılmamalıdır.",
    "sourceUrl": "https://education.nsw.gov.au/teaching-and-learning/animals-in-schools/animals-in-schools-species/axolotls/axolotls-environment",
    "additionalSourceUrls": [
      "https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-aquatic-animals/how-to-look-after-axolotls-and-aquatic-frogs/",
      "https://www.worldwildlife.org/our-work/wildlife/wildlife-crime/responsible-pet-guide/assessed-exotic-species/axolotl/",
      "https://lafeber.com/vet/wp-content/uploads/2021/03/Axolotl-Care-of-the-LV-0321.pdf"
    ],
    "verifiedAt": "2026-10-04"
  },
  {
    "id": "african-clawed-frog",
    "commonName": "Afrika pençeli kurbağası",
    "scientificName": "Xenopus laevis",
    "category": "other",
    "group": "other",
    "adultSizeCm": 14,
    "minVolumeL": 75,
    "minTankLengthCm": 90,
    "minGroup": 1,
    "temperature": [
      18,
      22
    ],
    "ph": [
      6.5,
      8.5
    ],
    "flow": "low",
    "wasteFactor": 1.8,
    "aliases": [
      "African Clawed Frog",
      "African Clawed Toad",
      "Platanna"
    ],
    "predatory": true,
    "speciesOnly": true,
    "communityCaution": "İri, fırsatçı ve ağzına sığan balık, karides, salyangoz ve küçük kurbağaları yiyebilen bir avcıdır. En güvenli düzen tekli tür akvaryumudur; yalnız benzer boylu Xenopus bireyleri daha geniş sistemde yakından izlenerek düşünülebilir. Afrika cüce kurbağalarıyla karıştırılmamalıdır.",
    "husbandryCaution": "Uzman bakım kaynağı erişkin dişilerde 10–14 cm, tek büyük erişkin için en az 90 × 45 × 45 cm, 18–22 °C ve pH 6,5–8,5 yayımlar. Flinn tek birey için en az 10 galon akvaryum ve erişkin başına 5 galon su bildirir; 90 cm tabanlı yaklaşık 75 litre güvenli minimum olarak kullanılmıştır. Çok atık ürettiği için olgun fakat nazik akıntılı filtrasyon, sıfır amonyak/nitrit ve düzenli su değişimi gerekir. Tamamen sucul olsa da akciğerle nefes alır; yüzeye engelsiz erişim, üstte hava boşluğu ve havalandırmalı fakat kaçışsız kapak sağlanmalıdır. Yutulabilir çakıl kullanılmamalıdır. Derisi geçirgen olduğundan sabun, bakır ve rastgele ilaçtan kaçınılmalı; karantina ve ayrı ekipman uygulanmalıdır. İstilacı popülasyon ve hastalık taşıma riski nedeniyle canlı veya akvaryum suyu asla doğaya bırakılmamalıdır.",
    "sourceUrl": "https://academy.herpeton.net/en/caresheets/amphibians/xenopus-laevis/",
    "additionalSourceUrls": [
      "https://science.rspca.org.uk/documents/d/science/guidancexenopuslaevisreport?download=true",
      "https://www.flinnsci.com/api/library/Download/a5ac37d59ab54400abacb21ff359c939",
      "https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-aquatic-animals/how-to-look-after-axolotls-and-aquatic-frogs/"
    ],
    "verifiedAt": "2026-10-04"
  },
  {
    "id": "true-rummy-nose",
    "commonName": "Gerçek kırmızı burun tetra",
    "scientificName": "Petitella rhodostoma",
    "aliases": [
      "Hemigrammus rhodostomus",
      "True Rummy-nose Tetra",
      "True Rummynose Tetra",
      "Red-nose Tetra"
    ],
    "category": "fish",
    "group": "tetra",
    "waterTypes": [
      "freshwater"
    ],
    "adultSizeCm": 5,
    "minVolumeL": 120,
    "minTankLengthCm": 100,
    "minGroup": 10,
    "temperature": [
      24,
      27
    ],
    "ph": [
      5.5,
      7
    ],
    "flow": "medium",
    "wasteFactor": 0.75,
    "communityCaution": "Çok barışçıl ve sıkı sürü oluşturan bir türdür; en az 10 birey tutulmalı, iri veya saldırgan balıklarla ve yem rekabetinde baskın türlerle eşleştirilmemelidir. P. bleheri ve P. georgiae ile aynı genel satış adını paylaşabildiğinden bilimsel kimlik doğrulanmalıdır.",
    "husbandryCaution": "FishBase güncel adı Petitella rhodostoma ve 5 cm toplam boy yayımlar. Seriously Fish en az 10 birey, 90 cm cephe, 24–27 °C ve pH 5,5–7,0; Fishipedia 120 litre ve 100 cm cephe yayımlar. Sağlık analizinde koruyucu 120 litre/100 cm birlikte kullanılır. Olgun ve kararlı siyah su veya bitkili kurulum, loş ışık, açık yüzme alanı, düzenli kısmi su değişimi ve tamamen kapalı kapak gerekir. Genel Rummy-nose adı tek başına bu profile bağlanmaz.",
    "sourceUrl": "https://www.seriouslyfish.com/species/petitella-rhodostoma",
    "additionalSourceUrls": [
      "https://www.fishbase.se/summary/Hemigrammus-rhodostomus.html",
      "https://www.fishipedia.fr/fr/poissons/hemigrammus-rhodostomus",
      "https://www.b-aqua.com/pages/fiche.aspx?id=1893"
    ],
    "verifiedAt": "2026-10-09"
  },
  {
    "id": "false-rummy-nose",
    "commonName": "Sahte kırmızı burun tetra",
    "scientificName": "Petitella georgiae",
    "aliases": [
      "False Rummy-nose Tetra",
      "False Rummynose Tetra",
      "False Red-nose Tetra"
    ],
    "category": "fish",
    "group": "tetra",
    "waterTypes": [
      "freshwater"
    ],
    "adultSizeCm": 5,
    "minVolumeL": 120,
    "minTankLengthCm": 90,
    "minGroup": 10,
    "temperature": [
      22,
      26
    ],
    "ph": [
      5.5,
      7
    ],
    "wasteFactor": 0.75,
    "communityCaution": "Çok barışçıl fakat hareketli bir sürü balığıdır; en az 10 birey tutulmalı ve iri, saldırgan ya da yem rekabetinde baskın türlerle eşleştirilmemelidir. P. bleheri ve P. rhodostoma ile aynı genel satış adını paylaşabildiğinden bilimsel kimlik doğrulanmalıdır.",
    "husbandryCaution": "FishBase Petitella georgiae'yi ayrı geçerli tür olarak ve 3,9 cm standart boyla listeler; Seriously Fish akvaryumda yaklaşık 5 cm standart boy, en az 10 birey, 90 cm cephe, 22–26 °C ve pH 5,5–7,0 yayımlar. Uzman bakım kaynağı 120 litre/90 cm önerdiği için sağlık analizinde bu koruyucu alan eşikleri birlikte kullanılır. Loş ışık, koyu taban, bitki, kök/dal, açık yüzme alanı ve küçük ağıza uygun yem gerekir. Genel Rummy-nose adı tek başına bu profile bağlanmaz; kaynak genel bakım için tek bir akıntı sınıfı yayımlamadığından akıntı değeri tahmin edilmez.",
    "sourceUrl": "https://www.seriouslyfish.com/species/petitella-georgiae",
    "additionalSourceUrls": [
      "https://fishbase.se/identification/SpeciesList.php?genus=Petitella",
      "https://www.zoopet.com/fiskar/fisk.php?NR=869"
    ],
    "verifiedAt": "2026-10-09"
  },
  {
    "id": "semibanded-kuhli",
    "commonName": "Yarı bantlı Kuhli",
    "scientificName": "Pangio semicincta",
    "aliases": [
      "Acanthophthalmus semicinctus",
      "Acanthophthalmus kuhlii sumatranus",
      "Semibanded Kuhli Loach",
      "Half-banded Kuhli Loach"
    ],
    "category": "fish",
    "group": "bottom",
    "waterTypes": [
      "freshwater"
    ],
    "adultSizeCm": 10,
    "minVolumeL": 54,
    "minTankLengthCm": 60,
    "minGroup": 6,
    "temperature": [
      21,
      26
    ],
    "ph": [
      3.5,
      7
    ],
    "flow": "low",
    "wasteFactor": 0.8,
    "communityCaution": "Barışçıl bir dip balığıdır; en az 5–6 bireylik grup halinde tutulmalı ve iri, saldırgan veya dipte aşırı rekabetçi türlerle eşleştirilmemelidir. Balık yumurtası ve çok küçük yavruları yiyebilir.",
    "husbandryCaution": "Seriously Fish 10 cm standart boy, 60 × 30 cm taban/yaklaşık 54 litre, 21–26 °C, pH 3,5–7,0 ve en az 5–6 bireylik grup yayımlar. Yumuşak ince kum, yaprak örtüsü, loş ışık, bol gölgeli sığınak, düşük/nazik akıntı ve tamamen kapalı kapak gerekir; filtre girişleri küçük bireylerin giremeyeceği biçimde korunmalıdır. P. semicincta ticarette sıkça P. kuhlii adıyla satılır; gerçek P. kuhlii Java'ya özgüdür ve akvaryum ticaretinde muhtemelen görülmemiştir. Genel `Kuhli`, `Coolie` veya `Siyah Kuhli` adı bilimsel kimlik kanıtı olmadan bu profile bağlanmaz.",
    "sourceUrl": "https://www.seriouslyfish.com/species/pangio-semicincta",
    "additionalSourceUrls": [
      "https://www.fishbase.se/summary/Pangio_kuhlii.html",
      "https://www.cikletistpetshop.com/siyah-kuhli"
    ],
    "verifiedAt": "2026-10-03"
  },
  {
    "id": "black-kuhli",
    "commonName": "Siyah Kuhli",
    "scientificName": "Pangio oblonga",
    "aliases": [
      "SİYAH KUHLİ",
      "Black Kuhli Loach",
      "Java Loach",
      "Chocolate Kuhli Loach",
      "Cinnamon Loach",
      "Cobitis oblonga",
      "Acanthophthalmus javanicus"
    ],
    "category": "fish",
    "group": "bottom",
    "waterTypes": [
      "freshwater"
    ],
    "adultSizeCm": 8,
    "minVolumeL": 54,
    "minTankLengthCm": 60,
    "minGroup": 6,
    "temperature": [
      21,
      26
    ],
    "ph": [
      3.5,
      7
    ],
    "flow": "low",
    "wasteFactor": 0.8,
    "communityCaution": "Barışçıl bir dip ve sürü balığıdır; en az 5–6 bireylik grup halinde tutulmalı, iri avcılar ile dipte aşırı rekabetçi veya bölgeci türlerden kaçınılmalıdır. Balık yumurtası ve çok küçük yavruları yiyebilir.",
    "husbandryCaution": "Seriously Fish, Black Kuhli Loach adını doğrudan Pangio oblonga ile eşler ve 8 cm standart boy, 60 × 30 cm taban/yaklaşık 54 litre, 21–26 °C, pH 3,5–7,0 ile en az 5–6 bireylik grup yayımlar; FishBase 8 cm azami toplam boy ve 23–25 °C doğal sıcaklık kaydıyla tür kimliğini çapraz doğrular. Yumuşak ince kum, yaprak örtüsü, loş ışık, bol gölgeli sığınak, düşük ve nazik akıntı, korumalı filtre girişi ile tamamen kapalı kapak gerekir. Tür en az dört genetik soy içeren yakın bir kompleks olabilir; bu nedenle yalnız `Siyah/Black Kuhli`, `Java`, `Chocolate` veya `Cinnamon Loach` gibi bu profile kaynakta bağlanan adlar eşlenir. Genel `Kuhli Loach` ya da `Coolie Loach` adı başka Pangio türlerini kapsayabildiğinden otomatik bağlanmaz.",
    "sourceUrl": "https://www.seriouslyfish.com/species/pangio-oblonga",
    "additionalSourceUrls": [
      "https://www.fishbase.se/summary/Pangio-oblonga.html",
      "https://www.cikletistpetshop.com/siyah-kuhli"
    ],
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "reed-tetra-elachys",
    "commonName": "Reed tetra",
    "scientificName": "Hyphessobrycon elachys",
    "category": "fish",
    "group": "tetra",
    "adultSizeCm": 4,
    "minVolumeL": 40,
    "minGroup": 10,
    "temperature": [
      24,
      27
    ],
    "ph": [
      6,
      7
    ],
    "flow": "low",
    "wasteFactor": 0.5,
    "aliases": [
      "Tétra roseau",
      "Hyphessobrycon elachys"
    ],
    "waterTypes": [
      "freshwater"
    ],
    "tankLengthDataNote": "Türe özel kaynak onlu sürü için en az 40 litre yayımlıyor ancak santimetre cinsinden minimum akvaryum uzunluğu vermiyor; uzunluk tahmin edilmedi.",
    "communityCaution": "Çok küçük ve barışçıl bir sürü balığıdır. En az on birey tutulmalı; iri, saldırgan veya yem rekabetinde baskın balıklar ile büyük kabukluların yanında av olabilir.",
    "husbandryCaution": "En az onlu sürü için 40 litre veya daha büyük, biyolojik olarak olgun, yoğun bitkili fakat açık yüzme alanı da bulunan akvaryum; düşük ve dağıtılmış akıntı, yumuşak-asidik kararlı su ve küçük ağıza uygun çeşitli yemler gerekir. Fishipedia 2–2,6 cm standart boy, Practical Fishkeeping akvaryum ticaretinde yaklaşık 3–4 cm bildirir; biyolojik yükte koruyucu 4 cm kullanılmıştır. Reed, Kitty ve Lowe's tetra adları H. heliacus ile H. loweae için de kullanılabildiğinden bu profil yalnız kesin Hyphessobrycon elachys kimliği içindir.",
    "sourceUrl": "https://www.fishipedia.fr/fr/poissons/hyphessobrycon-elachys",
    "additionalSourceUrls": [
      "https://www.practicalfishkeeping.co.uk/features/hyphessobrycon-elachys/",
      "https://www.fishbase.se/summary/Hyphessobrycon-elachys.html"
    ],
    "verifiedAt": "2026-10-08"
  },
  {
    "id": "kitty-tetra-heliacus",
    "commonName": "Kitty tetra",
    "scientificName": "Hyphessobrycon heliacus",
    "category": "fish",
    "group": "tetra",
    "adultSizeCm": 3.5,
    "minVolumeL": 80,
    "minTankLengthCm": 60,
    "minGroup": 10,
    "temperature": [
      23,
      28
    ],
    "ph": [
      5.5,
      7
    ],
    "flow": "low",
    "wasteFactor": 0.55,
    "aliases": [
      "Heliacus tetra",
      "Hyphessobrycon heliacus"
    ],
    "waterTypes": [
      "freshwater"
    ],
    "communityCaution": "Çok küçük, barışçıl ve ürkek bir sürü balığıdır. En az on birey tutulmalı; iri, saldırgan, çok hareketli veya yemi hızla tüketen türler ile büyük kabukluların yanında av ya da rekabet mağduru olabilir.",
    "husbandryCaution": "En az onlu sürü için 80 litre ve 60 cm veya daha uzun, biyolojik olarak olgun, ince kumlu, yoğun bitkili ve gölgeli akvaryum; açık yüzme alanı, düşük ve dağıtılmış akıntı, kararlı temiz su ve küçük ağıza uygun çeşitli yemler gerekir. Kaynaklar 2,8 cm standart, yaklaşık 3,5 cm toplam boy bildirir; biyolojik yükte 3,5 cm kullanılmıştır. Kitty adı H. loweae/cf. loweae için de kullanıldığından bu profil yalnız kesin Hyphessobrycon heliacus kimliği içindir.",
    "sourceUrl": "https://aquainfo.nl/en/article/hyphessobrycon-heliacus-kitty-tetra/",
    "additionalSourceUrls": [
      "https://www.fishipedia.fr/fr/poissons/hyphessobrycon-heliacus",
      "https://www.fishbase.se/summary/Hyphessobrycon-heliacus.html"
    ],
    "verifiedAt": "2026-10-08"
  },
  {
    "id": "lowes-tetra",
    "commonName": "Lowe's tetra",
    "scientificName": "Hyphessobrycon loweae",
    "category": "fish",
    "group": "tetra",
    "adultSizeCm": 4.2,
    "minVolumeL": 76,
    "minTankLengthCm": 60,
    "minGroup": 10,
    "temperature": [
      24,
      28
    ],
    "ph": [
      6.5,
      7.2
    ],
    "flow": "low",
    "wasteFactor": 0.6,
    "aliases": [
      "Lowe's Tetra",
      "Hyphessobrycon loweae"
    ],
    "waterTypes": [
      "freshwater"
    ],
    "communityCaution": "Barışçıl bir sürü balığıdır; en az on birey ve benzer boydaki sakin tank arkadaşları gerekir. İri, saldırgan, çok hareketli veya uzun yüzgeç kovalayan türlerle birleştirilmemelidir.",
    "husbandryCaution": "En az onlu sürü için yaklaşık 76 litre/20 galon ve 60 cm veya daha uzun, olgun, bitkili ve açık yüzme alanlı akvaryum; düşük ve dağıtılmış akıntı, yumuşak-asidik kararlı su ve küçük canlı/dondurulmuş yemlerle çeşitlendirilmiş beslenme gerekir. FishBase 3,2 cm standart boy, Aquarium Glaser ticaret örneklerinde 4,2 cm toplam boy yayımlar; biyolojik yükte koruyucu toplam boy kullanılmıştır. Ticarette Kitty etiketiyle gelen örnekler H. heliacus veya yalnız H. cf. loweae olabilir; bu profil ancak bilimsel kimlik kesin Hyphessobrycon loweae ise kullanılmalıdır.",
    "sourceUrl": "https://www.fishbase.se/summary/46320",
    "additionalSourceUrls": [
      "https://www.practicalfishkeeping.co.uk/features/kitty-tetra-hyphessobrycon-cf--loweae/",
      "https://www.aquariumglaser.de/en/09-characoids-tetra-relationship/hyphessobrycon_cf_loweae_en/",
      "https://www.aqua-imports.com/product/kitty-tetra/"
    ],
    "verifiedAt": "2026-10-08"
  },
  {
    "id": "yellow-phantom-tetra",
    "commonName": "Sarı hayalet tetra",
    "scientificName": "Hyphessobrycon roseus",
    "category": "fish",
    "group": "tetra",
    "adultSizeCm": 2,
    "minVolumeL": 54,
    "minTankLengthCm": 60,
    "minGroup": 10,
    "temperature": [
      20,
      28
    ],
    "ph": [
      5,
      7
    ],
    "flow": "medium",
    "wasteFactor": 0.4,
    "aliases": [
      "Yellow Phantom Tetra",
      "Megalamphodus roseus",
      "Hyphessobrycon roseus"
    ],
    "waterTypes": [
      "freshwater"
    ],
    "communityCaution": "Çok küçük ve barışçıl bir sürü balığıdır. En az onlu karma cinsiyetli grup hâlinde, benzer boydaki sakin türlerle tutulmalıdır; iri balıklar, avcılar ve büyük kabuklular erişkinleri dahi kolayca yiyebilir. Yem rekabetinde baskın veya çok hareketli türlerden kaçınılmalıdır.",
    "husbandryCaution": "En az 60 × 30 cm taban ve yaklaşık 54 litre, olgun biyolojik filtre, kum taban, kök/dal ve yaprak döküntülü gölgeli alanlarla açık yüzme bölgesi gerekir. 20–28 °C, pH 5,0–7,0 ve 1–10 dGH aralığında kararlı, temiz tatlı su sağlanmalı; yaklaşık saatte 4–5 kat dağıtılmış çevrim uygundur. Kaliteli küçük kuru yemler canlı veya dondurulmuş küçük omurgasızlarla çeşitlendirilmelidir. Tür yalnız 2 cm standart boya ulaştığı için filtre emişi güvenli olmalı ve tank arkadaşlarının ağzına sığmayacak biçimde seçilmelidir. Gül, Rose ve Rosy Tetra adları Megalamphodus rosaceus ile Hyphessobrycon bentosi gibi başka türlerde de kullanıldığından yalnız Yellow Phantom Tetra ya da kesin bilimsel kimlik bu profile bağlanır.",
    "sourceUrl": "https://www.seriouslyfish.com/species/hyphessobrycon-roseus",
    "additionalSourceUrls": [
      "https://www.fishbase.se/summary/hyphessobrycon-roseus.html",
      "https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp?spid=24925"
    ],
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "ornate-stiphodon",
    "commonName": "Süslü Stiphodon",
    "scientificName": "Stiphodon ornatus",
    "category": "fish",
    "group": "goby",
    "adultSizeCm": 7,
    "minVolumeL": 72,
    "minTankLengthCm": 80,
    "minGroup": 3,
    "temperature": [
      20,
      28
    ],
    "ph": [
      6.5,
      7.5
    ],
    "flow": "high",
    "wasteFactor": 0.6,
    "aliases": [
      "Ornate Stiphodon",
      "Rainbow Stiphodon",
      "Stiphodon ornatus"
    ],
    "waterTypes": [
      "freshwater"
    ],
    "communityCaution": "Barışçıldır; yalnız benzer boyda, temiz ve yüksek oksijenli akarsuları seven, yem rekabetinde baskın olmayan türlerle tutulmalıdır. Erkekler gevşek bölge savunabilir; kaya düzeninde görüş bariyerleri bulunmalı ve en az bir erkek ile iki dişilik düzen tercih edilmelidir.",
    "husbandryCaution": "En az 80 × 30 cm taban ve yaklaşık 72 litre, tamamen olgunlaşmış akarsu akvaryumu, saatte 8–12 kat çevrim, yüksek oksijen, güçlü yüzey hareketi, biyofilm ve alg kaplı yuvarlak taşlar, güçlü aydınlatma, haftalık %30–50 su değişimi ve boşluksuz kapak gerekir. Tür bentik alg ve biyofilmdeki mikroorganizmaları otlar; yeni, çıplak veya aşırı temizlenmiş akvaryumda ek yem verilse bile uzun süreli beslenemez. Uzman kaynak 7 cm standart boy, FishBase 5,3 cm standart boy bildirir; biyolojik yükte güvenli tarafta 7 cm kullanılmıştır. Amfidrom yaşam döngüsü nedeniyle ticaretteki bireyler yabani kökenlidir ve sorumlu kaynaktan alınmalıdır. Rainbow Goby, Gold Fin ve Gold Cheek adları başka Stiphodon türlerinde de kullanıldığından yalnız bilimsel kimliği doğrulanan canlılar bu profile eklenmelidir.",
    "sourceUrl": "https://www.seriouslyfish.com/species/stiphodon-ornatus",
    "additionalSourceUrls": [
      "https://www.fishbase.se/summary/Stiphodon-ornatus",
      "https://researcharchive.calacademy.org/research/ichthyology/catalog/fishcatget.asp?genus=Stiphodon&tbl=species"
    ],
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "eirmotus-insignis",
    "commonName": "Borneo sahte sekiz bantlı barb",
    "scientificName": "Eirmotus insignis",
    "category": "fish",
    "group": "barb",
    "adultSizeCm": 3.6,
    "minVolumeL": 54,
    "minTankLengthCm": 60,
    "minGroup": 10,
    "temperature": [
      20,
      26
    ],
    "ph": [
      5,
      7
    ],
    "flow": "low",
    "wasteFactor": 0.55,
    "aliases": [
      "Eirmotus insignis"
    ],
    "waterTypes": [
      "freshwater"
    ],
    "communityCaution": "Ürkek, yavaş beslenen ve kolay baskılanan bir sürü balığıdır. En az 8–10 birey gerekir; güvenli sosyal eşik olarak onlu grup kullanılmalıdır. Yalnız Boraras ve küçük Trigonostigma benzeri sakin türlerle düşünülmeli; iri, hareketli veya yemi hızlı tüketen balıklarla birleştirilmemelidir.",
    "husbandryCaution": "En az 60 × 30 cm taban ve yaklaşık 54 litre, onlu sürü, yoğun bitkili veya loş orman deresi düzeni, yumuşak taban, kök-dal ve yaprak örtüsü gerekir. 20–26 °C, pH 5,0–7,0 ve 1–8 dGH aralığında kararlı, temiz tatlı su sağlanmalı; doğal yavaş akarsu ve bataklık ortamına uygun düşük akıntı kullanılmalıdır. İthal bireyler zayıf gelebilir, su kimyası dalgalanmalarına hassastır ve biyolojik olarak olgunlaşmamış akvaryuma eklenmemelidir. Yaklaşık %10'luk küçük ve düzenli su değişimleri, başlangıçta küçük canlı yemler ve sonrasında küçük kuru/dondurulmuş yem çeşitliliği gerekir. FishBase 3,2 cm standart boy, uzman bakım kaynağı 3,6 cm standart boy bildirir; biyolojik yükte güvenli tarafta 3,6 cm kullanılmıştır. False eight-banded barb adı Eirmotus octozona için de kullanıldığından yalnız kesin E. insignis kimliği bu profile bağlanır.",
    "sourceUrl": "https://www.seriouslyfish.com/species/eirmotus-insignis",
    "additionalSourceUrls": [
      "https://www.fishbase.se/summary/64659",
      "https://lkcnhm.nus.edu.sg/wp-content/uploads/sites/11/app/uploads/2017/06/56rbz423-433.pdf"
    ],
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "fishers-woodcat",
    "commonName": "Fisher odun kedi balığı / Fisher's Woodcat",
    "scientificName": "Trachelyopterus fisheri",
    "category": "fish",
    "group": "bottom",
    "adultSizeCm": 28,
    "minVolumeL": 190,
    "minGroup": 3,
    "temperature": [
      22,
      26
    ],
    "ph": [
      6,
      7
    ],
    "wasteFactor": 2.4,
    "aliases": [
      "Fisher's Woodcat",
      "Fisher Woodcat",
      "Fisher's Wood Catfish",
      "Fisher Wood Catfish",
      "Driftwood Catfish",
      "Parauchenipterus fisheri",
      "Trachycorystes fisheri"
    ],
    "waterTypes": [
      "freshwater"
    ],
    "predatory": true,
    "communityCaution": "Genellikle barışçıldır ancak gece dolaşırken ağzına sığan küçük balıkları yiyebilir. Benzer boydaki sakin balıklarla düşünülmeli; üç veya daha fazla kendi türü birlikte tutulduğunda daha görünür ve etkin olabilir. Çok hareketli veya saldırgan tank arkadaşları saklanmasına ve beslenememesine yol açabilir.",
    "husbandryCaution": "FishBase ve ScotCat erişkin boyu 28 cm olarak yayımlar. Aqua Imports en az 50 ABD galonu önerir; doğrudan litre dönüşümünün yuvarlanmasıyla 190 litre kullanılmış, bu hacimden akvaryum uzunluğu türetilmemiştir. En az üçlü grup için açık yüzme alanıyla birlikte bol kök, mağara ve gündüz saklanma yeri; sıfır amonyak/nitrit ve düzenli kısmi su değişimi gerekir. Gece etkin olduğundan batan hazırlanmış yemler, dondurulmuş omurgasızlar ve çeşitli etçil-omnivor yemler ışıklar kısıldıktan sonra sunulabilir. Bilimsel kimliği doğrulanmamış Odun Pengasus satış adı bu profile otomatik bağlanmamalıdır.",
    "tankLengthDataNote": "Türe özel bakım kaynağı 50 ABD galonu öneriyor ancak santimetre cinsinden minimum akvaryum uzunluğu yayımlamıyor; yaklaşık 190 litre doğrudan birim dönüşümüdür ve tahmini uzunluk kullanılmadı.",
    "sourceUrl": "https://www.scotcat.com/auchenipteridae/trachelyopterus_fisheri.htm",
    "additionalSourceUrls": [
      "https://www.fishbase.se/summary/12110",
      "https://www.aqua-imports.com/product/fishers-wood-catfish/"
    ],
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "alligator-gar-exact",
    "commonName": "Kesin kimlikli Alligator gar",
    "scientificName": "Atractosteus spatula",
    "category": "fish",
    "group": "monster",
    "adultSizeCm": 305,
    "minVolumeL": 6000,
    "minTankLengthCm": 400,
    "minGroup": 1,
    "temperature": [
      11,
      23
    ],
    "ph": [
      6,
      8
    ],
    "wasteFactor": 12,
    "aliases": [
      "Atractosteus spatula",
      "Lepisosteus spatula",
      "Lepidosteus spatula",
      "Lepidosteus tristoechus"
    ],
    "waterTypes": [
      "freshwater",
      "brackish"
    ],
    "predatory": true,
    "speciesOnly": true,
    "communityCaution": "Üç metreyi aşabilen zorunlu bir balık ve kabuklu avcısıdır. Ağzına sığan tüm canlılar avdır; erişkinin gücü ve dönüş alanı nedeniyle sıradan karma akvaryum ya da ev havuzu için güvenli tank arkadaşı yoktur. Yalnız tür kimliği, yasal sahiplik ve ömür boyu profesyonel tesis planı belgelenmişse değerlendirilmelidir.",
    "husbandryCaution": "Seriously Fish 305 cm standart boy, 11–23 °C ve pH 6,0–8,0 yayımlar ve türün ev akvaryumu canlısı olmadığını açıkça belirtir. Doğrudan uzman profil 400 cm/6.000 litre eşiği yayımlasa da bu yalnız profesyonel büyük tesis için alt güvenlik tabanıdır; erişkinin tam boyu, dönüş yarıçapı, su derinliği, yapısal yük, yedekli filtrasyon ve taşıma planı uzman mühendislik hesabıyla daha büyük bir sistem gerektirebilir. Çok güçlü ve yedekli filtrasyon, yüksek oksijen, geniş engelsiz yüzey, tamamen kapalı sağlam çevre ve uzun vadeli kurumsal bakım planı gerekir. Canlı yem balıkları parazit/hastalık taşıyabilir; memeli veya kanatlı eti uygun değildir. Yumurtaları insanlar ve başka omurgalılar için toksiktir. FWS ve eyalet kurumları bazı bölgelerde koruma, sahiplik veya taşıma kısıtları ile akvaryum salımı riskini belgeler; edinmeden önce yerel mevzuat kontrol edilmeli ve canlı hiçbir koşulda doğaya bırakılmamalıdır.",
    "sourceUrl": "https://www.seriouslyfish.com/species/atractosteus-spatula",
    "additionalSourceUrls": [
      "https://www.zoopet.com/fiskar/fisk.php?NR=2076",
      "https://www.fishbase.se/summary/1073",
      "https://www.fws.gov/sites/default/files/documents/Ecological-Risk-Screening-Summary-Alligator-gar.pdf",
      "https://myfwc.com/wildlifehabitats/profiles/freshwater/alligator-gar/"
    ],
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "florida-gar-exact",
    "commonName": "Kesin kimlikli Florida gar",
    "scientificName": "Lepisosteus platyrhincus",
    "category": "fish",
    "group": "monster",
    "adultSizeCm": 132,
    "minVolumeL": 4000,
    "minTankLengthCm": 200,
    "minGroup": 1,
    "temperature": [
      24,
      28
    ],
    "ph": [
      6.5,
      7.5
    ],
    "flow": "medium",
    "wasteFactor": 8,
    "aliases": [
      "Florida Gar",
      "Lepisosteus platyrhincus"
    ],
    "waterTypes": [
      "freshwater"
    ],
    "predatory": true,
    "speciesOnly": true,
    "communityCaution": "132 cm'ye ulaşabilen zorunlu bir balık, karides ve kerevit avcısıdır. Ağzına sığan tüm canlılar avdır; erişkinin sert zırhlı gövdesi ve dönüş alanı nedeniyle sıradan topluluk akvaryumuna uygun değildir. Yalnız bilimsel kimliği, yasal sahipliği ve ömür boyu çok büyük tesis planı doğrulanmışsa değerlendirilmelidir.",
    "husbandryCaution": "FishBase 132 cm azami toplam boy yayımlar; doğrudan bakım kaynağı tek erişkin için en az 200 × 100 × 100 cm ve 4.000 litre, 24–28 °C, pH 6,5–7,5 ve orta su hareketi bildirir. Bu değerler ev akvaryumu önerisi değil, iri erişkin için yayımlanmış uzman alt tabanıdır; gerçek dönüş alanı, yapısal yük, çok güçlü yedekli filtrasyon, yüksek oksijen, yüzeyden hava alabilmesi için boşluk, tamamen kapalı ağır kapak ve uzun vadeli taşıma planı tesis uzmanıyla değerlendirilmelidir. FWC türü Florida ve Georgia'nın akarsu, kanal ve göllerinde kum/çamur taban ile sualtı bitkileri yakınında yaşayan bir hava soluyucusu olarak belgeler. Canlı yem balıkları hastalık taşıyabilir; dondurulmuş uygun bütün sucul yemler tercih edilmeli, canlı hiçbir koşulda doğaya bırakılmamalı ve yerel mevzuat edinmeden önce kontrol edilmelidir.",
    "sourceUrl": "https://jnk-aquatics.co.uk/products/livestock/florida-gar-25-30cm",
    "additionalSourceUrls": [
      "https://www.fishbase.se/summary/2598",
      "https://myfwc.com/wildlifehabitats/profiles/freshwater/florida-gar/"
    ],
    "verifiedAt": "2026-10-28"
  },
  {
    "id": "spotted-gar-exact",
    "commonName": "Kesin kimlikli Spotted gar",
    "scientificName": "Lepisosteus oculatus",
    "category": "fish",
    "group": "monster",
    "adultSizeCm": 150,
    "minVolumeL": 5000,
    "minTankLengthCm": 200,
    "minGroup": 1,
    "temperature": [
      12,
      20
    ],
    "ph": [
      6.5,
      8
    ],
    "flow": "low",
    "wasteFactor": 9,
    "aliases": [
      "Spotted Gar",
      "Lepisosteus oculatus"
    ],
    "waterTypes": [
      "freshwater",
      "brackish"
    ],
    "predatory": true,
    "speciesOnly": true,
    "communityCaution": "150 cm'ye ulaşabilen zorunlu bir balık ve kabuklu avcısıdır. Ağzına sığan tüm canlılar avdır; erişkin boyu ve onlarca yıla varabilen ömrü nedeniyle sıradan karma akvaryum veya ev havuzu için güvenli tank arkadaşı yoktur. Yalnız bilimsel kimlik, yasal sahiplik ve ömür boyu kamusal tesis planı doğrulanmışsa değerlendirilmelidir.",
    "husbandryCaution": "FishBase 150 cm azami toplam boy ve tatlı/acılı su dağılımı; Seriously Fish 125 cm standart boy, 12–20 °C, pH 6,0–8,0, en az 2 metre uzunluk ve yalnız çok büyük kamusal kurulum uygunluğu yayımlar. Fishipedia 5.000 litre, 12–20 °C ve pH 6,5–8,0 alt tabanını verir; bu nedenle sağlık profili kaynakların ortak daha dar pH aralığını kullanır. 5.000 litre ve 200 cm bir ev akvaryumu önerisi değil, yayımlanmış asgari güvenlik eşiğidir; erişkinin dönüş alanı, yapısal yük, yedekli filtrasyon, yüksek oksijen, yüzey havasına erişim, tamamen kapalı ağır kapak ve uzun vadeli taşıma planı tesis uzmanıyla daha büyük ölçekte değerlendirilmelidir. Akıntı güçlü olmamalı ve aydınlatma parlak tutulmamalıdır. Canlı yem balıkları hastalık taşıyabilir; dondurulmuş uygun bütün sucul yemler tercih edilmeli, memeli/kanatlı eti verilmemeli, canlı hiçbir koşulda doğaya bırakılmamalı ve yerel mevzuat edinmeden önce kontrol edilmelidir.",
    "sourceUrl": "https://www.seriouslyfish.com/species/lepisosteus-oculatus/",
    "additionalSourceUrls": [
      "https://fishbase.se/summary/Lepisosteus-oculatus",
      "https://www.fishipedia.fr/fr/poissons/lepisosteus-oculatus",
      "https://www.floridamuseum.ufl.edu/discover-fish/florida-fishes-gallery/spotted-gar/"
    ],
    "verifiedAt": "2026-10-28"
  },
  {
    "id": "shortnose-gar-exact",
    "commonName": "Kesin kimlikli Shortnose gar",
    "scientificName": "Lepisosteus platostomus",
    "category": "fish",
    "group": "monster",
    "adultSizeCm": 88,
    "minVolumeL": 760,
    "minGroup": 1,
    "temperature": [
      10,
      18
    ],
    "ph": [
      6.5,
      7.5
    ],
    "flow": "low",
    "wasteFactor": 6,
    "aliases": [
      "Shortnose Gar",
      "Lepisosteus platostomus"
    ],
    "waterTypes": [
      "freshwater"
    ],
    "predatory": true,
    "speciesOnly": true,
    "communityCaution": "88 cm'ye ulaşabilen balık ve omurgasız avcısıdır. Ağzına sığan her canlı av olabilir; Fishipedia tür akvaryumunu önerir ve daha iri türlerle dahi güvenli topluluk garantisi vermez. Bilimsel kimlik ve ömür boyu uzman kurulum planı doğrulanmadan edinilmemelidir.",
    "husbandryCaution": "FishBase 88 cm azami toplam boy, 10–18 °C ve yalnız tatlı su yaşam ortamı yayımlar. Fishipedia en az 760 litre, 10–18 °C, pH 6,5–7,5 ve yavaş akıntı bildirir; santimetre cinsinden minimum akvaryum uzunluğu yayımlamadığı için uzunluk tahmin edilmemiştir. 760 litre yalnız yayımlanmış alt eşiktir; 88 cm erişkinin dönüş alanı, geniş taban, yüksek oksijen, güçlü biyolojik filtrasyon, yüzey havasına erişim ve tamamen kapalı ağır kapak gerçek birey ve tesis planına göre ayrıca doğrulanmalıdır. Yoğun bitki, batık kök ve sakin akışlı bölgeler sağlanmalı; canlı yem balıkları hastalık taşıyabileceğinden uygun dondurulmuş sucul yemler tercih edilmeli, canlı hiçbir koşulda doğaya bırakılmamalı ve yerel mevzuat edinmeden önce kontrol edilmelidir.",
    "tankLengthDataNote": "Fishipedia 760 litre alt sınırını yayımlıyor ancak santimetre cinsinden minimum akvaryum uzunluğu vermiyor; tahmini uzunluk kullanılmadı.",
    "sourceUrl": "https://www.fishipedia.fr/fr/poissons/lepisosteus-platostomus",
    "additionalSourceUrls": [
      "https://www.fishbase.se/summary/Lepisosteus-platostomus"
    ],
    "verifiedAt": "2026-10-28"
  },
  {
    "id": "asian-arowana",
    "commonName": "Asya arowanası / Asian Arowana",
    "scientificName": "Scleropages formosus",
    "category": "fish",
    "group": "monster",
    "adultSizeCm": 90,
    "minVolumeL": 900,
    "minTankLengthCm": 244,
    "minGroup": 1,
    "temperature": [
      24,
      28
    ],
    "ph": [
      5,
      8
    ],
    "wasteFactor": 5.5,
    "aliases": [
      "Asian Arowana",
      "Asian Bonytongue",
      "Green Arowana",
      "Red Arowana",
      "Super Red Arowana",
      "Golden Arowana",
      "Crossback Golden Arowana",
      "Osteoglossum formosum"
    ],
    "waterTypes": [
      "freshwater"
    ],
    "predatory": true,
    "speciesOnly": true,
    "communityCaution": "Bölgeci bir yüzey avcısıdır; ağzına sığan balıkları ve omurgasızları yer. Ev akvaryumunda tek birey en güvenli düzendir; yalnız kendisinden iri ve alt/orta katmanda yaşayan sakin türler çok büyük uzman sistemlerde değerlendirilebilir.",
    "husbandryCaution": "FishBase 90 cm azami boy, 24–30 °C, erişkinlerde balık ve küçük omurgalı tüketimi, Tehlikede statüsü ve CITES Ek I kaydını yayımlar. Seriously Fish türün en az 2 m uzunluk istediğini ve yalnız kamusal kurulumlar veya en büyük özel akvaryumlar için uygun olduğunu belirtir. Uzman arowana kurulum kaynağının doğrudan yayımladığı 8 × 3 × 2 ft ve yaklaşık 900 litre eşiği kullanılmış; sekiz fit yalnız birim dönüşümüyle 244 cm cepheye çevrilmiştir. Çok güçlü biyolojik filtrasyon, yüksek oksijen, haftalık büyük kısmi su değişimleri, açık yüzme alanı ve ağır, boşluksuz, darbeye dayanıklı kapak gerekir. Memeli/kanatlı eti ile hastalık taşıyabilen yem balıkları kullanılmamalıdır. Yalnız yasal, mikroçipli ve resmî belgeli üretim kökeni doğrulanan birey düşünülmeli; güncel yerel ithalat ve bulundurma kuralları satın almadan önce kontrol edilmelidir. Genel Dragone Fish satış adı bu profile otomatik bağlanmamalıdır.",
    "sourceUrl": "https://www.fishbase.se/summary/6357",
    "additionalSourceUrls": [
      "https://www.seriouslyfish.com/species/scleropages-formosus",
      "https://www.thefishcollection.com/en/care-guides/arowana-tank-setup",
      "https://cites.org/sites/default/files/documents/S-AC32-15-01.pdf"
    ],
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "violet-goby",
    "commonName": "Mor goby / Violet Goby",
    "scientificName": "Gobioides broussonnetii",
    "category": "fish",
    "group": "goby",
    "adultSizeCm": 55.3,
    "minVolumeL": 432,
    "minTankLengthCm": 120,
    "minGroup": 1,
    "temperature": [
      22,
      26
    ],
    "ph": [
      7.5,
      9
    ],
    "wasteFactor": 3.5,
    "aliases": [
      "Violet Goby",
      "Dragon Goby",
      "Dragonfish Goby",
      "Dragon Eel",
      "Peruvian Goby",
      "Amblyopus broussonetii",
      "Amblyopus broussonnetii"
    ],
    "waterTypes": [
      "brackish"
    ],
    "specificGravity": [
      1.005,
      1.015
    ],
    "communityCaution": "Görünüşüne rağmen barışçıl ve yavaş beslenen bir dip canlısıdır. Hızlı veya saldırgan türler yeme ulaşmasını engelleyebilir; yalnız aynı acı su değerlerini paylaşan sakin tank arkadaşlarıyla düşünülmelidir. İnce derisi ve zayıf görmesi nedeniyle keskin dekor kullanılmamalıdır.",
    "husbandryCaution": "FishBase 55,3 cm azami toplam boy ve doğada tatlı, acı ve deniz suyuna girebildiğini yayımlar; uzun süreli akvaryum bakımı için uzman kaynak en az 120 × 60 × 60 cm/yaklaşık 432 litre ve özgül ağırlık 1.005–1.015 aralığında acı su önerir. Birkaç santimetre derinliğinde çok ince, yumuşak kum; pürüzsüz kök/kaya veya boru sığınakları, boşluksuz kapak ve kararlı su gerekir. Doğada alg ve detritusu süzerek beslendiğinden küçük batan yemler, spirulina/alg içerikleri, artemia ve ince dondurulmuş yemler özellikle loş saatlerde hedefli verilmelidir; iri lokmalar veya yalnız etçil yem uygun değildir. Tuzluluk refraktometre ya da hidrometreyle izlenmeli, sofra tuzu yerine deniz akvaryumu tuzu kullanılmalı ve biyolojik olarak olgunlaşmamış sisteme eklenmemelidir. Genel Dragone Fish satış adı bu profile otomatik bağlanmamalıdır.",
    "sourceUrl": "https://www.seriouslyfish.com/species/gobioides-broussonnetii",
    "additionalSourceUrls": [
      "https://www.fishbase.se/summary/Amblyopus_broussonetii.html",
      "https://www.thefishcollection.com/en/care-guides/dragon-goby-care-guide"
    ],
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "plain-silver-dollar",
    "commonName": "Düz Silver Dollar",
    "scientificName": "Metynnis hypsauchen",
    "category": "fish",
    "group": "monster",
    "adultSizeCm": 18,
    "minVolumeL": 260,
    "minTankLengthCm": 180,
    "minGroup": 5,
    "temperature": [
      24,
      28
    ],
    "ph": [
      6,
      7
    ],
    "wasteFactor": 1.8,
    "aliases": [
      "Plain Metynnis",
      "Hypsauchen Silver Dollar"
    ],
    "waterTypes": [
      "freshwater"
    ],
    "predatory": true,
    "communityCaution": "Genellikle barışçıldır ancak erişkin bireyler çok küçük ve lokma boyundaki balıkları yiyebilir. Benzer boyda sakin türlerle, geniş bir akvaryumda tutulmalıdır.",
    "husbandryCaution": "En az beşli sürü için 180 × 38 cm taban ve yaklaşık 260 litre gerekir. FishBase 18 cm azami standart boy, uzman bakım kaynağı ise yaklaşık 15 cm standart boy yayımlar; biyolojik yükte daha koruyucu 18 cm kullanılır. Loş ve gölgeli düzen, geniş yüzme alanı, iyi oksijenlenme, güçlü biyolojik filtrasyon ve düzenli su değişimleri gerekir. Bitki ağırlıklı beslenir ve akvaryumdaki yumuşak yapraklı bitkileri yiyebilir. Kaynaklar tek bir akıntı eşiği yayımlamadığından akıntı değeri tahmin edilmedi. Genel Silver Dollar adı M. argenteus dahil birden fazla tür için kullanıldığından yalnız bilimsel kimlik doğrulandığında bu profil seçilmelidir.",
    "sourceUrl": "https://www.seriouslyfish.com/species/metynnis-hypsauchen",
    "additionalSourceUrls": [
      "https://www.fishbase.se/summary/11937"
    ],
    "verifiedAt": "2026-10-09"
  },
  {
    "id": "argenteus-silver-dollar",
    "commonName": "Argenteus Silver Dollar",
    "scientificName": "Metynnis argenteus",
    "category": "fish",
    "group": "monster",
    "adultSizeCm": 15,
    "minVolumeL": 260,
    "minTankLengthCm": 180,
    "minGroup": 5,
    "temperature": [
      24,
      28
    ],
    "ph": [
      6,
      7
    ],
    "wasteFactor": 1.8,
    "waterTypes": [
      "freshwater"
    ],
    "predatory": true,
    "communityCaution": "Genellikle barışçıldır ancak erişkin bireyler çok küçük ve lokma boyundaki balıkları yiyebilir. Benzer boyda sakin türlerle, geniş bir akvaryumda tutulmalıdır.",
    "husbandryCaution": "En az beşli sürü için 180 × 38 cm taban ve yaklaşık 260 litre gerekir. Uzman bakım kaynağı yaklaşık 15 cm standart boy yayımlar; FishBase 14 cm azami standart boy kaydeder ve akvaryum kayıtlarında yanlış kimlik olabileceğini belirtir. Loş ve gölgeli düzen, geniş yüzme alanı, iyi oksijenlenme, güçlü biyolojik filtrasyon ve düzenli su değişimleri gerekir. Bitki ağırlıklı beslenir ve akvaryumdaki yumuşak yapraklı bitkileri yiyebilir. Kaynaklar tek bir akıntı eşiği yayımlamadığından akıntı değeri tahmin edilmedi. Genel Silver Dollar adı M. hypsauchen dahil birden fazla tür için kullanıldığından yalnız bilimsel kimlik doğrulandığında bu profil seçilmelidir.",
    "sourceUrl": "https://www.seriouslyfish.com/species/metynnis-argenteus",
    "additionalSourceUrls": [
      "https://www.fishbase.se/summary/Metynnis_argenteus.html"
    ],
    "verifiedAt": "2026-10-09"
  },
  {
    "id": "redhook-silver-dollar",
    "commonName": "Kırmızı kancalı Silver Dollar",
    "scientificName": "Myloplus rubripinnis",
    "category": "fish",
    "group": "monster",
    "adultSizeCm": 41.5,
    "minVolumeL": 1000,
    "minTankLengthCm": 200,
    "minGroup": 5,
    "temperature": [
      23,
      27
    ],
    "ph": [
      6,
      7
    ],
    "wasteFactor": 3.5,
    "aliases": [
      "Red Hook Silver Dollar",
      "Redhook Silver Dollar",
      "Redhook Myleus",
      "Myleus rubripinnis"
    ],
    "waterTypes": [
      "freshwater"
    ],
    "predatory": true,
    "communityCaution": "Genellikle barışçıl ve sürücüdür ancak 41,5 cm'ye ulaşan erişkinler çok küçük balıkları yiyebilir. Yalnız benzer boyda sakin türlerle, çok büyük bir akvaryumda düşünülmelidir.",
    "husbandryCaution": "FishBase 41,5 cm azami toplam boy yayımlar; uzman bakım kaynaklarında yaklaşık 25–30 cm akvaryum boyu da görülür. Biyolojik yükte daha koruyucu bilimsel azami boy kullanılır. En az beşli erişkin grup için Fishipedia'nın doğrudan yayımladığı 1.000 litre ve 200 cm cephe, geniş açık yüzme alanı, çok güçlü biyolojik filtrasyon, yüksek oksijen, düzenli su değişimi ve sağlam kapak gerekir. Bitki ağırlıklı beslenir ve canlı bitkileri yer. Kaynaklar tek bir akıntı eşiği yayımlamadığından akıntı değeri tahmin edilmedi. Güçlü dişleri nedeniyle yakalama ve bakım sırasında el güvenliği sağlanmalıdır.",
    "sourceUrl": "https://www.fishbase.se/summary/Myloplus-rubripinnis",
    "additionalSourceUrls": [
      "https://www.fishipedia.fr/fr/poissons/myloplus-rubripinnis",
      "https://www.seriouslyfish.com/species/myloplus-rubripinnis",
      "https://www.fws.gov/sites/default/files/documents/Ecological-Risk-Screening-Summary-Redhook-Myleus.pdf"
    ],
    "verifiedAt": "2026-10-09"
  },
  {
    "id": "black-bar-silver-dollar",
    "commonName": "Kara bantlı Silver Dollar",
    "scientificName": "Myloplus schomburgkii",
    "category": "fish",
    "group": "monster",
    "adultSizeCm": 42,
    "minVolumeL": 700,
    "minTankLengthCm": 180,
    "minGroup": 5,
    "temperature": [
      23,
      27
    ],
    "ph": [
      6,
      7
    ],
    "wasteFactor": 3.5,
    "aliases": [
      "Black-bar Silver Dollar",
      "Black-barred Silver Dollar",
      "Black-barred Myleus",
      "Black-ear Pacu",
      "Disc Pacu",
      "Disk Tetra",
      "Myleus schomburgkii"
    ],
    "waterTypes": [
      "freshwater"
    ],
    "predatory": true,
    "communityCaution": "Genellikle barışçıl ve sürücüdür ancak erişkinler çok küçük balıkları yiyebilir. Yalnız benzer boyda sakin türlerle, çok büyük bir akvaryumda düşünülmelidir.",
    "husbandryCaution": "FishBase 42 cm azami standart boy ve ciddi ısırık oluşturabilecek güçlü dişler yayımlar. Eski uzman profil 12 cm, 173 litre/120 cm bildirirken güncel bilimsel azami boy bunun çok üzerindedir; küçük değer uzun süreli erişkin planında kullanılmadı. Erişkin en az beşli grup için güncel uzman satış kaynağının doğrudan yayımladığı 700 litre veya daha büyük ve 180–200 cm cephe kullanılır. Geniş açık yüzme alanı, çok güçlü biyolojik filtrasyon, yüksek oksijen, düzenli su değişimi, loş sığınaklar ve boşluksuz sağlam kapak gerekir. Bitki ağırlıklı beslenir ve canlı bitkileri yer. Kaynaklar tek bir akıntı eşiği yayımlamadığından akıntı değeri tahmin edilmedi; yakalama ve bakım sırasında el güvenliği sağlanmalıdır.",
    "sourceUrl": "https://www.fishbase.se/summary/Myloplus-schomburgkii.html",
    "additionalSourceUrls": [
      "https://www.seriouslyfish.com/species/myleus-schomburgkii",
      "https://warehouse-aquatics.co.uk/products/black-barred-metynis-myleus-schomburgkii"
    ],
    "verifiedAt": "2026-10-09"
  },
  {
    "id": "pinto-shrimp",
    "commonName": "Pinto karides",
    "scientificName": "Caridina sp.",
    "category": "shrimp",
    "group": "shrimp",
    "adultSizeCm": 3,
    "minVolumeL": 20,
    "minGroup": 10,
    "temperature": [
      15,
      25
    ],
    "ph": [
      5,
      7.5
    ],
    "wasteFactor": 0.15,
    "aliases": [
      "Caridina Pinto",
      "Pinto Shrimp",
      "CARİDİNA PİNTO KARİDES 2 ADET"
    ],
    "communityCaution": "Bilimsel tür değil, seçilmiş ticari üretim hattıdır. En güvenli düzen tek hatlı karides akvaryumudur; balıklar yavruları veya erişkinleri avlayabilir. Başka arı, kaplan, Taiwan Bee, Pinto, Galaxy veya Fancy Caridina hatlarıyla çiftleşme seçilmiş desenin ve soy bilgisinin kaybolmasına yol açabilir.",
    "husbandryCaution": "Uzman üretici kaynağı en az 20 litre ve 10–20 bireylik başlangıç grubu; 15–25 °C, pH 5,0–7,5, GH 3–10 ve KH 0–3 yayımlar. Aktif karides toprağı, RO suyun uygun arı karidesi mineral tuzuyla hazırlanması, olgun biyofilm, düşük nitrat, yüksek oksijen, karides güvenli filtre emişi ve bakırsız bakım gerekir. Bu ticari hattın kesin tür/ebeveyn bileşimi köken belgesi olmadan belirlenemez; Caridina cantonensis veya Caridina logemanni diye kesinleştirilmemelidir.",
    "tankLengthDataNote": "Bakım kaynağı litre ve başlangıç grubu yayımlıyor ancak santimetre cinsinden minimum akvaryum uzunluğu vermiyor; tahmini uzunluk kullanılmadı.",
    "sourceUrl": "https://www.garnelio.de/en/red-pinto-shrimp-shadow-shrimp-taiwan-bee-caridina-sp.",
    "additionalSourceUrls": [
      "https://www.tfrin.gov.tw/theme_data.php?id=4981&sub_theme=special_message&theme=book_data",
      "https://www.garnelio.de/en/more/blog/shrimp/shrimp-keeping-bee-shrimp-and-tiger-shrimp",
      "https://doi.org/10.11646/zootaxa.3889.2.1",
      "https://www.garnelio.de/en/black-pinto-shrimp-shadow-shrimp-taiwan-bee-caridina-sp",
      "https://niade.com/freshwater-aquarium-shrimp-genetics/",
      "https://www.cikletistpetshop.com/caridina-pinto-karides-2-adet"
    ],
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "galaxy-fishbone-shrimp",
    "commonName": "Galaxy Fishbone karides",
    "scientificName": "Caridina sp.",
    "category": "shrimp",
    "group": "shrimp",
    "adultSizeCm": 3,
    "minVolumeL": 20,
    "minGroup": 10,
    "temperature": [
      15,
      25
    ],
    "ph": [
      5,
      7.5
    ],
    "wasteFactor": 0.15,
    "aliases": [
      "Galaxy Fishbone Shrimp",
      "Caridina Galaxy Fishbone",
      "CARİDİNA GALAXY FİSHBONE KARİDES 2 ADET"
    ],
    "communityCaution": "Bilimsel tür değil, seçilmiş ticari üretim hattıdır. En güvenli düzen tek hatlı karides akvaryumudur; balıklar yavruları veya erişkinleri avlayabilir. Başka arı, kaplan, Taiwan Bee, Pinto, Galaxy veya Fancy Caridina hatlarıyla çiftleşme seçilmiş desenin ve soy bilgisinin kaybolmasına yol açabilir.",
    "husbandryCaution": "Uzman üretici kaynağı en az 20 litre ve 10–20 bireylik başlangıç grubu; 15–25 °C, pH 5,0–7,5, GH 3–10 ve KH 0–3 yayımlar. Aktif karides toprağı, RO suyun uygun arı karidesi mineral tuzuyla hazırlanması, olgun biyofilm, düşük nitrat, yüksek oksijen, karides güvenli filtre emişi ve bakırsız bakım gerekir. Bu ticari hattın kesin tür/ebeveyn bileşimi köken belgesi olmadan belirlenemez; Caridina cantonensis veya Caridina logemanni diye kesinleştirilmemelidir.",
    "tankLengthDataNote": "Bakım kaynağı litre ve başlangıç grubu yayımlıyor ancak santimetre cinsinden minimum akvaryum uzunluğu vermiyor; tahmini uzunluk kullanılmadı.",
    "sourceUrl": "https://www.garnelio.de/en/galaxy-fishbone-pinto-lower-grade",
    "additionalSourceUrls": [
      "https://www.tfrin.gov.tw/theme_data.php?id=4981&sub_theme=special_message&theme=book_data",
      "https://www.garnelio.de/en/more/blog/shrimp/shrimp-keeping-bee-shrimp-and-tiger-shrimp",
      "https://doi.org/10.11646/zootaxa.3889.2.1",
      "https://www.cwa.com.tw/blog/Invertebrate/Black-Galaxy-Fishbone.htm",
      "https://www.cikletistpetshop.com/caridina-galaxy-fishbone-karides-2-adet"
    ],
    "verifiedAt": "2026-10-05"
  },
  {
    "id": "red-swamp-crayfish",
    "commonName": "Kırmızı bataklık kereviti",
    "scientificName": "Procambarus clarkii",
    "category": "other",
    "group": "crayfish",
    "adultSizeCm": 12,
    "minVolumeL": 100,
    "minGroup": 1,
    "temperature": [
      20,
      25
    ],
    "ph": [
      6.5,
      8.5
    ],
    "flow": "low",
    "wasteFactor": 2,
    "aliases": [
      "Red Swamp Crayfish",
      "Red Swamp Crawfish",
      "Louisiana Crayfish",
      "Louisiana Crawfish",
      "Cambarus clarkii"
    ],
    "predatory": true,
    "speciesOnly": true,
    "communityCaution": "Bölgeci, fırsatçı ve güçlü kıskaçlıdır; balıkları, karidesleri, salyangozları, bitkileri ve diğer kerevitleri yaralayabilir veya yiyebilir. Tek bireylik tür akvaryumu en güvenli düzendir; birden fazla birey özellikle kabuk değişimi sırasında ciddi yaralanma ve yamyamlık riski taşır.",
    "husbandryCaution": "USGS ve USFWS erişkinlerde 5,5–12 cm boy bildirir. Doğrudan akvaryum profili en az 100 litre, berrak su ve düşük akıntı önerir; bilimsel yetiştiricilik kaynağının 20–25 °C ve pH 6,5–8,5 optimum aralığı kullanılmıştır. Sağlam ve ayrı mağaralar, görüş bariyerleri, kazmaya uygun güvenli taban, güçlü biyolojik filtrasyon, yüksek oksijen, sıfır amonyak/nitrit, mineralce yeterli su ve tamamen kaçışsız kapak gerekir. Bitkileri sökebilir, dekorun altını kazabilir ve yüksek atık üretir. USFWS türü yüksek istilacılık riski olarak değerlendirir; USGS çok sayıda yerli olmayan popülasyon kaydeder. Kerevit vebası taşıyabildiğinden canlı, su, bitki, dekor veya ekipman başka kerevit sistemlerine ya da doğaya aktarılmamalı; sahiplik ve taşıma için yerel mevzuat önceden kontrol edilmelidir.",
    "tankLengthDataNote": "Doğrudan akvaryum kaynağı 100 litre minimum yayımlıyor ancak santimetre cinsinden minimum tank uzunluğu vermiyor; tahmini uzunluk kullanılmadı.",
    "sourceUrl": "https://www.b-aqua.com/pages/Fiche.aspx?Id=3586",
    "additionalSourceUrls": [
      "https://nas.er.usgs.gov/Queries/FactSheet.aspx?SpeciesID=217",
      "https://www.fws.gov/sites/default/files/documents/Ecological-Risk-Screening-Summary-Red-Swamp-Crayfish.pdf",
      "https://www.unipu.hr/fileadmin/datoteke/Znanost_o_moru/Obavijesti/MARIKULTURA_Aquaculture_Principles_and_Practices__2nd_edition.pdf"
    ],
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "marbled-crayfish",
    "commonName": "Mermer kerevit",
    "scientificName": "Procambarus virginalis",
    "category": "other",
    "group": "crayfish",
    "adultSizeCm": 13,
    "minVolumeL": 75,
    "minGroup": 1,
    "temperature": [
      18,
      25
    ],
    "ph": [
      7,
      8
    ],
    "flow": "low",
    "wasteFactor": 1.8,
    "aliases": [
      "Marbled Crayfish",
      "Marmorkrebs",
      "Self-cloning Crayfish",
      "Procambarus fallax f. virginalis"
    ],
    "predatory": true,
    "speciesOnly": true,
    "communityCaution": "Bölgeci, fırsatçı ve üreme baskısı çok yüksek bir kerevittir; balıkları, karidesleri, salyangozları, bitkileri ve kabuk değiştiren diğer kerevitleri yaralayabilir veya yiyebilir. Tek bireylik tür akvaryumu en güvenli düzendir; ancak tek birey dahi eş olmadan çoğalabildiği için yavru kontrol ve yasal sahiplendirme planı kurulmadan edinilmemelidir.",
    "husbandryCaution": "Québec hükûmeti erişkinlerde 13 cm'ye kadar boy bildirir. Doğrudan tür bakım kaynağı tek birey için en az 75 litre, 18–25 °C ve pH 7,0–8,0 yayımlar; santimetre cinsinden minimum tank uzunluğu vermediğinden uzunluk tahmin edilmedi. Ayrı ve sağlam mağaralar, görüş bariyerleri, mineralce yeterli kararlı su, güçlü biyolojik filtrasyon, sıfır amonyak/nitrit ve tamamen kaçışsız kapak gerekir. Tüm bireyler dişidir ve apomiktik partenogenezle çoğalır; USFWS tek bireyin yeni popülasyon kurabildiğini, çeşitli ülkelerde yerli olmayan popülasyonların yerleştiğini ve bazı bölgelerde sahiplik/ticaret yasakları bulunduğunu bildirir. Kerevit vebası etkeni Aphanomyces astaci'yi taşıyabildiğinden canlı, yumurta, su, bitki, dekor veya ekipman doğaya, kanalizasyona ya da başka kerevit sistemlerine aktarılmamalı; edinmeden önce güncel yerel mevzuat kontrol edilmelidir.",
    "tankLengthDataNote": "Doğrudan tür bakım kaynağı 75 litre minimum yayımlıyor ancak santimetre cinsinden minimum tank uzunluğu vermiyor; tahmini uzunluk kullanılmadı.",
    "sourceUrl": "https://tankbud.com/species/marbled-crayfish",
    "additionalSourceUrls": [
      "https://www.fws.gov/sites/default/files/documents/Ecological-Risk-Screening-Summary-Marbled-Crayfish.pdf",
      "https://www.quebec.ca/agriculture-environnement-et-ressources-naturelles/faune/animaux-sauvages-quebec/fiches-especes-fauniques/ecrevisse-marbree",
      "https://iucngisd.org/gisd/pdf.php?sc=1943"
    ],
    "verifiedAt": "2026-10-27"
  }
];

// Bu dört kaydın kimliği doğrulanmış olsa da zorunlu bakım eşikleri yalnız
// mağaza/ikincil bakım profillerinden geliyor. Onaylı omurgasız kaynaklarından
// tür/hattın minimum hacmi ve su aralığı doğrulanana kadar sağlık hesabına
// katılmazlar; kullanıcı aramasında catalog-species-unresolved açıklaması
// gösterilir.
const quarantinedRecoveredSpeciesIds = new Set([
  "pinto-shrimp",
  "galaxy-fishbone-shrimp",
  "least-dwarf-crayfish",
  "red-swamp-crayfish",
  "marbled-crayfish",
]);

export const recoveredSpeciesCatalog = recoveredSpeciesCandidates.filter(
  (profile) => !quarantinedRecoveredSpeciesIds.has(profile.id),
);

// Bir aday güvenlik nedeniyle karantinaya alındığında aynı kimliğin eski,
// daha zayıf kaynaklı genişletilmiş kaydı geri düşmemelidir. Bu küme bu yüzden
// yalnız seçilebilir kayıtları değil, bütün denetlenen aday kimliklerini bastırır.
export const recoveredSpeciesIds = new Set(recoveredSpeciesCandidates.map((profile) => profile.id));
