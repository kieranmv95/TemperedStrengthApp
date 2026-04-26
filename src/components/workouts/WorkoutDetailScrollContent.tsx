import { StandaloneWorkoutLogPanel } from '@/src/components/StandaloneWorkoutLogPanel';
import { Colors } from '@/src/constants/theme';
import type { OnboardingGender } from '@/src/types/onboarding';
import type { SingleWorkout } from '@/src/types/workouts';
import { getOnboardingProfile } from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { CATEGORY_ICONS, DIFFICULTY_COLORS } from './workoutUiConstants';
import { workoutDetailStyles as styles } from './workoutDetailStyles';

const WOMENS_PICKS_TAG = "Women’s Picks";

type WorkoutDetailScrollContentProps = {
  workout: SingleWorkout;
};

export function WorkoutDetailScrollContent({
  workout,
}: WorkoutDetailScrollContentProps) {
  const [onboardingGender, setOnboardingGender] =
    useState<OnboardingGender | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const profile = await getOnboardingProfile();
      if (cancelled) return;
      setOnboardingGender(profile?.gender ?? null);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleTags = useMemo(() => {
    if (onboardingGender === 'female') return workout.tags;
    return workout.tags.filter((t) => t !== WOMENS_PICKS_TAG);
  }, [onboardingGender, workout.tags]);

  return (
    <ScrollView
      style={styles.detailContent}
      contentContainerStyle={styles.detailContentContainer}
    >
      <View style={styles.detailMetaRow}>
        <View style={styles.detailCategoryBadge}>
          <Ionicons
            name={CATEGORY_ICONS[workout.category] as any}
            size={14}
            color={Colors.accent}
          />
          <Text style={styles.detailCategoryText}>{workout.category}</Text>
        </View>
        <View style={styles.detailMetaItem}>
          <Ionicons name="time-outline" size={16} color={Colors.textMuted} />
          <Text style={styles.detailMetaText}>{workout.estimatedTime} min</Text>
        </View>
        <View
          style={[
            styles.difficultyBadge,
            { borderColor: DIFFICULTY_COLORS[workout.difficulty] },
          ]}
        >
          <Text
            style={[
              styles.difficultyText,
              { color: DIFFICULTY_COLORS[workout.difficulty] },
            ]}
          >
            {workout.difficulty}
          </Text>
        </View>
      </View>

      <Text style={styles.detailDescription}>{workout.description}</Text>

      <View style={styles.detailTagsContainer}>
        {visibleTags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      {workout.blocks.map((block, blockIndex) => (
        <View key={blockIndex} style={styles.blockContainer}>
          <Text style={styles.blockName}>{block.name}</Text>
          {block.instructions && (
            <Text style={styles.blockInstructions}>{block.instructions}</Text>
          )}
          <View style={styles.movementsList}>
            {block.movements.map((movement, movementIndex) => {
              const movementText =
                typeof movement === 'string'
                  ? movement
                  : `${movement.name}: ${movement.value}${
                      movement.note ? ` (${movement.note})` : ''
                    }`;
              return (
                <View key={movementIndex} style={styles.movementItem}>
                  <Text style={styles.movementBullet}>•</Text>
                  <Text style={styles.movementText}>{movementText}</Text>
                </View>
              );
            })}
          </View>
        </View>
      ))}

      <StandaloneWorkoutLogPanel workout={workout} />
    </ScrollView>
  );
}
