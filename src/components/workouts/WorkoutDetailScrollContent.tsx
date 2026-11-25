import {
  ActionChip,
  Badge,
  Collapsible,
  PressableCard,
  SectionHeader,
  Tag,
} from '@/src/components/ds';
import { GlossaryText } from '@/src/components/glossary/GlossaryText';
import { StartGymTimerButton } from '@/src/components/gymTimer/StartGymTimerButton';
import { StandaloneWorkoutLogPanel } from '@/src/components/StandaloneWorkoutLogPanel';
import { HeartRateZoneChip } from '@/src/components/zones/HeartRateZoneChip';
import { color } from '@/src/constants/tokens';
import { useWeightUnit } from '@/src/hooks/useWeightUnit';
import type { ZoneRange } from '@/src/types/heartRate';
import type { PersonalBestsStore } from '@/src/types/personalBests';
import type {
  DetailedMovement,
  Divider,
  SingleWorkout,
  WorkoutBlockBase,
  WorkoutMovement,
} from '@/src/types/workouts';
import { resolveWorkoutTimerConfig } from '@/src/utils/gymTimer';
import {
  blockHasLoadPercentTokens,
  resolveEstimatedOneRmKg,
} from '@/src/utils/loadPercent';
import { getPersonalBestsStore, type WeightUnit } from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { BlockLoadBasis } from './BlockLoadBasis';
import { BlockLoadPbPrompt } from './BlockLoadPbPrompt';
import { LoadPercentText } from './LoadPercentText';
import { workoutDetailStyles as styles } from './workoutDetailStyles';
import {
  levelsLabel,
  primaryDisciplineIcon,
  workoutDetailTagLabels,
} from './workoutUiConstants';

type WorkoutDetailScrollContentProps = {
  workout: SingleWorkout;
  /** User's heart rate zones for blocks with `hrZone`; `null` until set up. */
  zoneRanges: ZoneRange[] | null;
};

type WorkoutScaledBlockGroup = {
  scale: string;
  blocks: WorkoutBlockBase[];
};

type BlockLoadContext = {
  oneRmKg: number | null;
  unit: WeightUnit;
  showAddPb: boolean;
  isOverride: boolean;
  exerciseId: number | null;
  onPbSaved: () => void;
  onOverride: (exerciseId: number, oneRmKg: number) => void;
  onResetOverride: (exerciseId: number) => void;
};

function isScaledBlocks(
  blocks: SingleWorkout['blocks']
): blocks is WorkoutScaledBlockGroup[] {
  if (blocks.length === 0) return false;
  const first = blocks[0] as unknown;
  if (typeof first !== 'object' || first === null) return false;
  return 'scale' in (first as Record<string, unknown>);
}

function isDivider(movement: unknown): movement is Divider {
  return (
    typeof movement === 'object' &&
    movement !== null &&
    'type' in movement &&
    (movement as Divider).type === 'divider'
  );
}

function collectLoadExerciseIds(blocks: WorkoutBlockBase[]): number[] {
  const ids = new Set<number>();
  for (const block of blocks) {
    if (
      typeof block.loadExerciseId === 'number' &&
      blockHasLoadPercentTokens(block)
    ) {
      ids.add(block.loadExerciseId);
    }
  }
  return [...ids];
}

function resolveBlockLoadContext(
  block: WorkoutBlockBase,
  pbStore: PersonalBestsStore,
  unit: WeightUnit,
  oneRmOverrides: Record<number, number>,
  onPbSaved: () => void,
  onOverride: (exerciseId: number, oneRmKg: number) => void,
  onResetOverride: (exerciseId: number) => void
): BlockLoadContext {
  const hasTokens = blockHasLoadPercentTokens(block);
  const exerciseId = block.loadExerciseId;
  if (!hasTokens || typeof exerciseId !== 'number') {
    return {
      oneRmKg: null,
      unit,
      showAddPb: false,
      isOverride: false,
      exerciseId: null,
      onPbSaved,
      onOverride,
      onResetOverride,
    };
  }
  const overrideKg = oneRmOverrides[exerciseId];
  const isOverride =
    typeof overrideKg === 'number' && Number.isFinite(overrideKg);
  const fromPb = resolveEstimatedOneRmKg(pbStore[exerciseId] ?? {});
  const oneRmKg = isOverride ? overrideKg : fromPb;
  return {
    oneRmKg,
    unit,
    showAddPb: oneRmKg === null,
    isOverride,
    exerciseId,
    onPbSaved,
    onOverride,
    onResetOverride,
  };
}

function renderMovementRow(
  movement: WorkoutMovement,
  movementIndex: number,
  load: BlockLoadContext
) {
  if (isDivider(movement)) {
    return (
      <View key={movementIndex} style={styles.divider}>
        {movement.note ? (
          <LoadPercentText
            text={movement.note}
            oneRmKg={load.oneRmKg}
            unit={load.unit}
            style={styles.dividerText}
          />
        ) : null}
      </View>
    );
  }

  if (typeof movement === 'string') {
    return (
      <View key={movementIndex} style={styles.movementItem}>
        <View style={styles.movementBullet} />
        <View style={styles.movementTextColumn}>
          <LoadPercentText
            text={movement}
            oneRmKg={load.oneRmKg}
            unit={load.unit}
            style={styles.movementText}
          />
        </View>
      </View>
    );
  }

  const detailed = movement as DetailedMovement;
  return (
    <View key={movementIndex} style={styles.movementItem}>
      <View style={styles.movementBullet} />
      <View style={styles.movementTextColumn}>
        <Text style={styles.movementText}>
          <GlossaryText
            text={`${detailed.name}: `}
            style={styles.movementText}
          />
          <LoadPercentText
            text={detailed.value}
            oneRmKg={load.oneRmKg}
            unit={load.unit}
            weightContext={detailed.name}
          />
        </Text>
        {detailed.note ? (
          <LoadPercentText
            text={detailed.note}
            oneRmKg={load.oneRmKg}
            unit={load.unit}
            weightContext={detailed.name}
            style={styles.movementNote}
          />
        ) : null}
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

function renderBlockBody(
  block: WorkoutBlockBase,
  zoneRanges: ZoneRange[] | null,
  load: BlockLoadContext
) {
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
      {block.hrZone && (
        <HeartRateZoneChip zone={block.hrZone} ranges={zoneRanges} />
      )}
      {block.instructions && (
        <LoadPercentText
          text={block.instructions}
          oneRmKg={load.oneRmKg}
          unit={load.unit}
          style={styles.blockInstructions}
        />
      )}
      {block.highlightInstructions && (
        <LoadPercentText
          text={block.highlightInstructions}
          oneRmKg={load.oneRmKg}
          unit={load.unit}
          style={styles.blockHighlightInstructions}
        />
      )}
      {load.showAddPb && typeof block.loadExerciseId === 'number' ? (
        <BlockLoadPbPrompt
          exerciseId={block.loadExerciseId}
          unit={load.unit}
          onSaved={load.onPbSaved}
        />
      ) : null}
      {load.oneRmKg !== null && typeof load.exerciseId === 'number' ? (
        <BlockLoadBasis
          oneRmKg={load.oneRmKg}
          unit={load.unit}
          isOverride={load.isOverride}
          onOverride={(kg) => load.onOverride(load.exerciseId as number, kg)}
          onResetOverride={() =>
            load.onResetOverride(load.exerciseId as number)
          }
        />
      ) : null}
      {block.movements && (
        <View style={styles.movementsList}>
          {block.movements.map((movement, movementIndex) =>
            renderMovementRow(movement, movementIndex, load)
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
  onToggle: () => void,
  zoneRanges: ZoneRange[] | null,
  load: BlockLoadContext
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
        {renderBlockBody(block, zoneRanges, load)}
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
        {renderBlockBody(block, zoneRanges, load)}
      </Collapsible>
    );
  }

  return (
    <View key={key} style={styles.blockContainer}>
      <GlossaryText
        text={block.name}
        style={styles.blockName}
        accessibilityRole="header"
      />
      {renderBlockBody(block, zoneRanges, load)}
    </View>
  );
}

export function WorkoutDetailScrollContent({
  workout,
  zoneRanges,
}: WorkoutDetailScrollContentProps) {
  const { unit: weightUnit } = useWeightUnit();
  const [selectedScaleIndex, setSelectedScaleIndex] = useState(0);
  /** Expanded warm-up sections by block key; collapsed until opened. */
  const [expandedBlocks, setExpandedBlocks] = useState<Record<string, boolean>>(
    {}
  );
  const [pbStore, setPbStore] = useState<PersonalBestsStore>({});
  const [pbRevision, setPbRevision] = useState(0);
  /** Session-only 1RM overrides keyed by exercise id. Not written to PBs. */
  const [oneRmOverrides, setOneRmOverrides] = useState<Record<number, number>>(
    {}
  );

  const refreshPersonalBests = useCallback(async () => {
    try {
      const store = await getPersonalBestsStore();
      setPbStore(store);
    } catch (error) {
      console.error('Error loading personal bests for load breakdown:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refreshPersonalBests();
    }, [refreshPersonalBests, pbRevision])
  );

  const handlePbSaved = useCallback(() => {
    setPbRevision((n) => n + 1);
  }, []);

  const handleOneRmOverride = useCallback(
    (exerciseId: number, oneRmKg: number) => {
      setOneRmOverrides((prev) => ({ ...prev, [exerciseId]: oneRmKg }));
    },
    []
  );

  const handleResetOneRmOverride = useCallback((exerciseId: number) => {
    setOneRmOverrides((prev) => {
      if (!(exerciseId in prev)) {
        return prev;
      }
      const next = { ...prev };
      delete next[exerciseId];
      return next;
    });
  }, []);

  useEffect(() => {
    setSelectedScaleIndex(0);
    setOneRmOverrides({});
  }, [workout.id]);

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

  const visibleTags = workoutDetailTagLabels(workout);

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

  const loadExerciseIds = useMemo(() => {
    if (scaledBlocks) {
      return collectLoadExerciseIds(scaledBlocks.selected.blocks);
    }
    if (flatBlocks) {
      return collectLoadExerciseIds(flatBlocks);
    }
    return [];
  }, [scaledBlocks, flatBlocks]);

  // Keep a stable refresh when the visible blocks' lifts change.
  useEffect(() => {
    if (loadExerciseIds.length === 0) {
      return;
    }
    void refreshPersonalBests();
  }, [loadExerciseIds, refreshPersonalBests]);

  const collabCtaLabel = collab?.linkCopy ? collab.linkCopy : 'Find out more';
  const timerConfig = useMemo(
    () => resolveWorkoutTimerConfig(workout),
    [workout]
  );

  return (
    <ScrollView
      style={styles.detailContent}
      contentContainerStyle={styles.detailContentContainer}
    >
      <View style={styles.detailMetaRow}>
        <View style={styles.detailCategory}>
          <Ionicons
            name={primaryDisciplineIcon(workout)}
            size={14}
            color={color.gold}
          />
          <Text style={styles.detailCategoryText}>
            {workout.disciplines[0]}
          </Text>
        </View>
        {workout.special ? (
          <Badge label={workout.special} tone="neutral" />
        ) : null}
        <View
          style={styles.detailMetaItem}
          accessible
          accessibilityLabel={`${workout.estimatedTime} minutes`}
        >
          <Ionicons name="time-outline" size={16} color={color.textSecondary} />
          <Text style={styles.detailMetaText}>{workout.estimatedTime} min</Text>
        </View>
        <Badge label={levelsLabel(workout.levels)} tone="neutral" />
      </View>

      <GlossaryText
        text={workout.description}
        style={styles.detailDescription}
      />

      {timerConfig ? <StartGymTimerButton config={timerConfig} /> : null}

      {collab ? (
        <PressableCard
          variant="promo"
          accentColor={collab.linkAndBorderColor}
          surfaceColor={collab.bgColor}
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
            <GlossaryText
              text={collab.description}
              style={[
                styles.collabDescription,
                collab.descriptionColor
                  ? { color: collab.descriptionColor }
                  : null,
              ]}
            />
          ) : null}
          <View style={styles.collabCtaRow}>
            <Ionicons
              name="open-outline"
              size={16}
              color={collab.nameColor ?? color.gold}
            />
            <Text
              style={[
                styles.collabCtaText,
                collab.nameColor ? { color: collab.nameColor } : null,
              ]}
            >
              {collabCtaLabel}
            </Text>
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
            <View
              style={styles.scaleSegmentTrack}
              accessibilityRole="radiogroup"
            >
              <ScrollView
                horizontal
                nestedScrollEnabled
                directionalLockEnabled
                alwaysBounceHorizontal={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scaleSegmentRow}
              >
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
                        numberOfLines={1}
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
              </ScrollView>
            </View>
          </View>

          {scaledBlocks.selected.blocks.map((block, blockIndex) => {
            const key = `${workout.id}-scale-${scaledBlocks.safeIndex}-block-${blockIndex}`;
            const load = resolveBlockLoadContext(
              block,
              pbStore,
              weightUnit,
              oneRmOverrides,
              handlePbSaved,
              handleOneRmOverride,
              handleResetOneRmOverride
            );
            return renderWorkoutBlock(
              block,
              key,
              isBlockExpanded(key),
              () => toggleBlock(key),
              zoneRanges,
              load
            );
          })}
        </>
      ) : flatBlocks ? (
        flatBlocks.map((block, blockIndex) => {
          const key = `${workout.id}-block-${blockIndex}`;
          const load = resolveBlockLoadContext(
            block,
            pbStore,
            weightUnit,
            oneRmOverrides,
            handlePbSaved,
            handleOneRmOverride,
            handleResetOneRmOverride
          );
          return renderWorkoutBlock(
            block,
            key,
            isBlockExpanded(key),
            () => toggleBlock(key),
            zoneRanges,
            load
          );
        })
      ) : null}

      <StandaloneWorkoutLogPanel workout={workout} />
    </ScrollView>
  );
}
