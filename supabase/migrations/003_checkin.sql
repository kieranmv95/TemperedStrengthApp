-- Daily Check-in: public catalogue + five user tables.
-- Apply via Supabase SQL editor or CLI before shipping the client.

-- Public catalogue override (optional; app bundles a copy).
create table if not exists public.behaviour_catalogue (
  id int primary key default 1,
  catalogue_version int not null,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.behaviour_catalogue enable row level security;

drop policy if exists behaviour_catalogue_public_read on public.behaviour_catalogue;
create policy behaviour_catalogue_public_read
  on public.behaviour_catalogue
  for select
  to anon, authenticated
  using (true);

-- One row per user.
create table if not exists public.checkin_settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  womens_health_visible boolean not null default true,
  health_sync_opt_in boolean not null default false,
  lapse_pending boolean not null default false,
  editable_behaviour_ids jsonb,
  editable_supplement_id text,
  updated_at timestamptz not null
);

-- Subset the user tracks. Deselect = soft-delete (frees a free-tier slot).
create table if not exists public.checkin_tracked_behaviours (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  behaviour_id text not null,
  sort_order int not null,
  sensitive boolean not null default false,
  updated_at timestamptz not null,
  deleted_at timestamptz,
  unique (user_id, behaviour_id)
);

-- One answer per behaviour per local calendar day. Re-log overwrites this row.
create table if not exists public.checkin_behaviour_entries (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  local_date date not null,
  behaviour_id text not null,
  value jsonb not null,
  logged_at timestamptz not null,
  source text not null check (source in ('manual', 'auto', 'imported')),
  sensitive boolean not null default false,
  updated_at timestamptz not null,
  deleted_at timestamptz,
  unique (user_id, local_date, behaviour_id)
);

create table if not exists public.checkin_supplements (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  brand text,
  form text not null check (form in ('capsule', 'tablet', 'powder', 'liquid', 'gummy', 'other')),
  dose_amount double precision not null,
  dose_unit text not null check (dose_unit in ('g', 'mg', 'mcg', 'ml', 'IU', 'capsule', 'tablet', 'scoop', 'drop')),
  notes text,
  schedule jsonb not null,
  reminders_enabled boolean not null default false,
  status text not null check (status in ('active', 'paused', 'archived')),
  created_at timestamptz not null,
  updated_at timestamptz not null,
  deleted_at timestamptz
);

-- Only written when the user taps taken/skipped. Missed is not stored.
create table if not exists public.checkin_supplement_logs (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  local_date date not null,
  supplement_id uuid not null,
  scheduled_time text not null,
  status text not null check (status in ('taken', 'skipped')),
  actioned_at timestamptz not null,
  updated_at timestamptz not null,
  deleted_at timestamptz,
  unique (user_id, local_date, supplement_id, scheduled_time)
);

create index if not exists checkin_tracked_behaviours_user_updated_idx
  on public.checkin_tracked_behaviours (user_id, updated_at);
create index if not exists checkin_behaviour_entries_user_updated_idx
  on public.checkin_behaviour_entries (user_id, updated_at);
create index if not exists checkin_behaviour_entries_user_date_idx
  on public.checkin_behaviour_entries (user_id, local_date);
create index if not exists checkin_supplements_user_updated_idx
  on public.checkin_supplements (user_id, updated_at);
create index if not exists checkin_supplement_logs_user_updated_idx
  on public.checkin_supplement_logs (user_id, updated_at);
create index if not exists checkin_supplement_logs_user_date_idx
  on public.checkin_supplement_logs (user_id, local_date);

alter table public.checkin_settings enable row level security;
alter table public.checkin_tracked_behaviours enable row level security;
alter table public.checkin_behaviour_entries enable row level security;
alter table public.checkin_supplements enable row level security;
alter table public.checkin_supplement_logs enable row level security;

drop policy if exists checkin_settings_own on public.checkin_settings;
create policy checkin_settings_own
  on public.checkin_settings for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists checkin_tracked_behaviours_own on public.checkin_tracked_behaviours;
create policy checkin_tracked_behaviours_own
  on public.checkin_tracked_behaviours for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists checkin_behaviour_entries_own on public.checkin_behaviour_entries;
create policy checkin_behaviour_entries_own
  on public.checkin_behaviour_entries for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists checkin_supplements_own on public.checkin_supplements;
create policy checkin_supplements_own
  on public.checkin_supplements for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists checkin_supplement_logs_own on public.checkin_supplement_logs;
create policy checkin_supplement_logs_own
  on public.checkin_supplement_logs for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
