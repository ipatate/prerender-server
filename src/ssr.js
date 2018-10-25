// @flow
const puppeteer = require('puppeteer');
const NodeCache = require('node-cache');

const ssrCache = new NodeCache({
  stdTTL: 5000,
});

const renderTypeOptions = ['html', 'jpeg', 'png', 'pdf'];

// verif if type is allowed
const getRenderType = (renderType: string): string => {
  let type = 'html';
  if (renderTypeOptions.indexOf(renderType) > -1) {
    type = renderType;
  }
  return type;
};

async function ssr(url: string, renderType: string): Promise<string> {
  const type = getRenderType(renderType);

  const keyCache = `${url}${type}`;
  // if cache return
  const cacheUrl = ssrCache.get(keyCache);
  if (cacheUrl !== undefined) {
    return cacheUrl;
  }
  // launch browser
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--headless',
      '--disable-gpu',
      '--remote-debugging-port=9222',
      '--hide-scrollbars',
      '--disable-setuid-sandbox',
    ],
  });
  // new page
  const page = await browser.newPage();
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
  await browser.close();

  ssrCache.set(keyCache, result); // cache rendered page.

  return result;
}

module.exports = ssr;
