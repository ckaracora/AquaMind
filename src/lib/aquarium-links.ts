// Akvaryuma bağlı sayfa bağlantıları. Sağlık analizi, hastalık ve tedavi sayfası ve su ölçümü sayfası aynı sorgu anahtarını (`?aquarium=`)
// kullanır. Ayrı dosyadır: sağlık analizi sayfası bağlantıyı kurarken hastalık sayfasının kaynak listesini (src/data/disease-guide.ts) yüklemez.
export const AQUARIUM_PARAM = "aquarium";
export const diseaseGuideHref = (aquariumId: string) => `/diseases?${AQUARIUM_PARAM}=${encodeURIComponent(aquariumId)}`;
export const waterReadingHref = (aquariumId?: string) => aquariumId ? `/water?${AQUARIUM_PARAM}=${encodeURIComponent(aquariumId)}` : "/water";
/**
 * Akvaryum sayfasındaki "Canlı ekle", "Ekipman ekle", "Ölçüm ekle" ve "Bakım ekle" düğmeleri ekleme penceresini doğrudan açar (2026-11-14
 * sprinti): bağlantı `?aquarium=<kimlik>&add=1` taşır, sayfa açılınca pencere açık gelir. Eskiden listeye götürüyor, ikinci dokunuş gerekiyordu.
 */
export const ADD_PARAM = "add";
export const addRecordHref = (path: "/livestock" | "/equipment" | "/water" | "/maintenance" | "/plants", aquariumId: string) => `${path}?${AQUARIUM_PARAM}=${encodeURIComponent(aquariumId)}&${ADD_PARAM}=1`;
/** Adreste ekleme isteği var mı (`?add=1`)? Sunucuda ve adres okunamazsa `false`. */
export const addRequested = (search: string) => new URLSearchParams(search).get(ADD_PARAM) === "1";
/**
 * Yeni kaydedilen akvaryumun kimliği, bu sekmenin oturum deposunda (sessionStorage) bir kez tutulur: yeni akvaryum sayfası yazar, akvaryum
 * sayfası okuyup siler ve "kaydedildi, sıradaki adım" kutusunu gösterir (kullanılabilirlik turu, 2026-11-12). Adrese bir şey yazılmaz.
 */
export const CREATED_AQUARIUM_FLAG = "aquamind:created-aquarium";
