import { randomBytes, randomUUID } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

// Hazırlık projesinde gerçek istemciyle yetki senaryoları (karar 0032, 3. madde; karar 0034). Yalnız `.github/workflows/staging-db.yml`
// çalıştırır (`pnpm test:staging`); `pnpm verify`'a girmez. Dört test kullanıcısı (sahip, editör, izleyici, ilgisiz) yönetici istemcisiyle
// e-postası onaylı oluşturulur, yayınlanabilir anahtarla giriş yapar; senaryolardan sonra akvaryumları ve kendileri silinir.
// Anahtarlar, parolalar ve erişim jetonları hiçbir yere yazdırılmaz. Beklenen sonuçlar yerel testlerle aynıdır (`supabase/tests`).

const env = (name: string) => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} tanımlı değil (yalnız hazırlık iş akışında çalışır)`);
  return value;
};
const projectId = env("STAGING_PROJECT_ID");
if (!/^[a-z0-9]+$/.test(projectId)) throw new Error("STAGING_PROJECT_ID beklenen biçimde değil");
const url = `https://${projectId}.supabase.co`;
const publishableKey = env("STAGING_PUBLISHABLE_KEY");
const secretKey = env("STAGING_SECRET_KEY");
const options = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } };

type Role = "owner" | "editor" | "viewer" | "stranger";
const ROLES: Role[] = ["owner", "editor", "viewer", "stranger"];
const run = randomUUID().slice(0, 8);
const admin = createClient(url, secretKey, options);
const anon = createClient(url, publishableKey, options);
const users = {} as Record<Role, { id: string; client: SupabaseClient; accessToken: string }>;
/** Oluşturulan her test kullanıcısı, giriş başarılı olsun olmasın, temizlik için hemen buraya yazılır. */
const registered: string[] = [];
let aquarium = "";

/** Supabase hatasının SQLSTATE kodu; hata yoksa "ok". */
const code = (result: { error: { code?: string } | null }) => (result.error ? (result.error.code ?? "?") : "ok");

beforeAll(async () => {
  for (const role of ROLES) {
    const email = `aquamind-staging-${run}-${role}@example.com`;
    const password = randomBytes(24).toString("base64url");
    const created = await admin.auth.admin.createUser({ email, password, email_confirm: true });
    if (created.error || !created.data.user) throw new Error(`test kullanıcısı oluşturulamadı (${role}): ${created.error?.code ?? created.error?.status ?? "?"}`);
    registered.push(created.data.user.id);
    const client = createClient(url, publishableKey, options);
    const signedIn = await client.auth.signInWithPassword({ email, password });
    if (signedIn.error || !signedIn.data.session) throw new Error(`giriş yapılamadı (${role}): ${signedIn.error?.code ?? signedIn.error?.status ?? "?"}`);
    users[role] = { id: created.data.user.id, client, accessToken: signedIn.data.session.access_token };
  }
  const inserted = await users.owner.client.from("aquariums").insert({ owner_id: users.owner.id, name: "Hazırlık", type: "freshwater", net_volume_l: 100 }).select("id").single();
  if (inserted.error) throw new Error(`sahip akvaryum ekleyemedi: ${inserted.error.code} ${inserted.error.message}`);
  aquarium = inserted.data.id;
  const members = await users.owner.client.from("aquarium_members").insert([
    { aquarium_id: aquarium, user_id: users.editor.id, role: "editor" },
    { aquarium_id: aquarium, user_id: users.viewer.id, role: "viewer" },
  ]);
  if (members.error) throw new Error(`sahip üye ekleyemedi: ${members.error.code} ${members.error.message}`);
}, 120_000);

// Temizlik: her adım denenir, her sonuç denetlenir; geride veri kalırsa çalışma başarısız olur. Hata metinleri yalnız kod taşır.
afterAll(async () => {
  if (!registered.length) return;
  const problems: string[] = [];
  const attempt = async (label: string, call: () => PromiseLike<{ error: { code?: string; status?: number } | null }>) => {
    try {
      const result = await call();
      if (result.error) problems.push(`${label} (${result.error.code ?? result.error.status ?? "?"})`);
    } catch (error) {
      problems.push(`${label} (${(error as Error).name})`);
    }
  };
  await attempt("akvaryumlar silinemedi", () => admin.from("aquariums").delete().in("owner_id", registered));
  for (const id of registered) await attempt("kullanıcı silinemedi", () => admin.auth.admin.deleteUser(id));
  const leftAquariums = await admin.from("aquariums").select("id").in("owner_id", registered);
  const leftProfiles = await admin.from("profiles").select("user_id").in("user_id", registered);
  if (leftAquariums.error || leftAquariums.data.length) problems.push(`geride akvaryum kaldı (${leftAquariums.data?.length ?? "?"})`);
  if (leftProfiles.error || leftProfiles.data.length) problems.push(`geride kullanıcı kaldı (${leftProfiles.data?.length ?? "?"})`);
  if (problems.length) throw new Error(`Temizlik tamamlanmadı: ${problems.join(" | ")}`);
}, 120_000);

describe("kimlik", () => {
  it("giriş yapan kullanıcının jetonundaki rol authenticated, kimlik kendi kullanıcısı", () => {
    for (const role of ROLES) {
      const payload = JSON.parse(Buffer.from(users[role].accessToken.split(".")[1], "base64url").toString("utf8")) as { role?: string; sub?: string };
      expect(payload.role, role).toBe("authenticated");
      expect(payload.sub, role).toBe(users[role].id);
    }
  });

  it("kayıtta boş profil oluştu", async () => {
    const result = await admin.from("profiles").select("user_id, nickname").in("user_id", ROLES.map((role) => users[role].id));
    expect(result.error).toBeNull();
    expect(result.data?.length).toBe(4);
    expect(result.data?.every((row) => row.nickname === null)).toBe(true);
  });
});

describe("profiller", () => {
  it("herkes yalnız kendi profilini görür; anonim izin katmanında reddedilir", async () => {
    for (const role of ROLES) {
      const result = await users[role].client.from("profiles").select("user_id");
      expect(result.error, role).toBeNull();
      expect(result.data?.map((row) => row.user_id), role).toEqual([users[role].id]);
    }
    expect(code(await anon.from("profiles").select("user_id"))).toBe("42501");
  });

  it("kendi adını değiştirir; başkasınınki 0 satır; kimlik sütunu izin katmanında reddedilir", async () => {
    const own = await users.owner.client.from("profiles").update({ display_name: "Hazırlık sahibi" }).eq("user_id", users.owner.id).select("user_id");
    expect(own.error).toBeNull();
    expect(own.data?.length).toBe(1);
    const other = await users.stranger.client.from("profiles").update({ display_name: "Korsan" }).eq("user_id", users.owner.id).select("user_id");
    expect(other.error).toBeNull();
    expect(other.data).toEqual([]);
    expect(code(await users.owner.client.from("profiles").update({ user_id: users.stranger.id }).eq("user_id", users.owner.id))).toBe("42501");
    expect(code(await users.owner.client.from("profiles").insert({ user_id: users.owner.id }))).toBe("42501");
  });
});

describe("akvaryumlar", () => {
  it("okuma: üyeler görür, ilgisiz görmez, anonim izin katmanında reddedilir", async () => {
    for (const role of ["owner", "editor", "viewer"] as const) {
      const result = await users[role].client.from("aquariums").select("id").eq("id", aquarium);
      expect(result.data?.length, role).toBe(1);
    }
    expect((await users.stranger.client.from("aquariums").select("id").eq("id", aquarium)).data).toEqual([]);
    expect(code(await anon.from("aquariums").select("id"))).toBe("42501");
  });

  it("başkası adına ekleme RLS'de reddedilir; silme izni kimsede yok", async () => {
    expect(code(await users.editor.client.from("aquariums").insert({ owner_id: users.owner.id, name: "Sahte", type: "freshwater", net_volume_l: 60 }))).toBe("42501");
    expect(code(await anon.from("aquariums").insert({ owner_id: users.owner.id, name: "Sahte", type: "freshwater", net_volume_l: 60 }))).toBe("42501");
    for (const role of ROLES) expect(code(await users[role].client.from("aquariums").delete().eq("id", aquarium)), role).toBe("42501");
  });

  it("değiştirme: editör ayrıntı değiştirir; izleyici AQ003; ilgisiz 0 satır; sahip bile sahibi değiştiremez", async () => {
    const edited = await users.editor.client.from("aquariums").update({ name: "Editör" }).eq("id", aquarium).select("id");
    expect(edited.error).toBeNull();
    expect(edited.data?.length).toBe(1);
    expect(code(await users.viewer.client.from("aquariums").update({ name: "İzleyici" }).eq("id", aquarium))).toBe("AQ003");
    expect((await users.stranger.client.from("aquariums").update({ name: "İlgisiz" }).eq("id", aquarium).select("id")).data).toEqual([]);
    expect(code(await users.owner.client.from("aquariums").update({ owner_id: users.stranger.id }).eq("id", aquarium))).toBe("42501");
    expect(code(await users.owner.client.from("aquariums").update({ deleted_at: new Date().toISOString() }).eq("id", aquarium))).toBe("42501");
  });

  it("yaşam döngüsü: editör silemez (AQ004); sahip yumuşak siler, sunucu 30 gün yazar; sahip geri alır", async () => {
    expect(code(await users.editor.client.from("aquariums").update({ status: "soft_deleted" }).eq("id", aquarium))).toBe("AQ004");
    const deleted = await users.owner.client.from("aquariums").update({ status: "soft_deleted" }).eq("id", aquarium).select("status, deleted_at, purge_after").single();
    expect(deleted.error).toBeNull();
    expect(deleted.data?.status).toBe("soft_deleted");
    const gap = new Date(deleted.data!.purge_after as string).getTime() - new Date(deleted.data!.deleted_at as string).getTime();
    expect(gap).toBe(30 * 24 * 60 * 60 * 1000);
    expect((await users.viewer.client.from("aquariums").select("id").eq("id", aquarium)).data?.length).toBe(1);
    const restored = await users.owner.client.from("aquariums").update({ status: "active" }).eq("id", aquarium).select("status, deleted_at, purge_after").single();
    expect(restored.data).toEqual({ status: "active", deleted_at: null, purge_after: null });
  });

  it("sayısal kısıt: sıfır hacim reddedilir", async () => {
    expect(code(await users.owner.client.from("aquariums").update({ net_volume_l: 0 }).eq("id", aquarium))).toBe("23514");
  });
});

describe("akvaryum üyelikleri", () => {
  it("üyeler bütün üyelikleri görür; ilgisiz görmez; anonim izin katmanında reddedilir", async () => {
    for (const role of ["owner", "editor", "viewer"] as const) {
      expect((await users[role].client.from("aquarium_members").select("user_id").eq("aquarium_id", aquarium)).data?.length, role).toBe(3);
    }
    expect((await users.stranger.client.from("aquarium_members").select("user_id").eq("aquarium_id", aquarium)).data).toEqual([]);
    expect(code(await anon.from("aquarium_members").select("user_id"))).toBe("42501");
  });

  it("ekleme ve rol değiştirme yalnız sahibin; kimse kendini ekleyemez ya da sahip yapamaz; silme yok", async () => {
    expect(code(await users.stranger.client.from("aquarium_members").insert({ aquarium_id: aquarium, user_id: users.stranger.id, role: "editor" }))).toBe("42501");
    expect(code(await users.editor.client.from("aquarium_members").insert({ aquarium_id: aquarium, user_id: users.stranger.id, role: "viewer" }))).toBe("42501");
    expect((await users.editor.client.from("aquarium_members").update({ role: "editor" }).eq("aquarium_id", aquarium).eq("user_id", users.viewer.id).select("user_id")).data).toEqual([]);
    expect(code(await users.owner.client.from("aquarium_members").update({ role: "owner" }).eq("aquarium_id", aquarium).eq("user_id", users.editor.id))).toBe("AQ005");
    const promoted = await users.owner.client.from("aquarium_members").update({ role: "editor" }).eq("aquarium_id", aquarium).eq("user_id", users.viewer.id).select("role").single();
    expect(promoted.data).toEqual({ role: "editor" });
    // Sonraki senaryolar izleyiciyi A'da izleyici olarak kullanır: rol geri alınır.
    const demoted = await users.owner.client.from("aquarium_members").update({ role: "viewer" }).eq("aquarium_id", aquarium).eq("user_id", users.viewer.id).select("role").single();
    expect(demoted.data).toEqual({ role: "viewer" });
    for (const role of ROLES) expect(code(await users[role].client.from("aquarium_members").delete().eq("aquarium_id", aquarium)), role).toBe("42501");
  });
});

describe("akvaryumlar arası sınır", () => {
  // İlgisiz kullanıcının kendi akvaryumu olur; önce kimse öbürünü görmez, sonra farklı akvaryumlarda farklı rollerle yetki hedef
  // akvaryumdaki role göre değerlendirilir (yerel testlerle aynı senaryo).
  let other = "";
  beforeAll(async () => {
    const inserted = await users.stranger.client.from("aquariums").insert({ owner_id: users.stranger.id, name: "Başka", type: "freshwater", net_volume_l: 80 }).select("id").single();
    if (inserted.error) throw new Error(`ikinci akvaryum eklenemedi: ${inserted.error.code}`);
    other = inserted.data.id;
  });

  it("her kullanıcı yalnız kendi akvaryumlarını görür; başkasının akvaryumuna kendini ekleyemez", async () => {
    expect((await users.stranger.client.from("aquariums").select("id")).data?.map((row) => row.id)).toEqual([other]);
    for (const role of ["owner", "editor", "viewer"] as const) {
      expect((await users[role].client.from("aquariums").select("id").eq("id", other)).data, role).toEqual([]);
      expect((await users[role].client.from("aquarium_members").select("user_id").eq("aquarium_id", other)).data, role).toEqual([]);
    }
    expect(code(await users.owner.client.from("aquarium_members").insert({ aquarium_id: other, user_id: users.owner.id, role: "editor" }))).toBe("42501");
    expect((await users.owner.client.from("aquariums").update({ status: "soft_deleted" }).eq("id", other).select("id")).data).toEqual([]);
  });

  it("farklı akvaryumlarda farklı rolü olan kullanıcının yetkisi hedef akvaryumdaki rolüne göre", async () => {
    const added = await users.stranger.client.from("aquarium_members").insert([
      { aquarium_id: other, user_id: users.owner.id, role: "viewer" },
      { aquarium_id: other, user_id: users.editor.id, role: "viewer" },
      { aquarium_id: other, user_id: users.viewer.id, role: "editor" },
    ]);
    expect(added.error).toBeNull();
    expect(code(await users.owner.client.from("aquariums").update({ name: "X" }).eq("id", other))).toBe("AQ003");
    expect(code(await users.owner.client.from("aquariums").update({ status: "soft_deleted" }).eq("id", other))).toBe("AQ003");
    expect(code(await users.editor.client.from("aquariums").update({ name: "X" }).eq("id", other))).toBe("AQ003");
    expect((await users.viewer.client.from("aquariums").update({ name: "B editörü" }).eq("id", other).select("id")).data?.length).toBe(1);
    expect(code(await users.viewer.client.from("aquariums").update({ status: "soft_deleted" }).eq("id", other))).toBe("AQ004");
    expect(code(await users.viewer.client.from("aquariums").update({ name: "X" }).eq("id", aquarium))).toBe("AQ003");
  });
});
