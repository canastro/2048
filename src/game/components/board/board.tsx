import { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { Tile as ITile } from "../../models/tile";
import styles from "./board.module.css";
import Tile from "../tile/tile";
import { TILE_GAP, TILE_SIZE } from "../../utils/constants";
import { GameEngineContext } from "../../context/game-engine-context";
import { Direction } from "../../models/direction";
import { Button } from "../../../components/button/button";
import { Board as IBoard } from "../../models/board";
import { EmptyTile } from "./empty-tile/empty-tile";
import ObstacleTile from "./obstacle-tile/obstacle-tile";

interface BoardProps {
  onReset: () => void;
}

interface GridProps {
  board: IBoard;
}

/**
 * Render the board grid (empty and obstacles tiles).
 */
function Grid(props: GridProps) {
  const flatBoard = props.board.flat();

  return flatBoard.map((item, index) =>
    item.type === "obstacle" ? (
      <ObstacleTile key={index} />
    ) : (
      <EmptyTile key={index} />
    )
  );
}

/**
 * Render the tiles of the game.
 */
function Tiles() {
  const { getTiles } = useContext(GameEngineContext);
  const tiles = getTiles();

  return tiles.map((tile: ITile) => <Tile key={tile.id} tile={tile} />);
}

/**
 * Entry point of the actual game after the Setup screen.
 * Responsible to render the state of the game and react to user's input.
 */
export function Board(props: BoardProps) {
  const initialized = useRef(false);

  const { options, move, board, startGame } = useContext(GameEngineContext);

  useEffect(() => {
    if (initialized.current === false) {
      startGame();
      initialized.current = true;
    }
  }, [startGame]);

  /**
   * Calculate the size of the board in px based on the number of tiles
   * and their hardcoded size.
   */
  const boardSize = useMemo(() => {
    const tilesSize = options.size * TILE_SIZE;
    const gapSize = (options.size - 1) * TILE_GAP;
    return tilesSize + gapSize;
  }, [options.size]);

  /**
   * Handle the user's keyboard input to move the tiles.
   */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();

      switch (e.code) {
        case "ArrowUp":
          move(Direction.Up);
          break;
        case "ArrowDown":
          move(Direction.Down);
          break;
        case "ArrowLeft":
          move(Direction.Left);
          break;
        case "ArrowRight":
          move(Direction.Right);
          break;
      }
    },
    [move]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const boardStyle = {
    inlineSize: boardSize,
    blockSize: boardSize,
    "--grid-size": options.size,
    "--tile-size": `${TILE_SIZE}px`,
    "--tile-gap": `${TILE_GAP}px`,
  };

  return (
    <div className={styles.root}>
      <div className={styles.board} style={boardStyle}>
        <div className={styles.tiles}>
          <Tiles />
        </div>

        <div className={styles.grid}>
          <Grid board={board} />
        </div>
      </div>

      <Button type="button" onClick={props.onReset}>
        Reset
      </Button>
    </div>
  );
}
