// Local schema v1: bookkeeping + personal best history rows.
import type { SQLiteDatabase } from 'expo-sqlite';
import type { LocalSchemaMigration } from '../types';

export const migration001Init: LocalSchemaMigration = {
  version: 1,
  name: '001_init_personal_best_entries',
  async up(db: SQLiteDatabase): Promise<void> {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS domain_meta (
        domain TEXT NOT NULL,
        key TEXT NOT NULL,
        value TEXT NOT NULL,
        PRIMARY KEY (domain, key)
      );

      CREATE TABLE IF NOT EXISTS personal_best_entries (
        id TEXT PRIMARY KEY NOT NULL,
        exercise_id INTEGER NOT NULL,
        rep_max INTEGER NOT NULL,
        weight REAL NOT NULL,
        achieved_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        deleted_at TEXT,
        dirty INTEGER NOT NULL DEFAULT 0
      );

      CREATE INDEX IF NOT EXISTS personal_best_entries_exercise_idx
        ON personal_best_entries (exercise_id);

      CREATE INDEX IF NOT EXISTS personal_best_entries_dirty_idx
        ON personal_best_entries (dirty)
        WHERE dirty = 1;

      CREATE INDEX IF NOT EXISTS personal_best_entries_updated_idx
        ON personal_best_entries (updated_at);
    `);
  },
};
