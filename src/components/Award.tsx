import {
  color,
  elevation,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { useLargeText } from '@/src/hooks/useLargeText';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AwardIcon, { AwardIconVariant } from './AwardIcon';
import { Badge } from './ds';

type AwardProps = {
  badgeTitle: string;
  title: string;
  description: string;
  variant: AwardIconVariant;
  awardPro?: boolean;
  isUserPro?: boolean;
  fontSize?: number;
  granted: boolean;
};

export default function Award({
  badgeTitle,
  title,
  description,
  variant,
  awardPro = false,
  isUserPro = false,
  fontSize,
  granted,
}: AwardProps) {
  const largeText = useLargeText();
  const isProGateLocked = awardPro && !isUserPro;
  const isDimmed = !granted || isProGateLocked;
  const shownTitle = isProGateLocked ? 'Locked award' : title;
  const shownDescription = isProGateLocked
    ? 'This award is locked because you do not have Pro.'
    : description;
  const statusLabel = isProGateLocked
    ? 'Requires Pro'
    : granted
      ? 'Achieved'
      : 'Not achieved';

  return (
    <View
      style={[styles.card, largeText && styles.cardStacked]}
      accessible
      accessibilityLabel={`${shownTitle}, ${statusLabel}. ${shownDescription}`}
    >
      <View
        style={isDimmed && styles.iconDimmed}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <AwardIcon
          variant={variant}
          text={isProGateLocked ? 'Locked' : badgeTitle}
          size={80}
          fontSize={fontSize}
        />
      </View>
      <View style={styles.content}>
        {isProGateLocked ? (
          <Badge label="PRO" accessibilityLabel="Requires Pro" />
        ) : granted ? (
          <Badge label="Achieved" tone="success" />
        ) : (
          <Badge label="Not achieved" tone="neutral" />
        )}
        <Text style={[styles.title, isDimmed && styles.titleDimmed]}>
          {shownTitle}
        </Text>
        <Text style={styles.description}>{shownDescription}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...elevation.raised,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
    backgroundColor: color.surface1,
  },
  /** Large text: the shield sits above the text instead of squeezing it. */
  cardStacked: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  iconDimmed: {
    opacity: 0.4,
  },
  content: {
    flex: 1,
    minWidth: 0,
    gap: space.xxs,
  },
  title: {
    ...typography.headline,
    color: color.textPrimary,
  },
  titleDimmed: {
    color: color.textSecondary,
  },
  description: {
    ...typography.callout,
    color: color.textSecondary,
  },
});
