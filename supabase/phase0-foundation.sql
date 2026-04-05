-- Phase 0: Foundation Tables — run FIRST before any other migration
-- Creates profiles, builds, and loadouts tables that all other phases depend on.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Profiles ───────────────────────────────────────────────────────────────
-- Linked to Supabase Auth via auth.users(id)

create table if not exists profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  username      text not null unique,
  avatar_url    text,
  is_premium    boolean default false,
  role          text default 'user' check (role in ('user', 'moderator', 'admin')),
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- NOTE: Profile creation is handled by a database trigger (see fix-profile-creation-trigger.sql).
-- The username is passed via user metadata during signUp and the trigger creates the profile row.

-- ─── Builds ─────────────────────────────────────────────────────────────────

create table if not exists builds (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references profiles(id) on delete cascade,
  name              text not null,
  description       text,
  item_unique_name  text not null,
  item_category     text not null check (item_category in (
                      'Warframe', 'Primary', 'Secondary', 'Melee',
                      'Archwing', 'Archgun', 'Archmelee', 'Companion',
                      'CompanionWeapon', 'Necramech', 'Parazon', 'KDrive'
                    )),
  config            jsonb not null,
  is_public         boolean default false,
  vote_score        integer default 0,
  view_count        integer default 0,
  game_version      text,
  tags              text[] default '{}',
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

create index if not exists builds_user_id_idx on builds(user_id);
create index if not exists builds_item_category_idx on builds(item_category);
create index if not exists builds_public_idx on builds(is_public) where is_public = true;

-- ─── Loadouts ───────────────────────────────────────────────────────────────

create table if not exists loadouts (
  id                        uuid primary key default gen_random_uuid(),
  user_id                   uuid not null references profiles(id) on delete cascade,
  name                      text not null,
  description               text,
  warframe_build_id         uuid references builds(id) on delete set null,
  primary_build_id          uuid references builds(id) on delete set null,
  secondary_build_id        uuid references builds(id) on delete set null,
  melee_build_id            uuid references builds(id) on delete set null,
  exalted_build_id          uuid references builds(id) on delete set null,
  is_public                 boolean default false,
  vote_score                integer default 0,
  game_version              text,
  created_at                timestamptz default now(),
  updated_at                timestamptz default now()
);

create index if not exists loadouts_user_id_idx on loadouts(user_id);

-- ─── Basic RLS for builds and loadouts ──────────────────────────────────────
-- (Phase 3 will add more specific policies; these are the minimum for the app to work)

alter table builds enable row level security;
alter table loadouts enable row level security;
alter table profiles enable row level security;

-- Profiles: public read, owner update
create policy "profiles_select_all"
  on profiles for select
  using (true);

create policy "profiles_insert_own"
  on profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Builds: public read, owner CRUD
create policy "builds_select_public"
  on builds for select
  using (is_public = true or auth.uid() = user_id);

create policy "builds_insert_own"
  on builds for insert
  with check (auth.uid() = user_id);

create policy "builds_update_own"
  on builds for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "builds_delete_own"
  on builds for delete
  using (auth.uid() = user_id);

-- Loadouts: public read, owner CRUD
create policy "loadouts_select_public"
  on loadouts for select
  using (is_public = true or auth.uid() = user_id);

create policy "loadouts_insert_own"
  on loadouts for insert
  with check (auth.uid() = user_id);

create policy "loadouts_update_own"
  on loadouts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "loadouts_delete_own"
  on loadouts for delete
  using (auth.uid() = user_id);
