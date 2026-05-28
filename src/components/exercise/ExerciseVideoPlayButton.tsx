import { exerciseCardStyles as cardStyles } from '@/src/components/exerciseCardStyles';
import { exerciseVideoStyles as styles } from '@/src/components/exercise/exerciseVideoStyles';
import { Colors } from '@/src/constants/theme';
import { getExerciseById } from '@/src/data/exercises';
import { useExerciseVideo } from '@/src/hooks/exercise-video-context';
import { exerciseHasVideo } from '@/src/utils/youtube';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const HOW_TO_LABEL = 'How to perform';
const HOW_TO_HINT = 'Watch movement demo';

type ExerciseVideoPlayButtonProps = {
  exerciseId: number;
  variant?: 'inline' | 'banner';
};

export function ExerciseVideoPlayButton({
  exerciseId,
  variant = 'inline',
}: ExerciseVideoPlayButtonProps) {
  const { openExerciseVideo } = useExerciseVideo();
  const exercise = getExerciseById(exerciseId);

  if (!exerciseHasVideo(exercise)) {
    return null;
  }

  const accessibilityLabel = `${HOW_TO_LABEL} for ${exercise?.name ?? 'exercise'}`;

  if (variant === 'banner') {
    return (
      <TouchableOpacity
        style={styles.playButtonBanner}
        onPress={() => openExerciseVideo(exerciseId)}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        activeOpacity={0.7}
      >
        <Ionicons name="play-circle" size={28} color={Colors.recommended} />
        <View style={styles.playButtonTextBlock}>
          <Text style={styles.playButtonLabel}>{HOW_TO_LABEL}</Text>
          <Text style={styles.playButtonSubLabel}>{HOW_TO_HINT}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[cardStyles.metaChip, cardStyles.metaChipRecommended]}
      onPress={() => openExerciseVideo(exerciseId)}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      activeOpacity={0.7}
    >
      <Ionicons name="play-circle" size={14} color={Colors.recommended} />
      <Text style={cardStyles.metaChipRecommendedText}>{HOW_TO_LABEL}</Text>
    </TouchableOpacity>
  );
}
