// Public API for program workout set logs — SQLite is source of truth.
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getSupabaseClient,
  isSupabaseConfigured,
} from '@/src/services/supabaseClient';
import { SYNC_QUEUE_KEY, SYNC_TS_PREFIX } from '@/src/sync/constants';
import {
  deleteAllRemoteWorkoutLogSets,
  pushDirtyWorkoutLogs,
} from '@/src/sync/domains/workoutLogs/rowSync';
import type { LoggedSet } from '@/src/types/storage';
import { WORKOUT_LOGS_KEY } from '@/src/utils/storage/keys';
import { withKeyLock } from '@/src/utils/storage/internal';
import {
  expandWorkoutLogsBlobToRows,
  parseWorkoutLogsStore,
} from './codec';
import {
  isWorkoutLogsLocalMigrated,
  markWorkoutLogsLocalMigrated,
} from './meta';
import {
  clearAllWorkoutLogSetRows,
  getLoggedSetsForSlotFromDb,
  getWorkoutLogsForDayFromDb,
  softDeleteAllWorkoutLogSets,
  softDeleteWorkoutLogSet,
  softDeleteWorkoutLogSlot,
  softDeleteWorkoutLogsFromDay,
  moveWorkoutLogDay,
  upsertLocalWorkoutLogSetRow,
  upsertLocalWorkoutLogSetRows,
} from './repository';
import type { SetState } from './types';
import { workoutLogSetId } from './types';

async function stripWorkoutLogsFromSyncQueue(): Promise<void> {
  const raw = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
  if (!raw) {
    return;
  }
  try {
    const queue = JSON.parse(raw) as unknown;
    if (!Array.isArray(queue)) {
      return;
    }
    const next = queue.filter(
      (item) =>
        !(
          typeof item === 'object' &&
          item !== null &&
          'key' in item &&
          (item as { key: unknown }).key === WORKOUT_LOGS_KEY
        )
    );
    if (next.length !== queue.length) {
      await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(next));
    }
  } catch {
    // ignore
  }
}

/**
 * One-shot: expand AsyncStorage `workout_logs` blob into SQLite, then drop the key.
 */
export async function migrateWorkoutLogsFromKvLocal(): Promise<void> {
  if (await isWorkoutLogsLocalMigrated()) {
    return;
  }

  const raw = await AsyncStorage.getItem(WORKOUT_LOGS_KEY);
  const store = parseWorkoutLogsStore(raw);
  const updatedAt = new Date().toISOString();
  const rows = expandWorkoutLogsBlobToRows(store, updatedAt).map((row) => ({
    ...row,
    dirty: 1 as const,
  }));

  if (rows.length > 0) {
    await upsertLocalWorkoutLogSetRows(rows);
  }

  await AsyncStorage.multiRemove([
    WORKOUT_LOGS_KEY,
    `${SYNC_TS_PREFIX}${WORKOUT_LOGS_KEY}`,
  ]);
  await stripWorkoutLogsFromSyncQueue();
  await markWorkoutLogsLocalMigrated();
}

async function ensureLocalMigrated(): Promise<void> {
  await migrateWorkoutLogsFromKvLocal();
}

/**
 * Best-effort cloud flush for dirty set rows (signed-in only).
 * Structured domains do not go through the KV sync queue, so without this,
 * rows wait for the next scheduled syncNow.
 */
async function pushDirtyWorkoutLogsIfSignedIn(): Promise<void> {
  if (!isSupabaseConfigured) {
    return;
  }
  try {
    const client = getSupabaseClient();
    const {
      data: { session },
      error: sessionError,
    } = await client.auth.getSession();
    if (sessionError || !session?.user.id) {
      return;
    }
    await pushDirtyWorkoutLogs(session.user.id);
  } catch (error) {
    console.error('Failed to push dirty workout_log_sets:', error);
  }
}

export async function saveLoggedSet(
  dayIndex: number,
  slotIndex: number,
  setIndex: number,
  weight: number | null,
  reps: number,
  state?: 'completed' | 'failed' | null
): Promise<void> {
  return withKeyLock(WORKOUT_LOGS_KEY, async () => {
    await ensureLocalMigrated();
    const updatedAt = new Date().toISOString();

    let nextState: SetState = null;
    if (state !== undefined) {
      nextState = state;
    } else {
      const existing = await getLoggedSetsForSlotFromDb(dayIndex, slotIndex);
      const prior = existing[setIndex];
      if (prior?.state !== undefined) {
        nextState =
          prior.state === 'completed' || prior.state === 'failed'
            ? prior.state
            : null;
      }
    }

    await upsertLocalWorkoutLogSetRow({
      id: workoutLogSetId(dayIndex, slotIndex, setIndex),
      day_index: dayIndex,
      slot_index: slotIndex,
      set_index: setIndex,
      weight,
      reps,
      state: nextState,
      updated_at: updatedAt,
      deleted_at: null,
      dirty: 1,
    });
    await pushDirtyWorkoutLogsIfSignedIn();
  });
}

export async function getLoggedSets(
  dayIndex: number,
  slotIndex: number
): Promise<{ [setIndex: number]: LoggedSet }> {
  try {
    await ensureLocalMigrated();
    return await getLoggedSetsForSlotFromDb(dayIndex, slotIndex);
  } catch (error) {
    console.error('Error getting logged sets:', error);
    return {};
  }
}

export async function hasLoggedSets(
  dayIndex: number,
  slotIndex: number
): Promise<boolean> {
  try {
    const loggedSets = await getLoggedSets(dayIndex, slotIndex);
    return Object.keys(loggedSets).length > 0;
  } catch (error) {
    console.error('Error checking logged sets:', error);
    return false;
  }
}

export async function clearLoggedSetsForSlot(
  dayIndex: number,
  slotIndex: number
): Promise<void> {
  return withKeyLock(WORKOUT_LOGS_KEY, async () => {
    await ensureLocalMigrated();
    await softDeleteWorkoutLogSlot(
      dayIndex,
      slotIndex,
      new Date().toISOString()
    );
    await pushDirtyWorkoutLogsIfSignedIn();
  });
}

export async function clearLoggedSet(
  dayIndex: number,
  slotIndex: number,
  setIndex: number
): Promise<void> {
  return withKeyLock(WORKOUT_LOGS_KEY, async () => {
    await ensureLocalMigrated();
    await softDeleteWorkoutLogSet(
      dayIndex,
      slotIndex,
      setIndex,
      new Date().toISOString()
    );
    await pushDirtyWorkoutLogsIfSignedIn();
  });
}

export async function getWorkoutLogsForDay(
  dayIndex: number
): Promise<{ [slotIndex: number]: { [setIndex: number]: LoggedSet } }> {
  try {
    await ensureLocalMigrated();
    return await getWorkoutLogsForDayFromDb(dayIndex);
  } catch (error) {
    console.error('Error getting workout logs for day:', error);
    return {};
  }
}

/**
 * Clear all program set logs when ending a program.
 *
 * Soft-deletes first (dirty) so offline / failed remote wipe can still push
 * tombstones on the next sync. When signed in and online, hard-deletes remote
 * rows immediately (empty Supabase table), then hard-wipes local SQLite.
 * No session: hard-wipes local only.
 */
export async function clearAllWorkoutLogsLocal(): Promise<void> {
  await ensureLocalMigrated();
  const deletedAt = new Date().toISOString();
  await softDeleteAllWorkoutLogSets(deletedAt);

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
      await clearAllWorkoutLogSetRows();
      return;
    }

    try {
      // Hard wipe cloud so end-program matches old KV remove (empty domain).
      await deleteAllRemoteWorkoutLogSets(userId);
      await clearAllWorkoutLogSetRows();
    } catch (remoteError) {
      console.error(
        'Remote workout_log_sets wipe failed; soft-deletes will push later:',
        remoteError
      );
      try {
        await pushDirtyWorkoutLogs(userId);
      } catch (pushError) {
        console.error(
          'Failed to push soft-deleted workout_log_sets:',
          pushError
        );
      }
    }
  } catch (error) {
    // Soft-deletes already applied; leave them for a later sync.
    console.error('Error clearing workout log sets after end program:', error);
  }
}

/** Soft-delete sets from dayIndex onwards (restart / clear future). */
export async function clearFutureWorkoutLogsLocal(
  fromDayIndex: number
): Promise<void> {
  await ensureLocalMigrated();
  await softDeleteWorkoutLogsFromDay(fromDayIndex, new Date().toISOString());
  await pushDirtyWorkoutLogsIfSignedIn();
}

/** Move set logs from one program day to another. */
export async function moveWorkoutLogsDayLocal(
  fromDayIndex: number,
  toDayIndex: number
): Promise<void> {
  await ensureLocalMigrated();
  await moveWorkoutLogDay(
    fromDayIndex,
    toDayIndex,
    new Date().toISOString()
  );
  await pushDirtyWorkoutLogsIfSignedIn();
}
