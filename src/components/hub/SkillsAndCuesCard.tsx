import { LoadingImage, PressableCard } from '@/src/components/ds';
import { color, radius, space, typography } from '@/src/constants/tokens';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const THUMBNAILS = [
  require('@/assets/images/skills/thumbnails/RMU.jpg'),
  require('@/assets/images/skills/thumbnails/Snatch.jpg'),
  require('@/assets/images/skills/thumbnails/Handstand.jpg'),
] as const;

type SkillsAndCuesCardProps = {
  onPress: () => void;
};

/** Explore's hero: the Skills & Cues library. */
export function SkillsAndCuesCard({ onPress }: SkillsAndCuesCardProps) {
  return (
    <PressableCard
      variant="hero"
      onPress={onPress}
      accessibilityLabel="Skills and Cues, drills and coaching cues for complex skills"
    >
      <View style={styles.content}>
        <View style={styles.thumbnails}>
          {THUMBNAILS.map((source, index) => (
            <LoadingImage
              key={index}
              source={source}
              style={styles.thumbnail}
            />
          ))}
        </View>
        <View style={styles.text}>
          <Text style={styles.overline}>Learn something new</Text>
          <Text style={styles.title}>Skills & Cues</Text>
          <Text style={styles.description}>
            Nail complex skills with drills and coaching cues. This section’s
            for you.
          </Text>
        </View>
      </View>
    </PressableCard>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: space.sm,
  },
  thumbnails: {
    flexDirection: 'row',
    gap: space.xs,
  },
  thumbnail: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: radius.sm,
  },
  text: {
    gap: space.xxs,
  },
  overline: {
    ...typography.overline,
    color: color.gold,
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
