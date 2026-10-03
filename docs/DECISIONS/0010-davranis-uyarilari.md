# 0010 — Davranış uyarıları: yüzgeç ısırma, cüce karides, fırsatçı avcı ve aynı tür saldırganlığı

- Tarih: 2026-09-29
- Durum: Kabul edildi — ürün sahibi (`buraksenfx`) dört kuralı 2026-09-29'da karar sayfası ve soru formuyla açıkça onayladı; dördünde de önerilen seçenek. Codex denetimi üç turda tamamlandı (son tur 2026-09-29 temiz). Kod ve belgeler (`5226649`) ile altın fikstür (`df8683b`) ayrı commit'ler olarak kaydedildi; PR #14 (`https://github.com/ckaracora/AquaMind/pull/14`) kullanıcı onayıyla 2026-10-03'te merge commit yöntemiyle `main` dalına birleştirildi (`5e77f12`) ve canlıda (`f3fd24b` ile birlikte yayımlandı; `main` push'unda `Doğrulama` ve Vercel üretim dağıtımı başarılı)
- Karar sayfası: https://claude.ai/artifact/VnfqPSmsKrkSQUStML6dXK (özel; paylaşım ürün sahibinde)

## Bağlam

2026-09-24 uyumluluk denetimi beş davranış senaryosunda motorun yanlış sonuç verdiğini buldu: Japon balığı ve melek balığı neonu yiyebilir, kaplan barbı betanın yüzgeçlerini ısırır, iki erkek beta kavga eder; cüce guraminin kiraz karidesi yediği de varsayılmıştı. Nedeni, davranışın yapılandırılmış veri olarak tutulmamasıydı: katalogda yalnızca serbest metin "tank arkadaşı uyarısı" vardı ve bu da yalnızca başka bir tür eklendiğinde görünüyordu.

## Veri

- `src/data/species-behavior.ts`: 157 tür için 202 kayıt. Her kayıt bir davranış bayrağı, kaynak adı, doğrudan kaynak bağlantısı, doğrulama tarihi (2026-09-28), kısa kanıt ve gerekirse kullanıcıya gösterilebilir bir koşul taşır.
- Kaynaklar (elemeden sonra): 122 kayıt Seriously Fish, 39 Fishkeeper (Maidenhead Aquatics), 38 Practical Fishkeeping, 3 OATA bakım kılavuzu. Araştırmanın ham çıktısı 205 kayıttı. Her sayfa açılıp okundu; arama özeti, forum, mağaza sayfası ve yapay zekâ cevabı kullanılmadı. Kaynak bulunamayan türler için kayıt yoktur; kayıt olmaması "sorun yok" anlamına gelmez.
- Eleme: yalnızca anekdota ya da doğadaki davranışa dayanan 3 kayıt çıkarıldı (bumblebee gobinin ve kırmızı karınlı pirananın yüzgeç ısırması, dev guraminin karides yemesi). Kaynak kısaltması ya da iç araştırma notu içeren 20 koşul metni okunur Türkçeyle yeniden yazıldı; kanıt alanlarındaki kısaltmalar dosya başında açıklandı. Kaynakların çeliştiği 9 kayıt `conflict` olarak tutuldu.
- Veri Canberk'in katalog dosyalarından ayrı durur; böylece yeni katalog verisiyle çakışmaz. `src/lib/health-analysis.ts` içindeki `withBehavior`, her davranış için açık kaynaklı kaydı (yoksa çelişkili kaydı) motora bağlar. Kaynağa göre asıl avcı olmayan 2 türün (winemilleri eartheater, threadfin acara) katalogdaki "avcı" işareti kaldırılır. Kaynak bu türlerin çok küçük balıkları yine de avlayabildiğini söylüyor. Av boyu yalnızca kaynak bir ölçü verdiğinde veriye yazılır (`maxPreyCm`) ve tür o sınırla (sınır dahil) fırsatçı avcı sayılır:
  - Threadfin acara: 2 cm. Seriously Fish "will not prey on anything larger than a couple of centimetres" diyor, yani iki santimetre kadardan büyük hiçbir şeyi avlamaz. Tam 2 cm'lik chili rasbora uyarı alır; kullanıcıya gösterilen not "Yaklaşık 2 cm ve altındaki balıklar ile yavrular için risk sürer."
  - Winemilleri: sınır yok. Seriously Fish yalnızca üreme dışında "a few millimetres" boyundan büyük balıkları avlamadığını söylüyor; bu bir sayı değil, yavru boyudur. Motor yetişkin boylarıyla çalıştığı için bu risk modellenemez ve kaynakta olmayan bir sayı uydurulmaz. Tür fırsatçı avcı uyarısı üretmez (katalogdaki en küçük balık 1,8 cm; kaynağa göre bu boydaki balıklar zaten risk altında değil).
  - Bu ayrım Codex'in 1. tur (av boyu) ve 2. tur (winemilleri sayısı, threadfin acara'nın metni) bulguları üzerine yapıldı.
- Salyangoz yiyen 17 tür verisi de dosyadadır ama onay kapsamı dışında olduğu için uyarı üretmez.
- 2026-10-03 ikinci katalog entegrasyonunda Canberk aynı türü (Stiphodon semoni) gösteren yinelenen `cobalt-goby` profilini kaldırdığı için o kimliğin tek kaydı çıkarıldı; aynı Seriously Fish kaydı `cobalt-blue-goby-semoni` altında zaten vardı. Dosya artık 156 tür için 201 kayıt (121 Seriously Fish). Bkz. `docs/DECISIONS/0011-katalog-entegrasyonu-2-taban-isiticisi.md`.

## Karar

Hepsi uyarı seviyesindedir ve yalnızca açık kaynaklı kayıtlar uyarı üretir. Her uyarı kaynağın adını, varsa kaynağın notunu söyler.

1. **Yüzgeç ısırma:** yüzgeç ısıran bir balık, uzun ya da yavaş yüzgeçli farklı bir balıkla birlikteyse "<hedef>: yüzgeç ısırma riski".
2. **Cüce karides** (yetişkin boyu 4 cm veya altı; OATA: cüce karidesler 3 cm, Amano 5 cm): kaynağı "karides yer" diyen balık için "Karidesler yenebilir"; kaynakta "karidesle güvenli" bilgisi olmayan ya da kaynakları çelişen balık için "Karides uyumu doğrulanmadı" (OATA: karidesler ağzına sığabilecekleri balıklarla tutulmamalı); kaynağı güvenli diyen balık için uyarı yok.
3. **Fırsatçı avcı:** kaynağı "ağzına sığan küçük balığı yer" diyen ve katalogda asıl avcı olmayan tür, yetişkin boyu kendisinin %40'ı veya altındaki bir balıkla birlikteyse "<av>: avlanabilir". Kaynak açık bir av boyu verdiyse %40 kuralı yerine daha küçük olan o sınır geçerlidir. Asıl avcılar (`predatory`) için kesin tehlike kuralı değişmedi.
4. **Aynı tür saldırganlığı:** toplam adet 2 veya fazlaysa, erkekleri kavga eden türde "<tür>: erkekler kavga eder", tek tutulması gereken türde "<tür>: tek tutulmalı". Uygulama cinsiyeti bilmediği için uyarı seviyesindedir.

Ölçüt ve genel durum:

- Tür uyumu cezaları: fırsatçı avcı 40, yüzgeç ısırma 30, aynı tür saldırganlığı 30, karides yiyen balık 30, karides uyumu doğrulanmayan balık 15.
- Uyarı seviyesindeki uyum sorunları (akıntı farkı, tank arkadaşı notu, davranış) birikse de tür uyumu 50'nin altına inmez; yalnızca kesin tehlike (yaşam ortamı, sıcaklık veya pH uyuşmazlığı, asıl avcı, tür akvaryumu) indirir. Önceki kurallarda uyarı seviyesindeki cezaların toplamı zaten en fazla 50 olduğu için eski sonuçlar değişmez.
- Davranış cezası olmadan tehlikede olmayan bir akvaryum, davranış uyarıları yüzünden tehlikeye düşmez; genel puan en az 50 tutulur ("genel durum en fazla dikkat" onayı). Kesin tehlike (49) ve diğer tehlike uyarısı (74) sınırları aynen kalır.

Eşikler ve cezalar `packages/compatibility-engine/src/index.ts` içindedir (`PREY_SIZE_RATIO`, `DWARF_SHRIMP_MAX_CM`). `ENGINE_VERSION` ve `RULESET_VERSION` 1.4.0'a yükseltilir. Sonuç nesnesinin biçimi değişmez; motor girişine isteğe bağlı `behavior` alanı eklenir.

### Kaynaklara göre değişen beklenti

Denetim "cüce gurami kiraz karidesi yer" varsaymıştı. Seriously Fish kiraz karides gibi karideslerin bitkili akvaryumda cüce guramiyle iyi sonuç verebildiğini yazıyor; Practical Fishkeeping'te bir yazar ikisini yoğun bitkili akvaryumda birlikte tuttuğunu anlatıyor. Bu yüzden bu ikili uyarı almaz.

## Değerlendirilen alternatifler

- Davranışları kırmızı (kesin tehlike) yapmak: yaralanma ya da kayıp riski var ama anında ölüm değil; uygulama cinsiyeti bilmiyor. Ürün sahibi sarıyı seçti.
- Karides uyarısını yalnızca kaynağı "yer" diyen 24 türle sınırlamak: bilgisi olmayan türlerde risk sessiz kalırdı; OATA'nın genel kuralıyla çelişirdi.
- Practical Fishkeeping'in çiklitler için "tank arkadaşı en az 2/3 boyunda" kuralı: avlanmadan çok çiklit saldırganlığı içindir; bütün türlere uygulanırsa pek çok normal toplulukta uyarı çıkarır.
- Karides için balık boyuna dayalı bir santimetre sınırı: hiçbir kaynakta yok.

## Kaynaklar

Kayıt başına kaynak bağlantıları `src/data/species-behavior.ts` içindedir. Kural düzeyindeki başlıca kaynaklar:

- OATA, tatlı su karidesi ve salyangozu bakım kılavuzu (karidesler ağzına sığabilecekleri ya da avcı balıklarla karıştırılmamalı; cüce karides 3 cm, Amano 5 cm): https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-tropical-freshwater-invertebrates/how-to-look-after-freshwater-shrimp-and-snails/
- Practical Fishkeeping, karideslerle ne tutulabilir: https://www.practicalfishkeeping.co.uk/features/what-can-i-keep-with-shrimp/
- Seriously Fish, melek balığı (tetra gibi küçük balıkları yiyebilir): https://www.seriouslyfish.com/species/pterophyllum-scalare/
- Practical Fishkeeping, Japon balığı SSS (yetişkin Japon balığı White Cloud gibi küçük balıkları yiyebilir): https://www.practicalfishkeeping.co.uk/features/frequently-asked-questions-on-goldfish/
- Seriously Fish, kaplan barbı (yüzgeç ısırma; özellikle küçük grupta): https://www.seriouslyfish.com/species/puntigrus-tetrazona/
- OATA, beta bakım kılavuzu (erkek betalar sıklıkla yüzgeç ısırmanın hedefi olur): https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-tropical-freshwater-fish/how-to-look-after-siamese-fighting-fish-bettas/
- Fishkeeper, beta (erkekler birlikte tutulmamalı): https://www.fishkeeper.co.uk/fish/freshwater/anabantids/siamese-fighter
- Seriously Fish, cüce gurami (bitkili akvaryumda karideslerle iyi sonuç): https://www.seriouslyfish.com/species/trichogaster-lalius/

## Doğrulama

- `packages/compatibility-engine/test/behavior.test.ts`: dört kural, çelişkili kayıtlar, asıl ve fırsatçı avcı ayrımı, %40 boy sınırı ve kaynağın av boyu sınırı, cüce karides sınırı, adetlerin toplanması, tür uyumu tabanı, davranış tabanı ve kesin tehlike önceliği (stub kayıtlarla).
- `src/lib/__tests__/species-behavior.test.ts`: her türün katalogda olması, HTTPS kaynak ve kaynak adı eşleşmesi, doğrulama tarihi, koşul metinlerinde kısaltma olmaması, av boyu sınırı (yalnızca kaynağın ölçü verdiği threadfin acara'da), `withBehavior` bağlaması, avcı işaretinin kaldırılması ve gerçek katalogda threadfin acara ile 2 cm'lik chili rasbora (sarı uyarı, "2 cm ve altı" notuyla) ve neon tetra (uyarı yok).
- `packages/compatibility-engine/test/audit-scenarios.test.ts`: denetimde bekleyen beş davranış maddesi gerçek teste dönüştü (cüce gurami ve kiraz karides kaynaklara göre "uyarı yok"). Yalnızca alan uyarısının şiddeti `it.todo` olarak kaldı.
- Altın fikstür onaydan sonra yeniden üretildi (1020 vaka; 83'ü değişti); her fark sınıflandırıldı, açıklanamayan fark yok. Kod değişikliğinden ayrı bir commit'te kaydedildi (`df8683b`).

## Sonuçlar

- Denetimde kaçırılan dört davranış senaryosu artık uyarı alıyor; normal topluluklar ve kaynakların güvenli dediği ikililer uyarı almıyor.
- Davranış uyarıları genel durumu en fazla "dikkat"e çeker.
- Ele alınmayanlar (ayrı görevler): salyangoz uyarısı (veri hazır, onay bekliyor), alan uyarısının şiddeti, kaynağı bulunamayan türler için yeni araştırma.

## Geri alma

Kod değişikliği tek commit'tir; geri alındığında motor 1.3.0 davranışına döner ve altın fikstür commit'i de geri alınır. `src/data/species-behavior.ts` yalnızca bu motor tarafından okunur; kullanıcı verisi ve depolama biçimi etkilenmez.
