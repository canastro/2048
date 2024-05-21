import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { Tile } from "../models/tile";
import gameEngineStateReducer, { createInitialGameState } from "./game-engine-state";
import { Coordinate } from "../models/coordinate";
import { Direction } from "../models/direction";
import { GameOptions, GameContext } from "./game-context";
import {
  generateRandomCoordinate,
  getAvailableNeighbours,
  getEmptyCells,
} from "../utils/board";
import { Board } from "../models/board";
import { throttle } from "lodash-es";
import { MAX_RESULT, MERGE_ANIMATION_DURATION } from "../utils/constants";

const DEFAULT_OPTIONS: GameOptions = {
  nObstacles: 0,
  size: 6,
};

interface GameEngineContextValue {
  options: GameOptions;
  board: Board;
  hasChanged: boolean;
  move: (direction: Direction) => void;
  getTiles: () => Tile[];
  startGame: () => void;
}

export const GameEngineContext = createContext<GameEngineContextValue>({
  options: DEFAULT_OPTIONS,
  hasChanged: false,
  board: [],
  move: () => {},
  getTiles: () => [],
  startGame: () => {},
});

interface GameEngineProviderProps {
  children: React.ReactNode;
  options: GameOptions;
}

/**
 * The provider for the game engine context.
 * 
 * It is responsible to serve as a bridge between the game and the game state. It 
 * exposes the game state and the actions to manipulate it.
 */
export function GameEngineProvider({
  children,
  options,
}: GameEngineProviderProps) {
  const { finishGame } = useContext(GameContext);
  const [gameState, dispatch] = useReducer(gameEngineStateReducer, undefined, () =>
    createInitialGameState(options)
  );

  /**
   * Return all tiles in the game as a flat array.
   */
  const getTiles = () => Object.values(gameState.tiles);

  /**
   * Create a new tile in a random empty cell.
   */
  const appendRandomTile = useCallback((emptyCells: Coordinate[]) => {
    dispatch({
      type: "create_tile",
      tile: {
        id: self.crypto.randomUUID(),
        coordinate: generateRandomCoordinate(emptyCells),
        value: 1,
      },
    });
  }, []);

  /**
   * Move the tiles in the board in the given direction.
   * 
   * Throttled to avoid multiple moves in a short period of time and allow the 
   * animations to finish.
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const move = useCallback(
    throttle(
      (direction: Direction) => dispatch({ type: "move", direction }),
      MERGE_ANIMATION_DURATION * 1.05,
      { trailing: false }
    ),
    [dispatch]
  );

  /**
   * Start the game by appending a single random tile to the board.
   */
  const startGame = useCallback(() => {
    const emptyCells = getEmptyCells(gameState.board, gameState.options.size);
    appendRandomTile(emptyCells);
  }, [gameState.board, gameState.options.size, appendRandomTile]);

  /**
   * This effect is responsible to check the game state and either
   * finish the game with a victory or defeat or append a new tile
   */
  useEffect(() => {
    if (!gameState.hasChanged) {
      return;
    }

    const maxValue = Math.max(
      ...Object.values(gameState.tiles).map((tile) => tile.value)
    );
    if (maxValue >= MAX_RESULT) {
      finishGame("victory");
      return;
    }

    const emptyCells = getEmptyCells(gameState.board, gameState.options.size);
    if (emptyCells.length === 1) {
      const emptyCell = emptyCells[0];
      const availableNeighbours = getAvailableNeighbours(
        gameState.board,
        gameState.tiles,
        emptyCell
      );

      if (availableNeighbours.length === 0) {
        finishGame("defeat");
        return;
      }
    }

    appendRandomTile(emptyCells);
  }, [
    finishGame,
    gameState.tiles,
    gameState.hasChanged,
    gameState.board,
    gameState.options,
    appendRandomTile,
  ]);

  return (
    <GameEngineContext.Provider
      value={{
        board: gameState.board,
        options: gameState.options,
        hasChanged: gameState.hasChanged,
        move,
        getTiles,
        startGame,
      }}
    >
      {children}
    </GameEngineContext.Provider>
  );
}
