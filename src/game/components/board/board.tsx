import { useCallback, useContext, useEffect, useMemo } from "react";
import { Tile as ITile } from "../../models/tile";
import styles from "./board.module.css";
import Tile from "../tile/tile";
import { TILE_GAP, TILE_SIZE } from "../../constants";
import { GameEngineContext } from "../../engine/game-engine";
import { Direction } from "../../models/direction";
import { Button } from "../../../components/button/button";

interface BoardProps {
  onReset: () => void;
}

interface GridProps {
  size: number;
}

function Grid(props: GridProps) {
  const cells: JSX.Element[] = useMemo(() => {
    const totalCellsCount = props.size * props.size;
    console.log("totalCellsCount", props.size, totalCellsCount);

    return new Array(totalCellsCount)
      .fill(null)
      .map((_, index) => <div className={styles.cell} key={index} />);
  }, [props.size]);

  return cells;
}

function Tiles() {
  const { getTiles } = useContext(GameEngineContext);
  const tiles = getTiles();

  return tiles.map((tile: ITile) => <Tile key={tile.id} tile={tile} />);
}

export function Board(props: BoardProps) {
  const { options, move } = useContext(GameEngineContext);

  const boardSize = useMemo(() => {
    const tilesSize = options.size * TILE_SIZE;
    const gapSize = (options.size - 1) * TILE_GAP;
    return tilesSize + gapSize;
  }, [options.size]);

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
    "--size": options.size,
  };

  return (
    <div className={styles.root}>
      <div className={styles.board} style={boardStyle}>
        <div className={styles.tiles}>
          <Tiles />
        </div>

        <div className={styles.grid}>
          <Grid size={options.size} />
        </div>
      </div>

      <Button type="button" onClick={props.onReset}>
        Reset
      </Button>
    </div>
  );
}
