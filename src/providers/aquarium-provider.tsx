"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { aquariums as seedAquariums } from "@/data/mock-data";
import { loadAquariums, saveAquariums } from "@/lib/aquarium-storage";
import type { Aquarium } from "@/types/aquarium";

interface AquariumContextValue {
  aquariums: Aquarium[];
  hydrated: boolean;
  addAquarium: (aquarium: Aquarium) => void;
  removeAquarium: (id: string) => void;
}

const AquariumContext = createContext<AquariumContextValue | null>(null);

export function AquariumProvider({ children }: { children: React.ReactNode }) {
  const [aquariums, setAquariums] = useState(seedAquariums);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setAquariums(loadAquariums(seedAquariums));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveAquariums(aquariums);
  }, [aquariums, hydrated]);

  const value = useMemo(() => ({
    aquariums,
    hydrated,
    addAquarium: (aquarium: Aquarium) => setAquariums((current) => [...current, aquarium]),
    removeAquarium: (id: string) => setAquariums((current) => current.filter((item) => item.id !== id)),
  }), [aquariums, hydrated]);

  return <AquariumContext.Provider value={value}>{children}</AquariumContext.Provider>;
}

export function useAquariums() {
  const context = useContext(AquariumContext);
  if (!context) throw new Error("useAquariums must be used within AquariumProvider");
  return context;
}
