// Türkçe arayüz metinleri (kaynak dil). Başka bir dilin dosyası bu nesneyle aynı biçimde olmalıdır (`Messages`).
// Değişken içeren metinler fonksiyondur; çoğul ve çekim kuralları her dilin kendi fonksiyonunda çözülür.
// Sayfaların metinleri sonraki paketlerde buraya taşınır (docs/DECISIONS/0021-dil-altyapisi.md).
export const tr = {
  app: {
    name: "AquaMind",
    tagline: "Aquarium intelligence",
    /** Sloganın dili: büyük harfe çevirme o dilin kuralıyla yapılsın (Türkçe kuralla "AQUARİUM" olmasın). */
    taglineLang: "en",
    title: "AquaMind — Akvaryum yönetimi",
    description: "Akvaryumunuzu bilinçle yönetin.",
  },
  navigation: {
    items: {
      overview: "Genel Bakış",
      aquariums: "Akvaryumlarım",
      water: "Su Değerleri",
      maintenance: "Bakım Günlüğü",
      livestock: "Canlılar",
      plants: "Bitkiler",
      equipment: "Ekipmanlar",
      products: "Ürün Kataloğu",
      calculators: "Hesaplayıcılar",
      aquamatch: "AquaMatch",
      settings: "Ayarlar",
    },
    shortItems: {
      overview: "Genel",
      aquariums: "Akvaryumlar",
      maintenance: "Bakım",
      menu: "Menü",
    },
    comingSoon: "Yakında",
    mainMenu: "Ana menü",
    mobileMainMenu: "Mobil ana menü",
    closeMenu: "Menüyü kapat",
    newAquarium: "Yeni akvaryum",
    dashboard: "Panel",
  },
  account: {
    guest: "Misafir",
    freePlan: "Ücretsiz plan",
  },
  storageWarning: {
    collections: {
      aquariums: "akvaryumlar",
      waterReadings: "su ölçümleri",
      maintenanceTasks: "bakım kayıtları",
      livestock: "canlılar",
      plants: "bitkiler",
      equipment: "ekipmanlar",
    },
    deletePending: "Tamamlanmamış bir silme işlemi sürüyor. Bu sırada yeni değişiklikler kaydedilemez ve denenen işlem uygulanmaz. Sayfayı yenileyin; işlem otomatik tamamlanmaya çalışılacak.",
    unsaved: (collections: string) => `Değişiklikleriniz bu cihazda saklanamadı (${collections}).`,
    unsavedHelpBefore: "Sayfayı yenilerseniz bu değişiklikler kaybolur. Depolama alanı dolu olabilir. Kaybetmemek için",
    unsavedHelpLink: "Ayarlar → Verileri dışa aktar",
    unsavedHelpAfter: "ile yedek alın.",
  },
};

export type Messages = typeof tr;
