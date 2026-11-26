-- Allow triathlon finish times alongside the single-discipline activities.

alter table public.conditioning_efforts
  drop constraint if exists conditioning_efforts_activity_id_check;

alter table public.conditioning_efforts
  add constraint conditioning_efforts_activity_id_check
  check (
    activity_id in ('run', 'row', 'ski_erg', 'bike_erg', 'triathlon')
  );
