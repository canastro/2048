import { Button } from "../../../components/button/button";
import { Heading } from "../../../components/heading/heading";
import { Text } from "../../../components/text/text";

import styles from "./finish.module.css";

export function Defeat(props: { onReset: () => void }) {
  return (
    <div className={styles.root}>
      <header>
        <Heading as="h2" size="8">
          Defeat :(
        </Heading>
        <Text size="5">Better luck next time...</Text>
      </header>

      <Button type="button" onClick={props.onReset}>
        Try again
      </Button>
    </div>
  );
}
