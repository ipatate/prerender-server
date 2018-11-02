// @flow
import ping from 'ping';

export default (url: string): Promise<boolean> =>
  new Promise(resolve => ping.sys.probe(url, r => resolve(r)));
