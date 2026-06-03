import { WORKOUT_EQUIPMENT_OPTIONS } from '@/src/components/workouts/workoutsScreenConstants';
import { allStandaloneWorkouts } from '@/src/data/workouts';
import type { WorkoutLogSchema } from '@/src/types/workouts';
import workoutsData from '@/src/data/workouts.json';

const NO_EQUIPMENT_TAG = 'No Equipment';

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
      (workoutsData as unknown[]).length
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

  it('every workout has a valid equipment array', () => {
    const allowed = new Set(WORKOUT_EQUIPMENT_OPTIONS);
    for (const w of allStandaloneWorkouts) {
      expect(Array.isArray(w.equipment)).toBe(true);
      for (const eq of w.equipment) {
        expect(allowed.has(eq)).toBe(true);
      }
      const hasNoEquipmentTag = w.tags.includes(NO_EQUIPMENT_TAG);
      if (hasNoEquipmentTag) {
        expect(w.equipment).toEqual([]);
      }
    }
  });
});
