import Raf from '../Raf';

test('Raf can run', (done) => {
  const raf = new Raf(() => done());
  raf.run();
});

test('running Raf can be stopped', (done) => {
  let i = 0;
  const loop = elapsed => { i = elapsed; };
  const raf = new Raf(loop);
  raf.run();

  setInterval(() => {
    if (i >= 10) {
      raf.stop();
      done();
    }
  }, 100);
});
