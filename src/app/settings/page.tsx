"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Bell, Check, Database, Download, Globe2, Moon, Ruler, ShieldCheck, Trash2, UserRound } from "lucide-react";
import type { Preferences } from "@aquamind/domain";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { buildLocalExport, countOrphans, findOrphans, loadDeletedAquariums } from "@/lib/aquarium-storage";
import { localIsoDate } from "@/lib/local-date";
import { useAquariums } from "@/providers/aquarium-provider";
import { useI18n } from "@/providers/i18n-provider";

const input="mt-1.5 w-full rounded-xl border border-white/[.08] bg-[#09171e] px-3 py-3 text-sm outline-none focus:border-aqua/60";

export default function SettingsPage(){
 // Yalnızca kalıcı kullanıcı verisi kullanılır; ekranda gösterilen demo kayıtlar
 // yedeğe ve yetim sayımına girmez.
 const {persistedSnapshot,storageIssues,preferences,updatePreferences}=useAquariums();
 const {t}=useI18n();
 const [prefs,setPrefs]=useState<Preferences>(preferences); const [saved,setSaved]=useState(false); const [saveFailed,setSaveFailed]=useState(false); const [deletedCount,setDeletedCount]=useState(0);
 // Tercihleri sağlayıcı yükler (bozuksa karantinaya alınır, bellekte varsayılanlar kullanılır, anahtarın üstüne yazılmaz).
 // Form taslağı kayıtlı tercihle eşitlenir; yazma yalnızca kullanıcı "Ayarları kaydet" derse olur.
 useEffect(()=>{setPrefs(preferences)},[preferences]);
 useEffect(()=>{setDeletedCount(loadDeletedAquariums().length)},[]);
 const orphanCount=useMemo(()=>countOrphans(findOrphans(persistedSnapshot)),[persistedSnapshot]);
 const quarantined=storageIssues.filter(issue=>issue.quarantineKey);
 const quarantineFailed=storageIssues.some(issue=>issue.kind==="quarantine-failed");
 const deleteIncomplete=storageIssues.some(issue=>issue.kind==="delete-incomplete"||issue.kind==="delete-refused");
 const hasRecoveryInfo=quarantined.length>0||quarantineFailed||deleteIncomplete||orphanCount>0||deletedCount>0;
 // Kaydetme başarısız olabilir (depolama dolu veya yarım kalmış bir silme işlemi
 // varken yazma engellidir). Bu durumda "Kaydedildi" GÖSTERİLMEZ.
 function save(){const ok=updatePreferences(prefs);setSaved(ok);setSaveFailed(!ok);if(ok)setTimeout(()=>setSaved(false),1800)}
 function exportData(){const data=buildLocalExport(persistedSnapshot,prefs);const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=t.settings.data.exportFileName(localIsoDate());a.click();URL.revokeObjectURL(url)}
 function reset(){if(!confirm(t.settings.data.confirmReset))return;Object.keys(localStorage).filter(k=>k.startsWith("aquamind:")).forEach(k=>localStorage.removeItem(k));location.reload()}
 return <AppShell><PageHeader title={t.navigation.items.settings}/><div className="mx-auto max-w-[980px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10"><div className="mb-8"><p className="eyebrow mb-2 text-aqua">{t.settings.eyebrow}</p><h1 className="text-2xl font-extrabold sm:text-3xl">{t.navigation.items.settings}</h1><p className="mt-2 text-sm text-[#71858d]">{t.settings.description}</p></div>
  <div className="space-y-5"><Section icon={UserRound} title={t.settings.profile.title} description={t.settings.profile.description}><div className="grid gap-4 sm:grid-cols-2"><label className="text-xs font-bold text-[#91a3aa]">{t.settings.profile.name}<input placeholder={t.settings.profile.namePlaceholder} className={input}/></label><label className="text-xs font-bold text-[#91a3aa]">{t.settings.profile.email}<input type="email" placeholder={t.settings.profile.emailPlaceholder} className={input}/></label></div><p className="mt-3 text-[11px] text-[#586e77] sm:text-[9px]">{t.settings.profile.note}</p></Section>
  <Section icon={Ruler} title={t.settings.units.title} description={t.settings.units.description}><div className="grid gap-4 sm:grid-cols-3"><Select label={t.settings.units.temperature} value={prefs.temperature} onChange={v=>setPrefs({...prefs,temperature:v as Preferences["temperature"]})} options={[["celsius",t.settings.units.celsius],["fahrenheit",t.settings.units.fahrenheit]]}/><Select label={t.settings.units.volume} value={prefs.volume} onChange={v=>setPrefs({...prefs,volume:v as Preferences["volume"]})} options={[["liters",t.settings.units.liters],["gallons",t.settings.units.gallons]]}/><Select label={t.settings.units.dateFormat} value={prefs.dateFormat} onChange={v=>setPrefs({...prefs,dateFormat:v as Preferences["dateFormat"]})} options={[["day-first",t.settings.units.dayFirst],["month-first",t.settings.units.monthFirst]]}/></div></Section>
  <Section icon={Bell} title={t.settings.notifications.title} description={t.settings.notifications.description}><div className="divide-y divide-white/[.05]"><Toggle label={t.settings.notifications.maintenance} description={t.settings.notifications.maintenanceHelp} checked={prefs.maintenance} onChange={v=>setPrefs({...prefs,maintenance:v})}/><Toggle label={t.settings.notifications.water} description={t.settings.notifications.waterHelp} checked={prefs.waterAlerts} onChange={v=>setPrefs({...prefs,waterAlerts:v})}/><Toggle label={t.settings.notifications.news} description={t.settings.notifications.newsHelp} checked={prefs.productNews} onChange={v=>setPrefs({...prefs,productNews:v})}/></div></Section>
  <Section icon={Moon} title={t.settings.appearance.title} description={t.settings.appearance.description}><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-aqua/20 bg-aqua/[.05] p-4"><div className="flex items-center justify-between"><div><p className="text-xs font-bold">{t.settings.appearance.darkTheme}</p><p className="mt-1 text-[11px] text-[#647981] sm:text-[9px]">{t.settings.appearance.darkThemeHelp}</p></div><Check size={17} className="text-aqua"/></div></div><Toggle label={t.settings.appearance.compact} description={t.settings.appearance.compactHelp} checked={prefs.compactMode} onChange={v=>setPrefs({...prefs,compactMode:v})}/></div></Section>
  <Section icon={Database} title={t.settings.data.title} description={t.settings.data.description}><div className="grid gap-3 sm:grid-cols-2"><button onClick={exportData} className="flex items-center gap-3 rounded-xl border border-white/[.07] p-4 text-left hover:border-aqua/25"><span className="grid size-9 place-items-center rounded-lg bg-aqua/10 text-aqua"><Download size={17}/></span><div><p className="text-xs font-bold">{t.settings.data.export}</p><p className="mt-1 text-[11px] text-[#647981] sm:text-[9px]">{t.settings.data.exportHelp}</p></div></button><button onClick={reset} className="flex items-center gap-3 rounded-xl border border-red-400/10 p-4 text-left hover:border-red-400/30"><span className="grid size-9 place-items-center rounded-lg bg-red-400/10 text-red-400"><Trash2 size={17}/></span><div><p className="text-xs font-bold text-red-300">{t.settings.data.reset}</p><p className="mt-1 text-[11px] text-[#647981] sm:text-[9px]">{t.settings.data.resetHelp}</p></div></button></div></Section>
  {hasRecoveryInfo&&<Section icon={AlertTriangle} title={t.settings.recovery.title} description={t.settings.recovery.description}><div className="space-y-2 text-[11px] sm:text-[10px] leading-relaxed text-[#91a3aa]">
   {quarantined.length>0&&<p>{t.settings.recovery.quarantined(quarantined.length,quarantined.map(issue=>issue.key).join(", "))}</p>}
   {quarantineFailed&&<p className="text-amber-300">{t.settings.recovery.quarantineFailed}</p>}
   {deleteIncomplete&&<p className="text-amber-300">{t.settings.recovery.deleteIncomplete}</p>}
   {orphanCount>0&&<p>{t.settings.recovery.orphans(orphanCount)}</p>}
   {deletedCount>0&&<p>{t.settings.recovery.deleted(deletedCount)}</p>}
   <p className="text-[11px] sm:text-[9px] text-[#586e77]">{t.settings.recovery.contentHidden}</p>
  </div></Section>}
  <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-white/[.06] bg-white/[.02] p-4 sm:flex-row"><div className="flex items-center gap-3"><ShieldCheck size={18} className="text-emerald-400"/><div><p className="text-xs font-bold">{t.settings.storedLocally}</p><p className="mt-1 text-[11px] text-[#647981] sm:text-[9px]">{t.settings.cloudLater}</p>{saveFailed&&<p className="mt-2 text-[11px] sm:text-[10px] font-bold text-amber-300">{t.settings.saveFailed}</p>}</div></div><button onClick={save} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-aqua px-5 py-3 text-xs font-extrabold text-ink sm:min-h-0 sm:w-auto">{saved?<><Check size={16}/>{t.settings.saved}</>:t.settings.save}</button></div>
  <div className="flex items-center justify-center gap-2 py-3 text-[11px] sm:text-[9px] text-[#40545d]"><Globe2 size={12}/>{t.settings.footer}</div></div></div></AppShell>
}

function Section({icon:Icon,title,description,children}:{icon:typeof UserRound;title:string;description:string;children:React.ReactNode}){return <section className="surface p-5 sm:p-6"><div className="mb-5 flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-aqua/10 text-aqua"><Icon size={17}/></span><div><h2 className="text-sm font-extrabold">{title}</h2><p className="mt-1 text-[11px] text-[#647981] sm:text-[9px]">{description}</p></div></div>{children}</section>}
function Select({label,value,onChange,options}:{label:string;value:string;onChange:(value:string)=>void;options:string[][]}){return <label className="text-xs font-bold text-[#91a3aa]">{label}<select value={value} onChange={e=>onChange(e.target.value)} className={input}>{options.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>}
function Toggle({label,description,checked,onChange}:{label:string;description:string;checked:boolean;onChange:(value:boolean)=>void}){return <label className="flex cursor-pointer items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"><div><p className="text-xs font-bold">{label}</p><p className="mt-1 text-[11px] text-[#647981] sm:text-[9px]">{description}</p></div><input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} className="sr-only"/><span className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked?"bg-aqua":"bg-white/10"}`}><span className={`absolute top-1 size-4 rounded-full bg-white transition ${checked?"left-6":"left-1"}`}/></span></label>}
