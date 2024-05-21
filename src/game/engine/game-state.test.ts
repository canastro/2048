import { it, expect, describe } from "vitest";
import { BoardItem } from "../models/board";
import { createRanges, move } from "./game-state";
import { Tile } from "../models/tile";

describe("createRanges", () => {
  it("should create a single range if all items are empty", () => {
    const board: BoardItem[] = [
      { type: "empty" },
      { type: "empty" },
      { type: "empty" },
      { type: "empty" },
      { type: "empty" },
    ];
    const ranges = createRanges(board);

    expect(ranges).toEqual([[0, 4]]);
  });

  it("should create multiple range around obstacles", () => {
    const board: BoardItem[] = [
      { type: "obstacle" },
      { type: "empty" },
      { type: "obstacle" },
      { type: "obstacle" },
      { type: "empty" },
      { type: "empty" },
    ];
    const ranges = createRanges(board);

    expect(ranges).toEqual([
      [1, 1],
      [4, 5],
    ]);
  });
});

describe("move", () => {
  it("should be able to move right with obstacles", () => {
    const tileId = "1";
    const tiles: Record<string, Tile> = {
      [tileId]: {
        id: tileId,
        coordinate: { x: 0, y: 0 },
        value: 2,
      },
    };

    const board: BoardItem[] = [
      { type: "tile", id: tileId },
      { type: "empty" },
      { type: "obstacle" },
      { type: "obstacle" },
      { type: "empty" },
      { type: "empty" },
    ];

    const result1 = move(tiles, board, { direction: "end", axis: "x" });
    expect(result1[0]).toBeTruthy();
    expect(result1[1]).toEqual({
      [tileId]: {
        id: tileId,
        coordinate: { x: 1, y: 0 },
        value: 2,
      },
    });
  });

  it("should be able to move left with obstacles", () => {
    const tileId = "1";
    const tiles: Record<string, Tile> = {
      [tileId]: {
        id: tileId,
        coordinate: { x: 5, y: 0 },
        value: 2,
      },
    };

    const board: BoardItem[] = [
      { type: "empty" },
      { type: "obstacle" },
      { type: "obstacle" },
      { type: "empty" },
      { type: "empty" },
      { type: "tile", id: tileId },
    ];

    const result1 = move(tiles, board, { direction: "start", axis: "x" });
    expect(result1[0]).toBeTruthy();
    expect(result1[1]).toEqual({
      [tileId]: {
        id: tileId,
        coordinate: { x: 3, y: 0 },
        value: 2,
      },
    });
  });

  it("should be able to merge tiles", () => {
    const tiles: Record<string, Tile> = {
      first: {
        id: "first",
        coordinate: { x: 4, y: 0 },
        value: 2,
      },
      second: {
        id: "second",
        coordinate: { x: 5, y: 0 },
        value: 2,
      },
    };

    const board: BoardItem[] = [
      { type: "empty" },
      { type: "obstacle" },
      { type: "empty" },
      { type: "empty" },
      { type: "tile", id: "first" },
      { type: "tile", id: "second" },
    ];

    const result1 = move(tiles, board, { direction: "start", axis: "x" });
    expect(result1[0]).toBeTruthy();
    expect(result1[1]).toEqual({
      first: {
        id: "first",
        coordinate: { x: 2, y: 0 },
        value: 4,
      },
      second: {
        id: "second",
        coordinate: { x: 2, y: 0 },
        value: 2,
      },
    });
  });
});
