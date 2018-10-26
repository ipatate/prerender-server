import {getRenderType, ssr} from '../src/ssr';

test('test getRenderType', () => {
  const types = ['html', 'jpeg', 'png', 'pdf'];
  expect(getRenderType('html', types)).toBe('html');
  expect(getRenderType('png', types)).toBe('png');
  // type not exist in list types
  expect(getRenderType('plop', types)).toBe('html');
});

test('test ssr function with html', async () => {
  const result = await ssr('/', 'html');
  expect(result).toBe('<html><body></body></html>');
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
  expect(result).toBe('<html><body></body></html>');
});
