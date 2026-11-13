import { ActionChip } from '@/src/components/ds';
import type { Discipline } from '@/src/data/disciplines';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

type DisciplinePillProps = {
  discipline: Discipline;
  onPress: () => void;
};

/** Compact pill for a training discipline in the workouts screen row. */
export function DisciplinePill({ discipline, onPress }: DisciplinePillProps) {
  return (
    <ActionChip
      label={discipline.title}
      icon={
        (discipline.icon ?? 'chevron-forward') as keyof typeof Ionicons.glyphMap
      }
      tone="neutral"
      onPress={onPress}
      accessibilityHint={`Shows ${discipline.title} workouts`}
    />
  );
}
