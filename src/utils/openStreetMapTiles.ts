export const OSM_TILE_SIZE = 256;
export const OSM_DEFAULT_ZOOM = 15;

export const OSM_TILE_USER_AGENT =
  'TemperedStrengthApp/2.10.0 (https://temperedstrength.com; mobile)';

export type OsmTilePlacement = {
  x: number;
  y: number;
  left: number;
  top: number;
};

export function longitudeToPixelX(longitude: number, zoom: number): number {
  return ((longitude + 180) / 360) * 2 ** zoom * OSM_TILE_SIZE;
}

export function latitudeToPixelY(latitude: number, zoom: number): number {
  const latRad = (latitude * Math.PI) / 180;
  return (
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
    2 ** zoom *
    OSM_TILE_SIZE
  );
}

export function getOsmTileUrl(zoom: number, x: number, y: number): string {
  return `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
}

export function getOsmTilesForViewport(params: {
  latitude: number;
  longitude: number;
  zoom: number;
  width: number;
  height: number;
}): OsmTilePlacement[] {
  const { latitude, longitude, zoom, width, height } = params;
  const centerX = longitudeToPixelX(longitude, zoom);
  const centerY = latitudeToPixelY(latitude, zoom);
  const topLeftX = centerX - width / 2;
  const topLeftY = centerY - height / 2;

  const startTileX = Math.floor(topLeftX / OSM_TILE_SIZE);
  const startTileY = Math.floor(topLeftY / OSM_TILE_SIZE);
  const endTileX = Math.floor((topLeftX + width - 1) / OSM_TILE_SIZE);
  const endTileY = Math.floor((topLeftY + height - 1) / OSM_TILE_SIZE);

  const tiles: OsmTilePlacement[] = [];
  for (let x = startTileX; x <= endTileX; x++) {
    for (let y = startTileY; y <= endTileY; y++) {
      tiles.push({
        x,
        y,
        left: x * OSM_TILE_SIZE - topLeftX,
        top: y * OSM_TILE_SIZE - topLeftY,
      });
    }
  }
  return tiles;
}
