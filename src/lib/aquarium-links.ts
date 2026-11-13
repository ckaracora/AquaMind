// Akvaryuma bağlı sayfa bağlantıları. Sağlık analizi, hastalık ve tedavi sayfası ve su ölçümü sayfası aynı sorgu anahtarını (`?aquarium=`)
// kullanır. Ayrı dosyadır: sağlık analizi sayfası bağlantıyı kurarken hastalık sayfasının kaynak listesini (src/data/disease-guide.ts) yüklemez.
export const AQUARIUM_PARAM = "aquarium";
export const diseaseGuideHref = (aquariumId: string) => `/diseases?${AQUARIUM_PARAM}=${encodeURIComponent(aquariumId)}`;
export const waterReadingHref = (aquariumId?: string) => aquariumId ? `/water?${AQUARIUM_PARAM}=${encodeURIComponent(aquariumId)}` : "/water";
/**
 * Yeni kaydedilen akvaryumun kimliği, bu sekmenin oturum deposunda (sessionStorage) bir kez tutulur: yeni akvaryum sayfası yazar, akvaryum
 * sayfası okuyup siler ve "kaydedildi, sıradaki adım" kutusunu gösterir (kullanılabilirlik turu, 2026-11-12). Adrese bir şey yazılmaz.
 */
export const CREATED_AQUARIUM_FLAG = "aquamind:created-aquarium";
