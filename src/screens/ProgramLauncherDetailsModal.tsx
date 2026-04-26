import { Spacing } from '@/src/constants/theme';
import type { Program } from '@/src/types/program';
import type { ProgramDaySplitKey } from '@/src/utils/programStartWeekday';
import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ProgramLauncherWeekdayPicker } from './ProgramLauncherWeekdayPicker';
import { ProgramLauncherWorkoutPreviewRow } from './ProgramLauncherWorkoutPreviewRow';
import { programLauncherStyles as styles } from './programLauncherStyles';

type ProgramLauncherDetailsModalProps = {
  visible: boolean;
  onClose: () => void;
  selectedProgram: Program | null;
  isPro: boolean;
  selectedWeekdays: ProgramDaySplitKey[];
  onToggleWeekday: (key: ProgramDaySplitKey) => void;
  sessionsRequired: number;
  weekdaySelectionReady: boolean;
  startBlockedByWeekdays: boolean;
  onStartProgram: () => void;
  onUpgradePress: () => void;
  bottomInset: number;
};

export function ProgramLauncherDetailsModal({
  visible,
  onClose,
  selectedProgram,
  isPro,
  selectedWeekdays,
  onToggleWeekday,
  sessionsRequired,
  weekdaySelectionReady,
  startBlockedByWeekdays,
  onStartProgram,
  onUpgradePress,
  bottomInset,
}: ProgramLauncherDetailsModalProps) {
  const [bodyChangesExpanded, setBodyChangesExpanded] = React.useState(false);

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
                    How this program can change your body
                  </Text>
                  <Text style={styles.bodyChangesLinkChevron}>
                    {bodyChangesExpanded ? 'Hide' : 'Show'}
                  </Text>
                </TouchableOpacity>
                {bodyChangesExpanded && (
                  <Text style={styles.bodyChangesText}>
                    {selectedProgram.bodyChangesSummary}
                  </Text>
                )}
              </View>
            )}

            <Text style={styles.sectionTitle}>Program Overview</Text>

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
            </View>

            {selectedProgram?.daysSplit && (
              <ProgramLauncherWeekdayPicker
                sessionsRequired={sessionsRequired}
                selectedWeekdays={selectedWeekdays}
                weekdaySelectionReady={weekdaySelectionReady}
                onToggleWeekday={onToggleWeekday}
              />
            )}

            <Text style={styles.sectionTitle}>Workouts</Text>
            {selectedProgram?.workouts.map((workout, index) => (
              <ProgramLauncherWorkoutPreviewRow key={index} workout={workout} />
            ))}
          </ScrollView>

          <View
            style={[
              styles.modalFooter,
              { paddingBottom: bottomInset + Spacing.xl },
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
                style={[
                  styles.startProgramButton,
                  startBlockedByWeekdays && styles.startProgramButtonDisabled,
                ]}
                onPress={onStartProgram}
                disabled={startBlockedByWeekdays}
              >
                <Text style={styles.startProgramButtonText}>Start Program</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
