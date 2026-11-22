import { color } from '@/src/constants/tokens';
import type { ZoneMethod } from '@/src/types/heartRate';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { zoneScreenStyles as styles } from './zoneScreenStyles';

const METHOD_OPTIONS: { method: ZoneMethod; label: string }[] = [
  { method: 'basic', label: 'Basic' },
  { method: 'karvonen', label: 'Advanced' },
];

type ZoneMethodToggleProps = {
  method: ZoneMethod;
  onSelect: (method: ZoneMethod) => void;
  onOpenInfo: () => void;
};

/**
 * Basic / Advanced (Karvonen) switch. Never disabled: picking Advanced
 * without a resting HR is handled by the caller.
 */
export function ZoneMethodToggle({
  method,
  onSelect,
  onOpenInfo,
}: ZoneMethodToggleProps) {
  return (
    <View style={styles.methodRow}>
      <View
        style={styles.methodToggle}
        accessibilityRole="radiogroup"
        accessibilityLabel="Zone calculation"
      >
        {METHOD_OPTIONS.map((option) => {
          const isActive = option.method === method;
          return (
            <Pressable
              key={option.method}
              style={({ pressed }) => [
                styles.methodOption,
                pressed && !isActive && styles.methodOptionPressed,
                isActive && styles.methodOptionActive,
              ]}
              onPress={() => onSelect(option.method)}
              accessibilityRole="radio"
              accessibilityLabel={
                option.method === 'karvonen'
                  ? 'Advanced, Karvonen formula'
                  : 'Basic, age only'
              }
              accessibilityState={{ checked: isActive }}
            >
              <Text
                style={[
                  styles.methodOptionText,
                  isActive && styles.methodOptionTextActive,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Pressable
        style={styles.headerButton}
        onPress={onOpenInfo}
        accessibilityRole="button"
        accessibilityLabel="How zones are calculated"
      >
        <Ionicons
          name="information-circle-outline"
          size={24}
          color={color.textSecondary}
        />
      </Pressable>
    </View>
  );
}
