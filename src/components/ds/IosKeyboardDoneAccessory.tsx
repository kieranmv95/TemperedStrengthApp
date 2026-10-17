import {
  color,
  MIN_TARGET_SIZE,
  space,
  typography,
} from '@/src/constants/tokens';
import React from 'react';
import {
  InputAccessoryView,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export const IOS_KEYBOARD_DONE_ACCESSORY_ID = 'ios-keyboard-done-accessory';

export function IosKeyboardDoneAccessory() {
  return (
    <InputAccessoryView nativeID={IOS_KEYBOARD_DONE_ACCESSORY_ID}>
      <View style={styles.container}>
        <View style={styles.spacer} />
        <Pressable
          onPress={() => Keyboard.dismiss()}
          style={({ pressed }) => [
            styles.doneButton,
            pressed && styles.doneButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Dismiss keyboard"
        >
          <Text style={styles.doneText}>Done</Text>
        </Pressable>
      </View>
    </InputAccessoryView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.md,
    backgroundColor: color.surface2,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.borderSubtle,
  },
  spacer: {
    flex: 1,
  },
  doneButton: {
    minHeight: MIN_TARGET_SIZE,
    minWidth: MIN_TARGET_SIZE,
    paddingHorizontal: space.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonPressed: {
    opacity: 0.6,
  },
  doneText: {
    ...typography.calloutStrong,
    color: color.gold,
  },
});
