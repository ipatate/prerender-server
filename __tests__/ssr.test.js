import {getRenderType} from '../src/ssr';

test('test getRenderType', () => {
  const type = ['html', 'jpeg', 'png', 'pdf'];
  expect(getRenderType('html', type)).toBe('html');
  expect(getRenderType('png', type)).toBe('png');
  expect(getRenderType('plop', type)).toBe('html');
});
