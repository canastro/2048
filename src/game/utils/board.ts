import { GameOptions } from "../context/game-context";
import { Board, BoardItem } from "../models/board";
import { Coordinate } from "../models/coordinate";
import { Tile } from "../models/tile";

/**
 * Generate a random coordinate from the list of empty cells.
 */
export const generateRandomCoordinate = (emptyCells: Coordinate[]) => {
  if (emptyCells.length === 0) {
    throw new Error("No empty cells");
  }

  const cellIndex = Math.floor(Math.random() * emptyCells.length);

  return emptyCells[cellIndex];
};

/**
 * Given the board return the coordinates of all empty cells in a 
 * flat array.
 */
export const getEmptyCells = (board: Board, size: number) => {
  const results: Coordinate[] = [];

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      if (board[y][x].type === "empty") {
        results.push({ x, y });
      }
    }
  }
  return results;
};

/**
 * Given a row/column of the board, return multiple ranges of tiles
 * free of obstacles.
 * 
 * @example
 * Given the following row:
 *  [empty, empty, obstacle, empty, empty, empty, obstacle, empty, empty]
 * Its ranges would be:
 *  [[0, 1], [3, 5], [7, 8]]
 */
export const createRanges = (data: BoardItem[]) => {
  const ranges: [number, number][] = [];
  for (let i = 0; i < data.length; i++) {
    const currentItem = data[i];
    if (currentItem.type === "obstacle") {
      continue;
    }

    ranges.push([i, i]);

    for (let j = i + 1; j < data.length; j++) {
      i = j;
      if (data[j].type === "obstacle") {
        break;
      }

      ranges[ranges.length - 1][1] = j;
    }
  }
  return ranges;
};

/**
 * Create an empty board of size state.options.size x state.options.size
 * with the randomly placed obstacles.
 */
export function createNewBoard(options: GameOptions): Board {
  const board: Board = new Array(options.size)
    .fill(undefined)
    .map(() => new Array(options.size).fill({ type: "empty" }));

  for (let i = 0; i < options.nObstacles; i++) {
    const emptyCells = getEmptyCells(board, options.size);
    const coordinate = generateRandomCoordinate(emptyCells);
    board[coordinate.y][coordinate.x] = { type: "obstacle" };
  }

  return board;
}

/**
 * Clones the board.
 */
export const cloneBoard = (board: Board): Board =>
  JSON.parse(JSON.stringify(board));

/**
 * Generates a clean board keeping the existing obstacles.
 */
export const getCleanBoard = (board: Board): Board => {
  const newBoard = cloneBoard(board);
  return newBoard.map((row) =>
    row.map((item) => (item.type === "tile" ? { type: "empty" } : item))
  );
};

const isAvailable = (tiles: Record<string, Tile>, item: BoardItem) => {
  if (item.type === "empty") {
    return true;
  }

  if (item.type === "obstacle") {
    return false;
  }

  const tile = tiles[item.id];
  return tile.value === 1;
};

/**
 * Given the board and the tiles, return the available neighbours of the given
 * tile.
 * 
 * A neighbour is considered available if its either empty or has a tile with
 * the value of 1.
 */
export const getAvailableNeighbours = (
  board: Board,
  tiles: Record<string, Tile>,
  coordinate: Coordinate
) => {
  const neighbours: Coordinate[] = [];
  const { x, y } = coordinate;

  const left = x > 0 ? board[y][x - 1] : undefined;
  const right = x < board.length - 1 ? board[y][x + 1] : undefined;
  const top = y > 0 ? board[y - 1][x] : undefined;
  const bottom = y < board.length - 1 ? board[y + 1][x] : undefined;

  if (left && isAvailable(tiles, left)) {
    neighbours.push({ x: x - 1, y });
  }

  if (right && isAvailable(tiles, right)) {
    neighbours.push({ x: x + 1, y });
  }

  if (top && isAvailable(tiles, top)) {
    neighbours.push({ x, y: y - 1 });
  }

  if (bottom && isAvailable(tiles, bottom)) {
    neighbours.push({ x, y: y + 1 });
  }

  return neighbours;
};
