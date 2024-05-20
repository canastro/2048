import styles from "./button.module.css";

export const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={styles.root} type="button" onClick={props.onClick}>
    {props.children}
  </button>
);
