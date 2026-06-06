import { Pill } from '@/src/components/pill';
import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import type { Recovery, RecoveryBlock } from '@/src/types/recovery';
import { RecoveryBlockTimer } from '@/src/components/recovery/RecoveryBlockTimer';
import { getRecoveryDoseSteps } from '@/src/utils/recoveryDoseFormat';
import { isTimeBasedRecoveryDose } from '@/src/utils/recoveryTimer';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { workoutDetailStyles as styles } from '../workouts/workoutDetailStyles';
import { DIFFICULTY_COLORS } from '../workouts/workoutUiConstants';

type RecoveryFlowContentProps = {
  recovery: Recovery;
};

type FlowPhase = 'intro' | 'block' | 'complete';

function doseIconName(
  dose: RecoveryBlock['dose']
): keyof typeof Ionicons.glyphMap {
  if (dose.kind === 'reps' || dose.kind === 'reps_bilateral') {
    return 'repeat';
  }
  if (dose.kind === 'percussive' || dose.kind === 'percussive_bilateral') {
    return 'pulse';
  }
  return 'time-outline';
}

function BlockCard({ block }: { block: RecoveryBlock }) {
  const iconName = doseIconName(block.dose);

  return (
    <View style={flowStyles.blockCard}>
      <Text style={flowStyles.blockTitle}>{block.name}</Text>
      <View style={flowStyles.doseLines}>
        {getRecoveryDoseSteps(block.dose).map((step, index) => (
          <View key={index} style={flowStyles.doseRow}>
            <Ionicons name={iconName} size={18} color={Colors.accent} />
            <Text style={flowStyles.doseText}>
              {step.label ? (
                <Text style={flowStyles.doseStepLabel}>{step.label} · </Text>
              ) : null}
              {step.text}
            </Text>
          </View>
        ))}
      </View>
      {isTimeBasedRecoveryDose(block.dose) ? (
        <RecoveryBlockTimer dose={block.dose} />
      ) : null}
      {block.instructions ? (
        <Text style={flowStyles.blockInstructions}>{block.instructions}</Text>
      ) : null}
    </View>
  );
}

export function RecoveryFlowContent({ recovery }: RecoveryFlowContentProps) {
  const insets = useSafeAreaInsets();
  const [phase, setPhase] = useState<FlowPhase>('intro');
  const [blockIndex, setBlockIndex] = useState(0);

  const blocks = recovery.blocks;
  const totalBlocks = blocks.length;
  const currentBlock = blocks[blockIndex];

  useEffect(() => {
    setPhase('intro');
    setBlockIndex(0);
  }, [recovery.id]);

  const showBackButton = phase === 'block' && blockIndex > 0;

  const handleGoBack = () => {
    if (phase === 'block' && blockIndex > 0) {
      setBlockIndex((index) => index - 1);
    }
  };

  const cta = useMemo(() => {
    if (phase === 'intro') {
      return { label: 'Start', onPress: () => setPhase('block') };
    }
    if (phase === 'complete') {
      return { label: 'Done', onPress: () => router.back() };
    }
    const isLastBlock = blockIndex >= totalBlocks - 1;
    return {
      label: isLastBlock ? 'Finish' : 'Next',
      onPress: () => {
        if (isLastBlock) {
          setPhase('complete');
          return;
        }
        setBlockIndex((index) => index + 1);
      },
    };
  }, [phase, blockIndex, totalBlocks]);

  return (
    <View style={flowStyles.container}>
      <ScrollView
        style={flowStyles.scroll}
        contentContainerStyle={flowStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {phase === 'intro' ? (
          <View style={flowStyles.introContent}>
            <View style={[styles.detailMetaRow, flowStyles.introMetaRow]}>
              <View style={styles.detailMetaItem}>
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={Colors.textMuted}
                />
                <Text style={styles.detailMetaText}>
                  {recovery.estimatedTime} min
                </Text>
              </View>
              <View
                style={[
                  styles.difficultyBadge,
                  { borderColor: DIFFICULTY_COLORS[recovery.difficulty] },
                ]}
              >
                <Text
                  style={[
                    styles.difficultyText,
                    { color: DIFFICULTY_COLORS[recovery.difficulty] },
                  ]}
                >
                  {recovery.difficulty}
                </Text>
              </View>
            </View>

            <Text style={flowStyles.introDescription}>
              {recovery.description}
            </Text>

            {recovery.tags.length > 0 ? (
              <View style={flowStyles.tagsRow}>
                {recovery.tags.map((tag, index) => (
                  <Pill
                    key={`${index}-${tag}`}
                    label={tag}
                    isActive={false}
                    disabled
                    onPress={() => {}}
                  />
                ))}
              </View>
            ) : null}

            <Text style={flowStyles.introHint}>
              {totalBlocks} {totalBlocks === 1 ? 'block' : 'blocks'} · work
              through each one in order
            </Text>
          </View>
        ) : null}

        {phase === 'block' && currentBlock ? (
          <>
            <Text style={flowStyles.progress}>
              {blockIndex + 1} / {totalBlocks} blocks
            </Text>
            <BlockCard block={currentBlock} />
          </>
        ) : null}

        {phase === 'complete' ? (
          <View style={flowStyles.completeState}>
            <Ionicons name="checkmark-circle" size={64} color={Colors.accent} />
            <Text style={flowStyles.completeTitle}>Flow complete</Text>
            <Text style={flowStyles.completeText}>
              Nice work. Take a moment to notice how your body feels before
              moving on.
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <View
        style={[
          flowStyles.footer,
          { paddingBottom: Math.max(insets.bottom, Spacing.lg) },
        ]}
      >
        <View style={flowStyles.footerActions}>
          {showBackButton ? (
            <TouchableOpacity
              style={flowStyles.backButton}
              onPress={handleGoBack}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Previous block"
            >
              <Ionicons
                name="chevron-back"
                size={20}
                color={Colors.textPrimary}
              />
              <Text style={flowStyles.backButtonText}>Back</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={flowStyles.primaryButton}
            onPress={cta.onPress}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={cta.label}
          >
            <Text style={flowStyles.primaryButtonText}>{cta.label}</Text>
            {phase === 'block' && blockIndex < totalBlocks - 1 ? (
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Colors.textOnAccent}
              />
            ) : null}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const flowStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xxxl,
    paddingBottom: Spacing.xxl,
  },
  introContent: {
    gap: Spacing.lg,
  },
  introMetaRow: {
    marginBottom: 0,
  },
  introDescription: {
    color: Colors.textSecondary,
    fontSize: FontSize.xxl,
    lineHeight: 24,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  introHint: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    lineHeight: 22,
  },
  progress: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: Spacing.xxl,
  },
  blockCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xxxl,
    borderWidth: 1,
    borderColor: Colors.backgroundElevated,
  },
  blockTitle: {
    color: Colors.accent,
    fontSize: FontSize.displayMd,
    fontWeight: '800',
    marginBottom: Spacing.lg,
  },
  doseLines: {
    gap: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  doseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  doseText: {
    color: Colors.accent,
    fontSize: FontSize.xxl,
    fontWeight: '700',
  },
  doseStepLabel: {
    color: Colors.textMuted,
    fontWeight: '600',
  },
  blockInstructions: {
    color: Colors.textSecondary,
    fontSize: FontSize.xxl,
    lineHeight: 26,
  },
  completeState: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.section,
    gap: Spacing.lg,
  },
  completeTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayMd,
    fontWeight: '800',
    textAlign: 'center',
  },
  completeText: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    lineHeight: 22,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: Spacing.xxxl,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.backgroundElevated,
    backgroundColor: Colors.backgroundScreen,
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.backgroundElevated,
  },
  backButtonText: {
    color: Colors.textPrimary,
    fontSize: FontSize.base,
    fontWeight: '700',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  primaryButtonText: {
    color: Colors.textOnAccent,
    fontSize: FontSize.base,
    fontWeight: '700',
  },
});
