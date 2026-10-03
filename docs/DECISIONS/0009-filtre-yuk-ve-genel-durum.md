# 0009 — Filtre yeterliliği, tahmini biyolojik yük ve tehlike uyarısının genel duruma etkisi

- Tarih: 2026-09-28
- Durum: Kabul edildi — ürün sahibi (`buraksenfx`) üç kuralı 2026-09-28'de karar sayfası üzerinden açıkça onayladı; Canberk eşik kararlarını güvenilir kaynaklara bıraktı. Codex denetimi iki turda tamamlandı (son tur 2026-09-29 temiz). PR #13 (`https://github.com/ckaracora/AquaMind/pull/13`) ile 2026-09-29'da merge commit yöntemiyle `main` dalına birleştirildi (`98c8dc9`) ve canlıda
- Karar sayfası: https://claude.ai/artifact/NSCBZ1orfPNYa4wRucL8VZ (özel; paylaşım ürün sahibinde)

## Bağlam

2026-09-24 uyumluluk denetimi, filtre ve biyolojik yük kurallarının sıradan akvaryumlara "tehlike" dediğini buldu. 2026-09-28 ölçümleri (motor 1.2.0, gerçek katalog):

- Hem debisi hem üretici hacim önerisi olan 344 filtrenin 331'i, üreticinin önerdiği en büyük akvaryumda kullanıldığında "Filtrasyon sınırda" tehlikesi alıyordu. Kural etiket debisinin %65'ini sayıp saatte en az 5 çevrim istiyordu; bu, etiket debisiyle saatte yaklaşık 7,7 çevrim demek. Üreticiler filtrelerini en büyük önerdikleri hacimde saatte ortanca 4 çevrime göre derecelendiriyor.
- Biyolojik yük "adet × yetişkin boy × atık katsayısı" ile hesaplanıyordu. Atık katsayısının kaynağı yok. 417 türün 132'si, kaynağının önerdiği en küçük akvaryumda ve grupta tek başına bile uyarı veya tehlike alıyordu. 100 L'de 12 neon, 6 panda çöpçü ve 1 cüce vatoz kırmızı yük uyarısı alıyordu.
- Genel puan sekiz ölçütün ortalaması olduğu için 32 altın fikstür vakası kırmızı bir uyarı taşıdığı halde "iyi" görünüyordu; ana sayfa bu durumda "sorun görünmüyor" diyebiliyordu.

## Karar

### Filtre

- Her çalışan ana filtrenin karşılayabildiği hacim toplanır. Üretici hacim önerisi (`recommendedMaxL`) olan filtrede öneri uygunluk sınırı, 1,5 katı tehlike sınırıdır. Önerisi olmayan filtrede etiket debisinin saatte 4 çevrime karşılık geldiği hacim uygunluk sınırı, saatte 2 çevrime karşılık geldiği hacim tehlike sınırıdır. Akvaryumun net hacmi uygunluk sınırları toplamının içindeyse uygun, tehlike sınırları toplamının içindeyse uyarı, üstündeyse tehlike.
- Yalnız hacim önerili filtrelerde bu, "önerinin içi uygun, %50'ye kadar aşım uyarı (`Filtre üretici önerisinin üstünde`), fazlası tehlike (`Filtre bu akvaryum için küçük`)" demektir. Yalnız debili filtrelerde "etiket debisiyle saatte 4 çevrim ve üstü uygun, 2–4 uyarı (`Filtre debisi düşük olabilir`), 2'nin altı tehlike (`Filtre debisi yetersiz`)" demektir. İkisinin karışımında uyarı başlığı `Filtre kapasitesi düşük olabilir`, tehlike başlığı `Filtre bu akvaryum için küçük` olur.
- Hacim önerisi olan motorlu filtre, debisi yayımlanmamış olsa da hesaba hazır sayılır; veri güvenini düşürmez ve "Ekipman kapasite bilgisi eksik" uyarısı almaz (Codex 1. tur bulgusu).
- Hava motoru olmayan sünger filtre su çevirmediği için hesaba girmez; eski davranış (puan 45, "Sünger filtre için hava motoru gerekli") korunur.
- Tahmini yük artık filtre hedefini yükseltmez.
- Düşük akıntı seven türlerde "Filtre akışı güçlü olabilir" uyarısı değişmedi.

### Biyolojik yük

- Tahmini yük hiçbir zaman tehlike vermez. Yük oranı 2,5'i aşarsa uyarı verir ve ölçüt puanı 60 olur; altında puan `100 − oran × 10` olur (en az 75, "iyi").
- 2,5, katalogdaki hiçbir türün kendi kaynağının önerdiği en küçük akvaryum ve grupta ulaşmadığı değerdir (en yüksek 2,35).
- Gerçek yük amonyak, nitrit ve nitrat ölçümleriyle (kural seti 1.2.0), tür başına gereken hacim kaynaklı "Yüzme alanı" kuralıyla değerlendirilmeye devam eder.

### Genel durum

- Kesin tehlike (0008) genel puanı en fazla 49 yapar.
- Bunun dışında herhangi bir tehlike uyarısı varsa genel puan en fazla 74 olur ("dikkat"). Böylece kırmızı uyarı varken ana sayfa "sorun görünmüyor" demez.

Eşikler `packages/compatibility-engine/src/index.ts` başındaki adlandırılmış sabitlerdedir. `ENGINE_VERSION` ve `RULESET_VERSION` 1.3.0'a yükseltilir. Sonuç nesnesinin biçimi değişmez.

## Değerlendirilen alternatifler

- Yalnızca çevrim hedefini düşürmek (etiket debisiyle saatte 4): üretici sınırındaki filtrelerin 75'i tehlike, 81'i uyarı almaya devam ediyordu; 200 L'deki Eheim Classic 250 (üretici: 250 L'ye kadar) yine tehlikeydi.
- Yükü yalnızca bilgi olarak göstermek: yanlış alarm sıfırdı ama 100 L'de 60 neon, 30 panda ve 5 vatoz su bozulana kadar hiçbir uyarı almıyordu.

## Kaynaklar

- JBL CristalProfi kılavuzu: s. 28'e göre etiket ve kutudaki değerler hortumsuz ve medyasız boşta ölçülür (e402 450, e702 700, e902 900, e1502 1400, e1902 1900 L/saat); s. 29, 1,5 m hortum ve temiz medyayla yaklaşık değerleri verir (200–250, 350–400, 380–450, 800–900, 1100–1200 L/saat). İki tablodan hesap: gerçek debi etiketin %42–64'ü. https://www.manualslib.com/manual/1725229/Jbl-Cristal-Profi-E402-Greenline.html?page=28 · https://www.manualslib.com/manual/1725229/Jbl-Cristal-Profi-E402-Greenline.html?page=29
- Fluval 06 serisi kılavuzu (filtre sirkülasyonu pompa debisinin %59–68'i): https://fluvalaquatics.com/manuals/Fluval_A202-A207-A212-A217_06-Filter-Series_Manual_NA.pdf
- Eheim classic 250 (yaklaşık 250 litreye kadar, yaklaşık 440 L/saat): https://eheim.com/en_GB/aquatics/technology/external-filters/classic/classic-250
- Seriously Fish (etiket debisiyle saatte 4–5 çevrim): https://www.seriouslyfish.com/species/devario-devario
- Practical Fishkeeping (saatte 5–10 çevrim): https://www.practicalfishkeeping.co.uk/features/five-ways-for-you-to-achieve-crystal-clear-aquarium-water/
- AqAdvisor (üretici kapasitesinin %65'ini kullanır): https://aqadvisor.com/AqHelp.php
- OATA davranış kuralları (stoğu sayı, hacim veya yüzeyle belirlemek neredeyse imkânsız; değerler yalnızca tavsiye; belirleyici su kalitesi): https://ornamentalfish.org/wp-content/uploads/2015/10/CODE-OF-CONDUCT-FINAL-OCT-2015.pdf
- OATA ev akvaryumu rehberi (kaç balık konabileceği tam söylenemez; amonyak ve nitrit sıfır olmalı): https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-tropical-freshwater-fish/how-to-set-up-and-look-after-a-freshwater-tank-aquarium/
- VDA, Thieme üzerinden ("litre başına 1 cm" gibi formüller kaba ölçü): https://tiermedizin.thieme.de/aktuelles/vet-news/detail/aquarium-fischbesatz-mit-bedacht-362
- Practical Fishkeeping ve aquariumscience.org (boy temelli stok kuralları çok basit; ağırlık temelli hesap önerilir): https://www.practicalfishkeeping.co.uk/features/frequently-asked-questions-on-stocking-densities/ · https://aquariumscience.org/13-2-calculating-stocking-ratio/

Türe özel bir atık katsayısı yayımlayan güvenilir kaynak bulunamadı.

## Doğrulama

- `packages/compatibility-engine/test/filter-load.test.ts`: filtre hacmi ve debi eşiklerinin sınırları, birden fazla filtre, hacim önerili debisiz filtre, karışık filtre seti, sünger filtre ve hava motoru, yük eşiği, genel durum sınırı (stub kayıtlarla).
- `packages/compatibility-engine/test/audit-scenarios.test.ts`: denetimde bekleyen iki madde gerçek teste dönüştü (100 L'lik topluluk, 200 L'deki Eheim Classic 250); 200 L'deki JBL i60 ve beş kat kalabalık örnekleri eklendi.
- Altın fikstür onaydan sonra yeniden üretildi (1020 vaka; 1014'ü değişti) ve her fark sınıflandırıldı; açıklanamayan fark yok. Codex 1. tur düzeltmesinden sonra yeniden üretildiğinde yalnızca hacim önerili debisiz filtre kullanan 3 vaka (Aquael Ultra 900, 1200, 1400) değişti: veri güveni %50'den %100'e çıktı, "Ekipman kapasite bilgisi eksik" uyarısı kalktı. Kod değişikliğinden ayrı bir commit'te kaydedildi (`cc3b1a2`).

## Sonuçlar

- Üreticisinin önerdiği şekilde kullanılan filtreler ve normal topluluklar artık kırmızı görünmez; gerçekten küçük filtre ve belirgin aşırı kalabalık uyarı almaya devam eder.
- Kırmızı uyarı taşıyan akvaryum genel durumda en fazla "dikkat" görünür.
- Canberk eşik kararlarını güvenilir kaynaklara bıraktı (2026-09-28). Karar sayfasındaki dört soru kaynaklara göre cevaplandı: sarı yük uyarısı belirgin aşırı kalabalıkta başlar (2,5; OATA ve VDA stok kurallarını kaba ölçü sayıyor); üretici hacminin tamamı uygun sayılır (üreticilerin ortancası etiket debisiyle saatte 4 çevrim, Seriously Fish saatte 4–5 öneriyor); öneri yoksa etiket debisiyle saatte 4 çevrim; türe özel atık katsayısı yayımlayan güvenilir kaynak yok. Eşik değişikliği yeniden ürün sahibi onayı ister.
- Ele alınmayanlar (ayrı görevler): davranış uyarıları (yüzgeç ısırma, küçük balık ve karides avlama, iki erkek beta), alan uyarısının şiddeti, ağırlık temelli yük hesabı.

## Geri alma

Kod değişikliği tek commit'tir; geri alındığında motor 1.2.0 davranışına döner ve altın fikstür commit'i de geri alınır. Kullanıcı verisi ve depolama biçimi etkilenmez.
