-- Phase 1A (karar 0032, ayrıntılar karar 0033; kurallar Issue #7): profiller, akvaryumlar ve akvaryum üyelikleri.
-- Yalnız yerel test veritabanında doğrulandı; hazırlık projesindeki denetim (1B) geçmeden hiçbir projeye gönderilmez.
-- Geri alma: supabase/rollbacks/20261101160000_core_aquariums.sql.
-- Yetki iki katmandadır: tablo/sütun izinleri (GRANT/REVOKE) ve satır politikaları (RLS). İkisi ayrı denetlenir.
-- Hata kodları (testler mesaja değil koda bakar):
--   AQ001 değişmez alan değiştirilemez
--   AQ002 zaman damgası ya da durum istemciden yazılamaz / geçersiz durum geçişi
--   AQ003 izleyici akvaryumu değiştiremez
--   AQ004 durum geçişi yalnız sahibin
--   AQ005 sahip üyeliği değiştirilemez

-- Tablolar ---------------------------------------------------------------------------------------------------------

create table public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  nickname text check (nickname is null or char_length(nickname) between 1 and 100),
  display_name text check (display_name is null or char_length(display_name) between 1 and 100),
  locale text check (locale is null or locale in ('tr', 'en', 'es')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index profiles_nickname_key on public.profiles (lower(nickname)) where nickname is not null;

create table public.aquariums (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete restrict,
  name text not null check (char_length(btrim(name)) between 1 and 100),
  type text not null check (type in ('freshwater', 'saltwater', 'brackish')),
  length_cm numeric check (length_cm > 0),
  width_cm numeric check (width_cm > 0),
  height_cm numeric check (height_cm > 0),
  net_volume_l numeric not null check (net_volume_l > 0),
  setup_date date,
  description text check (description is null or char_length(description) <= 2000),
  status text not null default 'active' check (status in ('active', 'soft_deleted')),
  deleted_at timestamptz,
  purge_after timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint aquariums_lifecycle check (
    (status = 'active' and deleted_at is null and purge_after is null)
    or (status = 'soft_deleted' and deleted_at is not null and purge_after is not null)
  )
);
create index aquariums_owner_id_idx on public.aquariums (owner_id);

create table public.aquarium_members (
  aquarium_id uuid not null references public.aquariums (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete restrict,
  role text not null check (role in ('owner', 'editor', 'viewer')),
  invited_by uuid references auth.users (id) on delete set null,
  joined_at timestamptz not null default now(),
  primary key (aquarium_id, user_id)
);
create unique index aquarium_members_one_owner on public.aquarium_members (aquarium_id) where role = 'owner';
create index aquarium_members_user_id_idx on public.aquarium_members (user_id);

-- Kullanıcının çağırdığı yardımcılar (politikalar kullanır) -------------------------------------------------------

create function public.is_aquarium_member(target uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.aquarium_members m where m.aquarium_id = target and m.user_id = auth.uid())
$$;

create function public.is_aquarium_owner(target uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.aquariums a where a.id = target and a.owner_id = auth.uid())
$$;

-- Tetikleyici yardımcıları ---------------------------------------------------------------------------------------

-- Yeni kullanıcıya boş profil (takma ad NULL başlar; kayıt sırasında çakışma olmaz).
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (user_id) values (new.id);
  return new;
end $$;

-- Akvaryum eklenince aynı işlemde sahip üyeliği.
create function public.add_owner_membership() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.aquarium_members (aquarium_id, user_id, role, invited_by) values (new.id, new.owner_id, 'owner', null);
  return new;
end $$;

create function public.set_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;

create function public.guard_profile_update() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.user_id is distinct from old.user_id or new.created_at is distinct from old.created_at then
    raise exception 'profiles.user_id ve created_at değiştirilemez' using errcode = 'AQ001';
  end if;
  return new;
end $$;

-- Yaşam döngüsü: istemci zaman damgası yazamaz; durum geçişini yalnız sahip yapar, zaman damgalarını sunucu atar.
create function public.guard_aquarium_write() returns trigger
language plpgsql set search_path = '' as $$
declare
  caller_role text;
begin
  if tg_op = 'INSERT' then
    if new.status <> 'active' or new.deleted_at is not null or new.purge_after is not null then
      raise exception 'yeni akvaryum etkin başlar; zaman damgası yazılamaz' using errcode = 'AQ002';
    end if;
    return new;
  end if;

  if new.id is distinct from old.id or new.owner_id is distinct from old.owner_id or new.created_at is distinct from old.created_at then
    raise exception 'akvaryumun kimliği, sahibi ve oluşturulma zamanı değiştirilemez' using errcode = 'AQ001';
  end if;
  if new.deleted_at is distinct from old.deleted_at or new.purge_after is distinct from old.purge_after then
    raise exception 'zaman damgaları istemciden yazılamaz' using errcode = 'AQ002';
  end if;

  if current_user = 'authenticated' then
    select m.role into caller_role from public.aquarium_members m where m.aquarium_id = old.id and m.user_id = auth.uid();
    if caller_role is null or caller_role = 'viewer' then
      raise exception 'izleyici akvaryumu değiştiremez' using errcode = 'AQ003';
    end if;
    if new.status is distinct from old.status and caller_role <> 'owner' then
      raise exception 'durum geçişini yalnız sahip yapar' using errcode = 'AQ004';
    end if;
  end if;

  if old.status = 'active' and new.status = 'soft_deleted' then
    new.deleted_at := now();
    new.purge_after := now() + interval '30 days';
  elsif old.status = 'soft_deleted' and new.status = 'active' then
    new.deleted_at := null;
    new.purge_after := null;
  elsif new.status is distinct from old.status then
    raise exception 'geçersiz durum geçişi' using errcode = 'AQ002';
  end if;
  return new;
end $$;

-- Üyelik: kimlik sütunları değişmez, sahip satırına dokunulmaz, daveti yapan sunucuda atanır. Sahip satırı yalnız akvaryumla
-- birlikte (zincirleme silmede) gider; akvaryum dururken silinemez.
create function public.guard_membership_write() returns trigger
language plpgsql set search_path = '' as $$
begin
  if tg_op = 'DELETE' then
    if old.role = 'owner' and exists (select 1 from public.aquariums a where a.id = old.aquarium_id) then
      raise exception 'sahip üyeliği silinemez' using errcode = 'AQ005';
    end if;
    return old;
  end if;
  if tg_op = 'INSERT' then
    if current_user = 'authenticated' then
      new.invited_by := auth.uid();
    end if;
    return new;
  end if;
  if new.aquarium_id is distinct from old.aquarium_id or new.user_id is distinct from old.user_id or new.joined_at is distinct from old.joined_at then
    raise exception 'üyeliğin akvaryumu, kullanıcısı ve katılma zamanı değiştirilemez' using errcode = 'AQ001';
  end if;
  if old.role = 'owner' or new.role = 'owner' then
    raise exception 'sahip üyeliği değiştirilemez' using errcode = 'AQ005';
  end if;
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
create trigger aquariums_add_owner_membership after insert on public.aquariums for each row execute function public.add_owner_membership();
create trigger aquariums_guard_write before insert or update on public.aquariums for each row execute function public.guard_aquarium_write();
create trigger aquariums_set_updated_at before update on public.aquariums for each row execute function public.set_updated_at();
create trigger profiles_guard_update before update on public.profiles for each row execute function public.guard_profile_update();
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger aquarium_members_guard_write before insert or update or delete on public.aquarium_members for each row execute function public.guard_membership_write();

-- İzinler: önce her şey geri alınır, sonra yalnız gereken açılır ----------------------------------------------------

revoke all on table public.profiles, public.aquariums, public.aquarium_members from public, anon, authenticated;
grant select on table public.profiles to authenticated;
grant update (nickname, display_name, locale) on table public.profiles to authenticated;
grant select on table public.aquariums to authenticated;
grant insert (owner_id, name, type, length_cm, width_cm, height_cm, net_volume_l, setup_date, description) on table public.aquariums to authenticated;
grant update (name, type, length_cm, width_cm, height_cm, net_volume_l, setup_date, description, status) on table public.aquariums to authenticated;
grant select on table public.aquarium_members to authenticated;
grant insert (aquarium_id, user_id, role) on table public.aquarium_members to authenticated;
grant update (role) on table public.aquarium_members to authenticated;
-- Sunucu rolünde de kapalı: TRUNCATE satır tetikleyicilerini çalıştırmaz (sahip satırı koruması atlanır) ve tarihsel veriyi toptan
-- siler; TRIGGER izniyle koruyucu tetikleyiciler değiştirilebilir. Sunucu rolü yalnız satır işlemleri yapar.
revoke truncate, trigger on table public.profiles, public.aquariums, public.aquarium_members from service_role;

revoke all on function public.is_aquarium_member(uuid), public.is_aquarium_owner(uuid) from public, anon;
grant execute on function public.is_aquarium_member(uuid), public.is_aquarium_owner(uuid) to authenticated;
revoke all on function public.handle_new_user(), public.add_owner_membership(), public.set_updated_at(), public.guard_profile_update(),
  public.guard_aquarium_write(), public.guard_membership_write() from public, anon, authenticated;

-- Satır politikaları ------------------------------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.aquariums enable row level security;
alter table public.aquarium_members enable row level security;

create policy profiles_select_own on public.profiles for select to authenticated using (user_id = auth.uid());
create policy profiles_update_own on public.profiles for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Sahip koşulu ayrıca yazılır: `insert ... returning` yeni satırı okuma politikasına da sokar, sahip üyeliği ise sonraki tetikleyicide oluşur.
create policy aquariums_select_member on public.aquariums for select to authenticated using (owner_id = auth.uid() or public.is_aquarium_member(id));
create policy aquariums_insert_self on public.aquariums for insert to authenticated with check (owner_id = auth.uid());
create policy aquariums_update_member on public.aquariums for update to authenticated using (public.is_aquarium_member(id)) with check (public.is_aquarium_member(id));

create policy aquarium_members_select_member on public.aquarium_members for select to authenticated using (public.is_aquarium_member(aquarium_id));
create policy aquarium_members_insert_owner on public.aquarium_members for insert to authenticated with check (public.is_aquarium_owner(aquarium_id) and role <> 'owner');
create policy aquarium_members_update_owner on public.aquarium_members for update to authenticated using (public.is_aquarium_owner(aquarium_id) and role <> 'owner') with check (public.is_aquarium_owner(aquarium_id) and role <> 'owner');
