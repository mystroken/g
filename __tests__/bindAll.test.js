const bindAll = require('../bindAll');

const MAX = 25;

class Comparator {
  constructor() {
    bindAll(this, ['_loop']);
    this.num = MAX;
    this.max = MAX;
  }

  run() {
    [10, 15, 20].forEach(this._loop);
    return this.max;
  }

  _loop(x) {
    this.max = this._getMax(x);
  }

  _getMax(n) {
    return (n > this.num) ? n : this.num;
  }
}

test('Can bind context', () => {
  const c = new Comparator();
  expect(c.run()).toBe(MAX);
});
