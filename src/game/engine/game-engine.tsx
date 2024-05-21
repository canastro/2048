import { createContext, useCallback, useEffect, useReducer } from "react";
import { Tile } from "../models/tile";
import gameStateReducer, { createInitialGameState } from "./game-state";
import { Coordinate } from "../models/coordinate";
import { Direction } from "../models/direction";
import { GameOptions } from "./game-options";
import { generateRandomCoordinate, getEmptyCells } from "../utils/position";
import { Board } from "../models/board";

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

export function GameEngineProvider({
  children,
  options,
}: GameEngineProviderProps) {
  const [gameState, dispatch] = useReducer(
    gameStateReducer,
    createInitialGameState(options)
  );

  const getTiles = () => Object.values(gameState.tiles);

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

  const move = (direction: Direction) => {
    dispatch({ type: "move", direction });
  };

  const startGame = useCallback(() => {
    const emptyCells = getEmptyCells(gameState.board, gameState.options.size);
    appendRandomTile(emptyCells);
  }, [gameState.board, gameState.options.size, appendRandomTile]);

  /**
   * This effect is responsible to add a new tile after a game move that
   * has produced changes in the board.
   */
  useEffect(() => {
    if (gameState.hasChanged) {
      const emptyCells = getEmptyCells(gameState.board, gameState.options.size);
      appendRandomTile(emptyCells);
    }
  }, [
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
