import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  BorderRadius,
  Colors,
  FontSize,
  Spacing,
} from '../constants/theme';

type SessionSummaryModalProps = {
  visible: boolean;
  duration: number;
  totalVolume: number;
  setsCompleted: number;
  onDismiss: () => void;
};

const formatDuration = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
};

const formatVolume = (kg: number): string => {
  return `${kg.toLocaleString()}KG`;
};

export const SessionSummaryModal: React.FC<SessionSummaryModalProps> = ({
  visible,
  duration,
  totalVolume,
  setsCompleted,
  onDismiss,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Session Complete</Text>
          <Text style={styles.subtitle}>Great work. Here's your summary.</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{formatDuration(duration)}</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>{formatVolume(totalVolume)}</Text>
              <Text style={styles.statLabel}>Total Volume</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>{setsCompleted}</Text>
              <Text style={styles.statLabel}>Sets Completed</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.doneButton}
            onPress={onDismiss}
            activeOpacity={0.7}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    padding: Spacing.xxl,
  },
  content: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.section,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayXXl,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    textAlign: 'center',
    marginBottom: Spacing.section,
  },
  statsContainer: {
    gap: Spacing.xl,
    marginBottom: Spacing.section,
  },
  statCard: {
    backgroundColor: Colors.backgroundElevated,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  statValue: {
    color: Colors.accent,
    fontSize: FontSize.displayXXl,
    fontWeight: '800',
    marginBottom: Spacing.xs,
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  doneButton: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  doneButtonText: {
    color: Colors.textOnAccent,
    fontSize: FontSize.xxl,
    fontWeight: '700',
  },
});
