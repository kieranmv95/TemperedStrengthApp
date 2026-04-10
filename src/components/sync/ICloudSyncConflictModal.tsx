import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { iCloudSyncConflictModalStyles as styles } from './iCloudSyncConflictModalStyles';

type Props = {
  visible: boolean;
  conflictCount: number;
  onKeepLocal: () => void;
  onKeepICloud: () => void;
};

export function ICloudSyncConflictModal({
  visible,
  conflictCount,
  onKeepLocal,
  onKeepICloud,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>iCloud Sync Conflict</Text>
          <Text style={styles.body}>
            We found {conflictCount} conflicting item
            {conflictCount === 1 ? '' : 's'} between this device and iCloud.
          </Text>
          <Text style={styles.body}>
            Choose which version to keep for all conflicts found right now.
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={onKeepLocal}
            >
              <Text style={styles.secondaryButtonText}>Keep Local</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={onKeepICloud}
            >
              <Text style={styles.primaryButtonText}>Keep iCloud</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

