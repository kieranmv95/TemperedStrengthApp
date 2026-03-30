import type { StandaloneWorkoutLogEntry } from '@/src/types/standaloneWorkoutLogs';
import type { WorkoutLogSchema } from '@/src/types/workouts';
import {
  buildPayloadFromForm,
  computeBestDurationEntry,
  emptyForm,
  loadEntryIntoForm,
  logListPrimarySummary,
} from '@/src/utils/standaloneWorkoutLogForm';

const baseForm = () => ({
  ...emptyForm(),
  loggedAtMs: 0,
});

describe('buildPayloadFromForm', () => {
  it('rejects none schema', () => {
    const schema: WorkoutLogSchema = { kind: 'none' };
    expect(buildPayloadFromForm(schema, baseForm())).toEqual({
      ok: false,
      error: 'This workout does not support logging.',
    });
  });

  it('accepts valid duration', () => {
    const schema: WorkoutLogSchema = {
      kind: 'duration',
      lowerIsBetter: true,
    };
    const form = { ...baseForm(), durationInput: '45:30' };
    expect(buildPayloadFromForm(schema, form)).toEqual({
      ok: true,
      payload: { kind: 'duration', durationSeconds: 45 * 60 + 30 },
    });
  });

  it('rejects duration when zero or invalid', () => {
    const schema: WorkoutLogSchema = {
      kind: 'duration',
      lowerIsBetter: true,
    };
    expect(
      buildPayloadFromForm(schema, { ...baseForm(), durationInput: '0' })
    ).toMatchObject({
      ok: false,
    });
    expect(
      buildPayloadFromForm(schema, { ...baseForm(), durationInput: '' })
    ).toMatchObject({
      ok: false,
    });
  });

  it('accepts amrap zero and zero', () => {
    const schema: WorkoutLogSchema = {
      kind: 'amrap',
      timeCapMinutes: 15,
    };
    expect(
      buildPayloadFromForm(schema, {
        ...baseForm(),
        roundsInput: '0',
        extraRepsInput: '0',
      })
    ).toEqual({
      ok: true,
      payload: { kind: 'amrap', rounds: 0, extraReps: 0 },
    });
  });

  it('rejects amrap negative or NaN', () => {
    const schema: WorkoutLogSchema = {
      kind: 'amrap',
      timeCapMinutes: 15,
    };
    expect(
      buildPayloadFromForm(schema, {
        ...baseForm(),
        roundsInput: '-1',
        extraRepsInput: '0',
      })
    ).toMatchObject({ ok: false });
    expect(
      buildPayloadFromForm(schema, {
        ...baseForm(),
        roundsInput: 'x',
        extraRepsInput: '0',
      })
    ).toMatchObject({ ok: false });
  });

  it('accepts max_reps zero', () => {
    const schema: WorkoutLogSchema = {
      kind: 'max_reps',
      label: 'Reps',
    };
    expect(
      buildPayloadFromForm(schema, { ...baseForm(), repsInput: '0' })
    ).toEqual({ ok: true, payload: { kind: 'max_reps', reps: 0 } });
  });

  it('rejects max_reps invalid', () => {
    const schema: WorkoutLogSchema = {
      kind: 'max_reps',
      label: 'Reps',
    };
    expect(
      buildPayloadFromForm(schema, { ...baseForm(), repsInput: '-1' })
    ).toMatchObject({ ok: false });
  });

  it('accepts distance zero and decimals', () => {
    const schema: WorkoutLogSchema = {
      kind: 'distance',
      unit: 'm',
      higherIsBetter: true,
    };
    expect(
      buildPayloadFromForm(schema, { ...baseForm(), distanceInput: '0' })
    ).toEqual({ ok: true, payload: { kind: 'distance', value: 0 } });
    expect(
      buildPayloadFromForm(schema, { ...baseForm(), distanceInput: ' 1.5 ' })
    ).toEqual({ ok: true, payload: { kind: 'distance', value: 1.5 } });
  });

  it('rejects distance NaN or negative', () => {
    const schema: WorkoutLogSchema = {
      kind: 'distance',
      unit: 'km',
      higherIsBetter: true,
    };
    expect(
      buildPayloadFromForm(schema, { ...baseForm(), distanceInput: 'nan' })
    ).toMatchObject({ ok: false });
    expect(
      buildPayloadFromForm(schema, { ...baseForm(), distanceInput: '-1' })
    ).toMatchObject({ ok: false });
  });

  it('accepts notes_only when trimmed non-empty', () => {
    const schema: WorkoutLogSchema = { kind: 'notes_only' };
    expect(
      buildPayloadFromForm(schema, {
        ...baseForm(),
        notesOnlyInput: '  hello  ',
      })
    ).toEqual({ ok: true, payload: { kind: 'notes_only', text: 'hello' } });
  });

  it('rejects notes_only when whitespace only', () => {
    const schema: WorkoutLogSchema = { kind: 'notes_only' };
    expect(
      buildPayloadFromForm(schema, { ...baseForm(), notesOnlyInput: '   ' })
    ).toMatchObject({ ok: false });
  });

  it('returns unsupported for unknown schema kind', () => {
    expect(
      buildPayloadFromForm(
        { kind: 'bogus' } as unknown as WorkoutLogSchema,
        baseForm()
      )
    ).toEqual({ ok: false, error: 'Unsupported log type.' });
  });
});

describe('loadEntryIntoForm', () => {
  const nowMs = 1_700_000_000_000;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(nowMs);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('maps duration payload', () => {
    const entry: StandaloneWorkoutLogEntry = {
      id: 'a',
      workoutId: 'w',
      loggedAt: '2026-01-01T12:00:00.000Z',
      updatedAt: '2026-01-01T12:00:00.000Z',
      payload: { kind: 'duration', durationSeconds: 125 },
    };
    const form = loadEntryIntoForm(entry, baseForm());
    expect(form.durationInput).toBe('2:05');
    expect(form.loggedAtMs).toBe(new Date(entry.loggedAt).getTime());
  });

  it('uses Date.now when loggedAt invalid', () => {
    const entry: StandaloneWorkoutLogEntry = {
      id: 'a',
      workoutId: 'w',
      loggedAt: 'not-valid',
      updatedAt: '2026-01-01T12:00:00.000Z',
      payload: { kind: 'max_reps', reps: 5 },
    };
    const form = loadEntryIntoForm(entry, baseForm());
    expect(form.loggedAtMs).toBe(nowMs);
  });

  it('merges notes_only payload text and entry notes into notesOnlyInput', () => {
    const entry: StandaloneWorkoutLogEntry = {
      id: 'a',
      workoutId: 'w',
      loggedAt: '2026-01-01T12:00:00.000Z',
      updatedAt: '2026-01-01T12:00:00.000Z',
      payload: { kind: 'notes_only', text: 'Main' },
      notes: 'Extra',
    };
    const form = loadEntryIntoForm(entry, baseForm());
    expect(form.notesOnlyInput).toBe('Main\n\nExtra');
    expect(form.notesInput).toBe('');
  });

  it('sets notesInput for structured payloads', () => {
    const entry: StandaloneWorkoutLogEntry = {
      id: 'a',
      workoutId: 'w',
      loggedAt: '2026-01-01T12:00:00.000Z',
      updatedAt: '2026-01-01T12:00:00.000Z',
      payload: { kind: 'amrap', rounds: 1, extraReps: 0 },
      notes: 'Felt good',
    };
    const form = loadEntryIntoForm(entry, baseForm());
    expect(form.notesInput).toBe('Felt good');
  });
});

describe('logListPrimarySummary', () => {
  const durationSchema: WorkoutLogSchema = {
    kind: 'duration',
    lowerIsBetter: true,
  };

  it('merges notes_only payload and entry notes', () => {
    const entry: StandaloneWorkoutLogEntry = {
      id: 'a',
      workoutId: 'w',
      loggedAt: '2026-01-01T12:00:00.000Z',
      updatedAt: '2026-01-01T12:00:00.000Z',
      payload: { kind: 'notes_only', text: 'A' },
      notes: 'B',
    };
    expect(logListPrimarySummary(entry, { kind: 'notes_only' })).toBe('A\n\nB');
  });

  it('delegates to format for non-notes_only', () => {
    const entry: StandaloneWorkoutLogEntry = {
      id: 'a',
      workoutId: 'w',
      loggedAt: '2026-01-01T12:00:00.000Z',
      updatedAt: '2026-01-01T12:00:00.000Z',
      payload: { kind: 'duration', durationSeconds: 60 },
    };
    expect(logListPrimarySummary(entry, durationSchema)).toBe('1:00');
  });
});

describe('computeBestDurationEntry', () => {
  const lower: WorkoutLogSchema = {
    kind: 'duration',
    lowerIsBetter: true,
  };
  const higher: WorkoutLogSchema = {
    kind: 'duration',
    lowerIsBetter: false,
  };

  const e = (
    id: string,
    seconds: number
  ): StandaloneWorkoutLogEntry & {
    payload: { kind: 'duration'; durationSeconds: number };
  } => ({
    id,
    workoutId: 'w',
    loggedAt: '2026-01-01T12:00:00.000Z',
    updatedAt: '2026-01-01T12:00:00.000Z',
    payload: { kind: 'duration', durationSeconds: seconds },
  });

  it('returns null for non-duration schema', () => {
    expect(
      computeBestDurationEntry([e('a', 100)], {
        kind: 'amrap',
        timeCapMinutes: 10,
      })
    ).toBeNull();
  });

  it('returns null when no duration entries', () => {
    const amrap: StandaloneWorkoutLogEntry = {
      id: 'x',
      workoutId: 'w',
      loggedAt: '2026-01-01T12:00:00.000Z',
      updatedAt: '2026-01-01T12:00:00.000Z',
      payload: { kind: 'amrap', rounds: 1, extraReps: 0 },
    };
    expect(computeBestDurationEntry([amrap], lower)).toBeNull();
  });

  it('picks smallest duration when lowerIsBetter', () => {
    const best = computeBestDurationEntry([e('a', 200), e('b', 100)], lower);
    expect(best?.id).toBe('b');
  });

  it('picks largest duration when lowerIsBetter is false', () => {
    const best = computeBestDurationEntry([e('a', 200), e('b', 100)], higher);
    expect(best?.id).toBe('a');
  });

  it('keeps first entry on tie when lowerIsBetter', () => {
    const best = computeBestDurationEntry(
      [e('first', 100), e('second', 100)],
      lower
    );
    expect(best?.id).toBe('first');
  });

  it('keeps first entry on tie when higherIsBetter', () => {
    const best = computeBestDurationEntry(
      [e('first', 100), e('second', 100)],
      higher
    );
    expect(best?.id).toBe('first');
  });

  it('ignores non-duration entries in the list', () => {
    const other: StandaloneWorkoutLogEntry = {
      id: 'x',
      workoutId: 'w',
      loggedAt: '2026-01-01T12:00:00.000Z',
      updatedAt: '2026-01-01T12:00:00.000Z',
      payload: { kind: 'amrap', rounds: 1, extraReps: 0 },
    };
    const best = computeBestDurationEntry([other, e('d', 50)], lower);
    expect(best?.id).toBe('d');
  });
});
