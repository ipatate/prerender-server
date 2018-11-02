// @flow
import NodeCache from 'node-cache';

export const initCache = (TTL: ?number = 5000) => {
  const ssrCache = new NodeCache({
    stdTTL: TTL,
  });
  return {
    get: (keyCache: string): string => ssrCache.get(keyCache),
    set: (keyCache: string, result: string): string =>
      ssrCache.set(keyCache, result),
  };
};
