import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { DaySelector } from "../components/DaySelector";
import { SettingsModal } from "../components/SettingsModal";
import { Workout } from "../utils/program";

interface RestDayScreenProps {
  nextWorkout: Workout | null;
  startDate: string;
  workoutDayIndices: number[];
  currentDayIndex: number;
  onViewNextWorkout: () => void;
  onSkipToNextWorkout: () => void;
  onDaySelect: (dayIndex: number) => void;
  onProgramReset?: () => void;
}

export const RestDayScreen: React.FC<RestDayScreenProps> = ({
  nextWorkout,
  startDate,
  workoutDayIndices,
  currentDayIndex,
  onViewNextWorkout,
  onSkipToNextWorkout,
  onDaySelect,
  onProgramReset,
}) => {
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <DaySelector
        startDate={startDate}
        workoutDayIndices={workoutDayIndices}
        currentDayIndex={currentDayIndex}
        onDaySelect={onDaySelect}
      />
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => setSettingsModalVisible(true)}
        >
          <Text style={styles.settingsButtonText}>⚙️</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>💤</Text>
        </View>
        <Text style={styles.title}>Rest Day</Text>
        <Text style={styles.subtitle}>
          Your body needs recovery to grow stronger.
        </Text>
        <Text style={styles.description}>
          Take this time to rest, hydrate, and prepare for your next workout.
        </Text>
      </View>

      <SettingsModal
        visible={settingsModalVisible}
        onClose={() => setSettingsModalVisible(false)}
        onProgramReset={() => {
          if (onProgramReset) {
            onProgramReset();
          }
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerSpacer: {
    flex: 1,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1E1E1E",
    alignItems: "center",
    justifyContent: "center",
  },
  settingsButtonText: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  icon: {
    fontSize: 80,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    color: "#888",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    color: "#CCC",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    paddingHorizontal: 16,
  },
});
