# 0013 — Salyangoz uyarısı

- Tarih: 2026-10-03
- Durum: Önerildi — ürün sahibi (`buraksenfx`) kuralı 2026-10-03'te soru formuyla açıkça onayladı (önerilen seçenek). `codex/snail-warning` dalında. Codex denetimi iki turda tamamlandı (son tur 2026-10-04 temiz; 1. turdaki iki P3 bulgu yalnızca belgeleriyle ilgiliydi); kod ve belgeler tek commit olarak kaydedildi (`a836123`) ve PR #17 (`https://github.com/ckaracora/AquaMind/pull/17`) açıldı; PR üzerinde GitHub Actions `Doğrulama` ve Vercel önizlemesi başarılı. `main` birleştirmesi ürün sahibinin onayını bekliyor. `main` dalına birleştirilene kadar kabul edilmiş sayılmaz

## Bağlam

Davranış verisi (`src/data/species-behavior.ts`, 0010) kaynağı açıkça "salyangoz yer" diyen 17 balık türü için kayıt içeriyordu, ama bu kayıtlar onay kapsamı dışında olduğu için uyarı üretmiyordu. Katalogda 19 salyangoz türü var (nerit, tavşan, elma, ramshorn, Malezya boru salyangozu ve diğerleri). Balon balıkları ve çöpçü balıkları gibi salyangoz yiyen türlerle salyangozların birlikte tutulması hobide bilinen bir sorun.

## Karar

1. Kaynağı açıkça "salyangoz yer" diyen bir balık akvaryumda bir salyangozla birlikteyse sarı "Salyangozlar yenebilir" uyarısı verilir.
2. Mesaj şunları söyler: salyangoz yiyen balıkların adlarını, risk altındaki salyangozları, kaynağın notunu (ör. Fishkeeper'ın cüce zincir çöpçü için "yalnızca yavru/küçük salyangozlar" notu, Seriously Fish'in palyaço çöpçü için "salyangoz yer ama istilayı tek başına çözmez" notu) ve kaynakları.
3. Kaynakları çelişen ya da salyangoz bilgisi olmayan balık uyarı üretmez. Karides kuralındaki "doğrulanmadı" uyarısının salyangoz karşılığı yoktur, çünkü bunu destekleyen OATA benzeri genel bir kaynak kuralı bulunmuyor.
4. Tür uyumu cezası 30'dur; karides yiyen balıkla aynıdır. Bu bir davranış cezası olduğu için 0010'daki taban kuralları geçerlidir: tür uyumu 50'nin altına inmez ve genel durum yalnızca bu yüzden "tehlike"ye düşmez.
5. Katalogda salyangoz yiyen bir salyangoz türü de var (katil salyangoz, *Anentome helena*). Davranış verisinde bunun kaydı olmadığı için bu karar onu kapsamaz.

`ENGINE_VERSION` ve `RULESET_VERSION` 1.7.0'a yükseltildi. Motorun isteğe bağlı `behavior` girişine `eatsSnails` eklendi; uyarlayıcı (`withBehavior`) bu kaydı bağlar. Sonuç nesnesinin biçimi değişmedi.

## Değerlendirilen alternatifler

- **Şimdilik uyarı vermemek:** Veri hazır olduğu hâlde bilinen bir sorun sessiz kalırdı. Ürün sahibi seçmedi.
- **Salyangoz bilgisi olmayan her balık için "doğrulanmadı" uyarısı:** Kaynağı yok; topluluk akvaryumlarında gereksiz uyarı üretirdi.

## Doğrulama

- `packages/compatibility-engine/test/snail.test.ts` (4 test, stub kayıtlarla) şunları sınar:
  - uyarı metni, kaynağın notu ve kaynaklar;
  - akvaryumda salyangoz yoksa uyarı çıkmaması;
  - kaynakları çelişen ya da salyangoz bilgisi olmayan balık;
  - ceza ve genel durum.
  Kural devre dışı bırakıldığında 2 testin başarısız olduğu doğrulandı.
- `src/lib/__tests__/species-behavior.test.ts`: gerçek katalogda palyaço çöpçü ile nerit salyangozu, kaynağın notuyla sarı uyarı alıyor; neon tetra ile nerit salyangozu uyarı almıyor.
- 113 sağlık senaryosu değişmeden geçiyor.
- Altın fikstür değişmedi. 1033 vakanın hiçbirinde salyangoz yiyen balık ile salyangoz birlikte değil; bu yüzden yeniden üretim gerekmedi. Fikstürün 1.7.0 motoruyla bayt bayt aynı çıktı verdiği golden testiyle doğrulandı.

## Geri alma

Kod değişikliği tek commit'tir (`a836123`). Geri alındığında motor 1.6.0 davranışına döner; altın fikstür değişmediği için ayrı bir geri alma gerekmez. Kullanıcı verisi ve depolama biçimi etkilenmez.
