const lerp = require('../lerp');

test('linear interpolation from 0 to 10 with fraction 1 equals 10', () => {
  expect(lerp(0, 10, 1)).toBe(10);
});
