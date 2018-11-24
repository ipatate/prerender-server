// @flow
// import ping from './utils/ping';
import {addAsync} from './utils/inject';
import {InitCache as InitCacheMemory} from './cache/cacheMemory';
import {InitCache as InitCacheFile} from './cache/cacheFile';
import {renderType} from './utils/renderType';
import {validateUrl} from './utils/validate';
import initBrowser from './browser/browser';

const TTL = +process.env.TTL || 5000;
// networkidle0 - consider navigation to be finished when there are no more than 0 network connections for at least 500 ms.
// networkidle2 - consider navigation to be finished when there are no more than 2 network connections for at least 500 ms.
const networkidle = process.env.networkidle || 'networkidle0';

// init the browser
const {getPageByType} = initBrowser({
  networkidle,
});
// get function for verify type
const getRenderType: Function = renderType();
// init cache system
const cacheMemory = new InitCacheMemory(TTL);
const cacheFile = new InitCacheFile();

export async function ssr(url: string, renderType: string): Promise<string> {
  if (validateUrl(url) !== true) {
    return Promise.resolve('Url is not valide, dont forget http://');
  }
  // bug on server :/
  //   const pingHost = await ping(url);
  //   if (pingHost === false) {
  //     return Promise.resolve('404 page not found');
  //   }

  const type: string = getRenderType(renderType);
  const keyCache: string = `${url}-${type}`;
  // if cache return
  let cacheUrl: ?string =
    type === 'html' ? cacheFile.get(url) : cacheMemory.get(keyCache);

  if (cacheUrl !== undefined && cacheUrl !== null) {
    return cacheUrl;
  }

  // get the page by format type
  let result = await getPageByType(url, type);

  // add async on script tags
  if (type === 'html' && result !== '') {
    result = addAsync(result);
  }

  if (type === 'html') {
    if (result !== '') cacheFile.set(keyCache, result); // cache rendered page.
  } else {
    if (result !== '') cacheMemory.set(url, result); // cache rendered page.
  }

  return result;
}

export default ssr;
