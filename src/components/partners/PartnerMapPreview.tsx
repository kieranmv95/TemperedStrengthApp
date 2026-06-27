import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import {
  getOsmTileUrl,
  getOsmTilesForViewport,
  OSM_DEFAULT_ZOOM,
  OSM_TILE_SIZE,
  OSM_TILE_USER_AGENT,
} from '@/src/utils/openStreetMapTiles';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useMemo, useState } from 'react';
import {
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type PartnerMapPreviewProps = {
  latitude: number;
  longitude: number;
  onPress?: () => void;
  accessibilityLabel?: string;
};

const MAP_ASPECT_RATIO = 3;

export function PartnerMapPreview({
  latitude,
  longitude,
  onPress,
  accessibilityLabel = 'Open location on map',
}: PartnerMapPreviewProps) {
  const [layoutWidth, setLayoutWidth] = useState(0);
  const layoutHeight = layoutWidth > 0 ? layoutWidth / MAP_ASPECT_RATIO : 0;

  const tiles = useMemo(() => {
    if (layoutWidth === 0) {
      return [];
    }
    return getOsmTilesForViewport({
      latitude,
      longitude,
      zoom: OSM_DEFAULT_ZOOM,
      width: layoutWidth,
      height: layoutHeight,
    });
  }, [latitude, longitude, layoutHeight, layoutWidth]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const nextWidth = Math.round(event.nativeEvent.layout.width);
    if (nextWidth !== layoutWidth) {
      setLayoutWidth(nextWidth);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.85 : 1}
      accessibilityRole={onPress ? 'button' : 'image'}
      accessibilityLabel={accessibilityLabel}
      onLayout={handleLayout}
    >
      {layoutWidth > 0 ? (
        <View style={[styles.tileLayer, { width: layoutWidth, height: layoutHeight }]}>
          {tiles.map((tile) => (
            <Image
              key={`${tile.x}-${tile.y}`}
              source={{
                uri: getOsmTileUrl(OSM_DEFAULT_ZOOM, tile.x, tile.y),
                headers: {
                  'User-Agent': OSM_TILE_USER_AGENT,
                },
              }}
              style={{
                position: 'absolute',
                left: tile.left,
                top: tile.top,
                width: OSM_TILE_SIZE,
                height: OSM_TILE_SIZE,
              }}
              contentFit="fill"
              accessibilityIgnoresInvertColors
            />
          ))}
          <View style={styles.marker} pointerEvents="none">
            <Ionicons name="location" size={22} color={Colors.textBlack} />
          </View>
          <Text style={styles.attribution} pointerEvents="none">
            © OpenStreetMap
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: MAP_ASPECT_RATIO,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.backgroundElevated,
  },
  tileLayer: {
    overflow: 'hidden',
  },
  marker: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  attribution: {
    position: 'absolute',
    right: Spacing.sm,
    bottom: Spacing.xs,
    color: Colors.textPrimary,
    fontSize: FontSize.xxs,
    fontWeight: '600',
    backgroundColor: 'rgba(18, 18, 18, 0.72)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
});
