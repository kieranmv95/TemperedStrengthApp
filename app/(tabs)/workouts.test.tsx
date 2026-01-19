import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import WorkoutsScreen from "./workouts";
import { getFavoriteWorkouts } from "@/src/utils/storage";

jest.mock("@/hooks/use-subscription", () => ({
  useSubscription: () => ({ isPro: false }),
}));

jest.mock("@/src/utils/storage", () => ({
  getFavoriteWorkouts: jest.fn(),
  toggleFavoriteWorkout: jest.fn(),
}));

jest.mock("@react-navigation/native", () => {
  const React = require("react");
  return {
    useFocusEffect: (effect: () => void) => React.useEffect(effect, []),
  };
});

jest.mock("expo-router", () => ({
  router: { push: jest.fn() },
}));

jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Ionicons: ({ name }: { name: string }) => <Text>{name}</Text>,
  };
});

describe("WorkoutsScreen filters", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("filters workouts by favorites", async () => {
    (getFavoriteWorkouts as jest.Mock).mockResolvedValue(["f_03"]);

    const { getByText, queryByText } = render(<WorkoutsScreen />);

    await waitFor(() => expect(getFavoriteWorkouts).toHaveBeenCalled());

    fireEvent.press(getByText("Favorites"));

    expect(getByText("Core Tempering")).toBeTruthy();
    expect(queryByText("The 15-Min Engine")).toBeNull();
  });

  it("filters workouts by time range", async () => {
    (getFavoriteWorkouts as jest.Mock).mockResolvedValue([]);

    const { getByText, queryByText } = render(<WorkoutsScreen />);

    await waitFor(() => expect(getFavoriteWorkouts).toHaveBeenCalled());

    fireEvent.press(getByText("16-30 min"));

    expect(getByText("The 15-Min Engine")).toBeTruthy();
    expect(queryByText("Core Tempering")).toBeNull();
  });
});
