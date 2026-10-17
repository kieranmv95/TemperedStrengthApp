import { LoadingImage } from '@/src/components/ds';
import { color, radius, space, typography } from '@/src/constants/tokens';
import type { Discipline } from '@/src/data/disciplines';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
      accessibilityRole="button"
      accessibilityLabel={discipline.title}
      accessibilityHint={`Shows ${discipline.title} workouts`}
    >
      <LoadingImage source={discipline.image} style={StyleSheet.absoluteFill} />
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
