import { AutoIncrementingID } from "@figliolia/event-emitter";
import type { MatchTuple } from "./types";

export class Initializations {
  private storage = new Set<string>();
  private IDs = new AutoIncrementingID();
  public TrieCache: MatchTuple | null = null;

  public get length() {
    return this.storage.size;
  }

  public register() {
    const ID = this.IDs.get();
    this.storage.add(ID);
    return ID;
  }

  public cache(tuple: MatchTuple | null) {
    this.TrieCache = tuple;
    return tuple;
  }

  public postProcess(ID: undefined | string, callback: () => void) {
    void Promise.resolve().then(() => {
      if (ID) {
        this.storage.delete(ID);
      }
      if (this.length !== 0) {
        this.cache(null);
        return;
      }
      callback();
    });
  }
}
