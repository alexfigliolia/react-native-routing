import { memo, useContext, useMemo, useState } from "react";
import { Animated } from "react-native";
import {
  BaseContext,
  RouteContext,
  RouterContext,
  RoutesContext,
} from "Contexts";
import type { IRoute, IRouteState } from "Core";
import { RouteStack } from "Core";
import { useController, useUnmount } from "Hooks";
import { Controller } from "./Controller";
import { Styles } from "./Styles";

export const Route = memo(function Route(props: IRoute) {
  const base = useContext(BaseContext);
  const router = useContext(RouterContext);
  const transitionName = useContext(RoutesContext);

  const resolvedPath = useMemo(
    () => router.registerRoute(props, base),
    [router, props, base],
  );

  const [state, setState] = useState<IRouteState>(
    RouteStack.getState(props.prerender),
  );

  const controller = useController(new Controller(state, setState));

  controller.registerPath(resolvedPath);
  controller.setTransition(transitionName, state);

  useMemo(() => {
    controller.registerListener(router);
  }, [router, controller]);

  useUnmount(() => {
    controller.unmount(router);
  });

  if (!state || state === "registered") {
    return null;
  }

  const { Component, element } = props;
  const inactive = state === "inactive";
  return (
    <BaseContext.Provider value={resolvedPath}>
      <RouteContext.Provider value={controller.RouteContext}>
        <Animated.View
          aria-hidden={inactive}
          accessibilityElementsHidden={inactive}
          style={[
            Styles.container,
            inactive ? Styles.inactive : undefined,
            controller.styles,
          ]}>
          {Component ? <Component /> : element}
        </Animated.View>
      </RouteContext.Provider>
    </BaseContext.Provider>
  );
});
