import { memo, useContext, useMemo, useState } from "react";
import { LocationContext, ParamsContext, RouterContext } from "Contexts";
import type { Router } from "Core";
import { useUnmount } from "Hooks";
import type { OptionalChildren } from "Types/React";

export const Navigation = memo(function Navigation({
  router,
  children,
}: Props) {
  const parentRouter = useContext(RouterContext);
  const Router = useMemo(() => router || parentRouter, [router, parentRouter]);

  const [path, setPath] = useState(Router.path);
  const [params, setParams] = useState(Router.params);

  const listener = useMemo(() => {
    Router.off("navigation", listener);
    return Router.on("navigation", ({ path, params }) => {
      setPath(path);
      setParams(params);
    });
  }, [Router]);

  useUnmount(() => {
    Router.off("navigation", listener);
  });

  return (
    <RouterContext.Provider value={Router}>
      <LocationContext.Provider value={path}>
        <ParamsContext.Provider value={params}>
          {children}
        </ParamsContext.Provider>
      </LocationContext.Provider>
    </RouterContext.Provider>
  );
});

interface Props extends OptionalChildren {
  router?: Router;
}
