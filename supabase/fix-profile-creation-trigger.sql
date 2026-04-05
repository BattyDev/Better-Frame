-- Fix: Create profiles via database trigger instead of client-side insert
-- This avoids the RLS violation that occurs when email confirmation is enabled,
-- since the user has no active session at the time of profile creation.
-- ─────────────────────────────────────────────────────────────────────────────

-- Function runs as SECURITY DEFINER to bypass RLS
create or replace function public.handle_new_user()
returns trigger as $$
declare
  v_username text;
begin
  -- Get username from raw_user_meta_data (JSONB field with metadata passed during signup)
  v_username := coalesce(
    (new.raw_user_meta_data ->> 'username'),
    'user_' || left(new.id::text, 8)
  );

  -- Ensure username is never null or empty
  if v_username is null or v_username = '' then
    v_username := 'user_' || left(new.id::text, 8);
  end if;

  insert into public.profiles (id, username)
  values (
    new.id,
    v_username
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger fires after a new user is created in auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
