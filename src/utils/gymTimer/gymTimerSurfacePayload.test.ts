import { buildGymTimerSurfacePayload } from './gymTimerSurfacePayload';
import { createReadyRuntime, startRuntime } from './createRuntime';

describe('buildGymTimerSurfacePayload', () => {
  it('builds a countdown payload for AMRAP', () => {
    const ready = createReadyRuntime({
      v: 1,
      leadInSec: 0,
      type: 'AMRAP',
      config: { durationSec: 600 },
    });
    const t0 = 1_000_000;
    const runtime = startRuntime(ready, t0);
    const payload = buildGymTimerSurfacePayload(runtime, t0);
    expect(payload).toMatchObject({
      title: 'AR',
      status: 'running',
      startedAtMs: t0,
      endTimeMs: t0 + 600_000,
    });
    expect(payload?.url).toContain('tools/timers');
  });

  it('returns null for open-ended count up', () => {
    const ready = createReadyRuntime({
      v: 1,
      leadInSec: 0,
      type: 'COUNTUP',
      config: {},
    });
    const runtime = startRuntime(ready, 1000);
    expect(buildGymTimerSurfacePayload(runtime, 1000)).toBeNull();
  });
});
