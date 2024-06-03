import { EventEmitter } from "@figliolia/event-emitter";
import type { ITransitionCallback, ITransitionEvents } from "./types";

export class RouteManager {
  public Emitter = new EventEmitter<ITransitionEvents>();

  public onEnter(callback: ITransitionCallback) {
    return this.Emitter.on("enter", callback);
  }

  public onExit(callback: ITransitionCallback) {
    return this.Emitter.on("exit", callback);
  }

  public offEnter(ID: string) {
    return this.Emitter.off("enter", ID);
  }

  public offExit(ID: string) {
    return this.Emitter.off("exit", ID);
  }
}
