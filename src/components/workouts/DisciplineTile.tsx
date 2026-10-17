import { Skeleton } from '@/src/components/ds';
import { color, radius, space, typography } from '@/src/constants/tokens';
import type { Discipline } from '@/src/data/disciplines';
import { useMotion } from '@/src/hooks/useMotion';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

export const DISCIPLINE_TILE_SIZE = 160;

type DisciplineTileProps = {
  discipline: Discipline;
  onPress: () => void;
};

/**
 * Image tile for a discipline. Logo artwork is an image of text, so the tile
 * always carries the discipline name as its accessible label.
 */
export function DisciplineTile({ discipline, onPress }: DisciplineTileProps) {
  const motionHelpers = useMotion();
  const [loaded, setLoaded] = useState(false);
  const imageOpacity = useSharedValue(0);

  const imageStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.get(),
  }));

  const handleLoad = () => {
    setLoaded(true);
    imageOpacity.set(motionHelpers.fade(1, 'fast'));
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
      accessibilityRole="button"
      accessibilityLabel={discipline.title}
      accessibilityHint={`Shows ${discipline.title} workouts`}
    >
      {!loaded ? (
        <Skeleton
          width={DISCIPLINE_TILE_SIZE}
          height={DISCIPLINE_TILE_SIZE}
          radius="md"
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      <Animated.View style={[StyleSheet.absoluteFill, imageStyle]}>
        <Image
          source={discipline.image}
          style={styles.image}
          resizeMode="cover"
          onLoad={handleLoad}
          accessible={false}
        />
      </Animated.View>
      {discipline.showTitle ? (
        <View style={styles.titleBar}>
          <Text style={styles.title} numberOfLines={2}>
            {discipline.title}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: DISCIPLINE_TILE_SIZE,
    height: DISCIPLINE_TILE_SIZE,
    borderRadius: radius.md,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    backgroundColor: color.surface2,
  },
  tilePressed: {
    opacity: 0.85,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  titleBar: {
    backgroundColor: color.scrim,
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
  },
  title: {
    ...typography.headline,
    color: color.textPrimary,
  },
});
