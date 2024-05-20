import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";
import { Tile } from "../models/tile";
import gameStateReducer, { createInitialGameState } from "./game-state";
import { Coordinate } from "../models/coordinate";
import { Direction } from "../models/direction";
import { GameOptions } from "./game-options";

type GameStatus = "setup" | "playing";

const DEFAULT_OPTIONS: GameOptions = {
  nObstacles: 0,
  size: 6,
};

interface GameEngineContextValue {
  options: GameOptions;
  status: GameStatus;
  hasChanged: boolean;
  resetGame: () => void;
  startGame: (options: GameOptions) => void;
  move: (direction: Direction) => void;
  getTiles: () => Tile[];
}

export const GameEngineContext = createContext<GameEngineContextValue>({
  options: DEFAULT_OPTIONS,
  status: "setup",
  hasChanged: false,
  resetGame: () => {},
  move: () => {},
  startGame: () => {},
  getTiles: () => [],
});

export function GameEngineProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<GameStatus>("setup");
  const [gameState, dispatch] = useReducer(
    gameStateReducer,
    createInitialGameState(DEFAULT_OPTIONS)
  );

  const getTiles = () => Object.values(gameState.tiles);

  const appendRandomTile = useCallback(() => {
    const getEmptyCells = () => {
      const results: Coordinate[] = [];

      for (let x = 0; x < gameState.options.size; x++) {
        for (let y = 0; y < gameState.options.size; y++) {
          if (!gameState.board[y][x]) {
            results.push({ x, y });
          }
        }
      }
      return results;
    };

    const generateRandomCoordinate = () => {
      const emptyCells = getEmptyCells();
      if (emptyCells.length === 0) {
        throw new Error("No empty cells");
      }

      const cellIndex = Math.floor(Math.random() * emptyCells.length);

      return emptyCells[cellIndex];
    };

    dispatch({
      type: "create_tile",
      tile: {
        id: self.crypto.randomUUID(),
        coordinate: generateRandomCoordinate(),
        value: 1,
      },
    });
  }, [gameState]);

  const startGame = (options: GameOptions) => {
    setStatus("playing");
    dispatch({ type: "set_options", options });
    appendRandomTile();
  };

  const resetGame = () => {
    setStatus("setup");
    dispatch({ type: "reset" });
  };

  const move = (direction: Direction) => {
    dispatch({ type: "move", direction });
  };

  /**
   * This effect is responsible to add a new tile after a game move that
   * has produced changes in the board.
   */
  useEffect(() => {
    if (gameState.hasChanged) {
      appendRandomTile();
    }
  }, [gameState.hasChanged]);

  return (
    <GameEngineContext.Provider
      value={{
        status,
        options: gameState.options,
        hasChanged: gameState.hasChanged,
        resetGame,
        startGame,
        move,
        getTiles,
      }}
    >
      {children}
    </GameEngineContext.Provider>
  );
}
