// @flow
import NodeCache from 'node-cache';

export class InitCache {
  ssrCache: NodeCache;
  constructor(TTL: ?number = 5000) {
    this.ssrCache = new NodeCache({
      stdTTL: TTL,
    });
  }
  get(keyCache: string): string {
    return this.ssrCache.get(keyCache);
  }
  set(keyCache: string, result: string): string {
    return this.ssrCache.set(keyCache, result);
  }
}
