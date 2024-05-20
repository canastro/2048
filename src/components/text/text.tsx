import { PropsWithChildren } from "react";
import { clsx } from "clsx";

import styles from "./text.module.css";

interface Props {
  size?: "1" | "2" | "3" | "4" | "5" | "6";
  as?: "span" | "div" | "label" | "p";
  class?: string;
  weight?: "light" | "regular" | "medium" | "bold";
  style?: "normal" | "italic";
  color?: "default" | "muted" | "light";
}

export function Text(props: PropsWithChildren<Props>) {
  const { as: Component = "span", size = 3 } = props;

  return (
    <Component
      className={clsx(
        props.class,
        styles.text,
        size ? styles[`text-size-${size}`] : undefined,
        props.weight ? styles[`text-weight-${props.weight}`] : undefined,
        props.style ? styles[`text-style-${props.style}`] : undefined,
        props.color ? styles[`text-color-${props.color}`] : undefined
      )}
    >
      {props.children}
    </Component>
  );
}
