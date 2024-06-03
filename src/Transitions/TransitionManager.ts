import type { IRouteState, RouteManager } from "Core";
import { Fade } from "./Fade";
import { NoopTransition } from "./NoopTransition";
import { SlideX } from "./SlideX";
import { SlideY } from "./SlideY";
import type { Transition } from "./Transition";
import type { ITransitionName } from "./types";

export class TransitionManager {
  Manager: RouteManager;
  Transition?: Transition;
  initialState?: IRouteState;
  transitionName?: ITransitionName;
  constructor(Manager: RouteManager) {
    this.Manager = Manager;
  }

  public setTransition(transition?: ITransitionName, state?: IRouteState) {
    if (transition === this.transitionName) {
      return;
    }
    this.transitionName = transition;
    const Transition = TransitionManager.get(this.transitionName);
    this.Transition = new Transition(this.Manager, state);
    this.Transition.subscribe();
  }

  public unmount() {
    if (this.Transition) {
      this.Transition.unsubscribe();
    }
  }

  public static get(name?: ITransitionName) {
    switch (name) {
      case "fade":
        return Fade;
      case "slide-x":
        return SlideX;
      case "slide-y":
        return SlideY;
      default:
        return NoopTransition;
    }
  }
}
