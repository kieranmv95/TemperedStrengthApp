import {
  applyRemoteBehaviourEntry,
  applyRemoteCheckinSettings,
  applyRemoteSupplement,
  applyRemoteSupplementLog,
  applyRemoteTrackedBehaviour,
  getLocalCheckinSettings,
  listDirtyBehaviourEntries,
  listDirtyCheckinSettings,
  listDirtySupplementLogs,
  listDirtySupplements,
  listDirtyTrackedBehaviours,
  markBehaviourEntryRowsClean,
  markCheckinSettingsClean,
  markSupplementLogRowsClean,
  markSupplementRowsClean,
  markTrackedBehaviourRowsClean,
} from '@/src/db/domains/checkin/repository';
import {
  getCheckinLastRowSyncedAt,
  setCheckinLastRowSyncedAt,
} from '@/src/db/domains/checkin/meta';
import type {
  RemoteBehaviourEntryRow,
  RemoteCheckinSettingsRow,
  RemoteSupplementLogRow,
  RemoteSupplementRow,
  RemoteTrackedBehaviourRow,
} from '@/src/db/domains/checkin/types';
import { repairCheckinIdsForSync } from '@/src/db/domains/checkin/repairIds';
import { getSupabaseClient } from '@/src/services/supabaseClient';
import {
  isPermanentSyncWriteError,
  pushRows,
  readAllPages,
  requireSyncTimestamp,
  coerceSyncTimestamp,
} from '@/src/sync/syncWrite';
import {
  CHECKIN_BEHAVIOUR_ENTRIES_TABLE,
  CHECKIN_SETTINGS_TABLE,
  CHECKIN_SUPPLEMENT_LOGS_TABLE,
  CHECKIN_SUPPLEMENTS_TABLE,
  CHECKIN_TRACKED_BEHAVIOURS_TABLE,
  CHECKIN_UPSERT_BATCH_SIZE,
} from './constants';

const EPOCH = '1970-01-01T00:00:00.000Z';

async function isHealthSyncOptedIn(): Promise<boolean> {
  const settings = await getLocalCheckinSettings();
  return settings?.health_sync_opt_in === 1;
}

function parseEntryValue(raw: string): boolean | number | string {
  try {
    return JSON.parse(raw) as boolean | number | string;
  } catch {
    return raw;
  }
}

function parseSchedule(raw: string): RemoteSupplementRow['schedule'] {
  try {
    return JSON.parse(raw) as RemoteSupplementRow['schedule'];
  } catch {
    return {
      type: 'daily',
      times: ['08:00'],
      startDate: '1970-01-01',
    };
  }
}

export async function pushDirtyCheckin(userId: string): Promise<void> {
  await repairCheckinIdsForSync();

  const client = getSupabaseClient();
  const healthOptIn = await isHealthSyncOptedIn();

  const dirtySettings = await listDirtyCheckinSettings();
  if (dirtySettings.length > 0) {
    const row = dirtySettings[0]!;
    let editableBehaviourIds: string[] | null = null;
    if (row.editable_behaviour_ids) {
      try {
        const parsed = JSON.parse(row.editable_behaviour_ids) as unknown;
        if (Array.isArray(parsed)) {
          editableBehaviourIds = parsed.filter(
            (item): item is string => typeof item === 'string'
          );
        }
      } catch {
        editableBehaviourIds = null;
      }
    }
    const payload: RemoteCheckinSettingsRow = {
      user_id: userId,
      womens_health_visible: row.womens_health_visible === 1,
      health_sync_opt_in: row.health_sync_opt_in === 1,
      lapse_pending: row.lapse_pending === 1,
      editable_behaviour_ids: editableBehaviourIds,
      editable_supplement_id: row.editable_supplement_id,
      updated_at: requireSyncTimestamp(row.updated_at),
    };
    const { error } = await client
      .from(CHECKIN_SETTINGS_TABLE)
      .upsert(payload, { onConflict: 'user_id' });
    if (error && !isPermanentSyncWriteError(error)) throw error;
    if (error) {
      console.error('Backup skipped check-in settings:', error);
    } else {
      await markCheckinSettingsClean();
    }
  }

  const dirtyTracked = await listDirtyTrackedBehaviours();
  // Sensitive rows stay dirty until the user opts in. Do not mark them clean.
  const trackedPayloads: RemoteTrackedBehaviourRow[] = dirtyTracked
    .filter((row) => healthOptIn || row.sensitive === 0)
    .map((row) => ({
      id: row.id,
      user_id: userId,
      behaviour_id: row.behaviour_id,
      sort_order: row.sort_order,
      sensitive: row.sensitive === 1,
      updated_at: requireSyncTimestamp(row.updated_at),
      deleted_at: coerceSyncTimestamp(row.deleted_at),
    }));
  await pushRows({
    table: CHECKIN_TRACKED_BEHAVIOURS_TABLE,
    rows: trackedPayloads,
    // Natural key, so a rewritten local id updates the existing cloud row.
    onConflict: 'user_id,behaviour_id',
    idOf: (row) => row.id,
    batchSize: CHECKIN_UPSERT_BATCH_SIZE,
    markClean: markTrackedBehaviourRowsClean,
  });

  const dirtyEntries = await listDirtyBehaviourEntries();
  const entryPayloads: RemoteBehaviourEntryRow[] = dirtyEntries
    .filter((row) => healthOptIn || row.sensitive === 0)
    .map((row) => ({
      id: row.id,
      user_id: userId,
      local_date: row.local_date,
      behaviour_id: row.behaviour_id,
      value: parseEntryValue(row.value),
      logged_at: requireSyncTimestamp(row.logged_at),
      source: row.source,
      sensitive: row.sensitive === 1,
      updated_at: requireSyncTimestamp(row.updated_at),
      deleted_at: coerceSyncTimestamp(row.deleted_at),
    }));
  await pushRows({
    table: CHECKIN_BEHAVIOUR_ENTRIES_TABLE,
    rows: entryPayloads,
    onConflict: 'user_id,local_date,behaviour_id',
    idOf: (row) => row.id,
    batchSize: CHECKIN_UPSERT_BATCH_SIZE,
    markClean: markBehaviourEntryRowsClean,
  });

  const dirtySupplements = await listDirtySupplements();
  const supplementPayloads: RemoteSupplementRow[] = dirtySupplements.map(
    (row) => ({
      id: row.id,
      user_id: userId,
      name: row.name,
      brand: row.brand,
      form: row.form,
      dose_amount: row.dose_amount,
      dose_unit: row.dose_unit,
      notes: row.notes,
      schedule: parseSchedule(row.schedule),
      reminders_enabled: row.reminders_enabled === 1,
      status: row.status,
      created_at: requireSyncTimestamp(row.created_at),
      updated_at: requireSyncTimestamp(row.updated_at),
      deleted_at: coerceSyncTimestamp(row.deleted_at),
    })
  );
  await pushRows({
    table: CHECKIN_SUPPLEMENTS_TABLE,
    rows: supplementPayloads,
    onConflict: 'id',
    idOf: (row) => row.id,
    batchSize: CHECKIN_UPSERT_BATCH_SIZE,
    markClean: markSupplementRowsClean,
  });

  const dirtyLogs = await listDirtySupplementLogs();
  const logPayloads: RemoteSupplementLogRow[] = dirtyLogs.map((row) => ({
    id: row.id,
    user_id: userId,
    local_date: row.local_date,
    supplement_id: row.supplement_id,
    scheduled_time: row.scheduled_time,
    status: row.status,
    actioned_at: requireSyncTimestamp(row.actioned_at),
    updated_at: requireSyncTimestamp(row.updated_at),
    deleted_at: coerceSyncTimestamp(row.deleted_at),
  }));
  await pushRows({
    table: CHECKIN_SUPPLEMENT_LOGS_TABLE,
    rows: logPayloads,
    onConflict: 'user_id,local_date,supplement_id,scheduled_time',
    idOf: (row) => row.id,
    batchSize: CHECKIN_UPSERT_BATCH_SIZE,
    markClean: markSupplementLogRowsClean,
  });
}

async function pullTable<T extends { updated_at: string }>(input: {
  userId: string;
  table: string;
  select: string;
  full: boolean;
  healthOptIn: boolean;
  filterSensitive: boolean;
  apply: (row: T) => Promise<void>;
}): Promise<void> {
  const lastSyncedAt = input.full
    ? EPOCH
    : ((await getCheckinLastRowSyncedAt(input.table)) ?? EPOCH);

  const rows = await readAllPages<T>((from, to) => {
    let query = getSupabaseClient()
      .from(input.table)
      .select(input.select)
      .eq('user_id', input.userId)
      .gt('updated_at', lastSyncedAt)
      .order('updated_at', { ascending: true });
    if (input.filterSensitive && !input.healthOptIn) {
      query = query.eq('sensitive', false);
    }
    return query.range(from, to);
  });

  let newest = lastSyncedAt;
  for (const row of rows) {
    try {
      await input.apply(row);
    } catch (error) {
      console.error(
        `Skipping ${input.table} row that could not be saved locally:`,
        error
      );
    }
    if (row.updated_at > newest) {
      newest = row.updated_at;
    }
  }
  if (rows.length > 0 && newest > lastSyncedAt) {
    await setCheckinLastRowSyncedAt(input.table, newest);
  }
}

export async function pullCheckinChanges(
  userId: string,
  options: { full?: boolean } = {}
): Promise<void> {
  const full = options.full === true;
  const healthOptIn = await isHealthSyncOptedIn();
  const client = getSupabaseClient();

  // Settings: single row per user
  {
    const lastSyncedAt = full
      ? EPOCH
      : ((await getCheckinLastRowSyncedAt(CHECKIN_SETTINGS_TABLE)) ?? EPOCH);
    const { data, error } = await client
      .from(CHECKIN_SETTINGS_TABLE)
      .select(
        'user_id,womens_health_visible,health_sync_opt_in,lapse_pending,editable_behaviour_ids,editable_supplement_id,updated_at'
      )
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;
    if (data && (full || data.updated_at > lastSyncedAt)) {
      await applyRemoteCheckinSettings(data as RemoteCheckinSettingsRow);
      await setCheckinLastRowSyncedAt(
        CHECKIN_SETTINGS_TABLE,
        (data as RemoteCheckinSettingsRow).updated_at
      );
    }
  }

  await pullTable<RemoteTrackedBehaviourRow>({
    userId,
    table: CHECKIN_TRACKED_BEHAVIOURS_TABLE,
    select:
      'id,user_id,behaviour_id,sort_order,sensitive,updated_at,deleted_at',
    full,
    healthOptIn,
    filterSensitive: true,
    apply: applyRemoteTrackedBehaviour,
  });

  await pullTable<RemoteBehaviourEntryRow>({
    userId,
    table: CHECKIN_BEHAVIOUR_ENTRIES_TABLE,
    select:
      'id,user_id,local_date,behaviour_id,value,logged_at,source,sensitive,updated_at,deleted_at',
    full,
    healthOptIn,
    filterSensitive: true,
    apply: applyRemoteBehaviourEntry,
  });

  await pullTable<RemoteSupplementRow>({
    userId,
    table: CHECKIN_SUPPLEMENTS_TABLE,
    select:
      'id,user_id,name,brand,form,dose_amount,dose_unit,notes,schedule,reminders_enabled,status,created_at,updated_at,deleted_at',
    full,
    healthOptIn,
    filterSensitive: false,
    apply: applyRemoteSupplement,
  });

  await pullTable<RemoteSupplementLogRow>({
    userId,
    table: CHECKIN_SUPPLEMENT_LOGS_TABLE,
    select:
      'id,user_id,local_date,supplement_id,scheduled_time,status,actioned_at,updated_at,deleted_at',
    full,
    healthOptIn,
    filterSensitive: false,
    apply: applyRemoteSupplementLog,
  });
}
