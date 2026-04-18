import { Colors, Spacing } from '@/src/constants/theme';
import type { Program } from '@/src/types/program';
import type { ProgramDaySplitKey } from '@/src/utils/programStartWeekday';
import { getWorkoutForDaySinceStart } from '@/src/utils/programWeekPattern';
import { getAllWorkoutNotes } from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { copyWorkoutNotesModalStyles as styles } from './copyWorkoutNotesModalStyles';

type CopyWorkoutNotesModalProps = {
  visible: boolean;
  onClose: () => void;
  program: Program | null | undefined;
  startDate: string | null;
  workoutWeekPattern: ProgramDaySplitKey[] | null;
  selectedDayIndex: number | null;
  currentNotes: string;
  onApplyNotes: (text: string) => void;
};

type NoteSourceRow = {
  dayIndex: number;
  label: string;
  text: string;
  preview: string;
};

const PREVIEW_MAX = 72;

function resolveWorkoutLabel(
  program: Program,
  dayIndex: number,
  startISO: string | null,
  pattern: ProgramDaySplitKey[] | null
): string {
  const workout =
    startISO !== null
      ? getWorkoutForDaySinceStart(program, startISO, pattern, dayIndex)
      : program.workouts.find((w) => w.dayIndex === dayIndex) ?? null;
  // Day indices are 0-based internally; keep fallback user-facing.
  return workout?.label ?? `Day ${dayIndex + 1}`;
}

function buildPreview(text: string): string {
  const oneLine = text.replace(/\s+/g, ' ').trim();
  if (oneLine.length <= PREVIEW_MAX) {
    return oneLine;
  }
  return `${oneLine.slice(0, PREVIEW_MAX)}…`;
}

export function CopyWorkoutNotesModal({
  visible,
  onClose,
  program,
  startDate,
  workoutWeekPattern,
  selectedDayIndex,
  currentNotes,
  onApplyNotes,
}: CopyWorkoutNotesModalProps) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<NoteSourceRow[]>([]);

  const loadRows = useCallback(async () => {
    if (!program || selectedDayIndex === null) {
      setLoading(false);
      setRows([]);
      return;
    }
    setLoading(true);
    try {
      const all = await getAllWorkoutNotes();
      const next: NoteSourceRow[] = [];
      for (const [key, text] of Object.entries(all)) {
        const dayIndex = parseInt(key, 10);
        if (
          Number.isNaN(dayIndex) ||
          dayIndex === selectedDayIndex ||
          text.trim() === ''
        ) {
          continue;
        }
        next.push({
          dayIndex,
          label: resolveWorkoutLabel(
            program,
            dayIndex,
            startDate,
            workoutWeekPattern
          ),
          text,
          preview: buildPreview(text),
        });
      }
      next.sort((a, b) => a.dayIndex - b.dayIndex);
      setRows(next);
    } catch (e) {
      console.error('Error loading workout notes for copy modal:', e);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [program, selectedDayIndex, startDate, workoutWeekPattern]);

  useEffect(() => {
    if (visible) {
      void loadRows();
    }
  }, [visible, loadRows]);

  const applyText = useCallback(
    (text: string) => {
      onApplyNotes(text);
      onClose();
    },
    [onApplyNotes, onClose]
  );

  const handleCopyPress = useCallback(
    (text: string) => {
      if (currentNotes.trim().length > 0) {
        Alert.alert(
          'Replace notes?',
          'Your current notes for this workout will be overwritten.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Replace',
              style: 'destructive',
              onPress: () => applyText(text),
            },
          ]
        );
        return;
      }
      applyText(text);
    },
    [applyText, currentNotes]
  );

  const emptyMessage = useMemo(
    () =>
      'No notes saved on other workout days yet. Add notes on another day and they will appear here.',
    []
  );

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
            <Text style={styles.modalTitle}>Copy notes from another workout</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator color={Colors.accent} style={{ marginVertical: Spacing.xxl }} />
          ) : rows.length === 0 ? (
            <Text style={styles.emptyText}>{emptyMessage}</Text>
          ) : (
            <FlatList
              style={styles.list}
              data={rows}
              keyExtractor={(item) => String(item.dayIndex)}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <View style={styles.row}>
                  <View style={styles.rowTextBlock}>
                    <Text style={styles.rowTitle}>{item.label}</Text>
                    {item.preview.length > 0 ? (
                      <Text style={styles.rowPreview} numberOfLines={2}>
                        {item.preview}
                      </Text>
                    ) : null}
                  </View>
                  <TouchableOpacity
                    style={styles.copyHit}
                    onPress={() => handleCopyPress(item.text)}
                    accessibilityRole="button"
                    accessibilityLabel={`Copy notes from ${item.label}`}
                  >
                    <Ionicons
                      name="copy-outline"
                      size={24}
                      color={Colors.accent}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}
