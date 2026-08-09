import { Colors, FontSize, Spacing } from '@/src/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type SkillSectionHeaderProps = {
  title: string;
};

export function SkillSectionHeader({ title }: SkillSectionHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.xs,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayMd,
    fontWeight: '800',
  },
  count: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    fontWeight: '500',
  },
});
