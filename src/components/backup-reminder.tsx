"use client";

import { Download, X } from "lucide-react";
import { buildLocalExport, daysSinceBackup, hasUserData, shouldRemindBackup } from "@/lib/aquarium-storage";
import { localIsoDate } from "@/lib/local-date";
import { downloadBackup, useBackupStatus } from "@/lib/use-backup";
import { useAquariums } from "@/providers/aquarium-provider";
import { useI18n } from "@/providers/i18n-provider";

// Yedek hatırlatması (docs/DECISIONS/0027-yedekten-geri-yukleme.md): bu cihazda kalıcı kullanıcı verisi varken, hiç yedek
// alınmadıysa ya da son yedek eskidiyse gösterilir. "Sonra hatırlat" bir süre erteler. Demo kayıtlar sayılmaz.
// Genel Bakış'ta açıklamalı kutu, öbür sayfalarda tek satırlık şerit (`variant="strip"`) çıkar; kural ikisinde de aynıdır
// (kullanılabilirlik turu, 2026-11-12, ürün sahibi onayı: kutu telefonda ekranın beşte biri kadar yer tutuyordu).
export function BackupReminder({ variant = "full" }: { variant?: "full" | "strip" }) {
  const { hydrated, persistedSnapshot, preferences } = useAquariums();
  const { t } = useI18n();
  const { status, markExported, snooze } = useBackupStatus();
  if (!hydrated || !status || !shouldRemindBackup(hasUserData(persistedSnapshot), status)) return null;
  const days = daysSinceBackup(status);
  const r = t.backupReminder;

  function backupNow() {
    downloadBackup(buildLocalExport(persistedSnapshot, preferences), t.settings.data.exportFileName(localIsoDate()));
    markExported();
  }

  if (variant === "strip") return <div role="status" className="mx-5 mt-4 flex items-center gap-2 rounded-xl border border-aqua/20 bg-aqua/[.05] pl-3 pr-1 sm:mx-8 lg:mx-10">
    <Download size={15} aria-hidden="true" className="shrink-0 text-aqua"/>
    <p className="min-w-0 flex-1 py-2 text-xs leading-snug text-[#b4c3c8]">{days === undefined ? r.stripNever : r.stripOld(days)}</p>
    <button type="button" onClick={backupNow} className="min-h-11 min-w-11 shrink-0 px-2 text-xs font-extrabold text-aqua">{r.stripBackup}</button>
    <button type="button" onClick={snooze} aria-label={r.later} title={r.later} className="grid size-11 shrink-0 place-items-center rounded-lg text-[#71858d] hover:text-white"><X size={16} aria-hidden="true"/></button>
  </div>;

  return <div role="status" className="mx-5 mt-4 rounded-xl border border-aqua/20 bg-aqua/[.05] p-4 sm:mx-8 lg:mx-10">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-[11px] leading-relaxed text-[#b4c3c8]">
        <p className="font-bold text-aqua">{days === undefined ? r.never : r.old(days)}</p>
        <p className="mt-1">{r.help}</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <button type="button" onClick={backupNow} className="flex min-h-11 min-w-11 items-center gap-2 rounded-xl bg-aqua px-4 py-2 text-xs font-extrabold text-ink"><Download size={15} aria-hidden="true"/>{r.backupNow}</button>
        <button type="button" onClick={snooze} className="min-h-11 min-w-11 rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-[#91a3aa]">{r.later}</button>
      </div>
    </div>
  </div>;
}
