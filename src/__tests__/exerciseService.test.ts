jest.mock("../lib/supabase", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabase";
import { exerciseService } from "../services/exerciseService";

const mockOrder = jest.fn();
const mockSelect = jest.fn(() => ({ order: mockOrder }));
const mockFrom = supabase.from as jest.Mock;

const sampleExercises = [
  {
    id: 10,
    name: "Back Squat",
    pattern: "squat",
    muscle: "legs",
    equipment: "barbell",
    created_at: "2025-01-01",
    updated_at: "2025-01-01",
    logging_type: "reps" as const,
  },
];

describe("exerciseService", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
    mockOrder.mockReset();
    mockSelect.mockReset().mockReturnValue({ order: mockOrder });
    mockFrom.mockReset().mockReturnValue({ select: mockSelect });
  });

  it("returns cached exercises when present", async () => {
    await AsyncStorage.setItem(
      "exercise_library",
      JSON.stringify(sampleExercises)
    );

    await expect(exerciseService.getAllExercises()).resolves.toEqual(
      sampleExercises
    );
  });

  it("syncs exercises from Supabase and stores them", async () => {
    mockOrder.mockResolvedValue({ data: sampleExercises, error: null });

    await exerciseService.syncWithSupabase();

    expect(mockFrom).toHaveBeenCalledWith("exercises");
    expect(mockSelect).toHaveBeenCalledWith("*");
    expect(mockOrder).toHaveBeenCalledWith("name", { ascending: true });
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "exercise_library",
      JSON.stringify(sampleExercises)
    );
  });

  it("skips cache update when Supabase returns an error", async () => {
    const error = new Error("Supabase failure");
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    mockOrder.mockResolvedValue({ data: null, error });

    await exerciseService.syncWithSupabase();

    expect(AsyncStorage.setItem).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("throws when Supabase sync throws", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    mockOrder.mockRejectedValue(new Error("Network down"));

    await expect(exerciseService.syncWithSupabase()).rejects.toThrow(
      "Network down"
    );

    consoleSpy.mockRestore();
  });
});
