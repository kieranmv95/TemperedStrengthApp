import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { ExerciseCard } from '../components/ExerciseCard';
import { SwapModal } from '../components/SwapModal';
import { CoachFeedback } from '../components/CoachFeedback';

// Sample workout initialization: Bench Press, Squat, Row
const SAMPLE_WORKOUT = ['1', '4', '7', null]; // Bench Press, Back Squat, Barbell Row, Empty slot

export const WorkoutScreen: React.FC = () => {
  const [slots, setSlots] = useState<(string | null)[]>(SAMPLE_WORKOUT);
  const [swapModalVisible, setSwapModalVisible] = useState(false);
  const [currentSwapSlot, setCurrentSwapSlot] = useState<number | null>(null);
  const [coachModalVisible, setCoachModalVisible] = useState(false);
  const [lastLoggedWeight, setLastLoggedWeight] = useState<number>(0);

  const handleSwapClick = (slotNumber: number) => {
    setCurrentSwapSlot(slotNumber);
    setSwapModalVisible(true);
  };

  const handleSelectExercise = (exerciseId: string) => {
    if (currentSwapSlot !== null) {
      const newSlots = [...slots];
      newSlots[currentSwapSlot - 1] = exerciseId;
      setSlots(newSlots);
    }
  };

  const handleSetLogged = (weight: number) => {
    setLastLoggedWeight(weight);
    setCoachModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Workout Logbook</Text>
          <Text style={styles.subtitle}>Track your sets, adapt your training</Text>
        </View>

        {slots.map((exerciseId, index) => (
          <ExerciseCard
            key={index}
            exerciseId={exerciseId}
            slotNumber={index + 1}
            onSwap={() => handleSwapClick(index + 1)}
            onSetLogged={handleSetLogged}
          />
        ))}
      </ScrollView>

      <SwapModal
        visible={swapModalVisible}
        currentExerciseId={currentSwapSlot !== null ? slots[currentSwapSlot - 1] : null}
        onClose={() => {
          setSwapModalVisible(false);
          setCurrentSwapSlot(null);
        }}
        onSelectExercise={handleSelectExercise}
      />

      <CoachFeedback
        visible={coachModalVisible}
        currentWeight={lastLoggedWeight}
        onClose={() => setCoachModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
    paddingTop: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: '#888',
    fontSize: 16,
    fontWeight: '500',
  },
});

