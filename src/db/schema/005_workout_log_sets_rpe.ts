// Local schema v5: optional RPE (1–10) on program workout log sets.
import type { SQLiteDatabase } from 'expo-sqlite';
import type { LocalSchemaMigration } from '../types';

export const migration005WorkoutLogSetsRpe: LocalSchemaMigration = {
  version: 5,
  name: '005_workout_log_sets_rpe',
  async up(db: SQLiteDatabase): Promise<void> {
    await db.execAsync(`
      ALTER TABLE workout_log_sets ADD COLUMN rpe INTEGER;
    `);
  },
};
