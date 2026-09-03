"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { aquariums as seedAquariums, equipment as seedEquipment, livestock as seedLivestock, maintenanceTasks as seedMaintenanceTasks, plants as seedPlants, waterReadings as seedWaterReadings } from "@/data/mock-data";
import {
  beginStorageSuspension,
  checkMutationGate,
  clearStorageIssues,
  deleteAquariumWithJournal,
  endStorageSuspension,
  getStorageIssues,
  hasPendingJournal,
  hydrateFromStorage,
  persistCollection,
  persistedOnly,
  recoverPendingJournal,
  type AquariumDataSnapshot,
  type CollectionName,
  type DemoFlags,
  type PersistResult,
  type StorageIssue,
} from "@/lib/aquarium-storage";
import type { Aquarium, Equipment, Livestock, MaintenanceTask, Plant, WaterParameters } from "@/types/aquarium";

interface AquariumContextValue {
  aquariums: Aquarium[];
  hydrated: boolean;
  addAquarium: (aquarium: Aquarium) => void;
  removeAquarium: (id: string) => void;
  updateAquarium: (aquarium: Aquarium) => void;
  waterReadings: WaterParameters[];
  addWaterReading: (reading: WaterParameters) => void;
  maintenanceTasks: MaintenanceTask[];
  addMaintenanceTask: (task: MaintenanceTask) => void;
  completeMaintenanceTask: (id: string) => void;
  livestock: Livestock[];
  addLivestock: (item: Livestock) => void;
  removeLivestock: (id: string) => void;
  plants: Plant[];
  addPlant: (item: Plant) => void;
  removePlant: (id: string) => void;
  equipment: Equipment[];
  addEquipment: (item: Equipment) => void;
  removeEquipment: (id: string) => void;
  /** Yükleme ve silme sırasında oluşan kurtarma/karantina kayıtları (içerik taşımaz). */
  storageIssues: StorageIssue[];
  /** Hangi koleksiyonların yalnızca ekranda gösterilen demo veri olduğu. */
  demo: DemoFlags;
  /** Yalnızca kalıcı kullanıcı verisi; demo koleksiyonlar boştur. Yedek ve silme bunu kullanır. */
  persistedSnapshot: AquariumDataSnapshot;
  /** Bu cihaza YAZILAMAMIŞ koleksiyonlar. Boş değilse değişiklikler yenilemede kaybolur. */
  unsavedCollections: CollectionName[];
  /** Tamamlanmamış bir silme günlüğü yüzünden son işlem uygulanamadı. */
  writeBlocked: boolean;
}

const INITIAL_DEMO: DemoFlags = {
  aquariums: true,
  waterReadings: true,
  maintenanceTasks: true,
  livestock: true,
  plants: true,
  equipment: true,
};

const AquariumContext = createContext<AquariumContextValue | null>(null);

export function AquariumProvider({ children }: { children: React.ReactNode }) {
  const [aquariums, setAquariums] = useState(seedAquariums);
  const [hydrated, setHydrated] = useState(false);
  const [waterReadings, setWaterReadings] = useState(seedWaterReadings);
  const [maintenanceTasks, setMaintenanceTasks] = useState(seedMaintenanceTasks);
  const [livestock, setLivestock] = useState(seedLivestock);
  const [plants, setPlants] = useState(seedPlants);
  const [equipment, setEquipment] = useState(seedEquipment);
  const [storageIssues, setStorageIssues] = useState<StorageIssue[]>([]);
  const [unsavedCollections, setUnsavedCollections] = useState<CollectionName[]>([]);
  const [writeBlocked, setWriteBlocked] = useState(false);

  // Demo takibi: bir koleksiyon depoda yoksa tohum veri YALNIZCA ekranda gösterilir.
  // Bu kayıtlar kalıcı depoya ve JSON yedeğinin ana koleksiyonlarına girmez.
  const [demo, setDemo] = useState<DemoFlags>(INITIAL_DEMO);
  const demoRef = useRef<DemoFlags>(INITIAL_DEMO);
  const applyDemo = (next: DemoFlags) => {
    demoRef.current = next;
    setDemo(next);
  };

  // Kaydetme askısı: hidrasyon ve günlüklü silme boyunca otomatik kaydetme
  // efektleri hiçbir anahtara yazmaz.
  const suspendRef = useRef(true);
  const pendingReleaseRef = useRef(false);

  /** Kaydetme sonucu asla yok sayılmaz; yazılamayan koleksiyon işaretlenir. */
  const recordPersist = (result: PersistResult) => {
    setUnsavedCollections((current) => {
      const marked = current.includes(result.collection);
      if (result.status === "saved") return marked ? current.filter((name) => name !== result.collection) : current;
      return marked ? current : [...current, result.collection];
    });
  };

  const persistIfActive = (collection: CollectionName, rows: unknown[]) => {
    if (!hydrated || suspendRef.current || demoRef.current[collection]) return;
    recordPersist(persistCollection(collection, rows));
  };

  /**
   * Veri değiştiren her işlem önce buradan geçer. Tamamlanmamış bir silme günlüğü
   * varsa işlem HİÇ başlatılmaz (state değişmez); böylece kullanıcı değişikliği
   * yalnızca bellekte kalıp yenilemede sessizce kaybolmaz.
   */
  const gate = (): boolean => {
    const result = checkMutationGate();
    setWriteBlocked(!result.allowed);
    return result.allowed;
  };

  useEffect(() => {
    beginStorageSuspension();
    clearStorageIssues();

    // Yarıda kalmış silme varsa normal kaydetme başlamadan ÖNCE tamamlanır.
    recoverPendingJournal();
    // Toparlama başarısız kaldıysa (günlük hâlâ duruyorsa) kullanıcı hiçbir işlem
    // denemeden uyarı gösterilir; başarıyla toparlandıysa uyarı çıkmaz.
    setWriteBlocked(hasPendingJournal());

    const { snapshot, demo: demoFlags } = hydrateFromStorage({
      aquariums: seedAquariums,
      waterReadings: seedWaterReadings,
      maintenanceTasks: seedMaintenanceTasks,
      livestock: seedLivestock,
      plants: seedPlants,
      equipment: seedEquipment,
    });

    setAquariums(snapshot.aquariums);
    setWaterReadings(snapshot.waterReadings);
    setMaintenanceTasks(snapshot.maintenanceTasks);
    setLivestock(snapshot.livestock);
    setPlants(snapshot.plants);
    setEquipment(snapshot.equipment);
    applyDemo(demoFlags);
    setStorageIssues(getStorageIssues());

    pendingReleaseRef.current = true;
    setHydrated(true);
  }, []);

  useEffect(() => {
    persistIfActive("aquariums", aquariums);
  }, [aquariums, hydrated, demo]);

  useEffect(() => {
    persistIfActive("waterReadings", waterReadings);
  }, [waterReadings, hydrated, demo]);

  useEffect(() => {
    persistIfActive("maintenanceTasks", maintenanceTasks);
  }, [maintenanceTasks, hydrated, demo]);

  useEffect(() => {
    persistIfActive("livestock", livestock);
  }, [livestock, hydrated, demo]);

  useEffect(() => {
    persistIfActive("plants", plants);
  }, [plants, hydrated, demo]);

  useEffect(() => {
    persistIfActive("equipment", equipment);
  }, [equipment, hydrated, demo]);

  // Bu efekt, yukarıdaki altı kaydetme efektinden SONRA tanımlandığı için aynı
  // commit içinde onlardan sonra çalışır. Askı ancak o noktada kaldırılır.
  useEffect(() => {
    if (!pendingReleaseRef.current) return;
    pendingReleaseRef.current = false;
    suspendRef.current = false;
    endStorageSuspension();
  }, [aquariums, waterReadings, maintenanceTasks, livestock, plants, equipment, hydrated]);

  const displayed = useMemo<AquariumDataSnapshot>(
    () => ({ aquariums, waterReadings, maintenanceTasks, livestock, plants, equipment }),
    [aquariums, waterReadings, maintenanceTasks, livestock, plants, equipment],
  );

  const persistedSnapshot = useMemo(() => persistedOnly(displayed, demo), [displayed, demo]);

  const value = useMemo(() => {
    /**
     * Bir alt kayıt yazıldığında ait olduğu demo akvaryum da gerçek veriye
     * dönüşür; böylece kalıcı yetim kayıt oluşmaz. Diğer demo akvaryumlar taşınmaz.
     */
    const promoteOwner = (aquariumId: string, flags: DemoFlags): DemoFlags => {
      if (!flags.aquariums) return flags;
      const owner = aquariums.find((item) => item.id === aquariumId);
      if (!owner) return flags;
      setAquariums([owner]);
      return { ...flags, aquariums: false };
    };

    return {
      aquariums,
      hydrated,
      storageIssues,
      demo,
      persistedSnapshot,
      unsavedCollections,
      writeBlocked,

      addAquarium: (aquarium: Aquarium) => {
        if (!gate()) return;
        const flags = demoRef.current;
        setAquariums(flags.aquariums ? [aquarium] : [...aquariums, aquarium]);
        applyDemo({ ...flags, aquariums: false });
      },

      updateAquarium: (aquarium: Aquarium) => {
        if (!gate()) return;
        const flags = demoRef.current;
        // Demo bir kayıt üzerinde yapılan açık düzenleme yalnızca O kaydı gerçek
        // veriye dönüştürür; dokunulmamış demo akvaryumlar taşınmaz.
        setAquariums(flags.aquariums ? [aquarium] : aquariums.map((item) => (item.id === aquarium.id ? aquarium : item)));
        applyDemo({ ...flags, aquariums: false });
      },

      removeAquarium: (id: string) => {
        if (!gate()) return;
        if (!aquariums.some((item) => item.id === id)) return;

        if (demoRef.current.aquariums) {
          // Depoda kayıt yok: yalnızca ekrandaki demo gösterim güncellenir.
          setAquariums(aquariums.filter((item) => item.id !== id));
          setWaterReadings((current) => current.filter((row) => row.aquariumId !== id || !demoRef.current.waterReadings));
          setMaintenanceTasks((current) => current.filter((row) => row.aquariumId !== id || !demoRef.current.maintenanceTasks));
          setLivestock((current) => current.filter((row) => row.aquariumId !== id || !demoRef.current.livestock));
          setPlants((current) => current.filter((row) => row.aquariumId !== id || !demoRef.current.plants));
          setEquipment((current) => current.filter((row) => row.aquariumId !== id || !demoRef.current.equipment));
          return;
        }

        suspendRef.current = true;
        beginStorageSuspension();
        const result = deleteAquariumWithJournal(id, persistedSnapshot);

        if (result.status === "completed") {
          const flags = demoRef.current;
          setAquariums(result.snapshot.aquariums);
          if (!flags.waterReadings) setWaterReadings(result.snapshot.waterReadings);
          else setWaterReadings((current) => current.filter((row) => row.aquariumId !== id));
          if (!flags.maintenanceTasks) setMaintenanceTasks(result.snapshot.maintenanceTasks);
          else setMaintenanceTasks((current) => current.filter((row) => row.aquariumId !== id));
          if (!flags.livestock) setLivestock(result.snapshot.livestock);
          else setLivestock((current) => current.filter((row) => row.aquariumId !== id));
          if (!flags.plants) setPlants(result.snapshot.plants);
          else setPlants((current) => current.filter((row) => row.aquariumId !== id));
          if (!flags.equipment) setEquipment(result.snapshot.equipment);
          else setEquipment((current) => current.filter((row) => row.aquariumId !== id));
          setStorageIssues(getStorageIssues());
          pendingReleaseRef.current = true;
          return;
        }

        // Silme yapılamadı: askı hemen kalkar, bellekteki veri olduğu gibi kalır.
        suspendRef.current = false;
        endStorageSuspension();
        setStorageIssues(getStorageIssues());
        if (result.status !== "not-found") setWriteBlocked(true);
      },

      waterReadings,
      addWaterReading: (reading: WaterParameters) => {
        if (!gate()) return;
        const flags = promoteOwner(reading.aquariumId, demoRef.current);
        setWaterReadings(flags.waterReadings ? [reading] : [reading, ...waterReadings]);
        applyDemo({ ...flags, waterReadings: false });
      },

      maintenanceTasks,
      addMaintenanceTask: (task: MaintenanceTask) => {
        if (!gate()) return;
        const flags = promoteOwner(task.aquariumId, demoRef.current);
        setMaintenanceTasks(flags.maintenanceTasks ? [task] : [task, ...maintenanceTasks]);
        applyDemo({ ...flags, maintenanceTasks: false });
      },
      completeMaintenanceTask: (id: string) => {
        if (!gate()) return;
        const task = maintenanceTasks.find((item) => item.id === id);
        if (!task) return;
        const completed = { ...task, completedAt: new Date().toISOString() };
        const flags = promoteOwner(task.aquariumId, demoRef.current);
        setMaintenanceTasks(
          flags.maintenanceTasks ? [completed] : maintenanceTasks.map((item) => (item.id === id ? completed : item)),
        );
        applyDemo({ ...flags, maintenanceTasks: false });
      },

      livestock,
      addLivestock: (item: Livestock) => {
        if (!gate()) return;
        const flags = promoteOwner(item.aquariumId, demoRef.current);
        setLivestock(flags.livestock ? [item] : [item, ...livestock]);
        applyDemo({ ...flags, livestock: false });
      },
      removeLivestock: (id: string) => {
        if (!gate()) return;
        setLivestock(livestock.filter((item) => item.id !== id));
      },

      plants,
      addPlant: (item: Plant) => {
        if (!gate()) return;
        const flags = promoteOwner(item.aquariumId, demoRef.current);
        setPlants(flags.plants ? [item] : [item, ...plants]);
        applyDemo({ ...flags, plants: false });
      },
      removePlant: (id: string) => {
        if (!gate()) return;
        setPlants(plants.filter((item) => item.id !== id));
      },

      equipment,
      addEquipment: (item: Equipment) => {
        if (!gate()) return;
        const flags = promoteOwner(item.aquariumId, demoRef.current);
        setEquipment(flags.equipment ? [item] : [item, ...equipment]);
        applyDemo({ ...flags, equipment: false });
      },
      removeEquipment: (id: string) => {
        if (!gate()) return;
        setEquipment(equipment.filter((item) => item.id !== id));
      },
    };
  }, [aquariums, hydrated, waterReadings, maintenanceTasks, livestock, plants, equipment, storageIssues, demo, persistedSnapshot, unsavedCollections, writeBlocked]);

  return <AquariumContext.Provider value={value}>{children}</AquariumContext.Provider>;
}

export function useAquariums() {
  const context = useContext(AquariumContext);
  if (!context) throw new Error("useAquariums must be used within AquariumProvider");
  return context;
}
