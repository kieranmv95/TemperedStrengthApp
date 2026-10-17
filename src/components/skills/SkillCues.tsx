import { LoadingImage } from '@/src/components/ds';
import {
  color,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import type { SkillCue } from '@/src/types/skills';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Cue stills ship at 1080×1350. */
const CUE_ASPECT_RATIO = 1080 / 1350;

/** Cue stills are images of text, so they're read out from their title and description. */
function cueAccessibilityLabel(cue: SkillCue, index: number): string {
  return [cue.title ?? `Cue ${index + 1}`, cue.description]
    .filter((part): part is string => !!part)
    .join('. ');
}

type SkillCuesProps = {
  cues: SkillCue[];
};

export function SkillCues({ cues }: SkillCuesProps) {
  const { width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const tileWidth = windowWidth * 0.4;
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewerAreaHeight, setViewerAreaHeight] = useState(0);
  const viewerListRef = useRef<FlatList<SkillCue>>(null);

  useEffect(() => {
    if (viewerIndex == null) {
      return;
    }
    setActiveIndex(viewerIndex);
    const frame = requestAnimationFrame(() => {
      viewerListRef.current?.scrollToIndex({
        index: viewerIndex,
        animated: false,
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [viewerIndex]);

  const closeViewer = () => {
    setViewerIndex(null);
  };

  const handleViewerAreaLayout = (event: LayoutChangeEvent) => {
    setViewerAreaHeight(event.nativeEvent.layout.height);
  };

  const getItemLayout = useCallback(
    (_: ArrayLike<SkillCue> | null | undefined, index: number) => ({
      length: windowWidth,
      offset: windowWidth * index,
      index,
    }),
    [windowWidth]
  );

  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const nextIndex = Math.round(offsetX / windowWidth);
      const clamped = Math.max(0, Math.min(nextIndex, cues.length - 1));
      setActiveIndex(clamped);
    },
    [cues.length, windowWidth]
  );

  if (cues.length === 0) {
    return null;
  }

  const activeCue = cues[activeIndex];
  const imageMaxWidth = windowWidth - space.md * 2;
  const fittedWidth =
    viewerAreaHeight > 0
      ? Math.min(imageMaxWidth, viewerAreaHeight * CUE_ASPECT_RATIO)
      : imageMaxWidth;
  const fittedHeight = fittedWidth / CUE_ASPECT_RATIO;

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollBleed}
        contentContainerStyle={styles.list}
      >
        {cues.map((cue, index) => (
          <Pressable
            key={`${index}-${cue.title ?? 'cue'}`}
            onPress={() => setViewerIndex(index)}
            accessibilityRole="button"
            accessibilityLabel={cueAccessibilityLabel(cue, index)}
            accessibilityHint="Opens the cue fullscreen"
            style={({ pressed }) => [
              styles.tile,
              { width: tileWidth },
              pressed && styles.tilePressed,
            ]}
          >
            <LoadingImage source={cue.imagePath} style={styles.tileImage} />
          </Pressable>
        ))}
      </ScrollView>

      <Modal
        visible={viewerIndex != null}
        animationType="fade"
        presentationStyle="fullScreen"
        onRequestClose={closeViewer}
      >
        <View style={[styles.viewer, { paddingTop: insets.top }]}>
          <View style={styles.viewerHeader}>
            <Pressable
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.closeButtonPressed,
              ]}
              onPress={closeViewer}
              accessibilityRole="button"
              accessibilityLabel="Close cue"
            >
              <Ionicons name="close" size={24} color={color.textPrimary} />
            </Pressable>
          </View>

          <View style={styles.viewerListWrap} onLayout={handleViewerAreaLayout}>
            {viewerAreaHeight > 0 ? (
              <FlatList
                ref={viewerListRef}
                data={cues}
                keyExtractor={(_, index) => `cue-viewer-${index}`}
                horizontal
                pagingEnabled
                style={{ height: viewerAreaHeight }}
                showsHorizontalScrollIndicator={false}
                getItemLayout={getItemLayout}
                onMomentumScrollEnd={onMomentumScrollEnd}
                onScrollToIndexFailed={(info) => {
                  viewerListRef.current?.scrollToOffset({
                    offset: info.averageItemLength * info.index,
                    animated: false,
                  });
                }}
                renderItem={({ item, index }) => (
                  <View
                    style={[
                      styles.viewerPage,
                      { width: windowWidth, height: viewerAreaHeight },
                    ]}
                  >
                    <Image
                      source={item.imagePath}
                      style={[
                        styles.viewerImage,
                        { width: fittedWidth, height: fittedHeight },
                      ]}
                      resizeMode="contain"
                      accessible
                      accessibilityRole="image"
                      accessibilityLabel={cueAccessibilityLabel(item, index)}
                      accessibilityIgnoresInvertColors
                    />
                  </View>
                )}
              />
            ) : null}
          </View>

          <View
            style={[
              styles.viewerCaption,
              { paddingBottom: Math.max(insets.bottom, space.xl) },
            ]}
            accessibilityLiveRegion="polite"
          >
            {activeCue?.title ? (
              <Text style={styles.viewerTitle} accessibilityRole="header">
                {activeCue.title}
              </Text>
            ) : null}
            {activeCue?.description ? (
              <Text style={styles.viewerDescription}>
                {activeCue.description}
              </Text>
            ) : null}
            {cues.length > 1 ? (
              <Text style={styles.viewerProgress}>
                Cue {activeIndex + 1} of {cues.length}
              </Text>
            ) : null}
          </View>
        </View>
      </Modal>
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
  tile: {
    aspectRatio: CUE_ASPECT_RATIO,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: color.surface2,
  },
  tilePressed: {
    opacity: 0.85,
  },
  tileImage: {
    width: '100%',
    height: '100%',
  },
  viewer: {
    flex: 1,
    backgroundColor: color.bg,
  },
  viewerHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: space.md,
    paddingBottom: space.xs,
  },
  closeButton: {
    width: MIN_TARGET_SIZE,
    height: MIN_TARGET_SIZE,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.surface2,
  },
  closeButtonPressed: {
    backgroundColor: color.surface3,
  },
  viewerListWrap: {
    flex: 1,
  },
  viewerPage: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: space.md,
  },
  viewerImage: {
    borderRadius: radius.md,
  },
  viewerCaption: {
    paddingHorizontal: space.md,
    paddingTop: space.md,
    gap: space.xs,
  },
  viewerTitle: {
    ...typography.title2,
    color: color.textPrimary,
  },
  viewerDescription: {
    ...typography.body,
    color: color.textSecondary,
  },
  viewerProgress: {
    ...typography.captionStrong,
    fontVariant: ['tabular-nums'],
    color: color.textSecondary,
  },
});
