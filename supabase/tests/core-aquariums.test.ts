import type { PGlite, PGliteInterface, Transaction } from "@electric-sql/pglite";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { as, migratedDatabase, sqlState, type Actor } from "./test-database";

// Phase 1A yetki matrisi ve kuralları (karar 0032 ve 0033; Issue #7): üç tablo × beş aktör (sahip, editör, izleyici, ilgisiz, anonim)
// × dört işlem; değişmez alanlar, sahip üyeliği, yaşam döngüsü ve kullanıcı silme koruması. Katmanlar ayrı okunur:
// - izin (GRANT) reddi: 42501;
// - RLS'nin gizlediği satır: boş sonuç ya da 0 satır (hata yok); RLS `with check` reddi: 42501;
// - tetikleyici kuralı: AQ001–AQ005 (migration dosyasının başında).
// `service_role` yalnız RLS'yi aşar (`bypassrls`); tablolara erişimi Supabase'in (ve taklidin) hazır verdiği izinlerden gelir. Tetikleyici
// kurallarının RLS aşıldığında da çalıştığı onunla sınanır.

let base: PGlite;
let db: PGliteInterface;
const id = { owner: "", editor: "", viewer: "", stranger: "", aquarium: "" };
const actor = {
  owner: () => ({ role: "authenticated", userId: id.owner }) as Actor,
  editor: () => ({ role: "authenticated", userId: id.editor }) as Actor,
  viewer: () => ({ role: "authenticated", userId: id.viewer }) as Actor,
  stranger: () => ({ role: "authenticated", userId: id.stranger }) as Actor,
  anon: () => ({ role: "anon" }) as Actor,
  service: () => ({ role: "service_role" }) as Actor,
};
const MEMBERS = ["owner", "editor", "viewer"] as const;
const SIGNED_IN = ["owner", "editor", "viewer", "stranger"] as const;

const rows = async (who: Actor, sql: string, params: unknown[] = []) => as(db, who, async (tx) => (await tx.query(sql, params)).rows.length);
const affected = async (who: Actor, sql: string, params: unknown[] = []) => as(db, who, async (tx) => (await tx.query(sql, params)).affectedRows ?? 0);
const state = (who: Actor, sql: string, params: unknown[] = []) => sqlState(() => as(db, who, (tx: Transaction) => tx.query(sql, params)));
const superuser = (sql: string, params: unknown[] = []) => db.query(sql, params);

beforeAll(async () => {
  base = await migratedDatabase();
  const user = async (email: string) => (await base.query<{ id: string }>("insert into auth.users (email) values ($1) returning id", [email])).rows[0].id;
  id.owner = await user("owner@test");
  id.editor = await user("editor@test");
  id.viewer = await user("viewer@test");
  id.stranger = await user("stranger@test");
  id.aquarium = await as(base, actor.owner(), async (tx) =>
    (await tx.query<{ id: string }>("insert into public.aquariums (owner_id, name, type, net_volume_l) values ($1, 'Amazon', 'freshwater', 120) returning id", [id.owner])).rows[0].id);
  await as(base, actor.owner(), (tx) => tx.query("insert into public.aquarium_members (aquarium_id, user_id, role) values ($1, $2, 'editor'), ($1, $3, 'viewer')", [id.aquarium, id.editor, id.viewer]));
}, 120_000);
beforeEach(async () => {
  db = await base.clone();
}, 60_000);
afterEach(async () => {
  await db?.close();
});
afterAll(async () => {
  await base?.close();
});

describe("profiller", () => {
  it("kayıtta boş profil oluşur; takma ad boş başlar", async () => {
    const profiles = (await superuser("select user_id, nickname from public.profiles order by user_id")).rows as Array<{ user_id: string; nickname: string | null }>;
    expect(profiles.map((p) => p.user_id).sort()).toEqual([id.owner, id.editor, id.viewer, id.stranger].sort());
    expect(profiles.every((p) => p.nickname === null)).toBe(true);
  });

  it("okuma: herkes yalnız kendi profilini görür; anonim izin katmanında reddedilir", async () => {
    for (const who of SIGNED_IN) expect(await rows(actor[who](), "select user_id from public.profiles where user_id = $1", [id[who]]), who).toBe(1);
    for (const who of SIGNED_IN) expect(await rows(actor[who](), "select user_id from public.profiles"), who).toBe(1);
    expect(await state(actor.anon(), "select user_id from public.profiles")).toBe("42501");
  });

  it("ekleme ve silme izni yok", async () => {
    for (const who of [...SIGNED_IN, "anon"] as const) {
      expect(await state(actor[who](), "insert into public.profiles (user_id) values (gen_random_uuid())"), `${who} ekleme`).toBe("42501");
      expect(await state(actor[who](), "delete from public.profiles"), `${who} silme`).toBe("42501");
    }
  });

  it("değiştirme: yalnız kendi satırının adı ve dili; başkasının satırı 0 satır; kimlik ve tarih sütunu izin katmanında reddedilir", async () => {
    expect(await affected(actor.owner(), "update public.profiles set nickname = 'Kaptan', display_name = 'Ada', locale = 'en' where user_id = $1", [id.owner])).toBe(1);
    expect(await affected(actor.stranger(), "update public.profiles set nickname = 'Korsan' where user_id = $1", [id.owner])).toBe(0);
    expect((await superuser("select nickname from public.profiles where user_id = $1", [id.owner])).rows).toEqual([{ nickname: "Kaptan" }]);
    expect(await state(actor.owner(), "update public.profiles set user_id = $2 where user_id = $1", [id.owner, id.stranger])).toBe("42501");
    expect(await state(actor.owner(), "update public.profiles set created_at = now() where user_id = $1", [id.owner])).toBe("42501");
    expect(await state(actor.anon(), "update public.profiles set nickname = 'x'")).toBe("42501");
    expect(await state(actor.service(), "update public.profiles set user_id = $2 where user_id = $1", [id.owner, id.stranger])).toBe("AQ001");
  });

  it("değiştirmede updated_at sunucuda ilerler, created_at korunur", async () => {
    const before = (await superuser("select created_at, updated_at from public.profiles where user_id = $1", [id.owner])).rows[0] as { created_at: Date; updated_at: Date };
    await as(db, actor.owner(), (tx) => tx.query("update public.profiles set display_name = 'Ada' where user_id = $1", [id.owner]));
    const after = (await superuser("select created_at, updated_at from public.profiles where user_id = $1", [id.owner])).rows[0] as { created_at: Date; updated_at: Date };
    expect(after.created_at).toEqual(before.created_at);
    expect(after.updated_at.getTime()).toBeGreaterThan(before.updated_at.getTime());
  });

  it("takma ad büyük-küçük harf farkı gözetmeden benzersiz; geçersiz dil reddedilir", async () => {
    await as(db, actor.owner(), (tx) => tx.query("update public.profiles set nickname = 'Kaptan' where user_id = $1", [id.owner]));
    expect(await state(actor.editor(), "update public.profiles set nickname = 'kaptan' where user_id = $1", [id.editor])).toBe("23505");
    expect(await state(actor.editor(), "update public.profiles set locale = 'de' where user_id = $1", [id.editor])).toBe("23514");
  });
});

describe("akvaryumlar", () => {
  it("okuma: üyeler görür, ilgisiz görmez, anonim izin katmanında reddedilir", async () => {
    for (const who of MEMBERS) expect(await rows(actor[who](), "select id from public.aquariums"), who).toBe(1);
    expect(await rows(actor.stranger(), "select id from public.aquariums")).toBe(0);
    expect(await state(actor.anon(), "select id from public.aquariums")).toBe("42501");
  });

  it("ekleme: herkes kendi adına ekler ve sonucu geri okur; başkası adına ekleme RLS'de, anonim izin katmanında reddedilir", async () => {
    for (const who of SIGNED_IN) {
      const added = await as(db, actor[who](), async (tx) =>
        (await tx.query("insert into public.aquariums (owner_id, name, type, net_volume_l) values ($1, 'Yeni', 'saltwater', 60) returning id", [id[who]])).rows.length);
      expect(added, who).toBe(1);
    }
    expect(await state(actor.editor(), "insert into public.aquariums (owner_id, name, type, net_volume_l) values ($1, 'Sahte', 'freshwater', 60)", [id.owner])).toBe("42501");
    expect(await state(actor.anon(), "insert into public.aquariums (owner_id, name, type, net_volume_l) values ($1, 'Sahte', 'freshwater', 60)", [id.owner])).toBe("42501");
  });

  it("değiştirme: sahip ve editör ayrıntıyı değiştirir; izleyici AQ003; ilgisiz 0 satır; anonim izin katmanında reddedilir", async () => {
    expect(await affected(actor.owner(), "update public.aquariums set name = 'Sahip' where id = $1", [id.aquarium])).toBe(1);
    expect(await affected(actor.editor(), "update public.aquariums set name = 'Editör', net_volume_l = 150 where id = $1", [id.aquarium])).toBe(1);
    expect(await state(actor.viewer(), "update public.aquariums set name = 'İzleyici' where id = $1", [id.aquarium])).toBe("AQ003");
    expect(await affected(actor.stranger(), "update public.aquariums set name = 'İlgisiz' where id = $1", [id.aquarium])).toBe(0);
    expect(await state(actor.anon(), "update public.aquariums set name = 'Anonim' where id = $1", [id.aquarium])).toBe("42501");
    expect((await superuser("select name from public.aquariums where id = $1", [id.aquarium])).rows).toEqual([{ name: "Editör" }]);
  });

  it("değiştirmede updated_at sunucuda ilerler, created_at korunur", async () => {
    const read = async () => (await superuser("select created_at, updated_at from public.aquariums where id = $1", [id.aquarium])).rows[0] as { created_at: Date; updated_at: Date };
    const before = await read();
    await as(db, actor.editor(), (tx) => tx.query("update public.aquariums set description = 'Bitkili' where id = $1", [id.aquarium]));
    const after = await read();
    expect(after.created_at).toEqual(before.created_at);
    expect(after.updated_at.getTime()).toBeGreaterThan(before.updated_at.getTime());
  });

  it("hacim ve ölçüler sıfırdan büyük olmalı; ad boş olamaz; tür listede olmalı", async () => {
    const cases = (["net_volume_l", "length_cm", "width_cm", "height_cm"] as const).flatMap((column) => [0, -1].map((value) => [column, value] as const));
    for (const [column, value] of cases) {
      expect(await state(actor.owner(), `insert into public.aquariums (owner_id, name, type, net_volume_l${column === "net_volume_l" ? "" : `, ${column}`}) values ($1, 'X', 'freshwater', ${column === "net_volume_l" ? value : 60}${column === "net_volume_l" ? "" : `, ${value}`})`, [id.owner]), `ekleme ${column}=${value}`).toBe("23514");
      expect(await state(actor.owner(), `update public.aquariums set ${column} = ${value} where id = $1`, [id.aquarium]), `değiştirme ${column}=${value}`).toBe("23514");
    }
    expect(await state(actor.owner(), "update public.aquariums set name = '   ' where id = $1", [id.aquarium])).toBe("23514");
    expect(await state(actor.owner(), "update public.aquariums set type = 'pond' where id = $1", [id.aquarium])).toBe("23514");
  });

  it("silme izni kimsede yok (kaldırma yumuşak silmedir)", async () => {
    for (const who of [...SIGNED_IN, "anon"] as const) expect(await state(actor[who](), "delete from public.aquariums where id = $1", [id.aquarium]), who).toBe("42501");
  });

  it("değişmez alanlar: sahip, kimlik ve oluşturulma zamanı", async () => {
    expect(await state(actor.owner(), "update public.aquariums set owner_id = $2 where id = $1", [id.aquarium, id.stranger])).toBe("42501");
    expect(await state(actor.owner(), "update public.aquariums set created_at = now() where id = $1", [id.aquarium])).toBe("42501");
    expect(await state(actor.service(), "update public.aquariums set owner_id = $2 where id = $1", [id.aquarium, id.stranger])).toBe("AQ001");
    expect(await state(actor.service(), "update public.aquariums set id = gen_random_uuid() where id = $1", [id.aquarium])).toBe("AQ001");
  });
});

describe("akvaryum yaşam döngüsü", () => {
  const lifecycle = async () =>
    (await superuser("select status, deleted_at, purge_after, purge_after - deleted_at as gap from public.aquariums where id = $1", [id.aquarium])).rows[0] as {
      status: string; deleted_at: Date | null; purge_after: Date | null; gap: string | null;
    };

  it("yeni akvaryum etkin başlar; istemci durum ya da zaman damgası yazamaz", async () => {
    expect(await state(actor.owner(), "insert into public.aquariums (owner_id, name, type, net_volume_l, status) values ($1, 'X', 'freshwater', 60, 'soft_deleted')", [id.owner])).toBe("42501");
    expect(await state(actor.owner(), "insert into public.aquariums (owner_id, name, type, net_volume_l, deleted_at) values ($1, 'X', 'freshwater', 60, now())", [id.owner])).toBe("42501");
    expect(await state(actor.service(), "insert into public.aquariums (owner_id, name, type, net_volume_l, status) values ($1, 'X', 'freshwater', 60, 'soft_deleted')", [id.owner])).toBe("AQ002");
    expect(await state(actor.service(), "insert into public.aquariums (owner_id, name, type, net_volume_l, purge_after) values ($1, 'X', 'freshwater', 60, now())", [id.owner])).toBe("AQ002");
  });

  it("etkin → yumuşak silinmiş yalnız sahibin; zaman damgalarını sunucu atar (30 gün)", async () => {
    expect(await state(actor.editor(), "update public.aquariums set status = 'soft_deleted' where id = $1", [id.aquarium])).toBe("AQ004");
    expect(await state(actor.viewer(), "update public.aquariums set status = 'soft_deleted' where id = $1", [id.aquarium])).toBe("AQ003");
    expect(await affected(actor.owner(), "update public.aquariums set status = 'soft_deleted' where id = $1", [id.aquarium])).toBe(1);
    const after = await lifecycle();
    expect(after.status).toBe("soft_deleted");
    expect(after.deleted_at).not.toBeNull();
    expect(after.gap).toBe("30 days");
  });

  it("yumuşak silinmiş akvaryumu üyeler görmeye devam eder; sahip geri alır, zaman damgaları boşalır", async () => {
    await as(db, actor.owner(), (tx) => tx.query("update public.aquariums set status = 'soft_deleted' where id = $1", [id.aquarium]));
    for (const who of MEMBERS) expect(await rows(actor[who](), "select id from public.aquariums where status = 'soft_deleted'"), who).toBe(1);
    expect(await state(actor.editor(), "update public.aquariums set status = 'active' where id = $1", [id.aquarium])).toBe("AQ004");
    expect(await affected(actor.owner(), "update public.aquariums set status = 'active' where id = $1", [id.aquarium])).toBe(1);
    expect(await lifecycle()).toMatchObject({ status: "active", deleted_at: null, purge_after: null });
  });

  it("aynı durumda kalırken zaman damgasına dokunmak reddedilir; öbür alanlar değişebilir", async () => {
    expect(await state(actor.owner(), "update public.aquariums set deleted_at = now() where id = $1", [id.aquarium])).toBe("42501");
    expect(await state(actor.service(), "update public.aquariums set deleted_at = now() where id = $1", [id.aquarium])).toBe("AQ002");
    await as(db, actor.owner(), (tx) => tx.query("update public.aquariums set status = 'soft_deleted' where id = $1", [id.aquarium]));
    expect(await state(actor.service(), "update public.aquariums set purge_after = now() where id = $1", [id.aquarium])).toBe("AQ002");
    expect(await affected(actor.owner(), "update public.aquariums set name = 'Arşiv' where id = $1", [id.aquarium])).toBe(1);
    expect((await lifecycle()).gap).toBe("30 days");
  });

  it("CHECK kısıtı ikinci savunma hattı: tetikleyiciler kapalıyken de tutarsız durum yazılamaz", async () => {
    await superuser("set session_replication_role = replica");
    expect(await sqlState(() => superuser("update public.aquariums set status = 'soft_deleted' where id = $1", [id.aquarium]))).toBe("23514");
    await superuser("set session_replication_role = origin");
  });
});

describe("akvaryum üyelikleri", () => {
  it("okuma: üyeler akvaryumun bütün üyelerini görür; ilgisiz görmez; anonim izin katmanında reddedilir", async () => {
    for (const who of MEMBERS) expect(await rows(actor[who](), "select user_id from public.aquarium_members"), who).toBe(3);
    expect(await rows(actor.stranger(), "select user_id from public.aquarium_members")).toBe(0);
    expect(await state(actor.anon(), "select user_id from public.aquarium_members")).toBe("42501");
  });

  it("ekleme yalnız sahibin; daveti yapan sunucuda atanır; ikinci sahip eklenemez", async () => {
    for (const who of ["editor", "viewer", "stranger", "anon"] as const) {
      expect(await state(actor[who](), "insert into public.aquarium_members (aquarium_id, user_id, role) values ($1, $2, 'viewer')", [id.aquarium, id.stranger]), who).toBe("42501");
    }
    expect(await state(actor.owner(), "insert into public.aquarium_members (aquarium_id, user_id, role) values ($1, $2, 'owner')", [id.aquarium, id.stranger])).toBe("42501");
    expect(await state(actor.owner(), "insert into public.aquarium_members (aquarium_id, user_id, role, invited_by) values ($1, $2, 'viewer', $3)", [id.aquarium, id.stranger, id.editor])).toBe("42501");
    expect(await affected(actor.owner(), "insert into public.aquarium_members (aquarium_id, user_id, role) values ($1, $2, 'viewer')", [id.aquarium, id.stranger])).toBe(1);
    expect((await superuser("select invited_by from public.aquarium_members where user_id = $1", [id.stranger])).rows).toEqual([{ invited_by: id.owner }]);
  });

  it("değiştirme: yalnız sahip, sahip olmayan üyenin rolünü; sahip satırı ve sahipliğe yükseltme reddedilir", async () => {
    for (const who of ["editor", "viewer", "stranger"] as const) {
      expect(await affected(actor[who](), "update public.aquarium_members set role = 'editor' where aquarium_id = $1 and user_id = $2", [id.aquarium, id.viewer]), who).toBe(0);
    }
    expect(await state(actor.anon(), "update public.aquarium_members set role = 'editor'")).toBe("42501");
    expect(await affected(actor.owner(), "update public.aquarium_members set role = 'editor' where aquarium_id = $1 and user_id = $2", [id.aquarium, id.viewer])).toBe(1);
    expect(await affected(actor.owner(), "update public.aquarium_members set role = 'viewer' where aquarium_id = $1 and user_id = $2", [id.aquarium, id.owner])).toBe(0);
    // Sahipliğe yükseltmeyi önce tetikleyici reddeder (BEFORE tetikleyicisi RLS'nin `with check` denetiminden önce çalışır).
    expect(await state(actor.owner(), "update public.aquarium_members set role = 'owner' where aquarium_id = $1 and user_id = $2", [id.aquarium, id.editor])).toBe("AQ005");
    expect(await state(actor.service(), "update public.aquarium_members set role = 'viewer' where aquarium_id = $1 and user_id = $2", [id.aquarium, id.owner])).toBe("AQ005");
    expect(await state(actor.service(), "update public.aquarium_members set role = 'owner' where aquarium_id = $1 and user_id = $2", [id.aquarium, id.editor])).toBe("AQ005");
  });

  it("silme izni kimsede yok; sahip satırı akvaryum dururken servis rolüyle de silinemez, akvaryumla birlikte gider", async () => {
    for (const who of [...SIGNED_IN, "anon"] as const) expect(await state(actor[who](), "delete from public.aquarium_members where user_id = $1", [id.viewer]), who).toBe("42501");
    expect(await state(actor.service(), "delete from public.aquarium_members where aquarium_id = $1 and user_id = $2", [id.aquarium, id.owner])).toBe("AQ005");
    for (const table of ["aquarium_members", "aquariums", "profiles"]) expect(await state(actor.service(), `truncate public.${table} cascade`), `truncate ${table}`).toBe("42501");
    expect(await state(actor.service(), "delete from public.aquariums where id = $1", [id.aquarium])).toBe("ok");
    expect((await superuser("select count(*)::int as n from public.aquarium_members")).rows).toEqual([{ n: 0 }]);
  });

  it("değişmez alanlar: akvaryum, kullanıcı ve katılma zamanı", async () => {
    expect(await state(actor.owner(), "update public.aquarium_members set user_id = $1 where user_id = $2", [id.stranger, id.viewer])).toBe("42501");
    expect(await state(actor.owner(), "update public.aquarium_members set aquarium_id = gen_random_uuid() where user_id = $1", [id.viewer])).toBe("42501");
    expect(await state(actor.service(), "update public.aquarium_members set user_id = $1 where user_id = $2", [id.stranger, id.viewer])).toBe("AQ001");
    expect(await state(actor.service(), "update public.aquarium_members set joined_at = now() where user_id = $1", [id.viewer])).toBe("AQ001");
  });

  it("her akvaryumun tam bir sahip üyeliği var ve akvaryumun sahibini gösterir", async () => {
    for (const who of SIGNED_IN) {
      await as(db, actor[who](), (tx) => tx.query("insert into public.aquariums (owner_id, name, type, net_volume_l) values ($1, 'Ek', 'brackish', 40)", [id[who]]));
    }
    const broken = await superuser(`
      select a.id from public.aquariums a
      where (select count(*) from public.aquarium_members m where m.aquarium_id = a.id and m.role = 'owner') <> 1
         or not exists (select 1 from public.aquarium_members m where m.aquarium_id = a.id and m.role = 'owner' and m.user_id = a.owner_id)`);
    expect(broken.rows).toEqual([]);
    expect((await superuser("select count(*)::int as n from public.aquariums")).rows).toEqual([{ n: 5 }]);
  });
});

describe("akvaryumlar arası sınır", () => {
  // İlgisiz kullanıcının da kendi akvaryumu var; üyelik ya da sahiplik bir akvaryumdan öbürüne taşmamalı (yardımcılardaki akvaryum filtresi).
  let other = "";
  beforeEach(async () => {
    other = await as(db, actor.stranger(), async (tx) =>
      (await tx.query<{ id: string }>("insert into public.aquariums (owner_id, name, type, net_volume_l) values ($1, 'Başka', 'freshwater', 80) returning id", [id.stranger])).rows[0].id);
  });

  it("her kullanıcı yalnız kendi akvaryumlarını ve onların üyeliklerini görür", async () => {
    expect(await as(db, actor.stranger(), async (tx) => (await tx.query<{ id: string }>("select id from public.aquariums")).rows.map((r) => r.id))).toEqual([other]);
    expect(await rows(actor.stranger(), "select user_id from public.aquarium_members where aquarium_id = $1", [id.aquarium])).toBe(0);
    for (const who of MEMBERS) {
      expect(await rows(actor[who](), "select id from public.aquariums where id = $1", [other]), who).toBe(0);
      expect(await rows(actor[who](), "select user_id from public.aquarium_members where aquarium_id = $1", [other]), who).toBe(0);
    }
  });

  it("kendi akvaryumunun sahibi başkasının akvaryumuna üye ekleyemez, rol değiştiremez, akvaryumu değiştiremez", async () => {
    expect(await state(actor.stranger(), "insert into public.aquarium_members (aquarium_id, user_id, role) values ($1, $2, 'editor')", [id.aquarium, id.stranger])).toBe("42501");
    expect(await affected(actor.stranger(), "update public.aquarium_members set role = 'editor' where aquarium_id = $1 and user_id = $2", [id.aquarium, id.viewer])).toBe(0);
    expect(await affected(actor.stranger(), "update public.aquariums set name = 'Ele geçirildi' where id = $1", [id.aquarium])).toBe(0);
    expect(await state(actor.owner(), "insert into public.aquarium_members (aquarium_id, user_id, role) values ($1, $2, 'editor')", [other, id.owner])).toBe("42501");
    expect(await state(actor.editor(), "insert into public.aquarium_members (aquarium_id, user_id, role) values ($1, $2, 'viewer')", [other, id.editor])).toBe("42501");
    expect(await affected(actor.owner(), "update public.aquariums set status = 'soft_deleted' where id = $1", [other])).toBe(0);
    expect((await superuser("select count(*)::int as n from public.aquarium_members where aquarium_id = $1", [other])).rows).toEqual([{ n: 1 }]);
  });

  it("farklı akvaryumlarda farklı rolü olan kullanıcının yetkisi hedef akvaryumdaki rolüne göre", async () => {
    // A'nın sahibi B'de izleyici, A'nın editörü B'de izleyici; A'nın izleyicisi B'de editör.
    await as(db, actor.stranger(), (tx) => tx.query("insert into public.aquarium_members (aquarium_id, user_id, role) values ($1, $2, 'viewer'), ($1, $3, 'viewer'), ($1, $4, 'editor')", [other, id.owner, id.editor, id.viewer]));
    expect(await state(actor.owner(), "update public.aquariums set name = 'X' where id = $1", [other])).toBe("AQ003");
    expect(await state(actor.owner(), "update public.aquariums set status = 'soft_deleted' where id = $1", [other])).toBe("AQ003");
    expect(await state(actor.editor(), "update public.aquariums set name = 'X' where id = $1", [other])).toBe("AQ003");
    expect(await affected(actor.viewer(), "update public.aquariums set name = 'B editörü' where id = $1", [other])).toBe(1);
    expect(await state(actor.viewer(), "update public.aquariums set status = 'soft_deleted' where id = $1", [other])).toBe("AQ004");
    expect(await state(actor.viewer(), "update public.aquariums set name = 'X' where id = $1", [id.aquarium])).toBe("AQ003");
    expect(await affected(actor.owner(), "update public.aquariums set status = 'soft_deleted' where id = $1", [id.aquarium])).toBe(1);
    expect((await superuser("select status from public.aquariums where id = $1", [other])).rows).toEqual([{ status: "active" }]);
  });
});

describe("kullanıcı silme koruması", () => {
  it("akvaryumu ya da üyeliği olan kullanıcı silinemez; kayıtları yerinde kalır; verisi olmayan kullanıcı profiliyle silinir", async () => {
    expect(await sqlState(() => superuser("delete from auth.users where id = $1", [id.owner]))).toBe("23001");
    expect(await sqlState(() => superuser("delete from auth.users where id = $1", [id.viewer]))).toBe("23001");
    expect((await superuser("select count(*)::int as n from public.aquarium_members where aquarium_id = $1", [id.aquarium])).rows).toEqual([{ n: 3 }]);
    expect(await sqlState(() => superuser("delete from auth.users where id = $1", [id.stranger]))).toBe("ok");
    expect((await superuser("select count(*)::int as n from public.profiles where user_id = $1", [id.stranger])).rows).toEqual([{ n: 0 }]);
  });
});
