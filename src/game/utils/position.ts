import { Board } from "../models/board";
import { Coordinate } from "../models/coordinate";
import { TILE_SIZE, TILE_GAP } from "./constants";

export const positionToPixels = (position: number) =>
  position * (TILE_SIZE + TILE_GAP);

export const generateRandomCoordinate = (emptyCells: Coordinate[]) => {
  if (emptyCells.length === 0) {
    throw new Error("No empty cells");
  }

  const cellIndex = Math.floor(Math.random() * emptyCells.length);

  return emptyCells[cellIndex];
};

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
