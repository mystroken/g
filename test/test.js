'use strict';
// at top
const global = {};

import {assert} from 'chai';

import forEachIn from '../forEachIn';
import clamp from '../clamp';
import Raf from '../Raf';



describe('G Library', () => {

  // clamp
  describe('#clamp.js', () => {
    it('should clamp -10 between -5 and 5', () => {
      assert.equal(clamp(-10, -5, 5), -5);
    });

    it('correctly clamp 10 between -5 and 5)', () => {
      assert.equal(clamp(10, -5, 5), 5);
    });
  });

  // forEachIn
  describe('#forEachIn.js', () => {
    it('can loop through array', () => {
      let acc = 0;
      const arr = [1,1,1];

      forEachIn(arr)(num => acc += num);
      assert.equal(acc, 3);
    });
  });

  // Raf
  describe('#Raf.js', () => {

    global.requestAnimationFrame = (cb) => cb();
    it('Raf can run', (done) => {
      const raf = new Raf(() => done());
      raf.run();
    });

    it('running Raf can be stopped', (done) => {
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
  });

});
