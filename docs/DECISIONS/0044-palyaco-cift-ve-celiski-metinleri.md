# 0044 — Farklı palyaço türleri, kaynağın kabul ettiği çift ve çelişkili kaynak metni

- Tarih: 2026-11-14
- Durum: Kabul edildi. Ürün sahibi (`buraksenfx`) 2026-11-14'te A ve E kurallarını onayladı; harem ve cinsiyete göre hüküm için "şimdilik kalsın" dedi. C ve D onaylı kuralların içindeki metin düzeltmesidir (hüküm değişmez). Alan adları (`incompatibleGroup`, `pairAccepted`), çelişki metninin aynı kodda değişkenle taşınması ve başlık sözcükleri Claude'un teknik kararıdır. Motor 1.19.0, kural seti 1.16.0. Altın fikstür son kapıda yeniden üretilir.

## Bağlam

Motor 1.18.0 için bağımsız hüküm analizi (Codex, 2026-11-14) dört açık buldu:

| Açık | Örnek | Motor 1.18.0 |
|---|---|---|
| A. Farklı palyaço türleri | 2 Percula + 1 Maroon, yeterli akvaryum | 94 "iyi"; kaynak notu yalnız sarı topluluk uyarısı |
| E. Kaynağın kabul ettiği çift | 2 iki renkli horozbina | 49 "uygun değil"; kaynak "eşleşmiş çift tutulabilir" diyor |
| C. Çelişkili kaynak | Beta + kiraz karides | "karidesle güvenli bilgisi kaynaklarda bulunamadı"; oysa kaynaklar çelişiyor |
| D. Kırmızı uyarı metni | `spaceSevere` ve `spaceTooSmall` | ikisi de "akvaryum çok küçük", hükümleri farklı (74 / 49) |

## Karar

### A. Farklı palyaço türleri bir arada: "uygun değil"

- Davranış kaydına grup alanı geldi: `incompatibleGroup` kaydı, `group: "clownfish"`. Akvaryumda aynı gruptan iki farklı tür (farklı profil kimliği) varsa kırmızı `incompatibleGroup` uyarısı, kesin tehlike (en çok 49), tür uyumu cezası 60 (tür akvaryumuyla aynı; yeni sayı değil). Aynı türün kendi bireyleri (ör. iki Ocellaris kaydı) bu kurala girmez. `speciesOnly` kullanılmadı: o, türü bütün öbür türlerle yasaklardı.
- Grup yalnız kaynağın açıkça yazdığı türlere kondu. 2026-11-14'te katalogdaki altı palyaçonun Fishkeeper sayfası açıldı, alıntı doğrulandı: Ocellaris, Percula ("It is also best not to mix this species with other species of clownfish as many will fight."), pembe skunk, domates, saddleback ("... as they will fight.") ve Maroon ("Never attempt to house with other species of clownfish"). Clarkii katalogda yok. Notu olmayan palyaço türü yok; gruba dışarıdan tür eklenmedi.
- Metin: "Farklı palyaço balığı türleri bir arada" — "Kaynaklara göre Percula palyaço balığı ve Maroon palyaço balığı birbiriyle kavga eder; farklı palyaço balığı türleri aynı akvaryumda tutulmamalıdır. Kaynak: Fishkeeper."
- Topluluk notu (sarı) aynen kalır; kartta aynı bilgiyi söyler. Grup kaydı tür kartının davranış satırı değildir.

### E. Kaynağın "tek ya da uyumlu çift" dediği türde iki birey: en çok "dikkat"

- "Tek tutulmalı" kaydına (`conspecificAggression: "all"`) `pairAccepted: true` eklendi. Tam iki bireyde kırmızı `conspecificAll` yerine sarı `conspecificPair` çıkar; canlı riski sınıfında (en çok 74), ceza 30 ("erkekler kavga eder" ile aynı). Üç ve üstü birey kırmızı kalır. `minGroup` değişmedi.
- Alan yalnız kaynağı açıkça çift kabul eden kayıtlara kondu; altı adayın kaynak sayfası 2026-11-14'te açıldı, alıntı `evidence` sonuna eklendi:
  - İki renkli horozbina (Fishkeeper): "it is best to keep one specimen per tank, unless you can acquire a mated pair".
  - Green Terror (Seriously Fish): "it is best kept alone or as a mated pair unless the tank is enormous".
  - İnci ciklet (Fishkeeper): "should be maintained singly or as a compatible pair".
  - Jack Dempsey (Seriously Fish): "If a pair forms they are usually peaceful towards one another"; hızlı bilgi kutusu "best in a pair".
  - Gümüş Maskaheros (Seriously Fish): "A bonded pair will often live quite happily together".
  - Assam yılanbaş (Seriously Fish): "best kept singly or as a pair in a tank of its own".
- Kullanıcının iki balığının eşleşmiş olduğu bilinemez; metin bunu söyler: "Kaynağa göre bu tür kendi türüne saldırgandır; tek ya da uyumlu bir çift olarak tutulabilir. Kayıtlı 2 birey ancak uyumlu, eşleşmiş bir çiftse birlikte yaşayabilir; rastgele bir araya getirilen iki birey kavga edebilir." (ardından kaynağın notu ve adı).

### C. Çelişkili kaynak "bulunamadı" diye anlatılmaz

- Karides uyumu doğrulanmayan balıklardan kaynağı çelişkili olanlar (`eatsShrimp` ya da `shrimpSafe` kaydı `conflict`) aynı `shrimpUnverified` koduyla, `conflict: true` değişkeniyle, balık başına ayrı uyarı alır: "Beta balığı: karides uyumunda kaynaklar çelişiyor" — "Kaynaklar Beta balığı ile karideslerin uyumu konusunda çelişiyor; güvenli birlikte yaşam doğrulanamadı. OATA, ... özellikle risk altındadır." ardından kaynağın notu ve adı. Kayıt hiç yoksa metin değişmez.
- "Değerlendirilemeyenler" kartında başka canlılarla ilgili kaydı yalnız çelişkili olan tür `behaviorUnknown` maddesini `conflict: true` ile alır: "Kaynaklar X türünün başka canlılarla uyumu konusunda çelişiyor; uyumu doğrulanamadı."
- Aynı kodun kullanılması, seçme penceresi ve uyarı grupları gibi kodla çalışan yerlerin değişmeden çalışması içindir. Puan, ceza (15) ve seviye değişmez.

### D. Kırmızı uyarı metinleri (hüküm değişmez)

- `spaceSevere` başlığı "X: akvaryumun uzunluğu ya da derinliği yetersiz" oldu (İsviçre ölçü sınırı; en çok "dikkat"). `spaceTooSmall` "X: akvaryum çok küçük" kalır (hacim gerekenin yarısından az; "uygun değil").
- `smallFishPredation` metninde "Bu iki türü aynı akvaryumda tutmayın." yerine sarı hükümle uyumlu, riski anlatan cümle: "Birlikte tutulurlarsa X yenebilir; bu eşleşmeden kaçınmak daha güvenlidir."
- Hüküm sınırları değişmedi. Bütün kırmızıları "uygun değil" yapmak ayrı bir karar olur.

### Yapılmayanlar

- Harem ve cinsiyete göre hüküm: ürün sahibi "şimdilik kalsın" dedi. Erkek, dişi ve bilinmeyen adetleri ayrı saymak ve kaynaklı harem oranı ayrı karar ister (0043'te de ayrı bırakılmıştı).
- Kimlik çözümleyicisi ilk turda yoktu; aynı gün eklendi (aşağıda "B. Tanınmayan kimliğin sessiz eşleşmesi").
- Kaynağı "tek ya da uyumlu çift" diyen öbür "tek tutulmalı" kayıtlar ilk turda işaretlenmedi; aynı gün ikinci turda tarandı (aşağıda "E, ikinci tur").

### E, ikinci tur (2026-11-14): kalan "tek tutulmalı" kayıtları

Ürün sahibinin E kararı ("kaynağın 'tek ya da uyumlu bir çift tutulabilir' dediği türde 2 birey → dikkat") kalan bütün `conspecificAggression: "all"` kayıtlarına uygulandı. Her kaydın kaynak sayfası 2026-11-14'te açıldı; kaynak çifti açıkça kabul ediyor ya da öneriyorsa `pairAccepted` kondu, alıntı `evidence` sonuna eklendi, `verifiedAt` 2026-11-14 oldu. Toplam 23 kayıt.

- Adaylar (6): Midas (FK: "best maintained singly or as an established male-female pair"), Texas (SF: "Something substantially larger would be needed for a pair"; "Easily bred provided you can obtain a compatible pair."), Masked julie (FK: "best kept singly or in compatible pairs"), Ocellaris peacock bass (FK: "best maintained singly or as a known mated pair"), Regani julie (SF: "It should be kept as a pair unless the tank is very big"), L235 (ScotCat: "as single specimens or as sexed pairs").
- Taramada bulunan (11): Andrao ve gökkuşağı yılanbaşı (SF: "If a pair forms they are usually peaceful towards one another"; bilgi kutusu "best in a pair"), Çin yılanbaşı (SF: "the pair given a tank of their own"; "best in a pair"), A. panduro (SF: "acceptable for a single pair"), mavi akara (SF: "just about sufficient to house a pair"), jewel ciklet (SF: "It is best kept in pairs"), kribensis (SF: "It should be kept in pairs"), leleupi (SF: "only a single pair should be kept unless the tank is very large"), Marlier julie (SF: "Unless the tank is huge it should be kept as a pair"), T-bar (FK: "They are best maintained as a compatible pair"), Salvini (FK: "They are best maintained as a compatible pair.").
- İşaretlenmeyenler: kaynağı çift demeyen kayıtlar (ör. imparator ve dev yılanbaş SF "fine alone", dev gurami FK "best maintained singly", "asla iki tane alınmamalı" diyen öpücük gurami ve fil burunlu balık, "tek ya da 5+ grup" diyen türler, kerevitler, puffer'lar).
- Hükme etkisi: en az grubu (`minGroup`) 2 olan 12 `pairAccepted` türde iki birey 1.15.0'dan beri (karar 0040) uyarı almıyordu; bu düzen korunur (son kapı 3, lider kararı: karar "en fazla dikkat" diyor, uyarısız çifti sarıya çıkarmaz). En az grubu 1 olan Texas, Ocellaris peacock bass, L235, Andrao ve mavi akarada iki birey kırmızı (49) → sarı `conspecificPair` (74). Üç birey (grup sayısını aşan adet) iki durumda da kırmızıdır. Sayısal katalog alanları değiştirilmedi.

### B. Tanınmayan kimliğin sessiz eşleşmesi (2026-11-14, kural 3'ün uygulaması)

Kimliği katalogda bulunmayan (ya da hiç olmayan) eski kayıt, bilimsel adı bir türü, ortak adı başka bir türü gösterse de katalogda önce gelen türe sessizce bağlanıyordu; bilimsel adı tanınmayan kayıt da ortak adıyla bağlanıyordu (Codex hüküm analizi, B). Artık iki durumda kayıt çözülmez ve motorun var olan yoluna gider: tanınmayan canlı (`unknownAnimal`), analiz "eksik değerlendirildi" (`incomplete`). Tek ve tutarlı eşleşmede bugünkü davranış korunur: yalnız bir ad yazılıysa o adın türü; iki ad aynı türü gösteriyorsa ya da ortak ad bilimsel adın türünün eş adıysa o tür; bilimsel ad tanınıyor ama ortak ad hiçbir türün adı değilse (kullanıcının kendi verdiği ad) bilimsel adın türü; tanınmayan bilimsel ad ortak adın türünün eş adıysa (eski bilimsel ad, ör. "Cichlasoma citrinellum" + "Midas ciklet") o tür. Geçerli katalog kimliği her zaman kazanır (değişmedi). Kural tek yerde (`speciesIdForNames`, `src/data/catalog-shared.ts`); tam katalog (`speciesForLivestock`) ve parça yükleyici (`loadCatalogSlice`) onu kullanır. Eski kayıtlar ne olur: kullanıcı kaydı değişmez; yalnız okuma anındaki eşleme değişir. Tutarlı adlı eski yedekler aynı türe bağlanmaya devam eder; adları çelişen kayıt "katalogda yok" maddesiyle görünür. Güncel ekleme formu katalog profili olmadan kaydetmediği için bu yol esasen eski kayıt ve yedeklerdedir. Testler: `src/lib/__tests__/catalog-lookup.test.ts`, `catalog-slice.test.ts`, `health-unevaluated.test.ts`.

## Sonuçlar

- Kontrol turu 2 öncesindeki altın fikstür ölçümü (1138 vaka): 56 vakada yalnız metin değişir (55 `spaceSevere` başlığı, 1 `smallFishPredation` metni); hüküm ve puan değişen vaka yok. A, C ve E fikstürde geçmiyor; stub ve katalog senaryolarıyla sınanır (`test/warnings-1-19.test.ts`, `scripts/test-health.cjs`). Son fikstür son kapı 3'te yeniden üretildi (aşağıda).
- Senaryo F21 (Ocellaris 2 + Maroon 1, 250 L): 98 "iyi" → 49 "uygun değil".
- Seçme penceresi ve "Bu akvaryuma ne uyar?" listesi iki yeni kodu canlı riski sınıfından (`LIVESTOCK_RISK_WARNING_CODES`) kendiliğinden alır: palyaço akvaryumuna başka palyaço türü önerilmez, seçerken kırmızı uyarı görünür. Tür kartı değişmedi (topluluk notu aynı bilgiyi gösterir).

## Kontrol turu 2: kullanıcı talimatının önceliği (2026-11-14)

Codex kontrolü (limit dolunca raporsuz bitti) `minGroup` ≥ 2 çift istisnasını kaldırıp bütün `pairAccepted` türlerde, `pairAccepted` olmayan en az grubu 2 olan türlerde de iki bireye uyarı verdirmişti. Son kapı 3'te geri alındı (lider kararı, 2026-11-14): E kararı "en fazla dikkat" der; 0040'ın en az grubu 2 ve üstü olan türde grup sayısını aşmayan adede uyarı vermeyen düzeni korunur. Sonuç: sarı `conspecificPair` yalnız en az grubu 1 olan `pairAccepted` türde tam iki bireyde çıkar; en az grubu 2 ve üstü olan türde iki birey bugünkü gibi uyarısızdır; grup sayısını aşan adet (ör. en az grubu 2 olan türde üç birey) iki durumda da kırmızıdır. Harem ve cinsiyet hesabı eklenmez; katalogdaki sayılar değiştirilmez.

Codex'in öbür düzeltmeleri doğru bulunup tutuldu:

Sıfır adetli palyaço grup yasağına katılmaz. Çelişkili `incompatibleGroup` ve `notPiscivorous` kayıtları uyarlayıcıdan kaybolmadan geçer; avcı işareti ve puan değişmeden yalnız çelişki açıklaması korunur. Ad çözümlemede ikinci adayın profili gereksiz indirilmez, boş adlar istek üretmez. Eski kullanıcı kayıtları yeniden yazılmaz.

Doğrulama: son kapı 3'te `corepack pnpm verify` (bütün testler, tip kontrolü). Ortak regresyon kontrolleri adet 0/1/2/3, `minGroup` 1/2/6 (istisna dahil), 23 kaynaklı çift kaydı, ayrı kayıtların birleşimi, kesin tehlike önceliği, çelişkili kayıt aktarımı, EN/ES değişken çevirileri ve tam/parçalı kimlik çözümlemesini sınar (`src/lib/__tests__/engine-identity-checks.ts`). Altın fikstür son kapı 3'te ayrı commit'le yeniden üretildi.
