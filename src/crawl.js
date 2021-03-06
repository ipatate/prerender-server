// @flow
import perfExecut from 'execution-time';
import {URL} from 'url';
import consola from 'consola';
import figures from 'figures';
import colors from 'colors';
import initBrowser from './browser/browser';
import {urlToRegex} from './utils/regex';
import {escapeString, findInString} from './utils/filter';
import {extensionRegex} from './utils/regex';
import {InitCache} from './cache/cacheFile';
import {InitCache as InitCacheMemory} from './cache/cacheMemory';

// for calulate time execution
const perf = perfExecut();

// color for console
const getColor = (time, su = 'ms') => {
  const timeRound = Math.round(time);
  if (timeRound < 3000) {
    return colors.green(time + su);
  } else if (timeRound < 5000) {
    return colors.yellow(time + su);
  } else {
    return colors.yellow(time + su);
  }
};

// page not visited
const noVisited: Set<string> = new Set();
// page visited
const alreadyVisited: Set<string> = new Set();

// escape url
const escapeForRegex = escapeString(urlToRegex());
const getHostSearch = host => new RegExp(`^${escapeForRegex(host)}`);

// find extension in string
const findExt = findInString(extensionRegex());

async function crawlWebsite(urlToFetch: string): Promise<void> {
  perf.start('site');
  // init cache system
  const cache = new InitCache();

  const {getNewPage, close} = initBrowser();
  // url base
  const url = new URL(urlToFetch);
  const rootUrl = url.protocol + '//' + url.host;
  const host = url.hostname;
  const protocol = url.protocol;
  // init cache system
  const cacheMemory = new InitCacheMemory(300);
  const hostSearch = getHostSearch(protocol + '//' + host);

  // find host in string func
  const findHost = findInString(hostSearch);

  async function scrap(urlPage: string): Promise<boolean> {
    perf.start('page');
    // open new page
    const page = await getNewPage(true, cacheMemory);

    try {
      // open page
      await page.goto(urlPage, {waitUntil: 'networkidle0'});
    } catch (e) {
      consola.error(e);
    }

    // catch all href link in page open
    const allHref = await page.evaluate(() => {
      // eslint-disable-next-line
      return Array.from(document.getElementsByTagName('a')).map(node => {
        return node.href;
      });
    });

    // filter all url for keep only url with hostname
    const filters = () =>
      allHref
        // keep only url from same domain
        .filter(a => findHost(a) === true)
        // remove all request for jpg, pdf, etc.
        .filter(a => findExt(a) === false)
        .map(e => {
          const u = new URL(e);
          // reconstruct clean url, remove hash, etc..
          return `${u.protocol}//${u.host}${u.pathname}${u.search}`.replace(
            /\/$/,
            '',
          );
        });

    // set link found in notVisited only if already not visited before
    filters().forEach(e => {
      if (alreadyVisited.has(e) === false) {
        noVisited.add(e);
      }
    });

    // get content page
    const content = await page.content();

    // save content page in file
    cache.set(urlPage, content);

    // add page visited
    alreadyVisited.add(urlPage);
    // remove page visited
    noVisited.delete(urlPage);
    // close page
    await page.close();

    const results = perf.stop('page');
    consola.success(
      `${colors.blue(urlPage)} visited ${figures.pointer} ${getColor(
        results.time.toFixed(2),
      )}`,
    );
    // noVisited not empty call new page or end
    if (noVisited.size > 0) {
      const nextUrl = noVisited.values().next().value;
      if (nextUrl) {
        return scrap(nextUrl);
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
  // first page open
  await scrap(rootUrl);
  await close(() => consola.info('close browser :)'));
  const results = perf.stop('site');
  consola.success(
    `${colors.green(
      `all url crawlable for ${rootUrl} visited ${figures.pointer}`,
    )} ${colors.rainbow(results.time.toFixed(2) + 'ms')}`,
  );
}

export default crawlWebsite;
