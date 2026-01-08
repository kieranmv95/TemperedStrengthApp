import React from "react";
import {
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

export const DaySelector: React.FC<DaySelectorProps> = ({
  startDate,
  workoutDayIndices,
  currentDayIndex,
  onDaySelect,
}) => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  // Calculate the date range to show (e.g., 7 days before and after current day)
  const minDayIndex = Math.max(0, currentDayIndex - 7);
  const maxDayIndex = currentDayIndex + 14;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDayLabel = (dayIndex: number): string => {
    const date = new Date(start);
    date.setDate(date.getDate() + dayIndex);
    const day = date.getDate();

    // Get ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
    const suffix = ["th", "st", "nd", "rd"][
      day % 10 > 3 || Math.floor((day % 100) / 10) === 1 ? 0 : day % 10
    ];

    return `${day}${suffix}`;
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

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
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
              {/* {dayHasWorkout && ( */}
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
              {/* )} */}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E1E1E",
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
    paddingVertical: 12,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 16,
    alignItems: "center",
    gap: 16,
  },
  dayItem: {
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 50,
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
    backgroundColor: "#00E676",
  },
});
