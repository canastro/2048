import { Board, BoardItem } from "../models/board";
import { isSameCoordinate } from "../models/coordinate";
import { Direction } from "../models/direction";
import { Tile } from "../models/tile";
import {
  cloneBoard,
  createNewBoard,
  createRanges,
  getCleanBoard,
} from "../utils/board";
import { GameOptions } from "./game-context";

type State = {
  hasChanged: boolean;
  options: GameOptions;
  board: Board;
  tiles: Record<string, Tile>;
};

type Action =
  | { type: "create_tile"; tile: Tile }
  | { type: "move"; direction: Direction };

export const createInitialGameState = (options: GameOptions): State => ({
  options,
  hasChanged: false,
  board: createNewBoard(options),
  tiles: {},
});

/**
 * Core function for the movement of tiles in 2048.
 *
 * @param tiles The current tiles on the board.
 * @param data - subset of the board where the tiles can move freely.
 * @param options - The options for the movement.
 * @param options.offset - The offset of the data in the current col/row of the board
 * @param options.direction - The direction of the movement.
 * @param options.axis - The axis of the movement.
 * @returns A tuple with a boolean indicating if the board has changed and the new tiles.
 */
const moveTileWithinRange = (
  tiles: Record<string, Tile>,
  data: BoardItem[],
  options: { offset: number; direction: "start" | "end"; axis: "x" | "y" }
) => {
  // Transform the array to implement the logic to always move to the start,
  let hasChanged = false;
  const items = options.direction === "start" ? data : data.slice().reverse();
  const increment = options.direction === "start" ? 1 : -1;
  const offset = options.offset;

  let currentOpenPosition = options.direction === "start" ? 0 : data.length - 1;
  let previousTile: Tile | undefined;
  const updatedTiles: Record<string, Tile> = {};

  items.forEach((boardItem) => {
    if (boardItem.type !== "tile") return;
    const tileId = boardItem.id;
    const currentTile = tiles[tileId];
    if (!currentTile) return;

    // merge if the current tile has the same value as the previous tile
    if (currentTile && currentTile.value === previousTile?.value) {
      updatedTiles[previousTile.id] = {
        ...previousTile,
        value: previousTile.value * 2,
      };
      updatedTiles[tileId] = {
        ...currentTile,
        coordinate: {
          ...currentTile.coordinate,
          [options.axis]: offset + currentOpenPosition + increment * -1,
        },
      };
      previousTile = undefined;
      hasChanged = true;
      return;
    }

    // move tile to the top
    const newCoordinate = {
      ...currentTile.coordinate,
      [options.axis]: offset + currentOpenPosition,
    };
    updatedTiles[tileId] = { ...currentTile, coordinate: newCoordinate };

    if (!isSameCoordinate(currentTile.coordinate, newCoordinate)) {
      hasChanged = true;
    }

    // update aux data for next iteration
    previousTile = updatedTiles[tileId];
    currentOpenPosition += increment;
  });

  return [hasChanged, updatedTiles] as const;
};

/**
 * Given a single row/column of the board, produce the tiles changes
 * for the current movement.
 */
export const move = (
  tiles: Record<string, Tile>,
  data: BoardItem[],
  options: { direction: "start" | "end"; axis: "x" | "y" }
) => {
  const ranges = createRanges(data);
  let newTiles: Record<string, Tile> = {};
  let hasChanged = false;
  ranges.forEach(([start, end]) => {
    const [changed, updatedTiles] = moveTileWithinRange(
      tiles,
      data.slice(start, end + 1),
      { ...options, offset: start }
    );
    hasChanged = hasChanged || changed;
    newTiles = { ...newTiles, ...updatedTiles };
  });

  return [hasChanged, newTiles] as const;
};

/**
 * Updates the board with the new tiles.
 */
export const updateBoard = (
  board: Board,
  previousTiles: Record<string, Tile>,
  tiles: Record<string, Tile>
) => {
  const newBoard = cloneBoard(board);
  Object.values(tiles).forEach((tile) => {
    const currentBoardItem = newBoard[tile.coordinate.y][tile.coordinate.x];
    const currentTile =
      currentBoardItem.type === "tile" ? previousTiles[tile.id] : undefined;

    if (!currentTile || tile.value > currentTile.value) {
      newBoard[tile.coordinate.y][tile.coordinate.x] = {
        type: "tile",
        id: tile.id,
      };
    }
  });

  return newBoard;
};

const moveVertically = (
  state: State,
  direction: Direction.Up | Direction.Down
) => {
  let hasChanged = false;
  let newBoard = getCleanBoard(state.board);
  let newTiles: Record<string, Tile> = {};

  for (let x = 0; x < state.options.size; x++) {
    const [changes, updatedTiles] = move(
      state.tiles,
      state.board.map((rows) => rows[x]),
      { direction: direction === Direction.Up ? "start" : "end", axis: "y" }
    );

    hasChanged = hasChanged || changes;
    newTiles = { ...newTiles, ...updatedTiles };
    newBoard = updateBoard(newBoard, state.tiles, updatedTiles);
  }

  return {
    ...state,
    hasChanged,
    board: newBoard,
    tiles: newTiles,
  };
};

const moveHorizontally = (
  state: State,
  direction: Direction.Left | Direction.Right
) => {
  let hasChanged = false;
  let newBoard = getCleanBoard(state.board);
  let newTiles: Record<string, Tile> = {};

  for (let y = 0; y < state.options.size; y++) {
    const [changes, updatedTiles] = move(state.tiles, state.board[y], {
      direction: direction === Direction.Left ? "start" : "end",
      axis: "x",
    });

    hasChanged = hasChanged || changes;
    newTiles = { ...newTiles, ...updatedTiles };
    newBoard = updateBoard(newBoard, state.tiles, updatedTiles);
  }

  return {
    ...state,
    hasChanged,
    board: newBoard,
    tiles: newTiles,
  };
};

export default function gameEngineStateReducer(state: State, action: Action) {
  switch (action.type) {
    case "create_tile": {
      const { id, coordinate } = action.tile;
      const newBoard = cloneBoard(state.board);
      newBoard[coordinate.y][coordinate.x] = { type: "tile", id };

      return {
        ...state,
        hasChanged: false,
        board: newBoard,
        tiles: {
          ...state.tiles,
          [id]: action.tile,
        },
      };
    }

    case "move": {
      switch (action.direction) {
        case Direction.Up:
        case Direction.Down:
          return moveVertically(state, action.direction);
        case Direction.Left:
        case Direction.Right:
          return moveHorizontally(state, action.direction);
        default:
          return state;
      }
    }

    default:
      return state;
  }
}
