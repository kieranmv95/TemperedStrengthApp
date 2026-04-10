import { Colors } from '@/src/constants/theme';
import type { WorkoutCategory } from '@/src/types/workouts';

export const CATEGORY_ICONS: Record<WorkoutCategory, string> = {
  Strength: 'barbell',
  WOD: 'timer',
  Hyrox: 'fitness',
  Conditioning: 'heart',
  Mobility: 'body',
};

export const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: Colors.accent,
  Intermediate: Colors.accent,
  Advanced: Colors.accent,
};
