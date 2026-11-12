# 0037 — Genel durum ve uyarı düzeltmeleri (veri testi B)

- Tarih: 2026-11-10
- Durum: Kabul edildi. Ürün sahibi (`buraksenfx`) 2026-11-10'da veri testi B bulgularından çıkan yedi motor değişikliğini sohbette onayladı. Teknik kararlar Claude'un (lider). Yeni uyarıların Türkçe metinleri kodlamadan önce ürün sahibine taslak olarak gösterildi ve onaylandı; İngilizce (ABD) ve İspanyolca (Latin Amerika) metinler taslaktaki gibi, İspanyolcada "estrecho". Örnek akvaryum kararı ürün sahibinin: son ölçüm 25,4 °C → 24,5 °C. Kontrol: Codex, 2026-11-11 (aşağıda "Kontrol"). Kod ve belgeler `fc4440c`, altın fikstür ayrı commit `41f987f`; PR henüz açılmadı.

## Bağlam

Veri testinin B bölümü (2026-11-09, motor 1.13.0, kural seti 1.10.0) 30 gerçekçi akvaryum senaryosunu kaynaklı beklentilerle karşılaştırdı. Sonuç:

- 15 senaryo doğru, 12 senaryo kısmen doğru. Kısmen doğruların 11'inde sorun yalnız genel hükümde.
- 2 yanlış alarm (B12, B25), 1 kaçırılan bulgu (B14). Kurulamayan senaryo yok.
- Genel hüküm 13 senaryoda tutmadı; hepsinde motor beklenenden hafifti. 11'inin nedeni motor kuralı, 2'sininki bitki uyarılarının bilerek puana girmemesi (B24, B30; karar 0025, 0028).

Motor kuralından gelen kök nedenler:

1. **Genel durum kırmızı ölçütü yansıtmıyor.** 74 sınırını yalnız tehlike seviyesindeki bir uyarı koyuyordu. Tehlikedeki bir ölçüt tek başına sınır koymuyordu.
   - B20: 40 L'ye 200 W ısıtıcı. Isıtıcı ölçütü 45, uyarı sarı, genel 90 "uygun".
   - B22: 54 L, ekipman yok, 10 neon, 19 °C. Filtre ölçütü 35, uyarı yok, genel 86 "uygun".
   - B15, B19 ve B21 kesin olmayan tehlikeyle 74 "dikkat"te.
2. **Topluluk notu tür uyumunu düşürüyor.** Notu olan tür başka bir türle birlikteyse ceza 30 yazılıyor ve "Tür uyumu" 70 (dikkat) oluyordu. 8 senaryoda bu ölçüt yalnız bu not yüzünden "dikkat"teydi (ör. B03, B04, B05, B07, B21, B23). B3 sınıflaması bunları gürültü saydı.
3. **Sarı alan uyarısı ölçütü kırmızıya düşürüyor.** Alan ölçütü `100 − sorunlu tür / tür × 80`. B25'te (60 L, ocellaris çifti) tek türde sarı "alan sınırda" uyarısı ölçütü 20'ye (tehlike) indirdi. Sosyal ölçüt de aynı biçimde hesaplanıyordu (`100 − oran × 65`): tek türde sarı "grup sayısı düşük" 35 (tehlike) veriyordu.
4. **İsviçre genişlik kuralı.** B12'de (450 L, 150 × 50 × 65 cm, tek astronot) yalnız genişlik 2 × 45,7 = 91,4 cm'nin altında kaldığı için kırmızı "akvaryum çok küçük" çıktı. Kanıtların hiçbiri bu genişliği istemiyor (PFK yalnız 120 cm uzunluk, Seriously Fish 150 × 60 cm taban). Altın fikstürde 130 kırmızı alan uyarısının 62'si yalnız genişlikten.
5. **Soğuk su türü ılık suda.** B14'te Japon balığı (4–25 °C) ile lepistes (20–28 °C) 25 °C'de birlikte. Uyarı yok. Sıcaklık çatışması yalnız aralıklar hiç kesişmezse çıkıyordu. Katalogdaki `group:"coldwater"` motorda kullanılmıyordu.
6. **Ölçülen değer tür aralığı dışında.** B22'de (19 °C, neon 21–25 °C) ve B28'de (pH 6,5, Malawi) uyarı yok. Değer yalnız su ölçütünün denetim oranını düşürüyordu (B22: 4/5 = 80 "iyi").
7. **Ekipman yok.** Filtresiz ve ısıtıcısız akvaryumda uyarı yok, yalnız ölçüt düşüyordu. Ölçüt metni ("Katalogdan filtre bulunamadı") kullanıcı hiç filtre girmediyse yanıltıcı (B22).

## Karar

Ürün sahibinin kararları (2026-11-10):

1. **Tehlikedeki ölçüt genel durumu en fazla "dikkat" yapar.** Bir ölçüt tehlikedeyse genel puan en fazla 74 olur, tehlike uyarısındaki gibi. "Veri güveni" hariç. Canlısı olmayan akvaryumda filtre ve ısıtıcı ölçütü tavan koymaz. Kesin tehlikenin 49 sınırı önce gelir.
2. **Topluluk notu puanı düşürmez.** Not sarı uyarı olarak kalır, tür uyumu cezası (30) kalkar; ölçütün açıklamasından da çıkar.
3. **Sarı alan uyarısı alan ölçütünü tehlikeye düşürmez** (taban 60). Aynı ilke sosyal ölçüte de uygulanır. Kırmızı alan uyarısı varken ölçüt en fazla 35 kalır.
4. **Ölçülen sıcaklık ya da pH bir türün aralığı dışındaysa sarı uyarı** çıkar. Parametre başına tek uyarı; aralığın dışında kalan türler listelenir.
5. **Soğuk su türü ile tropikal balık birlikteyse ya da türlerin sıcaklık aralıkları tek noktada kesişiyorsa sarı uyarı** çıkar; ikisi de cezasız. İkisi birlikte tutarsa yalnız soğuk su uyarısı çıkar.
6. **Filtre kayıtlı değilse ve tropikal canlı varken ısıtıcı kayıtlı değilse sarı uyarı** çıkar; yalnız canlı varken.
7. **İsviçre genişlik kuralı tehlikeden sarıya iner** (yeni "akvaryum bu tür için dar" uyarısı). Kırmızı alan mesajından genişlik ifadesi çıkar.

Ayrıca örnek akvaryumun ("Amazon Nehri") son ölçümü 25,4 °C'den 24,5 °C'ye çekildi (ürün sahibinin kararı); 25,4 °C neonun kaynaktaki üst sınırının (25 °C) üstündeydi ve örnek, yeni sarı sıcaklık uyarısını alacaktı.

Teknik kararlar (Claude):

- **Genel durum (karar 1):**
  - `dangerMetric`: veri güveni dışındaki yedi ölçütten biri tehlikedeyse (`status==="danger"`) tavan koyar. Canlı kaydı yoksa (`animals.length === 0`) filtre ve ısıtıcı ölçütü sayılmaz.
  - Puan: kesin tehlike varsa en fazla 49. Yoksa tehlike uyarısı ya da tehlikedeki bir ölçüt varsa en fazla 74 (`DANGER_WARNING_SCORE_CAP`, değişmedi).
- **Topluluk notu (karar 2):**
  - `communityCaution` uyarısı sarı kalır; ayrı bir "bilgi" seviyesi eklenmedi, sağlık sayfası değişmedi. Emsal: bitki uyarıları sarı ve puansız (karar 0025).
  - Uyum cezası listesinden 30 çıktı. Ölçütün açıklama zincirinden de çıktı: ceza olmadan "Tank arkadaşı seçimi dikkat gerektiriyor" yeşil kartla çelişirdi. `communityCaution` ölçüt kodu üç dil dosyasından silindi.
- **Alan ve sosyal ölçüt (karar 3):**
  - Kırmızı alan uyarısı yokken alan sorunu olan akvaryumda ölçüt en az 60 (`SPACE_WARNING_FLOOR=60`). 60, iki türden biri sorunluyken çıkan değer; yük ve filtre uyarısındaki ölçüt de 60. Oran 60'ın üstündeyse oran kalır (ör. üç türden biri: 73).
  - Kırmızı alan uyarısında en fazla 35 (`SEVERE_SPACE_SCORE`, değişmedi).
  - Sosyal ölçüt: grup sayısı düşük bir tür varken en az 60 (`SOCIAL_WARNING_FLOOR = SPACE_WARNING_FLOOR`). Grup uyarısı her zaman sarıdır, bu yüzden sosyal ölçüt artık tehlikeye inmez.
- **Ölçülen değer (karar 4):**
  - `speciesTemperatureOutOfRange` ve `speciesPhOutOfRange` (sarı, cezasız, kesin tehlike değil). Son ölçümün değeri sonlu bir sayı olmalı (`Number.isFinite`); sınırlar aralığın içinde sayılır.
  - Değişkenler: `value`, `above` ve `below` (değerin aralığının üstünde ve altında kaldığı türlerin adları), `hasRange` (türlerin ortak aralığı var mı), `min`, `max` (ortak aralık; yoksa 0). Ortak aralık varsa mesaj onu, tek noktaysa o değeri söyler; ortak aralık yoksa söylemez (kırmızı çatışma uyarısı zaten "ortak aralık bulunamadı" der) ama uyarı yine çıkar.
  - pH aralığı olmayan (deniz) canlısı pH denetimine girmez (bugünkü `phIntersection` gibi). Su değeri ölçütü bugünkü gibi denetim oranıyla hesaplanır.
- **Soğuk su ve tek nokta (karar 5):**
  - `SpeciesProfileInput`'a `group?: string` eklendi. Katalog alanı motora zaten ulaşıyordu (uyarlayıcı kaydın tamamını veriyor); eksik olan yalnız tipti. Motor yalnız `"coldwater"` değerini okur.
  - Türlerin ortak sıcaklık aralığı varken soğuk su türü ile tropikal balık birlikteyse `coldwaterWithTropical` (değişkenler `coldwater`, `tropical`, `min`, `max`).
  - En az iki türün ortak sıcaklığı tek bir değerse (`min === max`) `temperatureRangeNarrow` (değişken `value`). Tek tür ya da aynı türün birden çok kaydı bu uyarıyı almaz.
  - İkisi birlikte tutarsa yalnız `coldwaterWithTropical` çıkar; mesajı tek noktayı da söyler. Ortak aralık yoksa ikisi de çıkmaz, kırmızı `temperatureConflict` yeter. Tür uyumu cezası yok.
- **Tropikal tanımı (karar 5 ve 6):**
  - Yeni eşik uydurulmadı. Motorun ısıtıcı ölçütünde Phase 0B'den beri bulunan 23 °C kullanıldı ve adlandırılmış sabit oldu (`TROPICAL_MIN_TEMPERATURE_C=23`, değeri değişmedi): soğuk su türü değil ve kaynaktaki aralığının alt sınırı 23 °C ya da üstü (`isTropical`).
  - Isıtıcı ölçütü (ısıtıcı yokken 35/75) ve `heaterMissing` bütün canlılara aynı tanımla bakar. Isıtıcı ölçütündeki tek fark "soğuk su türü değil" koşulu; katalogda alt sınırı 23 °C ve üstü olan soğuk su türü olmadığı için hiçbir altın vakanın puanı değişmedi.
  - `coldwaterWithTropical` yalnız balıklara bakar ("tropikal balık"): onaylı metin "{tropical} tropikal balık" diyor ve karar 5 "tropikal balık" diyor. Balık olmayan tropikal canlı bu uyarıyı tetiklemez; ortak sıcaklık tek noktaysa `temperatureRangeNarrow` yine çıkar.
  - Bu eşiğin yazılı bir kaynağı yok; COMPATIBILITY.md'de ve karar kayıtlarında yazmıyordu. Kaynaklı tanım açık iştir (aşağıda).
- **Ekipman yok (karar 6):**
  - `filterMissing` (sarı, değişkensiz): canlı kaydı varsa ve ekipman listesinde pasif olmayan hiç `filter` kaydı yoksa. Liste doğrulanmış kayıtlarla sınırlanmaz: katalog dışı ya da doğrulanmamış filtre "kayıtlı" sayılır (onlar için zaten eşleşmeyen ya da doğrulanmamış ekipman uyarısı çıkıyor; B23 bu uyarıyı almaz). Yalnız yüzey skimmeri varsa çıkmaz; orada kırmızı `primaryFilterRequired` çıkıyor. Filtre ölçütü bugünkü gibi 35.
  - `heaterMissing` (sarı): tropikal canlı varsa ve listede pasif olmayan `heater` kaydı ya da entegre ısıtıcılı filtre yoksa. Katalog dışı ya da doğrulanmamış ısıtıcı "kayıtlı" sayılır. Taban ısıtma kablosu ısıtıcı sayılmaz (karar 0011); yalnız o kayıtlıysa mesaj bunu söyler. Değişkenler `tropical`, `min` (23 °C), `passive`.
  - Ölçüt açıklamaları: listede hiç filtre kaydı yoksa `filterNotRecorded` ("Filtre kayıtlı değil"), hiç ısıtıcı kaydı (taban kablosu ve ısıtıcılı filtre dahil) yoksa `heaterNotRecorded` ("Isıtıcı kayıtlı değil"). Kayıt var ama hesaba giremiyorsa bugünkü "Katalogdan … bulunamadı" kalır. Puan etkisi yok.
- **Genişlik (karar 7):**
  - Genişlik koşulu kırmızı basamaktan çıktı. Kırmızı "akvaryum çok küçük" yalnız uzunluk (3×) ya da yükseklik (1×) sınırı aşılınca çıkar; `spaceSevere` mesajı genişliği saymaz, `minWidth` değişkeni bu koddan kalktı.
  - Kaynağın önerisinin altında kalan ve yalnız genişliği yetmeyen balık yeni sarı `spaceNarrow` uyarısını alır ("<tür>: akvaryum bu tür için dar"; değişkenler `spaceLimited`'inkiler ve `size`, `width`, `minWidth`). Bu tür için `spaceLimited` çıkmaz; tür başına yine tek alan uyarısı olur. Girilmemiş (0) genişlik denetlenmez; balık olmayan canlı bu uyarıyı almaz.
  - `SWISS_MIN_WIDTH_RATIO=2` yalnız sarı uyarıda kullanılır.
- **Uyarıların sırası:**
  - `filterMissing` ve `heaterMissing`, `primaryFilterRequired` ve `airPumpRequired`'ın ardında.
  - Ölçüm uyarıları nitrat uyarısından sonra, `temperatureConflict`'ten önce.
  - D5 uyarıları `temperatureConflict`'in ardında, `phConflict`'ten önce.
  - `spaceNarrow` alan döngüsünde.
- **Dil:**
  - Yeni tür adı listeleri (`above`, `below`, `coldwater`, `tropical`) katalog çevirisinden geçer (`SPECIES_NAME_LIST_PARAMS`, `src/lib/engine-text.ts`).
  - Motor metinlerinin biçimleyicisine sıcaklık yazımı eklendi (`EngineTextFormat.temperature(celsius, other?)` ve `temperatureNumber(celsius, other?)`): kullanıcının biriminde, °C en çok iki, °F en çok bir ondalık; aşılan sınırla aynı görünecek değer daha çok ondalıkla yazılır. Bitki uyarılarının biçimi örnek alındı. pH `measurement(değer, 2, sınır)` ile yazılır.
  - Türkçe metinler mevcut motor metinleri gibi "siz" diliyle.
  - Uyarı kodu 53'ten 60'a çıktı. Ölçüt kodu 38'den 39'a (−`communityCaution`, +`filterNotRecorded`, +`heaterNotRecorded`).
- **Sürüm:** motor 1.14.0. Kural seti 1.11.0: bir ceza sabiti kalktı (topluluk 30), yeni taban sabitleri geldi (60), 23 °C eşiği adlandırıldı, tavan kuralı ve kırmızı alan koşulu değişti. Sonuç nesnesinin biçimi değişmedi; uyarı seviyeleri yine `warning` ve `danger`.

Kaynaklar:

- Filtre: OATA, "How to look after guppies and mollies": "Whatever the size, a filter is always essential." (https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-tropical-freshwater-fish/how-to-look-after-guppies-and-mollies/, 2026-11-09'da okundu)
- Taban ısıtıcısı: karar 0011 → JBL, "Undergravel heating - not for heating the water!"
- İsviçre ölçü kuralı: karar 0012 → "Araştırma"

## Değerlendirilen alternatifler

- **Topluluk notu için ayrı "bilgi" seviyesi:** Sonuç biçimini değiştirir; sağlık sayfasına üçüncü bir renk gerekir. Seçilmedi; bitki uyarıları emsaliyle sarı ve puansız kaldı.
- **Topluluk notu açıklamasının ölçütte kalması:** Puan 100 iken kart "dikkat gerektiriyor" derdi. Seçilmedi.
- **Tavanın veri güvenine de uygulanması:** Tek bir tanınmayan canlı bile genel durumu "dikkat"e çekerdi. Seçilmedi.
- **"Filtre yok" kırmızı ya da kesin tehlike:** Kırmızı olsa da genel puan 74 olurdu. Kesin tehlike B22'yi "uygun değil" yapardı, ama onaylanan bu değil. Sarı seçildi.
- **Tropikal eşiği 20 °C:** "Balık, soğuk su değil, alt sıcaklık ≥ 20 °C" tanımı B06, B14, B15 ve B22'nin hepsine uyuyordu. 20 °C'nin projede yazılı bir kaynağı yok; uydurma yasağı gereği seçilmedi.
- **Tür başına ayrı ölçüm uyarısı** (bitki uyarıları gibi): Kalabalık akvaryumda çok uyarı çıkarırdı. Parametre başına tek uyarı seçildi.
- **Yalnız genişlikten sarı için mevcut "alan sınırda" uyarısı:** Kullanıcı sorunun genişlik olduğunu göremezdi. Yeni kod seçildi.

## Doğrulama

- Yeni stub test dosyası `packages/compatibility-engine/test/warnings-1-14.test.ts` (27 test; sonuncusu kontrolcü tarafından eklenen ortak biçimleme kontrolleri):
  - tavan kuralı (tehlike uyarısı olmadan tehlikedeki filtre ve su ölçütü 74; veri güveni tavan koymaz; canlısız akvaryumda filtre ve ısıtıcı ölçütü tavan koymaz, canlı eklenince koyar; kesin tehlike 49);
  - topluluk notunun cezasız ve açıklamasız olması;
  - alan ve sosyal tabanı (tek türde 60, oran 60'ın üstündeyse oran, kırmızıda 35'in altı);
  - ölçülen sıcaklık ve pH (üstünde, altında, iki yön ve ortak aralığın yokluğu, tek nokta, sınırlar içeride, geçersiz ve eksik ölçüm, pH aralığı olmayan deniz canlısı, tanınmayan canlı, su ölçütünün değişmemesi);
  - soğuk su ve tek nokta (ortak aralık, soğuk su önceliği, kesişme yok, 23 °C sınırı, soğuk su türü ve balık olmayan tropikal canlı, tek tür ve aynı türün iki kaydı);
  - filtre ve ısıtıcı yokluğu (canlısız akvaryum, katalog dışı, doğrulanmamış, yalnız skimmer, yalnız pasif parça, taban kablosu, ısıtıcılı filtre, katalog dışı ve doğrulanmamış ısıtıcı; ısıtıcı ölçütünün aynı tanımı).
- `space.test.ts`: yalnız genişlik yetmeyen balık sarı `spaceNarrow` (tam metin ve değişkenler), sınırda tam 2 × "alan sınırda", genişlik ve derinlik birlikte yetmezse tek kırmızı uyarı, balık olmayan canlı; kırmızı mesaj genişliği saymıyor.
- `behavior.test.ts`: davranış tabanı vakası yeni ölçütlerle yeniden kuruldu (alan ve grup 60'a çıktığı için iki tanınmayan canlı kaydıyla veri güveni 1/3); beklentiler aynı kaldı: tek başına 53, çiftin ortalaması 49, taban 50. Test zayıflatılmadı; ölçütlerin tamamı ayrıca sınanıyor.
- `heater.test.ts`: yalnız taban kablosu ısıtıcısızla aynı puan ve durum (35, tehlike); açıklama kayıt varken "Katalogdan ısıtıcı bulunamadı", hiç kayıt yokken "Isıtıcı kayıtlı değil". `filter-load.test.ts` değişmeden geçti.
- `src/lib/__tests__/engine-text.test.ts`: 60 uyarı ve 39 ölçüt kodu; yeni kodların metni motorun Türkçesiyle aynı; her kodun biçimleyici yöntem tablosu (sıcaklık dahil); 8 yeni stub senaryo (ölçüm uyarısının üç yönü, ortak aralığın yokluğu, tek nokta; soğuk su aralık ve tek nokta; taban kablosu; uzunluğu olan ve olmayan genişlik uyarısı); °F yazımı ve yuvarlamanın aşılan sınırı gizlememesi.
- `scripts/test-health.cjs`: 113 senaryo (sayı değişmedi). Yeni kurala göre güncellenen 11 blok: taban kablosu (açıklama); Çin yosun yiyici + inci gurami (tür uyumu 70, "aynı tür kavgası"); Green Terror + neon (tür uyumu 100); cüce zincir loach, Red Head Tapajos, Moorii Tropheus, Bala Shark (sosyal 60, dikkat); Bala Shark, Winemiller toprak yiyen ciklet, Threadfin acara, iki Japon balığı, Makrakanta (varsayılan 35 cm genişlikte yalnız genişlik yetmiyor: sarı "akvaryum bu tür için dar", kaynağın hacmi ve uzunluğu mesajda). Beklentiler yeni kuralın ürettiği somut değerlerdir.
- Altın fikstür: kod değişikliğinden sonra ayrı commit'te yeniden üretildi (`41f987f`); adım adım dökümün sonuncusuyla bayt bayt aynı. Her adımdan sonra altın vakalar depo dışına döküldü ve fark o adıma atandı (1077 vaka):
  - D3 + D7: 471 vaka değişti, durum değişmedi; alan ölçütü 404 vakada, sosyal ölçüt 282 vakada tehlikeden uyarıya; 62 `spaceSevere` → `spaceNarrow`.
  - D2: 54 vaka; 8'i dikkat → uygun; tür uyumu açıklaması 22 vakada değişti.
  - D1: 505 vaka uygun → dikkat. 443 tür "sığar" vakası, 35 tür çifti ve 20 ısıtıcı vakası filtresiz (filtre ölçütü 35; 6 ısıtıcı vakasında ısıtıcı da güçlü, 45). 7 filtre vakasında filtre ölçütü güçlü akış yüzünden tehlikede (0–41; ikisinde ısıtıcılı filtrenin ısıtıcısı da güçlü). Boş akvaryum değişmedi.
  - D4: 444 vaka; 444 sıcaklık ve 412 pH uyarısı ("dar" vakalarının ölçümü bilerek aralık dışı; örnek akvaryum 25,4 °C).
  - D5: 7 tür çifti; 6 tek nokta, 1 soğuk su (koi ile Kner'in sarı kuyruklu prochilodusu, ortak sıcaklık yalnız 24 °C).
  - D6: 1075 vaka; 1005 filtre ve 440 ısıtıcı uyarısı, açıklama kodları; hiçbir puan değişmedi.
  - Örnek akvaryum (24,5 °C): yalnız örnek vaka; sıcaklık uyarısı kalktı, su ölçütü 86 → 100.
  - Toplam: 1077 vakanın hepsi değişti; 497 vakanın genel durumu uygun → dikkat; 903 vakanın puanı değişti (497 azalan, 406 artan). Açıklanamayan fark yok.
- Veri testi B senaryoları yeni motorla yeniden koşuldu (30 senaryo): B12 74 dikkat → 93 uygun (sarı "dar"), B25 85 → 90 uygun (alan 20 → 60), B20 90 uygun → 74 dikkat, B22 86 uygun → 74 dikkat (filtre ve 19 °C uyarısı; ısıtıcı uyarısı yok), B28'e pH uyarısı; B03, B04, B05, B07 uygun kaldı (tür uyumu 70 → 100); B02, B14, B16, B17, B18 uygun kaldı; B14 yeni uyarı almadı; B15, B19, B21 74 dikkatte, B11, B13, B26 49 tehlikede kaldı.

## Kontrol

Codex 2026-11-11'de değişikliği kontrol etti. D1–D7'de uygulama hatası, testlerde de beklenti gevşetmesi bulmadı. Bir gösterim hatasını düzeltti: ölçüm aşılan sınıra çok yakınken ikisi aynı sayıya yuvarlanabiliyordu (24,39 °C ile 24,4 °C sınırı ikisi de 75,9 °F). Artık ölçüm ile karşılaştırılan sınır üç dilde birlikte biçimlenir (sıcaklık, pH ve soğuk su aralığı); sözcükler, eşikler ve puanlar değişmedi. Bu sınır `test/warning-format-checks.ts` içinde TR/EN/ES için 18 örnekle sınanır; kontrolü hem `warnings-1-14.test.ts` hem `scripts/test-health.cjs` çalıştırır. Codex ayrıca iki belge tutarsızlığını düzeltti (canlısız akvaryum istisnası yalnız filtre ve ısıtıcı ölçütünde; pasif ısıtıcının açıklaması). Codex'in ortamında Vitest başlamadığı için testler son kapıda koşuldu: altın test hariç motor testleri 164/164 geçti; altın test ve `engine-text.test.ts`'in fikstüre bağlı 4 testi fikstür yeniden üretilene kadar beklendiği gibi kırmızıydı. Fikstür yeniden üretildikten sonra (`41f987f`) `pnpm verify` tamamen yeşil: 58 Vitest dosyasında 732 test, 113 sağlık senaryosu, tip denetimi ve üretim derlemesi.

## Sonuçlar

- **Kayıtlı akvaryumlar:** Analiz sonucu ve sürüm hiçbir yerde saklanmıyor: tarayıcı deposunun anahtarlarında (`STORAGE_KEYS`, `packages/domain/src/local-storage.ts`) ve yedekte puan ya da motor sürümü yok; `ENGINE_VERSION` yalnız motor paketinde kullanılıyor. Puan her açılışta yeniden hesaplanıyor. Taşıma gerekmez; yayından sonra her akvaryum yeni kuralla hesaplanır. Kullanıcı verisi ve depolama biçimi değişmez.
- **Filtresi kayıtlı olmayan akvaryum:** Canlısı olan ve filtresi kayıtlı olmayan her akvaryum "Filtre kayıtlı değil" uyarısını alır ve genel durumu en fazla "dikkat" olur. Uyarı, filtresi olup kaydetmeyen kullanıcıya ekipman sayfasını gösterir. Tropikal canlısı olup ısıtıcısı kayıtlı olmayan akvaryum da (ısıtıcı ölçütü 35) "dikkat" olur.
- **Daha çok sarı uyarı:** Ölçülen değer, soğuk su ve tek nokta uyarıları sarı ve cezasızdır. Tek noktada kesişme sık görülür: tatlı su tür çiftlerinin 5.227'sinde ortak aralığın genişliği 0.
- **Kalkan yanlış alarmlar:** B12'de kırmızı alan uyarısı sarı "akvaryum bu tür için dar" oldu. B25'te alan ölçütü 20 yerine 60. Topluluk notu tür uyumunu düşürmüyor.
- **Daha sert hükümler:** B20 ve B22 "dikkat" oldu; B22 "uygun değil" olmadı. Bunun için filtre yokluğunun kesin tehlike sayılması gerekirdi; onaylanan bu değil.
- **Değişmeyenler:**
  - B02, B16, B17 ve B18 yalnız sarı uyarıyla "uygun" kaldı. Sarı uyarılar genel durumu düşürmez; bu bulgu bu kararın kapsamında değil. Sonra değişti: karar 0040.
  - B15, B19 ve B21 "dikkat"te kaldı.
  - B14 yeni uyarı almadı. Lepistesin alt sıcaklığı 20 °C, yani 23 °C eşiğine göre tropikal sayılmıyor. Ortak aralık (20–25 °C) tek nokta değil ve 25 °C iki türün de aralığında.
  - B22'de ısıtıcı uyarısı çıkmadı: neonun alt sıcaklığı 21 °C.
- **Canlısı olmayan akvaryum:** Filtre ve ısıtıcı ölçütü tek başına genel duruma tavan koymaz. Bu istisna, mevcut tehlike uyarılarını veya su ölçütünü dışlamaz: örneğin canlısız akvaryumda yetersiz ısıtıcı uyarısı yine 74 tavanı koyabilir. Ana sayfa canlı ve ölçüm yoksa yine "veri yok" der.
- **Örnek akvaryum ("Amazon Nehri"; filtre kayıtlı, ısıtıcı yok):** Son ölçüm 24,5 °C, örnekteki canlıların hepsinin aralığında; yeni sıcaklık uyarısı çıkmaz. Örnekteki canlıların alt sıcaklığı 23 °C'nin altında (neon 21, cüce vatoz 21), ısıtıcı uyarısı da çıkmaz. Tür uyumu topluluk notunun cezası kalkınca 70'ten 100'e, su ölçütü 86'dan 100'e çıktı; genel puan 90'dan 95'e (uygun). Örnek kayıtlar depoya yazılmadığı için kullanıcı verisi etkilenmez.

## Açık işler

- **Kaynaklı tropikal tanımı.** 23 °C motorun mevcut ama kaynaksız eşiği.
  - Bilinen sınır: lepistes (20–28 °C) ve neon (21–25 °C) tropikal sayılmıyor; B14'te soğuk su uyarısı, B22'de ısıtıcı uyarısı çıkmıyor.
  - Bir araştırma yolu: OATA bakım sayfalarını "tropical freshwater" ve "coldwater" diye ayırıyor; örneğin lepistes ilkinde, Japon balığı ikincisinde. Araştırılmadı. Tanım değişirse ürün sahibi onayı ve yeni kural seti sürümü gerekir.
- **Soğuk su grubunun kapsamı.** `group:"coldwater"` yalnız 7 kayıtta: goldfish, white-cloud, medaka, dojo-loach, rainbow-shiner, koi-carp, axolotl. Serin su türü olup başka grupta duranlar bu kuralla yakalanmaz (ör. cennet balığı 10–22 °C, dark-edged splitfin 10–22 °C). Katalog verisi puan için değiştirilmez; gerekirse ayrı bir veri işi.
- **Sünger filtre kapasitesi.** Hava motorlu sünger filtre akvaryum hacminden bağımsız olarak "hazır" sayılıyor (veri testi: 300 L'de de hazır). Ayrı bir motor işi; kaynak ve ürün sahibi onayı gerekir.
- **Sarı uyarıların genel duruma etkisi** (B02, B14, B16, B17, B18) bu kararın kapsamında değil.
  - Sonra değişti (2026-11-12, motor 1.15.0, kural seti 1.12.0, `docs/DECISIONS/0040-canli-riski-uyarilari-genel-durumda.md`): canlı riski uyarısı (yenme ve yaralanma; alan, kalabalık ve grup; aralık dışı su değeri) canlı kaydı olan akvaryumda genel puanı en fazla 74 yapar; "küçük balık avlanabilir" tehlike seviyesine çıktı. B14, B16, B17, B18 ve B28 "dikkat" oldu; B02 "dikkat"te kaldı (beklenen "uygun değil").

## Geri alma

Kod ve belge değişikliği tek commit'tir (`fc4440c`), altın fikstür ayrı commit'tir (`41f987f`). Kod commit'i geri alındığında motor 1.13.0 davranışına döner; o durumda fikstür commit'i de geri alınmalıdır. Kullanıcı verisi ve depolama biçimi etkilenmez.
