// @flow
import isUrl from 'is-url';

export const validateUrl = (url: string): boolean => isUrl(url);
