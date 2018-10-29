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

// launch browser
const launch = async (): puppeteer.Browser =>
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

// get page for navigate
export const getPage = async (): puppeteer.Page => {
  if (!browserWSEndpoint) {
    const browserAlreadyStarted = await launch();
    browserWSEndpoint = await browserAlreadyStarted.wsEndpoint();
  }
  const browser = await puppeteer.connect({browserWSEndpoint});
  // new page
  const page = await browser.newPage();

  return page;
};

const filterPageRequest = async (page: puppeteer.Page): Promise<void> => {
  // 1. Intercept network requests.
  await page.setRequestInterception(true);
  page.on('request', req => {
    const whitelist = ['document', 'script', 'xhr', 'fetch'];
    if (!whitelist.includes(req.resourceType())) {
      return req.abort();
    }
    req.continue();
  });
};

// get page format by type
const getResult = async (
  type: string,
  page: puppeteer.Page,
): Promise<string> => {
  switch (type) {
    case 'html':
      return await page.content();
    case 'png':
      return await page.screenshot({
        type,
        fullPage: true,
      });
    case 'jpeg':
      return await page.screenshot({
        type,
        fullPage: true,
      });
    case 'pdf':
      return await page.pdf();
    default:
      return await page.content();
  }
};

export async function ssr(url: string, renderType: string): Promise<string> {
  const type: string = getRenderType(renderType, renderTypeOptions);
  const keyCache: string = `${url}${type}`;
  // if cache return
  const cacheUrl: ?string = ssrCache.get(keyCache);
  if (cacheUrl !== undefined && cacheUrl !== null) {
    return cacheUrl;
  }
  // launch browser and get page
  const page = await getPage();
  filterPageRequest(page);
  try {
    await page.goto(url, {waitUntil: 'networkidle0'});
  } catch (err) {
    throw err;
  }

  const result = await getResult(type, page);

  await page.close();
  ssrCache.set(keyCache, result); // cache rendered page.

  return result;
}

export default ssr;
