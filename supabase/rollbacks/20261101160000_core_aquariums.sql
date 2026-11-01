-- 20261101160000_core_aquariums geri alma: migration'ın oluşturduğu her şey kaldırılır (politikalar, tetikleyiciler ve dizinler
-- tablolarla birlikte gider). Veri silinir; yalnız yerel test veritabanında ya da veri olmayan hazırlık projesinde kullanılır.
drop trigger if exists on_auth_user_created on auth.users;
drop table if exists public.aquarium_members;
drop table if exists public.aquariums;
drop table if exists public.profiles;
drop function if exists public.is_aquarium_member(uuid);
drop function if exists public.is_aquarium_owner(uuid);
drop function if exists public.handle_new_user();
drop function if exists public.add_owner_membership();
drop function if exists public.set_updated_at();
drop function if exists public.guard_profile_update();
drop function if exists public.guard_aquarium_write();
drop function if exists public.guard_membership_write();
