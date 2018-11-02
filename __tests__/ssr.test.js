import {ssr} from '../src/ssr';
import {html} from '../test/__mocks__/puppeteer';

test('test ssr function with html', async () => {
  const result = await ssr('http://exemple.com', 'html');
  expect(result).toBe(html);
});

test('test ssr function with jpeg', async () => {
  const result = await ssr('http://exemple.com', 'jpeg');
  expect(result).toBe('picture');
});

test('test ssr function with pdf', async () => {
  const result = await ssr('http://exemple.com', 'pdf');
  expect(result).toBe('pdf');
});

test('test ssr function with no type arg', async () => {
  const result = await ssr('http://exemple.com');
  expect(result).toBe(html);
});

test('url not valid', async () => {
  const result = await ssr('exemple.com');
  expect(result).toBe('Url is not valide, dont forget http://');
});

test('url not exist', async () => {
  const result = await ssr('http://not-found.com');
  expect(result).toBe('404 page not found');
});
