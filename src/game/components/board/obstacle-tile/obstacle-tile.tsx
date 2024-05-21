import { Text } from "../../../../components/text/text";
import styles from "./obstacle-tile.module.css";

export default function ObstacleTile() {
  return (
    <div className={styles.tile}>
      <Text color="light" size="6" weight="bold">
        X
      </Text>
    </div>
  );
}
