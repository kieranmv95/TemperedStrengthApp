import { BottomSheet } from '@/src/components/ds';
import { exerciseVideoStyles as styles } from '@/src/components/exercise/exerciseVideoStyles';
import { getExerciseById } from '@/src/data/exercises';
import { getYoutubeEmbedHtml, YOUTUBE_EMBED_ORIGIN } from '@/src/utils/youtube';
import React, { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

type ExerciseVideoSheetProps = {
  exerciseId: number | null;
  onClose: () => void;
};

export function ExerciseVideoSheet({
  exerciseId,
  onClose,
}: ExerciseVideoSheetProps) {
  const visible = exerciseId !== null;
  // Keeps the last exercise on screen while the sheet animates closed.
  const [shownExerciseId, setShownExerciseId] = useState<number | null>(
    exerciseId
  );

  if (exerciseId !== null && exerciseId !== shownExerciseId) {
    setShownExerciseId(exerciseId);
  }

  const exercise = useMemo(() => {
    if (shownExerciseId === null) return undefined;
    return getExerciseById(shownExerciseId);
  }, [shownExerciseId]);

  const embedHtml =
    exercise?.youtube_id != null
      ? getYoutubeEmbedHtml(exercise.youtube_id)
      : null;

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={exercise?.name ?? 'Exercise video'}
    >
      {exercise && embedHtml ? (
        <>
          <View style={styles.videoContainer}>
            <WebView
              source={{
                html: embedHtml,
                baseUrl: YOUTUBE_EMBED_ORIGIN,
              }}
              style={styles.webView}
              allowsFullscreenVideo
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={false}
              javaScriptEnabled
              domStorageEnabled
              accessibilityLabel={`Video demonstration for ${exercise.name}`}
            />
          </View>

          {exercise.description ? (
            <Text style={styles.description}>{exercise.description}</Text>
          ) : null}
        </>
      ) : null}
    </BottomSheet>
  );
}
