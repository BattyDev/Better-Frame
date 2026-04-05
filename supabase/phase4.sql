-- Phase 4: Remaining Equipment — run this in your Supabase SQL editor
-- Adds Phase 4 loadout slots: Archwing suite, Companions, Necramech, Parazon
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Extend loadouts table with Phase 4 build slots ──────────────────────────

alter table loadouts
  add column if not exists archwing_build_id         uuid references builds(id) on delete set null,
  add column if not exists archgun_build_id           uuid references builds(id) on delete set null,
  add column if not exists archmelee_build_id         uuid references builds(id) on delete set null,
  add column if not exists companion_build_id         uuid references builds(id) on delete set null,
  add column if not exists companion_weapon_build_id  uuid references builds(id) on delete set null,
  add column if not exists necramech_build_id         uuid references builds(id) on delete set null,
  add column if not exists parazon_build_id           uuid references builds(id) on delete set null;

-- ─── Indexes for fast joins on new FK columns ────────────────────────────────

create index if not exists loadouts_archwing_build_idx        on loadouts(archwing_build_id)        where archwing_build_id is not null;
create index if not exists loadouts_archgun_build_idx         on loadouts(archgun_build_id)         where archgun_build_id is not null;
create index if not exists loadouts_archmelee_build_idx       on loadouts(archmelee_build_id)       where archmelee_build_id is not null;
create index if not exists loadouts_companion_build_idx       on loadouts(companion_build_id)       where companion_build_id is not null;
create index if not exists loadouts_companion_weapon_build_idx on loadouts(companion_weapon_build_id) where companion_weapon_build_id is not null;
create index if not exists loadouts_necramech_build_idx       on loadouts(necramech_build_id)       where necramech_build_id is not null;
create index if not exists loadouts_parazon_build_idx         on loadouts(parazon_build_id)         where parazon_build_id is not null;

-- ─── RLS: allow loadouts to be read publicly (if is_public = true) ───────────
-- (Only add if this was not already created in a prior migration)

do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'loadouts' and policyname = 'loadouts_select_public'
  ) then
    alter table loadouts enable row level security;

    create policy "loadouts_select_public"
      on loadouts for select
      using (is_public = true or auth.uid() = user_id);

    create policy "loadouts_insert_own"
      on loadouts for insert
      with check (auth.uid() = user_id);

    create policy "loadouts_update_own"
      on loadouts for update
      using (auth.uid() = user_id);

    create policy "loadouts_delete_own"
      on loadouts for delete
      using (auth.uid() = user_id);
  end if;
end;
$$;
