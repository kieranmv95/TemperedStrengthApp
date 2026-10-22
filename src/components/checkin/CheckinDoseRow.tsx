import { checkinStyles as styles } from '@/src/components/checkin/checkinStyles';
import { Badge, FilterChip } from '@/src/components/ds';
import { color } from '@/src/constants/tokens';
import { useLargeText } from '@/src/hooks/useLargeText';
import type {
  DerivedSupplementDose,
  SupplementLogStatus,
} from '@/src/types/supplements';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

type CheckinDoseRowProps = {
  dose: DerivedSupplementDose;
  /** Free users over the caps can read but not change a dose. */
  editable: boolean;
  onSetStatus: (status: SupplementLogStatus) => void;
};

export function CheckinDoseRow({
  dose,
  editable,
  onSetStatus,
}: CheckinDoseRowProps) {
  const largeText = useLargeText();
  const isTaken = dose.status === 'taken';
  const isSkipped = dose.status === 'skipped';

  return (
    <View
      style={[
        styles.row,
        largeText && styles.rowStacked,
        !editable && styles.rowLocked,
      ]}
    >
      <View style={styles.rowTextBlock}>
        <Text style={styles.rowTitle}>{dose.name}</Text>
        <Text style={styles.rowDescription}>
          {dose.doseAmount} {dose.doseUnit} · {dose.scheduledTime}
        </Text>
        {dose.status === 'missed' ? (
          <Badge label="Missed" tone="danger" />
        ) : null}
        {editable ? null : (
          <View style={styles.rowStatusLine}>
            <Ionicons
              name="lock-closed-outline"
              size={14}
              color={color.textTertiary}
            />
            <Text style={styles.rowValueEmpty}>Read only on Free</Text>
          </View>
        )}
      </View>
      <View style={styles.doseActions}>
        <FilterChip
          label="Taken"
          selected={isTaken}
          onPress={() => onSetStatus('taken')}
          disabled={!editable}
          accessibilityLabel={`Mark ${dose.name} at ${dose.scheduledTime} as taken`}
        />
        <FilterChip
          label="Skipped"
          selected={isSkipped}
          onPress={() => onSetStatus('skipped')}
          disabled={!editable}
          accessibilityLabel={`Mark ${dose.name} at ${dose.scheduledTime} as skipped`}
        />
      </View>
    </View>
  );
}
