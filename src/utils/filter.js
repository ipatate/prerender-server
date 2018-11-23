// @flow
/**
 * @description format url for regex
 * @param {RegExp} regex
 * @param {string} replaceBy
 */
export const escapeString = (
  regex: RegExp | string = '',
  replaceBy: string = '\\$1',
): Function => (str: string): string => str.replace(regex, replaceBy);

/**
 * @description find format in string
 * @param {RegExp} regex
 */
export const findInString = (regex: RegExp | string = ''): Function => (
  str: string,
): boolean => str.search(regex) > -1;
