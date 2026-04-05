-- Fix: Create profiles via database trigger instead of client-side insert
-- This avoids the RLS violation that occurs when email confirmation is enabled,
-- since the user has no active session at the time of profile creation.
-- ─────────────────────────────────────────────────────────────────────────────

-- Function runs as SECURITY DEFINER to bypass RLS
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', 'user_' || left(new.id::text, 8)),
    coalesce(new.raw_user_meta_data ->> 'username', 'user_' || left(new.id::text, 8))
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger fires after a new user is created in auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
