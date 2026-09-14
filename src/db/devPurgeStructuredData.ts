// __DEV__ only: wipe structured domains from local SQLite and Supabase tables.
import { clearCheckinDomainMeta } from '@/src/db/domains/checkin/meta';
import { clearAllCheckinTables } from '@/src/db/domains/checkin/repository';
import { clearPersonalBestsDomainMeta } from '@/src/db/domains/personalBests/meta';
import { clearAllPersonalBestRows } from '@/src/db/domains/personalBests/repository';
import { clearWorkoutLogsDomainMeta } from '@/src/db/domains/workoutLogs/meta';
import { clearAllWorkoutLogSetRows } from '@/src/db/domains/workoutLogs/repository';
import { getSupabaseClient } from '@/src/services/supabaseClient';
import {
  CHECKIN_BEHAVIOUR_ENTRIES_TABLE,
  CHECKIN_SETTINGS_TABLE,
  CHECKIN_SUPPLEMENT_LOGS_TABLE,
  CHECKIN_SUPPLEMENTS_TABLE,
  CHECKIN_TRACKED_BEHAVIOURS_TABLE,
} from '@/src/sync/domains/checkin/constants';
import { PERSONAL_BEST_ENTRIES_TABLE } from '@/src/sync/domains/personalBests/constants';
import { WORKOUT_LOG_SETS_TABLE } from '@/src/sync/domains/workoutLogs/constants';

export type StructuredDataPurgeResult = {
  localCleared: boolean;
  remoteCleared: boolean;
  remoteSkippedReason: string | null;
  remotePersonalBestDeleted: number | null;
  remoteWorkoutLogDeleted: number | null;
  remoteCheckinDeleted: number | null;
};

/**
 * Deletes personal best + workout log + check-in rows from device SQLite and,
 * when signed in, from Supabase. Resets domain_meta so a fresh migrate can run
 * again. Does not touch AsyncStorage / remaining KV keys.
 */
export async function purgeStructuredDataLocalAndRemote(): Promise<StructuredDataPurgeResult> {
  await clearAllPersonalBestRows();
  await clearPersonalBestsDomainMeta();
  await clearAllWorkoutLogSetRows();
  await clearWorkoutLogsDomainMeta();
  await clearAllCheckinTables();
  await clearCheckinDomainMeta();

  let remoteCleared = false;
  let remoteSkippedReason: string | null = null;
  let remotePersonalBestDeleted: number | null = null;
  let remoteWorkoutLogDeleted: number | null = null;
  let remoteCheckinDeleted: number | null = null;

  try {
    const client = getSupabaseClient();
    const {
      data: { session },
      error: sessionError,
    } = await client.auth.getSession();
    if (sessionError) {
      throw sessionError;
    }
    const userId = session?.user.id;
    if (!userId) {
      remoteSkippedReason = 'Not signed in — local SQLite cleared only.';
      return {
        localCleared: true,
        remoteCleared: false,
        remoteSkippedReason,
        remotePersonalBestDeleted: null,
        remoteWorkoutLogDeleted: null,
        remoteCheckinDeleted: null,
      };
    }

    const { error: pbError, count: pbCount } = await client
      .from(PERSONAL_BEST_ENTRIES_TABLE)
      .delete({ count: 'exact' })
      .eq('user_id', userId);
    if (pbError) {
      throw pbError;
    }
    remotePersonalBestDeleted = pbCount ?? 0;

    const { error: wlError, count: wlCount } = await client
      .from(WORKOUT_LOG_SETS_TABLE)
      .delete({ count: 'exact' })
      .eq('user_id', userId);
    if (wlError) {
      throw wlError;
    }
    remoteWorkoutLogDeleted = wlCount ?? 0;

    let checkinDeleted = 0;
    for (const table of [
      CHECKIN_SUPPLEMENT_LOGS_TABLE,
      CHECKIN_SUPPLEMENTS_TABLE,
      CHECKIN_BEHAVIOUR_ENTRIES_TABLE,
      CHECKIN_TRACKED_BEHAVIOURS_TABLE,
      CHECKIN_SETTINGS_TABLE,
    ]) {
      const userCol = table === CHECKIN_SETTINGS_TABLE ? 'user_id' : 'user_id';
      const { error, count } = await client
        .from(table)
        .delete({ count: 'exact' })
        .eq(userCol, userId);
      if (error) {
        throw error;
      }
      checkinDeleted += count ?? 0;
    }
    remoteCheckinDeleted = checkinDeleted;
    remoteCleared = true;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown remote purge error';
    remoteSkippedReason = message;
  }

  return {
    localCleared: true,
    remoteCleared,
    remoteSkippedReason,
    remotePersonalBestDeleted,
    remoteWorkoutLogDeleted,
    remoteCheckinDeleted,
  };
}
