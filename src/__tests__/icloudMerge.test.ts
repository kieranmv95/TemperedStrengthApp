import { createEnvelope } from '@/src/services/icloudSync/domains';
import { mergeDomain } from '@/src/services/icloudSync/registry';

describe('iCloud sync merge', () => {
  it('unions favorites and sorts', () => {
    const local = createEnvelope({
      deviceId: 'a',
      updatedAt: '2026-01-01T00:00:00.000Z',
      payload: { favorites: ['w2', 'w1'] },
    });
    const remote = createEnvelope({
      deviceId: 'b',
      updatedAt: '2026-01-02T00:00:00.000Z',
      payload: { favorites: ['w3', 'w1'] },
    });

    const { merged } = mergeDomain({
      domain: 'program_favorites',
      local,
      remote,
      deviceId: 'a',
    });

    expect(merged.payload.favorites).toEqual(['w1', 'w2', 'w3']);
  });

  it('deep-merges maps and resolves leaf conflicts by newer updatedAt', () => {
    const local = createEnvelope({
      deviceId: 'a',
      updatedAt: '2026-01-01T00:00:00.000Z',
      payload: { 1: { 0: 10 } },
    });
    const remote = createEnvelope({
      deviceId: 'b',
      updatedAt: '2026-01-03T00:00:00.000Z',
      payload: { 1: { 0: 11, 1: 12 }, 2: { 0: 20 } },
    });

    const { merged } = mergeDomain({
      domain: 'program_swaps',
      local,
      remote,
      deviceId: 'a',
    });

    expect(merged.payload).toEqual({ 1: { 0: 11, 1: 12 }, 2: { 0: 20 } });
  });

  it('merges tracked metrics by max (avoids double-counting)', () => {
    const local = createEnvelope({
      deviceId: 'a',
      updatedAt: '2026-01-01T00:00:00.000Z',
      payload: { tracked: { sets_logged: 5, articles_read: 2 } },
    });
    const remote = createEnvelope({
      deviceId: 'b',
      updatedAt: '2026-01-02T00:00:00.000Z',
      payload: { tracked: { sets_logged: 3, articles_read: 7, brief_visits: 1 } },
    });

    const { merged } = mergeDomain({
      domain: 'metrics_tracked',
      local,
      remote,
      deviceId: 'a',
    });

    expect(merged.payload.tracked).toEqual({
      sets_logged: 5,
      articles_read: 7,
      brief_visits: 1,
    });
  });
});

