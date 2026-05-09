import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import type { SyncConflict } from '@/src/sync';
import { Colors } from '@/src/constants/theme';
import { formatSyncTimestamp, maxPositiveTimestamp } from './formatSyncTimestamp';
import { iCloudSyncConflictModalStyles as styles } from './iCloudSyncConflictModalStyles';
import { labelForSyncStorageKey } from './syncConflictKeyLabels';

type Props = {
  visible: boolean;
  conflicts: SyncConflict[] | null;
  onKeepLocal: () => void;
  onKeepICloud: () => void;
};

export function ICloudSyncConflictModal({
  visible,
  conflicts,
  onKeepLocal,
  onKeepICloud,
}: Props) {
  const conflictCount = conflicts?.length ?? 0;

  const { latestLocalTs, latestIcloudTs } = useMemo(() => {
    if (!conflicts || conflicts.length === 0) {
      return { latestLocalTs: 0, latestIcloudTs: 0 };
    }
    return {
      latestLocalTs: maxPositiveTimestamp(conflicts.map((c) => c.local.ts)),
      latestIcloudTs: maxPositiveTimestamp(conflicts.map((c) => c.icloud.ts)),
    };
  }, [conflicts]);

  const localNewer =
    latestLocalTs > 0 &&
    latestIcloudTs > 0 &&
    latestLocalTs > latestIcloudTs;
  const icloudNewer =
    latestLocalTs > 0 &&
    latestIcloudTs > 0 &&
    latestIcloudTs > latestLocalTs;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.headerIconWrap}>
            <Ionicons name="cloud-outline" size={22} color={Colors.accent} />
          </View>

          <Text style={styles.title}>Which copy should we keep?</Text>
          <Text style={styles.subtitle}>
            {conflictCount === 1
              ? 'Part of your app data was changed on this device and in iCloud, and we could not tell which version should come first. Choose one version to use going forward.'
              : `We found ${conflictCount} areas where your data does not match between this device and iCloud. Choose one version to use for all of them.`}{' '}
            The times below help you see which side was updated most recently.
          </Text>

          <View style={styles.comparisonCard}>
            <View
              style={[
                styles.comparisonHalf,
                localNewer && styles.comparisonHalfAccent,
              ]}
            >
              <Text style={styles.comparisonLabel}>On this device</Text>
              <Text style={styles.comparisonTime}>
                {formatSyncTimestamp(latestLocalTs)}
              </Text>
              <Text style={styles.comparisonHint}>
                When this device last saved changes for the items listed below.
              </Text>
            </View>
            <View
              style={[
                styles.comparisonHalf,
                icloudNewer && styles.comparisonHalfAccent,
              ]}
            >
              <Text style={styles.comparisonLabel}>In iCloud</Text>
              <Text style={styles.comparisonTime}>
                {formatSyncTimestamp(latestIcloudTs)}
              </Text>
              <Text style={styles.comparisonHint}>
                When iCloud last had changes for the items listed below.
              </Text>
            </View>
          </View>

          {conflicts && conflicts.length > 0 ? (
            <>
              <Text style={styles.sectionLabel}>Affected data</Text>
              <ScrollView
                style={styles.keyList}
                contentContainerStyle={styles.keyListContent}
                keyboardShouldPersistTaps="handled"
              >
                {conflicts.map((c) => (
                  <View key={c.key} style={styles.keyRow}>
                    <Text style={styles.keyRowTitle}>
                      {labelForSyncStorageKey(c.key)}
                    </Text>
                    <Text style={styles.keyRowMeta}>
                      This device: {formatSyncTimestamp(c.local.ts)}
                      {'\n'}
                      iCloud: {formatSyncTimestamp(c.icloud.ts)}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </>
          ) : null}

          <Text style={styles.body}>
            If you use this device’s copy, it will replace what is stored in
            iCloud for these items. If you use the iCloud copy, this device will
            update to match iCloud.
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={onKeepLocal}
              accessibilityRole="button"
              accessibilityLabel="Use the data stored on this device"
            >
              <Text style={styles.secondaryButtonText}>Use this device</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={onKeepICloud}
              accessibilityRole="button"
              accessibilityLabel="Use the data from iCloud"
            >
              <Text style={styles.primaryButtonText}>Use iCloud</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
