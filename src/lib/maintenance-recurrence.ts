// Tekrarlayan bakım (2026-11-14 sprinti). Tekrarlama günü olan görev tamamlanınca sonraki görev oluşur: tarihi tamamlanma anı + aralık,
// saati eski görevin saatidir (ör. her hafta akşam 18:00). Başlık, tür, miktar ve not aynen taşınır. Görev iki kez tamamlanmaz; tamamlanmış
// görev yeniden tamamlanırsa liste değişmez.
import type { MaintenanceTask } from "@/types/aquarium";

const DAY_MS = 86_400_000;

/** Tamamlanan görevin sonraki tekrarının tarihi (ISO); tekrarlama yoksa `undefined`. */
export function nextDueAt(task: MaintenanceTask, completedAt: Date): string | undefined {
  const days = task.recurrenceDays;
  if (!days || !Number.isFinite(days) || days < 1) return undefined;
  const next = new Date(completedAt.getTime() + Math.round(days) * DAY_MS);
  const due = new Date(task.dueAt);
  if (!Number.isNaN(due.getTime())) next.setHours(due.getHours(), due.getMinutes(), 0, 0);
  return next.toISOString();
}

/** Görevi tamamlar; tekrarlıysa sonraki görevi listenin başına ekler. Görev yoksa ya da zaten tamamlanmışsa liste aynen döner. */
export function completeMaintenance(tasks: MaintenanceTask[], id: string, completedAt: Date, newId: () => string): MaintenanceTask[] {
  const task = tasks.find((item) => item.id === id);
  if (!task || task.completedAt) return tasks;
  const done = { ...task, completedAt: completedAt.toISOString() };
  const updated = tasks.map((item) => (item.id === id ? done : item));
  const dueAt = nextDueAt(task, completedAt);
  if (!dueAt) return updated;
  // `task` tamamlanmamıştır (yukarıda denetlendi); yeni görev de tamamlanmamış başlar.
  return [{ ...task, id: newId(), dueAt }, ...updated];
}
