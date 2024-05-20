import { isSameCoordinate } from "../models/coordinate";
import { Direction } from "../models/direction";
import { Tile } from "../models/tile";
import { GameOptions } from "./game-options";

type Board = string[][];

type State = {
  hasChanged: boolean;
  options: GameOptions;
  board: Board;
  tiles: Record<string, Tile>;
};

type Action =
  | { type: "create_tile"; tile: Tile }
  | { type: "set_options"; options: GameOptions }
  | { type: "reset" }
  | { type: "move"; direction: Direction };

/**
 * Create an empty board of size state.options.size x state.options.size
 */
function createBoard(options: GameOptions) {
  return new Array(options.size)
    .fill(undefined)
    .map(() => new Array(options.size).fill(undefined));
}

export const createInitialGameState = (options: GameOptions): State => ({
  options,
  hasChanged: false,
  board: createBoard(options),
  tiles: {},
});

const clone = (board: Board) => JSON.parse(JSON.stringify(board));

const moveVertically = (
  state: State,
  direction: Direction.Up | Direction.Down
) => {
  const multiplier = direction === Direction.Up ? 1 : -1;

  const yRange =
    direction === Direction.Up
      ? [0, state.options.size]
      : [state.options.size - 1, -1];

  let hasChanged = false;
  const newBoard = createBoard(state.options);
  const newTiles: Record<string, Tile> = {};

  for (let x = 0; x < state.options.size; x++) {
    let newY = yRange[0];
    let previousTile: Tile | undefined;

    for (let y = yRange[0]; y !== yRange[1]; y += multiplier) {
      const tileId = state.board[y][x];
      const currentTile = state.tiles[tileId];

      // skip if there is no tile
      if (!currentTile) {
        continue;
      }

      // merge if the current tile has the same value as the previous tile
      if (currentTile && currentTile.value === previousTile?.value) {
        newTiles[previousTile.id] = {
          ...previousTile,
          value: previousTile.value * 2,
        };
        newTiles[tileId] = {
          ...currentTile,
          coordinate: { x, y: newY + multiplier * -1 },
        };
        previousTile = undefined;
        hasChanged = true;
        continue;
      }

      // move the tile to the top
      const newCoordinate = { x, y: newY };
      newBoard[newY][x] = tileId;
      newTiles[tileId] = { ...currentTile, coordinate: newCoordinate };
      previousTile = newTiles[tileId];

      if (!isSameCoordinate(currentTile.coordinate, newCoordinate)) {
        hasChanged = true;
      }

      newY += multiplier;
    }
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
  const multiplier = direction === Direction.Left ? 1 : -1;

  const xRange =
    direction === Direction.Left
      ? [0, state.options.size]
      : [state.options.size - 1, -1];

  let hasChanged = false;
  const newBoard = createBoard(state.options);
  const newTiles: Record<string, Tile> = {};

  for (let y = 0; y < state.options.size; y++) {
    let newX = xRange[0];
    let previousTile: Tile | undefined;

    for (let x = xRange[0]; x !== xRange[1]; x += multiplier) {
      const tileId = state.board[y][x];
      const currentTile = state.tiles[tileId];

      // skip if there is no tile
      if (!currentTile) {
        continue;
      }

      // merge if the current tile has the same value as the previous tile
      if (currentTile && currentTile.value === previousTile?.value) {
        newTiles[previousTile.id] = {
          ...previousTile,
          value: previousTile.value * 2,
        };
        newTiles[tileId] = {
          ...currentTile,
          coordinate: { y, x: newX + multiplier * -1 },
        };
        previousTile = undefined;
        hasChanged = true;
        continue;
      }

      // move the tile to the top
      const newCoordinate = { y, x: newX };
      newBoard[y][newX] = tileId;
      newTiles[tileId] = { ...currentTile, coordinate: newCoordinate };
      previousTile = newTiles[tileId];

      if (!isSameCoordinate(currentTile.coordinate, newCoordinate)) {
        hasChanged = true;
      }

      newX += multiplier;
    }
  }

  return {
    ...state,
    hasChanged,
    board: newBoard,
    tiles: newTiles,
  };
};

export default function gameStateReducer(state: State, action: Action) {
  switch (action.type) {
    case "reset":
      return createInitialGameState(state.options);

    case "create_tile": {
      const { id, coordinate } = action.tile;
      const newBoard = clone(state.board);
      newBoard[coordinate.y][coordinate.x] = id;

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

    case "set_options":
      return createInitialGameState(action.options);

    default:
      return state;
  }
}
