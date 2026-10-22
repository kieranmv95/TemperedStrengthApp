import {
  color,
  MIN_TARGET_SIZE,
  space,
  typography,
} from '@/src/constants/tokens';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type SectionHeaderProps = {
  title: string;
  /** Optional trailing action, e.g. "See all". */
  actionLabel?: string;
  onActionPress?: () => void;
  /** e.g. "See all tools". Defaults to the visible action label. */
  actionAccessibilityLabel?: string;
};

/** Sentence-case section title. Wraps the action below the title at large text sizes. */
export function SectionHeader({
  title,
  actionLabel,
  onActionPress,
  actionAccessibilityLabel,
}: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      {actionLabel && onActionPress ? (
        <Pressable
          onPress={onActionPress}
          style={styles.action}
          accessibilityRole="button"
          accessibilityLabel={actionAccessibilityLabel ?? actionLabel}
        >
          <Text style={styles.actionLabel}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: space.sm,
  },
  title: {
    ...typography.headline,
    color: color.textPrimary,
    flexShrink: 1,
  },
  action: {
    minHeight: MIN_TARGET_SIZE,
    justifyContent: 'center',
  },
  actionLabel: {
    ...typography.calloutStrong,
    color: color.gold,
  },
});
