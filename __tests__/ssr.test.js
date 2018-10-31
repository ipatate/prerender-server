import {ssr} from '../src/ssr';
import {html} from '../test/__mocks__/puppeteer';

test('test ssr function with html', async () => {
  const result = await ssr('/', 'html');
  expect(result).toBe(html);
});

test('test ssr function with jpeg', async () => {
  const result = await ssr('/', 'jpeg');
  expect(result).toBe('picture');
});

test('test ssr function with pdf', async () => {
  const result = await ssr('/', 'pdf');
  expect(result).toBe('pdf');
});

test('test ssr function with no type arg', async () => {
  const result = await ssr('/');
  expect(result).toBe(html);
});
