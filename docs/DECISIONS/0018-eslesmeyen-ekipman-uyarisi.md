# 0018 — Eşleşmeyen ekipman uyarısı yalnızca hesaba giren türlerde

- Tarih: 2026-10-11
- Durum: Kabul edildi; Codex denetimi temiz (2026-10-12) — ürün sahibi (`buraksenfx`) 2026-10-11'de öneriyi istedi ve aynı gün "evet" diyerek onayladı. `136288b` (kod ve belgeler) ve `a6cdcd1` (altın fikstür) olarak kaydedildi, PR #25 (`https://github.com/ckaracora/AquaMind/pull/25`) 2026-10-12'de (UTC) merge commit ile `main` dalına birleştirildi (`2de4d95`) ve canlıda doğrulandı.

## Bağlam

Motor, kataloğunda bulamadığı her ekipman kaydı için sarı bir uyarı üretiyordu: "Katalogla eşleşmeyen ekipman kaydı var — N ekipmanın kapasitesi tanınmadığı için filtrasyon veya ısıtıcı hesabına dahil edilmedi." Uyarı ekipmanın türüne bakmıyordu.

Oysa güvenlik hesabına yalnızca filtre, ısıtıcı ve (hava motoruyla çalışan bir filtre varsa) hava motoru girer. Aydınlatma, CO₂, UV, dozaj pompası ve "diğer" türündeki cihazlar hiçbir ölçüte ve "Veri güveni" oranına girmez. Bu türlerde uyarı üç sorun çıkarıyordu:

1. **Metin yanlıştı.** Lamba ya da CO₂ seti zaten filtrasyon ve ısıtıcı hesabının parçası değildir; "hesaba dahil edilmedi" demek bir eksik varmış izlenimi verir.
2. **Uygulama kendisiyle çelişiyordu.** Elle girilen ekipman değerleriyle (0017) gelen ekleme formu bu türler için "Bu tür ekipman sağlık hesabına girmez; yalnızca kaydı tutulur" diyor; sağlık sayfası aynı cihaz için uyarı veriyordu. Örnek akvaryumda ISTA CO₂ seti yüzünden uyarı çıkarken aynı sayfada "Veri güveni 4/4" yazıyordu.
3. **Kullanıcı uyarıyı gideremiyordu.** Bu türlerde değer girilemez; listede olmayan cihazını kaydeden kullanıcı kalıcı bir sarı uyarı görüyordu. Giderilemeyen uyarı diğer uyarıların da ciddiye alınmamasına yol açar.

0017, listede olmayan cihazın elle yazılmasına izin verdiği için bu durumun sıklaşması bekleniyordu; 0017 bu kuralı bilerek değiştirmemiş ve ayrı bir ürün sahibi onayına bırakmıştı.

## Karar

1. **Uyarı yalnızca güvenlik hesabına giren türde çıkar:** filtre ve ısıtıcı; akvaryumda hava motoruyla çalışan bir filtre varsa hava motoru.
2. **Diğer türler uyarı üretmez:** aydınlatma, CO₂, UV, dozaj pompası ve "diğer" türündeki cihaz listede olmasa da uyarı çıkmaz.
3. **Uyarının metni ve seviyesi aynıdır.** Metindeki sayı yalnızca hesaba giren türleri sayar.
4. **Puan değişmez.** Ölçütler, "Veri güveni" oranı ve diğer uyarılar aynıdır; bu türler zaten hiçbirine girmiyordu.
5. **Hava motoru ayrıntısı.** Hava motoru yalnızca hava motoruyla çalışan bir filtre varken hesaba girer; "Veri güveni" sayımı ve 0017'deki "etiket değeri bekleyen cihazlar" listesi de aynı koşulu kullanır. Uyarı da aynı koşula bağlandı. Bu ayrıntı onaylanan ilkenin ("hesaba girmeyen cihaz uyarı vermesin") teknik uygulamasıdır; ürün sahibine 2026-10-11'de ayrıca bildirildi.

`ENGINE_VERSION` ve `RULESET_VERSION` 1.9.0'a yükseltildi.

## Uygulama

- **Motor** (`packages/compatibility-engine/src/index.ts`): hangi türün güvenlik hesabına girdiği tek yerde tanımlandı (`entersSafetyCalculation`). "Veri güveni" sayımı ve eşleşmeyen ekipman sayımı aynı tanımı kullanır. Eşleşmeyen kayıt: katalogda bulunamayan ve elle değeri de girilmemiş kayıt (0017 kuralı sürer; değeri girilen kayıt uyarı üretmez).
- Ekranlar, katalog verisi ve kayıt biçimi değişmedi.

## Değerlendirilen alternatifler

- **Uyarıyı olduğu gibi bırakmak:** yukarıdaki üç sorun sürer.
- **Bu türler için ayrı, bilgi amaçlı bir satır göstermek:** ekleme formu bu bilgiyi zaten veriyor; sağlık sayfasındaki liste kullanıcının bir şey yapabileceği konular içindir.
- **Hava motorunda her durumda uyarı vermek:** hava motoru yalnız başına hesaba girmez; hava motoruyla çalışan filtre yokken uyarı yine "hesaba dahil edilmedi" diyerek yanıltırdı.

## Doğrulama

- `packages/compatibility-engine/test/unmatched-equipment-warning.test.ts` (6 test, stub kayıtlarla): hesaba girmeyen beş türün her birinde listede olmayan cihazın uyarı üretmemesi ve analiz sonucunu hiç değiştirmemesi; listede olmayan filtre ve ısıtıcının uyarı üretmesi; sayının yalnızca hesaba giren türleri sayması; hava motorunun yalnızca hava motoruyla çalışan filtre varken sayılması; değeri elle girilen kaydın uyarı üretmemesi; listede olmayan filtrenin veri güvenini düşürmesi, lambanın düşürmemesi.
- Altın fikstür 2026-10-11 onayından sonra yeniden üretildi. 1.033 vakadan yalnızca `seed:mock-data` (örnek akvaryum) değişti: ISTA CO₂ seti için çıkan uyarı kalktı. Bu vakada puan (90), durum, sekiz ölçüt ve diğer üç uyarı aynı kaldı.
- `scripts/test-health.cjs` içindeki 113 senaryo değişmeden geçiyor; listede olmayan filtre senaryosu uyarıyı beklemeye devam ediyor.

## Bilinen sınırlar

- Listede olmayan lamba, CO₂ seti ve benzeri cihazlar sağlık sayfasında artık hiç anılmaz; kayıt ekipman ekranında durur.
- "Bazı ekipman verileri doğrulanmayı bekliyor" uyarısı (katalogda adı olup doğrulanmamış kayıtlar) bu kararla değiştirilmedi.

## Geri alma

Kod commit'i ve altın fikstür commit'i geri alındığında motor 1.8.0 davranışına döner. Kayıt biçimi değişmediği için veri tarafında yapılacak bir şey yoktur.
