import {
  ActionChip,
  Badge,
  Collapsible,
  PressableCard,
  SectionHeader,
  Tag,
} from '@/src/components/ds';
import { StandaloneWorkoutLogPanel } from '@/src/components/StandaloneWorkoutLogPanel';
import { categoryFilterDisplayLabel } from '@/src/components/workouts/workoutsScreenConstants';
import { color } from '@/src/constants/tokens';
import type {
  DetailedMovement,
  Divider,
  SingleWorkout,
  WorkoutBlockBase,
  WorkoutMovement,
} from '@/src/types/workouts';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { workoutDetailStyles as styles } from './workoutDetailStyles';
import { CATEGORY_ICONS } from './workoutUiConstants';

type WorkoutDetailScrollContentProps = {
  workout: SingleWorkout;
  /** Overrides the app-wide category label, e.g. for Tempered Daily. */
  categoryLabel?: string;
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
  return `${movement.name}: ${movement.value}`;
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
  const note = typeof movement === 'string' ? undefined : movement.note;
  return (
    <View key={movementIndex} style={styles.movementItem}>
      <View style={styles.movementBullet} />
      <View style={styles.movementTextColumn}>
        <Text style={styles.movementText}>{movementText}</Text>
        {note ? <Text style={styles.movementNote}>{note}</Text> : null}
      </View>
    </View>
  );
}

/** Matches Warmup / Warm-Up / Warm Up (any casing). */
function isWarmupBlockName(name: string): boolean {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, '') === 'warmup'
  );
}

function renderBlockBody(block: WorkoutBlockBase) {
  return (
    <>
      {block.mobilityFlow && (
        <ActionChip
          label={
            block.mobilityFlowCopy
              ? block.mobilityFlowCopy
              : 'Start mobility flow'
          }
          icon="body-outline"
          tone="gold"
          onPress={() => {
            router.push({
              pathname: '/recovery/[id]',
              params: { id: block.mobilityFlow as string },
            });
          }}
        />
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
    </>
  );
}

function renderWorkoutBlock(
  block: WorkoutBlockBase,
  key: string,
  expanded: boolean,
  onToggle: () => void
) {
  if (block.optional) {
    return (
      <Collapsible
        key={key}
        title={block.name}
        expanded={expanded}
        onToggle={onToggle}
        accessory={<Badge label="Optional" tone="neutral" />}
        accessibilityLabel={`${block.name}, optional`}
      >
        {renderBlockBody(block)}
      </Collapsible>
    );
  }

  if (isWarmupBlockName(block.name)) {
    return (
      <Collapsible
        key={key}
        title={block.name}
        expanded={expanded}
        onToggle={onToggle}
      >
        {renderBlockBody(block)}
      </Collapsible>
    );
  }

  return (
    <View key={key} style={styles.blockContainer}>
      <Text style={styles.blockName} accessibilityRole="header">
        {block.name}
      </Text>
      {renderBlockBody(block)}
    </View>
  );
}

export function WorkoutDetailScrollContent({
  workout,
  categoryLabel: categoryLabelOverride,
}: WorkoutDetailScrollContentProps) {
  const [selectedScaleIndex, setSelectedScaleIndex] = useState(0);
  /** Expanded warm-up sections by block key; collapsed until opened. */
  const [expandedBlocks, setExpandedBlocks] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => setSelectedScaleIndex(0), [workout.id]);

  const isBlockExpanded = (key: string) => expandedBlocks[key] ?? false;
  const toggleBlock = (key: string) => {
    setExpandedBlocks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const collab = workout.collab;
  const handleCollabPress = () => {
    if (!collab?.link) return;
    Linking.openURL(collab.link).catch((error) => {
      console.error('Failed to open collab URL:', error);
    });
  };

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

  const categoryLabel =
    categoryLabelOverride ?? categoryFilterDisplayLabel(workout.category);
  const collabCtaLabel = collab?.linkCopy ? collab.linkCopy : 'Find out more';

  return (
    <ScrollView
      style={styles.detailContent}
      contentContainerStyle={styles.detailContentContainer}
    >
      <View style={styles.detailMetaRow}>
        <View style={styles.detailCategory}>
          {workout.category === 'Rainhill' ? (
            <Image
              source={require('@/assets/images/logos/rainhill_icon.png')}
              style={styles.categoryIconImage}
            />
          ) : (
            <Ionicons
              name={
                CATEGORY_ICONS[
                  workout.category
                ] as keyof typeof Ionicons.glyphMap
              }
              size={14}
              color={color.gold}
            />
          )}
          <Text style={styles.detailCategoryText}>{categoryLabel}</Text>
        </View>
        <View
          style={styles.detailMetaItem}
          accessible
          accessibilityLabel={`${workout.estimatedTime} minutes`}
        >
          <Ionicons name="time-outline" size={16} color={color.textSecondary} />
          <Text style={styles.detailMetaText}>{workout.estimatedTime} min</Text>
        </View>
        <Badge label={workout.difficulty} tone="neutral" />
      </View>

      <Text style={styles.detailDescription}>{workout.description}</Text>

      {collab ? (
        <PressableCard
          variant="promo"
          accentColor={collab.linkAndBorderColor}
          showChevron={false}
          onPress={handleCollabPress}
          accessibilityLabel={`In collaboration with ${collab.name}. ${collabCtaLabel}.`}
          accessibilityHint={collab.link ? 'Opens in your browser' : undefined}
        >
          <View style={styles.collabHeaderRow}>
            {collab.image ? (
              <Image source={collab.image} style={styles.collabImage} />
            ) : null}
            <View style={styles.collabHeaderText}>
              <Text style={styles.collabLabel}>In collaboration with</Text>
              <Text style={styles.collabName}>{collab.name}</Text>
            </View>
          </View>
          {collab.description ? (
            <Text style={styles.collabDescription}>{collab.description}</Text>
          ) : null}
          <View style={styles.collabCtaRow}>
            <Ionicons name="open-outline" size={16} color={color.gold} />
            <Text style={styles.collabCtaText}>{collabCtaLabel}</Text>
          </View>
        </PressableCard>
      ) : null}

      {visibleTags.length > 0 ? (
        <View style={styles.tagsRow}>
          {visibleTags.map((tag, index) => (
            <Tag key={`${index}-${tag}`} label={tag} />
          ))}
        </View>
      ) : null}

      {scaledBlocks ? (
        <>
          <View style={styles.scaleSection}>
            <SectionHeader title="Scalings" />
            <View style={styles.scaleSegmentRow} accessibilityRole="radiogroup">
              {scaledBlocks.all.map((s, i) => {
                const isActive = i === scaledBlocks.safeIndex;
                return (
                  <Pressable
                    key={`${i}-${s.scale}`}
                    style={({ pressed }) => [
                      styles.scaleSegment,
                      pressed && !isActive && styles.scaleSegmentPressed,
                      isActive && styles.scaleSegmentActive,
                    ]}
                    onPress={() => setSelectedScaleIndex(i)}
                    accessibilityRole="radio"
                    accessibilityLabel={`${s.scale} scaling`}
                    accessibilityState={{ checked: isActive }}
                  >
                    <Text
                      style={[
                        styles.scaleSegmentText,
                        isActive && styles.scaleSegmentTextActive,
                      ]}
                    >
                      {s.scale}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {scaledBlocks.selected.blocks.map((block, blockIndex) => {
            const key = `${workout.id}-scale-${scaledBlocks.safeIndex}-block-${blockIndex}`;
            return renderWorkoutBlock(block, key, isBlockExpanded(key), () =>
              toggleBlock(key)
            );
          })}
        </>
      ) : flatBlocks ? (
        flatBlocks.map((block, blockIndex) => {
          const key = `${workout.id}-block-${blockIndex}`;
          return renderWorkoutBlock(block, key, isBlockExpanded(key), () =>
            toggleBlock(key)
          );
        })
      ) : null}

      <StandaloneWorkoutLogPanel workout={workout} />
    </ScrollView>
  );
}
