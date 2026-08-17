"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { aquariums as seedAquariums, waterReadings as seedWaterReadings } from "@/data/mock-data";
import { loadAquariums, loadWaterReadings, saveAquariums, saveWaterReadings } from "@/lib/aquarium-storage";
import type { Aquarium, WaterParameters } from "@/types/aquarium";

interface AquariumContextValue {
  aquariums: Aquarium[];
  hydrated: boolean;
  addAquarium: (aquarium: Aquarium) => void;
  removeAquarium: (id: string) => void;
  waterReadings: WaterParameters[];
  addWaterReading: (reading: WaterParameters) => void;
}

const AquariumContext = createContext<AquariumContextValue | null>(null);

export function AquariumProvider({ children }: { children: React.ReactNode }) {
  const [aquariums, setAquariums] = useState(seedAquariums);
  const [hydrated, setHydrated] = useState(false);
  const [waterReadings, setWaterReadings] = useState(seedWaterReadings);

  useEffect(() => {
    setAquariums(loadAquariums(seedAquariums));
    setWaterReadings(loadWaterReadings(seedWaterReadings));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveAquariums(aquariums);
  }, [aquariums, hydrated]);

  useEffect(() => {
    if (hydrated) saveWaterReadings(waterReadings);
  }, [waterReadings, hydrated]);

  const value = useMemo(() => ({
    aquariums,
    hydrated,
    addAquarium: (aquarium: Aquarium) => setAquariums((current) => [...current, aquarium]),
    removeAquarium: (id: string) => setAquariums((current) => current.filter((item) => item.id !== id)),
    waterReadings,
    addWaterReading: (reading: WaterParameters) => setWaterReadings((current) => [reading, ...current]),
  }), [aquariums, hydrated, waterReadings]);

  return <AquariumContext.Provider value={value}>{children}</AquariumContext.Provider>;
}

export function useAquariums() {
  const context = useContext(AquariumContext);
  if (!context) throw new Error("useAquariums must be used within AquariumProvider");
  return context;
}
