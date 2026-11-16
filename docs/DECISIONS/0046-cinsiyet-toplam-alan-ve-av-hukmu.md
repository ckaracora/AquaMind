# 0046 — Cinsiyet, tanınmayan canlıda puan, toplam alan, av hükmü ve deniz canlılarının kaynaklı uyarıları

- Tarih: 2026-11-16
- Durum: Kabul edildi. Ürün sahibi (`buraksenfx`) 2026-11-16'da güven turu ölçümünün beş sorusunda önerilen seçeneği onayladı (cinsiyet dikkate alınsın; tanınmayan canlıda puan gösterilmesin; toplam alan sarı uyarısı; canlının yenmesi kırmızısı "Uygun değil", ekipman kırmızıları "Dikkat"; deniz canlılarında kaynağı açıkça yazan riskler kayda girsin). Toplama yöntemi, cinsiyetin sayılışı, alan adları (`groupFrom`, `preyIds`, `spaceTotal`, `conspecificSmallGroup`) ve ekran düzeni Claude'un teknik kararıdır. Motor 1.21.0, kural seti 1.18.0. Altın fikstür değişmez (1.138 vaka, bayt bayt aynı).

## Bağlam

Güven turu ölçümü (motor 1.20.0, 21 kurulum; ayrıca F, G, H senaryo turları) beş açık buldu:

| # | Açık | Örnek (1.20.0) |
|---|---|---|
| 1 | Motor cinsiyeti okumuyor | iki dişi beta "Dikkat 74" ve "erkekler kavga eder"; 1 erkek + 3 dişi sarı prenses "Dikkat 74" |
| 2 | Tanınmayan canlı varken puan görünüyor | elle "Balon moli" + lepistes: "Eksik değerlendirildi" rozeti ama halkada 95 |
| 3 | Türlerin alan ihtiyacı toplanmıyor | 90 L'de lepistes 6 + plati 6 + moli 4 + neon 10 (en az hacimler 60 + 80 + 81 + 54 L): "İyi 97" |
| 4 | Kırmızı av uyarısı, hüküm "Dikkat" | Japon balığı + neon, melek + neon: 74; karar 0044 D "bütün kırmızıları 'uygun değil' yapmak ayrı karar" |
| 5 | Deniz canlılarının riski yalnız kapalı notta | 3 sarı kuyruklu damsel "İyi 99"; iki keşiş yengeci türü + turbo salyangoz yalnız alan sarısından "Dikkat"; anemon + ateş gobisi |

## Karar

### 1. Cinsiyet

- "Erkekler kavga eder" (`conspecificAggression: "males"`) olası erkek sayısı iki ve üstüyse çıkar. Kayıt başına: "Hepsi dişi" 0, "Karışık (erkek ve dişi)" en çok adet − 1 (en az bir dişi var; tek bireylik "karışık" kayıt çelişkili olduğu için bilinmiyor gibi adet kadar sayılır, kontrol turu), "Hepsi erkek" adet kadar, "Bilinmiyor" ya da alan yok adet kadar (en kötü durum). Aynı türün kayıtları birlikte sayılır.
- Sonuç: iki dişi beta ya da karışık bir çift uyarısız ("İyi"); iki erkek, cinsiyeti girilmemiş iki beta, karışık üç beta, bir erkek ile bir bilinmeyen bugünkü gibi "Dikkat". 1 erkek + 3 dişi (iki kayıt) uyarısız.
- Kullanıcı iki ve üstü bireyi erkek diye girdiyse metin bunu söyler (`males` değişkeni): "... kayıtlı 2 bireyden 2 tanesi erkek olarak girildi. Erkekleri ayırın."; bilmiyorsa bugünkü metin.
- "Tek tutulmalı" (`all`) türlerde cinsiyet okunmaz: kaynak her bireye saldırganlık yazıyor.
- Hangi türün erkeklerinin kavga ettiği var olan davranış kayıtlarından gelir; yeni tür verisi yok.
- Ekran: cinsiyet alanı canlı kaydında zaten vardı (`Livestock.gender`, isteğe bağlı). Ekleme ve düzenleme penceresi aynı bileşeni kullanır (`src/components/gender-select.tsx`): varsayılan "Bilinmiyor", seçenekler kaydın bütün bireylerini anlatır ("Hepsi erkek", "Hepsi dişi", "Karışık (erkek ve dişi)"), altındaki kısa not neden sorulduğunu ve harem için iki kayıt eklenebileceğini söyler.
- Eski kayıtlar: alan yoksa "Bilinmiyor" sayılır; yedek ve geri yükleme biçimi değişmez (alan şemada zaten isteğe bağlı).

### 2. Tanınmayan canlıda puan

- Motor değişmez: puanı ve durumu hesaplar, `incomplete: true` ve `unevaluated` listesini verir (karar 0043). Seçme penceresi ve "ne uyar" karşılaştırmaları puansız çalışır.
- Ekran: sağlık sayfasında `incomplete` varken halka boş kalır, sayı yerine "Puan yok" yazar; altında "Puan gösterilmiyor; şu canlılar hesaba katılamadı: Balon moli." "İyi" olacakken rozet "Eksik değerlendirildi" (0043), "Dikkat" ve "Uygun değil" rozeti kalır (bulunan risk gizlenmez). Ana sayfanın özet cümlesinin arkasına "Hesaba katılmayan canlılar: Balon moli." eklenir. "Bu akvaryuma ne uyar?" penceresi "Katalogda tanınmayan ya da doğrulanmamış canlılar hesaba katılmadı: Balon moli." der. Adlar `uncountedAnimalNames` (`src/lib/health-warning-groups.ts`) ile kurulur: tanınmayanda kullanıcının yazdığı ad, doğrulanmamışta katalog adı (seçili dile çevrilir).

### 3. Toplam alan

- Kaynak araştırması: `docs/DATA_SOURCES.md` ve kabul edilen kaynaklarda birden çok türün hacmini birleştiren bir yerleştirme kuralı yok. Kaynakların en az hacmi (çoğu Seriously Fish'te taban ölçüsü) türün kendi başına tutulduğu akvaryumu tarif eder; paylaşılan payı (su, dekor, açık alan) ölçen bir kaynak yok. Bu yüzden yöntem teknik karardır ve ölçümle seçildi.
- Yöntem: türlerin (karides ve salyangoz hariç) kayıtlı adetleri için gereken en az hacimlerinin (en az hacim + (adet − 1) × birey başına ek hacim, bugünkü tür tür kural) toplamı net hacmin iki katını (`SPACE_TOTAL_RATIO = 2`) aşarsa sarı `spaceTotal` uyarısı, canlı riski sınıfında (en çok "Dikkat"). En az iki sayılan tür gerekir. Uyarı yalnız her tür tek başına sığarken çıkar; bir tür tek başına sığmıyorsa onun kendi alan uyarısı çıkar (tek uyarı ilkesi, karar 0043). Yüzme alanı ölçütü 60 ("Türlerin toplam alan ihtiyacı akvaryum için fazla").
- Karides ve salyangoz neden hariç: yüzme alanı değil yüzey ve dip kullanırlar; OATA'nın küçük karides ve salyangoz grubu için tabanı 10–20 L'dir, balık akvaryumunda ayrı bir alan istemez. Kerevit, yengeç, kurbağa ve anemon ("other") sayılır.
- Neden iki kat (ölçüm, F + G + H + güven turu kurulumları, 57 çok türlü kurulum, ürün sahibinin örnekleri dahil; 11'i bugün "iyi"):

| Yöntem | "İyi" kurulumlardan alarm | Bütün çok türlüden alarm |
|---|---|---|
| Düz toplam > net hacim | 8 / 11 (ocellaris + anemon + karides 150 L, ramirezi + kardinal 100 L, kiraz + amano 20 L, ...) | 51 / 57 |
| Omurgasız hariç, > net hacim | 7 / 11 | 40 / 57 |
| Düz toplam > 1,5 kat | 3 / 11 (kiraz + amano 20 L dahil) | 19 / 57 |
| Omurgasız hariç, > 1,5 kat | 2 / 11 | 13 / 57 |
| Düz toplam > 2 kat | 2 / 11, ama 60 L neon + oto + kiraz + amano (2,17 kat) alarm alır | 6 / 57 |
| **Omurgasız hariç, > 2 kat (seçilen)** | **2 / 11**: hedef örnek (90 L dört tür, 3,06 kat) ve G01 (60 L lepistes 6 + neon 10 + panda 6, 2,58 kat; senaryo "uygun ya da hafif dikkat" kabul ediyor) | 5 / 57 |

  Seçilen yöntem iki türlü bir kurulumda hiçbir zaman alarm vermez (iki tür tek tek sığıyorsa toplamları iki katı aşamaz); uyarı yalnız çok türün üst üste bindiği yerde çıkar. Ürün sahibinin iki örneği tutar: 60 L'de 10 neon, oto ve karidesler (balıklar 95 L, 1,58 kat) uyarısız; 90 L'deki dört tür (275 L) "Dikkat".
- Metin: "Kaynaklara göre Lepistes, Plati, Moli ve Neon tetra için kayıtlı adetlerle gereken en az hacimlerin toplamı 275 L; akvaryumun net hacmi 90 L, bu toplamın yarısından da az. Her tür tek başına sığsa da birlikte kalabalık olur. Tür ya da birey sayısını azaltmayı ya da daha büyük bir akvaryumu düşünün."

### 4. Canlının yenmesi kırmızısı

- Av boyu kuralı (%40, `PREY_SIZE_RATIO`) için kabul edilen kaynaklarda (Seriously Fish, Practical Fishkeeping, OATA, Fishkeeper, Fishipedia) dayanak arandı (2026-11-16, web araması ve 0040'taki araştırma): sayısal oran yok; kaynaklar "ağzına sığan" der. Kabul edilmeyen bir kaynak (Reef Builders, "How big is bite sized in marine aquarium fish", 2014) sabit bir oranın türden türe ağız açıklığı farklı olduğu için tutmadığını yazıyor. Dayanak bulunamadı.
- Bu yüzden ürün sahibinin yedek kuralı uygulandı:
  - Yalnız %40 boy oranına dayanan av uyarısı (`smallFishPredation`) kırmızı kalır, hüküm "Dikkat" (74). Örnek: Japon balığı + neon, melek + neon.
  - Avın yenebileceği kaynakta açıkça yazıyorsa uyarı kesin tehlikedir ("Uygun değil", en çok 49): kaynak avı adıyla sayıyorsa (yeni `preyIds`; av yalnız o türlerdir, boy oranına bakılmaz) ya da sayısal av boyu veriyorsa (`maxPreyCm`, bugün yalnız threadfin acara). Metin bunu söyler (`explicit: "named"` / `"size"`): "Kaynak, Ateş gobisi türünü Balon uçlu anemon tarafından yenebilecek balıklar arasında adıyla sayıyor. Bu iki türü aynı akvaryumda tutmayın."
  - Asıl avcı (`predatory`, kaynaklı işaret) bugünkü gibi "Uygun değil". "Tek tutulmalı", farklı palyaço türleri ve tür akvaryumu zaten kesin tehlikeydi.
  - Ekipman kırmızıları (küçük filtre, küçük ısıtıcı) "Dikkat" kalır: cihaz değiştirilebilir.
- Karar 0044 D'deki "Bütün kırmızıları 'uygun değil' yapmak ayrı bir karar olur" notu bu kararla kapandı.

### 5. Deniz canlılarında notta kalan riskler

- 11 deniz canlısının Fishkeeper sayfası 2026-11-16'da açıldı; kaynağı riski açıkça yazan 9 türe 11 kayıt eklendi (`src/data/species-behavior.ts`; alıntılar `evidence` içinde):
  - Sarı kuyruklu ve gök mavisi damsel: "tek, bilinen erkek-dişi çift ya da 9+ tek sayılı grup; küçük gruplarda ölüm sık" → "tek tutulmalı" kaydı, `pairAccepted`, yeni `groupFrom: 9`. Mavi neon gobi: "kendi türüyle kavga eder; küçük akvaryumda tek ya da bilinen çift, geniş akvaryumda 7+" → aynı, `groupFrom: 7`.
  - Mavi ve kırmızı bacaklı keşiş yengeci: "salyangozlar risk altında" → `eatsSnails`; "birbiriyle asla birlikte tutulmamalı, kavga ederler" → yeni grup `incompatibleGroup: hermitCrab` (kesin tehlike).
  - Balon uçlu anemon: "ateş gobisi, mandarin gibi sakin balıklar gece yakalanıp yenebilir" → `eatsSmallFish`, `preyIds: ["firefish"]` (mandarin katalogda yok; palyaço av sayılmaz).
  - Zümrüt yengeç: "çok küçük balıklarla güvenilmez" → `eatsSmallFish` (yalnız %40; en çok "Dikkat").
  - Kraliyet gramması ("başka grammalar ve dottybacklerle tutulmamalı") ve orkide dottyback ("aynı cins ya da yakın akrabalarla tutmayın") → yeni grup `incompatibleGroup: grammaDottyback`.
- Kaynağın kabul ettiği büyük grubun motordaki karşılığı (`groupFrom`): bu sayı ve üstü uyarısız; tam iki birey `pairAccepted` ile sarı `conspecificPair`; arası (ör. 3 damsel) yeni sarı `conspecificSmallGroup` "küçük grupta kavga eder", canlı riski sınıfında, ceza 30 (en çok "Dikkat"). Ürün sahibinin hedefi "3 damsel Dikkat" böyle tuttu. Not: Fishkeeper küçük damsel gruplarında ölüm yazıyor; 4. karar "öldürülme" kırmızısını "Uygun değil" yapar, ama ürün sahibinin bu türdeki açık hedefi "Dikkat"tir ve sayıya bağlı grup kuralı "kesin" değildir. Ayrı karar gerekirse tek satır.
- Eklenmeyenler (kaynak açıkça yazmıyor ya da motor ifade edemiyor): sarı tang (küçük akvaryumda saldırganlık, kaç bireyin kavga ettiği açık değil), ateş gobisi (kendi türüyle kavga açıkça yazılmıyor), damsellerin ve dottyback'in sakin balıkları taciz etmesi (yönlü zorbalık; motorda karşılığı yok), kurban tarafındaki karides ve salyangozlar. Liste ve alıntılar güven turu çalışma dosyasında (`deniz-kanit.md`).

### Sürüm

- **Motor 1.21.0.** Puanı, hükmü ve uyarıları değiştiriyor.
- **Kural seti 1.18.0.** Yeni sabit (`SPACE_TOTAL_RATIO`), iki yeni uyarı kodu (66), bir ölçüt açıklaması (41), kesin tehlike koşulu (açık kaynaklı av), uyarı koşulu (cinsiyet, büyük grup), iki yeni grup adı. Canlı riski sınıfı 26 kod. Sonuç nesnesinin biçimi değişmez.

## Üç dilde yeni metinler

| Yer | Türkçe | İngilizce (ABD) | İspanyolca (Latin Amerika) |
|---|---|---|---|
| Cinsiyet seçenekleri | Bilinmiyor · Karışık (erkek ve dişi) · Hepsi erkek · Hepsi dişi | Unknown · Mixed (males and females) · All male · All female | Desconocido · Mixto (machos y hembras) · Todos machos · Todas hembras |
| Puan yok | Puan yok | No score | Sin puntuación |
| Toplam alan başlığı | Türlerin toplam alan ihtiyacı yüksek | Combined space needs are high | Necesidad de espacio total elevada |
| Küçük grup başlığı | X: küçük grupta kavga eder | X: fights in small groups | X: pelea en grupos pequeños |

Tam metinler: `packages/localization/src/messages/{tr,en,es}-engine.ts` (`spaceTotal`, `conspecificSmallGroup`, `smallFishPredation`, `conspecificMales`) ve `{tr,en,es}.ts` (`livestock.form.genders`, `genderHelp`, `health.noScore`, `health.uncountedAnimals`, `dashboard.uncounted`, `livestock.fit.uncounted`). Yeni davranış koşulları `packages/localization/translations/{en,es}-species.json`.

## Sonuçlar

- Senaryo turları (1.20.0 → 1.21.0): F 28 kurulumda değişen yok; G 20'de G01 "iyi 97" → "dikkat 74" (toplam alan, senaryonun kabul ettiği sonuç), sayım 19/1/0/0 değişmedi; H 16/16 değişmedi. Güven turu kurulumları: 90 L dört tür 97 → 74, 3 damsel 99 → 74, keşiş yengeçleri + turbo 74 → 49, anemon + ateş gobisi 74 → 49, 1 erkek + 3 dişi sarı prenses 74 → 98. Yersiz alarm 0 (ürün sahibinin örneği dahil "iyi" kurulumların hiçbiri yeni uyarı almadı; G01 senaryo kabulü içinde).
- Altın fikstür: 1.138 vakanın hiçbiri değişmedi (yeniden üretim bayt bayt aynı). Toplam alan uyarısının ilk biçimi (bir tür tek başına sığmazken de çıkan) 14 vakaya, hepsi zaten "uygun değil" olan ikililere, ikinci bir alan uyarısı ekliyordu; "her tür tek başına sığarken" koşulu bunu kaldırdı. Cinsiyet, av ve grup kuralları fikstürde geçmiyor; stub ve gerçek katalog testleriyle sınanır.

## Doğrulama

- Yeni: `packages/compatibility-engine/test/warnings-1-21.test.ts` (beş karar, olumlu ve olumsuz), `src/lib/__tests__/trust-1-21.test.ts` (cinsiyet seçimi, puansız eksik değerlendirme: sağlık sayfası, ana sayfa, "ne uyar").
- Güncellenen: `engine-text.test.ts` (66 uyarı ve 41 ölçüt kodu, altı stub senaryo, yöntem tablosu), `warnings-1-15.test.ts` (sınıf 26 kod), `warnings-1-20.test.ts` (sürüm "en az"), `species-behavior.test.ts` (yeni gruplar, büyük grup ve adıyla sayılan av), `engine-identity-checks.ts` (büyük grup), `selection-warnings.test.ts` (dişi aday uyarısız), `health-unevaluated.test.ts`, `scripts/test-health.cjs` (125 senaryo).

## Açık işler

- Damsellerin ve dottyback'in sakin balıkları taciz etmesi, sarı tangın küçük akvaryumdaki saldırganlığı: motorda karşılığı yok (yönlü zorbalık, akvaryum boyuna bağlı saldırganlık).
- Yunus ciklet (tatlı su) "küçük balıkları yiyebilir" notu yalnız `peaceful` kayıtlı; kaynak sayfası yeniden okunmalı.
- `spaceTotal` oranı (2) tek sabit; ölçülen başka bir oran istenirse değiştirilir.

## Geri alma

Kod, metin, veri ve belge tek commit; altın fikstür değişmediği için ayrı fikstür commit'i yok. Commit geri alınınca motor 1.20.0 davranışına döner. Kullanıcı verisi ve depolama biçimi etkilenmez; `gender` alanı zaten vardı, analiz her açılışta yeniden hesaplanır.
