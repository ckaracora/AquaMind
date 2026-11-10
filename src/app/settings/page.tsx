"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { AlertTriangle, Bell, Check, Database, Download, Globe2, HardDrive, Moon, Ruler, ShieldCheck, Trash2, Upload, UserRound, X } from "lucide-react";
import type { Preferences } from "@aquamind/domain";
import { LOCALE_NAMES, SUPPORTED_LOCALES, isLocale } from "@aquamind/localization";
import { AppShell } from "@/components/app-shell";
import { ModalDialog } from "@/components/modal-dialog";
import { PageHeader } from "@/components/page-header";
import { beginStorageSuspension, buildLocalExport, countOrphans, endStorageSuspension, findOrphans, loadDeletedAquariums, restoreFromBackup, type CollectionName, type RestoreResult } from "@/lib/aquarium-storage";
import { COLLECTION_NAMES, MAX_BACKUP_BYTES, countSnapshot, parseBackup, type BackupParseFailure, type BackupParseResult } from "@/lib/backup-restore";
import { localIsoDate } from "@/lib/local-date";
import { downloadBackup, useBackupStatus, usePersistentStorage } from "@/lib/use-backup";
import { useDisplayFormat } from "@/lib/use-display-format";
import { useAquariums } from "@/providers/aquarium-provider";
import { useI18n } from "@/providers/i18n-provider";

const input="mt-1.5 w-full rounded-xl border border-white/[.08] bg-[#09171e] px-3 py-3 text-sm outline-none focus:border-aqua/60";

export default function SettingsPage(){
 // Yalnızca kalıcı kullanıcı verisi kullanılır; ekranda gösterilen demo kayıtlar
 // yedeğe ve yetim sayımına girmez.
 const {persistedSnapshot,storageIssues,preferences,updatePreferences}=useAquariums();
 const {t,requestedLocale,setLocale}=useI18n();
 const fmt=useDisplayFormat();
 const backup=useBackupStatus();
 const persistence=usePersistentStorage();
 const fileInput=useRef<HTMLInputElement>(null);
 // Kalıcı depolama isteğinin sonucu düğmenin yerine geçer; odak sonuç metnine taşınır, metin ekran okuyucuya duyurulur.
 const persistenceStatus=useRef<HTMLParagraphElement>(null);
 const [persistenceRequested,setPersistenceRequested]=useState(false);
 const titleId=useId();
 const descriptionId=useId();
 // Geri yükleme: dosya okunur ve doğrulanır, özet onay penceresinde gösterilir; depoya yalnız "Yedeği geri yükle" ile yazılır.
 const [pendingBackup,setPendingBackup]=useState<Extract<BackupParseResult,{ok:true}>|null>(null);
 const [restoreError,setRestoreError]=useState<string|null>(null);
 const [restored,setRestored]=useState(false);
 // Dil seçimi "Ayarları kaydet" beklemeden hemen uygulanır ve bu cihazda saklanır (src/lib/locale-choice.ts); öteki tercihler kaydetmeyle yazılır.
 const [languageFailed,setLanguageFailed]=useState(false);
 // Seçim son istenen dili gösterir; paket yüklenirken başka dil seçilirse yalnız son seçim uygulanır.
 function chooseLanguage(value:string){if(!isLocale(value))return;setLanguageFailed(false);setLocale(value).catch(()=>setLanguageFailed(true))}
 const [prefs,setPrefs]=useState<Preferences>(preferences); const [saved,setSaved]=useState(false); const [saveFailed,setSaveFailed]=useState(false); const [deletedCount,setDeletedCount]=useState(0);
 // Tercihleri sağlayıcı yükler (bozuksa karantinaya alınır, bellekte varsayılanlar kullanılır, anahtarın üstüne yazılmaz).
 // Form taslağı kayıtlı tercihle eşitlenir; yazma yalnızca kullanıcı "Ayarları kaydet" derse olur.
 useEffect(()=>{setPrefs(preferences)},[preferences]);
 useEffect(()=>{setDeletedCount(loadDeletedAquariums().length)},[]);
 useEffect(()=>{if(persistenceRequested&&persistence.state!=="best-effort")persistenceStatus.current?.focus()},[persistenceRequested,persistence.state]);
 // Geri yüklemeden sonra sayfa yeniden yüklenir; başarı bildirimi bu sekmenin oturum deposundan bir kez okunur.
 useEffect(()=>{try{if(sessionStorage.getItem(RESTORED_FLAG)){sessionStorage.removeItem(RESTORED_FLAG);setRestored(true)}}catch{}},[]);
 const orphanCount=useMemo(()=>countOrphans(findOrphans(persistedSnapshot)),[persistedSnapshot]);
 const quarantined=storageIssues.filter(issue=>issue.quarantineKey);
 const quarantineFailed=storageIssues.some(issue=>issue.kind==="quarantine-failed");
 const deleteIncomplete=storageIssues.some(issue=>issue.kind==="delete-incomplete"||issue.kind==="delete-refused");
 const restoreIncomplete=storageIssues.some(issue=>issue.kind==="restore-incomplete");
 const hasRecoveryInfo=quarantined.length>0||quarantineFailed||deleteIncomplete||restoreIncomplete||orphanCount>0||deletedCount>0;
 // Kaydetme başarısız olabilir (depolama dolu veya yarım kalmış bir silme işlemi
 // varken yazma engellidir). Bu durumda "Kaydedildi" GÖSTERİLMEZ.
 function save(){const ok=updatePreferences(prefs);setSaved(ok);setSaveFailed(!ok);if(ok)setTimeout(()=>setSaved(false),1800)}
 function exportData(){downloadBackup(buildLocalExport(persistedSnapshot,prefs),t.settings.data.exportFileName(localIsoDate()));backup.markExported()}
 const d=t.settings.data;
 const restoreFailure=(reason:BackupParseFailure|"read-failed")=>{setPendingBackup(null);setRestoreError(d.restoreErrors[reason])};
 async function chooseBackup(file:File|undefined){
  setRestoreError(null);setRestored(false);
  if(!file)return;
  if(file.size>MAX_BACKUP_BYTES){restoreFailure("too-large");return}
  let text:string;
  try{text=await file.text()}catch{restoreFailure("read-failed");return}
  const result=parseBackup(text);
  if(result.ok)setPendingBackup(result);else restoreFailure(result.reason);
 }
 function confirmRestore(){
  if(!pendingBackup)return;
  // Yazma boyunca normal kaydetmeler durur; başarıdan sonra sayfa yeniden yüklenir, bellekteki eski veri depoya yazılmaz.
  beginStorageSuspension();
  let result:RestoreResult;
  try{result=restoreFromBackup(pendingBackup.payload)}
  catch{endStorageSuspension();setPendingBackup(null);setRestoreError(d.restoreUnexpected);return}
  if(result.status==="completed"){try{sessionStorage.setItem(RESTORED_FLAG,"1")}catch{}location.reload();return}
  endStorageSuspension();
  setPendingBackup(null);
  setRestoreError(result.status==="incomplete"?d.restoreIncomplete:result.status==="unavailable"?d.restoreRefused.unavailable:d.restoreRefused[result.reason]);
 }
 const countList=(counts:Record<CollectionName,number>)=>COLLECTION_NAMES.filter(name=>counts[name]>0).map(name=>`${fmt.number(counts[name])} ${d.restoreDialog.units[name](counts[name])}`).join(", ");
 const currentCounts=countSnapshot(persistedSnapshot);
 const persistenceText={checking:d.persistence.checking,persisted:d.persistence.persisted,"best-effort":d.persistence.bestEffort,denied:d.persistence.denied,unsupported:d.persistence.unsupported}[persistence.state];
 function reset(){if(!confirm(t.settings.data.confirmReset))return;Object.keys(localStorage).filter(k=>k.startsWith("aquamind:")).forEach(k=>localStorage.removeItem(k));location.reload()}
 return <AppShell><PageHeader title={t.navigation.items.settings}/><div className="mx-auto max-w-[980px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10"><div className="mb-8"><p className="eyebrow mb-2 text-aqua">{t.settings.eyebrow}</p><h1 className="text-2xl font-extrabold sm:text-3xl">{t.navigation.items.settings}</h1><p className="mt-2 text-sm text-[#71858d]">{t.settings.description}</p></div>
  <div className="space-y-5"><Section icon={UserRound} title={t.settings.profile.title} description={t.settings.profile.description}><div className="grid gap-4 sm:grid-cols-2"><label className="text-xs font-bold text-[#91a3aa]">{t.settings.profile.name}<input placeholder={t.settings.profile.namePlaceholder} className={input}/></label><label className="text-xs font-bold text-[#91a3aa]">{t.settings.profile.email}<input type="email" placeholder={t.settings.profile.emailPlaceholder} className={input}/></label></div><p className="mt-3 text-[11px] text-[#586e77] sm:text-[9px]">{t.settings.profile.note}</p></Section>
  <Section icon={Ruler} title={t.settings.units.title} description={t.settings.units.description}><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Select label={t.settings.units.language} value={requestedLocale} onChange={chooseLanguage} options={SUPPORTED_LOCALES.map(code=>[code,LOCALE_NAMES[code],code])}/><Select label={t.settings.units.temperature} value={prefs.temperature} onChange={v=>setPrefs({...prefs,temperature:v as Preferences["temperature"]})} options={[["celsius",t.settings.units.celsius],["fahrenheit",t.settings.units.fahrenheit]]}/><Select label={t.settings.units.volume} value={prefs.volume} onChange={v=>setPrefs({...prefs,volume:v as Preferences["volume"]})} options={[["liters",t.settings.units.liters],["gallons",t.settings.units.gallons]]}/><Select label={t.settings.units.dateFormat} value={prefs.dateFormat} onChange={v=>setPrefs({...prefs,dateFormat:v as Preferences["dateFormat"]})} options={[["day-first",t.settings.units.dayFirst],["month-first",t.settings.units.monthFirst]]}/></div>{languageFailed&&<p role="alert" className="mt-3 text-xs font-bold text-amber-200">{t.settings.units.languageLoadFailed}</p>}</Section>
  <Section icon={Bell} title={t.settings.notifications.title} description={t.settings.notifications.description}><div className="divide-y divide-white/[.05]"><Toggle label={t.settings.notifications.maintenance} description={t.settings.notifications.maintenanceHelp} checked={prefs.maintenance} onChange={v=>setPrefs({...prefs,maintenance:v})}/><Toggle label={t.settings.notifications.water} description={t.settings.notifications.waterHelp} checked={prefs.waterAlerts} onChange={v=>setPrefs({...prefs,waterAlerts:v})}/><Toggle label={t.settings.notifications.news} description={t.settings.notifications.newsHelp} checked={prefs.productNews} onChange={v=>setPrefs({...prefs,productNews:v})}/></div></Section>
  <Section icon={Moon} title={t.settings.appearance.title} description={t.settings.appearance.description}><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-aqua/20 bg-aqua/[.05] p-4"><div className="flex items-center justify-between"><div><p className="text-xs font-bold">{t.settings.appearance.darkTheme}</p><p className="mt-1 text-[11px] text-[#647981] sm:text-[9px]">{t.settings.appearance.darkThemeHelp}</p></div><Check size={17} className="text-aqua"/></div></div><Toggle label={t.settings.appearance.compact} description={t.settings.appearance.compactHelp} checked={prefs.compactMode} onChange={v=>setPrefs({...prefs,compactMode:v})}/></div></Section>
  <Section icon={Database} title={d.title} description={d.description}><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"><button onClick={exportData} className="flex items-center gap-3 rounded-xl border border-white/[.07] p-4 text-left hover:border-aqua/25"><span className="grid size-9 place-items-center rounded-lg bg-aqua/10 text-aqua"><Download size={17}/></span><div><p className="text-xs font-bold">{d.export}</p><p className="mt-1 text-[11px] text-[#647981] sm:text-[9px]">{d.exportHelp}</p></div></button><button onClick={()=>fileInput.current?.click()} className="flex items-center gap-3 rounded-xl border border-white/[.07] p-4 text-left hover:border-aqua/25"><span className="grid size-9 place-items-center rounded-lg bg-aqua/10 text-aqua"><Upload size={17}/></span><div><p className="text-xs font-bold">{d.restore}</p><p className="mt-1 text-[11px] text-[#647981] sm:text-[9px]">{d.restoreHelp}</p></div></button><button onClick={reset} className="flex items-center gap-3 rounded-xl border border-red-400/10 p-4 text-left hover:border-red-400/30"><span className="grid size-9 place-items-center rounded-lg bg-red-400/10 text-red-400"><Trash2 size={17}/></span><div><p className="text-xs font-bold text-red-300">{d.reset}</p><p className="mt-1 text-[11px] text-[#647981] sm:text-[9px]">{d.resetHelp}</p></div></button></div>
   <input ref={fileInput} type="file" accept="application/json,.json" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={e=>{const file=e.target.files?.[0];e.target.value="";void chooseBackup(file)}}/>
   <div className="mt-3 space-y-1 text-[11px] leading-relaxed text-[#91a3aa] sm:text-[10px]">
    {backup.status&&<p>{backup.status.lastExportAt?d.lastBackup(fmt.date(backup.status.lastExportAt,{day:"numeric",month:"long",year:"numeric"})):d.noBackup}</p>}
    <p className="text-[#647981]">{d.fileNote}</p>
    {restored&&<p role="status" className="font-bold text-emerald-400">{d.restored}</p>}
    {restoreError&&<p role="alert" className="font-bold text-amber-300">{restoreError}</p>}
   </div>
   <div className="mt-4 flex flex-col gap-3 rounded-xl border border-white/[.07] p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-aqua/10 text-aqua"><HardDrive size={17}/></span><div><p className="text-xs font-bold">{d.persistence.title}</p><p ref={persistenceStatus} tabIndex={-1} role="status" aria-live="polite" className={`mt-1 text-[11px] outline-none sm:text-[10px] ${persistence.state==="persisted"?"text-emerald-400":"text-[#91a3aa]"}`}>{persistenceText}</p><p className="mt-1 text-[11px] text-[#647981] sm:text-[9px]">{d.persistence.safariNote}</p></div></div>{persistence.state==="best-effort"&&<button type="button" onClick={()=>{setPersistenceRequested(true);persistence.request()}} className="min-h-11 min-w-11 shrink-0 rounded-xl border border-aqua/30 px-4 py-2 text-xs font-extrabold text-aqua">{d.persistence.request}</button>}</div>
  </Section>
  {hasRecoveryInfo&&<Section icon={AlertTriangle} title={t.settings.recovery.title} description={t.settings.recovery.description}><div className="space-y-2 text-[11px] sm:text-[10px] leading-relaxed text-[#91a3aa]">
   {quarantined.length>0&&<p>{t.settings.recovery.quarantined(quarantined.length,quarantined.map(issue=>issue.key).join(", "))}</p>}
   {quarantineFailed&&<p className="text-amber-300">{t.settings.recovery.quarantineFailed}</p>}
   {deleteIncomplete&&<p className="text-amber-300">{t.settings.recovery.deleteIncomplete}</p>}
   {restoreIncomplete&&<p className="text-amber-300">{t.settings.recovery.restoreIncomplete}</p>}
   {orphanCount>0&&<p>{t.settings.recovery.orphans(orphanCount)}</p>}
   {deletedCount>0&&<p>{t.settings.recovery.deleted(deletedCount)}</p>}
   <p className="text-[11px] sm:text-[9px] text-[#586e77]">{t.settings.recovery.contentHidden}</p>
  </div></Section>}
  <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-white/[.06] bg-white/[.02] p-4 sm:flex-row"><div className="flex items-center gap-3"><ShieldCheck size={18} className="text-emerald-400"/><div><p className="text-xs font-bold">{t.settings.storedLocally}</p><p className="mt-1 text-[11px] text-[#647981] sm:text-[9px]">{t.settings.cloudLater}</p>{saveFailed&&<p className="mt-2 text-[11px] sm:text-[10px] font-bold text-amber-300">{t.settings.saveFailed}</p>}</div></div><button onClick={save} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-aqua px-5 py-3 text-xs font-extrabold text-ink sm:min-h-0 sm:w-auto">{saved?<><Check size={16}/>{t.settings.saved}</>:t.settings.save}</button></div>
  <div className="flex items-center justify-center gap-2 py-3 text-[11px] sm:text-[9px] text-[#40545d]"><Globe2 size={12}/>{t.settings.footer}</div></div></div>
  {pendingBackup&&<ModalDialog close={()=>setPendingBackup(null)} labelledBy={titleId} describedBy={descriptionId} width="max-w-md">
   <div className="flex items-start justify-between gap-3"><h2 id={titleId} className="text-lg font-extrabold">{d.restoreDialog.title}</h2><button type="button" onClick={()=>setPendingBackup(null)} aria-label={t.common.close} className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/[.04] text-[#71858d] sm:size-9"><X size={17}/></button></div>
   <p id={descriptionId} className="mt-2 text-sm text-[#91a3aa]">{d.restoreDialog.backupDate(fmt.date(pendingBackup.summary.exportedAt,{day:"numeric",month:"long",year:"numeric"}))}</p>
   <div className="mt-4 rounded-xl border border-white/[.07] p-3 text-sm"><p className="text-xs font-bold text-[#91a3aa]">{d.restoreDialog.backupContains}</p><p className="mt-1">{countList(pendingBackup.summary.counts)||d.restoreDialog.emptyBackup}</p>{pendingBackup.summary.deletedAquariums>0&&<p className="mt-1 text-[#91a3aa]">{d.restoreDialog.deletedInBackup(pendingBackup.summary.deletedAquariums)}</p>}</div>
   {countList(currentCounts)?<div className="mt-3 rounded-xl border border-amber-300/25 bg-amber-300/[.07] p-3 text-sm text-amber-100"><p className="font-bold">{d.restoreDialog.replaceWarning}</p><p className="mt-1">{countList(currentCounts)}</p><button type="button" onClick={exportData} className="mt-3 flex min-h-11 min-w-11 items-center gap-2 rounded-xl border border-amber-300/30 px-3 py-2 text-xs font-bold text-amber-200"><Download size={15} aria-hidden="true"/>{d.restoreDialog.downloadCurrent}</button></div>:<p className="mt-3 text-sm text-[#91a3aa]">{d.restoreDialog.nothingOnDevice}</p>}
   <p className="mt-3 text-[11px] leading-relaxed text-[#71858d]">{d.restoreDialog.keptNote}</p>
   <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" onClick={()=>setPendingBackup(null)} className="min-h-11 min-w-11 rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-[#91a3aa]">{d.restoreDialog.cancel}</button><button type="button" onClick={confirmRestore} className="min-h-11 min-w-11 rounded-xl bg-aqua px-4 py-2 text-xs font-extrabold text-ink">{d.restoreDialog.confirm}</button></div>
  </ModalDialog>}
  </AppShell>
}

const RESTORED_FLAG="aquamind:restored";

function Section({icon:Icon,title,description,children}:{icon:typeof UserRound;title:string;description:string;children:React.ReactNode}){return <section className="surface p-5 sm:p-6"><div className="mb-5 flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-aqua/10 text-aqua"><Icon size={17}/></span><div><h2 className="text-sm font-extrabold">{title}</h2><p className="mt-1 text-[11px] text-[#647981] sm:text-[9px]">{description}</p></div></div>{children}</section>}
// Seçeneğin üçüncü öğesi verilirse seçeneğin dilidir (dil adları kendi dillerinde yazılır).
function Select({label,value,onChange,options}:{label:string;value:string;onChange:(value:string)=>void;options:string[][]}){return <label className="text-xs font-bold text-[#91a3aa]">{label}<select value={value} onChange={e=>onChange(e.target.value)} className={input}>{options.map(([v,l,lang])=><option key={v} value={v} lang={lang}>{l}</option>)}</select></label>}
function Toggle({label,description,checked,onChange}:{label:string;description:string;checked:boolean;onChange:(value:boolean)=>void}){return <label className="flex cursor-pointer items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"><div><p className="text-xs font-bold">{label}</p><p className="mt-1 text-[11px] text-[#647981] sm:text-[9px]">{description}</p></div><input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} className="sr-only"/><span className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked?"bg-aqua":"bg-white/10"}`}><span className={`absolute top-1 size-4 rounded-full bg-white transition ${checked?"left-6":"left-1"}`}/></span></label>}
