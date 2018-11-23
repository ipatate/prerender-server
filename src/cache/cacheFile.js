// @flow
import fs from 'fs';
import fse from 'fs-extra';
import {getKeyCache} from '../utils/keyCache';

export class InitCache {
  cacheDir: string;
  constructor(cacheDir: string = `${__dirname}/../../cache-file`) {
    this.cacheDir = cacheDir;
  }
  getCachePath(url: string): string {
    return `${this.cacheDir}/${getKeyCache(url)}`;
  }
  get(url: string): ?string {
    const path = this.getCachePath(url);
    if (fs.existsSync(path)) {
      return fs.readFileSync(path, 'UTF-8');
    }
    return undefined;
  }
  set(url: string, result: string): void {
    fse.outputFileSync(this.getCachePath(url), result);
  }
}
