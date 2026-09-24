-- Women's health is on unless the user turns it off.
-- 003 may already be applied, so change the live default and existing rows.

alter table public.checkin_settings
  alter column womens_health_visible set default true;

update public.checkin_settings
set
  womens_health_visible = true,
  updated_at = now()
where womens_health_visible = false;
