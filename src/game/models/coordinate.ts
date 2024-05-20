export interface Coordinate {
  x: number;
  y: number;
}

export const isSameCoordinate = (a: Coordinate, b: Coordinate) => {
  return a.x === b.x && a.y === b.y;
};
