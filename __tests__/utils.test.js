import {renderType} from '../src/utils';

test('test getRenderType', () => {
  const types = ['html', 'jpeg', 'png', 'pdf'];
  const getRenderType = renderType(types);

  expect(getRenderType('html', types)).toBe('html');
  expect(getRenderType('png', types)).toBe('png');
  // type not exist in list types
  expect(getRenderType('plop', types)).toBe('html');
});
