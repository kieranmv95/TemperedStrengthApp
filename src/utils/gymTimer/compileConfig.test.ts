import { compileConfig } from './compileConfig';
import { advanceRuntime, formatGymTimerDigits, getDisplay } from './clock';
import {
  createReadyRuntime,
  pauseRuntime,
  resumeRuntime,
  startRuntime,
} from './createRuntime';

describe('compileConfig', () => {
  it('adds a 10s lead-in by default', () => {
    const segments = compileConfig({
      v: 1,
      type: 'AMRAP',
      config: { durationSec: 600 },
    });
    expect(segments[0]).toMatchObject({
      phase: 'LEAD_IN',
      durationSec: 10,
    });
    expect(segments[1]).toMatchObject({
      phase: 'WORK',
      durationSec: 600,
    });
  });

  it('skips lead-in when leadInSec is 0', () => {
    const segments = compileConfig({
      v: 1,
      leadInSec: 0,
      type: 'COUNTDOWN',
      config: { durationSec: 90 },
    });
    expect(segments).toHaveLength(1);
    expect(segments[0].phase).toBe('WORK');
  });

  it('compiles classic Tabata 8x20/10', () => {
    const segments = compileConfig({
      v: 1,
      leadInSec: 0,
      type: 'TABATA',
      config: { rounds: 8, workSec: 20, restSec: 10 },
    });
    // 8 work + 7 rest (no rest after last)
    expect(segments).toHaveLength(15);
    expect(segments.filter((s) => s.phase === 'WORK')).toHaveLength(8);
    expect(segments.filter((s) => s.phase === 'REST')).toHaveLength(7);
  });

  it('compiles EMOM as N work intervals', () => {
    const segments = compileConfig({
      v: 1,
      leadInSec: 0,
      type: 'EMOM',
      config: { rounds: 10, intervalSec: 60 },
    });
    expect(segments).toHaveLength(10);
    expect(segments.every((s) => s.durationSec === 60)).toBe(true);
  });

  it('compiles open-ended rounds with rest between', () => {
    const segments = compileConfig({
      v: 1,
      leadInSec: 0,
      type: 'ROUNDS',
      config: { rounds: 3, workSec: 0, restSec: 60 },
    });
    expect(segments).toHaveLength(5); // W R W R W
    expect(segments[0].openEnded).toBe(true);
    expect(segments[1]).toMatchObject({ phase: 'REST', durationSec: 60 });
  });

  it('compiles INTERVALS with repeats', () => {
    const segments = compileConfig({
      v: 1,
      leadInSec: 0,
      type: 'INTERVALS',
      config: {
        segments: [
          { phase: 'WORK', durationSec: 40 },
          { phase: 'REST', durationSec: 20 },
        ],
        repeats: 2,
      },
    });
    expect(segments).toHaveLength(4);
  });
});

describe('timestamp clock', () => {
  it('counts down from timestamps without drift across pause', () => {
    const ready = createReadyRuntime({
      v: 1,
      leadInSec: 0,
      type: 'COUNTDOWN',
      config: { durationSec: 60 },
    });
    const t0 = 1_000_000;
    let runtime = startRuntime(ready, t0);
    expect(getDisplay(runtime, t0 + 10_000).displaySec).toBe(50);

    runtime = pauseRuntime(runtime, t0 + 10_000);
    runtime = resumeRuntime(runtime, t0 + 60_000);
    expect(getDisplay(runtime, t0 + 70_000).displaySec).toBe(40);
  });

  it('advances to done when segment completes', () => {
    const ready = createReadyRuntime({
      v: 1,
      leadInSec: 0,
      type: 'REST',
      config: { durationSec: 5 },
    });
    const t0 = 5_000;
    let runtime = startRuntime(ready, t0);
    const result = advanceRuntime(runtime, t0 + 5_000);
    expect(result.finished).toBe(true);
    expect(result.runtime.lifecycle).toBe('done');
  });

  it('formats past 99:59 as H:MM:SS', () => {
    expect(formatGymTimerDigits(100 * 60)).toBe('1:40:00');
    expect(formatGymTimerDigits(90)).toBe('01:30');
  });
});
