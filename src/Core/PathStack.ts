import type { IndexedRoute } from "./types";

export class PathStack extends Array<IndexedRoute> {
  public override push(value: IndexedRoute) {
    if (value.depth === this.peek()?.depth) {
      this.pop();
    }
    return super.push(value);
  }

  public peek() {
    return this[this.length - 1];
  }
}
