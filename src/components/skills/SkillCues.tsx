import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
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
  TouchableOpacity,
  useWindowDimensions,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Cue stills ship at 1080×1350. */
const CUE_ASPECT_RATIO = 1080 / 1350;

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
  const imageMaxWidth = windowWidth - Spacing.xxl * 2;
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
            accessibilityLabel={
              cue.title ? `Open cue: ${cue.title}` : `Open cue ${index + 1}`
            }
            style={[styles.tile, { width: tileWidth }]}
          >
            <Image
              source={cue.imagePath}
              style={styles.tileImage}
              resizeMode="cover"
              accessibilityIgnoresInvertColors
            />
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
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeViewer}
              accessibilityRole="button"
              accessibilityLabel="Close cue"
            >
              <Ionicons name="close" size={28} color={Colors.textPrimary} />
            </TouchableOpacity>
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
                renderItem={({ item }) => (
                  <View
                    style={[
                      styles.viewerPage,
                      { width: windowWidth, height: viewerAreaHeight },
                    ]}
                  >
                    <Image
                      source={item.imagePath}
                      style={{ width: fittedWidth, height: fittedHeight }}
                      resizeMode="contain"
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
              { paddingBottom: Math.max(insets.bottom, Spacing.xxl) },
            ]}
          >
            {activeCue?.title ? (
              <Text style={styles.viewerTitle}>{activeCue.title}</Text>
            ) : null}
            {activeCue?.description ? (
              <Text style={styles.viewerDescription}>
                {activeCue.description}
              </Text>
            ) : null}
            {cues.length > 1 ? (
              <Text style={styles.viewerProgress}>
                ({activeIndex + 1}/{cues.length})
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
    marginHorizontal: -Spacing.xxl,
  },
  list: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.xxl,
  },
  tile: {
    aspectRatio: CUE_ASPECT_RATIO,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.backgroundElevated,
  },
  tileImage: {
    width: '100%',
    height: '100%',
  },
  viewer: {
    flex: 1,
    backgroundColor: Colors.textBlack,
  },
  viewerHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.md,
  },
  closeButton: {
    padding: Spacing.sm,
  },
  viewerListWrap: {
    flex: 1,
  },
  viewerPage: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  viewerCaption: {
    paddingHorizontal: Spacing.xxl,
    gap: Spacing.sm,
  },
  viewerTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '700',
  },
  viewerDescription: {
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
    lineHeight: 22,
  },
  viewerProgress: {
    color: Colors.accent,
    fontSize: FontSize.md,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
});
