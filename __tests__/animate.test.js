const animate = require('../a');

test('Can animate object properties', (done) => {
  const counter = { value: 0 };

  const anim = animate({
    el: counter,
    d:10,
    p: { value: [0, 2] },
    cb: () => {
      expect(counter.value).toBe(2);
      done();
    }
  });
  anim.play();
});
