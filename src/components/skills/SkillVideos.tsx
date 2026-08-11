import { YoutubeEmbed } from '@/src/components/exercise/YoutubeEmbed';
import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import type { SkillVideo } from '@/src/types/skills';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SkillVideosProps = {
  videos: SkillVideo[];
};

function youtubeThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export function SkillVideos({ videos }: SkillVideosProps) {
  const { width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const hasMultiple = videos.length > 1;
  const cardWidth = windowWidth * 0.75;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    setActiveIndex(null);
  }, [videos]);

  if (videos.length === 0) {
    return null;
  }

  const activeVideo = activeIndex != null ? videos[activeIndex] : null;
  const canGoPrev = activeIndex != null && activeIndex > 0;
  const canGoNext =
    activeIndex != null && activeIndex < videos.length - 1;

  const closeViewer = () => {
    setActiveIndex(null);
  };

  const renderCard = (video: SkillVideo, index: number) => (
    <Pressable
      key={`skill-video-${index}`}
      onPress={() => setActiveIndex(index)}
      accessibilityRole="button"
      accessibilityLabel={`Play video: ${video.name}`}
      style={[styles.card, { width: cardWidth }]}
    >
      <View style={styles.thumbnailWrap}>
        <Image
          source={{ uri: youtubeThumbnailUrl(video.id) }}
          style={styles.thumbnail}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
        <View style={styles.playOverlay} pointerEvents="none">
          <View style={styles.playButton}>
            <Ionicons name="play" size={26} color={Colors.textOnAccent} />
          </View>
        </View>
      </View>
      <View style={styles.cardText}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {video.name}
        </Text>
        {video.description ? (
          <Text style={styles.cardDescription} numberOfLines={3}>
            {video.description}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollBleed}
        contentContainerStyle={styles.list}
      >
        {videos.map((video, index) => renderCard(video, index))}
      </ScrollView>

      <Modal
        visible={activeVideo != null}
        animationType="slide"
        transparent
        onRequestClose={closeViewer}
      >
        <View style={styles.sheetOverlay}>
          <Pressable
            style={styles.sheetBackdrop}
            onPress={closeViewer}
            accessibilityRole="button"
            accessibilityLabel="Close video"
          />
          <View
            style={[
              styles.sheet,
              { paddingBottom: Math.max(insets.bottom, Spacing.xxl) },
            ]}
          >
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeader}>
              <View style={styles.sheetHeaderText}>
                <Text style={styles.sheetEyebrow}>Video</Text>
                <Text style={styles.sheetTitle} numberOfLines={2}>
                  {activeVideo?.name ?? ''}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeViewer}
                accessibilityRole="button"
                accessibilityLabel="Close"
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Ionicons name="close" size={22} color={Colors.accent} />
              </TouchableOpacity>
            </View>

            {activeVideo ? (
              <View style={styles.sheetBody}>
                <View style={styles.sheetVideo}>
                  <YoutubeEmbed
                    youtubeId={activeVideo.id}
                    accessibilityLabel={`Video: ${activeVideo.name}`}
                  />
                </View>

                {activeVideo.description ? (
                  <Text style={styles.sheetDescription}>
                    {activeVideo.description}
                  </Text>
                ) : null}

                {hasMultiple && activeIndex != null ? (
                  <View style={styles.sheetNav}>
                    <TouchableOpacity
                      style={[
                        styles.navButton,
                        !canGoPrev && styles.navButtonDisabled,
                      ]}
                      onPress={() => {
                        if (!canGoPrev) {
                          return;
                        }
                        setActiveIndex((current) =>
                          current == null ? current : current - 1
                        );
                      }}
                      disabled={!canGoPrev}
                      accessibilityRole="button"
                      accessibilityLabel="Previous video"
                    >
                      <Ionicons
                        name="chevron-back"
                        size={20}
                        color={Colors.accent}
                      />
                    </TouchableOpacity>
                    <Text style={styles.sheetProgress}>
                      ({activeIndex + 1}/{videos.length})
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.navButton,
                        !canGoNext && styles.navButtonDisabled,
                      ]}
                      onPress={() => {
                        if (!canGoNext) {
                          return;
                        }
                        setActiveIndex((current) =>
                          current == null ? current : current + 1
                        );
                      }}
                      disabled={!canGoNext}
                      accessibilityRole="button"
                      accessibilityLabel="Next video"
                    >
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={Colors.accent}
                      />
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            ) : null}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  scrollBleed: {
    marginHorizontal: -Spacing.xxl,
  },
  list: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.xxl,
  },
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    borderColor: Colors.backgroundElevated,
    overflow: 'hidden',
  },
  thumbnailWrap: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: Colors.backgroundElevated,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 3,
  },
  cardText: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
  },
  cardTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  cardDescription: {
    color: Colors.textSecondary,
    fontSize: FontSize.xl,
    lineHeight: 22,
  },
  sheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay,
  },
  sheet: {
    backgroundColor: Colors.backgroundCard,
    borderTopLeftRadius: BorderRadius.pill,
    borderTopRightRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: Colors.accentWashOutline,
    borderBottomWidth: 0,
    maxHeight: '92%',
    overflow: 'hidden',
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.backgroundBorder,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    paddingHorizontal: Spacing.section,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundElevated,
  },
  sheetHeaderText: {
    flex: 1,
    gap: Spacing.xs,
    minWidth: 0,
  },
  sheetEyebrow: {
    color: Colors.accent,
    fontSize: FontSize.sm,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  sheetTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayMd,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.xxl,
    backgroundColor: Colors.accentWashFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetBody: {
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.section,
    gap: Spacing.xl,
  },
  sheetVideo: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.accentWashBorder,
  },
  sheetDescription: {
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
    lineHeight: 22,
  },
  sheetNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.xxl,
    backgroundColor: Colors.accentWashFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonDisabled: {
    opacity: 0.35,
  },
  sheetProgress: {
    color: Colors.accent,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
});
