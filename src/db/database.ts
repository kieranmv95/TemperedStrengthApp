// Single SQLite file for device-local structured data.
// Call openAppDatabase() once at boot before getDatabase().
import * as SQLite from 'expo-sqlite';
import { runLocalSchemaMigrations } from './runMigrations';

const DATABASE_NAME = 'tempered_strength.db';

let database: SQLite.SQLiteDatabase | null = null;
let openPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/**
 * Opens the app database (idempotent) and applies local schema migrations.
 */
export async function openAppDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (database) {
    return database;
  }
  if (openPromise) {
    return openPromise;
  }

  openPromise = (async () => {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    await runLocalSchemaMigrations(db);
    database = db;
    return db;
  })();

  try {
    return await openPromise;
  } catch (error) {
    openPromise = null;
    database = null;
    throw error;
  }
}

/**
 * Returns the open database. Throws if openAppDatabase() has not completed.
 */
export function getDatabase(): SQLite.SQLiteDatabase {
  if (!database) {
    throw new Error(
      'SQLite is not open. Call openAppDatabase() during app boot before using the database.'
    );
  }
  return database;
}

/** Test helper — closes and clears the singleton. */
export async function closeAppDatabaseForTests(): Promise<void> {
  if (database) {
    await database.closeAsync();
  }
  database = null;
  openPromise = null;
}
