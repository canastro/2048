import { useEffect, useRef } from "react";

export default function usePrevious<K = unknown>(value: K) {
  const ref = useRef<K>();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}
