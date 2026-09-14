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
import { getSupabaseClient } from '@/src/services/supabaseClient';
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
      updated_at: row.updated_at,
    };
    const { error } = await client
      .from(CHECKIN_SETTINGS_TABLE)
      .upsert(payload, { onConflict: 'user_id' });
    if (error) throw error;
    await markCheckinSettingsClean();
  }

  const dirtyTracked = await listDirtyTrackedBehaviours();
  const trackedPayloads: RemoteTrackedBehaviourRow[] = dirtyTracked
    .filter((row) => healthOptIn || row.sensitive === 0)
    .map((row) => ({
      id: row.id,
      user_id: userId,
      behaviour_id: row.behaviour_id,
      sort_order: row.sort_order,
      sensitive: row.sensitive === 1,
      updated_at: row.updated_at,
      deleted_at: row.deleted_at,
    }));
  for (
    let index = 0;
    index < trackedPayloads.length;
    index += CHECKIN_UPSERT_BATCH_SIZE
  ) {
    const batch = trackedPayloads.slice(
      index,
      index + CHECKIN_UPSERT_BATCH_SIZE
    );
    const { error } = await client
      .from(CHECKIN_TRACKED_BEHAVIOURS_TABLE)
      .upsert(batch, { onConflict: 'id' });
    if (error) throw error;
  }
  if (trackedPayloads.length > 0) {
    await markTrackedBehaviourRowsClean(trackedPayloads.map((r) => r.id));
  }
  // Mark non-synced sensitive dirty rows clean only locally? No — keep dirty so
  // opt-in later pushes them. Do not mark sensitive dirty rows clean when skipped.

  const dirtyEntries = await listDirtyBehaviourEntries();
  const entryPayloads: RemoteBehaviourEntryRow[] = dirtyEntries
    .filter((row) => healthOptIn || row.sensitive === 0)
    .map((row) => ({
      id: row.id,
      user_id: userId,
      local_date: row.local_date,
      behaviour_id: row.behaviour_id,
      value: parseEntryValue(row.value),
      logged_at: row.logged_at,
      source: row.source,
      sensitive: row.sensitive === 1,
      updated_at: row.updated_at,
      deleted_at: row.deleted_at,
    }));
  for (
    let index = 0;
    index < entryPayloads.length;
    index += CHECKIN_UPSERT_BATCH_SIZE
  ) {
    const batch = entryPayloads.slice(index, index + CHECKIN_UPSERT_BATCH_SIZE);
    const { error } = await client
      .from(CHECKIN_BEHAVIOUR_ENTRIES_TABLE)
      .upsert(batch, { onConflict: 'id' });
    if (error) throw error;
  }
  if (entryPayloads.length > 0) {
    await markBehaviourEntryRowsClean(entryPayloads.map((r) => r.id));
  }

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
      created_at: row.created_at,
      updated_at: row.updated_at,
      deleted_at: row.deleted_at,
    })
  );
  for (
    let index = 0;
    index < supplementPayloads.length;
    index += CHECKIN_UPSERT_BATCH_SIZE
  ) {
    const batch = supplementPayloads.slice(
      index,
      index + CHECKIN_UPSERT_BATCH_SIZE
    );
    const { error } = await client
      .from(CHECKIN_SUPPLEMENTS_TABLE)
      .upsert(batch, { onConflict: 'id' });
    if (error) throw error;
  }
  if (supplementPayloads.length > 0) {
    await markSupplementRowsClean(supplementPayloads.map((r) => r.id));
  }

  const dirtyLogs = await listDirtySupplementLogs();
  const logPayloads: RemoteSupplementLogRow[] = dirtyLogs.map((row) => ({
    id: row.id,
    user_id: userId,
    local_date: row.local_date,
    supplement_id: row.supplement_id,
    scheduled_time: row.scheduled_time,
    status: row.status,
    actioned_at: row.actioned_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
  }));
  for (
    let index = 0;
    index < logPayloads.length;
    index += CHECKIN_UPSERT_BATCH_SIZE
  ) {
    const batch = logPayloads.slice(index, index + CHECKIN_UPSERT_BATCH_SIZE);
    const { error } = await client
      .from(CHECKIN_SUPPLEMENT_LOGS_TABLE)
      .upsert(batch, { onConflict: 'id' });
    if (error) throw error;
  }
  if (logPayloads.length > 0) {
    await markSupplementLogRowsClean(logPayloads.map((r) => r.id));
  }
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

  let query = getSupabaseClient()
    .from(input.table)
    .select(input.select)
    .eq('user_id', input.userId)
    .gt('updated_at', lastSyncedAt)
    .order('updated_at', { ascending: true });

  if (input.filterSensitive && !input.healthOptIn) {
    query = query.eq('sensitive', false);
  }

  const { data, error } = await query;
  if (error) throw error;

  const rows = (data ?? []) as unknown as T[];
  let newest = lastSyncedAt;
  for (const row of rows) {
    await input.apply(row);
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
