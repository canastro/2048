import { PropsWithChildren, createContext, useState } from "react";

export interface GameOptions {
  nObstacles: number;
  size: number;
}

type GameStatus = "setup" | "playing" | "victory" | "defeat";

interface GameOptionsContextValue {
  options: GameOptions;
  status: GameStatus;
  startGame: (options: GameOptions) => void;
  resetGame: () => void;
}

const DEFAULT_OPTIONS: GameOptions = {
  nObstacles: 0,
  size: 6,
};

export const GameOptionsContext = createContext<GameOptionsContextValue>({
  options: DEFAULT_OPTIONS,
  status: "setup",
  startGame: () => {},
  resetGame: () => {},
});

export function GameOptionsProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<GameStatus>("setup");
  const [options, setOptions] = useState<GameOptions>(DEFAULT_OPTIONS);

  return (
    <GameOptionsContext.Provider
      value={{
        status,
        options,
        startGame: (options) => {
          setOptions(options);
          setStatus("playing");
        },
        resetGame: () => setStatus("setup"),
      }}
    >
      {children}
    </GameOptionsContext.Provider>
  );
}
