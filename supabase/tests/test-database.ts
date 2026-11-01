import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { PGlite, type PGliteInterface, type Transaction } from "@electric-sql/pglite";

// Yerel test veritabanı (docs/DECISIONS/0032-docker-gerektirmeyen-gelistirme-yolu.md): Supabase taklidi ve `supabase/migrations/`
// altındaki bütün migration'lar ad sırasıyla boş bir PGlite'a uygulanır. Kurulum dosya başına bir kez yapılır; her test `clone()` ile
// temiz bir kopyadan başlar. Gerçek bir projeye bağlanmaz, ağ ya da gizli anahtar gerekmez.

const MIGRATIONS = fileURLToPath(new URL("../migrations/", import.meta.url));
export const ROLLBACKS = fileURLToPath(new URL("../rollbacks/", import.meta.url));
const SHIM = fileURLToPath(new URL("./supabase-shim.sql", import.meta.url));

export const migrationFiles = () => readdirSync(MIGRATIONS).filter((name) => name.endsWith(".sql")).sort();

/** Taklit ve migration'lar uygulanmış veritabanı. */
export async function migratedDatabase(): Promise<PGlite> {
  const db = await PGlite.create();
  await db.exec(readFileSync(SHIM, "utf8"));
  for (const name of migrationFiles()) await db.exec(readFileSync(MIGRATIONS + name, "utf8"));
  return db;
}

export type Actor = { role: "authenticated"; userId: string } | { role: "anon" } | { role: "service_role" };

/** Bir işlemi verilen rol ve kimlikle çalıştırır; işlem bitince rol ve kimlik geri döner (`set local`). */
export function as<T>(db: PGliteInterface, actor: Actor, run: (tx: Transaction) => Promise<T>): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.exec(`set local role ${actor.role}`);
    if (actor.role === "authenticated") await tx.query("select set_config('request.jwt.claim.sub', $1, true)", [actor.userId]);
    return run(tx);
  });
}

/** Hatanın SQLSTATE kodu; hata yoksa "ok". Testler mesaja değil koda bakar. */
export async function sqlState(run: () => Promise<unknown>): Promise<string> {
  try {
    await run();
    return "ok";
  } catch (error) {
    return (error as { code?: string }).code ?? String(error);
  }
}
