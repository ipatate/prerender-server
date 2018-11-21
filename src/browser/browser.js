// @flow
import puppeteer from 'puppeteer';
import type {Browser, Page} from 'puppeteer';

// filter type request
const list = ['document', 'script', 'xhr', 'fetch'];

type OptionBrowser = {
  whitelist?: Array<string>,
  networkidle?: string,
};

const initBrowser = (options: OptionBrowser = {}): Object => {
  const requestWhitelist = options.whitelist || list;
  const networkidle = options.networkidle || 'networkidle0';

  let browserWSEndpoint = null;
  let page;

  // launch browser
  const launch = async (): Promise<Browser> =>
    await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--headless'],
    });

  // get new page
  const getNewPage = async (
    withFilterRequest: boolean = true,
  ): Promise<Page> => {
    if (!browserWSEndpoint) {
      const browserAlreadyStarted = await launch();
      browserWSEndpoint = await browserAlreadyStarted.wsEndpoint();
    }
    // flow show error with promise !!
    // $FlowFixMe
    const browser = await puppeteer.connect({
      browserWSEndpoint,
    });

    // new page
    page = await browser.newPage();
    // filter request
    if (withFilterRequest === true) {
      filterPageRequest();
    }

    return page;
  };

  // close page open
  const closePage = async (): Promise<void> => await page.close();

  // Intercept network requests.
  const filterPageRequest = async (): Promise<void> => {
    await page.setRequestInterception(true);
    page.on('request', req => {
      if (!requestWhitelist.includes(req.resourceType())) {
        return req.abort();
      }
      req.continue();
    });
  };

  // return page by type format
  const getPageByType = async (url: string, type: string): Promise<string> => {
    // start new page
    await getNewPage();

    try {
      await page.goto(url, {waitUntil: networkidle});
    } catch (err) {
      throw new Error(err.message);
    }

    const result = await getResultByType(type);

    await closePage();

    return result;
  };

  // get page format by type
  const getResultByType = async (type: string): Promise<string> => {
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

  return {
    getPageByType,
    getResultByType,
  };
};

export default initBrowser;
