import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  clearFutureWorkoutData,
  clearLoggedSet,
  clearProgramData,
  getActiveProgramId,
  getCustomSetCount,
  getExerciseSwapsForDay,
  getFavoriteWorkouts,
  getLoggedSets,
  getProgramStartDate,
  getWorkoutNotes,
  incrementSwapCount,
  saveCustomSetCount,
  saveExerciseSwap,
  saveLoggedSet,
  saveWorkoutNotes,
  setActiveProgramId,
  setProgramStartDate,
  toggleFavoriteWorkout,
} from "./storage";

describe("storage utilities", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("stores and retrieves the active program id", async () => {
    await setActiveProgramId("program-1");

    await expect(getActiveProgramId()).resolves.toBe("program-1");
  });

  it("stores and retrieves the program start date", async () => {
    const startDate = "2025-06-15T00:00:00Z";
    await setProgramStartDate(startDate);

    await expect(getProgramStartDate()).resolves.toBe(startDate);
  });

  it("saves and clears workout notes when empty", async () => {
    await saveWorkoutNotes(2, "Keep shoulders down");

    await expect(getWorkoutNotes(2)).resolves.toBe("Keep shoulders down");

    await saveWorkoutNotes(2, "  ");

    await expect(getWorkoutNotes(2)).resolves.toBe("");
  });

  it("toggles favorites on and off", async () => {
    await expect(toggleFavoriteWorkout("workout-1")).resolves.toBe(true);
    await expect(getFavoriteWorkouts()).resolves.toEqual(["workout-1"]);

    await expect(toggleFavoriteWorkout("workout-1")).resolves.toBe(false);
    await expect(getFavoriteWorkouts()).resolves.toEqual([]);
  });

  it("increments swap count within the same month", async () => {
    const now = new Date("2025-06-15T10:00:00Z");
    jest.useFakeTimers().setSystemTime(now);

    await AsyncStorage.setItem("swap_count", "2");
    await AsyncStorage.setItem("swap_count_month", now.getMonth().toString());

    await expect(incrementSwapCount()).resolves.toBe(3);
  });

  it("resets swap count when the month changes", async () => {
    const now = new Date("2025-07-01T10:00:00Z");
    jest.useFakeTimers().setSystemTime(now);

    await AsyncStorage.setItem("swap_count", "9");
    await AsyncStorage.setItem(
      "swap_count_month",
      new Date("2025-06-01T10:00:00Z").getMonth().toString()
    );

    await expect(incrementSwapCount()).resolves.toBe(1);
  });

  it("saves logged sets and preserves state on auto-save", async () => {
    await saveLoggedSet(1, 2, 0, 100, 5, "completed");
    await saveLoggedSet(1, 2, 0, 110, 6);

    await expect(getLoggedSets(1, 2)).resolves.toEqual({
      0: { weight: 110, reps: 6, state: "completed" },
    });
  });

  it("clears a logged set and cleans empty containers", async () => {
    await saveLoggedSet(1, 0, 0, 50, 5, "completed");

    await clearLoggedSet(1, 0, 0);

    await expect(getLoggedSets(1, 0)).resolves.toEqual({});
  });

  it("saves and retrieves custom set counts", async () => {
    await saveCustomSetCount(2, 1, 4);

    await expect(getCustomSetCount(2, 1)).resolves.toBe(4);
  });

  it("clears future workout logs and swaps from a day index", async () => {
    await saveLoggedSet(1, 0, 0, 50, 5);
    await saveLoggedSet(3, 0, 0, 60, 6);
    await saveExerciseSwap(2, 0, 99);
    await saveExerciseSwap(4, 0, 101);

    await clearFutureWorkoutData(3);

    await expect(getLoggedSets(1, 0)).resolves.toEqual({
      0: { weight: 50, reps: 5 },
    });
    await expect(getLoggedSets(3, 0)).resolves.toEqual({});
    await expect(getExerciseSwapsForDay(2)).resolves.toEqual({ 0: 99 });
    await expect(getExerciseSwapsForDay(4)).resolves.toEqual({});
  });

  it("clears stored program data", async () => {
    await setActiveProgramId("program-1");
    await setProgramStartDate("2025-01-01T00:00:00Z");
    await saveWorkoutNotes(1, "Keep elbows tucked");

    await clearProgramData();

    await expect(getActiveProgramId()).resolves.toBeNull();
    await expect(getProgramStartDate()).resolves.toBeNull();
    await expect(getWorkoutNotes(1)).resolves.toBe("");
  });
});
