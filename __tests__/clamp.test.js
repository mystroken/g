const clamp = require('../clamp');

test('should clamp -10 between -5 and 5', () => {
  expect(clamp(-10, -5, 5)).toBe(-5);
});

test('correctly clamp 10 between -5 and 5)', () => {
  expect(clamp(10, -5, 5)).toBe(5);
});
