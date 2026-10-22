import { SectionHeader } from '@/src/components/ds';
import { color, space, typography } from '@/src/constants/tokens';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type SkillSectionHeaderProps = {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

export function SkillSectionHeader({
  title,
  subtitle,
  icon,
}: SkillSectionHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        {icon ? (
          <Ionicons
            name={icon}
            size={18}
            color={color.gold}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          />
        ) : null}
        <View style={styles.title}>
          <SectionHeader title={title} />
        </View>
      </View>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: space.xxs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  title: {
    flex: 1,
  },
  subtitle: {
    ...typography.callout,
    color: color.textSecondary,
  },
});
