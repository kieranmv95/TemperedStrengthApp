import { getAllExercises, getExerciseById } from '../data/exercises';
import { programList } from '../data/programs';
import { getMuscleGroup } from '../utils/muscleGroup';

type SwappableExerciseRef = {
  programName: string;
  exerciseId: number;
};

const collectSwappableExerciseIds = (): SwappableExerciseRef[] => {
  const refs: SwappableExerciseRef[] = [];

  for (const program of programList) {
    const workouts = (program as any).workouts as unknown;
    if (!Array.isArray(workouts)) continue;

    for (const workout of workouts) {
      if ((workout as any)?.format === 'v2') {
        continue;
      }

      const exercises = (workout as any)?.exercises as unknown;
      if (!Array.isArray(exercises)) continue;

      for (const item of exercises) {
        if (!item || typeof item !== 'object') continue;
        if ((item as any).type !== 'exercise') continue;
        if ((item as any).canSwap !== true) continue;

        const id = (item as any).id;
        if (typeof id !== 'number') continue;

        refs.push({ programName: (program as any).name ?? 'Unknown', exerciseId: id });
      }
    }
  }

  return refs;
};

describe('exercise swap coverage', () => {
  it('program swappable exercises have at least one 100% alternative', () => {
    const allExercises = getAllExercises();
    const swappables = collectSwappableExerciseIds();

    const missing: SwappableExerciseRef[] = [];

    for (const ref of swappables) {
      const current = getExerciseById(ref.exerciseId);
      if (!current) {
        missing.push(ref);
        continue;
      }

      const currentGroup = getMuscleGroup(current.muscle);
      const hasPerfectAlternative = allExercises.some(
        (ex) =>
          ex.id !== current.id &&
          ex.pattern === current.pattern &&
          getMuscleGroup(ex.muscle) === currentGroup
      );

      if (!hasPerfectAlternative) {
        missing.push(ref);
      }
    }

    if (missing.length > 0) {
      const lines = missing.map((m) => `${m.programName}: exerciseId=${m.exerciseId}`);
      throw new Error(
        [
          'Some program exercises are marked canSwap:true but have no 100% (pattern + muscle group) alternatives.',
          ...lines,
        ].join('\n')
      );
    }
  });
});

