import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, FontSize, Spacing } from '../constants/theme';

type ProgramStartingInXScreenProps = {
  daysUntilStart: number;
};

export const ProgramStartingInXScreen: React.FC<
  ProgramStartingInXScreenProps
> = ({ daysUntilStart }) => {
  const headline =
    daysUntilStart === 1
      ? 'Your program starts in 1 day'
      : `Your program starts in ${daysUntilStart} days`;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{headline}</Text>
        <Text style={styles.subtitle}>
          Come back on your start date to begin your first session. You can
          scroll the dates above to see what is coming up.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.section,
  },
  title: {
    color: Colors.accent,
    fontSize: FontSize.hero,
    fontWeight: '800',
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.xxl,
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: Spacing.xxl,
  },
});
