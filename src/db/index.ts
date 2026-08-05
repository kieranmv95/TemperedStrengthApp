// Local SQLite — open once at boot; domain modules live under domains/.
export { openAppDatabase, getDatabase } from './database';
export { runLocalSchemaMigrations } from './runMigrations';
export type { LocalSchemaMigration } from './types';
