import { Picker } from "./pickers/picker";
import { Text } from "../../../components/text/text";
import { Button } from "../../../components/button/button";
import styles from "./setup.module.css";
import { useState } from "react";
import { MAX_NUMBER_OBSTACLES } from "../../utils/constants";
import { GameOptions } from "../../context/game-context";

const OBSTACLES = new Array(MAX_NUMBER_OBSTACLES).fill(null).map((_, i) => ({
  label: (i + 1).toString(),
  value: i + 1,
}));

const GRID_SIZES = [
  { label: "4 x 4", value: 4 },
  { label: "6 x 6", value: 6 },
  { label: "8 x 8", value: 8 },
];

interface SetupProps {
  options: GameOptions;
  onStart: (options: GameOptions) => void;
}

export function Setup(props: SetupProps) {
  const [nObstacles, setNObstacles] = useState<number>(props.options.nObstacles);
  const [size, setSize] = useState<number>(props.options.size);

  return (
    <div className={styles.root}>
      <div className={styles.picker}>
        <Text size="4" weight="bold">
          Grid Size
        </Text>
        <Picker
          options={GRID_SIZES}
          value={size}
          onChange={(value: number) => {
            if (!value) return;
            setSize(value);
          }}
        />
      </div>

      <div className={styles.picker}>
        <Text size="4" weight="bold">
          Obstacles
        </Text>
        <Picker
          options={OBSTACLES}
          value={nObstacles}
          onChange={setNObstacles}
        />
      </div>

      <Button type="button" onClick={() => props.onStart({ nObstacles, size })}>
        Start
      </Button>
    </div>
  );
}
