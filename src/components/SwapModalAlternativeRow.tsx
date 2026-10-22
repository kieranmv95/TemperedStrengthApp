import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Tag } from './ds';
import { SmallChevron } from './ds/SmallChevron';
import { swapModalStyles as styles } from './swapModalStyles';

type SwapModalAlternativeRowProps = {
  name: string;
  equipment: string;
  muscle: string;
  matchScore?: number;
  onPress: () => void;
};

export function SwapModalAlternativeRow({
  name,
  equipment,
  muscle,
  matchScore,
  onPress,
}: SwapModalAlternativeRowProps) {
  const accessibilityLabel = [
    name,
    equipment,
    muscle,
    matchScore !== undefined ? `${matchScore}% match` : null,
  ]
    .filter((part): part is string => part !== null)
    .join(', ');

  return (
    <Pressable
      style={({ pressed }) => [
        styles.alternativeItem,
        pressed && styles.alternativeItemPressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint="Asks you to confirm this exercise for the slot"
    >
      <View style={styles.alternativeContent}>
        <Text style={styles.alternativeName}>{name}</Text>
        <View style={styles.alternativeMeta}>
          <Tag label={equipment} />
          <Tag label={muscle} />
          {matchScore !== undefined && (
            <Text style={styles.alternativeMatchScore}>
              {matchScore}% match
            </Text>
          )}
        </View>
      </View>
      <SmallChevron />
    </Pressable>
  );
}
