-- Optional RPE (1–10) on every program set log.
-- Nullable so existing rows stay valid with rpe = NULL.

alter table public.workout_log_sets
  add column if not exists rpe integer null;

alter table public.workout_log_sets
  drop constraint if exists workout_log_sets_rpe_range;

alter table public.workout_log_sets
  add constraint workout_log_sets_rpe_range
  check (rpe is null or (rpe >= 1 and rpe <= 10));
