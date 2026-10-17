import { checkinStyles as styles } from '@/src/components/checkin/checkinStyles';
import { PressableCard } from '@/src/components/ds';
import { color } from '@/src/constants/tokens';
import type { BehaviourEntry, CatalogueBehaviour } from '@/src/types/checkin';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

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
  const emptyLabel = editable ? 'Tap to log' : 'Read only on Free';

  return (
    <PressableCard
      onPress={onPress}
      disabled={!editable}
      showChevron={editable}
      accessibilityLabel={`${behaviour.label}, ${
        isLogged ? formatValue(behaviour, entry.value) : 'not logged'
      }${editable ? '' : ', read only on Free'}`}
    >
      <View style={styles.rowContent}>
        <Ionicons
          name={isLogged ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={isLogged ? color.gold : color.borderStrong}
        />
        <View style={styles.rowTextBlock}>
          <Text style={styles.rowTitle}>{behaviour.label}</Text>
          <View style={styles.rowStatusLine}>
            {editable ? null : (
              <Ionicons
                name="lock-closed-outline"
                size={14}
                color={color.textTertiary}
              />
            )}
            {isLogged ? (
              <Text style={styles.rowValue}>
                {formatValue(behaviour, entry.value)}
              </Text>
            ) : (
              <Text style={styles.rowValueEmpty}>{emptyLabel}</Text>
            )}
          </View>
        </View>
      </View>
    </PressableCard>
  );
}
