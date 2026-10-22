import { ActionChip, PressableCard } from '@/src/components/ds';
import { exerciseVideoStyles as styles } from '@/src/components/exercise/exerciseVideoStyles';
import { color } from '@/src/constants/tokens';
import { getExerciseById } from '@/src/data/exercises';
import { useExerciseVideo } from '@/src/hooks/exercise-video-context';
import { exerciseHasVideo } from '@/src/utils/youtube';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

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
      <PressableCard
        onPress={() => openExerciseVideo(exerciseId)}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={HOW_TO_HINT}
        style={styles.playButtonBanner}
      >
        <View style={styles.playButtonRow}>
          <Ionicons name="play-circle" size={28} color={color.info} />
          <View style={styles.playButtonTextBlock}>
            <Text style={styles.playButtonLabel}>{HOW_TO_LABEL}</Text>
            <Text style={styles.playButtonSubLabel}>{HOW_TO_HINT}</Text>
          </View>
        </View>
      </PressableCard>
    );
  }

  return (
    <ActionChip
      label={HOW_TO_LABEL}
      icon="play-circle"
      tone="info"
      onPress={() => openExerciseVideo(exerciseId)}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={HOW_TO_HINT}
    />
  );
}
