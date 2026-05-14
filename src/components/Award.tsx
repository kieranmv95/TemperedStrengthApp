import { Colors, FontSize, Spacing } from '@/src/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AwardIcon, { AwardIconVariant } from './AwardIcon';
import { Card } from './ds';

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
  const isProGateLocked = awardPro && !isUserPro;

  return (
    <Card>
      <View style={styles.icon}>
        <View style={(!granted || isProGateLocked) && styles.locked}>
          <AwardIcon
            variant={variant}
            text={isProGateLocked ? 'Locked' : badgeTitle}
            size={80}
            fontSize={fontSize}
          />
        </View>
      </View>
      <View style={[styles.content, (!granted || isProGateLocked) && styles.locked]}>
        <Text style={styles.title}>
          {isProGateLocked ? 'Locked Award' : title}
        </Text>
        <Text style={styles.description}>
          {isProGateLocked
            ? 'This award is locked because you do not have Pro.'
            : description}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  locked: {
    opacity: 0.4,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    minWidth: 0,
    flexShrink: 1,
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '700',
    flexShrink: 1,
  },
  description: {
    color: Colors.accent,
    fontSize: FontSize.md,
    fontWeight: '500',
    flexShrink: 1,
  },
});
