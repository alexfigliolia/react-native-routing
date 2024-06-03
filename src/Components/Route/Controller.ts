import type { Dispatch } from "react";
import type { IRouteState, Router } from "Core";
import { RouteState } from "Core";
import type { ITransitionName } from "Transitions";
import { TransitionManager } from "Transitions";
import type { RegisteredTransition } from "./types";

export class Controller {
  private path = "";
  private listener?: string;
  private routeState: IRouteState;
  public State = new RouteState();
  private setState: Dispatch<IRouteState>;
  public Transitions = new TransitionManager(this.State.Manager);
  constructor(state: IRouteState, setState: Dispatch<IRouteState>) {
    this.routeState = state;
    this.setState = setState;
  }

  public get styles() {
    return this.Transitions.Transition?.styles;
  }

  public get RouteContext() {
    return this.State.Manager;
  }

  public setTransition(transition?: ITransitionName, state?: IRouteState) {
    return this.Transitions.setTransition(transition, state);
  }

  public registerPath(path: string) {
    this.path = path;
  }

  public registerListener(Router: Router) {
    this.unmount(Router);
    Router.on("navigation", this.onRouteChange);
  }

  public unmount(Router: Router) {
    if (this.listener) {
      Router.off("navigation", this.listener);
      this.listener = undefined;
    }
  }

  private readonly onRouteChange = (Router: Router) => {
    const nextState = Router.getRouteState(this.path);
    if (nextState === this.routeState || this.State.inProgress(nextState)) {
      return;
    }
    this.State.nextState(nextState);
    switch (nextState) {
      case "inactive":
      case "registered": {
        void this.deactivateRoute(nextState);
        break;
      }
      case "active": {
        void this.activateRoute(nextState);
        break;
      }
    }
    this.routeState = nextState;
  };

  private async activateRoute(nextState: IRouteState) {
    let enterFN: RegisteredTransition;
    if (this.routeState === "registered") {
      enterFN = this.enterAfterCallStack;
    } else {
      enterFN = this.State.enter;
    }
    this.setState(nextState);
    await enterFN();
  }

  private async deactivateRoute(nextState: IRouteState) {
    if (this.routeState === "active") {
      await this.State.exit();
    }
    return this.setState(nextState);
  }

  private readonly enterAfterCallStack = () => {
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        void this.State.enter().then(resolve);
      });
    });
  };
}
