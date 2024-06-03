import { useContext, useMemo } from "react";
import { RouteContext } from "Contexts";
import type { ITransitionCallback } from "Core";

export const useRouteEntrance = (callback: ITransitionCallback) => {
  const manager = useContext(RouteContext);
  const ID = useMemo(() => {
    manager.offEnter(ID);
    return manager.onEnter(callback);
  }, [manager, callback]);
  return () => manager.offEnter(ID);
};
