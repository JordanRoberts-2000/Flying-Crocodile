import { useRef, useEffect } from "react";

type UseLongPressReturn = {
  longPressHandlers: {
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseUp: (e: React.MouseEvent) => void;
    onMouseLeave: (e: React.MouseEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
  };
  longPressSuccess: React.MutableRefObject<boolean>;
};

const useLongPress = (
  onLongPress: () => void,
  holdTime: number = 500
): UseLongPressReturn => {
  const longPressSuccess = useRef<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const start = () => {
    longPressSuccess.current = false;
    timerRef.current = setTimeout(() => {
      longPressSuccess.current = true;
      onLongPress();
    }, holdTime);
  };

  const end = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const longPressHandlers = {
    onMouseDown: start,
    onMouseUp: end,
    onMouseLeave: end,
    onTouchStart: start,
    onTouchEnd: end,
  };

  return {
    longPressHandlers,
    longPressSuccess,
  };
};

export default useLongPress;
