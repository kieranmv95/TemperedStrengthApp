import { SmallChevron } from '@/src/components/ds';
import {
  color,
  elevation,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import type { LiveCompetition } from '@/src/types/live-competition';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type LiveCompetitionCardProps = {
  competition: LiveCompetition;
  children?: ReactNode;
  showChevron?: boolean;
};

const ACCENT_EDGE_WIDTH = 4;

/**
 * Competition summary in the dark theme. The CMS theme background is used only
 * as a narrow accent edge; text uses tokens so contrast always passes.
 */
export function LiveCompetitionCard({
  competition,
  children,
  showChevron = false,
}: LiveCompetitionCardProps) {
  const { title, description, theme } = competition;

  return (
    <View style={[styles.container, elevation.raised]}>
      <View
        style={[styles.accentEdge, { backgroundColor: theme.bgColor }]}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
      <View style={styles.row}>
        <View style={styles.body}>
          <Text style={styles.title} accessibilityRole="header">
            {title}
          </Text>
          <Text style={styles.description}>{description}</Text>
          {children}
        </View>
        {showChevron ? <SmallChevron /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: radius.md,
    backgroundColor: color.surface1,
    overflow: 'hidden',
  },
  accentEdge: {
    width: ACCENT_EDGE_WIDTH,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    padding: space.md,
  },
  body: {
    flex: 1,
    minWidth: 0,
    gap: space.xs,
  },
  title: {
    ...typography.title2,
    color: color.textPrimary,
  },
  description: {
    ...typography.callout,
    color: color.textSecondary,
  },
});
