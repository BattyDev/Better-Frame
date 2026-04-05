-- Phase 3: Social Features — run this in your Supabase SQL editor
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Votes ───────────────────────────────────────────────────────────────────

create table if not exists votes (
  user_id      uuid references profiles(id) on delete cascade not null,
  target_id    uuid not null,
  target_type  text not null check (target_type in ('build', 'loadout')),
  value        smallint not null check (value in (1, -1)),
  created_at   timestamptz default now(),
  primary key (user_id, target_id, target_type)
);

-- RLS
alter table votes enable row level security;

create policy "votes_select_own"
  on votes for select
  using (auth.uid() = user_id);

create policy "votes_insert_own"
  on votes for insert
  with check (auth.uid() = user_id);

create policy "votes_update_own"
  on votes for update
  using (auth.uid() = user_id);

create policy "votes_delete_own"
  on votes for delete
  using (auth.uid() = user_id);

-- ─── Comments ─────────────────────────────────────────────────────────────────

create table if not exists comments (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid references profiles(id) on delete cascade not null,
  target_id         uuid not null,
  target_type       text not null check (target_type in ('build', 'loadout')),
  parent_comment_id uuid references comments(id) on delete cascade,
  body              text not null check (length(body) between 1 and 2000),
  is_hidden         boolean default false,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

create index if not exists comments_target_idx on comments(target_id, target_type);
create index if not exists comments_parent_idx on comments(parent_comment_id);

-- RLS
alter table comments enable row level security;

create policy "comments_select_visible"
  on comments for select
  using (is_hidden = false);

create policy "comments_insert_auth"
  on comments for insert
  with check (auth.uid() = user_id);

create policy "comments_update_own"
  on comments for update
  using (auth.uid() = user_id);

create policy "comments_delete_own"
  on comments for delete
  using (auth.uid() = user_id);

-- ─── Reports ──────────────────────────────────────────────────────────────────

create table if not exists reports (
  id          uuid primary key default gen_random_uuid(),
  reporter_id uuid references profiles(id) on delete set null,
  target_type text not null check (target_type in ('build', 'loadout', 'comment')),
  target_id   uuid not null,
  reason      text not null check (reason in ('incorrect_stats','outdated','spam','inappropriate','other')),
  notes       text,
  status      text default 'pending' check (status in ('pending','reviewed','dismissed')),
  created_at  timestamptz default now()
);

-- RLS — only the reporter can insert; only admins can read/update
alter table reports enable row level security;

create policy "reports_insert_auth"
  on reports for insert
  with check (auth.uid() = reporter_id);

-- Admins can see and manage all reports
create policy "reports_select_admin"
  on reports for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'moderator')
    )
  );

create policy "reports_update_admin"
  on reports for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'moderator')
    )
  );

-- ─── RPC: vote_on_target ─────────────────────────────────────────────────────
-- Called from the frontend to cast/change/remove a vote and update vote_score.

create or replace function vote_on_target(
  p_target_id   uuid,
  p_target_type text,
  p_value       int   -- 1, -1, or 0 to remove
)
returns void
language plpgsql
security definer
as $$
begin
  if p_value = 0 then
    delete from votes
    where user_id = auth.uid()
      and target_id = p_target_id
      and target_type = p_target_type;
  else
    insert into votes (user_id, target_id, target_type, value)
    values (auth.uid(), p_target_id, p_target_type, p_value)
    on conflict (user_id, target_id, target_type)
    do update set value = excluded.value;
  end if;

  -- Refresh denormalized score
  if p_target_type = 'build' then
    update builds
    set vote_score = (
      select coalesce(sum(value), 0)
      from votes
      where target_id = p_target_id and target_type = 'build'
    )
    where id = p_target_id;
  elsif p_target_type = 'loadout' then
    update loadouts
    set vote_score = (
      select coalesce(sum(value), 0)
      from votes
      where target_id = p_target_id and target_type = 'loadout'
    )
    where id = p_target_id;
  end if;
end;
$$;

-- ─── RPC: increment_view_count ───────────────────────────────────────────────

create or replace function increment_view_count(
  p_target_id   uuid,
  p_target_type text
)
returns void
language plpgsql
security definer
as $$
begin
  if p_target_type = 'build' then
    update builds set view_count = view_count + 1 where id = p_target_id;
  end if;
end;
$$;

-- ─── RLS policies for existing tables ────────────────────────────────────────
-- NOTE: profiles, builds, loadouts tables and their base RLS policies are
-- created in phase0-foundation.sql. The policies below are only created if
-- they don't already exist (phase0 creates them, so these are safe no-ops).

-- Ensure RLS is enabled (idempotent)
alter table builds enable row level security;
alter table profiles enable row level security;
