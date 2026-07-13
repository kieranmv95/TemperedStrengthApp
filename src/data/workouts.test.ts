import { WORKOUT_EQUIPMENT_OPTIONS } from '@/src/components/workouts/workoutsScreenConstants';
import { workoutMatchesDiscipline } from '@/src/data/disciplines';
import { STANDALONE_LOG_SCHEMA_BY_ID } from '@/src/data/standaloneLogSchemas';
import { workouts as workoutsData } from '@/src/data/workout_data';
import { allStandaloneWorkouts } from '@/src/data/workouts';
import { isWorkoutTag, isWorkoutFocusTag } from '@/src/types/workouts';
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
      if (w.equipment.length === 0) {
        expect(w.tags).not.toContain('No Equipment');
      }
    }
  });

  it('does not duplicate difficulty, category, or equipment on tags', () => {
    const redundant = [
      'Beginner',
      'Intermediate',
      'Advanced',
      'CrossFit',
      'Hyrox',
      'Pilates',
      'Rainhill',
      'No Equipment',
      'Bodyweight',
      'Kettlebell',
      'KB',
      'Barbell',
      'Sandbag',
      'Sled',
      'Row',
      'Jump Rope',
      'Assault Bike',
      'SkiErg',
      'Gym',
    ] as const;
    for (const w of allStandaloneWorkouts) {
      for (const tag of redundant) {
        expect(w.tags).not.toContain(tag);
      }
      for (const tag of w.tags) {
        expect(tag).not.toBe(w.difficulty);
        if (!isWorkoutFocusTag(tag)) {
          expect(tag).not.toBe(w.category);
        }
      }
    }
  });

  it('discipline browse matches category and partner tag', () => {
    const wod = allStandaloneWorkouts.find((w) => w.category === 'WOD');
    const hyrox = allStandaloneWorkouts.find((w) => w.category === 'Hyrox');
    const partner = allStandaloneWorkouts.find((w) =>
      w.tags.includes('Partner')
    );
    const oly = allStandaloneWorkouts.find((w) =>
      w.tags.includes('Olympic Lifting')
    );
    expect(wod).toBeDefined();
    expect(hyrox).toBeDefined();
    expect(partner).toBeDefined();
    expect(oly).toBeDefined();
    expect(workoutMatchesDiscipline(wod!, 'CrossFit')).toBe(true);
    expect(workoutMatchesDiscipline(hyrox!, 'Hyrox')).toBe(true);
    expect(workoutMatchesDiscipline(partner!, 'Partner')).toBe(true);
    expect(workoutMatchesDiscipline(oly!, 'Olympic Lifting')).toBe(true);
    expect(wod!.tags).not.toContain('CrossFit');
  });

  it('collab discipline matches any workout with a collab property', () => {
    const collabWorkouts = allStandaloneWorkouts.filter((w) => w.collab);
    expect(collabWorkouts.length).toBeGreaterThan(0);
    for (const w of collabWorkouts) {
      expect(workoutMatchesDiscipline(w, 'Collab')).toBe(true);
      expect(typeof w.collab?.name).toBe('string');
      expect(typeof w.collab?.link).toBe('string');
    }
    const nonCollab = allStandaloneWorkouts.find((w) => !w.collab);
    expect(nonCollab).toBeDefined();
    expect(workoutMatchesDiscipline(nonCollab!, 'Collab')).toBe(false);
  });

  it('arena discipline matches workouts tagged Arena', () => {
    const arenaWorkouts = allStandaloneWorkouts.filter((w) =>
      w.tags.includes('Arena')
    );
    expect(arenaWorkouts.length).toBeGreaterThan(0);
    for (const w of arenaWorkouts) {
      expect(workoutMatchesDiscipline(w, 'Arena')).toBe(true);
    }
    const nonArena = allStandaloneWorkouts.find((w) => !w.tags.includes('Arena'));
    expect(nonArena).toBeDefined();
    expect(workoutMatchesDiscipline(nonArena!, 'Arena')).toBe(false);
  });

  it('tags dedicated Olympic lifting sessions for focus filtering', () => {
    const olySessions = allStandaloneWorkouts.filter((w) =>
      w.tags.includes('Olympic Lifting')
    );
    expect(olySessions.map((w) => w.id).sort()).toEqual([
      'p_02',
      'p_15',
      'p_79',
      'p_80',
      'p_81',
    ]);
    for (const w of olySessions) {
      expect(w.equipment).toContain('barbell');
    }
  });

  it('includes HIIT Shred pro standalone copies p_55–p_78 (except removed p_75)', () => {
    for (let n = 55; n <= 78; n++) {
      if (n === 75) continue;
      const id = `p_${n}`;
      const w = allStandaloneWorkouts.find((row) => row.id === id);
      expect(w).toBeDefined();
      expect(w?.isPremium).toBe(true);
      expect(w?.category).toBe('Conditioning');
      expect(w?.blocks.length).toBeGreaterThan(0);
      expect(STANDALONE_LOG_SCHEMA_BY_ID[id]).toBeDefined();
    }
  });
});
