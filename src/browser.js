// @flow
import puppeteer from 'puppeteer';

const initBrowser = (): Object => {
  let browserWSEndpoint = null;
  const launch = async (): puppeteer.Browser =>
    await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--headless'],
    });

  return {
    getPage: async (): puppeteer.Page => {
      if (!browserWSEndpoint) {
        const browserAlreadyStarted = await launch();
        browserWSEndpoint = await browserAlreadyStarted.wsEndpoint();
      }
      const browser = await puppeteer.connect({browserWSEndpoint});
      // new page
      const page = await browser.newPage();

      return page;
    },
    filterPageRequest: async (page: puppeteer.Page): Promise<void> => {
      // 1. Intercept network requests.
      await page.setRequestInterception(true);
      page.on('request', req => {
        const whitelist = ['document', 'script', 'xhr', 'fetch'];
        if (!whitelist.includes(req.resourceType())) {
          return req.abort();
        }
        req.continue();
      });
    },
  };
};

// get page format by type
export const getResultByType = async (
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

export default initBrowser;
