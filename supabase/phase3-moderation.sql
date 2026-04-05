-- Phase 3 Moderation Additions — run after phase3.sql
-- Adds soft-delete for builds/loadouts and auto-spam flagging.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Soft-delete column for builds ──────────────────────────────────────────

alter table builds
  add column if not exists is_deleted boolean default false;

-- Update the public-read RLS policy to exclude soft-deleted builds
drop policy if exists "builds_select_public" on builds;
create policy "builds_select_public"
  on builds for select
  using ((is_public = true and is_deleted = false) or auth.uid() = user_id);

-- Index for filtering out deleted builds
create index if not exists builds_not_deleted_idx
  on builds(is_deleted) where is_deleted = false;

-- ─── Soft-delete column for loadouts ────────────────────────────────────────

alter table loadouts
  add column if not exists is_deleted boolean default false;

-- Update loadouts select policy to exclude soft-deleted
drop policy if exists "loadouts_select_public" on loadouts;
create policy "loadouts_select_public"
  on loadouts for select
  using ((is_public = true and is_deleted = false) or auth.uid() = user_id);

-- ─── Auto-spam flagging ─────────────────────────────────────────────────────
-- Automatically creates a report when:
-- 1. A comment contains common spam patterns (URLs from non-approved domains)
-- 2. A user posts more than 5 comments in 1 minute (rate-limit detection)

create or replace function auto_flag_spam_comment()
returns trigger
language plpgsql
security definer
as $$
declare
  recent_count integer;
  has_suspicious_url boolean;
begin
  -- Check for rapid-fire posting (more than 5 comments in the last 60 seconds)
  select count(*) into recent_count
  from comments
  where user_id = new.user_id
    and created_at > now() - interval '60 seconds';

  -- Check for suspicious URL patterns (common spam domains)
  has_suspicious_url := new.body ~* '(bit\.ly|tinyurl|goo\.gl|discord\.gg|free.*platinum|free.*plat|buy.*cheap)';

  if recent_count > 5 or has_suspicious_url then
    insert into reports (reporter_id, target_type, target_id, reason, notes, status)
    values (
      null,
      'comment',
      new.id,
      'spam',
      case
        when recent_count > 5 then 'Auto-flagged: rapid posting (' || recent_count || ' comments in 60s)'
        else 'Auto-flagged: suspicious URL pattern detected'
      end,
      'pending'
    );

    -- Auto-hide if rate limit exceeded
    if recent_count > 5 then
      new.is_hidden := true;
    end if;
  end if;

  return new;
end;
$$;

-- Attach the trigger to new comment inserts
drop trigger if exists trg_auto_flag_spam on comments;
create trigger trg_auto_flag_spam
  before insert on comments
  for each row
  execute function auto_flag_spam_comment();
