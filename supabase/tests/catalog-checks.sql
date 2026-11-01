-- Katalog ve izin denetimleri (karar 0032, 3. madde; karar 0034). Aynı dosya iki yerde çalışır:
--   - yerelde, migration'ları uygulanmış PGlite veritabanında (`schema.test.ts`);
--   - hazırlık projesinde, gönderme iş akışının doğrulama adımında (`psql`, `.github/workflows/staging-db.yml`).
-- Beklenmeyen bir durumda hata verir ve ne beklendiğini yazar; her şey yerindeyse yalnız bilgi notları yazar. Veri okumaz, yazmaz.
do $$
declare
  tables constant text[] := array['aquarium_members', 'aquariums', 'profiles'];
  t text;
  p text;
  c text;
  got text[];
  expected text[];
  fn record;
  failures text[] := '{}';
begin
  raise notice 'Postgres: %', version();

  -- Tablolar ve RLS
  select coalesce(array_agg(tablename::text order by tablename), '{}') into got from pg_tables where schemaname = 'public';
  if got <> tables then failures := failures || format('public tabloları %s, beklenen %s', got, tables); end if;
  foreach t in array tables loop
    if not exists (select 1 from pg_class k join pg_namespace n on n.oid = k.relnamespace where n.nspname = 'public' and k.relname = t and k.relrowsecurity) then
      failures := failures || format('%s: RLS kapalı', t);
    end if;
  end loop;

  -- Politikalar: adı, işlemi ve yalnız authenticated rolü
  select coalesce(array_agg(format('%s.%s:%s:%s', tablename, policyname, cmd, array_to_string(roles, ',')) order by tablename, policyname), '{}') into got
  from pg_policies where schemaname = 'public';
  expected := array[
    'aquarium_members.aquarium_members_insert_owner:INSERT:authenticated',
    'aquarium_members.aquarium_members_select_member:SELECT:authenticated',
    'aquarium_members.aquarium_members_update_owner:UPDATE:authenticated',
    'aquariums.aquariums_insert_self:INSERT:authenticated',
    'aquariums.aquariums_select_member:SELECT:authenticated',
    'aquariums.aquariums_update_member:UPDATE:authenticated',
    'profiles.profiles_select_own:SELECT:authenticated',
    'profiles.profiles_update_own:UPDATE:authenticated'
  ];
  if got <> expected then failures := failures || format('politikalar %s, beklenen %s', got, expected); end if;

  -- Tablo düzeyi izinler
  foreach t in array tables loop
    foreach p in array array['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER'] loop
      if has_table_privilege('anon', 'public.' || t, p) then failures := failures || format('anon %s %s', t, p); end if;
      if has_table_privilege('authenticated', 'public.' || t, p) <> (p = 'SELECT') then failures := failures || format('authenticated tablo %s %s', t, p); end if;
      if p in ('SELECT', 'INSERT', 'UPDATE', 'DELETE') and not has_table_privilege('service_role', 'public.' || t, p) then failures := failures || format('service_role %s %s yok', t, p); end if;
      if p in ('TRUNCATE', 'TRIGGER') and has_table_privilege('service_role', 'public.' || t, p) then failures := failures || format('service_role %s %s var', t, p); end if;
    end loop;
    foreach p in array array['SELECT', 'INSERT', 'UPDATE', 'REFERENCES'] loop
      if has_any_column_privilege('anon', 'public.' || t, p) then failures := failures || format('anon sütun %s %s', t, p); end if;
    end loop;
  end loop;
  if exists (select 1 from information_schema.role_table_grants where table_schema = 'public' and grantee = 'PUBLIC') then failures := failures || 'PUBLIC tablo izni'::text; end if;
  if exists (select 1 from information_schema.column_privileges where table_schema = 'public' and grantee = 'PUBLIC') then failures := failures || 'PUBLIC sütun izni'::text; end if;

  -- authenticated: ekleme ve değiştirme yalnız listelenen sütunlarda
  foreach t in array tables loop
    foreach p in array array['INSERT', 'UPDATE'] loop
      select coalesce(array_agg(column_name::text order by column_name), '{}') into got
      from information_schema.columns where table_schema = 'public' and table_name = t and has_column_privilege('authenticated', 'public.' || t, column_name, p);
      expected := case t || ':' || p
        when 'profiles:INSERT' then '{}'::text[]
        when 'profiles:UPDATE' then array['display_name', 'locale', 'nickname']
        when 'aquariums:INSERT' then array['description', 'height_cm', 'length_cm', 'name', 'net_volume_l', 'owner_id', 'setup_date', 'type', 'width_cm']
        when 'aquariums:UPDATE' then array['description', 'height_cm', 'length_cm', 'name', 'net_volume_l', 'setup_date', 'status', 'type', 'width_cm']
        when 'aquarium_members:INSERT' then array['aquarium_id', 'role', 'user_id']
        when 'aquarium_members:UPDATE' then array['role']
      end;
      if got <> expected then failures := failures || format('authenticated %s %s sütunları %s, beklenen %s', t, p, got, expected); end if;
    end loop;
  end loop;

  -- Fonksiyonlar: PUBLIC çalıştıramaz; anon hiçbirini, authenticated yalnız iki yardımcıyı; security definer listesi; sabit search_path
  select coalesce(array_agg(k.proname::text order by k.proname), '{}') into got from pg_proc k join pg_namespace n on n.oid = k.pronamespace where n.nspname = 'public';
  expected := array['add_owner_membership', 'guard_aquarium_write', 'guard_membership_write', 'guard_profile_update', 'handle_new_user', 'is_aquarium_member', 'is_aquarium_owner', 'set_updated_at'];
  if got <> expected then failures := failures || format('public fonksiyonları %s, beklenen %s', got, expected); end if;
  for fn in select k.oid::regprocedure::text as signature, k.proname::text as name, k.prosecdef as secdef, k.proacl, k.proconfig
            from pg_proc k join pg_namespace n on n.oid = k.pronamespace where n.nspname = 'public' loop
    if fn.proacl is null then failures := failures || format('%s: izin listesi boş (PUBLIC çalıştırabilir)', fn.name); end if;
    if exists (select 1 from aclexplode(fn.proacl) a where a.grantee = 0 and a.privilege_type = 'EXECUTE') then failures := failures || format('%s: PUBLIC EXECUTE', fn.name); end if;
    if has_function_privilege('anon', fn.signature, 'EXECUTE') then failures := failures || format('%s: anon EXECUTE', fn.name); end if;
    if has_function_privilege('authenticated', fn.signature, 'EXECUTE') <> (fn.name in ('is_aquarium_member', 'is_aquarium_owner')) then failures := failures || format('%s: authenticated EXECUTE beklenmedik', fn.name); end if;
    if fn.secdef <> (fn.name in ('add_owner_membership', 'handle_new_user', 'is_aquarium_member', 'is_aquarium_owner')) then failures := failures || format('%s: security definer beklenmedik', fn.name); end if;
    if fn.proconfig is distinct from array['search_path=""'] then failures := failures || format('%s: search_path %s', fn.name, fn.proconfig); end if;
  end loop;

  -- Kayıt tetikleyicisi auth.users üzerinde
  if not exists (select 1 from pg_trigger where tgrelid = 'auth.users'::regclass and tgname = 'on_auth_user_created' and not tgisinternal) then
    failures := failures || 'auth.users üzerinde on_auth_user_created tetikleyicisi yok'::text;
  end if;

  if array_length(failures, 1) > 0 then
    raise exception 'Katalog ve izin denetimi başarısız (% sorun): %', array_length(failures, 1), array_to_string(failures, ' | ') using errcode = 'AQ900';
  end if;
  raise notice 'Katalog ve izin denetimi geçti.';
end $$;
