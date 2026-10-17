import { Badge, ProgressBar, Tag } from '@/src/components/ds';
import { RecoveryBlockTimer } from '@/src/components/recovery/RecoveryBlockTimer';
import {
  color,
  elevation,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import type { Recovery, RecoveryBlock } from '@/src/types/recovery';
import { getRecoveryDoseSteps } from '@/src/utils/recoveryDoseFormat';
import { isTimeBasedRecoveryDose } from '@/src/utils/recoveryTimer';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  AccessibilityInfo,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { getEffectiveBottomInset } from '@/src/utils/platform';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { YoutubeEmbed } from '../exercise/YoutubeEmbed';
import { workoutDetailStyles as styles } from '../workouts/workoutDetailStyles';

const COMPLETE_ICON_SIZE = 56;

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

function blockPositionText(blockIndex: number, totalBlocks: number): string {
  return `Block ${blockIndex + 1} of ${totalBlocks}`;
}

function BlockCard({
  block,
  blockIndex,
  totalBlocks,
}: {
  block: RecoveryBlock;
  blockIndex: number;
  totalBlocks: number;
}) {
  const iconName = doseIconName(block.dose);
  const positionText = blockPositionText(blockIndex, totalBlocks);

  return (
    <>
      {block.videoId ? (
        <View style={flowStyles.blockVideo}>
          <YoutubeEmbed
            noRoundCorners
            youtubeId={block.videoId}
            accessibilityLabel={`Demonstration video for ${block.name}`}
          />
        </View>
      ) : null}
      <View style={flowStyles.progress}>
        <Text style={flowStyles.progressText}>{positionText}</Text>
        <ProgressBar
          progress={(blockIndex + 1) / totalBlocks}
          accessibilityLabel="Flow progress"
          accessibilityValueText={positionText}
        />
      </View>
      <View style={flowStyles.blockCard}>
        <Text style={flowStyles.blockTitle} accessibilityRole="header">
          {block.name}
        </Text>
        <View style={flowStyles.doseLines}>
          {getRecoveryDoseSteps(block.dose).map((step, index) => (
            <View key={index} style={flowStyles.doseRow}>
              <Ionicons name={iconName} size={18} color={color.textSecondary} />
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
    </>
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

  const announceBlock = (index: number) => {
    const block = blocks[index];
    if (!block) return;
    AccessibilityInfo.announceForAccessibility(
      `${blockPositionText(index, totalBlocks)}, ${block.name}`
    );
  };

  const handleGoBack = () => {
    if (phase === 'block' && blockIndex > 0) {
      announceBlock(blockIndex - 1);
      setBlockIndex((index) => index - 1);
    }
  };

  const getCta = (): { label: string; onPress: () => void } => {
    if (phase === 'intro') {
      return {
        label: 'Start',
        onPress: () => {
          announceBlock(0);
          setPhase('block');
        },
      };
    }
    if (phase === 'complete') {
      return { label: 'Done', onPress: () => router.back() };
    }
    const isLastBlock = blockIndex >= totalBlocks - 1;
    return {
      label: isLastBlock ? 'Finish' : 'Next',
      onPress: () => {
        if (isLastBlock) {
          AccessibilityInfo.announceForAccessibility('Flow complete');
          setPhase('complete');
          return;
        }
        announceBlock(blockIndex + 1);
        setBlockIndex((index) => index + 1);
      },
    };
  };
  const cta = getCta();

  return (
    <View style={flowStyles.container}>
      <ScrollView
        style={flowStyles.scroll}
        contentContainerStyle={flowStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {phase === 'intro' ? (
          <View style={flowStyles.introContent}>
            <View style={styles.detailMetaRow}>
              <View
                style={styles.detailMetaItem}
                accessible
                accessibilityLabel={`${recovery.estimatedTime} minutes`}
              >
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={color.textSecondary}
                />
                <Text style={styles.detailMetaText}>
                  {recovery.estimatedTime} min
                </Text>
              </View>
              <Badge label={recovery.difficulty} tone="neutral" />
            </View>

            <Text style={flowStyles.introDescription}>
              {recovery.description}
            </Text>

            {recovery.tags.length > 0 ? (
              <View style={flowStyles.tagsRow}>
                {recovery.tags.map((tag, index) => (
                  <Tag key={`${index}-${tag}`} label={tag} />
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
          <BlockCard
            block={currentBlock}
            blockIndex={blockIndex}
            totalBlocks={totalBlocks}
          />
        ) : null}

        {phase === 'complete' ? (
          <View style={flowStyles.completeState}>
            <Ionicons
              name="checkmark-circle"
              size={COMPLETE_ICON_SIZE}
              color={color.success}
            />
            <Text style={flowStyles.completeTitle} accessibilityRole="header">
              Flow complete
            </Text>
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
          {
            paddingBottom: Math.max(
              getEffectiveBottomInset(insets.bottom),
              space.sm
            ),
          },
        ]}
      >
        <View style={flowStyles.footerActions}>
          {showBackButton ? (
            <Pressable
              style={({ pressed }) => [
                flowStyles.backButton,
                pressed && flowStyles.backButtonPressed,
              ]}
              onPress={handleGoBack}
              accessibilityRole="button"
              accessibilityLabel="Previous block"
            >
              <Ionicons
                name="chevron-back"
                size={20}
                color={color.textPrimary}
              />
              <Text style={flowStyles.backButtonText}>Back</Text>
            </Pressable>
          ) : null}
          <Pressable
            style={({ pressed }) => [
              flowStyles.primaryButton,
              pressed && flowStyles.primaryButtonPressed,
            ]}
            onPress={cta.onPress}
            accessibilityRole="button"
            accessibilityLabel={cta.label}
          >
            <Text style={flowStyles.primaryButtonText}>{cta.label}</Text>
            {phase === 'block' && blockIndex < totalBlocks - 1 ? (
              <Ionicons name="chevron-forward" size={20} color={color.onGold} />
            ) : null}
          </Pressable>
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
    paddingHorizontal: space.md,
    paddingTop: space.xs,
    paddingBottom: space.xl,
    gap: space.md,
  },
  introContent: {
    gap: space.md,
  },
  introDescription: {
    ...typography.body,
    color: color.textSecondary,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
  introHint: {
    ...typography.callout,
    color: color.textTertiary,
  },
  progress: {
    gap: space.xs,
  },
  progressText: {
    ...typography.captionStrong,
    fontVariant: ['tabular-nums'],
    color: color.textSecondary,
  },
  blockCard: {
    ...elevation.raised,
    backgroundColor: color.surface1,
    borderRadius: radius.md,
    padding: space.md,
    gap: space.md,
  },
  blockTitle: {
    ...typography.title2,
    color: color.textPrimary,
  },
  doseLines: {
    gap: space.xs,
  },
  doseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  doseText: {
    ...typography.headline,
    color: color.textPrimary,
    flexShrink: 1,
  },
  doseStepLabel: {
    ...typography.callout,
    color: color.textSecondary,
  },
  blockVideo: {
    marginHorizontal: -space.md,
  },
  blockInstructions: {
    ...typography.body,
    color: color.textSecondary,
  },
  completeState: {
    alignItems: 'center',
    paddingHorizontal: space.xl,
    paddingTop: space.xxxl,
    gap: space.sm,
  },
  completeTitle: {
    ...typography.title2,
    color: color.textPrimary,
    textAlign: 'center',
  },
  completeText: {
    ...typography.callout,
    color: color.textSecondary,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: space.md,
    paddingTop: space.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.borderSubtle,
    backgroundColor: color.bg,
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xxs,
    minHeight: MIN_TARGET_SIZE,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: color.borderStrong,
  },
  backButtonPressed: {
    backgroundColor: color.surface3,
  },
  backButtonText: {
    ...typography.calloutStrong,
    color: color.textPrimary,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xs,
    minHeight: MIN_TARGET_SIZE,
    paddingHorizontal: space.xl,
    borderRadius: radius.pill,
    backgroundColor: color.gold,
  },
  primaryButtonPressed: {
    backgroundColor: color.goldStrong,
  },
  primaryButtonText: {
    ...typography.calloutStrong,
    color: color.onGold,
  },
});
