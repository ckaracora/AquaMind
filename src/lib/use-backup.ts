"use client";

import { useCallback, useEffect, useState } from "react";
import type { BackupStatus, LocalExportV1 } from "@aquamind/domain";
import { loadBackupStatus, recordBackupExport, snoozeBackupReminder } from "@/lib/aquarium-storage";

// Yedek indirme, yedek durumu ve kalıcı depolama isteği (docs/DECISIONS/0027-yedekten-geri-yukleme.md).

const STATUS_EVENT = "aquamind:backup-status-changed";

/** Yedeği JSON dosyası olarak indirir. Tarayıcı indirmenin tamamlandığını bildirmez; tıklama yeterli sayılır. */
export function downloadBackup(data: LocalExportV1, fileName: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Son yedeğin zamanı ve hatırlatma ertelemesi. Aynı sayfadaki hatırlatma ve ayarlar bölümü bir olayla eşitlenir.
 * Sayfa önceden derlendiği için durum tarayıcıda okunur; okunana kadar `null`.
 */
export function useBackupStatus() {
  const [status, setStatus] = useState<BackupStatus | null>(null);
  useEffect(() => {
    const refresh = () => setStatus(loadBackupStatus());
    refresh();
    window.addEventListener(STATUS_EVENT, refresh);
    return () => window.removeEventListener(STATUS_EVENT, refresh);
  }, []);
  const notify = () => window.dispatchEvent(new Event(STATUS_EVENT));
  const markExported = useCallback(() => {
    recordBackupExport();
    notify();
  }, []);
  const snooze = useCallback(() => {
    snoozeBackupReminder();
    notify();
  }, []);
  return { status, markExported, snooze };
}

/**
 * Tarayıcının kalıcı depolama kararı. `persisted`: tarayıcı veriyi kendiliğinden silmez. `best-effort`: yer daralınca ya da
 * tarayıcının kendi kuralıyla silinebilir. `denied`: istendi, tarayıcı kabul etmedi. `unsupported`: tarayıcı desteklemiyor.
 */
export type PersistenceState = "checking" | "persisted" | "best-effort" | "denied" | "unsupported";

export function usePersistentStorage() {
  const [state, setState] = useState<PersistenceState>("checking");
  useEffect(() => {
    const storage = typeof navigator === "undefined" ? undefined : navigator.storage;
    if (!storage?.persisted || !storage.persist) {
      setState("unsupported");
      return;
    }
    storage.persisted().then((persisted) => setState(persisted ? "persisted" : "best-effort"), () => setState("unsupported"));
  }, []);
  const request = useCallback(() => {
    // Bazı tarayıcılar burada izin sorar; istek yalnız kullanıcı düğmeye bastığında yapılır.
    navigator.storage.persist().then((granted) => setState(granted ? "persisted" : "denied"), () => setState("denied"));
  }, []);
  return { state, request };
}
