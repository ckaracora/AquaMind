# 0035 — Harici termostat gerektiren ısıtıcı

- Tarih: 2026-10-31
- Durum: Kabul edildi. Ürün sahibi 2026-11-09 tarihinde Dophin AH-1002
  güvenlik kuralını ve 1.066 vakalık altın test güncellemesini açıkça onayladı.

## Bağlam

Katalog ana entegrasyonunda Dophin AH-1002 10 W kaydı üreticinin güncel resmî
sayfasından geri alındı. Üretici cihaz için 10 W ve 20 litreye kadar kullanım
yayımlıyor; aynı sayfada sabit sıcaklık kontrolü bulunmadığını ve sıcaklığın ayrı
termometreyle izlenmesi gerektiğini belirtiyor. Bu nedenle cihazı yalnız watt ve
hacim alanlarına bakarak kendi kendini düzenleyen normal bir akvaryum ısıtıcısı
gibi değerlendirmek güvenli değildir.

Kaynak:
https://www.qimeigroup.com/Products_detail/dophin-preset-plastic-heater-ah1000.html
(2026-10-27 tarihinde doğrulandı).

## Kabul edilen karar

1. Ekipman profiline isteğe bağlı `requiresExternalTemperatureControl` alanı
   eklenir. Yalnız kaynak açıkça cihazın kendi sıcaklığını düzenlemediğini
   gösterdiğinde `true` olur; tahmin edilmez.
2. Bu cihaz tek başına güvenli ısıtma kapasitesine sayılmaz. Isıtıcı ölçütü 35
   ve tehlike durumunda olur; veri güveninde hesaplamaya hazır sayılmaz.
3. Kullanıcıya "Harici sıcaklık kontrolü gerekli" tehlike uyarısı gösterilir:
   harici termostatlı kontrol ve ayrı termometre olmadan birincil akvaryum
   ısıtıcısı olarak kullanılmamalıdır.
4. Yanında normal, kapasitesi doğrulanmış bir ısıtıcı varsa normal ısıtıcının
   kapasite hesabı değişmez; kontrolsüz cihaz ayrıca güvenlik uyarısı üretir.
5. `ENGINE_VERSION` 1.12.0 ve `RULESET_VERSION` 1.10.0'a yükseltilir. Motor,
   Türkçe dil kaydı, bağımsız ısıtıcı testleri ve altın karşılaştırma aynı
   görevde güncellenir.

## Değerlendirilen seçenekler

- **Normal 10 W ısıtıcı saymak:** üreticinin sabit sıcaklık kontrolü olmadığı
  bilgisini yok sayar ve aşırı ısınma riskini kullanıcıdan saklar; reddedildi.
- **Ürünü katalogdan çıkarmak:** kullanıcının gerçek cihazını bulmasını engeller;
  model ve resmî teknik bilgi doğrulanmış olduğu için reddedildi.
- **Yalnız bilgi notu göstermek:** cihaz otomatik kapasite hesabına girmeye devam
  edeceği için güvenli değildir; reddedildi.

## Doğrulama planı

- `packages/compatibility-engine/test/heater.test.ts`: cihazın kapasiteye
  girmemesi, tehlike uyarısı, veri güveni ve normal ısıtıcıyla birlikte davranış.
- `src/lib/__tests__/engine-text.test.ts`: uyarı ve ölçüt metninin motorla birebir
  aynı olması.
- `scripts/test-catalog-flow.cjs`: AH-1002 kaydının işareti ve resmî kaynağı.
- Altın farklar salt okunur denetimle sınıflandırıldıktan sonra fikstürün ayrı
  adımda yenilenmesi ve tam `pnpm verify`.
