import { color, space, typography } from '@/src/constants/tokens';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type PreviewSectionProps = {
  title: string;
  children: React.ReactNode;
};

export function PreviewSection({ title, children }: PreviewSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: space.sm,
  },
  title: {
    ...typography.title2,
    color: color.textPrimary,
  },
});
