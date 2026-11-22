import { getSupabaseClient } from '@/src/services/supabaseClient';

/** Postgres errors that mean this row cannot be saved as sent. */
const PERMANENT_WRITE_CODES = new Set([
  '22P02', // invalid_text_representation (for example a non-uuid id)
  '22007', // invalid_datetime_format
  '22008', // datetime_field_overflow
  '23502', // not_null_violation
  '23503', // foreign_key_violation
  '23505', // unique_violation
  '23514', // check_violation
]);

const PAGE_SIZE = 1000;
const MAX_PAGES = 50;

/** Rows that failed a permanent write. Skipped until the next app launch. */
const quarantinedKeys = new Set<string>();

export function quarantineKey(key: string): void {
  quarantinedKeys.add(key);
}

export function isQuarantined(key: string): boolean {
  return quarantinedKeys.has(key);
}

export function resetSyncQuarantineForTests(): void {
  quarantinedKeys.clear();
}

export function syncErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string' &&
    error.message.trim().length > 0
  ) {
    return error.message;
  }
  return 'Account backup failed.';
}

export function syncErrorCode(error: unknown): string | null {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string' &&
    error.code.length > 0
  ) {
    return error.code;
  }
  return null;
}

export function isPermanentSyncWriteError(error: unknown): boolean {
  const code = syncErrorCode(error);
  return code !== null && PERMANENT_WRITE_CODES.has(code);
}

/** Null when missing. Invalid values become null so a bad clock does not delete a row. */
export function coerceSyncTimestamp(
  value: string | null | undefined
): string | null {
  if (value == null || value.trim().length === 0) return null;
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return null;
  return new Date(parsed).toISOString();
}

export function requireSyncTimestamp(value: string | null | undefined): string {
  return coerceSyncTimestamp(value) ?? new Date().toISOString();
}

export type RejectedSyncRow = {
  id: string;
  message: string;
};

export type UpsertAcceptance = {
  acceptedIds: string[];
  rejected: RejectedSyncRow[];
};

/**
 * Upserts the batch. A permanent error is split down to the bad row so the
 * rest of the batch still saves. A network or auth error is thrown so the
 * caller can retry the whole step.
 */
export async function upsertUntilAccepted<T>(
  rows: T[],
  upsert: (batch: T[]) => Promise<{ error: unknown }>,
  idOf: (row: T) => string
): Promise<UpsertAcceptance> {
  if (rows.length === 0) {
    return { acceptedIds: [], rejected: [] };
  }

  const { error } = await upsert(rows);
  if (!error) {
    return { acceptedIds: rows.map(idOf), rejected: [] };
  }
  if (!isPermanentSyncWriteError(error) || rows.length === 1) {
    if (!isPermanentSyncWriteError(error)) {
      throw error;
    }
    return {
      acceptedIds: [],
      rejected: [{ id: idOf(rows[0]!), message: syncErrorMessage(error) }],
    };
  }

  const middle = Math.ceil(rows.length / 2);
  const left = await upsertUntilAccepted(rows.slice(0, middle), upsert, idOf);
  const right = await upsertUntilAccepted(rows.slice(middle), upsert, idOf);
  return {
    acceptedIds: [...left.acceptedIds, ...right.acceptedIds],
    rejected: [...left.rejected, ...right.rejected],
  };
}

export async function pushRows<T>(input: {
  table: string;
  rows: T[];
  onConflict: string;
  idOf: (row: T) => string;
  batchSize: number;
  markClean: (ids: string[]) => Promise<void>;
}): Promise<void> {
  const pending = input.rows.filter(
    (row) => !isQuarantined(`${input.table}:${input.idOf(row)}`)
  );
  if (pending.length === 0) return;

  const client = getSupabaseClient();
  const acceptedIds: string[] = [];
  for (let index = 0; index < pending.length; index += input.batchSize) {
    const batch = pending.slice(index, index + input.batchSize);
    const result = await upsertUntilAccepted(
      batch,
      async (slice) => {
        const { error } = await client
          .from(input.table)
          .upsert(slice as never[], { onConflict: input.onConflict });
        return { error };
      },
      input.idOf
    );
    acceptedIds.push(...result.acceptedIds);
    for (const rejected of result.rejected) {
      quarantineKey(`${input.table}:${rejected.id}`);
      console.error(
        `Backup skipped ${input.table} row ${rejected.id}: ${rejected.message}`
      );
    }
  }
  if (acceptedIds.length > 0) {
    await input.markClean(acceptedIds);
  }
}

export async function readAllPages<T>(
  readPage: (
    from: number,
    to: number
  ) => PromiseLike<{ data: unknown; error: unknown }>
): Promise<T[]> {
  const rows: T[] = [];
  for (let page = 0; page < MAX_PAGES; page += 1) {
    const from = page * PAGE_SIZE;
    const { data, error } = await readPage(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    const batch = Array.isArray(data) ? (data as T[]) : [];
    rows.push(...batch);
    if (batch.length < PAGE_SIZE) return rows;
  }
  return rows;
}
