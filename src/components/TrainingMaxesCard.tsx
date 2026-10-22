import { getExerciseById } from '@/src/data/exercises';
import { useWeightUnit } from '@/src/hooks/useWeightUnit';
import type { TrainingMaxesStore } from '@/src/types/trainingMaxes';
import { getEffectiveBottomInset } from '@/src/utils/platform';
import { getTrainingMaxesStore, setTrainingMaxes } from '@/src/utils/storage';
import { formatWeightFromKg } from '@/src/utils/weightUnits';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  color,
  elevation,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '../constants/tokens';
import { TrainingMaxModal } from './TrainingMaxModal';

type TrainingMaxesCardProps = {
  exerciseIds: number[];
  onChanged?: () => void;
};

export function TrainingMaxesCard({
  exerciseIds,
  onChanged,
}: TrainingMaxesCardProps) {
  const insets = useSafeAreaInsets();
  const { unit: weightUnit } = useWeightUnit();
  const [values, setValues] = React.useState<TrainingMaxesStore>({});
  const [editing, setEditing] = React.useState(false);

  const loadValues = React.useCallback(async () => {
    try {
      setValues(await getTrainingMaxesStore());
    } catch (error) {
      console.error('Error loading training maxes card:', error);
    }
  }, []);

  React.useEffect(() => {
    loadValues();
  }, [loadValues]);

  const handleConfirm = async (next: TrainingMaxesStore) => {
    await setTrainingMaxes(next);
    await loadValues();
    setEditing(false);
    onChanged?.();
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title} accessibilityRole="header">
          Training maxes
        </Text>
        <Pressable
          onPress={() => setEditing(true)}
          style={styles.editButton}
          accessibilityRole="button"
          accessibilityLabel="Edit training maxes"
        >
          <Text style={styles.editText}>Edit</Text>
        </Pressable>
      </View>

      <View style={styles.rows}>
        {exerciseIds.map((id) => {
          const exercise = getExerciseById(id);
          const value = values[id];
          return (
            <View key={id} style={styles.row}>
              <Text style={styles.liftName} numberOfLines={1}>
                {exercise?.name ?? `Exercise ${id}`}
              </Text>
              <Text style={styles.liftValue}>
                {typeof value === 'number' && value > 0
                  ? formatWeightFromKg(value, weightUnit)
                  : 'Not set'}
              </Text>
            </View>
          );
        })}
      </View>

      <TrainingMaxModal
        visible={editing}
        exerciseIds={exerciseIds}
        initialValuesKg={values}
        mode="edit"
        onClose={() => setEditing(false)}
        onConfirm={handleConfirm}
        bottomInset={getEffectiveBottomInset(insets.bottom)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...elevation.raised,
    backgroundColor: color.surface1,
    borderRadius: radius.md,
    padding: space.md,
    gap: space.xs,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...typography.headline,
    color: color.textPrimary,
  },
  editButton: {
    minHeight: MIN_TARGET_SIZE,
    justifyContent: 'center',
    paddingHorizontal: space.xs,
    marginRight: -space.xs,
  },
  editText: {
    ...typography.calloutStrong,
    color: color.gold,
  },
  rows: {
    gap: space.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.sm,
  },
  liftName: {
    ...typography.callout,
    color: color.textSecondary,
    flex: 1,
  },
  liftValue: {
    ...typography.numericSmall,
    color: color.textPrimary,
  },
});
