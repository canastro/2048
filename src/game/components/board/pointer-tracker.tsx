import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export type SwipeInput = { deltaX: number; deltaY: number };

type PointerTrackerProps = PropsWithChildren<{
  onSwipe: (_: SwipeInput) => void;
}>;

export default function PointerTracker({
  children,
  onSwipe,
}: PointerTrackerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  const end = useCallback(
    (x: number, y: number) => {
      const deltaX = x - startPosition.x;
      const deltaY = y - startPosition.y;

      onSwipe({ deltaX, deltaY });

      setStartPosition({ x: 0, y: 0 });
    },
    [startPosition, onSwipe]
  );

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!wrapperRef.current?.contains(e.target as Node)) {
      return;
    }

    e.preventDefault();
    setStartPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        return;
      }

      e.preventDefault();
      end(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    },
    [end]
  );

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!wrapperRef.current?.contains(e.target as Node)) {
      return;
    }

    e.preventDefault();
    setStartPosition({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        return;
      }

      e.preventDefault();
      end(e.clientX, e.clientY);
    },
    [end]
  );

  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDown, { passive: false });
    window.addEventListener("mouseup", handleMouseUp, { passive: false });

    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);

      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd, handleMouseDown, handleMouseUp]);

  return <div ref={wrapperRef}>{children}</div>;
}
