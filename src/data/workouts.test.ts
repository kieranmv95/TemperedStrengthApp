import { WORKOUT_EQUIPMENT_OPTIONS } from '@/src/components/workouts/workoutsScreenConstants';
import { STANDALONE_LOG_SCHEMA_BY_ID } from '@/src/data/standaloneLogSchemas';
import { workouts as workoutsData } from '@/src/data/workout_data';
import { allStandaloneWorkouts } from '@/src/data/workouts';
import { isWorkoutTag } from '@/src/types/workouts';
import type { WorkoutLogSchema, WorkoutTag } from '@/src/types/workouts';

const NO_EQUIPMENT_TAG = 'No Equipment' satisfies WorkoutTag;

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

  it('every workout tag is a known WorkoutTag', () => {
    for (const w of allStandaloneWorkouts) {
      for (const tag of w.tags) {
        expect(isWorkoutTag(tag)).toBe(true);
      }
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

  it('includes HIIT Shred pro standalone copies p_55–p_78 (except removed p_75)', () => {
    expect(allStandaloneWorkouts.length).toBe(157);
    for (let n = 55; n <= 78; n++) {
      if (n === 75) continue;
      const id = `p_${n}`;
      const w = allStandaloneWorkouts.find((row) => row.id === id);
      expect(w).toBeDefined();
      expect(w?.isPremium).toBe(true);
      expect(w?.tags).toContain('HIIT Shred');
      expect(w?.blocks).toHaveLength(1);
      expect(STANDALONE_LOG_SCHEMA_BY_ID[id]).toBeDefined();
    }
  });
});
