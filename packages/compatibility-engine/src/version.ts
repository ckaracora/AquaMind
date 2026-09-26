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
export const ENGINE_VERSION = "1.1.0";
export const RULESET_VERSION = "1.1.0";
