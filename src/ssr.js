// @flow
import puppeteer from 'puppeteer';
import NodeCache from 'node-cache';

let browserWSEndpoint = null;

const ssrCache = new NodeCache({
  stdTTL: process.env.TTL || 5000,
});

const renderTypeOptions = ['html', 'jpeg', 'png', 'pdf'];

// verif if type is allowed
export const getRenderType = (
  renderType: string = '',
  options: Array<string>,
): string => {
  let type = 'html';
  if (options.indexOf(renderType) > -1) {
    type = renderType;
  }
  return type;
};

export const getBrowser = async () =>
  await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--headless',
      //   '--disable-gpu',
      //   '--remote-debugging-port=9222',
      //   '--hide-scrollbars',
      //   '--disable-setuid-sandbox',
    ],
  });

export async function ssr(url: string, renderType: string): Promise<string> {
  const type: string = getRenderType(renderType, renderTypeOptions);
  const keyCache: string = `${url}${type}`;
  // if cache return
  const cacheUrl: ?string = ssrCache.get(keyCache);
  if (cacheUrl !== undefined && cacheUrl !== null) {
    return cacheUrl;
  }
  if (!browserWSEndpoint) {
    const browserAlreadyStarted = await getBrowser();
    browserWSEndpoint = await browserAlreadyStarted.wsEndpoint();
  }
  // get browser
  const browser = await puppeteer.connect({browserWSEndpoint});

  // new page
  const page = await browser.newPage();

  // 1. Intercept network requests.
  await page.setRequestInterception(true);
  page.on('request', req => {
    // 2. Ignore requests for resources that don't produce DOM
    // (images, stylesheets, media).

    const whitelist = ['document', 'script', 'xhr', 'fetch'];
    if (!whitelist.includes(req.resourceType())) {
      return req.abort();
    }
    // 3. Pass through all other requests.
    req.continue();
  });

  try {
    // networkidle0 waits for the network to be idle (no requests for 500ms).
    // The page's JS has likely produced markup by this point, but wait longer
    // if your site lazy loads, etc.
    await page.goto(url, {waitUntil: 'networkidle0'});
  } catch (err) {
    throw err;
    // console.error(err);
  }

  let result = '';
  switch (type) {
    case 'html':
      result = await page.content();
      break;
    case 'png':
      result = await page.screenshot({
        type,
        fullPage: true,
      });
      break;
    case 'jpeg':
      result = await page.screenshot({
        type,
        fullPage: true,
      });
      break;
    case 'pdf':
      result = await page.pdf();
      break;
    default:
      result = await page.content();
      break;
  }
  await page.close();
  ssrCache.set(keyCache, result); // cache rendered page.

  return result;
}

export default ssr;
