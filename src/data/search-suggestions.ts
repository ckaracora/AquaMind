// "Bunu mu demek istedin?" önerileri (2026-11-14 sprinti). Gündelik ad veri değil, arama önerisidir: canlı ya da bitki ekleme penceresinde
// yazılan ad katalogda hiç eşleşmiyorsa ve bir terimle aynıysa (harf, aksan, tire ve boşluk katlanmış) öneri düğmeleri çıkar; ad birden çok
// türe gidiyorsa hepsi listelenir (ilk altısı görünür, fazlası "Tümünü göster" ile açılır). Tür kendiliğinden seçilmez, kullanıcı düğmeye
// basar. Kurallar (canlıda src/lib/species-search.ts `searchSuggestionProblems`, bitkide src/lib/plant-search.ts
// `plantSearchSuggestionProblems`; testleri src/lib/__tests__/livestock-search-all.test.ts): kimlikler katalogda olmalı; her kayıtta en az
// iki BAĞIMSIZ Türkçe siteden kanıt (adres ve sayfadaki alıntı; aynı şirketin siteleri tek sayılır, `SAME_OWNER_SITES`); terim hiçbir
// katalog adıyla çakışmamalı. Lider kararı (2026-11-14): kabul listesi şartı yok; herhangi iki bağımsız Türkçe site sayılır (mağaza,
// akvaryum.com forum ve ansiklopedisi, hobi blogu, ansiklopedi). Alıntılar sayfalardan kelimesi kelimesine alındı (boşluklar tek boşluğa
// indirildi); arama ve doğrulama kaydı docs/CATALOG_LOG.md "Gündelik ad önerileri (E5)".

/**
 * "Bunu mu demek istedin?" düğmelerinden ilk görünenlerin sayısı; ad daha çok türe gidiyorsa fazlası "Tümünü göster" ile açılır (canlıda ve
 * bitkide aynı, src/components/did-you-mean.tsx).
 */
export const DID_YOU_MEAN_LIMIT = 6;

export interface SearchSuggestionEvidence {
  /** Adın geçtiği sayfa. */
  url: string;
  /** Sayfadaki alıntı (adın geçtiği cümle ya da başlık). */
  quote: string;
}

export interface SearchSuggestion {
  /** Kullanıcının yazdığı gündelik ad (ör. bir mağaza ya da forum adı). */
  term: string;
  /** Terimin gittiği katalog türleri (en az bir; ad birden çok türe gidiyorsa hepsi). */
  speciesIds: string[];
  evidence: SearchSuggestionEvidence[];
  /** Eklendiği gün, YYYY-AA-GG. */
  addedAt: string;
}

/** Bitki araması için aynı düzen; kimlikler src/data/catalog-plants.ts kayıtlarıdır. */
export interface PlantSearchSuggestion {
  term: string;
  /** Terimin gittiği katalog bitkileri (en az bir; ad bir cinse gidiyorsa cinsin katalogdaki bütün bitkileri). */
  plantIds: string[];
  evidence: SearchSuggestionEvidence[];
  addedAt: string;
}

/**
 * Aynı şirketin siteleri: kanıtta tek site sayılır. Alt alan adları zaten birleşir (blog.tetra.net = tetra.net, mail.akvaryum.com =
 * akvaryum.com). akvaryum.market, evcilhayvan.market ve bitki.market aynı adlandırma ve aynı alt bilgi düzenini taşıdığı için koruyucu
 * olarak tek sayılır (sahipliği ayrıca doğrulanmadı).
 */
export const SAME_OWNER_SITES: readonly (readonly string[])[] = [["akvaryum.market", "evcilhayvan.market", "bitki.market"]];

const SECOND_LEVEL = new Set(["com", "org", "net", "gov", "edu", "gen", "web", "bel", "k12", "av", "biz", "info", "tv"]);
/** Adresin site anahtarı: kayıtlı alan adı (www., blog., mail. gibi alt adlar atılır; .com.tr gibi uzantılar korunur), aynı şirket birleşik. */
export function evidenceSite(url: string): string | undefined {
  let host: string;
  try { host = new URL(url).hostname.toLowerCase(); } catch { return undefined; }
  const labels = host.split(".");
  const keep = labels.length >= 3 && labels.at(-1)!.length === 2 && SECOND_LEVEL.has(labels.at(-2)!) ? 3 : 2;
  const site = labels.slice(-keep).join(".");
  return SAME_OWNER_SITES.find((group) => group.includes(site))?.[0] ?? site;
}

/** Kanıtın ortak kuralları: geçerli adres, boş olmayan ve terimi içeren alıntı (`fold` katlamasıyla), en az iki bağımsız site, tarih biçimi. */
export function suggestionEvidenceProblems(term: string, evidence: readonly SearchSuggestionEvidence[], addedAt: string, fold: (value: string) => string): string[] {
  const problems: string[] = [];
  const sites = new Set<string>();
  for (const { url, quote } of evidence) {
    const site = evidenceSite(url);
    if (!site) problems.push(`${term}: geçersiz adres ${url}`);
    else sites.add(site);
    if (!quote.trim()) problems.push(`${term}: alıntısı boş kanıt (${url})`);
    else if (!` ${fold(quote)} `.includes(` ${fold(term)} `)) problems.push(`${term}: alıntı terimi içermiyor (${url})`);
  }
  if (sites.size < 2) problems.push(`${term}: en az iki ayrı siteden kanıt gerekir (${sites.size})`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(addedAt)) problems.push(`${term}: eklenme tarihi YYYY-AA-GG olmalı (${addedAt})`);
  return problems;
}

export const searchSuggestions: SearchSuggestion[] = [
  {
    term: "Siyah tetra",
    speciesIds: ["black-skirt-tetra"],
    evidence: [
      { url: "https://www.akvaryum.com/gymnocorymbus_ternetzi_(siyah_tetra)_tatlisur_10_497.asp", quote: "Gymnocorymbus ternetzi (Siyah Tetra)" },
      { url: "https://blog.tetra.net/tr-tr/siyah-tetra-baligi-siyah-etekli-balik", quote: "tarafından başka isimler altında da bilinir: Bu balığın Siyah Tetra Balığı, Kara Dul Balığı gibi isimleri de" },
      { url: "https://akvaryumkulubu.org/siyah-tetra/", quote: "Siyah Tetra: Bakımı, Üremesi, Bilgi" },
    ],
    addedAt: "2026-11-14",
  },
  {
    term: "Sarı labidochromis",
    speciesIds: ["yellow-lab"],
    evidence: [
      { url: "https://blog.tetra.net/tr-tr/sari-labidochromis-sari-prenses-kayalarin-sari-sakini", quote: "SARI LABIDOCHROMIS (SARI PRENSES)" },
      { url: "https://e-evcil.com/pedidetay/sari-prenses-labidochromis-caeruleus-36", quote: "Sarı Labidochromis balıkları kumun üzerinde kazma yapma eğiliminde değildirler, bu nedenle alt tabaka temiz tutulabilir." },
    ],
    addedAt: "2026-11-14",
  },
  {
    term: "Paslı ciklet",
    speciesIds: ["rusty-cichlid"],
    evidence: [
      { url: "https://www.akvaryum.com/iodotropheus_sprengerae_pasli_cichlid_makaler_12_4868.asp", quote: "Kendi türlerine karşı agresif olmayan paslı ciklet başka türlere karşı oldukça kavgacıdır." },
      { url: "https://www.akvaryum.market/pasli-ciklet/", quote: "Paslı Ciklet Özellikleri Bilimsel ismi: Iodotropheus sprengerae" },
    ],
    addedAt: "2026-11-14",
  },
  {
    term: "Kaplan barb",
    speciesIds: ["tiger-barb"],
    evidence: [
      { url: "https://www.akvaryum.com/puntius_tetrazona_tetrazon_-_kaplan_barb_tatlisur_7_281.asp", quote: "Puntius tetrazona (Tetrazon - Kaplan Barb)" },
      { url: "https://www.akvaryum.market/tetrazon/", quote: "Bakımı Balık Hastalıkları Forum Sosyal Etkinlik Gruplar Tetrazon Akvaryum Balıkları Kaplan barb ya da tiger barb olarak da adlandırılan tetrazon agresif bir balık türüdür." },
    ],
    addedAt: "2026-11-14",
  },
  {
    term: "Balon moli",
    speciesIds: ["molly"],
    evidence: [
      { url: "https://e-evcil.com/pedidetay/moli-baligi-poecilia-sphenops-395", quote: "Balon (Poecilia sphenops 'Balloon Molly') : Balon Moli Balığı, vücut şekli nedeniyle dikkat çeker." },
      { url: "https://doldurkabi.com/hayvan-ansiklopedisi/baliklar/moli", quote: "Balon moli, 1990'larda selektif üretimle geliştirilmiş tartışmalı bir formdur." },
      { url: "https://www.akvaryum.com/forum/balon_moli_hakkinda_k951614.asp", quote: "Geçtiğimiz hafta beğenerek 2 çift turuncu balon moli aldım ve doğurmaları üzerine 30 u aşkın yavrum oldu." },
    ],
    addedAt: "2026-11-14",
  },
  {
    term: "Aksolotl",
    speciesIds: ["axolotl"],
    evidence: [
      { url: "https://blog.tetra.net/tr-tr/aksolotl-akvaryum-ejderhasi", quote: "Aksolotl: türler, bakım, besleme, üreme, uyumluluk" },
      { url: "https://kureansiklopedi.com/tr/detay/aksolotl-ambystoma-mexicanum-0432d", quote: "Tehlike Altında) Yaşam Alanı Xochimilco kanalları Meksika Aksolotl ( Ambystoma mexicanum ), Caudata (semenderler) takımına ait ve Ambystomatidae familyasında yer alan, yalnızca" },
      { url: "https://vetmundo.com.tr/evcil-aksolotl/", quote: "Aksolotl (axolotl), sucul bir semender türüdür ve “Ambystoma mexicanum” olarak da bilinir." },
    ],
    addedAt: "2026-11-14",
  },
  {
    term: "Red cherry",
    speciesIds: ["cherry-shrimp"],
    evidence: [
      { url: "https://blog.tetra.net/tr-tr/kiraz-karides-caliskan-bir-temizlik-uzmani", quote: "UZMANI 23 Apr Kiraz Karides (Neocaridina heteropoda veya Red Cherry Shrimp), meraklıların akvaryumlarında yaygın olarak kullanılan kabukluların en popüler" },
      { url: "https://karidesnest.com/blog/neocaridina-bakimi/", quote: "Kiraz Karides (Red Cherry) ve Neocaridina Bakımı: Başlangıç Rehberi" },
      { url: "https://aquarubi.com/neocaridina", quote: "Red Cherry, Yellow, Blue Dream gibi Neocaridina çeşitlerini keşfedin." },
    ],
    addedAt: "2026-11-14",
  },
  {
    term: "Kırmızı kiraz karides",
    speciesIds: ["cherry-shrimp"],
    evidence: [
      { url: "https://www.akvaryum.market/mavi-kadife-karides/", quote: "Kırmızı kiraz karides ile aynı türe mensup olup, seleksiyonla üretim neticesinde mavi renkte olması sağlanmıştır." },
      { url: "https://www.akvaryum.com/forum/karidesler_ve_kerevitler_hakkinda_detayli_bilgi_k490300.asp", quote: "Kırmızı kiraz karides ( Caridina multidentata ) ( Neocaridina heteropoda var." },
    ],
    addedAt: "2026-11-14",
  },
  {
    term: "Mavi karides",
    speciesIds: ["blue-dream-shrimp", "blue-jelly-shrimp", "blue-angel-shrimp", "blue-black-rili-shrimp"],
    evidence: [
      { url: "https://www.akvaryum.market/mavi-kadife-karides/", quote: "Çünkü hobide beslenen başka mavi karides türleri de vardır." },
      { url: "https://mail.akvaryum.com/Forum/mavi_karides_ve_rili_mavi_karides_k1010119.asp?PID=6092443", quote: "Mavi Karides Ve Rili Mavi Karides" },
    ],
    addedAt: "2026-11-14",
  },
  {
    term: "ıstakoz",
    speciesIds: ["red-swamp-crayfish", "electric-blue-crayfish", "red-clawed-crayfish", "mexican-dwarf-crayfish", "least-dwarf-crayfish"],
    evidence: [
      { url: "https://www.canlipetshop.com/index.php?route=product/search&tag=%C4%B1stakoz", quote: "Arama - Etiket - ıstakoz" },
      { url: "https://atlasakvaryum.com/index.php-281.html?id=2475", quote: "Tatlı Su Akvaryumu Haber, Makale Akvaryumda İstakoz Beslemek" },
    ],
    addedAt: "2026-11-14",
  },
  {
    term: "Tatlı su ıstakozu",
    speciesIds: ["red-swamp-crayfish", "electric-blue-crayfish", "red-clawed-crayfish", "mexican-dwarf-crayfish", "least-dwarf-crayfish"],
    evidence: [
      { url: "https://www.canlipetshop.com/index.php?route=product/search&tag=%C4%B1stakoz", quote: "Kerevit Kırmızı 5 Ad 9-10 Cm Tatlı Su Istakozu kırmızıProcambarus Clarkii Red Swamp Crayfish" },
      { url: "https://atlasakvaryum.com/index.php-281.html?id=2475", quote: "Kırmızı Tatlı Su İstakozu - Kerevit Kırmızı Bataklık Kereviti" },
      { url: "https://tr.wikipedia.org/wiki/Kerevit", quote: "Tatlı su ıstakozu da denilen kerevitleri, Nephropoidea üst familyasından ıstakozlarla karıştırmamak gerekir." },
    ],
    addedAt: "2026-11-14",
  },
  {
    term: "Papağan balığı",
    speciesIds: ["blood-parrot-cichlid"],
    evidence: [
      { url: "https://www.akvaryum.market/papagan-baligi/", quote: "Papağan Balığı Özellikleri, Bakımı, Akvaryumu ve Üretimi" },
      { url: "https://www.kadinlarkulubu.com/konu/papagan-baligi.815925/", quote: "Papağan balığı iki farklı amerikan balıgının çiftleşmesi ile meydana gelen bir türdür." },
      { url: "https://www.keriminpetdunyasi.com/papagan-ciklet-baligi/", quote: "Temel Akvaryum Bilgileri Hakkında Videolar >> Üreticiler, çeşitli Orta ve Güney Amerika ciklet türlerini melezleme yöntemleriyle bir araya getirerek Kırmızı Papağan Balığı’nı elde ederler." },
    ],
    addedAt: "2026-11-14",
  },
  {
    term: "Papağan ciklet",
    speciesIds: ["blood-parrot-cichlid"],
    evidence: [
      { url: "https://e-evcil.com/pedidetay/papagan-ciklet-462", quote: "Papağan Ciklet (Amphilophus citrinellus × Paraneetroplus synspilus)" },
      { url: "https://www.keriminpetdunyasi.com/papagan-ciklet-baligi/", quote: "Sizler için hazırlanan bu sayfada papağan ciklet balığı aramasına yanıtlar bulabilirsiniz." },
      { url: "https://www.akvaryum.market/papagan-baligi/", quote: "Papağan Ciklet Hastalıkları" },
    ],
    addedAt: "2026-11-14",
  },
  {
    term: "Kırmızı papağan",
    speciesIds: ["blood-parrot-cichlid"],
    evidence: [
      { url: "https://www.akvaryum.market/papagan-baligi/", quote: "Nasıl Beslenir Papağan Ciklet Akvaryumu Papağan Balığı Üretimi Sık Sorulan Sorular Kırmızı papağan balığı, doğada bulunmayan suni olarak üretilmiş melez bir türdür." },
      { url: "https://www.keriminpetdunyasi.com/papagan-ciklet-baligi/", quote: "Kırmızı Papağan Ciklet Balığı, özellikle akvaryum hobileri için üretilmiş suni bir melez türdür." },
    ],
    addedAt: "2026-11-14",
  },
  {
    term: "Komando çöpçü",
    speciesIds: ["peppered-cory"],
    evidence: [
      { url: "https://www.akvaryum.com/copcu_uretimi_corydoras_paleatus_-_komando_copcu_makaler_18_106.asp", quote: "Çöpçü Üretimi (Corydoras Paleatus - Komando Çöpçü)" },
      { url: "https://www.lepisteskulubu.org/2019_03_07_archive.html", quote: "Çöpçüler (Callichthyidae ailesinin tüm cinsleri ve türleri; komando çöpçü, bronz çöpçü, juli çöpçü, panda çöpçü ve diğerleri)" },
    ],
    addedAt: "2026-11-14",
  },
  {
    term: "Kırmızı gözlü tetra",
    speciesIds: ["red-eye-tetra"],
    evidence: [
      { url: "https://www.akvaryum.com/gymnocorymbus_ternetzi_(siyah_tetra)_tatlisur_10_497.asp", quote: "Moenkhausia sanctaefilomenae (Kırmızı Gözlü Tetra)" },
      { url: "https://e-evcil.com/pedidetay/papagan-ciklet-462", quote: "Örneğin, Büyük Kırmızı Gözlü Tetra (Moenkhausia sanctaefilomenae) veya Büyük Neontetra gibi türler, genellikle büyük balıklarla uyumlu yaşayabilir." },
    ],
    addedAt: "2026-11-14",
  },
  {
    term: "Astronot balığı",
    speciesIds: ["oscar"],
    evidence: [
      { url: "https://www.lepisteskulubu.org/2019_03_07_archive.html", quote: "Astronot balığı (Astronotus ocellatus)" },
      { url: "https://e-evcil.com/pedidetay/astronotus-ocellatus-astronot-oscar-39", quote: "Astronotus ocellatus, halk arasında genellikle \"astronot balığı\" olarak bilinir." },
    ],
    addedAt: "2026-11-14",
  },
  {
    term: "Oscar balığı",
    speciesIds: ["oscar"],
    evidence: [
      { url: "https://e-evcil.com/pedidetay/papagan-ciklet-462", quote: "Örneğin, Oscar balığı (Astronotus ocellatus), Green Terror (Andinoacara rivulatus) ve Jack Dempsey (Rocio octofasciata) gibi türler, benzer agresif ve bölgeci davranışlar sergiledik" },
      { url: "https://www.akvaryum.market/amazon-kilici/", quote: "Bitki oscar balığı ve cikletler ile aynı akvaryuma koyulmamalıdır." },
    ],
    addedAt: "2026-11-14",
  },
  {
    term: "Kırmızı kuyruklu köpekbalığı",
    speciesIds: ["red-tailed-black-shark"],
    evidence: [
      { url: "https://www.lepisteskulubu.org/2019_03_07_archive.html", quote: "Kırmızı kuyruklu köpekbalığı (Epalzeorhynchos bicolor - \"köpekbalığı\" diye satılırlar ama köpekbalıklarıyla hiçbir ilgileri yoktur)" },
      { url: "https://www.akvaryum.market/tetrazon/", quote: "Kiraz barb, çöpçü balığı, moli balığı, gül barb, kırmızı kuyruklu köpekbalığı, plati balığı, tetra balıkları, kılıçkuyruk balığı ve vatoz balığı bulundurulabilir." },
    ],
    addedAt: "2026-11-14",
  },
  {
    term: "Plati balığı",
    speciesIds: ["platy"],
    evidence: [
      { url: "https://doldurkabi.com/hayvan-ansiklopedisi/baliklar/moli", quote: "Benzer Irklar Platy Plati Balığı" },
      { url: "https://www.akvaryum.market/tetrazon/", quote: "Kiraz barb, çöpçü balığı, moli balığı, gül barb, kırmızı kuyruklu köpekbalığı, plati balığı, tetra balıkları, kılıçkuyruk balığı ve vatoz balığı bulundurulabilir." },
    ],
    addedAt: "2026-11-14",
  },
  {
    term: "Koi balığı",
    speciesIds: ["koi-carp"],
    evidence: [
      { url: "https://dergipark.org.tr/tr/pub/actaquatr/article/587691", quote: "Koi balığı (Cyprinus carpio, Linnaeus, 1758) Yetiştiriciliğinde Argulus japonicus (Thiele, 1900) Enfestasyonu" },
      { url: "https://blog.petzzshop.com/koi-baligi/", quote: "Koi Balığı Bakımı ve Özellikleri (Koi Balığı Efsanesi)" },
    ],
    addedAt: "2026-11-14",
  },
];

export const plantSearchSuggestions: PlantSearchSuggestion[] = [
  {
    term: "Java eğreltisi",
    plantIds: ["microsorum-pteropus", "microsorum-pteropus-narrow", "microsorum-pteropus-trident", "microsorum-pteropus-windelov"],
    evidence: [
      { url: "https://www.akvaryum.market/java-fern/", quote: "Java Fern (Java Eğreltisi) Özellikleri, Dikimi, Bakımı ve Çoğaltma" },
      { url: "https://www.lepisteskulubu.org/2019_03_07_archive.html", quote: "Microsorum pteropus (Java eğreltisi)" },
      { url: "https://karidesnest.com/blog/neocaridina-bakimi/", quote: "Java yosunu, Christmas moss gibi yosunlar, Java eğreltisi (Java fern) ve Anubias bakımı kolay ve karidesle uyumlu bitkilerdir." },
    ],
    addedAt: "2026-11-14",
  },
  {
    term: "Java yosunu",
    plantIds: ["taxiphyllum-barbieri"],
    evidence: [
      { url: "https://www.bitki.market/java-moss/", quote: "Java yosunu olarak da bilinen bitki, akvaryum hobisinde en çok tercih edilen yosun türüdür." },
      { url: "https://www.evcilal.com/blog/icerik/karides-akvaryumu-kurulumu", quote: "Java moss (Java yosunu), anubias ve cryptocoryne gibi bitkiler, karides akvaryumlarında tercih edilen seçeneklerdir." },
      { url: "https://www.akvared.net/urun/dennerle-plants-taxiphyllum-barbieri-bogor-moss-plantit-porsiyon", quote: "Taxiphyllum barbieri, yanlışlıkla Java yosunu olarak adlandırılır." },
    ],
    addedAt: "2026-11-14",
  },
  {
    term: "Kriptokorin",
    plantIds: ["cryptocoryne-wendtii-green", "cryptocoryne-wendtii-brown", "cryptocoryne-wendtii-tropica", "cryptocoryne-wendtii-mi-oya", "cryptocoryne-undulata", "cryptocoryne-undulata-broad-leaf", "cryptocoryne-crispatula-var-balansae", "cryptocoryne-x-willisii", "cryptocoryne-walkeri", "cryptocoryne-beckettii-petchii", "cryptocoryne-parva", "cryptocoryne-bullosa", "cryptocoryne-nurii-rose-maiden"],
    evidence: [
      { url: "https://blog.tetra.net/tr-tr/kriptokorin", quote: "KRİPTOKORİN (CRYPTOCORYNE)" },
      { url: "https://www.incelebak.com/kriptokorin-wendtii-akvaryum-bitkilerinde-ustalar/", quote: "Kriptokorin Wendtii: Akvaryum Bitkilerinde Ustalar" },
    ],
    addedAt: "2026-11-14",
  },
  {
    term: "Amazon kılıcı",
    plantIds: ["echinodorus-grisebachii-bleherae"],
    evidence: [
      { url: "https://www.akvaryum.market/amazon-kilici/", quote: "Amazon Kılıcı Bitkisi Özellikleri Bilimsel ismi: Echinodorus amazonicus (dar yapraklı), Echinodorus bleheri (geniş yapraklı) Doğal yaşam alanı: Meksika ile Arjantin arasında" },
      { url: "https://www.vetdestek.com/en-dayanikli-akvaryum-bitkileri/", quote: "Amazon Kılıcı (Echinodorus amazonicus), geniş yaprakları ve hızlı büyümesiyle tanınır." },
      { url: "https://emamapet.com.tr/blog/yeni-baslayanlar-icin-en-iyi-10-kolay-akvaryum-bitkisi-eblog", quote: "Amazon Kılıcı, büyük ve gösterişli yapraklarıyla bir akvaryumun yıldızı olabilir." },
    ],
    addedAt: "2026-11-14",
  },
  {
    term: "Yosun topu",
    plantIds: ["aegagropila-linnaei"],
    evidence: [
      { url: "https://www.insukuland.com/blog/bakim-rehberi/marimo-sans-getiren-yosun-topu", quote: "Evet, Marimo Ball, Yosun Topu, evde kolaylıkla bakabileceğiniz, çok bakım istemeyen suda yaşayabilen bir canlıdır." },
      { url: "https://www.idefix.com/netx-canli-bitki-yosun-topu-ml-p-26102799", quote: "Marimo Moss Ball , halk arasında “Yosun Topu” olarak bilinen, aslında yosun değil özel bir alg formudur." },
      { url: "https://emamapet.com.tr/blog/yeni-baslayanlar-icin-en-iyi-10-kolay-akvaryum-bitkisi-eblog", quote: "Marimo Yosun Topu Kadife görünümlü bu yeşil toplar, aslında bir yosun değil, Cladophora adı verilen bir alg türüdür." },
    ],
    addedAt: "2026-11-14",
  },
  {
    term: "Su yoncası",
    plantIds: ["marsilea-minuta", "marsilea-hirsuta"],
    evidence: [
      { url: "https://www.akvaryum.market/marsilea-minuta/", quote: "Marsilea Minuta Nasıl Yayılır Sürgünler oluşturarak yayılır su yoncası bitkisi." },
      { url: "https://atakanpetshop.com/blog/akvaryumda-taban-bitkileri", quote: "Yapraklarının görüntüsü sebebiyle su yoncası olarak da isimlendirilir." },
      { url: "https://www.akvaryum.com/Forum/su_yoncasi_k944916.asp?PID=5662670", quote: "Su yoncası'na da benzer ararsanız bulursunuz." },
    ],
    addedAt: "2026-11-14",
  },
  {
    term: "Noel yosunu",
    plantIds: ["vesicularia-montagnei-christmas-moss"],
    evidence: [
      { url: "https://blog.tetra.net/tr-tr/kiraz-karides-caliskan-bir-temizlik-uzmani", quote: "özellikle çeşitli yosun türlerini (Cava yosunu, Noel Yosunu ve diğerleri), Ricciayı, Kladoforayı, eğrelti otlarını" },
      { url: "https://emamapet.com.tr/blog/yeni-baslayanlar-icin-en-iyi-10-kolay-akvaryum-bitkisi-eblog", quote: "Noel Yosunu, tankınıza doğal bir dokunuş katmak isteyenler için mükemmeldir." },
    ],
    addedAt: "2026-11-14",
  },
];
