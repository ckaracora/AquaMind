import { readdirSync, readFileSync } from "node:fs";
import type { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { migratedDatabase, migrationFiles, ROLLBACKS } from "./test-database";

// Şemanın katalog ve izin denetimleri (karar 0032 ve 0033): tablo ve sütun izinleri, fonksiyon izinleri, RLS ve politikalar, sabit
// `search_path`, migration adları ve geri alma. Aynı denetimler 1B'de hazırlık projesinde de çalıştırılır (karar 0032, 3. madde).
// Supabase taklidi public şemasındaki yeni nesnelere anon, authenticated ve service_role için hazır izin verir (en geniş varsayım);
// migration'ın bunları açıkça geri aldığı burada görülür.

const TABLES = ["profiles", "aquariums", "aquarium_members"] as const;
/** authenticated rolünün sütun düzeyindeki ekleme ve değiştirme izinleri; tablo düzeyinde yalnız okuma var. */
const COLUMN_GRANTS: Record<(typeof TABLES)[number], { INSERT: string[]; UPDATE: string[] }> = {
  profiles: { INSERT: [], UPDATE: ["display_name", "locale", "nickname"] },
  aquariums: {
    INSERT: ["description", "height_cm", "length_cm", "name", "net_volume_l", "owner_id", "setup_date", "type", "width_cm"],
    UPDATE: ["description", "height_cm", "length_cm", "name", "net_volume_l", "setup_date", "status", "type", "width_cm"],
  },
  aquarium_members: { INSERT: ["aquarium_id", "role", "user_id"], UPDATE: ["role"] },
};
const CALLABLE = ["is_aquarium_member", "is_aquarium_owner"];
const SECURITY_DEFINER = ["add_owner_membership", "handle_new_user", "is_aquarium_member", "is_aquarium_owner"];

let db: PGlite;
const query = async <T>(sql: string, params: unknown[] = []) => (await db.query<T>(sql, params)).rows;

beforeAll(async () => {
  db = await migratedDatabase();
}, 120_000);
afterAll(async () => {
  await db?.close();
});

describe("tablo ve sütun izinleri", () => {
  it("public şemasında yalnız bu üç tablo var", async () => {
    expect((await query<{ t: string }>("select tablename as t from pg_tables where schemaname = 'public' order by 1")).map((r) => r.t)).toEqual([...TABLES].sort());
  });

  it("anon ve PUBLIC için hiçbir tablo ya da sütun izni yok", async () => {
    for (const table of TABLES) {
      for (const privilege of ["SELECT", "INSERT", "UPDATE", "DELETE", "TRUNCATE", "REFERENCES", "TRIGGER"]) {
        expect((await query<{ ok: boolean }>("select has_table_privilege('anon', $1, $2) as ok", [`public.${table}`, privilege]))[0].ok, `anon ${table} ${privilege}`).toBe(false);
      }
      for (const privilege of ["SELECT", "INSERT", "UPDATE", "REFERENCES"]) {
        expect((await query<{ ok: boolean }>("select has_any_column_privilege('anon', $1, $2) as ok", [`public.${table}`, privilege]))[0].ok, `anon sütun ${table} ${privilege}`).toBe(false);
      }
    }
    expect(await query("select table_name, privilege_type from information_schema.role_table_grants where table_schema = 'public' and grantee = 'PUBLIC'")).toEqual([]);
    expect(await query("select table_name, column_name from information_schema.column_privileges where table_schema = 'public' and grantee = 'PUBLIC'")).toEqual([]);
  });

  it("service_role'de TRUNCATE ve TRIGGER yok (satır tetikleyicilerini atlar, koruyucu tetikleyicileri değiştirir); satır işlemleri var", async () => {
    for (const table of TABLES) {
      for (const privilege of ["TRUNCATE", "TRIGGER"]) {
        expect((await query<{ ok: boolean }>("select has_table_privilege('service_role', $1, $2) as ok", [`public.${table}`, privilege]))[0].ok, `${table} ${privilege}`).toBe(false);
      }
      for (const privilege of ["SELECT", "INSERT", "UPDATE", "DELETE"]) {
        expect((await query<{ ok: boolean }>("select has_table_privilege('service_role', $1, $2) as ok", [`public.${table}`, privilege]))[0].ok, `${table} ${privilege}`).toBe(true);
      }
    }
  });

  it("authenticated: tablo düzeyinde yalnız okuma; ekleme ve değiştirme yalnız listelenen sütunlarda; silme yok", async () => {
    for (const table of TABLES) {
      const tableLevel = Object.fromEntries(await Promise.all(["SELECT", "INSERT", "UPDATE", "DELETE", "TRUNCATE", "REFERENCES", "TRIGGER"].map(async (privilege) =>
        [privilege, (await query<{ ok: boolean }>("select has_table_privilege('authenticated', $1, $2) as ok", [`public.${table}`, privilege]))[0].ok])));
      expect(tableLevel, table).toEqual({ SELECT: true, INSERT: false, UPDATE: false, DELETE: false, TRUNCATE: false, REFERENCES: false, TRIGGER: false });
      const columns = (await query<{ c: string }>("select column_name as c from information_schema.columns where table_schema = 'public' and table_name = $1 order by 1", [table])).map((r) => r.c);
      for (const privilege of ["INSERT", "UPDATE"] as const) {
        const granted: string[] = [];
        for (const column of columns) {
          if ((await query<{ ok: boolean }>("select has_column_privilege('authenticated', $1, $2, $3) as ok", [`public.${table}`, column, privilege]))[0].ok) granted.push(column);
        }
        expect(granted, `${table} ${privilege}`).toEqual(COLUMN_GRANTS[table][privilege]);
      }
    }
  });
});

describe("fonksiyon izinleri ve güvenliği", () => {
  type Fn = { name: string; secdef: boolean; acl: boolean; public_execute: boolean; config: string[] | null };
  const functions = () => query<Fn>(`
    select p.proname as name, p.prosecdef as secdef, p.proacl is not null as acl, p.proconfig as config,
      exists (select 1 from aclexplode(p.proacl) a where a.grantee = 0 and a.privilege_type = 'EXECUTE') as public_execute
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' order by 1`);

  it("PUBLIC hiçbir fonksiyonu çalıştıramaz (izin listesi boş değil ve PUBLIC EXECUTE satırı yok)", async () => {
    const list = await functions();
    expect(list.length).toBe(8);
    for (const fn of list) {
      expect(fn.acl, `${fn.name} izin listesi`).toBe(true);
      expect(fn.public_execute, `${fn.name} PUBLIC`).toBe(false);
    }
  });

  it("anon hiçbirini, authenticated yalnız politika yardımcılarını çalıştırabilir", async () => {
    for (const fn of await functions()) {
      const signature = (await query<{ s: string }>("select p.oid::regprocedure::text as s from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname = $1", [fn.name]))[0].s;
      expect((await query<{ ok: boolean }>("select has_function_privilege('anon', $1, 'EXECUTE') as ok", [signature]))[0].ok, `anon ${fn.name}`).toBe(false);
      expect((await query<{ ok: boolean }>("select has_function_privilege('authenticated', $1, 'EXECUTE') as ok", [signature]))[0].ok, `authenticated ${fn.name}`).toBe(CALLABLE.includes(fn.name));
    }
  });

  it("security definer fonksiyonlar beklenen dört fonksiyon; hepsinde (ve öbürlerinde) search_path boş ve sabit", async () => {
    const list = await functions();
    expect(list.filter((fn) => fn.secdef).map((fn) => fn.name)).toEqual(SECURITY_DEFINER);
    for (const fn of list) expect(fn.config, fn.name).toEqual(['search_path=""']);
  });
});

describe("satır politikaları", () => {
  it("üç tabloda RLS açık; politikalar yalnız authenticated rolüne; silme politikası yok", async () => {
    expect((await query<{ t: string; rls: boolean }>("select c.relname as t, c.relrowsecurity as rls from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relkind = 'r' order by 1")))
      .toEqual([...TABLES].sort().map((t) => ({ t, rls: true })));
    const policies = await query<{ t: string; p: string; cmd: string; roles: string[] }>("select tablename as t, policyname as p, cmd, roles from pg_policies where schemaname = 'public' order by 1, 2");
    expect(policies.map((r) => `${r.t}.${r.p}:${r.cmd}`)).toEqual([
      "aquarium_members.aquarium_members_insert_owner:INSERT",
      "aquarium_members.aquarium_members_select_member:SELECT",
      "aquarium_members.aquarium_members_update_owner:UPDATE",
      "aquariums.aquariums_insert_self:INSERT",
      "aquariums.aquariums_select_member:SELECT",
      "aquariums.aquariums_update_member:UPDATE",
      "profiles.profiles_select_own:SELECT",
      "profiles.profiles_update_own:UPDATE",
    ]);
    expect(policies.every((r) => r.roles.join() === "authenticated")).toBe(true);
  });
});

describe("migration dosyaları ve geri alma", () => {
  it("migration adları zaman damgalı ve sıralı; her birinin geri alma dosyası var", () => {
    const files = migrationFiles();
    expect(files.length).toBeGreaterThan(0);
    for (const name of files) expect(name).toMatch(/^\d{14}_[a-z0-9_]+\.sql$/);
    expect(readdirSync(ROLLBACKS).filter((name) => name.endsWith(".sql")).sort()).toEqual(files);
  });

  it("geri alma migration'ın bütün nesnelerini kaldırır; migration sonra yeniden uygulanabilir", async () => {
    const copy = await db.clone();
    try {
      for (const name of [...migrationFiles()].reverse()) await copy.exec(readFileSync(ROLLBACKS + name, "utf8"));
      expect((await copy.query("select tablename from pg_tables where schemaname = 'public'")).rows).toEqual([]);
      expect((await copy.query("select p.proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public'")).rows).toEqual([]);
      expect((await copy.query("select tgname from pg_trigger where tgrelid = 'auth.users'::regclass and not tgisinternal")).rows).toEqual([]);
      const migrations = new URL("../migrations/", import.meta.url);
      for (const name of migrationFiles()) await copy.exec(readFileSync(new URL(name, migrations), "utf8"));
      expect((await copy.query("select tablename from pg_tables where schemaname = 'public'")).rows.length).toBe(TABLES.length);
    } finally {
      await copy.close();
    }
  });
});
