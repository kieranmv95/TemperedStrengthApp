import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  settingsList: {
    gap: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  settingDescription: {
    color: '#888',
    fontSize: 14,
    lineHeight: 20,
  },
  settingArrow: {
    color: '#c9b072',
    fontSize: 24,
    fontWeight: '600',
    marginLeft: 12,
  },
  dangerItem: {
    borderColor: '#FF4444',
  },
  dangerText: {
    color: '#FF4444',
  },
});
