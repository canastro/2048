import { useContext } from "react";
import { Board } from "./components/board/board";
import { GameEngineProvider } from "./engine/game-engine";
import { Setup } from "./components/setup/setup";
import { GameOptionsContext, GameOptionsProvider } from "./engine/game-options";

function GameInner() {
  const { options, status, startGame, resetGame } =
    useContext(GameOptionsContext);

  return status === "setup" ? (
    <Setup onStart={startGame} />
  ) : (
    <GameEngineProvider options={options}>
      <Board onReset={resetGame} />
    </GameEngineProvider>
  );
}

export function Game() {
  return (
    <GameOptionsProvider>
      <GameInner />
    </GameOptionsProvider>
  );
}
