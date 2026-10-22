import { Badge, Collapsible } from '@/src/components/ds';
import {
  color,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import type { ProgramSessionStatus } from '@/src/types/storage';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type ProgramSessionStatusControlsProps = {
  status: ProgramSessionStatus | null;
  expanded: boolean;
  onToggle: () => void;
  onMove?: () => void;
  onComplete: () => void;
  onSkip: () => void;
};

type StatusButtonProps = {
  label: string;
  activeLabel: string;
  icon: keyof typeof Ionicons.glyphMap;
  active: boolean;
  activeColor: string;
  onPress: () => void;
  accessibilityLabel: string;
};

function StatusButton({
  label,
  activeLabel,
  icon,
  active,
  activeColor,
  onPress,
  accessibilityLabel,
}: StatusButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.action,
        active && { borderColor: activeColor },
        pressed && styles.actionPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected: active }}
    >
      {active ? <Ionicons name={icon} size={18} color={activeColor} /> : null}
      <Text style={[styles.actionText, active && { color: activeColor }]}>
        {active ? activeLabel : label}
      </Text>
    </Pressable>
  );
}

export function ProgramSessionStatusControls({
  status,
  expanded,
  onToggle,
  onMove,
  onComplete,
  onSkip,
}: ProgramSessionStatusControlsProps) {
  const statusLabel =
    status === 'completed'
      ? 'Completed'
      : status === 'skipped'
        ? 'Skipped'
        : null;

  return (
    <Collapsible
      title="Session actions"
      expanded={expanded}
      onToggle={onToggle}
      accessibilityLabel={
        statusLabel ? `Session actions, ${statusLabel}` : 'Session actions'
      }
      accessory={
        statusLabel ? (
          <Badge
            label={statusLabel}
            tone={status === 'completed' ? 'success' : 'danger'}
          />
        ) : null
      }
    >
      <View style={styles.actions}>
        <StatusButton
          label="Mark complete"
          activeLabel="Completed"
          icon="checkmark"
          active={status === 'completed'}
          activeColor={color.success}
          onPress={onComplete}
          accessibilityLabel="Mark session complete"
        />
        <StatusButton
          label="Skip session"
          activeLabel="Skipped"
          icon="close"
          active={status === 'skipped'}
          activeColor={color.danger}
          onPress={onSkip}
          accessibilityLabel="Skip session"
        />
      </View>
      {onMove ? (
        <Pressable
          onPress={onMove}
          style={({ pressed }) => [
            styles.moveAction,
            pressed && styles.actionPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Move session"
          accessibilityHint="Choose another day for this session"
        >
          <Ionicons
            name="calendar-outline"
            size={18}
            color={color.textSecondary}
          />
          <Text style={styles.moveActionText}>Move session</Text>
        </Pressable>
      ) : null}
    </Collapsible>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xxs,
    flexGrow: 1,
    flexBasis: 140,
    minHeight: MIN_TARGET_SIZE,
    paddingHorizontal: space.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.surface2,
  },
  actionPressed: {
    backgroundColor: color.surface3,
  },
  actionText: {
    ...typography.calloutStrong,
    color: color.textPrimary,
  },
  moveAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xxs,
    minHeight: MIN_TARGET_SIZE,
    borderRadius: radius.pill,
  },
  moveActionText: {
    ...typography.calloutStrong,
    color: color.textSecondary,
  },
});
