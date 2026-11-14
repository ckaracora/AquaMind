// Sürüm sabitleri sonuç nesnesine EKLENMEZ; mevcut `analyzeAquarium` çıktısının
// biçimi Phase 0B'de birebir korunur. Bu sabitler, Phase 1'de kalıcı hesaplama
// kayıtlarına ("hangi motor ve kural seti bu puanı üretti?") eşlik etmek içindir.
//
// ENGINE_VERSION: hesaplama kodunun sürümü. Puanı veya uyarıları değiştiren her
// kod değişikliğinde yükseltilir.
// RULESET_VERSION: motorun içine gömülü eşik ve ceza sabitlerinin sürümü
// (0,85 etkin hacim, 0,65 filtre verimi, 0,5–1,5 W/L ısıtıcı bandı, 80 yaşam ortamı ve
// 55/55/20/60/60 uyum cezaları, %40 avlanma oranı, 60 sarı alan ve grup tabanı, 23 °C tropikal eşiği, canlı riski uyarı sınıfı, deniz suyu hedefleri). Bir sabit ya da
// kural değişince yükseltilir.
//
// 1.1.0: katalog entegrasyonuyla yaşam ortamı, tuzluluk, birey başına ek hacim ve
// yardımcı filtre kuralları eklendi (bkz. docs/DECISIONS/0007-katalog-entegrasyonu-motor-kurallari.md).
//
// 1.2.0: amonyak, nitrit ve nitrat değerlendirmesi (OATA eşikleri) ve kesin tehlikenin genel
// durumu "tehlike"ye çekmesi eklendi (bkz. docs/DECISIONS/0008-su-kalitesi-ve-kesin-tehlike.md).
//
// 1.3.0: filtre yeterliliği üretici hacim önerisine (yoksa etiket debisiyle saatteki çevrime) göre;
// tahmini biyolojik yük yalnızca belirgin aşırı kalabalıkta uyarı verir; kesin olmayan bir tehlike uyarısı
// varken genel durum en fazla "dikkat" olur (bkz. docs/DECISIONS/0009-filtre-yuk-ve-genel-durum.md).
//
// 1.4.0: kaynaklı davranış uyarıları: yüzgeç ısırma, cüce karides, fırsatçı avcı ve aynı tür
// saldırganlığı; hepsi uyarı seviyesinde (bkz. docs/DECISIONS/0010-davranis-uyarilari.md).
//
// 1.5.0: taban ısıtma kablosu gibi pasif ısıtıcı kayıtları ısıtıcı kapasitesine katılmaz
// (bkz. docs/DECISIONS/0011-katalog-entegrasyonu-2-taban-isiticisi.md).
//
// 1.6.0: alan uyarısının şiddeti. Akvaryum kaynağın önerisinin ve İsviçre Hayvan Koruma Yönetmeliği'nin
// balık boyuna göre ölçü sınırının (uzunluk 3×, genişlik 2×, derinlik 1×) altındaysa alan uyarısı tehlikedir
// (bkz. docs/DECISIONS/0012-alan-uyarisinin-siddeti.md).
//
// 1.7.0: kaynağı açıkça "salyangoz yer" diyen balık salyangozla birlikteyse sarı uyarı
// (bkz. docs/DECISIONS/0013-salyangoz-uyarisi.md).
//
// 1.8.0: katalogda doğrulanmış kapasite verisi olmayan ekipmanda kullanıcının etiketten girdiği debi ya da güç
// hesaba katılır; kural aynıdır, sonuç "elle girilen değer" olarak işaretlenir
// (bkz. docs/DECISIONS/0017-elle-girilen-ekipman-degerleri.md).
//
// 1.9.0: "Katalogla eşleşmeyen ekipman kaydı var" uyarısı yalnızca güvenlik hesabına giren türlerde çıkar
// (filtre, ısıtıcı; hava motoruyla çalışan filtre varsa hava motoru). Aydınlatma, CO₂ gibi hesaba girmeyen cihaz
// listede olmasa da uyarı üretmez; puan değişmez (bkz. docs/DECISIONS/0018-eslesmeyen-ekipman-uyarisi.md).
//
// 1.10.0: sonuç biçimi v2. Her uyarı `code` ve `params`, her ölçüt `detailCode` ve `detailParams` taşır; ekran metni dil
// dosyasında bunlardan kurulur. Türkçe `title`, `message`, `label` ve `detail` alanları aynen üretilir; kurallar, puanlar ve
// sıralama değişmez, bu yüzden kural seti sürümü aynı kalır (bkz. docs/DECISIONS/0021-dil-altyapisi.md, 3. paket).
//
// 1.11.0: bitki uyarıları, akvaryumun sağlık analizinden ayrı bir işlevde (`assessPlants`, src/plants.ts): yüksek CO₂ isteyen bitki ve
// CO₂ ekipmanı yok, en az orta ışık isteyen bitki ve aydınlatma yok, son su ölçümü bitkinin kaynaktaki sıcaklık ya da pH aralığı dışında
// (uyarı); bitkinin kaynaktaki boyu akvaryumun yüksekliğinden büyük (bilgi). Yeni sayısal eşik yok; `analyzeAquarium`ın puanı, uyarıları
// ve çıktısı değişmez. Bitki kuralları puan cezası ve gömülü eşik içermez (yalnız kayıttaki değerler), bu yüzden kural seti sürümü
// aynı kalır (bkz. docs/DECISIONS/0025-bitki-uyarilari.md).
//
// 1.12.0: bitki uyarılarına katalogdaki kaynaklı etiketler girer: "su bitkisi değil" ve istilacı tür listesi (sarı uyarı). Değerleri kaynakta
// olmayan yalnız uyarı kayıtlarında da çıkar. Sağlık puanı, `analyzeAquarium` ve kural seti değişmez
// (bkz. docs/DECISIONS/0028-bitki-etiketleri-saglik-analizinde.md).
//
// 1.13.0: deniz akvaryumunun su hedefleri akvaryum düzeyinde (src/marine.ts). Son ölçümün özgül ağırlığı, pH'ı, (omurgasızlı akvaryumda)
// KH'si ve (yalnız balıklı akvaryumda) nitratı OATA'nın ev akvaryumu kurulum rehberindeki hedeflerle karşılaştırılır; hedef dışı sarı uyarıdır.
// Özgül ağırlık iki hedefin de dışındaysa (1,017–1,026) kesin tehlikedir. Deniz canlılarının kayıtlarında pH ve özgül ağırlık yoktur;
// pH aralığı olmayan canlı pH kesişimine girmez. Yeni gömülü eşikler (OATA hedefleri) eklendiği için kural seti 1.10.0
// (bkz. docs/DECISIONS/0029-tuzlu-su-baslangic-paketi.md, 0030-deniz-suyu-hedefleri.md).
//
// 1.14.0: veri testi B'nin bulgularından yedi değişiklik (bkz. docs/DECISIONS/0037-genel-durum-ve-uyari-duzeltmeleri.md). Tehlikedeki bir ölçüt
// (veri güveni hariç; canlısı olmayan akvaryumda filtre ve ısıtıcı hariç) genel puanı en fazla 74 yapar. Topluluk notu sarı uyarı olarak kalır,
// tür uyumu cezası (30) kalkar. Yalnız sarı alan ya da grup uyarısı ölçütü 60'ın altına düşürmez. Son ölçümün sıcaklığı ya da pH'ı bir canlının
// aralığı dışındaysa, soğuk su türü tropikal balıkla birlikteyse, türlerin ortak sıcaklığı tek bir değerse, canlısı olan akvaryumda filtre
// kayıtlı değilse ve tropikal canlı varken ısıtıcı kayıtlı değilse sarı uyarı çıkar (tropikal: soğuk su türü değil, en düşük sıcaklığı ≥ 23 °C;
// ısıtıcı ölçütündeki mevcut eşik). İsviçre genişlik kuralı tehlikeden sarı "akvaryum bu tür için dar" uyarısına iner. Bir ceza sabiti kalktığı,
// taban sabiti geldiği, tavan kuralı ve kırmızı alan koşulu değiştiği için kural seti 1.11.0. Sonuç nesnesinin biçimi değişmez.
//
// 1.15.0: canlı riski uyarıları genel duruma girer (bkz. docs/DECISIONS/0040-canli-riski-uyarilari-genel-durumda.md; ürün sahibinin onayı 2026-11-12,
// seçenek B). Canlı kaydı olan akvaryumda yenme ve yaralanma, alan, kalabalık ve grup ya da aralık dışı su değeri uyarısı (18 kod) genel puanı en
// fazla 74 yapar; bilgi notları, kayıt ve veri eksikliği, cinsiyete bağlı aynı tür saldırganlığı ve ekipman uyumu genel puanı değiştirmez. Fırsatçı
// avcının küçük balık uyarısı tehlike seviyesine çıkar (kesin tehlike değil, en fazla "dikkat"); fırsatçı avcı her kategoriden olabilir, av yalnız
// balıktır. "Tek tutulmalı" uyarısı, katalog türü çift ya da grup halinde öneriyorsa ve kayıtlı adet bu sayıyı aşmıyorsa çıkmaz. Yeni sayı yok;
// tavan kuralı, uyarı seviyesi ve uyarı koşulu değiştiği için kural seti 1.12.0. Sonuç nesnesinin biçimi değişmez.
//
// 1.16.0: veri testi D'nin üç uç durumu (bkz. docs/DECISIONS/0041-karides-tuzluluk-ve-baliksiz-dongu.md; ürün sahibinin onayı 2026-11-12).
// "Karides yer" kaydı kaynak boy sınırı vermiyorsa bütün karideslerde uyarır; kaynak riski küçük karidesle ya da yavruyla sınırlıyorsa
// (`smallShrimpOnly`) yalnız 4 cm ve altı karideste. Yalnız balıklı deniz akvaryumunda özgül ağırlık hedefi 1,017–1,025 (üst sınır OATA'nın
// deniz balığı bakım kartlarından). Canlı kaydı olmayan akvaryumda amonyak ya da nitrit sıfırın üstündeyse tek sarı "Canlı eklemek için erken"
// uyarısı çıkar (`cycleIncomplete`); kesin tehlike değildir, genel puan en fazla 74 olur. Canlı varken su kalitesi kuralı değişmez. Yeni sayı yok;
// bir hedef sabiti, uyarı kapsamı ve kesin tehlike koşulu değiştiği, yeni uyarı kodu geldiği için kural seti 1.13.0. Sonuç nesnesinin biçimi değişmez.
//
// 1.17.0: deniz akvaryumunda özgül ağırlığın sınır bandı (bkz. docs/DECISIONS/0042-ozgul-agirlik-sinir-bandi.md; ürün sahibinin onayı 2026-11-12,
// "sınırda dikkat bandı"). Güvenli aralığın (1,017–1,026) bir okuma basamağı (0,001) dışına kadar olan ölçüm kesin tehlike değil, sarı
// "hedefin dışında" uyarısıdır: yalnız balıklı akvaryumda 1,016 ve 1,027 dahil, omurgasızlı akvaryumda yalnız üstte 1,027 dahil
// (`MARINE_SPECIFIC_GRAVITY_DANGER_LIMITS`). Ötesi kesin tehlike kalır. Hedefler, uyarı kodları ve metinleri değişmez. Kesin tehlike sınırı
// değiştiği, yeni sabit geldiği için kural seti 1.14.0. Sonuç nesnesinin biçimi değişmez. Denetim sonrası: karşılaştırma kayan nokta
// artığını 1e-9 payla yutar (hesapla gelen 1,0270000000000001 sınırın kendisi); ekranda ölçüm aştığı sınırla aynı yazılmaz (dil dosyaları).
//
// 1.18.0: hüküm kuralları ve "eksik değerlendirildi" (bkz. docs/DECISIONS/0043-eksik-degerlendirme-ve-hukum-kurallari.md; ürün sahibinin onayı
// 2026-11-14, "tamam başla"). "Tek tutulmalı" türden (kaynağın çift önerdiği türde tek çift hariç) birden çok birey kesin tehlikedir (kırmızı,
// tür uyumu cezası 60); "erkekler kavga eder" sarı kalır ama canlı riski sınıfına girer (en çok "dikkat"). Net hacim, kayıtlı adet için gereken
// en az hacmin yarısından küçükse yeni `spaceTooSmall` uyarısı kesin tehlikedir (her kategoride; metin iki hacmi birlikte söyler). "Karides yer"
// ve "salyangoz yer" kaydı her kategoriden canlıda uyarır; canlı kendi türünü av saymaz. Sonuç nesnesine iki isteğe bağlı alan gelir:
// `unevaluated` (değerlendirilemeyenler: tanınmayan ya da doğrulanmamış canlı, davranış bilgisi olmayan tür, tanınmayan ya da kapasitesi
// bilinmeyen cihaz, su ölçümü yok) ve `incomplete` (tanınmayan ya da doğrulanmamış canlı var). Durum ve puan bu iki alandan etkilenmez.
// Davranış girdisine `peaceful` ve `notPiscivorous` notları gelir; uyarı üretmez, yalnız "biliniyor" sayılır. Yeni oran sabiti
// (`SEVERE_VOLUME_RATIO`), uyarı seviyesi, kesin tehlike koşulu ve ceza değiştiği için kural seti 1.15.0.
export const ENGINE_VERSION = "1.18.0";
export const RULESET_VERSION = "1.15.0";
