import { Badge, Collapsible, SectionHeader } from '@/src/components/ds';
import { YoutubeEmbed } from '@/src/components/exercise/YoutubeEmbed';
import { color } from '@/src/constants/tokens';
import type { Program } from '@/src/types/program';
import { modalSheetBottomPadding } from '@/src/utils/platform';
import { sessionsPerWeekFromProgram } from '@/src/utils/programWeekPattern';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
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

type DetailsStatProps = {
  value: string | number;
  label: string;
};

function DetailsStat({ value, label }: DetailsStatProps) {
  return (
    <View
      style={styles.statItem}
      accessible
      accessibilityLabel={`${label}, ${value}`}
    >
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

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

  const title = selectedProgram?.name || 'Program details';
  const weekCount = selectedProgram
    ? Math.ceil(
        (Math.max(...selectedProgram.workouts.map((w) => w.dayIndex)) + 1) / 7
      )
    : null;
  const needsUpgrade = !!selectedProgram?.isPro && !isPro;
  const primaryLabel = needsUpgrade
    ? 'Upgrade to Pro to start'
    : 'Select start date';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={styles.sheet}
          accessibilityViewIsModal
          onAccessibilityEscape={onClose}
        >
          <View style={styles.sheetHeader}>
            <View style={styles.sheetTitleRow}>
              <Text style={styles.sheetTitle} accessibilityRole="header">
                {title}
              </Text>
              {selectedProgram?.isPro ? (
                <Badge label="PRO" accessibilityLabel="Pro program" />
              ) : null}
            </View>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.closeButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Close ${title}`}
            >
              <Ionicons name="close" size={24} color={color.textPrimary} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.sheetScroll}
            contentContainerStyle={styles.sheetScrollContent}
          >
            <Text style={styles.programDescription}>
              {selectedProgram?.description}
            </Text>

            {selectedProgram?.bodyChangesSummary ? (
              <Collapsible
                title="What this program can do for you"
                expanded={bodyChangesExpanded}
                onToggle={() => setBodyChangesExpanded((v) => !v)}
                style={styles.bodyChangesCard}
              >
                <Text style={styles.bodyChangesText}>
                  {selectedProgram.bodyChangesSummary}
                </Text>
              </Collapsible>
            ) : null}

            <SectionHeader title="Program overview" />

            {selectedProgram?.videoId ? (
              <YoutubeEmbed
                youtubeId={selectedProgram.videoId}
                accessibilityLabel={`Program overview video for ${selectedProgram.name}`}
              />
            ) : null}

            <View style={styles.statsContainer}>
              <DetailsStat
                value={selectedProgram?.workouts.length ?? 0}
                label="Workouts"
              />
              {weekCount !== null ? (
                <DetailsStat
                  value={weekCount}
                  label={weekCount === 1 ? 'Week' : 'Weeks'}
                />
              ) : null}
              {selectedProgram?.averageSessionDuration ? (
                <DetailsStat
                  value={selectedProgram.averageSessionDuration}
                  label="Duration"
                />
              ) : null}
              {sessionsPerWeek ? (
                <DetailsStat
                  value={sessionsPerWeek}
                  label="Sessions per week"
                />
              ) : null}
            </View>
          </ScrollView>

          <View
            style={[
              styles.sheetFooter,
              { paddingBottom: modalSheetBottomPadding(bottomInset) },
            ]}
          >
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
              ]}
              onPress={needsUpgrade ? onUpgradePress : onStartProgram}
              accessibilityRole="button"
              accessibilityLabel={primaryLabel}
            >
              <Text style={styles.primaryButtonText}>{primaryLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
