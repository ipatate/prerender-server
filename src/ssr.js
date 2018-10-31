// @flow
import {addAsync} from './inject';
import initBrowser, {getResultByType} from './browser';
import {renderType} from './utils';
import {initCache} from './cache';

const TTL = +process.env.TTL || 5000;
// networkidle0 - consider navigation to be finished when there are no more than 0 network connections for at least 500 ms.
// networkidle2 - consider navigation to be finished when there are no more than 2 network connections for at least 500 ms.
const networkidle = process.env.networkidle || 'networkidle0';

// init the browser
const {getPage, filterPageRequest} = initBrowser();
// get function for verify type
const getRenderType = renderType();
// init cache system
const cache = initCache(TTL);

export async function ssr(url: string, renderType: string): Promise<string> {
  const type: string = getRenderType(renderType);
  const keyCache: string = `${url}${type}`;
  // if cache return
  const cacheUrl: ?string = cache.get(keyCache);
  if (cacheUrl !== undefined && cacheUrl !== null) {
    return cacheUrl;
  }
  // launch browser and get page
  const page = await getPage();
  // block request for image, css, media
  filterPageRequest(page);

  try {
    await page.goto(url, {waitUntil: networkidle});
  } catch (err) {
    throw err;
  }

  let result = await getResultByType(type, page);

  await page.close();

  // add async on script tags
  if (type === 'html') {
    result = addAsync(result);
  }
  cache.set(keyCache, result); // cache rendered page.

  return result;
}

export default ssr;
