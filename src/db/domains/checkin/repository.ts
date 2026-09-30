import { getDatabase } from '@/src/db/database';
import type { CheckinSettings } from '@/src/types/checkin';
import type {
  LocalBehaviourEntryRow,
  LocalCheckinSettingsRow,
  LocalSupplementLogRow,
  LocalSupplementRow,
  LocalTrackedBehaviourRow,
  RemoteBehaviourEntryRow,
  RemoteCheckinSettingsRow,
  RemoteSupplementLogRow,
  RemoteSupplementRow,
  RemoteTrackedBehaviourRow,
} from './types';
import { CHECKIN_SETTINGS_LOCAL_ID, settingsRowToApp } from './types';

type LwwLocalRow = {
  updated_at: string;
  dirty: number;
};

type SqliteCheckinSettingsRow = {
  id: string;
  womens_health_visible: number;
  health_sync_opt_in: number;
  lapse_pending: number;
  editable_behaviour_ids: string | null;
  editable_supplement_id: string | null;
  updated_at: string;
  dirty: number;
};

type SqliteTrackedBehaviourRow = {
  id: string;
  behaviour_id: string;
  sort_order: number;
  sensitive: number;
  updated_at: string;
  deleted_at: string | null;
  dirty: number;
};

type SqliteBehaviourEntryRow = {
  id: string;
  local_date: string;
  behaviour_id: string;
  value: string;
  logged_at: string;
  source: LocalBehaviourEntryRow['source'];
  sensitive: number;
  updated_at: string;
  deleted_at: string | null;
  dirty: number;
};

type SqliteSupplementRow = {
  id: string;
  name: string;
  brand: string | null;
  form: LocalSupplementRow['form'];
  dose_amount: number;
  dose_unit: LocalSupplementRow['dose_unit'];
  notes: string | null;
  schedule: string;
  reminders_enabled: number;
  status: LocalSupplementRow['status'];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  dirty: number;
};

type SqliteSupplementLogRow = {
  id: string;
  local_date: string;
  supplement_id: string;
  scheduled_time: string;
  status: LocalSupplementLogRow['status'];
  actioned_at: string;
  updated_at: string;
  deleted_at: string | null;
  dirty: number;
};

const CHECKIN_SETTINGS_COLUMNS = `
  id, womens_health_visible, health_sync_opt_in, lapse_pending,
  editable_behaviour_ids, editable_supplement_id, updated_at, dirty
`;

const TRACKED_BEHAVIOUR_COLUMNS = `
  id, behaviour_id, sort_order, sensitive, updated_at, deleted_at, dirty
`;

const BEHAVIOUR_ENTRY_COLUMNS = `
  id, local_date, behaviour_id, value, logged_at, source, sensitive,
  updated_at, deleted_at, dirty
`;

const SUPPLEMENT_COLUMNS = `
  id, name, brand, form, dose_amount, dose_unit, notes, schedule,
  reminders_enabled, status, created_at, updated_at, deleted_at, dirty
`;

const SUPPLEMENT_LOG_COLUMNS = `
  id, local_date, supplement_id, scheduled_time, status, actioned_at,
  updated_at, deleted_at, dirty
`;

function shouldSkipRemoteApply(
  local: LwwLocalRow | null,
  remoteUpdatedAt: string
): boolean {
  return (
    local !== null &&
    (local.updated_at > remoteUpdatedAt ||
      (local.updated_at === remoteUpdatedAt && local.dirty === 1))
  );
}

function mapCheckinSettingsRow(
  row: SqliteCheckinSettingsRow
): LocalCheckinSettingsRow {
  return {
    id: row.id,
    womens_health_visible: row.womens_health_visible ? 1 : 0,
    health_sync_opt_in: row.health_sync_opt_in ? 1 : 0,
    lapse_pending: row.lapse_pending ? 1 : 0,
    editable_behaviour_ids: row.editable_behaviour_ids,
    editable_supplement_id: row.editable_supplement_id,
    updated_at: row.updated_at,
    dirty: row.dirty ? 1 : 0,
  };
}

function mapTrackedBehaviourRow(
  row: SqliteTrackedBehaviourRow
): LocalTrackedBehaviourRow {
  return {
    id: row.id,
    behaviour_id: row.behaviour_id,
    sort_order: row.sort_order,
    sensitive: row.sensitive ? 1 : 0,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
    dirty: row.dirty ? 1 : 0,
  };
}

function mapBehaviourEntryRow(
  row: SqliteBehaviourEntryRow
): LocalBehaviourEntryRow {
  return {
    id: row.id,
    local_date: row.local_date,
    behaviour_id: row.behaviour_id,
    value: row.value,
    logged_at: row.logged_at,
    source: row.source,
    sensitive: row.sensitive ? 1 : 0,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
    dirty: row.dirty ? 1 : 0,
  };
}

function mapSupplementRow(row: SqliteSupplementRow): LocalSupplementRow {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    form: row.form,
    dose_amount: row.dose_amount,
    dose_unit: row.dose_unit,
    notes: row.notes,
    schedule: row.schedule,
    reminders_enabled: row.reminders_enabled ? 1 : 0,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
    dirty: row.dirty ? 1 : 0,
  };
}

function mapSupplementLogRow(
  row: SqliteSupplementLogRow
): LocalSupplementLogRow {
  return {
    id: row.id,
    local_date: row.local_date,
    supplement_id: row.supplement_id,
    scheduled_time: row.scheduled_time,
    status: row.status,
    actioned_at: row.actioned_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
    dirty: row.dirty ? 1 : 0,
  };
}

function remoteBehaviourEntryValueToStorage(
  value: RemoteBehaviourEntryRow['value']
): string {
  return JSON.stringify(value);
}

// --- Settings ---

export async function getLocalCheckinSettings(): Promise<LocalCheckinSettingsRow | null> {
  const row = await getDatabase().getFirstAsync<SqliteCheckinSettingsRow>(
    `SELECT ${CHECKIN_SETTINGS_COLUMNS}
     FROM checkin_settings
     WHERE id = ?`,
    CHECKIN_SETTINGS_LOCAL_ID
  );
  return row ? mapCheckinSettingsRow(row) : null;
}

export async function getCheckinSettings(): Promise<CheckinSettings> {
  const row = await getLocalCheckinSettings();
  return settingsRowToApp(row);
}

export async function upsertLocalCheckinSettings(
  row: Omit<LocalCheckinSettingsRow, 'dirty'> & { dirty?: 0 | 1 }
): Promise<void> {
  const dirty = row.dirty ?? 1;
  await getDatabase().runAsync(
    `INSERT INTO checkin_settings (
       id, womens_health_visible, health_sync_opt_in, lapse_pending,
       editable_behaviour_ids, editable_supplement_id, updated_at, dirty
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       womens_health_visible = excluded.womens_health_visible,
       health_sync_opt_in = excluded.health_sync_opt_in,
       lapse_pending = excluded.lapse_pending,
       editable_behaviour_ids = excluded.editable_behaviour_ids,
       editable_supplement_id = excluded.editable_supplement_id,
       updated_at = excluded.updated_at,
       dirty = excluded.dirty`,
    row.id,
    row.womens_health_visible,
    row.health_sync_opt_in,
    row.lapse_pending,
    row.editable_behaviour_ids,
    row.editable_supplement_id,
    row.updated_at,
    dirty
  );
}

export async function applyRemoteCheckinSettings(
  remote: RemoteCheckinSettingsRow
): Promise<void> {
  const db = getDatabase();
  const local = await db.getFirstAsync<LwwLocalRow>(
    'SELECT updated_at, dirty FROM checkin_settings WHERE id = ?',
    CHECKIN_SETTINGS_LOCAL_ID
  );

  if (shouldSkipRemoteApply(local, remote.updated_at)) {
    return;
  }

  await upsertLocalCheckinSettings({
    id: CHECKIN_SETTINGS_LOCAL_ID,
    womens_health_visible: remote.womens_health_visible ? 1 : 0,
    health_sync_opt_in: remote.health_sync_opt_in ? 1 : 0,
    lapse_pending: remote.lapse_pending ? 1 : 0,
    editable_behaviour_ids:
      remote.editable_behaviour_ids === null
        ? null
        : JSON.stringify(remote.editable_behaviour_ids),
    editable_supplement_id: remote.editable_supplement_id,
    updated_at: remote.updated_at,
    dirty: 0,
  });
}

export async function listDirtyCheckinSettings(): Promise<
  LocalCheckinSettingsRow[]
> {
  const row = await getLocalCheckinSettings();
  if (!row || row.dirty !== 1) {
    return [];
  }
  return [row];
}

export async function markCheckinSettingsClean(): Promise<void> {
  await getDatabase().runAsync(
    'UPDATE checkin_settings SET dirty = 0 WHERE id = ?',
    CHECKIN_SETTINGS_LOCAL_ID
  );
}

export async function clearAllCheckinSettings(): Promise<void> {
  await getDatabase().runAsync('DELETE FROM checkin_settings');
}

// --- Tracked behaviours ---

export async function listActiveTrackedBehaviours(): Promise<
  LocalTrackedBehaviourRow[]
> {
  const rows = await getDatabase().getAllAsync<SqliteTrackedBehaviourRow>(
    `SELECT ${TRACKED_BEHAVIOUR_COLUMNS}
     FROM checkin_tracked_behaviours
     WHERE deleted_at IS NULL
     ORDER BY sort_order ASC`
  );
  return rows.map(mapTrackedBehaviourRow);
}

export async function listDirtyTrackedBehaviours(): Promise<
  LocalTrackedBehaviourRow[]
> {
  const rows = await getDatabase().getAllAsync<SqliteTrackedBehaviourRow>(
    `SELECT ${TRACKED_BEHAVIOUR_COLUMNS}
     FROM checkin_tracked_behaviours
     WHERE dirty = 1`
  );
  return rows.map(mapTrackedBehaviourRow);
}

export async function getTrackedBehaviourByBehaviourId(
  behaviourId: string
): Promise<LocalTrackedBehaviourRow | null> {
  const row = await getDatabase().getFirstAsync<SqliteTrackedBehaviourRow>(
    `SELECT ${TRACKED_BEHAVIOUR_COLUMNS}
     FROM checkin_tracked_behaviours
     WHERE behaviour_id = ?`,
    behaviourId
  );
  return row ? mapTrackedBehaviourRow(row) : null;
}

export async function upsertLocalTrackedBehaviour(
  row: Omit<LocalTrackedBehaviourRow, 'dirty'> & { dirty?: 0 | 1 }
): Promise<void> {
  const dirty = row.dirty ?? 1;
  await getDatabase().runAsync(
    `INSERT INTO checkin_tracked_behaviours (
       id, behaviour_id, sort_order, sensitive, updated_at, deleted_at, dirty
     ) VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       behaviour_id = excluded.behaviour_id,
       sort_order = excluded.sort_order,
       sensitive = excluded.sensitive,
       updated_at = excluded.updated_at,
       deleted_at = excluded.deleted_at,
       dirty = excluded.dirty`,
    row.id,
    row.behaviour_id,
    row.sort_order,
    row.sensitive,
    row.updated_at,
    row.deleted_at,
    dirty
  );
}

export async function softDeleteTrackedBehaviour(
  id: string,
  deletedAt: string
): Promise<boolean> {
  const result = await getDatabase().runAsync(
    `UPDATE checkin_tracked_behaviours
     SET deleted_at = ?, updated_at = ?, dirty = 1
     WHERE id = ? AND deleted_at IS NULL`,
    deletedAt,
    deletedAt,
    id
  );
  return result.changes > 0;
}

export async function applyRemoteTrackedBehaviour(
  remote: RemoteTrackedBehaviourRow
): Promise<void> {
  const db = getDatabase();
  const byKey = await db.getFirstAsync<LwwLocalRow & { id: string }>(
    `SELECT id, updated_at, dirty
     FROM checkin_tracked_behaviours
     WHERE behaviour_id = ?`,
    remote.behaviour_id
  );

  if (byKey && shouldSkipRemoteApply(byKey, remote.updated_at)) {
    return;
  }

  if (byKey && byKey.id !== remote.id) {
    await db.runAsync(
      'DELETE FROM checkin_tracked_behaviours WHERE id = ?',
      byKey.id
    );
  } else if (!byKey) {
    const byId = await db.getFirstAsync<LwwLocalRow>(
      'SELECT updated_at, dirty FROM checkin_tracked_behaviours WHERE id = ?',
      remote.id
    );
    if (shouldSkipRemoteApply(byId, remote.updated_at)) {
      return;
    }
  }

  await upsertLocalTrackedBehaviour({
    id: remote.id,
    behaviour_id: remote.behaviour_id,
    sort_order: remote.sort_order,
    sensitive: remote.sensitive ? 1 : 0,
    updated_at: remote.updated_at,
    deleted_at: remote.deleted_at,
    dirty: 0,
  });
}

export async function markTrackedBehaviourRowsClean(
  ids: string[]
): Promise<void> {
  if (ids.length === 0) {
    return;
  }
  const db = getDatabase();
  await db.withTransactionAsync(async () => {
    for (const id of ids) {
      await db.runAsync(
        'UPDATE checkin_tracked_behaviours SET dirty = 0 WHERE id = ?',
        id
      );
    }
  });
}

export async function clearAllTrackedBehaviours(): Promise<void> {
  await getDatabase().runAsync('DELETE FROM checkin_tracked_behaviours');
}

// --- Behaviour entries ---

export async function listActiveBehaviourEntriesForDate(
  localDate: string
): Promise<LocalBehaviourEntryRow[]> {
  const rows = await getDatabase().getAllAsync<SqliteBehaviourEntryRow>(
    `SELECT ${BEHAVIOUR_ENTRY_COLUMNS}
     FROM checkin_behaviour_entries
     WHERE local_date = ? AND deleted_at IS NULL`,
    localDate
  );
  return rows.map(mapBehaviourEntryRow);
}

export async function listActiveBehaviourEntriesInRange(
  startDate: string,
  endDate: string
): Promise<LocalBehaviourEntryRow[]> {
  const rows = await getDatabase().getAllAsync<SqliteBehaviourEntryRow>(
    `SELECT ${BEHAVIOUR_ENTRY_COLUMNS}
     FROM checkin_behaviour_entries
     WHERE deleted_at IS NULL
       AND local_date >= ?
       AND local_date <= ?
     ORDER BY local_date ASC, behaviour_id ASC`,
    startDate,
    endDate
  );
  return rows.map(mapBehaviourEntryRow);
}

export async function listDirtyBehaviourEntries(_options?: {
  includeSensitive?: boolean;
}): Promise<LocalBehaviourEntryRow[]> {
  void _options;
  const rows = await getDatabase().getAllAsync<SqliteBehaviourEntryRow>(
    `SELECT ${BEHAVIOUR_ENTRY_COLUMNS}
     FROM checkin_behaviour_entries
     WHERE dirty = 1`
  );
  return rows.map(mapBehaviourEntryRow);
}

export async function getBehaviourEntryByKey(
  localDate: string,
  behaviourId: string
): Promise<LocalBehaviourEntryRow | null> {
  const row = await getDatabase().getFirstAsync<SqliteBehaviourEntryRow>(
    `SELECT ${BEHAVIOUR_ENTRY_COLUMNS}
     FROM checkin_behaviour_entries
     WHERE local_date = ? AND behaviour_id = ?`,
    localDate,
    behaviourId
  );
  return row ? mapBehaviourEntryRow(row) : null;
}

export async function upsertLocalBehaviourEntry(
  row: Omit<LocalBehaviourEntryRow, 'dirty'> & { dirty?: 0 | 1 }
): Promise<void> {
  const dirty = row.dirty ?? 1;
  await getDatabase().runAsync(
    `INSERT INTO checkin_behaviour_entries (
       id, local_date, behaviour_id, value, logged_at, source, sensitive,
       updated_at, deleted_at, dirty
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       local_date = excluded.local_date,
       behaviour_id = excluded.behaviour_id,
       value = excluded.value,
       logged_at = excluded.logged_at,
       source = excluded.source,
       sensitive = excluded.sensitive,
       updated_at = excluded.updated_at,
       deleted_at = excluded.deleted_at,
       dirty = excluded.dirty`,
    row.id,
    row.local_date,
    row.behaviour_id,
    row.value,
    row.logged_at,
    row.source,
    row.sensitive,
    row.updated_at,
    row.deleted_at,
    dirty
  );
}

export async function softDeleteBehaviourEntry(
  id: string,
  deletedAt: string
): Promise<boolean> {
  const result = await getDatabase().runAsync(
    `UPDATE checkin_behaviour_entries
     SET deleted_at = ?, updated_at = ?, dirty = 1
     WHERE id = ? AND deleted_at IS NULL`,
    deletedAt,
    deletedAt,
    id
  );
  return result.changes > 0;
}

export async function applyRemoteBehaviourEntry(
  remote: RemoteBehaviourEntryRow
): Promise<void> {
  const db = getDatabase();
  const byKey = await db.getFirstAsync<LwwLocalRow & { id: string }>(
    `SELECT id, updated_at, dirty
     FROM checkin_behaviour_entries
     WHERE local_date = ? AND behaviour_id = ?`,
    remote.local_date,
    remote.behaviour_id
  );

  if (byKey && shouldSkipRemoteApply(byKey, remote.updated_at)) {
    return;
  }

  if (byKey && byKey.id !== remote.id) {
    await db.runAsync(
      'DELETE FROM checkin_behaviour_entries WHERE id = ?',
      byKey.id
    );
  } else if (!byKey) {
    const byId = await db.getFirstAsync<LwwLocalRow>(
      'SELECT updated_at, dirty FROM checkin_behaviour_entries WHERE id = ?',
      remote.id
    );
    if (shouldSkipRemoteApply(byId, remote.updated_at)) {
      return;
    }
  }

  await upsertLocalBehaviourEntry({
    id: remote.id,
    local_date: remote.local_date,
    behaviour_id: remote.behaviour_id,
    value: remoteBehaviourEntryValueToStorage(remote.value),
    logged_at: remote.logged_at,
    source: remote.source,
    sensitive: remote.sensitive ? 1 : 0,
    updated_at: remote.updated_at,
    deleted_at: remote.deleted_at,
    dirty: 0,
  });
}

export async function markBehaviourEntryRowsClean(
  ids: string[]
): Promise<void> {
  if (ids.length === 0) {
    return;
  }
  const db = getDatabase();
  await db.withTransactionAsync(async () => {
    for (const id of ids) {
      await db.runAsync(
        'UPDATE checkin_behaviour_entries SET dirty = 0 WHERE id = ?',
        id
      );
    }
  });
}

export async function clearAllBehaviourEntries(): Promise<void> {
  await getDatabase().runAsync('DELETE FROM checkin_behaviour_entries');
}

// --- Supplements ---

export async function listActiveSupplements(): Promise<LocalSupplementRow[]> {
  const rows = await getDatabase().getAllAsync<SqliteSupplementRow>(
    `SELECT ${SUPPLEMENT_COLUMNS}
     FROM checkin_supplements
     WHERE deleted_at IS NULL
     ORDER BY name ASC`
  );
  return rows.map(mapSupplementRow);
}

export async function listDirtySupplements(): Promise<LocalSupplementRow[]> {
  const rows = await getDatabase().getAllAsync<SqliteSupplementRow>(
    `SELECT ${SUPPLEMENT_COLUMNS}
     FROM checkin_supplements
     WHERE dirty = 1`
  );
  return rows.map(mapSupplementRow);
}

export async function getSupplementById(
  id: string
): Promise<LocalSupplementRow | null> {
  const row = await getDatabase().getFirstAsync<SqliteSupplementRow>(
    `SELECT ${SUPPLEMENT_COLUMNS}
     FROM checkin_supplements
     WHERE id = ?`,
    id
  );
  return row ? mapSupplementRow(row) : null;
}

export async function upsertLocalSupplement(
  row: Omit<LocalSupplementRow, 'dirty'> & { dirty?: 0 | 1 }
): Promise<void> {
  const dirty = row.dirty ?? 1;
  await getDatabase().runAsync(
    `INSERT INTO checkin_supplements (
       id, name, brand, form, dose_amount, dose_unit, notes, schedule,
       reminders_enabled, status, created_at, updated_at, deleted_at, dirty
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       name = excluded.name,
       brand = excluded.brand,
       form = excluded.form,
       dose_amount = excluded.dose_amount,
       dose_unit = excluded.dose_unit,
       notes = excluded.notes,
       schedule = excluded.schedule,
       reminders_enabled = excluded.reminders_enabled,
       status = excluded.status,
       created_at = excluded.created_at,
       updated_at = excluded.updated_at,
       deleted_at = excluded.deleted_at,
       dirty = excluded.dirty`,
    row.id,
    row.name,
    row.brand,
    row.form,
    row.dose_amount,
    row.dose_unit,
    row.notes,
    row.schedule,
    row.reminders_enabled,
    row.status,
    row.created_at,
    row.updated_at,
    row.deleted_at,
    dirty
  );
}

/** Tombstone a supplement and scrub identifying fields so they leave the backup. */
export async function softDeleteSupplement(
  id: string,
  deletedAt: string
): Promise<boolean> {
  const result = await getDatabase().runAsync(
    `UPDATE checkin_supplements
     SET name = '',
         brand = NULL,
         notes = NULL,
         reminders_enabled = 0,
         schedule = ?,
         status = 'archived',
         deleted_at = ?,
         updated_at = ?,
         dirty = 1
     WHERE id = ? AND deleted_at IS NULL`,
    JSON.stringify({
      type: 'as_needed',
      times: [],
      startDate: '1970-01-01',
    }),
    deletedAt,
    deletedAt,
    id
  );
  return result.changes > 0;
}

export async function softDeleteSupplementLogsForSupplement(
  supplementId: string,
  deletedAt: string
): Promise<number> {
  const result = await getDatabase().runAsync(
    `UPDATE checkin_supplement_logs
     SET deleted_at = ?, updated_at = ?, dirty = 1
     WHERE supplement_id = ? AND deleted_at IS NULL`,
    deletedAt,
    deletedAt,
    supplementId
  );
  return result.changes;
}

export async function applyRemoteSupplement(
  remote: RemoteSupplementRow
): Promise<void> {
  const db = getDatabase();
  const local = await db.getFirstAsync<LwwLocalRow>(
    'SELECT updated_at, dirty FROM checkin_supplements WHERE id = ?',
    remote.id
  );

  if (shouldSkipRemoteApply(local, remote.updated_at)) {
    return;
  }

  await upsertLocalSupplement({
    id: remote.id,
    name: remote.name,
    brand: remote.brand,
    form: remote.form,
    dose_amount: remote.dose_amount,
    dose_unit: remote.dose_unit,
    notes: remote.notes,
    schedule: JSON.stringify(remote.schedule),
    reminders_enabled: remote.reminders_enabled ? 1 : 0,
    status: remote.status,
    created_at: remote.created_at,
    updated_at: remote.updated_at,
    deleted_at: remote.deleted_at,
    dirty: 0,
  });
}

export async function markSupplementRowsClean(ids: string[]): Promise<void> {
  if (ids.length === 0) {
    return;
  }
  const db = getDatabase();
  await db.withTransactionAsync(async () => {
    for (const id of ids) {
      await db.runAsync(
        'UPDATE checkin_supplements SET dirty = 0 WHERE id = ?',
        id
      );
    }
  });
}

export async function clearAllSupplements(): Promise<void> {
  await getDatabase().runAsync('DELETE FROM checkin_supplements');
}

// --- Supplement logs ---

export async function listActiveSupplementLogsForDate(
  localDate: string
): Promise<LocalSupplementLogRow[]> {
  const rows = await getDatabase().getAllAsync<SqliteSupplementLogRow>(
    `SELECT ${SUPPLEMENT_LOG_COLUMNS}
     FROM checkin_supplement_logs
     WHERE local_date = ? AND deleted_at IS NULL`,
    localDate
  );
  return rows.map(mapSupplementLogRow);
}

export async function listActiveSupplementLogsInRange(
  startDate: string,
  endDate: string
): Promise<LocalSupplementLogRow[]> {
  const rows = await getDatabase().getAllAsync<SqliteSupplementLogRow>(
    `SELECT ${SUPPLEMENT_LOG_COLUMNS}
     FROM checkin_supplement_logs
     WHERE deleted_at IS NULL
       AND local_date >= ?
       AND local_date <= ?
     ORDER BY local_date ASC, supplement_id ASC, scheduled_time ASC`,
    startDate,
    endDate
  );
  return rows.map(mapSupplementLogRow);
}

export async function listDirtySupplementLogs(): Promise<
  LocalSupplementLogRow[]
> {
  const rows = await getDatabase().getAllAsync<SqliteSupplementLogRow>(
    `SELECT ${SUPPLEMENT_LOG_COLUMNS}
     FROM checkin_supplement_logs
     WHERE dirty = 1`
  );
  return rows.map(mapSupplementLogRow);
}

export async function getSupplementLogByKey(
  localDate: string,
  supplementId: string,
  scheduledTime: string
): Promise<LocalSupplementLogRow | null> {
  const row = await getDatabase().getFirstAsync<SqliteSupplementLogRow>(
    `SELECT ${SUPPLEMENT_LOG_COLUMNS}
     FROM checkin_supplement_logs
     WHERE local_date = ? AND supplement_id = ? AND scheduled_time = ?`,
    localDate,
    supplementId,
    scheduledTime
  );
  return row ? mapSupplementLogRow(row) : null;
}

export async function upsertLocalSupplementLog(
  row: Omit<LocalSupplementLogRow, 'dirty'> & { dirty?: 0 | 1 }
): Promise<void> {
  const dirty = row.dirty ?? 1;
  await getDatabase().runAsync(
    `INSERT INTO checkin_supplement_logs (
       id, local_date, supplement_id, scheduled_time, status, actioned_at,
       updated_at, deleted_at, dirty
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       local_date = excluded.local_date,
       supplement_id = excluded.supplement_id,
       scheduled_time = excluded.scheduled_time,
       status = excluded.status,
       actioned_at = excluded.actioned_at,
       updated_at = excluded.updated_at,
       deleted_at = excluded.deleted_at,
       dirty = excluded.dirty`,
    row.id,
    row.local_date,
    row.supplement_id,
    row.scheduled_time,
    row.status,
    row.actioned_at,
    row.updated_at,
    row.deleted_at,
    dirty
  );
}

export async function softDeleteSupplementLog(
  id: string,
  deletedAt: string
): Promise<boolean> {
  const result = await getDatabase().runAsync(
    `UPDATE checkin_supplement_logs
     SET deleted_at = ?, updated_at = ?, dirty = 1
     WHERE id = ? AND deleted_at IS NULL`,
    deletedAt,
    deletedAt,
    id
  );
  return result.changes > 0;
}

export async function applyRemoteSupplementLog(
  remote: RemoteSupplementLogRow
): Promise<void> {
  const db = getDatabase();
  const byKey = await db.getFirstAsync<LwwLocalRow & { id: string }>(
    `SELECT id, updated_at, dirty
     FROM checkin_supplement_logs
     WHERE local_date = ? AND supplement_id = ? AND scheduled_time = ?`,
    remote.local_date,
    remote.supplement_id,
    remote.scheduled_time
  );

  if (byKey && shouldSkipRemoteApply(byKey, remote.updated_at)) {
    return;
  }

  if (byKey && byKey.id !== remote.id) {
    await db.runAsync(
      'DELETE FROM checkin_supplement_logs WHERE id = ?',
      byKey.id
    );
  } else if (!byKey) {
    const byId = await db.getFirstAsync<LwwLocalRow>(
      'SELECT updated_at, dirty FROM checkin_supplement_logs WHERE id = ?',
      remote.id
    );
    if (shouldSkipRemoteApply(byId, remote.updated_at)) {
      return;
    }
  }

  await upsertLocalSupplementLog({
    id: remote.id,
    local_date: remote.local_date,
    supplement_id: remote.supplement_id,
    scheduled_time: remote.scheduled_time,
    status: remote.status,
    actioned_at: remote.actioned_at,
    updated_at: remote.updated_at,
    deleted_at: remote.deleted_at,
    dirty: 0,
  });
}

export async function markSupplementLogRowsClean(ids: string[]): Promise<void> {
  if (ids.length === 0) {
    return;
  }
  const db = getDatabase();
  await db.withTransactionAsync(async () => {
    for (const id of ids) {
      await db.runAsync(
        'UPDATE checkin_supplement_logs SET dirty = 0 WHERE id = ?',
        id
      );
    }
  });
}

export async function clearAllSupplementLogs(): Promise<void> {
  await getDatabase().runAsync('DELETE FROM checkin_supplement_logs');
}

export async function clearAllCheckinTables(): Promise<void> {
  const db = getDatabase();
  await db.withTransactionAsync(async () => {
    await clearAllCheckinSettings();
    await clearAllTrackedBehaviours();
    await clearAllBehaviourEntries();
    await clearAllSupplements();
    await clearAllSupplementLogs();
  });
}
