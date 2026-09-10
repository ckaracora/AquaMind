# AquaMind proje durumu

Son güncelleme: 2026-09-09

## Doğrulanmış temel

- GitHub: `https://github.com/ckaracora/AquaMind`
- Ana dal: `main`
- Başlangıç commit'i: `7d8fb01 fix: approve sharp build dependency`
- Canlı önizleme: `https://aqua-mind-three.vercel.app/`
- Görev panosu: `https://github.com/users/ckaracora/projects/1`
- Teknoloji: Next.js 15, React 19, TypeScript, Tailwind CSS, pnpm
- `pnpm verify`: 2026-09-09 tarihinde yerelde başarılı
- Arkadaş kurulumu: `buraksenfx` hesabı collaborator; Windows kopyasında kurulum ve tüm doğrulamalar başarılı

## Mevcut veri durumu

- Kataloglar `src/data/` altında sürüm kontrollü TypeScript verisidir.
- Akvaryumlar, ölçümler, bakım, canlılar, bitkiler ve ekipmanlar şimdilik tarayıcı `localStorage` alanında saklanır.
- Kullanıcı hesabı, bulut senkronizasyonu ve gerçek veritabanı henüz yoktur.
- Supabase geçişi gelecek aşamadır; tamamlanmış gibi gösterilmemelidir.

## Ortak çalışma kurulumu

- [x] GitHub collaborator eklendi
- [x] Proje arkadaşın Windows bilgisayarına klonlandı
- [x] Bağımlılıklar kuruldu ve `pnpm verify` geçti
- [x] Ortak talimat belgeleri hazırlandı ve GitHub'a gönderildi
- [x] GitHub görev şablonları, devir sistemi, etiketler ve ortak görev panosu etkinleştirildi
- [x] GitHub Actions otomatik doğrulaması (Issue #2) `main` dalına birleştirildi ve etkinleştirildi
- [ ] Ortak katalog araştırma tablosu şimdilik ertelendi; katalog verisi sürüm kontrollü dosyalar ve kaynak bağlantılarıyla ilerliyor
- [ ] Supabase tasarımı ve geçişi yapılacak
- [x] İki bilgisayarlı devir provası tamamlandı

## Sıradaki tek iş

`codex/catalog-capacity-batch` dalındaki katalog çalışması sürüyor. Jeneca 410 ekipmana ve kapasite gerektiren 186 kaydın 183'ünde doğrulanmış otomatik hesap verisine ulaştı (%98); sayı yayımlanmayan eski/özel modeller tahmin edilmeden açıklamalı biçimde hesap dışında tutuluyor. Canlı profilleri akvaryumun freshwater / saltwater / brackish türüyle eşleştiriliyor; seçici uyumsuz canlı ve boş ana kategori göstermiyor, sağlık analizi eski/uyumsuz kayıtlarda tehlike uyarısı veriyor. Cikletist'in cüce ciklet envanterindeki 26 başlığın tamamı doğrulanmış profile bağlıdır. Vatoz/kedi balığı envanterindeki 56 başlığın 47'si doğrulanmış profile bağlıdır; bilimsel kimliği güvenle belirlenemeyen dokuz satış adı aramada açıklamalı ve eklenemez biçimde gösteriliyor. Yılan/müren kategorisindeki sekiz doğrulanmış profile ek olarak kimliği veya bakım eşiği belirsiz dört satış adı da aynı güvenlik akışına alındı. Afrika Arowanası ve Çin Ejderi güvenilir kimlik ve bakım kaynaklarıyla Monster profillerine bağlandı; Monster grubu 31 doğrulanmış profile ulaştı ve canlı sitedeki 21 başlığın tamamı yeniden doğrulandı. Cikletist Canlı Doğuranlar kategorisindeki iki sayfa ve 26 satış başlığının tamamı regresyon kapsamındadır; 25 başlık güvenli profile bağlı, tür belirtmeyen `ALBİNO SKY BLUE` açıklamalı güvenlik kaydıdır. Cikletist Betta kategorisindeki yem dışındaki 14 canlı başlığı da tam regresyon kapsamındadır; 13 başlık kaynaklı profile bağlı, türü belirsiz `MEYAN KÖKÜ GURAMİ` açıklamalı güvenlik kaydıdır. Japon/Oranda kategorisindeki 18 satış kaydının tamamı Japon balığı veya koi profiline bağlıdır; Japon balığı ek birey hacmi artık adet üzerinden otomatik hesaplanır. Labirentli Balıklar kategorisindeki 15 başlığın 13'ü kaynaklı profile bağlıdır; yalnız genel `Gurami` ve `MEYAN KÖKÜ GURAMİ` açıklamalı güvenlik kayıtlarıdır. Tetra Türleri ana kategorisinin altı güncel sayfasındaki 129 satış satırının 100'ü kaynaklı profile bağlıdır; kimliği veya güvenli su türü belirlenemeyen 29 satır, 28 benzersiz açıklamalı güvenlik kaydıyla kapsanır. Havuz Balıkları kategorisindeki sekiz güncel satış başlığının beşi koi, üçü Japon balığı profiline bağlıdır; Tül Kuyruk/Longfin koi ayrı tür olarak çoğaltılmamıştır ve mağaza başlıklarındaki yinelenen boşluklar artık güvenli eşleşmeyi bozmaz. Cikletist Balık Çeşitleri ana kategorisinin 16 güncel sayfasındaki 384 satış satırının 315'i doğrulanmış profile, 66'sı açıklamalı güvenlik kaydına bağlandı; canlı olmayan üç satır canlı kataloğundan açıkça dışlandı. Çözülmemiş görünür kayıt sayısı 61'dir. Ekipmanda kalan 10 açıklamalı kapasite boşluğunun üçü çelişkili, yedisi yayımlanmamış veridir ve tahmin edilmeden güvenlik hesabı dışında tutulur. Sıradaki iş, kalan açıklamalı canlı kayıtlarından bilimsel adı açıkça verilenleri güvenilir kimlik ve bakım kaynaklarıyla küçük gruplar halinde doğrulamaktır.

## Oturum sonu devir şablonu

- Yapılan görev:
- Değişen dosyalar:
- Çalıştırılan kontroller:
- Sonuç:
- Bilinen hata veya risk:
- GitHub'a gönderildi mi:
- Vercel'e yayımlandı mı:
- Sonraki tek iş:

## 2026-08-28 Cikletist vatoz ve kedi balığı karşılaştırması

- Cikletist'in güncel `Vatoz Kedi Balıkları` kategorisindeki üç sayfa doğrudan karşılaştırıldı; toplam 56 satış başlığı regresyon kapsamına alındı.
- Mevcut güvenli profillere bağlanan Ancistrus varyeteleri, Otocinclus ticari adları, SAE, Red Tail Catfish, Red Lizard, Senegal bichir, Sterbai ve L106 adlarıyla birlikte 43 başlık doğrulanmış sağlık profiline bağlandı.
- Yirmi yedi eksik profil kaynaklı bakım eşikleriyle eklendi: Delhezi bichir (`Polypterus delhezi`), Hujeta gar (`Ctenolucius hujeta`), L128 Blue Phantom (`Hemiancistrus sp. L128`), L129 Kolombiya Zebra (`Hypancistrus debilittera`), L190 Royal Pleco (`Panaque nigrolineatus`), L201 Orinoco Angel (`Hypancistrus sp. L201`), L239 Blue Panaque (`Baryancistrus beggini`), L340 Mega Clown (`Hypancistrus sp. L340`), L091 Three Beacon (`Leporacanthicus triactis`), L240 Vampir (`Leporacanthicus sp. L240`), L052 Kelebek (`Dekeyseria picta`), L243 Orange Tiger (`Peckoltia wernekei`), L116 Red Fin Thresher (`Aphanotorulus emarginatus`), LDA72 Three-ray Bristlenose (`Ancistrus triradiatus`), L149 Cucuta Bristlenose (`Ancistrus sp. L149`), L191 Brokenline Royal (`Panaque sp. L191`), L244 Black Spotted Flyer (`Pseudolithoxus dumus`), L200A High-fin Green Phantom (`Baryancistrus demantoides`), L059A Blue-spotted Bristlenose (`Ancistrus hoplogenys`), L235 Anthrax Flyer (`Pseudolithoxus anthrax`), L127 Lujan vatozu (`Peckoltia lujani`), Orange Venezuela Cory (`Osteogaster venezuelanus`), Green Laser CW009 (`Corydoras sp. CW009`), Rabauti Cory (`Osteogaster rabauti`), Highfin Spotted CW027 (`Hoplisoma sp. CW027`), White Spotted Doras (`Agamyxis pectinifrons`) ve LDA38 Orinoco Wood Pleco (`Hypostomus plecostomoides`). Büyük/avcı türlerde akvaryum uzunluğu, sosyal grup, kaçış, yüksek atık ve avlanma riskleri kullanıcı uyarılarına işlendi.
- L201 mağaza başlığındaki `Hypancistrus inspector` ifadesi kesin bilimsel kimlik olarak kullanılmadı; bu adın benzer benekli Hypancistruslarla karışabildiği kullanıcı uyarısına işlendi.
- Kalan 13 ticari ad; mağaza sayfası bilimsel kimlik vermediği, L-numarası ile yazılı ad çelişebildiği veya güvenli bakım eşiği henüz doğrulanmadığı için tahminle eşleştirilmedi. `L-069 Peckoltia Ucayalensis` başlığı özellikle çözülmemiş tutuldu: güncel L-numarası kaynakları L069'u `Ancistrini sp.` olarak verirken `Peckoltia ucayalensis` başka numaralarla ilişkilendiriliyor. `L-103 CLOWN PLECO` da L103'ün güvenilir kaynaklarda `Peckoltia sp.` olarak geçmesi ve palyaço vatoz ticari adının başka türler için kullanılması nedeniyle `Panaqolus maccus` profiline bağlanmadı. Pangasius ve goby gibi yalnızca genel ticari ad taşıyan başlıklar da satıcı bilimsel kimlik yayımlamadığı için çözülmemiş durumda. Bu başlıkların yanlış profile bağlanmaması ayrıca test ediliyor.
- Tam doğrulama: `pnpm verify` başarılı; TypeScript, 56 başlıklı Cikletist regresyonu dahil katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel: bu paket henüz gönderilmedi ve yayımlanmadı.
- Sonraki tek iş: Cikletist listesindeki kalan 13 çözülmemiş başlığı, bilimsel kimliği açık olanlardan başlayarak küçük gruplar halinde doğrulamak.

## 2026-08-26 katalog kapasite paketi

- Aktif dal: `codex/catalog-capacity-batch`
- Boyu SES-10 hava kompresörünün 10 L/dakika (600 L/saat), 10 W ve 0,02 MPa teknik verileri iki güvenilir Türkiye kaynağında doğrulandı; doğrudan ürün kaynağı katalog kaydına işlendi.
- Nubios NW-450F, NW-600F, NW-800F, NW-1500F, NB-1500F, YU-118C ve YU-119C için güvenilir debi verisi bulunamadı. YU-118C adıyla yayımlanan bir sayfanın Xinyou XY-2900 verisini yanlış kopyaladığı görüldüğü için bu değerler kullanılmadı.
- Aquawing AQ-A3000 için 25 W güç doğrulandı ancak hava debisi; Boyu SP-1300C içinse kapasite verileri yayımlanmadı. İki kayıt da otomatik kapasite hesabının dışında bırakıldı. Haqos EASY-1000AT, Aqua Flow 250 ve Thermo-Sprite resmî katalogda doğrulandı; resmî sayfalarda teknik değerler metin olarak yayımlanmadığı ve görsel sunucusu erişilemediği için başka markalara ait benzer model değerleri kopyalanmadı.
- `pnpm verify`: başarılı; TypeScript, katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel: bu paket henüz gönderilmedi ve yayımlanmadı.
- Regent'in güncel Türkiye portföyündeki 6500, 7500, 8500 ve 9500 modellerinin katalogda bulunduğu doğrulandı. Eski/yurt dışı 5500 kaydının yanlışlıkla 9500 ürününe giden kaynağı, 2 W ve 80 L/saat değerlerini yayımlayan doğrudan 5500 sayfasıyla değiştirildi; Calm RC-006 bağımsız kaynağıyla korundu.
- XLPro'nun Türkiye dağıtıcı ve perakendeci listelerindeki altı güncel filtre modelinin tamamının katalogda bulunduğu doğrulandı. Mini seri adları gerçek model kodları olan MINI-230, MINI-500 ve MINI-500AT biçimine getirildi; MINI-500AT doğrudan ürün kaynağına bağlandı ve yayımlanan 100 litre üst sınırı eklendi.
- Xinyou'nun güncel marka sayfasındaki dokuz sünger filtre modelinin tamamının katalogda doğru hacim üst sınırları ve hava motoru gereksinimiyle bulunduğu doğrulandı. Türkiye'de kullanılan diğer eski modeller ve XY-2010 köşe filtresi ayrıca korundu; güncel dokuz model için regresyon kapsamı eklendi.
- Meç'in güncel Türkiye marka sayfasındaki dokuz satış kalemi, paket adetleri birleştirildiğinde altı aksesuar ailesidir ve altısı da katalogda bulunuyor. Ayrı kaynaklarla doğrulanan sekiz pipo/üretim filtresinin tamamı hava motoru gerektiren filtre olarak korunuyor.
- RS Electrical'ın Türkiye yetkili satıcı marka sayfasındaki 29 güncel satış kaleminin tamamı katalogda doğrulandı: yedi FA askı filtre, üç tepe/UV filtre, üç hava motoru, altı I399 çelik ısıtıcı, dört 758 cam ısıtıcı ve beş bakım/soğutma ürünü. Eski/yurt dışı doğrulanmış modeller ayrıca korundu; marka toplamı 42 ekipmana ulaştı.
- RS-288 tepe filtrenin eski 1000 L/saat değeri doğrudan ürün sayfasındaki 1200 L/saat, 15 W ve 240 litre verisiyle düzeltildi. FA serisinin debi, güç, hacim üst sınırı ve ayarlanabilir akış bilgileri doğrudan ürün kaynaklarına bağlandı.
- RS 313 ve RS 960 hava motorları otomatik kapasite hesabına girecek doğrulanmış debilerle eklendi. RS 1000 için yetkili satıcının teknik tablosundaki toplam 9 L/dakika değeri aynı model serisini listeleyen bağımsız kaynaklarla doğrulandı; 540 L/saat, 8 W, 200 litre ve ayarlanabilir akış bilgileri otomatik hava kapasitesi hesabına alındı.
- RS Electrical katalog denetimi: kapasite gerektiren 38 kaydın 38'i hazır (%100); güncel 29 ürün için regresyon kapsamı eklendi ve hedefli katalog testi geçti.
- Tropica'nın resmî Plant Care sayfasındaki güncel aileler karşılaştırıldı: iki CO₂ sistemi, üç CO₂ aksesuarı, üç bakım aleti, dört bitki besini, bir su düzenleyici ve üç taban ürünü olmak üzere 16 ürün ailesinin tamamı katalogda bulunuyor.
- Tropica bakım ürünlerindeki genel marka bağlantıları doğrudan resmî ürün sayfalarıyla değiştirildi. Ayrı ürün sayfası yayımlanmayan CO₂ System Bio, resmî genel sayfadaki 60 litre sınırına bağlandı; eski cımbız bağlantısı güncel Tweezers sayfasıyla yenilendi.
- Tropica için model tamlığı, kategori ayrımı, doğrudan kaynak ve güncel doğrulama tarihi regresyon kapsamına alındı.
- Mufan'ın Türkiye yetkili satıcı portföyü seçenek düzeyinde doğrulandı: beş çelik CO₂ difüzörü, üç regülatör, dört filtre süngeri, beş paslanmaz emiş/basış seti ve yedi bakım aksesuarı olmak üzere 24 güncel varyantın tamamı katalogda bulunuyor.
- Eksik olan beş emiş/basış seti varyantı ile ayrı damla sayaçlı çift göstergeli regülatör eklendi. W21.8 regülatörler, difüzörler ve bakım aksesuarları mümkün olan yerlerde doğrudan yetkili satıcı ürün sayfalarına bağlandı; uluslararası kaynaklarla doğrulanan eski CO₂ aksesuarları ayrıca korundu.
- Mufan güncel Türkiye model tamlığı, doğrudan kaynak ve aksesuarların otomatik filtre kapasitesi hesabına karışmaması regresyon kapsamına alındı.
- Yikeda'nın Türkiye yetkili satıcı akvaryum portföyü seçenek düzeyinde doğrulandı: iki SD-48A, dört YKD optik LED, yedi RGB armatür, iki ayaklı LED, üç Smart UFO ve altı Tray Light olmak üzere 24 güncel modelin tamamı katalogda bulunuyor.
- Eksik XT-4W, SD-T8-1800JL ve üç Tray Light varyantı eklendi. Genel adla tutulan 35 W ve 65 W armatürler gerçek SD-1035 ve SD-1065 model kodlarına çevrildi; SD-1035 için 2960 lümen, SD-T8-1800JL için 1960 lümen doğrulandı.
- Türkiye portföyü dışında daha önce doğrulanan dört eski Yikeda model ayrıca korundu; güncel model tamlığı, doğrudan kaynaklar ve kritik güç/uzunluk/lümen verileri regresyon kapsamına alındı.
- Haqos'un resmî güncel filtre, pompa, UV, ısıtıcı, aydınlatma ve skimmer aileleri karşılaştırıldı. On resmî filtre kaydı doğrudan üretici ürün sayfalarına bağlandı; altı pompa, iki UV cihazı, iki ısıtıcı ailesi, dört aydınlatma, bir skimmer ve doğrulanabilir aksesuarlar eklendi.
- Türkiye'de güncel satışı doğrulanan BIOPRO B-600 dip süpürgesi, Solaris 508 aydınlatma ve OverBox 5000 L/saat ayrıca kataloglandı. Haqos toplamı 48 ekipman ve beş kategoriye ulaştı.
- Kaynakta yayımlanmayan debi, güç ve hacim değerleri tahmin edilmedi. EASY-1000AT, Aqua Flow 250 ve Thermo-Sprite otomatik kapasite hesabının dışında açıklamalı biçimde tutuldu; Haqos'ta kapasite gerektiren 21 kaydın 18'i hazır (%86).
- Resmî sitede yalnızca `38X50`, `30X30`, `25X50`, `25X25` ve `20X30` adlarıyla yayımlanan beş aksesuarın ürün türü sayfa metninden doğrulanamadı. Yanlış kategori üretmemek için bu kayıtlar eklenmedi; ürün türü doğrulanınca yeniden ele alınacak.
- Haqos model tamlığı, doğrudan filtre kaynakları, pompa ve aydınlatmalarda değer uydurulmaması, UV güçleri ve ısıtıcı kapasite güvenliği regresyon kapsamına alındı.
- Haqos sonrasında `pnpm verify` başarılı: TypeScript, katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- Resun'un güncel Türkiye stok listesinde doğrulanan 10 ürünün tamamı katalogda bulunuyor. Resmî üretici portföyünden 29 filtre, beş UV cihazı, 41 su/dalga pompası, 22 hava pompası, dokuz ısıtıcı ailesi/modeli, dört aydınlatma, yedi soğutucu ailesi/modeli, 25 aksesuar ve beş filtre pedi kapsam altına alındı.
- Resun toplamı 180 ekipman, beş bakım ürünü ve altı ekipman kategorisine ulaştı. AIR-3000 hava pompasının toplam debisi güncel doğrudan Türkiye ürün kaynağına göre 360 L/saat olarak düzeltildi; AIR-1000, AIR-2000 ve CX-400 değerleri de doğrudan ürün sayfalarıyla yenilendi.
- Resmî Resun sayfalarındaki bazı teknik tablolar yalnızca görsel olarak yayımlandığı ve güvenli metin verisi bulunmadığı için değerler tahmin edilmedi. Kapasite gerektiren 75 kaydın 15'i hesaplamaya hazır; kalan 60 kayıt, neden otomatik kapasite hesabına alınmadığını açıklayan `capacityDataNote` ile tutuluyor.
- Resun regresyon kapsamı; Türkiye stok listesi, filtre/UV/pompa/hava pompası/ısıtıcı/aydınlatma/soğutucu/aksesuar aileleri, kaynak bağlantıları, doğrulama tarihleri ve teknik değer uydurulmaması kontrollerini içeriyor.
- Resun sonrasında `pnpm verify` 2026-08-27 tarihinde başarılı: TypeScript, 512 bakım ürünlü katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. `git diff --check` yalnızca satır sonu dönüşüm uyarıları verdi; içerik hatası bulunmadı.
- CO2Art'ın resmî güncel tüm ürünler, regülatörler, tam setler ve aksesuar koleksiyonları karşılaştırıldı. Akvaryumla ilgili 29 ürün ailesinin tamamı katalogda bulunuyor; tişört ve hediye kartı akvaryum ekipmanı olmadığı için kapsam dışında bırakıldı.
- Eksik dokuz CO2Art ürünü eklendi: üçlü adaptör contası, üçlü regülatör pulu, sekizli vantuz, tek kullanımlık tüp adaptörü tamir kiti, IO difüzör membranı, 12 V DC solenoid bobini, inline atomizer membranı, SodaStream adaptör tamir kiti ve evrensel 12 V DC güç adaptörü.
- Önceden koleksiyon/genel sayfalara bağlı CO2Art kayıtları doğrudan resmî ürün sayfalarına taşındı. Pro-Elite V2 için 5–5000 litre, 12 V DC ve azami 5 bar değerleri; membran ölçüleri ve regülatör bağlantı standartları resmî kaynaklardan güncellendi.
- CO2Art 29 ürün tamlığı, doğrudan kaynak, 2026-08-27 doğrulama tarihi ve kritik teknik değerleri regresyon kapsamına alındı; hedefli katalog testi geçti.
- CO2Art sonrasında `pnpm verify` başarılı: TypeScript, katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. `git diff --check` içerik hatası göstermedi.
- SunSun'ın güvenilir Türkiye marka sayfasındaki 44 güncel ürün bağlantısının tamamı katalogla karşılaştırıldı. Önceden katalogda bulunmayan 28 ürün/model eklendi; mevcut uluslararası ve eski doğrulanmış modeller korunarak marka toplamı 77 ekipman ve dört kategoriye ulaştı.
- Yeni kapsam; 502, 503 ve 604B kompakt dış filtreler, AD120/AD200/AD260 aydınlatmalar, ACO-006 ve PG blower hava motorları, JP iç filtreler, JVP dalga motorları, nano akvaryumlar ile emiş/basış setleri ve bakım aksesuarlarını içeriyor.
- 604B için 800 L/saat ve 14 W değerleri Türkiye kullanım kılavuzundan; JP-025F için 1600 L/saat, 35 W ve 120–600 litre; ACO-006, PG-180 ve PG-250 için yayımlanan hava debileri doğrudan ürün sayfalarından işlendi. m³/saat ve L/dakika değerleri L/saat birimine açık biçimde dönüştürüldü.
- SunSun 502 için iki bağımsız kaynakta ortak yayımlanan 320 L/saat ve 60 litre değerleri işlendi; güç kaynaklarda 5 W ve 6 W olarak çeliştiği için boş bırakıldı. Güncel Türkiye 503 modeli iki güncel ürün kaynağında doğrulanan 600 L/saat ve 6 W değerleriyle otomatik filtrasyon hesabına alındı. JVP dalga motorları filtrasyon ekipmanı gibi değerlendirilmedi.
- SunSun katalog denetimi: kapasite gerektiren 48 kaydın 48'i hazır (%100). 77 kayıt toplamı, 28 güncel Türkiye eki, çapraz kaynaklar, kaynak/tarih zorunluluğu ve kritik teknik değerler regresyon kapsamına alındı.
- SunSun sonrasında `pnpm verify` 2026-08-27 tarihinde başarılı: TypeScript, yedi ekipman kategorili ve 512 bakım ürünlü katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- Dennerle'nin resmî mağazasındaki 240 güncel ürün ailesi toplu ürün verisi ve kategori sayfalarıyla karşılaştırıldı. Uygulamanın kurulu ekipman, bakım ürünü ve sarf malzemesi akışına giren ürünler aile ve teknik varyant düzeyinde ayrıldı; mobilya, promosyon ürünü, salt yedek parça ve boş akvaryumlar ekipman seçicisini gereksiz kalabalıklaştırmamak için kurulu cihaz gibi gösterilmedi.
- Dennerle ekipman kapsamı 22'den 87 kayda çıktı. Beş daytime onex black varyantı, Trocal Flat 35, üç güç kaynağı, güncel Carbo Bio/Soda/Power/Night sistemleri, basınç düşürücüler, tüpler, difüzörler, dört Flipper kapasitesi, ozmoz sistemi, temizlik araçları ve filtre aksesuarları doğrudan resmî ürün sayfalarıyla eklendi.
- onex20–onex80 ailesinde 4,8–21,6 W güç, 864–3888 lm ışık ve 20–84 cm akvaryum uzunluğu aralıkları resmî teknik tablodan işlendi. CO₂ Flipper ailesinin 60, 200, 300 ve 600 litre üst sınırları doğrulandı; bakım araçları filtrasyon kapasitesi hesabına karıştırılmadı.
- Dennerle bakım kapsamı 30'dan 111 ürün ailesine çıktı: 30 yem, 20 bitki/karbon bakımı, 11 test, 10 filtre/ozmoz medyası, sekiz su düzenleyici, üç bakteri kültürü, dokuz doğal/canlı bakım ürünü ve 20 taban ürünü. Genel site haritası kaynakları doğrudan resmî ürün sayfalarıyla değiştirildi.
- Dennerle regresyon kapsamı; 87 ekipman ve 111 bakım ürünü sayısı, kategori dağılımı, doğrudan kaynaklar, güncel doğrulama tarihi, aydınlatma güç/uzunluk değerleri ve CO₂ sistem kapasitesini içeriyor.
- Dennerle sonrasında `pnpm verify` 2026-08-27 tarihinde başarılı: TypeScript, yedi ekipman kategorili ve 593 bakım ürünlü katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. Marka denetimi sekiz kapasite gerektiren kaydın sekizinin hazır olduğunu gösterdi (%100).
- Jeneca'nın resmî ALEAS çevrim içi kataloğundaki dış/iç filtre, hava motoru, su pompası, UV, ısıtıcı, aydınlatma, hava taşı ve bakım aksesuarı aileleri model düzeyinde karşılaştırıldı. Önceki 135 kayıt 257 doğrulanmış ekle 392 ekipmana yükseldi: 107 filtre, 41 hava motoru, 21 ısıtıcı, 42 aydınlatma, beş UV ve 176 diğer cihaz/aksesuar.
- XP-03B; IPF-408/448/728/1008/1508; XP-U1/U3/U5/U6; AH-2000DC–AH-8500DC ve ZL-101/103/221/223 için üreticinin yayımladığı debi ve güç tabloları işlendi. AE UV dış filtre ailesinin beş modeli güvenilir model sayfasındaki 750–1500 L/saat, 20–30 W pompa ve 5–9 W UV verileriyle; AE-800 ise 750 L/saat, 9,3 W ve 50–80 litre bilgisiyle eklendi.
- Üreticinin AH-100000DC satırında model adı ile 10000 L/saat debi, AH-12000DC satırında ise model adı ile 120000 L/saat debi arasında olası yazım çelişkileri bulundu. Bu değerler tahmin edilmedi ve otomatik kapasite hesabına alınmadı.
- Jeneca'nın başlangıçtaki 11 yayımlanmamış kapasite boşluğu güvenli biçimde korundu. Geniş üretici portföyü eklendiğinde kapasite gerektiren kayıt sayısı 169'a, teknik verisi hazır kayıt sayısı 97'ye çıktı (%57); kalan 72 modelin her biri yayımlanmamış veri notuyla otomatik filtrasyon/hava/ısıtıcı hesabının dışında tutuluyor.
- Jeneca regresyon kapsamı 392 kayıt toplamını, altı kategori dağılımını, HTTPS kaynakları, tarih biçimini, kritik debi/güç tablolarını, olası üretici yazım hatalarının kullanılmamasını ve hava taşlarının bağımsız filtre sayılmamasını doğruluyor.
- Jeneca sonrasında `pnpm verify` 2026-08-27 tarihinde başarılı: TypeScript, yedi ekipman kategorili ve 593 bakım ürünlü katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- Twinstar'ın 2026 resmî mağazası karşılaştırıldı. Güncel premium portföy altı S Line Ver.5 ve yedi E Line Ver.5 modelinden, giriş seviyesi portföy ise yedi B Line Ver.3 modelinden oluşuyor. Waterproof Lighting ve ayrı Bluetooth Controller koleksiyonlarında bağımsız ürün yayımlanmıyor; sterilizatör koleksiyonu NANO ve NANO Plus kapasite varyantlarını içeriyor.
- Twinstar ekipman kapsamı 25'ten 40 kayda çıktı: 13 güncel Ver.5 aydınlatma ve iki elektroliz sterilizatörü eklendi; önceki E/S Line IV ve B Line Legacy modelleri tarihsel adlarıyla korundu. Güncel B Line kayıtları resmî Ver.3 adıyla yenilendi; 45B, 75B ve 120B akvaryum uzunlukları doğrudan ürün teknik bloklarına göre sırasıyla 45–55, 75–85 ve 120–125 cm olarak düzeltildi.
- NANO (30–120 L, M5) ve NANO Plus (50–250 L, M9) UV cihazı değil elektroliz sterilizatörü olduğundan yanıltıcı `uv` kategorisine konmadı. E Line Ver.5 750E sayfasında başlık, teknik üst sınır ve önerilen tank uzunluğu birbiriyle çeliştiği için bu model otomatik uzunluk uygunluk hesabının dışında bırakıldı ve çelişki ürün açıklamasında gösterildi.
- Twinstar regresyon kapsamı 40 toplam kaydı, 38 aydınlatma/iki diğer cihaz kategori ayrımını, güncel seri model sayılarını, kritik güç-lümen-uzunluk değerlerini, NANO hacimlerini ve tüm kayıtlarda HTTPS kaynak/tarih zorunluluğunu doğruluyor.
- Twinstar sonrasında `pnpm verify` 2026-08-27 tarihinde başarılı: TypeScript, yedi ekipman kategorili ve 593 bakım ürünlü katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. GitHub/Vercel'e gönderim yapılmadı.
- Sonraki marka paketi: ADA'nın güncel resmî ürün aileleri ile mevcut 10 ekipman ve 36 bakım ürünü kaydını karşılaştırmak.
- ADA'nın güncel resmî aydınlatma, CO₂, filtrasyon ve bakım araçları portföyü model/varyant düzeyinde karşılaştırıldı. Mevcut 10 ekipmana 67 doğrulanmış kayıt eklenerek marka toplamı 77 ekipmana çıktı: altı filtre, 34 CO₂ ürünü/aksesuarı, dört aydınlatma ve 33 diğer cihaz/bakım aracı.
- Güncel NA LIGHT 300, NA LIGHT 450, NA LIGHT PRO 600 ve SOLAR RGB II için üreticinin yayımladığı güç tüketimleri ile uygulanabilir akvaryum uzunlukları işlendi. SOLAR RGB II sayfası yalnızca 90 cm üst sınırı verdiği için kaynağın yayımlamadığı bir alt uzunluk uydurulmadı.
- Pollen Glass CO₂ ve AIR varyantları, CO₂ sayaçları, altı Joint Glass boyu, Forest Bottle, Clear Stand, Tower, Attache/Speed regülatörleri, CO₂ Adapter, NA Control Timer II ve EL Valve doğrudan resmî ürün sayfalarıyla eklendi. Pasif AIR difüzörleri hava motoru gibi sınıflandırılmadı; motor gereksinimleri ayrıca işaretlendi.
- VUPPA-II'nin yüzey emici olduğu ve üreticinin debi yayımlamadığı açıkça belirtildi; bağımsız ana filtre kapasitesine katılmadı. On Pro-Scissors, yedi Pinsettes ve dokuz bakım aracı `other` kategorisine eklendi.
- ADA bakım kataloğuna Bio Rio G, Bio Cube, NA Carbon ve Bamboo Charcoal filtre medyaları eklendi; marka bakım toplamı 36'dan 40'a, genel bakım kataloğu 597 ürüne çıktı.
- ADA regresyon kapsamı 77 ekipman/40 bakım ürünü sayısını, kategori dağılımını, kritik güç ve tank uzunluğu değerlerini, pasif hava difüzörü güvenliğini, VUPPA-II debisinin tahmin edilmemesini, HTTPS kaynakları ve doğrulama tarihlerini denetliyor.
- ADA sonrasında `pnpm verify` 2026-08-27 tarihinde başarılı: TypeScript, yedi ekipman kategorili ve 597 bakım ürünlü katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. ADA'da kapasite gerektiren altı ana filtrenin altısı hazır (%100).
- GitHub/Vercel: ADA paketi ve önceki yerel katalog değişiklikleri henüz gönderilmedi veya yayımlanmadı.
- Netlea'nın resmî ürün merkezi, güvenilir distribütör/satıcı sayfaları ve onaylı Türkiye mağazaları karşılaştırıldı. Önceki 33 ekipman kaydı; güncel pompalar, hava motorları, paslanmaz filtreler, aydınlatmalar ve aksesuarlarla 64 ekipmana çıkarıldı. Ayrıca 12 taban, gübre, bakteri ve filtre medyası ürünü bakım kataloğuna eklendi.
- Cikletist yerel marka sayfasında doğrulanan sekiz eksik aydınlatma eklendi: NL-6140P-AT5-D0/4, AT1 PRO 70W, AT3 PROS 65W, NL-595P-AT5-D0/2, NL-5130P-AT5-D0/2, AT1 PROS 30W, AT3 PROS 40W ve AT1 PROS 50W. Güç, LED sayısı, gövde ölçüsü ve kontrol özellikleri yalnızca sayfalarda açıkça yayımlanan kapsamda işlendi.
- Atakan'ın güncel Netlea sayfasındaki C4000, C5000, C6000, C7000, SG2500 ve SG5000 pompalarının tamamının katalogda bulunduğu doğrulandı. Cikletist'teki C9000 ve S5500 debi metinleri model adı veya diğer güvenilir kaynaklarla çeliştiği için bu değerlerle katalog değiştirilmedi; BettaMarketim'deki seramik medya sayfasının ürün başlığı ile marka alanı çeliştiğinden kayıt eklenmedi.
- G1, G2 ve Flower Cartridge pasif ön filtrelerine bağımsız pompa debisi atanmadı. No.2B, No.3B ve No.4B hava motorlarında yayımlanmayan hava debileri tahmin edilmedi. Netlea denetimi kapasite gerektiren 16 kaydın 10'unun otomatik hesaba hazır olduğunu gösteriyor (%63).
- Netlea regresyon kapsamı 64 ekipman/12 bakım ürünü sayısını, dört ekipman kategorisini, yerel sekiz aydınlatmanın yayımlanmış güçlerini, HTTPS kaynak ve tarih zorunluluğunu, pasif filtre güvenliğini ve yayımlanmayan teknik değerlerin boş bırakılmasını doğruluyor.
- Netlea sonrasında `pnpm verify` 2026-08-27 tarihinde başarılı: TypeScript, yedi ekipman kategorili ve 609 bakım ürünlü katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel: Netlea paketi ve önceki yerel katalog değişiklikleri henüz gönderilmedi veya yayımlanmadı.
- Sonraki marka paketi: Nubios'un mevcut 37 ekipman ve iki bakım ürününü güncel resmî/güvenilir portföyle karşılaştırmak; NW-450F, NW-600F, NW-800F, NW-1500F, NB-1500F, YU-118C ve YU-119C filtrelerinin yayımlanmamış debilerini onaylı yerel kaynaklarda yeniden araştırmak.
- Nubios'un mevcut ekipman ve bakım kayıtları Aquarubi, Atakan, Cikletist, BettaMarketim, Malawi İzmir ve AkvaryumExpress dahil onaylı yerel kaynaklarda yeniden karşılaştırıldı. Nano Easy renk seçenekleri aynı teknik cihazın varyantları olduğu için modeli gereksiz çoğaltmadan tek kayıtta korundu.
- Yerel portföyde bulunup katalogda olmayan altı kayıt eklendi: 5 L Küp ve 3,7 L Faunus masaüstü plastik setleri, NB-A20-INCA-S Nano Inca, DA-L25 13,5 L Küp, 7 × 7 cm karides kepçesi ve dijital termometre-higrometre. Yalnızca kaynaklarda açıkça yayımlanan hacim, ölçü ve ürün özellikleri işlendi; yayımlanmayan pompa değerleri eklenmedi.
- NW-450F, NW-600F, NW-800F, NW-1500F, NB-1500F, YU-118C ve YU-119C filtre debileri altı onaylı yerel kaynakta yeniden arandı ancak güvenilir teknik değer bulunamadı. Modeller kapasite boşluğu açıklamasıyla otomatik filtrasyon hesabının dışında tutulmaya devam ediyor.
- Nubios toplamı 43 ekipman ve iki bakım ürününe ulaştı: 16 filtre ve 27 diğer cihaz/aksesuar. Kapasite gerektiren 16 kaydın dokuzu doğrulanmış teknik değerle otomatik hesaba hazır (%56).
- Nubios regresyon kapsamı toplam kayıt/kategori dağılımını, altı yeni yerel ürünü, HTTPS kaynak ve güncel doğrulama tarihini, yayımlanmamış debilerin tahmin edilmemesini doğruluyor.
- Nubios sonrasında `pnpm verify` 2026-08-27 tarihinde başarılı: TypeScript, yedi ekipman kategorili ve 609 bakım ürünlü katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel: Nubios paketi ve önceki yerel katalog değişiklikleri henüz gönderilmedi veya yayımlanmadı.
- Sonraki marka paketi: Ejet'in mevcut 12 ekipman kaydını güncel resmî/güvenilir portföy ve onaylı Türkiye mağazalarıyla karşılaştırmak.
- Ejet'in mevcut 12 ekipman kaydı güncel Atakan ve Malawi İzmir portföyleriyle karşılaştırıldı. Katalogda bulunmayan Ejet 101 sünger/pipo üretim filtresi, debisinin kullanılan hava motoruna bağlı olduğu açıkça belirtilerek ve doğrudan yerel ürün kaynağıyla eklendi.
- Ejet toplamı 13 ekipmana ulaştı: 12 filtre ve bir hava motoru. Kapasite değerlendirmesine giren 13 kaydın tamamı güvenli biçimde hazır; pasif pipo filtrelerine bağımsız motor debisi atanmadı.
- Yerel mağaza sayfalarında 905F ve 906F için mevcut güvenilir kayıtlarla çelişen debi/güç değerleri görüldü. Daha güçlü birincil kaynak bulunmadığı için katalogdaki değerler bu çelişkili ikincil verilerle değiştirilmedi.
- Ejet regresyon kapsamı 13 toplam kaydı, Ejet 101'in yerel kaynağını ve pasif filtre güvenliğini doğruluyor.
- Ejet sonrasında `pnpm verify` 2026-08-27 tarihinde başarılı: TypeScript, yedi ekipman kategorili ve 609 bakım ürünlü katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel: Ejet paketi ve önceki yerel katalog değişiklikleri henüz gönderilmedi veya yayımlanmadı.
- Sonraki marka paketi: Ferplast'ın mevcut ekipman ve bakım ürünü kayıtlarını güncel resmî portföy ve onaylı Türkiye mağazalarıyla karşılaştırmak.
- Ferplast'ın resmî güncel 69 cihaz/ekipman ürün ailesi, yayımlanan model varyantları düzeyinde karşılaştırıldı. Önceden filtre ve ısıtıcı ağırlıklı 47 kayıt içeren kapsam; aydınlatma, su ve dalga pompaları, hava motorları, skimmer, otomatik yemleyici, kontrol cihazı ve yardımcı ekipmanlarla 143 ekipmana çıkarıldı. CO₂ Energy Ingredients ayrıca bakım kataloğuna eklendi.
- Güncel Ferplast dağılımı 26 filtre, 21 ısıtıcı, dört hava motoru, 39 aydınlatma ve 53 yardımcı cihaz/aksesuar olmak üzere beş kategoridir. Renk seçenekleri ayrı teknik cihaz olarak çoğaltılmadı; gerçek güç veya ölçü varyantları ayrı seçilebilir model olarak işlendi.
- LED BAR FRESHLIFE, TOPLIFE, SEALIFE ve PRO TOPLIFE ailelerinin yayımlanan güçleri; HY-LED MINI'nin 5 W değeri; BLUSKIMMER, SLIM SKIM NANO, PICO SKIM ve BIOFLO'nun yayımlanan hacim üst sınırları resmî doğrudan ürün sayfalarından işlendi.
- AQAMAI ve AQ-LUX sayfalarının erişilebilir metninde model bazında güç tablosu yayımlanmadığı için güç değeri tahmin edilmedi. SELTZ, PICO, BLUPOWER ve KORALIA pompalarında model numarası doğrulanmış debi gibi kullanılmadı. AIRFIZZ 50/100/200/400 modellerinin resmî sayfada yayımlanan toplam 50/100/200/400 L/saat debileri, 2/3/4/5 W güçleri, çıkış sayıları ve basınçları işlendi.
- Ferplast regresyon kapsamı 143 ekipman/1 bakım ürünü toplamını, beş kategori dağılımını, kritik LED güçlerini, pasif BIOFLO güvenliğini, doğrudan resmî kaynakları ve teknik değer uydurulmamasını doğruluyor.
- Ferplast sonrasında `pnpm verify` 2026-08-27 tarihinde başarılı: TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. AIRFIZZ doğrulamasıyla kapasite gerektiren 51 Ferplast kaydının 51'i otomatik hesaba hazır (%100).
- GitHub/Vercel: Ferplast paketi ve önceki yerel katalog değişiklikleri henüz gönderilmedi veya yayımlanmadı.
- Sonraki marka paketi: Shark ve Armatürk'ün mevcut aydınlatma kayıtlarını güncel resmî/güvenilir Türkiye portföyleriyle yeniden karşılaştırmak.
- Shark'ın güncel güvenilir Türkiye satıcı portföyündeki 22 aydınlatma seçeneği model düzeyinde yeniden karşılaştırıldı. Dört sıralı sekiz, üç sıralı üç, iki sıralı üç ve bar tipi sekiz güncel seçenek ayrı seçilebilir kayıtlar olarak tutuldu.
- Güncel listede görünmeyen eski 3-sıra 23/33/53/63/95/105 cm ve 2-sıra 83 cm kayıtları kaldırıldı; 2-sıra 23/33/53 cm, 3-sıra 93 cm, 4-sıra 53/75 cm ve 100 cm full-spectrum bar eklendi. 75 cm modelde kaynak lümen yayımlamadığı için değer tahmin edilmedi.
- Armatürk'ün resmî tatlı su kategorisindeki 37 modelin tamamının zaten katalogda olduğu doğrulandı. Eksik dört tuzlu su armatürü, dört termostatlı soğutucu fan ve beş resmî armatür/dış filtre aksesuarı eklenerek marka toplamı 50 ekipmana çıktı: 41 aydınlatma ve dokuz diğer ekipman.
- Armatürk 2040T, 2060T ve 2070T için resmî güç ve akvaryum uzunluğu verileri işlendi. 2080T ürün sayfasının gövdesinde modelin 2080H yazılması nedeniyle 96 W ve 80–94 cm değerleri otomatik uygunluk alanlarına aktarılmadı; çelişki açıklamada görünür bırakıldı.
- Armatürk soğutucu fanların yayımlanan üst sınırları sırasıyla 50, 120, 150–250 ve 350 litre olarak işlendi. Filtre hortumları, vantuz, boru tutucu ve yedek armatür ayağı kapasite cihazı gibi değerlendirilmedi.
- Shark ve Armatürk regresyon kapsamı; tam model listelerini, kategori dağılımını, kritik güç/lümen/uzunluk ve fan hacimlerini, eski Shark modellerinin geri dönmemesini ve çelişkili Armatürk değerlerinin otomatik hesaba girmemesini doğruluyor.
- Shark ve Armatürk sonrasında `pnpm verify` 2026-08-27 tarihinde başarılı: TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel: Shark/Armatürk paketi ve önceki yerel katalog değişiklikleri henüz gönderilmedi veya yayımlanmadı.
- Sonraki tek iş: canlı kataloğunun 18 kullanıcı kategorisindeki tür kapsamını ve doğrulanmış bakım/uyumluluk verilerini grup grup denetlemek.
- Canlı kataloğunun ilk yerel karşılaştırma turunda AquaRubi'nin güncel satış listeleri kullanıldı. Kullanıcının onayıyla Atakan Petshop, BettaMarketim, AquaRubi, Cikletist Petshop, Malawi İzmir ve AkvaryumExpress bundan sonra tüm ürünlerde resmî kaynaktan sonraki ikinci doğrulama katmanıdır.
- Barb grubuna Türkiye listesinde bulunan Melon Barb ve Mascara Barb eklendi. Boy, minimum akvaryum, sürü, sıcaklık, pH, akıntı ve özel bakım uyarıları tür bazlı kaynaklarla doğrulandı; barb grubu 12 profile ulaştı.
- Güney Amerika cichlid karşılaştırmasında Goldeneye cüce cichlid (`Nannacara anomala`) ve Checkerboard cichlid (`Dicrossus filamentosus`) eklendi. Bölgecilik, çok yumuşak/asidik su ve geniş taban ihtiyacı görünür uyarılara işlendi; cichlid grubu 40 profile ulaştı.
- AquaRubi'nin sekiz Corydoras ürünü ile ilgili Pleco/yosun yiyici listesi karşılaştırıldı. Napo, Similis, Panda Loach, C125 Red Aspidoras, Black Venezuela Cory ve Royal Farlowella eklendi. Ticari ad-taxonomi farkları arama takma adlarında korundu; dip balığı grubu 38 profile ulaştı.
- Cüce kerevit listesindeki `Cambarellus diminutus` eklendi. Tek birey ile grup hacmi farkı, mağara/görüş bariyeri, kaçış ve fırsatçı avlanma riski uyarılara işlendi; kerevit grubu dört profile ulaştı.
- Yeni dokuz canlı profili ve iki barb için kesin grup sayıları, minimum hacim/uzunluk, sıcaklık, pH, akıntı, doğrulama tarihi ve bakım uyarıları regresyon testine alındı. Hedefli katalog akışı testi başarılı.
- Kaynaklarda bilimsel kimlik veya teknik değer açık değilse ticari ad üzerinden tür tahmin edilmedi; kaynak çelişkileri kesin değer gibi kataloğa aktarılmadı.
- GitHub/Vercel: canlı kataloğu denetimi ve önceki yerel değişiklikler henüz gönderilmedi veya yayımlanmadı.
- Sonraki tek iş: yerel canlı listelerinde kalan tetra, rasbora, Betta/Japon, karides ve salyangoz gruplarını mevcut profiller ve renk varyantlarıyla karşılaştırmak.
- AquaRubi'nin 11 kalemlik tetra/rasbora ve altı kalemlik Betta/Japon listesi ayrıca karşılaştırıldı. Listedeki biyolojik türlerin tamamı katalogda bulunuyor; Galaxy Candy Koi, Galaxy Halfmoon, Mix Colour Betta, Red Cap Oranda ve Sivrisinek Rasbora yeni türler gibi çoğaltılmadan mevcut doğru bakım profillerine arama takma adı olarak bağlandı.
- AquaRubi'nin karides/kerevit bölümündeki 58 güncel satış kalemi; 29 Caridina, 11 Neocaridina, 13 salyangoz ve iki cüce kerevit alt listesiyle karşılaştırıldı. Mağaza kalite sınıfları ayrı biyolojik tür gibi çoğaltılmadı; 38 karides ve 20 salyangoz bakım profili altında aranabilir varyete adları olarak birleştirildi.
- White Pearl doğru `Neocaridina cf. zhangjiajiensis` kimliği ve yayımlanan 20–26 °C / pH 6,5–7,8 aralığıyla eklendi. Altı eksik Neocaridina bakım profili ile Taiwan Bee, Pinto, Galaxy, Fancy Tiger, PRL ve Blue Tiger ailelerini kapsayan 13 hassas Caridina profili eklendi.
- Hassas Taiwan Bee/Pinto/Galaxy gruplarında 19–22 °C, pH 5,5–6,5, en az altılı grup, aktif toprak, düşük KH ve kararlı GH/TDS gereksinimleri görünür uyarılara işlendi. Bu koşullar yalnızca kaynağın açıkça verdiği varyete ailelerine uygulandı.
- Yellow Poso Spotted Rabbit doğrulanan `Tylomelania towutica` kimliğiyle eklendi. Poso Orange/Yellow ticari varyantları tür düzeyinde kesinleştirilmedi; Turbo, Tiger, Mini Tiger, Mini, Batik ve Batman Nerite kayıtlarında kaynak bilimsel tür vermediği için `Neritidae sp.` kullanıldı ve kimlik belirsizliği kullanıcıya açıkça gösterildi.
- Yerel mağaza adlarının sağlık profiline bağlanması, yeni canlıların HTTPS kaynak ve 2026-08-27 doğrulama tarihi, hassas Caridina koşulları ve kaynaksız bilimsel tür uydurulmaması regresyon testine alındı. Hedefli katalog akışı; yedi ekipman kategorisi, dört canlı sınıfı ve 610 bakım ürünüyle başarılı.
- Karides/salyangoz paketi sonrasında `pnpm verify` başarılı: TypeScript, katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. Canlı denetimi 38 karides ve 20 salyangoz profilinin tamamında kaynak ve bakım verisi bulunduğunu doğruladı.
- Kullanıcının onayıyla Atakan Petshop, BettaMarketim, AquaRubi, Cikletist Petshop, Malawi İzmir ve AkvaryumExpress tüm ürünlerde resmî kaynaktan sonraki ikinci doğrulama katmanı olarak kullanılacak; çelişkili değerler kesin veri gibi seçilmeyecek.
- GitHub devir noktası: bu doğrulanmış katalog paketi `codex/catalog-capacity-batch` görev dalına aktarılacak; `main` dalı ve Vercel/canlı uygulama bu pakette güncellenmeyecek.
- AquaRubi'nin ana balık kategorisindeki 38 güncel satış kaleminin tamamı herkese açık mağaza verisinden karşılaştırıldı. Yeni biyolojik tür açığı bulunmadı; mağaza adları mevcut 24 doğru bakım profiline bağlandı.
- Siyah Cüce Vatoz, L144 Longfin, Halfmoon Red/White, Kardinal Neon, Electric Blue Ramirezi, Apistogramma Kakadu, Pigme/Habrosus Cory, C125 Red, Black Venezuela, Royal Farlowella, Red Lizard Whiptail, SAE ve Otocinclus Affinis gibi yerel adlar yeni tür gibi çoğaltılmadan aranabilir takma ad olarak eklendi.
- `Otocinclus affinis` ve `SAE` ticari adlarının birden fazla benzer türle karışabildiği kullanıcı uyarısına işlendi. Ticari ad nedeniyle bilimsel kimlik değiştirilmedi; mevcut doğrulanmış bakım profilleri korundu.
- AquaRubi'nin 38 güncel balık adının doğru sağlık profiline bağlanması regresyon kapsamına alındı; hedefli katalog akışı testi başarılı.
- AquaRubi ana balık listesi sonrasında tam `pnpm verify` başarılı: TypeScript, katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- Cikletist'in güncel canlı doğuran kategorisindeki 24 satış kalemi karşılaştırıldı. Bilimsel kimliği açık olan 18 lepistes varyetesi ile Plati, Moli ve Koi Kılıç Kuyruk mevcut doğru biyolojik profillere bağlandı; renk varyeteleri ayrı tür gibi çoğaltılmadı.
- `VELİFERA BALIKLARI`, `VELİFERA TÜRLERİ` ve `ALBİNO SKY BLUE` sayfalarında bilimsel tür yayımlanmadığı için bu üç ticari ad tahminle bir profile bağlanmadı. FishBase, `Poecilia velifera` ile mevcut `Poecilia latipinna` profilinin ayrı türler olduğunu doğruluyor; satıcı kimliği açıklanana kadar yanlış sağlık önerisi üretmemek için kayıtlar çözülmemiş tutuldu.
- Cikletist canlı doğuran paketi sonrasında `pnpm verify` başarılı: TypeScript, yedi ekipman kategorili katalog akışı, 35 sağlık senaryosu, 18 canlı grubunun kaynak/bakım denetimi ve 14 sayfalık üretim derlemesi geçti.
- Cikletist Betta kategorisindeki 14 canlı kayıt karşılaştırıldı. On bir `Betta splendens` varyetesi ile Dev Gurami ve Çikolata Gurami mevcut doğru profillere bağlandı; mağazadaki Tetra Betta Menü canlı listesine dahil edilmedi.
- `MEYAN KÖKÜ GURAMİ` adı birden fazla `Parosphromenus` türünü kapsayabildiği ve mağaza bilimsel kimlik yayımlamadığı için tahminle eşleştirilmedi. Bu ayrım regresyon testinde korunuyor.
- Cikletist Betta/labirentli paketi sonrasında `pnpm verify` başarılı: TypeScript, katalog akışı, 35 sağlık senaryosu, tüm canlı gruplarının kaynak/bakım denetimi ve 14 sayfalık üretim derlemesi geçti.
- Cikletist Japon/Oranda kategorisindeki 17 benzersiz satış başlığı karşılaştırıldı: 13 Japon/Oranda/Ranchu/Ryukin/Teleskop varyetesi mevcut `Carassius auratus` profiline, dört koi başlığı yeni ve ayrı `Cyprinus carpio` profiline bağlandı.
- Koi profili FishBase, OATA ve Australian Koi Association verileriyle doğrulandı: 75 cm yetişkin boyu, en az 4.500 litre uzman havuzu, yaklaşık 3 metre yüzme alanı, en az üçlü sosyal grup, 4–24 °C ve pH 6,5–8,5. Akvaryuma uygun olmadığı, güçlü filtrasyon/oksijen/karantina gerektiği ve doğaya bırakılamayacağı görünür uyarılara işlendi.
- Koi/Japon paketi sonrasında `pnpm verify` başarılı: TypeScript, katalog akışı, 35 sağlık senaryosu, artık yedi profilli soğuk su grubu dahil tüm katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- Sonraki tek iş: yerel canlı listelerinde henüz denetlenmeyen grupları mevcut biyolojik profiller ve mağaza varyantlarıyla karşılaştırmak.

## 2026-08-28 Cikletist yılan ve müren karşılaştırması

- Cikletist'in güncel `Yılan ve Müren Balıkları` kategorisindeki 12 satış başlığı regresyon kapsamına alındı.
- Bilimsel kimliği ve zorunlu bakım eşikleri güçlü bilimsel/uzman kaynaklarda açık olan sekiz tür eklendi: Andrao yılanbaş (`Channa andrao`), Assam yılanbaş (`Channa stewartii`), Ornate yılanbaş (`Channa ornatipinnis`), Gökkuşağı yılanbaş (`Channa bleheri`), Peacock yılanbaş (`Channa pulchra`), İmparator yılanbaş (`Channa marulioides`), Dev kırmızı yılanbaş (`Channa micropeltes`) ve Yarım bantlı dikenli yılan balığı (`Macrognathus circumcinctus`).
- Bu profillerde yetişkin boyu, minimum hacim ve akvaryum uzunluğu, sıcaklık, pH, avcılık, topluluk/tür akvaryumu, mevsimsel serinleme, yüzey havası, hassas kum ve kaçışa dayanıklı kapak gereksinimleri kaynaklı eşiklerle işlendi. Büyük tür grubu 23 profile ulaştı.
- Yerel mağaza sayfaları yalnızca Türkiye'de kullanılan satış adlarını karşılaştırmak için kullanıldı. Bakım değerleri Seriously Fish, Fishipedia, Practical Fishkeeping, Maidenhead Aquatics/Fishkeeper ve tür uzmanı Aquarium Dietzenbach gibi daha güvenilir kaynaklarla denetlendi.
- `Channa marulioides` için bilimsel tür geçerliliği Eschmeyer's Catalog of Fishes, 65 cm erişkin boyu USGS yayınındaki tür monografisi ve bakım eşiği Fishipedia ile çapraz doğrulandı. Daha düşük hacim yayımlayan kaynaklar bulunmasına rağmen 65 cm erişkin boya uygun, koruyucu 1000 litre/200 cm eşik kullanıldı.
- `Channa micropeltes` bilimsel 130 cm boy, 5000–6000 litre bakım kaynağı ve 400–500 cm uzman yüzme alanı önerisiyle; `Macrognathus circumcinctus` ise 20 cm boy, koruyucu 215 litre/90 cm taban ve kum/kaçış gereksinimleriyle çapraz doğrulandı. Birden çok kaynağın kayda izlenebilir biçimde bağlanması için `additionalSourceUrls` alanı ve HTTPS denetimi eklendi.
- `ZİGZAK TARAK BALIKLARI`, `WHITE CHECK EEL MÜREN`, `CHANNA GOLDEN LİMBATA` ve birbiriyle çelişen `CHANNA ASIATICA GÖKKUŞAĞI YILANBAŞ BLEHERİ` adları kesin kimlik tamamlanana kadar tahminle eşleştirilmiyor. White Cheek/Check Moray adı `Echidna rhodochilus` ile ilişkili görünse de acı su-deniz salinitesi mevcut tatlı su sağlık modelinde temsil edilmediği için güvenli profil oluşturulmadı.
- Tam `pnpm verify` başarılı: TypeScript, yedi ekipman kategorili ve dört canlı sınıflı katalog akışı, 35 sağlık senaryosu, çoklu HTTPS kaynak denetimi, 23 profilli büyük tür grubu ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel: bu paket henüz gönderilmedi veya yayımlanmadı.
- Sonraki tek iş: kategoride çözülemeyen dört adı güvenli biçimde çözülmemiş tutup sıradaki yerel canlı kategorisini güvenilir tür kaynaklarıyla karşılaştırmak.

## 2026-08-28 Cikletist Amerikan tetra ve rainbowfish karşılaştırması

- Yerel mağazanın Amerikan tetra kategorisindeki beş sayfada bulunan 46 satış başlığı yalnızca Türkiye'de kullanılan ticari adları tespit etmek için kullanıldı; bilimsel kimlik ve bakım eşikleri mağaza açıklamalarından alınmadı.
- Flame tetra (`Hyphessobrycon flammeus`), Mavi imparator tetra (`Inpaichthys kerri`), Buenos Aires tetra (`Psalidodon anisitsi`), Kolombiya tetra (`Hyphessobrycon columbianus`), Kırmızı göz tetra (`Bario sanctaefilomenae`) ve Celebes gökkuşağı (`Marosatherina ladigesi`) güvenilir bilimsel/uzman kaynaklarla eklendi. Kimlik, yetişkin boyu, sürü sayısı, sıcaklık, pH, minimum hacim ve yüzme alanı eşikleri FishBase ile Fishkeeper, Fluval, Practical Fishkeeping ve tür odaklı uzman kaynaklar üzerinden çapraz doğrulandı.
- Furcata, Gertrudae, Madagaskar, Werneri, Neon Rainbow, Serpae, Silvertip, Ember, Lamp Eye, Penguin, makas kuyruk, transgenetik tetra, Black Palmeri, Boesemani, Congo, Gardneri ve Green Neon satış adları yeni biyolojik türler gibi çoğaltılmadan mevcut doğru profillere bağlandı.
- `BLUE KING TETRA` adı güvenilir ticaret listelerinde hem `Inpaichthys kerri` hem `Boehlkea fredcochui` için kullanıldığı için çözülmemiş bırakıldı. `KIRMIZI KALEM TETRA BALIKLARI`, `BUZ BALIĞI`, `ROSY TETRA BALIKLARI`, `Gül Tetra`, `Siyah Simpson Tetra` ve `Kiraz Tetra` başlıkları da bilimsel kimlik netleşmeden tahminle eşleştirilmedi.
- Tamamı büyük yazılan İngilizce/Türkçe satış adlarındaki `I/İ/ı/i` farklarının kullanıcı aramasını bozmasını önlemek için canlı adı normalizasyonu dotless-I toleranslı hale getirildi; belirsiz adların eşleşmemesi regresyon testinde korunuyor.
- Tam `pnpm verify` 46 başlıklı tamamlanmış paket için başarılı: TypeScript, yedi ekipman kategorili ve dört canlı sınıflı katalog akışı, 35 sağlık senaryosu, çoklu HTTPS kaynak/bakım denetimi ve 14 sayfalık üretim derlemesi geçti. Tetra grubu 23, rainbowfish grubu 11 doğrulanmış profile ulaştı.
- GitHub/Vercel: bu paket henüz gönderilmedi veya yayımlanmadı.
- Sonraki tek iş: Cikletist'in üç sayfalık Sazansıgiller kategorisindeki ticari adları mevcut biyolojik profillerle karşılaştırıp gerçek tür açıklarını güvenilir kaynaklarla doğrulamak.

## 2026-08-28 Cikletist Sazansıgiller karşılaştırması — ilk güvenilir tür paketi

- Kategorinin üç sayfasındaki güncel satış başlıkları çıkarıldı. Yerel mağaza bu aşamada yalnızca Türkiye'deki ticari adları tespit etmek için kullanıldı; bilimsel kimlik ve bakım eşikleri mağaza metninden alınmadı.
- İlk gerçek tür açığı paketi dört doğrulanmış profille tamamlandı: Sekiz bantlı barb (`Eirmotus octozona`), Daisy's Blue Ricefish (`Oryzias woworae`), Pacific Blue-eye (`Pseudomugil signifer`) ve Kırmızı fantom tetra (`Megalamphodus sweglesi`).
- Tür kimliği ve doğal boy bilgileri FishBase, Smithsonian'ın tür tanımlama yayını ve Australian Museum gibi bilimsel/kurumsal kaynaklarla; sürü, hacim, akvaryum uzunluğu ve su eşikleri Fishkeeper, Fishipedia ve bağımsız karşılaştırmalı bakım kaynaklarıyla çapraz doğrulandı. Her kayıt en az üç HTTPS kaynağa izlenebilir.
- Ticari ad eşleştirmeleri regresyon testine alındı. Grup toplamları tetra 24, barb 13, rainbowfish 12 ve killifish sekiz doğrulanmış profile ulaştı.
- Tam `pnpm verify` başarılı: TypeScript, katalog akışı, 35 sağlık senaryosu, kaynak/bakım denetimi ve 14 sayfalık üretim derlemesi geçti.
- Genel veya birden çok türe işaret edebilen `BIÇAK BALIKLARI`, `PUFFER BALIKLARI`, `Rasbora`, `GÖKKUŞAĞI GOBY`, `PIPE FISH NEEDLE` ve benzeri adlar bilimsel kimlik doğrulanmadan eşleştirilmeyecek.
- GitHub/Vercel: bu paket henüz gönderilmedi veya yayımlanmadı.
- Sonraki tek iş: Sazansıgiller envanterindeki kalan bilimsel olarak açık türleri küçük güvenilir paketlerle doğrulamak; belirsiz ve acı su/deniz gereksinimli adları mevcut tatlı su sağlık modeline zorla bağlamamak.

## 2026-08-28 Cikletist Sazansıgiller karşılaştırması — ikinci güvenilir tür paketi

- Canlı bakım verisinde kaynak sırası kesinleştirildi: yerel mağazalar yalnızca Türkiye'deki ticari adı ve bulunabilirliği gösterecek; bilimsel kimlik FishBase, kurumsal koleksiyonlar veya taksonomi yayınlarından, bakım eşikleri ise kurumsal ve köklü uzman kaynaklardan alınacak.
- Phoenix rasbora (`Boraras merah`), Asya kırmızı burun (`Sawbwa resplendens`) ve Yeşil ateş tetra (`Aphyocharax rathbuni`) güvenilir bilimsel ve bakım kaynaklarıyla eklendi. Her kayıt bilimsel kimlik, yetişkin boyu, minimum hacim/uzunluk, sürü sayısı, sıcaklık, pH ve özel bakım uyarılarıyla en az üç HTTPS kaynağa izlenebilir.
- Red Neon Blue-eye kaydındaki farklı bir `Pseudomugil` türüne ait eski kaynak kaldırıldı; doğru `Pseudomugil luminatus` FishBase, Fishkeeper ve Avustralya hükûmeti raporuyla bağlandı. Yetişkin boyu ve sürü eşiği güvenli profile göre düzeltildi.
- Kategoride bilimsel kimliği zaten açık olan 28 yerel satış adı mevcut doğru biyolojik profillere bağlandı. Renk/varyete adları yeni tür gibi çoğaltılmadı.
- `BIÇAK BALIKLARI`, `PUFFER BALIKLARI`, `Rasbora`, `GÖKKUŞAĞI GOBY`, `PIPE FISH NEEDLE`, `RED BELLY TETRA`, `TATLI SU DİL BALIKLARI`, `SİLVER ARGUS BALIKLARI` ve benzeri 19 belirsiz ya da mevcut tatlı su modeli açısından eksik adın tahminle eşleşmemesi regresyon testinde korunuyor.
- Tam `pnpm verify` başarılı: TypeScript, yedi ekipman kategorili ve dört canlı sınıflı katalog akışı, 35 sağlık senaryosu, kaynak/bakım denetimi ve 14 sayfalık üretim derlemesi geçti. Güncel gruplar tetra 25, rasbora 14 ve rainbowfish 12 doğrulanmış profildir.
- GitHub/Vercel: bu paket ve önceki yerel katalog değişiklikleri henüz gönderilmedi veya yayımlanmadı.
- Sonraki tek iş: Sazansıgiller listesindeki bilimsel adı açık kalan az sayıdaki türü aynı kaynak standardıyla tamamlamak; bilimsel kimliği veya tatlı/acı su gereksinimi kesinleşmeyen başlıkları çözülmemiş tutmak.

## 2026-08-28 Cikletist Sazansıgiller karşılaştırması — kategori tamamlandı

- Üç sayfadaki 64 satış başlığının tamamı tek bir envanter regresyonuna alındı. 42 başlık doğrulanmış biyolojik profile bağlandı; 22 başlık bilimsel kimliği, güvenli bakım eşiği veya tatlı/acı su modeli tamamlanmadığı için bilinçli olarak eşleşmeden bırakıldı.
- Ninja woodcat (`Tatia musaica`), Kırmızı karınlı piranha (`Pygocentrus nattereri`), Endlicheri bichir (`Polypterus endlicherii`) ve Monoculus peacock bass (`Cichla monoculus`) güvenilir bilimsel ve uzman kaynaklarla eklendi.
- Tatia için en az beşli grup, 60 litre/60 cm, gececilik, yumuşak kum ve küçük yavruları avlama riski; Natterer piranhası için altılı grup, 600 litre/200 cm, tür akvaryumu ve ciddi yaralanma riski işlendi.
- Endlicheri bichir için 75 cm yetişkin boyu, yaklaşık 2.000 litre/200 cm uzman sistemi, hava alma ve kaçış kapağı; Monoculus için 71 cm yetişkin boyu, 1.200 litre/200 cm uzman sistemi, güçlü filtrasyon ve doğaya bırakmama uyarıları görünür hale getirildi.
- `ALLIGATOR GAR TİMSAH BALIKLARI`, `BLUE AZUL PEACOCK BASS`, `PURPLE SPOTTED GUDGEON MOGURNDA BALIĞI`, `RED TAİLED HEMİODUS`, `SİLVER ARGUS BALIKLARI` ve diğer genel/çelişkili adlar yalnızca ticari addan bilimsel tür tahmin edilerek eşleştirilmedi.
- Tam `pnpm verify` başarılı: TypeScript, 64 başlıklı kategori regresyonu, yedi ekipman kategorili ve dört canlı sınıflı katalog akışı, 35 sağlık senaryosu, kaynak/bakım denetimi ve 14 sayfalık üretim derlemesi geçti. Güncel toplamlar bottom 64, monster 26, tetra 25, rasbora 14 ve rainbowfish 12 doğrulanmış profildir.
- GitHub/Vercel: bu kategori paketi ve önceki yerel katalog değişiklikleri henüz gönderilmedi veya yayımlanmadı.
- Sonraki tek iş: Cikletist'in sıradaki denetlenmemiş canlı kategorisini aynı güvenilir kaynak ve tam envanter regresyonu yöntemiyle karşılaştırmak.

## 2026-08-28 Cikletist Arowanalar karşılaştırması — kategori tamamlandı

- Arowanalar kategorisindeki dört satış başlığının tamamı regresyon kapsamına alındı. Üç ilan aynı biyolojik tür olan gümüş arowanaya (`Osteoglossum bicirrhosum`) bağlandı; satış boyunu ifade eden `UFAK` kaydı ayrı tür veya daha düşük yetişkin gereksinimi gibi değerlendirilmedi.
- Yerel mağaza yalnızca Türkiye'deki satış adlarını belirlemek için kullanıldı. Bilimsel kimlik ve 90 cm erişkin boy FishBase, bakım eşikleri Fishipedia ve B-Aqua, büyük yüzme alanı gereksinimi ise EMBRAPA yayınındaki Amazon süs balıkları rehberiyle çapraz doğrulandı.
- Eski 1.000 litre/250 cm gümüş arowana profili daha koruyucu yetişkin bakım eşiğine yükseltildi: en az 4.500 litre, 500 cm uzunluk, 24–28 °C ve pH 6–7,2. Güçlü sıçrama nedeniyle tam kapak, avcılık ve sıradan topluluk akvaryumuna uygun olmama uyarıları görünür hale getirildi.
- `AFRİKAN AROWANA` adı `Heterotis niloticus` ile ilişkili görünse de FishBase bilimsel boy verisini yayımlarken güvenilir uzman kaynaklarda yetişkin minimum akvaryum ve tam bakım eşikleri yeterince tutarlı bulunmadı. Yerel mağaza verisinden eşik uydurulmadı; kayıt güvenli doğrulama tamamlanana kadar bilinçli olarak eşleşmeden bırakıldı.
- Tam `pnpm verify` başarılı: TypeScript, dört başlıklı Arowanalar regresyonu, katalog akışı, 35 sağlık senaryosu, kaynak/bakım denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel: bu paket ve önceki yerel katalog değişiklikleri henüz gönderilmedi veya yayımlanmadı.
- Sonraki tek iş: Cikletist Monster Balık Türleri ana kategorisindeki satış başlıklarını mevcut yılan/müren, arowana ve büyük tür profilleriyle karşılaştırıp gerçek açıkları aynı güvenilir kaynak standardıyla tamamlamak.

## 2026-08-28 Cikletist Monster Balık Türleri ana kategori — güncel envanter tamamlandı

- Güncel Monster ana sayfasındaki 21 satış başlığının tamamı tek regresyon envanterine alındı. Yılanbaş, arowana, dikenli yılan balığı, fahaka, Astronot ve Flowerhorn tekrarları mevcut doğru biyolojik profillere bağlandı; satış sayfalarındaki tekrarlar ayrı tür gibi çoğaltılmadı.
- Astronot (`Astronotus ocellatus`) kaydı FishBase, Fishkeeper, bağımsız karşılaştırmalı bakım rehberi ve Güney Afrika çevre kurumunun çalışmasıyla güçlendirildi. 35 cm yetişkin boy, 300 litre/120 cm, 23–28 °C, pH 6–8, güçlü filtrasyon ve küçük canlıları avlama uyarıları izlenebilir kaynaklara bağlandı.
- Flowerhorn hibrit kaydı 400 litre/150 cm, 25–29 °C, pH 6–7,5, tek balıklı tür akvaryumu, yüksek biyolojik yük ve güvenli dekor gereksinimleriyle güncellendi. `Shortbody` satış formundaki yapısal sağlık riski görünür bakım uyarısına eklendi.
- `AFRİKAN AROWANA`, `ZİGZAK TARAK BALIKLARI`, `CHANNA GOLDEN LİMBATA`, `ÇİN EJDERİ`, `WHITE CHECK EEL MÜREN` ve çelişkili `CHANNA ASIATICA GÖKKUŞAĞI YILANBAŞ BLEHERİ` adlarının bilimsel kimlik veya mevcut tatlı su bakım modeli tamamlanmadığı için eşleşmemesi regresyonla korunuyor.
- Tam `pnpm verify` başarılı: TypeScript, 21 başlıklı Monster ana kategori regresyonu, katalog akışı, 35 sağlık senaryosu, kaynak/bakım denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel: bu paket ve önceki yerel katalog değişiklikleri henüz gönderilmedi veya yayımlanmadı.
- Sonraki tek iş: Monster alt kategorilerinden `Kedi Balıkları` ve ardından `Amerikan Tetra Monster` güncel envanterlerini aynı güvenilir kaynak standardıyla karşılaştırmak.

## 2026-08-28 Cikletist Monster alt kategorileri — tamamlandı

- Monster altındaki `Kedi Balıkları` kategori sayfasının güncel olarak ürün içermediği doğrulandı; eski veya başka kategorideki kayıtlar güncel satış ürünü gibi yeniden eklenmedi.
- `Amerikan Tetra Monster` kategorisindeki beş güncel başlığın tamamı regresyon envanterine alındı. Astronot, iki Flowerhorn ilanı ve Fahaka mevcut güvenilir bakım profillerine bağlandı.
- `ÇİN EJDERİ` satış adı birden fazla farklı büyük balık için kullanılabildiği ve mağaza bilimsel kimlik yayımlamadığı için bilinçli olarak eşleşmeden bırakıldı.
- Tam `pnpm verify` başarılı: TypeScript, Monster ana/alt kategori regresyonları, katalog akışı, 35 sağlık senaryosu, kaynak/bakım denetimi ve 14 sayfalık üretim derlemesi geçti.
- Monster bölümü güncel kategori yapısıyla tamamlandı. GitHub/Vercel henüz güncellenmedi.
- Sonraki tek iş: Cikletist'in henüz tamamlanmamış `Vatoz Kedi Balıkları` üç sayfalık envanterini güvenilir bilimsel ve kedi balığı uzmanı kaynaklarla karşılaştırmak.

## 2026-08-28 Cikletist Vatoz Kedi Balıkları — üç sayfalık envanter tamamlandı

- Üç güncel sayfadaki 56 satış başlığının tamamı tek regresyon envanterine alındı. 45 başlık doğrulanmış biyolojik profile bağlandı; 11 belirsiz başlık bilimsel kimlik veya güvenli yetişkin bakım eşiği tamamlanmadığı için bilinçli olarak eşleşmeden bırakıldı.
- Yerel mağaza yalnızca Türkiye'deki satış adlarını ve bulunabilirliği saptamak için kullanıldı. Balıkların bilimsel kimliği, erişkin boyu ve doğal gereksinimleri FishBase, GBIF/taksonomi kaynakları ve kurumsal yayınlardan; akvaryum eşikleri ise kurumsal veya köklü uzman kaynaklardan alındı.
- Pangasius köpek balığı (`Pangasianodon hypophthalmus`) 130 cm erişkin boy, 14.580 litre/450 cm koruyucu uzun süreli bakım eşiği ve açık `ev akvaryumuna uygun değildir` uyarısıyla eklendi. Pelajik/göçmen yapı, cama çarpma riski, yüksek biyolojik yük ve kamu akvaryumu/ısıtılmış kapalı havuz gereksinimi görünür hale getirildi.
- Siyah labeo (`Labeo chrysophekadion`) FishBase ve ABD Balık ve Yaban Hayatı Kurumu verileriyle 90 cm erişkin boy, 24–27 °C ve pH 6,5–7,5 olarak doğrulandı; 2.500 litre/360 cm uzman sistemi, aşırı bölgecilik ve standart topluluk akvaryumuna uygun olmama uyarıları eklendi.
- Kırmızı kuyruk kedi balığı (`Phractocephalus hemioliopterus`) kaydı bilimsel ve uzman ek kaynaklarla güçlendirildi; çok iri avcı, güçlü filtrasyon, güvenli kapak ve yalnızca dev uzman/kamu akvaryumu ölçeği uyarıları tamamlandı.
- `Borneo Kelebek Vatoz`, `RED LİP STİCK GOBBY`, `BLUE NEON GOBBY`, `JULLY`, `KÜREK BURUN`, `PANDA GARRARUFA`, L146, L148, L069, L103 ve `COLOMBİAN FARLOWELLA` adları yalnızca ticari addan tür tahmin edilerek eşleştirilmedi.
- Tam `pnpm verify` başarılı: TypeScript, 56 başlıklı Vatoz/Kedi Balıkları regresyonu, yedi ekipman kategorili ve dört canlı sınıflı katalog akışı, 35 sağlık senaryosu, kaynak/bakım denetimi ve 14 sayfalık üretim derlemesi geçti. Büyük tür grubu 28 doğrulanmış profile ulaştı.
- GitHub/Vercel: bu paket ve önceki yerel katalog değişiklikleri henüz gönderilmedi veya yayımlanmadı.
- Sonraki tek iş: Cikletist'in sıradaki denetlenmemiş canlı kategorisini aynı güvenilir tür kaynağı ve tam envanter regresyonu yöntemiyle karşılaştırmak.

## 2026-08-29 Cikletist Amerikan Cikletleri — kategori tamamlandı

- Üç güncel sayfadaki 53 satış başlığının tamamı tek envanter regresyonuna alındı. Argus'un acı su tür kimliği sonraki Malawi paketi sırasında doğrulandığı için 43 başlık doğrulanmış biyolojik profile bağlıdır; 10 genel, melez veya bilimsel kimliği açıklanmamış başlık tahminle eşleştirilmemiştir.
- Winemiller toprak yiyen ciklet (`Geophagus winemilleri`) ve Threadfin acara (`Acarichthys heckelii`) FishBase ile bilimsel olarak doğrulandı; ince kum, grup, taban alanı, güçlü filtrasyon ve küçük balıkları avlama riskleri görünür hale getirildi.
- Gerçek Altum melek (`Pterophyllum altum`) standart melekten ayrı profile alındı: en az dört birey, 450 litre/150 cm, en az 60 cm akvaryum yüksekliği, 27–31 °C ve çok yumuşak-asidik kararlı su gereksinimi işlendi. Kimlik FishBase, alan gereksinimi Flaman hükûmetinin hayvan refahı rehberiyle çapraz doğrulandı.
- Black Belt (`Vieja maculicauda`) 600 litre/180 cm ve tür akvaryumu; Persei/Pantano (`Cincelichthys pearsei`) 850 litre/244 cm, bitkisel beslenme ve çok yüksek biyolojik yük; Malawi Compressiceps (`Dimidiochromis compressiceps`) 680 litre/183 cm, bir erkek-birkaç dişi ve küçük balıkları avlama uyarılarıyla eklendi.
- Kadango (`Copadichromis borleyi`) bir erkek-dört dişilik harem için koruyucu 450 litre/120 cm; Super VC-10 Milomo (`Placidochromis milomo`) 1.000 litre/183 cm, sert-alkali su, açık kum ve sabit kayalık alan gereksinimleriyle tamamlandı.
- Dacrya (`Guianacara dacrya`) ve Owroewefi (`Guianacara owroewefi`) ayrı tür profillerine alındı; ince kum, mağara/kaya yarığı, sosyal grup, yumuşak su ve güçlü oksijen gereksinimleri işlendi. Gerçek Johanni (`Pseudotropheus johannii`) Maingano'dan ayrıldı ve yanlış eşleşme regresyonla engellendi.
- Gümüş Maskaheros (`Maskaheros argenteus`) 700 litre/200 cm tür akvaryumu; Elongatus Mpanga (`Chindongo elongatus`) 375 litre/120 cm, bir erkek-dört dişi ve kayalık Mbuna düzeniyle eklendi.
- Yerel mağaza sayfaları yalnızca Türkiye'deki satış adlarını belirlemek için kullanıldı. Bilimsel kimlik FishBase, ABD Balık ve Yaban Hayatı Kurumu ve taksonomi kaynaklarından; bakım eşikleri hükûmet rehberi veya yerleşik uzman kaynaklardan alındı.
- `Yeşil Teksas` (tür/hibrit belirsiz), `Sarı İmparator`, `Red Ruby Cichlid`, `Geophagus Hongdea`, genel `Malawi/Karışık Ciklet`, `ürün` ve boy-kalite başlıkları yanlış türe bağlanmadı. Bu 10 satış başlığının eşleşmemesi regresyonla korunuyor. `Argus Balıkları` ise FishBase ve OATA doğrulaması sonrasında ayrı acı su profiline bağlandı.
- Tam `pnpm verify` başarılı: TypeScript, 53 başlıklı Amerikan Cikletleri regresyonu, yedi ekipman kategorili ve dört canlı sınıflı katalog akışı, 35 sağlık senaryosu, kaynak/bakım denetimi ve 14 sayfalık üretim derlemesi geçti. Ciklet grubu 53 kaynaklı ve bakım verisi tam profile ulaştı.
- GitHub/Vercel: bu paket ve önceki yerel katalog değişiklikleri henüz gönderilmedi veya yayımlanmadı.
- Sonraki tek iş: Cikletist'in sıradaki henüz tamamlanmamış canlı kategorisini aynı tam envanter ve güvenilir kaynak yöntemiyle denetlemek.

## 2026-08-29 Cikletist Malawi Cikletleri — kategori tamamlandı

- Güncel sayfadaki 13 satış başlığının tamamı regresyon envanterine alındı. Dokuz başlık güvenilir biyolojik profile bağlandı; `Şeker Pembe Ciklet`, genel `Ciklet Balıkları`, `Ciklet M Boy A Kalite` ve tür/hibrit kimliği belirsiz `Yeşil Teksas` tahminle eşleştirilmedi.
- Sülfür Kafa Hap (`Otopharynx lithobates`) FishBase ve Malawi uzman kaynağıyla 350 litre/130 cm, bir erkek-birkaç dişi ve kayalık mağara gereksinimleriyle eklendi. Yaşayan Kaya/Livingston (`Nimbochromis livingstonii`) FishBase, Cichlid Room Companion ve Fishkeeper ile 680 litre/180 cm, avcılık ve tür akvaryumu uyarılarıyla eklendi.
- Ahli (`Sciaenochromis fryeri`) ve Yunus (`Cyrtocara moorii`) profillerinin bilimsel kaynakları FishBase'e yükseltildi; türe özel bakım kaynakları, grup, alan, avcılık ve Malawi suyu uyarılarıyla tamamlandı. Red Borley Kadango adı mevcut `Copadichromis borleyi` profiline güvenle bağlandı.
- Sayfada yanlış kategori altında bulunan Mono Argentus (`Monodactylus argenteus`) ve Green Argus (`Scatophagus argus`) ciklet gibi gösterilmedi. FishBase bilimsel kimliği ve veteriner onaylı OATA bakım rehberiyle ayrı acı su profilleri oluşturuldu: en az altılı grup, 600–680 litre, 180 cm, güçlü akıntı/oksijen ve erişkin dönemde yüksek tuzluluk veya deniz suyu gereksinimi açıkça işlendi.
- Yerel satış sayfası yalnızca güncel Türkçe ticari ad envanteri için kullanıldı; bilimsel kimlik, erişkin boyu, davranış, su ve alan gereksinimleri yerel mağaza metninden alınmadı.
- Tam `pnpm verify` başarılı: TypeScript, 13 başlıklı Malawi regresyonu dahil katalog akışı, 35 sağlık senaryosu, kaynak/bakım denetimi ve 14 sayfalık üretim derlemesi geçti. Ciklet grubu 55, acı su türlerini içeren `other` grubu yedi kaynaklı ve bakım verisi tam profile ulaştı.
- GitHub/Vercel: bu paket ve önceki yerel katalog değişiklikleri henüz gönderilmedi veya yayımlanmadı.
- Sonraki tek iş: sıradaki eksik `Cüce Cikletler` kategorisini aynı bilimsel kimlik ve güvenilir bakım kaynağı yöntemiyle denetlemek.

## 2026-08-29 Cikletist Cüce Cikletler — kategori tamamlandı

- İki güncel sayfadaki 26 satış başlığının tamamı envanter regresyonuna alındı. Yerel mağaza sayfaları yalnızca Türkiye'deki satış adlarını belirlemek için kullanıldı; bilimsel kimlik FishBase, bakım eşikleri Fishkeeper, Practical Fishkeeping ve tür bazlı TankBud sayfalarıyla çapraz doğrulandı.
- Hongsloi, Borellii Opal, Nijsseni, Baenschi, Macmasteri, Erythrura, Trifasciata, Panduro ve Mendezi için ayrı biyolojik profiller eklendi. Ramirezi renk/yüzgeç varyantları, Electric Blue Acara ve Agassizii Rio Miua mevcut doğru tür profillerine takma ad olarak bağlandı; renk varyantları yeni tür gibi çoğaltılmadı.
- Sajica'nın cüce ciklet olmadığı doğrulandı ve `Amatitlania sajica` olarak 150 litre/90 cm, çift, orta akıntı ve üreme bölgeciliği uyarılarıyla ayrı profile eklendi.
- 26 başlığın 24'ü doğrulanmış profile bağlıdır. `Apistogramma commbrae` güvenilir tür bazlı minimum akvaryum eşiği tamamlanmadığı için, `Ocellaris Peacock Bass` ise 74 cm'lik dev avcı için litre ile fiziksel uzunluk eşiği aynı güvenilirlik düzeyinde tamamlanmadığı için tahminle eşleştirilmedi.
- Tam `pnpm verify` başarılı: TypeScript, 26 başlıklı Cüce Cikletler regresyonu dahil katalog akışı, 35 sağlık senaryosu, kaynak/bakım denetimi ve 14 sayfalık üretim derlemesi geçti. Cichlid grubu 65 kaynaklı ve bakım verisi tam profile ulaştı.
- GitHub/Vercel'e gönderim yapılmadı. Sonraki tek iş: sıradaki eksik Tropheus/Tanganika canlı kategorilerini aynı yöntemle denetlemek.

## 2026-08-29 Cikletist Tropheus/Tanganyika — kategori tamamlandı

- Kategorideki 5 güncel satış başlığının tamamı regresyon envanterine alındı; 4 başlık doğrulanmış bilimsel/bakım profiline bağlandı.
- `İkola Kaiser Tropheus` ve `Tropheus Black Kriza` için ayrı, kaynaklı profiller eklendi. `Kiriza Gold`, ayrı tür gibi çoğaltılmadan Kiriza'nın üretim renk formuna bağlandı; `Demasoni Balıkları` mevcut bilimsel profile eşlendi.
- Yerel mağaza yalnızca Türkçe satış başlıklarını karşılaştırmak için kullanıldı. Kimlik ve bakım eşikleri Ciklid.org, Cichlid Room Companion, Fishkeeper, Zoopet ve hakemli Tropheus taksonomi çalışmasıyla doğrulandı.
- `Tropheus Red Belly` ticari adı birden fazla doğal form/melez için kullanılabildiğinden tahminle eşleştirilmedi ve güvenli biçimde çözülmemiş bırakıldı.
- Tam `pnpm verify` başarılı: TypeScript, 5 başlıklı Tropheus/Tanganyika regresyonu dahil katalog akışı, 35 sağlık senaryosu, kaynak/bakım denetimi ve 14 sayfalık üretim derlemesi geçti. Cichlid kataloğu 67 kaynaklı ve bakım verisi tam profile ulaştı.
- GitHub/Vercel'e gönderim yapılmadı. Sonraki tek iş: sıradaki eksik canlı kategorisini aynı güvenli kaynak yöntemiyle denetlemek.

## 2026-08-29 GitHub devir hazırlığı — katalog kapasite ve canlı paketi

- Görev dalı: `codex/catalog-capacity-batch`. GitHub'da bu paketle ilişkilendirilmiş açık bir Issue bulunmadı; mevcut dal korunarak devredilecek.
- Devir kapsamı yalnızca `PROJECT_STATUS.md`, `scripts/audit-catalog.cjs`, `scripts/test-catalog-flow.cjs`, `src/data/catalog-equipment-hardware.ts`, `src/data/catalog-species-expanded.ts` ve `src/data/catalog.ts` dosyalarıdır.
- Kullanıcıya ait izlenmeyen `Codex Görseli 27 Ağu 2026 02_52_04.png` dosyası kapsam dışıdır ve commit'e eklenmeyecektir.
- Devir öncesi tam `pnpm verify` başarılıdır; son uzak commit bilgisi push tamamlandıktan sonra devir mesajında bildirilecektir.
- `main` birleştirmesi ve Vercel yayını bu devir kapsamında değildir. Canlı uygulama `https://aqua-mind-three.vercel.app/` bu yerel katalog paketini henüz içermez.

## 2026-08-29 Cikletist Karides/Kerevit — iki sayfalık kategori tamamlandı

- Birinci sayfadaki güncel 24 satış başlığı ile kategori bağlantısında bulunan ikinci sayfadaki dokuz satır birlikte regresyon envanterine alındı. İkinci sayfada tekrar listelenen Amano karides ve Diminutus kerevit satırları da sayfa yapısını birebir korumak için test kapsamındadır.
- Kırmızı Rili, Turuncu Rili, Karbon Rili, Yeşil Jelly ve Çikolata renk formları ayrı tür gibi gösterilmeden `Neocaridina davidi` bilimsel kimliğiyle eklendi. Kimlik ve bakım verisi Aquarium Co-Op, Aquairi, Shrimp Science, Buce Plant ve uzman karides kaynaklarıyla; Türkiye'deki tam satış adları Cikletist sayfalarıyla doğrulandı.
- Sakura, Bloody Mary, Yellow Fire, Black Rose, Blue Angel, Blue Jelly, Blue Bolt, Tiger, PRL, Black Pinto, Black/Red Fancy, Snow White, Amano ve Diminutus satış adları mevcut doğru biyolojik profillere bağlandı.
- 33 satış satırının 24'ü güvenilir profile bağlıdır. Tür belirtmeyen `Amerikan Kerevitleri`, stok içeriği değişen karışık paket, renk kimliği belirsiz genel Pinto/Galaxy adları ile akvaryum yerine kara alanlı paludaryum gerektiren dört vampir yengeç başlığı mevcut sağlık modeline tahminle bağlanmadı.
- Tam `pnpm verify` başarılıdır: TypeScript, 33 satırlık Karides/Kerevit regresyonu, 43 karides ve 4 kerevit profilinin kaynak/bakım denetimi, 35 sağlık senaryosu ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel'e bu yeni paket için gönderim yapılmadı. Canlı uygulama bu değişiklikleri henüz içermez.
- Sonraki tek iş: Cikletist Salyangoz Türleri kategorisini aynı tam envanter ve güvenilir kaynak yöntemiyle denetlemek.

## 2026-08-29 Cikletist Salyangoz Türleri — kategori tamamlandı

- Kategori sayfasındaki 10 satış başlığının tamamı tek regresyon envanterine alındı. Ramshorn, Poso Orange Rabbit, Helena/Katil, Yeşil Boynuzlu Nerite ve Zebra Nerite başlıkları doğrulanmış mevcut bakım profillerine bağlandı.
- Beş güvenli eşleşmeye ürün sayfasının tam Türkçe satış adı ve Cikletist bağlantısı eklendi. Zebra Nerite profilinin ana bakım kaynağı, sıcaklık, alkali su, erişkin boy ve bakır hassasiyetini açıkça yayımlayan Fishkeeper tür sayfasına yükseltildi.
- `Elma Salyangozu` adı birden çok `Pomacea` türünü; `Tatlı Su Midyesi` adı birden çok familyayı kapsayabildiği için bilimsel kimlik tahmin edilmedi. `Spotted Nerite Çeşitleri` karışık ürün olduğu için tek türe bağlanmadı.
- `Tricolor Horn` kaynaklarda hem `Clithon corona` hem `Clithon diadema` adıyla satılıyor; `Ring Snail` ise bilimsel kaynak ve resmî ticaret değerlendirmelerinde yalnızca `Nerita/Neritina sp.` düzeyinde kalıyor. Bu iki başlık kesin türe zorlanmadı.
- Tam `pnpm verify` başarılıdır: TypeScript, 10 satırlık salyangoz güvenlik regresyonu, yedi ekipman kategorili katalog akışı, 35 sağlık senaryosu, kaynak/bakım denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu değişiklikleri henüz içermez.
- Güncel Cikletist kategori ağacıyla karşılaştırmada kalan son grup `Tuzlu Su Canlıları`dır. Sayfada palyaço balıkları yanında anemon, deniz hıyarı, nudibranch ve denizyıldızı bulunduğundan; mevcut tatlı su ağırlıklı modelde tuzluluk ve deniz akvaryumu türü olmadan bu kayıtlar eklenmeyecektir.
- Sonraki tek iş: tuzlu su desteğini bu sürüme ekleme veya sonraki faza erteleme ürün kararını almak; eklenirse önce akvaryum türü/tuzluluk veri modelini ve sağlık analizini tasarlamak.

## 2026-08-29 Netlea hava motorları — kapasite paketi tamamlandı

- Netlea No.2B ve No.3B için ürün sayfasındaki model bazlı değerler, aynı ürün ailesinin NETLEA markalı teknik tablo görseliyle karşılaştırıldı. No.2B 10 L/dakika (600 L/saat), azami 6,5 W, 0,020 MPa ve 3550 mAh/17,75 Wh; No.3B 12 L/dakika (720 L/saat), azami 9,5 W, 0,024 MPa ve 9750 mAh/48,75 Wh değerleriyle otomatik hava kapasitesi hesabına alındı.
- Genel `No.4B` kaydının tek bir cihaz olmadığı, teknik tabloda `Q2/4` ve `Q9/4` olarak iki alt modele ayrıldığı doğrulandı. Q2/4 16 L/dakika (960 L/saat), 0,027 MPa; Q9/4 14 L/dakika (840 L/saat), 0,022 MPa değerleriyle ayrı katalog kayıtlarına dönüştürüldü. İki alt model de azami 9,5 W, iki çıkış ve 14600 mAh/73 Wh batarya verisini taşıyor.
- G1, G2 ve Flower Cartridge ön filtrelerine motor debisi atanmadı. Bu üç pasif bileşen `passiveComponent` ile işaretlendi; otomatik filtrasyon hesabına tek başına katılmıyor ve katalog denetiminde motorlu kapasite eksiği olarak sayılmıyor.
- Hedefli katalog akışı ve denetimi başarılıdır. Netlea 65 ekipman ve 12 bakım ürününe ulaştı; motorlu kapasite gerektiren 14 kaydın 14'ü hazırdır (%100).
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu paketi henüz içermez.
- Nubios NW-450F, NW-600F, NW-800F, NW-1500F ve NB-1500F ürün sayfalarındaki kutu teknik tabloları incelendi. Sırasıyla 450, 600, 800, 1500 ve 1500 L/saat debi; 4, 6, 15, 20 ve 20 W güç değerleri doğrudan modele ait ambalajdan doğrulanarak otomatik filtrasyon hesabına alındı. Ambalajda ayrıca 0,6; 0,8; 1,0; 1,2 ve 1,2 m azami basma yüksekliği yayımlanıyor.
- YU-118C ve YU-119C için kendi motorlu sünger filtre yapısı ve ürün ailesinin 5 W gücü doğrulandı; ancak model bazlı debi yayımlanmıyor. Başka modele ait 450 L/saat değerini kopyalayan hatalı satıcı metni kullanılmadı; iki ürün güvenli biçimde otomatik filtrasyon hesabının dışında kaldı.
- Hedefli katalog akışı ve denetimi başarılıdır. Nubios'ta motorlu kapasite gerektiren 16 kaydın 14'ü hazırdır (%88); kalan iki kayıt yalnızca yayımlanmamış YU-118C/YU-119C debileridir.
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu paketi henüz içermez.
- Sonraki tek iş: Resun'un kapasite denetiminde eksik görünen modellerini seri aileleri halinde doğrulamak; yalnızca yayımlanmış model bazlı teknik verileri otomatik hesaba almak.
- Resun'un 12 resmî filtre seri sayfasındaki görsel teknik tablolar doğrudan incelendi. BC, EFC, GF, CX, CS, MAGI, HS, CY, BF, EVF ve EF/Xtreme ailelerindeki 29 modelin model bazlı debi ve güç değerleri; tabloda varsa önerilen akvaryum aralıkları ve EF1600U/EF2800U için 220–240 V sürümündeki 11 W UV gücü işlendi.
- Türkiye kaynağında yalnızca 340 L/saat debiyle kayıtlı CX-400, resmî tabloda yayımlanan 5,5 W ve 38–57 litre aralığıyla tamamlandı. Resun'un kapasite gerektiren 75 kaydında otomatik hesaba hazır kayıt sayısı 15'ten 44'e yükseldi; filtre ailesindeki bu paket %100 hazırdır.
- Hedefli katalog akışı ve kapasite denetimi başarılıdır. GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu paketi henüz içermez.
- Sonraki tek iş: Resun'un 22 hava motoru ve dokuz ısıtıcı kaydındaki resmî görsel teknik tabloları model bazında işlemek.
- Resun HCB, HCA, AP, HLP, DC, PLP, NLP ve QSW/QSB hava motoru ailelerinin dokuz resmî seri sayfasındaki teknik tablolar işlendi. 22 mevcut kaydın debi ve güçleri tamamlandı; HCA2000 ve HCA3000 seri tablosunda doğrulanıp eksik katalog modelleri olarak eklendi. DC120/DC160 için yayımlanan 80/120 litre üst sınırları da otomatik hava kapasitesi hesabına alındı.
- Hava debileri yalnızca tabloda yayımlanan birimlerden dönüştürüldü: L/dakika değerleri 60 ile çarpıldı, çift çıkış tablolarındaki toplam debi açıkça toplandı. NLP200'de Türkiye'nin 220–240 V sürümüne ait 14.000 L/saat değeri kullanıldı.
- Hedefli katalog akışı ve kapasite denetimi çalıştırılmayı bekliyor. GitHub/Vercel'e gönderim yapılmadı.
- Sonraki tek iş: Resun'un dokuz ısıtıcı kaydındaki resmî görsel teknik tabloları model bazında işlemek.
- Resun'un Sunlike, Digital Smart, Thermo, Rising Heat, Delta, HT Mini ve MH ısıtıcı ailelerinin yedi resmî sayfasındaki model tabloları işlendi. Kullanıcının seçemeyeceği altı genel “Series” kaydı kaldırılıp SUNLIKE25–300, DSH100–300, TM25–300, RH9000 25–300W, DT50–300, HT10/HT25 ve MH75/MH150/MH250 olmak üzere 36 gerçek varyanta ayrıldı.
- Her varyant yayımlanmış güç ve hacim sınırını taşıyor. HT ve MH tablolarındaki sıcaklık artışının akvaryum hacmi ile değiştiği bilgi açıklamasında korundu; olmayan bir sıcaklık performansı tahmin edilmedi.
- Resun filtresi, hava motoru ve ısıtıcı kapasite paketi tamamlandı. Resun 209 ekipman ve beş bakım ürününe ulaştı; kapasite gerektiren 104 kaydın 104'ü otomatik hesaba hazırdır (%100).
- `pnpm verify` 2026-08-29 tarihinde başarılı: TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu paketi henüz içermez.
- Sonraki tek iş: Jeneca'nın kapasite denetiminde eksik görünen filtre, hava motoru ve ısıtıcı kayıtlarını seri aileleri halinde resmî/güvenilir teknik tablolardan doğrulamak.

## 2026-08-30 Jeneca hava motorları — ilk kapasite paketi

- AP-601 için 3 L/dakika (180 L/saat) ve 2 W; AP-602 için iki ayrı 3 L/dakika çıkış (360 L/saat toplam) ve 4 W doğrudan model sayfasındaki teknik verilerle doğrulandı.
- AP-8806 için iki ayrı 4,3 L/dakika çıkış (516 L/saat toplam), 4,1 W, 300–600 litre ve ayarlanabilir akış; AP-10000 için 396 L/saat toplam, 3,3 W ve ayarlanabilir akış; AP-12000 için 360 L/saat toplam, 4 W ve ayarlanabilir akış model bazlı teknik tablolardan işlendi.
- AP-15000 için 360 L/saat ve 6 W; AP-30000 için 600 L/saat ve 10 W; AP-40000 için 1200 L/saat, 12 W ve dört çıkış doğrulandı. Kaynakların yayımladığı ayarlanabilir akış bilgisi katalog profillerine aktarıldı.
- Bu sekiz model doğrulanmış kapasiteyle otomatik hava hesabına alındı. AP-18000, AP-06, AP-20000, AP-22000 ve DB ailesindeki teknik değeri henüz doğrulanamayan modeller açıklamalı biçimde otomatik hesabın dışında kaldı; hiçbir değer tahmin edilmedi.
- Jeneca 392 ekipmanda kaldı. Kapasite gerektiren 169 kaydın hazır sayısı 97'den 105'e yükseldi (%62).
- `pnpm verify` 2026-08-30 tarihinde başarılı: TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu paketi henüz içermez.
- Sonraki tek iş: Jeneca GLB, GD ve IPF filtre ailelerinin model bazlı debi, güç ve yayımlanmışsa önerilen hacim değerlerini erişilebilir resmî veya onaylı ikincil kaynaklardan doğrulamak.

## 2026-08-30 Jeneca GLB, GD ve IPF filtreleri — kapasite paketi

- GLB-600, GLB-800 ve GLB-1000 sırasıyla 150/180/220 L/saat ve 3,5/5,5/7,5 W; GD-400, GD-500 ve GD-600 sırasıyla 500/500/1100 L/saat ve 7/7/17 W değerleriyle doğrudan seri sayfalarından doğrulandı.
- IPF-060, IPF-080, IPF-180, IPF-280, IPF-380, IPF-228, IPF-628, IPF-260, IPF-360, IPF-460, IPF-480 ve IPF-560 model bazlı kaynaklarla otomatik filtrasyon hesabına alındı. IPF-060 için güvenilir kaynaklarda ortak olan 500 L/saat debi kullanıldı; çelişkili güç ve hacim değerleri eklenmedi.
- IPF-338 için güncel model sayfaları 300 ve 350 L/saat değerlerini çelişkili biçimde yayımlıyor. GD-320 için 4 W doğrulansa da debi yayımlanmıyor. İki model de kesin değer uydurulmadan otomatik kapasite hesabının dışında bırakıldı.
- Jeneca toplamı 392 ekipmanda kaldı. Kapasite gerektiren 169 kaydın hazır sayısı 105'ten 123'e yükseldi (%73).
- `pnpm verify` 2026-08-30 tarihinde başarılı: TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu paketi henüz içermez.
- Sonraki tek iş: Jeneca XP, TGD, GD-402/502/602 ve AE filtrelerinin model bazlı debi, güç ve yayımlanmışsa önerilen hacim değerlerini doğrulamak.

## 2026-08-30 Jeneca AE ve çözülemeyen XP/TGD/GD filtreleri — kapasite paketi

- AE-1000 iki doğrudan seri kaynağında ortak yayımlanan 850 L/saat, 9,3 W, 170 litre üst sınırı ve ayarlanabilir akış bilgisiyle otomatik filtrasyon hesabına alındı.
- AE-1300 için kaynaklarda ortak olan 950 L/saat debi ve ayarlanabilir akış işlendi. Güç 9,3 W ve 10,8 W; önerilen hacim 190 ve 200 litre olarak farklı yayımlandığı için bu iki alan kesin değer gibi seçilmedi ve çelişki kullanıcı açıklamasında korundu.
- XP-18/19/31/32 için yalnızca satış arama listeleri ve eksik ürün sayfaları; XP-605, TGD-15–19 ve GD-402/502/602 içinse model varlığını gösteren ancak teknik tablo yayımlamayan sayfalar bulunabildi. Arama sonucu özeti teknik kaynak kabul edilmedi ve komşu model değerleri kopyalanmadı.
- Jeneca toplamı 392 ekipmanda kaldı. Kapasite gerektiren 169 kaydın hazır sayısı 123'ten 125'e yükseldi (%74).
- Hedefli katalog akışı, kapasite denetimi ve tam `pnpm verify` 2026-08-30 tarihinde başarılıdır: TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu paketi henüz içermez.
- Sonraki tek iş: Jeneca AP-18000, AP-06, AP-20000, AP-22000 ve DB hava motoru ailesindeki eksik debi/güç değerlerini model bazlı resmî veya güvenilir kaynaklardan doğrulamak.

## 2026-08-30 Jeneca AP/DB hava motorları — ikinci kapasite paketi

- AP-22000 için iki çıkışta toplam 8 L/dakika (480 L/saat), 0,023 MPa ve ayarlanabilir akış doğrulandı. Güç bilgisi güvenilir sayfalarda 8 W ve 12 W olarak çeliştiği için otomatik profile kesin güç değeri eklenmedi; çelişki kullanıcı açıklamasında korundu.
- DB-58 üreticinin resmî sayfasındaki 55 L/dakika (3300 L/saat), 25 W ve ayarlanabilir akış verileriyle; DB-21 ise 18 L/dakika (1080 L/saat), 10 W ve ayarlanabilir akış verileriyle otomatik hava hesabına alındı.
- DB-31 için 30 L/dakika (1800 L/saat) ve 16 W; DB-51 için 51 L/dakika (3060 L/saat) ve 25 W; DB-81 için 80 L/dakika (4800 L/saat) ve 42 W model bazlı doğrudan ürün kaynaklarından işlendi.
- AP-18000, AP-06, AP-20000, DB-11, DB-11 Upgrade, DB-21 Upgrade ve DB-58 Upgrade için üretici portföyünde model varlığı doğrulansa da güvenli sayısal teknik tablo bulunamadı. Normal ve Upgrade varyantların değerleri birbirine kopyalanmadı; bu yedi kayıt açıklamalı biçimde otomatik kapasite hesabının dışında kaldı.
- Jeneca 392 ekipmanda kaldı. Kapasite gerektiren 169 kaydın hazır sayısı 125'ten 131'e yükseldi (%78).
- Hedefli katalog akışı, kapasite denetimi ve tam `pnpm verify` 2026-08-30 tarihinde başarılıdır: TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu paketi henüz içermez.
- Sonraki tek iş: Jeneca SX-366/SX-388/SX-265, AL-22/AL-28 ve BX-22/BX-28/BX-29 ısıtıcı ailelerinin model bazlı güç ve yayımlanmış hacim değerlerini doğrulamak.

## 2026-08-30 Jeneca ısıtıcı varyantları — kapasite paketi

- Belirsiz sekiz seri kaydı kullanıcıların gerçekten seçebileceği 26 watt varyantına ayrıldı: SX-366 ve SX-388 için 1000/1200/1500 W; SX-265 için 500 W; AL-22 için 25/50/100/200/300 W; AL-28 için 50/100/300/500 W; BX-22 için 25/50/100/200/300/500 W; BX-28 için 500 W ve BX-29 için 200/300/500 W.
- SX-366/SX-388 güçleri ve tatlı/tuzlu su uyumu üreticinin resmî seri sayfasından; SX-265, AL-22 ve AL-28 güçleri model bazlı doğrudan satış sayfalarından doğrulandı. Bu kaynaklarda güvenilir hacim tablosu olmayan varyantlara hacim değeri atanmadı.
- BX-22'nin 25–300 W varyantlarında yayımlanan 5–350 litre aralıkları ve 500 W sürümünün 500 litre üst sınırı işlendi. BX-28 500 W için 500 litre; BX-29 200/300/500 W için sırasıyla 200/300/500 litre üst sınırları model bazlı kaynaklardan eklendi.
- Jeneca 392 genel kayıttan 410 gerçek ekipman varyantına yükseldi. Isıtıcı sayısı 21'den 39'a; kapasite gerektiren kayıt sayısı 169'dan 187'ye ve otomatik hesaba hazır kayıt sayısı 131'den 157'ye çıktı (%84).
- Hedefli TypeScript, katalog akışı, kapasite denetimi ve tam `pnpm verify` 2026-08-30 tarihinde başarılıdır: yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 35 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu paketi henüz içermez.
- Sonraki tek iş: Aquawing AQ-A3000 hava motorunun yayımlanmış debi ve güç bilgisini model bazlı güvenilir kaynaklarla doğrulamak.

## 2026-08-31 açıklamalı kapasite boşlukları — güvenli kapanış

- Aquawing AQ-A3000 için 25 W güç doğrulandı ancak hava debisi; Boyu SP-1300C için model varlığı doğrulandı ancak debi ve önerilen hacim yayımlanmadı.
- Eurostar Motorlu Pipo Filtre Medium ve Large doğrudan Türkiye ürün sayfalarında 5 W güç ve ürün ölçüleriyle doğrulandı; su debisi ve önerilen hacim yayımlanmadığı için otomatik filtrasyon hesabının dışında kaldı.
- Nubios YU-118C/YU-119C ve Haqos EASY-1000AT, Aqua Flow 250 ve Thermo-Sprite boşlukları önceki araştırmadaki açıklamalarıyla korundu. YU-118C adı altında başka markanın model verisini kopyalayan sayfa özellikle reddedildi.
- Hiçbir kayıt için tahmini debi, güç veya hacim üretilmedi; mevcut kapasite açıklamaları ve katalog denetimi korundu.

## 2026-08-31 deniz canlısı güvenlik temeli ve ilk profil

- SpeciesProfile yaşam ortamı için waterTypes, deniz canlılarının tuzluluk gereksinimi için specificGravity aralığı taşıyacak biçimde genişletildi. Eski profiller geriye uyumlu olarak tatlı su kabul ediliyor.
- Canlı seçici yalnızca seçili akvaryumun tatlı, tuzlu veya acı su türüyle uyumlu profilleri listeliyor; form dışından gönderilen uyumsuz katalog kimliği de kayıt katmanında reddediliyor.
- Sağlık analizi, mevcut/eskiden eklenmiş uyumsuz canlılarda açık tehlike uyarısı veriyor. Deniz canlısında özgül ağırlık ölçümü yoksa ölçüm talep ediyor; ölçüm güvenli aralık dışındaysa tehlike uyarısı üretiyor.
- Su değerleri ekranına özgül ağırlık alanı eklendi; tuzlu ve acı su akvaryumlarının özet kartında TDS yerine SG gösteriliyor.
- Cikletist'in Ocelleris Clown (Wild) satış adı ilk güvenli deniz profili olarak Amphiprion ocellaris kimliğine bağlandı. OATA'nın 60 litre/çift, 24–26 °C, pH 7,9–8,3 ve SG 1.020–1.025 rehberi; FishBase ve Fishkeeper kimlik, boy ve bakım bilgileriyle çapraz doğrulandı.
- Hedefli TypeScript, katalog akışı ve 38 sağlık senaryosu başarılıdır.
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu paketi henüz içermez.
- Sonraki tek iş: False Skunk-Stripe, Tomato, Saddleback ve Maroon palyaço balıklarını tür bazlı güvenilir bakım eşiği bulunanlardan başlayarak eklemek; Percula Clownfish (Full Black) ticari adını bilimsel kimlik netleşmeden tahminle eşleştirmemek.

## 2026-08-31 Cikletist palyaço balıkları — güvenli tür paketi

- `False Skunk-Stripe Anemonefish` satış adı ITIS'in resmî ortak ad kaydına göre `Amphiprion perideraion` kimliğine bağlandı. Fishkeeper'ın tür bazlı 10 cm erişkin boy, deniz suyu aralığı ve bakım uyarıları; Practical Fishkeeping'in 70 cm çift akvaryumu eşiğiyle birlikte kullanıldı.
- Tomato (`Amphiprion frenatus`), Saddleback (`Amphiprion polymnus`) ve Maroon (`Amphiprion biaculeatus`) satış adları FishBase kimlik/erişkin boy verileri, Fishkeeper bakım sayfaları, OATA deniz suyu rehberi ve Practical Fishkeeping tür kompleksi eşikleriyle çapraz doğrulandı.
- Dört profil yalnızca tuzlu su akvaryumunda listelenir; çift, minimum hacim/uzunluk, 24–26 °C, pH 8,1–8,3 ve SG 1.020–1.025 aralıklarını taşır. Tomato ve Maroon için yüksek bölgecilik, Maroon için 17 cm erişkin boy ve 100 cm yüzme alanı açık kullanıcı uyarısına işlendi.
- `Percula Clownfish (Full Black)` başlığı renk varyetesinin bilimsel kimliğini açıkça yayımlamadığı için Ocellaris veya Percula profiline tahminle bağlanmadı; bu eşleşmeme davranışı regresyon testine alındı.
- Canlı ekleme ekranındaki ana sınıf listesi seçili akvaryum türünde hiç profil bulunmayan kategorileri artık göstermiyor.
- Tam `pnpm verify` başarılıdır: TypeScript, katalog akışı, 39 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu paketi henüz içermez.
- Sonraki tek iş: anemon, deniz hıyarı, nudibranch ve denizyıldızı kayıtları için bilimsel kimlik belirsizliğini koruyan deniz omurgasızı bakım modelini kurmak ve yalnızca güvenli eşleşmeleri eklemek.

## 2026-08-31 ilk deniz omurgasızları — doğrulanmış güvenlik paketi

- `Green Long Tentacle Anemone` satış adı güncel ihracat listeleri ve Quality Marine kataloğunda `Macrodactyla doreensis` kimliğine bağlandı. 50 cm erişkin çap, 300 litre, 24–26 °C, pH 8,1–8,4, SG 1.023–1.025 ve orta akıntı kaynaklarla doğrulandı.
- Anemon için olgun akvaryum, 10–12 cm yumuşak kum, güçlü aydınlatma, pompa giriş koruması, bakır yasağı ve çevredeki mercan/balıklara sokma riski kullanıcı uyarılarına işlendi.
- `Tiled Sea Star` satış adı GBIF ve uzman bakım kaynaklarıyla `Fromia monilis` kimliğine bağlandı. 13 cm erişkin boy, yaklaşık 55 galondan çevrilen 210 litre, 22–26 °C, pH 8,1–8,3 ve SG 1.023–1.025 eşikleri kullanıldı.
- Denizyıldızı için olgun/canlı kayalı akvaryum, uzun damla alıştırması, havayla temas ettirmeme, ani su değişimlerine ve bakıra hassasiyet ile besin yetersizliği riski açıklandı.
- Canlı veri modeli, tank uzunluğu veya akıntı değeri kaynakta yayımlanmayan omurgasızlarda bu alanları boş bırakabiliyor. Balık profillerinde tank uzunluğu zorunlu kalıyor; sağlık analizi yalnız mevcut doğrulanmış değeri değerlendiriyor.
- `Red/Green Carpet Anemone`, `Sand Cucumber`, `Rose Corn Bulb Anemone`, `Bubble Green Anemone`, `Antenna Purple Nudibranch` ve `Blue Stripe Nudibranch` gibi renk/genel adlar bilimsel kimliği kesinleştirmediği için tahminle eşleştirilmedi. Sekiz belirsiz omurgasız adı ve Full Black Percula eşleşmeme regresyonuyla korunuyor.
- Tam `pnpm verify` başarılıdır: TypeScript, katalog akışı, 41 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu paketi henüz içermez.
- Sonraki tek iş: kalan belirsiz deniz canlılarının doğrudan ürün/bilimsel kimlik kaynaklarını araştırmak; güvenli kimlik bulunamazsa kategori kapsamını açıklamalı eşleşmeme listesiyle kapatmak.

## 2026-08-31 ikinci deniz omurgasızları — uzman tür güvenlik paketi

- `Rose Corn Bulb Anemone` ve `Bubble Green Anemone` satış adları, doğrudan ürün ve ihracat listelerinde `Entacmaea quadricolor` kimliğine bağlandı. LiveAquaria'nın 30 cm erişkin çap, 30 galondan çevrilen 114 litre, 22–26 °C, pH 8,1–8,4, SG 1.020–1.025 ve orta akıntı değerleri işlendi.
- Balon uçlu anemon için olgun/kararlı akvaryum, güçlü aydınlatma, pompa koruması, düzenli etli yem, bakır yasağı ve hareket ederken mercanları sokma riski açık kullanıcı uyarılarına eklendi.
- `Blue Stripe Nudibranch` ihracat adı `Chelidonura varians` kimliğine; `Antenna Purple Nudibranch` ise resmî ihracat kaydı ve WoRMS taksonomisiyle güncel kabul edilen `Hypselodoris bullockii` adına bağlandı.
- İki deniz salyangozu sıradan kolay canlı gibi sunulmuyor: tür akvaryumu/uzman bakım işareti taşıyor. `Chelidonura varians` için sürekli planarya, `Hypselodoris bullockii` için belirli canlı sünger besini sağlanamazsa açlıktan ölüm riski; pompa koruması, damla alıştırması ve tuzluluk hassasiyeti açıklanıyor.
- Kaynakların yayımlamadığı tank uzunluğu ve tek bir akıntı sınıfı uydurulmadı. `Red Carpet Anemone (Rare)`, iki genel Green Carpet adı ve `Sand Cucumber` birden fazla bilimsel türe gidebildiği için hâlâ eşleştirilmeden korunuyor. `Percula Clownfish (Full Black)` ile birlikte toplam beş ad belirsiz durumda.
- Tam `pnpm verify` başarılıdır: TypeScript, katalog akışı, 42 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu paketi henüz içermez.
- Sonraki tek iş: kalan dört genel omurgasız adı ve Full Black Percula için doğrudan bilimsel kimlik kanıtı aramak; bulunamazsa güvenli eşleşmeme kapsamını nihai olarak belgelemek.

## 2026-08-31 Full Black Percula ve deniz adı kapanışı

- `Percula Clownfish (Full Black)` adı iki doğrudan ihracat/ithalat listesinde `Amphiprion percula` olarak yayımlandığı için güvenli biçimde Percula profiline bağlandı; Cikletist satış adı yalnız Türkiye'deki tam ticari ad eşleşmesi için kullanıldı.
- FishBase'in 11 cm erişkin boyu, OATA ve Fishkeeper'ın deniz suyu aralıkları ile Practical Fishkeeping'in çift için 100 litre eşiği işlendi. Güvenilir kaynaklar santimetre cinsinden minimum akvaryum uzunluğu yayımlamadığı için bu değer tahmin edilmedi; `tankLengthDataNote` ile seçici ve sağlık analizinde açık uyarı gösteriliyor.
- Balık profillerinde akvaryum uzunluğu güvenliği gevşetilmedi: doğrulanmış uzunluk yoksa nedeninin açıklanması zorunlu tutuldu. Hem uzunluk hem veri notu bulunan çelişkili kayıtlar katalog bütünlüğü denetiminde reddediliyor.
- `Red Carpet Anemone (Rare)`, `Green Carpet Anemone`, `Green Carpet Anemone L Boy` ve `Sand Cucumber` adlarının doğrudan mağaza sayfaları bilimsel kimlik yayımlamıyor; bağımsız kaynaklarda aynı genel adların birden fazla türe bağlandığı görüldü. Yanlış bakım profili üretmemek için bu dört ad eşleştirilmeden korunuyor.
- Tam `pnpm verify` başarılıdır: TypeScript, katalog akışı, 43 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu paketi henüz içermez.
- Sonraki tek iş: önceki kategori denetimlerinde çözülmemiş kalan Cikletist satış adlarını, bilimsel kimliği doğrudan doğrulanabilenlerden başlayarak küçük gruplar halinde yeniden ele almak.

## 2026-09-01 cüce ciklet envanteri kapanışı

- `APİSTOGRAMMA COMMBRAE` doğrudan satış adı, ITIS ve FishBase taksonomisiyle `Apistogramma commbrae` kimliğine bağlandı. Fishipedia'nın 4 cm erişkin boy, çift, 50 litre, 23–28 °C ve pH 5–7 değerleri kullanıldı.
- Güvenilir bakım kaynağı santimetre cinsinden minimum akvaryum uzunluğu yayımlamadığı için `Apistogramma commbrae` için uzunluk tahmin edilmedi. Bu sınırlılık `tankLengthDataNote` ile canlı seçicide ve sağlık analizinde açıkça gösteriliyor.
- `OCELLARIS PEACOCK BASS` doğrudan tür adı ve FishBase kaydıyla `Cichla ocellaris` kimliğine bağlandı. FishBase'in 74 cm erişkin boyu ile Fishipedia'nın beşli grup, 5.000 litre, 300 cm cephe, 24–27 °C, pH 6,5–7,5 ve güçlü akıntı gereksinimleri işlendi.
- Satıcı kategorisi kullanıcıyı yanıltmasın diye `Cichla ocellaris` cüce ciklet olarak değil Monster grubunda listeleniyor. Avlanma, tür akvaryumu, yetersiz alan ve düşük grup sayısı uyarıları sağlık regresyonuyla korunuyor.
- Cikletist Cüce Cikletler envanterindeki 26 satış başlığının 26'sı doğrulanmış profile bağlıdır. Katalog denetiminde cichlid grubu 68/68, Monster grubu 29/29 kaynaklı ve bakım verisi tamdır.
- Hedefli TypeScript, katalog akışı, katalog denetimi ve 44 sağlık senaryosu başarılıdır.
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu paketi henüz içermez.
- Sonraki tek iş: Cikletist vatoz/kedi balığı envanterinde çözülemeyen 11 satış adını, bilimsel kimliği doğrudan doğrulanabilenlerden başlayarak yeniden denetlemek.

## 2026-09-01 L103 ve L148 güvenli kimlik paketi

- `L-103 CLOWN PLECO`, mağazadaki genel palyaço vatoz adıyla `Panaqolus maccus`, L104 veya L105'e bağlanmadı. Welsfans'ın doğrudan L-numarası kaydı temel alınarak tür düzeyinde uydurma yapılmadan `Peckoltia sp. L103` profili oluşturuldu.
- L103 için uzman kaynaktaki 12 cm erişkin boy, 80 cm akvaryum, 25–29 °C ve pH 5,5–7,5 eşikleri işlendi. Welsfans'ın 80 cm akvaryumu yaklaşık 112 litre olarak açıklayan rehberi hacim eşiğine kaynak oldu; mağara, oksijenlenme, filtrasyon ve ticari ad karışıklığı kullanıcı uyarılarına eklendi.
- `L-148 Total Spotted Pleco`, güncel uzman veri tabanlarının ortak ataması olan `Ancistrus sp. L148` kimliğine bağlandı. 12 cm erişkin boy, 100 cm akvaryum, yaklaşık 120 litre, 25–29 °C ve pH 5–7 eşikleri işlendi.
- L148 numarasının geçmişte iki farklı balığa verilmiş olduğu ve eski `Chaetostoma` kaydının artık L445 olarak tutulduğu sağlık/bakım uyarısında açıklandı. Böylece yalnızca satış adındaki “spotted” ifadesinden kesin tür üretilmedi.
- `L-146 Albino Pleco` eşleştirilmedi: uzman kaynaklar L146'yı `Peckoltichthys cf. bachi` olarak tanımlarken mağaza başlığındaki “Albino” ifadesini doğrulamıyor. L069 ve diğer genel ticari adlar da aynı güvenlik ilkesiyle çözülmemiş kaldı.
- Cikletist vatoz/kedi balığı envanterinde doğrulanmış profile bağlı başlık sayısı 45'ten 47'ye çıktı; dip balığı kataloğu 66/66 kaynaklı ve bakım verisi tam profile ulaştı.
- Tam `pnpm verify` başarılıdır: TypeScript, 56 başlıklı Cikletist regresyonu dahil katalog akışı, 45 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu paketi henüz içermez.
- Sonraki tek iş: kalan dokuz vatoz/kedi balığı satış adını doğrudan bilimsel kimlik kanıtı olanlardan başlayarak yeniden denetlemek; kimliği doğrulanamayanları güvenli eşleşmeme listesinde tutmak.

## 2026-09-01 çözülmemiş vatoz/kedi balığı adları güvenlik kapanışı

- Borneo Kelebek Vatoz, Red Lip Stick Goby, Blue Neon Goby, Jully Çöpçü, Kürek Burun, Panda Garrarufa, L146 Albino, L069 Peckoltia Ucayalensis ve Colombian Farlowella satış sayfaları yeniden denetlendi. Sayfalar doğrudan bilimsel kimlik vermediği, kullanılan ticari adlar birden fazla türe gittiği veya başlıktaki kimlikler çeliştiği için tahminle profil atanmadı.
- Dokuz ad `catalog-species-unresolved.ts` içinde doğrudan satış sayfası, kimlik belirsizliğini açıklayan uzman/taksonomi kaynakları, doğrulama tarihi ve kullanıcıya gösterilecek açık gerekçeyle kayıt altına alındı.
- Canlı araması artık yalnız seçili grupta değil, akvaryumun su türüyle uyumlu tüm seçili ana sınıfta çalışıyor. Doğrulanmış bir tür başka grupta bulunursa grup otomatik değişiyor.
- Kullanıcı çözülmemiş dokuz addan birini aradığında “Ad bulundu, bilimsel kimlik doğrulanamadı” uyarısını ve nedeni görüyor. Yanlış minimum hacim, sosyal grup veya uyumluluk hesabı üretmemek için ekleme düğmesi devre dışı kalıyor.
- Regresyonlar dokuz kaydın kaynak/tarih/gerekçe bütünlüğünü, tatlı su aramasında bulunmasını, deniz akvaryumunda görünmemesini ve hiçbirinin yanlış sağlık profiline bağlanmamasını koruyor.
- Tam `pnpm verify` başarılıdır: TypeScript, dokuz çözülmemiş adı kapsayan katalog akışı, 45 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- Yerel geliştirme sunucusu başarıyla açıldı; otomatik tarayıcı bağlantısı Windows izin katmanında iki kez engellendiği için bu oturumda görsel tıklama testi çalıştırılamadı.
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu paketi henüz içermez.
- Sonraki tek iş: diğer Cikletist canlı kategorilerindeki çözülmemiş satış adlarını aynı görünür güvenlik listesine taşımak ve kimliği doğrudan kanıtlanabilenleri kaynaklı profile dönüştürmek.

## 2026-09-01 yılan ve müren belirsiz adları güvenlik kapanışı

- Cikletist'in `Yılan Ve Müren Balıkları` kategorisindeki 12 satış başlığı yeniden denetlendi. Sekiz başlık mevcut doğrulanmış profile bağlıdır; `ZİGZAK TARAK BALIKLARI`, `CHANNA GOLDEN LİMBATA`, `WHITE CHECK EEL MÜREN` ve `CHANNA ASIATICA GÖKKUŞAĞI YILANBAŞ BLEHERİ` için güvenli profil kanıtı tamamlanmadı.
- Zigzag eel adı güvenilir kaynaklarda 90 cm'lik `Mastacembelus armatus` için kullanılırken akvaryum ticaretinde 20 cm civarındaki `Macrognathus circumcinctus` için de kullanılıyor. Yalnız genel satış adıyla iki çok farklı bakım profili arasından seçim yapılmadı.
- `Channa limbata` geçerli bir takson olsa da ürün sayfası bilimsel kimliği, köken popülasyonunu ve zorunlu akvaryum eşiklerini yayımlamıyor; türün `C. gachua` kompleksi içindeki genetik çeşitliliği nedeniyle eşikler başka popülasyondan kopyalanmadı.
- `WHITE CHECK EEL MÜREN` sayfası bilimsel ad ve su türü vermiyor. Bilimsel literatürdeki White-cheek moray adı `Echidna rhodochilus` için kullanılsa da mağazadaki `Check` yazımının aynı canlı olduğunu gösteren doğrudan kanıt bulunmadı. Kayıt tatlı, acı ve deniz suyu aramalarında açıklamalı görünür; hiçbirinde eklenemez.
- `CHANNA ASIATICA ... BLEHERİ` başlığı iki ayrı geçerli türü, `Channa asiatica` ve `Channa bleheri` adlarını birleştiriyor. Satıcı hangi türü sunduğunu açıklamadığı için mevcut Rainbow Snakehead profiline veya başka Channa profiline bağlanmadı.
- Dört kayıt doğrudan satış sayfası, taksonomi/uzman kaynakları, doğrulama tarihi ve kullanıcıya gösterilen açık gerekçeyle `catalog-species-unresolved.ts` dosyasına eklendi. Çözülmemiş görünür canlı listesi dokuzdan 13'e çıktı.
- Regresyonlar dört adın Monster grubunda bulunmasını, yazım varyantlarını, su türü görünürlüğünü ve hiçbirinin yanlış sağlık profiline bağlanmamasını koruyor.
- Tam `pnpm verify` başarılıdır: TypeScript, 13 çözülmemiş adı kapsayan katalog akışı, 45 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu paketi henüz içermez.
- Sonraki tek iş: Cikletist Monster envanterindeki `AFRİKAN AROWANA` ve `ÇİN EJDERİ` satış adlarını güvenilir kimlik ve bakım kaynaklarıyla yeniden denetlemek.

## 2026-09-01 Afrika Arowanası ve Çin Ejderi güvenli profil paketi

- `AFRİKAN AROWANA` satış adı, FishBase ve uzman bakım kaynaklarıyla `Heterotis niloticus` kimliğine bağlandı. 100 cm erişkin boy, 1.000 litre güvenli alt hacim, 25–30 °C ve pH 6–7,5 eşikleri; güçlü filtrasyon, kapak ve küçük canlıları yutma riskleri işlendi.
- Kaynaklar santimetre cinsinden güvenilir bir minimum akvaryum uzunluğu yayımlamadığı için Afrika Arowanası için uzunluk tahmin edilmedi. Bu sınırlılık `tankLengthDataNote` ile kullanıcıya ve sağlık analizine aktarılıyor.
- `ÇİN EJDERİ` Türkiye'deki doğrudan ürün adı, FishBase ve uzman bakım kaynağıyla `Myxocyprinus asiaticus` kimliğine bağlandı. 68 cm erişkin boy, en az 300 galon/yaklaşık 1.135 litre, 15–26 °C, pH 6–8 ve güçlü akıntı gereksinimleri işlendi.
- Çin Ejderi için de doğrulanmış santimetre uzunluğu bulunmadığından değer uydurulmadı; erişkin bakımının çoğu ev akvaryumundan çok büyük sistem veya havuz gerektirdiği görünür uyarıya eklendi.
- Regresyonlar iki adın Cikletist Monster envanterinde doğru profile bağlanmasını; hacim, sıcaklık, akıntı, avcılık ve eksik uzunluk verisi uyarılarının üretilmesini koruyor. Monster grubu 29'dan 31 doğrulanmış profile çıktı.
- Tam `pnpm verify` başarılıdır: TypeScript, katalog akışı, 47 sağlık senaryosu, kaynak/bakım denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu paketi henüz içermez.
- Sonraki tek iş: Cikletist'in güncel iki sayfalık Monster envanterini yeniden çıkarıp mevcut regresyon listesini yenilemek; yeni başlıkları doğrulanmış profillere veya kaynaklı güvenlik listesine bağlamak.

## 2026-09-02 Monster yeniden doğrulama ve Canlı Doğuranlar tam envanteri

- Cikletist Monster ana kategorisi canlı siteden yeniden okundu. Sayfa 2 isteği ana sayfaya yönleniyor; güncel envanter 21 başlıktır. Mevcut 21 başlıklı regresyonla birebir eşleştiği için arama motorundaki eski, daha uzun önbellek listesi güncel veri kabul edilmedi.
- Cikletist Canlı Doğuranlar kategorisinin iki sayfasındaki 26 satış başlığının tamamı tek regresyon envanterine alındı. `YELLOW TUXEDO LEPİSTES` ve `SANTA CLAUS LEPİSTES` dahil 20 lepistes varyetesi aynı `Poecilia reticulata` biyolojik profiline bağlandı; renk adı ayrı tür olarak çoğaltılmadı.
- Lepistes profili FishBase ve OATA kaynaklarıyla yenilendi: 6 cm erişkin dişi boyu, en az 45 litre ve 60 cm akvaryum, en az üçlü ve dişi ağırlıklı grup, 20–28 °C, pH 7–8, sert/alkali su ve nazik akıntı gereksinimleri işlendi.
- `VELİFERA BALIKLARI` ve `VELİFERA TÜRLERİ`, `Poecilia latipinna` profiline kopyalanmadı; FishBase ve Seriously Fish kaynaklarıyla ayrı `Poecilia velifera` profiline bağlandı. 15 cm, yaklaşık 104 litre, 91 cm taban, en az üçlü grup, 22–28 °C ve pH 7–8,5 eşikleri ile ticari melezlik uyarısı eklendi.
- Yalnız renk adı taşıyan `ALBİNO SKY BLUE` sayfası tür veya bilimsel ad yayımlamadığı için lepistes ya da moli olarak tahmin edilmedi. Canlı doğuran aramasında neden eşlenmediğini açıklayan, eklenemez güvenlik kaydı olarak gösteriliyor; çözülmemiş görünür liste 14 kayda çıktı.
- Tam `pnpm verify` başarılıdır: TypeScript, 26 başlıklı Canlı Doğuranlar regresyonu, 48 sağlık senaryosu, kaynak/bakım denetimi ve 14 sayfalık üretim derlemesi geçti. Canlı doğuran grubu 14/14 kaynaklı ve bakım verisi tam profile ulaştı.
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu paketi henüz içermez.
- Sonraki tek iş: Cikletist Betta kategorisinin güncel satış envanterini çıkarıp tüm canlı başlıklarını kaynaklı Betta veya diğer labirentli profillerle karşılaştırmak.

## 2026-09-02 Betta ve labirentli güvenlik paketi

- Cikletist Betta kategorisindeki yem ürünü ayrıştırıldı; kalan 14 canlı satış başlığının tamamı tek regresyon envanterine alındı. Veiltail, Crowntail, Halfmoon, White, Galaxy Koi, Taç, Samurai ve Plakat satış adları ayrı tür üretilmeden `Betta splendens` profiline; Dev Gurami ve Çikolata Gurami kendi tür profillerine bağlandı.
- Betta profili FishBase ve OATA kaynaklarıyla yenilendi: 6,5 cm erişkin boy, tek erkek için en az 20 litre, 20–28 °C, pH 6–8, nazik akıntı, ısıtıcı ve biyolojik filtre gereksinimleri işlendi. İki erkeğin birlikte tutulmaması, dişi grupları ve yüzgeç ısıran tank arkadaşları için açık kullanıcı uyarıları eklendi.
- Kaynaklar santimetre cinsinden minimum tank uzunluğu yayımlamadığı için eski kaynaksız 40 cm değeri kaldırıldı. Tahmin yerine veri sınırlılığı sağlık analizinde görünür uyarı olarak gösteriliyor.
- `MEYAN KÖKÜ GURAMİ` ürün sayfası bilimsel tür veya köken yayımlamıyor. Uzman Parosphromenus kaynağı ticarette `P. deissneri` adının çok sayıda meyan kökü guramisi için yanlış kullanıldığını doğruladığı için satış adı herhangi bir tür profiline tahminle bağlanmadı; labirentli aramasında açıklamalı ve eklenemez güvenlik kaydı olarak gösteriliyor.
- Tam `pnpm verify` başarılıdır: TypeScript, 14 başlıklı Betta regresyonu, 15 çözülmemiş güvenlik kaydı, 49 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. Labirentli grubu 14/14 kaynaklı ve bakım verisi tam profile sahiptir.
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu paketi henüz içermez.
- Sonraki tek iş: Cikletist Japon/Oranda kategorisinin güncel satış envanterini çıkarıp tüm canlı başlıklarını doğrulanmış Japon balığı veya koi profilleriyle karşılaştırmak.

## 2026-09-02 Japon/Oranda envanteri ve adet bazlı hacim güvenliği

- Cikletist Japon/Oranda kategorisindeki 18 güncel satış kaydının tamamı tek regresyon envanterine alındı. Aynı adla iki ayrı stok kaydı bulunan `Ranchu Japon Balıkları` tekrarı da envanter sayısında korunuyor; 13 süslü/genel Japon balığı kaydı `Carassius auratus`, beş koi kaydı `Cyprinus carpio` profiline bağlıdır.
- Japon balığı profili OATA ve FishBase kaynaklarıyla yenilendi: akvaryumda yaygın 25 cm erişkin boy, ilk yetişkin için 100 litre, her ek yetişkin için 50 litre, 100 cm akvaryum, 4–25 °C, pH 6–8 ve düşük akıntı eşikleri işlendi.
- Sağlık analizine tür bazlı `additionalVolumePerAnimalL` alanı eklendi. Böylece iki yetişkin Japon balığı 120 litrede artık uygun görünmüyor; analiz kayıtlı adede göre gereken 150 litreyi kullanıcıya açıkça gösteriyor.
- Oranda, Ranchu, Ryukin, Balongöz ve Teleskop gibi yavaş süslü formların hızlı tek kuyruklularla yem rekabeti; yüksek atık yükü, güçlü biyolojik/mekanik filtrasyon, oksijen, haftalık test ve su değişimi gereksinimleri görünür uyarılara işlendi.
- Tam `pnpm verify` başarılıdır: TypeScript, 18 kayıtlı Japon/Oranda envanteri, 50 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu paketi henüz içermez.
- Sonraki tek iş: Cikletist Labirentli Balıklar kategorisinin güncel satış envanterini çıkarıp Betta kategorisi dışında kalan bütün satış adlarını kaynaklı profillerle karşılaştırmak.

## 2026-09-02 Labirentli Balıklar envanteri ve arama önceliği güvenliği

- Cikletist Labirentli Balıklar kategorisindeki 15 canlı başlığının tamamı regresyon kapsamına alındı. Betta kategorisinden doğrulanan 14 kayda ek olarak yalnız `Gurami` adıyla yayımlanan ürün doğrudan satış sayfasından denetlendi.
- Genel `Gurami` satış sayfası bilimsel tür, köken veya erişkin boy yayımlamıyor ve görselin temsili olduğunu belirtiyor. OATA, gurami adının yaklaşık 4 cm'lik kıvılcım guramiden 70 cm'lik dev guramiye kadar çok farklı türleri kapsadığını doğruladığı için kayıt herhangi bir mevcut gurami profiline tahminle bağlanmadı; açıklamalı ve eklenemez güvenlik kaydı olarak eklendi.
- Çözülmemiş canlı araması tam ad eşleşmesini daha uzun kısmi eşleşmelerden önce seçiyor. Canlı ekleme formu da çözülmemiş satış adını doğrulanmış katalogdaki kısmi eşleşmeden önce kontrol ediyor; böylece `Gurami` yazıldığında Cüce, Dev veya başka bir gurami otomatik seçilmiyor.
- Canlı ekleme ekranındaki alan uyarısı `additionalVolumePerAnimalL` değerini kullanacak şekilde yenilendi; Japon balığı gibi adet başına ilave hacim gerektiren türlerde kayıt anında doğru toplam litre gösteriliyor.
- Tam `pnpm verify` başarılıdır: TypeScript, 15 başlıklı Labirentli envanteri, 16 çözülmemiş güvenlik kaydı, 50 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu paketi henüz içermez.
- Sonraki tek iş: Cikletist Tetra Türleri kategorisinin güncel sayfalarını çıkarıp bütün satış adlarını kaynaklı tetra, rasbora, barb veya diğer uygun profillerle karşılaştırmak.

## 2026-09-03 Tetra Türleri ana kategori envanteri ve belirsiz ad güvenliği

- Cikletist Tetra Türleri ana kategorisinin altı güncel sayfası doğrudan indirildi; sayfa başına 24 ve son sayfada dokuz olmak üzere toplam 129 satış satırı regresyon kapsamına alındı. Aynı adla iki ayrı stok kaydı bulunan `İTHAL SARI İMPARATOR CİKLET` tekrarı satır sayısında korundu.
- 96 satış satırı daha önce bilimsel kimliği ve bakım eşikleri doğrulanmış tetra, rasbora, barb, rainbowfish, cichlid, monster ve diğer profillere bağlıdır. Kimliği belirlenemeyen 33 satır, 32 benzersiz açıklamalı güvenlik kaydıyla kapsandı; bu kayıtlar aramada bulunuyor fakat yanlış hacim, su türü veya uyumluluk hesabı üretmemek için eklenemiyor.
- Eşleşmeyen ürün sayfalarının görünür açıklamaları ayrıca denetlendi: bilimsel tür veya bakım eşiği yayımlanmıyor ve balık görsellerinin temsili olduğu belirtiliyor. Bu nedenle `Blue King Tetra`, `Buz Balığı`, genel `Rasbora`, `Puffer Balıkları`, karışık ciklet ve benzeri adlar fotoğrafa ya da ticari ada bakılarak tahminle profile bağlanmadı.
- Canlı aramasına doğrulanmış tam eşleşme önceliği eklendi. Böylece kaynaklı `ARGUS BALIKLARI` profili daha uzun çözülmemiş `SİLVER ARGUS BALIKLARI` kaydı yüzünden engellenmiyor; buna karşılık genel `Gurami` gibi kesin çözülmemiş adlar kısmi bir doğrulanmış türü seçemiyor.
- Tam `pnpm verify` başarılıdır: TypeScript, 129 satırlık Tetra ana kategori regresyonu, 48 benzersiz çözülmemiş kayıt, 50 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu paketi henüz içermez.
- Sonraki tek iş: Cikletist Havuz Balıkları kategorisinin güncel satış envanterini çıkarıp tüm adları kaynaklı koi, Japon balığı veya diğer havuz profilleriyle karşılaştırmak.

## 2026-09-03 Havuz Balıkları envanteri ve satış adı normalizasyonu

- Cikletist Havuz Balıkları kategorisindeki sekiz güncel satış başlığının tamamı regresyon kapsamına alındı. Beş koi satırı `Cyprinus carpio`, üç Japon balığı satırı `Carassius auratus` profiline bağlıdır; çözülmemiş havuz balığı kaydı kalmadı.
- `KOİ TÜL KUYRUK`, Longfin Koi ve Butterfly Koi adları ayrı bir biyolojik tür oluşturulmadan koi profiline bağlandı. Profil, bu adların aynı türün uzun yüzgeçli seçilim formunu anlattığını ve yetişkin koi bakım eşiklerinin geçerli olduğunu kullanıcıya açıklar.
- Canlı katalog aramasındaki metin normalizasyonu yinelenen boşlukları tek boşluğa indiriyor. Böylece canlı sitedeki `KOİ BALIKLARI HAVUZ BALIKLARI  A+` başlığı gibi yazımlar güvenli eşleşmeyi bozmaz.
- Tam `pnpm verify` başarılıdır: TypeScript, sekiz satırlık Havuz Balıkları regresyonu, 48 benzersiz çözülmemiş kayıt, 50 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu paketi henüz içermez.
- Sonraki tek iş: Cikletist Balık Çeşitleri ana kategorisinin güncel sayfalarını çıkarıp alt kategorilere yanlış yerleştirilmiş veya henüz regresyon kapsamına alınmamış satış adlarını belirlemek.

## 2026-09-04 Balık Çeşitleri ana kategori tam envanteri

- Cikletist Balık Çeşitleri ana kategorisinin 16 güncel sayfası doğrudan indirildi. Sayfa başına 24 olmak üzere 384 satış satırı ve 377 benzersiz satış adı kalıcı fixture ve regresyon kapsamına alındı.
- 310 satır doğrulanmış biyolojik profile bağlandı. Rio Manacapuru Melek, Altın Balon/Ramirezi, kısaltılmış Apistogramma macmasteri, Meksika Cüce Kerevit ve Deep Blue Bolt adları mevcut doğrulanmış tür profillerine güvenli takma ad olarak eklendi; renk, boy veya yöre adı ayrı tür oluşturmadı.
- Bilimsel kimliği veya zorunlu akvaryum eşiği tamamlanamayan 71 satır açıklamalı ve eklenemez güvenlik sonucuna bağlandı. Bu kapsam için 18 yeni benzersiz kayıt eklendi; toplam görünür güvenlik listesi 66 kayda çıktı. Green Texas adındaki iki türlü kullanım, türsüz Amerikan kereviti, karışık Nerite/Caridina hatları ve türü verilmeyen deniz omurgasızları tahminle profile atanmadı.
- `JOKER ÜRÜN`, genel `ürün` ve `TETRA BETTA MENÜ 100ML` canlı olmadıkları için canlı ve çözülmemiş canlı sonuçlarından açıkça dışlandı.
- Regresyon; 384 satırın tamamını, 15 alt kategori dağılımını, doğrulanmış/çözülmemiş/canlı olmayan 310/71/3 ayrımını ve tatlı su-deniz suyu görünürlük sınırlarını koruyor.
- Tam `pnpm verify` başarılıdır: TypeScript, katalog akışı, 50 sağlık senaryosu, 49 marka katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu paketi henüz içermez.
- Sonraki tek iş: kapasite hesabına katılması gereken fakat yayımlanmış teknik sayısı bulunmayan 37 ekipman kaydını onaylı ikincil kaynaklarda yeniden denetlemek; 28 kayıtla en büyük açık olan Jeneca'dan devam etmek.

## 2026-09-04 Jeneca XP filtreleri kapasite doğrulaması

- Jeneca'nın resmî XP-18/19/31/32 teknik tablosu bulundu. XP-18 ve XP-31 için 240 L/saat ile 4,2 W; XP-19 ve XP-32 için 270 L/saat ile 4,8 W değerleri doğrudan üretici sayfasından işlendi. Dört modelin ayarlanabilir akış özelliği de aynı resmî açıklamadan doğrulandı.
- XP-18 ve XP-19 için ayrı satış seçeneği tablosunda yayımlanan 48 ve 54 litrelik akvaryum üst sınırları ikincil kaynak olarak saklandı. XP-31 ve XP-32 için yayımlanmayan hacim sınırı tahmin edilmedi.
- XP-01A'nın ayrı resmî üretici sayfasındaki 90 L/saat ve 2,5 W değerleri işlendi; düşük su seviyeli filtre otomatik uygunluk hesabına alındı.
- GL-3/5/7 ailesinin resmî teknik tablosu bulundu. Modeller sırasıyla 250/300/350 L/saat ve 3/3,5/4 W değerleriyle otomatik filtrasyon hesabına alındı.
- YM-03 yüzey skimmeri iki bağımsız kaynakta ortak yayımlanan 300 L/saat, 5 W ve 300 litre üst sınırıyla doğrulandı. Yüzey filmi temizliği ana mekanik ve biyolojik filtrenin yerine geçmediği için sağlık analizi skimmer debisini ana filtre çevrimine katmıyor ve tek başına seçildiğinde `Ana filtre gerekli` uyarısı veriyor.
- YM-01 üreticinin yüzey yağ filmi giderici ailesinde doğrulandı; bağımsız satış kaydı cihazın pompasız olduğunu açıkça gösteriyor. Bu nedenle pasif yardımcı parça olarak işaretlendi, motorlu kapasite açığı olmaktan çıkarıldı ve sağlık puanında ana filtre sayılmıyor.
- AP-06 üreticinin AP serisi teknik tablosunda iki ayrı 7 L/dakika çıkış, toplam 840 L/saat, 7 W ve 0,02 MPa ile doğrulandı; otomatik hava kapasitesi hesabına alındı.
- AP-20000 aynı resmî AP serisi tablosunda 8 L/dakika (480 L/saat), 8 W ve 0,023 MPa ile doğrulandı; ayarlanabilir hava çıkışıyla otomatik kapasite hesabına alındı.
- XP-605 üreticinin güncel model tablosunda 250 L/saat ve 3,5 W ile doğrulandı; ayarlanabilir askı filtre otomatik kapasite hesabına alındı.
- GD-402/502/602 üreticinin model bazlı tablosundaki 500/1000/1800 L/saat ve 8/15/25 W değerleriyle doğrulandı. Aynı tablo, eski ikincil kaynakların GD-403 ve GD-503 değerleriyle çeliştiği için bu iki modelin sayıları kesin değer olarak kullanılmadı; çelişki açıklanarak otomatik hesaptan çıkarıldı. GD-603'ün 1800 L/saat ve 25 W değeri iki kaynakta ortaktır.
- IPF-338 üreticinin doğrudan ürün sayfasında 300 L/saat ve 5 W ile doğrulandı. Ürün kimliği IPF-338 iken teknik tablo satırında PF-338 yazılması açıklamada korundu; iki bağımsız ürün sayfasındaki aynı 300 L/saat ve 5 W değeri çapraz doğrulama bağlantısı olarak eklendi.
- DB-11 üreticinin güncel DB serisi teknik tablosunda 11 L/dakika (660 L/saat), 6,5 W ve en az 0,020 MPa ile doğrulandı. DB-58 Upgrade üreticinin doğrudan model görselinde en fazla 55 L/dakika (3300 L/saat) ve 25 W ile doğrulandı; ayarlanabilir çıkış ve aynı üst değer bağımsız ürün sayfasıyla çapraz kontrol edildi. Üreticinin güncel DB serisi tablosu, DB-11 Upgrade için 11 L/dakika (660 L/saat), 6,5 W ve en az 0,020 MPa; DB-21 Upgrade için 18 L/dakika (1080 L/saat), 10 W ve en az 0,025 MPa değerlerini ve iki modelde kablolu akış ayarını ayrı ayrı yayımladığı için bu varyantlar otomatik hava kapasitesi hesabına alındı.
- DC-003 üreticinin doğrudan ürün sayfasındaki cihaz etiketiyle çift 1,5 L/dakika çıkış, toplam 180 L/saat ve 0,018 MPa olarak doğrulandı; sürekli ve 10 saniyelik aralıklı çalışma açıklamaya işlendi. Etikette watt değeri yayımlanmadığı için `powerW` tahmin edilmedi. DC-001 üreticinin doğrudan ürün görselinde 1,3 L/dakika (78 L/saat), 0,018 MPa ve DC 3,7 V olarak doğrulandı; görseldeki 130 mAh ifadesi watt gibi yorumlanmadı.
- AP-18000 üreticinin doğrudan model sayfasındaki teknik tabloda 8 L/dakika (480 L/saat), 6 W, 0,018 MPa ve 180 × 135 × 95 mm olarak doğrulandı. Kaynak ayarlanabilir çıkış yayımlamadığı için bu özellik tahmin edilmedi.
- TGD-15, TGD-16, TGD-17, TGD-18 ve TGD-19 üreticinin doğrudan model görselinde ayrı ayrı 400 L/saat ve 6 W olarak yayımlandı; beş model de otomatik filtrasyon hesabına alındı.
- Jeneca'da kapasite gerektiren kayıt sayısı 186, hazır kayıt sayısı 183 oldu (%98). Tüm katalogdaki açıklamalı kapasite boşluğu 39'dan 12'ye, Jeneca açığı 30'dan 3'e düştü.
- Tam `pnpm verify` 2026-09-04 tarihinde başarılıdır: TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 52 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu paketi henüz içermez.
- Jeneca'nın kalan üç kapasite boşluğu yeniden tarandı. GD-403/GD-503 için resmî ve ikincil tablolar birbiriyle çelişiyor; GD-320 için debi yayımlanmıyor. Bu üç kayıt tahmin edilmeden açıklamalı biçimde hesap dışında kalıyor.

## 2026-09-06 Boyu SP-1300C kapasite doğrulaması

- Boyu'nun doğrudan SP serisi ürün sayfasındaki model görseli SP-1300C için 400 L/saat, 9 W, 0,5 m azami basma yüksekliği ve 101 × 60 × 196 mm ölçülerini yayımlıyor. Otomatik filtrasyon profiline debi ve güç işlendi; katalog kaynağı doğrudan ürün sayfasına taşındı.
- Boyu'nun kapasite gerektiren 87 kaydının tamamı artık otomatik hesap verisine sahiptir (%100). Tüm katalogdaki açıklamalı kapasite boşluğu 12'den 11'e düştü.
- Hedefli katalog akışı, katalog denetimi ve tam `pnpm verify` 2026-09-06 tarihinde başarılıdır: TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 52 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu paketi henüz içermez.

## 2026-09-06 Haqos Thermo-Sprite kapasite doğrulaması

- Haqos'un doğrudan Thermo-Sprite ürün sayfası model kimliğini, onaylı yerel ikincil kaynak ise 15 W güç ile 14 × 2,5 cm ölçülerini doğruluyor. Isıtıcıya güç işlendi; yayımlanmayan önerilen akvaryum hacmi tahmin edilmedi.
- Haqos'ta kapasite gerektiren 21 kaydın 19'u artık otomatik hesap verisine sahiptir (%90). Tüm katalogdaki açıklamalı kapasite boşluğu 11'den 10'a düştü.
- Tam `pnpm verify` 2026-09-06 tarihinde başarılıdır: TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 52 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu paketi henüz içermez.
- Sonraki tek iş: kalan 10 açıklamalı kapasite boşluğunu yeniden denetlemek. Kalanlar Aquawing AQ-A3000; Jeneca GD-403, GD-503 ve GD-320; Eurostar Motorlu Pipo Filtre Medium ve Large; Haqos EASY-1000AT ve Aqua Flow 250; Nubios YU-118C ve YU-119C'dir. Doğrulanmış sayısal değer bulunamazsa mevcut güvenlik kaydı korunacaktır.

## 2026-09-06 Aquawing AQ-A3000 kaynak yenilemesi

- AQ-A3000 doğrudan ürün sayfasında çift çıkışlı hava kompresörü, 25 W ve `8690000438723` barkoduyla doğrulandı; Akvaryum Express marka kataloğu da model ile 25 W bilgisini bağımsız olarak doğruluyor.
- İki kaynak da hava debisi yayımlamadığından debi tahmin edilmedi ve kayıt otomatik hava kapasitesi hesabının dışında tutuldu. Genel marka bağlantısı ikincil kaynak olarak korunurken ana bağlantı doğrudan ürün sayfasına taşındı.
- Bu karar katalog regresyon testine bağlandı. Tam `pnpm verify` 2026-09-06 tarihinde başarılıdır: TypeScript, katalog akışı, 52 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. Açıklamalı kapasite boşluğu sayısı 10 olarak değişmedi.

## 2026-09-06 ekipman kapasite uyarısı açıklaması

- Sağlık ekranında tek bir ekipmanın kapasite verisi eksik veya çelişkiliyse katalogdaki doğrulama nedeni artık doğrudan gösterilir. Kullanıcı yalnızca genel bir “eksik” mesajı yerine, verinin yayımlanmadığını veya iki kaynağın hangi sayılarda çeliştiğini görür.
- Jeneca GD-320 yayımlanmamış veri ve GD-403 çelişkili veri akışları sağlık regresyonuna eklendi. Tam `pnpm verify` 2026-09-06 tarihinde başarılıdır: TypeScript, katalog akışı, 52 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.

## 2026-09-06 kapasite boşluğu denetim sınıflandırması

- Katalog denetimi teknik değer bulunmayan kayıtlarla birbiriyle çelişen kaynakları artık ayrı durumlar olarak raporlar. Jeneca GD-403 ve GD-503 `kaynaklar çelişkili`; kalan sekiz açık kayıt `kaynakta yayımlanmamış` olarak görünür.
- Hedefli katalog denetimi ve tam `pnpm verify` başarılıdır: TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 52 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.

## 2026-09-06 Eurostar ve Nubios açık kayıt kimliği

- Eurostar Motorlu Pipo Filtre Medium ve Large için yetkili satıcıdaki ürün kodu, barkod, cihaz ölçüsü ve sünger ölçüsü kataloğa ve regresyon testine işlendi. İki modelin 5 W gücü doğrulandı; su debisi yayımlanmadığı için boşluk güvenli biçimde korundu.
- Nubios YU-118C ve YU-119C ürün kodları doğrulandı. YU-118C adına açılmış bir sayfadaki XY-2900 teknik metninin başka markaya ait olduğu katalog açıklamasında ve regresyon testinde açıkça korunuyor; iki model için debi tahmin edilmedi.
- Hedefli katalog akışı ve tam `pnpm verify` başarılıdır: TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 52 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.

## 2026-09-06 ekipman kategori-marka-model seçici güvencesi

- Ekipman ekleme ekranı kategori kayıtlarını, o kategoriye ait marka listesini ve seçilen kategori/markaya ait model listesini ortak katalog yardımcı fonksiyonlarından alıyor. Kategori değişiminde marka, arama ve seçili model yeni kategoriye göre sıfırlanıyor.
- Yedi ekipman kategorisinin tamamında kategori, marka ve model saflığı regresyon testine bağlandı; filtre seçildiğinde ısıtıcı veya başka kategori modeli gösterilmesi test tarafından engelleniyor.
- TypeScript, hedefli katalog akışı ve tam `pnpm verify` başarılıdır: yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 52 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.

## 2026-09-06 canlı sınıfı-grup-su türü seçici güvencesi

- Canlı ekleme ekranı artık seçilen ana sınıf ve akvaryum su türüne uygun profilleri ve grupları ortak katalog yardımcı fonksiyonlarından alıyor. Kategori değişiminde grup, arama, seçili tür ve önerilen adet yeni bağlama göre sıfırlanıyor.
- Balık, karides, salyangoz ve diğer canlı sınıfları; freshwater, saltwater ve brackish akvaryum türlerinin tamamıyla çapraz regresyon testine bağlandı. Uyumsuz su türü veya farklı canlı sınıfı seçiciye sızarsa test başarısız olur.
- TypeScript, hedefli katalog akışı ve tam `pnpm verify` başarılıdır: yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 52 sağlık senaryosu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.

## 2026-09-06 ortak mobil ve masaüstü menü kaynağı

- Masaüstü sol menü ile mobil açılır sol menü aynı navigasyon listesinden besleniyor. Genel Bakış, Akvaryumlarım, Su Değerleri, Bakım Günlüğü, Canlılar, Bitkiler, Ekipmanlar, Ürün Kataloğu, Hesaplayıcılar ve Ayarlar bağlantıları tek kaynakta korunuyor.
- Ortak sıra, zorunlu bağlantılar ve yinelenen bağlantı bulunmaması regresyon testine bağlandı. Böylece yeni bir başlık eklenirken veya değiştirilirken mobil menünün eksik kalması önleniyor.
- TypeScript, hedefli katalog akışı ve tam `pnpm verify` başarılıdır: yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 52 sağlık senaryosu, katalog denetimi ve ortak menünün bağlandığı 14 sayfalık üretim derlemesi geçti.

## 2026-09-06 hesaplayıcı güvence paketi

- Akvaryum hacmi, su değişimi ve kum miktarı hesapları arayüzden ayrılarak ortak, test edilebilir hesaplama fonksiyonlarına taşındı. Geçersiz negatif ve sonlu olmayan girişler güvenli biçimde sıfırlanıyor; su değişimi ve hacim kaybı yüzdeleri 0–100 aralığında tutuluyor.
- Kum hesaplayıcı ön ve arka yükseklikten eğimli tabanın ortalama yüksekliğini, gereken litreyi ve seçilen kum türünün yaklaşık yoğunluğuna göre ağırlığı hesaplıyor. Silis kum, bazalt kum, aquasoil, mercan kırığı ve doğal çakıl seçenekleri korunuyor; kullanıcıya ağırlığın tane boyu, nem ve üreticiye göre değişebileceği belirtiliyor.
- Hacim, su değişimi, eğimli taban, kum türüne göre ağırlık farkı, hatalı giriş koruması ve kum türü veri bütünlüğü bağımsız regresyon testine bağlandı. Tam `pnpm verify` başarılıdır: TypeScript, katalog akışı, 52 sağlık senaryosu, hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu hesaplayıcı güvence paketini henüz içermez.

## 2026-09-06 Geophagus brasiliensis canlı profili

- Cikletist'teki `GEOPHAGUS BRASİLİENSİS` başlığı bilimsel tür adını doğrudan verdiği için FishBase kimlik, 28 cm erişkin boy ve tatlı/acı su kaydıyla doğrulandı. Bağımsız bakım kaynağındaki 320 litre, 60 inç (yaklaşık 152 cm), 20–28 °C ve pH 6,0–8,0 eşikleriyle güvenli sağlık profili tamamlandı.
- Satış adı artık açıklamalı bekleme listesinden çıkarılarak `Geophagus brasiliensis` profiline bağlanıyor. `Pearl Cichlid` ortak adı yanlışlıkla Texas ciklet profiline bağlanmayacak şekilde düzeltildi; bölgecilik, küçük balık riski, ince kum, güçlü filtrasyon ve düzenli su değişimi uyarıları eklendi.
- Ana kategori dağılımı 311 doğrulanmış, 70 açıklamalı beklemede ve üç canlı olmayan satır oldu; görünür çözülmemiş kayıt sayısı 65'e düştü. Tam `pnpm verify` başarılıdır: TypeScript, katalog akışı, 52 sağlık senaryosu, hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- Haqos EASY-1000AT ve Aqua Flow 250 ayrıca yeniden tarandı. Üreticinin sayfası teknik açıklamayı görselde yayımlıyor ancak görsel sunucusu erişilemedi; arama ve satıcı kaynakları model bazlı debi vermedi. Debi tahmin edilmedi ve iki güvenlik kaydı korundu.

## 2026-09-06 Rosy Tetra canlı profili

- Cikletist'teki `ROSY TETRA BALIKLARI` başlığı, uzman bakım kaynaklarının ortak adı doğrudan `Hyphessobrycon rosaceus` için kullanmasıyla doğrulandı. Kayıt 5 cm erişkin boy, en az 68 litre/60 cm akvaryum, en az sekizli sürü, 24–28 °C ve pH 5,5–7,5 eşikleriyle kaynaklı profile bağlandı.
- Benzer `Gül Tetra` satış adı birden fazla yakın tür için kullanılabildiğinden tahminle aynı profile bağlanmadı ve açıklamalı güvenlik listesinde bırakıldı. Bu iki adın ayrımı regresyon testleriyle korunuyor.
- Tetra ana kategorisi 97 doğrulanmış ve 32 açıklamalı satıra; genel ana kategori 312 doğrulanmış, 69 açıklamalı ve üç canlı olmayan satıra ulaştı. Görünür çözülmemiş kayıt sayısı 64'e düştü.
- Tam `pnpm verify` başarılıdır: TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu canlı profili değişikliğini henüz içermez.

## 2026-09-07 Hemiodus gracilis canlı profili

- Cikletist'teki `RED TAİLED HEMİODUS` başlığı, Fishkeeper ve Seriously Fish kaynaklarının Red-tailed/Redtail Hemiodus adını doğrudan `Hemiodus gracilis` için kullanmasıyla doğrulandı. FishBase kimlik, 16,3 cm standart boy ve 23–27 °C/pH 5,8–7,2 aralığını ayrıca doğruluyor.
- Güvenli profil 18 cm mağaza erişkin boyu, en az 243 litre ve 120 cm akvaryum, en az sekizli sürü, güçlü filtrasyon, yüksek oksijen, sıkı kapak ve geniş açık yüzme alanı eşikleriyle eklendi. Küçük ve sakin balıkları strese sokma riski kullanıcı uyarısına işlendi.
- Satış adı açıklamalı bekleme listesinden çıkarıldı. Tetra mağaza kategorisi 98 doğrulanmış ve 31 bekleyen satıra; genel ana kategori 313 doğrulanmış, 68 bekleyen ve üç canlı olmayan satıra ulaştı. Görünür çözülmemiş kayıt sayısı 63'e düştü.
- Tam `pnpm verify` başarılıdır: TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu canlı profili değişikliğini henüz içermez.

## 2026-09-07 African Butterfly Fish profil düzeltmesi

- Cikletist'teki `BUTTERFLY FISH` satırının mağazanın tatlı su `Sazansıgiller` bölümünde yer aldığı doğrulandı. Bu bağlamdaki yalın ortak ad, uzman kaynaklarda tek tür olan `Pantodon buchholzi` için kullanıldığından yalnızca tam mağaza başlığı mevcut African Butterfly Fish profiline bağlandı; genel `Kelebek Balığı` takma adı eklenmedi.
- Mevcut profilin kaynakta doğrudan karşılığı bulunmayan 96 litre/80 cm değerleri kaldırıldı. Seriously Fish'teki 90 × 30 cm taban ve yaklaşık 81 litre, 12 cm standart boy ve 23–30 °C/pH 6,0–7,5 bilgileri; Fishkeeper'daki 15 cm üst boy ve yüzey avcısı bakım uyarılarıyla birleştirildi. Güvenli hesapta 15 cm erişkin boy ve 90 cm akvaryum uzunluğu kullanılıyor.
- Satış adı açıklamalı bekleme listesinden çıkarıldı. Tetra mağaza kategorisi 99 doğrulanmış ve 30 bekleyen satıra; genel ana kategori 314 doğrulanmış, 67 bekleyen ve üç canlı olmayan satıra ulaştı. Görünür çözülmemiş kayıt sayısı 62'ye düştü.
- Tam `pnpm verify` başarılıdır: TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu profil düzeltmesini henüz içermez.

## 2026-09-07 belirsiz ticari ad güvenliği — Red Lipstick Goby ve Yellow Flagtail

- `RED LİP STİCK GOBBY` satış sayfası bilimsel kimlik yayımlamıyor ve görsellerin temsili olduğunu belirtiyor. Red Lipstick Goby adı Kanada devlet ticaret envanterinde `Sicyopus exallisquamulus`, güncel uzman ve ticari kaynaklarda ise `S. rubicundus` ve `S. jonklaasi` için kullanıldığı için tek bir bakım profiline bağlanmadı.
- `YELLOW FLAGTAİL` mağazada Sazansıgiller altında yaklaşık 8 cm satış boyuyla listeleniyor ancak bilimsel ad vermiyor. Aynı ticari ad kaynaklarda `Semaprochilodus kneri`, `S. taeniurus` ve `S. insignis` için kullanıldığından erişkin boy ve akvaryum eşiği tahmin edilmedi.
- Her iki kayıt yeni doğrudan ve çapraz doğrulama kaynaklarıyla güçlendirildi; yanlış bir biyolojik profile bağlanmamaları, tür çatışmasını kullanıcıya açıklamaları ve kaynak zincirini korumaları regresyon testine eklendi.
- Hedefli `pnpm test:catalog-flow` ve tam `pnpm verify` başarılıdır: TypeScript, yedi ekipman kategorisi, dört canlı sınıfı, 610 bakım ürünü, 52 sağlık senaryosu, beş kum türü, katalog denetimi ve 14 sayfalık üretim derlemesi doğrulandı.
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu güvenlik açıklamalarını henüz içermez.

## 2026-09-07 Dario tigris canlı profili

- Cikletist'teki `BLACK TİGER BADİS DARİO FİSH` satış adı güncel taksonomik kaynak ve akvaryum ticaret kayıtlarında `Dario tigris` ile eşleşti. Tür 2022'de bilimsel olarak tanımlandı; daha eski bakım kaynaklarındaki `Dario sp. 'Myanmar'`, Black Tiger Dario ve Fire Red Tiger Badis adları aynı ticari kimliğin tarihsel adlarıdır.
- Güncel tür tanımındaki yaklaşık 2 cm standart boy kullanıldı. Eski bakım kaynağındaki 3,5 cm boy bilgisi taşınmadı; aynı kaynağın 45 × 30 cm taban, yaklaşık 41 litre, 20–24 °C ve pH 7,0–9,0 bakım aralıkları koruyucu eşik olarak kullanıldı. Erkek bölgeciliği, yavaş beslenme, mikroavcı davranışı ve tür akvaryumu önerisi kullanıcı uyarılarına işlendi.
- Satış adı açıklamalı bekleme listesinden çıkarıldı. Tetra mağaza kategorisi 100 doğrulanmış ve 29 bekleyen satıra; genel ana kategori 315 doğrulanmış, 66 bekleyen ve üç canlı olmayan satıra ulaştı. Görünür çözülmemiş kayıt sayısı 61'e düştü.
- Hedefli `pnpm test:catalog-flow` ve tam `pnpm verify` başarılıdır: TypeScript, yedi ekipman kategorisi, dört canlı sınıfı, 610 bakım ürünü, 52 sağlık senaryosu, beş kum türü, katalog denetimi ve 14 sayfalık üretim derlemesi doğrulandı.
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu yeni profili henüz içermez.

## 2026-09-08 Jeneca GD-320 kaynak çelişkisi

- Jeneca/ALEAS katalog kaydı ve güncel satış listeleri GD-320 motorunu 4 W olarak gösteriyor ancak su debisi yayımlamıyor. Ayrı bir model sayfası `D-320` yazımıyla 459 L/saat ve 6 W yayımladığı için bu veriler aynı modelin kesin teknik değerleri olarak birleştirilemez.
- GD-320 açıklaması, ana ve iki çapraz kaynakla güncellendi. Debi ve güç değerleri boş bırakıldı; kullanıcı artık verinin yalnız eksik değil, model etiketi ve güç açısından çelişkili olduğunu görür. Otomatik filtrasyon hesabı güvenli biçimde devre dışı kalır.
- Açıklamalı 10 kapasite boşluğu değişmedi; sınıflandırma üç çelişkili ve yedi yayımlanmamış kayıt olarak güncellendi. Hedefli katalog akışı, katalog denetimi ve tam `pnpm verify` başarılıdır: TypeScript, 52 sağlık senaryosu, beş kum türü ve 14 sayfalık üretim derlemesi geçti.
- GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu açıklama güncellemesini henüz içermez.

## 2026-09-08 Mogurnda adspersa güvenli tür profili

- Southern Purple-spotted Gudgeon adı kurumsal Avustralya tür kaynağında `Mogurnda adspersa` ile doğrulandı. Uzman bakım kaynaklarındaki 14 cm erişkin boy, 120 × 30 cm taban / yaklaşık 108 litre, 16–24 °C ve pH 7,0–7,5 eşikleriyle ayrı bir canlı profili eklendi.
- Küçük balıkları avlama ve tür içi bölgecilik riskleri kullanıcı uyarılarına işlendi. `Purple-spotted gudgeon` ortak adı `Mogurnda mogurnda` için de kullanıldığından, bilimsel kimlik vermeyen Cikletist satış başlığı yeni profile zorla bağlanmadı ve açıklamalı güvenlik listesinde tutuldu.
- Hedefli katalog akışı testi ve tam `pnpm verify` başarılıdır: TypeScript, yedi ekipman kategorisi, dört canlı sınıfı, 610 bakım ürünü, 52 sağlık senaryosu, beş kum türü, katalog denetimi ve 14 sayfalık üretim derlemesi doğrulandı. GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu profili henüz içermez.

## 2026-09-08 Mogurnda mogurnda güvenli tür profili

- FishBase ve uzman bakım kaynağında Northern Purple-spotted / Northern Trout Gudgeon olarak tanımlanan `Mogurnda mogurnda`, `Mogurnda adspersa` ile karıştırılmayacak ayrı bir profile eklendi. Kaynaklı 17 cm erişkin boy, 120 × 30 cm taban / yaklaşık 108 litre, 24–26 °C ve pH 6,0–8,0 eşikleri kullanıldı.
- Küçük canlıları avlama, bölgecilik, düşük akıntı, saklanma alanı ve sıkı kapak gereksinimleri kullanıcı uyarılarına işlendi. Genel `Purple Spotted Gudgeon` adı ve bilimsel kimlik vermeyen Cikletist başlığı iki profilden birine otomatik bağlanmıyor.
- Hedefli katalog akışı testi ve tam `pnpm verify` başarılıdır: TypeScript, yedi ekipman kategorisi, dört canlı sınıfı, 610 bakım ürünü, 52 sağlık senaryosu, beş kum türü, katalog denetimi ve 14 sayfalık üretim derlemesi doğrulandı. GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu profili henüz içermez.

## 2026-09-08 Alligator Gar kamusal tesis güvenliği

- FishBase ve Florida Museum, Alligator Gar ortak adını `Atractosteus spatula` ile doğruluyor; Florida Museum türün yaygın olarak yaklaşık 2 metreye, kayıtlarda yaklaşık 3 metreye ulaşabildiğini bildiriyor. Seriously Fish 305 cm standart boy, 11–23 °C ve pH 6,0–8,0 aralığını yayımlıyor ancak sayısal akvaryum tabanı vermeyip türü yalnız çok büyük kamusal tesislere uygun görüyor.
- Cikletist satış sayfası bilimsel kimlik yayımlamadığı ve uzman kaynak ticarette gar melezleri bulunduğunu belirttiği için kayıt doğrulanmış ev akvaryumu profiline bağlanmadı. Kullanıcıya 305 cm erişkin ölçeği, kamusal tesis gereksinimi ve neden otomatik hacim hesabı üretilemediği artık açıkça gösteriliyor.
- Hedefli katalog akışı testi ve tam `pnpm verify` başarılıdır: TypeScript, yedi ekipman kategorisi, dört canlı sınıfı, 610 bakım ürünü, 52 sağlık senaryosu, beş kum türü, katalog denetimi ve 14 sayfalık üretim derlemesi doğrulandı. GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu güvenlik açıklamasını henüz içermez.

## 2026-09-08 Blue Azul Peacock Bass kaynak çelişkisi

- `BLUE AZUL PEACOCK BASS` satış sayfası bilimsel kimlik yayımlamadığı için kayıt otomatik olarak `Cichla piquiti` profiline bağlanmadı. Cichla türlerinin ve melezlerinin ticari adla karışabilmesi kullanıcıya açıkça belirtildi.
- FishBase `C. piquiti` için yayımlanmış azami boyu 48 cm verirken Fishipedia 80 cm'ye kadar erişkin boy, en az 5.000 litre ve 300 cm akvaryum cephesi bildiriyor. Çelişkili erişkin boydan tek bir biyolojik yük değeri türetilmedi; koruyucu bakım ölçeği güvenlik kaydında görünür tutuldu.
- Hedefli `pnpm test:catalog-flow` ve tam `pnpm verify` başarılıdır: TypeScript, yedi ekipman kategorisi, dört canlı sınıfı, 610 bakım ürünü, 52 sağlık senaryosu, beş kum türü, katalog denetimi ve 14 sayfalık üretim derlemesi doğrulandı. GitHub/Vercel'e gönderim yapılmadı; canlı uygulama bu güvenlik açıklamasını henüz içermez.

## 2026-09-08 Jeneca GD-403 ve GD-503 çelişki zinciri

- Jeneca/ALEAS tablosundaki GD-403 için 500 L/saat–8 W ve GD-503 için 1.000 L/saat–15 W değerleri, barkod ve model ayrıntısı yayımlayan bağımsız model sayfalarıyla yeniden doğrulandı.
- Başka güncel satıcılar aynı model adları için sırasıyla 800 L/saat–10 W ve 1.500 L/saat–20 W yayımlamaya devam ediyor. Etiket, SKU veya donanım revizyonu ayrımı bulunamadığı için tek değer seçilmedi ve iki cihaz otomatik kapasite hesabının dışında tutuldu.
- Karşılaştırma kaynakları ve güncel doğrulama tarihi katalog kayıtlarına eklendi. Hedefli katalog akışı, 52 sağlık senaryosu, kapasite denetimi ve tam `pnpm verify` başarılıdır; TypeScript, beş kum türü ve 14 sayfalık üretim derlemesi de doğrulandı. GitHub/Vercel'e gönderim yapılmadı.

## 2026-09-08 Haqos teknik görsel erişim denetimi

- EASY-1000AT ve Aqua Flow 250 resmî Haqos ürün sayfalarında filtre modeli olarak yeniden doğrulandı. Sayfalar teknik içeriği metin yerine harici görselde tutuyor; görsel sunucusu yeniden denendi ancak bağlantıyı kabul etmedi.
- Güvenilir başka bir model kaynağı bulunmadı. Debi ve güç tahmin edilmedi; aynı adlı ilgisiz ürünlerin değerleri kullanılmadı ve iki filtre otomatik kapasite hesabının dışında kaldı.
- Kullanıcı açıklamaları erişim sorununun gerçek nedenini gösterecek şekilde güncellendi. Hedefli katalog akışı ve denetimi ile tam `pnpm verify` başarılıdır: TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. GitHub/Vercel'e gönderim yapılmadı.

## 2026-09-08 Silver Argus tür kimliği denetimi

- `SİLVER ARGUS BALIKLARI` satış adı yeniden denetlendi. Satış sayfası bilimsel kimlik yayımlamazken OATA `Silver Scat` adını `Selenotoca multifasciata`, FishBase ise `Argus fish` adını `Scatophagus argus` için kullanıyor.
- Başlık iki ayrı tür adını birleştirdiği ve satış görselleri temsili olduğu için kayıt tahminle mevcut Benekli Argus profiline bağlanmadı. Kullanıcıya iki olası kimliği ve su tipi riskini açıklayan güncel güvenlik kaydı ile kaynak zinciri eklendi.
- Bu güvenlik kararı katalog regresyonuna bağlandı. Hedefli katalog testi ve tam `pnpm verify` başarılıdır: TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. GitHub/Vercel'e gönderim yapılmadı.

## 2026-09-08 Red Belly Tetra tür kimliği denetimi

- `RED BELLY TETRA` satış adı yeniden denetlendi. Farklı ticari kaynaklar aynı adı `Aphyocharax rathbuni` ve `Hyphessobrycon pyrrhonotus` için kullanırken satış sayfası bilimsel kimlik yayımlamıyor.
- İki ayrı türün FishBase takson sayfaları kaynak zincirine eklendi. Kimlik kanıtlanmadan mevcut Green Fire Tetra veya başka bir tetra profiline tahminle bağlanmaması, açıklamalı güvenlik kaydı ve regresyon testiyle korundu.
- Hedefli katalog testi ve tam `pnpm verify` başarılıdır: TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. GitHub/Vercel'e gönderim yapılmadı.

## 2026-09-08 Hyphessobrycon pyrrhonotus profili

- Belirsiz `RED BELLY TETRA` satış adı güvenlik listesinde tutulurken olası bilimsel kimliklerden `Hyphessobrycon pyrrhonotus` için bağımsız, bilimsel adla seçilebilir bakım profili eklendi.
- Profil FishBase'teki 4,5 cm erişkin boya; Seriously Fish'teki 75 × 30 cm taban, yaklaşık 68 litre, 20–28 °C, pH 4–7 ve 8–10'lu grup verilerine; Fishipedia'daki koruyucu 10'lu grup, 100 litre ve 100 cm cephe önerisine dayanıyor. Uygulama güvenlik eşiği olarak 100 litre, 100 cm ve 10 bireyi kullanıyor.
- Profil yalnız kesin bilimsel ad ve doğrulanmış Flame-back Bleeding Heart ortak adlarıyla eşleşiyor; belirsiz Red Belly adı otomatik eşleşmiyor. Hedefli katalog testi ve tam `pnpm verify` başarılıdır: tetra kataloğu 27 doğrulanmış profile ulaştı; TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. GitHub/Vercel'e gönderim yapılmadı.

## 2026-09-08 Selenotoca multifasciata profili

- Belirsiz `SİLVER ARGUS BALIKLARI` satış adı güvenlik listesinde tutulurken OATA'nın `Silver Scat` olarak tanımladığı `Selenotoca multifasciata` için bağımsız bilimsel bakım profili eklendi.
- FishBase'teki 40 cm erişkin boy ile OATA'daki en az altılı grup, en az 600 litre, 24–27 °C, pH 7,5–8,5, güçlü akıntı/oksijen ve erişkinlerde orta-yüksek acı sudan tam deniz suyuna uzanan gereksinimler kullanıldı. Kaynak santimetre cinsinden tank uzunluğu vermediği için uzunluk tahmin edilmedi.
- `Silver Scat` yalnız acı su ve deniz suyu kataloğunda kesin profile bağlanıyor; birleşik `Silver Argus` adı ve tatlı su araması eşleşmiyor. Hedefli katalog testi ve tam `pnpm verify` başarılıdır: TypeScript, 27 tetra ve 21 diğer türü içeren katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. GitHub/Vercel'e gönderim yapılmadı.

## 2026-09-08 Blue Neon Goby tür ayrımı

- Bilimsel adı yayımlanmayan `BLUE NEON GOBBY GOBİ` satış kaydı güvenlik listesinde tutuldu. Uzman kaynaklar Blue Neon Goby adını `Stiphodon atropurpureus` için kullanırken `Stiphodon semoni` türünün de ticarette aynı veya yakın adlarla yanlış etiketlenebildiğini açıkça belirtiyor.
- İki olası kimlik ayrı bilimsel profiller olarak eklendi: `S. atropurpureus` için 5 cm, 54 litre/60 cm, en az üçlü grup, 22–26 °C ve pH 6,5–7,5; `S. semoni` için 5 cm, 54 litre/60 cm, en az üçlü grup, 22–28 °C ve pH 6,5–7,5. Her iki profilde olgun akarsu kurulumu, yüksek oksijen, 10–15 kat çevrim, biyofilmli taşlar ve sıkı kapak gereksinimleri kullanıcıya açıklanıyor.
- Belirsiz mağaza adı iki profilden birine otomatik bağlanmıyor; kesin bilimsel adlar ve `Cobalt Blue Goby` tür bazlı adı doğru profili buluyor. Hedefli katalog testi, katalog denetimi ve tam `pnpm verify` başarılıdır: goby/kaya balığı grubu 10 kaynaklı ve tam bakım verili profile ulaştı; TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu ve 14 sayfalık üretim derlemesi geçti. GitHub/Vercel'e gönderim yapılmadı.

## 2026-09-08 Panda Garra ve Garra rufa tür ayrımı

- Bilimsel adı yayımlanmayan `PANDA GARRARUFA YOSUN YİYİCİ` birleşik satış kaydı güvenlik listesinde tutuldu. Uzman kaynaklar Panda Garra adını `Garra flavatra` için kullanırken `Garra rufa` ayrı, daha iri ve daha serin su isteyen bir türdür.
- İki bilimsel profil ayrı eklendi: `G. flavatra` için 9 cm, 81 litre/90 cm, en az üçlü grup, 22–27 °C ve pH 6,5–7,5; `G. rufa` için 14,1 cm, 243 litre/120 cm, en az üçlü grup, 14–20 °C ve pH 6,0–8,0. Her iki profile yüksek akıntı ve oksijen, olgun akvaryum ve sıkı kapak gereksinimleri işlendi.
- Kesin `Panda Garra` ve `Garra rufa` aramaları doğru profilleri buluyor; birleşik ve belirsiz satış adı otomatik eşleşmiyor. Hedefli katalog testi ve tam `pnpm verify` başarılıdır: dip balıkları grubu 68 kaynaklı ve tam bakım verili profile ulaştı; TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. GitHub/Vercel'e gönderim yapılmadı.

## 2026-09-08 gerçek Julii ve False Julii ayrımı

- Bilimsel adı ve kökeni yayımlanmayan `JULLY ÇÖPÇÜ BALIKLARI` satış kaydı açıklamalı güvenlik listesinde tutuldu. Uzman kaynak, gerçek `Hoplisoma julii` ile ticarette sıkça Julii adıyla sunulan `H. trilineatum` desenlerinin örtüşebildiğini ve kesin ayrım için bilimsel etiket veya köken gerektiğini bildiriyor.
- Gerçek `H. julii` için 5,5 cm, 81 litre/90 cm, en az altılı sürü, 20–26 °C ve pH 5,5–7,5 eşikleriyle ayrı profil eklendi. İnce kum, temiz taban, gölgeli sığınak ve çeşitli batan yem gereksinimleri kullanıcı uyarılarına işlendi; mevcut False Julii profili ayrı kaldı.
- Bilimsel `Hoplisoma julii` ve doğrulanmış `Leopard Corydoras` adı gerçek profili buluyor; genel `Julii Cory` ve belirsiz mağaza başlığı iki profilden birine otomatik bağlanmıyor. Hedefli katalog testi ve tam `pnpm verify` başarılıdır: dip balıkları grubu 69 kaynaklı ve tam bakım verili profile ulaştı; TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. GitHub/Vercel'e gönderim yapılmadı.

## 2026-09-08 Channa asiatica ve Channa bleheri ayrımı

- `CHANNA ASIATICA GÖKKUŞAĞI YILANBAŞ BLEHERİ` mağaza başlığı iki ayrı geçerli türü birleştirdiği için açıklamalı güvenlik listesinde tutuldu. `Channa asiatica` ile gökkuşağı yılanbaş `C. bleheri` erişkin ölçeği ve mevsimsel bakım gereksinimleri farklı olduğundan birleşik ad otomatik eşleşmiyor.
- Eksik `C. asiatica` profili 35 cm koruyucu erişkin ölçeği, 160 litre/100 × 40 cm taban, uyumlu çift, 15–25 °C ve pH 6,0–8,0 eşikleriyle eklendi. FishBase'in 23,5 cm TL yayımlanmış örneklem değeri ile uzman bakım kaynağındaki 35 cm SL farkı kullanıcı açıklamasında saklandı; sağlık analizi daha koruyucu bakım ölçeğini kullanıyor.
- Türün zorunlu avcılığı, tür akvaryumu, loş ve saklanmalı kurulum, yüzey havasına erişim ve ağır boşluksuz kapak gereksinimleri işlendi. Kesin `Channa asiatica` doğru profili bulurken birleşik `Channa asiatica bleheri` adı eşleşmiyor. Hedefli katalog testi ve tam `pnpm verify` başarılıdır: Monster grubu 32 kaynaklı ve tam bakım verili profile ulaştı; TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. GitHub/Vercel'e gönderim yapılmadı.

## 2026-09-08 Zigzag eel ve Tire-track Eel ayrımı

- Bilimsel adı yayımlanmayan `ZİGZAK TARAK BALIKLARI` kaydı açıklamalı güvenlik listesinde tutuldu. Zigzag eel adı kaynaklarda 90 cm'lik `Mastacembelus armatus` ve 20 cm'lik `Macrognathus circumcinctus` için kullanıldığından ticari ad tek başına bakım profili seçmiyor.
- Eksik `M. armatus` profili 90 cm erişkin boy, en az 450 litre, tek birey, 24–28 °C, pH 6,5–7,5 ve nazik akıntı eşikleriyle eklendi. Kaynaklar sayısal minimum akvaryum uzunluğu yayımlamadığı için uzunluk tahmin edilmedi ve kullanıcıya açık veri notu eklendi.
- Gece avcılığı, küçük balıkları yeme, kendi türüne bölgecilik, yumuşak derin kum, sabitlenmiş dekor, güçlü biyolojik filtrasyon ve tamamen kaçışsız kapak gereksinimleri işlendi. Kesin `Tire-track Eel` doğru iri profile bağlanırken belirsiz `Zigzag eel` iki profilden birine dönüşmüyor. Hedefli katalog testi ve tam `pnpm verify` başarılıdır: Monster grubu 33 kaynaklı ve tam bakım verili profile ulaştı; TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. GitHub/Vercel'e gönderim yapılmadı.

## 2026-09-08 gerçek Parosphromenus deissneri profili

- Bilimsel tür veya köken yayımlamayan `MEYAN KÖKÜ GURAMİ` satış kaydı açıklamalı güvenlik listesinde tutuldu. Uzman koruma ağı, Licorice Gourami adının birçok `Parosphromenus` türünü kapsadığını ve gerçek `P. deissneri`nin ticarette nadir olup sıkça yanlış etiketlendiğini bildiriyor.
- Gerçek `P. deissneri` için 4 cm, çift başına en az 25 litre/40 cm, 22–28 °C, pH 3,0–6,5 ve düşük akıntı eşikleriyle ayrı profil eklendi. Çok yumuşak humik siyah su, olgun azot döngüsü, mağara, loş ışık, küçük canlı yem ve düzenli su değişimi gereksinimleri işlendi.
- Kesin bilimsel ad doğru profili buluyor; genel `Licorice Gourami` ve Meyan Kökü Gurami adları otomatik eşleşmiyor. Hedefli katalog testi ve tam `pnpm verify` başarılıdır: labirentli grubu 15 kaynaklı ve tam bakım verili profile ulaştı; TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. GitHub/Vercel'e gönderim yapılmadı.

## 2026-09-08 Echidna rhodochilus acı su güvenliği

- Bilimsel ad ve su türü yayımlamayan `WHITE CHECK EEL MÜREN` mağaza kaydı açıklamalı güvenlik listesinde tutuldu. White-cheek adı `Echidna rhodochilus` için kullanılsa da mağazadaki White Check yazımı tür kimliğini kanıtlamıyor.
- Kesin `E. rhodochilus` için 33,8 cm, en az 450 litre, tek birey, 23–28 °C, pH 7,5–8,0 ve SG 1.005–1.015 değerleriyle ayrı acı/deniz suyu profili eklendi. Saha çalışması uzun süreli tam tatlı su bakımını desteklemediği için profil tatlı su kataloğunda gösterilmiyor; kaynakta sayısal tank uzunluğu bulunmadığından uzunluk tahmin edilmedi.
- Küçük balık ve kabukluları avlama, mağara savunması, yanlışlıkla ısırma, sağlam saklanma alanları, güçlü biyolojik filtrasyon, yem maşası ve tamamen kaçışsız ağır kapak gereksinimleri işlendi. Kesin `Pink-lipped Moray` acı su profilini bulurken genel White Cheek adı otomatik eşleşmiyor. Hedefli katalog testi ve tam `pnpm verify` başarılıdır: Monster grubu 34 kaynaklı ve tam bakım verili profile ulaştı; TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. GitHub/Vercel'e gönderim yapılmadı.

## 2026-09-08 L146 ve Peckoltichthys ucayalensis güvenli profil ayrımı

- Uzman L-numarası veri tabanı L146/LDA30 kaydını `Peckoltichthys cf. bachi` olarak; yaklaşık 15 cm, en az 100 cm akvaryum, 25–29 °C ve pH 6,0–8,0 eşikleriyle doğruluyor. Bu kesin L-numarası profili `Bola vatoz L146` adıyla eklendi.
- `Peckoltichthys ucayalensis` aynı uzman veri tabanında ayrı bir tür profili olarak; yaklaşık 15 cm, en az 100 cm akvaryum, 25–29 °C ve pH 6,0–8,0 eşikleriyle doğrulandı ve ayrı kataloğa eklendi.
- Güncel L-numarası listesi L069'u `Ancistomus/Ancistrini sp.` olarak verdiği için mağazadaki `L-069 Peckoltia Ucayalensis` başlığı bilimsel profile otomatik bağlanmıyor. `L-146 Albino Pleco` da kaynağın albino varyeteyi doğrulamaması nedeniyle eşleşmeden bırakılıyor. Kullanıcı kesin `L146` veya `Peckoltichthys ucayalensis` aramasıyla doğru profili seçebiliyor.
- Dip balığı kataloğu 71 kaynaklı ve bakım verisi tam profile ulaştı. Hedefli `pnpm test:catalog-flow` ve tam `pnpm verify` başarılıdır: TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. GitHub/Vercel'e gönderim yapılmadı.

## 2026-09-09 Sicyopus exallisquamulus güvenli profil ayrımı

- Uzman tür kaynağı `Sicyopus exallisquamulus` için 5,2 cm standart boy, 60 × 30 cm taban/yaklaşık 54 litre, bir erkek ve en az iki dişilik grup, 22–28 °C, pH 6,5–7,5 ve 10–15 kat akarsu çevrimi yayımlıyor. Bu değerlerle ayrı `Kırmızı dudaklı gobi` profili eklendi.
- Türün yosun yiyici olmadığı, küçük canlı/dondurulmuş hayvansal yem istediği, küçük omurgasızlar için avlanma riski taşıdığı; olgun, çok temiz, yüksek oksijenli akarsu kurulumu ve boşluksuz kapak gerektirdiği sağlık/bakım uyarılarına işlendi.
- `RED LİP STİCK GOBBY` mağaza adı S. exallisquamulus yanında S. rubicundus ve S. jonklaasi için de kullanıldığı için otomatik eşleşmeden bırakıldı. Kesin bilimsel ad araması yeni profili buluyor.
- Goby/kaya balığı grubu 11 kaynaklı ve bakım verisi tam profile ulaştı. Hedefli `pnpm test:catalog-flow` ve tam `pnpm verify` başarılıdır: TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. GitHub/Vercel'e gönderim yapılmadı.

## 2026-09-09 Channa limbata güvenli profil ayrımı

- Güncel Eschmeyer balık taksonomi kataloğu `Channa limbata` türünü geçerli kabul ediyor. Uzman bakım kaynağındaki 20 cm erişkin boy, tek birey veya uyumlu çift için 100 litre/80 × 40 cm, 22–28 °C ve pH 5,5–8,0 eşikleriyle ayrı `Kırmızı kuyruklu yılanbaş` profili eklendi.
- Türün avcı ve bölgeci davranışı; küçük balık ve omurgasız riski, tür akvaryumu, loş ve yoğun saklanmalı kurulum, yüzey havası ile nemli hava boşluğu ve tamamen kapalı ağır kapak gereksinimleri işlendi.
- `CHANNA GOLDEN LİMBATA` mağaza sayfası bilimsel kimlik veya Golden formun köken popülasyonunu yayımlamadığı için satış adı otomatik eşleşmeden bırakıldı. Kesin `Channa limbata` araması yeni profili bulurken yalnız `Golden Limbata` adı profile dönüşmüyor.
- `COLOMBİAN FARLOWELLA` ayrıca incelendi: kesin `Farlowella colombiensis` kimliği bilimsel kaynaklarda doğrulansa da türe özel akvaryum bakımının yakın türlerden projeksiyon olduğu ve güvenilir minimum hacmin yayımlanmadığı görüldü. Zorunlu litre değeri tahmin edilmedi; satış adı açıklamalı güvenlik kaydında kaldı.
- Monster grubu 35 kaynaklı ve bakım verisi tam profile ulaştı. Hedefli `pnpm test:catalog-flow` ve tam `pnpm verify` başarılıdır: TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. GitHub/Vercel'e gönderim yapılmadı.

## 2026-09-09 Sicyopus jonklaasi koruma ve bakım profili

- FishBase `Sicyopus jonklaasi` kimliğini, 4,5 cm bilimsel boyu, Sri Lanka'ya endemik hızlı akarsu habitatını, etçil beslenmesini ve Tehlikede statüsünü doğruluyor. Ayrıntılı uzman bakım kaynağının daha koruyucu 5,5 cm, en az altılı grup, 120 litre/100 cm, 20–28 °C, pH 6,0–7,5 ve çok güçlü akıntı eşikleriyle ayrı `Jonklaas ruj gobisi` profili eklendi.
- Küçük balık ve karides avlama riski, 10–15 kat çevrim, yüksek oksijen, olgun ve çok temiz akarsu kurulumu, kayalık görüş bariyerleri, canlı yem gereksinimi, haftalık %30–50 su değişimi ve boşluksuz kapak uyarıları işlendi.
- Türün Sri Lanka'da ihracata karşı korunduğu ve ticarette bulunmaması gerektiği için profil satın alma önerisi sunmuyor; yalnız yasal ve belgeli köken doğrulanırsa değerlendirilmesi gerektiğini açıkça bildiriyor.
- Genel `RED LİP STİCK GOBBY` satış adı S. exallisquamulus, S. rubicundus ve S. jonklaasi arasında belirsiz kaldığından otomatik eşleşmiyor. Kesin `Sicyopus jonklaasi` araması koruma uyarılı profile bağlanıyor.
- Goby/kaya balığı grubu 12 kaynaklı ve bakım verisi tam profile ulaştı. Hedefli `pnpm test:catalog-flow` ve tam `pnpm verify` başarılıdır: TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. GitHub/Vercel'e gönderim yapılmadı.

## 2026-09-09 Sicyopus rubicundus güvenli profil ayrımı

- FishBase ve türün bilimsel tanımı `Sicyopus rubicundus` kimliğini ve yaklaşık 5 cm bilimsel erişkin boyunu doğruluyor. Türe özel bakım kaynaklarında 54 litre ile 112 litre arasında farklı minimumlar bulunduğu için, en az beşli grubun bölge alanını koruyan 112 litre/80 cm eşiği seçildi; 22–26 °C, pH 6,0–7,5 ve güçlü akıntıyla ayrı `Kızıl ruj gobisi` profili eklendi.
- Mikro avcılık, küçük balık/karides riski, tür akvaryumu, olgun ve çok temiz akarsu kurulumu, güçlü oksijen/akıntı, taş-kum taban, canlı veya alışırsa dondurulmuş hayvansal yem ve boşluksuz kapak gereksinimleri işlendi.
- Amphidrom yaşam döngüsü nedeniyle ticaretteki bireylerin yabani kökenli olduğu ve sorumlu, belgeli tedarik gerektiği görünür uyarıya eklendi.
- Genel `RED LİP STİCK GOBBY` satış adı hâlâ S. exallisquamulus, S. rubicundus ve S. jonklaasi arasında otomatik eşleşmiyor; üç bilimsel tür yalnız kesin kimlikleriyle ayrı profillere bağlanıyor.
- Goby/kaya balığı grubu 13 kaynaklı ve bakım verisi tam profile ulaştı. Hedefli `pnpm test:catalog-flow` ve tam `pnpm verify` başarılıdır: TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. GitHub/Vercel'e gönderim yapılmadı.

## 2026-09-09 Cichla piquiti koruyucu profil ayrımı

- FishBase `Cichla piquiti` kimliğini, tatlı su yaşamını ve 48 cm yayımlanmış azami ölçümü doğruluyor. Fishipedia tür için 40–80 cm erişkin aralığı, tek yaşam, etçil ve bölgeci davranış, 21–32 °C, pH 5,8–7,3, en az 5.000 litre ve 300 cm akvaryum cephesi yayımlıyor.
- Sağlık analizi hayvan refahı için koruyucu 80 cm üst ölçeği kullanıyor. Tek birey, tür akvaryumu, çok güçlü filtrasyon, yüksek oksijen, geniş açık yüzme alanı, küçük balık/kabuklu av riski ve doğaya bırakmama uyarılarıyla ayrı `Piquiti peacock bass` profili eklendi.
- Satış sayfasındaki `BLUE AZUL PEACOCK BASS` başlığı bilimsel kimlik yayımlamadığı ve Cichla türleri/melezleri ticarette karışabildiği için otomatik profile bağlanmıyor. Kesin `Cichla piquiti` araması güvenli profili bulurken yalnız `Azul Peacock Bass` adı eşleşmiyor.
- Monster grubu 36 kaynaklı ve bakım verisi tam profile ulaştı. Hedefli `pnpm test:catalog-flow` ve tam `pnpm verify` başarılıdır: TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. GitHub/Vercel'e gönderim yapılmadı.

## 2026-09-09 Semaprochilodus kneri güvenli profil ayrımı

- FishBase `Semaprochilodus kneri` kimliğini, Orinoco havzasını ve 28 cm bilimsel erişkin boyunu doğruluyor. Türe özel bakım kaynaklarındaki en az 500 litre, 200 cm cephe, 24–28 °C, pH 6,5–7,2, güçlü akıntı ve yüksek oksijen gereksinimleriyle ayrı `Kner'in sarı kuyruklu prochilodusu` profili eklendi.
- Türün büyük ve sürekli hareketli yapısı, küçük balıklarla ölçek riski, geniş açık yüzme alanı, çok güçlü filtrasyon, sağlam kapak ve bitkisel ağırlıklı otlayıcı diyet gereksinimleri işlendi. Kaynaklar küçük grubu tercih edilmesi gereken sosyal düzen olarak açıklasa da kesin asgari sayı yayımlamadığı için grup sayısı tahmin edilmedi.
- Genel `YELLOW FLAGTAİL` satış adı S. kneri, S. taeniurus ve S. insignis için kullanıldığı ve mağaza bilimsel kimlik vermediği için otomatik eşleşmiyor. Kesin `Semaprochilodus kneri` araması yeni profile bağlanıyor.
- Diğer canlılar grubu 22 kaynaklı ve bakım verisi tam profile ulaştı. Hedefli `pnpm test:catalog-flow` ve tam `pnpm verify` başarılıdır: TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. GitHub/Vercel'e gönderim yapılmadı.

## 2026-09-09 Semaprochilodus insignis koruyucu sürü profili

- FishBase `Semaprochilodus insignis` kimliğini, Amazon havzasını, 29,5 cm bilimsel azami ölçümü, 22–26 °C ve pH 5,5–7,2 doğal aralığını doğruluyor. Fishipedia'nın daha koruyucu 35 cm, en az beş birey, 1.500 litre, 18–29 °C, pH 5,5–7,2 ve güçlü akıntı profili sağlık analizine işlendi.
- Yalnız kalma stresi, erkeklerin dişileri aşırı kovalama riski, küçük balıklarla ölçek uyumsuzluğu, 10–20 kat çevrim, çok yüksek oksijen, geniş açık yüzme alanı, sağlam kapak ve bitkisel ağırlıklı beslenme gereksinimleri eklendi.
- Kaynak beşli sürü için santimetre cinsinden güvenli minimum cephe yayımlamadığından tek bireylik 150 cm ölçü grup profiline taşınmadı ve uzunluk tahmin edilmedi. Genel `YELLOW FLAGTAİL` adı hâlâ otomatik eşleşmez; kesin `Semaprochilodus insignis` araması yeni profili bulur.
- Diğer canlılar grubu bu adımda 23 kaynaklı ve bakım verisi tam profile ulaştı. Hedefli `pnpm test:catalog-flow` ve tam `pnpm verify` başarılıdır. GitHub/Vercel'e gönderim yapılmadı.

## 2026-09-09 Semaprochilodus taeniurus güvenli sosyal düzen profili

- FishBase `Semaprochilodus taeniurus` kimliğini ve 27,2 cm bilimsel erişkin boyunu doğruluyor. Seriously Fish'in koruyucu 30 cm, tek birey için 540 litre/150 × 60 cm taban, 23–29 °C ve pH 5,5–7,5 değerleriyle ayrı `Gümüş flagtail prochilodus` profili eklendi.
- Uzman ve sektör bakım kaynaklarının belirttiği tek birey veya en az altılı sürü düzeni açık uyarıya işlendi; iki ile beş bireylik küçük grupların tür içi saldırganlığı artırabileceği belirtildi. Güçlü filtrasyon/akıntı, yüksek oksijen, kum taban, açık yüzme alanı, sıkı kapak ve bitkisel ağırlıklı diyet gereksinimleri eklendi.
- Genel `YELLOW FLAGTAİL` başlığı hiçbir türe otomatik bağlanmıyor. Kesin `S. kneri`, `S. insignis` ve `S. taeniurus` kimliklerinin üçü de artık birbirinden ayrı güvenli profillere sahip.
- Diğer canlılar grubu 24 kaynaklı ve bakım verisi tam profile ulaştı. Hedefli `pnpm test:catalog-flow` ve tam `pnpm verify` başarılıdır: TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. GitHub/Vercel'e gönderim yapılmadı.

## 2026-09-09 Herichthys Green Texas tür ayrımı

- Mevcut `Herichthys cyanoguttatus` kaydı doğrudan kaynaklarla yenilendi: 30 cm erişkin boy, tek birey için 255 litre/120 cm, 20–28 °C ve pH 6,0–7,5. Bölge saldırganlığı, çift/karma bakımda daha büyük sistem, kazma, güçlü filtrasyon ve haftalık %25–50 su değişimi uyarıları eklendi.
- Ayrı `Herichthys carpintis` profili 30,5 cm, uyumlu çift için 400 litre/150 cm, 24–25 °C ve pH 7,0–7,5 eşikleriyle eklendi. Küçük balık avlama, üreme saldırganlığı, sağlam ayırıcı gereksinimi, ekipman koruması ve bölgesel formları/melezleri karıştırmama uyarıları işlendi.
- `GREEN TEXAS CİKLET BALIKLARI` satış başlığı bilimsel kimlik vermediğinden iki türden birine otomatik bağlanmıyor. Kesin H. carpintis ve H. cyanoguttatus aramaları birbirinden ayrı profilleri buluyor.
- Ciklet grubu 70 kaynaklı ve bakım verisi tam profile ulaştı. Hedefli `pnpm test:catalog-flow` ve tam `pnpm verify` başarılıdır: TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. GitHub/Vercel'e gönderim yapılmadı.

## 2026-09-09 Blue King / Blue Tetra tür ayrımı

- Genel `BLUE KİNG TETRA` ve `Blue Tetra` adlarının `Inpaichthys kerri`, `Boehlkea fredcochui` ve `Knodus borki` için kullanılabildiği doğrulandı. Bilimsel kimlik vermeyen satış kaydı bu üç profilden birine otomatik bağlanmıyor ve açıklamalı çözülmemiş kayıt olarak kalıyor.
- Gerçek `Boehlkea fredcochui` profili 5,4 cm, en az altılı sürü, 60 litre/60 cm, 22–26 °C ve pH 6,0–6,5 eşikleriyle eklendi. Aktif yüzme, sakin/uzun yüzgeçli türleri rahatsız etme ve ticarette nadir olup `Knodus borki` ile karışma uyarıları işlendi.
- `Knodus borki` ayrı profil olarak 5 cm, en az sekizli sürü, 86 litre/75 cm, 22–26 °C ve pH 5,5–7,0 eşikleriyle eklendi. Küçük grupta yüzgeç ısırma, yüksek hareketlilik, yumuşak-asidik ve iyi oksijenlenmiş su gereksinimleri açıklandı.
- Tetra grubu 29 kaynaklı ve bakım verisi tam profile ulaştı. Hedefli `pnpm test:catalog-flow` ve tam `pnpm verify` başarılıdır: TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. GitHub/Vercel'e gönderim yapılmadı.

## 2026-09-09 Aquawing Türkiye güncel seri genişletmesi

- Eksenpet Aquawing kataloğunda yayımlanan dokuz filtre (`AQ-WP750FA`, `AQ-WP750FB`, `AQ-WP850FA`, `AQ-WP3300B`, `AQ-WP3300C`, `AQ111F`, `AQ501HF`, `AQ301HF`, `AQ302HF`) debi, güç ve barkod bilgileriyle eklendi.
- `AQ-ECO2000`, `AQ-ECO3000` ve `AQ-ECO4000` sump dönüş motorları debi, güç, basma yüksekliği ve barkodlarıyla `Diğer sistemler` kategorisine eklendi; klasik filtre debisi hesabına karıştırılmadı.
- `AQ708` tek çıkışlı hava motorunun 3 W gücü ve barkodu doğrulandı. Kaynak hava debisi veya önerilen akvaryum hacmi yayımlamadığı için bu değerler tahmin edilmedi ve model otomatik kapasite hesabının dışında bırakıldı.
- Aynı güncel listede bulunan `AQ-A1000` ve `AQ-A2000` çift çıkışlı hava motorları da sırasıyla 8 W ve 12 W güçleri ile barkodları kullanılarak eklendi. Doğrudan ürün sayfaları hava debisi yayımlamadığından iki modelde de debi tahmin edilmedi.
- Kafa motorları ve tepe filtre sayfalarının ikinci taramasında `AQ-ECO5000`, `AQ-ECO5500`, `AQ-ECO6000`, `AQ-ECO7000`, `AQ-ECO8000`, `AQ-ECO9000`, `AQ2500F`, `AQ3500`, `AQ388` ve `AQ088` modelleri debi, güç ve barkodlarıyla eklendi. Mevcut `AQ6000M`, `AQ10000M`, `AQ12000M` ve `WM1500` sirkülasyon motorlarının yayımlanmış debi ve barkodları da tamamlandı.
- İç filtre sayfasının ürün ve ilgili-model taramasında `AQ680`, `AQ60F`, `AQ101FB`, `AQ102F`, `AQ103F`, `AQ104F` ve `AQ603F` modelleri doğrulandı. Yüzey emici `AQ680` için yayımlanan 80 litre üst sınırı işlendi; diğerlerinde yalnız debi, güç ve barkod gibi açık teknik bilgiler kullanıldı.
- Aquawing ekipman kataloğu 83 kayıttan 115 doğrulanmış kayda çıktı. Hedefli `pnpm test:catalog-flow` ve tam `pnpm verify` başarılıdır: TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. Kapasite gereken 83 Aquawing kaydının 79'u otomatik hesaplamaya hazırdır; kalan dört hava motorunda üretici/satıcı debi yayımlamamıştır. GitHub/Vercel'e gönderim yapılmadı.
- Eksenpet Aquawing marka sayfasının ikinci ila altıncı sayfaları sayfalama parametresiyle ayrıca tarandı. Katalogda bulunmayan dört iç filtre (`AQ-WP950FA` kaydı güncellendi; `AQ101F`, `AQ40F`, `AQ920FC` eklendi), on dört sump/kafa/sirkülasyon motoru (`AQ2600`, `WM1200`, `AQ4000`, `AQ5000`, `AQ6000`, `AQ6500`, `AQ901`, `AQ902`, `AQ903`, `AQ904`, `AQ3000F`, `AQ3200`, `AQ5000F`, `AQ6000F`) ve iki LED/hava cihazı (`AQ666LED`, `AQ999A`) doğrudan ürün bağlantıları, yayımlanan debi/güç ve barkodlarla işlendi.
- Mevcut `AQ288` kaydının 1500 L/saat debisi, 25 W gücü ve barkodu tamamlandı. `AQ333` fiziksel ürününü çoğaltmak yerine güncel stok kodu `AQ333LED` olarak düzeltildi. `AQ333LED` ve `AQ666LED` üzerindeki L/saat değerleri su dolaşımı olduğundan hava motoru kapasitesi hesabına sokulmadı; `AQ999A` için yalnız dört çıkış, 8 W ve barkod yayımlandığı için hava debisi tahmin edilmedi.
- İlk marka sayfasındaki `AQ311` tek çıkışlı hava motoru da 2,5 W güç ve barkoduyla eklendi; hava debisi yayımlanmadığından kapasite değeri tahmin edilmedi. Aynı sayfadaki `AQ008` ve `AQ930` hava motorları ile `AQ310F`, `AQ510F`, `AQ-WP850FB`, `AQ-WP950FB`, `AQ-WP1000FA`, `AQ-WP1000FB`, `AQ-WP2300A` ve `AQ-WP3300A` filtrelerinin güncel barkodları ve doğrudan ürün bağlantıları işlendi. Önceki taramada yanlışlıkla başka modele giden `AQ60F`, `AQ102F`, `AQ103F` ve `AQ104F` bağlantıları kendi doğrudan ürün sayfalarıyla düzeltildi ve bu durum regresyon testine bağlandı.
- Aquawing kataloğu 135 doğrulanmış ekipmana ulaştı. Kapasite gerektiren 88 kaydın 82'si otomatik hesaplamaya hazırdır (%93); kalan altı hava motorunun debisi kaynakta yayımlanmadığından açıklamalı biçimde hesap dışında tutulur. Hedefli katalog akışı testi, katalog denetimi ve tam `pnpm verify` başarılıdır: TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. GitHub/Vercel'e gönderim yapılmadı.
- Altı sayfalık güncel marka listesi model kodu düzeyinde katalogla karşılaştırıldı. Eksik kalan `AQMBS1` ve `AQMBM2` mıknatıslı cam silecekleri ile `07708` kodlu 20'li çekvalf paketi doğrudan ürün bağlantıları ve barkodlarıyla `Diğer sistemler` kategorisine eklendi; kapasite hesaplarına karıştırılmadı. Eksenpet'te yayımlanan 124 güncel Aquawing ürün kodunun 124'ü katalogda bulunuyor; eski veya farklı kaynaklardan doğrulanmış 14 model ayrıca korunuyor. Aquawing toplamı 138 doğrulanmış kayıttır. Hedefli katalog testi, otomatik 124/124 kod karşılaştırması ve tam `pnpm verify` başarılıdır: TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. GitHub/Vercel'e gönderim yapılmadı.

## 2026-09-09 Oase güncel filtre aileleri

- Oase'nin resmî Büyük Britanya ürün aileleri model bazında karşılaştırıldı. BioMaster² ailesindeki `BioMaster² 150` ve `BioMaster² Thermo 150`; BioPlus ailesindeki `BioPlus Thermo 50`, `100` ve `200`; BioStyle ailesindeki `BioStyle 180` eksik kayıtları doğrulanmış debi, güç, entegre ısıtıcı ve akvaryum hacmi verileriyle eklendi.
- Mevcut `BioPlus 50` ve `BioPlus 100` kayıtlarının debi/güç bilgileri tamamlandı. `BioStyle 115` kaydının yanlışlıkla ABD modeli BioStyle 30'a giden bağlantısı kendi 89601 kodlu resmî sayfasıyla düzeltildi; BioStyle 75'in model adına rağmen üreticinin yayımladığı 70 litre üst sınırı aynen korundu.
- FiltoSmart ailesi resmî yedi ürünlük GB listesine tamamlandı: `FiltoSmart Thermo 100`, `200` ve `300` eklendi; `FiltoSmart 200` kaydındaki eksik 800 L/saat ve 17 W değerleri tamamlandı. `BioCompact 25` ve `50` nano iç filtreleri de doğrulanmış 240 L/saat, 5 W ve hacim sınırlarıyla eklendi.
- `CrystalSkim 350` ve `CrystalSkim 600` yüzey emicileri resmî 230 V/50 Hz değerleriyle eklendi. Su dolaşım debileri ana filtrasyon kapasitesi sanılmasın diye `Diğer sistemler` kategorisinde tutuldu ve bu sınıflandırma regresyon testine bağlandı.
- Oase kataloğu 42 kayıttan 55 doğrulanmış ekipmana çıktı. Kapasite değerlendirmesi gereken 42 kaydın tamamı otomatik analiz için hazırdır. Güncel BioMaster² 10/10, BioPlus 6/6, BioStyle 3/3, FiltoSmart 7/7, BioCompact 2/2 ve CrystalSkim 2/2 aile kapsamı tablo tabanlı testlerle korunuyor.
- Hedefli `pnpm test:catalog-flow`, katalog denetimi ve tam `pnpm verify` başarılıdır: TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. GitHub/Vercel'e gönderim yapılmadı.

## 2026-09-09 Jingye askı, iç filtre, pompa ve hava motoru genişletmesi

- Jingye kataloğuna onaylı yerel kaynağın doğrudan ürün sayfalarıyla 12 eksik model eklendi: `JY-W155`, `JY-W255`, `JY-W355`, `JY-6100F`, `JY-6600F`, `JY-801F`, `LV-1000DX`, `LV-2000DX`, `LV-2500DX`, `JY-920`, `CD400` ve `YE-CC1`.
- W serisi askı filtreler ile 6100F, 6600F ve 801F iç filtrelerin yayımlanan debi, güç ve akvaryum hacmi sınırları otomatik ekipman analizine işlendi. W serisinin ayarlanabilir akış özelliği ayrıca kaydedildi.
- `JY-920`, üst filtre haznesine su basan dalgıç pompa olduğundan bağımsız biyolojik filtre gibi değerlendirilmemesi için `Diğer sistemler` kategorisinde tutuldu. LV sump pompaları da aynı nedenle ana filtre kapasitesi hesabına karıştırılmadı.
- CD400'ün iki çıkışının her biri için yayımlanan 2 L/dakika değeri toplam 240 L/saat olarak hava kapasitesi analizine alındı. YE-CC1 cam sileceği ve doğrudan ürün sayfasına taşınan `JY-5X` bakım seti kapasite hesabı dışında tutuldu.
- Jingye ekipman kataloğu 30 kayıttan 43 doğrulanmış kayda çıktı. Model kodu yayımlanmayan fakat 6972934051028 ürün koduyla ayrıştırılan siyah 500 L/saat iç filtre de açıklamalı biçimde eklendi. Kapasite değerlendirmesi gereken 29 kaydın 29'u hazırdır (%100); Atakan'ın güncel marka sayfasındaki 20 satış başlığının tamamı ile model, kategori, debi, güç, hacim ve doğrudan kaynak eşleşmeleri regresyon testlerine bağlandı.
- Hedefli `pnpm test:catalog-flow`, katalog denetimi ve tam `pnpm verify` başarılıdır: TypeScript, yedi ekipman kategorili ve 610 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. GitHub/Vercel'e gönderim yapılmadı.

## 2026-09-09 Eurostar güncel yerel portföy genişletmesi

- Atakan'ın güncel Eurostar marka sayfası ürün seçenekleriyle birlikte karşılaştırıldı. İki cam termometre, 48 cm hortum temizleme harbisi ve M/L Mangrove kökü dekorları doğrudan ürün kodu, barkod ve ölçüleriyle ekipman/aksesuar kataloğuna eklendi.
- Aquaclay bitki kumu 5 L ve 10 L varyantları, aynı markanın 500 ml filtre medyasından ayrı taban ürünleri olarak eklendi. Ürün Kataloğu'na yeni `Bitki tohumu` filtresi açıldı; Eleocharis, Glossostigma ve Hemianthus satış seçenekleri ayrı ürün kodlarıyla işlendi.
- Bitki tohumu paketlerinin gerçek bilimsel içeriği bağımsız bir kaynakla doğrulanamadığından, satıcının ürün adı katalogda korunurken bu belirsizlik kullanıcı açıklamasında açıkça belirtilir; ürünler doğrulanmış canlı bitki profili gibi sunulmaz.
- Eurostar ekipman/aksesuar sayısı 27'den 32'ye, bakım/ürün sayısı 17'den 22'ye çıktı. Üç teraryum ürünü AquaMind akvaryum kapsamının dışında olduğu için kataloğa alınmadı.
- Motorlu Pipo Filtre Medium ve Large için yeni güvenilir debi veya akvaryum hacmi değeri bulunamadı; iki güvenlik boşluğu tahmin yapılmadan korunuyor. Hedefli katalog testi, katalog denetimi ve tam `pnpm verify` başarılıdır: TypeScript, yedi ekipman kategorili ve 615 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. GitHub/Vercel'e gönderim yapılmadı.

## 2026-09-09 Nubios güncel yerel portföy genişletmesi

- Atakan'ın güncel Nubios marka sayfasındaki benzersiz dokuz ürün ailesi katalogla karşılaştırıldı. Mini mıknatıslı cam sileceğinin 771-KDSM01 kodu ve Small seçeneğinin ayrı 771-KDSM02 kodu doğrulandı; daha önce Small ürünü yanlışlıkla KDSM01 adı ve Mini bağlantısıyla tutulduğu için model kimliği ile kaynak düzeltildi.
- FPD-51A 58 cm bakım seti doğrudan ürün sayfası, kodu ve barkoduyla güncellendi. Eksik FPD51-T teleskopik beş işlevli set ve NB-002 pompalı dip sifonu ayrı kayıtlar olarak eklendi.
- Filtre ve ısıtma lambasıyla satılan ZHDG-02-B beyaz 46 cm, ZHDG-03-B beyaz 66 cm ve ZHDG-02-Y yeşil 46 cm kaplumbağa bahçeleri, yayımlanan ölçü, ürün kodu ve barkodlarıyla eklendi. Kaynak filtre debisi ve elektriksel güçleri yayımlamadığından bu değerler tahmin edilmedi.
- Nubios ekipman/aksesuar kataloğu 43 kayıttan 48 doğrulanmış kayda çıktı. Filtre kategorisindeki 16 kayıt ile diğer sistemlerdeki 32 kayıt birbirinden ayrılıyor; güncel yerel ürün kodları regresyon kapsamındadır.
- YU-118C ve YU-119C için yeniden güvenilir model bazlı debi bulunamadı. Başka markanın benzer ürün verisi kopyalanmadı; iki açıklamalı kapasite boşluğu korunuyor. Hedefli katalog testi, katalog denetimi ve tam `pnpm verify` başarılıdır: TypeScript, yedi ekipman kategorili ve 615 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. GitHub/Vercel'e gönderim yapılmadı.

## 2026-09-09 kırmızı kalem balığı tür ayrımı

- Genel `KIRMIZI KALEM TETRA BALIKLARI` satış kaydı bilimsel ad yayımlamadığı için tek bir türe bağlanmadı. Birbirine çok benzeyen `Nannostomus mortenthaleri` ve `Nannostomus rubrocaudatus` ayrı, türe özel uzman kaynaklı profiller olarak eklendi.
- İki profil de yayımlanan 3 cm erişkin boy, yaklaşık 81 litre/90 × 30 cm taban, en az onlu grup, 24–28 °C ve pH 4,0–7,0 eşikleriyle işlendi. Erkekler arası bölge mücadelesi, olgun ve yumuşak-asidik su gereksinimi ile iki türün bilimsel kimlik olmadan birbirine karıştırılmaması kullanıcı uyarılarına eklendi.
- Regresyon testi iki bilimsel profili ayrı ayrı doğruluyor ve genel satış adının bunlardan birine tahminle eşleşmesini engelliyor. Hedefli katalog testi ve tam `pnpm verify` başarılıdır: TypeScript, 615 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. Tetra grubu 31 kaynaklı ve bakım verisi tam profile ulaştı. GitHub/Vercel'e gönderim yapılmadı.

## 2026-09-09 Gül Tetra ve Bentosi ayrımı

- Genel `Gül Tetra` satış adı bilimsel tür yayımlamadığı için mevcut `Hyphessobrycon rosaceus` profiline veya yeni eklenen `Hyphessobrycon bentosi` profiline otomatik bağlanmadı. `H. bentosi`; Ornate, Bentosi, Bentos ve White-tipped Tetra adlarıyla ayrı seçilebilir güvenli profil olarak eklendi.
- Türe özel uzman kaynakta yayımlanan 4,5 cm erişkin boy, 90 × 30 cm taban, yaklaşık 81 litre, 20–28 °C ve pH 5,0–7,5 eşikleri işlendi. En az sekizli sürü, olgun ve çok temiz akvaryum, gölgeli bitkili alanlar ve benzer rosy tetra türleriyle kimlik karışıklığı kullanıcı uyarılarına eklendi.
- Regresyon testi Bentosi profilinin tüm bakım eşiklerini ve genel Gül Tetra satış adının iki profile de tahminle bağlanmamasını doğruluyor. Hedefli katalog testi ve tam `pnpm verify` başarılıdır: TypeScript, 615 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. Tetra grubu 32 kaynaklı ve bakım verisi tam profile ulaştı. GitHub/Vercel'e gönderim yapılmadı.
- `Kiraz Tetra` adı ayrıca denetlendi. Türkiye kaynaklarında hem `Hyphessobrycon rosaceus` hem Kiraz Barb (`Puntius titteya`), uluslararası ticarette ise henüz tür düzeyinde tanımlanmamış `Hyphessobrycon` sp. `Muzel` için kullanıldığı görüldü. Cikletist sayfası bilimsel kimlik yayımlamadığından mevcut güvenlik kaydı korundu ve otomatik profile bağlanmadı.

## 2026-09-09 Celebes Halfbeak ve genel Cüce Zargana ayrımı

- `Nomorhamphus liemi` ayrı bir Celebes Halfbeak profili olarak eklendi. Kaynaklardaki erişkin dişi boyu 10 cm, en az 91 cm/132 litre akvaryum, beşli grup, 24–27 °C ve pH 6,5–8,0 eşikleri işlendi; tür yalnız tatlı su profili olarak tanımlandı.
- Erkek başına iki veya üç dişi, boşluksuz kapak, geniş yüzey alanı, iyi oksijenlenme, aşırı olmayan akıntı ve küçük canlıları avlama riski kullanıcı uyarılarına aktarıldı.
- Genel `PLATİNİUM HALF BEAK CÜCE ZARGANA` satış adı bilimsel kimlik yayımlamadığından mevcut `Dermogenys pusilla` veya yeni `Nomorhamphus liemi` profiline tahminle bağlanmadı. İki türe özel profil seçilebilirken belirsiz mağaza adı açıklamalı güvenlik kaydı olarak korunuyor.
- Hedefli katalog testi ve tam `pnpm verify` başarılıdır: TypeScript, 615 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. Canlı doğuran grubu 15 kaynaklı ve bakım verisi tam profile ulaştı. GitHub/Vercel'e gönderim yapılmadı.

## 2026-09-10 Grant's Peacock ve Red Ruby ayrımı

- Bilimsel kimliği açık `Aulonocara stuartgranti`, Grant's Peacock adıyla ayrı seçilebilir profile eklendi. Uzman bakım kaynağındaki 13 cm boy, 120 × 45 cm/243 litre taban, bir erkek ve en az dört dişilik grup, 23–29 °C ve pH 7,5–9,0 eşikleri işlendi.
- Erkek bölgeciliği, başka Aulonocara türleriyle melezleşme, ince kum, güçlü filtrasyon ve haftalık %30–50 su değişimi gereksinimleri kullanıcı uyarılarına taşındı.
- Genel `RED RUBY CİKLET` doğal ve tekil bir tür adı olmadığı için A. stuartgranti profiline otomatik bağlanmadı. Seçilim hattı veya melez kimliği doğrulanmadıkça açıklamalı güvenlik kaydı olarak kalıyor.
- Hedefli katalog testi ve tam `pnpm verify` başarılıdır: TypeScript, 615 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. Cichlid grubu 71 kaynaklı ve bakım verisi tam profile ulaştı. GitHub/Vercel'e gönderim yapılmadı.

## 2026-09-10 Baensch's Peacock ve Sarı İmparator ayrımı

- `Aulonocara baenschi`, Baensch's/Sunshine Peacock adıyla ayrı seçilebilir profile eklendi. Uzman tür kaynağındaki erkek 12 cm boy, 120 × 45 cm/243 litre taban, bir erkek ve en az dört dişilik grup, 25–29 °C ve pH 7,5–9,0 eşikleri işlendi.
- İnce kum, olgun ve kararlı Malawi kurulumu, güçlü filtrasyon, haftalık %30–50 su değişimi, erkek bölgeciliği ve başka Aulonocara türleriyle melezleşme riskleri kullanıcı uyarılarına eklendi.
- Genel `İTHAL SARI İMPARATOR CİKLET` başlığı A. baenschi, sarı A. stuartgranti yerel formları ve seçilim/melez Peacock hatları için kullanılabildiğinden otomatik bağlanmadı; bilimsel kimlik veya göl kökeni olmadan güvenlik kaydı olarak kalıyor.
- Hedefli katalog testi ve tam `pnpm verify` başarılıdır: TypeScript, 615 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. Cichlid grubu 72 kaynaklı ve bakım verisi tam profile ulaştı. Bu ek paket GitHub/Vercel'e henüz gönderilmedi.

## 2026-09-10 Gastromyzon stellatus ve genel Borneo Kelebek Vatoz ayrımı

- Ticarette bulunan `Gastromyzon stellatus`, Yıldızlı Borneo vantuzu adıyla ayrı seçilebilir profile eklendi. Uzman kaynakta yayımlanan 5,5 cm boy, 75 × 30 cm/68 litre taban, en az dörtlü grup, 20–24 °C, pH 6,0–7,5 ve güçlü akıntı gereksinimleri işlendi.
- Olgun biyofilmli akarsu kurulumu, yüksek oksijen, yönlü akıntı, düz taş otlakları, boşluksuz kapak ve sıradan sıcak su topluluğuna uygun olmama uyarıları kullanıcıya aktarılıyor.
- Genel `Borneo Kelebek Vatoz` satış adı otomatik bağlanmadı. Uzman kaynak gerçek G. punctulatus'un ticarette bulunmadığını ve G. stellatus dahil farklı Gastromyzon türlerinin Borneo Sucker/Butterfly Loach adıyla karıştığını belirttiği için bilimsel etiket olmadan profil seçilmiyor.
- Hedefli katalog testi ve tam `pnpm verify` başarılıdır: TypeScript, 615 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. Dip balığı grubu 72 kaynaklı ve bakım verisi tam profile ulaştı. Bu ek paket GitHub/Vercel'e henüz gönderilmedi.

## 2026-09-10 Green Spotted Puffer ve genel Puffer ayrımı

- Bilimsel kimliği açık `Dichotomyctere nigroviridis`, Yeşil Benekli Balon Balığı adıyla ayrı seçilebilir profile eklendi. FishBase'deki 17 cm erişkin boy, 24–28 °C, sert-alkali su ve tuz gereksinimi; tür odaklı bakım kaynaklarındaki 120 litre/80 cm alt sınırıyla birlikte işlendi.
- Yavruların düşük tuzluluğa dayanabilmesinin uzun süreli tatlı su bakımı anlamına gelmediği açıklandı. Erişkin profil yalnız acı su/deniz suyu kataloğunda gösteriliyor; SG 1.010–1.018, güçlü filtrasyon, sıfır amonyak-nitrit, sert kabuklu yem ve tek bireylik tür akvaryumu uyarıları kullanıcıya aktarılıyor.
- Genel `PUFFER BALIKLARI` mağaza başlığı tatlı, acı ve deniz suyunda yaşayan çok farklı türleri kapsadığı için bu profile veya başka bir balon balığına otomatik bağlanmadı. Regresyon testi kesin bilimsel/ortak adın acı su profilini bulduğunu, genel adın güvenlik kaydı olarak kaldığını ve türün tatlı su kataloğunda önerilmediğini doğruluyor.
- Hedefli katalog testi ve tam `pnpm verify` başarılıdır: TypeScript, yedi ekipman kategorili ve 615 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. Balon balığı grubu 7 kaynaklı ve bakım verisi tam profile ulaştı. Bu ek paket GitHub/Vercel'e henüz gönderilmedi.

## 2026-09-10 Tatlı su iğne balığı ve genel Pipe Fish Needle ayrımı

- `Xenentodon cancila`, Tatlı Su İğne Balığı adıyla ayrı seçilebilir profile eklendi. Uzman tür kaynağındaki 40 cm toplam erişkin boy, dört veya daha fazla birey, 180 × 60 cm taban/yaklaşık 648 litre, 18–30 °C ve pH 6,0–8,0 eşikleri işlendi.
- Yüzeyde avlanma, küçük balıkları yutma, ani sıçrama, güçlü fakat türbülans oluşturmayan filtrasyon, olgun akvaryum ve haftalık %30–50 su değişimi gereksinimleri kullanıcı uyarılarına eklendi. Kaynak normal bakımda deniz tuzunun gerekli olmadığını belirttiği için profil yalnız tatlı su kataloğunda gösteriliyor.
- Genel `PIPE FISH NEEDLE` satış başlığı farklı familyalardaki pipefish ve needlefish türlerini birlikte çağrıştırdığı için bu profile bağlanmadı. Bilimsel kimlikli `X. cancila` seçilebilirken mağaza kaydı açıklamalı güvenlik listesinde kalıyor.
- Hedefli katalog testi ve tam `pnpm verify` başarılıdır: TypeScript, yedi ekipman kategorili ve 615 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. Diğer balıklar grubu 25 kaynaklı ve bakım verisi tam profile ulaştı. Bu ek paket GitHub/Vercel'e henüz gönderilmedi.

## 2026-09-10 Hindiçin iğne balığı tür ayrımı

- `Xenentodon canciloides`, Hindiçin/Inkstripe Needlefish adıyla `X. cancila`dan ayrı seçilebilir profile eklendi. FishBase ve Eschmeyer tür kimliğini doğruluyor; uzman bakım kaynağındaki 30 cm boy, 180 × 60 cm/yaklaşık 648 litre taban, en az dörtlü grup, 18–26 °C ve pH 6,0–8,0 eşikleri işlendi.
- Yalnız tatlı su, yüzeyde avlanma, küçük balık riski, zayıf yem rekabeti, boşluksuz kapak, olgun akvaryum, düşük türbülans ve haftalık %30–50 su değişimi gereksinimleri kullanıcı uyarılarına eklendi.
- Genel `PIPE FISH NEEDLE` kaydı artık iki ayrı Xenentodon profilinin hazır olduğunu açıklıyor; bilimsel kimlik verilmediği için `X. cancila`, `X. canciloides` veya gerçek bir pipefish türünden hiçbirine otomatik bağlanmıyor.
- Hedefli katalog testi ve tam `pnpm verify` başarılıdır: TypeScript, yedi ekipman kategorili ve 615 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. Diğer balıklar grubu 26 kaynaklı ve bakım verisi tam profile ulaştı. Bu ek paket GitHub/Vercel'e henüz gönderilmedi.

## 2026-09-10 Brachirus panoides ve genel Tatlı Su Dil Balığı ayrımı

- `Brachirus panoides`, Malaya Nehir Dil Balığı adıyla ayrı seçilebilir profile eklendi. FishBase'deki 20 cm erişkin boy ve tatlı/acı su yaşamı; bakım kaynaklarındaki 208 litre, 100 cm, 23–28 °C, pH 7,0–8,0 ve SG 1.000–1.015 eşikleriyle işlendi.
- İnce kuma gömülme, loş ve düşük akıntılı taban alanı, canlı/dondurulmuş dip yemiyle hedefli besleme, küçük canlıları avlama ve tuzluluk değişimlerini yavaş yapma uyarıları kullanıcıya aktarılıyor.
- Genel `TATLI SU DİL BALIKLARI` adı B. panoides dışında B. harmandi, B. selheimi ve başka yassı balıkları da kapsadığından otomatik bağlanmadı. Bilimsel kimlikli profil seçilebilirken mağaza kaydı açıklamalı güvenlik listesinde kalıyor.
- Hedefli katalog testi ve tam `pnpm verify` başarılıdır: TypeScript, yedi ekipman kategorili ve 615 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. Diğer balıklar grubu 27 kaynaklı ve bakım verisi tam profile ulaştı. Bu ek paket GitHub/Vercel'e henüz gönderilmedi.

## 2026-09-10 Parambassis ranga ve genel Buz Balığı ayrımı

- `Parambassis ranga`, Hint Cam Balığı adıyla ayrı seçilebilir profile eklendi. FishBase'deki 9,5 cm azami boy; uzman bakım kaynağındaki en az altılı sürü, 80 × 30 cm/yaklaşık 72 litre, 20–30 °C ve pH 6,5–8,0 eşikleriyle işlendi.
- Tatlı ve hafif acı su kapsamı, düşük akıntı, koyu ve bitkili kurulum, sakin tank arkadaşları ve bilimsel kimlik doğrulaması kullanıcı uyarılarına eklendi. Tatlı suda tuzun zorunlu olmadığı ve `Painted/Disco` adıyla satılan boya enjekte edilmiş bireylerin ağır refah riski taşıdığı açıklandı.
- Genel `BUZ BALIĞI` satış adı tatlı, acı ve deniz suyunda yaşayan ilgisiz taksonları kapsadığından bu profile otomatik bağlanmadı; kesin bilimsel/ortak ad profili bulurken mağaza kaydı açıklamalı güvenlik listesinde kalıyor.
- Hedefli katalog testi ve tam `pnpm verify` başarılıdır: TypeScript, yedi ekipman kategorili ve 615 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. Diğer balıklar grubu 28 kaynaklı ve bakım verisi tam profile ulaştı. Bu ek paket GitHub/Vercel'e henüz gönderilmedi.

## 2026-09-10 Chitala ornata güvenlik ve kaynak düzeltmesi

- Mevcut `Chitala ornata` profilindeki kaynaksız 1.500 litre/300 cm değerleri kaldırıldı. FishBase'deki 100 cm erişkin boy, Seriously Fish'teki 20–28 °C ve pH 6,0–8,0 koşulları ile Aqueon'un erişkin için yayımladığı 750 ABD galonu/yaklaşık 2.839 litre eşik işlendi.
- Kaynaklar santimetre cinsinden minimum akvaryum cephesi vermediği için uzunluk tahmin edilmedi ve kullanıcıya açık veri notu eklendi. Standart ev akvaryumuna uygun olmama, tek bireylik uzman kurulum, avlanma riski, yüksek oksijen, güçlü olgun filtrasyon, güvenli kapak ve haftalık %50–70 su değişimi uyarıları tamamlandı.
- Genel `BIÇAK BALIKLARI` ile renk adı olan `ALBİNO BIÇAK BALIĞI`, bilimsel kimlik kanıtlanmadan bu profile bağlanmıyor. Kesin `Clown Knifefish` veya `Chitala ornata` araması kaynaklı profili buluyor.
- Hedefli katalog testi ve tam `pnpm verify` başarılıdır: TypeScript, yedi ekipman kategorili ve 615 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. Monster grubu 36 kaynaklı ve bakım verisi tam profilde kaldı. Bu ek paket GitHub/Vercel'e henüz gönderilmedi.

## 2026-09-10 Eski Monster profilleri kaynak düzeltmesi

- Senegal bichir profili FishBase'deki 70 cm bilimsel azami boy ve Seriously Fish'teki 150 × 60 cm/yaklaşık 540 litre bakım tabanı ile güncellendi. Boy kaynaklarının farklı amaçlarla verdiği 70 cm ve 50 cm değerleri kullanıcıya açıklandı; düşük akıntı, yüzey havasına erişim, yumuşak taban ve kaçış kapağı uyarıları eklendi.
- Dev guraminin kaynaksız 1.200 litre/250 cm eşikleri kaldırıldı; tür kaynağının yayımladığı 70 cm, 183 × 61 cm/yaklaşık 681 litre mutlak alt sınır, 20–30 °C ve pH 6,5–8,0 koşulları işlendi. Uzun ömür, hızlı büyüme, güçlü filtrasyon ve daha büyük sistem tercih edilmesi açıklandı.
- Kırmızı karınlı pacu profili 88 cm bilimsel erişkin boy, 300 × 90 cm taban ve doğrulanmış ikincil kaynaktaki yaklaşık 3.000 litre tropikal havuz ölçeğiyle düzeltildi. Standart ev/topluluk akvaryumuna uygun olmama, aşırı biyolojik yük ve doğaya bırakmama uyarıları eklendi.
- Alligator Gar güvenlik kaydı FishBase'deki 260 cm toplam boy ile uzman kaynaktaki 305 cm standart boyun farklı ölçüm türleri olduğunu açıklayacak şekilde güncellendi. Güvenilir kaynak sayısal yetişkin tesis hacmi veya tabanı yayımlamadığı için sahte profil oluşturulmadı ve belirsiz mağaza adı güvenlik listesinde kaldı.
- Regresyon testi ve tam `pnpm verify` başarılıdır: TypeScript, yedi ekipman kategorili ve 615 bakım ürünlü katalog akışı, 52 sağlık senaryosu, beş kum türünü kapsayan hesaplayıcı regresyonu, katalog denetimi ve 14 sayfalık üretim derlemesi geçti. Bu ek paket GitHub/Vercel'e henüz gönderilmedi.

## 2026-09-10 Katalog önizleme kontrol noktası

- Bu tarihteki Baensch's Peacock, Gastromyzon stellatus, Green Spotted Puffer, iki Xenentodon türü, Brachirus panoides, Parambassis ranga, Chitala ornata ve eski Monster profil güvenlik düzeltmeleri `79a07bb` commit'iyle `codex/catalog-capacity-batch` dalına gönderildi.
- Vercel önizleme dağıtımı başarıyla tamamlandı. Bu yalnız görev dalı önizlemesidir; `main` dalı ve genel üretim adresi değiştirilmedi.
- Önizleme bağlantısı: `https://aqua-mind-git-codex-catalog-capacity-batch-ckaracoras-projects.vercel.app/`
