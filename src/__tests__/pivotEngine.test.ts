import { findAlternatives } from "../utils/pivotEngine";
import { getAllExercises } from "../data/exercises";

jest.mock("../data/exercises", () => ({
  getAllExercises: jest.fn(),
}));

const mockExercises = [
  {
    id: 1,
    name: "Barbell Bench Press",
    pattern: "push",
    muscle: "chest",
    equipment: "barbell",
    created_at: "2025-01-01",
    updated_at: "2025-01-01",
    logging_type: "reps" as const,
  },
  {
    id: 2,
    name: "Dumbbell Bench Press",
    pattern: "push",
    muscle: "chest",
    equipment: "dumbbell",
    created_at: "2025-01-01",
    updated_at: "2025-01-01",
    logging_type: "reps" as const,
  },
  {
    id: 3,
    name: "Machine Chest Press",
    pattern: "push",
    muscle: "chest",
    equipment: "machine",
    created_at: "2025-01-01",
    updated_at: "2025-01-01",
    logging_type: "reps" as const,
  },
  {
    id: 4,
    name: "Barbell Row",
    pattern: "pull",
    muscle: "back",
    equipment: "barbell",
    created_at: "2025-01-01",
    updated_at: "2025-01-01",
    logging_type: "reps" as const,
  },
  {
    id: 5,
    name: "Incline Barbell Bench Press",
    pattern: "push",
    muscle: "chest",
    equipment: "barbell",
    created_at: "2025-01-01",
    updated_at: "2025-01-01",
    logging_type: "reps" as const,
  },
];

describe("findAlternatives", () => {
  beforeEach(() => {
    (getAllExercises as jest.Mock).mockReturnValue(mockExercises);
  });

  it("returns empty array when exercise is missing", () => {
    expect(findAlternatives(999, 2)).toEqual([]);
  });

  it("returns alternatives with different equipment when available", () => {
    const randomSpy = jest.spyOn(Math, "random").mockReturnValue(0.25);

    const alternatives = findAlternatives(1, 2);

    expect(alternatives).toHaveLength(2);
    expect(alternatives.map((exercise) => exercise.id).sort()).toEqual([2, 3]);

    randomSpy.mockRestore();
  });

  it("fills remaining alternatives with same equipment when needed", () => {
    const alternatives = findAlternatives(1, 3);

    expect(alternatives).toHaveLength(3);
    expect(alternatives.map((exercise) => exercise.id)).toEqual(
      expect.arrayContaining([2, 3, 5])
    );
  });
});
