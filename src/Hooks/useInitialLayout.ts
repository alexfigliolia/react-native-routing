import { useLayoutEffect } from "react";

export const useInitialLayout = (callback: () => void) => {
  useLayoutEffect(() => {
    callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
