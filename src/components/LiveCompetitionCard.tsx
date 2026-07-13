import { BorderRadius, FontSize, Spacing } from '@/src/constants/theme';
import type { LiveCompetition } from '@/src/types/live-competition';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type LiveCompetitionCardProps = {
  competition: LiveCompetition;
  children?: ReactNode;
};

export function LiveCompetitionCard({
  competition,
  children,
}: LiveCompetitionCardProps) {
  const { title, description, theme } = competition;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.bgColor, borderColor: theme.borderColor },
      ]}
    >
      <Text style={[styles.title, { color: theme.copyColor }]}>{title}</Text>
      <Text
        style={[
          styles.description,
          { color: theme.copyColor },
          children ? styles.descriptionWithAction : null,
        ]}
      >
        {description}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    borderWidth: 2,
    borderRadius: BorderRadius.lg,
  },
  title: {
    fontSize: FontSize.displaySm,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: FontSize.base,
  },
  descriptionWithAction: {
    marginBottom: Spacing.lg,
  },
  additionalInfo: {
    fontSize: FontSize.base,
    marginBottom: Spacing.lg,
  },
});
