import { decideWinner } from '../sync/decision';

describe('sync decision', () => {
  it('prefers iCloud when local missing and iCloud has value', () => {
    const winner = decideWinner({
      key: 'k1',
      local: { value: null, ts: 0 },
      icloud: { value: 'v', ts: 0, deleted: false },
    });
    expect(winner).toEqual({ kind: 'icloud' });
  });

  it('prefers local when iCloud missing and local has value', () => {
    const winner = decideWinner({
      key: 'k1',
      local: { value: 'v', ts: 0 },
      icloud: { value: null, ts: 0, deleted: false },
    });
    expect(winner).toEqual({ kind: 'local' });
  });

  it('uses timestamps when both sides have data', () => {
    const winner = decideWinner({
      key: 'k1',
      local: { value: 'v1', ts: 20 },
      icloud: { value: 'v2', ts: 10, deleted: false },
    });
    expect(winner).toEqual({ kind: 'local' });
  });

  it('treats iCloud tombstone as data presence', () => {
    const winner = decideWinner({
      key: 'k1',
      local: { value: null, ts: 0 },
      icloud: { value: null, ts: 10, deleted: true },
    });
    expect(winner).toEqual({ kind: 'icloud' });
  });

  it('flags conflict on equal timestamps', () => {
    const winner = decideWinner({
      key: 'k1',
      local: { value: 'v1', ts: 10 },
      icloud: { value: 'v2', ts: 10, deleted: false },
    });
    expect(winner.kind).toBe('conflict');
    if (winner.kind === 'conflict') {
      expect(winner.conflict.reason).toBe('timestamp_equal');
      expect(winner.conflict.key).toBe('k1');
    }
  });
});

