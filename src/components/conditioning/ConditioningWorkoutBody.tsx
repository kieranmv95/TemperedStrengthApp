import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { getExerciseById } from '@/src/data/exercises';
import type { WorkoutBlock, WorkoutMovement } from '@/src/types/program';
import {
  getConditioningLogsForDay,
  toggleConditioningBlockCompleted,
} from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ConditioningWorkoutBodyProps = {
  dayIndex: number;
  blocks: WorkoutBlock[];
};

function movementDisplayName(m: WorkoutMovement): string {
  if (m.label && m.label.trim().length > 0) return m.label.trim();
  if (m.exerciseId) return getExerciseById(m.exerciseId)?.name ?? 'Movement';
  return 'Movement';
}

export function ConditioningWorkoutBody({
  dayIndex,
  blocks,
}: ConditioningWorkoutBodyProps) {
  const [logs, setLogs] = useState<{ [blockId: string]: { completed: boolean } }>(
    {}
  );
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
      const nextCompleted = await toggleConditioningBlockCompleted(dayIndex, blockId);
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

  return (
    <View style={styles.container}>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryText}>
          {completedCount}/{blocks.length} blocks completed
        </Text>
        {loading ? <Text style={styles.loadingText}>Loading…</Text> : null}
      </View>

      {blocks.map((block) => {
        const isCompleted = !!logs[block.id]?.completed;
        return (
          <View
            key={block.id}
            style={[
              styles.blockCard,
              isCompleted && styles.blockCardCompleted,
            ]}
          >
            <View style={styles.blockHeader}>
              <View style={styles.blockHeaderLeft}>
                <View style={styles.blockTitleRow}>
                  <Text style={styles.blockTitle}>{block.title}</Text>
                  <View style={styles.blockTypeBadge}>
                    <Text style={styles.blockTypeBadgeText}>
                      {block.type === 'for_time'
                        ? 'FOR TIME'
                        : block.type.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={styles.blockMeta}>{formatBlockMeta(block)}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleToggle(block.id)}
                activeOpacity={0.7}
                style={[
                  styles.completeButton,
                  isCompleted && styles.completeButtonActive,
                ]}
              >
                <Ionicons
                  name={isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
                  size={18}
                  color={isCompleted ? Colors.textOnAccent : Colors.textMuted}
                />
                <Text
                  style={[
                    styles.completeButtonText,
                    isCompleted && styles.completeButtonTextActive,
                  ]}
                >
                  {isCompleted ? 'Completed' : 'Mark complete'}
                </Text>
              </TouchableOpacity>
            </View>

            {block.instructions ? (
              <Text style={styles.blockInstructions}>{block.instructions}</Text>
            ) : null}

            {block.type === 'warmup' ? (
              <View style={styles.warmupList}>
                {block.description.map((item, idx) => (
                  <View key={idx} style={styles.warmupItem}>
                    <Text style={styles.warmupBullet}>•</Text>
                    <Text style={styles.warmupText}>{item}</Text>
                  </View>
                ))}
              </View>
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
                    {m.prescription ? (
                      <View style={styles.movementDivider} />
                    ) : null}
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

function formatBlockMeta(block: WorkoutBlock): string {
  switch (block.type) {
    case 'warmup':
      return 'Warm-up';
    case 'rounds': {
      const rest = block.restSecondsBetweenRounds
        ? ` • Rest ${block.restSecondsBetweenRounds}s`
        : '';
      return `${block.rounds} rounds${rest}`;
    }
    case 'tabata':
      return `${block.rounds} rounds • ${block.workSeconds}s work / ${block.restSeconds}s rest`;
    case 'emom':
      return `EMOM • ${block.minutes} min`;
    case 'amrap':
      return `AMRAP • ${block.minutes} min`;
    case 'for_time':
      return 'For time';
    default:
      return '';
  }
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xxl,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryText: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  loadingText: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  blockCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  blockCardCompleted: {
    borderColor: Colors.accent,
  },
  blockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  blockHeaderLeft: {
    flex: 1,
    gap: Spacing.xs,
  },
  blockTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flexWrap: 'wrap',
  },
  blockTitle: {
    color: Colors.textPrimary,
    fontWeight: '800',
    fontSize: FontSize.displaySm,
  },
  blockTypeBadge: {
    backgroundColor: Colors.backgroundElevated,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  blockTypeBadgeText: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  blockMeta: {
    color: Colors.accent,
    fontSize: FontSize.md,
    fontWeight: '700',
    fontStyle: 'italic',
  },
  blockInstructions: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    fontWeight: '600',
    lineHeight: 20,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    backgroundColor: Colors.backgroundCard,
  },
  completeButtonActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  completeButtonText: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  completeButtonTextActive: {
    color: Colors.textOnAccent,
  },
  warmupList: {
    gap: Spacing.md,
  },
  warmupItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  warmupBullet: {
    color: Colors.accent,
    fontSize: FontSize.lg,
    fontWeight: '600',
    marginTop: 1,
  },
  warmupText: {
    color: Colors.textSecondaryAlt,
    flex: 1,
    fontSize: FontSize.lg,
    lineHeight: 20,
  },
  movements: {
    marginTop: Spacing.sm,
    gap: Spacing.md,
  },
  movementRow: {
    gap: Spacing.xs,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
  },
  movementTopRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.md,
    flexWrap: 'wrap',
  },
  movementName: {
    color: Colors.textPrimary,
    fontWeight: '800',
    fontSize: FontSize.lg,
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0,
  },
  movementPrescription: {
    color: Colors.textMuted,
    fontWeight: '700',
    fontSize: FontSize.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flexShrink: 1,
    textAlign: 'right',
  },
  movementDivider: {
    height: 0,
  },
  movementNotes: {
    color: Colors.textMuted,
    fontWeight: '600',
    fontSize: FontSize.lg,
    lineHeight: 20,
  },
  empty: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textMuted,
    fontWeight: '700',
  },
});

