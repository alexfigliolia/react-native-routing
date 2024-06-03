import { useRef } from "react";

export const useController = <T>(controller: T) => {
  const ref = useRef(controller);
  return ref.current;
};
