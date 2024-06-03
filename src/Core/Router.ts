import { EventEmitter } from "@figliolia/event-emitter";
import { Initializations } from "./Initializations";
import type { PathStack } from "./PathStack";
import { RouteStack } from "./RouteStack";
import { Trie } from "./Trie";
import type { IRoute, MatchTuple, RouteStream } from "./types";

export class Router extends EventEmitter<RouteStream> {
  public path: string;
  private Trie = new Trie();
  private Stack = new RouteStack();
  public params: Record<string, string> = {};
  private Initializations = new Initializations();
  constructor(path = "/") {
    super();
    this.path = path;
  }

  public navigate(path: string) {
    this.path = this.clean(path);
    this.Initializations.cache(null);
    this.matchRoute();
  }

  public registerRoutes() {
    return this.Initializations.register();
  }

  public registerRoute(route: IRoute, base: string) {
    if (route.path[0] !== "/") {
      throw new Error("Route paths must begin with '/'");
    }
    const resolvedPath = this.resolvePath(route.path, base);
    this.Trie.index(resolvedPath, route);
    return resolvedPath;
  }

  public getRouteState(path: string) {
    return this.Stack.getState(path);
  }

  public matchRoute(ID?: string, onMatch?: () => void) {
    const target = this.path.slice();
    const { TrieCache } = this.Initializations;
    let match: MatchTuple;
    if (TrieCache) {
      match = this.Trie.search(...TrieCache);
    } else {
      match = this.Trie.match(target);
    }
    this.Initializations.cache(match);
    const [path, stack, catches, params] = match;
    this.params = params;
    if (stack.length) {
      this.nextStack(stack);
    } else {
      this.nextStack(this.applyCatch(stack, catches));
    }
    onMatch?.();
    this.Initializations.postProcess(ID, () => {
      if (target !== path) {
        this.nextStack(this.applyCatch(stack, catches));
      }
    });
  }

  private nextStack(stack: PathStack) {
    this.Stack.add(...stack);
    this.emit("navigation", this);
  }

  private applyCatch(stack: PathStack, catches: PathStack) {
    while (stack.peek()?.depth >= catches.peek()?.depth) {
      stack.pop();
    }
    stack.push(catches.peek());
    return stack;
  }

  private resolvePath(path: string, base: string) {
    if (base === "/") {
      return path;
    }
    return base + path;
  }

  private clean(path: string) {
    if (path === "/" || !path.endsWith("/")) {
      return path;
    }
    return path.slice(0, -1);
  }
}
