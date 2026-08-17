"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { aquariums as seedAquariums, equipment as seedEquipment, livestock as seedLivestock, maintenanceTasks as seedMaintenanceTasks, plants as seedPlants, waterReadings as seedWaterReadings } from "@/data/mock-data";
import { loadAquariums, loadEquipment, loadLivestock, loadMaintenanceTasks, loadPlants, loadWaterReadings, saveAquariums, saveEquipment, saveLivestock, saveMaintenanceTasks, savePlants, saveWaterReadings } from "@/lib/aquarium-storage";
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
}

const AquariumContext = createContext<AquariumContextValue | null>(null);

export function AquariumProvider({ children }: { children: React.ReactNode }) {
  const [aquariums, setAquariums] = useState(seedAquariums);
  const [hydrated, setHydrated] = useState(false);
  const [waterReadings, setWaterReadings] = useState(seedWaterReadings);
  const [maintenanceTasks, setMaintenanceTasks] = useState(seedMaintenanceTasks);
  const [livestock, setLivestock] = useState(seedLivestock);
  const [plants, setPlants] = useState(seedPlants);
  const [equipment, setEquipment] = useState(seedEquipment);

  useEffect(() => {
    setAquariums(loadAquariums(seedAquariums));
    setWaterReadings(loadWaterReadings(seedWaterReadings));
    setMaintenanceTasks(loadMaintenanceTasks(seedMaintenanceTasks));
    setLivestock(loadLivestock(seedLivestock));
    setPlants(loadPlants(seedPlants));
    setEquipment(loadEquipment(seedEquipment));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveAquariums(aquariums);
  }, [aquariums, hydrated]);

  useEffect(() => {
    if (hydrated) saveWaterReadings(waterReadings);
  }, [waterReadings, hydrated]);

  useEffect(() => {
    if (hydrated) saveMaintenanceTasks(maintenanceTasks);
  }, [maintenanceTasks, hydrated]);

  useEffect(() => {
    if (hydrated) saveLivestock(livestock);
  }, [livestock, hydrated]);

  useEffect(() => {
    if (hydrated) savePlants(plants);
  }, [plants, hydrated]);

  useEffect(() => {
    if (hydrated) saveEquipment(equipment);
  }, [equipment, hydrated]);

  const value = useMemo(() => ({
    aquariums,
    hydrated,
    addAquarium: (aquarium: Aquarium) => setAquariums((current) => [...current, aquarium]),
    removeAquarium: (id: string) => setAquariums((current) => current.filter((item) => item.id !== id)),
    updateAquarium: (aquarium: Aquarium) => setAquariums((current) => current.map((item) => item.id === aquarium.id ? aquarium : item)),
    waterReadings,
    addWaterReading: (reading: WaterParameters) => setWaterReadings((current) => [reading, ...current]),
    maintenanceTasks,
    addMaintenanceTask: (task: MaintenanceTask) => setMaintenanceTasks((current) => [task, ...current]),
    completeMaintenanceTask: (id: string) => setMaintenanceTasks((current) => current.map((task) => task.id === id ? { ...task, completedAt: new Date().toISOString() } : task)),
    livestock,
    addLivestock: (item: Livestock) => setLivestock((current) => [item, ...current]),
    removeLivestock: (id: string) => setLivestock((current) => current.filter((item) => item.id !== id)),
    plants,
    addPlant: (item: Plant) => setPlants((current) => [item, ...current]),
    removePlant: (id: string) => setPlants((current) => current.filter((item) => item.id !== id)),
    equipment,
    addEquipment: (item: Equipment) => setEquipment((current) => [item, ...current]),
    removeEquipment: (id: string) => setEquipment((current) => current.filter((item) => item.id !== id)),
  }), [aquariums, hydrated, waterReadings, maintenanceTasks, livestock, plants, equipment]);

  return <AquariumContext.Provider value={value}>{children}</AquariumContext.Provider>;
}

export function useAquariums() {
  const context = useContext(AquariumContext);
  if (!context) throw new Error("useAquariums must be used within AquariumProvider");
  return context;
}
