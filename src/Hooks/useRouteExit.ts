import { useContext, useMemo } from "react";
import { RouteContext } from "Contexts";
import type { ITransitionCallback } from "Core";

export const useRouteExit = (callback: ITransitionCallback) => {
  const manager = useContext(RouteContext);
  const ID = useMemo(() => {
    manager.offExit(ID);
    return manager.onExit(callback);
  }, [manager, callback]);
  return () => manager.offExit(ID);
};
