import type { WorkoutLogs } from '@/src/types/storage';
import {
  collapseRowsToWorkoutLogs,
  expandWorkoutLogsBlobToRows,
  parseWorkoutLogsStore,
} from '@/src/db/domains/workoutLogs/codec';
import { workoutLogSetId } from '@/src/db/domains/workoutLogs/types';

describe('workout logs codec', () => {
  const updatedAt = '2026-06-01T12:00:00.000Z';

  const sample: WorkoutLogs = {
    0: {
      0: {
        0: { weight: 100, reps: 5, state: 'completed' },
        1: { weight: 100, reps: 5 },
      },
      1: {
        0: { weight: null, reps: 10, state: 'failed' },
      },
    },
    3: {
      2: {
        0: { weight: 60, reps: 8, state: null },
      },
    },
  };

  it('builds deterministic row ids', () => {
    expect(workoutLogSetId(12, 3, 1)).toBe('wls_12_3_1');
  });

  it('expands one row per set', () => {
    const rows = expandWorkoutLogsBlobToRows(sample, updatedAt);
    expect(rows).toHaveLength(4);
    expect(rows.find((r) => r.id === 'wls_0_1_0')).toMatchObject({
      day_index: 0,
      slot_index: 1,
      set_index: 0,
      weight: null,
      reps: 10,
      state: 'failed',
      updated_at: updatedAt,
      deleted_at: null,
    });
  });

  it('round-trips expand → collapse', () => {
    const withExplicitStates: WorkoutLogs = {
      0: {
        0: {
          0: { weight: 100, reps: 5, state: 'completed' },
          1: { weight: 100, reps: 5, state: null },
        },
      },
    };
    const rows = expandWorkoutLogsBlobToRows(withExplicitStates, updatedAt);
    const restored = collapseRowsToWorkoutLogs(rows);
    expect(restored).toEqual(withExplicitStates);
  });

  it('parses and rejects junk store JSON', () => {
    expect(parseWorkoutLogsStore(JSON.stringify(sample))).toEqual(sample);
    expect(parseWorkoutLogsStore(null)).toEqual({});
    expect(parseWorkoutLogsStore('[]')).toEqual({});
    expect(parseWorkoutLogsStore('not-json')).toEqual({});
  });
});
