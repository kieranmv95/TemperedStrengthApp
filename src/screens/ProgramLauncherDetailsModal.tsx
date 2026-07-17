import { YoutubeEmbed } from '@/src/components/exercise/YoutubeEmbed';
import type { Program } from '@/src/types/program';
import { modalSheetBottomPadding } from '@/src/utils/platform';
import { sessionsPerWeekFromProgram } from '@/src/utils/programWeekPattern';
import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SmallChevron } from '../components/ds/SmallChevron';
import { Spacing } from '../constants/theme';
import { programLauncherStyles as styles } from './programLauncherStyles';

type ProgramLauncherDetailsModalProps = {
  visible: boolean;
  onClose: () => void;
  selectedProgram: Program | null;
  isPro: boolean;
  onStartProgram: () => void;
  onUpgradePress: () => void;
  bottomInset: number;
};

export function ProgramLauncherDetailsModal({
  visible,
  onClose,
  selectedProgram,
  isPro,
  onStartProgram,
  onUpgradePress,
  bottomInset,
}: ProgramLauncherDetailsModalProps) {
  const [bodyChangesExpanded, setBodyChangesExpanded] = React.useState(false);

  const sessionsPerWeek = selectedProgram
    ? sessionsPerWeekFromProgram(selectedProgram)
    : 0;

  React.useEffect(() => {
    if (!visible) {
      setBodyChangesExpanded(false);
      return;
    }
    setBodyChangesExpanded(false);
  }, [visible, selectedProgram?.id]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.programDetailsModal}>
          <View style={styles.modalHeader}>
            <View style={styles.modalTitleRow}>
              <Text style={styles.modalTitle}>
                {selectedProgram?.name || 'Program Details'}
              </Text>
              {selectedProgram?.isPro && (
                <View style={styles.proBadge}>
                  <Text style={styles.proBadgeText}>PRO</Text>
                </View>
              )}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.programDescription}>
              {selectedProgram?.description}
            </Text>

            {selectedProgram?.bodyChangesSummary && (
              <View style={styles.bodyChangesCard}>
                <TouchableOpacity
                  onPress={() => setBodyChangesExpanded((v) => !v)}
                  accessibilityRole="button"
                  accessibilityState={{ expanded: bodyChangesExpanded }}
                  style={styles.bodyChangesLinkRow}
                >
                  <Text style={styles.bodyChangesLinkText}>
                    What this program can do for you
                  </Text>
                  <View
                    style={{
                      transform: [
                        { rotate: bodyChangesExpanded ? '-90deg' : '90deg' },
                      ],
                    }}
                  >
                    <SmallChevron />
                  </View>
                </TouchableOpacity>
                {bodyChangesExpanded && (
                  <Text style={styles.bodyChangesText}>
                    {selectedProgram.bodyChangesSummary}
                  </Text>
                )}
              </View>
            )}

            <Text style={styles.sectionTitle}>Program Overview</Text>

            {selectedProgram?.videoId ? (
              <View style={styles.programVideoContainer}>
                <YoutubeEmbed
                  youtubeId={selectedProgram.videoId}
                  accessibilityLabel={`Program overview video for ${selectedProgram.name}`}
                />
              </View>
            ) : null}

            <View style={styles.programOverviewContainer}>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {selectedProgram?.workouts.length}
                  </Text>
                  <Text style={styles.statLabel}>Workouts</Text>
                </View>
                {selectedProgram &&
                  (() => {
                    const maxDayIndex = Math.max(
                      ...selectedProgram.workouts.map((w) => w.dayIndex)
                    );
                    const weekCount = Math.ceil((maxDayIndex + 1) / 7);
                    return (
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>{weekCount}</Text>
                        <Text style={styles.statLabel}>
                          {weekCount === 1 ? 'Week' : 'Weeks'}
                        </Text>
                      </View>
                    );
                  })()}
                {selectedProgram?.averageSessionDuration && (
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {selectedProgram.averageSessionDuration}
                    </Text>
                    <Text style={styles.statLabel}>Duration</Text>
                  </View>
                )}
              </View>
              {sessionsPerWeek ? (
                <View style={{ ...styles.statItem, marginTop: Spacing.lg }}>
                  <Text style={styles.statValue}>
                    {sessionsPerWeek}{' '}
                    <Text style={styles.statLabel}>sessions per week</Text>
                  </Text>
                </View>
              ) : null}
            </View>
          </ScrollView>

          <View
            style={[
              styles.modalFooter,
              { paddingBottom: modalSheetBottomPadding(bottomInset) },
            ]}
          >
            {selectedProgram?.isPro && !isPro ? (
              <TouchableOpacity
                style={styles.upgradeProgramButton}
                onPress={onUpgradePress}
              >
                <Text style={styles.upgradeProgramButtonText}>
                  Upgrade to Pro to Start
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.startProgramButton}
                onPress={onStartProgram}
              >
                <Text style={styles.startProgramButtonText}>
                  Select Start Date
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
