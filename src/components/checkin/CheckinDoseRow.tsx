import { checkinStyles as styles } from '@/src/components/checkin/checkinStyles';
import type {
  DerivedSupplementDose,
  SupplementLogStatus,
} from '@/src/types/supplements';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

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
  const isTaken = dose.status === 'taken';
  const isSkipped = dose.status === 'skipped';

  return (
    <View style={[styles.row, !editable && styles.rowLocked]}>
      <View style={styles.rowTextBlock}>
        <Text style={styles.rowTitle}>{dose.name}</Text>
        <Text style={styles.rowDescription}>
          {dose.doseAmount} {dose.doseUnit} · {dose.scheduledTime}
        </Text>
        {dose.status === 'missed' ? (
          <Text style={styles.doseMissed}>Missed</Text>
        ) : null}
      </View>
      <View style={styles.doseActions}>
        <TouchableOpacity
          style={[styles.doseButton, isTaken && styles.doseButtonTaken]}
          onPress={() => onSetStatus('taken')}
          disabled={!editable}
          accessibilityRole="button"
          accessibilityLabel={`Mark ${dose.name} at ${dose.scheduledTime} as taken`}
          accessibilityState={{ selected: isTaken, disabled: !editable }}
        >
          <Text
            style={[
              styles.doseButtonText,
              isTaken && styles.doseButtonTextTaken,
            ]}
          >
            Taken
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.doseButton, isSkipped && styles.doseButtonSkipped]}
          onPress={() => onSetStatus('skipped')}
          disabled={!editable}
          accessibilityRole="button"
          accessibilityLabel={`Mark ${dose.name} at ${dose.scheduledTime} as skipped`}
          accessibilityState={{ selected: isSkipped, disabled: !editable }}
        >
          <Text
            style={[
              styles.doseButtonText,
              isSkipped && styles.doseButtonTextSkipped,
            ]}
          >
            Skipped
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
