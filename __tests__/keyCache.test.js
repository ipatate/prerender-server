import {getKeyCache, getUtc} from '../src/utils/keyCache';

test('key cache file from url', () => {
  const key = getKeyCache('http://www.exemple.com/test-key-from-url');
  expect(key).toBe('www-exemple-com/www-exemple-com-test-key-from-url.html');
});

test('key cache file from empty string', () => {
  const key = getKeyCache('');
  expect(key).toBe(`no-valid-url/${getUtc()}`);
});
