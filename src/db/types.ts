import type { SQLiteDatabase } from 'expo-sqlite';

/** One ordered local SQLite schema migration step. */
export type LocalSchemaMigration = {
  version: number;
  name: string;
  up: (db: SQLiteDatabase) => Promise<void>;
};
