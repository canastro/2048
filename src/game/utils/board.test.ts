import { it, expect, describe } from "vitest";
import { BoardItem } from "../models/board";
import { createNewBoard, createRanges } from "./board";

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

describe("createNewBoard", () => {
  it("should create a new board with the appropriate size and obstacles", () => {
    const result = createNewBoard({ nObstacles: 12, size: 4 });

    const flat = result.flat();
    const obstacles = flat.filter((item) => item.type === "obstacle");
    expect(flat.length).toBe(16);
    expect(obstacles.length).toBe(12);
  });
});
