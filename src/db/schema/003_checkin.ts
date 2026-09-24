// Local schema v3: Daily Check-in (behaviours + supplements).
import type { SQLiteDatabase } from 'expo-sqlite';
import type { LocalSchemaMigration } from '../types';

export const migration003Checkin: LocalSchemaMigration = {
  version: 3,
  name: '003_checkin',
  async up(db: SQLiteDatabase): Promise<void> {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS checkin_settings (
        id TEXT PRIMARY KEY NOT NULL,
        womens_health_visible INTEGER NOT NULL DEFAULT 1,
        health_sync_opt_in INTEGER NOT NULL DEFAULT 0,
        lapse_pending INTEGER NOT NULL DEFAULT 0,
        editable_behaviour_ids TEXT,
        editable_supplement_id TEXT,
        updated_at TEXT NOT NULL,
        dirty INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS checkin_tracked_behaviours (
        id TEXT PRIMARY KEY NOT NULL,
        behaviour_id TEXT NOT NULL UNIQUE,
        sort_order INTEGER NOT NULL,
        sensitive INTEGER NOT NULL DEFAULT 0,
        updated_at TEXT NOT NULL,
        deleted_at TEXT,
        dirty INTEGER NOT NULL DEFAULT 0
      );

      CREATE INDEX IF NOT EXISTS checkin_tracked_behaviours_dirty_idx
        ON checkin_tracked_behaviours (dirty)
        WHERE dirty = 1;

      CREATE INDEX IF NOT EXISTS checkin_tracked_behaviours_updated_idx
        ON checkin_tracked_behaviours (updated_at);

      CREATE TABLE IF NOT EXISTS checkin_behaviour_entries (
        id TEXT PRIMARY KEY NOT NULL,
        local_date TEXT NOT NULL,
        behaviour_id TEXT NOT NULL,
        value TEXT NOT NULL,
        logged_at TEXT NOT NULL,
        source TEXT NOT NULL,
        sensitive INTEGER NOT NULL DEFAULT 0,
        updated_at TEXT NOT NULL,
        deleted_at TEXT,
        dirty INTEGER NOT NULL DEFAULT 0,
        UNIQUE (local_date, behaviour_id)
      );

      CREATE INDEX IF NOT EXISTS checkin_behaviour_entries_dirty_idx
        ON checkin_behaviour_entries (dirty)
        WHERE dirty = 1;

      CREATE INDEX IF NOT EXISTS checkin_behaviour_entries_updated_idx
        ON checkin_behaviour_entries (updated_at);

      CREATE INDEX IF NOT EXISTS checkin_behaviour_entries_date_idx
        ON checkin_behaviour_entries (local_date);

      CREATE TABLE IF NOT EXISTS checkin_supplements (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        brand TEXT,
        form TEXT NOT NULL,
        dose_amount REAL NOT NULL,
        dose_unit TEXT NOT NULL,
        notes TEXT,
        schedule TEXT NOT NULL,
        reminders_enabled INTEGER NOT NULL DEFAULT 0,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        deleted_at TEXT,
        dirty INTEGER NOT NULL DEFAULT 0
      );

      CREATE INDEX IF NOT EXISTS checkin_supplements_dirty_idx
        ON checkin_supplements (dirty)
        WHERE dirty = 1;

      CREATE INDEX IF NOT EXISTS checkin_supplements_updated_idx
        ON checkin_supplements (updated_at);

      CREATE TABLE IF NOT EXISTS checkin_supplement_logs (
        id TEXT PRIMARY KEY NOT NULL,
        local_date TEXT NOT NULL,
        supplement_id TEXT NOT NULL,
        scheduled_time TEXT NOT NULL,
        status TEXT NOT NULL,
        actioned_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        deleted_at TEXT,
        dirty INTEGER NOT NULL DEFAULT 0,
        UNIQUE (local_date, supplement_id, scheduled_time)
      );

      CREATE INDEX IF NOT EXISTS checkin_supplement_logs_dirty_idx
        ON checkin_supplement_logs (dirty)
        WHERE dirty = 1;

      CREATE INDEX IF NOT EXISTS checkin_supplement_logs_updated_idx
        ON checkin_supplement_logs (updated_at);

      CREATE INDEX IF NOT EXISTS checkin_supplement_logs_date_idx
        ON checkin_supplement_logs (local_date);
    `);
  },
};
