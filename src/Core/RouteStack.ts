import type { IndexedRoute, IRoute, IRouteState } from "./types";

export class RouteStack {
  private stack = new Map<string, boolean>();
  private register = new Map<string, IRoute>();

  public isRegistered(path: string) {
    return this.register.has(path);
  }

  public static getState(prerender?: boolean): IRouteState {
    if (prerender) {
      return "inactive";
    }
    return "registered";
  }

  public getState(path: string): IRouteState {
    const isActive = this.isRegistered(path);
    if (!isActive) {
      return "registered";
    }
    if (this.isVisible(path)) {
      return "active";
    }
    return "inactive";
  }

  public isVisible(path: string) {
    return this.stack.get(path) === true;
  }

  public add(...routes: IndexedRoute[]) {
    this.hideAll();
    for (const { path, route } of routes) {
      if (!this.register.has(path)) {
        this.register.set(path, route);
      }
      this.stack.delete(path);
      this.stack.set(path, true);
    }
  }

  private hideAll() {
    for (const [path] of this.stack) {
      const route = this.register.get(path);
      if (route?.cache === false) {
        this.stack.delete(path);
        this.register.delete(path);
      } else {
        this.stack.set(path, false);
      }
    }
  }
}
