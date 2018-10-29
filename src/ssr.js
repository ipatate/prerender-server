// @flow
import puppeteer from 'puppeteer';
import NodeCache from 'node-cache';

const TTL = process.env.TTL || 5000;
// networkidle0 - consider navigation to be finished when there are no more than 0 network connections for at least 500 ms.
// networkidle2 - consider navigation to be finished when there are no more than 2 network connections for at least 500 ms.
const networkidle = process.env.networkidle || 'networkidle2';
const browserArg = process.env.browserArg || `'--no-sandbox','--headless'`;

let browserWSEndpoint = null;

const ssrCache = new NodeCache({
  stdTTL: TTL,
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
    args: browserArg.split(','),
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
  //   const cacheUrl: ?string = ssrCache.get(keyCache);
  //   if (cacheUrl !== undefined && cacheUrl !== null) {
  //     return cacheUrl;
  //   }
  // launch browser and get page
  const page = await getPage();
  // block request for image, css, media
  filterPageRequest(page);

  try {
    await page.goto(url, {waitUntil: networkidle});
  } catch (err) {
    throw err;
  }

  const result = await getResult(type, page);

  await page.close();
  ssrCache.set(keyCache, result); // cache rendered page.

  return result;
}

export default ssr;
