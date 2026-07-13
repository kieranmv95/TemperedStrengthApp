-- Live competition tables for the whitelabel leaderboard feature.
-- Run in Supabase SQL Editor or via `supabase db push`.

create table public.active_competition (
  -- Singleton row: only id = 1 is allowed.
  id int primary key default 1 check (id = 1),

  title text not null,
  description text not null,
  additional_info text not null default '',
  link_text text not null,

  order_by text not null check (order_by in ('weight', 'time')),

  theme_border_color text not null,
  theme_bg_color text not null,
  theme_copy_color text not null,
  theme_link_color text not null,
  theme_link_text_color text not null,

  -- Flip these to control which app builds see the competition.
  active_in_test boolean not null default false,
  active_in_production boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.competition_entry (
  id uuid primary key default gen_random_uuid(),

  competition_id int not null
    references public.active_competition (id)
    on delete cascade,

  name text not null,
  score numeric not null,
  category text not null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index competition_entry_competition_id_idx
  on public.competition_entry (competition_id);

create index competition_entry_category_idx
  on public.competition_entry (competition_id, category);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger active_competition_set_updated_at
  before update on public.active_competition
  for each row
  execute function public.set_updated_at();

create trigger competition_entry_set_updated_at
  before update on public.competition_entry
  for each row
  execute function public.set_updated_at();

alter table public.active_competition enable row level security;
alter table public.competition_entry enable row level security;

-- Leaderboard is public read; writes happen via dashboard / service role only.
create policy "Public read active competition"
  on public.active_competition
  for select
  using (true);

create policy "Public read competition entries"
  on public.competition_entry
  for select
  using (true);
