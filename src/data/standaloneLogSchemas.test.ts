import {
  DEFAULT_WORKOUT_LOG_SCHEMA,
  STANDALONE_LOG_SCHEMA_BY_ID,
} from '@/src/data/standaloneLogSchemas';
import type { WorkoutLogSchema } from '@/src/types/workouts';

function assertWorkoutLogSchema(schema: WorkoutLogSchema, label: string): void {
  switch (schema.kind) {
    case 'none':
      break;
    case 'duration':
      expect(typeof schema.lowerIsBetter).toBe('boolean');
      break;
    case 'amrap':
      expect(typeof schema.timeCapMinutes).toBe('number');
      expect(schema.timeCapMinutes).toBeGreaterThan(0);
      break;
    case 'max_reps':
      expect(typeof schema.label).toBe('string');
      expect(schema.label.length).toBeGreaterThan(0);
      break;
    case 'distance':
      expect(['m', 'km']).toContain(schema.unit);
      expect(typeof schema.higherIsBetter).toBe('boolean');
      break;
    case 'notes_only':
      break;
    default: {
      const exhaustive: never = schema;
      throw new Error(
        `Unexpected schema ${label}: ${JSON.stringify(exhaustive)}`
      );
    }
  }
}

describe('standaloneLogSchemas', () => {
  it('DEFAULT_WORKOUT_LOG_SCHEMA is notes_only', () => {
    expect(DEFAULT_WORKOUT_LOG_SCHEMA.kind).toBe('notes_only');
    assertWorkoutLogSchema(
      DEFAULT_WORKOUT_LOG_SCHEMA,
      'DEFAULT_WORKOUT_LOG_SCHEMA'
    );
  });

  it('every STANDALONE_LOG_SCHEMA_BY_ID entry is valid', () => {
    for (const [id, schema] of Object.entries(STANDALONE_LOG_SCHEMA_BY_ID)) {
      assertWorkoutLogSchema(schema, id);
    }
  });

  it('has expected free and pro ids', () => {
    const keys = Object.keys(STANDALONE_LOG_SCHEMA_BY_ID);
    expect(keys.filter((k) => k.startsWith('f_')).length).toBeGreaterThan(0);
    expect(keys.filter((k) => k.startsWith('p_')).length).toBeGreaterThan(0);
  });
});
