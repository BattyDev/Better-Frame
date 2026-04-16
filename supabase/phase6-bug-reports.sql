-- Phase 6 — Bug reports
-- In-app bug reporter: lets signed-in users submit bug reports from any page.
-- Context (url, user_agent, viewport) is captured client-side at submission time.

create table if not exists bug_reports (
  id           uuid primary key default gen_random_uuid(),
  reporter_id  uuid references profiles(id) on delete set null,
  title        text not null check (length(title) between 1 and 200),
  description  text not null check (length(description) between 1 and 4000),
  steps        text check (length(steps) <= 4000),
  severity     text default 'normal' check (severity in ('low','normal','high','critical')),
  url          text,
  user_agent   text,
  viewport     text,
  app_version  text,
  status       text default 'open' check (status in ('open','triaged','in_progress','resolved','wont_fix','duplicate')),
  notes        text,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create index if not exists bug_reports_reporter_idx on bug_reports(reporter_id);
create index if not exists bug_reports_status_idx on bug_reports(status);
create index if not exists bug_reports_created_idx on bug_reports(created_at desc);

alter table bug_reports enable row level security;

-- Reporters can insert their own bug reports
create policy "bug_reports_insert_own"
  on bug_reports for insert
  with check (auth.uid() = reporter_id);

-- Reporters can read their own bug reports
create policy "bug_reports_select_own"
  on bug_reports for select
  using (auth.uid() = reporter_id);

-- Admins/moderators can read all bug reports
create policy "bug_reports_select_admin"
  on bug_reports for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'moderator')
    )
  );

-- Admins/moderators can update bug reports (status, notes)
create policy "bug_reports_update_admin"
  on bug_reports for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'moderator')
    )
  );
