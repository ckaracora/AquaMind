# 0017 — Elle girilen ekipman değerleri

- Tarih: 2026-10-11
- Durum: Ürün sahibi onayladı; Codex denetimi iki turda tamamlandı (2. tur 2026-10-11, temiz) — ürün sahibi (`buraksenfx`) özelliği 2026-10-11'de açıkça istedi ("bunu istiyorum") ve aynı gün ekran taslağını onayladı ("böyle olsun; kullanıcı ne yaptığını rahatça anlasın, bir de esnek olabilsin"). Commit ve PR planlandı; `main` birleştirmesi ve yayın ürün sahibinin onayını bekliyor.

## Bağlam

Ekipman kaynak yenilemesi (PR #22 Boyu, PR #23 Jeneca ve Dophin) gösterdi ki bazı cihazların değeri kurala uyan bir kaynaktan doğrulanamıyor: üretici o modeli yayımlamıyor ya da markanın bulunabilir bir üretici sitesi yok. Kaynak kuralı (`docs/DATA_SOURCES.md`) gereği bu kayıtlar adlarıyla listede kalıyor ama değerleri hesaba katılmıyor. Listede hiç olmayan cihazlar ise eklenemiyordu; ekipman formu yalnızca listeden seçime izin veriyordu. 2026-10-11'de katalogda adıyla listede olup değeri doğrulanamayan 31 filtre, hava motoru ve ısıtıcı kaydı var (24 filtre, 4 hava motoru, 3 ısıtıcı).

Sonuç: bu cihazların sahibi sağlık analizinde filtre ya da ısıtıcı sonucu alamıyordu, oysa gereken değer çoğu zaman cihazın etiketinde yazıyor. Ürün sahibi, küçük markalar için ayrı ayrı kaynak araştırması yapmak yerine kullanıcının kendi cihazının değerini girebilmesini istedi.

## Karar

1. **Hangi kayıtta girilir.** Kullanıcı yalnızca katalogda doğrulanmış kapasite verisi olmayan kayıtta değer girebilir:
   - listede hiç olmayan filtre, hava motoru ve ısıtıcı (marka ve model elle yazılır);
   - listede adı olan ama değeri doğrulanamadığı için hesap dışı tutulan filtre, hava motoru ve ısıtıcı.
2. **Hangi değer.** Filtre ve hava motorunda etiket debisi (L/saat; formda L/dakika da seçilebilir ve 60 ile çarpılarak kaydedilir), ısıtıcıda güç (W). Üretici hacim önerisi elle girilmez.
3. **Doğrulanmış değer ezilemez.** Katalogda debisi, hacim önerisi ya da gücü doğrulanmış kayıtta elle giriş alanı yoktur; böyle bir kayıtta saklı bir kullanıcı değeri olsa bile motor onu yok sayar. Pasif parçalar, yardımcı filtreler (yüzey skimmeri) ve hava motoruyla çalışan sünger filtreler de elle değer almaz.
4. **Hesap kuralı aynıdır.** Girilen değer, aynı değere sahip doğrulanmış bir kayıtla aynı kuraldan geçer: filtre etiket debisiyle (saatte 4 çevrim uygun, 2 çevrimin altı tehlike), ısıtıcı 0,5–1,5 W/L bandıyla, hava motoru sünger filtre bağlantısıyla değerlendirilir. Yeni eşik, yeni ceza ya da yeni uyarı yoktur.
5. **Kabul edilen aralık.** Filtre debisi 20–20.000 L/saat, hava motoru debisi 10–50.000 L/saat, ısıtıcı gücü 5–2.000 W. Aralık dışındaki sayı büyük olasılıkla birim ya da yazım hatasıdır; form kaydetmez, motor da (ör. içe aktarılan bir yedekten gelirse) hesaba katmaz. Aralıklar katalogdaki cihazların değerlerini kapsayacak genişlikte seçildi (2026-10-11'de katalogda filtre debisi 90–4.500 L/saat, hava motoru debisi 21–35.000 L/saat, ısıtıcı gücü 7,5–1.500 W); bir güvenlik eşiği değildir.
6. **Sonuç işaretlenir.** Filtre ya da ısıtıcı sonucu kullanıcının girdiği bir değere dayanıyorsa ilgili ölçüt `userProvided: true` taşır ve sağlık sayfasında "Senin girdiğin değere dayanıyor" etiketi görünür. "Veri güveni" açıklaması kaç kaydın kullanıcının değeriyle hesaba katıldığını yazar (ör. "5/7 güvenlik kaydı hesaplamaya hazır · 1 kayıt senin girdiğin değerle"). Değeri girilen kayıt hesaplamaya hazır sayılır; bu yüzden "Katalogla eşleşmeyen ekipman kaydı var" ve "Ekipman kapasite bilgisi eksik" uyarıları o kayıt için kalkar.
7. **Katalog değişmez.** Kullanıcının girdiği değer yalnızca kendi kaydında, kendi tarayıcısında durur; kataloğa yazılmaz, başka kullanıcıya gösterilmez ve kaynak olarak kullanılmaz. "Teknik katalog verisi uydurulmaz" kuralı aynen geçerlidir.

`ENGINE_VERSION` ve `RULESET_VERSION` 1.8.0'a yükseltildi.

## Uygulama

- **Kayıt biçimi:** `Equipment` kaydına isteğe bağlı iki alan eklendi: `userRatedFlowLph` (L/saat) ve `userPowerW` (W). Zod şeması (`equipmentSchema`) aynı alanları isteğe bağlı sayı olarak kabul eder. `aquamind:equipment:v1` anahtarı, dışa aktarma sürümü ve mevcut kayıtlar değişmedi; eski kayıtlar olduğu gibi geçerlidir.
- **Motor** (`packages/compatibility-engine/src/index.ts`): `userValueKindFor`, `userValueLimitsFor`, `userValueFor` dışa aktarılır; hangi kayıtta hangi değerin girilebileceğini ve aralığı tek yerde tanımlar. Analiz, uygun kayıtta kullanıcının değerini katalog kaydının bir kopyasına (kayıt katalogda yoksa yalnızca kategori, marka ve modelden oluşan bir kayda) ekler ve bu kaydı hesaplamaya hazır sayar. Girilen değerin türü (debi ya da güç) kayıtla birlikte tutulur; ölçüt yalnızca kendi dayandığı değer elle girildiyse işaretlenir. Örneğin ısıtıcısı doğrulanmış bir ısıtıcılı filtrede yalnız debi elle girildiyse filtre ölçütü işaretlenir, ısıtıcı ölçütü işaretlenmez (Codex 1. tur bulgusu). Elle değer yoksa çıktı bayt bayt eskisiyle aynıdır; `userProvided` alanı hiç bulunmaz.
- **Aynı cihaz iki kez kayıtlıysa:** "Ekipman kapasite bilgisi eksik" uyarısı artık katalog kimliğiyle değil kayıtla eşleştirilir; yalnız birine değer girildiyse diğeri için uyarı sürer. Elle değer olmayan durumda sonuç değişmez (aynı katalog kaydı aynı hazır olma durumunu verir).
- **Ekipman ekranı** (`src/app/equipment/page.tsx`): "Marka ve modeli kendim yazacağım" seçeneği; etiket değeri alanı (birim seçimi, kayda nasıl yazılacağının önizlemesi, aralık dışı ve sayı olmayan girişte açıklayıcı hata, akvaryuma göre olağan dışı debide birim uyarısı); elle yazılan marka ve model listede varsa bunun bildirilmesi ve kaydın listedeki cihaza bağlanması; kartta "Senin girdiğin değer" ya da "Değeri eksik" satırı; değeri sonradan düzenleme ve silme penceresi. Pencere klavyeyle kullanılabilir: açılınca odak değer alanına gelir, Sekme tuşu pencerenin içinde döner, Esc kapatır, kapanınca odak pencereyi açan düğmeye döner; ekran okuyucuya başlığı ve açıklamasıyla "pencere" olarak tanıtılır (`src/lib/dialog-focus.ts`; Codex 1. tur bulgusu). L/dakika seçiliyken aralık hatası sınırları içe doğru yuvarlanmış L/dakika ve L/saat olarak birlikte gösterir (ör. "0,4–333,3 L/dakika; 20–20.000 L/saat"), böylece mesajda yazan her değer kabul edilir. Değer girmek zorunlu değildir; boş bırakılan cihaz kaydedilir ama hesaba katılmaz.
- **Sağlık sayfası:** ölçütlerde "Senin girdiğin değere dayanıyor" etiketi; değeri eksik cihaz varsa adlarını sayan ve ekipman ekranına götüren "Etiket değerini girersen hesaba katılır" yönlendirmesi. Hava motoru yalnızca akvaryumda hava motoruyla çalışan bir filtre varsa bu listede yer alır.
- **Yardımcı modül** (`src/lib/user-equipment-value.ts`): formdaki metni sayıya çevirir (Türkçe binlik ve ondalık yazımı), ekranda gösterilecek metinleri üretir. Katalog verisi içe aktarmaz; sağlık sayfası tarafından kullanıldığı için "parça yükleyen modüller katalog verisini içe aktarmaz" denetimine eklendi.
- **Depolama** (`src/providers/aquarium-provider.tsx`): `updateEquipment` eklendi; silme ile aynı kaydetme askısı kuralına uyar.

## Değerlendirilen alternatifler

- **Küçük markalar için tek tek kaynak aramak:** Bulunabilir üretici sitesi olmayan markalarda kurala uyan kaynak çıkmıyor; ürün sahibi bu markalar için derin araştırma istemedi.
- **Doğrulanmamış katalog değerlerini kullanmaya devam etmek:** "Yanlış bilgi vermeyelim" ilkesine aykırı; kaynak kuralı bunu yasaklıyor.
- **Kullanıcının her kayıtta değeri değiştirebilmesi:** Üreticinin doğrulanmış değerini yanlışlıkla ezme riski taşır; seçilmedi.
- **Hacim önerisini de elle almak:** Etikette çoğu zaman yazmaz ve satıcı ilanlarında abartılıdır; debi ve güç etikette yazan nesnel değerlerdir.

## Doğrulama

- `packages/compatibility-engine/test/user-equipment-values.test.ts` (23 test, stub kayıtlarla; ısıtıcılı filtrede yalnız debi girildiğinde ısıtıcı ölçütünün işaretlenmemesi dahil): hangi kayıtta girilebildiği; aralık sınırları; elle girilen filtre, ısıtıcı ve hava motorunun aynı değerli doğrulanmış kayıtla aynı puanı, açıklamayı ve genel puanı vermesi; 4 ve 2 çevrim sınırları; işaretin yalnız elle değer kullanıldığında bulunması; uyarıların kalkması; doğrulanmış değerin ezilememesi; aralık dışı değerin, yardımcı filtrenin ve sünger filtrenin hesaba katılmaması; aynı cihazın iki kaydı; elle değer olmayan çıktının değişmemesi. Motor dokuz ayrı yerinden tek tek bozulduğunda (doğrulanmış değerin ezilmesi, elle değerin yok sayılması, işaretlerin kaldırılması, aralıkların genişletilmesi, kimlikle eşleştirme, güven açıklaması) her seferinde en az bir testin başarısız olduğu doğrulandı.
- `src/lib/__tests__/dialog-focus.test.ts` (4 test): pencerede Sekme tuşunun odağı içeride döndürmesi (son öğeden ilke, ilkten sona, dışarıdan içeri).
- `src/lib/__tests__/user-equipment-value.test.ts` (16 test): alan tanımları, metnin sayıya çevrilmesi, birim dönüşümü, hata metinleri (L/dakika mesajında yazan sınırların kabul edilmesi dahil), kayda yazma ve silme, gösterim, etiket değeri bekleyen cihazlar, olağan dışı debi uyarısı.
- `src/lib/__tests__/catalog-slice.test.ts`: gerçek katalogla, elle değer girilmiş dört ekipman setinde (listede olmayan cihaz, listede adı olup değeri eksik cihaz — kimlikle ve marka/modelle — ve doğrulanmış değeri olan cihaz) gereken parçalarla yapılan analiz tam katalogla yapılan analizle aynı.
- `packages/domain/test/schemas.test.ts`: yeni alanlar isteğe bağlı sayı olarak kabul edilir, metin değer reddedilir.
- Altın fikstür değişmedi (1033 vaka; hiçbirinde elle değer yok). 113 sağlık senaryosu değişmeden geçiyor.
- Yerel sunucuda düzenleme penceresi klavyeyle denendi (2026-10-11, Codex 1. tur düzeltmesinden sonra): açılışta odak değer alanında; Sekme sırası değer, birim, Vazgeç, Kaydet, Kapat ve yeniden değer; Shift+Sekme ilk öğeden son öğeye; Esc pencereyi kapatıp odağı "Değiştir" düğmesine döndürüyor; 0,3 L/dakika reddedilip yeni aralık mesajını gösteriyor, 0,4 L/dakika 24 L/saat olarak kabul ediliyor.
- Yerel sunucuda elle deneme: aralık dışı ve sayı olmayan giriş hatası, L/dakika dönüşümü, Türkçe sayı yazımı, listede olan cihazın elle yazılması, değerin sonradan düzenlenmesi, listede adı olup değeri eksik cihaz (Jeneca LT-300), sağlık sayfasındaki etiket ve yönlendirme.

## Bilinen sınırlar

- Değeri kullanıcı girer; doğruluğu denetlenemez. Sonuç bu yüzden açıkça işaretlenir.
- Listede olmayan ve hesaba hiç girmeyen cihaz türleri (aydınlatma, CO₂ ve benzeri) elle yazılarak kaydedilebilir, ama motorun mevcut "Katalogla eşleşmeyen ekipman kaydı var" uyarısı bunlar için de çıkar; bu uyarı kuralı bu kararla değiştirilmedi (örnek akvaryumdaki ISTA CO₂ seti bugün de aynı uyarıyı veriyor). Değiştirilmesi ayrı bir ürün sahibi onayı ister.
- Elle girilen debiyle "güçlü akış" uyarısı da doğrulanmış kayıttaki gibi hesaplanır.

## Geri alma

Kod değişikliği geri alındığında motor 1.7.0 davranışına döner. Kayıtlardaki `userRatedFlowLph` ve `userPowerW` alanları eski şemada tanımsız alan olarak yok sayılır; kayıtlar geçerli kalır ve hesaba katılmaz. Altın fikstür değişmediği için ayrı bir geri alma gerekmez.
