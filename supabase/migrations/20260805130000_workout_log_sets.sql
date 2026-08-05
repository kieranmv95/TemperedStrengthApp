-- Program workout set logs (row-level). Replaces user_kv_store key `workout_logs`
-- for new app versions after each user is cut over.
--
-- Apply in Supabase SQL editor or CLI before shipping the app version that
-- depends on this table.
--
-- id is deterministic: wls_{day}_{slot}_{set} so migrate / dual-device LWW stay stable.

create table if not exists public.workout_log_sets (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  day_index integer not null,
  slot_index integer not null,
  set_index integer not null,
  weight double precision,
  reps integer not null,
  state text,
  updated_at timestamptz not null,
  deleted_at timestamptz
);

create index if not exists workout_log_sets_user_updated_idx
  on public.workout_log_sets (user_id, updated_at);

create index if not exists workout_log_sets_user_day_idx
  on public.workout_log_sets (user_id, day_index);

alter table public.workout_log_sets enable row level security;

drop policy if exists "workout_log_sets_select_own" on public.workout_log_sets;
drop policy if exists "workout_log_sets_insert_own" on public.workout_log_sets;
drop policy if exists "workout_log_sets_update_own" on public.workout_log_sets;
drop policy if exists "workout_log_sets_delete_own" on public.workout_log_sets;

create policy "workout_log_sets_select_own"
  on public.workout_log_sets
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "workout_log_sets_insert_own"
  on public.workout_log_sets
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "workout_log_sets_update_own"
  on public.workout_log_sets
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "workout_log_sets_delete_own"
  on public.workout_log_sets
  for delete
  to authenticated
  using (auth.uid() = user_id);

grant select, insert, update, delete
  on public.workout_log_sets
  to authenticated;
