const Animate = require('../Animate');

test('Can animate object properties', (done) => {
  const counter = {
    value: 0
  };

  const anim = new Animate({ el: counter, d:10, p: { value: [0, 2] }, cb: () => {
      expect(counter.value).toBe(2);
      done();
    } });
  anim.play();
});
