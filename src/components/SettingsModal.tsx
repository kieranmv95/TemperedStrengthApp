import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {
  BorderRadius,
  Colors,
  FontSize,
  Spacing,
} from '../constants/theme';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { clearProgramData } from '../utils/storage';

type SettingsModalProps = {
  visible: boolean;
  onClose: () => void;
  onProgramReset: () => void;
};

export const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  onClose,
  onProgramReset,
}) => {
  const handleChangeProgram = () => {
    Alert.alert(
      'Change Program',
      'Changing your program will lose all progress on your current program, including your workout logs and exercise swaps.\n\nFinishing a program to completion is the best approach for achieving your fitness goals.\n\nAre you sure you want to change programs?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Change Program',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearProgramData();
              onProgramReset();
              onClose();
            } catch (error) {
              console.error('Error changing program:', error);
              Alert.alert(
                'Error',
                'Failed to change program. Please try again.'
              );
            }
          },
        },
      ]
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete ALL stored data including:\n\n• Program progress\n• Workout logs\n• Exercise swaps\n• Custom set counts\n• Exercise cache\n\nThis action cannot be undone.\n\nAre you sure you want to clear all data?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All Data',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              onProgramReset();
              onClose();
              Alert.alert('Success', 'All data has been cleared.');
            } catch (error) {
              console.error('Error clearing all data:', error);
              Alert.alert(
                'Error',
                'Failed to clear all data. Please try again.'
              );
            }
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Settings</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.settingsList}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleChangeProgram}
            >
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Change Program</Text>
                <Text style={styles.settingDescription}>
                  Select a different program
                </Text>
              </View>
              <Text style={styles.settingArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.settingItem, styles.dangerItem]}
              onPress={handleClearAllData}
            >
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, styles.dangerText]}>
                  Clear All Data
                </Text>
                <Text style={styles.settingDescription}>
                  Permanently delete all stored data
                </Text>
              </View>
              <Text style={[styles.settingArrow, styles.dangerText]}>→</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.backgroundCard,
    borderTopLeftRadius: BorderRadius.pill,
    borderTopRightRadius: BorderRadius.pill,
    padding: Spacing.section,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.section,
  },
  modalTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayXl,
    fontWeight: '700',
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '600',
  },
  settingsList: {
    gap: Spacing.xl,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.backgroundElevated,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  settingDescription: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    lineHeight: 20,
  },
  settingArrow: {
    color: Colors.accent,
    fontSize: FontSize.displayXl,
    fontWeight: '600',
    marginLeft: Spacing.xl,
  },
  dangerItem: {
    borderColor: Colors.destructiveAlt,
  },
  dangerText: {
    color: Colors.destructiveAlt,
  },
});
