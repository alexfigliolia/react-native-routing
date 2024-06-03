import { memo, useContext, useMemo } from "react";
import { RouterContext, RoutesContext } from "Contexts";
import { useInitialLayout } from "Hooks";
import type { ITransitionName } from "Transitions";
import type { OptionalChildren } from "Types/React";

export const Routes = memo(function Routes({
  onMatch,
  children,
  transition,
}: Props) {
  const router = useContext(RouterContext);
  const parentTransition = useContext(RoutesContext);
  const ID = useMemo(() => router.registerRoutes(), [router]);
  const resolvedTransition = useMemo(
    () => transition || parentTransition,
    [transition, parentTransition],
  );

  useInitialLayout(() => {
    router.matchRoute(ID, onMatch);
  });

  return (
    <RoutesContext.Provider value={resolvedTransition}>
      {children}
    </RoutesContext.Provider>
  );
});

interface Props extends OptionalChildren {
  onMatch?: () => void;
  transition?: ITransitionName;
}
