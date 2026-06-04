import { Pill } from '@/src/components/pill';
import { StandaloneWorkoutLogPanel } from '@/src/components/StandaloneWorkoutLogPanel';
import { Colors } from '@/src/constants/theme';
import type {
  DetailedMovement,
  Divider,
  SingleWorkout,
} from '@/src/types/workouts';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { workoutDetailStyles as styles } from './workoutDetailStyles';
import { CATEGORY_ICONS, DIFFICULTY_COLORS } from './workoutUiConstants';

type WorkoutDetailScrollContentProps = {
  workout: SingleWorkout;
};

type WorkoutFlatBlock = {
  name: string;
  instructions?: string;
  movements: string[] | DetailedMovement[] | Divider[];
};

type WorkoutScaledBlockGroup = {
  scale: string;
  blocks: WorkoutFlatBlock[];
};

function isScaledBlocks(
  blocks: SingleWorkout['blocks']
): blocks is WorkoutScaledBlockGroup[] {
  if (blocks.length === 0) return false;
  const first = blocks[0] as unknown;
  if (typeof first !== 'object' || first === null) return false;
  return 'scale' in (first as Record<string, unknown>);
}

function movementToRowText(movement: string | DetailedMovement): string {
  if (typeof movement === 'string') return movement;
  return `${movement.name}: ${movement.value}${movement.note ? ` (${movement.note})` : ''
    }`;
}

function isDivider(movement: unknown): movement is Divider {
  return (
    typeof movement === 'object' &&
    movement !== null &&
    'type' in movement &&
    (movement as Divider).type === 'divider'
  );
}

export function WorkoutDetailScrollContent({
  workout,
}: WorkoutDetailScrollContentProps) {
  const [selectedScaleIndex, setSelectedScaleIndex] = useState(0);

  useEffect(() => setSelectedScaleIndex(0), [workout.id]);

  const visibleTags = useMemo(() => {
    return workout.tags;
  }, [workout.tags]);

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
            <Image
              source={require('@/assets/images/logos/rainhill_icon.png')}
              style={styles.categoryIconImage}
            />
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

      {visibleTags.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagsScrollRow}
        >
          {visibleTags.map((tag, index) => (
            <Pill
              key={`${index}-${tag}`}
              label={tag}
              isActive={false}
              disabled
              onPress={() => { }}
            />
          ))}
        </ScrollView>
      ) : null}

      {scaledBlocks ? (
        <>
          <Text style={styles.scaleSelectorTitle}>Scalings</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scaleSelectorRow}
          >
            {scaledBlocks.all.map((s, i) => (
              <Pill
                key={`${i}-${s.scale}`}
                label={s.scale}
                isActive={i === scaledBlocks.safeIndex}
                onPress={() => setSelectedScaleIndex(i)}
              />
            ))}
          </ScrollView>

          {scaledBlocks.selected.blocks.map((block, blockIndex) => (
            <View key={blockIndex} style={styles.blockContainer}>
              <Text style={styles.blockName}>{block.name}</Text>
              {block.instructions && (
                <Text style={styles.blockInstructions}>
                  {block.instructions}
                </Text>
              )}
              <View style={styles.movementsList}>
                {block.movements.map((movement, movementIndex) => {
                  if (isDivider(movement)) {
                    return (
                      <View key={movementIndex} style={styles.divider}>
                        <Text style={styles.dividerText}>{movement.note}</Text>
                      </View>
                    );
                  }

                  const movementText = movementToRowText(
                    movement as string | DetailedMovement
                  );
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
                if (isDivider(movement)) {
                  return (
                    <View key={movementIndex} style={styles.divider}>
                      <Text style={styles.dividerText}>{movement.note}</Text>
                    </View>
                  );
                }

                const movementText = movementToRowText(
                  movement as string | DetailedMovement
                );
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
