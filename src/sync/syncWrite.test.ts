import { newCheckinId } from '@/src/db/domains/checkin/types';
import { createUuid, isUuid } from '@/src/utils/uuid';
import {
  coerceSyncTimestamp,
  isPermanentSyncWriteError,
  readAllPages,
  requireSyncTimestamp,
  upsertUntilAccepted,
} from './syncWrite';

describe('sync writes', () => {
  it('accepts a uuid and rejects the legacy check-in id shape', () => {
    expect(isUuid(createUuid())).toBe(true);
    expect(isUuid(newCheckinId())).toBe(true);
    expect(isUuid('checkin_1710000000000_abc')).toBe(false);
  });

  it('still mints a uuid when randomUUID is unavailable', () => {
    const original = globalThis.crypto;
    Object.defineProperty(globalThis, 'crypto', {
      configurable: true,
      value: undefined,
    });
    try {
      expect(isUuid(createUuid())).toBe(true);
      expect(isUuid(newCheckinId())).toBe(true);
    } finally {
      Object.defineProperty(globalThis, 'crypto', {
        configurable: true,
        value: original,
      });
    }
  });

  it('coerces invalid timestamps and keeps valid ones', () => {
    expect(coerceSyncTimestamp(null)).toBeNull();
    expect(coerceSyncTimestamp('not-a-date')).toBeNull();
    expect(coerceSyncTimestamp('2024-01-02T03:04:05.000Z')).toBe(
      '2024-01-02T03:04:05.000Z'
    );
    expect(requireSyncTimestamp('not-a-date')).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('treats constraint failures as permanent and network failures as retryable', () => {
    expect(
      isPermanentSyncWriteError({ code: '22P02', message: 'bad uuid' })
    ).toBe(true);
    expect(isPermanentSyncWriteError({ code: '23514', message: 'check' })).toBe(
      true
    );
    expect(isPermanentSyncWriteError({ message: 'Failed to fetch' })).toBe(
      false
    );
  });

  it('saves the good rows when one row in the batch is rejected', async () => {
    const calls: string[][] = [];
    const result = await upsertUntilAccepted(
      [{ id: 'ok-1' }, { id: 'bad' }, { id: 'ok-2' }],
      async (batch) => {
        calls.push(batch.map((row) => row.id));
        if (batch.some((row) => row.id === 'bad')) {
          return { error: { code: '22P02', message: 'invalid input syntax' } };
        }
        return { error: null };
      },
      (row) => row.id
    );

    expect(result.acceptedIds.sort()).toEqual(['ok-1', 'ok-2']);
    expect(result.rejected).toEqual([
      { id: 'bad', message: 'invalid input syntax' },
    ]);
    expect(
      calls.some((batch) => batch.length === 1 && batch[0] === 'ok-1')
    ).toBe(true);
  });

  it('does not keep splitting when the request itself failed', async () => {
    let calls = 0;
    await expect(
      upsertUntilAccepted(
        [{ id: 'a' }, { id: 'b' }],
        async () => {
          calls += 1;
          return { error: { message: 'Failed to fetch' } };
        },
        (row) => row.id
      )
    ).rejects.toEqual({ message: 'Failed to fetch' });
    expect(calls).toBe(1);
  });

  it('pages until a short page comes back', async () => {
    const rows = await readAllPages<number>(async (from, to) => {
      if (from === 0) {
        return {
          data: Array.from({ length: to - from + 1 }, (_, i) => i),
          error: null,
        };
      }
      return { data: [1000], error: null };
    });
    expect(rows).toHaveLength(1001);
    expect(rows[1000]).toBe(1000);
  });
});
