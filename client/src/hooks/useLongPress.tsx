import { useRef, useEffect } from "react";

type UseLongPressReturn = {
  registerMouseDown: () => void;
  registerMouseUp: () => void;
  isLongPress: React.MutableRefObject<boolean>;
};

const useLongPress = (
  onLongPress: () => void,
  holdTime: number = 500
): UseLongPressReturn => {
  const isLongPress = useRef<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const registerMouseDown = () => {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      onLongPress();
    }, holdTime);
  };

  const registerMouseUp = () => {
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

  return { registerMouseDown, registerMouseUp, isLongPress };
};

export default useLongPress;
