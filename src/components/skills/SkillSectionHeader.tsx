import { SectionHeader } from '@/src/components/ds';
import { color, space, typography } from '@/src/constants/tokens';
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
      <SectionHeader title={title} />
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: space.xxs,
  },
  subtitle: {
    ...typography.callout,
    color: color.textSecondary,
  },
});
