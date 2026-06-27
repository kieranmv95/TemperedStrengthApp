import {
  getOsmTileUrl,
  getOsmTilesForViewport,
  latitudeToPixelY,
  longitudeToPixelX,
  OSM_TILE_SIZE,
} from './openStreetMapTiles';

describe('openStreetMapTiles', () => {
  it('builds tile URLs', () => {
    expect(getOsmTileUrl(15, 16384, 10835)).toBe(
      'https://tile.openstreetmap.org/15/16384/10835.png'
    );
  });

  it('converts coordinates to consistent tile pixel positions', () => {
    const zoom = 15;
    const longitude = -0.1276;
    const latitude = 51.5074;

    const pixelX = longitudeToPixelX(longitude, zoom);
    const pixelY = latitudeToPixelY(latitude, zoom);

    expect(pixelX).toBeGreaterThan(0);
    expect(pixelY).toBeGreaterThan(0);
    expect(Math.floor(pixelX / OSM_TILE_SIZE)).toBe(16372);
    expect(Math.floor(pixelY / OSM_TILE_SIZE)).toBe(10896);
  });

  it('returns tiles that cover a viewport centered on coordinates', () => {
    const tiles = getOsmTilesForViewport({
      latitude: 51.5074,
      longitude: -0.1276,
      zoom: 15,
      width: 320,
      height: 140,
    });

    expect(tiles.length).toBeGreaterThan(0);
    expect(tiles.some((tile) => tile.x === 16372 && tile.y === 10896)).toBe(
      true
    );
    expect(
      tiles.every(
        (tile) =>
          tile.left >= -OSM_TILE_SIZE &&
          tile.top >= -OSM_TILE_SIZE &&
          tile.left <= 320 &&
          tile.top <= 140
      )
    ).toBe(true);
  });
});
