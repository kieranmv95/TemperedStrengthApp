import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DaySelectorProps {
  startDate: string; // ISO string
  workoutDayIndices: number[]; // Array of day indices that have workouts
  currentDayIndex: number;
  onDaySelect: (dayIndex: number) => void;
}

// Constants for layout calculations
const ITEM_MIN_WIDTH = 50;
const ITEM_PADDING_H = 12;
const GAP = 16;
const SCROLL_PADDING_H = 16;
const ITEM_WIDTH = ITEM_MIN_WIDTH + ITEM_PADDING_H * 2 + GAP;

export const DaySelector: React.FC<DaySelectorProps> = ({
  startDate,
  workoutDayIndices,
  currentDayIndex,
  onDaySelect,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const lastStartDateRef = useRef<string>(startDate);
  const [isTodayVisible, setIsTodayVisible] = useState(true);
  
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  // Calculate the first and last day indices of the program
  const firstDayIndex =
    workoutDayIndices.length > 0 ? Math.min(...workoutDayIndices) : 0;
  const lastDayIndex =
    workoutDayIndices.length > 0
      ? Math.max(...workoutDayIndices)
      : currentDayIndex;

  // Show all days from the first session to the last session
  const minDayIndex = firstDayIndex;
  const maxDayIndex = lastDayIndex;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate which dayIndex corresponds to today
  const todayDayIndex = Math.floor(
    (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Check if today is within the visible range of days
  const isTodayInRange = todayDayIndex >= minDayIndex && todayDayIndex <= maxDayIndex;
  
  // Check if today is currently selected
  const isTodaySelected = currentDayIndex === todayDayIndex;

  const getDayLabel = (dayIndex: number): string => {
    const date = new Date(start);
    date.setDate(date.getDate() + dayIndex);
    const day = date.getDate();

    // Get short month name (Jan, Feb, Mar, etc.)
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];

    // Get ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
    const suffix = ["th", "st", "nd", "rd"][
      day % 10 > 3 || Math.floor((day % 100) / 10) === 1 ? 0 : day % 10
    ];

    return `${month} ${day}${suffix}`;
  };

  const isToday = (dayIndex: number): boolean => {
    const date = new Date(start);
    date.setDate(date.getDate() + dayIndex);
    date.setHours(0, 0, 0, 0);
    return date.getTime() === today.getTime();
  };

  const hasWorkout = (dayIndex: number): boolean => {
    return workoutDayIndices.includes(dayIndex);
  };

  const days = Array.from(
    { length: maxDayIndex - minDayIndex + 1 },
    (_, i) => minDayIndex + i
  );

  const hasScrolledInitially = useRef(false);
  const screenWidth = Dimensions.get("window").width;

  // Track scroll position to determine if today is visible
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!isTodayInRange) return;
      
      const scrollX = event.nativeEvent.contentOffset.x;
      const todayArrayIndex = todayDayIndex - minDayIndex;
      const todayPosition = todayArrayIndex * ITEM_WIDTH + SCROLL_PADDING_H;
      
      // Check if today's position is within the visible area
      const isVisible =
        todayPosition >= scrollX - ITEM_WIDTH &&
        todayPosition <= scrollX + screenWidth + ITEM_WIDTH;
      
      setIsTodayVisible(isVisible);
    },
    [todayDayIndex, minDayIndex, isTodayInRange, screenWidth]
  );

  // Jump to today handler
  const handleJumpToToday = useCallback(() => {
    if (!isTodayInRange) return;
    
    // Select today
    onDaySelect(todayDayIndex);
    
    // Scroll to center today
    const todayArrayIndex = todayDayIndex - minDayIndex;
    const scrollX =
      todayArrayIndex * ITEM_WIDTH -
      screenWidth / 2 +
      ITEM_WIDTH / 2 +
      SCROLL_PADDING_H;
    
    scrollViewRef.current?.scrollTo({
      x: Math.max(0, scrollX),
      animated: true,
    });
    
    setIsTodayVisible(true);
  }, [todayDayIndex, minDayIndex, screenWidth, onDaySelect, isTodayInRange]);

  // Scroll to center the current day on initial mount only
  // When startDate changes (e.g., "Set as Today"), just reset scroll to start
  // since day 0 will be at the beginning - no jarring animation needed
  useEffect(() => {
    const startDateChanged = lastStartDateRef.current !== startDate;
    
    if (startDateChanged) {
      // Start date changed - reset scroll to beginning instantly (day 0 is there)
      lastStartDateRef.current = startDate;
      scrollViewRef.current?.scrollTo({ x: 0, animated: false });
      // Reset visibility state - today should be visible after reset
      setIsTodayVisible(true);
    } else if (!hasScrolledInitially.current) {
      // Initial mount - scroll to center the current day
      hasScrolledInitially.current = true;
      
      // Calculate the index of current day in the days array
      const currentDayArrayIndex = currentDayIndex - minDayIndex;
      
      if (currentDayArrayIndex >= 0 && currentDayArrayIndex < days.length) {
        // Calculate scroll position to center the current day
        const scrollX =
          currentDayArrayIndex * ITEM_WIDTH -
          screenWidth / 2 +
          ITEM_WIDTH / 2 +
          SCROLL_PADDING_H;

        // Use setTimeout to ensure the ScrollView is mounted
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            x: Math.max(0, scrollX),
            animated: false,
          });
        }, 0);
      }
    }
  }, [startDate, currentDayIndex, minDayIndex, days.length, screenWidth]);

  // Show "Jump to Today" button if today is in range AND (not visible OR not selected)
  const showJumpToToday = isTodayInRange && (!isTodayVisible || !isTodaySelected);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {days.map((dayIndex) => {
          const dayHasWorkout = hasWorkout(dayIndex);
          const dayIsToday = isToday(dayIndex);
          const isSelected = dayIndex === currentDayIndex;

          return (
            <TouchableOpacity
              key={dayIndex}
              style={[styles.dayItem, isSelected && styles.dayItemSelected]}
              onPress={() => onDaySelect(dayIndex)}
            >
              <Text
                style={[styles.dayLabel, isSelected && styles.dayLabelSelected]}
              >
                {getDayLabel(dayIndex)}
              </Text>
              <View
                style={[
                  styles.dot,
                  dayIsToday
                    ? styles.dotToday
                    : dayHasWorkout
                    ? styles.dotWorkout
                    : null,
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {showJumpToToday && (
        <TouchableOpacity
          style={styles.jumpToTodayButton}
          onPress={handleJumpToToday}
          activeOpacity={0.8}
        >
          <Text style={styles.jumpToTodayText}>Jump to Today</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E1E1E",
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
    paddingTop: 12,
    paddingBottom: 8,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: SCROLL_PADDING_H,
    alignItems: "center",
    gap: GAP,
  },
  dayItem: {
    alignItems: "center",
    paddingHorizontal: ITEM_PADDING_H,
    paddingVertical: 8,
    minWidth: ITEM_MIN_WIDTH,
  },
  dayItemSelected: {
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
  },
  dayLabel: {
    color: "#888",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  dayLabelSelected: {
    color: "#FFFFFF",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 2,
  },
  dotWorkout: {
    backgroundColor: "#888",
  },
  dotToday: {
    backgroundColor: "#c9b072",
  },
  jumpToTodayButton: {
    alignSelf: "center",
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#c9b072",
  },
  jumpToTodayText: {
    color: "#c9b072",
    fontSize: 12,
    fontWeight: "600",
  },
});
