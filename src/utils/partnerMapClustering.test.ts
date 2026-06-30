import {
  getMapRegionForPoints,
  getZoomFromRegion,
  nextMarkerLabelVisibility,
  regionShowsMarkerLabels,
} from '@/src/utils/partnerMapClustering';

describe('partnerMapClustering', () => {
  const samplePoint = {
    listingId: 'a',
    kind: 'club' as const,
    name: 'Club A',
    latitude: 53.48,
    longitude: -2.24,
  };

  it('fits a single point with neighbourhood zoom', () => {
    const region = getMapRegionForPoints([samplePoint]);
    expect(region.latitude).toBe(53.48);
    expect(region.longitude).toBe(-2.24);
    expect(region.latitudeDelta).toBeLessThanOrEqual(0.1);
  });

  it('shows labels only when zoomed in', () => {
    expect(
      regionShowsMarkerLabels({
        latitude: 53.48,
        longitude: -2.24,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      })
    ).toBe(true);

    expect(
      regionShowsMarkerLabels({
        latitude: 53.48,
        longitude: -2.24,
        latitudeDelta: 2,
        longitudeDelta: 2,
      })
    ).toBe(false);
  });

  it('uses hysteresis so labels do not flicker at the zoom threshold', () => {
    const zoomedIn = {
      latitude: 53.48,
      longitude: -2.24,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    const borderline = {
      latitude: 53.48,
      longitude: -2.24,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };

    expect(nextMarkerLabelVisibility(false, zoomedIn)).toBe(true);
    expect(nextMarkerLabelVisibility(true, borderline)).toBe(true);
    expect(nextMarkerLabelVisibility(true, {
      latitude: 53.48,
      longitude: -2.24,
      latitudeDelta: 1,
      longitudeDelta: 1,
    })).toBe(false);
  });

  it('derives a stable zoom level from region deltas', () => {
    const zoom = getZoomFromRegion({
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.5,
      longitudeDelta: 0.5,
    });

    expect(zoom).toBeGreaterThan(0);
  });
});
