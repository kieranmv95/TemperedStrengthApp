import {
  isWorkoutFormatTag,
  type SingleWorkout,
  type WorkoutCategory,
} from '@/src/types/workouts';

export const TEMPERED_DAILY_NAME = 'Tempered Daily';
export const TEMPERED_DAILY_TODAY_HEADING = 'Today’s workout';
export const TEMPERED_DAILY_WEEK_TITLE = 'This week';
/** Placeholder until final copy is agreed. */
export const TEMPERED_DAILY_WEEK_SUBTITLE =
  'A new week of training every Monday. Do the days you can.';
export const TEMPERED_DAILY_VIEW_WEEK = 'View this week';
export const TEMPERED_DAILY_NEW_WEEK_DROPS = 'New week drops Monday 00:01';
export const TEMPERED_DAILY_RELEASE_COPY =
  'Workouts become visible at 00:01 Monday';
export const TEMPERED_DAILY_REST_DAY_TITLE = 'Rest day';
export const TEMPERED_DAILY_REST_DAY_BODY =
  'Recover today. Check the rest of the week for your next session.';
export const TEMPERED_DAILY_TEASER_BODY =
  'A full week of programming drops every Monday. Check back soon.';

export const TEMPERED_DAILY_REST_DAY_UPSELL = 'Try today’s workout!';

export const TEMPERED_DAILY_LOCKED_TITLE = 'Unlock Tempered Daily';
export const TEMPERED_DAILY_LOCKED_BODY =
  'A full week of training drops every Monday. Open the app, pick today’s session and train. No planning needed.';
export const TEMPERED_DAILY_LOCKED_INSIDE = 'What’s in this session';
export const TEMPERED_DAILY_LOCKED_BENEFITS_TITLE = 'With Pro you get';
export const TEMPERED_DAILY_LOCKED_BENEFITS = [
  'A new session every day, with a fresh week every Monday',
  'RX and Scaled versions of every session',
  'Log your scores and track your numbers week to week',
  'Every Pro workout and program in the app',
] as const;
export const TEMPERED_DAILY_LOCKED_CTA = 'Unlock with Pro';

export const TEMPERED_DAILY_VIEW_SOURCE = 'tempered_daily';

export const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;

/**
 * Category as written on the workout. Tempered Daily never uses the app-wide
 * display label, which maps 'WOD' to a brand name.
 */
export function getTemperedDailyCategoryLabel(
  category: WorkoutCategory
): string {
  return category;
}

/** Format tag (e.g. "For Time") followed by the category label. */
export function getTemperedDailyWorkoutLabels(
  workout: SingleWorkout
): string[] {
  const labels: string[] = workout.tags.filter(isWorkoutFormatTag);
  labels.push(getTemperedDailyCategoryLabel(workout.category));
  return labels;
}

export function formatTemperedDayLabel(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });
}
