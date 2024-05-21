import { TILE_SIZE, TILE_GAP } from "./constants";

/**
 * Converts a position to pixels along one axis.
 */
export const positionToPixels = (position: number) =>
  position * (TILE_SIZE + TILE_GAP);
