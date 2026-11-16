import { WORKOUT_EQUIPMENT_OPTIONS } from '@/src/components/workouts/workoutsScreenConstants';
import {
  disciplines,
  visibleEvents,
  visibleTrainingDisciplines,
  workoutMatchesDiscipline,
} from '@/src/data/disciplines';
import { STANDALONE_LOG_SCHEMA_BY_ID } from '@/src/data/standaloneLogSchemas';
import { workouts as workoutsData } from '@/src/data/workout_data';
import { allStandaloneWorkouts } from '@/src/data/workouts';
import type { WorkoutLogSchema } from '@/src/types/workouts';
import { blocksOfWorkout, mentionedHrZone } from '@/src/utils/workoutHrZones';

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

function idsMatching(tag: string): string[] {
  return allStandaloneWorkouts
    .filter((w) => workoutMatchesDiscipline(w, tag))
    .map((w) => w.id)
    .sort();
}

describe('bundled standalone workouts', () => {
  it('merges JSON row count with allStandaloneWorkouts', () => {
    expect(allStandaloneWorkouts.length).toBe(
      (workoutsData as unknown[]).length
    );
  });

  it('every workout has a unique id, a valid logSchema and blocks', () => {
    const ids = new Set<string>();
    for (const w of allStandaloneWorkouts) {
      expect(w.id.length).toBeGreaterThan(0);
      expect(ids.has(w.id)).toBe(false);
      ids.add(w.id);
      assertWorkoutLogSchema(w.logSchema, w.id);
      expect(w.blocks.length).toBeGreaterThan(0);
    }
  });

  it('every block that names a heart rate zone shows the matching zone widget', () => {
    const missing: string[] = [];
    for (const w of allStandaloneWorkouts) {
      for (const block of blocksOfWorkout(w)) {
        const mentioned = mentionedHrZone(block);
        if (mentioned !== null && block.hrZone !== mentioned) {
          missing.push(`${w.id} "${block.name}": hrZone ${mentioned}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  it('every hrZone is between 1 and 5', () => {
    for (const w of allStandaloneWorkouts) {
      for (const block of blocksOfWorkout(w)) {
        if (block.hrZone !== undefined) {
          expect([1, 2, 3, 4, 5]).toContain(block.hrZone);
        }
      }
    }
  });

  it('every workout has a valid equipment array', () => {
    const allowed = new Set(WORKOUT_EQUIPMENT_OPTIONS);
    for (const w of allStandaloneWorkouts) {
      for (const eq of w.equipment) {
        expect(allowed.has(eq)).toBe(true);
      }
    }
  });

  it('includes HIIT Shred pro standalone copies p_55–p_78 (except removed p_75)', () => {
    for (let n = 55; n <= 78; n++) {
      if (n === 75) continue;
      const id = `p_${n}`;
      const w = allStandaloneWorkouts.find((row) => row.id === id);
      expect(w).toBeDefined();
      expect(w?.isPremium).toBe(true);
      expect(w?.disciplines).toContain('Conditioning');
      expect(w?.blocks.length).toBeGreaterThan(0);
      expect(STANDALONE_LOG_SCHEMA_BY_ID[id]).toBeDefined();
    }
  });
});

describe('workouts screen browse', () => {
  it('shows the four events as tiles and training disciplines as pills', () => {
    expect(visibleEvents.map((d) => d.title)).toEqual([
      'Death by Beth',
      'Arena Games',
      'The Rainhill Trials',
      'The Girl Games',
    ]);
    expect(visibleTrainingDisciplines.map((d) => d.title)).toEqual([
      'Metcon',
      'Strength',
      'Olympic Lifting',
      'Gymnastics',
      'Conditioning',
      'Hyrox',
      'Skills',
      'CrossFit Benchmarks',
      'Partner',
      'Collabs',
    ]);
    for (const event of visibleEvents) {
      expect(event.image).toBeDefined();
    }
  });

  it('opens a non-empty list for every tile and pill', () => {
    for (const discipline of disciplines) {
      expect(idsMatching(discipline.tag).length).toBeGreaterThan(0);
    }
  });

  it('matches discipline routes on the disciplines field', () => {
    for (const w of allStandaloneWorkouts) {
      expect(workoutMatchesDiscipline(w, 'Gymnastics')).toBe(
        w.disciplines.includes('Gymnastics')
      );
      expect(workoutMatchesDiscipline(w, 'Metcon')).toBe(
        w.disciplines.includes('Metcon')
      );
    }
  });

  it('keeps the old CrossFit and Skill routes working', () => {
    expect(idsMatching('CrossFit')).toEqual(
      allStandaloneWorkouts
        .filter((w) => w.collections?.includes('CrossFit Benchmarks'))
        .map((w) => w.id)
        .sort()
    );
    expect(idsMatching('CrossFit')).toEqual(
      expect.arrayContaining(['f_31', 'f_34', 'p_07'])
    );
    expect(idsMatching('Skill')).toEqual(
      allStandaloneWorkouts
        .filter((w) => w.disciplines.includes('Skills'))
        .map((w) => w.id)
        .sort()
    );
  });

  it('matches events on special, independent of discipline', () => {
    expect(idsMatching('DBB')).toEqual([
      'dbb_01',
      'dbb_02',
      'dbb_03',
      'dbb_04',
    ]);
    expect(idsMatching('Girl Games')).toEqual(['gg_01', 'gg_02', 'gg_03']);
    expect(idsMatching('Rainhill')).toHaveLength(11);
    expect(idsMatching('Arena')).toHaveLength(8);
    for (const w of allStandaloneWorkouts.filter((row) => row.special)) {
      expect(w.disciplines.length).toBeGreaterThan(0);
    }
  });

  it('matches partner and collab routes', () => {
    for (const w of allStandaloneWorkouts) {
      expect(workoutMatchesDiscipline(w, 'Partner')).toBe(Boolean(w.partner));
      expect(workoutMatchesDiscipline(w, 'Collab')).toBe(Boolean(w.collab));
    }
  });

  it('keeps Girl Games as partner-only collabs', () => {
    for (const w of allStandaloneWorkouts.filter(
      (row) => row.special === 'Girl Games'
    )) {
      expect(w.partner).toBe('only');
      expect(w.collab?.name).toBe('The Girl Games');
    }
  });
});
