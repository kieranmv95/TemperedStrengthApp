import { exerciseVideoStyles as styles } from '@/src/components/exercise/exerciseVideoStyles';
import { Colors, Spacing } from '@/src/constants/theme';
import { getExerciseById } from '@/src/data/exercises';
import {
  getYoutubeEmbedHtml,
  YOUTUBE_EMBED_ORIGIN,
} from '@/src/utils/youtube';
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
import { WebView } from 'react-native-webview';

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

  const embedHtml =
    exercise?.youtube_id != null
      ? getYoutubeEmbedHtml(exercise.youtube_id)
      : null;

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
          {exercise && embedHtml ? (
            <>
              <View style={styles.sheetHeader}>
                <Text style={styles.title} numberOfLines={2}>
                  {exercise.name}
                </Text>
                <TouchableOpacity
                  style={styles.sheetCloseButton}
                  onPress={onClose}
                  accessibilityRole="button"
                  accessibilityLabel="Close"
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Ionicons name="close" size={28} color={Colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.sheetContent}
              >
                <View style={styles.sheetVideoContainer}>
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
                  <Text style={styles.description}>
                    {exercise.description}
                  </Text>
                ) : null}
              </ScrollView>
            </>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}
