"use client";

import { Download } from "lucide-react";
import { buildLocalExport, daysSinceBackup, hasUserData, shouldRemindBackup } from "@/lib/aquarium-storage";
import { localIsoDate } from "@/lib/local-date";
import { downloadBackup, useBackupStatus } from "@/lib/use-backup";
import { useAquariums } from "@/providers/aquarium-provider";
import { useI18n } from "@/providers/i18n-provider";

// Yedek hatırlatması (docs/DECISIONS/0027-yedekten-geri-yukleme.md): bu cihazda kalıcı kullanıcı verisi varken, hiç yedek
// alınmadıysa ya da son yedek eskidiyse gösterilir. "Sonra hatırlat" bir süre erteler. Demo kayıtlar sayılmaz.
export function BackupReminder() {
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
