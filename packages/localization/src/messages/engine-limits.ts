// Motor metinlerinde yazılan sabit sınırlar. Her dilin motor dosyası buradan alır; böylece İngilizce dosya Türkçe dosyayı içe aktarmaz
// (dil paketi yalnız kendi metinlerini taşır).
/** Özgül ağırlığın güvenli aralığı: OATA'nın iki ev akvaryumu hedefinin birleşimi; motorun `MARINE_SPECIFIC_GRAVITY_SAFE` sabitiyle aynı olmalı (testte denetlenir). */
export const MARINE_SPECIFIC_GRAVITY_SAFE_MIN = 1.017;
export const MARINE_SPECIFIC_GRAVITY_SAFE_MAX = 1.026;
/** Nitrat sınırları (ppm); motorun `MARINE_NITRATE_LIMIT`, `TAP_WATER_NITRATE_LIMIT` ve `NITRATE_ABOVE_TAP_LIMIT` sabitleriyle aynı olmalı (testte denetlenir). */
export const MARINE_NITRATE_LIMIT_PPM = 100;
export const TAP_WATER_NITRATE_LIMIT_PPM = 50;
export const NITRATE_ABOVE_TAP_LIMIT_PPM = 50;
