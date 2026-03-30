import type { StandaloneLogPayload } from '@/src/types/standaloneWorkoutLogs';
import type { WorkoutLogSchema } from '@/src/types/workouts';
import {
  formatDurationSeconds,
  formatStandaloneLogCardTimestamp,
  formatStandaloneLogLoggedAt,
  formatStandaloneLogSummary,
  parseDurationInputToSeconds,
} from '@/src/utils/standaloneWorkoutLogFormat';

describe('formatDurationSeconds', () => {
  it('formats zero', () => {
    expect(formatDurationSeconds(0)).toBe('0:00');
  });

  it('formats under a minute', () => {
    expect(formatDurationSeconds(59)).toBe('0:59');
  });

  it('formats exactly one minute', () => {
    expect(formatDurationSeconds(60)).toBe('1:00');
  });

  it('formats over an hour', () => {
    expect(formatDurationSeconds(3661)).toBe('1:01:01');
  });

  it('clamps negative to zero display', () => {
    expect(formatDurationSeconds(-10)).toBe('0:00');
  });
});

describe('parseDurationInputToSeconds', () => {
  it('returns null for empty or whitespace', () => {
    expect(parseDurationInputToSeconds('')).toBeNull();
    expect(parseDurationInputToSeconds('   ')).toBeNull();
  });

  it('parses single segment as seconds', () => {
    expect(parseDurationInputToSeconds('45')).toBe(45);
  });

  it('parses mm:ss', () => {
    expect(parseDurationInputToSeconds('45:30')).toBe(45 * 60 + 30);
  });

  it('parses h:mm:ss', () => {
    expect(parseDurationInputToSeconds('1:05:30')).toBe(3600 + 5 * 60 + 30);
  });

  it('returns null for empty segment between colons', () => {
    expect(parseDurationInputToSeconds('1::30')).toBeNull();
  });

  it('returns null for negative values', () => {
    expect(parseDurationInputToSeconds('-1')).toBeNull();
    expect(parseDurationInputToSeconds('1:-30')).toBeNull();
  });

  it('returns null for non-numeric segment', () => {
    expect(parseDurationInputToSeconds('ab:30')).toBeNull();
  });

  it('returns null for more than three colon segments', () => {
    expect(parseDurationInputToSeconds('1:2:3:4')).toBeNull();
  });
});

describe('formatStandaloneLogCardTimestamp', () => {
  it('returns null for invalid ISO', () => {
    expect(formatStandaloneLogCardTimestamp('not-a-date')).toBeNull();
  });

  it('formats valid ISO as DD/MM/YYYY - HH:MM in local time', () => {
    const stamp = formatStandaloneLogCardTimestamp('2026-03-29T14:52:00.000Z');
    expect(stamp).toMatch(/^\d{2}\/\d{2}\/\d{4} - \d{2}:\d{2}$/);
  });
});

describe('formatStandaloneLogLoggedAt', () => {
  it('returns null for invalid ISO', () => {
    expect(formatStandaloneLogLoggedAt('invalid')).toBeNull();
  });

  it('returns date and time labels for valid ISO', () => {
    const result = formatStandaloneLogLoggedAt('2026-03-29T14:52:00.000Z');
    expect(result).not.toBeNull();
    expect(result!.dateLabel.length).toBeGreaterThan(0);
    expect(result!.timeLabel.length).toBeGreaterThan(0);
  });
});

describe('formatStandaloneLogSummary', () => {
  const durationSchema: WorkoutLogSchema = {
    kind: 'duration',
    lowerIsBetter: true,
  };
  const amrapSchema: WorkoutLogSchema = {
    kind: 'amrap',
    timeCapMinutes: 15,
  };
  const maxRepsSchema: WorkoutLogSchema = {
    kind: 'max_reps',
    label: 'Reps',
  };
  const distanceM: WorkoutLogSchema = {
    kind: 'distance',
    unit: 'm',
    higherIsBetter: true,
  };
  const distanceKm: WorkoutLogSchema = {
    kind: 'distance',
    unit: 'km',
    higherIsBetter: true,
  };
  const notesOnlySchema: WorkoutLogSchema = {
    kind: 'notes_only',
  };

  it('formats duration payload', () => {
    expect(
      formatStandaloneLogSummary(
        { kind: 'duration', durationSeconds: 125 },
        durationSchema
      )
    ).toBe('2:05');
  });

  it('formats amrap payload', () => {
    expect(
      formatStandaloneLogSummary(
        { kind: 'amrap', rounds: 20, extraReps: 10 },
        amrapSchema
      )
    ).toBe('20 rounds + 10 reps');
  });

  it('formats max_reps payload', () => {
    expect(
      formatStandaloneLogSummary({ kind: 'max_reps', reps: 42 }, maxRepsSchema)
    ).toBe('42 reps');
  });

  it('formats distance with schema unit m', () => {
    expect(
      formatStandaloneLogSummary({ kind: 'distance', value: 500 }, distanceM)
    ).toBe('500 m');
  });

  it('formats distance with schema unit km', () => {
    expect(
      formatStandaloneLogSummary({ kind: 'distance', value: 1.5 }, distanceKm)
    ).toBe('1.5 km');
  });

  it('uses m when schema is not distance', () => {
    expect(
      formatStandaloneLogSummary(
        { kind: 'distance', value: 100 },
        durationSchema
      )
    ).toBe('100 m');
  });

  it('trims notes_only text', () => {
    expect(
      formatStandaloneLogSummary(
        { kind: 'notes_only', text: '  hello  ' },
        notesOnlySchema
      )
    ).toBe('hello');
  });

  it('returns empty string for unknown payload kind', () => {
    expect(
      formatStandaloneLogSummary(
        { kind: 'bogus' } as unknown as StandaloneLogPayload,
        notesOnlySchema
      )
    ).toBe('');
  });
});
