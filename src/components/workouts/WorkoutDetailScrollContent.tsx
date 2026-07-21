import { Pill } from '@/src/components/pill';
import { StandaloneWorkoutLogPanel } from '@/src/components/StandaloneWorkoutLogPanel';
import { Colors } from '@/src/constants/theme';
import type {
  DetailedMovement,
  Divider,
  SingleWorkout,
  WorkoutBlockBase,
  WorkoutMovement,
} from '@/src/types/workouts';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { workoutDetailStyles as styles } from './workoutDetailStyles';
import { CATEGORY_ICONS, DIFFICULTY_COLORS } from './workoutUiConstants';

type WorkoutDetailScrollContentProps = {
  workout: SingleWorkout;
};

type WorkoutScaledBlockGroup = {
  scale: string;
  blocks: WorkoutBlockBase[];
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
  return `${movement.name}: ${movement.value}${
    movement.note ? ` (${movement.note})` : ''
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

function renderMovementRow(movement: WorkoutMovement, movementIndex: number) {
  if (isDivider(movement)) {
    return (
      <View key={movementIndex} style={styles.divider}>
        <Text style={styles.dividerText}>{movement.note}</Text>
      </View>
    );
  }

  const movementText = movementToRowText(movement);
  return (
    <View key={movementIndex} style={styles.movementItem}>
      <Text style={styles.movementBullet}>•</Text>
      <Text style={styles.movementText}>{movementText}</Text>
    </View>
  );
}

export function WorkoutDetailScrollContent({
  workout,
}: WorkoutDetailScrollContentProps) {
  const [selectedScaleIndex, setSelectedScaleIndex] = useState(0);

  useEffect(() => setSelectedScaleIndex(0), [workout.id]);

  const collab = workout.collab;
  const handleCollabPress = useCallback(() => {
    if (!collab?.link) return;
    Linking.openURL(collab.link).catch((error) => {
      console.error('Failed to open collab URL:', error);
    });
  }, [collab?.link]);

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

  const flatBlocks = useMemo((): WorkoutBlockBase[] | null => {
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

      {collab ? (
        <TouchableOpacity
          style={[
            styles.collabCard,
            collab.bgColor ? { backgroundColor: collab.bgColor } : null,
            collab.linkAndBorderColor
              ? { borderColor: collab.linkAndBorderColor }
              : null,
          ]}
          onPress={handleCollabPress}
          activeOpacity={0.85}
          accessibilityRole="link"
          accessibilityLabel={`In collaboration with ${collab.name}. Find out more.`}
        >
          <View style={styles.collabHeaderRow}>
            {collab.image ? (
              <Image source={collab.image} style={styles.collabImage} />
            ) : null}
            <View style={styles.collabHeaderText}>
              <Text
                style={[
                  styles.collabLabel,
                  collab.inColabWithColor
                    ? { color: collab.inColabWithColor }
                    : null,
                ]}
              >
                In collaboration with
              </Text>
              <Text
                style={[
                  styles.collabName,
                  collab.nameColor ? { color: collab.nameColor } : null,
                ]}
              >
                {collab.name}
              </Text>
            </View>
          </View>
          {collab.description ? (
            <Text
              style={[
                styles.collabDescription,
                collab.descriptionColor
                  ? { color: collab.descriptionColor }
                  : null,
              ]}
            >
              {collab.description}
            </Text>
          ) : null}
          <View style={styles.collabCtaRow}>
            <Ionicons
              name="open-outline"
              size={16}
              color={collab.linkAndBorderColor ?? Colors.accent}
            />
            <Text
              style={[
                styles.collabCtaText,
                collab.linkAndBorderColor
                  ? { color: collab.linkAndBorderColor }
                  : null,
              ]}
            >
              {collab.linkCopy ? collab.linkCopy : 'Click to find out more'}
            </Text>
          </View>
        </TouchableOpacity>
      ) : null}

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
              onPress={() => {}}
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
              {block.mobilityFlow && (
                <TouchableOpacity
                  onPress={() => {
                    router.push({
                      pathname: '/recovery/[id]',
                      params: { id: block.mobilityFlow as string },
                    });
                  }}
                  style={styles.startFlowButton}
                >
                  <Text style={styles.startFlowText}>
                    {block.mobilityFlowCopy
                      ? block.mobilityFlowCopy
                      : 'Start Mobility Flow'}
                  </Text>
                </TouchableOpacity>
              )}
              {block.instructions && (
                <Text style={styles.blockInstructions}>
                  {block.instructions}
                </Text>
              )}
              {block.highlightInstructions && (
                <Text style={styles.blockHighlightInstructions}>
                  {block.highlightInstructions}
                </Text>
              )}
              {block.movements && (
                <View style={styles.movementsList}>
                  {block.movements.map((movement, movementIndex) =>
                    renderMovementRow(movement, movementIndex)
                  )}
                </View>
              )}
            </View>
          ))}
        </>
      ) : flatBlocks ? (
        flatBlocks.map((block, blockIndex) => (
          <View key={blockIndex} style={styles.blockContainer}>
            <Text style={styles.blockName}>{block.name}</Text>
            {block.mobilityFlow && (
              <TouchableOpacity
                onPress={() => {
                  router.push({
                    pathname: '/recovery/[id]',
                    params: { id: block.mobilityFlow as string },
                  });
                }}
                style={styles.startFlowButton}
              >
                <Text style={styles.startFlowText}>
                  {block.mobilityFlowCopy
                    ? block.mobilityFlowCopy
                    : 'Start Mobility Flow'}
                </Text>
              </TouchableOpacity>
            )}
            {block.instructions && (
              <Text style={styles.blockInstructions}>{block.instructions}</Text>
            )}
            {block.highlightInstructions && (
              <Text style={styles.blockHighlightInstructions}>
                {block.highlightInstructions}
              </Text>
            )}
            {block.movements && (
              <View style={styles.movementsList}>
                {block.movements.map((movement, movementIndex) =>
                  renderMovementRow(movement, movementIndex)
                )}
              </View>
            )}
          </View>
        ))
      ) : null}

      <StandaloneWorkoutLogPanel workout={workout} />
    </ScrollView>
  );
}
