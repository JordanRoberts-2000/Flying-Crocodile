import { flushSync } from "react-dom";

function viewTransition(cb: () => void) {
  if (!document.startViewTransition) {
    cb();
    return;
  }
  document.startViewTransition(() => {
    flushSync(() => {
      cb();
    });
  });
}

export default viewTransition;
