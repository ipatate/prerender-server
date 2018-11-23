// @flow
import {URL} from 'url';
import {cleanName} from './regex';
import {escapeString} from './filter';

export const getUtc = (): string =>
  new Date()
    .toJSON()
    .slice(0, 19)
    .replace(/:/g, '-');

export const getKeyCache = (
  urlPage: string,
  extension: string = '.html',
): string => {
  // escape for file name
  const escapeForFileName = escapeString(cleanName(), '-');
  let urlScrap;
  try {
    urlScrap = new URL(urlPage);
  } catch (e) {
    return `no-valid-url/${getUtc()}`;
  }
  // dir name
  const dirName = escapeForFileName(urlScrap.hostname);
  // format url for file name
  const fileName = escapeForFileName(
    `${dirName}${urlScrap.pathname}${urlScrap.search}`,
  );
  return `${dirName}/${fileName}${extension}`;
};
