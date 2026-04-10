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

  const reason: SyncConflict['reason'] =
    localTs === cloudTs ? 'timestamp_equal' : 'timestamp_unknown';

  return {
    kind: 'conflict',
    conflict: {
      key,
      reason,
      local: { value: local.value, ts: localTs },
      icloud: {
        value: icloud.value,
        ts: cloudTs,
        deleted: icloud.deleted,
      },
    },
  };
}

