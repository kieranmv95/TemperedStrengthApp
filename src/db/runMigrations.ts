// Ordered local SQL migrations. Append new entries for the next domain tables.
import type { SQLiteDatabase } from 'expo-sqlite';
import { migration001Init } from './schema/001_init';
import { migration002WorkoutLogSets } from './schema/002_workout_log_sets';
import type { LocalSchemaMigration } from './types';

export type { LocalSchemaMigration } from './types';

/**
 * Append-only list. Never reorder or renumber applied versions.
 * Next domain tables go in 003_..., etc.
 */
export const LOCAL_SCHEMA_MIGRATIONS: LocalSchemaMigration[] = [
  migration001Init,
  migration002WorkoutLogSets,
];

export async function runLocalSchemaMigrations(
  db: SQLiteDatabase
): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      applied_at TEXT NOT NULL
    );
  `);

  const applied = await db.getAllAsync<{ version: number }>(
    'SELECT version FROM schema_migrations ORDER BY version ASC'
  );
  const appliedVersions = new Set(applied.map((row) => row.version));

  for (const migration of LOCAL_SCHEMA_MIGRATIONS) {
    if (appliedVersions.has(migration.version)) {
      continue;
    }
    await db.withTransactionAsync(async () => {
      await migration.up(db);
      await db.runAsync(
        'INSERT INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)',
        migration.version,
        migration.name,
        new Date().toISOString()
      );
    });
  }
}
