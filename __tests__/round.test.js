const round = require('../round');

test('should return expected round value', () => {
  expect(round(4.383, 1)).toBe(4.4);
});

test('should take 2 as default precision', () => {
  expect(round(4.383)).toBe(4.38);
});
