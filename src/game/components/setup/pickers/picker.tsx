import * as ToggleGroup from "@radix-ui/react-toggle-group";
import styles from "./picker.module.css";

interface PickerProps {
  options: { label: string; value: number }[];
  value: number;
  onChange: (value: number) => void;
}

/**
 * Allow the user to pick one from a list of options.
 */
export const Picker = (props: PickerProps) => {
  function handleChange(value: string) {
    props.onChange(parseInt(value, 10));
  }

  return (
    <ToggleGroup.Root
      className={styles.group}
      type="single"
      value={props.value.toString()}
      onValueChange={handleChange}
    >
      {props.options.map(({ label, value }) => (
        <ToggleGroup.Item
          key={value}
          className={styles.item}
          value={value.toString()}
        >
          {label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
};
