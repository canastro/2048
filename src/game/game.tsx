import { useContext } from "react";
import { Board } from "./components/board/board";
import { GameEngineProvider } from "./context/game-engine-context";
import { Setup } from "./components/setup/setup";
import {
  GameContext,
  GameProvider,
} from "./context/game-context";
import { Victory } from "./components/finish/victory";
import { Defeat } from "./components/finish/defeat";

function GameInner() {
  const { options, status, startGame, resetGame } =
    useContext(GameContext);

  switch (status) {
    case "setup":
      return <Setup options={options} onStart={startGame} />;
    case "playing":
      return (
        <GameEngineProvider options={options}>
          <Board onReset={resetGame} />
        </GameEngineProvider>
      );
    case "victory":
      return <Victory onReset={resetGame} />;
    default:
      return <Defeat onReset={resetGame} />;
  }
}

export function Game() {
  return (
    <GameProvider>
      <GameInner />
    </GameProvider>
  );
}
