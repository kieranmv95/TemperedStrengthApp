-- Personal best history (row-level). Replaces user_kv_store key `personal_bests`
-- for new app versions after each user is cut over.
--
-- Apply in the Supabase SQL editor or via CLI:
--   supabase db push
--   (or paste this file into Dashboard → SQL → New query → Run)
--
-- id is text (not uuid) because older clients used `pb_*` fallback ids.

create table if not exists public.personal_best_entries (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  exercise_id integer not null,
  rep_max smallint not null check (rep_max in (1, 2, 3, 5, 10, 15, 20)),
  weight double precision not null check (weight > 0),
  achieved_at timestamptz not null,
  updated_at timestamptz not null,
  deleted_at timestamptz
);

create index if not exists personal_best_entries_user_updated_idx
  on public.personal_best_entries (user_id, updated_at);

create index if not exists personal_best_entries_user_exercise_idx
  on public.personal_best_entries (user_id, exercise_id);

alter table public.personal_best_entries enable row level security;

drop policy if exists "personal_best_entries_select_own" on public.personal_best_entries;
drop policy if exists "personal_best_entries_insert_own" on public.personal_best_entries;
drop policy if exists "personal_best_entries_update_own" on public.personal_best_entries;
drop policy if exists "personal_best_entries_delete_own" on public.personal_best_entries;

create policy "personal_best_entries_select_own"
  on public.personal_best_entries
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "personal_best_entries_insert_own"
  on public.personal_best_entries
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "personal_best_entries_update_own"
  on public.personal_best_entries
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "personal_best_entries_delete_own"
  on public.personal_best_entries
  for delete
  to authenticated
  using (auth.uid() = user_id);

grant select, insert, update, delete
  on public.personal_best_entries
  to authenticated;
