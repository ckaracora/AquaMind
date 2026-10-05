# 0012 — Alan uyarısının şiddeti

- Tarih: 2026-10-03
- Durum: Kabul edildi — ürün sahibi (`buraksenfx`) 2026-10-03'te soru formuyla iki kararı açıkça onayladı (kırmızı uyarı için "kaynak + İsviçre" kuralı, genel durumun en fazla "dikkat" olması; ikisinde de önerilen seçenek). Codex denetimi iki turda tamamlandı (son tur 2026-10-03 temiz). Kod ve belgeler (`39af083`) ile altın fikstür (`6886a2a`) ayrı commit'ler olarak kaydedildi; PR #16 (`https://github.com/ckaracora/AquaMind/pull/16`) kullanıcı onayıyla 2026-10-03'te merge commit yöntemiyle `main` dalına birleştirildi (`18fdfeb`); `main` push'unda `Doğrulama` (`37143621266`) ve Vercel üretim dağıtımı başarılı, canlıda.

## Bağlam

2026-09-24 uyumluluk denetiminin son açık bulgusu buydu: alan uyarısının şiddeti hacim açığıyla artmıyordu. Akvaryum, türün kaynağının önerdiği en küçük ölçünün biraz altında da kalsa, çok altında da kalsa uygulama aynı sarı "alan sınırda" uyarısını veriyordu. Örneğin 60 L'deki astronot (kaynak 540 L ve 150 cm istiyor) ya da 1000 L'deki kaplan kürek burun (kaynak 10.368 L ve 360 cm istiyor) yalnızca sarı uyarı alıyordu.

## Araştırma

İki ayrı araştırma yapıldı; her sayfa açılıp okundu.

**Yasal ve resmî kaynaklar**
- **İsviçre Hayvan Koruma Yönetmeliği (TSchV, SR 455.1), Ek 2 Tablo 8, not b):** "Beckenlänge: mind. 3× Körperlänge grösster Fisch / Beckenbreite: mind. 2× Körperlänge grösster Fisch / Wassertiefe: mind. 1× Körperlänge grösster Fisch". Bütün süs balıkları için bağlayıcıdır (TSchV md. 10). Burada vücut boyu, baştan kuyruk yüzgecinin başladığı yere kadar ölçülür.
  - Yönetmelik: https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/2008/416/20260201/de/html/fedlex-data-admin-ch-eli-cc-2008-416-20260201-de-html-2.html
  - BLV Fachinformation 18.7, s. 4: https://www.blv.admin.ch/dam/de/sd-web/HrDv7Tc2nqfK/fachinformation-18.7-fischausstellung-de.pdf
- **Almanya, BMEL Gutachten (1998):** Türler için verilen ölçüler yetişkin balıkların en alt sınırıdır ve bu ölçülerin "belirgin biçimde altına inilmemelidir". Rapor bunun için bir sayı vermiyor. https://www.bmleh.de/DE/themen/tiere/tierschutz/haltung-zierfische.html
- **Avusturya, 2. Tierhaltungsverordnung Anlage 5:** Japon balığı ve koi gibi yalnızca soğuk su balıklarında uzunluk en az 10×, derinlik en az 3× kuralı var. Bütün türleri kapsamadığı için genel kural olarak kullanılmadı.
- **İngiltere, Defra lisans rehberi:** "Fish must be able to move freely and turn around". Sayı vermiyor.

**Hobi kaynakları ve araçları**
- Seriously Fish, Practical Fishkeeping ve Fishkeeper küçük akvaryumun bodurluğa, iç organ sorunlarına ve kısalan ömre yol açtığını yazıyor, ama açığın ne kadar kötü olduğunu derecelendiren bir ölçü vermiyor.
- Practical Fishkeeping'te Nathan Hill, ön camın en az balık boyunun 6 katı, aktif balıklarda 12 katı olmasını öneriyor; aynı yazıda bu konuda kesin kural olmadığını da söylüyor (https://www.practicalfishkeeping.co.uk/features/will-my-fish-grow-to-the-size-of-its-tank/). Dergideki ayrı bir yazıda Jay Hemdal'ın yüzme alanı oranları (en az / tercih edilen: 3,5/5, 5/7, 6/8) anlatılıyor; dergi bu yöntem için "We are not recommending that you adopt it" notunu düşüyor (https://www.practicalfishkeeping.co.uk/features/how-much-swimming-space-do-your-fish-need/). İkisi de en alt ölçü kuralıdır, açığın derecesini ölçmez.
- AqAdvisor yalnızca var/yok biçiminde bir boyut uyarısı veriyor.

**Sonuç:** İsviçre yönetmeliğinin ölçü sınırı, bütün süs balıklarını kapsayan ve yasal olarak bağlayıcı tek sayısal ölçü.

## Karar

1. **Sarı:** Akvaryum, türün kaynağının önerdiği en küçük ölçünün altındaysa (hacim ya da uzunluk) "<tür>: alan sınırda" uyarısı verilir. Bugünkü kural değişmedi.
2. **Kırmızı:** Akvaryum kaynağın önerisinin altındaysa ve ayrıca İsviçre yönetmeliğinin yetişkin boya göre ölçü sınırının da altındaysa "<tür>: akvaryum çok küçük" tehlike uyarısı verilir. Ölçü sınırı aşağıdakilerden herhangi biri karşılanmadığında aşılmış sayılır:
   - uzunluk en az 3 × yetişkin boy,
   - genişlik en az 2 × yetişkin boy,
   - akvaryum yüksekliği en az 1 × yetişkin boy (yönetmelik su derinliği ister; yükseklik su derinliğinden küçük olamayacağı için yükseklik kullanılır, bu da kuralı gevşek yönde tutar).
   Mesaj, kaynağın referansını ve yönetmelikten uyarlanan AquaMind ölçülerini birlikte söyler; ölçülerin yönetmeliğin kendisi değil, katalogdaki yetişkin boyla hesaplanan daha sıkı bir AquaMind uyarlaması olduğunu açıkça belirtir (Codex 1. tur bulgusu).
3. **Kaynağa uyan akvaryum hiçbir zaman alan uyarısı almaz.** Bazı uzun türlerde (ör. halat balığı, bichir) kaynağın önerdiği uzunluk yönetmeliğin 3× sınırından kısadır; böyle türlerde kaynağa uyan akvaryum kırmızıya dönmez.
4. **Yalnızca balıklar:** Yönetmelik süs balıklarını kapsar; karides, salyangoz ve diğer canlılar en fazla sarı uyarı alır. Girilmemiş (0) bir ölçü denetlenmez.
5. **Yüzme alanı ölçütü:** Kırmızı alan uyarısı varken ölçütün puanı en fazla 35 olur; filtre tehlikesindeki puanla aynı değer. Böylece ölçüt kartı da kırmızı görünür ve uyarıyla çelişmez.
6. **Genel durum:** Kırmızı alan uyarısı kesin tehlike değildir. Diğer tehlike uyarıları gibi genel puanı en fazla 74 yapar, yani genel durum en fazla "dikkat" olur. Uygulama balığın şu anki boyunu bilmez; yavru bir balık geçici olarak küçük akvaryumda tutulabilir ve zarar uzun vadelidir.

Eşikler `packages/compatibility-engine/src/index.ts` içindeki adlandırılmış sabitlerdedir: `SWISS_MIN_LENGTH_RATIO`, `SWISS_MIN_WIDTH_RATIO`, `SWISS_MIN_DEPTH_RATIO`, `SEVERE_SPACE_SCORE`. `ENGINE_VERSION` ve `RULESET_VERSION` 1.6.0'a yükseltildi. Sonuç nesnesinin biçimi değişmedi.

### Ölçü farkı

Yönetmelik standart boyu (kuyruk yüzgeci hariç) kullanır. Katalogdaki yetişkin boy ise çoğu türde toplam boydur; örneğin astronot için 45,7 cm. Bu yüzden kural yönetmelikten biraz daha katı uygulanır. Kural yalnızca kaynağın önerisinin zaten altında kalan akvaryumlarda devreye girdiği için bu fark kabul edildi. Uyarı mesajı da bunu kullanıcıya söyler.

## Değerlendirilen alternatifler

- **Hacim oranına göre kırmızı** (ör. gereken hacmin yarısının altı): Bu oranı destekleyen bir kaynak yok; sayı uydurulmuş olurdu. Ürün sahibi seçmedi.
- **Practical Fishkeeping'in 6×/12× kuralı ya da Hemdal oranları:** Tek yazarın genel kuralı ya da dergi tarafından önerilmeyen bir yöntem; yasal bağlayıcılığı yok ve aşağıdaki nedenle kaynakların ölçüleriyle çelişirdi.
- **Tek tip "uzunluk en az N × boy" kuralı (kaynaktan bağımsız):** Katalogda kaynakların önerdiği uzunluk bazı büyük türlerde boyun yalnızca 1,7–3,5 katı. Böyle bir kural kaynağa uyan akvaryumlara da kırmızı verirdi.
- **Kırmızı alan uyarısını kesin tehlike yapmak:** Genel durumu doğrudan "tehlike"ye çekerdi; yavru balığı geçici olarak tutan kullanıcıya da tehlike gösterirdi. Ürün sahibi seçmedi.
- **Değiştirmemek:** Denetimin son bulgusu açık kalırdı.

## Doğrulama

- `packages/compatibility-engine/test/space.test.ts` (9 test, stub kayıtlarla) şunları sınar:
  - kaynağa uyan akvaryum,
  - kaynak altı ama yönetmelik sınırı üstü (sarı),
  - kaynağın uzunluğu yönetmelikten kısa olan tür,
  - uzunluk, genişlik ve derinlik sınırları ve tam 3× sınırı,
  - kaynak uzunluğu yayımlamayan tür,
  - balık olmayan canlı,
  - girilmemiş ölçü,
  - ölçüt puanı ve genel durum sınırı.
  Kırmızı basamak devre dışı bırakıldığında 4 testin başarısız olduğu doğrulandı.
- `audit-scenarios.test.ts`: Bekleyen son `it.todo` gerçek teste dönüştü. 60 L'deki astronot kırmızı alan uyarısı alıyor ve genel durum en fazla "dikkat" oluyor. Kaynağın önerdiği ölçüdeki astronot alan uyarısı almıyor. 50 cm'lik 40 L akvaryumdaki neon tetra yalnızca sarı uyarı alıyor.
- `scripts/test-health.cjs`: "alan sınırda" arayan 23 senaryo, artık kırmızı uyarı alan büyük balıklar için "akvaryum çok küçük" başlığını arıyor. Bunların 18'inde uyarının tehlike seviyesinde olduğu da denetleniyor; kalan 5'i uyarı metnindeki kaynak hacmini ve uzunluğunu denetlemeye devam ediyor. Anemon senaryosunda canlıya katalogdaki gerçek kategorisi ("other") verildi, çünkü senaryoların yardımcı fonksiyonu her canlıyı balık sayıyordu. 113 senaryonun tamamı geçiyor.
- Altın fikstür onaydan sonra yeniden üretildi (1033 vaka). 125 vaka değişti:
  - 130 uyarı sarı "alan sınırda" iken kırmızı "akvaryum çok küçük" oldu; mesaj eski kaynak cümlesiyle başlıyor.
  - 125 vakada yüzme alanı ölçütü en fazla 35 oldu.
  - 99 vakada genel puan en fazla 74'e indi; 26 vaka zaten kesin tehlikedeydi.
  - Hiçbir vakanın genel durumu değişmedi.
  - Açıklanamayan fark yok.
- Codex denetimi (1. tur, 2026-10-03): P1/P2 yok, üç P3 bulgu düzeltildi (uyarı metninin yönetmeliğin kendisi değil AquaMind uyarlaması olduğunu söylemesi, Practical Fishkeeping yorumu, geri alma metninin zamanı). Uyarı metni değiştiği için altın fikstür yeniden üretildi; 1. tura göre yalnızca 130 kırmızı alan uyarısının metni değişti.
- Codex denetimi (2. tur, 2026-10-03): temiz; P1–P3 bulgu yok.

## Sonuçlar

- Akvaryum, yetişkin balığın yönetmelikte istenen en küçük ölçülerinin de altındaysa uygulama artık bunu kırmızıyla gösteriyor.
- 2026-09-24 uyumluluk denetiminin bütün bulguları kapandı.
- Sarı uyarının ölçütü (kaynağın önerisi) değişmedi.

## Geri alma

Kod ve belge değişikliği tek bir commit'tir (`39af083`), altın fikstür ayrı bir commit'tir (`6886a2a`). Kod commit'i geri alındığında motor 1.5.0 davranışına döner; o durumda altın fikstür commit'i de geri alınmalıdır. Kullanıcı verisi ve depolama biçimi etkilenmez.
