import { Skeleton } from '@/src/components/ds/Skeleton';
import { color } from '@/src/constants/tokens';
import { useMotion } from '@/src/hooks/useMotion';
import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  View,
  type ImageResizeMode,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

type LoadingImageProps = {
  source: ImageSourcePropType;
  /** Size, radius and layout of the image box. */
  style?: StyleProp<ViewStyle>;
  resizeMode?: ImageResizeMode;
  /** Omit for decorative images; they are hidden from assistive tech. */
  accessibilityLabel?: string;
};

/** Shows a skeleton until the image loads, then fades it in. */
export function LoadingImage({
  source,
  style,
  resizeMode = 'cover',
  accessibilityLabel,
}: LoadingImageProps) {
  const motionHelpers = useMotion();
  const [loaded, setLoaded] = useState(false);
  const opacity = useSharedValue(0);

  const imageStyle = useAnimatedStyle(() => ({ opacity: opacity.get() }));

  const handleLoad = () => {
    setLoaded(true);
    opacity.set(motionHelpers.fade(1, 'fast'));
  };

  return (
    <View
      style={[styles.box, style]}
      accessible={!!accessibilityLabel}
      accessibilityRole={accessibilityLabel ? 'image' : undefined}
      accessibilityLabel={accessibilityLabel}
      importantForAccessibility={
        accessibilityLabel ? 'auto' : 'no-hide-descendants'
      }
    >
      {!loaded ? (
        <Skeleton width="100%" height="100%" style={StyleSheet.absoluteFill} />
      ) : null}
      <Animated.View style={[StyleSheet.absoluteFill, imageStyle]}>
        <Image
          source={source}
          style={styles.image}
          resizeMode={resizeMode}
          onLoad={handleLoad}
          accessibilityIgnoresInvertColors
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    overflow: 'hidden',
    backgroundColor: color.surface2,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
