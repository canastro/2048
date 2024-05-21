import { Button } from "../../../components/button/button";
import { Heading } from "../../../components/heading/heading";
import styles from "./finish.module.css";

export function Victory(props: { onReset: () => void }) {
  return (
    <div className={styles.root}>
      <Heading as="h2" size="8">
        You won!
      </Heading>
      <Button type="button" onClick={props.onReset}>
        Try again
      </Button>
    </div>
  );
}
