import { Colors, Spacing } from '@/src/constants/theme';
import React from 'react';
import {
  InputAccessoryView,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export const IOS_KEYBOARD_DONE_ACCESSORY_ID = 'ios-keyboard-done-accessory';

export function IosKeyboardDoneAccessory() {
  if (Platform.OS !== 'ios') return null;

  return (
    <InputAccessoryView nativeID={IOS_KEYBOARD_DONE_ACCESSORY_ID}>
      <View style={styles.container}>
        <View style={styles.spacer} />
        <TouchableOpacity
          onPress={() => Keyboard.dismiss()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.doneButton}
          accessibilityRole="button"
          accessibilityLabel="Dismiss keyboard"
        >
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </View>
    </InputAccessoryView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.backgroundElevated,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.borderDefault,
  },
  spacer: {
    flex: 1,
  },
  doneButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    minHeight: 44,
    justifyContent: 'center',
  },
  doneText: {
    color: Colors.accent,
    fontWeight: '700',
  },
});

