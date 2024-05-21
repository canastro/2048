export type BoardTileItem = { type: "tile"; id: string };
export type BoardObstacleItem = { type: "obstacle" };
export type BoardEmptyItem = { type: "empty" };

export type BoardItem = BoardTileItem | BoardObstacleItem | BoardEmptyItem;

export type Board = BoardItem[][];
