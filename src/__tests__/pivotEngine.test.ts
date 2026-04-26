import { getAllExercises } from '../data/exercises';
import { findAlternatives } from '../utils/pivotEngine';

jest.mock('../data/exercises', () => ({
  getAllExercises: jest.fn(),
}));

const mockExercises = [
  {
    id: 1,
    name: 'Barbell Bench Press',
    pattern: 'push',
    muscle: 'chest',
    equipment: 'barbell',
    logging_type: 'reps_and_weight' as const,
  },
  {
    id: 2,
    name: 'Dumbbell Bench Press',
    pattern: 'push',
    muscle: 'chest',
    equipment: 'dumbbell',
    logging_type: 'reps_and_weight' as const,
  },
  {
    id: 3,
    name: 'Machine Chest Press',
    pattern: 'push',
    muscle: 'chest',
    equipment: 'machine',
    logging_type: 'reps_and_weight' as const,
  },
  {
    id: 4,
    name: 'Barbell Row',
    pattern: 'pull',
    muscle: 'back',
    equipment: 'barbell',
    logging_type: 'reps_and_weight' as const,
  },
  {
    id: 5,
    name: 'Incline Barbell Bench Press',
    pattern: 'push',
    muscle: 'chest',
    equipment: 'barbell',
    logging_type: 'reps_and_weight' as const,
  },
  {
    id: 6,
    name: 'Cable Flyes',
    pattern: 'isolation',
    muscle: 'upper chest',
    equipment: 'cable',
    logging_type: 'reps_and_weight' as const,
  },
];

describe('findAlternatives', () => {
  beforeEach(() => {
    (getAllExercises as jest.Mock).mockReturnValue(mockExercises);
  });

  it('returns empty array when exercise is missing', () => {
    expect(findAlternatives(999, 2)).toEqual([]);
  });

  it('returns alternatives with different equipment when available', () => {
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.25);

    const alternatives = findAlternatives(1, 2);

    expect(alternatives).toHaveLength(2);
    expect(alternatives.map((a) => a.exercise.id).sort()).toEqual([2, 3]);
    expect(alternatives.every((a) => a.matchScore === 100)).toBe(true);

    randomSpy.mockRestore();
  });

  it('fills remaining alternatives with same equipment when needed', () => {
    const alternatives = findAlternatives(1, 3);

    expect(alternatives).toHaveLength(3);
    expect(alternatives.map((a) => a.exercise.id)).toEqual(
      expect.arrayContaining([2, 3, 5])
    );
    expect(alternatives.every((a) => a.matchScore === 100)).toBe(true);
  });

  it('falls back to same muscle group when perfect matches are insufficient', () => {
    const alternatives = findAlternatives(1, 4);

    expect(alternatives).toHaveLength(4);
    const byScore = alternatives.reduce<Record<number, number>>((acc, a) => {
      acc[a.matchScore] = (acc[a.matchScore] ?? 0) + 1;
      return acc;
    }, {});

    expect(byScore[100]).toBe(3);
    expect(byScore[50]).toBe(1);
    expect(alternatives.map((a) => a.exercise.id)).toEqual(
      expect.arrayContaining([6])
    );
  });

  it('can filter alternatives to bodyweight only', () => {
    const alternatives = findAlternatives(1, 10, { equipmentMode: 'bodyweight' });
    expect(alternatives).toEqual([]);
  });
});
