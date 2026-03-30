import freeWorkoutsData from '@/src/data/freeWorkouts.json';
import proWorkoutsData from '@/src/data/proWorkouts.json';
import { allStandaloneWorkouts } from '@/src/data/workouts';
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

describe('bundled standalone workouts', () => {
  it('merges JSON row count with allStandaloneWorkouts', () => {
    expect(allStandaloneWorkouts.length).toBe(
      freeWorkoutsData.length + proWorkoutsData.length
    );
  });

  it('every workout has a valid logSchema and blocks', () => {
    for (const w of allStandaloneWorkouts) {
      expect(typeof w.id).toBe('string');
      expect(w.id.length).toBeGreaterThan(0);
      assertWorkoutLogSchema(w.logSchema, w.id);
      expect(Array.isArray(w.blocks)).toBe(true);
      expect(w.blocks.length).toBeGreaterThan(0);
    }
  });
});
