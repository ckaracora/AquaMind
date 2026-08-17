"use client";

import { useMemo, useState } from "react";
import { PackageSearch, Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { careCategoryLabels, careProductCatalog, type CareProductCategory } from "@/data/care-product-catalog";

export default function ProductsPage(){
  const [category,setCategory]=useState<"all"|CareProductCategory>("all");
  const [brand,setBrand]=useState("all");
  const [query,setQuery]=useState("");
  const brands=useMemo(()=>[...new Set(careProductCatalog.map(item=>item.brand))].sort((a,b)=>a.localeCompare(b,"tr")),[]);
  const items=useMemo(()=>careProductCatalog.filter(item=>category==="all"||item.category===category).filter(item=>brand==="all"||item.brand===brand).filter(item=>`${item.brand} ${item.model} ${item.description}`.toLocaleLowerCase("tr-TR").includes(query.toLocaleLowerCase("tr-TR"))),[category,brand,query]);
  return <AppShell><PageHeader title="Ürün Kataloğu"/><div className="mx-auto max-w-[1200px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
    <div className="mb-7"><p className="eyebrow mb-2 text-aqua">Bakım ve besleme</p><h1 className="text-2xl font-extrabold sm:text-3xl">Ürün Kataloğu</h1><p className="mt-2 text-sm text-[#71858d]">Yem, gübre, su düzenleyici ve bakım ürünlerini ekipmanlardan ayrı bul.</p></div>
    <div className="mb-5 grid gap-3 md:grid-cols-[1fr_190px]">
      <label className="relative"><Search size={16} className="absolute left-4 top-3.5 text-[#586e77]"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Marka veya ürün ara..." className="w-full rounded-xl border border-white/[.08] bg-panel py-3 pl-11 pr-4 text-xs outline-none focus:border-aqua/50"/></label>
      <select value={brand} onChange={e=>setBrand(e.target.value)} className="rounded-xl border border-white/[.08] bg-panel px-4 py-3 text-xs font-bold outline-none"><option value="all">Tüm markalar</option>{brands.map(value=><option key={value}>{value}</option>)}</select>
    </div>
    <div className="mb-6 flex gap-1 overflow-x-auto">{(["all",...Object.keys(careCategoryLabels)] as Array<"all"|CareProductCategory>).map(value=><button key={value} onClick={()=>setCategory(value)} className={`shrink-0 rounded-xl px-3 py-2.5 text-[10px] font-bold ${category===value?"bg-aqua/10 text-aqua":"bg-white/[.025] text-[#71858d]"}`}>{value==="all"?"Tümü":careCategoryLabels[value]}</button>)}</div>
    <p className="mb-4 text-xs font-bold text-[#71858d]">{items.length} ürün</p>
    {items.length?<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.map(item=><article key={item.id} className="surface p-5"><div className="flex items-start justify-between gap-3"><span className="grid size-10 place-items-center rounded-xl bg-aqua/10 text-aqua"><PackageSearch size={19}/></span><span className="rounded-full bg-white/[.04] px-2 py-1 text-[8px] font-bold text-[#71858d]">{careCategoryLabels[item.category]}</span></div><h2 className="mt-4 font-extrabold">{item.brand}</h2><p className="mt-1 text-sm font-semibold text-[#a8bbc2]">{item.model}</p><p className="mt-3 text-[11px] leading-5 text-[#71858d]">{item.description}</p></article>)}</div>:<div className="surface grid min-h-52 place-items-center p-8 text-center text-sm text-[#71858d]">Aramana uygun ürün bulunamadı.</div>}
  </div></AppShell>;
}
