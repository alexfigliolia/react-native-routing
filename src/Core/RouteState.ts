import { RouteManager } from "./RouteManager";
import type { IRouteState, TransitionState } from "./types";

export class RouteState {
  public Manager = new RouteManager();
  public pendingState: TransitionState = null;

  public inProgress(state: IRouteState) {
    return this.pendingState === this.convert(state);
  }

  public nextState(state: IRouteState) {
    this.pendingState = this.convert(state);
  }

  private convert(state: IRouteState): TransitionState {
    if (state === "active") {
      return "entering";
    }
    return "exiting";
  }

  public readonly enter = async () => {
    if (this.pendingState === "entering") {
      await this.Manager.Emitter.emitConcurrent("enter", undefined);
      this.pendingState = null;
    }
  };

  public readonly exit = async () => {
    if (this.pendingState === "exiting") {
      await this.Manager.Emitter.emitConcurrent("exit", undefined);
      this.pendingState = null;
    }
  };
}
