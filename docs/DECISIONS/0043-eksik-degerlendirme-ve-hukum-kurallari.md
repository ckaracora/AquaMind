# 0043 — Hüküm kuralları ve "Eksik değerlendirildi"

- Tarih: 2026-11-14
- Durum: Kabul edildi. Ürün sahibi (`buraksenfx`) 2026-11-14'te beş kuralı onayladı: "tamam başla". Eksik değerlendirmeye ek şartı: "Neyi eksik değerlendirdiğini de söylesin. Güzel bir yazıyla, bilgi şeklinde, net, öz." Sonuç nesnesindeki biçim (`incomplete` bayrağı ve `unevaluated` listesi), yarı hacim kuralının her kategoriye uygulanması, ekranın kayıt uyarılarını tekrar etmemesi ve davranış bilgisinin "biliniyor" tanımı Claude'un teknik kararıdır. Motor 1.18.0, kural seti 1.15.0. Altın fikstür son kapıda yeniden üretilir.

## Bağlam

Lider 28 zor kurulumu motor 1.17.0 ile denedi (`S\degerlendirme-2\senaryo-f.cjs`). Dört desen çıktı:

| Desen | Örnek | Motor (1.17.0) | Beklenen |
|---|---|---|---|
| Tek tutulması gereken tür ve kavgacı erkekler | F09 iki beta, 40 L; F13 iki kırmızı kuyruklu köpekbalığı, 250 L | ikisi de 95 "iyi" | F09 "dikkat", F13 "uygun değil" |
| Hacmin çok altı | 54 L'de melek (200 L ister); F14 60 L'de iki Japon balığı; F17 100 L'de makrakanta | sarı "alan sınırda" ya da kırmızı uyarıyla en çok 74 "dikkat" | "uygun değil" |
| Tanınmayan canlı | F27 elle "Balon moli" 4 adet + lepistes | 95 "iyi" | "iyi" denmesin; neyin değerlendirilmediği yazsın |
| Davranış bilgisi olmayan tür | F28 amano karides; F08 boru ve nerit salyangozu | sessizce "uyumlu" | bilinmediği söylensin |

Melek balığı 54 L'de neden yalnız sarıydı: kırmızı basamak (karar 0012, 0037) yalnız İsviçre ölçü kuralına bakıyordu (uzunluk 3×, su derinliği 1× yetişkin boy). 15 cm'lik melek için 45 cm uzunluk ve 15 cm derinlik yetiyor; 60 × 30 × 30 cm'lik akvaryum bunu karşılıyor. Hacmin gerekenin dörtte biri olması hiçbir basamağı yükseltmiyordu. 60 L'de iki Japon balığında İsviçre kuralı kırmızı veriyordu ama bu kırmızı kesin tehlike değildi (en çok 74 "dikkat").

## Karar

### 1. Aynı tür saldırganlığı

- Kaynağa göre tek tutulması gereken türden (`conspecificAggression: "all"`) iki ve üstü birey: `conspecificAll` uyarısı kırmızı ve kesin tehlike; hüküm "uygun değil" (genel puan en çok 49). Tür uyumu cezası 60 (tür akvaryumuyla aynı; yeni sayı değil). Aynı tür farklı kayıtlarda eklenmişse birlikte sayılır.
- Karar 0040'ın düzeltmesi korunur: kaynağın çift ya da grup önerdiği türde (`minGroup ≥ 2`) kayıtlı adet bu sayıyı aşmıyorsa uyarı yok. Fazlası "uygun değil".
- Erkekleri kavga eden tür (`"males"`) iki ve üstü birey: `conspecificMales` sarı kalır, metni değişmez; canlı riski sınıfına girer (`LIVESTOCK_RISK_WARNING_CODES`), hüküm en çok "dikkat" (74). Ceza 30, değişmedi.
- Uyarı metinleri değişmedi. "Tek tutulmalı" metni kaynağın sözünü ("genellikle tek tutulmalıdır") korur; yalnız rengi kırmızı oldu.

### 2. Ağır alan yetersizliği

- Akvaryumun net hacmi, türün kayıtlı adet için gereken en az hacminin yarısından küçükse (`SEVERE_VOLUME_RATIO = 0,5`): yeni `spaceTooSmall` uyarısı, kırmızı, kesin tehlike; hüküm "uygun değil". Tam yarısı sarıdır ("alan sınırda").
- Gereken hacim bugünkü gibidir: en az hacim + (adet − 1) × birey başına ek hacim.
- Her kategoride geçerlidir (kerevit, karides, salyangoz da). İsviçre ölçü kuralı yalnız balıkta kalır.
- Aynı tür için bu uyarı İsviçre ve genişlik uyarısının yerine çıkar (tek uyarı). Yüzme alanı ölçütü "akvaryum çok küçük" açıklamasıyla en çok 35.
- Metin akvaryumun ve türün istediği hacmi birlikte söyler; kaynak tank uzunluğu yayımlıyorsa ve akvaryum daha kısaysa uzunluğu da:
  - "Kaynağa göre Melek balığı için kayıtlı 1 bireyle en az 200 L gerekir; akvaryumun net hacmi 54 L, gerekenin yarısından da az. Kaynak en az 100 cm uzunluk da istiyor; akvaryumun uzunluğu 60 cm. Bu tür bu akvaryumda tutulmamalı."
- Yarı oranı kaynaklı bir eşik değildir; ürün sahibinin kararıdır.

### 3. Eksik değerlendirme

- Sonuç nesnesine iki isteğe bağlı alan eklendi; durum (`status`) ve puan değişmez:
  - `incomplete: true`: katalogda tanınmayan ya da kaydı doğrulanmamış canlı var.
  - `unevaluated`: değerlendirilemeyenlerin listesi, kod ve değişkenle (`{ code, params }`). Boşsa alan yok.
- Kodlar:

| Kod | Ne zaman | Değişkenler |
|---|---|---|
| `unknownAnimal` | canlı katalogda tanınmadı (kayıt başına) | `name` (kullanıcının yazdığı ad), `count` |
| `unverifiedAnimal` | canlının katalog kaydı doğrulanmadı | `name`, `count` |
| `behaviorUnknown` | kaynaklar türün başka canlılarla uyumunu yazmıyor (aşağıda 4) | `name` |
| `unknownEquipment` | filtre, ısıtıcı (ya da hava motoruyla çalışan filtre varken hava motoru) katalogda yok ve elle değer girilmemiş | `name` (marka ve model; yoksa boş), `category` |
| `equipmentNoCapacity` | cihaz tanındı ama hesap için gereken kapasite bilgisi yok ya da doğrulanmadı | `name`, `category`, `note` (kaynağın kapasite notu) |
| `noReading` | canlı var, su ölçümü yok | — |

- Neden `status` değil bayrak: durum alanı ana sayfa, akvaryum seçimi, seçme uyarıları ve altın fikstür gibi pek çok yerde okunuyor. Dördüncü bir değer ("incomplete") her okuyanı değiştirirdi ve "dikkat" ya da "uygun değil" hükmünü gizlerdi. Bayrak ve liste yalnız gerektiğinde bulunur; motorun öbür çıktısı ve altın fikstürün eski alanları aynen kalır.
- Ekran (sağlık sayfası):
  - Hükmün hemen altında sakin renkli (açık mavi) bir bilgi kartı. Başlık "Değerlendirilemeyenler", giriş "Bu sonuç aşağıdakileri kapsamıyor; puan yalnız bildiklerimize dayanıyor.", sonra tek cümlelik maddeler (önce canlılar, sonra cihazlar, en sonda su ölçümü).
  - Hüküm "iyi" iken `incomplete` varsa rozet "Eksik değerlendirildi" olur, puan halkası da aynı sakin renge döner. "Dikkat" ve "uygun değil" aynen kalır; kart yine görünür.
  - Risk listesi boşken "Belirgin bir risk görünmüyor" yerine "Değerlendirebildiğimiz kayıtlarda risk bulunmadı" yazar.
  - Kartın adlarıyla söylediği dört kayıt uyarısı (`unmatchedAnimals`, `unverifiedAnimals`, `unmatchedEquipment`, `missingCapacity`; `UNEVALUATED_RECORD_WARNING_CODES`) risk listesinde tekrar edilmez. Motor onları aynen üretir; ekranda yalnız yerleri değişir (`groupHealthWarnings` → `records`). `unverifiedEquipment` listede kalır: hesaba girmeyen türlerdeki doğrulanmamış cihazı da sayar, kart onu kapsamaz.
- Ana sayfa: durum cümlesi "iyi" olacakken `incomplete` varsa "Sağlık analizi eksik: bazı canlılar katalogda tanınmadı, sonuç onları kapsamıyor." (nötr renk). Akvaryum kartlarında durum gösterilmiyor; değişiklik gerekmedi.

### 4. Davranış bilgisi yok

- Davranışı "biliniyor" sayılan tür: açık kaynaklı (çelişkili olmayan) bir davranış kaydı, asıl avcı (`predatory`) ya da tür akvaryumu (`speciesOnly`) işareti ya da tank arkadaşı notu (`communityCaution`). Kaynağın "balık avcısı değil" kaydı (`notPiscivorous`) da biliniyor sayılır.
- Hiçbiri yoksa tür `behaviorUnknown` maddesiyle karta girer: "Kaynaklar Amano karides türünün başka canlılarla uyumunu yazmıyor." Uyarı değildir; hükmü ve puanı değiştirmez, sonucu "eksik" yapmaz.
- Madde yalnız akvaryumda en az iki tanınan tür varken çıkar (tek türde "başka canlılarla uyumu" sorusu yok).
- `src/data/species-behavior.ts`: `BehaviorFlag` tipine `"peaceful"` eklendi (kaynak türü açıkça barışçıl ya da topluluk akvaryumuna uygun sayıyor). Motor bu kayıt için uyarı üretmez; yalnız "biliniyor" sayar. Kayıtları veri ajanı ekleyecek.

### 5. Notta yazan riskler

- "Salyangoz yer" (`eatsSnails`) ve "karides yer" (`eatsShrimp`) kaydı artık her kategoriden canlıda uyarır (ör. katil salyangoz, kerevit); canlı kendi türünü av saymaz. Tek başına katil salyangoz uyarı üretmez; boru salyangozu ve nerit varken uyarı yalnız onları adlarıyla sayar. Balıktaki sonuç değişmedi.
- Kerevit ve kurbağa gibi "other" kategorisindeki avcılar zaten doğru uyarıyordu: fırsatçı avcı (`eatsSmallFish`) küçük balıkta kırmızı `smallFishPredation` (1.15.0), asıl avcı (`predatory`) kesin tehlike `predation`. Testle güvenceye alındı.
- "Karides uyumu doğrulanmadı" ve yüzgeç ısırma bugünkü gibi yalnız balıkta.

### 6. Uygunluk göstergeleri (ekran)

- Çubuğun yanındaki çıplak yüzde ("85%") kaldırıldı; yerine ölçütün durumu yazar: "Uygun", "Sınırda", "Yetersiz" (EN "Suitable", "Borderline", "Insufficient"; ES "Adecuado", "Al límite", "Insuficiente"). "Tahmini yük oranı %154" ile yan yana iki zıt yüzde görünmez. Düzen ve çubuk aynı.
- "Veri güveni" açıklaması "2/2 güvenlik kaydı hesaplamaya hazır" yerine "Hesaba giren kayıtlar: 2/2". Motorun metni değişmedi (dil denetimi ve altın fikstür onu sınıyor); ekran bu cümleyi kendi dil dosyasından yazar.

### Sürüm

- **Motor 1.18.0.** Puanı, hükmü ve uyarıları değiştiriyor.
- **Kural seti 1.15.0.** Yeni oran sabiti (`SEVERE_VOLUME_RATIO`), uyarı seviyesi (`conspecificAll` kırmızı), kesin tehlike koşulu, ceza (tek tutulmalı 60) ve canlı riski sınıfı (21 kod) değişti. Sonuç nesnesine iki isteğe bağlı alan geldi.

## Üç dilde yeni metinler

| Yer | Türkçe | İngilizce (ABD) | İspanyolca (Latin Amerika) |
|---|---|---|---|
| Kart başlığı | Değerlendirilemeyenler | Not assessed | Sin evaluar |
| Kart girişi | Bu sonuç aşağıdakileri kapsamıyor; puan yalnız bildiklerimize dayanıyor. | This result doesn't cover the items below; the score is based only on what we know. | Este resultado no incluye lo siguiente; la puntuación se basa solo en lo que sabemos. |
| Rozet | Eksik değerlendirildi | Incomplete assessment | Evaluación incompleta |

Maddelerin ve uyarının tam metinleri: `packages/localization/src/messages/{tr,en,es}-engine.ts` (`unevaluated`, `spaceTooSmall`) ve `{tr,en,es}.ts` (`health`, `healthSummary`); örnekler `src/lib/__tests__/health-unevaluated.test.ts`.

## Etkilenen senaryolar

Liderin 28 kurulumu (aynı betik, `S\sprint\motor\`):

| Senaryo | 1.17.0 | 1.18.0 | Neden |
|---|---|---|---|
| F09 beta 2, 40 L | 95 iyi | 74 dikkat | 1: erkekler kavga eder |
| F13 kırmızı kuyruklu köpekbalığı 2 + rainbow shark | 95 iyi | 49 uygun değil | 1: tek tutulmalı |
| F14 Japon balığı 2, 60 L | 74 dikkat | 49 uygun değil | 2: yarı hacim |
| F16 common vatoz + lepistes, 100 L | 74 dikkat | 49 uygun değil | 2 |
| F17 makrakanta 1, 100 L | 74 dikkat | 49 uygun değil | 2 |
| F20 sarı tang 1, 150 L | 74 dikkat | 49 uygun değil | 2 |
| F27 "Balon moli" + lepistes | 95 iyi | 95, "Eksik değerlendirildi" | 3 |

Öbür 21 senaryonun hükmü ve puanı değişmedi; 7'sinde kart davranış bilgisi olmayan türleri listeler (ör. F28'de Amano karides, F08'de boru salyangozu ve nerit). F08'de katil salyangoz için "salyangoz yer" kaydı henüz yok; veri ajanı ekleyince uyarı çıkar (kural 5 hazır). Ayrıca 54 L'de melek: 1.17.0'da sarı "alan sınırda", 1.18.0'da 49 "uygun değil".

## Altın fikstür (1.132 vaka)

- Yeni alanlar (`unevaluated`, 663 vakada; çoğu "su ölçümü yok") hariç 15 vakanın çıktısı değişir; hepsi yeni `spaceTooSmall` uyarısı. Hükmü değişen 2 vaka ("dikkat" → "uygun değil"): `pair:giant-gourami+giant-sailfin-molly`, `pair:redhead-tapajos+redhook-myleus`. Öbür 13 vaka zaten "uygun değil".
- Vakalarda iki ve üstü "tek tutulmalı" ya da "erkekler kavga eder" türü yok; kural 1 fikstürü değiştirmez. `incomplete` hiçbir vakada yok.
- Son kapıda yeniden üretilir; ayrı commit.

## Doğrulama

- Yeni: `packages/compatibility-engine/test/warnings-1-18.test.ts` (beş kural, sınırlar ve eşitlikler), `src/lib/__tests__/health-unevaluated.test.ts` (üç dilde kart metinleri, çeviri, ekran, davranış kayıtları).
- Güncellenen: `warnings-1-15.test.ts` (sınıf 21 kod; "erkekler kavga eder" artık tavanlı; fazla "tek tutulmalı" türün uyum puanı 40), `warnings-1-17.test.ts` (sürüm "en az"), `space.test.ts` ve `behavior.test.ts` (yarı hacmin üstünde kalan örnek), `engine-text.test.ts` (kod sayısı 62, iki yeni senaryo, değerlendirilemeyenlerin değişkenleri), `water-status.test.ts` (ana sayfa cümlesi), `scripts/test-health.cjs` (maroon 80 → 120 L; piquiti metni iki hacmi söyler).

## Açık işler

- Veri ajanı: `peaceful` kayıtları ve notlarda yazan riskler için işaretler (ör. katil salyangoza `eatsSnails`). Kayıt eklendikçe kart kısalır.
- `spaceLimited` (sarı) metni bugün yalnız türün istediği hacmi söylüyor; akvaryumun hacmini de söylemesi istenirse üç dilde metin ve fikstür değişikliği.
- "Erkekler kavga eder" uyarısı kullanıcının girdiği cinsiyeti (`gender`) okumuyor; iki dişi beta da uyarı alır. Cinsiyete göre ayırmak ayrı karar.
- Yarı hacim kuralının oranı (0,5) ürün sahibinin kararıdır; değiştirmek tek sabit.

## Kontrol turu düzeltmeleri (2026-11-14)

Karşı firma kontrolü (Gemini, salt okuma) bulguları kodda doğrulandı. Beş kural ve puanlama değişmedi; düzeltmeler ekran ve `unevaluated` listesiyle sınırlı.

- Ekranın bir yeri "eksik" ya da "yetersiz" derken başka yeri "sorun yok" demez (`healthAdviceView`, `src/lib/health-warning-groups.ts`):
  - Kayıt uyarıları risk listesinden çıkınca, katalogda tanınmayan filtre yüzünden "dikkat" alan ya da su ölçümü olmayan akvaryumda yeşil "Belirgin bir risk görünmüyor" çıkıyordu. Yeşil kutu artık yalnız hüküm "iyi" ve değerlendirilemeyen hiçbir şey yokken çıkar. Öbür durumlar: tanınmayan ya da doğrulanmamış canlı → "Değerlendirebildiğimiz kayıtlarda risk bulunmadı"; başka bir eksik → aynı başlık, "Hesaba katılmayanlar yukarıdaki kartta yazıyor."; hüküm "dikkat" ya da "uygun değil" → "Ayrı bir uyarı yok · Sonucu yukarıdaki göstergeler belirliyor; Sınırda ya da Yetersiz olanlara bak."
  - Hiçbir canlı hesaba girmeyince (hepsi tanınmadı ya da doğrulanmadı) canlıya bağlı göstergeler (yük, alan, sosyal ihtiyaç, tür uyumu; ısıtıcı kayıtlı değilse ısıtıcı) yeşil "Uygun" yerine nötr "Değerlendirilemedi" ve "Hesaba giren canlı yok" yazar; çubuk boş kalır.
  - Canlısız akvaryumda "Değerlendirilemeyenler" kartı da görünür (giriş "Aşağıdaki kayıtlar hesaba katılmadı.", çünkü puan gösterilmez); "Bulgular ve Öneriler" kartı yalnız içinde bir şey varken çizilir.
  - "Eksik" metinleri doğrulanmamış canlıyı da söyler ("tanınmadı ya da kaydı doğrulanmadı").
- `unevaluated` listesi:
  - Hava motoru olmayan sünger filtre "kapasite bilgisi eksik" maddesine girmez; eksiği hava motorudur ve kırmızı `airPumpRequired` uyarısı bunu söyler.
  - Yalnız aynı tür saldırganlığı kaydı (`conspecificAggression`) olan tür "davranışı biliniyor" sayılmaz; o kayıt başka canlılarla uyumu anlatmaz.
  - Yalnız boşluktan oluşan marka ya da model "adı girilmemiş" sayılır.
- `spaceTooSmall` metni uzunluğu girilmemiş (0) akvaryumda "akvaryumun uzunluğu 0 cm" demez.
- Uygulanmayan öneriler: doğrulanmamış katalog cihazını "kapasite bilgisi eksik" maddesinden çıkarmak (tablodaki tanım "yok ya da doğrulanmadı"; çıkarsa hesaba girmeyen cihaz kartta görünmezdi); yarı hacim uyarısı varken İsviçre ölçü uyarısını da göstermek (bu kararın "tek uyarı" ilkesi).

## Geri alma

Kod, test ve belge tek commit; altın fikstür ayrı commit. Kod commit'i geri alınınca motor 1.17.0 davranışına döner. Kullanıcı verisi ve depolama biçimi etkilenmez; analiz her açılışta yeniden hesaplanır.
