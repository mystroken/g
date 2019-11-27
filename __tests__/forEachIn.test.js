import forEachIn from '../forEachIn';

test('can loop through array', () => {
  let acc = 0;
  const arr = [1,1,1];

  forEachIn(arr)(num => acc += num);
  expect(acc).toBe(3);
});
