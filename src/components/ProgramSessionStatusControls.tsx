import { CollapsibleWarmupSection } from '@/src/components/CollapsibleWarmupSection';
import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import type { ProgramSessionStatus } from '@/src/types/storage';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ProgramSessionStatusControlsProps = {
  status: ProgramSessionStatus | null;
  onMove?: () => void;
  onComplete: () => void;
  onSkip: () => void;
};

export function ProgramSessionStatusControls({
  status,
  onMove,
  onComplete,
  onSkip,
}: ProgramSessionStatusControlsProps) {
  return (
    <CollapsibleWarmupSection
      title="Session Actions"
      contentName="session actions"
      containerStyle={styles.container}
      titleStyle={styles.title}
      headerAccessory={
        status ? (
          <Text
            style={[
              styles.status,
              status === 'completed'
                ? styles.statusCompleted
                : styles.statusSkipped,
            ]}
          >
            {status === 'completed' ? 'Completed' : 'Skipped'}
          </Text>
        ) : null
      }
    >
      {onMove ? (
        <TouchableOpacity
          style={styles.moveAction}
          onPress={onMove}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Move session"
        >
          <Text style={styles.moveActionText}>Move Session</Text>
        </TouchableOpacity>
      ) : null}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.action,
            status === 'completed' && styles.actionCompleted,
          ]}
          onPress={onComplete}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityState={{ selected: status === 'completed' }}
          accessibilityLabel="Mark session complete"
        >
          <Text
            style={[
              styles.actionText,
              status === 'completed' && styles.actionTextCompleted,
            ]}
          >
            {status === 'completed' ? 'Completed' : 'Mark Complete'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.action, status === 'skipped' && styles.actionSkipped]}
          onPress={onSkip}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityState={{ selected: status === 'skipped' }}
          accessibilityLabel="Skip session"
        >
          <Text
            style={[
              styles.actionText,
              status === 'skipped' && styles.actionTextSkipped,
            ]}
          >
            {status === 'skipped' ? 'Skipped' : 'Skip Session'}
          </Text>
        </TouchableOpacity>
      </View>
    </CollapsibleWarmupSection>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundCard,
    borderColor: Colors.backgroundElevated,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    marginBottom: Spacing.xxl,
    padding: Spacing.xxl,
  },
  title: {
    color: Colors.accent,
    fontSize: FontSize.xxl,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  status: {
    flexShrink: 0,
    fontSize: FontSize.md,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statusCompleted: {
    color: Colors.recommended,
  },
  statusSkipped: {
    color: Colors.destructive,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  moveAction: {
    alignItems: 'center',
    borderColor: Colors.backgroundBorder,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  moveActionText: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  action: {
    alignItems: 'center',
    borderColor: Colors.backgroundBorder,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  actionCompleted: {
    backgroundColor: Colors.recommendedWashFill,
    borderColor: Colors.recommendedWashBorder,
  },
  actionSkipped: {
    backgroundColor: Colors.destructiveWashFill,
    borderColor: Colors.destructive,
  },
  actionText: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  actionTextCompleted: {
    color: Colors.recommended,
  },
  actionTextSkipped: {
    color: Colors.destructive,
  },
});
