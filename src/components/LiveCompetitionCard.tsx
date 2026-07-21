import { SmallChevron } from '@/src/components/ds';
import { BorderRadius, FontSize, Spacing } from '@/src/constants/theme';
import type { LiveCompetition } from '@/src/types/live-competition';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type LiveCompetitionCardProps = {
  competition: LiveCompetition;
  children?: ReactNode;
  /** Right-side chevron using the competition theme colours. */
  showChevron?: boolean;
};

export function LiveCompetitionCard({
  competition,
  children,
  showChevron = false,
}: LiveCompetitionCardProps) {
  const { title, description, theme } = competition;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.bgColor, borderColor: theme.borderColor },
      ]}
    >
      <View style={styles.body}>
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
      {showChevron ? <SmallChevron color={theme.linkColor} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xxl,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  body: {
    flex: 1,
    gap: Spacing.md,
    minWidth: 0,
  },
  title: {
    fontSize: FontSize.displayMd,
    fontWeight: '700',
  },
  description: {
    fontSize: FontSize.base,
  },
  descriptionWithAction: {},
});
