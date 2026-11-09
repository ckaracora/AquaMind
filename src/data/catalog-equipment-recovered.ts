import type { EquipmentProfile } from "./catalog-equipment";

// Güncel main ile eski katalog dalı kaynak tarihi karşılaştırılarak mekanik olarak seçildi:
// yalnız eski dalda bulunan kayıtlar ve eski dalda doğrulama tarihi daha yeni olan kayıtlar.
export const recoveredEquipmentCatalog: EquipmentProfile[] = [
  {
    "id": "dophin-950f",
    "category": "filter",
    "brand": "Dophin",
    "model": "950F",
    "specifications": "Kompakt, dalga yapma ve oksijenlendirme işlevli iç filtre · 230 V / 50 Hz · 470 L/saat · 7 W · 90 litreye kadar",
    "ratedFlowLph": 470,
    "powerW": 7,
    "recommendedMaxL": 90,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-internal-filter-950f.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-960f",
    "category": "filter",
    "brand": "Dophin",
    "model": "960F",
    "specifications": "Kompakt, dalga yapma ve oksijenlendirme işlevli iç filtre · 230 V / 50 Hz · 1030 L/saat · 16 W · 180 litreye kadar",
    "ratedFlowLph": 1030,
    "powerW": 16,
    "recommendedMaxL": 180,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-internal-filter-950f.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-970f",
    "category": "filter",
    "brand": "Dophin",
    "model": "970F",
    "specifications": "Kompakt, dalga yapma ve oksijenlendirme işlevli iç filtre · 230 V / 50 Hz · 1500 L/saat · 24,8 W · üretici hacmi aynı tabloda 180 L / 73 gal olarak çelişkili yayımladığından otomatik hacim sınırı kullanılmaz",
    "ratedFlowLph": 1500,
    "powerW": 24.8,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-internal-filter-950f.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-980f",
    "category": "filter",
    "brand": "Dophin",
    "model": "980F",
    "specifications": "Kompakt, dalga yapma ve oksijenlendirme işlevli iç filtre · 230 V / 50 Hz · 1550 L/saat · 29,3 W · 300 litreye kadar",
    "ratedFlowLph": 1550,
    "powerW": 29.3,
    "recommendedMaxL": 300,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-internal-filter-950f.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "aquawing-aqa3000",
    "category": "air_pump",
    "brand": "Aquawing",
    "model": "AQ-A3000",
    "specifications": "Çift çıkışlı akvaryum hava kompresörü · 960 L/saat · 25 W · ürün kodu AQ-A3000 · barkod 8690000438723",
    "ratedFlowLph": 960,
    "powerW": 25,
    "sourceUrl": "https://www.petlebi.com/akvaryum-urunleri/aquawing-aq-a3000-cift-cikisli-akvaryum-hava-kompresoru-25w.html",
    "additionalSourceUrls": [
      "https://www.petlebi.com/hava-motorlari",
      "https://www.batipettoptan.com/detay/16856/aqa3000-aquawing-hava-motoru-25w.html",
      "https://www.akvaryumexpress.com/aquawing"
    ],
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "aquawing-aqa1000",
    "category": "air_pump",
    "brand": "Aquawing",
    "model": "AQ-A1000",
    "specifications": "Çift çıkışlı akvaryum hava motoru · 8 W · ürün kodu AQ-A1000 · barkod 8690000438709 · hava debisi yayımlanmamış",
    "powerW": 8,
    "capacityDataNote": "28 Ekim 2026 son denetiminde güncel Türkiye ürün/tedarikçi sayfaları ve tam ambalaj görseli çift çıkış, 8 W güç, ürün kodu ve barkodu doğruladı; hiçbiri hava debisi veya önerilen akvaryum hacmi yayımlamadı. Benzer Aquawing modellerinin debisi aktarılmadığı için otomatik kapasite hesabına katılmaz.",
    "sourceUrl": "https://eksenpet.com/akvaryum/hava-motorlari/hava-komprosorleri/prd-aq-a1000-aquawing-hava-motoru-8w",
    "additionalSourceUrls": [
      "https://www.batipettoptan.com/detay/16855/aqa1000-aquawing-hava-motoru-8w.html",
      "https://www.petlebi.com/akvaryum-urunleri/aquawing-aq-a1000-cift-cikisli-akvaryum-hava-kompresoru-8w.html",
      "https://images.petlebi.com/v7/_ptlb/up/ecommerce/product/lg_aquawing-hava-motorlari-643453421.jpg"
    ],
    "verifiedAt": "2026-10-28"
  },
  {
    "id": "aquawing-aqa2000",
    "category": "air_pump",
    "brand": "Aquawing",
    "model": "AQ-A2000",
    "specifications": "Çift çıkışlı akvaryum hava motoru · 12 W · ürün kodu AQ-A2000 · barkod 8690000438716 · hava debisi yayımlanmamış",
    "powerW": 12,
    "capacityDataNote": "28 Ekim 2026 son denetiminde güncel Türkiye ürün/tedarikçi sayfaları ve tam ambalaj görseli çift çıkış, 12 W güç, ürün kodu ve barkodu doğruladı; hiçbiri hava debisi veya önerilen akvaryum hacmi yayımlamadı. Benzer Aquawing modellerinin debisi aktarılmadığı için otomatik kapasite hesabına katılmaz.",
    "sourceUrl": "https://eksenpet.com/akvaryum/hava-motorlari/hava-komprosorleri/prd-aq-a2000-aquawing-hava-motoru-12w",
    "additionalSourceUrls": [
      "https://www.batipettoptan.com/detay/16857/aqa2000-aquawing-hava-motoru-12w.html",
      "https://www.akvaryumexpress.com/aq-a2000-aquawing-hava-motoru-12w",
      "https://www.akvaryumexpress.com/uploads/urunler/aq-a2000-aquawing-hava-motoru-12w-27924.jpg"
    ],
    "verifiedAt": "2026-10-28"
  },
  {
    "id": "tropical-cristal-baby-30",
    "category": "filter",
    "brand": "Tropical",
    "model": "Cristal Baby Filter 30 l",
    "specifications": "Harici hava motoruyla çalışan mekanik/biyolojik iç sünger filtre · tatlı ve deniz suyu · 30 litreye kadar · 5 × 5 cm sünger, 9 cm uzunluk · ürün kodu 00211 · EAN 5900469002117 · sabit debisi yok; akış kullanılan hava motoruna bağlıdır",
    "recommendedMaxL": 30,
    "requiresAirPump": true,
    "sourceUrl": "https://tropical.pl/tropical/product/cristal-baby-filter-30-l",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "tropical-cristal-mini-40",
    "category": "filter",
    "brand": "Tropical",
    "model": "Cristal Mini Filter 40 l",
    "specifications": "Harici hava motoruyla çalışan mekanik/biyolojik iç sünger filtre · tatlı ve deniz suyu · 40 litreye kadar · 5 × 6 cm sünger, 9 cm uzunluk · ürün kodu 00212 · EAN 5900469002124 · sabit debisi yok; akış kullanılan hava motoruna bağlıdır",
    "recommendedMaxL": 40,
    "requiresAirPump": true,
    "sourceUrl": "https://tropical.pl/tropical/product/cristal-mini-filter-40-l",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "tropical-cristal-standard-60",
    "category": "filter",
    "brand": "Tropical",
    "model": "Cristal Standard Filter 60 l",
    "specifications": "Harici hava motoruyla çalışan mekanik/biyolojik iç sünger filtre · tatlı ve deniz suyu · 60 litreye kadar · 6 × 6 cm sünger, 11 cm uzunluk · ürün kodu 00215 · EAN 5900469002155 · sabit debisi yok; akış kullanılan hava motoruna bağlıdır",
    "recommendedMaxL": 60,
    "requiresAirPump": true,
    "sourceUrl": "https://tropical.pl/tropical/product/-cristal-standard-filter-60-l",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "tropical-cristal-midi-80",
    "category": "filter",
    "brand": "Tropical",
    "model": "Cristal Midi Filter 80 l",
    "specifications": "Harici hava motoruyla çalışan mekanik/biyolojik iç sünger filtre · tatlı ve deniz suyu · 80 litreye kadar · 7 × 7 cm sünger, 13 cm uzunluk · ürün kodu 80214 · EAN 5900469802144 · sabit debisi yok; akış kullanılan hava motoruna bağlıdır",
    "recommendedMaxL": 80,
    "requiresAirPump": true,
    "sourceUrl": "https://tropical.pl/tropical/product/cristal-midi-filter-80-l",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "tropical-cristal-maxi-100",
    "category": "filter",
    "brand": "Tropical",
    "model": "Cristal Maxi Filter 100 l",
    "specifications": "Harici hava motoruyla çalışan mekanik/biyolojik iç sünger filtre · tatlı ve deniz suyu · 100 litreye kadar · 8 × 8 cm sünger, 15 cm uzunluk · ürün kodu 00216 · EAN 5900469002162 · sabit debisi yok; akış kullanılan hava motoruna bağlıdır",
    "recommendedMaxL": 100,
    "requiresAirPump": true,
    "sourceUrl": "https://tropical.pl/tropical/product/cristal-maxi-filter-100l",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "tropical-delfin-single-150",
    "category": "filter",
    "brand": "Tropical",
    "model": "Delfin Single Filter 150 l",
    "specifications": "Harici hava motoruyla çalışan mekanik/biyolojik iç sünger filtre · tatlı ve deniz suyu · 150 litreye kadar · Ø 9 cm sünger, 17 cm uzunluk · ürün kodu 00241 · EAN 5900469002414 · sabit debisi yok; akış kullanılan hava motoruna bağlıdır",
    "recommendedMaxL": 150,
    "requiresAirPump": true,
    "sourceUrl": "https://tropical.pl/tropical/product/delfin-single-filter-150l",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "tropical-super-delfin-double-300",
    "category": "filter",
    "brand": "Tropical",
    "model": "Super Delfin Double Filter 300 l",
    "specifications": "Harici hava motoruyla çalışan çift süngerli mekanik/biyolojik iç filtre · tatlı ve deniz suyu · 300 litreye kadar · 9 × 9 cm süngerler, 17 cm uzunluk · ürün kodu 00242 · EAN 5900469002421 · sabit debisi yok; akış kullanılan hava motoruna bağlıdır",
    "recommendedMaxL": 300,
    "requiresAirPump": true,
    "sourceUrl": "https://tropical.pl/tropical/product/super-delfin-double-filter-300l",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "tropical-kegel",
    "category": "other",
    "brand": "Tropical",
    "model": "Kegel Discus Spawning Cone",
    "specifications": "Diskuslar için güvenli plastik yumurtlama konisi · yoğun yumurtlama sırasında devrilmeyi önleyen dengeli yapı · 1 adet · ürün kodu 84001 · bağımsız filtre, motor veya akvaryum kapasitesi sağlayan cihaz değildir",
    "passiveComponent": true,
    "sourceUrl": "https://tropical.pl/tropical/product/kegel-1",
    "additionalSourceUrls": [
      "https://tropical.pl/upload/files/katalog-produktow-tropical-2026.pdf"
    ],
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "tropical-plastic-hose-200m",
    "category": "other",
    "brand": "Tropical",
    "model": "Plastic Hose 4/6 mm · 200 m",
    "specifications": "Çok amaçlı şeffaf plastik hortum rulosu · 200 m · 4 mm iç, 6 mm dış çap · ürün kodu 02413 · bağımsız hava motoru, filtre veya debi sağlayan cihaz değildir",
    "passiveComponent": true,
    "sourceUrl": "https://tropical.pl/tropical/products_line_details/media-filtracyjne",
    "additionalSourceUrls": [
      "https://tropical.pl/upload/files/katalog-produktow-tropical-2026.pdf"
    ],
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "tropical-fish-transport-bags-17x40",
    "category": "other",
    "brand": "Tropical",
    "model": "Fish Transport Bags 17 × 40 cm · 50 pcs",
    "specifications": "Balık taşıma poşeti · 17 × 40 cm · 50 adet · ürün kodu 83301 · pasif sarf malzemesidir; filtrasyon, havalandırma veya akvaryum kapasitesi sağlamaz",
    "passiveComponent": true,
    "sourceUrl": "https://tropical.pl/upload/files/katalog-produktow-tropical-2026.pdf",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "tropical-fish-transport-bags-24x57",
    "category": "other",
    "brand": "Tropical",
    "model": "Fish Transport Bags 24 × 57 cm · 50 pcs",
    "specifications": "Balık taşıma poşeti · 24 × 57 cm · 50 adet · ürün kodu 83302 · pasif sarf malzemesidir; filtrasyon, havalandırma veya akvaryum kapasitesi sağlamaz",
    "passiveComponent": true,
    "sourceUrl": "https://tropical.pl/upload/files/katalog-produktow-tropical-2026.pdf",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-uvc-xtreme-800",
    "category": "filter",
    "brand": "Sera",
    "model": "UVC-Xtreme 800",
    "specifications": "Elektronik ayarlı UV-C dış filtre · 450–840 L/saat · azami 24 W · 5 W UV-C · 100–800 L",
    "ratedFlowLph": 840,
    "powerW": 24,
    "integratedUvcW": 5,
    "recommendedMinL": 100,
    "recommendedMaxL": 800,
    "adjustableFlow": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-uvc-xtreme-external-filters/",
    "additionalSourceUrls": [
      "https://www.sera.de/fileadmin/user_upload/manuals/sourcefiles/45071_45072_-int-_sera-uvc-xtreme-800-1200_09_2017.pdf"
    ],
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-uvc-xtreme-1200",
    "category": "filter",
    "brand": "Sera",
    "model": "UVC-Xtreme 1200",
    "specifications": "Elektronik ayarlı UV-C dış filtre · 570–1220 L/saat · azami 34 W · 5 W UV-C · 200–1200 L",
    "ratedFlowLph": 1220,
    "powerW": 34,
    "integratedUvcW": 5,
    "recommendedMinL": 200,
    "recommendedMaxL": 1200,
    "adjustableFlow": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-uvc-xtreme-external-filters/",
    "additionalSourceUrls": [
      "https://www.sera.de/fileadmin/user_upload/manuals/sourcefiles/45071_45072_-int-_sera-uvc-xtreme-800-1200_09_2017.pdf"
    ],
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-bioactive-if-400-uv",
    "category": "filter",
    "brand": "Sera",
    "model": "bioactive IF 400 + UV",
    "specifications": "Ayarlanabilir pompalı, yüzey emişli UV-C iç filtre · 750 L/saat · 12 W pompa + 5 W UV-C · 400 litreye kadar",
    "ratedFlowLph": 750,
    "powerW": 17,
    "integratedUvcW": 5,
    "recommendedMaxL": 400,
    "adjustableFlow": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-bioactive-if-400-uv/",
    "additionalSourceUrls": [
      "https://www.sera.de/fileadmin/user_upload/manuals/sourcefiles/30598_sera_bioactive_IF_400UV_2014-08_INT.pdf"
    ],
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-internal-filter-f400-adjustable",
    "category": "filter",
    "brand": "Sera",
    "model": "internal filter F400 adjustable",
    "specifications": "Ayarlanabilir ince süngerli iç filtre · 400 L/saat · 4 W · ürün no. 06821",
    "ratedFlowLph": 400,
    "powerW": 4,
    "adjustableFlow": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-internal-filter-f-adjustable/",
    "additionalSourceUrls": [
      "https://www.sera.de/fileadmin/user_upload/manuals/sourcefiles/06821_06825_06827_sera_Innenfilter_F_400_700_1200_2017-04_INT.pdf"
    ],
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-internal-filter-f700-adjustable",
    "category": "filter",
    "brand": "Sera",
    "model": "internal filter F700 adjustable",
    "specifications": "Ayarlanabilir ince süngerli iç filtre · 700 L/saat · 5 W · ürün no. 06825",
    "ratedFlowLph": 700,
    "powerW": 5,
    "adjustableFlow": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-internal-filter-f-adjustable/",
    "additionalSourceUrls": [
      "https://www.sera.de/fileadmin/user_upload/manuals/sourcefiles/06821_06825_06827_sera_Innenfilter_F_400_700_1200_2017-04_INT.pdf"
    ],
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-internal-filter-f1200-adjustable",
    "category": "filter",
    "brand": "Sera",
    "model": "internal filter F1200 adjustable",
    "specifications": "Ayarlanabilir ince süngerli iç filtre · 1200 L/saat · 15 W · ürün no. 06827",
    "ratedFlowLph": 1200,
    "powerW": 15,
    "adjustableFlow": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-internal-filter-f-adjustable/",
    "additionalSourceUrls": [
      "https://www.sera.de/fileadmin/user_upload/manuals/sourcefiles/06821_06825_06827_sera_Innenfilter_F_400_700_1200_2017-04_INT.pdf"
    ],
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-internal-filter-l60",
    "category": "filter",
    "brand": "Sera",
    "model": "internal filter L60",
    "specifications": "Yavru ve larvalar için ince süngerli hava kaldırmalı iç filtre · ürün no. 08500 · bağımsız hava motoru gerekir",
    "requiresAirPump": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-internal-filter-l/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-internal-filter-l150",
    "category": "filter",
    "brand": "Sera",
    "model": "internal filter L150",
    "specifications": "Yavru ve larvalar için ince süngerli hava kaldırmalı iç filtre · ürün no. 08520 · bağımsız hava motoru gerekir",
    "requiresAirPump": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-internal-filter-l/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-internal-filter-l300",
    "category": "filter",
    "brand": "Sera",
    "model": "internal filter L300",
    "specifications": "Yavru ve larvalar için ince süngerli hava kaldırmalı iç filtre · ürün no. 08535 · bağımsız hava motoru gerekir",
    "requiresAirPump": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-internal-filter-l/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-prefix-filter",
    "category": "filter",
    "brand": "Sera",
    "model": "PrefiX Filter",
    "specifications": "Pompa veya dış filtreye bağlanan motorsuz ön/biyolojik/hızlı filtre · iki sepet · 1,6 L ek filtre hacmi · ürün no. 32155",
    "passiveComponent": true,
    "auxiliaryFiltration": true,
    "sourceUrl": "https://www.sera.de/us/product/freshwater-aquarium/sera-prefix-filter/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-x-change-daylight-sunrise-360",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED X-Change Tube daylight sunrise 360",
    "specifications": "Kısılabilir 20 V LED tüp · 360 mm · 5.9 W · 369 lm · 6.000–8.000 K doğal gün ışığı",
    "powerW": 5.9,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-led-x-change-tube-daylight-sunrise/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-x-change-daylight-sunrise-520",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED X-Change Tube daylight sunrise 520",
    "specifications": "Kısılabilir 20 V LED tüp · 520 mm · 11.8 W · 745 lm · 6.000–8.000 K doğal gün ışığı",
    "powerW": 11.8,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-led-x-change-tube-daylight-sunrise/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-x-change-daylight-sunrise-660",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED X-Change Tube daylight sunrise 660",
    "specifications": "Kısılabilir 20 V LED tüp · 660 mm · 14.9 W · 917 lm · 6.000–8.000 K doğal gün ışığı",
    "powerW": 14.9,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-led-x-change-tube-daylight-sunrise/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-x-change-daylight-sunrise-820",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED X-Change Tube daylight sunrise 820",
    "specifications": "Kısılabilir 20 V LED tüp · 820 mm · 18 W · 1086 lm · 6.000–8.000 K doğal gün ışığı",
    "powerW": 18,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-led-x-change-tube-daylight-sunrise/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-x-change-daylight-sunrise-965",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED X-Change Tube daylight sunrise 965",
    "specifications": "Kısılabilir 20 V LED tüp · 965 mm · 17.1 W · 1230 lm · 6.000–8.000 K doğal gün ışığı",
    "powerW": 17.1,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-led-x-change-tube-daylight-sunrise/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-x-change-daylight-sunrise-1120",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED X-Change Tube daylight sunrise 1120",
    "specifications": "Kısılabilir 20 V LED tüp · 1120 mm · 20.3 W · 1251 lm · 6.000–8.000 K doğal gün ışığı",
    "powerW": 20.3,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-led-x-change-tube-daylight-sunrise/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-x-change-daylight-sunrise-1420",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED X-Change Tube daylight sunrise 1420",
    "specifications": "Kısılabilir 20 V LED tüp · 1420 mm · 22 W · 1615 lm · 6.000–8.000 K doğal gün ışığı",
    "powerW": 22,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-led-x-change-tube-daylight-sunrise/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-x-change-plantcolor-sunrise-360",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED X-Change Tube plantcolor sunrise 360",
    "specifications": "Kısılabilir 20 V LED tüp · 360 mm · 4.3 W · 111 lm · 2.450–3.400 K bitki ve renk ışığı",
    "powerW": 4.3,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-led-x-change-tube-plantcolor-sunrise/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-x-change-plantcolor-sunrise-520",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED X-Change Tube plantcolor sunrise 520",
    "specifications": "Kısılabilir 20 V LED tüp · 520 mm · 7.9 W · 171 lm · 2.450–3.400 K bitki ve renk ışığı",
    "powerW": 7.9,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-led-x-change-tube-plantcolor-sunrise/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-x-change-plantcolor-sunrise-660",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED X-Change Tube plantcolor sunrise 660",
    "specifications": "Kısılabilir 20 V LED tüp · 660 mm · 9.3 W · 282 lm · 2.450–3.400 K bitki ve renk ışığı",
    "powerW": 9.3,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-led-x-change-tube-plantcolor-sunrise/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-x-change-plantcolor-sunrise-820",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED X-Change Tube plantcolor sunrise 820",
    "specifications": "Kısılabilir 20 V LED tüp · 820 mm · 10.1 W · 320 lm · 2.450–3.400 K bitki ve renk ışığı",
    "powerW": 10.1,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-led-x-change-tube-plantcolor-sunrise/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-x-change-plantcolor-sunrise-965",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED X-Change Tube plantcolor sunrise 965",
    "specifications": "Kısılabilir 20 V LED tüp · 965 mm · 12.3 W · 402 lm · 2.450–3.400 K bitki ve renk ışığı",
    "powerW": 12.3,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-led-x-change-tube-plantcolor-sunrise/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-x-change-plantcolor-sunrise-1120",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED X-Change Tube plantcolor sunrise 1120",
    "specifications": "Kısılabilir 20 V LED tüp · 1120 mm · 13.8 W · 440 lm · 2.450–3.400 K bitki ve renk ışığı",
    "powerW": 13.8,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-led-x-change-tube-plantcolor-sunrise/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-x-change-plantcolor-sunrise-1420",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED X-Change Tube plantcolor sunrise 1420",
    "specifications": "Kısılabilir 20 V LED tüp · 1420 mm · 18 W · 482 lm · 2.450–3.400 K bitki ve renk ışığı",
    "powerW": 18,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-led-x-change-tube-plantcolor-sunrise/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-x-change-cool-daylight-360",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED X-Change Tube cool daylight 360",
    "specifications": "Kısılabilir 20 V LED tüp · 360 mm · 7.2 W · 392 lm · 10.000–12.000 K mavimsi gün ışığı",
    "powerW": 7.2,
    "sourceUrl": "https://www.sera.de/en/product/marine-aquarium/sera-led-x-change-tube-cool-daylight/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-x-change-cool-daylight-520",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED X-Change Tube cool daylight 520",
    "specifications": "Kısılabilir 20 V LED tüp · 520 mm · 12 W · 649 lm · 10.000–12.000 K mavimsi gün ışığı",
    "powerW": 12,
    "sourceUrl": "https://www.sera.de/en/product/marine-aquarium/sera-led-x-change-tube-cool-daylight/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-x-change-cool-daylight-660",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED X-Change Tube cool daylight 660",
    "specifications": "Kısılabilir 20 V LED tüp · 660 mm · 16 W · 856 lm · 10.000–12.000 K mavimsi gün ışığı",
    "powerW": 16,
    "sourceUrl": "https://www.sera.de/en/product/marine-aquarium/sera-led-x-change-tube-cool-daylight/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-x-change-cool-daylight-820",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED X-Change Tube cool daylight 820",
    "specifications": "Kısılabilir 20 V LED tüp · 820 mm · 18 W · 1027 lm · 10.000–12.000 K mavimsi gün ışığı",
    "powerW": 18,
    "sourceUrl": "https://www.sera.de/en/product/marine-aquarium/sera-led-x-change-tube-cool-daylight/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-x-change-cool-daylight-965",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED X-Change Tube cool daylight 965",
    "specifications": "Kısılabilir 20 V LED tüp · 965 mm · 22 W · 1379 lm · 10.000–12.000 K mavimsi gün ışığı",
    "powerW": 22,
    "sourceUrl": "https://www.sera.de/en/product/marine-aquarium/sera-led-x-change-tube-cool-daylight/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-x-change-cool-daylight-1120",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED X-Change Tube cool daylight 1120",
    "specifications": "Kısılabilir 20 V LED tüp · 1120 mm · 23 W · 1452 lm · 10.000–12.000 K mavimsi gün ışığı",
    "powerW": 23,
    "sourceUrl": "https://www.sera.de/en/product/marine-aquarium/sera-led-x-change-tube-cool-daylight/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-x-change-cool-daylight-1420",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED X-Change Tube cool daylight 1420",
    "specifications": "Kısılabilir 20 V LED tüp · 1420 mm · 27 W · 1509 lm · 10.000–12.000 K mavimsi gün ışığı",
    "powerW": 27,
    "sourceUrl": "https://www.sera.de/en/product/marine-aquarium/sera-led-x-change-tube-cool-daylight/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-x-change-neutral-brilliant-white-360",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED X-Change Tube neutral brilliant white 360",
    "specifications": "Kısılabilir 20 V LED tüp · 360 mm · 7 W · 605 lm · 4.000 K nötr beyaz ışık",
    "powerW": 7,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-led-x-change-tube-neutral-brilliant-white/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-x-change-neutral-brilliant-white-520",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED X-Change Tube neutral brilliant white 520",
    "specifications": "Kısılabilir 20 V LED tüp · 520 mm · 8.2 W · 765 lm · 4.000 K nötr beyaz ışık",
    "powerW": 8.2,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-led-x-change-tube-neutral-brilliant-white/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-x-change-neutral-brilliant-white-660",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED X-Change Tube neutral brilliant white 660",
    "specifications": "Kısılabilir 20 V LED tüp · 660 mm · 10.2 W · 1053 lm · 4.000 K nötr beyaz ışık",
    "powerW": 10.2,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-led-x-change-tube-neutral-brilliant-white/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-x-change-neutral-brilliant-white-820",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED X-Change Tube neutral brilliant white 820",
    "specifications": "Kısılabilir 20 V LED tüp · 820 mm · 12.3 W · 1197 lm · 4.000 K nötr beyaz ışık",
    "powerW": 12.3,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-led-x-change-tube-neutral-brilliant-white/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-x-change-neutral-brilliant-white-965",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED X-Change Tube neutral brilliant white 965",
    "specifications": "Kısılabilir 20 V LED tüp · 965 mm · 14.8 W · 1358 lm · 4.000 K nötr beyaz ışık",
    "powerW": 14.8,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-led-x-change-tube-neutral-brilliant-white/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-x-change-neutral-brilliant-white-1120",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED X-Change Tube neutral brilliant white 1120",
    "specifications": "Kısılabilir 20 V LED tüp · 1120 mm · 17.8 W · 1725 lm · 4.000 K nötr beyaz ışık",
    "powerW": 17.8,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-led-x-change-tube-neutral-brilliant-white/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-x-change-neutral-brilliant-white-1420",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED X-Change Tube neutral brilliant white 1420",
    "specifications": "Kısılabilir 20 V LED tüp · 1420 mm · 20 W · 1980 lm · 4.000 K nötr beyaz ışık",
    "powerW": 20,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-led-x-change-tube-neutral-brilliant-white/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-x-change-marine-blue-sunrise-360",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED X-Change Tube marine blue sunrise 360",
    "specifications": "Kısılabilir 20 V LED tüp · 360 mm · 8.6 W · 104 lm · 18.000–22.000 K mavi deniz ışığı",
    "powerW": 8.6,
    "sourceUrl": "https://www.sera.de/us/product/marine-aquarium/sera-led-x-change-tube-marine-blue-sunrise/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-x-change-marine-blue-sunrise-520",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED X-Change Tube marine blue sunrise 520",
    "specifications": "Kısılabilir 20 V LED tüp · 520 mm · 13 W · 160 lm · 18.000–22.000 K mavi deniz ışığı",
    "powerW": 13,
    "sourceUrl": "https://www.sera.de/us/product/marine-aquarium/sera-led-x-change-tube-marine-blue-sunrise/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-x-change-marine-blue-sunrise-660",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED X-Change Tube marine blue sunrise 660",
    "specifications": "Kısılabilir 20 V LED tüp · 660 mm · 14 W · 172 lm · 18.000–22.000 K mavi deniz ışığı",
    "powerW": 14,
    "sourceUrl": "https://www.sera.de/us/product/marine-aquarium/sera-led-x-change-tube-marine-blue-sunrise/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-x-change-marine-blue-sunrise-820",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED X-Change Tube marine blue sunrise 820",
    "specifications": "Kısılabilir 20 V LED tüp · 820 mm · 16 W · 207 lm · 18.000–22.000 K mavi deniz ışığı",
    "powerW": 16,
    "sourceUrl": "https://www.sera.de/us/product/marine-aquarium/sera-led-x-change-tube-marine-blue-sunrise/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-x-change-marine-blue-sunrise-965",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED X-Change Tube marine blue sunrise 965",
    "specifications": "Kısılabilir 20 V LED tüp · 965 mm · 20 W · 245 lm · 18.000–22.000 K mavi deniz ışığı",
    "powerW": 20,
    "sourceUrl": "https://www.sera.de/us/product/marine-aquarium/sera-led-x-change-tube-marine-blue-sunrise/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-x-change-marine-blue-sunrise-1120",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED X-Change Tube marine blue sunrise 1120",
    "specifications": "Kısılabilir 20 V LED tüp · 1120 mm · 24 W · 289 lm · 18.000–22.000 K mavi deniz ışığı",
    "powerW": 24,
    "sourceUrl": "https://www.sera.de/us/product/marine-aquarium/sera-led-x-change-tube-marine-blue-sunrise/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-x-change-marine-blue-sunrise-1420",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED X-Change Tube marine blue sunrise 1420",
    "specifications": "Kısılabilir 20 V LED tüp · 1420 mm · 25 W · 331 lm · 18.000–22.000 K mavi deniz ışığı",
    "powerW": 25,
    "sourceUrl": "https://www.sera.de/us/product/marine-aquarium/sera-led-x-change-tube-marine-blue-sunrise/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-moonlight-set",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED Moonlight Set",
    "specifications": "Kısılabilir mavi LED tüp · 180 mm · 3 W · 173 lm · 10.000–12.000 K · 20 V · balast dahil değildir · ürün no. 32082",
    "powerW": 3,
    "sourceUrl": "https://www.sera.de/en/product/marine-aquarium/sera-led-moonlight-set/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-digital-dimmer",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED Digital Dimmer",
    "specifications": "sera LED sistemleri için zamanlayıcı ve ışık denetleyicisi · 10–20 V DC · azami 3 A ve toplam 60 W X-Change yükü · gün doğumu, gün batımı, bulut ve öğle senaryoları · ürün no. 31070",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/terrarium/sera-led-digital-dimmer/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-fixture-silver-400",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED fiXture silver 400",
    "specifications": "En çok üç LED X-Change Tube taşıyan armatür gövdesi · altı klips ve üçlü kablo dahil · LED tüpler dahil değildir · ürün no. 32781",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/marine-aquarium/sera-led-fixture/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-fixture-silver-800",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED fiXture silver 800",
    "specifications": "En çok üç LED X-Change Tube taşıyan armatür gövdesi · altı klips ve üçlü kablo dahil · LED tüpler dahil değildir · ürün no. 31279",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/marine-aquarium/sera-led-fixture/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-fixture-black-800",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED fiXture black 800",
    "specifications": "En çok üç LED X-Change Tube taşıyan armatür gövdesi · altı klips ve üçlü kablo dahil · LED tüpler dahil değildir · ürün no. 31278",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/marine-aquarium/sera-led-fixture/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-fixture-silver-1000",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED fiXture silver 1000",
    "specifications": "En çok üç LED X-Change Tube taşıyan armatür gövdesi · altı klips ve üçlü kablo dahil · LED tüpler dahil değildir · ürün no. 31281",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/marine-aquarium/sera-led-fixture/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-fixture-black-1000",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED fiXture black 1000",
    "specifications": "En çok üç LED X-Change Tube taşıyan armatür gövdesi · altı klips ve üçlü kablo dahil · LED tüpler dahil değildir · ürün no. 31280",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/marine-aquarium/sera-led-fixture/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-fixture-silver-1200",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED fiXture silver 1200",
    "specifications": "En çok üç LED X-Change Tube taşıyan armatür gövdesi · altı klips ve üçlü kablo dahil · LED tüpler dahil değildir · ürün no. 31283",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/marine-aquarium/sera-led-fixture/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-fixture-black-1200",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED fiXture black 1200",
    "specifications": "En çok üç LED X-Change Tube taşıyan armatür gövdesi · altı klips ve üçlü kablo dahil · LED tüpler dahil değildir · ürün no. 31282",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/marine-aquarium/sera-led-fixture/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-fixture-clips",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED fiXture Clips",
    "specifications": "sera LED fiXture için iki yedek LED tüp klipsi · ürün no. 31291",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/marine-aquarium/sera-led-fixture/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-tube-holder-clear",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED Tube Holder Clear",
    "specifications": "Azami 13 mm cam kalınlığında LED X-Change Tube montajı için iki şeffaf tutucu · ürün no. 31292",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/us/product/freshwater-aquarium/sera-led-tube-holder-clear/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-adapter-t5-short",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED Adapter T5 short",
    "specifications": "Mevcut T5 duylarına LED X-Change Tube takmak için adaptör · kısa sürüm · iki adet · ürün no. 31073",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/de/produkt/meerwasseraquarium/sera-led-adapter/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-adapter-t5",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED Adapter T5",
    "specifications": "Mevcut T5 duylarına LED X-Change Tube takmak için adaptör · ürün no. 31071",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/de/produkt/meerwasseraquarium/sera-led-adapter/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-adapter-t8",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED Adapter T8",
    "specifications": "Mevcut T8 duylarına LED X-Change Tube takmak için adaptör · ürün no. 31072",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/de/produkt/meerwasseraquarium/sera-led-adapter/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-triple-cable",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED Triple Cable",
    "specifications": "Tek balasta en çok üç LED X-Change Tube bağlayan dağıtım kablosu · ürün no. 31265",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/de/produkt/suesswasseraquarium/sera-led-triple-cable/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-extension-cable",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED Extension Cable",
    "specifications": "sera LED sistemi için 1,2 m uzatma kablosu · ürün no. 31290",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/de/produkt/suesswasseraquarium/sera-led-extension-cable/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-ballast-20v-1a",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED Ballast 20 V / 1 A",
    "specifications": "Toplam tüketimi 20 W altında olan sera LED sistemi için güç kaynağı · 20 V / 1 A · ürün no. 32072",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-led-ballast/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-driver-20v-3a",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED Driver 20 V / 3 A",
    "specifications": "Toplam tüketimi 60 W altında olan sera LED sistemi için güç kaynağı · 20 V / 3 A · ürün no. 32074",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-led-ballast/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-light",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED light",
    "specifications": "Üç adet 2 W LED çipli kısılabilir kelepçeli armatür · 6 W · 417,51 lm · 12 V · 40 cm genişliğe kadar akvaryum · azami 15 mm cam · ürün no. 31138",
    "powerW": 6,
    "sourceUrl": "https://www.sera.de/en/product/terrarium/sera-led-light/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-nano-led-light",
    "category": "lighting",
    "brand": "Sera",
    "model": "Nano LED light",
    "specifications": "Kısılabilir kelepçeli nano armatür · 4 W · 12 V · 30 cm genişliğe kadar akvaryum · azami 12 mm cam · ürün no. 31067",
    "powerW": 4,
    "sourceUrl": "https://www.sera.de/en/product/marine-aquarium/sera-nano-led-light/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-chip-daylight",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED Chip daylight",
    "specifications": "sera LED light için kısılabilir 12 V G4 yedek çip · iki adet · 1.6 W · 139 lm · 7.000 K · ürün no. 31163",
    "powerW": 1.6,
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/us/product/terrarium/sera-led-chips/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-chip-tropic-sun",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED Chip tropic sun",
    "specifications": "sera LED light için kısılabilir 12 V G4 yedek çip · iki adet · 1.3 W · 71 lm · 5.300 K · ürün no. 31174",
    "powerW": 1.3,
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/us/product/terrarium/sera-led-chips/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-chip-blue-light",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED Chip blue light",
    "specifications": "sera LED light için kısılabilir 12 V G4 yedek çip · iki adet · 1.7 W · 22 lm · 15.000 K · ürün no. 31157",
    "powerW": 1.7,
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/us/product/terrarium/sera-led-chips/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-chip-ultra-blue",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED Chip ultra blue",
    "specifications": "sera LED light için kısılabilir 12 V G4 yedek çip · iki adet · 1.5 W · 14 lm · ürün no. 31180",
    "powerW": 1.5,
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/us/product/terrarium/sera-led-chips/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-chip-azur",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED Chip azur",
    "specifications": "sera LED light için kısılabilir 12 V G4 yedek çip · iki adet · 1.5 W · 59 lm · ürün no. 31181",
    "powerW": 1.5,
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/us/product/terrarium/sera-led-chips/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-chip-cardinal-red",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED Chip cardinal red",
    "specifications": "sera LED light için kısılabilir 12 V G4 yedek çip · iki adet · 1.5 W · 39 lm · 2.609 K · ürün no. 31182",
    "powerW": 1.5,
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/us/product/terrarium/sera-led-chips/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-chip-plantcolor-bright",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED Chip plantcolor bright",
    "specifications": "sera LED light için kısılabilir 12 V G4 yedek çip · iki adet · 1.5 W · 52 lm · 5.105 K · ürün no. 31183",
    "powerW": 1.5,
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/us/product/terrarium/sera-led-chips/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-chip-plantcolor-dual-peak",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED Chip plantcolor dual peak",
    "specifications": "sera LED light için kısılabilir 12 V G4 yedek çip · iki adet · 1.4 W · 21 lm · ürün no. 31184",
    "powerW": 1.4,
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/us/product/terrarium/sera-led-chips/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-chip-red-vision",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED Chip red vision",
    "specifications": "sera LED light için kısılabilir 12 V G4 yedek çip · iki adet · 1.8 W · 35 lm · ürün no. 31185",
    "powerW": 1.8,
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/us/product/terrarium/sera-led-chips/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-chip-orange-sunset",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED Chip orange sunset",
    "specifications": "sera LED light için kısılabilir 12 V G4 yedek çip · iki adet · 1.7 W · 31 lm · ürün no. 31186",
    "powerW": 1.7,
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/us/product/terrarium/sera-led-chips/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-led-chip-uv-a",
    "category": "lighting",
    "brand": "Sera",
    "model": "LED Chip UV-A",
    "specifications": "sera LED light için kısılabilir 12 V G4 yedek çip · iki adet · 1.4 W · 1 lm · ürün no. 31187",
    "powerW": 1.4,
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/us/product/terrarium/sera-led-chips/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-fp-100",
    "category": "other",
    "brand": "Sera",
    "model": "FP 100",
    "specifications": "Ayarlanabilir dalgıç filtre, besleme ve sirkülasyon pompası · 120 L/saat · 1.5 W · tatlı su · 10–50 L · ürün no. 30593",
    "ratedFlowLph": 120,
    "powerW": 1.5,
    "recommendedMinL": 10,
    "recommendedMaxL": 50,
    "adjustableFlow": true,
    "sourceUrl": "https://www.sera.de/de/produkt/suesswasseraquarium/sera-filter-und-foerderpumpen-fp/",
    "additionalSourceUrls": [
      "https://www.sera.de/fileadmin/user_upload/manuals/sourcefiles/30593_30599_sera_fp_pumpen_2016-11.pdf"
    ],
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-fp-150",
    "category": "other",
    "brand": "Sera",
    "model": "FP 150",
    "specifications": "Ayarlanabilir dalgıç filtre, besleme ve sirkülasyon pompası · 150 L/saat · 2.5 W · tatlı su · 10–50 L · ürün no. 30599",
    "ratedFlowLph": 150,
    "powerW": 2.5,
    "recommendedMinL": 10,
    "recommendedMaxL": 50,
    "adjustableFlow": true,
    "sourceUrl": "https://www.sera.de/de/produkt/suesswasseraquarium/sera-filter-und-foerderpumpen-fp/",
    "additionalSourceUrls": [
      "https://www.sera.de/fileadmin/user_upload/manuals/sourcefiles/30593_30599_sera_fp_pumpen_2016-11.pdf"
    ],
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-fp-350",
    "category": "other",
    "brand": "Sera",
    "model": "FP 350",
    "specifications": "Ayarlanabilir dalgıç filtre, besleme ve sirkülasyon pompası · tatlı ve deniz suyu · 350 L/saat · 6 W · azami basma yüksekliği 0,8 m · hortum bağlantısı 13 mm · ürün no. 30594",
    "ratedFlowLph": 350,
    "powerW": 6,
    "adjustableFlow": true,
    "sourceUrl": "https://www.sera.de/de/produkt/suesswasseraquarium/sera-filter-und-foerderpumpen-fp/",
    "additionalSourceUrls": [
      "https://www.sera.de/fileadmin/user_upload/manuals/sourcefiles/30594_30600_30595_30596_30597_sera_fp_pumpen_2016-11.pdf"
    ],
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-fp-750",
    "category": "other",
    "brand": "Sera",
    "model": "FP 750",
    "specifications": "Ayarlanabilir dalgıç filtre, besleme ve sirkülasyon pompası · tatlı ve deniz suyu · 750 L/saat · 12 W · azami basma yüksekliği 1,5 m · hortum bağlantısı 13 mm · ürün no. 30600",
    "ratedFlowLph": 750,
    "powerW": 12,
    "adjustableFlow": true,
    "sourceUrl": "https://www.sera.de/de/produkt/suesswasseraquarium/sera-filter-und-foerderpumpen-fp/",
    "additionalSourceUrls": [
      "https://www.sera.de/fileadmin/user_upload/manuals/sourcefiles/30594_30600_30595_30596_30597_sera_fp_pumpen_2016-11.pdf"
    ],
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-fp-1000",
    "category": "other",
    "brand": "Sera",
    "model": "FP 1000",
    "specifications": "Ayarlanabilir dalgıç filtre, besleme ve sirkülasyon pompası · tatlı ve deniz suyu · 1000 L/saat · 16 W · azami basma yüksekliği 1,8 m · hortum bağlantısı 15 mm · ürün no. 30595",
    "ratedFlowLph": 1000,
    "powerW": 16,
    "adjustableFlow": true,
    "sourceUrl": "https://www.sera.de/de/produkt/suesswasseraquarium/sera-filter-und-foerderpumpen-fp/",
    "additionalSourceUrls": [
      "https://www.sera.de/fileadmin/user_upload/manuals/sourcefiles/30594_30600_30595_30596_30597_sera_fp_pumpen_2016-11.pdf"
    ],
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-fp-1500",
    "category": "other",
    "brand": "Sera",
    "model": "FP 1500",
    "specifications": "Ayarlanabilir dalgıç filtre, besleme ve sirkülasyon pompası · tatlı ve deniz suyu · 1500 L/saat · 25 W · azami basma yüksekliği 2,5 m · hortum bağlantısı 20 mm · ürün no. 30596",
    "ratedFlowLph": 1500,
    "powerW": 25,
    "adjustableFlow": true,
    "sourceUrl": "https://www.sera.de/de/produkt/suesswasseraquarium/sera-filter-und-foerderpumpen-fp/",
    "additionalSourceUrls": [
      "https://www.sera.de/fileadmin/user_upload/manuals/sourcefiles/30594_30600_30595_30596_30597_sera_fp_pumpen_2016-11.pdf"
    ],
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-fp-2000",
    "category": "other",
    "brand": "Sera",
    "model": "FP 2000",
    "specifications": "Ayarlanabilir dalgıç filtre, besleme ve sirkülasyon pompası · tatlı ve deniz suyu · 2000 L/saat · 43 W · azami basma yüksekliği 3 m · hortum bağlantısı 20 mm · ürün no. 30597",
    "ratedFlowLph": 2000,
    "powerW": 43,
    "adjustableFlow": true,
    "sourceUrl": "https://www.sera.de/de/produkt/suesswasseraquarium/sera-filter-und-foerderpumpen-fp/",
    "additionalSourceUrls": [
      "https://www.sera.de/fileadmin/user_upload/manuals/sourcefiles/30594_30600_30595_30596_30597_sera_fp_pumpen_2016-11.pdf"
    ],
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-uv-c-system-5w",
    "category": "uv",
    "brand": "Sera",
    "model": "UV-C System 5 W",
    "specifications": "Harici filtre veya pompaya bağlanan 5 W UV-C su berraklaştırıcısı · tatlı ve deniz suyu · 500 litreye kadar · ürün no. 08253",
    "powerW": 5,
    "recommendedMaxL": 500,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-uv-c-system-5-w/",
    "additionalSourceUrls": [
      "https://www.sera.de/fileadmin/user_upload/manuals/sourcefiles/08253_sera_uv-c-system_5_w.pdf"
    ],
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-uv-c-system-24w",
    "category": "uv",
    "brand": "Sera",
    "model": "UV-C System 24 W",
    "specifications": "Harici pompaya bağlanan 24 W UV-C su berraklaştırıcısı · tatlı su, deniz suyu ve havuz kullanımı · ürün no. 08249 · üretici akvaryum hacmi yayımlamıyor",
    "powerW": 24,
    "sourceUrl": "https://www.sera.de/en/product/marine-aquarium/sera-uv-c-system-24-w/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-algovec-uv",
    "category": "uv",
    "brand": "Sera",
    "model": "algovec UV",
    "specifications": "Ayarlanabilir FP 350 pompalı UV-C sistemi · 350 L/saat · 6 W pompa + 5 W UV-C · 100 litreye kadar · ürün no. 30606",
    "ratedFlowLph": 350,
    "powerW": 11,
    "integratedUvcW": 5,
    "recommendedMaxL": 100,
    "adjustableFlow": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-algovec-uv/",
    "additionalSourceUrls": [
      "https://www.sera.de/fileadmin/user_upload/manuals/sourcefiles/30606_sera_algovec_uv-c_2015-10_int.pdf"
    ],
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-plant-care-set",
    "category": "co2",
    "brand": "Sera",
    "model": "Plant Care Set",
    "specifications": "60–200 L akvaryumlar için CO₂-Start difüzyon reaktörü, 20 CO₂-Tabs plus, florena 100 ml ve florenette 24 tablet içeren bitki bakım seti",
    "recommendedMinL": 60,
    "recommendedMaxL": 200,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-plant-care-set/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-co2-start",
    "category": "co2",
    "brand": "Sera",
    "model": "CO₂-Start",
    "specifications": "Yaklaşık 120 litreye kadar akvaryumlar için difüzyon reaktörü ve CO₂-Tabs plus içeren basınçsız başlangıç sistemi · ürün no. 08039",
    "recommendedMaxL": 120,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-co2-start/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-flore-co2-fertilization-system",
    "category": "co2",
    "brand": "Sera",
    "model": "flore CO₂ fertilization system",
    "specifications": "300 litreye kadar akvaryumlar için 450 g yeniden doldurulabilir tüp, hassas regülatör, difüzör, 5 m hortum, çekvalf, uzun süreli gösterge ve adaptör içeren tam sistem · ürün no. 08060",
    "recommendedMaxL": 300,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-flore-co2-fertilization-system/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-flore-co2-pressure-reducer",
    "category": "co2",
    "brand": "Sera",
    "model": "flore CO₂ pressure reducer",
    "specifications": "50–60 bar tüp basıncını 0,1–2,5 bar çalışma basıncına düşüren, ince iğne valfli çift göstergeli regülatör · ürün no. 08037",
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-flore-co2-pressure-reducer/",
    "additionalSourceUrls": [
      "https://www.sera.de/fileadmin/user_upload/manuals/sourcefiles/08037_sera_flore_CO2_Druckminderer_2009_10_INT.pdf"
    ],
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-flore-co2-pressure-diffuser",
    "category": "co2",
    "brand": "Sera",
    "model": "flore CO₂ pressure diffuser",
    "specifications": "Entegre kabarcık sayaçlı ince gözenekli seramik basınç difüzörü · 2 barı aşmayan regülatör çıkışı gerekir · 300 litreye kadar · ürün no. 08056",
    "recommendedMaxL": 300,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-flore-co2-pressure-diffuser/",
    "additionalSourceUrls": [
      "https://www.sera.de/fileadmin/user_upload/manuals/sourcefiles/08056_sera_CO2_DruckDiffusor_2010_04_INT.pdf"
    ],
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-flore-co2-bubble-counter",
    "category": "co2",
    "brand": "Sera",
    "model": "flore CO₂ bubble counter",
    "specifications": "CO₂ dozunu görsel izlemek için kabarcık sayacı · ürün no. 08059",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-flore-co2-bubble-counter/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-flore-co2-active-reactor-500",
    "category": "co2",
    "brand": "Sera",
    "model": "flore CO₂ active reactor 500",
    "specifications": "250–600 L akvaryumlar için filtre akışıyla çalışan aktif reaktör · dakikada 500 kabarcığa kadar · ayrı pompa kullanılırsa en az 500 L/saat gerekir · ürün no. 08057",
    "recommendedMinL": 250,
    "recommendedMaxL": 600,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-flore-co2-active-reactor-500--1000/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-flore-co2-active-reactor-1000",
    "category": "co2",
    "brand": "Sera",
    "model": "flore CO₂ active reactor 1000",
    "specifications": "600 L üzeri veya yoğun bitkili akvaryumlar için filtre akışıyla çalışan aktif reaktör · dakikada 1000 kabarcığa kadar · ayrı pompa kullanılırsa en az 700 L/saat gerekir · ürün no. 08058",
    "recommendedMinL": 600,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-flore-co2-active-reactor-500--1000/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-co2-solenoid-valve-2w",
    "category": "co2",
    "brand": "Sera",
    "model": "CO₂ solenoid valve 2 W",
    "specifications": "Zamanlayıcı veya pH kontrolörüyle gece kapatması sağlayan 2 W solenoid valf · ürün no. 08030",
    "powerW": 2,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-co2-solenoid-valve-2-w/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-co2-pressure-gas-bottle-450g",
    "category": "co2",
    "brand": "Sera",
    "model": "CO₂ pressure gas bottle 450 g",
    "specifications": "Dış valfli, koruma kafesli ve standart 21,8 × 14 bağlantılı yeniden doldurulabilir 450 g çelik CO₂ tüpü · ürün no. 08031",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/us/product/freshwater-aquarium/sera-co2-pressure-gas-bottle/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-co2-refill-450g",
    "category": "co2",
    "brand": "Sera",
    "model": "CO₂ refill 450 g",
    "specifications": "Sera yeniden doldurulabilir CO₂ tüpleri için 450 g dolum hizmeti · ürün no. 08011",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/us/product/freshwater-aquarium/co2-refill/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-co2-refill-2kg",
    "category": "co2",
    "brand": "Sera",
    "model": "CO₂ refill 2 kg",
    "specifications": "Sera yeniden doldurulabilir CO₂ tüpleri için 2 kg dolum hizmeti · ürün no. 08041",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/us/product/freshwater-aquarium/co2-refill/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-co2-hose-4-6",
    "category": "co2",
    "brand": "Sera",
    "model": "CO₂ hose 4/6 · 10 m",
    "specifications": "CO₂ hattı için 4 mm iç ve 6 mm dış çaplı, 10 m basınca dayanıklı hortum · ürün no. 08022",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-co2-hose-46/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-high-quality-non-return-valve",
    "category": "co2",
    "brand": "Sera",
    "model": "High quality safety non-return valve · 2 pcs",
    "specifications": "CO₂ ve hava hattında akvaryum suyunun geri akışını önleyen iki adet yüksek kaliteli güvenlik çekvalfi · ürün no. 08833",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/us/product/freshwater-aquarium/sera-non-return-valve/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-non-return-valve",
    "category": "co2",
    "brand": "Sera",
    "model": "Non-return valve · 2 pcs",
    "specifications": "CO₂ ve hava hattında akvaryum suyunun geri akışını önleyen iki adet standart çekvalf · ürün no. 08818",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/us/product/freshwater-aquarium/sera-non-return-valve/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-co2-bottle-holder",
    "category": "co2",
    "brand": "Sera",
    "model": "CO₂ bottle holder",
    "specifications": "CO₂ basınç tüpünü dik ve güvenli tutmak için duvar tutucusu · ürün no. 08021",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-flore-co2-fertilization-system/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-xs-feeder",
    "category": "other",
    "brand": "Sera",
    "model": "XS-Feeder",
    "specifications": "150 ml hazneli, granül yemler için kademesiz doz ayarlı otomatik yemleyici · günde bir veya beş saat arayla iki öğün · iki AA pil ile çalışır · ürün no. 32627",
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-xs-feeder/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-x-feeder",
    "category": "other",
    "brand": "Sera",
    "model": "X-Feeder",
    "specifications": "120 ml nem korumalı hazneli otomatik yemleyici · günde dört programlanabilir öğün · öğün başına on kademeli doz · pul ve granül yem · ürün no. 32595",
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-x-feeder-1/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-screw-xtra-fine",
    "category": "other",
    "brand": "Sera",
    "model": "Screw Xtra Fine",
    "specifications": "X-Feeder için 0,1–1 mm tekdüze taneli yemleri dozlayan kırmızı yedek vida · standart siyah vidaya göre yaklaşık yedi kat daha az yem taşır · ürün no. 32654",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-screw-xtra-fine/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-air-set-s",
    "category": "other",
    "brand": "Sera",
    "model": "air set S",
    "specifications": "Sera hava motorları için hortum ve hava taşı aksesuar seti · S boy · ürün no. 08813 · bağımsız hava motoru içermez",
    "passiveComponent": true,
    "requiresAirPump": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-air-sets/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-air-set-m",
    "category": "other",
    "brand": "Sera",
    "model": "air set M",
    "specifications": "Sera hava motorları için hortum ve hava taşı aksesuar seti · M boy · ürün no. 08815 · bağımsız hava motoru içermez",
    "passiveComponent": true,
    "requiresAirPump": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-air-sets/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-air-set-l",
    "category": "other",
    "brand": "Sera",
    "model": "air set L",
    "specifications": "Sera hava motorları için hortum ve hava taşı aksesuar seti · L boy · ürün no. 08817 · bağımsız hava motoru içermez",
    "passiveComponent": true,
    "requiresAirPump": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-air-sets/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-thermo-safe-32424",
    "category": "other",
    "brand": "Sera",
    "model": "thermo-safe 40 × 39,8 cm",
    "specifications": "Akvaryum tabanı için cam kırılması ve dolap burulma gerilimi riskini azaltan güvenlik/ısı yalıtım pedi · 40 × 39,8 cm · ürün no. 32424",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-thermo-safe/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-thermo-safe-08675",
    "category": "other",
    "brand": "Sera",
    "model": "thermo-safe 60 × 30 cm",
    "specifications": "Akvaryum tabanı için cam kırılması ve dolap burulma gerilimi riskini azaltan güvenlik/ısı yalıtım pedi · 60 × 30 cm · ürün no. 08675",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-thermo-safe/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-thermo-safe-08676",
    "category": "other",
    "brand": "Sera",
    "model": "thermo-safe 80 × 35 cm",
    "specifications": "Akvaryum tabanı için cam kırılması ve dolap burulma gerilimi riskini azaltan güvenlik/ısı yalıtım pedi · 80 × 35 cm · ürün no. 08676",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-thermo-safe/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-thermo-safe-32446",
    "category": "other",
    "brand": "Sera",
    "model": "thermo-safe 82 × 40 cm",
    "specifications": "Akvaryum tabanı için cam kırılması ve dolap burulma gerilimi riskini azaltan güvenlik/ısı yalıtım pedi · 82 × 40 cm · ürün no. 32446",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-thermo-safe/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-thermo-safe-08677",
    "category": "other",
    "brand": "Sera",
    "model": "thermo-safe 100 × 40 cm",
    "specifications": "Akvaryum tabanı için cam kırılması ve dolap burulma gerilimi riskini azaltan güvenlik/ısı yalıtım pedi · 100 × 40 cm · ürün no. 08677",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-thermo-safe/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-thermo-safe-08678",
    "category": "other",
    "brand": "Sera",
    "model": "thermo-safe 120 × 50 cm",
    "specifications": "Akvaryum tabanı için cam kırılması ve dolap burulma gerilimi riskini azaltan güvenlik/ısı yalıtım pedi · 120 × 50 cm · ürün no. 08678",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-thermo-safe/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-thermo-safe-08679",
    "category": "other",
    "brand": "Sera",
    "model": "thermo-safe 1.000 × 60 cm rulo",
    "specifications": "Akvaryum tabanı için cam kırılması ve dolap burulma gerilimi riskini azaltan güvenlik/ısı yalıtım pedi · 1.000 × 60 cm rulo · ürün no. 08679",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-thermo-safe/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-fish-net-fine-8",
    "category": "other",
    "brand": "Sera",
    "model": "fish net fine 8 cm",
    "specifications": "Yumuşak balık yakalama kepçesi · 8 cm · 0,5 × 1 mm ince ağ gözü · ürün no. 08834",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-fish-nets-fine/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-fish-net-fine-10",
    "category": "other",
    "brand": "Sera",
    "model": "fish net fine 10 cm",
    "specifications": "Yumuşak balık yakalama kepçesi · 10 cm · 0,5 × 1 mm ince ağ gözü · ürün no. 08835",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-fish-nets-fine/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-fish-net-fine-12",
    "category": "other",
    "brand": "Sera",
    "model": "fish net fine 12 cm",
    "specifications": "Yumuşak balık yakalama kepçesi · 12 cm · 0,5 × 1 mm ince ağ gözü · ürün no. 08836",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-fish-nets-fine/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-fish-net-fine-20",
    "category": "other",
    "brand": "Sera",
    "model": "fish net fine 20 cm",
    "specifications": "Yumuşak balık yakalama kepçesi · 20 cm · 0,5 × 1 mm ince ağ gözü · ürün no. 08837",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-fish-nets-fine/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-fish-net-coarse-8",
    "category": "other",
    "brand": "Sera",
    "model": "fish net coarse 8 cm",
    "specifications": "Yumuşak balık yakalama kepçesi · 8 cm · 1 × 1,5 mm kaba ağ gözü · ürün no. 08820",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-fish-nets-coarse/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-fish-net-coarse-10",
    "category": "other",
    "brand": "Sera",
    "model": "fish net coarse 10 cm",
    "specifications": "Yumuşak balık yakalama kepçesi · 10 cm · 1 × 1,5 mm kaba ağ gözü · ürün no. 08822",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-fish-nets-coarse/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-fish-net-coarse-12",
    "category": "other",
    "brand": "Sera",
    "model": "fish net coarse 12 cm",
    "specifications": "Yumuşak balık yakalama kepçesi · 12 cm · 1 × 1,5 mm kaba ağ gözü · ürün no. 08824",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-fish-nets-coarse/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-fish-net-coarse-20",
    "category": "other",
    "brand": "Sera",
    "model": "fish net coarse 20 cm",
    "specifications": "Yumuşak balık yakalama kepçesi · 20 cm · 1 × 1,5 mm kaba ağ gözü · ürün no. 08826",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-fish-nets-coarse/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-stick-on-lcd-thermometer",
    "category": "other",
    "brand": "Sera",
    "model": "Stick-On LCD-Thermometer",
    "specifications": "Akvaryum camının dışına yapıştırılan sıvı kristal sıcaklık göstergesi · ürün no. 08901",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-thermometer/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-precision-thermometer",
    "category": "other",
    "brand": "Sera",
    "model": "Precision Thermometer",
    "specifications": "Vantuzla akvaryum içine sabitlenen hassas cam termometre · ürün no. 08902",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-thermometer/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-gravel-cleaner",
    "category": "other",
    "brand": "Sera",
    "model": "gravel cleaner",
    "specifications": "Su değiştirmeden tabandaki tortu ve kiri uzaklaştıran hava motorlu dip temizleyici · 60 cm yüksekliğe kadar akvaryum · ürün no. 08550 · bağımsız hava motoru gerekir",
    "passiveComponent": true,
    "requiresAirPump": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-gravel-cleaner/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-artemia-breeding-kit",
    "category": "other",
    "brand": "Sera",
    "model": "Artemia Breeding Kit",
    "specifications": "Artemia nauplius üretimi için elek, tıpa, büyük şişe adaptör O-ringi, 2 m hava hortumu, iki 145 mm yükseltme borusu ve 18 g Artemia-Mix içeren set · ürün no. 08584",
    "passiveComponent": true,
    "requiresAirPump": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-artemia-breeding-kit/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-breeding-container",
    "category": "other",
    "brand": "Sera",
    "model": "breeding container",
    "specifications": "Yavru büyütme veya az miktar biofibres ile yumurtlatma için 2,5 L akvaryum içi kap · ürün no. 08580",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-breeding-container/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-snail-collect",
    "category": "other",
    "brand": "Sera",
    "model": "snail collect",
    "specifications": "Aşırı çoğalan salyangozları yemle çeken, giriş pimleriyle balıkların istenmeden yakalanmasını önleyen tuzak · deniz akvaryumunda kıl kurdu yakalamaya da uygun · ürün no. 08585",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-snail-collect/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-glass-clear-ta6",
    "category": "other",
    "brand": "Sera",
    "model": "glass clear TA6",
    "specifications": "Akvaryum camı için iki parçalı mıknatıslı yosun temizleyici · ürün no. 08858 · üretici güncel tabloda boy veya cam kalınlığı yayımlamıyor",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-glass-clear/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-glass-clear-s",
    "category": "other",
    "brand": "Sera",
    "model": "glass clear S",
    "specifications": "Akvaryum camı için iki parçalı mıknatıslı yosun temizleyici · 33 × 70 mm · 6 mm cam kalınlığına kadar · ürün no. 08847",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-glass-clear/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-glass-clear-m",
    "category": "other",
    "brand": "Sera",
    "model": "glass clear M",
    "specifications": "Akvaryum camı için iki parçalı mıknatıslı yosun temizleyici · 42 × 92 mm · 8 mm cam kalınlığına kadar · ürün no. 08848",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-glass-clear/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-glass-clear-l",
    "category": "other",
    "brand": "Sera",
    "model": "glass clear L",
    "specifications": "Akvaryum camı için iki parçalı mıknatıslı yosun temizleyici · 60 × 110 mm · 10–12 mm cam kalınlığına kadar · ürün no. 08849",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-glass-clear/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-t-piece-small",
    "category": "other",
    "brand": "Sera",
    "model": "T-piece adjustable small",
    "specifications": "Su hortumlarını bağlamak için ayarlanabilir T parçası · 2 × 12/16 + ayarlı 1 × 6/8 · ürün no. 08027",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-t-piece-adjustable/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-t-piece-large",
    "category": "other",
    "brand": "Sera",
    "model": "T-piece adjustable large",
    "specifications": "Su hortumlarını bağlamak için ayarlanabilir T parçası · 2 × 16/22 + ayarlı 1 × 6/8 · ürün no. 08028",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-t-piece-adjustable/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-co2-cleaning-brush",
    "category": "co2",
    "brand": "Sera",
    "model": "CO₂ cleaning brush",
    "specifications": "CO₂ difüzör ve reaktörlerini temizlemek için 20 mm şişe fırçası başlı bakım aracı · ürün no. 08019",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-co2-cleaning-brush/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-water-hose-32129",
    "category": "other",
    "brand": "Sera",
    "model": "water hose 9/12 green · 2,5 m",
    "specifications": "Filtre ve pompalar için zararlı madde içermeyen elastik su hortumu · 9/12 green mm · 2,5 m · ürün no. 32129",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/us/product/freshwater-aquarium/sera-water-hose/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-water-hose-32130",
    "category": "other",
    "brand": "Sera",
    "model": "water hose 9/12 green · 70 m",
    "specifications": "Filtre ve pompalar için zararlı madde içermeyen elastik su hortumu · 9/12 green mm · 70 m · ürün no. 32130",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/us/product/freshwater-aquarium/sera-water-hose/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-water-hose-32131",
    "category": "other",
    "brand": "Sera",
    "model": "water hose 9/12 gray · 2,5 m",
    "specifications": "Filtre ve pompalar için zararlı madde içermeyen elastik su hortumu · 9/12 gray mm · 2,5 m · ürün no. 32131",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/us/product/freshwater-aquarium/sera-water-hose/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-water-hose-32132",
    "category": "other",
    "brand": "Sera",
    "model": "water hose 9/12 gray · 70 m",
    "specifications": "Filtre ve pompalar için zararlı madde içermeyen elastik su hortumu · 9/12 gray mm · 70 m · ürün no. 32132",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/us/product/freshwater-aquarium/sera-water-hose/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-water-hose-32133",
    "category": "other",
    "brand": "Sera",
    "model": "water hose 12/16 green · 2,5 m",
    "specifications": "Filtre ve pompalar için zararlı madde içermeyen elastik su hortumu · 12/16 green mm · 2,5 m · ürün no. 32133",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/us/product/freshwater-aquarium/sera-water-hose/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-water-hose-32134",
    "category": "other",
    "brand": "Sera",
    "model": "water hose 12/16 green · 50 m",
    "specifications": "Filtre ve pompalar için zararlı madde içermeyen elastik su hortumu · 12/16 green mm · 50 m · ürün no. 32134",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/us/product/freshwater-aquarium/sera-water-hose/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-water-hose-32135",
    "category": "other",
    "brand": "Sera",
    "model": "water hose 12/16 gray · 2,5 m",
    "specifications": "Filtre ve pompalar için zararlı madde içermeyen elastik su hortumu · 12/16 gray mm · 2,5 m · ürün no. 32135",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/us/product/freshwater-aquarium/sera-water-hose/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-water-hose-32136",
    "category": "other",
    "brand": "Sera",
    "model": "water hose 12/16 gray · 50 m",
    "specifications": "Filtre ve pompalar için zararlı madde içermeyen elastik su hortumu · 12/16 gray mm · 50 m · ürün no. 32136",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/us/product/freshwater-aquarium/sera-water-hose/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-water-hose-32137",
    "category": "other",
    "brand": "Sera",
    "model": "water hose 16/22 green · 2,5 m",
    "specifications": "Filtre ve pompalar için zararlı madde içermeyen elastik su hortumu · 16/22 green mm · 2,5 m · ürün no. 32137",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/us/product/freshwater-aquarium/sera-water-hose/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-water-hose-32138",
    "category": "other",
    "brand": "Sera",
    "model": "water hose 16/22 green · 25 m",
    "specifications": "Filtre ve pompalar için zararlı madde içermeyen elastik su hortumu · 16/22 green mm · 25 m · ürün no. 32138",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/us/product/freshwater-aquarium/sera-water-hose/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-water-hose-32139",
    "category": "other",
    "brand": "Sera",
    "model": "water hose 16/22 gray · 2,5 m",
    "specifications": "Filtre ve pompalar için zararlı madde içermeyen elastik su hortumu · 16/22 gray mm · 2,5 m · ürün no. 32139",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/us/product/freshwater-aquarium/sera-water-hose/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-water-hose-32140",
    "category": "other",
    "brand": "Sera",
    "model": "water hose 16/22 gray · 25 m",
    "specifications": "Filtre ve pompalar için zararlı madde içermeyen elastik su hortumu · 16/22 gray mm · 25 m · ürün no. 32140",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/us/product/freshwater-aquarium/sera-water-hose/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-water-hose-32210",
    "category": "other",
    "brand": "Sera",
    "model": "water hose 18/23 · 5 m",
    "specifications": "Filtre ve pompalar için zararlı madde içermeyen elastik su hortumu · 18/23 mm · 5 m · ürün no. 32210",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/us/product/freshwater-aquarium/sera-water-hose/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-flore-tool-s",
    "category": "other",
    "brand": "Sera",
    "model": "flore tool S",
    "specifications": "Kökleri ve bitkileri kesmek, ölü yaprakları uzaklaştırmak için 26 cm paslanmaz çelik akvaryum makası · ürün no. 08045",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-flore-tool-s/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-flore-tool-p",
    "category": "other",
    "brand": "Sera",
    "model": "flore tool P",
    "specifications": "Hedefli bitki bakımı ve akvaryum/teraryum çalışmaları için 31 cm paslanmaz çelik cımbız · ürün no. 08046",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/us/product/freshwater-aquarium/sera-flore-tool-p/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-air-hose-32127",
    "category": "other",
    "brand": "Sera",
    "model": "air hose 4/6 green · 200 m",
    "specifications": "Filtre ve hava motorlarına uygun, zararlı madde içermeyen elastik hava hortumu · 4/6 mm · yeşil · 200 m rulo · ürün no. 32127",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-air-hose-46/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-air-hose-32128",
    "category": "other",
    "brand": "Sera",
    "model": "air hose 4/6 gray · 200 m",
    "specifications": "Filtre ve hava motorlarına uygun, zararlı madde içermeyen elastik hava hortumu · 4/6 mm · gri · 200 m rulo · ürün no. 32128",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-air-hose-46/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-aquatank-96-l-set",
    "category": "other",
    "brand": "Sera",
    "model": "AquaTank 96 L Set",
    "specifications": "Açık veya kapaklı kurulabilen cam akvaryum seti · 96 L · 82 × 40 × 30 cm · X-Edge 450 iç filtre · 100 W Aquarium Heater Thermostat · thermo-safe taban pedi · çevresel kaçış koruma çıtaları · ürün no. 32774",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-aquatank-96-l-25-us-gal/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-aquatank-128-l-set",
    "category": "other",
    "brand": "Sera",
    "model": "AquaTank 128 L Set",
    "specifications": "Açık veya kapaklı kurulabilen cam akvaryum seti · 128 L · 82 × 40 × 40 cm · X-Edge 450 iç filtre · 100 W Aquarium Heater Thermostat · thermo-safe taban pedi · çevresel kaçış koruma çıtaları · ürün no. 32775",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-aquatank-128-l-34-us-gal/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-aquatank-160-l-set",
    "category": "other",
    "brand": "Sera",
    "model": "AquaTank 160 L Set",
    "specifications": "Açık veya kapaklı kurulabilen cam akvaryum seti · 160 L · 82 × 40 × 50 cm · X-Edge 700 iç filtre · 150 W Aquarium Heater Thermostat · thermo-safe taban pedi · çevresel kaçış koruma çıtaları · ürün no. 32776",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-aquatank-160-l-42-us-gal/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-scaper-cube-48-l-set",
    "category": "other",
    "brand": "Sera",
    "model": "Scaper Cube 48 L Set",
    "specifications": "Aquascaping ve nano tür kurulumları için açık veya kapaklı kullanılabilen cam akvaryum · 48 L · 40 × 40 × 30 cm · X-Edge 300 iç filtre · thermo-safe taban pedi · çevresel kaçış koruma çıtaları · ürün no. 32765",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-scaper-cube-48-l-127-us-gal/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-scaper-cube-64-l-set",
    "category": "other",
    "brand": "Sera",
    "model": "Scaper Cube 64 L Set",
    "specifications": "Aquascaping ve nano tür kurulumları için açık veya kapaklı kullanılabilen cam akvaryum · 64 L · 40 × 40 × 40 cm · X-Edge 300 iç filtre · thermo-safe taban pedi · çevresel kaçış koruma çıtaları · ürün no. 32766",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-scaper-cube-64-l-169-us-gal/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-scaper-cube-80-l-aquarium",
    "category": "other",
    "brand": "Sera",
    "model": "Scaper Cube 80 L Aquarium",
    "specifications": "Aquascaping ve nano tür kurulumları için açık veya kapaklı kullanılabilen cam akvaryum · 80 L · 40 × 40 × 50 cm · X-Edge 300 iç filtre · thermo-safe taban pedi · çevresel kaçış koruma çıtaları · ürün no. 32365",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-scaper-cube-80-l-21-us-gal/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-aquatank-cabinet-80-black",
    "category": "other",
    "brand": "Sera",
    "model": "AquaTank cabinet 80 cm Black",
    "specifications": "96, 128 ve 160 L AquaTank akvaryumları için dolap · 80 cm yükseklik · 82 × 40 cm ortak taban alanına uygun · bas-aç kapı · ayarlanabilir ayaklar · farklı yüksekliklere takılabilen iki raf · Black dekor · ürün no. 32502",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-aquatank-cabinet-80-cm-32-in/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-aquatank-cabinet-80-silver-oak",
    "category": "other",
    "brand": "Sera",
    "model": "AquaTank cabinet 80 cm Silver Oak",
    "specifications": "96, 128 ve 160 L AquaTank akvaryumları için dolap · 80 cm yükseklik · 82 × 40 cm ortak taban alanına uygun · bas-aç kapı · ayarlanabilir ayaklar · farklı yüksekliklere takılabilen iki raf · Silver Oak dekor · ürün no. 32503",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-aquatank-cabinet-80-cm-32-in/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-aquatank-cabinet-80-walnut",
    "category": "other",
    "brand": "Sera",
    "model": "AquaTank cabinet 80 cm Walnut",
    "specifications": "96, 128 ve 160 L AquaTank akvaryumları için dolap · 80 cm yükseklik · 82 × 40 cm ortak taban alanına uygun · bas-aç kapı · ayarlanabilir ayaklar · farklı yüksekliklere takılabilen iki raf · Walnut dekor · ürün no. 32504",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-aquatank-cabinet-80-cm-32-in/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-aquatank-cabinet-80-cherry",
    "category": "other",
    "brand": "Sera",
    "model": "AquaTank cabinet 80 cm Cherry",
    "specifications": "96, 128 ve 160 L AquaTank akvaryumları için dolap · 80 cm yükseklik · 82 × 40 cm ortak taban alanına uygun · bas-aç kapı · ayarlanabilir ayaklar · farklı yüksekliklere takılabilen iki raf · Cherry dekor · ürün no. 32575",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-aquatank-cabinet-80-cm-32-in/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-aquatank-cabinet-80-sonoma-oak",
    "category": "other",
    "brand": "Sera",
    "model": "AquaTank cabinet 80 cm Sonoma Oak",
    "specifications": "96, 128 ve 160 L AquaTank akvaryumları için dolap · 80 cm yükseklik · 82 × 40 cm ortak taban alanına uygun · bas-aç kapı · ayarlanabilir ayaklar · farklı yüksekliklere takılabilen iki raf · Sonoma Oak dekor · ürün no. 32576",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-aquatank-cabinet-80-cm-32-in/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-aquatank-cabinet-80-gray-oak",
    "category": "other",
    "brand": "Sera",
    "model": "AquaTank cabinet 80 cm Gray Oak",
    "specifications": "96, 128 ve 160 L AquaTank akvaryumları için dolap · 80 cm yükseklik · 82 × 40 cm ortak taban alanına uygun · bas-aç kapı · ayarlanabilir ayaklar · farklı yüksekliklere takılabilen iki raf · Gray Oak dekor · ürün no. 32577",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-aquatank-cabinet-80-cm-32-in/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-aquatank-cabinet-90-black",
    "category": "other",
    "brand": "Sera",
    "model": "AquaTank cabinet 90 cm Black",
    "specifications": "96, 128 ve 160 L AquaTank akvaryumları için dolap · 90 cm yükseklik · 82 × 40 cm ortak taban alanına uygun · bas-aç kapı · ayarlanabilir ayaklar · farklı yüksekliklere takılabilen iki raf · Black dekor · ürün no. 32505",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-aquatank-cabinet-90-cm-36-in/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-aquatank-cabinet-90-silver-oak",
    "category": "other",
    "brand": "Sera",
    "model": "AquaTank cabinet 90 cm Silver Oak",
    "specifications": "96, 128 ve 160 L AquaTank akvaryumları için dolap · 90 cm yükseklik · 82 × 40 cm ortak taban alanına uygun · bas-aç kapı · ayarlanabilir ayaklar · farklı yüksekliklere takılabilen iki raf · Silver Oak dekor · ürün no. 32506",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-aquatank-cabinet-90-cm-36-in/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-aquatank-cabinet-90-walnut",
    "category": "other",
    "brand": "Sera",
    "model": "AquaTank cabinet 90 cm Walnut",
    "specifications": "96, 128 ve 160 L AquaTank akvaryumları için dolap · 90 cm yükseklik · 82 × 40 cm ortak taban alanına uygun · bas-aç kapı · ayarlanabilir ayaklar · farklı yüksekliklere takılabilen iki raf · Walnut dekor · ürün no. 32507",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-aquatank-cabinet-90-cm-36-in/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-aquatank-cabinet-90-cherry",
    "category": "other",
    "brand": "Sera",
    "model": "AquaTank cabinet 90 cm Cherry",
    "specifications": "96, 128 ve 160 L AquaTank akvaryumları için dolap · 90 cm yükseklik · 82 × 40 cm ortak taban alanına uygun · bas-aç kapı · ayarlanabilir ayaklar · farklı yüksekliklere takılabilen iki raf · Cherry dekor · ürün no. 32578",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-aquatank-cabinet-90-cm-36-in/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-aquatank-cabinet-90-sonoma-oak",
    "category": "other",
    "brand": "Sera",
    "model": "AquaTank cabinet 90 cm Sonoma Oak",
    "specifications": "96, 128 ve 160 L AquaTank akvaryumları için dolap · 90 cm yükseklik · 82 × 40 cm ortak taban alanına uygun · bas-aç kapı · ayarlanabilir ayaklar · farklı yüksekliklere takılabilen iki raf · Sonoma Oak dekor · ürün no. 32579",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-aquatank-cabinet-90-cm-36-in/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-aquatank-cabinet-90-gray-oak",
    "category": "other",
    "brand": "Sera",
    "model": "AquaTank cabinet 90 cm Gray Oak",
    "specifications": "96, 128 ve 160 L AquaTank akvaryumları için dolap · 90 cm yükseklik · 82 × 40 cm ortak taban alanına uygun · bas-aç kapı · ayarlanabilir ayaklar · farklı yüksekliklere takılabilen iki raf · Gray Oak dekor · ürün no. 32580",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-aquatank-cabinet-90-cm-36-in/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-aquatank-cabinet-100-black",
    "category": "other",
    "brand": "Sera",
    "model": "AquaTank cabinet 100 cm Black",
    "specifications": "96, 128 ve 160 L AquaTank akvaryumları için dolap · 100 cm yükseklik · 82 × 40 cm ortak taban alanına uygun · bas-aç kapı · ayarlanabilir ayaklar · farklı yüksekliklere takılabilen iki raf · Black dekor · ürün no. 32509",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-aquatank-cabinet-100-cm-40-in/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-aquatank-cabinet-100-silver-oak",
    "category": "other",
    "brand": "Sera",
    "model": "AquaTank cabinet 100 cm Silver Oak",
    "specifications": "96, 128 ve 160 L AquaTank akvaryumları için dolap · 100 cm yükseklik · 82 × 40 cm ortak taban alanına uygun · bas-aç kapı · ayarlanabilir ayaklar · farklı yüksekliklere takılabilen iki raf · Silver Oak dekor · ürün no. 32510",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-aquatank-cabinet-100-cm-40-in/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-aquatank-cabinet-100-walnut",
    "category": "other",
    "brand": "Sera",
    "model": "AquaTank cabinet 100 cm Walnut",
    "specifications": "96, 128 ve 160 L AquaTank akvaryumları için dolap · 100 cm yükseklik · 82 × 40 cm ortak taban alanına uygun · bas-aç kapı · ayarlanabilir ayaklar · farklı yüksekliklere takılabilen iki raf · Walnut dekor · ürün no. 32508",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-aquatank-cabinet-100-cm-40-in/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-aquatank-cabinet-100-cherry",
    "category": "other",
    "brand": "Sera",
    "model": "AquaTank cabinet 100 cm Cherry",
    "specifications": "96, 128 ve 160 L AquaTank akvaryumları için dolap · 100 cm yükseklik · 82 × 40 cm ortak taban alanına uygun · bas-aç kapı · ayarlanabilir ayaklar · farklı yüksekliklere takılabilen iki raf · Cherry dekor · ürün no. 32581",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-aquatank-cabinet-100-cm-40-in/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-aquatank-cabinet-100-sonoma-oak",
    "category": "other",
    "brand": "Sera",
    "model": "AquaTank cabinet 100 cm Sonoma Oak",
    "specifications": "96, 128 ve 160 L AquaTank akvaryumları için dolap · 100 cm yükseklik · 82 × 40 cm ortak taban alanına uygun · bas-aç kapı · ayarlanabilir ayaklar · farklı yüksekliklere takılabilen iki raf · Sonoma Oak dekor · ürün no. 32582",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-aquatank-cabinet-100-cm-40-in/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-aquatank-cabinet-100-gray-oak",
    "category": "other",
    "brand": "Sera",
    "model": "AquaTank cabinet 100 cm Gray Oak",
    "specifications": "96, 128 ve 160 L AquaTank akvaryumları için dolap · 100 cm yükseklik · 82 × 40 cm ortak taban alanına uygun · bas-aç kapı · ayarlanabilir ayaklar · farklı yüksekliklere takılabilen iki raf · Gray Oak dekor · ürün no. 32583",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-aquatank-cabinet-100-cm-40-in/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-scaper-cube-cabinet-80-black",
    "category": "other",
    "brand": "Sera",
    "model": "Scaper Cube cabinet 80 cm Black",
    "specifications": "48, 64 ve 80 L Scaper Cube akvaryumları için dolap · 80 cm yükseklik · 40 × 40 cm ortak taban alanına uygun · bas-aç kapı · ayarlanabilir ayaklar · farklı yüksekliklere takılabilen iki raf · Black dekor · ürün no. 32393",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-scaper-cube-cabinet-80-cm-32-in/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-scaper-cube-cabinet-80-sonoma",
    "category": "other",
    "brand": "Sera",
    "model": "Scaper Cube cabinet 80 cm Sonoma",
    "specifications": "48, 64 ve 80 L Scaper Cube akvaryumları için dolap · 80 cm yükseklik · 40 × 40 cm ortak taban alanına uygun · bas-aç kapı · ayarlanabilir ayaklar · farklı yüksekliklere takılabilen iki raf · Sonoma dekor · ürün no. 32394",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-scaper-cube-cabinet-80-cm-32-in/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-scaper-cube-cabinet-80-walnut",
    "category": "other",
    "brand": "Sera",
    "model": "Scaper Cube cabinet 80 cm Walnut",
    "specifications": "48, 64 ve 80 L Scaper Cube akvaryumları için dolap · 80 cm yükseklik · 40 × 40 cm ortak taban alanına uygun · bas-aç kapı · ayarlanabilir ayaklar · farklı yüksekliklere takılabilen iki raf · Walnut dekor · ürün no. 32395",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-scaper-cube-cabinet-80-cm-32-in/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-scaper-cube-cabinet-80-cherry",
    "category": "other",
    "brand": "Sera",
    "model": "Scaper Cube cabinet 80 cm Cherry",
    "specifications": "48, 64 ve 80 L Scaper Cube akvaryumları için dolap · 80 cm yükseklik · 40 × 40 cm ortak taban alanına uygun · bas-aç kapı · ayarlanabilir ayaklar · farklı yüksekliklere takılabilen iki raf · Cherry dekor · ürün no. 32396",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-scaper-cube-cabinet-80-cm-32-in/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-scaper-cube-cabinet-80-silver",
    "category": "other",
    "brand": "Sera",
    "model": "Scaper Cube cabinet 80 cm Silver",
    "specifications": "48, 64 ve 80 L Scaper Cube akvaryumları için dolap · 80 cm yükseklik · 40 × 40 cm ortak taban alanına uygun · bas-aç kapı · ayarlanabilir ayaklar · farklı yüksekliklere takılabilen iki raf · Silver dekor · ürün no. 32397",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-scaper-cube-cabinet-80-cm-32-in/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-scaper-cube-cabinet-80-gray",
    "category": "other",
    "brand": "Sera",
    "model": "Scaper Cube cabinet 80 cm Gray",
    "specifications": "48, 64 ve 80 L Scaper Cube akvaryumları için dolap · 80 cm yükseklik · 40 × 40 cm ortak taban alanına uygun · bas-aç kapı · ayarlanabilir ayaklar · farklı yüksekliklere takılabilen iki raf · Gray dekor · ürün no. 32398",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-scaper-cube-cabinet-80-cm-32-in/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-scaper-cube-cabinet-90-black",
    "category": "other",
    "brand": "Sera",
    "model": "Scaper Cube cabinet 90 cm Black",
    "specifications": "48, 64 ve 80 L Scaper Cube akvaryumları için dolap · 90 cm yükseklik · 40 × 40 cm ortak taban alanına uygun · bas-aç kapı · ayarlanabilir ayaklar · farklı yüksekliklere takılabilen iki raf · Black dekor · ürün no. 32399",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-scaper-cube-cabinet-90-cm-36-in/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-scaper-cube-cabinet-90-sonoma",
    "category": "other",
    "brand": "Sera",
    "model": "Scaper Cube cabinet 90 cm Sonoma",
    "specifications": "48, 64 ve 80 L Scaper Cube akvaryumları için dolap · 90 cm yükseklik · 40 × 40 cm ortak taban alanına uygun · bas-aç kapı · ayarlanabilir ayaklar · farklı yüksekliklere takılabilen iki raf · Sonoma dekor · ürün no. 32400",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-scaper-cube-cabinet-90-cm-36-in/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-scaper-cube-cabinet-90-walnut",
    "category": "other",
    "brand": "Sera",
    "model": "Scaper Cube cabinet 90 cm Walnut",
    "specifications": "48, 64 ve 80 L Scaper Cube akvaryumları için dolap · 90 cm yükseklik · 40 × 40 cm ortak taban alanına uygun · bas-aç kapı · ayarlanabilir ayaklar · farklı yüksekliklere takılabilen iki raf · Walnut dekor · ürün no. 32401",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-scaper-cube-cabinet-90-cm-36-in/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-scaper-cube-cabinet-90-cherry",
    "category": "other",
    "brand": "Sera",
    "model": "Scaper Cube cabinet 90 cm Cherry",
    "specifications": "48, 64 ve 80 L Scaper Cube akvaryumları için dolap · 90 cm yükseklik · 40 × 40 cm ortak taban alanına uygun · bas-aç kapı · ayarlanabilir ayaklar · farklı yüksekliklere takılabilen iki raf · Cherry dekor · ürün no. 32402",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-scaper-cube-cabinet-90-cm-36-in/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-scaper-cube-cabinet-90-silver",
    "category": "other",
    "brand": "Sera",
    "model": "Scaper Cube cabinet 90 cm Silver",
    "specifications": "48, 64 ve 80 L Scaper Cube akvaryumları için dolap · 90 cm yükseklik · 40 × 40 cm ortak taban alanına uygun · bas-aç kapı · ayarlanabilir ayaklar · farklı yüksekliklere takılabilen iki raf · Silver dekor · ürün no. 32403",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-scaper-cube-cabinet-90-cm-36-in/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-scaper-cube-cabinet-90-gray",
    "category": "other",
    "brand": "Sera",
    "model": "Scaper Cube cabinet 90 cm Gray",
    "specifications": "48, 64 ve 80 L Scaper Cube akvaryumları için dolap · 90 cm yükseklik · 40 × 40 cm ortak taban alanına uygun · bas-aç kapı · ayarlanabilir ayaklar · farklı yüksekliklere takılabilen iki raf · Gray dekor · ürün no. 32404",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-scaper-cube-cabinet-90-cm-36-in/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-scaper-cube-cabinet-100-black",
    "category": "other",
    "brand": "Sera",
    "model": "Scaper Cube cabinet 100 cm Black",
    "specifications": "48, 64 ve 80 L Scaper Cube akvaryumları için dolap · 100 cm yükseklik · 40 × 40 cm ortak taban alanına uygun · bas-aç kapı · ayarlanabilir ayaklar · farklı yüksekliklere takılabilen iki raf · Black dekor · ürün no. 32405",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-scaper-cube-cabinet-100-cm-40-in/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-scaper-cube-cabinet-100-sonoma",
    "category": "other",
    "brand": "Sera",
    "model": "Scaper Cube cabinet 100 cm Sonoma",
    "specifications": "48, 64 ve 80 L Scaper Cube akvaryumları için dolap · 100 cm yükseklik · 40 × 40 cm ortak taban alanına uygun · bas-aç kapı · ayarlanabilir ayaklar · farklı yüksekliklere takılabilen iki raf · Sonoma dekor · ürün no. 32406",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-scaper-cube-cabinet-100-cm-40-in/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-scaper-cube-cabinet-100-walnut",
    "category": "other",
    "brand": "Sera",
    "model": "Scaper Cube cabinet 100 cm Walnut",
    "specifications": "48, 64 ve 80 L Scaper Cube akvaryumları için dolap · 100 cm yükseklik · 40 × 40 cm ortak taban alanına uygun · bas-aç kapı · ayarlanabilir ayaklar · farklı yüksekliklere takılabilen iki raf · Walnut dekor · ürün no. 32407",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-scaper-cube-cabinet-100-cm-40-in/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-scaper-cube-cabinet-100-cherry",
    "category": "other",
    "brand": "Sera",
    "model": "Scaper Cube cabinet 100 cm Cherry",
    "specifications": "48, 64 ve 80 L Scaper Cube akvaryumları için dolap · 100 cm yükseklik · 40 × 40 cm ortak taban alanına uygun · bas-aç kapı · ayarlanabilir ayaklar · farklı yüksekliklere takılabilen iki raf · Cherry dekor · ürün no. 32408",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-scaper-cube-cabinet-100-cm-40-in/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-scaper-cube-cabinet-100-silver",
    "category": "other",
    "brand": "Sera",
    "model": "Scaper Cube cabinet 100 cm Silver",
    "specifications": "48, 64 ve 80 L Scaper Cube akvaryumları için dolap · 100 cm yükseklik · 40 × 40 cm ortak taban alanına uygun · bas-aç kapı · ayarlanabilir ayaklar · farklı yüksekliklere takılabilen iki raf · Silver dekor · ürün no. 32409",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-scaper-cube-cabinet-100-cm-40-in/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-scaper-cube-cabinet-100-gray",
    "category": "other",
    "brand": "Sera",
    "model": "Scaper Cube cabinet 100 cm Gray",
    "specifications": "48, 64 ve 80 L Scaper Cube akvaryumları için dolap · 100 cm yükseklik · 40 × 40 cm ortak taban alanına uygun · bas-aç kapı · ayarlanabilir ayaklar · farklı yüksekliklere takılabilen iki raf · Gray dekor · ürün no. 32410",
    "passiveComponent": true,
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-scaper-cube-cabinet-100-cm-40-in/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-scaper-cube-light-set-cover-1-led",
    "category": "lighting",
    "brand": "Sera",
    "model": "Scaper Cube Light Set - Cover - 1 LED",
    "specifications": "Tüm sera Scaper Cube modelleri için hazır aydınlatma seti · kapak · dış ölçü 41 × 41 × 8 cm · 1 × LED X-Change Tube daylight sunrise 360 · uygun 20 V / 1 A güç kaynağı · toplam LED gücü 5.9 W · ürün no. 32759",
    "powerW": 5.9,
    "recommendedTankLengthCm": [
      40,
      40
    ],
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-scaper-cube-light-set-cover-1-led/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-scaper-cube-light-set-cover-2-led",
    "category": "lighting",
    "brand": "Sera",
    "model": "Scaper Cube Light Set - Cover - 2 LED",
    "specifications": "Tüm sera Scaper Cube modelleri için hazır aydınlatma seti · kapak · dış ölçü 41 × 41 × 8 cm · 2 × LED X-Change Tube daylight sunrise 360 · uygun 20 V / 1 A güç kaynağı · LED Triple Cable · toplam LED gücü 11.8 W · ürün no. 32760",
    "powerW": 11.8,
    "recommendedTankLengthCm": [
      40,
      40
    ],
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-scaper-cube-light-set-cover-2-led/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-aquatank-light-set-cover-1-led",
    "category": "lighting",
    "brand": "Sera",
    "model": "AquaTank Light Set - Cover - 1 LED",
    "specifications": "Tüm sera AquaTank modelleri için hazır aydınlatma seti · kapak · dış ölçü 82,7 × 41 × 8 cm · 1 × LED X-Change Tube daylight sunrise 660 · uygun 20 V / 3 A güç kaynağı · toplam LED gücü 14.9 W · ürün no. 32768",
    "powerW": 14.9,
    "recommendedTankLengthCm": [
      82,
      82
    ],
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-aqua-tank-light-set-cover-1-led/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-aquatank-cover-2-led",
    "category": "lighting",
    "brand": "Sera",
    "model": "AquaTank Cover - 2 LED",
    "specifications": "Tüm sera AquaTank modelleri için hazır aydınlatma seti · kapak · dış ölçü 82,7 × 41 × 8 cm · 2 × LED X-Change Tube daylight sunrise 660 · uygun 20 V / 3 A güç kaynağı · LED Triple Cable · toplam LED gücü 29.8 W · ürün no. 32769",
    "powerW": 29.8,
    "recommendedTankLengthCm": [
      82,
      82
    ],
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-aquatank-cover-2-led/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-scaper-cube-light-set-fixture-silver-1-led",
    "category": "lighting",
    "brand": "Sera",
    "model": "Scaper Cube Light Set - fiXture Silver - 1 LED",
    "specifications": "Tüm sera Scaper Cube modelleri için hazır aydınlatma seti · fiXture silver 400 · 1 × LED X-Change Tube daylight sunrise 360 · uygun 20 V / 1 A güç kaynağı · toplam LED gücü 5.9 W · ürün no. 32763",
    "powerW": 5.9,
    "recommendedTankLengthCm": [
      40,
      40
    ],
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-scaper-cube-light-set-fixture-silver-1-led/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-scaper-cube-light-set-fixture-silver-2-led",
    "category": "lighting",
    "brand": "Sera",
    "model": "Scaper Cube Light Set - fiXture Silver - 2 LED",
    "specifications": "Tüm sera Scaper Cube modelleri için hazır aydınlatma seti · fiXture silver 400 · 2 × LED X-Change Tube daylight sunrise 360 · uygun 20 V / 1 A güç kaynağı · LED Triple Cable · toplam LED gücü 11.8 W · ürün no. 32764",
    "powerW": 11.8,
    "recommendedTankLengthCm": [
      40,
      40
    ],
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-scaper-cube-light-set-fixture-silver-2-led/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-aquatank-light-set-fixture-silver-1-led",
    "category": "lighting",
    "brand": "Sera",
    "model": "AquaTank Light Set - fiXture Silver - 1 LED",
    "specifications": "Tüm sera AquaTank modelleri için hazır aydınlatma seti · fiXture silver 800 · 1 × LED X-Change Tube daylight sunrise 660 · uygun 20 V / 3 A güç kaynağı · toplam LED gücü 14.9 W · ürün no. 32772",
    "powerW": 14.9,
    "recommendedTankLengthCm": [
      82,
      82
    ],
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-aquatank-light-set-fixture-silver-1-led/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-aquatank-light-set-fixture-silver-2-led",
    "category": "lighting",
    "brand": "Sera",
    "model": "AquaTank Light Set - fiXture Silver - 2 LED",
    "specifications": "Tüm sera AquaTank modelleri için hazır aydınlatma seti · fiXture silver 800 · 2 × LED X-Change Tube daylight sunrise 660 · uygun 20 V / 3 A güç kaynağı · LED Triple Cable · toplam LED gücü 29.8 W · ürün no. 32773",
    "powerW": 29.8,
    "recommendedTankLengthCm": [
      82,
      82
    ],
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-aquatank-light-set-fixture-silver-2-led/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-scaper-cube-light-set-tube-holder-1-led",
    "category": "lighting",
    "brand": "Sera",
    "model": "Scaper Cube Light Set - Tube Holder - 1 LED",
    "specifications": "Tüm sera Scaper Cube modelleri için hazır aydınlatma seti · şeffaf Tube Holder · 1 × LED X-Change Tube daylight sunrise 360 · uygun 20 V / 1 A güç kaynağı · toplam LED gücü 5.9 W · ürün no. 32761",
    "powerW": 5.9,
    "recommendedTankLengthCm": [
      40,
      40
    ],
    "sourceUrl": "https://www.sera.de/us/product/freshwater-aquarium/sera-scaper-cube-light-set-tube-holder-1-led/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-scaper-cube-light-set-tube-holder-2-led",
    "category": "lighting",
    "brand": "Sera",
    "model": "Scaper Cube Light Set - Tube Holder - 2 LED",
    "specifications": "Tüm sera Scaper Cube modelleri için hazır aydınlatma seti · şeffaf Tube Holder · 2 × LED X-Change Tube daylight sunrise 360 · uygun 20 V / 1 A güç kaynağı · LED Triple Cable · toplam LED gücü 11.8 W · ürün no. 32762",
    "powerW": 11.8,
    "recommendedTankLengthCm": [
      40,
      40
    ],
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-scaper-cube-light-set-tube-holder-2-led/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-aquatank-light-set-tube-holder-1-led",
    "category": "lighting",
    "brand": "Sera",
    "model": "AquaTank Light Set - Tube Holder - 1 LED",
    "specifications": "Tüm sera AquaTank modelleri için hazır aydınlatma seti · şeffaf Tube Holder · 1 × LED X-Change Tube daylight sunrise 820 · uygun 20 V / 3 A güç kaynağı · toplam LED gücü 18 W · ürün no. 32770",
    "powerW": 18,
    "recommendedTankLengthCm": [
      82,
      82
    ],
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-aquatank-light-set-tube-holder-1-led/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "sera-aquatank-light-set-tube-holder-2-led",
    "category": "lighting",
    "brand": "Sera",
    "model": "AquaTank Light Set - Tube Holder - 2 LED",
    "specifications": "Tüm sera AquaTank modelleri için hazır aydınlatma seti · şeffaf Tube Holder · 2 × LED X-Change Tube daylight sunrise 820 · uygun 20 V / 3 A güç kaynağı · LED Triple Cable · toplam LED gücü 36 W · ürün no. 32771",
    "powerW": 36,
    "recommendedTankLengthCm": [
      82,
      82
    ],
    "sourceUrl": "https://www.sera.de/en/product/freshwater-aquarium/sera-aquatank-light-set-tube-holder-2-led/",
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "xinyou-xy-180",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-180",
    "specifications": "Biyolojik sünger filtre · Ø7,5 × 6,5 cm sünger · üretici teknik tablosu 100 L, önceki ikincil kaynak 50 L yayımlıyor; kaynak çelişkisi nedeniyle kesin hacim sınırı seçilmedi",
    "requiresAirPump": true,
    "sourceUrl": "https://www.aquariumfiltersponge.com/ProductDetail/1458782660437020672.html",
    "verifiedAt": "2026-10-07",
    "additionalSourceUrls": [
      "https://www.csl-fish.com.my/XINYOU"
    ]
  },
  {
    "id": "xinyou-xy-2836",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2836",
    "specifications": "Hava motoru veya dalgıç pompaya bağlanan biyolojik sünger filtre · üretici sayfa başlığı 80 L, aynı sayfanın teknik tablosu 60 L yayımlıyor; üretici içi çelişki nedeniyle kesin hacim sınırı seçilmedi",
    "requiresAirPump": true,
    "sourceUrl": "https://www.aquariumfiltersponge.com/ProductDetail/1467975067803267072.html",
    "verifiedAt": "2026-10-07",
    "additionalSourceUrls": [
      "https://www.csl-fish.com.my/XINYOU"
    ]
  },
  {
    "id": "xinyou-xy-2901",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2901",
    "specifications": "Dahili dalgıç pompalı, seramik medya hazneli biyolojik sünger filtre · 5 W · 450 L/saat · azami basma yüksekliği 0,8 m · Ø4,7 × 8 cm sünger · güncel kaynaklar 100 L, 120 L, 150 L ve 200 L yayımladığı için kesin akvaryum hacmi seçilmedi",
    "sourceUrl": "https://www.pumpflowaquarium.com/product/xinyou-xy2901-sponge-filter/",
    "verifiedAt": "2026-10-08",
    "ratedFlowLph": 450,
    "powerW": 5,
    "additionalSourceUrls": [
      "https://www.aquariumfiltersponge.com/ProductDetail/1467973044584263680.html",
      "https://www.csl-fish.com.my/XINYOU",
      "https://rozetka.com.ua/ua/272377841/p272377841/",
      "https://www.mercadolibre.com.pe/filtro-pulmon-2901-con-material-y-bomba-para-pecera-acuario/up/MPEU3612644923",
      "https://www.ciceksepeti.com/xinyou-tek-sungerli-motorlu-seramikli-pipo-filtre-xy-2901-kc3908579"
    ]
  },
  {
    "id": "xinyou-xy-280",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-280",
    "specifications": "Hava ile çalışan biyolojik sünger filtre · Ø12 × 6,5 cm sünger · üretici teknik tablosu 150 L, önceki ikincil kaynak 100 L yayımlıyor; kaynak çelişkisi nedeniyle kesin hacim sınırı seçilmedi",
    "requiresAirPump": true,
    "sourceUrl": "https://www.aquariumfiltersponge.com/ProductDetail/1467978501336018944.html",
    "verifiedAt": "2026-10-07",
    "additionalSourceUrls": [
      "https://www.csl-fish.com.my/XINYOU"
    ]
  },
  {
    "id": "xinyou-xy-2811",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2811",
    "specifications": "Biyolojik sünger filtre · Ø8,5 × 10 cm sünger · üretici teknik tablosu 200 L, önceki ikincil kaynak 220 L yayımlıyor; kaynak çelişkisi nedeniyle kesin hacim sınırı seçilmedi",
    "requiresAirPump": true,
    "sourceUrl": "https://www.aquariumfiltersponge.com/ProductDetail/1458783331325837312.html",
    "verifiedAt": "2026-10-07",
    "additionalSourceUrls": [
      "https://www.csl-fish.com.my/XINYOU"
    ]
  },
  {
    "id": "xinyou-xy-2902",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2902",
    "specifications": "Hava motoru veya dalgıç pompaya bağlanan biyolojik sünger filtre · Ø4,7 × 8 cm sünger · üretici sayfa başlığı 100 L, teknik tablo 200 L, önceki ikincil kaynak 220 L yayımlıyor; kesin hacim sınırı seçilmedi",
    "requiresAirPump": true,
    "sourceUrl": "https://www.aquariumfiltersponge.com/ProductDetail/1470357580546781184.html",
    "verifiedAt": "2026-10-07",
    "additionalSourceUrls": [
      "https://www.csl-fish.com.my/XINYOU"
    ]
  },
  {
    "id": "xinyou-xy-2813",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2813",
    "specifications": "Biyolojik sünger filtre · Ø11,3 × 5 cm sünger · üretici teknik tablosu 250 L, önceki ikincil kaynak 380 L yayımlıyor; kaynak çelişkisi nedeniyle kesin hacim sınırı seçilmedi",
    "requiresAirPump": true,
    "sourceUrl": "https://www.aquariumfiltersponge.com/ProductDetail/1458782670503350272.html",
    "verifiedAt": "2026-10-07",
    "additionalSourceUrls": [
      "https://www.csl-fish.com.my/XINYOU"
    ]
  },
  {
    "id": "xinyou-xy-001",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-001",
    "specifications": "Duvara tutunan biyolojik sünger filtre · iki adet Ø6 × 6 × 2 cm sünger · 100 litreye kadar · harici hava motoruyla çalışır",
    "recommendedMaxL": 100,
    "requiresAirPump": true,
    "sourceUrl": "https://www.aquariumfiltersponge.com/ProductDetail/1477970512900358144.html",
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-xy-002",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-002",
    "specifications": "Duvara tutunan biyolojik sünger filtre · iki adet Ø6 × 6 × 4 cm sünger · 200 litreye kadar · harici hava motoruyla çalışır",
    "recommendedMaxL": 200,
    "requiresAirPump": true,
    "sourceUrl": "https://www.aquariumfiltersponge.com/ProductDetail/1477970464508424192.html",
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-xy-003",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-003",
    "specifications": "Duvara tutunan biyolojik sünger filtre · iki adet Ø11,5 × 11,5 cm sünger · 250 litreye kadar · harici hava motoruyla çalışır",
    "recommendedMaxL": 250,
    "requiresAirPump": true,
    "sourceUrl": "https://www.aquariumfiltersponge.com/ProductDetail/1477969719006691328.html",
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-xy-2826",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2826",
    "specifications": "Çift silindirli biyolojik sünger filtre · 200 litreye kadar · harici hava motoruyla çalışır",
    "recommendedMaxL": 200,
    "requiresAirPump": true,
    "sourceUrl": "https://www.aquariumfiltersponge.com/ProductDetail/1458782638072991744.html",
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-xy-2865",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2865",
    "specifications": "Ø10 × 7 cm çevreci süngerli biyolojik filtre · hava motoru veya dalgıç pompaya bağlanabilir · 200 litreye kadar",
    "recommendedMaxL": 200,
    "requiresAirPump": true,
    "sourceUrl": "https://www.aquariumfiltersponge.com/ProductDetail/1458783342046478336.html",
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-xy-2871",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2871",
    "specifications": "Hava kaldırmalı yüksek performanslı biyolojik filtre · Ø8,5 × 10 cm sünger · 200 litreye kadar",
    "recommendedMaxL": 200,
    "requiresAirPump": true,
    "sourceUrl": "https://www.aquariumfiltersponge.com/ProductDetail/1458783356252585984.html",
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-xy-2872",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2872",
    "specifications": "Hava kaldırmalı yüksek performanslı biyolojik filtre · Ø11,3 × 5 cm sünger · 250 litreye kadar",
    "recommendedMaxL": 250,
    "requiresAirPump": true,
    "sourceUrl": "https://www.aquariumfiltersponge.com/ProductDetail/1458783276211179520.html",
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-xy-2820",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2820",
    "specifications": "Hava ile çalışan biyolojik sünger filtre · Ø5 × 6 cm sünger · 40 litreye kadar",
    "recommendedMaxL": 40,
    "requiresAirPump": true,
    "sourceUrl": "https://www.aquariumfiltersponge.com/ProductDetail/1477969594909818880.html",
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-xy-2830",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2830",
    "specifications": "Hava ile çalışan biyolojik sünger filtre · Ø5 × 8 cm sünger · 60 litreye kadar",
    "recommendedMaxL": 60,
    "requiresAirPump": true,
    "sourceUrl": "https://www.aquariumfiltersponge.com/ProductDetail/1477969542686539776.html",
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-xy-2607",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2607",
    "specifications": "Dirsek çıkışlı pnömatik biyolojik sünger filtre · Ø11,3 × 5 cm sünger · 250 litreye kadar",
    "recommendedMaxL": 250,
    "requiresAirPump": true,
    "sourceUrl": "https://www.aquariumfiltersponge.com/ProductDetail/1477968801683046400.html",
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-xy-2608",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2608",
    "specifications": "Ayarlanabilir dirsek çıkışlı pnömatik biyolojik sünger filtre · Ø8,5 × 10 cm sünger · 260 litreye kadar",
    "recommendedMaxL": 260,
    "requiresAirPump": true,
    "sourceUrl": "https://www.aquariumfiltersponge.com/ProductDetail/1477968776445919232.html",
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-xy-2609",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2609",
    "specifications": "Dirsek çıkışlı çok katmanlı biyolojik sünger filtre · Ø11,3 × 10 cm sünger · 380 litreye kadar",
    "recommendedMaxL": 380,
    "requiresAirPump": true,
    "sourceUrl": "https://www.aquariumfiltersponge.com/ProductDetail/1477968747893043200.html",
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-xy-2821",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2821",
    "specifications": "Duvara tutunan tek süngerli biyolojik filtre · Ø6 × 12 cm sünger · 100 litreye kadar",
    "recommendedMaxL": 100,
    "requiresAirPump": true,
    "sourceUrl": "https://www.aquariumfiltersponge.com/ProductDetail/1467979091808190464.html",
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-pk-001",
    "category": "filter",
    "brand": "Xinyou",
    "model": "PK-001",
    "specifications": "Hava ile çalışan yeşil borulu biyolojik sünger filtre · Ø5 × 8 cm sünger · 60 litreye kadar",
    "recommendedMaxL": 60,
    "requiresAirPump": true,
    "sourceUrl": "https://www.aquariumfiltersponge.com/ProductDetail/1477971429397725184.html",
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-pk-002",
    "category": "filter",
    "brand": "Xinyou",
    "model": "PK-002",
    "specifications": "Hava ile çalışan çift süngerli biyolojik filtre · iki adet Ø5 × 8 cm sünger · 120 litreye kadar",
    "recommendedMaxL": 120,
    "requiresAirPump": true,
    "sourceUrl": "https://www.aquariumfiltersponge.com/ProductDetail/1477971371923177472.html",
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-pk-003",
    "category": "filter",
    "brand": "Xinyou",
    "model": "PK-003",
    "specifications": "Hava ile çalışan yeşil borulu biyolojik sünger filtre · Ø6 × 12 cm sünger · 100 litreye kadar",
    "recommendedMaxL": 100,
    "requiresAirPump": true,
    "sourceUrl": "https://www.aquariumfiltersponge.com/ProductDetail/1477971388180299776.html",
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-pk-004",
    "category": "filter",
    "brand": "Xinyou",
    "model": "PK-004",
    "specifications": "Hava ile çalışan biyolojik sünger filtre · Ø6 × 12 cm sünger · 200 litreye kadar",
    "recommendedMaxL": 200,
    "requiresAirPump": true,
    "sourceUrl": "https://www.aquariumfiltersponge.com/ProductDetail/1477970774243246080.html",
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-pk-40",
    "category": "filter",
    "brand": "Xinyou",
    "model": "PK-40",
    "specifications": "Hava ile çalışan biyolojik sünger filtre · Ø5,5 × 5 cm sünger · 40 litreye kadar",
    "recommendedMaxL": 40,
    "requiresAirPump": true,
    "sourceUrl": "https://www.aquariumfiltersponge.com/ProductDetail/1477970785601421312.html",
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-pk-80",
    "category": "filter",
    "brand": "Xinyou",
    "model": "PK-80",
    "specifications": "Hava ile çalışan biyolojik sünger filtre · Ø5,5 × 7,5 cm sünger · 80 litreye kadar",
    "recommendedMaxL": 80,
    "requiresAirPump": true,
    "sourceUrl": "https://www.aquariumfiltersponge.com/ProductDetail/1477970734428663808.html",
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-pk-100",
    "category": "filter",
    "brand": "Xinyou",
    "model": "PK-100",
    "specifications": "Hava ile çalışan biyolojik sünger filtre · Ø8,5 × 5 cm sünger · 100 litreye kadar",
    "recommendedMaxL": 100,
    "requiresAirPump": true,
    "sourceUrl": "https://www.aquariumfiltersponge.com/ProductDetail/1477970719415304192.html",
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-pk-200",
    "category": "filter",
    "brand": "Xinyou",
    "model": "PK-200",
    "specifications": "Hava ile çalışan biyolojik sünger filtre · Ø11,3 × 5 cm sünger · 350 litreye kadar",
    "recommendedMaxL": 350,
    "requiresAirPump": true,
    "sourceUrl": "https://www.aquariumfiltersponge.com/ProductDetail/21.html",
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-pk-220",
    "category": "filter",
    "brand": "Xinyou",
    "model": "PK-220",
    "specifications": "Hava ile çalışan biyolojik sünger filtre · Ø8,5 × 10 cm sünger · 200 litreye kadar",
    "recommendedMaxL": 200,
    "requiresAirPump": true,
    "sourceUrl": "https://www.aquariumfiltersponge.com/ProductDetail/1477970660313366528.html",
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-pk-350",
    "category": "filter",
    "brand": "Xinyou",
    "model": "PK-350",
    "specifications": "Hava ile çalışan biyolojik sünger filtre · Ø11,2 × 10 cm sünger · 350 litreye kadar",
    "recommendedMaxL": 350,
    "requiresAirPump": true,
    "sourceUrl": "https://www.aquariumfiltersponge.com/ProductDetail/1477970618605207552.html",
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-xy-2603",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2603",
    "specifications": "Hava motoruyla çalışan tabanlı biyolojik sünger filtre · 40 litreye kadar · üretici teknik tablosu Ø5,5 × 3,8 cm, Türkiye satıcısı yaklaşık Ø7,5 × 6,5 cm yayımladığı için ölçü çelişkisi görünür tutulur",
    "recommendedMaxL": 40,
    "requiresAirPump": true,
    "sourceUrl": "https://www.aquariumfiltersponge.com/ProductDetail/1477969382564790272.html",
    "additionalSourceUrls": [
      "https://www.kankipetshop.com/xinyou-xy-2603-tabanli-akvaryum-uretim-filtresi-biyolojik-sunger-filtre-krd26639"
    ],
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-xy-2602",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2602",
    "specifications": "Harici hava motoruyla çalışan küçük biyolojik sünger filtre · güncel tam ürün sayfası 4 cm toplam gövde ve 2 cm sünger boyu yayımlıyor · ürün fotoğrafında hava hortumu bağlantısı ve motorsuz gövde doğrulanıyor; hava motoru debisi ve akvaryum hacmi yayımlanmadı",
    "requiresAirPump": true,
    "sourceUrl": "https://www.dilmaclar.com.tr/akvaryum/akvaryum-malzemeleri/akvaryum-filtreleri/prd-xinyou-xy-2602-sunger-filtre-4-cm-xy-2602",
    "additionalSourceUrls": [
      "https://shopee.sg/list/xinyou/sponge%20filter",
      "https://www.alibaba.com/showroom/make-small-pond-filter.html"
    ],
    "verifiedAt": "2026-10-09"
  },
  {
    "id": "xinyou-xy-2606",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2606",
    "specifications": "Harici hava motoruyla çalışan, hava difüzyon odalı tabanlı biyolojik sünger filtre · güncel bir ürün sayfası 80 L yayımlıyor; bağımsız model bazlı kapasite çapraz doğrulaması bulunmadığından kesin hacim sınırı seçilmedi",
    "requiresAirPump": true,
    "sourceUrl": "https://www.nu-pets.co.uk/shop/aquatics/filtration/internal-filters/aquarium-sponge-bio-filter-black-xy-2606/",
    "additionalSourceUrls": [
      "https://thefishworks.com.au/bio-sponge-air-diffusion-filter/",
      "https://www.petkadai.com/product/xinyou-xy-2606-sponge-filter-curved"
    ],
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-xy-2605",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2605",
    "specifications": "Harici hava motoruyla çalışan küçük BIO sünger filtre · güncel tam ürün varyantı ve ambalaj fotoğrafı modeli doğruluyor · ürün fotoğrafında hava hortumu bağlantısı ve motorsuz gövde görülüyor; hava motoru debisi, ölçü ve akvaryum hacmi yayımlanmadı",
    "requiresAirPump": true,
    "sourceUrl": "https://shopee.vn/XINYOU-Sponge-Filter-L%E1%BB%8Dc-BIO-mini-l%C3%A0m-s%E1%BA%A1ch-b%E1%BB%A5i-n%C6%B0%E1%BB%9Bc-t%E1%BA%A1o-vi-sinh-h%E1%BB%93-c%C3%A1-t%C3%A9p-th%E1%BB%A7y-sinh-i.20339539.44261583581",
    "additionalSourceUrls": [
      "https://www.greenaqua.vn/xinyou",
      "https://www.greendeal.vn/xinyou"
    ],
    "verifiedAt": "2026-10-09"
  },
  {
    "id": "xinyou-xy-2822",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2822",
    "specifications": "Hava ile çalışan çift süngerli biyolojik filtre · iki adet Ø6 × 12 cm sünger · 200 litreye kadar",
    "recommendedMaxL": 200,
    "requiresAirPump": true,
    "sourceUrl": "https://www.aquariumfiltersponge.com/ProductDetail/1467975705475887104.html",
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-xy-2825",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2825",
    "specifications": "Hava ile çalışan tek süngerli biyolojik filtre · 200 litreye kadar · üretici sünger ölçüsünü yayımlamıyor",
    "recommendedMaxL": 200,
    "requiresAirPump": true,
    "sourceUrl": "https://www.aquariumfiltersponge.com/ProductDetail/1458782626131808256.html",
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-xy-2831",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2831",
    "specifications": "Hava ile çalışan çift süngerli biyolojik filtre · iki adet Ø5 × 8 cm sünger · 120 litreye kadar",
    "recommendedMaxL": 120,
    "requiresAirPump": true,
    "sourceUrl": "https://www.aquariumfiltersponge.com/ProductDetail/1467976492136628224.html",
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-xy-2837",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2837",
    "specifications": "Harici hava motoru, kafa motoru veya filtre emişine bağlanan büyük biyolojik sünger filtre · Ø16 × 15 cm sünger · güncel satıcılar 680 L, 500 L ve 50 L yayımlıyor; kesin hacim sınırı seçilmedi",
    "requiresAirPump": true,
    "sourceUrl": "https://www.hobbyworld7.com/shop/shopdetail.html?branduid=436479",
    "additionalSourceUrls": [
      "https://www.mixpet.com.tr/xinyou-akvaryum-sungerli-uretim-filtresi-buyuk-boy-xy-2837-urun7254.html",
      "https://rozetka.com.ua/ua/305325483/p305325483/"
    ],
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-xy-2838",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2838",
    "specifications": "Harici hava motoruyla çalışan çok büyük biyolojik sünger filtre · Ø20 × 15 cm sünger · güncel satıcılar 850 L ve 800 L yayımlıyor; kesin hacim sınırı seçilmedi",
    "requiresAirPump": true,
    "sourceUrl": "https://www.hobbyworld7.com/shop/shopdetail.html?branduid=436467",
    "additionalSourceUrls": [
      "https://rozetka.com.ua/ua/305325443/p305325443/"
    ],
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-xy-2863",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2863",
    "specifications": "Harici hava motoruyla çalışan tabanlı küresel biyolojik sünger filtre · yaklaşık Ø6,8 × 4 cm sünger · güncel satıcılar 60 L ve 100 L yayımlıyor; kesin hacim sınırı seçilmedi",
    "requiresAirPump": true,
    "sourceUrl": "https://www.raijucarii.ro/biofiltru-rotund-s-xy-2863-p449745",
    "additionalSourceUrls": [
      "https://vedhafishfarm.com/product/aquarium-filter-fish-tank-biochemical-sponge-filter-xy-2863",
      "https://www.ciceksepeti.com/xinyou-xy-2863-agirlikli-biyolojik-sungerli-akvaryum-uretim-pipo-filtresi-kcm65554222"
    ],
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-xy-2866",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2866",
    "specifications": "Harici hava veya su pompasına bağlanan tabanlı küresel biyolojik sünger filtre · 14 × 9 cm · aynı ürün sayfasında 300 L ve 380 L, başka güncel satıcıda 500 L yayımlanıyor; kesin hacim sınırı seçilmedi",
    "requiresAirPump": true,
    "sourceUrl": "https://okosgazdi.ro/xin-you-xy-filtru-sferic-cu-burete-pentru-acvariu",
    "additionalSourceUrls": [
      "https://www.mercadolibre.com.pe/filtro-esponja-xinyou-xy2866-acuarios-peceras-grande/up/MPEU3418193770",
      "https://aquateesfishland.com.au/products/xy-2863-small-bio-round-sponge-filter-60l"
    ],
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-xy-2873",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2873",
    "specifications": "Harici hava motoruyla çalışan, ayarlanabilir çıkışlı tabanlı biyolojik sünger filtre · yaklaşık Ø11,3 × 5 cm sünger · güncel satıcılar 250 L ve 380 L yayımlıyor; kesin hacim sınırı seçilmedi",
    "requiresAirPump": true,
    "sourceUrl": "https://finest-filters.co.uk/products/air-driven-aquarium-sponge-bio-filter-adjustable-height-xy-287-range-3-sizes",
    "additionalSourceUrls": [
      "https://rozetka.com.ua/ua/305325468/p305325468/",
      "https://happoya.jp/product/1404"
    ],
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-xy-2870",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2870",
    "specifications": "Harici hava motoruyla çalışan, ayarlanabilir çıkışlı tabanlı biyolojik sünger filtre · Ø8,5 × 5 cm sünger · 19–25 cm ayarlanabilir toplam yükseklik · üretici tedarikçi listesi 100 L yayımlıyor",
    "recommendedMaxL": 100,
    "requiresAirPump": true,
    "sourceUrl": "https://www.alibaba.com/wholesale/xy-filter.html",
    "additionalSourceUrls": [
      "https://www.canlipetshop.com/index.php?order=DESC&route=product%2Fsearch&sort=pd.name&tag=filtre",
      "https://shopee.com.my/XINYOU-Aquarium-Fish-Tank-High-Performance-Biochemical-Sponge-Filter-XY-2870-XY-2871-XY-2872-XY-2873-i.105342844.3219997962"
    ],
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-xy-2880",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2880",
    "specifications": "Hava motoruyla çalışan, seramik medya hazneli tek süngerli biyolojik filtre · Ø4,7 × 6,5 cm sünger · 80 litreye kadar",
    "recommendedMaxL": 80,
    "requiresAirPump": true,
    "sourceUrl": "https://rozetka.com.ua/ua/338365441/p338365441/",
    "additionalSourceUrls": [
      "https://thuysinh24.com/san-pham/loc-bio-don-doi-xinyou-xy-2880-don-2881don-2882doi/"
    ],
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-xy-2881",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2881",
    "specifications": "Hava motoruyla çalışan, seramik medya hazneli tek süngerli biyolojik filtre · Türkiye ve Vietnam satıcıları 100 L, başka güncel satıcı 200 L yayımlıyor; kesin hacim sınırı seçilmedi",
    "requiresAirPump": true,
    "sourceUrl": "https://www.trendyol.com/xinyou/xy-2881-akvaryum-sunger-uretim-filtresi-tek-sungerli-p-80476227",
    "additionalSourceUrls": [
      "https://thuysinh24.com/san-pham/loc-bio-don-doi-xinyou-xy-2880-don-2881don-2882doi/",
      "https://onyxaqua.com/products/xinyou-xy2881-aquarium-sponge-filter/"
    ],
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-xy-2882",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2882",
    "specifications": "Hava motoruyla çalışan, seramik medya hazneli çift süngerli biyolojik filtre · iki adet Ø5 × 8 cm sünger · güncel satıcılar 200 L ve 120 L yayımlıyor; kesin hacim sınırı seçilmedi",
    "requiresAirPump": true,
    "sourceUrl": "https://www.fishbits.com.au/products/twin-bio-chemical-sponge-filter-with-media-chambers",
    "additionalSourceUrls": [
      "https://thuysinh24.com/san-pham/loc-bio-don-doi-xinyou-xy-2880-don-2881don-2882doi/",
      "https://www.alibaba.com/product-detail/XY-2882-Bio-Sponge-Aquarium-Material_1600702455974.html"
    ],
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-xy-2897",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2897",
    "specifications": "Harici hava motoruyla çalışan mekanik ve biyolojik sünger filtre · üretici hacim veya debi değeri yayımlamadığından kapasite sınırı atanmadı",
    "requiresAirPump": true,
    "sourceUrl": "https://www.carrefouruae.com/mafuae/en/fish-accessories/xinyou-bio-sponge-xy-2897/p/6921835528979",
    "additionalSourceUrls": [
      "https://www.alibaba.com/bio-sponge-filter-suppliers.html"
    ],
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-xy-2898",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2898",
    "specifications": "Pompasız biyolojik sünger filtre gövdesi · üretici tedarikçi listesi model kimliğini ve pompanın ürüne dahil olmadığını doğruluyor · gereken harici hava/su sürücüsü, debi ve akvaryum hacmi yayımlanmadığından tek başına filtrasyon kapasitesi sayılmaz",
    "passiveComponent": true,
    "capacityDataNote": "9 Ekim 2026 yeniden denetiminde pompanın pakete dahil olmadığı doğrulandı. Gereken harici sürücü türü ve kapasitesi yayımlanmadığı için bu pompasız gövde pasif bileşen olarak tutulur; kullanıcı ayrıca doğrulanmış bir pompa seçmeden filtrasyon kapasitesine eklenmez.",
    "sourceUrl": "https://www.alibaba.com/clean-aquarium-filter-manufacturers.html",
    "additionalSourceUrls": [
      "https://www.scribd.com/document/981460457/Xinyou-Product-price-list-20220520-2025-04-23-18-36-23"
    ],
    "verifiedAt": "2026-10-09"
  },
  {
    "id": "xinyou-xy-2899",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2899",
    "specifications": "Harici hava motoruyla çalışan, ayarlanabilir çıkışlı çift büyük süngerli biyolojik filtre · 14 cm genişlik · 22–35 cm ayarlanabilir yükseklik · 12 cm sünger · paket içeriğinde hava motoru yok · tek pazar yeri 400 L yayımladığı için kesin hacim sınırı seçilmedi",
    "requiresAirPump": true,
    "sourceUrl": "https://burstexpress.com/product/detail?productId=176912961053991713",
    "additionalSourceUrls": [
      "https://plusoceans.speedgabia.com/XinYou/filter/XY_2899.jpg",
      "https://indonesian.alibaba.com/f/kolam-ikan-guppy.html",
      "https://www.alibaba.com/wholesale/fish-pond-filter-big.html",
      "https://www.ebay.com.au/b/Aquarium-Filters/46310/bn_1656768?Tank%2520Capacity=400L",
      "https://www.scribd.com/document/981460457/Xinyou-Product-price-list-20220520-2025-04-23-18-36-23"
    ],
    "verifiedAt": "2026-10-09"
  },
  {
    "id": "xinyou-xy-2895",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2895",
    "specifications": "Harici hava motoruyla çalışan, cama vantuzla tutunan tek süngerli biyolojik filtre · yaklaşık 6 cm gövde ve 15 cm çıkış borusu · yayımlanmış güvenilir hacim veya debi değeri bulunmadığından kapasite sınırı atanmadı · barkod 6921835528955",
    "requiresAirPump": true,
    "sourceUrl": "https://thuysinh24.com/san-pham/may-loc-khi-don-cho-be-ca-nho-xinyou-xy/",
    "additionalSourceUrls": [
      "https://www.cikletistpetshop.com/xy-2895-biyolojik-sunger-976"
    ],
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-xy-2896",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2896",
    "specifications": "Harici hava motoruyla çalışan, cama vantuzla tutunan tek süngerli biyolojik filtre · yaklaşık 8 cm gövde ve 17 × 7 cm çıkış borusu · tek ikincil satıcı 100 L yayımladığından kesin hacim sınırı seçilmedi",
    "requiresAirPump": true,
    "sourceUrl": "https://thuysinh24.com/san-pham/may-loc-khi-don-cho-be-ca-nho-xinyou-xy/",
    "additionalSourceUrls": [
      "https://www.n11.com/urun/xinyou-xy-2896-biyolojik-sungerli-pipo-uretim-filtresi-47901021",
      "https://www.ebay.com.au/itm/205023360553"
    ],
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-xy-2900",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2900",
    "specifications": "Dahili dalgıç pompalı, seramik medya hazneli tek süngerli biyolojik filtre · 5 W · 450 L/saat · satıcılar 100 L ve 150 L yayımlıyor; kesin hacim sınırı seçilmedi",
    "ratedFlowLph": 450,
    "powerW": 5,
    "sourceUrl": "https://aquaway.com.tr/xinyou-tek-sungerli-motorlu-seramikli-pipo-filtre-xy-2900",
    "additionalSourceUrls": [
      "https://epicentrk.ua/shop/mplc-fil-tr-pompa-xinyou-vnutrishnii-biologichnii-akvariumnii-xy-2900-1eccb90d-3e1e-6baa-af80-2f4c7fa43375.html",
      "https://www.petzlifeworld.in/products/xinyou-xy-2900-aquarium-green-sponge-filter-with-pump-and-bio-filter-media-5w-450l-h-single-horizontal-sponge"
    ],
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-xy-2906",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2906",
    "specifications": "Dahili dalgıç pompalı, tek büyük süngerli biyolojik filtre · 4 W · 450 L/saat · 220 V · üretici tedarikçi listesi elektrikli dalgıç yapıyı doğruluyor; bağımsız inceleme 100 L yayımlasa da çalışma biçimini hava motorlu olarak sınıflandırdığı için kesin hacim sınırı seçilmedi",
    "ratedFlowLph": 450,
    "powerW": 4,
    "sourceUrl": "https://aquafishfarmbd.com/product/xy-2906%2C-sponge-pump-filter-single-head-%28size-large%29-361",
    "additionalSourceUrls": [
      "https://www.accio.com/plp/aquarium-filter-outlet-sponge-diffuser-diy",
      "https://www.akuarium.my/filter/best-aquarium-filter-for-small-tank-malaysia/"
    ],
    "verifiedAt": "2026-10-07"
  },
  {
    "id": "xinyou-xy-2907",
    "category": "filter",
    "brand": "Xinyou",
    "model": "XY-2907",
    "specifications": "Dahili su pompalı, çift büyük süngerli biyolojik filtre · 4 W · 450 L/saat · 220 V · seramik medya içermez · bağımsız inceleme hava motorlu ve 200 L olarak sınıflandırdığı için kesin akvaryum hacmi seçilmedi",
    "ratedFlowLph": 450,
    "powerW": 4,
    "sourceUrl": "https://aquafishfarmbd.com/product/xy-2907,-sponge-pump-filter-double-headed-(size-large)-362",
    "additionalSourceUrls": [
      "https://www.accio.com/plp/chemical-filtration-in-aquarium",
      "https://www.akuarium.my/filter/best-aquarium-filter-for-small-tank-malaysia/"
    ],
    "verifiedAt": "2026-10-08"
  },
  {
    "id": "jeneca-gd-403",
    "category": "filter",
    "brand": "Jeneca",
    "model": "GD-403",
    "specifications": "Üç katmanlı ayarlanabilir damlama üst filtresi · 500 L/saat · 8 W · 375 × 83 × 434 mm",
    "adjustableFlow": true,
    "sourceUrl": "https://yellowtail.shop/wp-content/uploads/2025/06/jeneca-gd-403-specifications-top-filter-2-feet-tank.jpg",
    "verifiedAt": "2026-10-09",
    "ratedFlowLph": 500,
    "powerW": 8,
    "additionalSourceUrls": [
      "https://yellowtail.shop/product/jeneca-gd-403-aquarium-top-filter-2-feet-tank/",
      "https://seasunaquarium.com/shop/index.php?Itemid=4&flypage=flypage.tpl&manufacturer_id=31&option=com_virtuemart&page=shop.product_details&pop=0&product_id=1679",
      "https://down-tw.img.susercontent.com/file/tw-11134208-820l8-mm5omcm268021c"
    ]
  },
  {
    "id": "jeneca-gd-503",
    "category": "filter",
    "brand": "Jeneca",
    "model": "GD-503",
    "specifications": "Üç katmanlı ayarlanabilir damlama üst filtresi · 1000 L/saat · 15 W · 472 × 84 × 435 mm",
    "adjustableFlow": true,
    "sourceUrl": "https://yellowtail.shop/wp-content/uploads/2025/06/jeneca-gd-503-aquarium-filter-specs-inside-description.jpg",
    "verifiedAt": "2026-10-09",
    "ratedFlowLph": 1000,
    "powerW": 15,
    "additionalSourceUrls": [
      "https://yellowtail.shop/product/jeneca-gd-503-aquarium-top-filter-2-5-feet-tank/",
      "https://seasunaquarium.com/shop/index.php?Itemid=4&flypage=flypage.tpl&option=com_virtuemart&page=shop.product_details&pop=0&product_id=1678",
      "https://down-tw.img.susercontent.com/file/tw-11134208-820l8-mm5omcm268021c"
    ]
  },
  {
    "id": "jeneca-gd-320",
    "category": "filter",
    "brand": "Jeneca",
    "model": "GD-320",
    "specifications": "Ayarlanabilir çerçeveli mini üst filtre · 250 L/saat · 4 W · 361 × 70 × 280 mm · 27–35 cm uzunluğa ve en fazla 25 cm yüksekliğe sahip akvaryumlar",
    "ratedFlowLph": 250,
    "powerW": 4,
    "recommendedTankLengthCm": [
      27,
      35
    ],
    "adjustableFlow": true,
    "sourceUrl": "https://sc04.alicdn.com/kf/Hdb5f1165cda44a9d9e87a711661e8006v.jpg",
    "additionalSourceUrls": [
      "https://www.alibaba.co.uk/product-detail/Jeneca-Electric-Aquarium-Filter-3-in_60470562333.html",
      "https://shopee.vn/jenecavietnam",
      "https://www.jd.com/hprm/69948c2d45ef402cc1c8.html?brand=%E9%87%91%E5%88%A9%E4%BD%B3%EF%BC%88Jeneca%EF%BC%89"
    ],
    "verifiedAt": "2026-10-09"
  },
  {
    "id": "eurostar-motorized-sponge-medium",
    "category": "filter",
    "brand": "Eurostar",
    "model": "Motorlu Pipo Filtre Medium",
    "specifications": "Kendinden motorlu, filtre medyası hazneli sünger filtre · 5 W · ürün kodu 452-SG-YU228C-1 · barkod 1452000189084 · 17,5 × 23 cm · 5 × 12 cm sünger",
    "powerW": 5,
    "capacityDataNote": "28 Ekim 2026 son denetiminde Türkiye yetkili satıcısı ile güncel satış/fiyat sayfaları 5 W güç, ürün kodu, barkod ve ölçüleri doğruladı; hiçbirinde su debisi veya önerilen hacim yayımlanmadı. Farklı marka/voltajla satılan YU228C türevlerinden değer aktarılmadığı için otomatik kapasite hesabına katılmaz.",
    "sourceUrl": "https://atakanpetshop.com/eurostar-motorlu-pipo-filtre---filtre-malzemeli-medium-5w",
    "additionalSourceUrls": [
      "https://www.egeakvaryum.com/eurostar-5w-motorlu-pipo-filtre-malzemeli-medium",
      "https://www.idefix.com/eurostar-5w-motorlu-pipo-filtre-malzemeli-medium-p-3656792",
      "https://www.akakce.com/akvaryum-filtresi/en-ucuz-eurostar-5w-motorlu-pipo-filtre-malzemeli-medium-fiyati%2C738874396.html"
    ],
    "verifiedAt": "2026-10-28"
  },
  {
    "id": "eurostar-motorized-sponge-large",
    "category": "filter",
    "brand": "Eurostar",
    "model": "Motorlu Pipo Filtre Large",
    "specifications": "Kendinden motorlu, filtre medyası hazneli sünger filtre · 5 W · ürün kodu 452-SG-YU229C-1 · barkod 1452000189077 · 18,5 × 25 cm · 6 × 13 cm sünger",
    "powerW": 5,
    "capacityDataNote": "28 Ekim 2026 son denetiminde Türkiye yetkili satıcısı ile güncel satış/fiyat sayfaları 5 W güç, ürün kodu ve barkodu doğruladı; hiçbirinde su debisi veya önerilen hacim yayımlanmadı. Farklı marka/voltajla satılan YU229C türevlerinden değer aktarılmadığı için otomatik kapasite hesabına katılmaz.",
    "sourceUrl": "https://atakanpetshop.com/eurostar-motorlu-pipo-filtre---filtre-malzemeli-large-5w",
    "additionalSourceUrls": [
      "https://akvaryumbalikavm.com.tr/eurostar-motorlu-pipo-filtre-filtre-malzemeli-large-5w",
      "https://www.idefix.com/eurostar-5w-motorlu-pipo-filtre-malzemeli-large-p-3656791",
      "https://www.akakce.com/akvaryum-filtresi/en-ucuz-eurostar-5w-motorlu-pipo-filtre-malzemeli-large-fiyati%2C610818946.html",
      "https://www.ilgipet.com/eurostar-5w-motorlu-pipo-filtre-malzemeli-large-8337"
    ],
    "verifiedAt": "2026-10-28"
  },
  {
    "id": "dophin-h200",
    "category": "filter",
    "brand": "Dophin",
    "model": "H-200",
    "specifications": "Tatlı/deniz suyu için mekanik ve biyolojik askı filtre · biyolojik kartuş ve karbon kartuş dahil · 230 V / 50 Hz · 370 L/saat · 3,4 W · 75 litreye kadar",
    "ratedFlowLph": 370,
    "powerW": 3.4,
    "recommendedMaxL": 75,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-slim-hanging-filter-h80.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-h300",
    "category": "filter",
    "brand": "Dophin",
    "model": "H-300",
    "specifications": "Tatlı/deniz suyu için mekanik ve biyolojik askı filtre · biyolojik kartuş ve karbon kartuş dahil · 230 V / 50 Hz · 440 L/saat · 5,2 W · 100 litreye kadar",
    "ratedFlowLph": 440,
    "powerW": 5.2,
    "recommendedMaxL": 100,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-slim-hanging-filter-h80.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-h500",
    "category": "filter",
    "brand": "Dophin",
    "model": "H-500",
    "specifications": "Tatlı/deniz suyu için mekanik ve biyolojik askı filtre · biyolojik kartuş ve karbon kartuş dahil · 230 V / 50 Hz · 580 L/saat · 6,2 W · 150 litreye kadar",
    "ratedFlowLph": 580,
    "powerW": 6.2,
    "recommendedMaxL": 150,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-slim-hanging-filter-h80.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-h800",
    "category": "filter",
    "brand": "Dophin",
    "model": "H-800",
    "specifications": "Tatlı/deniz suyu için mekanik ve biyolojik askı filtre · biyolojik kartuş ve karbon kartuş dahil · 230 V / 50 Hz · 1000 L/saat · 8,1 W · 200 litreye kadar",
    "ratedFlowLph": 1000,
    "powerW": 8.1,
    "recommendedMaxL": 200,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-slim-hanging-filter-h80.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-fb1000f",
    "category": "filter",
    "brand": "Dophin",
    "model": "FB-1000F",
    "specifications": "Kompakt, dalga yapma işlevli iç filtre · yağmurlama borulu sürüm seçeneği · 230 V / 50 Hz · 300 L/saat · 3,3 W · 50 litreye kadar",
    "ratedFlowLph": 300,
    "powerW": 3.3,
    "recommendedMaxL": 50,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-internal-filter-fb4000.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-fb2000f",
    "category": "filter",
    "brand": "Dophin",
    "model": "FB-2000F",
    "specifications": "Kompakt, dalga yapma işlevli iç filtre · yağmurlama borulu sürüm seçeneği · 230 V / 50 Hz · 400 L/saat · 5 W · 80 litreye kadar",
    "ratedFlowLph": 400,
    "powerW": 5,
    "recommendedMaxL": 80,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-internal-filter-fb4000.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-fb3000f",
    "category": "filter",
    "brand": "Dophin",
    "model": "FB-3000F",
    "specifications": "Kompakt, dalga yapma işlevli iç filtre · yağmurlama borulu sürüm seçeneği · 230 V / 50 Hz · 480 L/saat · 7,2 W · 110 litreye kadar",
    "ratedFlowLph": 480,
    "powerW": 7.2,
    "recommendedMaxL": 110,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-internal-filter-fb4000.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-fb4000f",
    "category": "filter",
    "brand": "Dophin",
    "model": "FB-4000F",
    "specifications": "Kompakt, dalga yapma işlevli iç filtre · yağmurlama borulu sürüm seçeneği · 230 V / 50 Hz · 760 L/saat · 13,8 W · 140 litreye kadar",
    "ratedFlowLph": 760,
    "powerW": 13.8,
    "recommendedMaxL": 140,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-internal-filter-fb4000.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-cf300",
    "category": "filter",
    "brand": "Dophin",
    "model": "CF-300",
    "specifications": "Mini dış filtre · 410 L/saat · 6,7 W · 60–110 litre · 3 karbon kartuşu ve 1 kaba sünger",
    "ratedFlowLph": 410,
    "powerW": 6.7,
    "recommendedMinL": 60,
    "recommendedMaxL": 110,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-external-canister-filter-cf300html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-bp189",
    "category": "air_pump",
    "brand": "Dophin",
    "model": "BP-189",
    "specifications": "Şebeke ve 2600 mAh lityum batarya ile çift beslemeli taşınabilir hava motoru · 230 V / 50 Hz modunda 96 L/saat, 5 W ve 0,013 MPa · batarya modunda 72 L/saat, 0,9 W ve 0,012 MPa · 30–120 litre · tam şarjla 30 saati aşan çalışma · aşırı şarj/deşarj/akım koruması",
    "ratedFlowLph": 96,
    "powerW": 5,
    "recommendedMinL": 30,
    "recommendedMaxL": 120,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-li-battery-aquarium-air-pump-bp189.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-bp188",
    "category": "air_pump",
    "brand": "Dophin",
    "model": "BP-188",
    "specifications": "AC/DC hava motoru · 230 V / 50 Hz · 120 L/saat · 0,016 MPa · 0,5 m azami hava basma yüksekliği · 6,1 W · 120–230 litre",
    "ratedFlowLph": 120,
    "powerW": 6.1,
    "recommendedMinL": 120,
    "recommendedMaxL": 230,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-air-pump-ac-dc-bp188.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-bp1",
    "category": "air_pump",
    "brand": "Dophin",
    "model": "BP1",
    "specifications": "1,5 V kuru pilli hava motoru · 24 L/saat · 0,01 MPa · 1,9 W · 30–60 litre",
    "ratedFlowLph": 24,
    "powerW": 1.9,
    "recommendedMinL": 30,
    "recommendedMaxL": 60,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-air-pump-bp1.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-ap1600",
    "category": "air_pump",
    "brand": "Dophin",
    "model": "AP1600",
    "specifications": "Type-C bağlantılı düşük voltajlı sessiz hava motoru · çalışma LED'i · 230 V / 50 Hz · 100 L/saat · 1,8 W · üretici akvaryum hacmi yayımlamıyor",
    "ratedFlowLph": 100,
    "powerW": 1.8,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-air-pump-type-c-ap1600.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-ap1500",
    "category": "air_pump",
    "brand": "Dophin",
    "model": "AP1500",
    "specifications": "Kompakt sessiz hava motoru · 230 V / 50 Hz · 36 L/saat · 0,008 MPa · 1,9 W · 30–60 litre",
    "ratedFlowLph": 36,
    "powerW": 1.9,
    "recommendedMinL": 30,
    "recommendedMaxL": 60,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-air-pump-ap1500.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-ap1301",
    "category": "air_pump",
    "brand": "Dophin",
    "model": "AP1301",
    "specifications": "Süper sessiz kompakt hava motoru · 230 V / 50 Hz · 96 L/saat · 0,01 MPa · 1,8 W · 40–80 litre",
    "ratedFlowLph": 96,
    "powerW": 1.8,
    "recommendedMinL": 40,
    "recommendedMaxL": 80,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-air-pump-ap1301.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-ap1302",
    "category": "air_pump",
    "brand": "Dophin",
    "model": "AP1302",
    "specifications": "Süper sessiz kompakt hava motoru · 230 V / 50 Hz · 120 L/saat · 0,01 MPa · 2,5 W · 120–200 litre",
    "ratedFlowLph": 120,
    "powerW": 2.5,
    "recommendedMinL": 120,
    "recommendedMaxL": 200,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-air-pump-ap1301.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-ap1501",
    "category": "air_pump",
    "brand": "Dophin",
    "model": "AP1501",
    "specifications": "Ayarlanabilir hava çıkışlı süper sessiz kompakt hava motoru · 230 V / 50 Hz · 120 L/saat · 0,01 MPa · 1,8 W · 40–80 litre",
    "ratedFlowLph": 120,
    "powerW": 1.8,
    "recommendedMinL": 40,
    "recommendedMaxL": 80,
    "adjustableFlow": true,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-air-pump-ap1501.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-ap1502",
    "category": "air_pump",
    "brand": "Dophin",
    "model": "AP1502",
    "specifications": "Ayarlanabilir hava çıkışlı süper sessiz kompakt hava motoru · 230 V / 50 Hz · 144 L/saat · 0,01 MPa · 2 W · 120–200 litre",
    "ratedFlowLph": 144,
    "powerW": 2,
    "recommendedMinL": 120,
    "recommendedMaxL": 200,
    "adjustableFlow": true,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-air-pump-ap1501.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-h80",
    "category": "filter",
    "brand": "Dophin",
    "model": "H-80",
    "specifications": "Tatlı/deniz suyu için mekanik ve biyolojik askı filtre · biyolojik kartuş ve karbon kartuş dahil · 230 V / 50 Hz · 190 L/saat · 2,7 W · 25 litreye kadar",
    "ratedFlowLph": 190,
    "powerW": 2.7,
    "recommendedMaxL": 25,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-slim-hanging-filter-h80.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-h100",
    "category": "filter",
    "brand": "Dophin",
    "model": "H-100",
    "specifications": "Tatlı/deniz suyu için mekanik ve biyolojik askı filtre · biyolojik kartuş ve karbon kartuş dahil · 230 V / 50 Hz · 350 L/saat · 3,4 W · 50 litreye kadar",
    "ratedFlowLph": 350,
    "powerW": 3.4,
    "recommendedMaxL": 50,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-slim-hanging-filter-h80.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-cf2500",
    "category": "filter",
    "brand": "Dophin",
    "model": "CF2500",
    "specifications": "Tahliye sistemli çok kademeli dış filtre · 750 L/saat · 9,3 W",
    "ratedFlowLph": 750,
    "powerW": 9.3,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-external-uv-canister-filter-with-drainage-system.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-cf2500-uv",
    "category": "filter",
    "brand": "Dophin",
    "model": "CF2500UV",
    "specifications": "Entegre UV güvenlik anahtarlı, tahliye sistemli çok kademeli dış filtre · 750 L/saat · toplam 20,8 W · üretici ayrı UV lamba gücü yayımlamıyor",
    "ratedFlowLph": 750,
    "powerW": 20.8,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-external-uv-canister-filter-with-drainage-system.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-cf2600",
    "category": "filter",
    "brand": "Dophin",
    "model": "CF2600",
    "specifications": "Tahliye sistemli çok kademeli dış filtre · 850 L/saat · 9,3 W",
    "ratedFlowLph": 850,
    "powerW": 9.3,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-external-uv-canister-filter-with-drainage-system.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-cf2600-uv",
    "category": "filter",
    "brand": "Dophin",
    "model": "CF2600UV",
    "specifications": "Entegre UV güvenlik anahtarlı, tahliye sistemli çok kademeli dış filtre · 850 L/saat · toplam 20,8 W · üretici ayrı UV lamba gücü yayımlamıyor",
    "ratedFlowLph": 850,
    "powerW": 20.8,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-external-uv-canister-filter-with-drainage-system.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-cf2700",
    "category": "filter",
    "brand": "Dophin",
    "model": "CF2700",
    "specifications": "Tahliye sistemli çok kademeli dış filtre · 1200 L/saat · 13,2 W",
    "ratedFlowLph": 1200,
    "powerW": 13.2,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-external-uv-canister-filter-with-drainage-system.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-cf2700-uv",
    "category": "filter",
    "brand": "Dophin",
    "model": "CF2700UV",
    "specifications": "Entegre UV güvenlik anahtarlı, tahliye sistemli çok kademeli dış filtre · 1200 L/saat · toplam 25,5 W · üretici ayrı UV lamba gücü yayımlamıyor",
    "ratedFlowLph": 1200,
    "powerW": 25.5,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-external-uv-canister-filter-with-drainage-system.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-cf2800",
    "category": "filter",
    "brand": "Dophin",
    "model": "CF2800",
    "specifications": "Tahliye sistemli çok kademeli dış filtre · 1400 L/saat · 17 W",
    "ratedFlowLph": 1400,
    "powerW": 17,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-external-uv-canister-filter-with-drainage-system.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-cf2800-uv",
    "category": "filter",
    "brand": "Dophin",
    "model": "CF2800UV",
    "specifications": "Entegre UV güvenlik anahtarlı, tahliye sistemli çok kademeli dış filtre · 1400 L/saat · toplam 29,3 W · üretici ayrı UV lamba gücü yayımlamıyor",
    "ratedFlowLph": 1400,
    "powerW": 29.3,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-external-uv-canister-filter-with-drainage-system.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-cf2000-prefilter",
    "category": "filter",
    "brand": "Dophin",
    "model": "CF2000 Ön Filtre",
    "specifications": "Pompasız pasif dış ön filtre · 360° dönebilen tahliye vanası · entegre filtre malzemesi tutucusu · bağımsız debi ve güç değeri yoktur",
    "passiveComponent": true,
    "auxiliaryFiltration": true,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-external-pre-canister-filter-cf2000.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-f-800",
    "category": "filter",
    "brand": "Dophin",
    "model": "F-800",
    "specifications": "Ayarlanabilir debili, oksijenlendirmeli iç filtre · geniş filtre malzemesi kutusu · 360 L/saat · 5,3 W · 80 litreye kadar",
    "ratedFlowLph": 360,
    "powerW": 5.3,
    "recommendedMaxL": 80,
    "adjustableFlow": true,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-internal-filter-f800.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-f-1200",
    "category": "filter",
    "brand": "Dophin",
    "model": "F-1200",
    "specifications": "Ayarlanabilir debili, oksijenlendirmeli iç filtre · geniş filtre malzemesi kutusu · 500 L/saat · 5,8 W · 120 litreye kadar",
    "ratedFlowLph": 500,
    "powerW": 5.8,
    "recommendedMaxL": 120,
    "adjustableFlow": true,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-internal-filter-f800.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-f-2000",
    "category": "filter",
    "brand": "Dophin",
    "model": "F-2000",
    "specifications": "Ayarlanabilir debili, oksijenlendirmeli iç filtre · geniş filtre malzemesi kutusu · 800 L/saat · 16 W · 160 litreye kadar",
    "ratedFlowLph": 800,
    "powerW": 16,
    "recommendedMaxL": 160,
    "adjustableFlow": true,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-internal-filter-f800.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-fc-601",
    "category": "filter",
    "brand": "Dophin",
    "model": "FC-601",
    "specifications": "Değiştirilebilir kartuşlu, sığ akvaryuma uygun motor yerleşimli iç filtre · biyolojik sünger · tatlı/deniz suyu uyumlu · 670 L/saat · 6,3 W · 130 litreye kadar",
    "ratedFlowLph": 670,
    "powerW": 6.3,
    "recommendedMaxL": 130,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-internal-filter-fc601.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-fc-602",
    "category": "filter",
    "brand": "Dophin",
    "model": "FC-602",
    "specifications": "Değiştirilebilir kartuşlu, sığ akvaryuma uygun motor yerleşimli iç filtre · biyolojik sünger · tatlı/deniz suyu uyumlu · 170–200 L/saat · 3 W · 30 litreye kadar · otomatik uygunluk analizinde yayımlanan alt debi olan 170 L/saat kullanılır",
    "ratedFlowLph": 170,
    "powerW": 3,
    "recommendedMaxL": 30,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-internal-filter-fc601.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-fc-603",
    "category": "filter",
    "brand": "Dophin",
    "model": "FC-603",
    "specifications": "Değiştirilebilir kartuşlu, sığ akvaryuma uygun motor yerleşimli iç filtre · biyolojik sünger · tatlı/deniz suyu uyumlu · 280 L/saat · 4,2 W · 55 litreye kadar",
    "ratedFlowLph": 280,
    "powerW": 4.2,
    "recommendedMaxL": 55,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-internal-filter-fc601.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-fc-604",
    "category": "filter",
    "brand": "Dophin",
    "model": "FC-604",
    "specifications": "Değiştirilebilir kartuşlu, sığ akvaryuma uygun motor yerleşimli iç filtre · biyolojik sünger · tatlı/deniz suyu uyumlu · 380 L/saat · 5 W · 75 litreye kadar",
    "ratedFlowLph": 380,
    "powerW": 5,
    "recommendedMaxL": 75,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-internal-filter-fc601.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-fc-700",
    "category": "filter",
    "brand": "Dophin",
    "model": "FC-700",
    "specifications": "Değiştirilebilir kartuşlu, sığ akvaryuma uygun motor yerleşimli iç filtre · biyolojik sünger · tatlı/deniz suyu uyumlu · 180 L/saat · 3 W · 35 litreye kadar",
    "ratedFlowLph": 180,
    "powerW": 3,
    "recommendedMaxL": 35,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-internal-filter-fc601.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-p-130",
    "category": "other",
    "brand": "Dophin",
    "model": "P-130",
    "specifications": "Ayarlanabilir debili dalgıç mini su pompası · 230 V / 50 Hz · 200 L/saat · 3 W · 30 litreye kadar",
    "ratedFlowLph": 200,
    "powerW": 3,
    "recommendedMaxL": 30,
    "adjustableFlow": true,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-small-water-pump-fountain-pump-p150.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-p-150",
    "category": "other",
    "brand": "Dophin",
    "model": "P-150",
    "specifications": "Ayarlanabilir debili dalgıç mini su pompası · 230 V / 50 Hz · 250 L/saat · 3,2 W · 40 litreye kadar",
    "ratedFlowLph": 250,
    "powerW": 3.2,
    "recommendedMaxL": 40,
    "adjustableFlow": true,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-small-water-pump-fountain-pump-p150.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-p-200",
    "category": "other",
    "brand": "Dophin",
    "model": "P-200",
    "specifications": "Ayarlanabilir debili dalgıç mini su pompası · 230 V / 50 Hz · 300 L/saat · 3,5 W · 60 litreye kadar",
    "ratedFlowLph": 300,
    "powerW": 3.5,
    "recommendedMaxL": 60,
    "adjustableFlow": true,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-small-water-pump-fountain-pump-p150.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-p-350",
    "category": "other",
    "brand": "Dophin",
    "model": "P-350",
    "specifications": "Ayarlanabilir debili dalgıç mini su pompası · 230 V / 50 Hz · 320 L/saat · 3,6 W · 80 litreye kadar",
    "ratedFlowLph": 320,
    "powerW": 3.6,
    "recommendedMaxL": 80,
    "adjustableFlow": true,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-small-water-pump-fountain-pump-p150.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-p-160-usb",
    "category": "other",
    "brand": "Dophin",
    "model": "P-160 USB",
    "specifications": "Ayarlanabilir debili dalgıç mini su pompası · 5 V USB · 250 L/saat · 2,4 W · 40 litreye kadar",
    "ratedFlowLph": 250,
    "powerW": 2.4,
    "recommendedMaxL": 40,
    "adjustableFlow": true,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-small-water-pump-fountain-pump-p150.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-aa300",
    "category": "other",
    "brand": "Dophin",
    "model": "AA300",
    "specifications": "Dalgıç su pompası · 230 V / 50 Hz · 300 L/saat · 4,3 W · 50 litreye kadar",
    "ratedFlowLph": 300,
    "powerW": 4.3,
    "recommendedMaxL": 50,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-submersible-pump-aa300.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-aa500",
    "category": "other",
    "brand": "Dophin",
    "model": "AA500",
    "specifications": "Dalgıç su pompası · 230 V / 50 Hz · 500 L/saat · 8,2 W · 100 litreye kadar",
    "ratedFlowLph": 500,
    "powerW": 8.2,
    "recommendedMaxL": 100,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-submersible-pump-aa300.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-aa1000",
    "category": "other",
    "brand": "Dophin",
    "model": "AA1000",
    "specifications": "Dalgıç su pompası · 230 V / 50 Hz · 1100 L/saat · 15 W · 200 litreye kadar",
    "ratedFlowLph": 1100,
    "powerW": 15,
    "recommendedMaxL": 200,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-submersible-pump-aa300.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-aa2000",
    "category": "other",
    "brand": "Dophin",
    "model": "AA2000",
    "specifications": "Dalgıç su pompası · 230 V / 50 Hz · 1700 L/saat · 28 W · 300 litreye kadar",
    "ratedFlowLph": 1700,
    "powerW": 28,
    "recommendedMaxL": 300,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-submersible-pump-aa300.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-aa3000",
    "category": "other",
    "brand": "Dophin",
    "model": "AA3000",
    "specifications": "Dalgıç su pompası · 230 V / 50 Hz · 2000 L/saat · 41 W · 400 litreye kadar",
    "ratedFlowLph": 2000,
    "powerW": 41,
    "recommendedMaxL": 400,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-submersible-pump-aa300.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-aa4000",
    "category": "other",
    "brand": "Dophin",
    "model": "AA4000",
    "specifications": "Dalgıç su pompası · 230 V / 50 Hz · 2700 L/saat · 75 W · 500 litreye kadar",
    "ratedFlowLph": 2700,
    "powerW": 75,
    "recommendedMaxL": 500,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-submersible-pump-aa300.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-aa6000",
    "category": "other",
    "brand": "Dophin",
    "model": "AA6000",
    "specifications": "Dalgıç su pompası · 230 V / 50 Hz · 3600 L/saat · 116 W · 600 litreye kadar",
    "ratedFlowLph": 3600,
    "powerW": 116,
    "recommendedMaxL": 600,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-submersible-pump-aa300.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-aa9000",
    "category": "other",
    "brand": "Dophin",
    "model": "AA9000",
    "specifications": "Dalgıç su pompası · 230 V / 50 Hz · 4300 L/saat · 125 W · 800 litreye kadar",
    "ratedFlowLph": 4300,
    "powerW": 125,
    "recommendedMaxL": 800,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-submersible-pump-aa300.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-cf-11008",
    "category": "filter",
    "brand": "Dophin",
    "model": "CF 11008",
    "specifications": "Entegre CO₂ karıştırma sistemli çok kademeli dış filtre · ısıtıcı bölmesi · kendinden ilk çalıştırma · 950 L/saat · 120–200 litre · üreticinin 230 V / 50 Hz tablosunda güç 10/18 W olarak çift değerle yayımlanmış, karşılıkları açıklanmamıştır",
    "ratedFlowLph": 950,
    "recommendedMinL": 120,
    "recommendedMaxL": 200,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-co2-canister-filter-wholesale.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-cf-11308",
    "category": "filter",
    "brand": "Dophin",
    "model": "CF 11308",
    "specifications": "Entegre CO₂ karıştırma sistemli çok kademeli dış filtre · ısıtıcı bölmesi · kendinden ilk çalıştırma · 1200 L/saat · 140–230 litre · üreticinin 230 V / 50 Hz tablosunda güç 14/20 W olarak çift değerle yayımlanmış, karşılıkları açıklanmamıştır",
    "ratedFlowLph": 1200,
    "recommendedMinL": 140,
    "recommendedMaxL": 230,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-co2-canister-filter-wholesale.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-cf-11508",
    "category": "filter",
    "brand": "Dophin",
    "model": "CF 11508",
    "specifications": "Entegre CO₂ karıştırma sistemli çok kademeli dış filtre · ısıtıcı bölmesi · kendinden ilk çalıştırma · 1450 L/saat · 160–260 litre · üreticinin 230 V / 50 Hz tablosunda güç 15/20 W olarak çift değerle yayımlanmış, karşılıkları açıklanmamıştır",
    "ratedFlowLph": 1450,
    "recommendedMinL": 160,
    "recommendedMaxL": 260,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-co2-canister-filter-wholesale.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-cf-12008",
    "category": "filter",
    "brand": "Dophin",
    "model": "CF 12008",
    "specifications": "Entegre CO₂ karıştırma sistemli çok kademeli dış filtre · ısıtıcı bölmesi · otomatik ilk çalıştırma · 750 L/saat · 100–160 litre · üreticinin 230 V / 50 Hz tablosunda güç 10/18 W olarak çift değerle yayımlanmış, karşılıkları açıklanmamıştır",
    "ratedFlowLph": 750,
    "recommendedMinL": 100,
    "recommendedMaxL": 160,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-co2-canister-filter-wholesale.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-cf-12308",
    "category": "filter",
    "brand": "Dophin",
    "model": "CF 12308",
    "specifications": "Entegre CO₂ karıştırma sistemli çok kademeli dış filtre · ısıtıcı bölmesi · otomatik ilk çalıştırma · 1000 L/saat · 120–200 litre · üreticinin 230 V / 50 Hz tablosunda güç 14/20 W olarak çift değerle yayımlanmış, karşılıkları açıklanmamıştır",
    "ratedFlowLph": 1000,
    "recommendedMinL": 120,
    "recommendedMaxL": 200,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-co2-canister-filter-wholesale.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-cf-12508",
    "category": "filter",
    "brand": "Dophin",
    "model": "CF 12508",
    "specifications": "Entegre CO₂ karıştırma sistemli çok kademeli dış filtre · ısıtıcı bölmesi · otomatik ilk çalıştırma · 1250 L/saat · 140–230 litre · üreticinin 230 V / 50 Hz tablosunda güç 15/20 W olarak çift değerle yayımlanmış, karşılıkları açıklanmamıştır",
    "ratedFlowLph": 1250,
    "recommendedMinL": 140,
    "recommendedMaxL": 230,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-co2-canister-filter-wholesale.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-sh-200",
    "category": "filter",
    "brand": "Dophin",
    "model": "SH-200",
    "specifications": "Tatlı/deniz suyu için yüzey yağ sıyırıcılı ince askı filtre · sessiz dalgıç pompa · mekanik ve biyolojik filtrasyon · standart karbon kartuşu, isteğe bağlı ek karbon/biyolojik kartuş alanı · 230 V / 50 Hz · 150 L/saat · 2,8 W · 20 litreye kadar",
    "ratedFlowLph": 150,
    "powerW": 2.8,
    "recommendedMaxL": 20,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-slim-hanging-filter-sh380.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-sh-250",
    "category": "filter",
    "brand": "Dophin",
    "model": "SH-250",
    "specifications": "Tatlı/deniz suyu için yüzey yağ sıyırıcılı ince askı filtre · sessiz dalgıç pompa · mekanik ve biyolojik filtrasyon · standart karbon kartuşu, isteğe bağlı ek karbon/biyolojik kartuş alanı · 230 V / 50 Hz · 250 L/saat · 4 W · 40 litreye kadar",
    "ratedFlowLph": 250,
    "powerW": 4,
    "recommendedMaxL": 40,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-slim-hanging-filter-sh380.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-sh-280",
    "category": "filter",
    "brand": "Dophin",
    "model": "SH-280",
    "specifications": "Tatlı/deniz suyu için yüzey yağ sıyırıcılı ince askı filtre · sessiz dalgıç pompa · mekanik ve biyolojik filtrasyon · standart karbon kartuşu, isteğe bağlı ek karbon/biyolojik kartuş alanı · 230 V / 50 Hz · 280 L/saat · 4,1 W · 60 litreye kadar",
    "ratedFlowLph": 280,
    "powerW": 4.1,
    "recommendedMaxL": 60,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-slim-hanging-filter-sh380.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-sh-380",
    "category": "filter",
    "brand": "Dophin",
    "model": "SH-380",
    "specifications": "Tatlı/deniz suyu için yüzey yağ sıyırıcılı ince askı filtre · sessiz dalgıç pompa · mekanik ve biyolojik filtrasyon · standart karbon kartuşu, isteğe bağlı ek karbon/biyolojik kartuş alanı · 230 V / 50 Hz · 380 L/saat · 4 W · 80 litreye kadar",
    "ratedFlowLph": 380,
    "powerW": 4,
    "recommendedMaxL": 80,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-slim-hanging-filter-sh380.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-c2400",
    "category": "filter",
    "brand": "Dophin",
    "model": "C2400",
    "specifications": "Çok kademeli dış filtre · 3000 L/saat · 47 W · 400–660 litre",
    "ratedFlowLph": 3000,
    "powerW": 47,
    "recommendedMinL": 400,
    "recommendedMaxL": 660,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-external-uv-canister-filter-c2400.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-c2400-uv",
    "category": "filter",
    "brand": "Dophin",
    "model": "C2400UV",
    "specifications": "Entegre 9 W UV-C'li çok kademeli dış filtre · 3000 L/saat · toplam 58 W · 400–660 litre",
    "ratedFlowLph": 3000,
    "powerW": 58,
    "integratedUvcW": 9,
    "recommendedMinL": 400,
    "recommendedMaxL": 660,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-external-uv-canister-filter-c2400.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-ah-1006-25",
    "category": "heater",
    "brand": "Dophin",
    "model": "AH-1006 25 W",
    "specifications": "Dahili termostatlı, sıcaklık ayar düğmeli ve ısıtma göstergeli tam daldırılabilir cam ısıtıcı · 25 W · 22 cm · 25 litreye kadar · hedef sıcaklığa ulaştığında otomatik durur",
    "powerW": 25,
    "recommendedMaxL": 25,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-heater-ah1006.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-ah-1008-25",
    "category": "heater",
    "brand": "Dophin",
    "model": "AH-1008 25 W",
    "specifications": "Dahili termostatlı, sıcaklık ayar düğmeli ve ısıtma göstergeli tam daldırılabilir cam ısıtıcı · 25 W · 22 cm · 25 litreye kadar · hedef sıcaklığa ulaştığında otomatik durur",
    "powerW": 25,
    "recommendedMaxL": 25,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-submersible-heater-ah1008.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-ah-1006-50",
    "category": "heater",
    "brand": "Dophin",
    "model": "AH-1006 50 W",
    "specifications": "Dahili termostatlı, sıcaklık ayar düğmeli ve ısıtma göstergeli tam daldırılabilir cam ısıtıcı · 50 W · 22 cm · 50 litreye kadar · hedef sıcaklığa ulaştığında otomatik durur",
    "powerW": 50,
    "recommendedMaxL": 50,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-heater-ah1006.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-ah-1008-50",
    "category": "heater",
    "brand": "Dophin",
    "model": "AH-1008 50 W",
    "specifications": "Dahili termostatlı, sıcaklık ayar düğmeli ve ısıtma göstergeli tam daldırılabilir cam ısıtıcı · 50 W · 22 cm · 50 litreye kadar · hedef sıcaklığa ulaştığında otomatik durur",
    "powerW": 50,
    "recommendedMaxL": 50,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-submersible-heater-ah1008.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-ah-1006-100",
    "category": "heater",
    "brand": "Dophin",
    "model": "AH-1006 100 W",
    "specifications": "Dahili termostatlı, sıcaklık ayar düğmeli ve ısıtma göstergeli tam daldırılabilir cam ısıtıcı · 100 W · 26 cm · 100 litreye kadar · hedef sıcaklığa ulaştığında otomatik durur",
    "powerW": 100,
    "recommendedMaxL": 100,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-heater-ah1006.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-ah-1008-100",
    "category": "heater",
    "brand": "Dophin",
    "model": "AH-1008 100 W",
    "specifications": "Dahili termostatlı, sıcaklık ayar düğmeli ve ısıtma göstergeli tam daldırılabilir cam ısıtıcı · 100 W · 26 cm · 100 litreye kadar · hedef sıcaklığa ulaştığında otomatik durur",
    "powerW": 100,
    "recommendedMaxL": 100,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-submersible-heater-ah1008.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-ah-1006-150",
    "category": "heater",
    "brand": "Dophin",
    "model": "AH-1006 150 W",
    "specifications": "Dahili termostatlı, sıcaklık ayar düğmeli ve ısıtma göstergeli tam daldırılabilir cam ısıtıcı · 150 W · 31 cm · 150 litreye kadar · hedef sıcaklığa ulaştığında otomatik durur",
    "powerW": 150,
    "recommendedMaxL": 150,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-heater-ah1006.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-ah-1008-150",
    "category": "heater",
    "brand": "Dophin",
    "model": "AH-1008 150 W",
    "specifications": "Dahili termostatlı, sıcaklık ayar düğmeli ve ısıtma göstergeli tam daldırılabilir cam ısıtıcı · 150 W · 31 cm · 150 litreye kadar · hedef sıcaklığa ulaştığında otomatik durur",
    "powerW": 150,
    "recommendedMaxL": 150,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-submersible-heater-ah1008.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-ah-1006-200",
    "category": "heater",
    "brand": "Dophin",
    "model": "AH-1006 200 W",
    "specifications": "Dahili termostatlı, sıcaklık ayar düğmeli ve ısıtma göstergeli tam daldırılabilir cam ısıtıcı · 200 W · 31 cm · 200 litreye kadar · hedef sıcaklığa ulaştığında otomatik durur",
    "powerW": 200,
    "recommendedMaxL": 200,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-heater-ah1006.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-ah-1008-200",
    "category": "heater",
    "brand": "Dophin",
    "model": "AH-1008 200 W",
    "specifications": "Dahili termostatlı, sıcaklık ayar düğmeli ve ısıtma göstergeli tam daldırılabilir cam ısıtıcı · 200 W · 31 cm · 200 litreye kadar · hedef sıcaklığa ulaştığında otomatik durur",
    "powerW": 200,
    "recommendedMaxL": 200,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-submersible-heater-ah1008.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-ah-1006-300",
    "category": "heater",
    "brand": "Dophin",
    "model": "AH-1006 300 W",
    "specifications": "Dahili termostatlı, sıcaklık ayar düğmeli ve ısıtma göstergeli tam daldırılabilir cam ısıtıcı · 300 W · 34 cm · 300 litreye kadar · hedef sıcaklığa ulaştığında otomatik durur",
    "powerW": 300,
    "recommendedMaxL": 300,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-heater-ah1006.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-ah-1008-300",
    "category": "heater",
    "brand": "Dophin",
    "model": "AH-1008 300 W",
    "specifications": "Dahili termostatlı, sıcaklık ayar düğmeli ve ısıtma göstergeli tam daldırılabilir cam ısıtıcı · 300 W · 34 cm · 300 litreye kadar · hedef sıcaklığa ulaştığında otomatik durur",
    "powerW": 300,
    "recommendedMaxL": 300,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-submersible-heater-ah1008.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-ah-1006-500",
    "category": "heater",
    "brand": "Dophin",
    "model": "AH-1006 500 W",
    "specifications": "Dahili termostatlı, sıcaklık ayar düğmeli ve ısıtma göstergeli tam daldırılabilir cam ısıtıcı · 500 W · 41 cm · 500 litreye kadar · hedef sıcaklığa ulaştığında otomatik durur",
    "powerW": 500,
    "recommendedMaxL": 500,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-heater-ah1006.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-ah-1008-500",
    "category": "heater",
    "brand": "Dophin",
    "model": "AH-1008 500 W",
    "specifications": "Dahili termostatlı, sıcaklık ayar düğmeli ve ısıtma göstergeli tam daldırılabilir cam ısıtıcı · 500 W · 41 cm · 500 litreye kadar · hedef sıcaklığa ulaştığında otomatik durur",
    "powerW": 500,
    "recommendedMaxL": 500,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-submersible-heater-ah1008.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-mf-924",
    "category": "heater",
    "brand": "Dophin",
    "model": "MF-924",
    "specifications": "28 °C'ye ön ayarlı plastik ısıtıcı · ±1,5 °C tolerans · 25 W · 5–25 L · 110–240 V adaptör, 12 V DC çıkış · otomatik aşırı ısınma koruması ve kırmızı durum LED'i",
    "powerW": 25,
    "recommendedMinL": 5,
    "recommendedMaxL": 25,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-preset-plastic-heater-mf924.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-ah-1011",
    "category": "heater",
    "brand": "Dophin",
    "model": "AH-1011",
    "specifications": "28 °C'ye ön ayarlı tam daldırılabilir plastik ısıtıcı · ±2 °C tolerans · 50 W · 50–100 L · tatlı ve deniz suyu için",
    "powerW": 50,
    "recommendedMinL": 50,
    "recommendedMaxL": 100,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-preset-plastic-heater-ah1011.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-ah-1000-10",
    "category": "heater",
    "brand": "Dophin",
    "model": "AH-1000 10 W",
    "specifications": "Dahili termostatlı, 26–28 °C'ye ön ayarlı plastik ısıtıcı · 10 W · 15 litreye kadar",
    "powerW": 10,
    "recommendedMaxL": 15,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-preset-plastic-heater-ah1000.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-ah-1001-25",
    "category": "heater",
    "brand": "Dophin",
    "model": "AH-1001 25 W",
    "specifications": "Dahili termostatlı, 26–28 °C'ye ön ayarlı plastik ısıtıcı · 25 W · 30 litreye kadar",
    "powerW": 25,
    "recommendedMaxL": 30,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-preset-plastic-heater-ah1000.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-ah-1002-10",
    "category": "heater",
    "brand": "Dophin",
    "model": "AH-1002 10 W",
    "specifications": "Sabit sıcaklık kontrolü bulunmayan plastik ısıtıcı · 10 W · 20 litreye kadar · üretici ayrı termometreyle sıcaklığın izlenmesini ister; harici termostatlı kontrol olmadan kendi kendini düzenleyen ana ısıtıcı sayılmaz",
    "powerW": 10,
    "recommendedMaxL": 20,
    "requiresExternalTemperatureControl": true,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-preset-plastic-heater-ah1000.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-led-2030",
    "category": "lighting",
    "brand": "Dophin",
    "model": "LED2030",
    "specifications": "Bitki, deniz ve tropikal için üç spektrum seçeneği bulunan IP67, RA95 ince LED armatür · dokunmatik kontrol · 120° ışık dağılımı · iki uçta 5'er cm uzayan ayak · 27–36 cm akvaryum · 9,5 W",
    "powerW": 9.5,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-slim-led-light-led2030.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-led-2045",
    "category": "lighting",
    "brand": "Dophin",
    "model": "LED2045",
    "specifications": "Bitki, deniz ve tropikal için üç spektrum seçeneği bulunan IP67, RA95 ince LED armatür · dokunmatik kontrol · 120° ışık dağılımı · iki uçta 5'er cm uzayan ayak · 42–51 cm akvaryum · 13,5 W",
    "powerW": 13.5,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-slim-led-light-led2030.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-led-2060",
    "category": "lighting",
    "brand": "Dophin",
    "model": "LED2060",
    "specifications": "Bitki, deniz ve tropikal için üç spektrum seçeneği bulunan IP67, RA95 ince LED armatür · dokunmatik kontrol · 120° ışık dağılımı · iki uçta 5'er cm uzayan ayak · 57–66 cm akvaryum · 18 W",
    "powerW": 18,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-slim-led-light-led2030.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-led-2080",
    "category": "lighting",
    "brand": "Dophin",
    "model": "LED2080",
    "specifications": "Bitki, deniz ve tropikal için üç spektrum seçeneği bulunan IP67, RA95 ince LED armatür · dokunmatik kontrol · 120° ışık dağılımı · iki uçta 5'er cm uzayan ayak · 77–86 cm akvaryum · 22 W",
    "powerW": 22,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-slim-led-light-led2030.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-led-2090",
    "category": "lighting",
    "brand": "Dophin",
    "model": "LED2090",
    "specifications": "Bitki, deniz ve tropikal için üç spektrum seçeneği bulunan IP67, RA95 ince LED armatür · dokunmatik kontrol · 120° ışık dağılımı · iki uçta 5'er cm uzayan ayak · 87–96 cm akvaryum · 24,5 W",
    "powerW": 24.5,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-slim-led-light-led2030.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-led-20120",
    "category": "lighting",
    "brand": "Dophin",
    "model": "LED20120",
    "specifications": "Bitki, deniz ve tropikal için üç spektrum seçeneği bulunan IP67, RA95 ince LED armatür · dokunmatik kontrol · 120° ışık dağılımı · iki uçta 5'er cm uzayan ayak · 117–126 cm akvaryum · 29,5 W",
    "powerW": 29.5,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-slim-led-light-led2030.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-led-106",
    "category": "lighting",
    "brand": "Dophin",
    "model": "LED 106",
    "specifications": "Çerçevesiz akvaryum için ince LED · dokunmatik tümü açık/mavi/beyaz/kapalı modları · uzun basışla parlaklık ayarı · hafıza · 4 W",
    "powerW": 4,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-led-light-led106-led108.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-led-108",
    "category": "lighting",
    "brand": "Dophin",
    "model": "LED 108",
    "specifications": "Çerçevesiz akvaryum için ince LED · dokunmatik tümü açık/mavi/beyaz/kapalı modları · uzun basışla parlaklık ayarı · hafıza · 5 W",
    "powerW": 5,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-led-light-led106-led108.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-led-109",
    "category": "lighting",
    "brand": "Dophin",
    "model": "LED 109",
    "specifications": "12 beyaz + 3 mavi LED'li ultra ince armatür · en çok 5 mm kalınlıktaki cama ayarlanabilir braket · 120° ışık dağılımı · 3,4 W",
    "powerW": 3.4,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-led-light-led109.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-led-1088-rgb",
    "category": "lighting",
    "brand": "Dophin",
    "model": "LED-1088 RGB Remote (Upgraded)",
    "specifications": "Uzaktan kumandalı RGB LED armatür · açma/kapama, parlaklık ve renk kontrolü · ısı dağıtan alüminyum alaşımlı gövde · ayarlanabilir akvaryum/teraryum braketleri · 230 V / 50 Hz · 9,7 W",
    "powerW": 9.7,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-led-light-with-remote-control-led1088.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-led-1089-rgb",
    "category": "lighting",
    "brand": "Dophin",
    "model": "LED-1089 RGB Remote (Upgraded)",
    "specifications": "Uzaktan kumandalı RGB LED armatür · açma/kapama, parlaklık ve renk kontrolü · ısı dağıtan alüminyum alaşımlı gövde · ayarlanabilir akvaryum/teraryum braketleri · 230 V / 50 Hz · 13 W",
    "powerW": 13,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-led-light-with-remote-control-led1088.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-led-1090-rgb",
    "category": "lighting",
    "brand": "Dophin",
    "model": "LED-1090 RGB Remote (Upgraded)",
    "specifications": "Uzaktan kumandalı RGB LED armatür · açma/kapama, parlaklık ve renk kontrolü · ısı dağıtan alüminyum alaşımlı gövde · ayarlanabilir akvaryum/teraryum braketleri · 230 V / 50 Hz · 14,7 W",
    "powerW": 14.7,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-aquarium-led-light-with-remote-control-led1088.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-led-110",
    "category": "lighting",
    "brand": "Dophin",
    "model": "LED 110",
    "specifications": "USB beslemeli kompakt LED armatür · çok eksenli ayar · 360° aydınlatma yönü · isteğe bağlı akıllı dokunmatik kontrol · üretici güç ve ölçü yayımlamıyor",
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/Aquarium-led-light-led110.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-ps2012",
    "category": "other",
    "brand": "Dophin",
    "model": "PS2012 Protein Skimmer",
    "specifications": "Yalnız deniz akvaryumları için protein skimmer · organik atık ayırma ve filtrasyon · ince hava kabarcıkları üreten iğneli çark · oksijenlendirme · 500 L/saat · ana biyolojik filtre kapasitesi hesabına katılmaz",
    "ratedFlowLph": 500,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-marine-tank-protein-skimmer-ps2012.html",
    "verifiedAt": "2026-10-27"
  },
  {
    "id": "dophin-th016",
    "category": "other",
    "brand": "Dophin",
    "model": "TH016",
    "specifications": "Dijital termometre ve higrometre · dokunarak °C/°F geçişi · sıcaklık toleransı ±1 °C · %20–95 bağıl nem aralığı, nem toleransı en çok ±%5 · yaklaşık 12 ay pil ömrü · asma deliği veya çift taraflı bantla montaj",
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/142.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-th015",
    "category": "other",
    "brand": "Dophin",
    "model": "TH015",
    "specifications": "Büyük dijital ekranlı akvaryum termometresi · dokunmatik düğmeyle °C/°F geçişi · sıcaklık 33 °C'yi aştığında alarm uyarısı · üretici ölçüm aralığı ve sayısal doğruluk yayımlamıyor",
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/1456660821554274304.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-th012",
    "category": "other",
    "brand": "Dophin",
    "model": "TH012",
    "specifications": "Dijital akvaryum termometresi · °C/°F gösterimi · yapışkanlı montaj · üretici ölçüm aralığı ve sayısal doğruluk yayımlamıyor",
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/171.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-th007",
    "category": "other",
    "brand": "Dophin",
    "model": "TH007 Shrimp Digital Thermometer",
    "specifications": "Karides akvaryumları için dijital termometre · sıcaklığı renkli gösterimle sunar · kendinden yapışkanlı montaj · üretici ölçüm aralığı ve sayısal doğruluk yayımlamıyor",
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/172.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-af007",
    "category": "other",
    "brand": "Dophin",
    "model": "AF007 Auto Feeder",
    "specifications": "LCD ekranlı elektronik otomatik yemleyici · 12/24 saat zamanlama modu · granül ve pul yemlerle uyumlu · üretici hazne hacmi, pil türü ve güç değeri yayımlamıyor",
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-fish-food-auto-feeder-af007.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-af012",
    "category": "other",
    "brand": "Dophin",
    "model": "AF012 Auto Feeder",
    "specifications": "LCD ekranlı elektronik otomatik yemleyici · farklı besleme zamanları ve dönüş sayıları programlanabilir · granül ve pul yemlerle uyumlu · üretici program sayısı, hazne hacmi, besleme ve güç değerlerini yayımlamıyor",
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-fish-food-auto-feeder-af012.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-af013",
    "category": "other",
    "brand": "Dophin",
    "model": "AF013 Auto Feeder",
    "specifications": "LCD ekranlı dokunmatik elektronik otomatik yemleyici · farklı besleme zamanları ve dönüş sayıları programlanabilir · granül ve pul yemlerle uyumlu · besleme sırasında çalışan fan yemi kuru tutmaya yardımcı olur · üretici program sayısı, hazne hacmi ve güç değeri yayımlamıyor",
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-fish-food-auto-feeder-af013.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-af015",
    "category": "other",
    "brand": "Dophin",
    "model": "AF015 Auto Feeder",
    "specifications": "Kompakt otomatik yemleyici · 12/24 saat zamanlama modu · USB ve pil beslemeli iki sürüm · düşük güç tüketimli sessiz tasarım · üretici pil türü, hazne hacmi ve sayısal güç değeri yayımlamıyor",
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/dophin-fish-food-auto-feeder-af015.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-mc113a",
    "category": "other",
    "brand": "Dophin",
    "model": "MC113A Handy Cleaner Pump",
    "specifications": "Lityum bataryalı çok başlıklı akvaryum temizleyici · kazıyıcı, derin temizlik başlığı, kum yıkama başlığı ve uzatma bağlantıları dahil · 5 V / 2 A adaptör · 2600 mAh batarya · en çok 8 W · en çok 350 L/saat · 100 cm azami basma yüksekliği",
    "ratedFlowLph": 350,
    "powerW": 8,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/141.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "dophin-mc113b",
    "category": "other",
    "brand": "Dophin",
    "model": "MC113B Handy Cleaner Pump",
    "specifications": "DC beslemeli çok başlıklı akvaryum temizleyici · kazıyıcı, derin temizlik başlığı, kum yıkama başlığı ve uzatma bağlantıları dahil · 5 V / 2 A adaptör · bataryasız · en çok 5 W · en çok 350 L/saat · 100 cm azami basma yüksekliği",
    "ratedFlowLph": 350,
    "powerW": 5,
    "sourceUrl": "https://www.qimeigroup.com/Products_detail/141.html",
    "verifiedAt": "2026-10-26"
  },
  {
    "id": "haqos-easy-1000at",
    "category": "filter",
    "brand": "Haqos",
    "model": "EASY-1000AT",
    "specifications": "Tek tuşla ilk çalıştırmalı çok aşamalı dış filtre · 1000 L/saat · 22 W · 1.7 m azami basma yüksekliği (220–240 V) · yüzey emici, filtre medyası ve aksesuar seti dahil · tatlı ve deniz suyu",
    "ratedFlowLph": 1000,
    "powerW": 22,
    "sourceUrl": "https://www.haqos.com/productshow-45495781.html",
    "additionalSourceUrls": [
      "https://p22.qiyeku.cn/2022/12/6/haqos/product/product_info/image/2023_02_18/20230218101938731.jpg"
    ],
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "haqos-easy-1200at",
    "category": "filter",
    "brand": "Haqos",
    "model": "EASY-1200AT",
    "specifications": "Tek tuşla ilk çalıştırmalı çok aşamalı dış filtre · 1200 L/saat · 28 W · 1.7 m azami basma yüksekliği (220–240 V) · yüzey emici, filtre medyası ve aksesuar seti dahil · tatlı ve deniz suyu",
    "ratedFlowLph": 1200,
    "powerW": 28,
    "sourceUrl": "https://www.haqos.com/productshow-45495781.html",
    "additionalSourceUrls": [
      "https://p22.qiyeku.cn/2022/12/6/haqos/product/product_info/image/2023_02_18/20230218101938731.jpg"
    ],
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "haqos-easy-1500at",
    "category": "filter",
    "brand": "Haqos",
    "model": "EASY-1500AT",
    "specifications": "Tek tuşla ilk çalıştırmalı çok aşamalı dış filtre · 1500 L/saat · 36 W · 2.3 m azami basma yüksekliği (220–240 V) · yüzey emici, filtre medyası ve aksesuar seti dahil · tatlı ve deniz suyu",
    "ratedFlowLph": 1500,
    "powerW": 36,
    "sourceUrl": "https://www.haqos.com/productshow-45495781.html",
    "additionalSourceUrls": [
      "https://p22.qiyeku.cn/2022/12/6/haqos/product/product_info/image/2023_02_18/20230218101938731.jpg"
    ],
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "haqos-aqua-flow-250",
    "category": "filter",
    "brand": "Haqos",
    "model": "Aqua Flow 250",
    "specifications": "Biyolojik iç filtre · 250 L/saat · 3 W · 0.3 m azami basma yüksekliği · aktif karbon süngeri, mekanik filtre süngeri ve biyolojik halkalar dahil",
    "ratedFlowLph": 250,
    "powerW": 3,
    "sourceUrl": "https://www.haqos.com/productshow-45495780.html",
    "additionalSourceUrls": [
      "https://p22.qiyeku.cn/2022/12/6/haqos/product/product_info/image/2023_02_18/20230218101642324.jpg"
    ],
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "haqos-aqua-flow-480",
    "category": "filter",
    "brand": "Haqos",
    "model": "Aqua Flow 480",
    "specifications": "Biyolojik iç filtre · 480 L/saat · 5 W · 0.4 m azami basma yüksekliği · aktif karbon süngeri, mekanik filtre süngeri ve biyolojik halkalar dahil",
    "ratedFlowLph": 480,
    "powerW": 5,
    "sourceUrl": "https://www.haqos.com/productshow-45495780.html",
    "additionalSourceUrls": [
      "https://p22.qiyeku.cn/2022/12/6/haqos/product/product_info/image/2023_02_18/20230218101642324.jpg"
    ],
    "verifiedAt": "2026-10-23"
  },
  {
    "id": "nubios-yu118c",
    "category": "filter",
    "brand": "Nubios",
    "model": "YU-118C",
    "specifications": "Kendi motorlu, ince gözenekli tekli sünger/pipo üretim filtresi · ürün kodu 771-YU118C1 · 5 W · yavru akvaryumları için emniyetli emiş · vantuzlu · debi yayımlanmamış",
    "powerW": 5,
    "capacityDataNote": "28 Ekim 2026 son denetiminde doğrudan ürün sayfasına bağlı kutu görseli YU-118C modelini ve dahili motorlu elektrikli filtre sınıfını doğruladı; kutunun görünen ön yüzünde debi, voltaj veya önerilen hacim yayımlanmıyor. YU-118C başlığı altında başka marka XY-2900'un 450 L/saat verisini yayımlayan hatalı satıcı metni ile yaklaşık 350 L/saat veren markasız OEM ilanı reddedildi. Kayıt otomatik filtrasyon hesabına katılmaz.",
    "sourceUrl": "https://www.ozelyem.com/nubios-yu-118c-tekli-motorlu-sunger-pipo-filitre",
    "additionalSourceUrls": [
      "https://www.ozelyem.com/nubios-yu-118c-tekli-motorlu-sunger-pipo-filitre-pipo-filtreler-nubios-8722-59-B.jpg",
      "https://www.ozelyem.com/nubios"
    ],
    "verifiedAt": "2026-10-28"
  },
  {
    "id": "nubios-yu119c",
    "category": "filter",
    "brand": "Nubios",
    "model": "YU-119C",
    "specifications": "Kendi motorlu, ince gözenekli tekli sünger/pipo üretim filtresi · ürün kodu 771-YU119C · 5 W · yavru akvaryumları için emniyetli emiş · vantuzlu · 11 × 27 cm · debi yayımlanmamış",
    "powerW": 5,
    "capacityDataNote": "28 Ekim 2026 son denetiminde doğrudan ürün sayfasına bağlı kutu görseli YU-119C modelini ve dahili motorlu elektrikli filtre sınıfını doğruladı; kutunun görünen ön yüzünde debi, voltaj veya önerilen hacim yayımlanmıyor. Yaklaşık 350 L/saat veren markasız OEM ilanı Nubios modele aktarılmadı; kayıt otomatik filtrasyon hesabına katılmaz.",
    "sourceUrl": "https://atakanpetshop.com/nubios-filtre-malzemeli-motorlu-pipo-filtre-small-771-yu119c",
    "additionalSourceUrls": [
      "https://ozelyem.tsoftstatic.com/nubios-yu-119c-tekli-motorlu-sunger-pipo-filitre-pipo-filtreler-nubios-8721-59-B.jpg",
      "https://www.ozelyem.com/nubios"
    ],
    "verifiedAt": "2026-10-28"
  },
  {
    "id": "sobo-sb-848",
    "category": "air_pump",
    "brand": "Sobo",
    "model": "SB-848",
    "specifications": "Ayarlanabilir çift çıkışlı hava motoru · 2 × 4,5 L/dakika · toplam 540 L/saat · 12 W",
    "ratedFlowLph": 540,
    "powerW": 12,
    "adjustableFlow": true,
    "sourceUrl": "https://www.sobo.com.tr/sobo-ultra-sessiz-ayarlanabilir-cift-cikisli-akvaryum-hava-motoru-sb-848",
    "verifiedAt": "2026-11-02"
  },
  {
    "id": "sobo-wp-4001",
    "category": "filter",
    "brand": "Sobo",
    "model": "WP-4001",
    "specifications": "İç filtre · 2000 L/saat · 30 W · 200 litreye kadar",
    "ratedFlowLph": 2000,
    "powerW": 30,
    "recommendedMaxL": 200,
    "sourceUrl": "https://www.sobo.com.tr/sobo-akvaryum-ic-filtre-wp-4001",
    "verifiedAt": "2026-11-02"
  },
  {
    "id": "sobo-sb-860a",
    "category": "air_pump",
    "brand": "Sobo",
    "model": "SB-860A",
    "specifications": "Ayarlanabilir çift çıkışlı hava motoru · 2 × 6 L/dakika · toplam 720 L/saat · 10 W",
    "ratedFlowLph": 720,
    "powerW": 10,
    "adjustableFlow": true,
    "sourceUrl": "https://www.sobo.com.tr/sobo-sessiz-ayarlanabilir-cift-cikisli-ucgen-akvaryum-hava-motoru-sb-860a",
    "additionalSourceUrls": [
      "https://malawiizmir.com/sobo-sb-860a-cift-cikisli-hava-motoru"
    ],
    "verifiedAt": "2026-11-02"
  },
  {
    "id": "resun-lp60",
    "category": "air_pump",
    "brand": "Resun",
    "model": "LP-60",
    "specifications": "Düşük sesli üretim tipi hava motoru · 4200 L/saat · 50 W · 100–120 V / 220–240 V, 50/60 Hz",
    "ratedFlowLph": 4200,
    "powerW": 50,
    "sourceUrl": "https://www.resun-china.com/h-pd-149.html",
    "verifiedAt": "2026-11-03"
  },
  {
    "id": "resun-lp100",
    "category": "air_pump",
    "brand": "Resun",
    "model": "LP-100",
    "specifications": "Düşük sesli üretim tipi hava motoru · 8400 L/saat · 100 W · 100–120 V / 220–240 V, 50/60 Hz",
    "ratedFlowLph": 8400,
    "powerW": 100,
    "sourceUrl": "https://www.resun-china.com/h-pd-149.html",
    "verifiedAt": "2026-11-03"
  },
  {
    "id": "resun-lp200",
    "category": "air_pump",
    "brand": "Resun",
    "model": "LP-200",
    "specifications": "Düşük sesli üretim tipi hava motoru · üretici tablosunda 14.000–15.000 L/saat ve 230 W; kabul edilen yerel mağazada 15.000 L/saat ve 200 W · otomatik hesapta güvenli alt debi 14.000 L/saat kullanılır, çelişkili güç alanı kullanılmaz",
    "ratedFlowLph": 14000,
    "sourceUrl": "https://www.resun-china.com/h-pd-149.html",
    "additionalSourceUrls": [
      "https://atakanpetshop.com/resun-lp-200-hava-kompresoru"
    ],
    "verifiedAt": "2026-11-03"
  },
  {
    "id": "waterbear-wb-2770",
    "category": "filter",
    "brand": "WaterBear",
    "model": "WB-2770",
    "specifications": "İç filtre · 800 L/saat · 12 W · barkod 6972174181165 · kabul edilen kaynakların yayımladığı hacim önerisi kullanılmaz",
    "ratedFlowLph": 800,
    "powerW": 12,
    "sourceUrl": "https://www.cikletistpetshop.com/waterbear-wb-2770-akvaryum-ic-filtre-800lh-7408",
    "additionalSourceUrls": [
      "https://aquarubi.com/waterbear-wb-2770-akvaryum-ic-filtre"
    ],
    "verifiedAt": "2026-11-03"
  },
  {
    "id": "ejet-bp3",
    "category": "air_pump",
    "brand": "Ejet",
    "model": "BP3",
    "specifications": "Tek çıkışlı pilli yedek hava motoru · tatlı ve deniz suyunda taşıma ve elektrik kesintisi desteği · hava debisi yayımlanmamış",
    "capacityDataNote": "Atakan Petshop'un Ejet marka sayfası BP3'ü pilli yedek hava motoru olarak doğruluyor, ancak hava debisi veya önerilen akvaryum hacmi yayımlamıyor. Qimei'nin resmî Ejet hava motoru tablosu yalnız E-JET 168 ve E-JET 268 modellerini kapsıyor; bu değerler BP3'e aktarılmadığı için cihaz otomatik kapasite hesabına katılmaz.",
    "sourceUrl": "https://atakanpetshop.com/ejet",
    "additionalSourceUrls": [
      "https://www.qimeigroup.com/Products_detail/ejet-aquarium-air-pump-ejet168.html"
    ],
    "verifiedAt": "2026-11-03"
  },
  {
    "id": "sunsun-502",
    "category": "filter",
    "brand": "SunSun",
    "model": "HW-502",
    "specifications": "Kompakt dış filtre · 320 L/saat · 5 W · azami basma yüksekliği 0,75 m · 194 × 153 × 259 mm",
    "ratedFlowLph": 320,
    "powerW": 5,
    "sourceUrl": "https://www.sunsun-china.com/product/aquarium-equipment/hw-series-out-side-filter-2.html",
    "verifiedAt": "2026-11-03"
  },
  {
    "id": "sunsun-503",
    "category": "filter",
    "brand": "SunSun",
    "model": "HW-503",
    "specifications": "Kompakt dış filtre · 350 L/saat · 5 W · azami basma yüksekliği 0,9 m · 212 × 172 × 287 mm · 600 L/saatlik 503B modelinden farklıdır",
    "ratedFlowLph": 350,
    "powerW": 5,
    "sourceUrl": "https://www.sunsun-china.com/product/aquarium-equipment/hw-series-out-side-filter-2.html",
    "verifiedAt": "2026-11-03"
  }
];

export const recoveredEquipmentIds = new Set(recoveredEquipmentCatalog.map((item) => item.id));
