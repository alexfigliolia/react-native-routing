import { PathStack } from "./PathStack";
import type { IndexedRoute, IRoute, MatchTuple } from "./types";

export class Trie {
  hasCatch = false;
  hasIndex = false;
  hasQuery: false | string = false;
  value: IndexedRoute | null = null;
  dictionary: Record<string, Trie> = {};

  public match(path: string): MatchTuple {
    const stack = new PathStack();
    const catches = new PathStack();
    const params: Record<string, string> = {};
    const [tokens] = this.split(path);
    return this.search("", stack, catches, params, this, tokens);
  }

  public search(...args: MatchTuple): MatchTuple {
    const [, stack, catches, params, _, tokens] = args;
    let [resolvedPath, , , , current] = args;
    const { length } = tokens;
    for (let i = 0; i < length; i++) {
      const token = tokens[i];
      if (!current.hasToken(token)) {
        const { hasQuery } = current;
        if (!hasQuery) {
          return [
            resolvedPath,
            stack,
            catches,
            params,
            current,
            tokens.slice(i),
          ];
        }
        resolvedPath += token;
        current = current.getToken(hasQuery);
        params[hasQuery.slice(1)] = token;
      } else {
        resolvedPath += token;
        current = current.getToken(token);
      }
      if (current.value) {
        stack.push(current.value);
      }
      if (current.hasCatch) {
        catches.push(current.getToken("*").value!);
      }
    }
    if (current.hasIndex) {
      stack.push(current.getToken("/").value!);
    }
    return [resolvedPath, stack, catches, params, current, []];
  }

  public index(path: string, route: IRoute) {
    let current: Trie = this;
    const [tokens, depth] = this.split(path);
    const maxIndex = tokens.length - 1;
    for (let i = 0; i <= maxIndex; i++) {
      const token = tokens[i];
      if (!current.hasToken(token)) {
        current.setToken(token);
      }
      if (token.startsWith(":")) {
        current.hasQuery = token;
      } else if (token === "*") {
        current.hasCatch = true;
      } else if (token === "/" && i === maxIndex) {
        current.hasIndex = true;
      }
      current = current.getToken(token);
    }
    current.value = { path, route, depth };
  }

  public getToken(token: string) {
    return this.dictionary[token];
  }

  public hasToken(token: string) {
    return token in this.dictionary;
  }

  public setToken(token: string) {
    this.dictionary[token] = new Trie();
  }

  private split(path: string): [tokens: string[], depth: number] {
    const tokens: string[] = [];
    const splits = path.split("/");
    for (const token of splits) {
      if (!token) {
        tokens.push("/");
      } else {
        tokens.push(token, "/");
      }
    }
    tokens.pop();
    return [tokens, splits.length - 1];
  }

  public pathDepth(path: string) {
    return path.split("/").length - 1;
  }
}
