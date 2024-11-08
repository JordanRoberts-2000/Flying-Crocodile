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
  onLongPress: (e: React.MouseEvent | React.TouchEvent) => void,
  holdTime: number = 500
): UseLongPressReturn => {
  const longPressSuccess = useRef<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const start = (e: React.MouseEvent | React.TouchEvent) => {
    longPressSuccess.current = false;
    timerRef.current = setTimeout(() => {
      longPressSuccess.current = true;
      onLongPress(e); // Pass the event to the callback
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
    onMouseDown: (e: React.MouseEvent) => start(e),
    onMouseUp: end,
    onMouseLeave: end,
    onTouchStart: (e: React.TouchEvent) => start(e),
    onTouchEnd: end,
  };

  return {
    longPressHandlers,
    longPressSuccess,
  };
};

export default useLongPress;
