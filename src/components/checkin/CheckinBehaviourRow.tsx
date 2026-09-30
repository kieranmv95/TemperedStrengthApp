import { checkinStyles as styles } from '@/src/components/checkin/checkinStyles';
import { SmallChevron } from '@/src/components/ds';
import { Colors } from '@/src/constants/theme';
import type { BehaviourEntry, CatalogueBehaviour } from '@/src/types/checkin';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type CheckinBehaviourRowProps = {
  behaviour: CatalogueBehaviour;
  entry: BehaviourEntry | undefined;
  /** Free users over the caps can read but not change a behaviour. */
  editable: boolean;
  onPress: () => void;
};

function formatValue(
  behaviour: CatalogueBehaviour,
  value: boolean | number | string
): string {
  switch (behaviour.responseType) {
    case 'boolean':
      return value === true ? 'Did it' : 'Didn’t';
    case 'scale_1_5':
      return `${String(value)} / 5`;
    case 'quantity':
      return behaviour.unit
        ? `${String(value)} ${behaviour.unit}`
        : String(value);
    case 'choice':
      return String(value);
    default:
      return String(value);
  }
}

export function CheckinBehaviourRow({
  behaviour,
  entry,
  editable,
  onPress,
}: CheckinBehaviourRowProps) {
  const isLogged = entry !== undefined;

  return (
    <TouchableOpacity
      style={[styles.row, !editable && styles.rowLocked]}
      onPress={onPress}
      disabled={!editable}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${behaviour.label}, ${
        isLogged ? formatValue(behaviour, entry.value) : 'not logged'
      }`}
      accessibilityState={{ disabled: !editable }}
    >
      <View style={styles.rowStatusIcon}>
        <Ionicons
          name={isLogged ? 'checkmark-circle' : 'ellipse-outline'}
          size={22}
          color={isLogged ? Colors.accent : Colors.backgroundBorder}
        />
      </View>
      <View style={styles.rowTextBlock}>
        <Text style={styles.rowTitle}>{behaviour.label}</Text>
        {isLogged ? (
          <Text style={styles.rowValue}>
            {formatValue(behaviour, entry.value)}
          </Text>
        ) : (
          <Text style={styles.rowValueEmpty}>
            {editable ? 'Tap to log' : 'Read only on Free'}
          </Text>
        )}
      </View>
      {editable ? <SmallChevron /> : null}
    </TouchableOpacity>
  );
}
