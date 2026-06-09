import { exerciseVideoStyles as styles } from '@/src/components/exercise/exerciseVideoStyles';
import { YoutubeEmbed } from '@/src/components/exercise/YoutubeEmbed';
import { Colors, Spacing } from '@/src/constants/theme';
import { getExerciseById } from '@/src/data/exercises';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ExerciseVideoSheetProps = {
  exerciseId: number | null;
  onClose: () => void;
};

export function ExerciseVideoSheet({
  exerciseId,
  onClose,
}: ExerciseVideoSheetProps) {
  const insets = useSafeAreaInsets();
  const visible = exerciseId !== null;

  const exercise = useMemo(() => {
    if (exerciseId === null) return undefined;
    return getExerciseById(exerciseId);
  }, [exerciseId]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.sheetOverlay}>
        <Pressable
          style={styles.sheetBackdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close exercise video"
        />
        <View
          style={[
            styles.sheet,
            { paddingBottom: insets.bottom + Spacing.lg },
          ]}
        >
          <TouchableOpacity
            style={styles.sheetCloseButton}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="close" size={28} color={Colors.textPrimary} />
          </TouchableOpacity>

          {exercise?.youtube_id ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.sheetContent}
            >
              <View style={styles.textBlock}>
                <Text style={styles.title}>{exercise.name}</Text>
                {exercise.description ? (
                  <Text style={styles.description}>
                    {exercise.description}
                  </Text>
                ) : null}
              </View>

              <YoutubeEmbed
                youtubeId={exercise.youtube_id}
                accessibilityLabel={`Video demonstration for ${exercise.name}`}
              />
            </ScrollView>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}
