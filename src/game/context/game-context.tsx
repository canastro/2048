import { PropsWithChildren, createContext, useState } from "react";

export interface GameOptions {
  nObstacles: number;
  size: number;
}

type GameStatus = "setup" | "playing" | "victory" | "defeat";

interface GameContextValue {
  options: GameOptions;
  status: GameStatus;
  startGame: (options: GameOptions) => void;
  resetGame: () => void;
  finishGame: (state: 'victory' | 'defeat') => void;
}

const DEFAULT_OPTIONS: GameOptions = {
  nObstacles: 0,
  size: 6,
};

export const GameContext = createContext<GameContextValue>({
  options: DEFAULT_OPTIONS,
  status: "setup",
  startGame: () => {},
  resetGame: () => {},
  finishGame: () => {},
});

export function GameProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<GameStatus>("setup");
  const [options, setOptions] = useState<GameOptions>(DEFAULT_OPTIONS);

  return (
    <GameContext.Provider
      value={{
        status,
        options,
        startGame: (options) => {
          setOptions(options);
          setStatus("playing");
        },
        resetGame: () => setStatus("setup"),
        finishGame: (state) => setStatus(state),
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
