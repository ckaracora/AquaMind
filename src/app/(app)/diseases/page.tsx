"use client";

import { useEffect, useState } from "react";
import { DiseaseGuideView } from "@/components/disease-guide-view";

// Hastalık ve tedavi sayfası (docs/DECISIONS/0022-hastalik-ve-tedavi-sayfasi.md). Sayfa durağan üretilir; adres (`?aquarium=`) tarayıcıda
// okunur ve içeriği çizen bileşene verilir (src/components/disease-guide-view.tsx).
export default function DiseasesPage(){const [search,setSearch]=useState("");useEffect(()=>setSearch(location.search),[]);return <DiseaseGuideView search={search}/>}
