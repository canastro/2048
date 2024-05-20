import { useContext } from "react";
import { Board } from "./components/board/board";
import { GameEngineContext, GameEngineProvider } from "./engine/game-engine";
import { Setup } from "./components/setup/setup";

function GameInner() {
  const { status, startGame, resetGame } = useContext(GameEngineContext);

  return status === "setup" ? <Setup onStart={startGame} /> : <Board onReset={resetGame} />;
}

export function Game() {
  return (
    <GameEngineProvider>
      <GameInner />
    </GameEngineProvider>
  );
}
