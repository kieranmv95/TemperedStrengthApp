import type { PartnerKind } from '@/src/types/partner';
import type { Region } from 'react-native-maps';
import Supercluster from 'supercluster';

export type PartnerMapPoint = {
  listingId: string;
  kind: PartnerKind;
  name: string;
  latitude: number;
  longitude: number;
};

export type PartnerMapClusterProperties = {
  cluster: true;
  cluster_id: number;
  point_count: number;
  point_count_abbreviated: string | number;
};

export type PartnerMapPointProperties = {
  cluster: false;
  listingId: string;
  kind: PartnerKind;
  name: string;
};

export type PartnerMapClusterFeature =
  | Supercluster.ClusterFeature<PartnerMapClusterProperties>
  | Supercluster.PointFeature<PartnerMapPointProperties>;

const UK_FALLBACK_REGION: Region = {
  latitude: 54.5,
  longitude: -2.5,
  latitudeDelta: 8,
  longitudeDelta: 8,
};

const CLUSTER_RADIUS = 56;
const CLUSTER_MAX_ZOOM = 17;
const LABEL_SHOW_ZOOM = 10;
const LABEL_HIDE_ZOOM = 8;

export function regionToBBox(region: Region): GeoJSON.BBox {
  const latHalf = region.latitudeDelta / 2;
  const lngHalf = region.longitudeDelta / 2;

  return [
    region.longitude - lngHalf,
    region.latitude - latHalf,
    region.longitude + lngHalf,
    region.latitude + latHalf,
  ];
}

export function getZoomFromRegion(region: Region): number {
  const zoom = Math.log2(360 / Math.max(region.longitudeDelta, 0.0001));
  return Math.max(0, Math.min(20, Math.floor(zoom)));
}

export function regionShowsMarkerLabels(region: Region): boolean {
  return getZoomFromRegion(region) >= LABEL_SHOW_ZOOM;
}

export function nextMarkerLabelVisibility(
  current: boolean,
  region: Region
): boolean {
  const zoom = getZoomFromRegion(region);
  if (!current && zoom >= LABEL_SHOW_ZOOM) {
    return true;
  }
  if (current && zoom <= LABEL_HIDE_ZOOM) {
    return false;
  }
  return current;
}

export function regionNeedsClusterUpdate(a: Region, b: Region): boolean {
  if (getZoomFromRegion(a) !== getZoomFromRegion(b)) {
    return true;
  }

  return !regionsAreSimilar(a, b);
}

export function regionsAreSimilar(a: Region, b: Region): boolean {
  const latThreshold = Math.max(a.latitudeDelta, b.latitudeDelta) * 0.02;
  const lngThreshold = Math.max(a.longitudeDelta, b.longitudeDelta) * 0.02;

  return (
    Math.abs(a.latitude - b.latitude) < latThreshold &&
    Math.abs(a.longitude - b.longitude) < lngThreshold &&
    Math.abs(a.latitudeDelta - b.latitudeDelta) < latThreshold &&
    Math.abs(a.longitudeDelta - b.longitudeDelta) < lngThreshold
  );
}

export function regionForCoordinateZoom(
  latitude: number,
  longitude: number,
  zoom: number
): Region {
  const delta = 360 / 2 ** Math.max(zoom, 1);
  return {
    latitude,
    longitude,
    latitudeDelta: Math.max(delta, 0.002),
    longitudeDelta: Math.max(delta, 0.002),
  };
}

export function getMapRegionForPoints(
  points: Array<{ latitude: number; longitude: number }>
): Region {
  if (points.length === 0) {
    return UK_FALLBACK_REGION;
  }

  if (points.length === 1) {
    const point = points[0];
    return {
      latitude: point.latitude,
      longitude: point.longitude,
      latitudeDelta: 0.08,
      longitudeDelta: 0.08,
    };
  }

  let minLat = points[0].latitude;
  let maxLat = points[0].latitude;
  let minLng = points[0].longitude;
  let maxLng = points[0].longitude;

  for (const point of points) {
    minLat = Math.min(minLat, point.latitude);
    maxLat = Math.max(maxLat, point.latitude);
    minLng = Math.min(minLng, point.longitude);
    maxLng = Math.max(maxLng, point.longitude);
  }

  const latitude = (minLat + maxLat) / 2;
  const longitude = (minLng + maxLng) / 2;
  const latitudeDelta = Math.max((maxLat - minLat) * 1.45, 0.08);
  const longitudeDelta = Math.max((maxLng - minLng) * 1.45, 0.08);

  return { latitude, longitude, latitudeDelta, longitudeDelta };
}

function toGeoJsonPoints(
  points: PartnerMapPoint[]
): Supercluster.PointFeature<PartnerMapPointProperties>[] {
  return points.map((point) => ({
    type: 'Feature',
    properties: {
      cluster: false,
      listingId: point.listingId,
      kind: point.kind,
      name: point.name,
    },
    geometry: {
      type: 'Point',
      coordinates: [point.longitude, point.latitude],
    },
  }));
}

export function createPartnerMapClusterIndex(
  points: PartnerMapPoint[]
): Supercluster<PartnerMapPointProperties, PartnerMapClusterProperties> {
  const index = new Supercluster<PartnerMapPointProperties, PartnerMapClusterProperties>({
    radius: CLUSTER_RADIUS,
    maxZoom: CLUSTER_MAX_ZOOM,
  });

  index.load(toGeoJsonPoints(points));
  return index;
}

export function getClustersForRegion(
  index: Supercluster<PartnerMapPointProperties, PartnerMapClusterProperties>,
  region: Region
): PartnerMapClusterFeature[] {
  const bbox = regionToBBox(region);
  const zoom = getZoomFromRegion(region);
  return index.getClusters(bbox, zoom) as PartnerMapClusterFeature[];
}

export function isClusterFeature(
  feature: PartnerMapClusterFeature
): feature is Supercluster.ClusterFeature<PartnerMapClusterProperties> {
  return feature.properties.cluster === true;
}
