import { ActionChip, ProgressBar, Skeleton, Tag } from '@/src/components/ds';
import {
  color,
  elevation,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { getExerciseById } from '@/src/data/exercises';
import type { WorkoutBlock, WorkoutMovement } from '@/src/types/program';
import {
  getConditioningLogsForDay,
  toggleConditioningBlockCompleted,
} from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type ConditioningWorkoutBodyProps = {
  dayIndex: number;
  blocks: WorkoutBlock[];
};

const LIST_BULLET_SIZE = 6;
const LOADING_SKELETON_WIDTH = 64;
const LOADING_SKELETON_HEIGHT = 16;

function movementDisplayName(m: WorkoutMovement): string {
  if (m.label && m.label.trim().length > 0) return m.label.trim();
  if (m.exerciseId) return getExerciseById(m.exerciseId)?.name ?? 'Movement';
  return 'Movement';
}

export function ConditioningWorkoutBody({
  dayIndex,
  blocks,
}: ConditioningWorkoutBodyProps) {
  const [logs, setLogs] = useState<{
    [blockId: string]: { completed: boolean };
  }>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const dayLogs = await getConditioningLogsForDay(dayIndex);
    setLogs(dayLogs);
    setLoading(false);
  }, [dayIndex]);

  useEffect(() => {
    load();
  }, [load]);

  const completedCount = useMemo(() => {
    return Object.values(logs).filter((v) => v.completed).length;
  }, [logs]);

  const handleToggle = useCallback(
    async (blockId: string) => {
      const nextCompleted = await toggleConditioningBlockCompleted(
        dayIndex,
        blockId
      );
      setLogs((prev) => {
        const next = { ...prev };
        if (!nextCompleted) {
          delete next[blockId];
          return next;
        }
        next[blockId] = { completed: true };
        return next;
      });
    },
    [dayIndex]
  );

  if (blocks.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No blocks found</Text>
      </View>
    );
  }

  const progressText = `${completedCount} of ${blocks.length} blocks completed`;

  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText} accessibilityLabel={progressText}>
            {completedCount}/{blocks.length} blocks completed
          </Text>
          {loading ? (
            <Skeleton
              width={LOADING_SKELETON_WIDTH}
              height={LOADING_SKELETON_HEIGHT}
              accessibilityLabel="Loading block progress"
            />
          ) : null}
        </View>
        <ProgressBar
          progress={completedCount / blocks.length}
          accessibilityLabel="Blocks completed"
          accessibilityValueText={progressText}
        />
      </View>

      {blocks.map((block) => {
        const isCompleted = !!logs[block.id]?.completed;
        if (block.type === 'warmup') {
          return (
            <ConditioningWarmupBlock
              key={`${dayIndex}-${block.id}`}
              block={block}
              isCompleted={isCompleted}
              onToggleComplete={() => handleToggle(block.id)}
            />
          );
        }

        return (
          <View key={block.id} style={styles.blockCard}>
            <View style={styles.blockHeader}>
              <View style={styles.blockTitleRow}>
                <Text style={styles.blockTitle} accessibilityRole="header">
                  {block.title}
                </Text>
                <Tag label={blockTypeLabel(block)} />
              </View>
              <Text style={styles.blockMeta}>{formatBlockMeta(block)}</Text>
            </View>

            <BlockCompleteToggle
              title={block.title}
              isCompleted={isCompleted}
              onPress={() => handleToggle(block.id)}
            />

            {block.instructions ? (
              <Text style={styles.blockInstructions}>{block.instructions}</Text>
            ) : null}

            {block.type === 'cooldown' ? (
              <BulletList items={block.description} />
            ) : null}

            {block.movements?.length ? (
              <View style={styles.movements}>
                {block.movements.map((m) => (
                  <View key={m.id} style={styles.movementRow}>
                    <View style={styles.movementTopRow}>
                      <Text style={styles.movementName}>
                        {movementDisplayName(m)}
                      </Text>
                      {m.prescription ? (
                        <Text style={styles.movementPrescription}>
                          {m.prescription}
                        </Text>
                      ) : null}
                    </View>
                    {m.notes ? (
                      <Text style={styles.movementNotes}>{m.notes}</Text>
                    ) : null}
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

type BlockCompleteToggleProps = {
  title: string;
  isCompleted: boolean;
  onPress: () => void;
};

function BlockCompleteToggle({
  title,
  isCompleted,
  onPress,
}: BlockCompleteToggleProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.completeButton,
        isCompleted && styles.completeButtonActive,
        pressed && styles.completeButtonPressed,
      ]}
      accessibilityRole="checkbox"
      accessibilityLabel={`${title}, mark complete`}
      accessibilityState={{ checked: isCompleted }}
    >
      <Ionicons
        name={isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
        size={18}
        color={isCompleted ? color.success : color.textSecondary}
      />
      <Text
        style={[
          styles.completeButtonText,
          isCompleted && styles.completeButtonTextActive,
        ]}
      >
        {isCompleted ? 'Completed' : 'Mark complete'}
      </Text>
    </Pressable>
  );
}

type BulletListProps = {
  items: string[];
};

function BulletList({ items }: BulletListProps) {
  return (
    <View style={styles.warmupList}>
      {items.map((item, idx) => (
        <View key={idx} style={styles.warmupItem}>
          <View style={styles.warmupBullet} />
          <Text style={styles.warmupText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

type ConditioningWarmupBlockProps = {
  block: Extract<WorkoutBlock, { type: 'warmup' }>;
  isCompleted: boolean;
  onToggleComplete: () => void;
};

function ConditioningWarmupBlock({
  block,
  isCompleted,
  onToggleComplete,
}: ConditioningWarmupBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.blockCard}>
      <Pressable
        style={styles.blockHeader}
        onPress={() => setIsExpanded(true)}
        disabled={isExpanded}
        accessible={!isExpanded}
        accessibilityRole="button"
        accessibilityLabel={`${block.title}, show warm-up`}
        accessibilityState={{ expanded: isExpanded }}
      >
        <View style={styles.blockTitleRow}>
          <Text style={[styles.blockTitle, styles.warmupTitleFlex]}>
            {block.title}
          </Text>
          <Tag label="Warm-up" />
          <ActionChip
            label={isExpanded ? 'Hide' : 'Show'}
            icon={isExpanded ? 'chevron-up' : 'chevron-down'}
            tone="neutral"
            onPress={() => setIsExpanded((prev) => !prev)}
            accessibilityLabel={isExpanded ? 'Hide warm-up' : 'Show warm-up'}
            accessibilityState={{ expanded: isExpanded }}
          />
        </View>
        <Text style={styles.blockMeta}>{formatBlockMeta(block)}</Text>
      </Pressable>

      <BlockCompleteToggle
        title={block.title}
        isCompleted={isCompleted}
        onPress={onToggleComplete}
      />

      {isExpanded ? (
        <>
          {block.instructions ? (
            <Text style={styles.blockInstructions}>{block.instructions}</Text>
          ) : null}
          <BulletList items={block.description} />
        </>
      ) : null}
    </View>
  );
}

function blockTypeLabel(block: WorkoutBlock): string {
  switch (block.type) {
    case 'warmup':
      return 'Warm-up';
    case 'cooldown':
      return 'Cool-down';
    case 'rounds':
      return 'Rounds';
    case 'tabata':
      return 'Tabata';
    case 'emom':
      return 'EMOM';
    case 'amrap':
      return 'AMRAP';
    case 'for_time':
      return 'For time';
    default:
      return '';
  }
}

function formatBlockMeta(block: WorkoutBlock): string {
  switch (block.type) {
    case 'warmup':
      return 'Warm-up';
    case 'cooldown':
      return 'Cool-down';
    case 'rounds': {
      const rest = block.restSecondsBetweenRounds
        ? ` · Rest ${block.restSecondsBetweenRounds}s`
        : '';
      return `${block.rounds} rounds${rest}`;
    }
    case 'tabata':
      return `${block.rounds} rounds · ${block.workSeconds}s work / ${block.restSeconds}s rest`;
    case 'emom':
      return `EMOM · ${block.minutes} min`;
    case 'amrap':
      return `AMRAP · ${block.minutes} min`;
    case 'for_time':
      return 'For time';
    default:
      return '';
  }
}

const styles = StyleSheet.create({
  container: {
    gap: space.md,
  },
  summary: {
    gap: space.xs,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.xs,
  },
  summaryText: {
    ...typography.numericSmall,
    color: color.textSecondary,
  },
  blockCard: {
    ...elevation.raised,
    backgroundColor: color.surface1,
    borderRadius: radius.md,
    padding: space.md,
    gap: space.sm,
  },
  blockHeader: {
    gap: space.xxs,
  },
  blockTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    flexWrap: 'wrap',
  },
  blockTitle: {
    ...typography.headline,
    color: color.textPrimary,
    flexShrink: 1,
  },
  warmupTitleFlex: {
    flexGrow: 1,
    minWidth: 0,
  },
  blockMeta: {
    ...typography.calloutStrong,
    color: color.textSecondary,
  },
  blockInstructions: {
    ...typography.callout,
    color: color.textSecondary,
  },
  completeButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    minHeight: MIN_TARGET_SIZE,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: color.borderStrong,
  },
  completeButtonActive: {
    backgroundColor: color.successTint,
    borderColor: color.success,
  },
  completeButtonPressed: {
    backgroundColor: color.surface3,
  },
  completeButtonText: {
    ...typography.calloutStrong,
    color: color.textPrimary,
  },
  completeButtonTextActive: {
    color: color.success,
  },
  warmupList: {
    gap: space.xs,
  },
  warmupItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.xs,
  },
  warmupBullet: {
    width: LIST_BULLET_SIZE,
    height: LIST_BULLET_SIZE,
    borderRadius: LIST_BULLET_SIZE / 2,
    backgroundColor: color.gold,
    marginTop: space.xs,
  },
  warmupText: {
    ...typography.callout,
    color: color.textSecondary,
    flex: 1,
  },
  movements: {
    gap: space.sm,
  },
  movementRow: {
    gap: space.xxs,
    paddingTop: space.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.borderSubtle,
  },
  movementTopRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: space.sm,
    flexWrap: 'wrap',
  },
  movementName: {
    ...typography.calloutStrong,
    color: color.textPrimary,
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0,
  },
  movementPrescription: {
    ...typography.captionStrong,
    color: color.textSecondary,
    flexShrink: 1,
    textAlign: 'right',
  },
  movementNotes: {
    ...typography.caption,
    color: color.textTertiary,
  },
  empty: {
    paddingVertical: space.lg,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.callout,
    color: color.textTertiary,
  },
});
