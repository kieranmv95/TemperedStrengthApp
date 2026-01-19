import React from "react";
import { render, act } from "@testing-library/react-native";
import { RestTimer } from "../components/RestTimer";

jest.mock("react-native", () => {
  const RN = jest.requireActual("react-native/jest/mock");
  return {
    ...RN,
    AppState: {
      addEventListener: jest.fn(() => ({ remove: jest.fn() })),
      currentState: "active",
    },
  };
});

describe("RestTimer", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("counts down using timestamps and triggers completion", () => {
    const startTime = new Date("2025-01-01T00:00:00Z");
    jest.setSystemTime(startTime);

    const onComplete = jest.fn();
    const { getByText } = render(
      <RestTimer
        timer={{
          dayIndex: 1,
          slotIndex: 2,
          exerciseId: 10,
          restTimeSeconds: 5,
          startedAt: startTime.getTime(),
          status: "running",
        }}
        onDismiss={jest.fn()}
        onComplete={onComplete}
      />
    );

    expect(getByText("0:05")).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(4000);
    });

    expect(getByText("0:01")).toBeTruthy();
    expect(onComplete).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("shows completed state when status is completed", () => {
    const { getByText } = render(
      <RestTimer
        timer={{
          dayIndex: 2,
          slotIndex: 1,
          exerciseId: 4,
          restTimeSeconds: 30,
          startedAt: Date.now(),
          status: "completed",
          completedAt: Date.now(),
        }}
        onDismiss={jest.fn()}
        onComplete={jest.fn()}
      />
    );

    expect(getByText("Rest complete")).toBeTruthy();
    expect(getByText("Dismiss")).toBeTruthy();
  });
});
