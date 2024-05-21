import { useEffect, useState } from "react";

import { Text } from "../../../components/text/text";
import { Tile as ITile } from "../../models/tile";
import styles from "./tile.module.css";
import usePrevious from "../../hooks/use-previous";
import { MERGE_ANIMATION_DURATION } from "../../utils/constants";
import { positionToPixels } from "../../utils/position";

interface TileProps {
  tile: ITile;
}

export default function Tile(props: TileProps) {
  const [scale, setScale] = useState(1);
  const previousValue = usePrevious<number>(props.tile.value);
  const hasChanged = previousValue !== props.tile.value;

  useEffect(() => {
    if (hasChanged) {
      setScale(1.1);
      setTimeout(() => setScale(1), MERGE_ANIMATION_DURATION);
    }
  }, [hasChanged]);

  const style = {
    left: positionToPixels(props.tile.coordinate.x),
    top: positionToPixels(props.tile.coordinate.y),
    transform: `scale(${scale})`,
    zIndex: props.tile.value,
    "--color": `var(--color-${props.tile.value})`,
  };

  return (
    <div className={styles.tile} style={style}>
      <Text color="light" size="6" weight="bold">
        {props.tile.value}
      </Text>
    </div>
  );
}
