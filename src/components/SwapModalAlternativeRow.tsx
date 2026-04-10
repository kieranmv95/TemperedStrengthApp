import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
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
  return (
    <TouchableOpacity style={styles.alternativeItem} onPress={onPress}>
      <View style={styles.alternativeContent}>
        <Text style={styles.alternativeName}>{name}</Text>
        <View style={styles.alternativeMeta}>
          <Text style={styles.alternativeEquipment}>{equipment}</Text>
          <Text style={styles.alternativeMuscle}>{muscle}</Text>
          {matchScore !== undefined && (
            <Text style={styles.alternativeMatchScore}>
              {matchScore}% match
            </Text>
          )}
        </View>
      </View>
      <Text style={styles.selectArrow}>→</Text>
    </TouchableOpacity>
  );
}
