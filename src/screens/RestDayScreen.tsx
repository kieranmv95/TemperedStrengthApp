import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Workout } from '../utils/program';
import { DaySelector } from '../components/DaySelector';

interface RestDayScreenProps {
  nextWorkout: Workout | null;
  startDate: string;
  workoutDayIndices: number[];
  currentDayIndex: number;
  onViewNextWorkout: () => void;
  onSkipToNextWorkout: () => void;
  onDaySelect: (dayIndex: number) => void;
}

export const RestDayScreen: React.FC<RestDayScreenProps> = ({
  nextWorkout,
  startDate,
  workoutDayIndices,
  currentDayIndex,
  onViewNextWorkout,
  onSkipToNextWorkout,
  onDaySelect,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <DaySelector
        startDate={startDate}
        workoutDayIndices={workoutDayIndices}
        currentDayIndex={currentDayIndex}
        onDaySelect={onDaySelect}
      />
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

        {nextWorkout && (
          <View style={styles.nextWorkoutContainer}>
            <Text style={styles.nextWorkoutLabel}>Next Workout:</Text>
            <Text style={styles.nextWorkoutName}>{nextWorkout.label}</Text>
            <Text style={styles.nextWorkoutExercises}>
              {nextWorkout.exercises.length} exercises
            </Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          {nextWorkout && (
            <>
              <TouchableOpacity
                style={styles.viewButton}
                onPress={onViewNextWorkout}
              >
                <Text style={styles.viewButtonText}>View Next Workout</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.skipButton}
                onPress={onSkipToNextWorkout}
              >
                <Text style={styles.skipButtonText}>Skip to Next Workout</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  icon: {
    fontSize: 80,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    color: '#888',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    color: '#CCC',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  nextWorkoutContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    width: '100%',
    alignItems: 'center',
  },
  nextWorkoutLabel: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  nextWorkoutName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  nextWorkoutExercises: {
    color: '#00E676',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  viewButton: {
    backgroundColor: '#00E676',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#121212',
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  skipButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00E676',
  },
  skipButtonText: {
    color: '#00E676',
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

