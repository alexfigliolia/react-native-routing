import type { Animated, StyleProp, ViewStyle } from "react-native";
import type { IRouteState, RouteManager } from "Core";

export abstract class Transition {
  private exitID?: string;
  private enterID?: string;
  protected state: IRouteState;
  protected readonly Manager: RouteManager;
  public abstract readonly animator: Animated.Value;
  public abstract readonly styles: StyleProp<ViewStyle>;
  constructor(Manager: RouteManager, initialState: IRouteState = "registered") {
    this.Manager = Manager;
    this.state = initialState;
  }

  public subscribe() {
    this.exitID = this.Manager.onExit(this.onExit.bind(this));
    this.enterID = this.Manager.onEnter(this.onEnter.bind(this));
  }

  public unsubscribe() {
    if (this.exitID) {
      this.Manager.offExit(this.exitID);
    }
    if (this.enterID) {
      this.Manager.offEnter(this.enterID);
    }
  }

  abstract onEnter(): void | Promise<any>;

  abstract onExit(): void | Promise<any>;
}
