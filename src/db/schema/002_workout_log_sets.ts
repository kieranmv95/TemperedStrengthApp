// Local schema v2: program workout log sets (one row per logged set).
import type { SQLiteDatabase } from 'expo-sqlite';
import type { LocalSchemaMigration } from '../types';

export const migration002WorkoutLogSets: LocalSchemaMigration = {
  version: 2,
  name: '002_workout_log_sets',
  async up(db: SQLiteDatabase): Promise<void> {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS workout_log_sets (
        id TEXT PRIMARY KEY NOT NULL,
        day_index INTEGER NOT NULL,
        slot_index INTEGER NOT NULL,
        set_index INTEGER NOT NULL,
        weight REAL,
        reps INTEGER NOT NULL,
        state TEXT,
        updated_at TEXT NOT NULL,
        deleted_at TEXT,
        dirty INTEGER NOT NULL DEFAULT 0
      );

      CREATE INDEX IF NOT EXISTS workout_log_sets_day_slot_idx
        ON workout_log_sets (day_index, slot_index);

      CREATE INDEX IF NOT EXISTS workout_log_sets_dirty_idx
        ON workout_log_sets (dirty)
        WHERE dirty = 1;

      CREATE INDEX IF NOT EXISTS workout_log_sets_updated_idx
        ON workout_log_sets (updated_at);
    `);
  },
};
