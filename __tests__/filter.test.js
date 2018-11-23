import {
  urlToRegex,
  extensionRegex,
  cleanName,
  tiersRegex,
} from '../src/utils/regex';
import {escapeString, findInString} from '../src/utils/filter';

test('prepare url for regex', () => {
  const escapeForRegex = escapeString(urlToRegex());
  const result = escapeForRegex('https://www.exemple.com');
  expect(result).toBe('https://www\\.exemple\\.com');
});

test('search hostname in url', () => {
  const escapeForRegex = escapeString(urlToRegex());
  const hostSearch = new RegExp(
    `^${escapeForRegex('https://www.goodmotion.fr')}`,
  );
  const findHost = findInString(hostSearch);
  expect(findHost('https://www.goodmotion.fr/mentions-legales')).toBeTruthy();

  expect(
    findHost('https://www.google.com/masuperurl/lol/2?dsdssds=dsdsdsd'),
  ).toBeFalsy();
});

test('search extension file', () => {
  const findExt = findInString(extensionRegex());

  expect(findExt('https://www.exemple.com/file.jpg')).toBeTruthy();
  expect(findExt('https://www.exemple.com/file.pdf')).toBeTruthy();

  expect(findExt('https://www.google.com/page.html')).toBeFalsy();
});

test('search name tiers service in url', () => {
  const findTier = findInString(tiersRegex());

  expect(
    findTier(
      'https://fonts.gstatic.com/s/poppins/v5/pxiEyp8kv8JHgFVrJJfecnFHGPc.woff2',
    ),
  ).toBeTruthy();
  expect(
    findTier('https://www.googletagmanager.com/gtag/js?id=XX-EEEEE-XX'),
  ).toBeTruthy();

  expect(findTier('https://www.exemple.com/page.html')).toBeFalsy();
});

test('clean string for name file', () => {
  const escapeForFileName = escapeString(cleanName(), '-');

  expect(escapeForFileName('www.exemple.com/file')).toBe(
    'www-exemple-com-file',
  );
  expect(escapeForFileName('starwars.goodmotion.fr/')).toBe(
    'starwars-goodmotion-fr-',
  );
});
