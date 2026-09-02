import { Colors, FontSize, Spacing } from '@/src/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type SkillSectionHeaderProps = {
  title: string;
  subtitle?: string;
};

export function SkillSectionHeader({
  title,
  subtitle,
}: SkillSectionHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.xs,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayLg,
    fontWeight: '800',
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    lineHeight: 20,
  },
});
