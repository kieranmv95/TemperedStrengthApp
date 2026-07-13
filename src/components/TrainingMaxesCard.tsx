import { getExerciseById } from '@/src/data/exercises';
import { useWeightUnit } from '@/src/hooks/useWeightUnit';
import type { TrainingMaxesStore } from '@/src/types/trainingMaxes';
import { getEffectiveBottomInset } from '@/src/utils/platform';
import { getTrainingMaxesStore, setTrainingMaxes } from '@/src/utils/storage';
import { formatWeightFromKg } from '@/src/utils/weightUnits';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BorderRadius, Colors, FontSize, Spacing } from '../constants/theme';
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
        <Text style={styles.title}>Training Maxes</Text>
        <TouchableOpacity
          onPress={() => setEditing(true)}
          accessibilityRole="button"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
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
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.backgroundElevated,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.xxl,
    fontWeight: '700',
  },
  editText: {
    color: Colors.accent,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  rows: {
    gap: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  liftName: {
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
    flex: 1,
  },
  liftValue: {
    color: Colors.accent,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
});
