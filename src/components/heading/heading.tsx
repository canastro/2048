import { PropsWithChildren } from "react";
import { clsx } from "clsx";

import styles from "./heading.module.css";

interface Props {
  size?: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
  as?: "h1" | "h2" | "h3";
  class?: string;
  weight?: "light" | "regular" | "medium" | "bold";
}

export function Heading(props: PropsWithChildren<Props>) {
  const { as: Component = "span", size = 3 } = props;

  return (
    <Component
      className={clsx(
        props.class,
        styles.heading,
        size ? styles[`heading-size-${size}`] : undefined,
        props.weight ? styles[`heading-weight-${props.weight}`] : undefined,
      )}
    >
      {props.children}
    </Component>
  );
}
