// @flow
import fse from 'fs-extra';
import perfExecut from 'execution-time';
import {URL} from 'url';
import initBrowser from './browser/browser';
import {urlToRegex} from './utils/regex';
import {escapeString, findInString} from './utils/filter';
import {getKeyCache} from './utils/keyCache';
import {extensionRegex} from './utils/regex';

// for calulate time execution
const perf = perfExecut();

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
  const {getNewPage, close} = initBrowser();
  // url base
  const url = new URL(urlToFetch);
  const rootUrl = url.protocol + '//' + url.host;
  const host = url.hostname;
  const protocol = url.protocol;

  const hostSearch = getHostSearch(protocol + '//' + host);

  // find host in string func
  const findHost = findInString(hostSearch);

  async function scrap(urlPage: string): Promise<boolean> {
    perf.start('page');
    // open new page
    const page = await getNewPage();

    try {
      // open page
      await page.goto(urlPage, {waitUntil: 'networkidle0'});
    } catch (e) {
      console.log(e); // eslint-disable-line
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
    fse.outputFileSync(
      `${__dirname}/../cache/${getKeyCache(urlPage)}`,
      content,
    );

    // add page visited
    alreadyVisited.add(urlPage);
    // remove page visited
    noVisited.delete(urlPage);
    // close page
    await page.close();

    const results = perf.stop('page');
    console.log(`${urlPage} visited | ${results.time.toFixed(2)}ms`); // eslint-disable-line
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
  const results = perf.stop('site');
  console.log(`website ${rootUrl} visited in ${results.time.toFixed(2)}ms`); // eslint-disable-line
  close();
}

export default crawlWebsite;
