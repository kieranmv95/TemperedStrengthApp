// Local schema v4: Women's health module is on unless the user turns it off.
import type { SQLiteDatabase } from 'expo-sqlite';
import type { LocalSchemaMigration } from '../types';

export const migration004WomensHealthDefaultOn: LocalSchemaMigration = {
  version: 4,
  name: '004_womens_health_default_on',
  async up(db: SQLiteDatabase): Promise<void> {
    await db.runAsync(
      `UPDATE checkin_settings
       SET womens_health_visible = 1,
           updated_at = ?,
           dirty = 1
       WHERE womens_health_visible = 0`,
      new Date().toISOString()
    );
  },
};
