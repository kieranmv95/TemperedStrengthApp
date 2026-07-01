import { partnerDiscoverMapStyles as styles } from '@/src/components/partners/partnerDiscoverMapStyles';
import type { UserCoords } from '@/src/services/discoverLocationService';
import type { PartnerKind } from '@/src/types/partner';
import {
  createPartnerMapClusterIndex,
  getClustersForRegion,
  getMapRegionForPoints,
  getZoomFromRegion,
  isClusterFeature,
  nextMarkerLabelVisibility,
  regionForCoordinateZoom,
  regionNeedsClusterUpdate,
  type PartnerMapClusterFeature,
  type PartnerMapPoint,
} from '@/src/utils/partnerMapClustering';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, UrlTile, type Region } from 'react-native-maps';

type PartnerDiscoverMapProps = {
  points: PartnerMapPoint[];
  userCoords?: UserCoords | null;
  onPressListing: (listingId: string, kind: PartnerKind) => void;
};

type PartnerMapMarkerProps = {
  identifier: string;
  coordinate: { latitude: number; longitude: number };
  isCluster: boolean;
  pointCount?: number;
  name?: string;
  showLabel: boolean;
  onPress: () => void;
};

const PartnerMapMarker = React.memo(function PartnerMapMarker({
  identifier,
  coordinate,
  isCluster,
  pointCount = 0,
  name = '',
  showLabel,
  onPress,
}: PartnerMapMarkerProps) {
  const handlePress = useCallback(
    (event: { stopPropagation?: () => void }) => {
      event.stopPropagation?.();
      onPress();
    },
    [onPress]
  );

  return (
    <Marker
      identifier={identifier}
      coordinate={coordinate}
      onPress={handlePress}
      tracksViewChanges={false}
      anchor={{ x: 0.5, y: isCluster ? 0.5 : 0 }}
    >
      <View style={styles.markerWrap} collapsable={false}>
        {isCluster ? (
          <View style={styles.clusterBubble}>
            <Text style={styles.clusterCount}>{pointCount}</Text>
          </View>
        ) : (
          <>
            <View style={styles.markerDot} />
            <Text
              style={[styles.markerLabel, !showLabel && styles.markerLabelHidden]}
              numberOfLines={2}
            >
              {name}
            </Text>
          </>
        )}
      </View>
    </Marker>
  );
});

export function PartnerDiscoverMap({
  points,
  userCoords = null,
  onPressListing,
}: PartnerDiscoverMapProps) {
  const mapRef = useRef<MapView>(null);
  const onPressListingRef = useRef(onPressListing);
  const clusterIndex = useMemo(() => createPartnerMapClusterIndex(points), [points]);
  const initialRegion = useMemo(() => {
    const fitPoints = userCoords != null ? [...points, userCoords] : points;
    return getMapRegionForPoints(fitPoints);
  }, [points, userCoords]);

  const [committedRegion, setCommittedRegion] = useState(initialRegion);
  const [showLabels, setShowLabels] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  onPressListingRef.current = onPressListing;

  useEffect(() => {
    setCommittedRegion(initialRegion);
    setShowLabels(false);
  }, [initialRegion]);

  const clusterZoom = getZoomFromRegion(committedRegion);

  const clusters = useMemo(
    () => getClustersForRegion(clusterIndex, committedRegion),
    [clusterIndex, committedRegion]
  );

  const commitRegion = useCallback((nextRegion: Region) => {
    setCommittedRegion((current) =>
      regionNeedsClusterUpdate(current, nextRegion) ? nextRegion : current
    );
    setShowLabels((current) => nextMarkerLabelVisibility(current, nextRegion));
  }, []);

  const handleRegionChangeComplete = useCallback(
    (nextRegion: Region) => {
      commitRegion(nextRegion);
    },
    [commitRegion]
  );

  const handleClusterPress = useCallback(
    (feature: PartnerMapClusterFeature) => {
      if (!isClusterFeature(feature)) {
        const { listingId, kind } = feature.properties;
        onPressListingRef.current(listingId, kind);
        return;
      }

      const [longitude, latitude] = feature.geometry.coordinates;
      const expansionZoom = clusterIndex.getClusterExpansionZoom(
        feature.properties.cluster_id
      );
      const nextRegion = regionForCoordinateZoom(
        latitude,
        longitude,
        expansionZoom
      );

      mapRef.current?.animateToRegion(nextRegion, 280);
    },
    [clusterIndex]
  );

  if (points.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>No locations on the map yet</Text>
        <Text style={styles.emptyDescription}>
          Approved listings with an address or map pin will appear here.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={initialRegion}
        onMapReady={() => {
          setIsMapReady(true);
          commitRegion(initialRegion);
        }}
        onRegionChangeComplete={handleRegionChangeComplete}
        moveOnMarkerPress={false}
        loadingEnabled
        showsUserLocation={userCoords != null}
        showsMyLocationButton={Platform.OS === 'android'}
        userInterfaceStyle="dark"
        mapType="standard"
      >
        {Platform.OS === 'android' ? (
          <UrlTile
            urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            maximumZ={19}
            flipY={false}
            zIndex={-1}
          />
        ) : null}

        {isMapReady
          ? clusters.map((feature) => {
              const [longitude, latitude] = feature.geometry.coordinates;
              const coordinate = { latitude, longitude };

              if (isClusterFeature(feature)) {
                const clusterId = feature.properties.cluster_id;
                const markerKey = `cluster-${clusterId}-z${clusterZoom}`;
                const identifier = markerKey;

                return (
                  <PartnerMapMarker
                    key={markerKey}
                    identifier={identifier}
                    coordinate={coordinate}
                    isCluster
                    pointCount={feature.properties.point_count}
                    showLabel={false}
                    onPress={() => handleClusterPress(feature)}
                  />
                );
              }

              const { listingId, kind, name } = feature.properties;
              const markerKey = `point-${kind}-${listingId}-z${clusterZoom}${
                showLabels ? '-labeled' : ''
              }`;
              const identifier = `point-${kind}-${listingId}`;

              return (
                <PartnerMapMarker
                  key={markerKey}
                  identifier={identifier}
                  coordinate={coordinate}
                  isCluster={false}
                  name={name}
                  showLabel={showLabels}
                  onPress={() => handleClusterPress(feature)}
                />
              );
            })
          : null}
      </MapView>
      <Text style={styles.attribution} pointerEvents="none">
        © OpenStreetMap
      </Text>
    </View>
  );
}
