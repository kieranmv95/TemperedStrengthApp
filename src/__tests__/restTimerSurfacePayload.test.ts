import { buildRestTimerSurfacePayload } from '@/src/utils/restTimerSurfacePayload';
import type { RestTimerState } from '@/src/types/storage';

describe('buildRestTimerSurfacePayload', () => {
  const timer: RestTimerState = {
    dayIndex: 0,
    slotIndex: 1,
    exerciseId: null,
    restTimeSeconds: 90,
    startedAt: Date.parse('2026-10-16T10:00:00.000Z'),
    status: 'running',
  };

  it('builds running payload with end timestamp and Rest label', () => {
    const payload = buildRestTimerSurfacePayload(timer);

    expect(payload.status).toBe('running');
    expect(payload.label).toBe('Rest');
    expect(payload.startedAtMs).toBe(timer.startedAt);
    expect(payload.endTimeMs).toBe(timer.startedAt + 90_000);
    expect(payload.untilLabel.length).toBeGreaterThan(0);
  });

  it('maps completed timer status to complete', () => {
    const payload = buildRestTimerSurfacePayload({
      ...timer,
      status: 'completed',
      completedAt: timer.startedAt + 90_000,
    });

    expect(payload.status).toBe('complete');
  });
});
