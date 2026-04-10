import type { WorkoutCategory } from '@/src/types/workouts';

export type TimeFilter =
  | '≤15 min'
  | '16-30 min'
  | '31-45 min'
  | '46+ min'
  | null;
export type CategoryFilter = 'All' | WorkoutCategory | 'Favorites' | 'Pro';

export const TIME_FILTERS: (
  | '≤15 min'
  | '16-30 min'
  | '31-45 min'
  | '46+ min'
)[] = ['≤15 min', '16-30 min', '31-45 min', '46+ min'];

export const CATEGORY_FILTERS: CategoryFilter[] = [
  'All',
  'Favorites',
  'Pro',
  'Strength',
  'WOD',
  'Hyrox',
  'Conditioning',
  'Mobility',
];
