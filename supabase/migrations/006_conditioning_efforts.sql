-- Time-for-distance personal bests (run, row, ski erg, bike erg).
-- Separate from personal_best_entries so strength rows stay a weight ledger.
-- dirty stays on the device. This table is the cloud copy only.

create table if not exists public.conditioning_efforts (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  activity_id text not null,
  distance_m integer not null,
  duration_ms integer not null,
  achieved_at timestamptz not null,
  updated_at timestamptz not null,
  deleted_at timestamptz,
  constraint conditioning_efforts_activity_id_check
    check (activity_id in ('run', 'row', 'ski_erg', 'bike_erg')),
  constraint conditioning_efforts_distance_m_check
    check (distance_m > 0),
  constraint conditioning_efforts_duration_ms_check
    check (duration_ms > 0)
);

create index if not exists conditioning_efforts_user_updated_idx
  on public.conditioning_efforts (user_id, updated_at);

create index if not exists conditioning_efforts_user_activity_idx
  on public.conditioning_efforts (user_id, activity_id, distance_m);

alter table public.conditioning_efforts enable row level security;

create policy if not exists conditioning_efforts_select_own
  on public.conditioning_efforts
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy if not exists conditioning_efforts_insert_own
  on public.conditioning_efforts
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy if not exists conditioning_efforts_update_own
  on public.conditioning_efforts
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy if not exists conditioning_efforts_delete_own
  on public.conditioning_efforts
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
