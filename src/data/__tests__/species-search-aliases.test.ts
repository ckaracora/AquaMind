import { describe, expect, it } from "vitest";
import { speciesCatalog, speciesById, speciesForCatalogExactSearch, speciesForCatalogSearch, speciesMatchesForCatalogSearch, speciesWaterTypes } from "@/data/catalog-species";

import { unresolvedSpeciesListings } from "@/data/catalog-species-unresolved";

// Arama adları paketi (2026-11-12, karar 0039'un 2. maddesi; ürün sahibinin açık isteği): var olan kayıtlara kaynaklı eş adlar eklendi,
// Yalnız eş adlar değişir. Kanıt dosyası yazanın veri-b/kanit.md dosyasıdır; CATALOG_LOG aktarımı henüz yapılmadı.
// Denetim: kimliği kanıtlanmayan Turuncu Papağan Balığı ve beş bantlı barb üzerindeki Tiger Barb kaldırıldı.
// Vampire Shrimp için ilk verilen PFK sayfasında alıntı yok; doğrulanan alternatif (2026-11-12):
// https://www.practicalfishkeeping.co.uk/fishkeeping-answers/are-there-any-shrimps-my-fish-wont-eat/
// Atya gabonensis'i adlandıran bölüm: "The African species is, for some strange reason, called the Vampire shrimp by some retailers."
// Eş adlar her dilde aranır; dil etiketleri arama filtresi değildir.
const added: Record<string, string[]> = {
  "blood-parrot-cichlid": ["Red Parrot Cichlid"],
  "yellow-lab": ["Yellow Labidochromis", "Yellow Lab", "Electric Yellow", "Labidochromis Yellow", "Yellow Prince", "Blue Streak Hap"],
  "tiger-barb": ["Tiger Barb", "Green Tiger Barb"],
  "vampire-shrimp": ["Vampire Shrimp"],
  "zebra-danio": ["Zebrafish", "Zebra fish"],
  "white-cloud": ["White Cloud Mountain Fish", "White Cloud Minnow"],
  "giant-danio": ["Malabar Danio"],
  "rummy-nose": ["Rummy Nose"],
  endler: ["Endler's Guppy"],
  molly: ["Black Mollie", "Mexican Molly", "Topote mexicano"],
  "gold-barb": ["Gold Barb", "Green Barb", "China Barb", "Schubert's Barb"],
  "denison-barb": ["Red-lined Torpedo Fish", "Miss Kerala"],
  angelfish: ["Freshwater Angelfish", "Pez angel"],
  discus: ["Blue Discus", "Brown Discus", "Pez disco", "Disco azul"],
  ramirezi: ["Ram Cichlid"],
  kribensis: ["Rainbow Krib", "Purple Cichlid"],
  "jewel-cichlid": ["African Jewelfish", "Jewelfish"],
  "texas-cichlid": ["Rio Grande Perch", "Mojarra del norte"],
  "auratus-cichlid": ["Malawi Golden Cichlid"],
  frontosa: ["Humphead Cichlid"],
  "apisto-cacatuoides": ["Cockatoo Dwarf Cichlid"],
  "pearl-gourami": ["Lace Gourami", "Mosaic Gourami"],
  "honey-gourami": ["Honey Dwarf Gourami"],
  "three-spot-gourami": ["Threespot Gourami", "Three Spot Gourami", "Golden Gourami", "Opaline Gourami", "Gold Gourami", "Cosby Gourami"],
  "kissing-gourami": ["Green Kissing Gourami", "Pink Kisser"],
  "moonlight-gourami": ["Moonbeam Gourami"],
  "sparkling-gourami": ["Pygmy Gourami"],
  "corydoras-panda": ["Panda Catfish"],
  "bronze-cory": ["Bronze Corydoras", "Bronze Catfish"],
  "peppered-cory": ["Peppered Corydoras", "Peppered Catfish", "Corydoras paleatus"],
  "three-lined-cory": ["Threestripe Corydoras", "Corydoras tres líneas", "Corydoras trilineatus"],
  "pygmy-cory": ["Pygmy Corydoras", "Pygmy Catfish"],
  "salt-pepper-cory": ["Salt and Pepper Catfish"],
  "adolfos-cory": ["Adolf's Catfish"],
  "kuhli-loach": ["Coolie Loach"],
  "dojo-loach": ["Oriental Weatherfish", "Pond Loach", "Misgurno de Asia"],
  "red-tailed-black-shark": ["Redtail Shark", "Redtail Sharkminnow", "Red-tailed Labeo"],
  "rainbow-shark": ["Rainbow Sharkminnow"],
  medaka: ["Japanese Medaka", "Pez-arroz japonés"],
  "senegal-bichir": ["Gray Bichir"],
  "green-spotted-puffer": ["Green Puffer Fish"],
  "elephantnose-fish": ["Elephant Nose"],
  "indian-glass-fish": ["Glass Perchlet"],
  "rope-fish": ["Reedfish"],
  "serpae-tetra": ["Blood Characin"],
  guppy: ["Gupi"],
  platy: ["Espada sureña"],
  "sailfin-molly": ["Topote velo negro"],
  "convict-cichlid": ["Mojarra convicto"],
  "firemouth-cichlid": ["Mojarra boca de fuego"],
  "green-terror": ["Vieja azul"],
  "jack-dempsey": ["Mojarra castarrica"],
  "jaguar-cichlid": ["Guapote tigre", "Mojarra de Managua"],
  goldfish: ["Carpa dorada", "Pez rojo"],
  "red-bellied-pacu": ["Cachama blanca"],
  "redtail-catfish": ["Bagre cajaro", "Pez torre"],
  "emerald-cory": ["Brochis común"],
};
// Üretim aramasından bağımsız çakışma kontrolü: aksan, Türkçe I ve harf büyüklüğü farkı yok sayılır.
const collisionKey = (name: string) => name.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replaceAll("ı", "i").trim().replace(/\s+/g, " ");

describe("arama adları paketi", () => {
  it("her yeni eş ad kendi kaydında, kendi su türünde ve sınıfında tam adla bulunur", () => {
    for (const [id, names] of Object.entries(added)) {
      const profile = speciesById(id);
      expect(profile, id).toBeDefined();
      for (const name of names) {
        expect(profile!.aliases, `${id}: ${name}`).toContain(name);
        for (const waterType of speciesWaterTypes(profile!)) {
          const exact = speciesForCatalogExactSearch(name, profile!.category, waterType);
          expect(exact?.id, `${name} / ${waterType}`).toBe(id);
          expect(speciesForCatalogExactSearch(name.toUpperCase(), profile!.category, waterType)?.id, name).toBe(id);
          expect(speciesMatchesForCatalogSearch(name, profile!.category, waterType).map((item) => item.id), `${name} / ${waterType}`).toContain(id);
        }
      }
    }
    expect(Object.keys(added)).toHaveLength(57);
    expect(Object.values(added).flat()).toHaveLength(99);
  });

  it("yeni eş adlar bütün katalogdaki ad, bilimsel ad ve eş adlarla çakışmaz", () => {
    for (const [id, names] of Object.entries(added)) for (const name of names) {
      const key = collisionKey(name);
      const owners = speciesCatalog.filter((profile) =>
        [profile.commonName, profile.scientificName, ...(profile.aliases ?? [])].some((candidate) => collisionKey(candidate) === key),
      ).map((profile) => profile.id);
      expect(owners, `${id}: ${name}`).toEqual([id]);
      // Çözülmemiş bir satış adını yeni bir eş adla dolaylı olarak çözme.
      const unresolved = unresolvedSpeciesListings.filter((listing) =>
        [listing.name, ...(listing.aliases ?? [])].some((candidate) => collisionKey(candidate) === key),
      );
      expect(unresolved.map((listing) => listing.name), name).toEqual([]);
    }
  });

  it("çakışma anahtarı aksanları ve Türkçe harf farklarını yok sayar", () => {
    for (const [a, b] of [["PEZ ÁNGEL", "pez angel"], ["Corydoras tres líneas", "CORYDORAS TRES LINEAS"], ["PAPAĞAN BALIĞI", "papagan baligi"]]) {
      expect(collisionKey(a)).toBe(collisionKey(b));
    }
  });

  it("reddedilen veya kimliği belirsiz adlar doğrulanmış tam eşleşme üretmez", () => {
    expect(speciesById("five-banded-barb")?.aliases).not.toContain("Tiger Barb");
    expect(speciesForCatalogExactSearch("Tiger Barb", "fish", "freshwater")?.id).toBe("tiger-barb");
    expect(speciesMatchesForCatalogSearch("Tiger Barb", "fish", "freshwater").map((profile) => profile.id)).toEqual(["tiger-barb"]);
    for (const name of ["Turuncu Papağan Balığı", "Balon molly", "Balon moli", "Julii catfish", "JULLY ÇÖPÇÜ BALIKLARI"]) {
      expect(speciesForCatalogExactSearch(name, "fish", "freshwater"), name).toBeUndefined();
    }
  });

  it("örnek aramalar: mağazanın ve hobinin adıyla doğru tür", () => {
    expect(speciesForCatalogSearch("red parrot cichlid", "fish", "freshwater")?.id).toBe("blood-parrot-cichlid");
    expect(speciesForCatalogSearch("yellow lab", "fish", "freshwater")?.id).toBe("yellow-lab");
    expect(speciesForCatalogSearch("ELECTRIC YELLOW", "fish", "freshwater")?.id).toBe("yellow-lab");
    expect(speciesForCatalogSearch("vampire shrimp", "shrimp", "freshwater")?.id).toBe("vampire-shrimp");
    expect(speciesForCatalogSearch("pez disco", "fish", "freshwater")?.id).toBe("discus");
    expect(speciesForCatalogSearch("zebrafish", "fish", "freshwater")?.id).toBe("zebra-danio");
  });

  it("eski Corydoras adları doğru güncel türlere bağlanır ve cins aramasında listelenir", () => {
    const ids = speciesMatchesForCatalogSearch("corydoras", "fish", "freshwater").map((item) => item.id);
    expect(ids).toContain("corydoras-panda");
    expect(speciesById("peppered-cory")?.scientificName).toBe("Hoplisoma paleatum");
    expect(speciesById("three-lined-cory")?.scientificName).toBe("Hoplisoma trilineatum");
    for (const id of ["bronze-cory", "peppered-cory", "three-lined-cory", "true-julii-cory", "sterbai-cory", "pygmy-cory", "salt-pepper-cory", "adolfos-cory", "emerald-cory"]) expect(ids, id).toContain(id);
    expect(speciesForCatalogExactSearch("Corydoras paleatus", "fish", "freshwater")?.id).toBe("peppered-cory");
    expect(speciesForCatalogExactSearch("Corydoras trilineatus", "fish", "freshwater")?.id).toBe("three-lined-cory");
  });
});
