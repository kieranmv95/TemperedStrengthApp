import { StandaloneWorkoutLogPanel } from '@/src/components/StandaloneWorkoutLogPanel';
import { Colors } from '@/src/constants/theme';
import type { OnboardingGender } from '@/src/types/onboarding';
import type { SingleWorkout } from '@/src/types/workouts';
import { getOnboardingProfile } from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { workoutDetailStyles as styles } from './workoutDetailStyles';
import { CATEGORY_ICONS, DIFFICULTY_COLORS } from './workoutUiConstants';

const WOMENS_PICKS_TAG = 'Women’s Picks';

type WorkoutDetailScrollContentProps = {
  workout: SingleWorkout;
};

type WorkoutBlock = {
  name: string;
  instructions?: string;
  movements: string[] | { name: string; value: string; note?: string }[];
};

type WorkoutScaledBlocks = {
  scale: string;
  blocks: WorkoutBlock[];
};

function isScaledBlocks(
  blocks: SingleWorkout['blocks']
): blocks is WorkoutScaledBlocks[] {
  const first = blocks[0] as unknown;
  return (
    typeof first === 'object' &&
    first !== null &&
    'scale' in (first as Record<string, unknown>) &&
    'blocks' in (first as Record<string, unknown>)
  );
}

export function WorkoutDetailScrollContent({
  workout,
}: WorkoutDetailScrollContentProps) {
  const [onboardingGender, setOnboardingGender] =
    useState<OnboardingGender | null>(null);
  const [selectedScaleIndex, setSelectedScaleIndex] = useState(0);

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

  useEffect(() => {
    setSelectedScaleIndex(0);
  }, [workout.id]);

  const visibleTags = useMemo(() => {
    if (onboardingGender === 'female') return workout.tags;
    return workout.tags.filter((t) => t !== WOMENS_PICKS_TAG);
  }, [onboardingGender, workout.tags]);

  const scaledBlocks = useMemo(() => {
    if (!isScaledBlocks(workout.blocks)) return null;
    if (workout.blocks.length === 0) return null;
    const safeIndex = Math.min(
      Math.max(selectedScaleIndex, 0),
      workout.blocks.length - 1
    );
    return {
      all: workout.blocks,
      selected: workout.blocks[safeIndex],
      safeIndex,
    };
  }, [selectedScaleIndex, workout.blocks]);

  const flatBlocks = useMemo(() => {
    if (isScaledBlocks(workout.blocks)) return null;
    return workout.blocks;
  }, [workout.blocks]);

  return (
    <ScrollView
      style={styles.detailContent}
      contentContainerStyle={styles.detailContentContainer}
    >
      <View style={styles.detailMetaRow}>
        <View style={styles.detailCategoryBadge}>
          {workout.category === 'Rainhill' ? (
            <Image source={require('@/assets/images/logos/rainhill_icon.png')} style={styles.categoryIconImage} />
          ) : (
            <Ionicons
              name={CATEGORY_ICONS[workout.category] as any}
              size={14}
              color={Colors.accent}
            />
          )}
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

      {scaledBlocks ? (
        <>
          <Text style={styles.scaleSelectorTitle}>Scalings</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scaleSelectorRow}
          >
            {scaledBlocks.all.map((s, i) => {
              const isActive = i === scaledBlocks.safeIndex;
              return (
                <TouchableOpacity
                  key={s.scale}
                  style={[
                    styles.scaleButton,
                    isActive && styles.scaleButtonActive,
                  ]}
                  onPress={() => setSelectedScaleIndex(i)}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityLabel={`Select scale ${s.scale}`}
                >
                  <Text
                    style={[
                      styles.scaleButtonText,
                      isActive && styles.scaleButtonTextActive,
                    ]}
                  >
                    {s.scale}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {scaledBlocks.selected.blocks.map((block, blockIndex) => (
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
                      : `${movement.name}: ${movement.value}${movement.note ? ` (${movement.note})` : ''
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
        </>
      ) : flatBlocks ? (
        flatBlocks.map((block, blockIndex) => (
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
                    : `${movement.name}: ${movement.value}${movement.note ? ` (${movement.note})` : ''
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
        ))
      ) : null}

      <StandaloneWorkoutLogPanel workout={workout} />
    </ScrollView>
  );
}
