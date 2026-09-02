import { Card, SmallChevron } from '@/src/components/ds';
import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const THUMBNAILS = [
  require('@/assets/images/skills/thumbnails/RMU.jpg'),
  require('@/assets/images/skills/thumbnails/Snatch.jpg'),
  require('@/assets/images/skills/thumbnails/Handstand.jpg'),
] as const;

type SkillsAndCuesCardProps = {
  onPress: () => void;
};

export function SkillsAndCuesCard({ onPress }: SkillsAndCuesCardProps) {
  return (
    <Card
      onPress={onPress}
      accessibilityLabel="Open Skills and Cues"
      style={styles.card}
    >
      <View style={styles.topRow}>
        <View style={styles.imageRow}>
          {THUMBNAILS.map((source, index) => (
            <View key={index} style={styles.thumbnailWrap}>
              <Image
                source={source}
                style={styles.thumbnail}
                resizeMode="cover"
                accessibilityIgnoresInvertColors
              />
            </View>
          ))}
        </View>
        <SmallChevron />
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.eyebrow}>Learn something new</Text>
        <Text style={styles.title}>Skills & Cues</Text>
        <Text style={styles.description}>
          Have you been looking to nail down that complex skill for a while? Or
          are you a coach looking for that cue or guidance that will help your
          client finally get that first muscle up. This sections for you.
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: Spacing.xl,
    backgroundColor: Colors.accentWashFill,
    borderColor: Colors.accentWashOutline,
    borderWidth: 1.5,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
  },
  imageRow: {
    flex: 1,
    flexDirection: 'row',
    gap: Spacing.md,
  },
  thumbnailWrap: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.backgroundElevated,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  textBlock: {
    gap: Spacing.xs,
  },
  eyebrow: {
    color: Colors.accent,
    fontSize: FontSize.sm,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '800',
    lineHeight: 22,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
    lineHeight: 20,
  },
});
