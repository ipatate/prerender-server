// @flow
import cheerio from 'cheerio';

/*
 * @param source String
 * inject async attribute in script tags
 */
export const addAsync = (source: string): string => {
  const $ = cheerio.load(source);
  $('script').each((e, v) => {
    if ($(v).attr('src') !== undefined) {
      $(v).attr('async', 'async');
    }
  });
  return $.html();
};
