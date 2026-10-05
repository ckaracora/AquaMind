// Sürüm sabitleri sonuç nesnesine EKLENMEZ; mevcut `analyzeAquarium` çıktısının
// biçimi Phase 0B'de birebir korunur. Bu sabitler, Phase 1'de kalıcı hesaplama
// kayıtlarına ("hangi motor ve kural seti bu puanı üretti?") eşlik etmek içindir.
//
// ENGINE_VERSION: hesaplama kodunun sürümü. Puanı veya uyarıları değiştiren her
// kod değişikliğinde yükseltilir.
// RULESET_VERSION: motorun içine gömülü eşik ve ceza sabitlerinin sürümü
// (0,85 etkin hacim, 0,65 filtre verimi, 0,5–1,5 W/L ısıtıcı bandı, 80 yaşam ortamı ve
// 55/55/20/60/60/30 uyum cezaları, %40 avlanma oranı). Bir sabit değişince yükseltilir.
//
// 1.1.0: katalog entegrasyonuyla yaşam ortamı, tuzluluk, birey başına ek hacim ve
// yardımcı filtre kuralları eklendi (bkz. docs/DECISIONS/0007-katalog-entegrasyonu-motor-kurallari.md).
//
// 1.2.0: amonyak, nitrit ve nitrat değerlendirmesi (OATA eşikleri) ve kesin tehlikenin genel
// durumu "tehlike"ye çekmesi eklendi (bkz. docs/DECISIONS/0008-su-kalitesi-ve-kesin-tehlike.md).
//
// 1.3.0: filtre yeterliliği üretici hacim önerisine (yoksa etiket debisiyle saatteki çevrime) göre;
// tahmini biyolojik yük yalnızca belirgin aşırı kalabalıkta uyarı verir; kesin olmayan bir tehlike uyarısı
// varken genel durum en fazla "dikkat" olur (bkz. docs/DECISIONS/0009-filtre-yuk-ve-genel-durum.md).
//
// 1.4.0: kaynaklı davranış uyarıları: yüzgeç ısırma, cüce karides, fırsatçı avcı ve aynı tür
// saldırganlığı; hepsi uyarı seviyesinde (bkz. docs/DECISIONS/0010-davranis-uyarilari.md).
//
// 1.5.0: taban ısıtma kablosu gibi pasif ısıtıcı kayıtları ısıtıcı kapasitesine katılmaz
// (bkz. docs/DECISIONS/0011-katalog-entegrasyonu-2-taban-isiticisi.md).
//
// 1.6.0: alan uyarısının şiddeti. Akvaryum kaynağın önerisinin ve İsviçre Hayvan Koruma Yönetmeliği'nin
// balık boyuna göre ölçü sınırının (uzunluk 3×, genişlik 2×, derinlik 1×) altındaysa alan uyarısı tehlikedir
// (bkz. docs/DECISIONS/0012-alan-uyarisinin-siddeti.md).
//
// 1.7.0: kaynağı açıkça "salyangoz yer" diyen balık salyangozla birlikteyse sarı uyarı
// (bkz. docs/DECISIONS/0013-salyangoz-uyarisi.md).
export const ENGINE_VERSION = "1.7.0";
export const RULESET_VERSION = "1.7.0";
