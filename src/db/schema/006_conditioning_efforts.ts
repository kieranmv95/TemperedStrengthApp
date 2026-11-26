// Local schema v6: time-for-distance conditioning efforts.
import type { SQLiteDatabase } from 'expo-sqlite';
import type { LocalSchemaMigration } from '../types';

export const migration006ConditioningEfforts: LocalSchemaMigration = {
  version: 6,
  name: '006_conditioning_efforts',
  async up(db: SQLiteDatabase): Promise<void> {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS conditioning_efforts (
        id TEXT PRIMARY KEY NOT NULL,
        activity_id TEXT NOT NULL,
        distance_m INTEGER NOT NULL,
        duration_ms INTEGER NOT NULL,
        achieved_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        deleted_at TEXT,
        dirty INTEGER NOT NULL DEFAULT 0
      );

      CREATE INDEX IF NOT EXISTS conditioning_efforts_activity_idx
        ON conditioning_efforts (activity_id, distance_m);

      CREATE INDEX IF NOT EXISTS conditioning_efforts_dirty_idx
        ON conditioning_efforts (dirty)
        WHERE dirty = 1;

      CREATE INDEX IF NOT EXISTS conditioning_efforts_updated_idx
        ON conditioning_efforts (updated_at);
    `);
  },
};
