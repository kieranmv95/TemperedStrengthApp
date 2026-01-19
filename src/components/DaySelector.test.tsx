import { act, fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Dimensions, ScrollView } from "react-native";
import { DaySelector } from "./DaySelector";

let mockScrollTo: jest.Mock;

jest.mock("react-native", () => {
  const React = require("react");
  const actual = jest.requireActual("react-native");
  mockScrollTo = jest.fn();
  return {
    ...actual,
    ScrollView: React.forwardRef(({ children, ...props }: any, ref: any) => {
      React.useImperativeHandle(ref, () => ({ scrollTo: mockScrollTo }));
      return <actual.View {...props}>{children}</actual.View>;
    }),
  };
});

describe("DaySelector", () => {
  const workoutDayIndices = [0, 2, 5, 7];
  const today = new Date("2025-06-15T12:00:00Z");
  const startDate = "2025-06-10T00:00:00Z";

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(today);
    jest.spyOn(Dimensions, "get").mockReturnValue({
      width: 320,
      height: 640,
      scale: 1,
      fontScale: 1,
    });
    mockScrollTo.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
    (Dimensions.get as jest.Mock).mockRestore();
  });

  it("jumps to today and scrolls to center it", () => {
    const onDaySelect = jest.fn();
    const { getByText } = render(
      <DaySelector
        startDate={startDate}
        workoutDayIndices={workoutDayIndices}
        currentDayIndex={2}
        onDaySelect={onDaySelect}
      />
    );

    act(() => {
      jest.runOnlyPendingTimers();
    });
    mockScrollTo.mockClear();

    fireEvent.press(getByText("Jump to Today"));

    const itemWidth = 90;
    const scrollPadding = 16;
    const todayIndex = 5;
    const expectedX = Math.max(
      0,
      todayIndex * itemWidth - 320 / 2 + itemWidth / 2 + scrollPadding
    );

    expect(onDaySelect).toHaveBeenCalledWith(todayIndex);
    expect(mockScrollTo).toHaveBeenCalledWith({
      x: expectedX,
      animated: true,
    });
  });

  it("shows jump to today when today scrolls off screen", () => {
    const onDaySelect = jest.fn();
    const { queryByText, UNSAFE_getByType } = render(
      <DaySelector
        startDate={startDate}
        workoutDayIndices={workoutDayIndices}
        currentDayIndex={5}
        onDaySelect={onDaySelect}
      />
    );

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(queryByText("Jump to Today")).toBeNull();

    const scrollView = UNSAFE_getByType(ScrollView);
    fireEvent.scroll(scrollView, {
      nativeEvent: { contentOffset: { x: 1000 } },
    });

    expect(queryByText("Jump to Today")).not.toBeNull();
  });

  it("resets scroll when start date changes", () => {
    const onDaySelect = jest.fn();
    const { rerender } = render(
      <DaySelector
        startDate={startDate}
        workoutDayIndices={workoutDayIndices}
        currentDayIndex={5}
        onDaySelect={onDaySelect}
      />
    );

    act(() => {
      jest.runOnlyPendingTimers();
    });
    mockScrollTo.mockClear();

    rerender(
      <DaySelector
        startDate="2025-06-12T00:00:00Z"
        workoutDayIndices={workoutDayIndices}
        currentDayIndex={0}
        onDaySelect={onDaySelect}
      />
    );

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(mockScrollTo).toHaveBeenCalledWith({ x: 0, animated: false });
  });
});
