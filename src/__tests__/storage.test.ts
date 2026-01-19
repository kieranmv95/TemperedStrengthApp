import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getActiveProgramId,
  getFavoriteWorkouts,
  getWorkoutNotes,
  incrementSwapCount,
  saveWorkoutNotes,
  setActiveProgramId,
  toggleFavoriteWorkout,
} from "../utils/storage";

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
});
