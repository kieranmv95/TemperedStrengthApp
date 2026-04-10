import type { SyncConflict } from './types';

export type SyncComparison = {
  key: string;
  local: { value: string | null; ts: number };
  icloud: { value: string | null; ts: number; deleted: boolean };
};

export type SyncWinner =
  | { kind: 'local' }
  | { kind: 'icloud' }
  | { kind: 'conflict'; conflict: SyncConflict };

function hasData(value: string | null): boolean {
  return value !== null;
}

function effectiveCloudValue(input: SyncComparison['icloud']): string | null {
  return input.deleted ? null : input.value;
}

export function decideWinner(input: SyncComparison): SyncWinner {
  const { local, icloud, key } = input;

  const localHas = hasData(local.value);
  const cloudHas = hasData(icloud.value) || icloud.deleted;

  if (!localHas && cloudHas) {
    return { kind: 'icloud' };
  }
  if (localHas && !cloudHas) {
    return { kind: 'local' };
  }

  const localTs = Number.isFinite(local.ts) ? local.ts : 0;
  const cloudTs = Number.isFinite(icloud.ts) ? icloud.ts : 0;

  if (localTs > cloudTs) return { kind: 'local' };
  if (cloudTs > localTs) return { kind: 'icloud' };

  const cloudValue = effectiveCloudValue(icloud);
  if (local.value === cloudValue) {
    // Timestamps may be equal/unknown; if the values match, there is no real conflict.
    return { kind: 'icloud' };
  }

  const reason: SyncConflict['reason'] =
    localTs === cloudTs && (localTs > 0 || cloudTs > 0)
      ? 'timestamp_equal'
      : 'timestamp_unknown';

  return {
    kind: 'conflict',
    conflict: {
      key,
      reason,
      local: { value: local.value, ts: localTs },
      icloud: {
        value: cloudValue,
        ts: cloudTs,
        deleted: icloud.deleted,
      },
    },
  };
}

