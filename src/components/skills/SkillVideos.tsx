import { BottomSheet, LoadingImage } from '@/src/components/ds';
import { YoutubeEmbed } from '@/src/components/exercise/YoutubeEmbed';
import { SkillPager } from '@/src/components/skills/SkillPager';
import {
  color,
  elevation,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import type { SkillVideo } from '@/src/types/skills';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  AccessibilityInfo,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

const PLAY_BUTTON_SIZE = 56;

function youtubeThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

type SkillVideoCardProps = {
  video: SkillVideo;
  width: number;
  onPress: () => void;
};

function SkillVideoCard({ video, width, onPress }: SkillVideoCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Play video: ${video.name}`}
      style={({ pressed }) => [
        styles.card,
        elevation.raised,
        { width },
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.clip}>
        <View style={styles.thumbnailWrap}>
          <LoadingImage
            source={{ uri: youtubeThumbnailUrl(video.id) }}
            style={styles.thumbnail}
          />
          <View style={styles.playOverlay} pointerEvents="none">
            <View style={styles.playButton}>
              <Ionicons name="play" size={26} color={color.onGold} />
            </View>
          </View>
        </View>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{video.name}</Text>
          {video.description ? (
            <Text style={styles.cardDescription} numberOfLines={3}>
              {video.description}
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

type SkillVideosProps = {
  videos: SkillVideo[];
};

export function SkillVideos({ videos }: SkillVideosProps) {
  const { width: windowWidth } = useWindowDimensions();
  const hasMultiple = videos.length > 1;
  const cardWidth = windowWidth * 0.75;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  // Keeps the last video on screen while the sheet animates closed.
  const [shownIndex, setShownIndex] = useState<number | null>(null);

  if (activeIndex != null && activeIndex !== shownIndex) {
    setShownIndex(activeIndex);
  }

  useEffect(() => {
    setActiveIndex(null);
  }, [videos]);

  if (videos.length === 0) {
    return null;
  }

  const activeVideo = activeIndex != null ? videos[activeIndex] : null;
  const shownVideo = shownIndex != null ? videos[shownIndex] : undefined;
  const canGoPrev = activeIndex != null && activeIndex > 0;
  const canGoNext = activeIndex != null && activeIndex < videos.length - 1;

  const closeViewer = () => {
    setActiveIndex(null);
  };

  const announceVideo = (nextIndex: number) => {
    AccessibilityInfo.announceForAccessibility(
      `Video ${nextIndex + 1} of ${videos.length}, ${videos[nextIndex].name}`
    );
  };

  const handlePrev = () => {
    if (!canGoPrev || activeIndex == null) {
      return;
    }
    announceVideo(activeIndex - 1);
    setActiveIndex((current) => (current == null ? current : current - 1));
  };

  const handleNext = () => {
    if (!canGoNext || activeIndex == null) {
      return;
    }
    announceVideo(activeIndex + 1);
    setActiveIndex((current) => (current == null ? current : current + 1));
  };

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollBleed}
        contentContainerStyle={styles.list}
      >
        {videos.map((video, index) => (
          <SkillVideoCard
            key={`skill-video-${index}`}
            video={video}
            width={cardWidth}
            onPress={() => setActiveIndex(index)}
          />
        ))}
      </ScrollView>

      <BottomSheet
        visible={activeVideo != null}
        onClose={closeViewer}
        title={shownVideo?.name ?? 'Video'}
        footer={
          hasMultiple && shownIndex != null ? (
            <SkillPager
              positionLabel={`Video ${shownIndex + 1} of ${videos.length}`}
              previousLabel="Previous video"
              nextLabel="Next video"
              canGoPrevious={canGoPrev}
              canGoNext={canGoNext}
              onPrevious={handlePrev}
              onNext={handleNext}
            />
          ) : null
        }
      >
        {shownVideo ? (
          <>
            <YoutubeEmbed
              youtubeId={shownVideo.id}
              accessibilityLabel={`Video: ${shownVideo.name}`}
            />
            {shownVideo.description ? (
              <Text style={styles.sheetDescription}>
                {shownVideo.description}
              </Text>
            ) : null}
          </>
        ) : null}
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  scrollBleed: {
    marginHorizontal: -space.md,
  },
  list: {
    gap: space.sm,
    paddingHorizontal: space.md,
  },
  card: {
    backgroundColor: color.surface1,
    borderRadius: radius.md,
  },
  clip: {
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  cardPressed: {
    backgroundColor: color.surface2,
  },
  thumbnailWrap: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: PLAY_BUTTON_SIZE,
    height: PLAY_BUTTON_SIZE,
    borderRadius: radius.pill,
    backgroundColor: color.gold,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: space.xxs,
  },
  cardText: {
    padding: space.md,
    gap: space.xxs,
  },
  cardTitle: {
    ...typography.headline,
    color: color.textPrimary,
  },
  cardDescription: {
    ...typography.callout,
    color: color.textSecondary,
  },
  sheetDescription: {
    ...typography.body,
    color: color.textSecondary,
  },
});
